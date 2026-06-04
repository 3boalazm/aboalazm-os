"use client";

/**
 * METRIC ROW — context-aware scaled metrics.
 * Three bento cells in one horizontal band. The numbers are monumental
 * (display-scale serif), the labels are system-scale mono. On hover the
 * value lifts 4px on ease-physics, the top hairline ignites from left
 * to right, and the unit glyph (+ / % / X) warms to accent — three
 * coordinated micro-interactions, zero generic transitions.
 */
import { motion } from "framer-motion";
import { physics, reveal } from "@/lib/motion";

interface Metric {
  /** The monumental figure, split for typographic control */
  prefix?: string;
  value: string;
  suffix?: string;
  label: string;
  /** Mono sub-caption — the proof line */
  context: string;
}

const METRICS: readonly Metric[] = [
  {
    prefix: "+",
    value: "42",
    suffix: "%",
    label: "Delivery Speed",
    context: "TOKEN-DRIVEN HANDOFF",
  },
  {
    value: "0",
    suffix: "%",
    label: "Design Drift",
    context: "SINGLE SOURCE OF TRUTH",
  },
  {
    value: "3",
    suffix: "X",
    label: "Handoff Efficiency",
    context: "SYSTEM > DELIVERABLES",
  },
] as const;

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <motion.div
      variants={reveal.item}
      whileHover="hover"
      className="group relative flex-1 cursor-default px-3 py-4 first:pl-0"
    >
      {/* Igniting hairline — scales from the left on hover */}
      <span className="absolute inset-x-0 top-0 h-px bg-border-subtle" />
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-accent"
        initial={{ scaleX: 0 }}
        variants={{ hover: { scaleX: 1 } }}
        transition={physics}
      />

      {/* Monumental value — lifts on hover */}
      <motion.p
        variants={{ hover: { y: -4 } }}
        transition={physics}
        className="font-display text-display leading-[1.02] tracking-[-0.025em] text-text-primary"
      >
        {metric.prefix && (
          <span className="text-text-tertiary">{metric.prefix}</span>
        )}
        {metric.value}
        <span className="text-[0.55em] text-text-secondary transition-colors duration-base ease-physics group-hover:text-accent">
          {metric.suffix}
        </span>
      </motion.p>

      <p className="mt-1 text-body text-text-secondary">{metric.label}</p>
      <p className="mt-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost transition-colors duration-base ease-physics group-hover:text-text-tertiary">
        {metric.context}
      </p>
    </motion.div>
  );
}

export function MetricRow() {
  return (
    <motion.div
      variants={reveal.container}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2 sm:flex-row sm:gap-4"
    >
      {METRICS.map((m) => (
        <MetricCard key={m.label} metric={m} />
      ))}
    </motion.div>
  );
}
