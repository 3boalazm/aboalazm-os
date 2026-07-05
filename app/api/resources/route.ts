import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "@/lib/payload";

/**
 * RESOURCE LEAD CAPTURE.
 * POST { email, resource? } → unlocks the Aboalazm OS resource downloads.
 * Persists to the `resource-leads` Payload collection. Never blocks the
 * unlock on a storage failure — the user still gets their download even
 * if the write fails.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: string; resource?: string };
  try {
    body = (await req.json()) as { email?: string; resource?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  try {
    const payload = await getPayload();
    await payload.create({
      collection: "resource-leads",
      data: { email, resource: body.resource, source: "resources-page" },
    });
  } catch {
    // swallow — the user still gets their download
  }

  return NextResponse.json({ ok: true });
}
