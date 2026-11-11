"use client";
import type { Locale } from "@/lib/locale";
import { useMemo, useState } from "react";
import Link from "@/components/ui/localized-link";
import { trackEvent } from "@/lib/analytics";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";

interface WritingEntry {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  lang?: Locale;
  topics?: string[];
}

const WEEKDAYS: Record<Locale, readonly string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  ms: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],
};

/** "Wednesday 15/7/2026" / "الأربعاء 15/7/2026" — full weekday name, no leading zeros. */
function formatFullDate(iso: string, lang: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const weekday = WEEKDAYS[lang][d.getUTCDay()];
  return `${weekday} ${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`;
}

/**
 * Language pairing convention: an Arabic post shares its English
 * counterpart's slug plus an `-ar` suffix. The list shows the posts
 * written in the active UI language, and falls back to the other
 * language for essays that were never translated — so nothing ever
 * disappears from the index, and nothing shows up twice.
 */
function visibleIn(posts: readonly WritingEntry[], lang: Locale) {
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

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const topics = useMemo(
    () => Array.from(new Set(visible.flatMap((p) => p.topics ?? []))).sort(),
    [visible],
  );

  const filtered = useMemo(() => {
    // `posts` already arrives sorted newest-first from the server; only
    // reverse for "oldest", never re-sort by string date (would break
    // full ISO vs. display-format assumptions).
    const base = activeTopic ? visible.filter((p) => (p.topics ?? []).includes(activeTopic)) : visible;
    return sortOrder === "oldest" ? [...base].reverse() : base;
  }, [visible, activeTopic, sortOrder]);

  return (
    <main className="container-content flex min-h-[calc(100svh-var(--nav-clearance))] flex-col gap-8 pb-6">
      <header className="flex flex-col gap-2">
        <Heading
          eyebrow={t.writingSection}
          title={t.writingTitle}
          subtitle={t.writingLead}
          subtitleClassName="max-w-[52ch]"
        />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-1 flex flex-wrap gap-2 px-1">
          <button
            type="button"
            onClick={() => setActiveTopic(null)}
            aria-pressed={activeTopic === null}
            className={`rounded-pill border px-3 py-1.5 font-mono text-micro uppercase tracking-[0.08em] transition-colors duration-base ease-physics ${
              activeTopic === null
                ? "border-accent text-accent"
                : "border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-primary"
            }`}
          >
            {t.writingAllTopics}
          </button>
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
              aria-pressed={activeTopic === topic}
              className={`rounded-pill border px-3 py-1.5 font-mono text-micro uppercase tracking-[0.08em] transition-colors duration-base ease-physics ${
                activeTopic === topic
                  ? "border-accent text-accent"
                  : "border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-primary"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1 font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary">
          <button
            type="button"
            onClick={() => setSortOrder("newest")}
            aria-pressed={sortOrder === "newest"}
            className={`rounded-pill px-2.5 py-1 transition-colors duration-base ease-physics ${
              sortOrder === "newest" ? "text-accent" : "hover:text-text-primary"
            }`}
          >
            {t.writingSortNewest}
          </button>
          <span aria-hidden className="text-text-ghost">·</span>
          <button
            type="button"
            onClick={() => setSortOrder("oldest")}
            aria-pressed={sortOrder === "oldest"}
            className={`rounded-pill px-2.5 py-1 transition-colors duration-base ease-physics ${
              sortOrder === "oldest" ? "text-accent" : "hover:text-text-primary"
            }`}
          >
            {t.writingSortOldest}
          </button>
        </div>
      </div>

      <ol>
        {filtered.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              onClick={() => trackEvent("insight_open", { slug: post.slug, surface: "archive" })}
              className="group grid grid-cols-[4rem_minmax(0,1fr)] items-baseline gap-2 border-b border-border-subtle py-3 md:grid-cols-[4rem_minmax(0,1fr)_auto]"
            >
              <span className="font-mono text-micro text-text-ghost">{post.index}</span>
              <span className="min-w-0 [overflow-wrap:anywhere]">
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
              <span className="hidden whitespace-nowrap font-mono text-micro text-text-tertiary md:block">
                {formatFullDate(post.publishedAt, lang)}
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
