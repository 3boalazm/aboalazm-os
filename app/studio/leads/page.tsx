import { requireStudioUser } from "@/lib/studio/auth";
import { allLeads, contentHealth, leadCounts, loadOverview, resolveRange } from "@/lib/studio/metrics";
import { getPayload } from "@/lib/payload";
import { StudioShell } from "@/components/studio/shell";
import { LeadsView } from "@/components/studio/leads-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads & pipeline", robots: { index: false, follow: false } };

export default async function StudioLeadsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const params = await searchParams;
  const user = await requireStudioUser(`/studio/leads${params.range ? `?range=${params.range}` : ""}`);
  const payload = await getPayload();
  const range = resolveRange(params.range);

  const [leads, counts, overview, content] = await Promise.all([
    allLeads({ payload, user }),
    leadCounts({ payload, user }, range),
    loadOverview(payload, user, params.range),
    contentHealth({ payload, user }),
  ]);

  const unreadLeads = leads.filter((l) => !l.isRead).length;
  const newLeads = leads.filter((l) => (l.leadStage ?? "new") === "new").length;

  const attention = unreadLeads
    ? {
        title: `${unreadLeads} unread enquir${unreadLeads === 1 ? "y" : "ies"}`,
        body: "Open them below — the board is the queue.",
        href: "#",
        cta: "Work the queue",
      }
    : null;

  return (
    <StudioShell
      counts={{ unreadLeads, newLeads, drafts: content.projectsDraft + content.postsDraft }}
      attention={attention}
      userEmail={user.email}
      version={`P3 · ${range.label}`}
    >
      <LeadsView leads={leads} counts={counts} overview={overview} />
    </StudioShell>
  );
}
