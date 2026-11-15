"use client";

/**
 * LANGUAGE BAND — "three scripts, one system" (home, after Practice).
 *
 * The problem it solves is not cosmetic. The OS ships three authored locales
 * (en / ar / ms), but the only affordance was one header button that cycled
 * through them, so two thirds of the system were invisible: a Malaysian
 * visitor could read the whole English site and never learn a Malay one
 * exists. This band states the fact where a visitor actually is, and makes
 * each language a specimen rather than a menu row.
 *
 * Design decisions:
 *  · Each column is set in that language's OWN face — GC EPICPRO for English,
 *    Thmanyah Serif Display for Arabic, Montserrat for Malay — pinned as
 *    literal stacks, not as `var(--font-display)`. The page-level token is
 *    swapped to Thmanyah whenever `dir="rtl"`, so the token version would
 *    have rendered all three columns in the Arabic face on /ar.
 *  · The specimen lines are pulled from lib/i18n (heroLine1–3), the same
 *    strings the hero renders. The band can never advertise copy that is not
 *    on the site.
 *  · Not `<h*>` elements: the RTL base layer forces Thmanyah onto every
 *    heading with `!important`, which would beat the pinned inline stack.
 *  · The Arabic column keeps `lang="ar" dir="rtl"` on its own subtree so the
 *    Arabic face and its zero tracking apply even on /en and /ms.
 *
 * No claims: it says three languages exist and shows them. Nothing about
 * translation quality that a reader cannot verify by clicking.
 */
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { BandFrame } from "@/components/ui/band-frame";
import { Icon } from "@/components/ui/Icon";
import { UI } from "@/lib/i18n";
import { LOCALES, localeHref, type Locale } from "@/lib/locale";
import { joinClasses } from "@/lib/utils";

type LanguageModule = {
  locale: Locale;
  index: string;
  script: string;
  /** The language's name in itself — the specimen. */
  native: string;
  /** Font stack pinned for the specimen, independent of page direction. */
  font: string;
  /** Type scale for the specimen: Arabic needs more line box than caps. */
  specimenClass: string;
  /** Who the locale is for, in the current UI's voice. */
  reach: Record<Locale, string>;
  /** The switch's verb, in the TARGET language. */
  cta: Record<Locale, string>;
};

const MODULES: readonly LanguageModule[] = [
  {
    locale: "en",
    index: "01",
    script: "LATIN",
    native: "English",
    font: '"GC EPICPRO", Georgia, serif',
    specimenClass: "text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.95] tracking-[-0.02em]",
    reach: {
      en: "International clients and hiring teams.",
      ar: "العملاء الدوليون وفرق التوظيف.",
      ms: "Klien antarabangsa dan pasukan pengambilan.",
    },
    cta: { en: "Read in English", ar: "اقرأ بالإنجليزية", ms: "Baca dalam bahasa Inggeris" },
  },
  {
    locale: "ar",
    index: "02",
    script: "ARABIC",
    native: "العربية",
    font: '"Thmanyah Serif Display", "IBM Plex Sans Arabic", sans-serif',
    specimenClass: "text-[clamp(2rem,3.8vw,3rem)] leading-[1.25]",
    reach: {
      en: "Egypt, the Gulf, and Arabic-first brands.",
      ar: "مصر والخليج والبراندات اللي عربيتها أولوية.",
      ms: "Mesir, Teluk dan jenama yang mengutamakan bahasa Arab.",
    },
    cta: { en: "Read in Arabic", ar: "اقرأ بالعربية", ms: "Baca dalam bahasa Arab" },
  },
  {
    locale: "ms",
    index: "03",
    script: "LATIN",
    native: "Bahasa Melayu",
    font: '"Montserrat", system-ui, sans-serif',
    specimenClass: "text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.02] tracking-[-0.03em]",
    reach: {
      en: "Malaysia — the market this studio is moving toward.",
      ar: "ماليزيا — السوق اللي الاستوديو بيتحرك نحوه.",
      ms: "Malaysia — pasaran yang studio ini tuju.",
    },
    cta: { en: "Baca dalam Bahasa Melayu", ar: "اقرأ بالماليزية", ms: "Baca dalam Bahasa Melayu" },
  },
];

const HEADINGS: Record<Locale, { kicker: string; title: [string, string]; lead: string; current: string }> = {
  en: {
    kicker: "SYSTEM LANGUAGES / 03 INSTALLED",
    title: ["Three scripts.", "One system."],
    lead: "Not one site translated three times. Each locale was written in its own voice, set in its own face, and wired to the same pages — switch and you stay exactly where you were.",
    current: "CURRENT",
  },
  ar: {
    kicker: "لغات النظام / 03 مثبتة",
    title: ["ثلاث كتابات.", "نظام واحد."],
    lead: "مش موقع واحد مترجم تلات مرات. كل لغة مكتوبة بصوتها، وبخطها، ومربوطة بنفس الصفحات — بدّل وتفضل في نفس المكان اللي كنت فيه.",
    current: "الحالية",
  },
  ms: {
    kicker: "BAHASA SISTEM / 03 DIPASANG",
    title: ["Tiga tulisan.", "Satu sistem."],
    lead: "Bukan satu laman yang diterjemah tiga kali. Setiap bahasa ditulis dengan suaranya sendiri, disusun dengan fonnya sendiri, dan disambung ke halaman yang sama — tukar dan anda kekal di tempat yang sama.",
    current: "SEMASA",
  },
};

export function LanguageBand() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const heading = HEADINGS[lang];

  return (
    <section
      aria-label={ar ? "لغات النظام" : lang === "ms" ? "Bahasa sistem" : "System languages"}
      className="relative container-content py-4"
    >
      {/* Three scripts, one system — so the header sits on the bilingual site
          that is the proof of it. The cards below stay on the page canvas:
          a swipe shelf inside a photo panel would fight itself. */}
      <BandFrame
        src="/images/work/dev-cards/nile-pharma-storefront-card.jpg"
        veil="full"
        contentClassName="flex flex-col gap-2 max-lg:p-4"
      >
        <p className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.14em] text-accent">
          <span aria-hidden className="size-1.5 rounded-pill bg-accent" />
          {heading.kicker}
        </p>
        <h2 className="max-w-[24ch] font-display text-title leading-[1.02] tracking-[-0.025em] text-text-primary">
          {heading.title[0]} <em className="text-accent">{heading.title[1]}</em>
        </h2>
        <p className="max-w-[62ch] text-body-sm leading-relaxed text-text-secondary">{heading.lead}</p>
      </BandFrame>

      <ul className="grid gap-2 max-md:-mx-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:grid-cols-3">
        {MODULES.map((module) => {
          const current = module.locale === lang;
          const isArabicColumn = module.locale === "ar";
          const specimen = UI[module.locale];
          return (
            <li
              key={module.locale}
              data-active={current ? "true" : "false"}
              className={joinClasses(
                "group relative flex min-w-0 flex-col overflow-hidden rounded-panel border p-4 transition-colors duration-base ease-physics max-md:w-[84%] max-md:shrink-0 max-md:snap-start",
                current
                  ? "border-accent/45 bg-surface-2"
                  : "border-border-subtle bg-surface-1 hover:border-border-strong",
              )}
            >
              {/* Module header — reads like a slot in a system readout. */}
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-text-ghost">
                <span className="flex items-center gap-1.5">
                  <span className="text-accent">{module.index}</span>
                  {module.script}
                </span>
                {current ? (
                  /* JetBrains Mono carries no Arabic; without a face of its own
                   the badge's الحالية falls through to the device default. */
                <span
                  className="inline-flex items-center gap-1 rounded-pill border border-accent/45 px-1.5 py-0.5 text-accent"
                  style={ar ? { fontFamily: "var(--font-arabic)", letterSpacing: 0 } : undefined}
                >
                    <span aria-hidden className="size-1 rounded-pill bg-accent" />
                    {heading.current}
                  </span>
                ) : (
                  <span>{isArabicColumn ? "RTL" : "LTR"}</span>
                )}
              </div>

              {/* The specimen: the language's own name in its own face, at
                  poster scale. This is the whole argument of the band. */}
              <p
                lang={module.locale}
                dir={isArabicColumn ? "rtl" : "ltr"}
                aria-hidden
                className={joinClasses("mt-3 min-w-0 text-text-primary", module.specimenClass)}
                style={{ fontFamily: module.font, letterSpacing: isArabicColumn ? 0 : undefined }}
              >
                {module.native}
              </p>

              {/* Proof, not a promise: the actual hero copy for that locale.
                  Arabic is set in the Arabic body face, not in the mono stack:
                  JetBrains Mono is Latin-only, so an Arabic sentence in it
                  falls back to whatever the device happens to have. */}
              <p
                lang={module.locale}
                dir={isArabicColumn ? "rtl" : "ltr"}
                className="mt-3 border-t border-border-subtle pt-3 text-[13px] leading-relaxed text-text-tertiary"
                style={{ letterSpacing: isArabicColumn ? 0 : "0.04em" }}
              >
                {specimen.heroLine1} {specimen.heroLine2} {specimen.heroLine3}
              </p>

              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-text-secondary">{module.reach[lang]}</p>

              {/* The active card's header badge already says CURRENT; a second
                  pill saying the same thing was a no-op button competing with
                  the real ones. Its space is kept so the three cards stay on
                  one baseline. */}
              {current ? (
                <p
                  aria-hidden
                  className="mt-3 inline-flex h-[1.85rem] items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.06em] text-text-ghost"
                >
                  <Icon name="check" size={12} className="text-accent" />
                  {lang === "ar" ? "أنت هنا" : lang === "ms" ? "Anda di sini" : "You are here"}
                </p>
              ) : (
                <Link
                  href={localeHref("/", module.locale)}
                  hrefLang={module.locale}
                  lang={module.locale}
                  className="mt-3 inline-flex h-[1.85rem] w-fit items-center gap-1.5 rounded-pill border border-border-default px-2.5 font-mono text-[12px] uppercase tracking-[0.06em] text-text-primary transition-colors duration-base ease-physics hover:border-accent hover:text-accent"
                >
                  {module.cta[lang]}
                  <Icon name="arrow-right" size={12} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Honest footnote — the one thing a machine translation cannot claim. */}
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-subtle pt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-text-ghost">
        {LOCALES.map((locale) => (
          <span key={locale} className="inline-flex items-center gap-1.5" lang={locale}>
            <span aria-hidden className="size-1 rounded-pill bg-accent/60" />
            {locale.toUpperCase()}
          </span>
        ))}
        <span className="ms-auto normal-case tracking-normal">
          {ar
            ? "نفس الصفحة، بنفس العنوان — بيتغير الخط والاتجاه والكلام بس."
            : lang === "ms"
              ? "Halaman yang sama, alamat yang sama — hanya fon, arah dan kata-kata berubah."
              : "Same page, same URL — only the face, the direction and the words change."}
        </span>
      </p>
    </section>
  );
}
