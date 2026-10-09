/**
 * CONTACT VALIDATION — pure, no Next/Payload imports, so the server action
 * (actions.ts) and a plain table test can both run it.
 *
 * Server actions are public POST endpoints: the form's TypeScript types say
 * nothing about what a direct request actually sends, so every field is
 * re-checked here (string-only, trimmed, length-capped).
 */

/* Length caps — also used as maxLength in collections/Messages.ts. */
export const NAME_MAX = 200;
export const EMAIL_MAX = 254;
export const COMPANY_MAX = 200;
export const TIMELINE_MAX = 200;
export const BRIEF_MAX = 5000;

/** A human cannot fill the form faster than this. Faster = script. */
export const MIN_FILL_MS = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactFields {
  name: string;
  email: string;
  company?: string;
  brief: string;
  timeline?: string;
  budget?: string;
}

export type ContactCheck =
  /** Bot trap tripped: answer "sent" but store and email nothing. */
  | { ok: true; spam: true }
  | { ok: true; spam: false; data: ContactFields }
  | { ok: false; error: "invalid" };

/** Trimmed string within `max`; "" when blank; null when not a string or too long. */
function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v.length > max ? null : v;
}

/** Optional field: absent → undefined, blank → undefined, bad → null. */
function optional(value: unknown, max: number): string | undefined | null {
  if (value === undefined) return undefined;
  const v = text(value, max);
  return v === null ? null : v || undefined;
}

export function validateContact(input: unknown): ContactCheck {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, error: "invalid" };
  }
  const raw = input as Record<string, unknown>;

  /* Honeypot: the real form never fills `website` (a hidden input). The
     elapsed time is measured by the browser from mount to submit, not as a
     wall-clock timestamp, so a skewed device clock cannot drop a real
     message. Absent → not judged (an older cached page, or a bare POST that
     the honeypot and the checks below still have to get past). */
  const trap = raw.website;
  if (trap !== undefined && !(typeof trap === "string" && trap.trim() === "")) {
    return { ok: true, spam: true };
  }
  const elapsed = raw.elapsedMs;
  if (elapsed !== undefined && !(typeof elapsed === "number" && elapsed >= MIN_FILL_MS)) {
    return { ok: true, spam: true };
  }

  const name = text(raw.name, NAME_MAX);
  const email = text(raw.email, EMAIL_MAX);
  const brief = text(raw.brief, BRIEF_MAX);
  const company = optional(raw.company, COMPANY_MAX);
  const timeline = optional(raw.timeline, TIMELINE_MAX);
  /* Budget is checked against the allowed bands by the caller; here it
     only has to be a string. */
  const budget = raw.budget;

  if (
    !name ||
    !email ||
    !EMAIL_RE.test(email) ||
    !brief ||
    company === null ||
    timeline === null ||
    (budget !== undefined && typeof budget !== "string")
  ) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, spam: false, data: { name, email, company, brief, timeline, budget } };
}
