"use client";
import Link from "next/link";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";

interface WritingEntry {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  lang?: "en" | "ar";
}

/**
 * Language pairing convention: an Arabic post shares its English
 * counterpart's slug plus an `-ar` suffix. The list shows the posts
 * written in the active UI language, and falls back to the other
 * language for essays that were never translated — so nothing ever
 * disappears from the index, and nothing shows up twice.
 */
function visibleIn(posts: readonly WritingEntry[], lang: "en" | "ar") {
  const slugs = new Set(posts.map((p) => p.slug));
  return posts.filter((post) => {
    const postLang = post.lang ?? "en";
    if (postLang === lang) return true;
    // Fall back to the other language only when no counterpart exists.
    const counterpart = postLang === "ar" ? post.slug.replace(/-ar$/, "") : `${post.slug}-ar`;
    return !slugs.has(counterpart);
  });
}

export function WritingView({ posts }: { posts: readonly WritingEntry[] }) {
  const t = useT();
  const { lang } = useLang();
  const visible = visibleIn(posts, lang);

  return (
    <main className="container-content flex min-h-svh flex-col gap-8 py-16">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          {t.writingSection}
        </p>
        <h1 className="font-display text-display tracking-[-0.025em]">
          {t.writingTitle}
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">
          {t.writingLead}
        </p>
      </header>

      <ol>
        {visible.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="group grid grid-cols-[4rem_1fr] items-baseline gap-2 border-b border-border-subtle py-3 md:grid-cols-[4rem_1fr_auto]"
            >
              <span className="font-mono text-micro text-text-ghost">{post.index}</span>
              <span>
                <span
                  className="relative font-display text-title tracking-[-0.015em] text-text-primary"
                  dir={(post.lang ?? "en") === "ar" ? "rtl" : "ltr"}
                >
                  {post.title}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-slow ease-physics group-hover:scale-x-100" />
                </span>
                <span
                  className="mt-1 block text-body-sm text-text-secondary"
                  dir={(post.lang ?? "en") === "ar" ? "rtl" : "ltr"}
                >
                  {post.standfirst}
                </span>
              </span>
              <span className="hidden font-mono text-micro text-text-tertiary md:block">
                {post.publishedAt}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        {t.writingFooter}
      </p>
    </main>
  );
}
