"use client";

/**
 * /process — The 38-Day Method (deep, interactive)
 *
 * The canonical 4-phase spine (see lib/offers PROCESS) expanded into a
 * full methodology page. Progressive Disclosure: phase headers are always
 * visible; the tasks, deliverables, and gate for each phase expand on click.
 *
 * Built on the studio's real playbook — every task and gate is drawn from
 * how projects actually run, not invented for the page.
 *
 * Bilingual (LTR/RTL). Motion via Framer Motion. No external deps.
 */

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { physics, physicsSlow } from "@/lib/motion";
/* Hero entrance is CSS (.hero-rise): painted in the first frame, JS or not. */
import "@/features/hero/hero.css";
import { GateStepper } from "@/features/process";
import { AnchorNav } from "@/features/navigation";
import { buttonVariants } from "@/components/ui/Button";
import { panelCardVariants } from "@/components/ui/PanelCard";

/* ─── types ───────────────────────────────────────────────────── */
type Phase = {
  n: string;
  name: string;
  days: string;
  dayRange: [number, number];
  summary: string;
  tasks: string[];
  deliverables: string[];
  gate: string;
  payment?: string;
};

/* ─── copy ────────────────────────────────────────────────────── */
const COPY = {
  en: {
    kicker: "THE METHOD",
    h1a: "38 days,",
    h1b: "four gates.",
    lede: "Every brand identity project runs on the same spine — a disciplined sequence with a written sign-off at each gate. No surprises, no scope drift, no guessing where the work stands. Expand any phase to see exactly what happens inside it.",
    metaDays: "DAYS",
    metaGates: "GATES",
    metaRounds: "REVISION ROUNDS",
    tasksLabel: "What happens",
    deliverablesLabel: "You receive",
    gateLabel: "Gate — sign-off required",
    paymentLabel: "Payment milestone",
    expandHint: "Tap to expand",
    principlesKicker: "OPERATING PRINCIPLES",
    principlesTitle: "The rules that",
    principlesItalic: "protect the work.",
    ctaKicker: "READY TO START?",
    ctaTitle: "Begin with",
    ctaItalic: "day one.",
    ctaSub: "The whole method starts with a 30-minute discovery call. No commitment — just clarity on scope, fit, and timeline.",
    ctaPrimary: "Book a Discovery Call",
    ctaSecondary: "See the Client Journey",
  },
  ar: {
    kicker: "المنهجية",
    h1a: "٣٨ يومًا،",
    h1b: "أربع بوابات.",
    lede: "كل مشروع هوية بصرية يمشي على نفس العمود — تسلسل منضبط بموافقة مكتوبة عند كل بوابة. لا مفاجآت، لا توسع في النطاق، لا تخمين لمكان الشغل. افتح أي مرحلة لترى بالضبط ما يحدث بداخلها.",
    metaDays: "يومًا",
    metaGates: "بوابات",
    metaRounds: "جولات مراجعة",
    tasksLabel: "ماذا يحدث",
    deliverablesLabel: "ماذا تستلم",
    gateLabel: "بوابة — موافقة مطلوبة",
    paymentLabel: "محطة دفع",
    expandHint: "اضغط للتوسيع",
    principlesKicker: "مبادئ التشغيل",
    principlesTitle: "القواعد التي",
    principlesItalic: "تحمي الشغل.",
    ctaKicker: "جاهز نبدأ؟",
    ctaTitle: "ابدأ من",
    ctaItalic: "اليوم الأول.",
    ctaSub: "المنهجية كلها تبدأ بمكالمة اكتشاف ٣٠ دقيقة. بدون التزام — بس وضوح عن النطاق والتوافق والجدول الزمني.",
    ctaPrimary: "احجز مكالمة اكتشاف",
    ctaSecondary: "شوف رحلة العميل",
  },
} as const;

const PHASES_EN: Phase[] = [
  {
    n: "01",
    name: "Discovery & Research",
    days: "Days 1–6",
    dayRange: [1, 6],
    summary: "Learning your world before designing anything. The foundation no logo can replace.",
    tasks: [
      "Kickoff call & signed project brief",
      "Brand audit of the existing identity (if any)",
      "Competitor analysis — 5 to 8 direct and indirect",
      "Color-gap mapping to find the open visual territory",
      "Audience persona & jobs-to-be-done",
      "Cultural and linguistic research (critical for bilingual)",
    ],
    deliverables: [
      "Research report (PDF)",
      "Competitor analysis deck",
      "Brand audit summary",
      "Approved project brief",
    ],
    gate: "You approve the project brief in writing before strategy begins.",
    payment: "50% deposit at kickoff",
  },
  {
    n: "02",
    name: "Brand Strategy",
    days: "Days 5–9",
    dayRange: [5, 9],
    summary: "Purpose, positioning, and voice — approved on paper before a single shape is drawn.",
    tasks: [
      "Brand core: purpose, vision, mission, values",
      "Positioning statement & unique value proposition",
      "Brand personality & archetype selection",
      "Tone of voice, framed as 'X but not Y'",
      "Brand story and promise",
      "Strategy deck presented and discussed live",
    ],
    deliverables: [
      "Brand strategy document (PDF)",
      "Positioning statement",
      "Personality & tone-of-voice guide",
      "Approved mood direction",
    ],
    gate: "Strategy is signed off before any visual design starts. This closes the door on 'I'm not sure what I want' later.",
    payment: "25% at strategy sign-off (Tiers 2 & 3)",
  },
  {
    n: "03",
    name: "Concept & Design",
    days: "Days 9–27",
    dayRange: [9, 27],
    summary: "Dozens of sketches condensed to a few directions, then developed into a full system.",
    tasks: [
      "20–30 raw sketches — quantity before quality",
      "Narrowed to 2–3 strategic directions",
      "Typography & color exploration per direction",
      "Primary concept built in vector, fully realized",
      "Logo system: primary, secondary, submark, bilingual lockup",
      "Color system, type hierarchy, brand elements",
      "Key applications and realistic mockups",
      "Mid-phase WIP screenshots — no surprises",
    ],
    deliverables: [
      "2–3 concept directions with rationale",
      "Full logo system (chosen direction)",
      "Color & typography system",
      "Brand elements & key mockups",
    ],
    gate: "You choose one direction, signed off, before it's developed to final.",
  },
  {
    n: "04",
    name: "Refine & Deliver",
    days: "Days 27–38",
    dayRange: [27, 38],
    summary: "Two structured revision rounds, final sign-off, and a system your team can run.",
    tasks: [
      "Round 1 & 2 revisions (per contract)",
      "Revision log tracks every request in/out of scope",
      "Final sign-off in writing",
      "File package: AI, EPS, SVG, PNG, JPG",
      "Brand guidelines PDF (12–40 pages by tier)",
      "Handover call — how to use the system",
      "30-day post-delivery support window",
    ],
    deliverables: [
      "All logo files, every format & version",
      "Brand guidelines PDF",
      "Social & application templates",
      "Signed delivery receipt + IP transfer",
    ],
    gate: "Final sign-off and balance clear before final files are released. Protects both sides.",
    payment: "Final 25–50% before delivery",
  },
];

const PHASES_AR: Phase[] = [
  {
    n: "٠١",
    name: "الاكتشاف والبحث",
    days: "الأيام ١–٦",
    dayRange: [1, 6],
    summary: "تعلّم عالمك قبل تصميم أي شيء. الأساس الذي لا يعوّضه أي شعار.",
    tasks: [
      "مكالمة البدء وبريف مشروع موقّع",
      "مراجعة شاملة للبراند الحالي (إن وُجد)",
      "تحليل المنافسين — من ٥ إلى ٨ مباشرين وغير مباشرين",
      "خريطة فجوات الألوان لإيجاد المساحة البصرية المفتوحة",
      "بيرسونا الجمهور والوظائف المطلوب إنجازها",
      "بحث ثقافي ولغوي (حاسم للهويات ثنائية اللغة)",
    ],
    deliverables: [
      "تقرير بحثي (PDF)",
      "عرض تحليل المنافسين",
      "ملخص مراجعة البراند",
      "بريف مشروع معتمد",
    ],
    gate: "توافق على بريف المشروع كتابيًا قبل بدء الاستراتيجية.",
    payment: "٥٠٪ مقدّم عند البدء",
  },
  {
    n: "٠٢",
    name: "استراتيجية البراند",
    days: "الأيام ٥–٩",
    dayRange: [5, 9],
    summary: "الغاية والتموضع ونبرة الصوت — معتمدة على الورق قبل رسم أي شكل.",
    tasks: [
      "جوهر البراند: الغاية، الرؤية، الرسالة، القيم",
      "بيان التموضع والقيمة الفريدة",
      "شخصية البراند واختيار النموذج",
      "نبرة الصوت، مصاغة بأسلوب «X وليس Y»",
      "قصة البراند ووعده",
      "عرض الاستراتيجية ومناقشته مباشرة",
    ],
    deliverables: [
      "وثيقة استراتيجية البراند (PDF)",
      "بيان التموضع",
      "دليل الشخصية ونبرة الصوت",
      "اتجاه بصري معتمد",
    ],
    gate: "تُعتمد الاستراتيجية قبل بدء أي تصميم بصري. ده بيقفل الباب على «مش عارف اللي عايزه» لاحقًا.",
    payment: "٢٥٪ عند اعتماد الاستراتيجية (الفئتان ٢ و٣)",
  },
  {
    n: "٠٣",
    name: "المفهوم والتصميم",
    days: "الأيام ٩–٢٧",
    dayRange: [9, 27],
    summary: "عشرات الإسكتشات تُختصر لاتجاهات قليلة، ثم تُطوّر لنظام كامل.",
    tasks: [
      "٢٠–٣٠ إسكتش خام — الكمية قبل الجودة",
      "التضييق لـ٢–٣ اتجاهات استراتيجية",
      "استكشاف الخطوط والألوان لكل اتجاه",
      "بناء المفهوم الأساسي فيكتور بالكامل",
      "نظام الشعار: أساسي، ثانوي، مصغّر، شعار ثنائي اللغة",
      "نظام الألوان، هرمية الخطوط، العناصر البصرية",
      "التطبيقات الأساسية وموك-أب واقعية",
      "لقطات تقدم في منتصف المرحلة — لا مفاجآت",
    ],
    deliverables: [
      "٢–٣ اتجاهات مع المنطق وراءها",
      "نظام شعار كامل (الاتجاه المختار)",
      "نظام الألوان والخطوط",
      "العناصر البصرية والموك-أب الأساسية",
    ],
    gate: "تختار اتجاهًا واحدًا، معتمدًا، قبل تطويره للشكل النهائي.",
  },
  {
    n: "٠٤",
    name: "المراجعة والتسليم",
    days: "الأيام ٢٧–٣٨",
    dayRange: [27, 38],
    summary: "جولتا مراجعة منظمتان، اعتماد نهائي، ونظام يقدر فريقك يشغّله.",
    tasks: [
      "جولتا المراجعة ١ و٢ (حسب العقد)",
      "سجل المراجعات يتتبع كل طلب داخل/خارج النطاق",
      "اعتماد نهائي كتابيًا",
      "حزمة الملفات: AI, EPS, SVG, PNG, JPG",
      "دليل الهوية PDF (١٢–٤٠ صفحة حسب الفئة)",
      "مكالمة التسليم — كيفية استخدام النظام",
      "نافذة دعم ٣٠ يومًا بعد التسليم",
    ],
    deliverables: [
      "كل ملفات الشعار، بكل الصيغ والنسخ",
      "دليل الهوية PDF",
      "قوالب السوشيال والتطبيقات",
      "إيصال تسليم موقّع + نقل الملكية الفكرية",
    ],
    gate: "الاعتماد النهائي وسداد الباقي قبل تسليم الملفات النهائية. حمايةً للطرفين.",
    payment: "الـ٢٥–٥٠٪ الأخيرة قبل التسليم",
  },
];

const PRINCIPLES = {
  en: [
    ["No work before deposit", "The 50% kickoff payment starts the project. Nothing before it."],
    ["Strategy before design", "Always. A logo without strategy is a coin flip with no way to judge right from wrong."],
    ["Every verbal agreement, in writing", "Each decision is confirmed in an email or the project brief. This protects both sides."],
    ["Version control, no 'Final_FINAL'", "Files are numbered clearly. WIP screenshots at every phase — never a surprise at review."],
    ["Two revision rounds, then hourly", "Not a limit on your input — a structure that keeps the strategy from ad-hoc erosion."],
    ["No final files before balance", "The final payment clears before the delivery package is released."],
  ],
  ar: [
    ["لا شغل قبل المقدّم", "دفعة الـ٥٠٪ عند البدء هي ما يُطلق المشروع. لا شيء قبلها."],
    ["الاستراتيجية قبل التصميم", "دائمًا. شعار بدون استراتيجية رهان عشوائي بلا معيار للحكم."],
    ["كل اتفاق شفهي، كتابيًا", "كل قرار يُؤكَّد في إيميل أو في بريف المشروع. ده بيحمي الطرفين."],
    ["تحكّم بالإصدارات، بدون Final_FINAL", "الملفات مرقّمة بوضوح. لقطات تقدم في كل مرحلة — لا مفاجأة عند المراجعة."],
    ["جولتا مراجعة، ثم بالساعة", "ليس تقييدًا لرأيك — بنية تحمي الاستراتيجية من التآكل العشوائي."],
    ["لا ملفات نهائية قبل السداد", "الدفعة الأخيرة تُسدَّد قبل تسليم حزمة الملفات."],
  ],
} as const;

/* ─── page ────────────────────────────────────────────────────── */
export function ProcessView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const c = ar ? COPY.ar : COPY.en;
  const phases = ar ? PHASES_AR : PHASES_EN;
  const principles = ar ? PRINCIPLES.ar : PRINCIPLES.en;

  const [open, setOpen] = useState<string | null>("01");
  const reduceMotion = useReducedMotion();

  const sections = ar
    ? [
        { id: "gates", label: "البوابات" },
        { id: "phases", label: "المراحل" },
        { id: "principles", label: "المبادئ" },
        { id: "cta", label: "ابدأ" },
      ]
    : [
        { id: "gates", label: "Gates" },
        { id: "phases", label: "Phases" },
        { id: "principles", label: "Principles" },
        { id: "cta", label: "Start" },
      ];

  return (
    <main className="flex flex-col" dir={ar ? "rtl" : "ltr"}>
      <AnchorNav sections={sections} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-surface-0 px-6 py-24 lg:px-16">
        <div className="pointer-events-none absolute inset-0 process-grid-bg" aria-hidden />
        <div className="relative z-10 flex max-w-[760px] flex-col gap-5">
          <p className="hero-rise font-mono text-caption uppercase tracking-[0.16em] text-accent" style={{ "--i": 0 } as CSSProperties}>
            {c.kicker}
          </p>
          <h1 className="hero-rise font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.93] tracking-[-0.03em] text-text-primary" style={{ "--i": 1 } as CSSProperties}>
            {c.h1a}<br /><em className="text-accent">{c.h1b}</em>
          </h1>
          <p className="hero-rise max-w-[56ch] text-body leading-[1.7] text-text-secondary" style={{ fontFamily: "var(--font-sans)", "--i": 2 } as CSSProperties}>
            {c.lede}
          </p>

          {/* meta strip */}
          <div className="hero-rise mt-2 flex gap-6" style={{ "--i": 3 } as CSSProperties}>
            {[["38", c.metaDays], ["4", c.metaGates], ["2", c.metaRounds]].map(([v, l]) => (
              <div key={l} className="flex flex-col">
                <span className="font-display text-[2rem] leading-none tracking-[-0.02em] text-text-primary">
                  {v}
                </span>
                <span className="mt-1 font-mono text-caption uppercase tracking-[0.1em] text-text-ghost">{l}</span>
              </div>
            ))}
          </div>

          <ol
            className="hero-rise mt-4 grid max-w-[640px] grid-cols-2 gap-2 sm:grid-cols-4"
            style={{ "--i": 4 } as CSSProperties}
          >
            {(ar
              ? [
                  ["٠١", "اكتشاف"],
                  ["٠٢", "استراتيجية"],
                  ["٠٣", "تصميم"],
                  ["٠٤", "تسليم"],
                ]
              : [
                  ["01", "Discover"],
                  ["02", "Strategize"],
                  ["03", "Design"],
                  ["04", "Deliver"],
                ]
            ).map(([n, name], i, list) => (
              <li key={n} className="flex items-baseline gap-2">
                <span className="font-mono text-micro text-accent">{n}</span>
                <span className="font-display font-display-sm text-body-lg tracking-[-0.015em] text-text-primary">{name}</span>
                {i < list.length - 1 ? (
                  <span aria-hidden className="hidden text-text-ghost sm:inline-flex">
                    <Icon name="arrow-right" flip={false} />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── APPROVAL GATES (interactive terminal stepper) ── */}
      <section id="gates" className="chapter-b px-6 pb-6 pt-4 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <p className="hook-line mb-1">
            {ar ? "أربع موافقات كتابية. لا مفاجآت." : "Four written approvals. No surprises."}
          </p>
          <p className="hook-sub mb-6">
            {ar
              ? "كل بوابة تحمي مرحلة كاملة من إعادة العمل — أنت توافق قبل ما نكمل، مش بعد ما نخلص."
              : "Each gate protects an entire phase from rework — you approve before we move on, not after we're done."}
          </p>
          <GateStepper />
        </div>
      </section>

      {/* ── PHASES (progressive disclosure) ── */}
      <section id="phases" className="chapter-a px-6 pb-16 pt-8 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <p className="hook-line mb-1">
            {ar ? "أربع مراحل واضحة. افتح أي واحدة." : "Four clear phases. Open any one."}
          </p>
          <p className="hook-sub mb-6">
            {ar ? "التفاصيل مطوية عمدًا — اضغط على أي مرحلة لترى المهام والمخرجات الفعلية بداخلها." : "Details are collapsed on purpose — click any phase to see the actual tasks and deliverables inside it."}
          </p>
          <div className="relative flex flex-col">
            {/* connecting spine — centred on the nodes (half of their 11-unit width, minus half its own 1px) */}
            <div className="absolute start-[calc(var(--spacing)*11/2-0.5px)] top-6 bottom-6 w-px bg-border-subtle" aria-hidden />

            {phases.map((phase, i) => {
              const isOpen = open === phase.n;
              const chevron = (className: string) => (
                <span className={[
                  "inline-flex shrink-0 font-mono text-caption text-text-ghost transition-transform duration-base ease-physics",
                  isOpen ? "rotate-90 text-accent" : "group-hover:text-text-tertiary",
                  className,
                ].join(" ")} aria-hidden>
                  <Icon name="chevron-right" />
                </span>
              );
              return (
                <motion.div
                  key={phase.n}
                  className="relative"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ ...physicsSlow, delay: i * 0.06 }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : phase.n)}
                    className="group flex w-full items-start gap-x-1.5 py-5 text-start sm:gap-x-4"
                    aria-expanded={isOpen}
                  >
                    {/* node — 11 spacing units wide; the spine offset above is half of that */}
                    <span className={[
                      "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-surface-0 transition-colors duration-base ease-physics",
                      isOpen ? "border-accent" : "border-border-default group-hover:border-text-ghost",
                    ].join(" ")}>
                      <span className={["font-mono text-caption transition-colors duration-base", isOpen ? "text-accent" : "text-text-tertiary"].join(" ")}>
                        {phase.n}
                      </span>
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
                      {/* Below sm the node leaves no room for a third column ("Discovery"
                          alone is wider than what is left), so the title block becomes a
                          2-column grid: name on top, then days with the chevron at the end
                          of that line — the same place for every phase and width. */}
                      <span className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 sm:flex sm:flex-wrap">
                        <span className="font-display font-display-sm text-subtitle tracking-[-0.015em] text-text-primary max-sm:col-span-2">{phase.name}</span>
                        <span className="font-mono text-caption uppercase tracking-[0.1em] text-text-ghost">{phase.days}</span>
                        {chevron("sm:hidden")}
                      </span>
                      <span className="max-w-[54ch] text-body-sm leading-[1.6] text-text-secondary" style={{ fontFamily: "var(--font-sans)" }}>
                        {phase.summary}
                      </span>
                    </span>

                    {/* chevron */}
                    {chevron("mt-2 max-sm:hidden")}
                  </button>

                  {/* expanded body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ ...physics }}
                        className="overflow-hidden"
                      >
                        <div className="ms-[3.75rem] mb-6 grid gap-5 rounded-panel border border-border-subtle bg-surface-1 p-5 max-sm:ms-0 max-sm:p-3 md:grid-cols-2">
                          {/* tasks */}
                          <div className="flex flex-col gap-2.5">
                            <p className="font-mono text-caption uppercase tracking-[0.1em] text-accent">{c.tasksLabel}</p>
                            <ul className="flex flex-col gap-2">
                              {phase.tasks.map((t, ti) => (
                                <li key={ti} className="flex items-start gap-2">
                                  <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-text-ghost" />
                                  <span className="text-label leading-[1.55] text-text-secondary" style={{ fontFamily: "var(--font-sans)" }}>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* deliverables */}
                          <div className="flex flex-col gap-2.5">
                            <p className="font-mono text-caption uppercase tracking-[0.1em] text-accent">{c.deliverablesLabel}</p>
                            <ul className="flex flex-col gap-2">
                              {phase.deliverables.map((d, di) => (
                                <li key={di} className="flex items-start gap-2">
                                  <Icon name="check" size="1em" strokeWidth={2} className="mt-[0.35rem] shrink-0 text-accent" />
                                  <span className="text-label leading-[1.55] text-text-secondary" style={{ fontFamily: "var(--font-sans)" }}>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* gate — full width */}
                          <div className="md:col-span-2 flex flex-col gap-2 rounded-card border border-accent/20 bg-accent/[0.04] p-4 max-sm:p-2">
                            <p className="font-mono text-caption uppercase tracking-[0.1em] text-accent">{c.gateLabel}</p>
                            <p className="text-label leading-[1.6] text-text-secondary" style={{ fontFamily: "var(--font-sans)" }}>{phase.gate}</p>
                            {phase.payment && (
                              <p className="mt-1 flex items-center gap-2 font-mono text-caption uppercase tracking-[0.08em] text-text-ghost">
                                <span className="text-accent">$</span>{c.paymentLabel}: {phase.payment}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── OPERATING PRINCIPLES ── */}
      <section id="principles" className="chapter-b border-t border-border-subtle px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <motion.div
            className="mb-8 flex flex-col gap-1"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={physicsSlow}
          >
            <p className="font-mono text-caption uppercase tracking-[0.14em] text-text-ghost">{c.principlesKicker}</p>
            <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-text-primary">
              {c.principlesTitle} <em className="text-accent">{c.principlesItalic}</em>
            </h2>
          </motion.div>

          <div className="grid gap-3 md:grid-cols-2">
            {principles.map(([title, body], i) => (
              <motion.div
                key={title}
                className={panelCardVariants({ className: "flex gap-3 rounded-panel p-4" })}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ...physicsSlow, delay: i * 0.06 }}
              >
                <span className="font-mono text-caption text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-col gap-1">
                  <p className="font-display font-display-sm text-body-sm tracking-[-0.01em] text-text-primary">{title}</p>
                  <p className="text-label leading-[1.6] text-text-tertiary" style={{ fontFamily: "var(--font-sans)" }}>{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="relative overflow-hidden chapter-a border-t border-border-subtle px-6 py-20 text-center lg:px-16">
        <motion.div
          className="relative z-10 mx-auto flex max-w-[560px] flex-col items-center gap-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={physicsSlow}
        >
          <p className="font-mono text-caption uppercase tracking-[0.16em] text-accent">{c.ctaKicker}</p>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.025em] text-text-primary">
            {c.ctaTitle} <em className="text-accent">{c.ctaItalic}</em>
          </h2>
          <p className="max-w-[44ch] text-body-sm leading-[1.7] text-text-secondary" style={{ fontFamily: "var(--font-sans)" }}>
            {c.ctaSub}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://wa.me/201092500454"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ className: "px-[24px] py-[12px] font-display font-[800] text-label tracking-[0.07em] transition-[transform,box-shadow] duration-[200ms] ease-physics hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(255,107,71,0.30)]" })}
            >
              {c.ctaPrimary}
            </a>
            <Link
              href="/start"
              className={buttonVariants({
                variant: "ghost",
                className:
                  "inline-flex items-center gap-1.5 border border-accent-32 px-[24px] py-[12px] font-display font-[800] text-label tracking-[0.07em] text-text-secondary transition-[border-color,color,transform] duration-[200ms] ease-physics hover:border-accent hover:text-accent hover:-translate-y-[2px]",
              })}
            >
              {c.ctaSecondary}
              <Icon name="arrow-right" />
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
