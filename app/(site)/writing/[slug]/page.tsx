import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost as fetchPost, getAllPostSlugs, getPosts } from "@/lib/content";
import { WritingDetailView } from "../writing-detail-view";

export const revalidate = 60;

// Shared by generateMetadata and the page so a lookup costs one DB hit.
const getPost = cache(fetchPost);

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  // Throw here too: the Suspense boundary can flush a 200 before the page
  // body calls notFound(), so metadata is what makes the status a real 404.
  if (!post) notFound();
  const isAr = post.lang === "ar";
  // A page-level openGraph replaces the layout's, so siteName is restated.
  // og:title / og:description are left to inherit from title / description
  // (keeps the "· Aboalazm OS" title template identical to before).
  return {
    title: post.title,
    description: post.standfirst,
    openGraph: {
      type: "article",
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? "en_US" : "ar_EG",
      siteName: "Mustafa Aboalazm OS",
      url: `/writing/${slug}`,
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
    },
  };
}

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Prev/next within the same language, in publishedAt order
  // (getPosts is sorted newest-first).
  const all = await getPosts();
  const sameLang = all.filter((p) => p.lang === (post.lang ?? "en"));
  const i = sameLang.findIndex((p) => p.slug === slug);
  const next = i > 0 ? sameLang[i - 1] : null; // newer
  const prev = i >= 0 && i < sameLang.length - 1 ? sameLang[i + 1] : null; // older

  // Counterpart in the other language (slug convention: `-ar` suffix) —
  // lets the view hot-swap the article when the UI language toggles.
  const counterpart =
    (post.lang ?? "en") === "ar" ? slug.replace(/-ar$/, "") : `${slug}-ar`;
  const counterpartSlug = all.some((p) => p.slug === counterpart) ? counterpart : null;

  return (
    <WritingDetailView
      post={post}
      prev={prev ? { slug: prev.slug, title: prev.title, index: prev.index } : null}
      next={next ? { slug: next.slug, title: next.title, index: next.index } : null}
      counterpartSlug={counterpartSlug}
    />
  );
}
