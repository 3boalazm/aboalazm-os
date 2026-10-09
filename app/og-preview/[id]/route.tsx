import { ogImage, OG_PAGES, type OgPageId } from "@/lib/og-pages";

// TEMPORARY dev-only preview helper — do not commit.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(id in OG_PAGES)) return new Response("unknown id", { status: 404 });
  return ogImage(id as OgPageId);
}
