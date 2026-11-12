import type { Payload } from "payload";
import { resolveRange } from "./metrics";

/**
 * STUDIO ANALYTICS (P2) — reading back the first-party collector.
 *
 * Every figure here comes from the `analytics-events` table written by
 * app/api/track/route.ts. Definitions are fixed and stated on screen:
 *
 *   · pageview  — one stored `pageview` event. Emitted once per route
 *                 change by components/seo/pageview-tracker.tsx.
 *   · session   — a distinct `sessionId`: a random value in the tab's
 *                 sessionStorage. It identifies a tab session, not a
 *                 person. Visitors with storage disabled send events
 *                 without one; they count as events/pageviews but cannot
 *                 join the session funnel, and the funnel tile states
 *                 its own coverage instead of hiding that.
 *   · funnel    — for each step, the number of distinct sessions with at
 *                 least one event of that kind in the window. Steps are
 *                 NOT forced to be nested: a session can appear at
 *                 form_start without a stored pageview if the collector
 *                 started mid-visit. Percentages are "of sessions that
 *                 viewed a page", labelled as such.
 *
 * The vendor limitation has not changed: Vercel's own aggregates still
 * return HTTP 402 on this plan. These numbers exist because the events
 * are now also stored in our own Postgres — one source of truth, read
 * with the operator's session (overrideAccess: false).
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

/* ── pure builders (unit-tested without a database) ─────────────────────── */

export interface FunnelStep {
  key: string;
  label: string;
  sessions: number;
  events: number;
  /** Share of the first step's sessions, 0–100. Null when the first step is empty. */
  pctOfFirst: number | null;
}

const FUNNEL_STEPS: { key: string; label: string }[] = [
  { key: "pageview", label: "Viewed a page" },
  { key: "cta_start_project", label: "Clicked “start a project”" },
  { key: "form_start", label: "Started the enquiry form" },
  { key: "form_submit_attempt", label: "Attempted to submit" },
  { key: "contact_submit", label: "Enquiry confirmed saved" },
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
  day: string; // yyyy-mm-dd, UTC
  label: string; // "12 Nov"
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
      label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }),
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

/** Strip the locale prefix so /en/writing/x and /ar/writing/x rank as one page. */
export function normalizePath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "ar" || parts[0] === "ms") {
    return `/${parts.slice(1).join("/")}`;
  }
  return path;
}

/* ── the report ─────────────────────────────────────────────────────────── */

export interface AnalyticsReport {
  range: { key: string; label: string; days: number };
  asOf: string;
  /** Total stored events of every kind in the window. */
  totalEvents: number;
  pageviews: number;
  prevPageviews: number;
  sessions: number;
  prevSessions: number;
  /** contact_submit EVENTS in window — the client's confirmation signal. */
  contactSubmitEvents: number;
  /** Rows actually saved in `messages` in window — the database's own word. */
  enquiriesSaved: number;
  daily: DayPoint[];
  funnel: ReturnType<typeof buildSessionFunnel>;
  topPages: [string, number][];
  topEvents: [string, number][];
  referrers: [string, number][];
  campaigns: [string, number][];
  locales: [string, number][];
  devices: [string, number][];
  /** True once a single event exists — drives the honest empty state. */
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

/** Small summary for the Overview tile — one window, no funnel. */
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

/** Pageviews by normalized path in the window — the content-performance join key. */
export async function contentViews(ctx: Ctx, rangeKey?: string | null): Promise<[string, number][]> {
  const range = resolveRange(rangeKey);
  const events = await eventsInWindow(ctx, range.start, range.end);
  return countBy(
    events.filter((e) => e.name === "pageview"),
    (e) => (e.path ? normalizePath(e.path) : null),
    40,
  );
}
