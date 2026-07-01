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

/* ── Client Journey Band — teaser strip linking to /start ── */
export function ClientJourneyBand() {
  const { lang } = useLang();
  const ar = lang === "ar";

  const steps = ar
    ? [
        { n: "٠١", name: "اكتشاف\nوبحث" },
        { n: "٠٢", name: "استراتيجية\nالبراند" },
        { n: "٠٣", name: "مفهوم\nوتصميم" },
        { n: "٠٤", name: "مراجعة\nوتسليم" },
      ]
    : [
        { n: "01", name: "Discovery\n& Research" },
        { n: "02", name: "Brand\nStrategy" },
        { n: "03", name: "Concept\n& Design" },
        { n: "04", name: "Refine\n& Deliver" },
      ];

  return (
    <div className="journey-band">
      <div className="journey-band__inner">

        {/* Left: copy */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">
            {ar ? "كيف نشتغل" : "HOW WE WORK"}
          </p>
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-text-primary">
            {ar
              ? <>من أول ما تتواصل <em className="text-accent">لحد ما تطلق.</em></>
              : <>From first contact <em className="text-accent">to launch day.</em></>
            }
          </h2>
          <p
            className="max-w-[44ch] text-[0.875rem] leading-[1.7] text-text-secondary"
            style={{ fontFamily: "Montserrat, system-ui" }}
          >
            {ar
              ? "عملية واضحة من ٤ مراحل، ٣٨ يوم، موافقة كتابية عند كل محطة. تعرّف على الفلو كامل قبل ما تبدأ."
              : "A clear 4-phase process, 38 days, written sign-off at every gate. See exactly what happens before you commit."}
          </p>
          <Link
            href="/start"
            className="group mt-1 flex w-fit items-center gap-2 rounded-pill bg-accent px-4 py-2 font-display text-[0.68rem] font-[800] uppercase tracking-[0.07em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5"
          >
            {ar ? "شوف الفلو كامل" : "See the full process"}
            <span
              aria-hidden
              className="transition-transform duration-base ease-physics group-hover:translate-x-0.5"
            >→</span>
          </Link>
        </div>

        {/* Right: 4-step counter strip */}
        <div className="journey-steps">
          {steps.map((s) => (
            <div key={s.n} className="journey-step">
              <span className="journey-step__n">{s.n}</span>
              <span className="journey-step__name" style={{ whiteSpace: "pre-line" }}>{s.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
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
