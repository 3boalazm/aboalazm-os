import type { Payload } from "payload";

/**
 * STUDIO METRICS — every number the dashboard shows, and where it came from.
 *
 * The rule this file exists to enforce: **a metric with no source does not
 * ship.** Each block below returns a `Metric` (or a typed list of them) that
 * carries `source` — a human-readable description of the query/table behind
 * the value — and `asOf`. The UI renders those labels next to the numbers, so
 * nobody can read a figure off this dashboard and be unable to say what it
 * counts or when it was counted.
 *
 * DELIBERATE ABSENCES (see docs/studio/02_BLUEPRINT.md §5):
 *   · Traffic, sessions, unique visitors, pageviews, device split, sources.
 *     Vercel Analytics custom-event aggregation returns HTTP 402 on this plan
 *     (docs/EVENTS.md, 2026-10-24 audit). Browser events are still emitted but
 *     cannot be read back, so NO traffic tile is drawn. Not even an empty one:
 *     an empty traffic tile reads as "zero visitors".
 *   · Open rate / response time / satisfaction. No such data exists.
 *   · Revenue. `wonValue` is a manually entered USD figure per lead — it is
 *     reported as "contracted value, manually recorded", never as revenue.
 *
 * All queries run through Payload's Local API (in-process, no HTTP hop) with
 * `overrideAccess: false` and an explicit authenticated `req` — the same
 * access rules that protect the admin panel protect this.
 */

export type Iso = string;

export interface Metric {
  /** Stable key — used by tests to assert coverage. */
  id: string;
  label: string;
  /** The number itself. `null` means "cannot be computed honestly right now". */
  value: number | null;
  /** Unit suffix rendered after the value ("leads", "$", "%"). */
  unit?: string;
  /** Exactly what was counted, in words, for the tile footnote. */
  definition: string;
  /** Where it came from — table/query, for the "source" line. */
  source: string;
  /** When the underlying query ran (ISO). */
  asOf: Iso;
  /** Same metric over the immediately preceding window, when windowed. */
  previous?: number | null;
}

export type RangeKey = "7" | "28" | "90";

export const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: "7", label: "7 days", days: 7 },
  { key: "28", label: "28 days", days: 28 },
  { key: "90", label: "90 days", days: 90 },
];

export function resolveRange(raw?: string | null): { key: RangeKey; days: number; label: string; start: Date; end: Date; prevStart: Date; prevEnd: Date } {
  const found = RANGES.find((r) => r.key === raw) ?? RANGES[1]!;
  const end = new Date();
  const start = new Date(end.getTime() - found.days * 86400000);
  const prevEnd = start;
  const prevStart = new Date(start.getTime() - found.days * 86400000);
  return { key: found.key, days: found.days, label: found.label, start, end, prevStart, prevEnd };
}

/** Payload local API, authenticated as the signed-in user, never bypassing access. */
async function localApi(payload: Payload, user: unknown) {
  return { payload, user };
}

type Ctx = { payload: Payload; user: { id: string | number; email?: string } };

export function makeCtx(payload: Payload, user: Ctx["user"]): Ctx {
  return { payload, user };
}

const iso = (d: Date) => d.toISOString();
const pct = (now: number, prev: number): number | null => {
  if (!prev) return now > 0 ? null : 0;
  return Math.round(((now - prev) / prev) * 100);
};

export interface Delta {
  /** Absolute change in percentage points, relative to the previous window. */
  pct: number | null;
}

export function deltaOf(m: Metric): Delta {
  if (m.value == null || m.previous == null) return { pct: null };
  return { pct: pct(m.value, m.previous) };
}

/* ────────────────────────────────────────────────────────────────────────────
   1 · LEADS — the only funnel stage with a real, complete audit trail.
   Source of truth: the `messages` collection. Nothing else.
   ──────────────────────────────────────────────────────────────────────────── */

export interface LeadCounts {
  total: number;
  byStage: Record<string, number>;
  unread: number;
  /** Sum of manually entered proposalValue on stages proposal-sent|won. */
  openProposalValue: number;
  /** Sum of manually entered wonValue where stage = won. */
  contractedValue: number;
  wonCount: number;
  lostCount: number;
  /** Days since the oldest `new` lead arrived — the "needs attention" signal. */
  oldestUntouchedDays: number | null;
  asOf: Iso;
}

const OPEN_STAGES = ["new", "qualified", "proposal-sent"] as const;

export async function leadCounts({ payload, user }: Ctx, range: ReturnType<typeof resolveRange>): Promise<LeadCounts> {
  const all = await payload.find({
    collection: "messages",
    limit: 0,
    depth: 0,
    pagination: false,
    overrideAccess: false,
    user: user as never,
  });

  const docs = all.docs as {
    leadStage?: string | null;
    proposalValue?: number | null;
    wonValue?: number | null;
    isRead?: boolean | null;
    createdAt?: string;
  }[];

  const byStage: Record<string, number> = {};
  let openProposalValue = 0;
  let contractedValue = 0;
  let unread = 0;
  let wonCount = 0;
  let lostCount = 0;
  let oldestNew: number | null = null;
  const nowMs = Date.now();

  for (const d of docs) {
    const stage = d.leadStage ?? "new";
    byStage[stage] = (byStage[stage] ?? 0) + 1;
    if (!d.isRead) unread += 1;
    if (stage === "won") {
      wonCount += 1;
      contractedValue += d.wonValue ?? 0;
    }
    if (stage === "lost" || stage === "not-a-fit") lostCount += 1;
    if ((OPEN_STAGES as readonly string[]).includes(stage)) openProposalValue += d.proposalValue ?? 0;
    if (stage === "new" && d.createdAt) {
      const age = (nowMs - new Date(d.createdAt).getTime()) / 86400000;
      oldestNew = oldestNew == null ? age : Math.max(oldestNew, age);
    }
  }

  return {
    total: docs.length,
    byStage,
    unread,
    openProposalValue,
    contractedValue,
    wonCount,
    lostCount,
    oldestUntouchedDays: oldestNew == null ? null : Math.floor(oldestNew),
    asOf: iso(range.end),
  };
}

/** Leads whose createdAt falls in [start, end) — used for the windowed tiles. */
export async function leadsInWindow({ payload, user }: Ctx, start: Date, end: Date) {
  const res = await payload.find({
    collection: "messages",
    where: { createdAt: { greater_than_equal: iso(start), less_than: iso(end) } },
    limit: 0,
    depth: 0,
    pagination: false,
    overrideAccess: false,
    user: user as never,
  });
  const docs = res.docs as { leadStage?: string | null; utmSource?: string | null; sourcePage?: string | null; service?: string | null; locale?: string | null }[];
  const bySource: Record<string, number> = {};
  const byService: Record<string, number> = {};
  const byLocale: Record<string, number> = {};
  const byUtm: Record<string, number> = {};
  let won = 0;
  for (const d of docs) {
    if (d.utmSource) byUtm[d.utmSource] = (byUtm[d.utmSource] ?? 0) + 1;
    if (d.sourcePage) bySource[d.sourcePage] = (bySource[d.sourcePage] ?? 0) + 1;
    if (d.service) byService[d.service] = (byService[d.service] ?? 0) + 1;
    if (d.locale) byLocale[d.locale] = (byLocale[d.locale] ?? 0) + 1;
    if (d.leadStage === "won") won += 1;
  }
  return { total: docs.length, bySource, byService, byLocale, byUtm, won };
}

/** Newest enquiries, exactly as they arrived — the inbox. */
export async function recentLeads({ payload, user }: Ctx, limit = 6) {
  const res = await payload.find({
    collection: "messages",
    sort: "-createdAt",
    limit,
    depth: 0,
    overrideAccess: false,
    user: user as never,
  });
  return res.docs as {
    id: string | number;
    name?: string;
    company?: string | null;
    email?: string;
    service?: string | null;
    leadStage?: string | null;
    budget?: string | null;
    sourcePage?: string | null;
    isRead?: boolean | null;
    createdAt?: string;
  }[];
}

/** Every lead, ordered by stage then recency — the CRM board. */
export async function allLeads({ payload, user }: Ctx) {
  const res = await payload.find({
    collection: "messages",
    sort: "-createdAt",
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user: user as never,
  });
  return res.docs as {
    id: string | number;
    name?: string;
    company?: string | null;
    email?: string;
    service?: string | null;
    leadStage?: string | null;
    budget?: string | null;
    sourcePage?: string | null;
    utmSource?: string | null;
    proposalValue?: number | null;
    wonValue?: number | null;
    closedReason?: string | null;
    isRead?: boolean | null;
    createdAt?: string;
  }[];
}

/* ────────────────────────────────────────────────────────────────────────────
   2 · CONTENT — what is live, what is a draft, what is missing metadata.
   Source of truth: projects, posts, case-studies, media.
   ──────────────────────────────────────────────────────────────────────────── */

export interface ContentHealth {
  projectsPublished: number;
  projectsDraft: number;
  postsPublished: number;
  postsDraft: number;
  caseStudiesPublished: number;
  mediaCount: number;
  /** Projects with no thumbnail — a real, fixable gap. */
  projectsWithoutThumbnail: number;
  /**
   * Project rows whose delivery status says in-progress.
   *
   * `null` — not 0 — means the column does not exist in this database, so the
   * number cannot be sourced. The Projects collection declares a `status`
   * select that collides with Payload's own `_status` enum (both map to
   * enum_projects_status), so no committed migration creates the column; see
   * docs/studio/03_SCHEMA_FINDINGS.md §3. Production got it from an old schema
   * push, but a database built from migrations does not have it at all, and
   * querying it there fails the whole Projects read. The console reports that
   * honestly instead of inventing a zero or crashing the page.
   */
  projectsInProgress: number | null;
  asOf: Iso;
}

type P = { id?: number; _status?: string | null; thumbnail?: unknown; name?: string | null; slug?: string | null; status?: string | null; updatedAt?: string };

/** True when the error is "this column does not exist" from Postgres. */
function isMissingColumn(error: unknown): boolean {
  const code = (error as { cause?: { code?: string }; code?: string })?.cause?.code ?? (error as { code?: string })?.code;
  return code === "42703";
}

/** Columns of `projects` that no migration can be missing. */
const SAFE_PROJECT_SELECT = { name: true, slug: true, thumbnail: true, _status: true, updatedAt: true } as const;

/**
 * Read `projects` without assuming the delivery-status column exists.
 *
 * Collections/Projects.ts declares a `status` select whose Postgres enum
 * collides with Payload's own `_status` (both map to enum_projects_status), so
 * no committed migration can create the column — see
 * docs/studio/03_SCHEMA_FINDINGS.md §3. A database built only from migrations
 * therefore answers the full select with Postgres 42703 and every page that
 * reads projects dies. On that specific error we re-read with an explicit
 * column list and flag the data as partial; anything else still throws.
 */
async function readProjects(
  payload: Ctx["payload"],
  user: Ctx["user"],
  opts: { limit: number; sort?: string },
): Promise<{ docs: P[]; deliveryStatusAvailable: boolean }> {
  const req = { overrideAccess: false, user: user as never, depth: 0, ...opts } as const;
  try {
    const r = await payload.find({ collection: "projects", ...req });
    return { docs: r.docs as P[], deliveryStatusAvailable: true };
  } catch (error: unknown) {
    if (!isMissingColumn(error)) throw error;
    const r = await payload.find({ collection: "projects", ...req, select: { ...SAFE_PROJECT_SELECT } });
    return { docs: r.docs as P[], deliveryStatusAvailable: false };
  }
}

export async function contentHealth({ payload, user }: Ctx): Promise<ContentHealth> {
  const req = { overrideAccess: false, user: user as never, depth: 0, limit: 0, pagination: false } as const;

  /* Projects go through readProjects so a missing optional column degrades one
     number instead of the entire console. The rest is genuinely independent and
     still fetched in parallel. */
  const [projects, others] = await Promise.all([
    readProjects(payload, user, { limit: 0 }),
    Promise.all([
      payload.find({ collection: "posts", ...req }),
      payload.find({ collection: "case-studies", ...req }),
      payload.find({ collection: "media", ...req }),
    ]),
  ]);
  const [posts, caseStudies, media] = others;

  const pDocs = projects.docs;
  const { deliveryStatusAvailable } = projects;
  return {
    projectsPublished: pDocs.filter((p) => p._status === "published").length,
    projectsDraft: pDocs.filter((p) => p._status !== "published").length,
    postsPublished: (posts.docs as P[]).filter((p) => p._status === "published").length,
    postsDraft: (posts.docs as P[]).filter((p) => p._status !== "published").length,
    caseStudiesPublished: (caseStudies.docs as P[]).filter((p) => p._status === "published").length,
    mediaCount: media.docs.length,
    projectsWithoutThumbnail: pDocs.filter((p) => p._status === "published" && !p.thumbnail).length,
    projectsInProgress: deliveryStatusAvailable
      ? pDocs.filter((p) => p.status === "in-progress").length
      : null,
    asOf: iso(new Date()),
  };
}

/** Newest content edits — the "what changed" feed. Real updatedAt, four collections. */
export async function recentActivity({ payload, user }: Ctx) {
  const req = { overrideAccess: false, user: user as never, depth: 0, limit: 5, sort: "-updatedAt" } as const;
  const [projects, posts, caseStudies] = await Promise.all([
    readProjects(payload, user, { limit: 5, sort: "-updatedAt" }),
    payload.find({ collection: "posts", ...req }),
    payload.find({ collection: "case-studies", ...req }),
  ]);
  const rows = [
    ...projects.docs.map((d) => ({
      id: `project-${d.id}`,
      kind: "Project" as const,
      title: d.name ?? d.slug ?? `#${d.id}`,
      href: `/admin/collections/projects/${d.id}`,
      status: d._status ?? "draft",
      at: d.updatedAt,
    })),
    ...(posts.docs as { id: number; title?: string; slug?: string; _status?: string; updatedAt: string }[]).map((d) => ({
      id: `post-${d.id}`,
      kind: "Writing" as const,
      title: d.title ?? d.slug ?? `#${d.id}`,
      href: `/admin/collections/posts/${d.id}`,
      status: d._status ?? "draft",
      at: d.updatedAt,
    })),
    ...(caseStudies.docs as { id: number; name?: string; slug?: string; _status?: string; updatedAt: string }[]).map((d) => ({
      id: `case-${d.id}`,
      kind: "Case study" as const,
      title: d.name ?? d.slug ?? `#${d.id}`,
      href: `/admin/collections/case-studies/${d.id}`,
      status: d._status ?? "draft",
      at: d.updatedAt,
    })),
  ];
  return rows.sort((a, b) => String(b.at ?? "").localeCompare(String(a.at ?? ""))).slice(0, 6);
}

/* ────────────────────────────────────────────────────────────────────────────
   3 · RESOURCES — the download gate is a second, shallower lead source.
   ──────────────────────────────────────────────────────────────────────────── */

export async function resourceLeads({ payload, user }: Ctx, range: ReturnType<typeof resolveRange>) {
  const all = await payload.find({
    collection: "resource-leads",
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: false,
    user: user as never,
  });
  const docs = all.docs as { resource?: string | null; source?: string | null; createdAt?: string }[];
  const byResource: Record<string, number> = {};
  for (const d of docs) {
    const key = d.resource || "Unlabelled";
    byResource[key] = (byResource[key] ?? 0) + 1;
  }
  const inWindow = docs.filter((d) => d.createdAt && new Date(d.createdAt) >= range.start).length;
  const prevWindow = docs.filter((d) => d.createdAt && new Date(d.createdAt) >= range.prevStart && new Date(d.createdAt) < range.start).length;
  return { total: docs.length, inWindow, prevWindow, byResource, asOf: iso(range.end) };
}

/* ────────────────────────────────────────────────────────────────────────────
   4 · SYSTEM — liveness of the integrations this app actually depends on.
   Each probe runs a real check; none is decorative.
   ──────────────────────────────────────────────────────────────────────────── */

export type ProbeState = "ok" | "warn" | "fail" | "unconfigured";

export interface Probe {
  id: string;
  name: string;
  state: ProbeState;
  /** What was actually tested — not what it would test in theory. */
  detail: string;
  /** How to fix it when not ok. */
  fix?: string;
  checkedAt: Iso;
}

export async function systemProbes({ payload }: Ctx): Promise<Probe[]> {
  const now = iso(new Date());
  const probes: Probe[] = [];

  /* Database — a real round-trip, not a config check. */
  try {
    const started = Date.now();
    await payload.db.drizzle.execute("select 1 as ok");
    probes.push({
      id: "database",
      name: "Database",
      state: "ok",
      detail: `Postgres answered in ${Date.now() - started} ms.`,
      checkedAt: now,
    });
  } catch (error) {
    probes.push({
      id: "database",
      name: "Database",
      state: "fail",
      detail: error instanceof Error ? error.message : "Query failed.",
      fix: "Check DATABASE_URI and the Neon project status.",
      checkedAt: now,
    });
  }

  /* Media storage — the upload path silently falls back to local disk
     without a token, which breaks every image on Vercel (payload.config.ts). */
  const blob = process.env.BLOB_READ_WRITE_TOKEN;
  probes.push({
    id: "storage",
    name: "Media storage",
    state: blob ? "ok" : "fail",
    detail: blob ? "Vercel Blob token present; uploads persist." : "No BLOB_READ_WRITE_TOKEN — uploads fall back to local disk and vanish on Vercel.",
    fix: blob ? undefined : "Add BLOB_READ_WRITE_TOKEN (RUN_LOCALLY.md).",
    checkedAt: now,
  });

  /* Email — enquiries are always saved; the alert is best-effort. */
  const smtpHost = process.env.SMTP_HOST;
  const notifyTo = process.env.CONTACT_NOTIFY_TO;
  if (!smtpHost) {
    probes.push({
      id: "email",
      name: "Enquiry email alerts",
      state: "warn",
      detail: "No SMTP_HOST. Enquiries are still saved and visible in the inbox; nobody is emailed.",
      fix: "Set SMTP_HOST / SMTP_USER / SMTP_PASS, then check with npm run check:contact.",
      checkedAt: now,
    });
  } else {
    probes.push({
      id: "email",
      name: "Enquiry email alerts",
      state: notifyTo ? "ok" : "warn",
      detail: notifyTo ? `SMTP configured; alerts go to ${notifyTo}.` : "SMTP configured but CONTACT_NOTIFY_TO is empty — alerts have nowhere to go.",
      checkedAt: now,
    });
  }

  /* Analytics — report the real limitation instead of pretending. */
  probes.push({
    id: "analytics",
    name: "Analytics reporting",
    state: "warn",
    detail: "Browser events are emitted (docs/EVENTS.md) but this plan cannot return aggregates (HTTP 402). No traffic figures are shown anywhere in this dashboard.",
    fix: "Either upgrade the analytics plan or accept lead-based reporting.",
    checkedAt: now,
  });

  /* Revalidation — the CMS→site link. Config-level, stated as such. */
  probes.push({
    id: "revalidation",
    name: "Live revalidation",
    state: process.env.VERCEL === "1" || process.env.NODE_ENV === "production" ? "ok" : "warn",
    detail: "Saves trigger revalidatePath through collection hooks (lib/revalidate.ts). Hooks only fire inside a running Next.js request.",
    checkedAt: now,
  });

  return probes;
}

/* ────────────────────────────────────────────────────────────────────────────
   5 · THE DASHBOARD ASSEMBLY — one call, everything the Overview needs.
   ──────────────────────────────────────────────────────────────────────────── */

export interface Overview {
  range: { key: RangeKey; label: string; days: number };
  asOf: Iso;
  leads: {
    all: LeadCounts;
    window: { total: number; previous: number; won: number; bySource: [string, number][]; byService: [string, number][]; byLocale: [string, number][]; byUtm: [string, number][] };
    recent: Awaited<ReturnType<typeof recentLeads>>;
  };
  content: ContentHealth;
  activity: Awaited<ReturnType<typeof recentActivity>>;
  resources: Awaited<ReturnType<typeof resourceLeads>>;
  probes: Probe[];
}

const topEntries = (rec: Record<string, number>, n = 5): [string, number][] =>
  Object.entries(rec)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);

export async function loadOverview(payload: Payload, user: Ctx["user"], rangeKey?: string | null): Promise<Overview> {
  const ctx = makeCtx(payload, user);
  const range = resolveRange(rangeKey);

  const [{ payload: _p }, window, prevWindow, all, recent, content, activity, resources, probes] = await Promise.all([
    localApi(payload, user),
    leadsInWindow(ctx, range.start, range.end),
    leadsInWindow(ctx, range.prevStart, range.prevEnd),
    leadCounts(ctx, range),
    recentLeads(ctx),
    contentHealth(ctx),
    recentActivity(ctx),
    resourceLeads(ctx, range),
    systemProbes(ctx),
  ]);
  void _p;

  return {
    range: { key: range.key, label: range.label, days: range.days },
    asOf: iso(range.end),
    leads: {
      all,
      window: {
        total: window.total,
        previous: prevWindow.total,
        won: window.won,
        bySource: topEntries(window.bySource),
        byService: topEntries(window.byService),
        byLocale: topEntries(window.byLocale, 3),
        byUtm: topEntries(window.byUtm, 3),
      },
      recent,
    },
    content,
    activity,
    resources,
    probes,
  };
}
