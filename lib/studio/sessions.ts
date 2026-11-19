import type { Payload } from "payload";
import type { StudioUser } from "@/lib/studio/auth";
import { UNANSWERED, optionLabel, optionsOf } from "@/features/linkedin-session/assessment";

/**
 * STUDIO SESSIONS — قراءة لوحة ما قبل السيشن (`session-registrations`).
 *
 * القاعدة نفسها في metrics.ts: لا رقم بلا مصدر. كل عدد هنا معدود من صفوف
 * موجودة، وكل توزيع يجمع على حقل له قائمة خيارات معرّفة في
 * features/linkedin-session/assessment.ts — نفس القائمة التي يبني منها الفورم
 * أسئلته ويولّد منها Payload أرقامه (enums)، فلا يوجد احتمال أن يرسم اللوحة
 * تجميعة لا يعرفها الحقل.
 *
 * تقسيم العمل:
 *   · كل ما هو استعلام = دوال async في هذا الملف (overrideAccess: false دائمًا،
 *     اللوحة لا تتجاوز صلاحية المستخدم أبدًا).
 *   · كل ما هو حساب = دوال نقية (buildSessionReport / registrationCsv) يمكن
 *     اختبارها بدون قاعدة بيانات — lib/studio/sessions.test.ts.
 */

export interface SessionRegistrationRow {
  id: string | number;
  fullName: string;
  email: string;
  college?: string | null;
  university?: string | null;
  yearOfStudy?: string | null;
  interestArea?: string | null;
  linkedinStatus?: string | null;
  linkedinUrl?: string | null;
  goal?: string | null;
  appliedBefore?: string | null;
  cvStatus?: string | null;
  cvFile?: number | string | { id: number; url?: string | null; filename?: string | null } | null;
  biggestChallenge?: string | null;
  questionForSession?: string | null;
  followUp?: string | null;
  attendance?: string | null;
  sessionKey?: string | null;
  source?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** الحقول التي تملك قائمة خيارات في assessment.ts فتُجمع بأسمائها العربية. */
export const GROUPED_SELECTS = ["yearOfStudy", "linkedinStatus", "goal", "cvStatus", "appliedBefore", "attendance", "followUp"] as const;
/** حقلان نصيان حُرّان يحتاجان تجميعًا بالنص نفسه. */
export const GROUPED_TEXTS = ["college", "interestArea"] as const;

type Ctx = { payload: Payload; user: StudioUser };

const BLANK = "—";

export async function allRegistrations({ payload, user }: Ctx, sessionKey?: string | null): Promise<SessionRegistrationRow[]> {
  const res = await payload.find({
    collection: "session-registrations",
    where: sessionKey ? { sessionKey: { equals: sessionKey } } : undefined,
    sort: "-createdAt",
    limit: 0,
    pagination: false,
    depth: 1, // يكفي لملف السيرة الذاتية (cvFile → {id, url, filename})
    overrideAccess: false,
    user: user as never,
  });
  return res.docs as SessionRegistrationRow[];
}

/** مفاتيح الجلسات الموجودة فعلًا — اللوحة تتنقل بينها بدل أن نفترضها. */
export async function sessionKeys({ payload, user }: Ctx): Promise<{ key: string; rows: number }[]> {
  const res = await payload.find({
    collection: "session-registrations",
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user: user as never,
    select: { sessionKey: true },
  });
  const counts = new Map<string, number>();
  for (const doc of res.docs as { sessionKey?: string | null }[]) {
    const key = doc.sessionKey?.trim() || BLANK;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([key, rows]) => ({ key, rows })).sort((a, b) => b.rows - a.rows || a.key.localeCompare(b.key));
}

/* ── تجميع نقي ─────────────────────────────────────────────────────────── */

export interface Dist {
  key: string;
  label: string;
  value: number;
  /** نسبة من كل المسجلين — لا من أعلى شريط، حتى لا يقرأ أحد الرسم كمقارنة خاطئة. */
  pct: number;
}

/** النص الحر قبل المقارنة: حروف صغيرة، بلا ترقيم، ومسافة واحدة. */
function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function labelFor(field: string, key: string): string {
  if (key === "") return UNANSWERED.ar;
  if (optionsOf(field).length > 0) return optionLabel(field, key, "ar");
  return key;
}

function distribution(rows: SessionRegistrationRow[], field: keyof SessionRegistrationRow, limit?: number): Dist[] {
  const total = Math.max(1, rows.length);
  const counts = new Map<string, number>();
  for (const row of rows) {
    const raw = row[field];
    /* الأرقام والفراغ counted as "لم يُجب": a chart must add up to the cohort. */
    const key = typeof raw === "string" ? raw.trim() : "";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const list = [...counts.entries()]
    .map(([key, value]) => ({ key, label: labelFor(String(field), key), value, pct: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "ar"));
  if (!limit) return list;
  const head = list.slice(0, limit);
  const rest = list.slice(limit);
  if (rest.length) {
    const otherValue = rest.reduce((sum, d) => sum + d.value, 0);
    head.push({ key: "__other__", label: `أخرى (${rest.length})`, value: otherValue, pct: Math.round((otherValue / total) * 100) });
  }
  return head;
}

export interface AnswerLine {
  text: string;
  count: number;
  /** أسماء من كتبوا نفس الجملة حرفيًا تقريبًا — مكتفية كي يعرف المحاضر مع من يتابع. */
  names: string[];
}

/**
 * الإجابات المفتوحة لا تُعدّ، بل تُقرأ. التجميع هنا بالنص المطبع (لا بدلالة
 * ولا بموديل): نفس الجملة بأحرف مختلفة تظهر مرة واحدة بعددها.
 */
function answerLines(rows: SessionRegistrationRow[], field: "biggestChallenge" | "questionForSession" | "interestArea"): AnswerLine[] {
  const groups = new Map<string, AnswerLine>();
  for (const row of rows) {
    const raw = typeof row[field] === "string" ? (row[field] as string).trim() : "";
    if (!raw) continue;
    const key = normalizeText(raw).slice(0, 120) || raw.toLowerCase();
    const found = groups.get(key);
    if (found) {
      found.count += 1;
      if (row.fullName && found.names.length < 6 && !found.names.includes(row.fullName)) found.names.push(row.fullName);
      continue;
    }
    groups.set(key, { text: raw.replace(/\s*\n\s*/g, " · "), count: 1, names: row.fullName ? [row.fullName] : [] });
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, "ar"));
}

export interface SessionReport {
  total: number;
  asOf: string;
  /** توزيعات جاهزة للرسم، لكل حقل في GROUPED_SELECTS + الكلية/الاهتمام. */
  dists: Record<string, Dist[]>;
  /** من لا يملك حسابًا أو حسابه غير مكتمل — هؤلاء يحتاجون أول 20 دقيقة. */
  needsAccount: number;
  activeAccounts: number;
  withCvFile: number;
  cvReady: number;
  cvNeedsWork: number;
  cvNotStarted: number;
  /** من كتب إجابة مفتوحة واحدة على الأقل. */
  withOpenAnswer: number;
  unreviewed: number;
  challenges: AnswerLine[];
  questions: AnswerLine[];
  interests: AnswerLine[];
}

export function buildSessionReport(rows: SessionRegistrationRow[]): SessionReport {
  const countWhere = (test: (row: SessionRegistrationRow) => boolean) => rows.filter(test).length;
  const hasCv = (row: SessionRegistrationRow) => row.cvFile != null && row.cvFile !== "";

  const dists: Record<string, Dist[]> = {};
  for (const field of GROUPED_SELECTS) dists[field] = distribution(rows, field);
  for (const field of GROUPED_TEXTS) dists[field] = distribution(rows, field, 8);

  return {
    total: rows.length,
    asOf: new Date().toISOString(),
    dists,
    needsAccount: countWhere((r) => r.linkedinStatus === "none" || r.linkedinStatus === "incomplete"),
    activeAccounts: countWhere((r) => r.linkedinStatus === "active"),
    withCvFile: countWhere(hasCv),
    cvReady: countWhere((r) => r.cvStatus === "ready"),
    cvNeedsWork: countWhere((r) => r.cvStatus === "needs-work"),
    cvNotStarted: countWhere((r) => r.cvStatus === "not-started"),
    withOpenAnswer: countWhere((r) => Boolean(r.biggestChallenge?.trim() || r.questionForSession?.trim())),
    unreviewed: countWhere((r) => (r.followUp ?? "new") === "new"),
    challenges: answerLines(rows, "biggestChallenge"),
    questions: answerLines(rows, "questionForSession"),
    interests: answerLines(rows, "interestArea"),
  };
}

/* ── تصدير CSV ───────────────────────────────────────────────────────────── */

export const CSV_COLUMNS = [
  "fullName",
  "email",
  "college",
  "university",
  "yearOfStudy",
  "linkedinStatus",
  "linkedinUrl",
  "goal",
  "appliedBefore",
  "cvStatus",
  "hasCvFile",
  "interestArea",
  "biggestChallenge",
  "questionForSession",
  "attendance",
  "followUp",
  "notes",
  "sessionKey",
  "createdAt",
] as const;

function csvCell(value: unknown): string {
  if (value == null) return "";
  const text = String(value).replace(/\s*\n\s*/g, " ");
  // صيغة جدول = تنفيذ لأوامر؛ تقود بعلامة اقتباس يفهمها Excel وNumbers.
  const guarded = /^[=+\-@\t]/.test(text) ? `'${text}` : text;
  return /[",\n]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

export function registrationCsv(rows: SessionRegistrationRow[]): string {
  const head = CSV_COLUMNS.join(",");
  const lines = rows.map((row) =>
    CSV_COLUMNS.map((column) => {
      if (column === "hasCvFile") return csvCell(row.cvFile != null && row.cvFile !== "" ? "yes" : "no");
      const value = row[column as keyof SessionRegistrationRow];
      return csvCell(typeof value === "object" ? null : value);
    }).join(","),
  );
  return [head, ...lines].join("\r\n");
}
