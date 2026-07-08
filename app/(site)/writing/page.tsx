import type { Metadata } from "next";
import { WritingView } from "./writing-view";
import { getPosts } from "@/lib/content";

export const revalidate = 60;


export const metadata: Metadata = {
  title: "Writing — Notes from the system",
  description: "Working documents on identity, tokens, and the craft of bilingual design.",
};

export default async function WritingPage() {
  const posts = await getPosts();
  return <WritingView posts={posts} />;
}
