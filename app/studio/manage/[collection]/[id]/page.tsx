import { notFound } from "next/navigation";
import { requireStudioUser } from "@/lib/studio/auth";
import { getPayload } from "@/lib/payload";
import { getCollectionDoc, getCollectionMeta, loadManageShellProps } from "@/lib/studio/cms";
import { StudioShell } from "@/components/studio/shell";
import { CollectionDocumentEditor } from "@/components/studio/cms/document-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة المحتوى · تعديل مستند", robots: { index: false, follow: false } };

export default async function StudioManageEditDocPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  const { collection, id } = await params;
  const meta = getCollectionMeta(collection);
  if (!meta) notFound();

  const user = await requireStudioUser(`/studio/manage/${meta.slug}/${id}`);
  const payload = await getPayload();

  const [shell, found] = await Promise.all([
    loadManageShellProps(payload, user),
    getCollectionDoc(payload, user, meta.slug, id),
  ]);

  if (!found.doc) notFound();

  return (
    <StudioShell
      counts={shell.counts}
      attention={shell.attention}
      userEmail={user.email}
      version={`CMS · ${meta.singular} #${id}`}
    >
      <CollectionDocumentEditor
        slug={meta.slug}
        doc={found.doc}
        isNew={false}
        deliveryStatusAvailable={found.deliveryStatusAvailable}
        currentUserId={user.id}
      />
    </StudioShell>
  );
}
