"use client";

/**
 * START module — the closing call, and the MODULE INDEX: the six home sections
 * that moved to their own pages, reduced to six typographic lines. Dense
 * content is not deleted; it is one click away and named plainly.
 */
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { contactHref } from "@/lib/contact-context";

const INDEX: [href: string, en: string, ar: string, ms: string, noteEn: string, noteAr: string][] = [
  ["/services", "Services", "الخدمات", "Perkhidmatan", "What is included, per discipline", "اللي جوه كل تخصص"],
  ["/pricing", "Pricing", "الأسعار", "Harga", "Three tiers, stated upfront", "ثلاث فئات، معلنة من الأول"],
  ["/process", "Process", "المنهج", "Proses", "The 38-day method, gate by gate", "منهج الـ 38 يوم، بوابة بوابة"],
  ["/about", "Practice", "الممارسة", "Amalan", "Background and how the studio runs", "الخلفية وطريقة شغل الاستوديو"],
  ["/writing", "Writing", "المقالات", "Penulisan", "Working notes on brand and systems", "مذكرات عن البراند والأنظمة"],
  ["/contact#faq", "FAQ", "الأسئلة", "Soalan", "Before you start", "قبل ما تبدأ"],
];

export function HomeStart() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <div className="grid items-end gap-6 lg:grid-cols-[1.4fr_1fr]">
      <h2 className={ar ? "text-[clamp(2.4rem,7vw,6rem)] font-bold leading-[1.15]" : "font-display text-[clamp(2.6rem,8.4vw,8rem)] leading-[0.9] tracking-[-0.035em]"}>
        {ar ? "عندك بيزنس عايز يتحرك؟" : lang === "ms" ? "Perniagaan yang mahu bergerak?" : "A business to move forward?"}
      </h2>
      <div className="flex flex-col gap-3">
        <p className="max-w-[40ch] text-lead text-text-secondary">
          {ar
            ? "نبدأ بمكالمة استكشاف 30 دقيقة. نطاق مكتوب قبل أي دفع."
            : lang === "ms"
              ? "Bermula dengan panggilan penemuan 30 minit. Skop bertulis sebelum sebarang bayaran."
              : "It starts with a 30-minute discovery call. Written scope before any payment."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={contactHref({ source: "/" })} className="inline-flex items-center gap-2 rounded-pill bg-accent px-3 py-1.5 font-mono text-label text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5">
            {ar ? "احجز مكالمة استكشاف" : lang === "ms" ? "Tempah panggilan penemuan" : "Book a discovery call"}
            <Icon name="arrow-right" />
          </Link>
          <Link href="/process" className="glass inline-flex items-center gap-2 rounded-pill px-3 py-1.5 font-mono text-label text-text-primary">
            {ar ? "اعرف طريقة البدء" : lang === "ms" ? "Cara bermula" : "See how starting works"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ModuleIndex() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <nav className="module-index flex flex-col" aria-label={ar ? "باقي الموقع" : "The rest of the site"}>
      {INDEX.map(([href, en, arr, ms, noteEn, noteAr], i) => (
        <Link key={href} href={href}>
          <span className="font-mono text-micro tabular-nums text-text-tertiary">{String(i + 7).padStart(2, "0")}</span>
          <span className="module-index__name">{ar ? arr : lang === "ms" ? ms : en}</span>
          <span className="flex items-center gap-2 font-mono text-micro uppercase tracking-[0.08em] text-text-secondary">
            <span className="max-sm:hidden">{ar ? noteAr : noteEn}</span>
            <Icon name="arrow-right" />
          </span>
        </Link>
      ))}
    </nav>
  );
}
