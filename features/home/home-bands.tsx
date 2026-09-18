"use client";

/**
 * HOME BANDS — the sections the old home had, in the new system's
 * voice: skills marquee, about teaser, stats band, CTA band.
 */
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { usePersona, pickFor } from "@/components/providers/persona-provider";
import { CtaBand } from "@/features/offers/offer-blocks";
import { buttonVariants } from "@/components/ui/Button";

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
            {s} <Icon name="sparkle" size="0.5em" className="text-accent" />
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
          <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
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

/* ── Stats dashboard ── richer 8-metric grid, numbers from /why (approved) ── */
export function StatsBand() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const reduceMotion = useReducedMotion();

  // [value, suffix, EN label, AR label, EN sub, AR sub, bar 0–1]
  const stats = [
    ["9",   "",  "Years of practice",   "سنوات خبرة",        "Since July 2017",   "منذ يوليو ٢٠١٧",  0.7],
    ["20",  "+", "Brands shaped",       "براند تم بناؤه",  "Local & regional",  "محلي وإقليمي",  0.85],
    ["15",  "+", "Identity systems",    "نظام هوية",        "Full brand systems","أنظمة متكاملة", 0.6],
    ["6",   "",  "Industry sectors",    "قطاعات",        "Pharma → gov",       "دواء ← حكومة",  0.5],
    ["500", "+", "Design assets",       "أصل تصميم",       "Print & digital",   "مطبوع وديجيتال", 0.9],
    ["10",  "+", "Digital experiences", "تجربة رقمية",     "Web & platforms",   "ويب ومنصات",   0.55],
    ["38",  "",  "Day method",          "يوم منهجية",      "Kickoff → launch",   "بدء ← إطلاق",     0.75],
    ["3",   "×", "Award-winning",   "جوائز قيادية",     "Leadership seasons","مواسم قيادة",  0.45],
  ] as const;

  return (
    <section className="stats-dash">
      <div className="stats-dash__grid">
        {stats.map(([v, suffix, en, arr, subEn, subAr, bar], i) => (
          <div key={en as string} className="stats-dash__cell">
            <span className="stats-dash__value">
              {v}<span className="stats-dash__suffix">{suffix}</span>
            </span>
            <span className="stats-dash__label">{ar ? arr : en}</span>
            <span className="stats-dash__sub">{ar ? subAr : subEn}</span>
            <div className="stats-dash__bar" aria-hidden>
              <motion.div
                className="stats-dash__bar-fill"
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={{ scaleX: bar as number }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              />
            </div>
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
  const { persona } = usePersona();

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

  const kicker = pickFor(persona, {
    base: ar ? "كيف نشتغل" : "HOW WE WORK",
    founder: ar ? "الجدول والعائد" : "TIMELINE & ROI",
    technical: ar ? "المعمارية والحوكمة" : "ARCHITECTURE & GOVERNANCE",
  });

  const heading = pickFor(persona, {
    base: ar
      ? <>من أول ما تتواصل <em className="text-accent">لحد ما تطلق.</em></>
      : <>From first contact <em className="text-accent">to launch day.</em></>,
    founder: ar
      ? <>جدول ثابت. <em className="text-accent">نتيجة مقاسة.</em></>
      : <>A fixed timeline. <em className="text-accent">A measured outcome.</em></>,
    technical: ar
      ? <>أربع بوابات، <em className="text-accent">موافقة عند كل واحدة.</em></>
      : <>Four gates, <em className="text-accent">sign-off at every one.</em></>,
  });

  const body = pickFor(persona, {
    base: ar
      ? "عملية واضحة من ٤ مراحل، ٣٨ يوم، موافقة كتابية عند كل محطة. تعرّف على الفلو كامل قبل ما تبدأ."
      : "A clear 4-phase process, 38 days, written sign-off at every gate. See exactly what happens before you commit.",
    founder: ar
      ? "٣٨ يوم من التواصل الأول للإطلاق. ميزانيتك محمية بمواعيد دفع مرتبطة بمخرجات فعلية، مش وعود."
      : "38 days from first contact to launch. Your budget is protected by payment gates tied to real deliverables, not promises.",
    technical: ar
      ? "التوكنز المعتمدة عند بوابة التصميم تبقى المصدر الوحيد للحقيقة — تسليم دقيق للمطورين، بدون انحراف."
      : "Tokens approved at the design gate become the single source of truth — precise developer handoff, zero drift.",
  });

  const cta = pickFor(persona, {
    base: ar ? "شوف الفلو كامل" : "See the full process",
    founder: ar ? "شوف الجدول والتسعير" : "See timeline & pricing",
    technical: ar ? "شوف بوابات الاعتماد" : "See the approval gates",
  });

  return (
    <div className="journey-band">
      <div className="journey-band__inner">

        {/* Left: copy */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-caption uppercase tracking-[0.14em] text-accent">
            {kicker}
          </p>
          <h2 className="font-display text-title leading-[1.05] tracking-[-0.025em] text-text-primary">
            {heading}
          </h2>
          <p
            className="max-w-[44ch] text-body-sm leading-[1.7] text-text-secondary"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {body}
          </p>
          <Link
            href="/start"
            className={buttonVariants({
              className:
                "group mt-1 flex w-fit items-center gap-2 px-4 py-2 font-display text-caption font-[800] tracking-[0.07em] transition-transform duration-base ease-physics hover:-translate-y-0.5",
            })}
          >
            {cta}
            <span
              aria-hidden
              className="inline-flex transition-transform duration-base ease-physics group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            ><Icon name="arrow-right" /></span>
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
