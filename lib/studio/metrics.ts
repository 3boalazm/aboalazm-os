import type { Payload } from "payload";

/**
 * STUDIO METRICS — كل رقم تعرضه اللوحة ومصدره الحقيقي.
 *
 * القاعدة الصارمة: لا يُعرض رقم دون مصدر حقيقي.
 *
 * غيابات مقصودة (انظر docs/studio/02_BLUEPRINT.md §5):
 *   · إحصائيات Vercel الخارجية ترجع HTTP 402 على الخطة الحالية، ولذلك نقيس
 *     الزيارات من مخزن أحداثنا الأولي فقط ولا نعرض أي بيانات مستوردة أو تقديرية.
 *   · قيمة `wonValue` تمثل القيمة المتعاقد عليها يدويًا (contracted value)، ولا
 *     تُقدّم أبدًا كإيرادات محققة (never as revenue).
 */

export type Iso = string;

export interface Metric {
  id: string;
  label: string;
  value: number | null;
  unit?: string;
  definition: string;
  source: string;
  asOf: Iso;
  previous?: number | null;
}

export type RangeKey = "7" | "28" | "90";

export const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: "7", label: "7 أيام", days: 7 },
  { key: "28", label: "28 يومًا", days: 28 },
  { key: "90", label: "90 يومًا", days: 90 },
];

export function resolveRange(raw?: string | null): { key: RangeKey; days: number; label: string; start: Date; end: Date; prevStart: Date; prevEnd: Date } {
  const found = RANGES.find((r) => r.key === raw) ?? RANGES[1]!;
  const end = new Date();
  const start = new Date(end.getTime() - found.days * 86400000);
  const prevEnd = start;
  const prevStart = new Date(start.getTime() - found.days * 86400000);
  return { key: found.key, days: found.days, label: found.label, start, end, prevStart, prevEnd };
}

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
  pct: number | null;
}

export function deltaOf(m: Metric): Delta {
  if (m.value == null || m.previous == null) return { pct: null };
  return { pct: pct(m.value, m.previous) };
}

/* ────────────────────────────────────────────────────────────────────────────
   1 · LEADS
   ──────────────────────────────────────────────────────────────────────────── */

export interface LeadCounts {
  total: number;
  byStage: Record<string, number>;
  unread: number;
  openProposalValue: number;
  contractedValue: number;
  wonCount: number;
  lostCount: number;
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
    brief?: string | null;
    service?: string | null;
    packageTier?: string | null;
    timeline?: string | null;
    locale?: string | null;
    leadStage?: string | null;
    budget?: string | null;
    sourcePage?: string | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    proposalValue?: number | null;
    wonValue?: number | null;
    closedReason?: string | null;
    isRead?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
  }[];
}

/* ────────────────────────────────────────────────────────────────────────────
   2 · CONTENT
   ──────────────────────────────────────────────────────────────────────────── */

export interface ContentHealth {
  projectsPublished: number;
  projectsDraft: number;
  postsPublished: number;
  postsDraft: number;
  caseStudiesPublished: number;
  mediaCount: number;
  projectsWithoutThumbnail: number;
  projectsInProgress: number | null;
  asOf: Iso;
}

type P = { id?: number; _status?: string | null; thumbnail?: unknown; name?: string | null; slug?: string | null; status?: string | null; updatedAt?: string };

function isMissingColumn(error: unknown): boolean {
  const code = (error as { cause?: { code?: string }; code?: string })?.cause?.code ?? (error as { code?: string })?.code;
  return code === "42703";
}

const SAFE_PROJECT_SELECT = { name: true, slug: true, thumbnail: true, _status: true, updatedAt: true } as const;

export async function readProjects(
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
      kind: "مشروع" as const,
      title: d.name ?? d.slug ?? `#${d.id}`,
      href: `/studio/manage/projects/${d.id}`,
      status: d._status ?? "draft",
      at: d.updatedAt,
    })),
    ...(posts.docs as { id: number; title?: string; slug?: string; _status?: string; updatedAt: string }[]).map((d) => ({
      id: `post-${d.id}`,
      kind: "مقال" as const,
      title: d.title ?? d.slug ?? `#${d.id}`,
      href: `/studio/manage/posts/${d.id}`,
      status: d._status ?? "draft",
      at: d.updatedAt,
    })),
    ...(caseStudies.docs as { id: number; name?: string; slug?: string; _status?: string; updatedAt: string }[]).map((d) => ({
      id: `case-${d.id}`,
      kind: "دراسة حالة" as const,
      title: d.name ?? d.slug ?? `#${d.id}`,
      href: `/studio/manage/case-studies/${d.id}`,
      status: d._status ?? "draft",
      at: d.updatedAt,
    })),
  ];
  return rows.sort((a, b) => String(b.at ?? "").localeCompare(String(a.at ?? ""))).slice(0, 6);
}

/* ────────────────────────────────────────────────────────────────────────────
   3 · RESOURCES
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
    const key = d.resource || "غير مصنّف";
    byResource[key] = (byResource[key] ?? 0) + 1;
  }
  const inWindow = docs.filter((d) => d.createdAt && new Date(d.createdAt) >= range.start).length;
  const prevWindow = docs.filter((d) => d.createdAt && new Date(d.createdAt) >= range.prevStart && new Date(d.createdAt) < range.start).length;
  return { total: docs.length, inWindow, prevWindow, byResource, asOf: iso(range.end) };
}

/* ────────────────────────────────────────────────────────────────────────────
   4 · SYSTEM PROBES
   ──────────────────────────────────────────────────────────────────────────── */

export type ProbeState = "ok" | "warn" | "fail" | "unconfigured";

export interface Probe {
  id: string;
  name: string;
  state: ProbeState;
  detail: string;
  fix?: string;
  checkedAt: Iso;
}

export async function systemProbes({ payload, user }: Ctx): Promise<Probe[]> {
  const now = iso(new Date());
  const probes: Probe[] = [];

  /* Database */
  try {
    const started = Date.now();
    await payload.db.drizzle.execute("select 1 as ok");
    probes.push({
      id: "database",
      name: "قاعدة البيانات",
      state: "ok",
      detail: `استجاب PostgreSQL خلال ${Date.now() - started} مللي ثانية.`,
      checkedAt: now,
    });
  } catch (error) {
    probes.push({
      id: "database",
      name: "قاعدة البيانات",
      state: "fail",
      detail: error instanceof Error ? error.message : "فشل تنفيذ الاستعلام.",
      fix: "تحقق من DATABASE_URI وحالة مشروع Neon.",
      checkedAt: now,
    });
  }

  /* Media storage */
  const blob = process.env.BLOB_READ_WRITE_TOKEN;
  probes.push({
    id: "storage",
    name: "تخزين الوسائط",
    state: blob ? "ok" : "fail",
    detail: blob
      ? "رمز Vercel Blob متوفر؛ الملفات المرفوعة تُحفظ بشكل دائم."
      : "المتغير BLOB_READ_WRITE_TOKEN غير موجود — الرفع سيسقط إلى القرص المحلي ويختفي على Vercel.",
    fix: blob ? undefined : "أضف BLOB_READ_WRITE_TOKEN (راجع RUN_LOCALLY.md).",
    checkedAt: now,
  });

  /* Email */
  const smtpHost = process.env.SMTP_HOST;
  const notifyTo = process.env.CONTACT_NOTIFY_TO;
  if (!smtpHost) {
    probes.push({
      id: "email",
      name: "تنبيهات بريد الاستفسارات",
      state: "warn",
      detail: "المتغير SMTP_HOST غير مضبوط. الاستفسارات ما زالت تُحفظ وتظهر في الوارد، لكن لن يُرسل بريد تنبيه.",
      fix: "اضبط SMTP_HOST / SMTP_USER / SMTP_PASS ثم اختبر عبر npm run check:contact.",
      checkedAt: now,
    });
  } else {
    probes.push({
      id: "email",
      name: "تنبيهات بريد الاستفسارات",
      state: notifyTo ? "ok" : "warn",
      detail: notifyTo
        ? `تم إعداد SMTP؛ تُرسل التنبيهات إلى ${notifyTo}.`
        : "تم إعداد SMTP لكن CONTACT_NOTIFY_TO فارغ — لا توجد وجهة لإرسال التنبيهات إليها.",
      checkedAt: now,
    });
  }

  /* Analytics */
  try {
    const dayAgo = new Date(Date.now() - 86400000);
    const [total, last24] = await Promise.all([
      payload.count({ collection: "analytics-events", overrideAccess: false, user: user as never }),
      payload.count({
        collection: "analytics-events",
        where: { createdAt: { greater_than_equal: dayAgo.toISOString() } },
        overrideAccess: false,
        user: user as never,
      }),
    ]);
    if (total.totalDocs === 0) {
      probes.push({
        id: "analytics",
        name: "مُجمّع التحليلات الأولي",
        state: "warn",
        detail:
          "المُجمّع مثبّت (/api/track → analytics_events) لكن لم يُسجّل أي حدث بعد. تجميعات المزود الخارجي لا تزال غير متاحة (HTTP 402)، لذا لا توجد بيانات زيارات من أي مصدر حتى الآن.",
        fix: "تصفح الموقع العام مرة ثم أعد الفحص. إن ظل العدد صفرًا، فالإشارات لا تصل إلى /api/track.",
        checkedAt: now,
      });
    } else if (last24.totalDocs === 0) {
      probes.push({
        id: "analytics",
        name: "مُجمّع التحليلات الأولي",
        state: "warn",
        detail: `${total.totalDocs} حدث مسجّل إجمالًا، ولا شيء خلال آخر 24 ساعة. إما أنه لم تكن هناك زيارات أو توقف وصول الإشارات.`,
        fix: "افتح الموقع وتنقل بين الصفحات ثم أعد الفحص قبل افتراض وجود عطل.",
        checkedAt: now,
      });
    } else {
      probes.push({
        id: "analytics",
        name: "مُجمّع التحليلات الأولي",
        state: "ok",
        detail: `${last24.totalDocs} حدث خلال آخر 24 ساعة · ${total.totalDocs} حدث إجمالًا في analytics_events. إحصائيات المزود الخارجي ما زالت تعيد HTTP 402؛ هذه الأرقام من مخزننا الخاص.`,
        checkedAt: now,
      });
    }
  } catch {
    probes.push({
      id: "analytics",
      name: "مُجمّع التحليلات الأولي",
      state: "fail",
      detail: "تعذر قراءة جدول analytics_events. قد لا تكون الترحيلات قد طُبقت على قاعدة البيانات.",
      fix: "شغّل npx payload migrate ثم أعد الفحص.",
      checkedAt: now,
    });
  }

  /* Migrations */
  try {
    const { migrations } = await import("@/migrations");
    const result = (await payload.db.drizzle.execute('select "name" as name, "batch" as batch from "payload_migrations"')) as unknown as {
      rows?: { name: string; batch: number }[];
    };
    const rows = Array.isArray(result) ? (result as unknown as { name: string; batch: number }[]) : (result.rows ?? []);
    const recorded = new Set(rows.map((r) => r.name));
    const missing = migrations.map((m) => m.name).filter((name) => !recorded.has(name));
    const devPush = rows.some((r) => r.name === "dev" && Number(r.batch) === -1);
    if (missing.length > 0) {
      probes.push({
        id: "migrations",
        name: "ترحيلات قاعدة البيانات",
        state: "fail",
        detail: `غير مسجلة في قاعدة البيانات: ${missing.join(", ")}. المخطط البرمجي وقاعدة البيانات غير متطابقين.`,
        fix: "شغّل npx payload migrate على قاعدة البيانات قبل الاعتماد على الأرقام.",
        checkedAt: now,
      });
    } else if (devPush) {
      probes.push({
        id: "migrations",
        name: "ترحيلات قاعدة البيانات",
        state: "warn",
        detail: "كل الترحيلات مسجلة، لكن يوجد سجل dev-push يدل على دفع المخطط محليًا في التطوير سابقًا.",
        checkedAt: now,
      });
    } else {
      probes.push({
        id: "migrations",
        name: "ترحيلات قاعدة البيانات",
        state: "ok",
        detail: `جميع الترحيلات المعتمدة (${migrations.length}) مسجلة في payload_migrations.`,
        checkedAt: now,
      });
    }
  } catch {
    probes.push({
      id: "migrations",
      name: "ترحيلات قاعدة البيانات",
      state: "warn",
      detail: "تعذر قراءة سجل الترحيلات من داخل التطبيق. يظل أمر npm run check:db-schema هو المرجع المعتمد.",
      checkedAt: now,
    });
  }

  /* Lead inbox */
  try {
    const newest = await payload.find({ collection: "messages", sort: "-createdAt", limit: 1, depth: 0, overrideAccess: false, user: user as never });
    const doc = newest.docs[0] as { createdAt?: string } | undefined;
    if (!doc?.createdAt) {
      probes.push({
        id: "inbox",
        name: "صندوق الاستفسارات",
        state: "warn",
        detail: "لم يُحفظ أي استفسار حتى الآن. الصندوق فارغ.",
        checkedAt: now,
      });
    } else {
      const hours = Math.max(0, Math.round((Date.now() - new Date(doc.createdAt).getTime()) / 3600000));
      probes.push({
        id: "inbox",
        name: "صندوق الاستفسارات",
        state: "ok",
        detail:
          hours < 1
            ? "وصل أحدث استفسار خلال الساعة الماضية."
            : hours < 48
              ? `وصل أحدث استفسار منذ ${hours} ساعة.`
              : `وصل أحدث استفسار منذ ${Math.round(hours / 24)} يومًا.`,
        checkedAt: now,
      });
    }
  } catch {
    probes.push({
      id: "inbox",
      name: "صندوق الاستفسارات",
      state: "fail",
      detail: "تعذر قراءة مجموعة messages.",
      fix: "تحقق من فحص قاعدة البيانات أعلاه أولًا.",
      checkedAt: now,
    });
  }

  /* Revalidation */
  probes.push({
    id: "revalidation",
    name: "التحديث اللحظي للصفحات",
    state: process.env.VERCEL === "1" || process.env.NODE_ENV === "production" ? "ok" : "warn",
    detail: "عمليات الحفظ تفعّل revalidatePath عبر خطافات المجموعات (lib/revalidate.ts) داخل طلبات Next.js الحية.",
    checkedAt: now,
  });

  return probes;
}

/* ────────────────────────────────────────────────────────────────────────────
   5 · ENVIRONMENT + CMS INVENTORY
   ──────────────────────────────────────────────────────────────────────────── */

export interface EnvRow {
  name: string;
  present: boolean;
  purpose: string;
  hint?: string;
}

export function envMatrix(): EnvRow[] {
  const has = (name: string) => Boolean(process.env[name]);
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return [
    { name: "DATABASE_URI", present: has("DATABASE_URI"), purpose: "قاعدة بيانات Postgres (Neon) — مصدر كل رقم في هذه اللوحة" },
    { name: "PAYLOAD_SECRET", present: has("PAYLOAD_SECRET"), purpose: "توقيع جلسات Payload — الجلسة التي تستخدمها للدخول هنا" },
    { name: "BLOB_READ_WRITE_TOKEN", present: has("BLOB_READ_WRITE_TOKEN"), purpose: "تخزين الوسائط على Vercel Blob؛ بدونه يسقط الرفع للقرص المحلي" },
    { name: "SMTP_HOST / SMTP_USER / SMTP_PASS", present: has("SMTP_HOST") && has("SMTP_USER") && has("SMTP_PASS"), purpose: "إشعارات البريد عند الاستفسار (الاستفسارات تُحفظ بكل حال)" },
    { name: "CONTACT_NOTIFY_TO", present: has("CONTACT_NOTIFY_TO"), purpose: "البريد الذي يستقبل إشعارات الاستفسارات الجديدة" },
    { name: "NEXT_PUBLIC_BOOKING_URL", present: has("NEXT_PUBLIC_BOOKING_URL"), purpose: "رابط زر «احجز مكالمة» على الموقع العام" },
    { name: "GOOGLE_SEARCH_CONSOLE_PROPERTY + service account", present: has("GOOGLE_SEARCH_CONSOLE_PROPERTY") && has("GOOGLE_SERVICE_ACCOUNT_EMAIL") && has("GOOGLE_SERVICE_ACCOUNT_KEY"), purpose: "بيانات البحث العضوي في شاشة المحتوى؛ عدم وجودها يُعرض بوضوح كغير متصل" },
    { name: "VERCEL_GIT_COMMIT_SHA", present: has("VERCEL_GIT_COMMIT_SHA"), purpose: "معرّف الالتزام المنشور حاليًا", hint: sha ? sha.slice(0, 7) : undefined },
  ];
}

export interface CmsRow {
  slug: string;
  label: string;
  group: string;
  total: number;
  drafts: number | null;
  allowsCreate: boolean;
  href: string;
  createHref: string;
}

export interface CmsInventory {
  collections: CmsRow[];
  globals: { slug: string; label: string; href: string; updatedAt: string | null }[];
  asOf: Iso;
}

export async function cmsInventory({ payload, user }: Ctx): Promise<CmsInventory> {
  const req = { overrideAccess: false, user: user as never } as const;
  const count = async (collection: string) =>
    (await payload.count({ collection: collection as never, ...req })).totalDocs;

  const [content, messages, resourceLeads, testimonials, teamMembers, users, events, offers, settings] = await Promise.all([
    contentHealth({ payload, user }),
    count("messages"),
    count("resource-leads"),
    count("testimonials"),
    count("team-members"),
    count("users"),
    count("analytics-events"),
    payload.findGlobal({ slug: "offers", ...req, depth: 0 }) as Promise<{ updatedAt?: string }>,
    payload.findGlobal({ slug: "settings", ...req, depth: 0 }) as Promise<{ updatedAt?: string }>,
  ]);

  const row = (slug: string, label: string, group: string, total: number, drafts: number | null, allowsCreate = true): CmsRow => ({
    slug,
    label,
    group,
    total,
    drafts,
    allowsCreate,
    href: `/studio/manage/${slug}`,
    createHref: `/studio/manage/${slug}/new`,
  });

  return {
    collections: [
      row("projects", "المشاريع", "المحتوى", content.projectsPublished + content.projectsDraft, content.projectsDraft),
      row("case-studies", "دراسات الحالة", "المحتوى", content.caseStudiesPublished, null),
      row("posts", "المقالات", "المحتوى", content.postsPublished + content.postsDraft, content.postsDraft),
      row("media", "الوسائط", "المحتوى", content.mediaCount, null),
      row("messages", "الاستفسارات (خام)", "الوارد", messages, null, false),
      row("resource-leads", "مهتمو الموارد", "الوارد", resourceLeads, null),
      row("testimonials", "آراء العملاء", "المحتوى", testimonials, null),
      row("team-members", "أعضاء الفريق", "المحتوى", teamMembers, null),
      row("analytics-events", "أحداث التحليلات", "النظام", events, null, false),
      row("users", "المستخدمون", "النظام", users, null),
    ],
    globals: [
      { slug: "offers", label: "العروض والأسعار", href: "/studio/manage/globals/offers", updatedAt: offers.updatedAt ?? null },
      { slug: "settings", label: "إعدادات الموقع", href: "/studio/manage/globals/settings", updatedAt: settings.updatedAt ?? null },
    ],
    asOf: iso(new Date()),
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   6 · DASHBOARD ASSEMBLY
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
