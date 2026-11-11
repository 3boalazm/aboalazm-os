import { requireStudioUser } from "@/lib/studio/auth";
import { allLeads, contentHealth, loadOverview, resolveRange } from "@/lib/studio/metrics";
import { getPayload } from "@/lib/payload";
import { StudioShell } from "@/components/studio/shell";
import { ContentView } from "@/components/studio/content-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content", robots: { index: false, follow: false } };

export default async function StudioContentPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const params = await searchParams;
  const user = await requireStudioUser(`/studio/content${params.range ? `?range=${params.range}` : ""}`);
  const payload = await getPayload();
  const range = resolveRange(params.range);

  const [content, overview, leads] = await Promise.all([
    contentHealth({ payload, user }),
    loadOverview(payload, user, params.range),
    allLeads({ payload, user }),
  ]);

  const unreadLeads = leads.filter((l) => !l.isRead).length;

  return (
    <StudioShell
      counts={{ unreadLeads, newLeads: leads.filter((l) => (l.leadStage ?? "new") === "new").length, drafts: content.projectsDraft + content.postsDraft }}
      attention={
        content.projectsWithoutThumbnail
          ? {
              title: `${content.projectsWithoutThumbnail} project${content.projectsWithoutThumbnail === 1 ? "" : "s"} without a thumbnail`,
              body: "They are published, so they render as empty cards on the public work page.",
              href: "/admin/collections/projects",
              cta: "Fix in Payload",
            }
          : null
      }
      userEmail={user.email}
      version={`P1 · ${range.label}`}
    >
      <ContentView content={content} activity={overview.activity} overview={overview} />
    </StudioShell>
  );
}
