"use server";

/**
 * SESSION FEEDBACK — the only write path into `session-feedback`.
 *
 * Same contract as ./actions.ts (registration), trimmed to what feedback needs:
 *
 *   · a server action is a public POST — every value is re-validated here
 *     (validateFeedback, the same function the browser form ran), and the
 *     per-IP budget stops a script filling the cohort with junk;
 *   · the honeypot is checked before anything is stored, so bots cost nothing
 *     and get the same success a person would;
 *   · the database row is the source of truth — there is deliberately NO
 *     organiser email: thirty people answering within minutes would be thirty
 *     emails, and /studio/sessions is where the answers are read.
 *
 * The rate limit is far looser than registration's (6 per 10 min). Feedback is
 * submitted by the whole room at the same minute — often from one campus or
 * carrier address — so a tight per-IP cap would reject exactly the honest
 * traffic the form exists for. 40 per 10 minutes still stops a script.
 *
 * No re-submission rule: an anonymous answer has nothing to match on, so a
 * second submit is a second row. The form keeps the person from double-sending
 * (in-flight guard, and a timeout that says "do not send again").
 */

import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { DEFAULT_SESSION_KEY, isKnownSessionKey } from "./assessment";
import { validateFeedback, type FeedbackFieldErrors } from "./feedback";
import { collectAnswers } from "./validate";

export type FeedbackSubmitResult =
  | { ok: true }
  | { ok: false; error: "rate_limited" }
  | { ok: false; error: "storage_failed" }
  | { ok: false; error: "unknown_session" }
  | { ok: false; error: "invalid"; fields: FeedbackFieldErrors }
  | { ok: false; error: "spam" };

export async function submitSessionFeedback(formData: FormData): Promise<FeedbackSubmitResult> {
  const ip = getClientIp(await headers());
  const limit = rateLimit(`feedback:${ip}`, 40, 10 * 60 * 1000);
  if (!limit.ok) return { ok: false, error: "rate_limited" };

  const raw = collectAnswers(formData.entries());

  /* Same rule as registration: absent means an older page, default it; a value
     that is not a known session is a hand-built request and is refused rather
     than inventing a cohort the dashboard would never show. */
  const sentKey = raw.sessionKey;
  let sessionKey = DEFAULT_SESSION_KEY;
  if (sentKey !== undefined && sentKey !== "") {
    if (typeof sentKey !== "string" || !isKnownSessionKey(sentKey)) return { ok: false, error: "unknown_session" };
    sessionKey = sentKey;
  }

  const checked = validateFeedback(raw);
  if (!checked.ok) return { ok: false, error: "invalid", fields: checked.fields };
  if (checked.spam) {
    console.warn("[session-feedback] bot trap tripped: honeypot filled");
    return { ok: false, error: "spam" };
  }

  try {
    const payload = await getPayload();
    await payload.create({
      collection: "session-feedback",
      data: { ...checked.data, sessionKey, source: "form" } as never,
    });
    return { ok: true };
  } catch (error) {
    /* No answers in logs: a free-text answer is a person's words. */
    console.error("[session-feedback] could not be stored:", error instanceof Error ? error.name : "unknown");
    return { ok: false, error: "storage_failed" };
  }
}
