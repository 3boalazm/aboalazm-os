"use client";
import { useT } from "@/hooks/use-t";

/**
 * FOOTER — old-site structure (Pages / Reach / Portfolio) in the
 * new system's voice. Bilingual via useLang.
 */
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";

const COLUMNS = [
  {
    head: ["PAGES", "الصفحات"],
    links: [
      ["About", "نبذة", "/about"],
      ["Start Here", "ابدأ هنا", "/start"],
      ["Work", "الأعمال", "/work"],
      ["UI/UX Showcase", "معرض الواجهات", "/work-ui"],
      ["Services", "الخدمات", "/services"],
      ["Why", "لماذا", "/why"],
      ["Process", "المنهجية", "/process"],
      ["Capabilities", "القدرات", "/capabilities"],
      ["Resources", "المصادر", "/resources"],
      ["Labs", "المعمل", "/labs"],
      ["Library", "المكتبة", "/books"],
      ["Gallery", "المعرض", "/gallery"],
      ["Pricing", "التسعير", "/pricing"],
      ["Agreement", "الاتفاقية", "/agreement"],
      ["Writing", "مقالات", "/writing"],
      ["Contact", "تواصل", "/contact"],
    ],
  },
  {
    head: ["REACH", "تواصل"],
    links: [
      ["Email ↗", "إيميل ↗", "mailto:Mustafaaboalazm@mail.ru"],
      ["WhatsApp ↗", "واتساب ↗", "https://wa.me/201092500454"],
      ["+20 109 250 0454", "+20 109 250 0454", "tel:+201092500454"],
    ],
  },
  {
    head: ["PORTFOLIO", "البورتفوليو"],
    links: [
      ["Behance ↗", "بيهانس ↗", "https://www.behance.net/aboalazm"],
      ["LinkedIn ↗", "لينكدإن ↗", "https://www.linkedin.com/in/aboalazm"],
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
          {COLUMNS.map((col) => {
            const isPages = col.head[0] === "PAGES";
            return (
              <nav
                key={col.head[0]}
                aria-label={col.head[0]}
                className={`flex flex-col gap-1 ${isPages ? "col-span-2" : ""}`}
              >
                <p className="font-display text-[0.6rem] uppercase tracking-[0.12em] text-text-ghost">
                  {ar ? col.head[1] : col.head[0]}
                </p>
                <div className={isPages ? "columns-2 gap-x-6" : "flex flex-col gap-1"}>
                  {col.links.map(([en, arr, href]) => (
                    <Link
                      key={href}
                      href={href}
                      {...(href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={`block w-fit text-body-sm text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary ${isPages ? "mb-1" : ""}`}
                    >
                      {ar ? arr : en}
                    </Link>
                  ))}
                </div>
              </nav>
            );
          })}
        </div>
      </div>

      <div className="container-wide flex flex-wrap items-baseline justify-between gap-2 border-t border-border-subtle py-3">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          © 2026 MUSTAFA ABOALAZM — {ar ? "جميع الحقوق محفوظة" : "ALL RIGHTS RESERVED"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "صُمم وبُني داخل الاستوديو" : "DESIGNED & BUILT BY THE STUDIO"}
        </p>
      </div>
    </footer>
  );
}
