"use server";

/**
 * SESSION REGISTRATION — the only write path into `session-registrations`.
 *
 * Same contract the contact form established (features/contact/actions.ts),
 * because the reasons are the same:
 *
 *   · a server action is a public POST — every value is re-validated here,
 *     and the per-IP budget stops a script filling the cohort with junk;
 *   · the honeypot is checked before anything is stored, so bots cost nothing;
 *   · the database row is the source of truth and is written first; the
 *     organiser email is best-effort on top of it.
 *
 * One addition the contact form does not need: re-registration. A student who
 * signs up, then realises they picked the wrong goal, fills the form again —
 * and that must update their row, not create a second attendee. Email +
 * session is the natural key here (the collection has no unique index, so this
 * is a lookup, not a constraint: two devices racing can still produce two rows,
 * which the console can merge by hand. A partial unique index would need a
 * migration; the duplicate rate of one workshop form does not justify it).
 *
 * The CV is uploaded through Payload's Local API `file` option (a buffer, not
 * a temp path) into the admin-only `session-files` collection. If that upload
 * fails, the answers are still saved and the result says `cv: "failed"` — the
 * form tells the attendee to send it directly. Losing a whole registration over
 * a résumé is the wrong trade.
 */

import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendSessionRegistrationNotification } from "@/lib/email";
import { DEFAULT_SESSION_KEY, isKnownSessionKey, optionLabel } from "./assessment";
import { validateRegistration, type RegistrationData } from "./validate";

export type FieldErrors = Partial<Record<keyof RegistrationData | "cvFile", string>>;

export type SessionSubmitResult =
  | {
      ok: true;
      /** The attendee had already signed up for this session; their row was updated. */
      updated: boolean;
      cv: "stored" | "failed" | "skipped";
      notification: "sent" | "unconfigured" | "failed";
    }
  | { ok: false; error: "rate_limited" }
  | { ok: false; error: "storage_failed" }
  | { ok: false; error: "unknown_session" }
  /** Rejected quietly: a bot gets the same success it would have got anyway. */
  | { ok: false; error: "invalid"; fields: FieldErrors }
  | { ok: false; error: "spam" };

type PayloadLike = Awaited<ReturnType<typeof getPayload>>;

function fieldErrors(fields: FieldErrors): FieldErrors {
  return fields;
}

/**
 * FormData carries strings plus one File. The File is deliberately not turned
 * into a string for the validator: only its metadata is checked there, and the
 * bytes stay in the `File` until the upload call.
 */
function readForm(formData: FormData): { raw: Record<string, unknown>; file: File | null } {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "cvFile") continue;
    raw[key] = typeof value === "string" ? value : "";
  }
  const chosen = formData.get("cvFile");
  return { raw, file: chosen instanceof File && chosen.size > 0 ? chosen : null };
}

async function storeCv(payload: PayloadLike, file: File, email: string, sessionKey: string): Promise<number | null> {
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const doc = await payload.create({
      collection: "session-files",
      data: { owner: email, sessionKey },
      file: { data: bytes, name: file.name, mimetype: file.type || "application/pdf", size: file.size },
    });
    return doc.id;
  } catch (error) {
    /* No attendee data in logs — the filename alone is often a person's full name. */
    console.error("[session] CV upload failed:", error instanceof Error ? error.name : "unknown");
    return null;
  }
}

function notifyAnswers(data: RegistrationData, hasCv: boolean, sessionKey: string): Record<string, string> {
  return {
    Session: sessionKey,
    Name: data.fullName,
    Email: data.email,
    Faculty: data.college,
    University: data.university ?? "",
    "Year of study": optionLabel("yearOfStudy", data.yearOfStudy, "en"),
    "LinkedIn level": optionLabel("linkedinStatus", data.linkedinStatus, "en"),
    Profile: data.linkedinUrl ?? "",
    Goal: optionLabel("goal", data.goal, "en"),
    "Applied before": optionLabel("appliedBefore", data.appliedBefore, "en"),
    CV: hasCv ? "attached" : optionLabel("cvStatus", data.cvStatus, "en"),
    Interest: data.interestArea ?? "",
    "Hardest part": data.biggestChallenge ?? "",
    "Question for the session": data.questionForSession ?? "",
  };
}

export async function submitSessionRegistration(formData: FormData): Promise<SessionSubmitResult> {
  const ip = getClientIp(await headers());
  const limit = rateLimit(`session:${ip}`, 6, 10 * 60 * 1000); // 6 sign-ups / 10 min / IP
  if (!limit.ok) return { ok: false, error: "rate_limited" };

  const { raw, file } = readForm(formData);

  /* The hidden field decides which cohort a row belongs to. Absent means the
     form was served by an older build: default it. A value that is not a known
     session is a hand-built request, so it is refused rather than inventing a
     cohort the dashboard would never show. */
  const sentKey = raw.sessionKey;
  let sessionKey = DEFAULT_SESSION_KEY;
  if (sentKey !== undefined && sentKey !== "") {
    if (typeof sentKey !== "string" || !isKnownSessionKey(sentKey)) return { ok: false, error: "unknown_session" };
    sessionKey = sentKey;
  }

  const checked = validateRegistration(raw, file ? { name: file.name, size: file.size, type: file.type } : null);
  if (checked.ok && checked.spam) {
    console.warn("[session] bot trap tripped: honeypot filled");
    return { ok: false, error: "spam" };
  }
  if (!checked.ok) return { ok: false, error: "invalid", fields: fieldErrors(checked.fields) };

  const data = checked.data;

  let payload: PayloadLike;
  try {
    payload = await getPayload();
  } catch {
    return { ok: false, error: "storage_failed" };
  }

  /* A failed upload leaves cvFileId null and the answers are still saved. */
  const cvFileId = file ? await storeCv(payload, file, data.email, sessionKey) : null;

  try {
    return await saveAndNotify(payload, data, sessionKey, { hasCv: Boolean(file), cvFileId });
  } catch {
    console.error("[session] registration could not be stored");
    return { ok: false, error: "storage_failed" };
  }
}

/**
 * Save (or refresh) the row, then alert the organiser. `cv` carries whether a
 * file was chosen at all and whether it landed, so the attendee gets an honest
 * status instead of a silent "all good".
 */
async function saveAndNotify(
  payload: PayloadLike,
  data: RegistrationData,
  sessionKey: string,
  cv: { hasCv: boolean; cvFileId: number | null },
): Promise<SessionSubmitResult> {
  const existing = await payload.find({
    collection: "session-registrations",
    where: {
      and: [{ email: { equals: data.email } }, { sessionKey: { equals: sessionKey } }],
    },
    limit: 1,
    depth: 0,
  });
  const existingId = existing.docs[0]?.id;

  const record: Record<string, unknown> = {
    ...data,
    sessionKey,
    source: "form",
    /* An operator field, never the attendee's: an update must not silently
       reset a follow-up that was already worked. */
    ...(existingId ? {} : { followUp: "new", attendance: "registered" }),
    ...(cv.cvFileId ? { cvFile: cv.cvFileId } : {}),
  };

  if (existingId) await payload.update({ collection: "session-registrations", id: existingId, data: record as never });
  else await payload.create({ collection: "session-registrations", data: record as never });

  let notification: "sent" | "unconfigured" | "failed" = "unconfigured";
  try {
    notification = (await sendSessionRegistrationNotification({
      name: data.fullName,
      email: data.email,
      subjectLine: sessionKey,
      updated: Boolean(existingId),
      answers: notifyAnswers(data, cv.hasCv && Boolean(cv.cvFileId), sessionKey),
    }))
      ? "sent"
      : "unconfigured";
  } catch {
    notification = "failed";
  }

  return {
    ok: true,
    updated: Boolean(existingId),
    cv: !cv.hasCv ? "skipped" : cv.cvFileId ? "stored" : "failed",
    notification,
  };
}
