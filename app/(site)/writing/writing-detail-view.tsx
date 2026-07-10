"use client";
import Link from "next/link";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";
import { ArticleBody } from "@/features/writing/article-body";
import type { SerializedEditorState } from "lexical";

interface PostDetail {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  body: unknown;
}

export function WritingDetailView({ post }: { post: PostDetail }) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <main className="container-content flex min-h-svh flex-col gap-8 py-16">
      <Link
        href="/writing"
        className="w-fit font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
      >
        ← {t.writingSection}
      </Link>

      <header className="flex flex-col gap-2 border-b border-border-subtle pb-8">
        <p className="font-mono text-micro text-text-ghost">
          {post.index} · {post.publishedAt}
        </p>
        <h1 className="max-w-[24ch] font-display text-display tracking-[-0.025em]">
          {post.title}
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">{post.standfirst}</p>
      </header>

      {post.body ? (
        <ArticleBody content={post.body as SerializedEditorState} />
      ) : (
        <p className="text-body-sm text-text-tertiary">
          {ar ? "لسه بتتكتب." : "This one's still being written."}
        </p>
      )}
    </main>
  );
}
