"use client";
import { useT } from "@/hooks/use-t";

/**
 * FOOTER — old-site structure (Pages / Reach / Portfolio) in the
 * new system's voice. Bilingual via useLang.
 */
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";

/* Overhaul 2026-10-14 (S1): four lean columns keyed to the audience's
   question — "how do I engage", "what is this place", "what does he think",
   "how do I reach him". Retired pages (why/capabilities/start/work-ui) left
   the map; everything below resolves. Dedupe rules: one CV link, one deck. */
const COLUMNS = [
  {
    head: ["ENGAGE", "التعاون"],
    links: [
      ["Start a Project", "ابدأ مشروعك", "/contact"],
      ["Services", "الخدمات", "/services"],
      ["Pricing", "التسعير", "/pricing"],
      ["For Hiring Teams", "للشركات والتوظيف", "/for-hiring"],
      ["Agreement", "الاتفاقية", "/agreement"],
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
      ["Library", "المكتبة", "/books"],
      ["Resources", "المصادر", "/resources"],
      ["Wall", "الحيطة", "/work"],
    ],
  },
  {
    head: ["REACH", "تواصل"],
    links: [
      ["Email ↗", "إيميل ↗", "mailto:m1aboalazm@gmail.com"],
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
  const ar = lang === "ar";
  return (
    <footer className="border-t border-border-subtle">
      <div className="container-wide grid gap-8 py-8 md:grid-cols-[1.2fr_2fr]">
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
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav
              key={col.head[0]}
              aria-label={ar ? col.head[1] : col.head[0]}
              className="flex flex-col gap-1"
            >
              <p className="font-display text-caption uppercase tracking-[0.12em] text-text-ghost">
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

      <div className="container-wide flex flex-wrap items-baseline justify-between gap-2 border-t border-border-subtle py-3">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          © 2026 MUSTAFA ABOALAZM — {ar ? "جميع الحقوق محفوظة" : "ALL RIGHTS RESERVED"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "Ctrl + ` يفتح الترمينال" : "PRESS CTRL + ` FOR THE TERMINAL"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "صُمم وبُني داخل الاستوديو" : "DESIGNED & BUILT BY THE STUDIO"}
        </p>
      </div>
    </footer>
  );
}
