"use server";

import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";
import { validateContact } from "./validate";

const BUDGET_BANDS = ["< $1K", "$1–3K", "$3–8K", "$8K+"] as const;
type Budget = (typeof BUDGET_BANDS)[number];

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  brief: string;
  timeline?: string;
  budget?: string;
  /** Honeypot — a hidden input the real form never fills. */
  _gotcha?: string;
  /** Milliseconds from form mount to submit, measured in the browser. */
  elapsedMs?: number;
}

export async function submitContact(data: ContactSubmission): Promise<{ ok: boolean; error?: string }> {
  const ip = getClientIp(await headers());
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000); // 5 submissions / 10 min / IP
  if (!limit.ok) {
    return { ok: false, error: "rate_limited" };
  }

  /* `data` comes from a public POST, whatever the TypeScript type says. */
  const checked = validateContact(data);
  if (!checked.ok) return { ok: false, error: checked.error };
  /* Bot trap tripped: look like a success, store and email nothing. The
     visitor sees "sent" either way, so log the reason (no PII, no message)
     — it is the only way to notice a real person caught by a trap. */
  if (checked.spam) {
    console.warn(`[contact] bot trap tripped: ${checked.reason}`);
    return { ok: true };
  }
  const fields = checked.data;

  const payload = await getPayload();
  const budget = BUDGET_BANDS.includes(fields.budget as Budget) ? (fields.budget as Budget) : undefined;
  await payload.create({
    collection: "messages",
    data: {
      name: fields.name,
      email: fields.email,
      company: fields.company,
      brief: fields.brief,
      timeline: fields.timeline,
      budget,
    },
  });

  /* Notify the studio inbox. The record is already safely stored, so an
     email failure only logs — the client still sees "sent", and nothing
     is lost (worst case: read it from the dashboard). */
  try {
    await sendContactNotification({ ...fields, budget });
  } catch (err) {
    console.error("[contact] email notification failed:", err);
  }

  return { ok: true };
}
