"use server";

import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";
import { validateContact } from "./validate";
import { deliverContact } from "@/lib/contact-delivery";
import { parseContactContext, contextSummary } from "@/lib/contact-context";
import { buildContactAttribution } from "@/lib/contact-attribution";

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
  service?: string;
  tier?: string;
  source?: string;
  locale?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export type ContactSubmissionResult =
  | { ok: true; notification: "sent" | "unconfigured" | "failed" }
  | { ok: false; error: string };

export async function submitContact(data: ContactSubmission): Promise<ContactSubmissionResult> {
  const ip = getClientIp(await headers());
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000); // 5 submissions / 10 min / IP
  if (!limit.ok) {
    return { ok: false, error: "rate_limited" };
  }

  /* `data` comes from a public POST, whatever the TypeScript type says. */
  const checked = validateContact(data);
  if (!checked.ok) return { ok: false, error: checked.error };
  /* Bot trap tripped: reject without storing or emailing. Log the reason (no PII, no message)
     — it is the only way to notice a real person caught by a trap. */
  if (checked.spam) {
    console.warn(`[contact] bot trap tripped: ${checked.reason}`);
    return { ok: false, error: "invalid" };
  }
  const fields = checked.data;

  const context = parseContactContext(data as unknown as Record<string, unknown>);
  const budget = BUDGET_BANDS.includes(fields.budget as Budget) ? (fields.budget as Budget) : undefined;
  const message = { ...fields, budget, ...buildContactAttribution(data as unknown as Record<string, unknown>), brief: `${contextSummary(context)}\n\nProject brief:\n${fields.brief}` };
  try {
    const payload = await getPayload();
    return await deliverContact(
      message,
      (record) => payload.create({ collection: "messages", data: record }),
      sendContactNotification,
      (event) => {
        // No email, brief or other visitor data in operational logs.
        if (event.notification === "sent") console.info("[contact] delivery", event);
        else console.error("[contact] notification needs attention", event);
      },
    );
  } catch {
    console.error("[contact] message could not be stored");
    return { ok: false, error: "storage_failed" };
  }
}
