import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "@/lib/payload";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { RESOURCES } from "@/lib/resources";
import { EMAIL_MAX, EMAIL_RE } from "@/features/contact/validate";

/**
 * RESOURCE LEAD CAPTURE.
 * POST { email, resource? } → unlocks the Aboalazm OS resource downloads.
 * Persists to the `resource-leads` Payload collection. Never blocks the
 * unlock on a storage failure — the user still gets their download even
 * if the write fails. Protection is validation plus the per-IP limit only
 * (no bot trap); see the note on the contact form's traps in
 * features/contact/validate.ts.
 */

const RESOURCE_IDS = new Set(RESOURCES.map((r) => r.id));

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`resources:${ip}`, 5, 10 * 60 * 1000); // 5 unlocks / 10 min / IP
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { email?: unknown; resource?: unknown; intent?: unknown };
  try {
    const json: unknown = await req.json();
    body = typeof json === "object" && json !== null ? json : {};
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  /* The body is untrusted JSON: only strings of a sane length get through,
     and `resource` must be one of the ids in lib/resources.ts. */
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const resource = body.resource;
  if (
    resource !== undefined &&
    (typeof resource !== "string" || !RESOURCE_IDS.has(resource))
  ) {
    return NextResponse.json({ ok: false, error: "invalid_resource" }, { status: 422 });
  }

  const intent = ["learning", "project", "team", "unspecified"].includes(String(body.intent)) ? String(body.intent) : "unspecified";
  let leadSaved = false;
  try {
    const payload = await getPayload();
    await payload.create({
      collection: "resource-leads",
      data: { email, resource, source: `resources-page|intent:${intent}` },
    });
    leadSaved = true;
  } catch (err) {
    // Never block the unlock — the user still gets their download.
    console.error("[resources] lead write failed:", err);
  }

  return NextResponse.json({ ok: true, leadSaved });
}
