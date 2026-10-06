"use client";

/**
 * HOME BANDS — the sections the old home had, in the new system's
 * voice: skills marquee, about teaser, stats band, CTA band.
 */
import Link from "next/link";
import * as React from "react";
import { Icon } from "@/components/ui/Icon";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
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
            ? "شريك مؤسس ومدير إبداعي في Code & Canvas، وقائد المنتج والمنصة الرقمية في Nile Pharma Food & Food Supplements. متاح حاليًا لفرص الهوية البصرية والمنتجات الرقمية (الرياض أو عن بُعد)."
            : "Co-Founder & Creative Lead at Code & Canvas, and Digital Product & Platform Lead at Nile Pharma Food & Food Supplements. Currently open to Senior Brand Identity / Product Design opportunities | Riyadh or Remote."}
        </p>
        <Link href="/about" className="group w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary">
          {ar ? "اقرأ القصة كاملة" : "Read the about page"}
          <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
        </Link>
      </div>
      <dl className="flex h-fit flex-col">
        {([
          ["SPECIALTY", "التخصص", "Brand Identity & Visual Systems", "هوية بصرية وأنظمة تصميم"],
          ["CURRENT ROLE", "العمل الحالي", "Creative Lead, Code & Canvas", "مدير إبداعي، Code & Canvas"],
          ["AVAILABILITY", "الوضع الحالي", "Open to Brand Identity roles · Riyadh / Remote", "متاح لفرص مصمم هوية · الرياض / عن بُعد"],
          ["LANGUAGES", "اللغات", "Arabic (Native) · English (Professional)", "العربية (الأم) · الإنجليزية (احترافية)"],
          ["BASED", "المقر", "Al Obour, Egypt — Open to Riyadh & Remote", "العبور، مصر — متاح للرياض وعن بُعد"],
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
                className={`stats-dash__bar-fill ${[
                  "bg-secondary-cyan",
                  "bg-secondary-mint",
                  "bg-secondary-pink",
                  "bg-secondary-mauve",
                  "bg-secondary-cyan",
                  "bg-secondary-mint",
                  "bg-secondary-pink",
                  "bg-secondary-mauve",
                ][i]}`}
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
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = React.useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduceMotion) return;
    setActive(Math.min(3, Math.max(0, Math.floor(v * 4))));
  });

  const steps = ar
    ? [
        { n: "٠١", name: "اكتشاف وبحث", short: "نفهم البراند والسوق والجمهور قبل أي قرار بصري.", proof: "Brief + audit + research" },
        { n: "٠٢", name: "استراتيجية البراند", short: "نثبت التموضع والشخصية ونبرة الصوت قبل التصميم.", proof: "Positioning + voice + direction" },
        { n: "٠٣", name: "مفهوم وتصميم", short: "نحوّل الاستراتيجية إلى نظام هوية كامل قابل للتطبيق.", proof: "Logo + type + colour + applications" },
        { n: "٠٤", name: "مراجعة وتسليم", short: "نراجع، نعتمد، ونسلّم نظامًا يقدر فريقك يستخدمه.", proof: "Guidelines + files + handover" },
      ]
    : [
        { n: "01", name: "Discovery & Research", short: "Understand the brand, market, and audience before any visual decision.", proof: "Brief + audit + research" },
        { n: "02", name: "Brand Strategy", short: "Lock positioning, personality, and voice before visual design begins.", proof: "Positioning + voice + direction" },
        { n: "03", name: "Concept & Design", short: "Turn the strategy into a complete identity system built to scale.", proof: "Logo + type + colour + applications" },
        { n: "04", name: "Refine & Deliver", short: "Review, approve, and hand over a system your team can actually run.", proof: "Guidelines + files + handover" },
      ];

  return (
    <section ref={ref} className="process-story relative" dir={ar ? "rtl" : "ltr"}>
      <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:self-start lg:flex lg:flex-col lg:justify-center">
          <p className="font-mono text-caption uppercase tracking-[0.14em] text-accent">
            {ar ? "HOW WE WORK" : "HOW WE WORK"}
          </p>
          <h2 className="mt-3 max-w-[14ch] font-display text-[clamp(2.3rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.035em] text-text-primary">
            {ar ? <>من أول تواصل <em className="text-accent">لحد الإطلاق.</em></> : <>From first contact <em className="text-accent">to launch.</em></>}
          </h2>
          <p className="mt-5 max-w-[40ch] text-body-sm leading-[1.75] text-text-secondary">
            {ar
              ? "٤ مراحل واضحة. كل مرحلة لها مخرج واعتماد. وإنت شايف مكان المشروع طول الطريق."
              : "Four visible stages. Every stage has an output and a sign-off. You always know where the project stands."}
          </p>
          <div className="mt-8 flex gap-2" aria-label={ar ? "مراحل المشروع" : "Project stages"}>
            {steps.map((step, i) => (
              <span
                key={step.n}
                className={`h-1.5 flex-1 transition-all duration-500 ${i === active ? [
  "bg-secondary-cyan",
  "bg-secondary-mint",
  "bg-secondary-pink",
  "bg-secondary-mauve",
][i] : "bg-border-subtle"}`}
                aria-hidden
              />
            ))}
          </div>
          <Link href="/process" className="mt-8 w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors hover:text-text-primary focus-visible:text-text-primary">
            {ar ? "شوف المنهجية كاملة" : "See the full method"}
            <span aria-hidden className="ms-1">→</span>
          </Link>
        </div>

        <div className="relative">
          {steps.map((step, i) => {
            const isActive = i === active;
            return (
              <div key={step.n} className="min-h-[70vh] py-12 lg:min-h-[88vh] lg:py-24">
                <motion.div
                  initial={false}
                  animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: isActive ? 1 : 0.28, y: isActive ? 0 : 18 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-border-subtle pt-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`font-mono text-label ${[
  "text-secondary-cyan",
  "text-secondary-mint",
  "text-secondary-pink",
  "text-secondary-mauve",
][i]}`}>{step.n}</span>
                    <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">{step.proof}</span>
                  </div>
                  <h3 className="mt-10 max-w-[14ch] font-display text-[clamp(2rem,4vw,4rem)] leading-[0.98] tracking-[-0.03em] text-text-primary">
                    {step.name}
                  </h3>
                  <p className="mt-6 max-w-[48ch] text-body-lg leading-[1.7] text-text-secondary">{step.short}</p>
                  <div className="mt-12 h-px w-full bg-border-subtle" />
                  <p className="mt-4 font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
                    {ar ? `بوابة ${step.n}` : `Gate ${step.n}`}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Why / value bridge — the missing trust layer between proof and process ── */
export function WhyValueBand() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const items = ar
    ? [
        ["01", "الاستراتيجية قبل الشكل", "كل قرار بصري يبدأ من الهدف والسوق والجمهور — مش من الشكل فقط."],
        ["02", "أنظمة مش ملفات", "النتيجة نظام يقدر الفريق يستخدمه ويتوسع به ويحافظ عليه بعد التسليم."],
        ["03", "عربي + إنجليزي من البداية", "الهوية تُبنى للغتين في نفس المعمارية، مش ترجمة تُضاف في آخر المشروع."],
      ]
    : [
        ["01", "Strategy before aesthetics", "Visual decisions start from the business, audience, and market — not decoration alone."],
        ["02", "Systems, not files", "The deliverable is a system teams can use, scale, and maintain after handoff."],
        ["03", "Arabic + English by design", "Both languages are designed into the architecture from the start, not translated at the end."],
      ];

  return (
    <section className="container-content rounded-panel border border-secondary-mist/20 bg-secondary-mist/[0.035] py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">{ar ? "لماذا هذا الأسلوب" : "WHY THIS APPROACH"}</p>
          <h2 className="max-w-[18ch] font-display text-title tracking-[-0.02em]">
            {ar ? <>مش مجرد هوية. <em className="text-accent">نظام يشتغل.</em></> : <>Not just an identity. <em className="text-accent">A system that works.</em></>}
          </h2>
          <p className="max-w-[46ch] text-body-sm text-text-secondary">
            {ar ? "ثلاثة مبادئ بسيطة تلخّص طريقة الشغل قبل ما ندخل في التفاصيل." : "Three principles that explain the work before we get into the process."}
          </p>
          <Link href="/why" className="group w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary focus-visible:text-text-primary">
            {ar ? "ليه مصطفى؟" : "Why Mustafa"}
            <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
          </Link>
        </div>
        <div className="flex flex-col border-t border-border-subtle">
          {items.map(([n, title, body]) => (
            <div key={n} className={`grid gap-2 border-b border-border-subtle py-4 sm:grid-cols-[3rem_1fr] sm:gap-4 ${
  n === "01" ? "border-s-secondary-cyan/30" : n === "02" ? "border-s-secondary-mint/30" : "border-s-secondary-pink/30"
}`}>
              <span className={`font-mono text-label ${
                n === "01" ? "text-secondary-cyan" : n === "02" ? "text-secondary-mint" : "text-secondary-pink"
              }`}>{n}</span>
              <div className="flex flex-col gap-1">
                <h3 className={`font-display text-subtitle tracking-[-0.01em] ${
  n === "01" ? "text-secondary-cyan" : n === "02" ? "text-secondary-mint" : "text-secondary-pink"
}`}>{title}</h3>
                <p className="max-w-[56ch] text-body-sm text-text-secondary">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ / objection handling — placed late, like Blueprint's approach page ── */
export function HomeFaq() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const items = ar
    ? [
        ["هل لازم أكون عارف أنا عايز إيه؟", "لا. أول مرحلة معمولة أصلًا عشان نفهم المشكلة ونحدد الاتجاه قبل التصميم."],
        ["هل الهوية بتكون عربي وإنجليزي؟", "أيوه، لو المشروع bilingual بنبني المعمارية للغتين من البداية."],
        ["كام مدة المشروع؟", "المنهجية الأساسية ٣٨ يومًا على أربع مراحل، مع اعتماد مكتوب عند كل بوابة."],
        ["إيه اللي هستلمه في النهاية؟", "نظام هوية متكامل، الملفات النهائية، دليل الاستخدام، والتسليم المنظم حسب نطاق المشروع."],
        ["إزاي نبدأ؟", "مكالمة اكتشاف قصيرة لتحديد النطاق، التوافق، والجدول قبل أي التزام."],
      ]
    : [
        ["Do I need to know exactly what I want?", "No. The first phase exists to understand the problem and establish the right direction before design."],
        ["Can the identity work in Arabic and English?", "Yes. For bilingual projects, the architecture is designed for both languages from the start."],
        ["How long does a project take?", "The core method is 38 days across four phases, with written sign-off at every gate."],
        ["What do I receive at the end?", "A complete identity system, final production files, guidelines, and an organized handover based on scope."],
        ["How do we start?", "A short discovery call to clarify scope, fit, and timeline before any commitment."],
      ];

  return (
    <section className="container-content py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.14em] text-accent">{ar ? "أسئلة سريعة" : "FAQ"}</p>
          <h2 className="mt-3 max-w-[13ch] font-display text-title leading-[1.02] tracking-[-0.025em]">{ar ? <>قبل ما <em className="text-accent">نبدأ.</em></> : <>Before we <em className="text-accent">start.</em></>}</h2>
        </div>
        <div className="border-t border-border-subtle">
          {items.map(([q, a], i) => (
            <details key={q} className="group border-b border-border-subtle py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-subtitle tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                <span>{q}</span><span className="font-mono text-label text-accent transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-[60ch] pt-4 text-body-sm leading-[1.75] text-text-secondary">{a}</p>
            </details>
          ))}
        </div>
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
