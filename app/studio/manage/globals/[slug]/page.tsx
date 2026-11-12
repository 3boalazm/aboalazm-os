import { notFound } from "next/navigation";
import { requireStudioUser } from "@/lib/studio/auth";
import { getPayload } from "@/lib/payload";
import { getGlobalDoc, getGlobalMeta, loadManageShellProps } from "@/lib/studio/cms";
import { StudioShell } from "@/components/studio/shell";
import { OffersGlobalEditor, SettingsGlobalEditor } from "@/components/studio/cms/editors/globals-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage · Global", robots: { index: false, follow: false } };

export default async function StudioManageGlobalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getGlobalMeta(slug);
  if (!meta) notFound();

  const user = await requireStudioUser(`/studio/manage/globals/${meta.slug}`);
  const payload = await getPayload();

  const [shell, doc] = await Promise.all([
    loadManageShellProps(payload, user),
    getGlobalDoc(payload, user, meta.slug),
  ]);

  return (
    <StudioShell
      counts={shell.counts}
      attention={shell.attention}
      userEmail={user.email}
      version={`CMS · ${meta.label}`}
    >
      {meta.slug === "offers" ? (
        <OffersGlobalEditor initialDoc={doc as unknown as Record<string, unknown>} />
      ) : (
        <SettingsGlobalEditor initialDoc={doc as unknown as Record<string, unknown>} />
      )}
    </StudioShell>
  );
}
