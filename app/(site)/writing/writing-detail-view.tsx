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
  lang?: "en" | "ar";
  body: unknown;
}

/**
 * The article itself renders in the language it was WRITTEN in — an
 * Arabic essay stays RTL even when the UI chrome is in English, and
 * vice versa. Only the surrounding chrome (back link, empty state)
 * follows the UI toggle.
 */
export function WritingDetailView({ post }: { post: PostDetail }) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const postLang = post.lang ?? "en";
  const dir = postLang === "ar" ? "rtl" : "ltr";

  return (
    <main className="container-content flex min-h-svh flex-col gap-8 py-16">
      <Link
        href="/writing"
        className="w-fit font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
      >
        ← {t.writingSection}
      </Link>

      <header className="flex flex-col gap-2 border-b border-border-subtle pb-8" dir={dir} lang={postLang}>
        <p className="font-mono text-micro text-text-ghost" dir="ltr">
          {post.index} · {post.publishedAt}
        </p>
        <h1 className="max-w-[24ch] font-display text-display tracking-[-0.025em]">
          {post.title}
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">{post.standfirst}</p>
      </header>

      {post.body ? (
        <article dir={dir} lang={postLang}>
          <ArticleBody content={post.body as SerializedEditorState} />
        </article>
      ) : (
        <p className="text-body-sm text-text-tertiary">
          {ar ? "لسه بتتكتب." : "This one's still being written."}
        </p>
      )}
    </main>
  );
}
