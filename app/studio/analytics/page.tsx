import { requireStudioUser } from "@/lib/studio/auth";
import { allLeads, contentHealth, loadOverview } from "@/lib/studio/metrics";
import { loadAnalytics } from "@/lib/studio/analytics";
import { makeCtx } from "@/lib/studio/metrics";
import { getPayload } from "@/lib/payload";
import { StudioShell } from "@/components/studio/shell";
import { AnalyticsView } from "@/components/studio/analytics-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics", robots: { index: false, follow: false } };

export default async function StudioAnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const params = await searchParams;
  const user = await requireStudioUser(`/studio/analytics${params.range ? `?range=${params.range}` : ""}`);
  const payload = await getPayload();
  const ctx = makeCtx(payload, user);

  const [report, leads, overview, content] = await Promise.all([
    loadAnalytics(ctx, params.range),
    allLeads(ctx),
    loadOverview(payload, user, params.range),
    contentHealth(ctx),
  ]);

  const unreadLeads = leads.filter((l) => !l.isRead).length;

  return (
    <StudioShell
      counts={{ unreadLeads, newLeads: leads.filter((l) => (l.leadStage ?? "new") === "new").length, drafts: content.projectsDraft + content.postsDraft }}
      attention={
        unreadLeads
          ? { title: `${unreadLeads} unread enquir${unreadLeads === 1 ? "y" : "ies"}`, body: "Traffic is trivia until the inbox is answered.", href: "/studio/leads", cta: "Work the queue" }
          : null
      }
      userEmail={user.email}
      version={`P2 · ${overview.range.label}`}
    >
      <AnalyticsView report={report} />
    </StudioShell>
  );
}
