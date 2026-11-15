import { requireStudioUser } from "@/lib/studio/auth";
import { allLeads, contentHealth, envMatrix, makeCtx, resolveRange, systemProbes } from "@/lib/studio/metrics";
import { getPayload } from "@/lib/payload";
import { StudioShell } from "@/components/studio/shell";
import { SystemView } from "@/components/studio/system-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "النظام · لوحة الاستوديو", robots: { index: false, follow: false } };

export default async function StudioSystemPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const params = await searchParams;
  const user = await requireStudioUser(`/studio/system${params.range ? `?range=${params.range}` : ""}`);
  const payload = await getPayload();
  const range = resolveRange(params.range);

  const [probes, leads, content] = await Promise.all([
    systemProbes(makeCtx(payload, user)),
    allLeads({ payload, user }),
    contentHealth({ payload, user }),
  ]);

  const failing = probes.filter((p) => p.state === "fail");
  const unreadLeads = leads.filter((l) => !l.isRead).length;

  return (
    <StudioShell
      counts={{ unreadLeads, newLeads: leads.filter((l) => (l.leadStage ?? "new") === "new").length, drafts: content.projectsDraft + content.postsDraft }}
      attention={
        failing.length
          ? {
              title: failing.length === 1 ? "تكامل واحد معطّل" : `${failing.length} تكاملات معطّلة`,
              body: failing.map((f) => f.name).join("، "),
              href: "#",
              cta: "معاينة الأعطال",
            }
          : null
      }
      userEmail={user.email}
      version={`النظام · ${range.label}`}
    >
      <SystemView probes={probes} env={envMatrix()} />
    </StudioShell>
  );
}
