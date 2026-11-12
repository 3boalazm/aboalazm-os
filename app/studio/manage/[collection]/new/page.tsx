import { notFound, redirect } from "next/navigation";
import { requireStudioUser } from "@/lib/studio/auth";
import { getPayload } from "@/lib/payload";
import { getCollectionMeta, listCollectionDocs, loadManageShellProps } from "@/lib/studio/cms";
import { StudioShell } from "@/components/studio/shell";
import { CollectionDocumentEditor } from "@/components/studio/cms/document-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage · New", robots: { index: false, follow: false } };

export default async function StudioManageNewDocPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const meta = getCollectionMeta(collection);
  if (!meta) notFound();
  if (!meta.allowsCreate) redirect(`/studio/manage/${meta.slug}`);

  const user = await requireStudioUser(`/studio/manage/${meta.slug}/new`);
  const payload = await getPayload();

  const [shell, probe] = await Promise.all([
    loadManageShellProps(payload, user),
    meta.slug === "projects"
      ? listCollectionDocs(payload, user, "projects", { limit: 1 })
      : Promise.resolve({ deliveryStatusAvailable: true }),
  ]);

  return (
    <StudioShell
      counts={shell.counts}
      attention={shell.attention}
      userEmail={user.email}
      version={`CMS · New ${meta.singular}`}
    >
      <CollectionDocumentEditor
        slug={meta.slug}
        doc={null}
        isNew
        deliveryStatusAvailable={probe.deliveryStatusAvailable}
        currentUserId={user.id}
      />
    </StudioShell>
  );
}
