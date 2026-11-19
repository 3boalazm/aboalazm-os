import { NextResponse, type NextRequest } from "next/server";
import { WRITING_POSTS } from "@/scripts/writing-posts-list";

const articleSlugs = new Set(WRITING_POSTS.map((post) => post.slug));
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  // /studio is its own root document (app/studio/layout.tsx), exactly like
  // /admin. Without this guard every console URL fell through to the locale
  // rewrite below and became /en/studio → 404.
  if (path === "/studio" || path.startsWith("/studio/")) return NextResponse.next();
  // The unprefixed English request is rewritten to this internal segment.
  // Let it resolve directly: redirecting it back creates a rewrite/redirect loop.
  // Every English page declares its original, unprefixed canonical address.
  if (path === "/en" || path.startsWith("/en/")) return NextResponse.next();
  // Existing Arabic article links migrate without losing their content.
  if (/^\/writing\/.+-ar$/.test(path)) {
    url.pathname = `/ar${path}`;
    return NextResponse.redirect(url, 308);
  }
  if (path.startsWith("/ar/writing/")) {
    const slug = path.slice("/ar/writing/".length);
    if (!slug.endsWith("-ar") && articleSlugs.has(`${slug}-ar`)) {
      url.pathname = `/ar/writing/${slug}-ar`;
      return NextResponse.redirect(url, 308);
    }
  }
  if (path === "/ar" || path.startsWith("/ar/")) return NextResponse.next();
  url.pathname = `/en${path === "/" ? "" : path}`;
  return NextResponse.rewrite(url);
}
export const config = {
  matcher: ["/((?!api(?:/|$)|admin(?:/|$)|studio(?:/|$)|_next/|fonts/|images/|icons/|showcase/|cv(?:/|$)|portfolio(?:/|$)|.*\\.[a-zA-Z0-9]+$).*)"],
};
