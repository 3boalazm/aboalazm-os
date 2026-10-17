"use client";

import { motion, useReducedMotion } from "framer-motion";
import { physics, reveal } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";

interface Metric {
  prefix?: string;
  value: string;
  suffix?: string;
  label: string;
  context: string;
  detail: string;
}

const METRICS = {
  en: [
    {
      value: "5Y",
      suffix: "",
      label: "Identity Stewardship",
      context: "NILE PHARMA FOOD · 2020–25",
      detail: "Five-year brand identity stewardship across the rebrand, packaging, and campaign systems.",
    },
    {
      value: "LOCKED",
      suffix: "",
      label: "Design Governance",
      context: "GOVERNANCE PRINCIPLE",
      detail: "Token-governed brand rules are the operating standard; this is not a measured performance result.",
    },
    {
      value: "20",
      suffix: "+",
      label: "Clients & Organizations",
      context: "9+ YEARS OF PROFESSIONAL PRACTICE · 2017–26",
      detail: "Local and international clients across pharma, food, education, government, and related sectors",
    },
  ],
  ar: [
    {
      value: "5 سنوات",
      suffix: "",
      label: "إدارة الهوية بصريًا",
      context: "نايل فارما فود · 2020–25",
      detail: "إدارة الهوية البصرية لخمس سنوات عبر إعادة الهوية والتغليف وأنظمة الحملات.",
    },
    {
      value: "مقفل",
      suffix: "",
      label: "حوكمة التصميم",
      context: "مبدأ حوكمة",
      detail: "حوكمة الهوية بالتوكنز هي معيار تشغيل؛ وليست نتيجة أداء مقاسة.",
    },
    {
      value: "20",
      suffix: "+",
      label: "عميل ومؤسسة",
      context: "9+ سنوات ممارسة مهنية · 2017–26",
      detail: "عملاء ومؤسسات محلية ودولية عبر قطاعات الأدوية والغذاء والتعليم والحكومة وغيرها",
    },
  ],
} as const;

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <motion.div
      variants={reveal.item}
      whileHover="hover"
      className="group relative flex-1 cursor-default px-3 py-4 first:pl-0"
    >
      <span className="absolute inset-x-0 top-0 h-px bg-border-subtle" />
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-accent"
        initial={{ scaleX: 0 }}
        variants={{ hover: { scaleX: 1 } }}
        transition={physics}
      />
      <motion.p
        variants={{ hover: { y: -4 } }}
        transition={physics}
        className="font-display text-display leading-[1.02] tracking-[-0.025em] text-text-primary"
      >
        {metric.prefix && <span className="text-text-tertiary">{metric.prefix}</span>}
        {metric.value}
        <span className="text-[0.55em] text-text-secondary transition-colors duration-base ease-physics group-hover:text-accent">
          {metric.suffix}
        </span>
      </motion.p>
      <p className="mt-1 text-body font-medium text-text-primary">{metric.label}</p>
      <p className="mt-0.5 font-mono text-micro uppercase tracking-[0.08em] text-accent">
        {metric.context}
      </p>
      <p className="mt-1 text-body-sm text-text-tertiary">
        {metric.detail}
      </p>
    </motion.div>
  );
}

export function MetricRow() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const metrics = METRICS[lang];
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "مخرجات المشاريع ومعايير النظام" : "PROJECT OUTCOMES & SYSTEM STANDARDS"}
        </p>
        <p className="hidden font-mono text-micro text-text-ghost sm:inline">
          {ar ? "أرقام موثقة بمشاريعها ومبادئ عمل" : "Project-grounded metrics & operational principles"}
        </p>
      </div>
      <motion.div
        variants={reveal.container}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="flex flex-col gap-2 sm:flex-row sm:gap-4"
      >
        {metrics.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </motion.div>
    </div>
  );
}
