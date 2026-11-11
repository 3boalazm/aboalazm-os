import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost as fetchPost, getAllPostSlugs, getPosts } from "@/lib/content";
import { WritingDetailView } from "../writing-detail-view";
import { JsonLd } from "@/components/seo/json-ld";
import { getArticleSchema } from "@/lib/structured-data";

export const revalidate = 60;

// Shared by generateMetadata and the page so a lookup costs one DB hit.
const getPost = cache(fetchPost);
const getAllPosts = cache(getPosts);

// Counterpart in the other language (slug convention: `-ar` suffix), or null
// when the post has no pair.
function findCounterpartSlug(
  slug: string,
  lang: Locale,
  all: { slug: string }[],
) {
  const counterpart = lang === "ar" ? slug.replace(/-ar$/, "") : `${slug}-ar`;
  return all.some((p) => p.slug === counterpart) ? counterpart : null;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function originalMetadata({
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
  // Only advertise the other locale when that translation really exists.
  const hasCounterpart =
    findCounterpartSlug(slug, post.lang ?? "en", await getAllPosts()) !== null;
  // A page-level openGraph replaces the layout's, so siteName is restated.
  // og:title / og:description are left to inherit from title / description
  // (so the layout's "· Mustafa Aboalazm" title template applies).
  return {
    title: post.title,
    description: post.standfirst,
    openGraph: {
      type: "article",
      locale: isAr ? "ar_EG" : "en_US",
      ...(hasCounterpart ? { alternateLocale: isAr ? "en_US" : "ar_EG" } : {}),
      siteName: "Mustafa Aboalazm",
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
  const all = await getAllPosts();
  const sameLang = all.filter((p) => p.lang === (post.lang ?? "en"));
  const i = sameLang.findIndex((p) => p.slug === slug);
  const next = i > 0 ? sameLang[i - 1] : null; // newer
  const prev = i >= 0 && i < sameLang.length - 1 ? sameLang[i + 1] : null; // older

  // Lets the view hot-swap the article when the UI language toggles.
  const counterpartSlug = findCounterpartSlug(slug, post.lang ?? "en", all);

  return (
    <>
      {/* Overhaul S6: Article JSON-LD (QA #48) */}
      <JsonLd data={getArticleSchema(post)} />
      <WritingDetailView
      post={post}
      prev={prev ? { slug: prev.slug, title: prev.title, index: prev.index } : null}
      next={next ? { slug: next.slug, title: next.title, index: next.index } : null}
      counterpartSlug={counterpartSlug}
      />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: Locale }> }): Promise<Metadata> {
  const values = await params;
  const base = await originalMetadata({ params });
  const post = await getPost(values.slug);
  const actualLocale = post?.lang === "ar" ? "ar" : "en";
  const counterpart = post ? findCounterpartSlug(values.slug, actualLocale, await getAllPosts()) : null;
  const own = actualLocale === "ar" ? `/ar/writing/${values.slug}` : `/writing/${values.slug}`;
  const languages = counterpart ? { en: actualLocale === "en" ? own : `/writing/${counterpart}`, ar: actualLocale === "ar" ? own : `/ar/writing/${counterpart}` } : undefined;
  return { ...base, alternates: { canonical: own, ...(languages ? { languages } : {}) }, openGraph: { ...base.openGraph, url: own } };
}
