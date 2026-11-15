import { requireStudioUser } from "@/lib/studio/auth";
import { allLeads, cmsInventory, contentHealth, makeCtx, recentActivity, resolveRange } from "@/lib/studio/metrics";
import { getPayload } from "@/lib/payload";
import { StudioShell } from "@/components/studio/shell";
import { ManageView } from "@/components/studio/manage-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة المحتوى · لوحة الاستوديو", robots: { index: false, follow: false } };

export default async function StudioManagePage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const params = await searchParams;
  const user = await requireStudioUser("/studio/manage");
  const payload = await getPayload();
  const range = resolveRange(params.range);
  const ctx = makeCtx(payload, user);

  const [inventory, activity, leads, content] = await Promise.all([
    cmsInventory(ctx),
    recentActivity(ctx),
    allLeads(ctx),
    contentHealth(ctx),
  ]);

  const unreadLeads = leads.filter((l) => !l.isRead).length;

  return (
    <StudioShell
      counts={{ unreadLeads, newLeads: leads.filter((l) => (l.leadStage ?? "new") === "new").length, drafts: content.projectsDraft + content.postsDraft }}
      attention={
        unreadLeads
          ? {
              title: unreadLeads === 1 ? "استفسار واحد غير مقروء" : `${unreadLeads} استفسارات غير مقروءة`,
              body: "التعديل يمكن أن ينتظر؛ هناك شخص ينتظر الرد.",
              href: "/studio/leads",
              cta: "فتح قائمة العملاء",
            }
          : null
      }
      userEmail={user.email}
      version={`المحتوى · ${range.label}`}
    >
      <ManageView inventory={inventory} activity={activity} />
    </StudioShell>
  );
}
