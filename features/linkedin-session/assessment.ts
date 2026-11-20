/**
 * LINKEDIN SESSION — the questionnaire, in one place.
 *
 * WHY THIS FILE EXISTS
 * The form, the Payload collection, the server action and the Studio console
 * all need the same question list and the same answer values. Written twice
 * they drift (an option the form offers but the database enum lacks fails at
 * write time — exactly the `messages.locale` defect recorded in
 * docs/studio/03_SCHEMA_FINDINGS.md). So the option arrays live here and
 * everyone else derives from them:
 *
 *   · features/linkedin-session/registration-form.tsx → renders FIELD_GROUPS
 *   · features/linkedin-session/validate.ts           → allowlists + length caps
 *   · collections/SessionRegistrations.ts             → `payloadOptions(slug)`
 *   · components/studio/sessions-view.tsx             → labels for the charts
 *
 * COPY: Arabic is the authored language (this audience signs up from an
 * Arabic post), English is the fallback for `/en`. It is deliberately
 * NOT added to lib/i18n.ts: that dictionary is the site's shared UI chrome,
 * and one campaign's questionnaire does not belong in it — same call the
 * `/book` page makes with its own local copy.
 *
 * Everything here is plain data and pure functions — no Next, no Payload — so
 * it is unit-testable (features/linkedin-session/assessment.test.ts) and safe
 * to import from a client component.
 */

export interface Bi {
  ar: string;
  en: string;
}

export interface FieldOption {
  value: string;
  label: Bi;
  hint?: Bi;
}

export type FieldType = "text" | "email" | "url" | "select" | "radio" | "multi" | "textarea" | "file";

export interface FieldDef {
  /** The Payload field name — this string is the form input name, the FormData key, the DB column's source name. */
  name: string;
  type: FieldType;
  label: Bi;
  help?: Bi;
  placeholder?: Bi;
  required: boolean;
  /** Enforced here, in the input's maxLength, and in the collection — one number, three places that must agree. */
  maxLength?: number;
  autoComplete?: string;
  options?: FieldOption[];
  /** radio/multi: "stack" reads as a ladder (levels), "grid" as a choice board (goals). */
  layout?: "stack" | "grid";
  /** file inputs only: accepted mime types, shown in the help line. */
  accept?: string;
  maxBytes?: number;
}

export interface FieldGroup {
  id: string;
  index: string;
  title: Bi;
  note?: Bi;
  fields: FieldDef[];
}

/* ── sessions ─────────────────────────────────────────────────────────────
   One `session-registrations` table serves every session we run, so the
   dashboard can scope itself to one cohort. Adding a session = adding an
   entry here (a text column, not an enum: no migration needed). */

export interface SessionDef {
  key: string;
  title: Bi;
  route: string;
}

export const SESSIONS: readonly SessionDef[] = [
  {
    key: "linkedin-2026",
    title: { ar: "سيشن LinkedIn", en: "LinkedIn session" },
    route: "/linkedin-session",
  },
] as const;

export const DEFAULT_SESSION_KEY = SESSIONS[0]!.key;

export function isKnownSessionKey(value: unknown): boolean {
  return typeof value === "string" && SESSIONS.some((s) => s.key === value);
}

export function sessionTitle(key: string): Bi {
  return SESSIONS.find((s) => s.key === key)?.title ?? { ar: key, en: key };
}

/* ── answer options ─────────────────────────────────────────────────────── */

/** "مستواك على LinkedIn" — the question that decides whether the session starts at zero. */
const LINKEDIN_STATUS: FieldOption[] = [
  {
    value: "active",
    label: { ar: "نعم وعندي حساب بستخدمه", en: "Yes, I have an account I use" },
    hint: { ar: "داخل عليه بشكل طبيعي", en: "You sign in without thinking about it" },
  },
  {
    value: "inactive",
    label: { ar: "نعم لكن مش بستخدمه بشكل فعّال", en: "Yes, but I don't use it effectively" },
    hint: { ar: "حساب موجود ونادرًا ما أفتحه", en: "It exists; I rarely open it" },
  },
  {
    value: "incomplete",
    label: { ar: "عندي حساب ولسه مش مكمله", en: "I have an account and it's unfinished" },
    hint: { ar: "ناقص صورة أو خبرات أو عنوان", en: "Missing photo, roles or headline" },
  },
  {
    value: "none",
    label: { ar: "لا معنديش حساب", en: "No, I don't have an account" },
    hint: { ar: "هبدأ من الصفر في السيشن", en: "We start from zero in the session" },
  },
];

/** أهم هدف — six answers, and they genuinely change what we prepare. */
const GOALS: FieldOption[] = [
  { value: "internship", label: { ar: "الحصول على فرص تدريب Internship", en: "Landing an internship" } },
  { value: "job-ready", label: { ar: "الاستعداد لسوق العمل والحصول على وظيفة", en: "Getting job-ready" } },
  { value: "networking", label: { ar: "بناء شبكة علاقات مهنية Networking", en: "Building a professional network" } },
  { value: "personal-brand", label: { ar: "بناء Personal Brand وإظهار خبراتي ومهاراتي", en: "Building a personal brand" } },
  { value: "freelance", label: { ar: "البحث عن فرص Freelance", en: "Finding freelance work" } },
  { value: "explore", label: { ar: "استكشاف مجالات مهنية جديدة", en: "Exploring career directions" } },
];

/** هل سبق التقديم أو التواصل مع شركات عن طريقه. */
const APPLIED_BEFORE: FieldOption[] = [
  { value: "often", label: { ar: "نعم بشكل متكرر", en: "Yes, regularly" } },
  { value: "tried", label: { ar: "جربت مرة أو مرتين", en: "I tried once or twice" } },
  { value: "never", label: { ar: "لا لسه معنديش خبرة", en: "No experience with it yet" } },
];

/** حالة الـ CV — يحدد هل نحتاج ربع ساعة مراجعة سيرة ذاتية داخل السيشن. */
const CV_STATUS: FieldOption[] = [
  { value: "ready", label: { ar: "نعم جاهز ومحدّث", en: "Yes — ready and up to date" } },
  { value: "needs-work", label: { ar: "نعم لكنه يحتاج إلى تطوير", en: "Yes, but it needs work" } },
  { value: "not-started", label: { ar: "لا لم أبدأ في إعداده", en: "No, I haven't started it" } },
];

/** السنة الدراسية — من يخرّج قريبًا له أولوية في خطة ما بعد السيشن. */
const YEAR_OF_STUDY: FieldOption[] = [
  { value: "year-1", label: { ar: "السنة الأولى", en: "1st year" } },
  { value: "year-2", label: { ar: "السنة التانية", en: "2nd year" } },
  { value: "year-3", label: { ar: "السنة التالتة", en: "3rd year" } },
  { value: "year-4", label: { ar: "السنة الرابعة", en: "4th year" } },
  { value: "year-5", label: { ar: "السنة الخامسة أو أكثر", en: "5th year or more" } },
  { value: "postgraduate", label: { ar: "دراسات عليا / ماجستير", en: "Postgraduate" } },
  { value: "fresh-grad", label: { ar: "حديث تخرج", en: "Recent graduate" } },
  { value: "other", label: { ar: "غير ذلك", en: "Other" } },
];

/**
 * CV upload. 5 MB is generous for a one-page PDF (they run ~200 KB) and small
 * enough that a free Vercel Blob account never blinks. PDF only: Payload
 * sniffs the file's real bytes, and a .docx is a zip container the sniffer
 * reports as `application/zip`, which Payload would reject as a mismatch —
 * so offering .docx would promise something the upload path cannot honour.
 */
export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_ACCEPT = ".pdf,application/pdf";

/* ── length caps ────────────────────────────────────────────────────────────
 * One number per field, used by the input (maxLength), the validator (rejects
 * longer) and the collection (maxLength on the column). Keep them identical. */
export const FULL_NAME_MAX = 120;
export const COLLEGE_MAX = 160;
export const UNIVERSITY_MAX = 160;
export const LINKEDIN_URL_MAX = 300;
export const INTEREST_MAX = 240;
export const ANSWER_MAX = 1000;

/* ── the form ─────────────────────────────────────────────────────────────── */

export const FIELD_GROUPS: readonly FieldGroup[] = [
  {
    id: "identity",
    index: "01",
    title: { ar: "البيانات الأساسية", en: "Your details" },
    note: { ar: "نحتاجهم للتواصل معك وإرسال مواد السيشن بعد انتهاءه.", en: "So we can reach you and send the follow-up material." },
    fields: [
      {
        name: "fullName",
        type: "text",
        label: { ar: "الاسم بالكامل", en: "Full name" },
        placeholder: { ar: "مثال: محمد مصطفى", en: "e.g. Mohamed Mostafa" },
        required: true,
        maxLength: FULL_NAME_MAX,
        autoComplete: "name",
      },
      {
        name: "email",
        type: "email",
        label: { ar: "البريد الإلكتروني", en: "Email" },
        help: { ar: "هيصلك عليه تأكيد التسجيل ومواد السيشن.", en: "Your confirmation and the session material go here." },
        placeholder: { ar: "you@example.com", en: "you@example.com" },
        required: true,
        autoComplete: "email",
      },
      {
        name: "college",
        type: "text",
        label: { ar: "الكلية / التخصص", en: "Faculty & major" },
        placeholder: { ar: "مثال: حاسبات ومعلومات — نظم معلومات", en: "e.g. Computers & AI — Information Systems" },
        required: true,
        maxLength: COLLEGE_MAX,
      },
      {
        name: "university",
        type: "text",
        label: { ar: "الجامعة (اختياري)", en: "University (optional)" },
        maxLength: UNIVERSITY_MAX,
        required: false,
        autoComplete: "organization",
      },
      {
        name: "yearOfStudy",
        type: "select",
        label: { ar: "السنة الدراسية", en: "Year of study" },
        required: true,
        options: YEAR_OF_STUDY,
      },
    ],
  },
  {
    id: "level",
    index: "02",
    title: { ar: "مستواك على LinkedIn", en: "Where you stand on LinkedIn" },
    note: { ar: "الإجابة دي هي اللي بتحدد هل نبدأ من إنشاء الحساب ولا من التطوير.", en: "This decides whether we start at account setup or at refinement." },
    fields: [
      {
        name: "linkedinStatus",
        type: "radio",
        label: { ar: "هل لديك حساب على LinkedIn؟", en: "Do you have a LinkedIn account?" },
        required: true,
        options: LINKEDIN_STATUS,
        layout: "stack",
      },
      {
        name: "linkedinUrl",
        type: "url",
        label: { ar: "رابط حساب LinkedIn (اختياري)", en: "LinkedIn profile link (optional)" },
        help: { ar: "لو شاركته، هنفتح بروفايلك ونشتغل عليه مباشرة أثناء السيشن.", en: "If you share it, we can look at your own profile live in the session." },
        placeholder: { ar: "linkedin.com/in/username", en: "linkedin.com/in/username" },
        required: false,
        maxLength: LINKEDIN_URL_MAX,
      },
    ],
  },
  {
    id: "goals",
    index: "03",
    title: { ar: "أهدافك المهنية", en: "What you want out of it" },
    note: { ar: "اختار كل هدف ينطبق عليك: السيشن بيتبنى على أكتر هدف متكرر في المجموعة.", en: "Choose every goal that fits you — the session is built around what this cohort repeats most." },
    fields: [
      {
        /* Multiple, not single: a third-year who wants an internship AND a
           stronger network is not choosing between them, and forcing it makes
           the chart lie about the room. The stored answer is the set. */
        name: "goals",
        type: "multi",
        label: { ar: "إيه الأهداف اللي عايز تحققها من استخدام LinkedIn؟", en: "Which goals do you want to reach with LinkedIn?" },
        help: { ar: "تقدر تختار أكتر من هدف.", en: "Choose every one that fits you." },
        required: true,
        options: GOALS,
        layout: "grid",
      },
      {
        name: "appliedBefore",
        type: "select",
        label: { ar: "هل سبق لك استخدام LinkedIn للتقديم على فرص أو التواصل مع الشركات؟", en: "Have you used LinkedIn to apply or reach out to companies?" },
        required: false,
        options: APPLIED_BEFORE,
      },
    ],
  },
  {
    id: "prep",
    index: "04",
    title: { ar: "الاستعداد للسيشن", en: "Getting ready for the session" },
    note: { ar: "الأسئلة المفتوحة دي أهم جزء في الفورم: دي اللي هنتكلم عنها.", en: "The open answers matter most here — they are what the session answers." },
    fields: [
      {
        name: "cvStatus",
        type: "select",
        label: { ar: "هل لديك CV حاليًا؟", en: "Do you have a CV today?" },
        required: false,
        options: CV_STATUS,
      },
      {
        name: "cvFile",
        type: "file",
        label: { ar: "رفع نسخة من الـ CV (اختياري)", en: "Upload a copy of your CV (optional)" },
        help: {
          ar: "PDF بحد أقصى 5 ميجابايت. الملف بيتخزن بشكل خاص ومش بيظهر لأي زائر.",
          en: "PDF up to 5 MB. Stored privately — never listed on the public site.",
        },
        required: false,
        accept: CV_ACCEPT,
        maxBytes: CV_MAX_BYTES,
      },
      {
        name: "interestArea",
        type: "text",
        label: { ar: "المجال/الوظيفة المهتم بها مستقبلًا", en: "The field or role you are aiming at" },
        placeholder: { ar: "مثال: Product Design / Data Analyst / Marketing", en: "e.g. Product Design / Data Analyst / Marketing" },
        required: false,
        maxLength: INTEREST_MAX,
      },
      {
        name: "biggestChallenge",
        type: "textarea",
        label: { ar: "أكثر شيء تواجه صعوبة فيه عند استخدام LinkedIn", en: "What you find hardest when using LinkedIn" },
        placeholder: {
          ar: "مثال: مش عارف أكتب الـ About، أو خايف أتبعت رسالة للشركات.",
          en: "e.g. I don't know what to write in the About section, or reaching out feels awkward.",
        },
        required: false,
        maxLength: ANSWER_MAX,
      },
      {
        name: "questionForSession",
        type: "textarea",
        label: { ar: "السؤال الذي تتمنى إجابته في السيشن", en: "The question you hope the session answers" },
        placeholder: { ar: "اكتب سؤالك كما هو بالظبط.", en: "Write the question exactly as it is in your head." },
        required: false,
        maxLength: ANSWER_MAX,
      },
    ],
  },
] as const;

export const ALL_FIELDS: readonly FieldDef[] = FIELD_GROUPS.flatMap((g) => g.fields);

/**
 * Should the browser's own `required` flag be set on this question's inputs?
 *
 * Everywhere except a "multi" answer, yes. HTML has no "at least one of these
 * checkboxes": `required` on a checkbox means THAT box must be ticked, so a
 * group where every box carries it cannot be submitted until every box is
 * ticked (a radio group is the opposite — one required radio makes the whole
 * group "pick one"). That is exactly what shipped on 19 Nov with the goals
 * question: someone who ticked four goals of six was blocked by the browser on
 * the other two, before any of our code ran, with no message we could show.
 *
 * "At least one" is checked by validate.ts instead — in the browser before the
 * request is sent, and again on the server.
 */
export function isNativelyRequired(field: FieldDef): boolean {
  return field.required && field.type !== "multi";
}

/**
 * The first question, in the order the page shows them, that has an error.
 * An error map is keyed in the order the validator checks things (which is not
 * the order of the page), so "where do I send the person?" cannot just take the
 * first key.
 */
export function firstFieldWithError(errors: Partial<Record<string, unknown>>): string | null {
  for (const field of ALL_FIELDS) if (errors[field.name]) return field.name;
  return null;
}

/* ── operator vocabulary ──────────────────────────────────────────────────
   Two questions the attendee never sees, but the console needs the same
   allowlist discipline for them as for the form's selects (both are Postgres
   enums). The registration form writes `registered`; everything above it is a
   human decision made in /studio/sessions. */

export const ATTENDANCE_OPTIONS: FieldOption[] = [
  { value: "registered", label: { ar: "مسجّل", en: "Registered" } },
  { value: "attended", label: { ar: "حضر", en: "Attended" } },
  { value: "no-show", label: { ar: "لم يحضر", en: "No-show" } },
];

export const FOLLOWUP_OPTIONS: FieldOption[] = [
  { value: "new", label: { ar: "جديد", en: "New" } },
  { value: "reviewed", label: { ar: "راجعت إجاباته", en: "Reviewed" } },
  { value: "replied", label: { ar: "تم الرد", en: "Replied" } },
  { value: "closed", label: { ar: "مغلق", en: "Closed" } },
];

const EXTRA_OPTIONS: Record<string, FieldOption[]> = {
  attendance: ATTENDANCE_OPTIONS,
  followUp: FOLLOWUP_OPTIONS,
};


const BY_NAME = new Map<string, FieldDef>(ALL_FIELDS.map((f) => [f.name, f]));

export function fieldDef(name: string): FieldDef | undefined {
  return BY_NAME.get(name);
}

export function fieldLabel(name: string, lang: keyof Bi, fallback = name): string {
  return BY_NAME.get(name)?.label[lang] ?? fallback;
}

export function optionsOf(name: string): FieldOption[] {
  return BY_NAME.get(name)?.options ?? EXTRA_OPTIONS[name] ?? [];
}

/** Options for one field, as Payload wants them (English labels — the admin/registry language). */
export function payloadOptions(name: string): { value: string; label: string }[] {
  return optionsOf(name).map((o) => ({ value: o.value, label: o.label.en }));
}

export function optionValuesOf(name: string): string[] {
  return optionsOf(name).map((o) => o.value);
}

export function optionLabel(name: string, value: string | null | undefined, lang: keyof Bi = "ar"): string {
  if (!value) return "—";
  const found = optionsOf(name).find((o) => o.value === value);
  return found ? found.label[lang] : value;
}

/**
 * The dashboard is Arabic; a raw `linked-2026` string on a chart is not an
 * answer. Rows the registrant left blank are counted as "لم يُجب" so the
 * chart's total equals the cohort size instead of quietly hiding blanks.
 */
export const UNANSWERED: Bi = { ar: "لم يُجب", en: "Not answered" };
