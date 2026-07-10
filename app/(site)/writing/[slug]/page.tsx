import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getAllPostSlugs, getPosts } from "@/lib/content";
import { WritingDetailView } from "../writing-detail-view";

export const revalidate = 60;

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
  if (!post) return {};
  return {
    title: post.title,
    description: post.standfirst,
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

  return (
    <WritingDetailView
      post={post}
      prev={prev ? { slug: prev.slug, title: prev.title, index: prev.index } : null}
      next={next ? { slug: next.slug, title: next.title, index: next.index } : null}
    />
  );
}
