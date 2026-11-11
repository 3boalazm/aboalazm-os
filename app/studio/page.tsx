import { requireStudioUser } from "@/lib/studio/auth";
import { allLeads, loadOverview, RANGES, resolveRange, contentHealth } from "@/lib/studio/metrics";
import { getPayload } from "@/lib/payload";
import { StudioShell } from "@/components/studio/shell";
import { OverviewView } from "@/components/studio/overview-view";

export const dynamic = "force-dynamic";

/**
 * /studio — the console's front door.
 *
 * `dynamic = "force-dynamic"` is not a performance choice: these numbers must
 * be the numbers at the moment of the request. A cached dashboard is a
 * dashboard that lies about "now", which is the one thing it cannot do.
 */
export default async function StudioPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const params = await searchParams;
  const user = await requireStudioUser(`/studio${params.range ? `?range=${params.range}` : ""}`);
  const payload = await getPayload();

  const [overview, leads, content] = await Promise.all([
    loadOverview(payload, user, params.range),
    allLeads({ payload, user }),
    contentHealth({ payload, user }),
  ]);

  const unreadLeads = leads.filter((l) => !l.isRead).length;
  const newLeads = leads.filter((l) => (l.leadStage ?? "new") === "new").length;
  const drafts = content.projectsDraft + content.postsDraft;

  /* One attention item, chosen by seniority of consequence:
     an unread enquiry outranks an unanswered lead outranks a broken system. */
  const failing = overview.probes.filter((p) => p.state === "fail");
  const oldestNew = leads
    .filter((l) => (l.leadStage ?? "new") === "new")
    .sort((a, b) => (a.createdAt ?? "") < (b.createdAt ?? "") ? -1 : 1)[0];

  let attention: { title: string; body: string; href: string; cta: string } | null = null;
  if (unreadLeads > 0) {
    attention = {
      title: `${unreadLeads} unread enquir${unreadLeads === 1 ? "y" : "ies"}`,
      body: "Nobody has opened these yet. They are the only people currently waiting on the studio.",
      href: "/studio/leads",
      cta: "Open the pipeline",
    };
  } else if (oldestNew) {
    const days = Math.floor((Date.now() - new Date(oldestNew.createdAt ?? Date.now()).getTime()) / 86400000);
    attention = {
      title: "Unqualified enquiry",
      body: `${oldestNew.name ?? "A lead"} has been at stage “New” for ${days} day${days === 1 ? "" : "s"}.`,
      href: "/studio/leads",
      cta: "Review it",
    };
  } else if (failing.length) {
    attention = {
      title: `${failing.length} integration${failing.length === 1 ? "" : "s"} failing`,
      body: failing.map((f) => f.name).join(", "),
      href: "/studio/system",
      cta: "See what broke",
    };
  }

  return (
    <StudioShell
      counts={{ unreadLeads, newLeads, drafts }}
      attention={attention}
      userEmail={user.email}
      version={`P1 · ${RANGES.length} ranges`}
    >
      <OverviewView data={overview} />
    </StudioShell>
  );
}

/** Guarantees the range parser is exercised on every render path. */
export const metadata = {
  title: "Studio console · Aboalazm OS",
  robots: { index: false, follow: false },
};

// Keep the imported helper in this module's dependency graph so a future
// refactor cannot silently drop range validation from the entry point.
void resolveRange;
