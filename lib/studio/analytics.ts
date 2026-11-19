import type { Payload } from "payload";
import { resolveRange } from "./metrics";

/**
 * STUDIO ANALYTICS — قراءة مُجمّع التحليلات من الطرف الأول (`analytics-events`).
 */

type Ctx = { payload: Payload; user: { id: string | number; email?: string } };

export interface RawEvent {
  name: string;
  sessionId?: string | null;
  path?: string | null;
  locale?: string | null;
  referrerHost?: string | null;
  utmSource?: string | null;
  device?: string | null;
  createdAt?: string;
}

const iso = (d: Date) => d.toISOString();

async function eventsInWindow({ payload, user }: Ctx, start: Date, end: Date): Promise<RawEvent[]> {
  const res = await payload.find({
    collection: "analytics-events",
    where: { createdAt: { greater_than_equal: iso(start), less_than: iso(end) } },
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user: user as never,
    select: { name: true, sessionId: true, path: true, locale: true, referrerHost: true, utmSource: true, device: true, createdAt: true },
  });
  return res.docs as RawEvent[];
}

export interface FunnelStep {
  key: string;
  label: string;
  sessions: number;
  events: number;
  pctOfFirst: number | null;
}

const FUNNEL_STEPS: { key: string; label: string }[] = [
  { key: "pageview", label: "تصفح صفحة" },
  { key: "cta_start_project", label: "ضغط «ابدأ مشروعًا»" },
  { key: "form_start", label: "بدأ نموذج الاستفسار" },
  { key: "form_submit_attempt", label: "حاول الإرسال" },
  { key: "contact_submit", label: "تأكد حفظ الاستفسار" },
];

export function buildSessionFunnel(events: RawEvent[]): { steps: FunnelStep[]; sessionsWithId: number; eventsWithSession: number } {
  const sessions = new Set<string>();
  for (const e of events) if (e.sessionId) sessions.add(e.sessionId);

  const steps = FUNNEL_STEPS.map(({ key, label }) => {
    const stepSessions = new Set<string>();
    let count = 0;
    for (const e of events) {
      if (e.name !== key) continue;
      count += 1;
      if (e.sessionId) stepSessions.add(e.sessionId);
    }
    return { key, label, sessions: stepSessions.size, events: count, pctOfFirst: null as number | null };
  });

  const first = steps[0]?.sessions ?? 0;
  for (const s of steps) s.pctOfFirst = first > 0 ? Math.round((s.sessions / first) * 100) : null;

  return {
    steps,
    sessionsWithId: sessions.size,
    eventsWithSession: events.filter((e) => e.sessionId).length,
  };
}

export interface DayPoint {
  day: string;
  label: string;
  pageviews: number;
  sessions: number;
}

export function buildDailySeries(events: RawEvent[], days: number, end: Date): DayPoint[] {
  const points: DayPoint[] = [];
  const byDay = new Map<string, { pageviews: number; sessions: Set<string> }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    byDay.set(key, { pageviews: 0, sessions: new Set() });
    points.push({
      day: key,
      label: d.toLocaleDateString("ar-EG-u-nu-latn", { day: "2-digit", month: "short", timeZone: "UTC" }),
      pageviews: 0,
      sessions: 0,
    });
  }
  for (const e of events) {
    if (!e.createdAt) continue;
    const bucket = byDay.get(e.createdAt.slice(0, 10));
    if (!bucket) continue;
    if (e.name === "pageview") bucket.pageviews += 1;
    if (e.sessionId) bucket.sessions.add(e.sessionId);
  }
  for (const p of points) {
    const bucket = byDay.get(p.day)!;
    p.pageviews = bucket.pageviews;
    p.sessions = bucket.sessions.size;
  }
  return points;
}

export function topEntries(counts: Map<string, number>, n: number): [string, number][] {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export function countBy(events: RawEvent[], pick: (e: RawEvent) => string | null | undefined, n = 8): [string, number][] {
  const counts = new Map<string, number>();
  for (const e of events) {
    const key = pick(e);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return topEntries(counts, n);
}

export function normalizePath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "ar") {
    return `/${parts.slice(1).join("/")}`;
  }
  return path;
}

export interface AnalyticsReport {
  range: { key: string; label: string; days: number };
  asOf: string;
  totalEvents: number;
  pageviews: number;
  prevPageviews: number;
  sessions: number;
  prevSessions: number;
  contactSubmitEvents: number;
  enquiriesSaved: number;
  daily: DayPoint[];
  funnel: ReturnType<typeof buildSessionFunnel>;
  topPages: [string, number][];
  topEvents: [string, number][];
  referrers: [string, number][];
  campaigns: [string, number][];
  locales: [string, number][];
  devices: [string, number][];
  hasData: boolean;
}

function summarize(events: RawEvent[]) {
  const sessions = new Set<string>();
  let pageviews = 0;
  for (const e of events) {
    if (e.name === "pageview") pageviews += 1;
    if (e.sessionId) sessions.add(e.sessionId);
  }
  return { pageviews, sessions: sessions.size };
}

export async function loadAnalytics(ctx: Ctx, rangeKey?: string | null): Promise<AnalyticsReport> {
  const range = resolveRange(rangeKey);
  const [events, prevEvents, enquiries] = await Promise.all([
    eventsInWindow(ctx, range.start, range.end),
    eventsInWindow(ctx, range.prevStart, range.prevEnd),
    ctx.payload.count({
      collection: "messages",
      where: { createdAt: { greater_than_equal: iso(range.start), less_than: iso(range.end) } },
      overrideAccess: false,
      user: ctx.user as never,
    }),
  ]);

  const now = summarize(events);
  const prev = summarize(prevEvents);

  return {
    range: { key: range.key, label: range.label, days: range.days },
    asOf: iso(range.end),
    totalEvents: events.length,
    pageviews: now.pageviews,
    prevPageviews: prev.pageviews,
    sessions: now.sessions,
    prevSessions: prev.sessions,
    contactSubmitEvents: events.filter((e) => e.name === "contact_submit").length,
    enquiriesSaved: enquiries.totalDocs,
    daily: buildDailySeries(events, range.days, range.end),
    funnel: buildSessionFunnel(events),
    topPages: countBy(events.filter((e) => e.name === "pageview"), (e) => (e.path ? normalizePath(e.path) : null), 10),
    topEvents: countBy(events, (e) => e.name, 12),
    referrers: countBy(events.filter((e) => e.name === "pageview"), (e) => e.referrerHost, 6),
    campaigns: countBy(events, (e) => e.utmSource, 6),
    locales: countBy(events, (e) => e.locale, 5),
    devices: countBy(events, (e) => e.device, 4),
    hasData: events.length > 0,
  };
}

export async function analyticsSummary(ctx: Ctx, rangeKey?: string | null) {
  const range = resolveRange(rangeKey);
  const [events, prevEvents] = await Promise.all([
    eventsInWindow(ctx, range.start, range.end),
    eventsInWindow(ctx, range.prevStart, range.prevEnd),
  ]);
  const now = summarize(events);
  const prev = summarize(prevEvents);
  return {
    pageviews: now.pageviews,
    prevPageviews: prev.pageviews,
    sessions: now.sessions,
    prevSessions: prev.sessions,
    totalEvents: events.length,
    asOf: iso(range.end),
    days: range.days,
  };
}

export async function contentViews(ctx: Ctx, rangeKey?: string | null): Promise<[string, number][]> {
  const range = resolveRange(rangeKey);
  const events = await eventsInWindow(ctx, range.start, range.end);
  return countBy(
    events.filter((e) => e.name === "pageview"),
    (e) => (e.path ? normalizePath(e.path) : null),
    40,
  );
}
