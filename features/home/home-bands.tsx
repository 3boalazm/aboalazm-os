"use client";

/**
 * HOME BANDS — the sections the old home had, in the new system's
 * voice: skills marquee, about teaser, stats band, CTA band.
 */
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { CtaBand } from "@/features/offers/offer-blocks";

/* ── Skills marquee (✦-separated, slow drift) ── */
const SKILLS = ["Brand Identity", "Brand Strategy", "Logo Design", "Visual Systems", "Art Direction", "Web Design", "Brand Guidelines", "Packaging"];
const SKILLS_AR = ["هوية بصرية", "استراتيجية براند", "تصميم شعارات", "أنظمة بصرية", "إدارة فنية", "تصميم ويب", "أدلة هوية", "تغليف"];

export function SkillsMarquee() {
  const { lang } = useLang();
  const list = lang === "ar" ? SKILLS_AR : SKILLS;
  const row = [...list, ...list]; // duplicated for the seamless loop
  return (
    <div aria-hidden className="overflow-hidden border-y border-border-subtle py-3">
      <div className="marquee flex w-max items-center gap-4">
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-4 whitespace-nowrap font-display text-title tracking-[-0.015em] text-text-secondary">
            {s} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── About teaser ── */
export function AboutTeaser() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <section className="container-content grid gap-8 py-16 lg:grid-cols-[7fr_5fr]">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "٠١ / نبذة" : "01 / ABOUT"}
        </p>
        <h2 className="font-display text-title tracking-[-0.015em]">
          {ar ? "حِرفة بُنيت عبر " : "A craft built across "}
          <em className="text-accent">{ar ? "الدوا، الغذاء، التعليم،" : "pharma, food, education,"}</em>
          {ar ? " والحكومة." : " and government."}
        </h2>
        <p className="max-w-[56ch] text-body text-text-secondary">
          {ar
            ? "أصمم أنظمة هوية بصرية متكاملة — من مراجعة البراند وتحليل المنافسين إلى أنظمة الشعارات وأنظمة التصميم وأدلة الهوية التي تستخدمها الفرق فعلًا."
            : "I design full-cycle brand identity systems — from brand audits and competitive analysis to logo systems, design systems, and the brand guidelines teams actually use."}
        </p>
        <p className="max-w-[56ch] text-body text-text-secondary">
          {ar
            ? "أقود حاليًا العمل الإبداعي في Nile Pharma Food واستوديوهي Code & Canvas — استراتيجية وإدارة فنية وحِرفة في كل بريف."
            : "I currently lead creative work across Nile Pharma Food and my own studio Code & Canvas — bringing strategy, art direction, and craft to every brief."}
        </p>
        <Link href="/about" className="group w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary">
          {ar ? "اقرأ القصة كاملة" : "Read the about page"}
          <span aria-hidden className="ms-1 inline-block transition-transform duration-base ease-physics group-hover:translate-x-1">→</span>
        </Link>
      </div>
      <dl className="flex h-fit flex-col">
        {([
          ["SPECIALTY", "التخصص", "Brand Identity & Visual Systems", "هوية بصرية وأنظمة تصميم"],
          ["CURRENTLY ACROSS", "حاليًا في", "Nile Pharma Food & Code & Canvas", "Nile Pharma Food وCode & Canvas"],
          ["LANGUAGES", "اللغات", "Arabic (Native) · English (Professional)", "العربية (الأم) · الإنجليزية (احترافية)"],
          ["BASED", "المقر", "Al Obour, Egypt — Open to remote", "العبور، مصر — متاح عن بُعد"],
        ] as const).map(([ken, kar, ven, var_]) => (
          <div key={ken} className="border-b border-border-subtle py-2 first:border-t">
            <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{ar ? kar : ken}</dt>
            <dd className="text-body-sm text-text-secondary">{ar ? var_ : ven}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Stats band ── */
export function StatsBand() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const stats = [
    ["7", "+", "Years of practice", "سنوات خبرة"],
    ["20", "+", "Brands shaped", "براند تم بناؤه"],
    ["6", "", "Industry sectors", "قطاعات صناعية"],
    ["3", "×", "Award-winning leader", "جوائز قيادية"],
  ] as const;
  return (
    <section className="border-y border-border-subtle">
      <div className="container-wide grid grid-cols-2 md:grid-cols-4">
        {stats.map(([v, suffix, en, arr], i) => (
          <div key={en} className={["flex flex-col gap-0.5 px-3 py-4", i !== 0 && "md:border-s md:border-border-subtle"].filter(Boolean).join(" ")}>
            <span className="font-display text-display leading-[1.02] tracking-[-0.025em]">
              {v}<span className="text-accent">{suffix}</span>
            </span>
            <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">{ar ? arr : en}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Final CTA ── */
export function HomeCta() {
  return (
    <CtaBand
      kicker={["LET'S BUILD SOMETHING", "يلّا نبني حاجة"]}
      title={["Have a brand to", "عندك براند"]}
      italic={["shape?", "عايز يتشكّل؟"]}
      primary={["Start a Project", "ابدأ مشروعًا"]}
      primaryHref="/contact"
      secondary={["View Services", "شاهد الخدمات"]}
      secondaryHref="/services"
    />
  );
}
