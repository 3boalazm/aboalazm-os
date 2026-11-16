"use client";

/**
 * INSIGHTS TEASER — the journal surfaces on the home page (overhaul S2,
 * spec §4.3-08). 27 posts were buried in a "MORE" menu; three latest now
 * sit inside the funnel. Prefers posts in the current UI language, falls
 * back to the other language rather than rendering thin.
 */
import type { Locale } from "@/lib/locale";
import Link from "@/components/ui/localized-link";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/components/providers/lang-provider";
import { BandFrame } from "@/components/ui/band-frame";
import { Icon } from "@/components/ui/Icon";

export interface TeaserPost {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  lang: Locale;
  topics: string[];
}

/* Expressive roles for the typographic covers — accent anchor first, then
   the three supporting roles. */
const COVER_COLORS = [
  "var(--color-accent)",
  "var(--color-creative)",
  "var(--color-live)",
  "var(--color-proof)",
] as const;

export function InsightsTeaser({ posts }: { posts: TeaserPost[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  if (posts.length === 0) return null;

  const mine = posts.filter((p) => p.lang === (ar ? "ar" : "en"));
  const picked = (mine.length >= 3 ? mine : [...mine, ...posts.filter((p) => !mine.includes(p))]).slice(0, 3);

  const fmt = new Intl.DateTimeFormat(ar ? "ar-EG-u-nu-latn" : lang === "ms" ? "ms-MY" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* The essays are about systems, and the band's own cover is a system:
          the ERP console the method produced. Type stays on the page canvas
          below — the covers under it carry the colour. */}
      <BandFrame
        src="/images/generated/band-insights.jpg"
        veil="start"
        contentClassName="flex flex-col gap-2 max-lg:p-4 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex max-w-[46ch] flex-col gap-1">
          <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
            {ar ? (
              <>المذكرات الشغالة. <em className="text-accent">المنهج مكتوب، مش سر.</em></>
            ) : lang === "ms" ? (
              <>Nota kerja. <em className="text-accent">Kaedahnya diterbitkan, bukan rahsia.</em></>
            ) : (
              <>Working notes. <em className="text-accent">The method is published, not secret.</em></>
            )}
          </h2>
          <p className="text-body-sm text-text-secondary">
            {ar
              ? "مقالات طويلة عن الهوية، الأنظمة، والتصميم ثنائي اللغة — نفس المنهج اللي بيتطبق على مشروعك."
              : lang === "ms"
                ? "Esei panjang tentang identiti, sistem, dan reka bentuk dwibahasa — kaedah yang sama digunakan untuk projek anda."
                : "Long-form essays on identity, systems, and bilingual design — the same method applied to your project."}
          </p>
        </div>
        <Link
          href="/writing"
          className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
        >
          {ar ? "كل المقالات" : lang === "ms" ? "Semua tulisan" : "All writing"}
          <span aria-hidden className="ms-1 inline-flex">
            <Icon name="arrow-right" />
          </span>
        </Link>
      </BandFrame>

      <div className="grid gap-4 max-md:-mx-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:gap-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:grid-cols-3">
        {picked.map((p, i) => (
          <Link
            key={p.slug}
            href={`/writing/${p.slug}`}
            onClick={() => trackEvent("insight_open", { slug: p.slug, surface: "home_teaser" })}
            className="group flex flex-col overflow-hidden rounded-panel border border-border-subtle bg-surface-1/40 transition-colors duration-base ease-physics hover:border-border-default max-md:w-[84%] max-md:shrink-0 max-md:snap-start"
          >
            {/* Typographic cover — the teaser data carries no image, so the
                cover is a gradient field with the post number at poster
                scale (the Finova idiom). Rotates through the expressive
                roles so the three cards never match. */}
            <div
              aria-hidden
              className="relative flex aspect-[16/9] shrink-0 items-end overflow-hidden"
              style={{
                background: `radial-gradient(110% 130% at 18% 0%, color-mix(in srgb, ${COVER_COLORS[i % COVER_COLORS.length]} 62%, transparent), transparent 62%), radial-gradient(120% 120% at 92% 100%, color-mix(in srgb, ${COVER_COLORS[(i + 2) % COVER_COLORS.length]} 40%, transparent), transparent 65%), var(--color-surface-2)`,
              }}
            >
              <span className="p-3 font-display text-title leading-none tracking-[-0.02em] text-alabaster md:p-4">
                {p.index}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
              <div className="flex items-center justify-between gap-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
