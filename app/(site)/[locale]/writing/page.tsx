import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { WritingView } from "./writing-view";
import { getPosts } from "@/lib/content";

export const revalidate = 60;


const pageMetadata: Metadata = {
  title: "Writing — Notes from the system",
  description: "Working documents on identity, tokens, and the craft of bilingual design.",
};

export default async function WritingPage() {
  const posts = await getPosts();
  return <WritingView posts={posts} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/writing');
}
