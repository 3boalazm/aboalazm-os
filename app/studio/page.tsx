import { requireStudioUser } from "@/lib/studio/auth";
import { allLeads, loadOverview, RANGES, resolveRange, contentHealth, makeCtx } from "@/lib/studio/metrics";
import { analyticsSummary } from "@/lib/studio/analytics";
import { getPayload } from "@/lib/payload";
import { StudioShell } from "@/components/studio/shell";
import { OverviewView } from "@/components/studio/overview-view";

export const dynamic = "force-dynamic";

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const params = await searchParams;
  const user = await requireStudioUser(`/studio${params.range ? `?range=${params.range}` : ""}`);
  const payload = await getPayload();

  const [overview, leads, content, traffic] = await Promise.all([
    loadOverview(payload, user, params.range),
    allLeads({ payload, user }),
    contentHealth({ payload, user }),
    analyticsSummary(makeCtx(payload, user), params.range),
  ]);

  const unreadLeads = leads.filter((l) => !l.isRead).length;
  const newLeads = leads.filter((l) => (l.leadStage ?? "new") === "new").length;
  const drafts = content.projectsDraft + content.postsDraft;

  const failing = overview.probes.filter((p) => p.state === "fail");
  const oldestNew = leads
    .filter((l) => (l.leadStage ?? "new") === "new")
    .sort((a, b) => (a.createdAt ?? "") < (b.createdAt ?? "") ? -1 : 1)[0];

  let attention: { title: string; body: string; href: string; cta: string } | null = null;
  if (unreadLeads > 0) {
    attention = {
      title: unreadLeads === 1 ? "استفسار واحد غير مقروء" : `${unreadLeads} استفسارات غير مقروءة`,
      body: "لم يفتحها أحد بعد — هم الأشخاص الوحيدون بانتظار رد الاستوديو حاليًا.",
      href: "/studio/leads",
      cta: "فتح مسار العملاء",
    };
  } else if (oldestNew) {
    const days = Math.floor((Date.now() - new Date(oldestNew.createdAt ?? Date.now()).getTime()) / 86400000);
    attention = {
      title: "استفسار بانتظار التأهيل",
      body: `${oldestNew.name ?? "عميل محتمل"} ما زال في مرحلة «جديد» منذ ${days} يومًا.`,
      href: "/studio/leads",
      cta: "مراجعته الآن",
    };
  } else if (failing.length) {
    attention = {
      title: failing.length === 1 ? "تكامل واحد معطّل" : `${failing.length} تكاملات معطّلة`,
      body: failing.map((f) => f.name).join("، "),
      href: "/studio/system",
      cta: "تفحص الأعطال",
    };
  }

  return (
    <StudioShell
      counts={{ unreadLeads, newLeads, drafts }}
      attention={attention}
      userEmail={user.email}
      version={`الاستوديو · ${RANGES.length} نطاقات`}
    >
      <OverviewView data={overview} traffic={traffic} />
    </StudioShell>
  );
}

export const metadata = {
  title: "لوحة الاستوديو · Aboalazm OS",
  robots: { index: false, follow: false },
};

void resolveRange;
