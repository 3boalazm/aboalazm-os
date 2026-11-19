"use client";

/**
 * HOME BANDS — the sections the old home had, in the new system's
 * voice: skills marquee, about teaser, stats band, CTA band.
 */
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import * as React from "react";
import { Icon } from "@/components/ui/Icon";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { usePersona, pickFor } from "@/components/providers/persona-provider";
import { CtaBand } from "@/features/offers/offer-blocks";
import { buttonVariants } from "@/components/ui/Button";
import { TIERS } from "@/lib/offers";
import { BandFrame } from "@/components/ui/band-frame";

/* ── Skills marquee (✦-separated, slow drift) ── */
const SKILLS = ["Brand Identity", "Brand Strategy", "Visual Systems", "Art Direction", "Web Development"];
const SKILLS_AR = ["هوية بصرية", "استراتيجية العلامة", "أنظمة بصرية", "إدارة فنية", "تطوير ويب"];
const APPLIED_SKILLS = ["AI Workflow Design", "Business Tools & Dashboards", "Product & Market Research"];
const APPLIED_SKILLS_AR = ["تدفقات عمل بالذكاء الاصطناعي", "أدوات أعمال ولوحات تحكم", "بحث المنتجات والأسواق"];

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
    <section className="container-content grid gap-8 py-6 lg:grid-cols-[7fr_5fr]">
      <div className="flex flex-col gap-3">
        {/* Mobile visual anchor — the section was pure type. Code & Canvas
            is named in the copy below, so its closing frame carries it. */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-panel border border-border-subtle lg:hidden">
          <Image
            src="/images/work/cc-closing.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian/75 via-obsidian/25 to-transparent"
          />
          <span className="absolute bottom-3 start-3 font-mono text-micro uppercase tracking-[0.08em] text-alabaster">
            {ar ? "Code & Canvas: شريك مؤسس ومدير إبداعي" : "Code & Canvas — Co-Founder & Creative Lead"}
          </span>
        </div>
        <BandFrame
          src="/images/generated/band-practice.jpg"
          veil="start"
          shape="bleed"
          className="lg:hidden"
          contentClassName="flex flex-col gap-3 max-lg:p-4"
        >
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "01 / نبذة" : "01 / ABOUT"}
        </p>
        <h2 className="font-display text-title tracking-[-0.015em]">
          {ar ? "صنعة بُنيت عبر " : "A craft built across "}
          <em className="text-accent">{ar ? "الدواء والغذاء والتعليم" : "pharma, food, education,"}</em>
          {ar ? " والحكومة." : " and government."}
        </h2>
        <p className="max-w-[56ch] text-body text-text-secondary">
          {ar
            ? "الهوية البصرية هي تخصصي الأساسي، وأربطها بالطبقة الرقمية: مواقع وواجهات منتجات وأنظمة تصميم. وأستخدم البحث وتدفقات الذكاء الاصطناعي وأدوات الأعمال المخصصة حين تحل مشكلة واضحة فعلًا."
            : "Brand identity is my core. I build the connected digital layer too — websites, product interfaces and design systems — then apply research, AI workflows and custom business tools when they solve a clear problem."}
        </p>
        <p className="max-w-[56ch] text-body text-text-secondary">
          {ar
            ? "شريك مؤسس ومدير إبداعي في Code & Canvas، وقائد المنتج والمنصة الرقمية في Nile Pharma Food & Food Supplements. أستقبل حاليًا مشاريع مختارة في الهوية البصرية والمنتجات الرقمية في ماليزيا والخليج وعن بُعد."
            : "Co-Founder & Creative Lead at Code & Canvas, and Digital Product & Platform Lead at Nile Pharma Food & Food Supplements. Taking on select brand identity and digital product projects across Malaysia, the Gulf and remotely."}
        </p>
        <Link href="/about" className="group w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary">
          {ar ? "اقرأ القصة كاملة" : "Read the about page"}
          <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
        </Link>
        {/* The skills that used to live in the scrolling marquee — static
            chips now (overhaul S2: the marquee was motion for its own sake
            and repeated the same 8 words twice per row). */}
        </BandFrame>
        <div className="mt-1 border-t border-border-subtle pt-3">
          <p className="mb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {ar ? "التخصص الأساسي" : "CORE DISCIPLINES"}
          </p>
          <ul aria-label={ar ? "التخصصات الأساسية" : "Core specialties"} className="flex flex-wrap gap-1.5">
            {(ar ? SKILLS_AR : SKILLS).map((s) => (
              <li key={s} className="rounded-pill border border-border-default px-2 py-0.5 font-mono text-micro uppercase tracking-[0.08em] text-text-primary">
                {s}
              </li>
            ))}
          </ul>
          <p className="mb-2 mt-3 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost max-sm:hidden">
            {ar ? "قدرات مساندة بحسب احتياج المشروع" : "ADJACENT CAPABILITIES · WHEN USEFUL"}
          </p>
          <ul aria-label={ar ? "قدرات مساندة" : "Adjacent capabilities"} className="flex flex-wrap gap-1.5 max-sm:hidden">
            {(ar ? APPLIED_SKILLS_AR : APPLIED_SKILLS).map((s) => (
              <li key={s} className="rounded-pill border border-border-subtle px-2 py-0.5 font-mono text-micro text-text-tertiary">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <dl className="flex h-fit flex-col">
        {([
          ["SPECIALTY", "التخصص", "Brand Identity & Visual Systems", "هوية بصرية وأنظمة تصميم"],
          ["CURRENT ROLE", "العمل الحالي", "Creative Lead, Code & Canvas", "مدير إبداعي، Code & Canvas"],
          ["AVAILABILITY", "الوضع الحالي", "Taking on select projects · Malaysia / Gulf / Remote", "أستقبل مشاريع مختارة · ماليزيا / الخليج / عن بُعد"],
          ["LANGUAGES", "اللغات", "Arabic (Native) · English (Professional)", "العربية (الأم) · الإنجليزية (احترافية)"],
          ["BASED", "المقر", "Al Obour, Egypt — open to Malaysia, the Gulf & remote", "العبور، مصر · منفتح على ماليزيا والخليج وعن بُعد"],
        ] as const).map(([ken, kar, ven, var_]) => (
          // phones keep availability + languages; the rest is on /about
          <div key={ken} className={`border-b border-border-subtle py-2 first:border-t ${["SPECIALTY", "CURRENT ROLE", "BASED"].includes(ken) ? "max-sm:hidden" : ""}`}>
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
    ["9",   "+", "Years of design practice", "سنوات ممارسة التصميم",        "Since July 2017",   "منذ يوليو 2017",  0.7],
    ["20",  "+", "Brands shaped",       "علامة تجارية بُنيت",  "Local & regional",  "محلية وإقليمية",  0.85],
    ["15",  "+", "Identity systems",    "نظام هوية",        "Full brand systems","أنظمة متكاملة", 0.6],
    ["6",   "",  "Industry sectors",    "قطاعات",        "Pharma → gov",       "دواء ← حكومة",  0.5],
    ["500", "+", "Design assets",       "أصل تصميمي",       "Print & digital",   "مطبوع ورقمي", 0.9],
    ["10",  "+", "Digital experiences", "تجربة رقمية",     "Web & platforms",   "ويب ومنصات",   0.55],
    ["38",  "",  "Day method",          "يومًا من المنهج",      "Kickoff → launch",   "بدء ← إطلاق",     0.75],
    ["3",   "×", "Award-winning",   "جائزة أفضل رئيس لجنة",     "Leadership seasons","في موسمين متتاليين",  0.45],
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

/* ── Client Journey Band — the METHOD section of the homepage funnel ──
   (Was a /start teaser; /start was absorbed into /contact in overhaul S3.
    The band now links deeper into /process.) */
export function ClientJourneyBand() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = React.useState(0);

  /* Below md the stages are a swipe shelf, not the scroll story: the viewer
     swipes one card at a time to read it, so ghosting the ones beside it would
     grey out cards they are about to read. Dimming only applies to the
     desktop scroll story, where all four are on screen at once. */
  const [desktop, setDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* The active stage is whichever card sits in a thin band at the middle of
     the viewport. (Mapping total section progress ÷ 4 drifted out of sync
     with the cards: a card scrolled off-screen while still "active" and the
     card actually in view stayed ghosted, so the right column read as empty.) */
  React.useEffect(() => {
    const els = stepRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (els.length === 0 || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const steps = ar
    ? [
        { n: "01", name: "الاكتشاف والبحث", short: "نفهم العلامة والسوق والجمهور قبل أي قرار بصري.", proof: "Brief + audit + research" },
        { n: "02", name: "استراتيجية العلامة", short: "نثبّت التموضع والشخصية ونبرة الصوت قبل التصميم.", proof: "Positioning + voice + direction" },
        { n: "03", name: "المفهوم والتصميم", short: "نحوّل الاستراتيجية إلى نظام هوية كامل قابل للتطبيق.", proof: "Logo + type + colour + applications" },
        { n: "04", name: "المراجعة والتسليم", short: "نراجع ونعتمد ونسلّم نظامًا يستطيع فريقك استخدامه.", proof: "Guidelines + files + handover" },
      ]
    : [
        { n: "01", name: "Discovery & Research", short: "Understand the brand, market, and audience before any visual decision.", proof: "Brief + audit + research" },
        { n: "02", name: "Brand Strategy", short: "Lock positioning, personality, and voice before visual design begins.", proof: "Positioning + voice + direction" },
        { n: "03", name: "Concept & Design", short: "Turn the strategy into a complete identity system built to scale.", proof: "Logo + type + colour + applications" },
        { n: "04", name: "Refine & Deliver", short: "Review, approve, and hand over a system your team can actually run.", proof: "Guidelines + files + handover" },
      ];

  return (
    <section ref={ref} className="process-story relative" dir={ar ? "rtl" : "ltr"}>
      <div className="container-content grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:self-start lg:flex lg:flex-col lg:justify-center">
          <p className="font-mono text-caption uppercase tracking-[0.14em] text-accent">
            {ar ? "HOW WE WORK" : "HOW WE WORK"}
          </p>
          <h2 className="mt-3 max-w-[14ch] font-display text-[clamp(2.3rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.035em] text-text-primary">
            {ar ? <>من أول تواصل <em className="text-accent">حتى الإطلاق.</em></> : <>From first contact <em className="text-accent">to launch.</em></>}
          </h2>
          <p className="mt-5 max-w-[40ch] text-body-sm leading-[1.75] text-text-secondary">
            {ar
              ? "أربع مراحل واضحة. لكل مرحلة مخرج واعتماد، وتعرف دائمًا أين وصل مشروعك."
              : "Four visible stages. Every stage has an output and a sign-off. You always know where the project stands."}
          </p>
          <div className="mt-4 flex gap-2" aria-hidden>
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
          <Link href="/process" className="mt-4 w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors hover:text-text-primary focus-visible:text-text-primary">
            {ar ? "استعرض المنهج كاملًا" : "See the full method"}
            <Icon name="arrow-right" className="ms-1" />
          </Link>
        </div>

        {/* On a phone the four stages swipe as cards instead of scrolling
            as a four-screen text wall; the sticky scroll story stays on lg. */}
        <div className="relative max-md:-mx-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:gap-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
          {steps.map((step, i) => {
            const isActive = i === active;
            return (
              <div
                key={step.n}
                ref={(el) => { stepRefs.current[i] = el; }}
                data-step={i}
                className="py-3 max-md:w-[84%] max-md:shrink-0 max-md:snap-start max-md:py-0 sm:min-h-[36vh] sm:py-4 lg:min-h-[48vh] lg:py-5"
              >
                <motion.div
                  initial={false}
                  animate={
                    reduceMotion || !desktop
                      ? { opacity: 1, y: 0 }
                      : { opacity: isActive ? 1 : 0.38, y: isActive ? 0 : 18 }
                  }
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-border-subtle pt-4 max-md:rounded-panel max-md:border max-md:border-border-subtle max-md:bg-surface-1 max-md:p-4"
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
                  <h3 className="mt-3 max-w-[14ch] font-display text-[clamp(1.75rem,4vw,4rem)] sm:mt-5 leading-[0.98] tracking-[-0.03em] text-text-primary">
                    {step.name}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-body-lg leading-[1.7] text-text-secondary sm:mt-4">{step.short}</p>
                  <div className="mt-6 h-px w-full bg-border-subtle max-sm:hidden" />
                  <p className="mt-3 font-mono max-sm:hidden text-micro uppercase tracking-[0.08em] text-text-ghost">
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
        ["01", "الاستراتيجية قبل الشكل", "يبدأ كل قرار بصري من الهدف والسوق والجمهور، لا من الشكل وحده."],
        ["02", "أنظمة لا ملفات", "النتيجة نظام يستطيع الفريق استخدامه وتوسيعه والحفاظ عليه بعد التسليم."],
        ["03", "عربي وإنجليزي من البداية", "تُبنى الهوية للغتين ضمن هيكل واحد، لا كترجمة تُضاف في آخر المشروع."],
      ]
    : [
        ["01", "Strategy before aesthetics", "Visual decisions start from the business, audience, and market — not decoration alone."],
        ["02", "Systems, not files", "The deliverable is a system teams can use, scale, and maintain after handoff."],
        ["03", "Arabic + English by design", "Both languages are designed into the architecture from the start, not translated at the end."],
      ];

  return (
    <section className="container-content rounded-panel border border-secondary-mist/20 bg-secondary-mist/[0.035] py-6 md:py-7">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">{ar ? "لماذا هذا الأسلوب" : "WHY THIS APPROACH"}</p>
          <h2 className="max-w-[18ch] font-display text-title tracking-[-0.02em]">
            {ar ? <>ليست مجرد هوية. <em className="text-accent">بل نظام يعمل.</em></> : <>Not just an identity. <em className="text-accent">A system that works.</em></>}
          </h2>
          <p className="max-w-[46ch] text-body-sm text-text-secondary">
            {ar ? "ثلاثة مبادئ بسيطة تلخّص طريقة العمل قبل أن ندخل في التفاصيل." : "Three principles that explain the work before we get into the process."}
          </p>
          <Link href="/why" className="group w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary focus-visible:text-text-primary">
            {ar ? "لماذا مصطفى؟" : "Why Mustafa"}
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
                <h3 className={`font-display font-display-sm text-subtitle tracking-[-0.01em] ${
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
  // Durations come from the tier data (the single source of truth) so this answer
  // can never drift from the pricing cards, /book and the agreement.
  const dur = (i: number) => TIERS[i]?.duration[ar ? 1 : 0] ?? "";
  const items = ar
    ? [
        ["هل يلزم أن أعرف ما أريد بالضبط؟", "لا. المرحلة الأولى وُجدت أصلًا لنفهم المشكلة ونحدد الاتجاه قبل التصميم."],
        ["هل تكون الهوية بالعربية والإنجليزية؟", "نعم. تشمل الباقة المتكاملة الشعار باللغتين، وفي الباقات الأصغر نؤكد اللغة المطلوبة وتكلفة النسخة الإضافية قبل البدء."],
        ["كم مدة المشروع؟", `الشعار ${dur(0)}، والهوية ${dur(1)}، ونظام العلامة المتكامل ${dur(2)}، والمتجر الإلكتروني ثنائي اللغة خلال 72 ساعة من استلام المحتوى.`],
        ["ماذا أتسلّم في النهاية؟", "نظام هوية متكامل، والملفات النهائية، ودليل الاستخدام، وتسليم منظّم بحسب نطاق المشروع."],
        ["كيف نبدأ؟", "بمكالمة استكشافية مجانية مدتها 30 دقيقة. بعدها تستلم نطاقًا وعرض سعر مكتوبين، وبعد اعتمادهما توقّع الاتفاقية وتدفع دفعة البدء (50%). وصفحة الحجز بعربون مخصصة لهذه الخطوة الأخيرة."],
        ["من الذي سينفّذ المشروع؟", "يقود مصطفى المشروع بنفسه من أول مكالمة حتى التسليم. وإذا احتاج النطاق إلى تطوير أو تصوير أو إنتاج طباعي، ينضم متخصصون بعينهم بإدارة ومراجعة من الاستوديو، وبنطاق مكتوب واحد. وإذا كان العمل أكبر مما يحتمله الاستوديو، نقول ذلك في مرحلة العرض."],
        ["هل تعملون خارج نطاق الهوية؟", "نعم. يعمل الاستوديو في ثلاثة مسارات مترابطة: الهوية والتموضع، والتجربة الرقمية (مواقع ومتاجر)، وأنظمة الأعمال والأتمتة (لوحات التحكم وERP). ويمكنك أن تبدأ بمسار واحد."],
      ]
    : [
        ["Do I need to know exactly what I want?", "No. The first phase exists to understand the problem and establish the right direction before design."],
        ["Can the identity work in Arabic and English?", "Yes. The full system includes Arabic/English lockups. For smaller tiers, the required language and any additional version are confirmed before kickoff."],
        ["How long does a project take?", `Logo: ${dur(0)}. Identity Essentials: ${dur(1)}. Full Brand System: ${dur(2)}. Bilingual Online Store: 72 hours once content is received.`],
        ["What do I receive at the end?", "A complete identity system, final production files, guidelines, and an organized handover based on scope."],
        ["How do we start?", "With a free 30-minute discovery call. Then you receive a written scope and price; once you approve it you sign the agreement and pay the 50% kickoff instalment. The deposit page is for that final step."],
        ["Who actually does the work?", "Mustafa leads the project himself from the first call to handover. When a scope needs development, photography, motion or print production, named specialists join under one written scope, coordinated and quality-checked by the studio. If a project is bigger than the studio can carry responsibly, we say so at proposal stage."],
        ["Do you work beyond brand identity?", "Yes. The studio works across three connected tracks: brand and positioning, digital experience (sites and stores), and business systems and automation (dashboards, ERP). You can start with one."],
      ];

  return (
    /* Named, so it is a landmark: the contact page renders this after its
       <main>, and content outside every landmark is skipped by region
       navigation (axe: region). */
    <section aria-labelledby="faq-heading" className="container-content py-7 md:py-10">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="x-mono x-kicker">{ar ? "أسئلة سريعة" : "FAQ"}</p>
          <h2 id="faq-heading" className="x-sec__title mt-3">{ar ? <>قبل أن <em className="text-accent">نبدأ.</em></> : <>Before we <em className="text-accent">start.</em></>}</h2>
          {/* A closed <details> is a row of type: seven of them read as a table.
              The header carries the studio's own work instead, so the last
              band before the closing CTA is not the only text-only screen
              left on the page. */}
          <div className="relative mt-4 hidden overflow-hidden rounded-panel border border-border-subtle max-lg:block">
            <Image
              src="/images/generated/band-faq.jpg"
              alt=""
              width={1600}
              height={1200}
              sizes="100vw"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian/80 via-obsidian/30 to-transparent"
            />
            <span className="absolute bottom-3 start-3 font-mono text-micro uppercase tracking-[0.08em] text-alabaster">
              {ar ? "نظام تصميم: تكوين محكوم" : "Design system — governed composition"}
            </span>
          </div>
        </div>
        <div className="x-faq">
          {items.map(([q, a]) => (
            <details key={q} className="x-faq__item x-rise">
              <summary className="x-faq__q">
                <span>{q}</span>
                <span aria-hidden className="x-faq__plus">+</span>
              </summary>
              <p className="x-faq__a">{a}</p>
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
      variant="editorial"
      kicker={["LET'S START WITH THE PROBLEM", "لنبدأ من المشكلة"]}
      title={["A business to", "هل لديك نشاط تجاري"]}
      italic={["move forward?", "يريد أن يتقدّم؟"]}
      /* Discovery first, deposit last: the primary step is the call; the
         deposit page is step 04 of the funnel and only follows a signed scope. */
      primary={["Book a discovery call", "احجز مكالمة استكشافية"]}
      primaryHref="/contact"
      secondary={["See how starting works", "تعرّف على آلية البدء"]}
      secondaryHref="/process"
    />
  );
}
