import { notFound } from "next/navigation";
import { requireStudioUser } from "@/lib/studio/auth";
import { getPayload } from "@/lib/payload";
import { getCollectionMeta, listCollectionDocs, loadManageShellProps } from "@/lib/studio/cms";
import { StudioShell } from "@/components/studio/shell";
import { CollectionBrowser } from "@/components/studio/cms/collection-browser";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة المحتوى · المجموعة", robots: { index: false, follow: false } };

export default async function StudioManageCollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ q?: string; status?: string; filter?: string; page?: string }>;
}) {
  const [{ collection }, query] = await Promise.all([params, searchParams]);
  const meta = getCollectionMeta(collection);
  if (!meta) notFound();

  const user = await requireStudioUser(`/studio/manage/${meta.slug}`);
  const payload = await getPayload();

  const search = query.q ?? "";
  const status = query.status ?? "";
  const filter = query.filter ?? "";
  const page = Math.max(1, Number(query.page ?? "1") || 1);

  const [shell, result] = await Promise.all([
    loadManageShellProps(payload, user),
    listCollectionDocs(payload, user, meta.slug, { search, status, filter, page }),
  ]);

  return (
    <StudioShell
      counts={shell.counts}
      attention={shell.attention}
      userEmail={user.email}
      version={`CMS · ${meta.label}`}
    >
      <CollectionBrowser meta={meta} result={result} search={search} status={status} filter={filter} />
    </StudioShell>
  );
}
