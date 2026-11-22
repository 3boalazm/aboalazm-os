import type { Payload } from "payload";
import type { StudioUser } from "@/lib/studio/auth";
import { feedbackOptionLabel } from "@/features/linkedin-session/feedback";

/**
 * STUDIO — after-session feedback (`session-feedback`), the "بعد السيشن" block
 * of /studio/sessions.
 *
 * Same split as ./sessions.ts: queries are async and always run with
 * `overrideAccess: false`; the arithmetic is pure (buildFeedbackReport,
 * feedbackCsv) and tested without a database in ./feedback.test.ts.
 *
 * Every number is counted from rows. Averages are over the people who answered
 * that question — the three scales are required, so in practice every row —
 * and an empty cohort reports `null`, never NaN, so the view shows "—".
 */

export interface FeedbackRow {
  id: string | number;
  rating: number;
  confidenceBefore: number;
  confidenceAfter: number;
  pace: string;
  recommend: string;
  nextStep: string;
  mostUseful?: string[] | null;
  bestPart?: string | null;
  improve?: string | null;
  nextTopic?: string | null;
  fullName?: string | null;
  linkedinUrl?: string | null;
  allowQuote?: boolean | null;
  sessionKey?: string | null;
  createdAt?: string;
}

type Ctx = { payload: Payload; user: StudioUser };

export async function allFeedback({ payload, user }: Ctx, sessionKey?: string | null): Promise<FeedbackRow[]> {
  const res = await payload.find({
    collection: "session-feedback",
    where: sessionKey ? { sessionKey: { equals: sessionKey } } : undefined,
    sort: "-createdAt",
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user: user as never,
  });
  return res.docs as unknown as FeedbackRow[];
}

/** Deleting is the one write the dashboard does here: a mistaken or abusive row. */
export function normalizeFeedbackId(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isSafeInteger(raw) && raw > 0 ? raw : null;
  if (typeof raw === "string" && /^[1-9]\d{0,15}$/.test(raw)) {
    const n = Number(raw);
    return Number.isSafeInteger(n) ? n : null;
  }
  return null;
}

/* ── pure report ───────────────────────────────────────────────────────── */

export interface FeedbackDist {
  key: string;
  label: string;
  value: number;
  /** Share of respondents — multi-answer bars may add up past 100. */
  pct: number;
}

export interface FeedbackAnswer {
  text: string;
  /** Who wrote it — null when the person stayed anonymous. */
  name: string | null;
  quotable: boolean;
}

export interface FeedbackReport {
  total: number;
  avgRating: number | null;
  avgBefore: number | null;
  avgAfter: number | null;
  /** avgAfter − avgBefore, rounded to 0.1 — the one number the session is judged by. */
  lift: number | null;
  /** People whose confidence went up / stayed / went down. */
  moreConfident: number;
  same: number;
  lessConfident: number;
  ratingDist: FeedbackDist[];
  pace: FeedbackDist[];
  recommend: FeedbackDist[];
  nextStep: FeedbackDist[];
  mostUseful: FeedbackDist[];
  bestPart: FeedbackAnswer[];
  improve: FeedbackAnswer[];
  nextTopic: FeedbackAnswer[];
  /** Left a LinkedIn link: can be followed up. */
  withLinkedin: number;
  /** Agreed to be quoted, by name, and wrote a "best part". */
  quotes: FeedbackAnswer[];
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const mean = (values: number[]): number | null => (values.length ? round1(values.reduce((a, b) => a + b, 0) / values.length) : null);

function dist(rows: FeedbackRow[], field: "pace" | "recommend" | "nextStep" | "mostUseful"): FeedbackDist[] {
  const total = Math.max(1, rows.length);
  const counts = new Map<string, number>();
  for (const row of rows) {
    const raw = row[field];
    const keys = Array.isArray(raw) ? raw : typeof raw === "string" && raw ? [raw] : [];
    for (const key of new Set(keys)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, value]) => ({ key, label: feedbackOptionLabel(field, key, "ar"), value, pct: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "ar"));
}

function ratingDist(rows: FeedbackRow[]): FeedbackDist[] {
  const total = Math.max(1, rows.length);
  return [5, 4, 3, 2, 1].map((n) => {
    const value = rows.filter((r) => r.rating === n).length;
    return { key: String(n), label: String(n), value, pct: Math.round((value / total) * 100) };
  });
}

function answers(rows: FeedbackRow[], field: "bestPart" | "improve" | "nextTopic"): FeedbackAnswer[] {
  const out: FeedbackAnswer[] = [];
  for (const row of rows) {
    const text = (row[field] ?? "").trim();
    if (!text) continue;
    const name = row.fullName?.trim() || null;
    out.push({ text: text.replace(/\s*\n\s*/g, " · "), name, quotable: Boolean(row.allowQuote && name) });
  }
  return out;
}

export function buildFeedbackReport(rows: FeedbackRow[]): FeedbackReport {
  const avgBefore = mean(rows.map((r) => r.confidenceBefore));
  const avgAfter = mean(rows.map((r) => r.confidenceAfter));
  const bestPart = answers(rows, "bestPart");
  return {
    total: rows.length,
    avgRating: mean(rows.map((r) => r.rating)),
    avgBefore,
    avgAfter,
    lift: avgBefore !== null && avgAfter !== null ? round1(avgAfter - avgBefore) : null,
    moreConfident: rows.filter((r) => r.confidenceAfter > r.confidenceBefore).length,
    same: rows.filter((r) => r.confidenceAfter === r.confidenceBefore).length,
    lessConfident: rows.filter((r) => r.confidenceAfter < r.confidenceBefore).length,
    ratingDist: ratingDist(rows),
    pace: dist(rows, "pace"),
    recommend: dist(rows, "recommend"),
    nextStep: dist(rows, "nextStep"),
    mostUseful: dist(rows, "mostUseful"),
    bestPart,
    improve: answers(rows, "improve"),
    nextTopic: answers(rows, "nextTopic"),
    withLinkedin: rows.filter((r) => Boolean(r.linkedinUrl?.trim())).length,
    quotes: bestPart.filter((a) => a.quotable),
  };
}

/** Anonymous feedback cannot be matched to a person; this is the honest rate. */
export function responseRate(responses: number, audience: number): number | null {
  return audience > 0 ? Math.min(100, Math.round((responses / audience) * 100)) : null;
}

/* ── CSV ───────────────────────────────────────────────────────────────── */

export const FEEDBACK_CSV_COLUMNS = [
  "rating",
  "confidenceBefore",
  "confidenceAfter",
  "pace",
  "recommend",
  "nextStep",
  "mostUseful",
  "bestPart",
  "improve",
  "nextTopic",
  "fullName",
  "linkedinUrl",
  "allowQuote",
  "sessionKey",
  "createdAt",
] as const;

function csvCell(value: unknown): string {
  if (value == null) return "";
  const text = String(value).replace(/\s*\n\s*/g, " ");
  /* A cell that starts like a formula would run in a spreadsheet. */
  const guarded = /^[=+\-@\t]/.test(text) ? `'${text}` : text;
  return /[",\n]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

export function feedbackCsv(rows: FeedbackRow[]): string {
  const head = FEEDBACK_CSV_COLUMNS.join(",");
  const lines = rows.map((row) =>
    FEEDBACK_CSV_COLUMNS.map((column) => {
      const value = row[column as keyof FeedbackRow];
      if (Array.isArray(value)) return csvCell(value.join("; "));
      if (typeof value === "boolean") return csvCell(value ? "yes" : "no");
      return csvCell(typeof value === "object" ? null : value);
    }).join(","),
  );
  return [head, ...lines].join("\r\n");
}

/* ── certificate requests ──────────────────────────────────────────────── */

export interface CertificateRow {
  id: string | number;
  fullName: string;
  sessionKey?: string | null;
  createdAt?: string;
}

export async function allCertificates({ payload, user }: Ctx, sessionKey?: string | null): Promise<CertificateRow[]> {
  const res = await payload.find({
    collection: "session-certificates",
    where: sessionKey ? { sessionKey: { equals: sessionKey } } : undefined,
    sort: "fullName",
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user: user as never,
  });
  return res.docs as unknown as CertificateRow[];
}

/** One line per person: the same name asked for twice is printed once. */
export function uniqueCertificateNames(rows: CertificateRow[]): string[] {
  const seen = new Map<string, string>();
  for (const row of rows) {
    const name = row.fullName?.replace(/\s+/g, " ").trim();
    if (name && !seen.has(name.toLowerCase())) seen.set(name.toLowerCase(), name);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "ar"));
}

export function certificatesCsv(rows: CertificateRow[]): string {
  const lines = rows.map((row) => [csvCell(row.fullName), csvCell(row.sessionKey), csvCell(row.createdAt)].join(","));
  return ["fullName,sessionKey,createdAt", ...lines].join("\r\n");
}
