"use client";

/**
 * INSIGHTS TEASER — the journal surfaces on the home page (overhaul S2,
 * spec §4.3-08). 27 posts were buried in a "MORE" menu; three latest now
 * sit inside the funnel. Prefers posts in the current UI language, falls
 * back to the other language rather than rendering thin.
 */
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";

export interface TeaserPost {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  lang: "en" | "ar";
  topics: string[];
}

export function InsightsTeaser({ posts }: { posts: TeaserPost[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  if (posts.length === 0) return null;

  const mine = posts.filter((p) => p.lang === (ar ? "ar" : "en"));
  const picked = (mine.length >= 3 ? mine : [...mine, ...posts.filter((p) => !mine.includes(p))]).slice(0, 3);

  const fmt = new Intl.DateTimeFormat(ar ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-[46ch] flex-col gap-1">
          <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
            {ar ? (
              <>المذكرات الشغالة. <em className="text-accent">المنهج مكتوب، مش سر.</em></>
            ) : (
              <>Working notes. <em className="text-accent">The method is published, not secret.</em></>
            )}
          </h2>
          <p className="text-body-sm text-text-secondary">
            {ar
              ? "مقالات طويلة عن الهوية، الأنظمة، والتصميم ثنائي اللغة — نفس المنهج اللي بيتطبق على مشروعك."
              : "Long-form essays on identity, systems, and bilingual design — the same method applied to your project."}
          </p>
        </div>
        <Link
          href="/writing"
          className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
        >
          {ar ? "كل المقالات" : "All writing"}
          <span aria-hidden className="ms-1 inline-flex">
            <Icon name="arrow-right" />
          </span>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {picked.map((p) => (
          <Link
            key={p.slug}
            href={`/writing/${p.slug}`}
            className="group flex flex-col gap-2 rounded-panel border border-border-subtle bg-surface-1/40 p-3 transition-colors duration-base ease-physics hover:border-border-default md:p-4"
          >
            <div className="flex items-center justify-between gap-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              <span>{p.index}</span>
              <time dateTime={p.publishedAt}>{p.publishedAt ? fmt.format(new Date(p.publishedAt)) : ""}</time>
            </div>
            <h3 className="font-display text-subtitle leading-[1.2] tracking-[-0.01em] text-text-primary transition-colors duration-base ease-physics group-hover:text-accent">
              {p.title}
            </h3>
            <p className="text-body-sm leading-[1.65] text-text-secondary">{p.standfirst}</p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                {p.topics.slice(0, 2).join(" + ")}
              </p>
              <span aria-hidden className="inline-flex text-text-ghost transition-all duration-base ease-physics group-hover:translate-x-1 group-hover:text-accent rtl:group-hover:-translate-x-1">
                <Icon name="arrow-right" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
