import { type NextRequest, NextResponse } from "next/server";

/**
 * RESOURCE LEAD CAPTURE.
 * POST { email, resource? } → unlocks the Aboalazm OS resource downloads.
 *
 * Storage is optional and graceful:
 *  · If SANITY_WRITE_TOKEN is set, the lead is stored as a `resourceLead`
 *    document via the Sanity mutate API.
 *  · If not, the email is still validated and accepted so the gate works in
 *    every environment — swap in your ESP (Mailchimp/ConvertKit/Resend) here.
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

  const token = process.env.SANITY_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

  // Best-effort persistence. Never block the unlock on a storage failure.
  if (token && projectId) {
    try {
      await fetch(
        `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mutations: [
              {
                create: {
                  _type: "resourceLead",
                  email,
                  resource: body.resource ?? null,
                  source: "resources-page",
                  createdAt: new Date().toISOString(),
                },
              },
            ],
          }),
        },
      );
    } catch {
      // swallow — the user still gets their download
    }
  }

  return NextResponse.json({ ok: true });
}
