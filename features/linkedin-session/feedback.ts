/**
 * LINKEDIN SESSION — the after-session feedback form, in one place.
 *
 * Same contract as ./assessment.ts (which is the BEFORE form): the questions,
 * their answer values and their length caps live here once, and everyone else
 * derives from them —
 *
 *   · features/linkedin-session/feedback-form.tsx → renders FEEDBACK_GROUPS
 *   · collections/SessionFeedback.ts              → `feedbackPayloadOptions(name)`
 *   · lib/studio/feedback.ts                      → labels + the averages
 *   · components/studio/sessions-view.tsx         → the "after the session" block
 *
 * Plain data and pure functions only — no Next, no Payload — so it is unit
 * tested (feedback.test.ts) and safe to import from a client component.
 *
 * WHAT THE FORM IS FOR
 * Three things the studio can act on, not a satisfaction poll:
 *   1. did the room get more confident (confidence before → after, 1–5),
 *   2. which part earned its minutes (mostUseful) and what to cut (improve),
 *   3. what each person will do first (nextStep) — the follow-up list.
 * It is anonymous by default. A name and a LinkedIn link are optional, and a name is
 * required only if the person lets us quote them (allowQuote).
 *
 * COPY: Arabic is authored, English is the `/en` twin — same call as the
 * registration form, and deliberately not in lib/i18n.ts.
 */

import { ANSWER_MAX, FULL_NAME_MAX, LINKEDIN_URL_MAX, type Bi, type FieldOption } from "./assessment";
import { normalizeLinkedInUrl } from "./validate";

export type FeedbackFieldType = "radio" | "scale" | "multi" | "textarea" | "text" | "url" | "checkbox";

export interface FeedbackFieldDef {
  /** The Payload field name = the form input name = the FormData key. */
  name: string;
  type: FeedbackFieldType;
  label: Bi;
  help?: Bi;
  placeholder?: Bi;
  required: boolean;
  maxLength?: number;
  options?: FieldOption[];
  /** scale only: what 1 and what 5 mean, shown under the row. */
  low?: Bi;
  high?: Bi;
  autoComplete?: string;
}

export interface FeedbackGroup {
  id: string;
  index: string;
  title: Bi;
  note?: Bi;
  fields: FeedbackFieldDef[];
}

/* ── answer options ─────────────────────────────────────────────────────── */

/** 1–5 stored as numbers; the option list is what validation allows. */
const SCALE: FieldOption[] = ["1", "2", "3", "4", "5"].map((n) => ({ value: n, label: { ar: n, en: n } }));

const PACE: FieldOption[] = [
  { value: "too-fast", label: { ar: "سريعة شوية — فاتتني حاجات", en: "A bit fast — I missed things" } },
  { value: "right", label: { ar: "مظبوطة", en: "About right" } },
  { value: "too-slow", label: { ar: "بطيئة — كنت عايز أسرع", en: "Slow — I wanted to go faster" } },
];

const RECOMMEND: FieldOption[] = [
  { value: "yes", label: { ar: "أكيد", en: "Definitely" } },
  { value: "maybe", label: { ar: "ممكن", en: "Maybe" } },
  { value: "no", label: { ar: "لأ", en: "No" } },
];

/** The parts of the session, in the order they were delivered. */
const MOST_USEFUL: FieldOption[] = [
  { value: "profile", label: { ar: "تظبيط البروفايل (الـ Headline والـ About)", en: "Fixing the profile (headline and About)" } },
  { value: "networking", label: { ar: "التواصل مع الخريجين والرسايل الجاهزة", en: "Reaching alumni, and the ready-made messages" } },
  { value: "content", label: { ar: "كتابة البوستات", en: "Writing posts" } },
  { value: "opportunities", label: { ar: "البحث عن تدريب وJob Alert", en: "Finding internships and Job Alerts" } },
  { value: "scams", label: { ar: "علامات النصب في الوظايف", en: "Spotting job scams" } },
  { value: "demos", label: { ar: "الديموهات اللايف على LinkedIn", en: "The live demos on LinkedIn" } },
  { value: "practice", label: { ar: "وقت التطبيق", en: "The hands-on practice time" } },
];

const NEXT_STEP: FieldOption[] = [
  { value: "account", label: { ar: "أعمل الحساب (لسه معنديش)", en: "Create my account (I don't have one yet)" } },
  { value: "photo", label: { ar: "أظبط الصورة والبانر", en: "Fix my photo and banner" } },
  { value: "headline", label: { ar: "أكتب الـ Headline", en: "Write my headline" } },
  { value: "about", label: { ar: "أكتب الـ About", en: "Write my About section" } },
  { value: "connect", label: { ar: "أبعت أول Connection لخريج", en: "Send my first connection to an alum" } },
  { value: "post", label: { ar: "أنشر أول بوست", en: "Publish my first post" } },
  { value: "job-alert", label: { ar: "أعمل Job Alert", en: "Set up a Job Alert" } },
];

/* ── the form ───────────────────────────────────────────────────────────── */

export const FEEDBACK_GROUPS: readonly FeedbackGroup[] = [
  {
    id: "overall",
    index: "01",
    title: { ar: "رأيك في السيشن", en: "How was it" },
    note: { ar: "دقيقة واحدة. من غير اسم لو تحب، ومفيش إجابات صح وغلط.", en: "One minute. Anonymous if you like — there are no right answers." },
    fields: [
      {
        name: "rating",
        type: "scale",
        label: { ar: "تقييمك العام للسيشن", en: "Your overall rating" },
        required: true,
        options: SCALE,
        low: { ar: "ضعيفة", en: "Poor" },
        high: { ar: "ممتازة", en: "Excellent" },
      },
      {
        name: "pace",
        type: "radio",
        label: { ar: "سرعة السيشن كانت…", en: "The pace was…" },
        required: true,
        options: PACE,
      },
      {
        name: "recommend",
        type: "radio",
        label: { ar: "هترشح السيشن دي لزميل؟", en: "Would you recommend it to a classmate?" },
        required: true,
        options: RECOMMEND,
      },
    ],
  },
  {
    id: "value",
    index: "02",
    title: { ar: "إيه اللي استفدته", en: "What you got out of it" },
    note: { ar: "الإجابات دي هي اللي بتحدد إيه اللي نزوّده وإيه اللي نشيله في المرة الجاية.", en: "These decide what we add and what we cut next time." },
    fields: [
      {
        name: "confidenceBefore",
        type: "scale",
        label: { ar: "قبل السيشن: كنت واثق قد إيه إنك تبني بروفايل LinkedIn كويس؟", en: "Before the session: how sure were you that you could build a good LinkedIn profile?" },
        required: true,
        options: SCALE,
        low: { ar: "مش واثق خالص", en: "Not at all" },
        high: { ar: "واثق جدًا", en: "Very sure" },
      },
      {
        name: "confidenceAfter",
        type: "scale",
        label: { ar: "دلوقتي: واثق قد إيه؟", en: "Now: how sure are you?" },
        required: true,
        options: SCALE,
        low: { ar: "مش واثق خالص", en: "Not at all" },
        high: { ar: "واثق جدًا", en: "Very sure" },
      },
      {
        name: "mostUseful",
        type: "multi",
        label: { ar: "أنهي أجزاء كانت الأكتر فايدة ليك؟", en: "Which parts helped you most?" },
        help: { ar: "اختار كل اللي ينطبق.", en: "Choose every one that fits." },
        required: true,
        options: MOST_USEFUL,
      },
      {
        name: "nextStep",
        type: "radio",
        label: { ar: "أول خطوة هتعملها النهارده؟", en: "The first thing you'll do today?" },
        required: true,
        options: NEXT_STEP,
      },
    ],
  },
  {
    id: "open",
    index: "03",
    title: { ar: "بكلامك انت", en: "In your own words" },
    note: { ar: "كلها اختيارية، بس دي أهم جزء بالنسبة لنا.", en: "All optional — but this is the part we read first." },
    fields: [
      {
        name: "bestPart",
        type: "textarea",
        label: { ar: "إيه أكتر حاجة عجبتك؟", en: "What worked best?" },
        required: false,
        maxLength: ANSWER_MAX,
      },
      {
        name: "improve",
        type: "textarea",
        label: { ar: "إيه اللي كان ممكن يتحسّن؟", en: "What could be better?" },
        required: false,
        maxLength: ANSWER_MAX,
      },
      {
        name: "nextTopic",
        type: "textarea",
        label: { ar: "إيه الموضوع اللي نفسك نعمله في سيشن جاية؟", en: "What should the next session cover?" },
        required: false,
        maxLength: ANSWER_MAX,
      },
    ],
  },
  {
    id: "who",
    index: "04",
    title: { ar: "لو عايز نتواصل معاك", en: "If you want us to follow up" },
    note: { ar: "اختياري بالكامل. من غير اسم، الإجابات بتتحسب من غير ما نعرف صاحبها.", en: "Fully optional. Without a name your answers still count — we just won't know whose they are." },
    fields: [
      {
        name: "fullName",
        type: "text",
        label: { ar: "الاسم", en: "Name" },
        required: false,
        maxLength: FULL_NAME_MAX,
        autoComplete: "name",
      },
      {
        name: "linkedinUrl",
        type: "url",
        label: { ar: "رابط حسابك على LinkedIn", en: "Your LinkedIn profile link" },
        help: { ar: "لو كتبته هنربط رأيك بتسجيلك، ونتواصل معاك على LinkedIn.", en: "If you add it we match this to your sign-up and reach you on LinkedIn." },
        placeholder: { ar: "linkedin.com/in/username", en: "linkedin.com/in/username" },
        required: false,
        maxLength: LINKEDIN_URL_MAX,
      },
      {
        name: "allowQuote",
        type: "checkbox",
        label: { ar: "أسمح بعرض رأيي باسمي كشهادة عن السيشن", en: "You may quote me by name as a testimonial" },
        help: { ar: "محتاج تكتب اسمك فوق.", en: "Needs your name above." },
        required: false,
      },
    ],
  },
];

export const ALL_FEEDBACK_FIELDS: readonly FeedbackFieldDef[] = FEEDBACK_GROUPS.flatMap((g) => g.fields);

/* ── option helpers (same shape as assessment.ts's) ─────────────────────── */

export function feedbackField(name: string): FeedbackFieldDef | undefined {
  return ALL_FEEDBACK_FIELDS.find((f) => f.name === name);
}

export function feedbackOptionValues(name: string): string[] {
  return (feedbackField(name)?.options ?? []).map((o) => o.value);
}

export function feedbackPayloadOptions(name: string): { value: string; label: string }[] {
  return (feedbackField(name)?.options ?? []).map((o) => ({ value: o.value, label: o.label.en }));
}

export function feedbackOptionLabel(name: string, value: string | null | undefined, lang: keyof Bi = "ar"): string {
  if (!value) return "—";
  return feedbackField(name)?.options?.find((o) => o.value === value)?.label[lang] ?? value;
}

/** A multi / required-choice question cannot use the browser's `required` — see isNativelyRequired in assessment.ts. */
export function isFeedbackNativelyRequired(field: FeedbackFieldDef): boolean {
  return field.required && (field.type === "radio" || field.type === "scale" || field.type === "text" || field.type === "url" || field.type === "textarea");
}

/** First field with an error, in page order (not validator order) — where the form scrolls to. */
export function firstFeedbackFieldWithError(errors: Partial<Record<string, unknown>>): string | null {
  return ALL_FEEDBACK_FIELDS.find((f) => errors[f.name])?.name ?? null;
}

/* ── validation ─────────────────────────────────────────────────────────── */

export type FeedbackErrorCode = "required" | "too_long" | "invalid_url" | "invalid_option" | "needs_name";

export interface FeedbackData {
  rating: number;
  pace: string;
  recommend: string;
  confidenceBefore: number;
  confidenceAfter: number;
  /** De-duplicated, in the questionnaire's order. */
  mostUseful: string[];
  nextStep: string;
  bestPart?: string;
  improve?: string;
  nextTopic?: string;
  fullName?: string;
  linkedinUrl?: string;
  allowQuote: boolean;
}

export type FeedbackFieldErrors = Partial<Record<keyof FeedbackData, FeedbackErrorCode>>;

export type FeedbackCheck =
  /** Honeypot filled: drop silently, store nothing. */
  | { ok: true; spam: true }
  | { ok: true; spam: false; data: FeedbackData }
  | { ok: false; error: "invalid"; fields: FeedbackFieldErrors };

function blank(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === "string" && !value.trim());
}

function choice(value: unknown, name: string): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return feedbackOptionValues(name).includes(v) ? v : null;
}

function paragraph(value: unknown, max: number): string | undefined | null {
  if (blank(value)) return undefined;
  if (typeof value !== "string") return null;
  const v = value.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return v.length > max ? null : v || undefined;
}

function oneLine(value: unknown, max: number): string | undefined | null {
  if (blank(value)) return undefined;
  if (typeof value !== "string") return null;
  const v = value.replace(/\s+/g, " ").trim();
  return v.length > max ? null : v || undefined;
}

function multi(value: unknown, name: string): string[] | null {
  const entries = Array.isArray(value) ? value : blank(value) ? [] : [value];
  const allowed = feedbackOptionValues(name);
  const chosen = new Set<string>();
  for (const entry of entries) {
    if (typeof entry !== "string") return null;
    const v = entry.trim();
    if (!v) continue;
    if (!allowed.includes(v)) return null;
    chosen.add(v);
  }
  return allowed.filter((v) => chosen.has(v));
}

export function validateFeedback(input: unknown): FeedbackCheck {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, error: "invalid", fields: {} };
  }
  const raw = input as Record<string, unknown>;

  const trap = raw._gotcha;
  if (trap !== undefined && !(typeof trap === "string" && trap.trim() === "")) return { ok: true, spam: true };

  const fields: FeedbackFieldErrors = {};

  /** A required choice: empty → "required", present but not in the list → "invalid_option". */
  const required = <K extends "pace" | "recommend" | "nextStep">(name: K): string | undefined => {
    const v = choice(raw[name], name);
    if (v === null) fields[name] = blank(raw[name]) ? "required" : "invalid_option";
    return v ?? undefined;
  };
  const scale = <K extends "rating" | "confidenceBefore" | "confidenceAfter">(name: K): number | undefined => {
    const v = choice(raw[name], name);
    if (v === null) fields[name] = blank(raw[name]) ? "required" : "invalid_option";
    return v === null ? undefined : Number(v);
  };

  const rating = scale("rating");
  const pace = required("pace");
  const recommend = required("recommend");
  const confidenceBefore = scale("confidenceBefore");
  const confidenceAfter = scale("confidenceAfter");
  const nextStep = required("nextStep");

  const mostUseful = multi(raw.mostUseful, "mostUseful");
  if (mostUseful === null) fields.mostUseful = "invalid_option";
  else if (mostUseful.length === 0) fields.mostUseful = "required";

  const bestPart = paragraph(raw.bestPart, ANSWER_MAX);
  if (bestPart === null) fields.bestPart = "too_long";
  const improve = paragraph(raw.improve, ANSWER_MAX);
  if (improve === null) fields.improve = "too_long";
  const nextTopic = paragraph(raw.nextTopic, ANSWER_MAX);
  if (nextTopic === null) fields.nextTopic = "too_long";

  const fullName = oneLine(raw.fullName, FULL_NAME_MAX);
  if (fullName === null) fields.fullName = "too_long";

  let linkedinUrl: string | undefined;
  if (!blank(raw.linkedinUrl)) {
    const v = typeof raw.linkedinUrl === "string" ? raw.linkedinUrl.trim() : "";
    if (v.length > LINKEDIN_URL_MAX) fields.linkedinUrl = "too_long";
    else {
      /* The registration form's normaliser: https://www.linkedin.com/in/<handle>, query dropped. */
      const normalized = v ? normalizeLinkedInUrl(v) : null;
      if (!normalized) fields.linkedinUrl = "invalid_url";
      else linkedinUrl = normalized;
    }
  }

  /* A checkbox arrives as "on"/"yes"/"true" when ticked and not at all when not. */
  const allowQuote = typeof raw.allowQuote === "string" && ["on", "yes", "true", "1"].includes(raw.allowQuote.trim().toLowerCase());
  if (allowQuote && !fullName) fields.fullName = fields.fullName ?? "needs_name";

  if (Object.keys(fields).length > 0) return { ok: false, error: "invalid", fields };

  return {
    ok: true,
    spam: false,
    data: {
      rating: rating!,
      pace: pace!,
      recommend: recommend!,
      confidenceBefore: confidenceBefore!,
      confidenceAfter: confidenceAfter!,
      mostUseful: mostUseful!,
      nextStep: nextStep!,
      bestPart: bestPart ?? undefined,
      improve: improve ?? undefined,
      nextTopic: nextTopic ?? undefined,
      fullName: fullName ?? undefined,
      linkedinUrl,
      allowQuote,
    },
  };
}

/* ── certificate name ───────────────────────────────────────────────────── */

export type CertificateNameCheck = { ok: true; name: string } | { ok: false; error: "required" | "too_long" | "invalid" };

/**
 * The name printed on a certificate. One line, letters in any script plus
 * spaces and the few marks real names carry (. ' - ’); no digits, no markup,
 * no control characters — it ends up in a CSV and on a PDF.
 */
export function validateCertificateName(input: unknown): CertificateNameCheck {
  if (typeof input !== "string") return { ok: false, error: "required" };
  const name = input.replace(/\s+/g, " ").trim();
  if (!name) return { ok: false, error: "required" };
  if (name.length > FULL_NAME_MAX) return { ok: false, error: "too_long" };
  if (name.length < 2 || !/^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u.test(name)) return { ok: false, error: "invalid" };
  return { ok: true, name };
}
