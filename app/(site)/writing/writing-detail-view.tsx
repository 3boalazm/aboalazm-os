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
  topics?: string[];
  body: unknown;
}

/**
 * Article page, styled after the Lovable "Editorial Brand Systems"
 * reference: mono meta row with a rule line, oversized display title,
 * large standfirst, bordered topic chips.
 *
 * The article renders in the language it was WRITTEN in — an Arabic
 * essay stays RTL even when the UI chrome is in English. Only the
 * chrome (back link, empty state) follows the UI toggle.
 */
export function WritingDetailView({ post }: { post: PostDetail }) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const postLang = post.lang ?? "en";
  const dir = postLang === "ar" ? "rtl" : "ltr";
  const dateLabel = post.publishedAt ? post.publishedAt.slice(0, 10) : "";

  return (
    <main className="container-content flex min-h-svh flex-col gap-10 py-16">
      <Link
        href="/writing"
        className="w-fit font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
      >
        ← {t.writingSection}
      </Link>

      <header className="border-b border-border-subtle pb-12" dir={dir} lang={postLang}>
        <div className="mb-8 flex flex-wrap items-center gap-4" dir="ltr">
          <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
            <span className="text-accent">{post.index}</span>
            {dateLabel ? <> · {dateLabel}</> : null}
          </span>
          <div className="h-px flex-1 bg-border-subtle" />
          <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-ghost">
            Aboalazm OS / Writing
          </span>
        </div>

        <h1 className="max-w-[16ch] font-display text-display font-bold uppercase leading-[0.98] tracking-[-0.02em]">
          {post.title}
        </h1>

        <p className="mt-8 max-w-[62ch] text-lead font-medium leading-snug text-text-secondary">
          {post.standfirst}
        </p>

        {post.topics && post.topics.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.topics.map((topic) => (
              <span
                key={topic}
                className="border border-border-subtle px-2.5 py-1 font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary"
              >
                {topic}
              </span>
            ))}
          </div>
        ) : null}
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
