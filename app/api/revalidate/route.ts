import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/** Sanity webhook → tag-based ISR revalidation. */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json()) as { _type?: string; slug?: { current?: string } };
  if (body._type) revalidateTag(body._type);
  if (body.slug?.current) revalidateTag(body.slug.current);
  return NextResponse.json({ ok: true, revalidated: body._type ?? null });
}
