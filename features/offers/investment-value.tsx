"use client";

/**
 * InvestmentValue — "What your investment includes" section for /pricing
 *
 * Reframes price from a cost list into an investment in a governed system.
 * Communicates the code-aligned / token-driven value in the studio's voice.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  ⚠️  METRICS ARE PLACEHOLDERS — pending measurement.            │
 * │                                                                 │
 * │  The 42% / 3X / 0% figures below are positioning placeholders   │
 * │  and are NOT yet backed by measured, documented project data.   │
 * │  Update them (and remove this notice) once real numbers exist,  │
 * │  ideally citing the source project. Until then they read as     │
 * │  aspirational systemic claims. See METRICS array — each has a    │
 * │  `pending: true` flag to make them easy to find and update.     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Bilingual + RTL.
 */

import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { physicsSlow } from "@/lib/motion";

/* ─── PLACEHOLDER METRICS — update when measured & documented ─── */
const METRICS = [
  {
    value: "42%",
    en: "Faster delivery",
    ar: "أسرع في التسليم",
    subEn: "Fixed 38-day timeline vs open-ended scope",
    subAr: "جدول ثابت ٣٨ يوم مقابل نطاق مفتوح",
    pending: true,
  },
  {
    value: "3×",
    en: "Handoff efficiency",
    ar: "كفاءة التسليم للمطورين",
    subEn: "Token-driven handoff — exact values, not guesses",
    subAr: "تسليم معتمد على التوكنز — قيم دقيقة لا تخمين",
    pending: true,
  },
  {
    value: "0%",
    en: "Design drift",
    ar: "انحراف في التصميم",
    subEn: "What's approved at the gate is what ships",
    subAr: "ما يُعتمد عند البوابة هو ما يُنفَّذ",
    pending: true,
  },
] as const;

const VALUE_PROPS = {
  en: [
    ["A system, not files", "You receive a governed identity system with documented rules — not a folder of static images that fall apart the moment a new person touches the brand."],
    ["Single source of truth", "Colours, type, and spacing are defined as brand tokens. One approved source drives every application, so the brand stays itself as it scales."],
    ["Code-aligned handoff", "The identity is built to translate cleanly into code from day one. Developers get exact token values, cutting the meetings and rework that inflate a project's real cost."],
    ["No hidden rework cost", "Traditional design drifts when it hits development. Approving tokens at the design gate protects your budget from the expensive fixes that surface after launch."],
  ],
  ar: [
    ["نظام، لا ملفات", "تستلم نظام هوية محكوم بقواعد موثّقة — لا مجلد صور ثابتة تنهار لحظة ما يلمس البراند شخص جديد."],
    ["مصدر وحيد للحقيقة", "الألوان والخطوط والمسافات تُعرَّف كـ brand tokens. مصدر واحد معتمد يقود كل تطبيق، فيبقى البراند نفسه وهو يتوسع."],
    ["تسليم متوافق مع الكود", "الهوية مبنية لتُترجَم بنظافة إلى كود من اليوم الأول. المطورون يستلمون قيم توكنز دقيقة، مما يقلل الاجتماعات وإعادة العمل التي ترفع التكلفة الحقيقية."],
    ["لا تكلفة خفية لإعادة العمل", "التصميم التقليدي ينحرف عند التنفيذ. اعتماد التوكنز عند بوابة التصميم يحمي ميزانيتك من الإصلاحات المكلفة التي تظهر بعد الإطلاق."],
  ],
} as const;

const UI = {
  en: {
    kicker: "WHAT YOU'RE INVESTING IN",
    title: "Not a price.",
    italic: "An asset.",
    lede: "The number buys more than a logo. It buys a governed system engineered to hold its value as your brand scales — and to save what a redesign would later cost.",
    note: "Efficiency figures are indicative and being formalised against project data.",
  },
  ar: {
    kicker: "ما الذي تستثمر فيه",
    title: "ليس سعرًا.",
    italic: "بل أصلًا.",
    lede: "الرقم يشتري أكثر من شعار. يشتري نظامًا محكومًا مصمَّمًا ليحافظ على قيمته وأنت تتوسع — وليوفّر ما ستكلّفه إعادة التصميم لاحقًا.",
    note: "أرقام الكفاءة استرشادية ويجري توثيقها مقابل بيانات المشاريع.",
  },
} as const;

export function InvestmentValue() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = ar ? UI.ar : UI.en;
  const props = ar ? VALUE_PROPS.ar : VALUE_PROPS.en;
  const hasPending = METRICS.some((m) => m.pending);

  return (
    <div className="flex flex-col gap-6">
      {/* heading */}
      <div className="flex flex-col gap-1">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{t.kicker}</p>
        <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
          {t.title} <em className="text-accent">{t.italic}</em>
        </h2>
        <p className="mt-1 max-w-[58ch] text-body-sm text-text-secondary" style={{ fontFamily: "Montserrat, system-ui" }}>
          {t.lede}
        </p>
      </div>

      {/* metric strip */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.value}
            className="flex flex-col gap-1 rounded-panel border border-border-subtle bg-surface-1 p-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ...physicsSlow, delay: i * 0.08 }}
          >
            <span className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none tracking-[-0.02em] text-text-primary">
              {m.value}
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-accent">
              {ar ? m.ar : m.en}
            </span>
            <span className="text-[0.72rem] leading-[1.5] text-text-tertiary" style={{ fontFamily: "Montserrat, system-ui" }}>
              {ar ? m.subAr : m.subEn}
            </span>
          </motion.div>
        ))}
      </div>

      {/* value props */}
      <div className="grid gap-2 sm:grid-cols-2">
        {props.map(([title, body], i) => (
          <motion.div
            key={title}
            className="flex gap-3 rounded-panel border border-border-subtle bg-surface-1/60 p-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ...physicsSlow, delay: i * 0.06 }}
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <div className="flex flex-col gap-1">
              <p className="font-display text-[0.95rem] tracking-[-0.01em] text-text-primary">{title}</p>
              <p className="text-[0.8rem] leading-[1.6] text-text-tertiary" style={{ fontFamily: "Montserrat, system-ui" }}>{body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* honest footnote while metrics are placeholders */}
      {hasPending && (
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.08em] text-text-ghost">
          * {t.note}
        </p>
      )}
    </div>
  );
}
