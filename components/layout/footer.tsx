"use client";
import { CairoClock } from "./cairo-clock";
import { useT } from "@/hooks/use-t";

/**
 * FOOTER — old-site structure (Pages / Reach / Portfolio) in the
 * new system's voice. Bilingual via useLang.
 */
import Link from "@/components/ui/localized-link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/providers/lang-provider";
import { localeHref } from "@/lib/locale";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_EMAIL_HREF } from "@/lib/contact-details";

/* Overhaul 2026-10-14 (S1): four lean columns keyed to the audience's
   question — "how do I engage", "what is this place", "what does he think",
   "how do I reach him". Retired pages (why/capabilities/start/work-ui) left
   the map; everything below resolves. Dedupe rules: one CV link, one deck. */
const COLUMNS = [
  {
    head: ["ENGAGE", "التعاون"],
    links: [
      ["Book a Discovery Call", "احجز مكالمة استكشاف", "/contact"],
      ["Services", "الخدمات", "/services"],
      ["Brand Identity", "الهوية البصرية", "/services/brand-identity"],
      ["Digital Experience", "التجربة الرقمية", "/services/websites"],
      ["Business Systems", "أنظمة التشغيل", "/services/systems"],
      ["Partnership & Support", "الشراكة والدعم", "/partnership"],
      ["Pricing", "التسعير", "/pricing"],
      ["Agreement", "الاتفاقية", "/agreement"],
      ["Book with a Deposit", "احجز بعربون", "/book"],
    ],
  },
  {
    head: ["STUDIO", "الاستوديو"],
    links: [
      ["About", "نبذة", "/about"],
      ["Process", "المنهجية", "/process"],
      ["Work", "الأعمال", "/work"],
      ["Labs", "المعمل", "/labs"],
      ["Portfolio Deck ↓", "عرض تقديمي ↓", "/portfolio"],
    ],
  },
  {
    head: ["INSIGHTS", "الرؤى"],
    links: [
      ["Writing", "مقالات", "/writing"],
      ["Reels", "ريلز", "/reels"],
      ["Library", "المكتبة", "/books"],
      ["Resources", "المصادر", "/resources"],
      ["Wall", "الحيطة", "/work"],
    ],
  },
  {
    head: ["REACH", "تواصل"],
    links: [
      ["Email ↗", "إيميل ↗", CONTACT_EMAIL_HREF],
      ["WhatsApp ↗", "واتساب ↗", "https://wa.me/201092500454"],
      ["Download CV ↓", "تحميل السيرة الذاتية ↓", "/cv"],
      ["Behance ↗", "بيهانس ↗", "https://www.behance.net/aboalazm"],
      ["LinkedIn ↗", "لينكدإن ↗", "https://www.linkedin.com/in/aboalazm"],
      ["GitHub ↗", "جيت هب ↗", "https://github.com/3boalazm"],
    ],
  },
] as const;

export function Footer() {
  const t = useT();
  const { lang } = useLang();
  const pathname = usePathname();
  const ar = lang === "ar";
  /* Brand | links sit side by side only from `lg`. At `md` the right track was 410px, so the four
     link columns were ~78px each - narrower than "WhatsApp" + icon (120px) - and REACH pushed the
     page up to 18px wider than the viewport (768-877px, English) while labels wrapped to three
     lines. Below `lg` the brand stacks above four full-width columns, as it already did under 768. */
  return (
    <footer className="ground ground-plum !pb-0">
      <div className="container-wide grid gap-8 py-8 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="brand-orb h-8 w-8">
              <span className="brand-orb__glow" aria-hidden />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/work/icon.png"
                alt={t.footerBrandAlt}
                className="brand-orb__img h-8 w-8"
              />
            </span>
            <p className="font-display text-[1.6rem] leading-none tracking-[-0.02em]">
              M<em className="not-italic text-accent">A</em>.
            </p>
          </div>
          <p className="max-w-[32ch] text-body-sm text-text-tertiary">
            {ar
              ? "مصمم هوية بصرية أول وشريك مؤسس في Code & Canvas. نبني البراندات بوضوح وحِرفة واحترام للشغل."
              : "Senior Brand Identity Designer & Co-founder, Code & Canvas. Building brands with clarity, craft, and a respect for the work."}
          </p>

          {/* Languages as a visible fact, not a hidden setting. The site is
              authored in three locales; stating them in the footer is what
              makes the third one (Malay) believable when a visitor lands on
              the English page from a search result. Each option is a real
              link to that locale's version of THIS page. */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-caption uppercase tracking-[0.12em] text-text-ghost">
              {ar ? "اللغات" : lang === "ms" ? "BAHASA" : "LANGUAGES"}
            </span>
            {(["en", "ar", "ms"] as const).map((locale) => (
              <Link
                key={locale}
                href={localeHref(pathname ?? "/", locale)}
                hrefLang={locale}
                lang={locale}
                aria-current={locale === lang ? "true" : undefined}
                /* العربية is Arabic inside a Latin mono chip — give it the
                   Arabic face explicitly rather than the device default. */
                style={locale === "ar" ? { fontFamily: "var(--font-arabic)", letterSpacing: 0 } : undefined}
                className={[
                  "rounded-pill border px-2 py-0.5 font-mono text-[12px] leading-tight transition-colors duration-base ease-physics",
                  locale === lang
                    ? "border-accent/45 text-accent"
                    : "border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-primary",
                ].join(" ")}
              >
                {locale === "ar" ? "العربية" : locale === "ms" ? "Bahasa Melayu" : "English"}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav
              key={col.head[0]}
              aria-label={ar ? col.head[1] : col.head[0]}
              className="flex flex-col gap-1"
            >
              <p className="font-display font-display-sm text-caption uppercase tracking-[0.12em] text-text-ghost">
                {ar ? col.head[1] : col.head[0]}
              </p>
              <div className="flex flex-col gap-1">
                {col.links.map(([en, arr, href]) => {
                  const label = ar ? arr : en;
                  /* Trailing ↗/↓ used to be baked into these strings;
                     the icon system renders them now (RTL-safe). */
                  const outbound = label.endsWith("↗");
                  const download = label.endsWith("↓");
                  const text = label.replace(/\s*[↗↓]$/, "");
                  return (
                    <Link
                      key={href}
                      href={href}
                      {...(href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-flex w-fit items-center gap-1 text-body-sm text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
                    >
                      {text}
                      {outbound && <Icon name="arrow-up-right" size="0.9em" className="text-text-ghost" />}
                      {download && <Icon name="arrow-down" size="0.9em" className="text-text-ghost" />}
                    </Link>
                  );
                })}
              </div>
            </nav>
          ))}
        </div>
      </div>

      {/* The name at page width, cropped by its own box — the sign-off.
          Decorative: the brand is already named in the block above. */}
      <p aria-hidden className="footer-wordmark container-wide">
        ABOAL<em>A</em>ZM
      </p>

      {/* pb clears the fixed OS tray: it retracts while you scroll down but
          returns the moment you scroll up, and the last line of a page is
          exactly where people scroll up to check something. */}
      <div className="container-wide flex flex-wrap items-baseline justify-between gap-2 border-t border-border-subtle pb-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] pt-3 sm:pb-3">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          © 2026 MUSTAFA ABOALAZM — {ar ? "جميع الحقوق محفوظة" : lang === "ms" ? "HAK CIPTA TERPELIHARA" : "ALL RIGHTS RESERVED"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          <CairoClock label={ar ? "العبور، القاهرة" : "AL OBOUR, CAIRO"} />
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost max-sm:hidden">
          {ar ? "Ctrl + K بحث · Ctrl + ` ترمينال" : lang === "ms" ? "CTRL + K CARI · CTRL + ` TERMINAL" : "CTRL + K SEARCH · CTRL + ` TERMINAL"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "صُمم وبُني داخل الاستوديو" : lang === "ms" ? "DIREKA & DIBINA OLEH STUDIO" : "DESIGNED & BUILT BY THE STUDIO"}
        </p>
      </div>
    </footer>
  );
}
