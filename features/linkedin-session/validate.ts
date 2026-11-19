/**
 * SESSION REGISTRATION VALIDATION — pure, no Next/Payload imports.
 *
 * A server action is a public POST endpoint: the TypeScript signature says
 * nothing about what a direct request actually sends, so every field is
 * re-checked here (string-only, trimmed, capped) and every select is checked
 * against the option list in ./assessment.ts. A value the Postgres enum does
 * not contain fails at write time, not in the UI — the allowlist is what keeps
 * the form, the collection and the database on one vocabulary.
 *
 * Field errors are codes, not sentences: the form owns the copy (and its two
 * languages), this module owns the verdict.
 */

import { EMAIL_MAX, EMAIL_RE } from "@/features/contact/validate";
import {
  ANSWER_MAX,
  COLLEGE_MAX,
  CV_MAX_BYTES,
  FULL_NAME_MAX,
  INTEREST_MAX,
  LINKEDIN_URL_MAX,
  UNIVERSITY_MAX,
  optionValuesOf,
} from "./assessment";

export type FieldErrorCode =
  | "required"
  | "too_long"
  | "invalid_email"
  | "invalid_option"
  | "invalid_url"
  | "file_too_large"
  | "file_wrong_type";

export interface RegistrationData {
  fullName: string;
  email: string;
  college: string;
  university?: string;
  yearOfStudy: string;
  linkedinStatus: string;
  linkedinUrl?: string;
  /** Coded values from GOALS, de-duplicated and in the questionnaire's order. */
  goals: string[];
  appliedBefore?: string;
  cvStatus?: string;
  interestArea?: string;
  biggestChallenge?: string;
  questionForSession?: string;
}

/** What the form hands us about the chosen file — bytes never pass through here. */
export interface CvFileInfo {
  name: string;
  size: number;
  type: string;
}

export type RegistrationCheck =
  /** Bot trap tripped: reject silently, store nothing. */
  | { ok: true; spam: true; reason: "honeypot" }
  | { ok: true; spam: false; data: RegistrationData; hasCv: boolean }
  | { ok: false; error: "invalid"; fields: Partial<Record<keyof RegistrationData | "cvFile", FieldErrorCode>> };

/** Whitespace inside a single-line answer is collapsed; a pasted name with a newline in it is still one name. */
function line(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.replace(/\s+/g, " ").trim();
  return v.length > max ? null : v;
}

/** Multi-line answers keep their line breaks but lose padding and 3+ blank lines. */
function paragraph(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return v.length > max ? null : v;
}

/** absent → undefined, blank → undefined, wrong type/length → null. */
function optionalLine(value: unknown, max: number): string | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  const v = line(value, max);
  return v === null ? null : v || undefined;
}

function optionalParagraph(value: unknown, max: number): string | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  const v = paragraph(value, max);
  return v === null ? null : v || undefined;
}

/** Absent, null, or whitespace only — the question was not answered. */
function isBlank(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === "string" && !value.trim());
}

/**
 * A select's empty string means "skipped" for optional questions; a required
 * one means nothing was chosen. Anything else must be an allowed value — that
 * distinction matters twice: the form must say "أجب عن السؤال" rather than
 * "إجابة غير صالحة", and a value outside the list is what breaks a Postgres
 * enum at write time.
 */
/**
 * A multi-answer arrives as one value or many — FormData repeats the key per
 * checked box, and a hand-built request can send either. Every entry must be a
 * known option; the stored set is de-duplicated and put back in the order the
 * questionnaire lists them, so a person re-submitting the same choices twice
 * writes the same array (otherwise "which goals" diffs look like edits).
 */
function multiSelect(value: unknown, name: string): string[] | null {
  const entries = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  const allowed = optionValuesOf(name);
  const chosen = new Set<string>();
  for (const entry of entries) {
    if (typeof entry !== "string") return null;
    const v = entry.trim();
    if (!v) continue;
    if (!allowed.includes(v)) return null;
    chosen.add(v);
  }
  return [...allowed.filter((v) => chosen.has(v))];
}

function select(value: unknown, name: string, required: boolean): string | undefined | null {
  if (value === undefined || value === null) return required ? null : undefined;
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return required ? null : undefined;
  return optionValuesOf(name).includes(v) ? v : null;
}

/**
 * LinkedIn URLs arrive in three shapes: `https://linkedin.com/in/x`,
 * `linkedin.com/in/x`, and `www.linkedin.com/in/x?trackingId=…`. We normalise
 * the host and drop the query (a `trackingId` is noise, and a URL we store
 * should not carry someone's analytics parameters), and we refuse anything
 * that is not a LinkedIn profile — this field is otherwise an open redirect
 * that ends up rendered as a link in the console.
 */
export function normalizeLinkedInUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  /* A protocol-relative "//linkedin.com/…" is not a paste anyone means; we
     would be adding a scheme to it, and a stored link should be one the
     registrant wrote, in full. */
  if (value.startsWith("//")) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  /* userinfo in a pasted URL is never a profile link anyone meant to send. */
  if (url.username || url.password) return null;
  const host = url.hostname.toLowerCase();
  if (host !== "linkedin.com" && host !== "www.linkedin.com") return null;
  if (!/^\/in\/[^/]+\/?$/i.test(url.pathname)) return null;
  const path = url.pathname.replace(/\/+$/, "");
  return `https://www.linkedin.com${path}`;
}

/** PDF only, ≤ 5 MB, and it has to actually be a PDF the whole way through. */
export function validateCvFile(file: CvFileInfo | null | undefined): FieldErrorCode | null {
  if (!file) return null;
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!isPdf) return "file_wrong_type";
  if (!Number.isFinite(file.size) || file.size <= 0) return "file_wrong_type";
  if (file.size > CV_MAX_BYTES) return "file_too_large";
  return null;
}

export function validateRegistration(input: unknown, cv?: CvFileInfo | null): RegistrationCheck {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, error: "invalid", fields: {} };
  }
  const raw = input as Record<string, unknown>;

  const trap = raw._gotcha;
  if (trap !== undefined && !(typeof trap === "string" && trap.trim() === "")) {
    return { ok: true, spam: true, reason: "honeypot" };
  }

  const fields: Partial<Record<keyof RegistrationData | "cvFile", FieldErrorCode>> = {};

  const fullName = line(raw.fullName, FULL_NAME_MAX);
  if (fullName === null) fields.fullName = raw.fullName ? "too_long" : "required";
  else if (!fullName) fields.fullName = "required";

  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  if (!email) fields.email = "required";
  else if (email.length > EMAIL_MAX || !EMAIL_RE.test(email)) fields.email = "invalid_email";

  const college = line(raw.college, COLLEGE_MAX);
  /* line() returns null for both "too long" and "not a string" — a skipped
     question must read as أجب عن السؤال, never as a length complaint. */
  if (college === null) fields.college = raw.college ? "too_long" : "required";
  else if (!college) fields.college = "required";

  const yearOfStudy = select(raw.yearOfStudy, "yearOfStudy", true);
  if (yearOfStudy === null) fields.yearOfStudy = isBlank(raw.yearOfStudy) ? "required" : "invalid_option";

  const linkedinStatus = select(raw.linkedinStatus, "linkedinStatus", true);
  if (linkedinStatus === null) fields.linkedinStatus = isBlank(raw.linkedinStatus) ? "required" : "invalid_option";

  const goals = multiSelect(raw.goals, "goals");
  if (goals === null) fields.goals = "invalid_option";
  else if (goals.length === 0) fields.goals = "required";

  const university = optionalLine(raw.university, UNIVERSITY_MAX);
  if (university === null) fields.university = "too_long";

  const linkedinUrlRaw = typeof raw.linkedinUrl === "string" ? raw.linkedinUrl.trim() : "";
  let linkedinUrl: string | undefined;
  if (linkedinUrlRaw) {
    if (linkedinUrlRaw.length > LINKEDIN_URL_MAX) fields.linkedinUrl = "too_long";
    else {
      const normalized = normalizeLinkedInUrl(linkedinUrlRaw);
      if (!normalized) fields.linkedinUrl = "invalid_url";
      else linkedinUrl = normalized;
    }
  }

  const appliedBefore = select(raw.appliedBefore, "appliedBefore", false);
  if (appliedBefore === null) fields.appliedBefore = "invalid_option";

  const cvStatus = select(raw.cvStatus, "cvStatus", false);
  if (cvStatus === null) fields.cvStatus = "invalid_option";

  const interestArea = optionalLine(raw.interestArea, INTEREST_MAX);
  if (interestArea === null) fields.interestArea = "too_long";

  const biggestChallenge = optionalParagraph(raw.biggestChallenge, ANSWER_MAX);
  if (biggestChallenge === null) fields.biggestChallenge = "too_long";

  const questionForSession = optionalParagraph(raw.questionForSession, ANSWER_MAX);
  if (questionForSession === null) fields.questionForSession = "too_long";

  const cvError = validateCvFile(cv);
  if (cvError) fields.cvFile = cvError;

  if (Object.keys(fields).length > 0) return { ok: false, error: "invalid", fields };

  return {
    ok: true,
    spam: false,
    hasCv: Boolean(cv),
    data: {
      fullName: fullName!,
      email: email!,
      college: college!,
      university: university ?? undefined,
      yearOfStudy: yearOfStudy!,
      linkedinStatus: linkedinStatus!,
      linkedinUrl,
      goals: goals!,
      appliedBefore: appliedBefore ?? undefined,
      cvStatus: cvStatus ?? undefined,
      interestArea: interestArea ?? undefined,
      biggestChallenge: biggestChallenge ?? undefined,
      questionForSession: questionForSession ?? undefined,
    },
  };
}
