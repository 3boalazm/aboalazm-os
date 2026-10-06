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
      prefix: "+",
      value: "40",
      suffix: "%",
      label: "Online Visibility",
      context: "NILE PHARMA FOOD · 2020–25",
      detail: "Measured via Search Console impressions across first 6 months post-rebrand",
    },
    {
      value: "0",
      suffix: "%",
      label: "Design Drift",
      context: "GOVERNANCE STANDARD (PRINCIPLE)",
      detail: "Core principle: token-governed brand books eliminate rogue styles in production",
    },
    {
      value: "20",
      suffix: "+",
      label: "Brand Systems Shipped",
      context: "9 YEARS OF PRACTICE · 2018–26",
      detail: "Full-cycle bilingual identity systems across healthcare, pharma, and food",
    },
  ],
  ar: [
    {
      prefix: "+",
      value: "40",
      suffix: "%",
      label: "الظهور الرقمي",
      context: "نايل فارما فود · 2020–25",
      detail: "محسوب عبر مرات الظهور بمحركات البحث خلال أول ٦ أشهر من إطلاق الهوية والموقع",
    },
    {
      value: "0",
      suffix: "%",
      label: "انحراف التصميم",
      context: "معيار الحوكمة (مبدأ عمل)",
      detail: "مبدأ معتمد: أدلة الهوية المحكومة بالتوكنز تمنع الارتجال والانحراف في التنفيذ",
    },
    {
      value: "20",
      suffix: "+",
      label: "نظام هوية تم تنفيذه",
      context: "٩ سنوات خبرة · 2018–26",
      detail: "أنظمة هوية ثنائية اللغة متكاملة عبر قطاعات الرعاية الصحية والأدوية والغذاء",
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
          {ar ? "معايير النظام والمخرجات الموثقة" : "SYSTEM STANDARDS & MEASURED BENCHMARKS"}
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
