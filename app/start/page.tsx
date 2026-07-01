"use client";

/**
 * /start — Client Journey Page
 *
 * الهدف: العميل اللي شاف السايت وعنده اهتمام — ده دليله.
 * مش صفحة services تانية. ده جواب على "طيب أبدأ إزاي؟"
 *
 * Sections:
 *  00  Hero — one sentence, the promise
 *  01  Is this for me? — who fits, who doesn't
 *  02  What will I get? — 3 tiers ultra-condensed
 *  03  How does it work? — 4-phase timeline
 *  04  How do we start? — 3 steps to kickoff
 *  05  CTA — book the call
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { reveal, physics, physicsSlow } from "@/lib/motion";
import { PROCESS, TIERS } from "@/lib/offers";

/* ─── copy ─────────────────────────────────────────────────────── */
const COPY = {
  en: {
    kicker:      "START HERE",
    h1a:         "Here's exactly",
    h1b:         "how we work.",
    lede:        "You've seen the work. You have a brand to build. This page is the bridge — what happens from the moment you reach out to the day you launch with a system that holds.",

    /* 01 */
    s01label:    "01 / IS THIS FOR ME?",
    s01title:    "You're in the right place",
    s01italic:   "if —",
    fits: [
      "You're launching or repositioning a brand and need more than a logo.",
      "You want a system your team can actually use — not just beautiful files.",
      "You think in business terms: strategy, audience, differentiation.",
      "You respect process and understand that good work takes real time.",
    ],
    notFits: [
      "You need a logo by tomorrow.",
      "You want to skip strategy and go straight to colours.",
      "You're comparing quotes on Fiverr.",
    ],
    notFitsLabel: "Probably not the right fit:",

    /* 02 */
    s02label:    "02 / WHAT WILL I GET?",
    s02title:    "Three ways to",
    s02italic:   "engage.",
    s02sub:      "Every tier includes the strategic foundation — what changes is the depth of the system and how many applications we build together.",
    tiers: [
      { tag: "TIER 01", name: "Logo Design", price: "$199 – $279", duration: "7 – 10 days", note: "Logo, formats, mini-guide. Right when budget is the constraint." },
      { tag: "TIER 02", name: "Brand Identity Essentials", price: "$697 – $1,097", duration: "3 – 4 weeks", note: "The full identity core: strategy, logo system, colour, type, guidelines, 3 applications.", recommended: true },
      { tag: "TIER 03", name: "Full Brand System", price: "$1,497 – $2,997+", duration: "5 – 7 weeks", note: "Everything in Tier 02 plus extended research, full strategy doc, packaging, web, and launch support." },
    ],
    s02pricing:  "Detailed breakdown →",

    /* 03 */
    s03label:    "03 / HOW DOES IT WORK?",
    s03title:    "Four phases,",
    s03italic:   "38 days.",
    s03sub:      "Every project follows the same spine — no surprises, no scope drift. You sign off at each gate before anything moves forward.",
    phases: [
      { n: "01", name: "Discovery & Research",   days: "Days 1–6",   body: "I learn your world: brand audit, competitor mapping, audience persona, cultural research. Nothing is designed yet — this is the foundation." },
      { n: "02", name: "Brand Strategy",         days: "Days 5–9",   body: "Purpose, positioning, archetype, voice. Written, presented, and signed off by you before a single shape is drawn." },
      { n: "03", name: "Concept & Design",       days: "Days 9–27",  body: "Dozens of sketches condensed to 2–3 directions. You pick one. We develop it into a complete visual identity system." },
      { n: "04", name: "Refine & Deliver",       days: "Days 27–38", body: "Two revision rounds, final sign-off, every file format, brand guidelines PDF, handover call, and 30-day support window." },
    ],

    /* 04 */
    s04label:    "04 / HOW DO WE START?",
    s04title:    "Three steps to",
    s04italic:   "kickoff.",
    steps: [
      { n: "01", name: "Discovery Call",   body: "Free 30-minute call. We talk about your brand, your goals, your timeline, and your budget. No pitch — just an honest conversation about fit.", cta: "Book the Call", href: "https://wa.me/201092500454" },
      { n: "02", name: "Brief & Proposal", body: "You fill in a brand questionnaire. I send a scoped proposal: deliverables, timeline, investment, payment terms. You review, we align." },
      { n: "03", name: "Contract & Kickoff", body: "Sign the agreement, send the 50% deposit, and we're officially started. Project brief lands in your inbox the same day." },
    ],

    /* CTA */
    ctaKicker:   "READY?",
    ctaTitle:    "Start with a",
    ctaItalic:   "conversation.",
    ctaSub:      "30 minutes. No commitment. Just clarity on whether we're the right fit — and if so, exactly how we'll move.",
    ctaPrimary:  "Book a Discovery Call",
    ctaSecondary: "View Services & Pricing →",

    /* payment note */
    payNote:     "50% deposit to start · 50% before final files · No exceptions — protects both sides.",
  },

  ar: {
    kicker:      "ابدأ من هنا",
    h1a:         "ده بالظبط",
    h1b:         "إزاي بنشتغل.",
    lede:        "شفت الأعمال. عندك براند عايز تبنيه. الصفحة دي هي الجسر — اللي بيحصل من لحظة ما تتواصل لحد ما تطلق بنظام يصمد.",

    /* 01 */
    s01label:    "٠١ / ده مناسب ليّ؟",
    s01title:    "أنت في المكان الصح",
    s01italic:   "لو —",
    fits: [
      "بتطلق أو بتعيد تموضع براند وتحتاج أكثر من مجرد لوجو.",
      "عايز نظام فريقك يقدر يشتغل بيه فعلًا — مش بس ملفات جميلة.",
      "بتفكر بمنطق أعمال: استراتيجية، جمهور، تمييز.",
      "بتحترم العملية وبتفهم إن الشغل الكويس بياخد وقت حقيقي.",
    ],
    notFits: [
      "محتاج لوجو بكرة.",
      "عايز تتخطى الاستراتيجية وتروح مباشرة للألوان.",
      "بتقارن أسعار على Fiverr.",
    ],
    notFitsLabel: "على الأرجح مش التعاون المناسب:",

    /* 02 */
    s02label:    "٠٢ / إيه اللي هاخده؟",
    s02title:    "ثلاث طرق",
    s02italic:   "للتعاون.",
    s02sub:      "كل فئة بتشمل الأساس الاستراتيجي — اللي بيتغير هو عمق النظام وكمية التطبيقات اللي بنبنيها سوا.",
    tiers: [
      { tag: "الفئة ٠١", name: "تصميم الشعار", price: "$199 – $279", duration: "٧ – ١٠ أيام", note: "شعار وصيغ ودليل مصغّر. المناسب لما الميزانية هي القيد." },
      { tag: "الفئة ٠٢", name: "أساسيات الهوية البصرية", price: "$697 – $1,097", duration: "٣ – ٤ أسابيع", note: "جوهر الهوية الكامل: استراتيجية، نظام شعار، ألوان، خطوط، دليل هوية، ٣ تطبيقات.", recommended: true },
      { tag: "الفئة ٠٣", name: "نظام براند متكامل", price: "$1,497 – $2,997+", duration: "٥ – ٧ أسابيع", note: "كل ما في الفئة ٠٢ مع بحث موسّع، وثيقة استراتيجية كاملة، تغليف، موقع، ودعم الإطلاق." },
    ],
    s02pricing:  "التفاصيل الكاملة للتسعير →",

    /* 03 */
    s03label:    "٠٣ / إزاي بتشتغل؟",
    s03title:    "أربع مراحل،",
    s03italic:   "٣٨ يومًا.",
    s03sub:      "كل مشروع بيمشي على نفس العمود — مفيش مفاجآت ولا توسع في النطاق. بتوافق كتابيًا عند كل محطة قبل ما أي حاجة تتحرك.",
    phases: [
      { n: "٠١", name: "الاكتشاف والبحث",    days: "الأيام ١–٦",   body: "بتعلم عالمك: مراجعة البراند، خريطة المنافسين، بيرسونا الجمهور، البحث الثقافي. لا تصميم هنا بعد — ده الأساس." },
      { n: "٠٢", name: "استراتيجية البراند",  days: "الأيام ٥–٩",   body: "الغاية، التموضع، النموذج، نبرة الصوت. مكتوبة ومعروضة وموقّعة منك قبل رسم أي شكل." },
      { n: "٠٣", name: "المفهوم والتصميم",    days: "الأيام ٩–٢٧",  body: "عشرات الإسكتشات تُختصر لـ٢–٣ اتجاهات. تختار واحدًا. نطوّره لنظام هوية بصرية كامل." },
      { n: "٠٤", name: "المراجعة والتسليم",   days: "الأيام ٢٧–٣٨", body: "جولتا مراجعة منظمتان، اعتماد نهائي، كل صيغ الملفات، دليل هوية PDF، مكالمة تسليم، ودعم ٣٠ يومًا." },
    ],

    /* 04 */
    s04label:    "٠٤ / إزاي نبدأ؟",
    s04title:    "ثلاث خطوات",
    s04italic:   "للإطلاق.",
    steps: [
      { n: "٠١", name: "مكالمة اكتشاف",      body: "مكالمة مجانية ٣٠ دقيقة. نتكلم عن براندك وأهدافك وجدولك وميزانيتك. مفيش بيتش — مجرد حوار صريح عن مدى التوافق.", cta: "احجز المكالمة", href: "https://wa.me/201092500454" },
      { n: "٠٢", name: "البريف والعرض",       body: "بتملّي استبيان البراند. بابعتلك عرضًا محدد النطاق: المخرجات والجدول الزمني والاستثمار وشروط الدفع. بتراجع ونتفق." },
      { n: "٠٣", name: "العقد والانطلاق",     body: "بتوقّع الاتفاقية وتبعت الـ٥٠٪ المقدّم، ورسميًا بدأنا. بريف المشروع يوصل لصندوق بريدك نفس اليوم." },
    ],

    /* CTA */
    ctaKicker:   "جاهز؟",
    ctaTitle:    "ابدأ بـ",
    ctaItalic:   "محادثة.",
    ctaSub:      "٣٠ دقيقة. بدون أي التزام. بس وضوح عن إذا كنا المناسبين لبعض — ولو أيوه، بالظبط هنتحرك إزاي.",
    ctaPrimary:  "احجز مكالمة اكتشاف",
    ctaSecondary: "شاهد الخدمات والتسعير →",

    /* payment note */
    payNote:     "٥٠٪ مقدّم للبدء · ٥٠٪ قبل الملفات النهائية · لا استثناءات — حمايةً للطرفين.",
  },
} as const;

/* ─── page ─────────────────────────────────────────────────────── */
export default function StartPage() {
  const { lang } = useLang();
  const ar   = lang === "ar";
  const c    = ar ? COPY.ar : COPY.en;

  return (
    <main className="flex flex-col" dir={ar ? "rtl" : "ltr"}>

      {/* ══════════════════════════════════════════════════════════
          HERO — the promise in one breath
      ══════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[60svh] flex-col justify-center overflow-hidden bg-obsidian px-6 py-24 lg:px-16">
        {/* subtle grid */}
        <div className="pointer-events-none absolute inset-0 start-grid-bg" aria-hidden />

        <motion.div
          className="relative z-10 flex max-w-[720px] flex-col gap-5"
          variants={reveal.container}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent"
            variants={reveal.item}
          >
            {c.kicker}
          </motion.p>

          <motion.h1
            className="font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.93] tracking-[-0.03em] text-text-primary"
            variants={reveal.item}
          >
            {c.h1a}<br />
            <em className="text-accent">{c.h1b}</em>
          </motion.h1>

          <motion.p
            className="max-w-[52ch] text-[1rem] leading-[1.7] text-text-secondary"
            style={{ fontFamily: "Montserrat, system-ui" }}
            variants={reveal.item}
          >
            {c.lede}
          </motion.p>

          <motion.div className="flex flex-wrap gap-3 pt-2" variants={reveal.item}>
            <a
              href="https://wa.me/201092500454"
              target="_blank"
              rel="noopener noreferrer"
              className="start-cta-primary"
            >
              {ar ? "احجز مكالمة مجانية" : "Book a Free Call"}
            </a>
            <a href="#how-it-works" className="start-cta-ghost">
              {ar ? "شوف كيف بنشتغل ↓" : "See how it works ↓"}
            </a>
          </motion.div>
        </motion.div>

        {/* big ghost "START" background text */}
        <span
          className="pointer-events-none absolute end-[-0.05em] top-1/2 -translate-y-1/2 select-none font-display text-[clamp(8rem,20vw,18rem)] font-[800] uppercase leading-none tracking-[-0.04em] text-text-primary opacity-[0.03]"
          aria-hidden
        >
          {ar ? "ابدأ" : "START"}
        </span>
      </section>

      {/* ══════════════════════════════════════════════════════════
          01 / IS THIS FOR ME?
      ══════════════════════════════════════════════════════════ */}
      <SectionWrap id="is-this-for-me" n={ar ? "٠١" : "01"} label={c.s01label} title={c.s01title} italic={c.s01italic}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Fits */}
          <div className="flex flex-col gap-3 rounded-panel border border-accent/20 bg-surface-1 p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-accent">
              {ar ? "✓ مناسب لك" : "✓ Good fit"}
            </p>
            <ul className="flex flex-col gap-3">
              {c.fits.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-[0.875rem] leading-[1.65] text-text-secondary" style={{ fontFamily: "Montserrat, system-ui" }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not fits */}
          <div className="flex flex-col gap-3 rounded-panel border border-border-subtle bg-surface-1/50 p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-text-ghost">
              {c.notFitsLabel}
            </p>
            <ul className="flex flex-col gap-3">
              {c.notFits.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-px w-3 shrink-0 bg-border-default" />
                  <span className="text-[0.875rem] leading-[1.65] text-text-tertiary" style={{ fontFamily: "Montserrat, system-ui" }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrap>

      {/* ══════════════════════════════════════════════════════════
          02 / WHAT WILL I GET?
      ══════════════════════════════════════════════════════════ */}
      <SectionWrap id="what-will-i-get" n={ar ? "٠٢" : "02"} label={c.s02label} title={c.s02title} italic={c.s02italic} alt>
        <p className="mb-6 max-w-[56ch] text-[0.875rem] leading-[1.7] text-text-tertiary" style={{ fontFamily: "Montserrat, system-ui" }}>
          {c.s02sub}
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          {c.tiers.map((tier) => (
            <div
              key={tier.tag}
              className={[
                "relative flex flex-col gap-3 rounded-panel border p-5",
                ("recommended" in tier && tier.recommended)
                  ? "border-accent bg-surface-1 shadow-card"
                  : "border-border-subtle bg-surface-1/60",
              ].join(" ")}
            >
              {("recommended" in tier && tier.recommended) && (
                <span className="absolute end-3 top-3 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-accent">
                  ★ {ar ? "الأكثر طلبًا" : "Recommended"}
                </span>
              )}
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-ghost">{tier.tag}</p>
              <p className="font-display text-[1.2rem] leading-[1.1] tracking-[-0.015em] text-text-primary">
                {tier.name}
              </p>
              <p className="font-display text-[1.5rem] tracking-[-0.01em] text-accent">{tier.price}</p>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-ghost">{tier.duration}</p>
              <p className="mt-auto border-t border-border-subtle pt-3 text-[0.8rem] leading-[1.6] text-text-tertiary" style={{ fontFamily: "Montserrat, system-ui" }}>
                {tier.note}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Link href="/pricing" className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-text-ghost transition-colors duration-base ease-physics hover:text-accent">
            {c.s02pricing}
          </Link>
        </div>
      </SectionWrap>

      {/* ══════════════════════════════════════════════════════════
          03 / HOW DOES IT WORK?
      ══════════════════════════════════════════════════════════ */}
      <SectionWrap id="how-it-works" n={ar ? "٠٣" : "03"} label={c.s03label} title={c.s03title} italic={c.s03italic}>
        <p className="mb-8 max-w-[52ch] text-[0.875rem] leading-[1.7] text-text-tertiary" style={{ fontFamily: "Montserrat, system-ui" }}>
          {c.s03sub}
        </p>

        {/* Timeline */}
        <div className="relative flex flex-col gap-0">
          {/* vertical line */}
          <div className="absolute start-[1.25rem] top-4 h-[calc(100%-2rem)] w-px bg-border-subtle md:start-[2rem]" aria-hidden />

          {c.phases.map((phase, i) => (
            <motion.div
              key={phase.n}
              className="relative flex gap-5 pb-8 last:pb-0"
              initial={{ opacity: 0, x: ar ? 16 : -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...physicsSlow, delay: i * 0.1 }}
            >
              {/* node */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-default bg-obsidian">
                <span className="font-mono text-[0.55rem] text-accent">{phase.n}</span>
              </div>

              <div className="flex flex-col gap-1 pt-1.5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="font-display text-[1.05rem] tracking-[-0.01em] text-text-primary">{phase.name}</p>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-text-ghost">{phase.days}</p>
                </div>
                <p className="max-w-[50ch] text-[0.85rem] leading-[1.7] text-text-secondary" style={{ fontFamily: "Montserrat, system-ui" }}>
                  {phase.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* payment note */}
        <div className="mt-8 flex items-center gap-2 rounded-card border border-border-subtle bg-surface-1/50 px-4 py-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-accent">$</span>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-text-ghost">{c.payNote}</p>
        </div>
      </SectionWrap>

      {/* ══════════════════════════════════════════════════════════
          04 / HOW DO WE START?
      ══════════════════════════════════════════════════════════ */}
      <SectionWrap id="how-we-start" n={ar ? "٠٤" : "04"} label={c.s04label} title={c.s04title} italic={c.s04italic} alt>
        <div className="grid gap-4 md:grid-cols-3">
          {c.steps.map((step, i) => (
            <motion.div
              key={step.n}
              className="flex flex-col gap-3 rounded-panel border border-border-subtle bg-surface-1 p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...physicsSlow, delay: i * 0.12 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-ghost">{step.n}</span>
                {i === 0 && (
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.08em] text-accent">
                    {ar ? "مجاني" : "Free"}
                  </span>
                )}
              </div>
              <p className="font-display text-[1.1rem] leading-[1.15] tracking-[-0.01em] text-text-primary">{step.name}</p>
              <p className="flex-1 text-[0.82rem] leading-[1.7] text-text-secondary" style={{ fontFamily: "Montserrat, system-ui" }}>
                {step.body}
              </p>
              {"cta" in step && step.cta && (
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-fit font-mono text-[0.62rem] uppercase tracking-[0.1em] text-accent transition-colors duration-base ease-physics hover:text-text-primary"
                >
                  {step.cta} →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </SectionWrap>

      {/* ══════════════════════════════════════════════════════════
          05 / EXPLORE THE SITE — cycle referral to every section
      ══════════════════════════════════════════════════════════ */}
      <SectionWrap id="explore" n={ar ? "٠٥" : "05"} label={ar ? "٠٥ / استكشف الموقع" : "05 / EXPLORE THE SITE"} title={ar ? "كل حاجة في مكانها" : "Everything in"} italic={ar ? "في مكانها." : "its place."}>
        <p className="mb-8 max-w-[52ch] text-[0.875rem] leading-[1.7] text-text-tertiary" style={{ fontFamily: "Montserrat, system-ui" }}>
          {ar
            ? "الموقع ده مش كتالوج — كل صفحة بتجاوب على سؤال مختلف في دماغك. استكشف من هنا."
            : "This site isn't a catalogue — every page answers a different question in your head. Explore from here."}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(ar ? SITE_LINKS.ar : SITE_LINKS.en).map((link, i) => (
            <SiteCard key={link.href} link={link} i={i} />
          ))}
        </div>
      </SectionWrap>

      {/* ══════════════════════════════════════════════════════════
          06 / FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-border-subtle bg-surface-1/30 px-6 py-20 text-center lg:px-16">
        {/* ghost text bg */}
        <span
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[clamp(6rem,18vw,16rem)] font-[800] uppercase leading-none tracking-[-0.04em] text-text-primary opacity-[0.025]"
          aria-hidden
        >
          {ar ? "يلّا" : "GO"}
        </span>

        <motion.div
          className="relative z-10 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={physicsSlow}
        >
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">{c.ctaKicker}</p>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.025em] text-text-primary">
            {c.ctaTitle} <em className="text-accent">{c.ctaItalic}</em>
          </h2>
          <p
            className="max-w-[44ch] text-[0.9rem] leading-[1.7] text-text-secondary"
            style={{ fontFamily: "Montserrat, system-ui" }}
          >
            {c.ctaSub}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://wa.me/201092500454"
              target="_blank"
              rel="noopener noreferrer"
              className="start-cta-primary"
            >
              {c.ctaPrimary}
            </a>
            <Link href="/services" className="start-cta-ghost">
              {c.ctaSecondary}
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────── */
function SectionWrap({
  id, n, label, title, italic, alt, children,
}: {
  id: string;
  n: string;
  label: string;
  title: string;
  italic: string;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={[
        "px-6 py-16 lg:px-16",
        alt ? "bg-surface-1/20" : "bg-obsidian",
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1080px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={physicsSlow}
          className="mb-8 flex flex-col gap-1"
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-text-ghost">{label}</p>
          <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-text-primary">
            {title} <em className="text-accent">{italic}</em>
          </h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

/* ─── Site cycle data ─────────────────────────────────────────── */
const SITE_LINKS = {
  en: [
    { href: "/about",        emoji: "👤", label: "About",        desc: "Who I am, what I believe, and why systems over deliverables." },
    { href: "/work",         emoji: "🎨", label: "Work",         desc: "20+ brand identity projects across pharma, food, education, and government." },
    { href: "/services",     emoji: "⚙️",  label: "Services",     desc: "Five capabilities, one studio, no handoff gaps — with the full process breakdown." },
    { href: "/pricing",      emoji: "💲",  label: "Pricing",      desc: "Three tiers, à la carte options, retainers — all numbers transparent." },
    { href: "/why",          emoji: "🧭",  label: "Why Mustafa",  desc: "The strategic and operational case for working with me over other options." },
    { href: "/agreement",    emoji: "📄",  label: "Agreement",    desc: "The work contract and terms — read before you sign, not after." },
    { href: "/capabilities", emoji: "🛠️",  label: "Capabilities", desc: "The full stack: software, production, languages, and industry experience." },
    { href: "/resources",    emoji: "📚",  label: "Resources",    desc: "Guides, playbooks, and frameworks I've built and use on every project." },
    { href: "/contact",      emoji: "✉️",  label: "Contact",      desc: "Start the conversation — project brief, quick question, or discovery call." },
  ],
  ar: [
    { href: "/about",        emoji: "👤", label: "نبذة",          desc: "مين أنا، ماذا أؤمن، ولماذا الأنظمة أهم من المخرجات." },
    { href: "/work",         emoji: "🎨", label: "الأعمال",       desc: "+٢٠ مشروع هوية بصرية عبر الدواء والغذاء والتعليم والحكومة." },
    { href: "/services",     emoji: "⚙️",  label: "الخدمات",       desc: "خمس قدرات، استوديو واحد، بدون فجوات تسليم — مع شرح العملية كاملة." },
    { href: "/pricing",      emoji: "💲",  label: "التسعير",       desc: "ثلاث فئات، خيارات à la carte، وريتينر — كل الأرقام شفافة." },
    { href: "/why",          emoji: "🧭",  label: "لماذا مصطفى",  desc: "الحجة الاستراتيجية والتشغيلية للعمل معي بدلاً من الخيارات الأخرى." },
    { href: "/agreement",    emoji: "📄",  label: "الاتفاقية",     desc: "عقد العمل والشروط — اقرأه قبل التوقيع، مش بعده." },
    { href: "/capabilities", emoji: "🛠️",  label: "القدرات",       desc: "التخصص الكامل: البرامج، الإنتاج، اللغات، وخبرة القطاعات." },
    { href: "/resources",    emoji: "📚",  label: "المصادر",       desc: "أدلة وكتيبات وأطر عمل بنيتها وأستخدمها في كل مشروع." },
    { href: "/contact",      emoji: "✉️",  label: "تواصل",         desc: "ابدأ المحادثة — بريف مشروع، سؤال سريع، أو مكالمة اكتشاف." },
  ],
} as const;

/* ─── SiteCard component ──────────────────────────────────────── */
import { useLang as _useLang } from "@/components/providers/lang-provider";

function SiteCard({
  link,
  i,
}: {
  link: { href: string; emoji: string; label: string; desc: string };
  i: number;
}) {
  return (
    <motion.a
      href={link.href}
      className="site-card group"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...physicsSlow, delay: i * 0.06 }}
    >
      <span className="site-card__emoji" aria-hidden>{link.emoji}</span>
      <span className="site-card__label font-display">{link.label}</span>
      <span className="site-card__desc" style={{ fontFamily: "Montserrat, system-ui" }}>{link.desc}</span>
      <span className="site-card__arrow" aria-hidden>→</span>
    </motion.a>
  );
}
