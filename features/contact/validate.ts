/**
 * CONTACT VALIDATION — pure, no Next/Payload imports, so the server action
 * (actions.ts), the form (contact-form.tsx, for maxLength/pattern) and a
 * plain table test can all import it.
 *
 * Server actions are public POST endpoints: the form's TypeScript types say
 * nothing about what a direct request actually sends, so every field is
 * re-checked here (string-only, trimmed, length-capped).
 */

/* Length caps — also used as maxLength in collections/Messages.ts and on the
   form's inputs, so the browser stops typing where the server would reject. */
export const NAME_MAX = 200;
export const EMAIL_MAX = 254;
export const COMPANY_MAX = 200;
export const TIMELINE_MAX = 200;
export const BRIEF_MAX = 5000;
/** Reserved room for bounded service/source/campaign context in the stored brief. */
export const MESSAGE_MAX = BRIEF_MAX + 1000;

/** Fill time is diagnostic only: autofill and assistive technology can be fast. */

/** Shared with app/api/resources/route.ts; the form uses its `.source` as the
 *  email input's `pattern`, because `type="email"` alone accepts `a@localhost`. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactFields {
  name: string;
  email: string;
  company?: string;
  brief: string;
  timeline?: string;
  budget?: string;
}

export type ContactCheck =
  /** Bot trap tripped: reject without storing or emailing. `reason` is for the server log only (no visitor data). */
  | { ok: true; spam: true; reason: "honeypot" }
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

  /* Only the honeypot can reject a rendered submission. Fast autofill is valid.
     The server action applies validation and per-IP rate limiting as well. */
  const trap = raw._gotcha;
  if (trap !== undefined && !(typeof trap === "string" && trap.trim() === "")) {
    return { ok: true, spam: true, reason: "honeypot" };
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
