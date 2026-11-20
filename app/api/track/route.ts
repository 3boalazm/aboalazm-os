import { type NextRequest, NextResponse } from "next/server";
import { insertAnalyticsEvent } from "@/lib/analytics-store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { parseEventPayload } from "@/lib/analytics-events";

/**
 * FIRST-PARTY ANALYTICS INGEST (P2).
 *
 * POST one event from lib/analytics.ts (fetch keepalive or sendBeacon) →
 * validate against the privacy contract in lib/analytics-events.ts → store
 * in the `analytics_events` table (the `analytics-events` collection) with a
 * single INSERT from lib/analytics-store.ts.
 *
 * This route must not import Payload. It runs once per page view, and loading
 * the CMS in a cold instance cost ~250 ms of CPU to store a ten-field row
 * (lib/cpu-guard.test.ts fails the build if the import comes back).
 *
 * Design constraints, in order:
 *   1. Analytics must never break or slow the visitor's action. Every
 *      failure path returns quietly; the client wraps the send in
 *      try/catch and `keepalive`, and nothing here is awaited by a form.
 *   2. The public internet can reach this route, so the body is treated
 *      as hostile: allowlisted event names, sanitized paths/props,
 *      host-only referrers, bot user-agents refused, per-IP rate limit.
 *      The collection's own REST create stays admin-only, so this route
 *      (with its sanitizer) is the only public write path.
 *   3. No IP, no user-agent string, no fingerprint is stored. The IP is
 *      used for the in-memory rate-limit bucket and then discarded; the
 *      UA is reduced to a coarse device class at ingest.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`track:${ip}`, 120, 60 * 1000); // generous: a busy reader, not a firehose
  if (!limit.ok) return new NextResponse(null, { status: 429 });

  let body: unknown;
  try {
    // sendBeacon delivers text/plain; fetch delivers application/json.
    // Reading text and parsing covers both without content-type branching.
    const text = await req.text();
    body = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = parseEventPayload(body, req.headers.get("user-agent"));
  if (!parsed.ok) {
    // Bots get the same quiet refusal as bad input — there is nothing to
    // learn from distinguishing them to the sender.
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 422 });
  }

  try {
    await insertAnalyticsEvent(parsed.record);
  } catch (error) {
    // Storage failing must look identical to storage working. The event is
    // lost; the visitor's click is not. The Studio System screen probes
    // this collection, so a silent write failure surfaces there instead.
    // Only the error code is logged (a database message can quote row values).
    const code = (error as { code?: unknown } | null)?.code;
    console.error("[track] event write failed", typeof code === "string" ? code : (error as Error | null)?.name);
  }

  return new NextResponse(null, { status: 204 });
}
