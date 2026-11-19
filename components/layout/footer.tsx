"use client";

/**
 * FOOTER — new site language (2026-11-16), written from zero.
 * Three link columns, the two locales as real links to THIS page, the
 * Cairo clock, and the name at page width as an outlined sign-off.
 */
import { usePathname } from "next/navigation";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { localeHref } from "@/lib/locale";
import { CONTACT_EMAIL_HREF } from "@/lib/contact-details";
import { CairoClock } from "./cairo-clock";

const COLUMNS: { head: [string, string]; links: [string, string, string][] }[] = [
  {
    head: ["Engage", "التعاون"],
    links: [
      ["Book a discovery call", "احجز مكالمة استكشافية", "/contact"],
      ["Services", "الخدمات", "/services"],
      ["Pricing", "الأسعار", "/pricing"],
      ["Partnership & support", "الشراكة والدعم", "/partnership"],
      ["Agreement", "الاتفاقية", "/agreement"],
      ["Book with a deposit", "احجز بعربون", "/book"],
      ["Privacy policy", "سياسة الخصوصية", "/privacy"],
    ],
  },
  {
    head: ["Studio", "الاستوديو"],
    links: [
      ["Work", "الأعمال", "/work"],
      ["Process", "المنهج", "/process"],
      ["About", "عن الاستوديو", "/about"],
      ["Writing", "مقالات", "/writing"],
      ["Reels", "ريلز", "/reels"],
      ["Labs", "المختبر", "/labs"],
    ],
  },
  {
    head: ["Reach", "تواصل"],
    links: [
      ["Email", "البريد الإلكتروني", CONTACT_EMAIL_HREF],
      ["WhatsApp", "واتساب", "https://wa.me/201092500454"],
      ["LinkedIn", "LinkedIn", "https://www.linkedin.com/in/aboalazm"],
      ["Behance", "Behance", "https://www.behance.net/aboalazm"],
      ["GitHub", "GitHub", "https://github.com/3boalazm"],
      ["Download CV", "تحميل السيرة الذاتية", "/cv"],
    ],
  },
];

export function Footer() {
  const { lang } = useLang();
  const pathname = usePathname();
  const k = lang === "ar" ? 1 : 0;

  return (
    <footer className="x-foot ground-base">
      <div className="x-wrap">
        <div className="x-foot__grid">
          <div className="grid content-start gap-4">
            <p className="x-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: lang === "ar" ? 1.3 : 0.95 }}>
              {k === 1 ? "مبنية لتعمل." : "Built to run."}
            </p>
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              {k === 1
                ? "Aboalazm OS — استوديو للهوية والتجربة الرقمية والأنظمة، يقوده مصطفى أبوالعزم."
                : "Aboalazm OS — a brand, digital and systems studio led by Mustafa Aboalazm."}
            </p>
            <div className="flex flex-wrap gap-2">
              {(["en", "ar"] as const).map((locale) => (
                <Link
                  key={locale}
                  href={localeHref(pathname ?? "/", locale)}
                  hrefLang={locale}
                  lang={locale}
                  aria-current={locale === lang ? "true" : undefined}
                  className="rounded-full border px-3 py-1.5 text-[13px] transition-colors"
                  style={{
                    borderColor: locale === lang ? "var(--color-accent-text)" : "var(--color-border-default)",
                    color: locale === lang ? "var(--color-accent-text)" : "var(--color-text-secondary)",
                    fontFamily: locale === "ar" ? "var(--font-arabic)" : undefined,
                  }}
                >
                  {locale === "ar" ? "العربية" : "English"}
                </Link>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.head[0]} aria-label={col.head[k]} className="x-foot__col">
              <p className="x-mono x-kicker mb-1">{col.head[k]}</p>
              {col.links.map((l) => {
                const href = l[2];
                const external = href.startsWith("http") || href.startsWith("mailto");
                return (
                  <Link key={href} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {l[k]}
                  </Link>
                );
              })}
            </nav>
          ))}
        </div>

        <p aria-hidden className="x-foot__word">
          ABOAL<em>A</em>ZM
        </p>

        <div className="x-foot__bar x-mono">
          <bdi dir="ltr">© 2026 Mustafa Aboalazm</bdi>
          <CairoClock label={k === 1 ? "العبور، القاهرة" : "Al Obour, Cairo"} />
          <span>{k === 1 ? "تصميم وبناء الاستوديو" : "Designed & built by the studio"}</span>
        </div>
      </div>
    </footer>
  );
}
