"use client";

/**
 * VIEWPORT HERO — "Mustafa Aboalazm OS"
 * ─────────────────────────────────────────────────────────────────
 * Architecture: Left-Aligned Split Hierarchy + Micro-Text Framing.
 *
 *   ┌─[STATUS NODE]──────────────────────────────────────────────┐
 *   │                                                            │
 *   │  EDITORIAL SERIF HEADLINE          SYSTEM CONSTELLATION™   │
 *   │  (clip-path line reveals)          (magnetic SVG mesh)     │
 *   │  sub-lede + CTA                                            │
 *   │                                                            │
 *   ├─[MICRO FRAME: coordinates · scroll cue]────────────────────┤
 *   │  +42% · 0% · 3X  — monumental metric row                   │
 *   └────────────────────────────────────────────────────────────┘
 *
 * Spacing: 8px scale only (gap-2/3/4, py-8, pt-16 → 16/24/32/64/128).
 * Canvas: absolute Obsidian #080710 (token: bg-obsidian).
 * Motion: every transition rides --ease-physics via lib/motion.
 */
import { motion } from "framer-motion";
import { heroLine, reveal, physics } from "@/lib/motion";
import { StatusNode } from "./status-node";
import { MetricRow } from "./metric-row";
import { SystemConstellation } from "./system-constellation";

/* Headline broken into masked lines for the clip-path rise */
/* v2 headline per spec 04 — line 2 carries the italic:
   "Code-Aligned" is where brand studio and engineering shake hands. */
const HEADLINE: readonly string[] = [
  "Designing",
  "Code-Aligned",
  "Digital Systems",
];
const ITALIC_LINE = 1;

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col bg-obsidian">
      {/* ── 1 · Live Status Node — floating, absolute ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...physics, delay: 0.9 }}
        className="absolute left-3 top-3 z-nav sm:left-8 sm:top-4"
      >
        <StatusNode />
      </motion.div>

      {/* Micro-text framing — top-right coordinate stamp */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...physics, delay: 1.1 }}
        className="absolute right-3 top-4 hidden font-mono text-micro uppercase tracking-[0.10em] text-text-ghost sm:right-8 sm:block"
      >
        30.0444° N, 31.2357° E · CAIRO
      </motion.p>

      {/* ── 2 + 4 · Split hierarchy ── */}
      <div className="container-wide grid flex-1 items-center gap-8 pb-8 pt-16 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left — typographic architecture */}
        <div className="flex flex-col gap-4">
          <h1
            className="font-display tracking-[-0.03em] text-text-primary"
            style={{
              fontSize: "var(--text-hero)",
              lineHeight: "var(--text-hero--line-height)",
            }}
          >
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block will-change-transform"
                  custom={i}
                  variants={heroLine}
                  initial="hidden"
                  animate="visible"
                >
                  {i === ITALIC_LINE ? <em>{line}</em> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            variants={reveal.container}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            <motion.p
              variants={reveal.item}
              className="max-w-[46ch] text-lead text-text-secondary"
            >
              Identity, design systems, and digital infrastructure —
              engineered as one operating system for teams that ship.
            </motion.p>

            {/* CTA pair — custom hover: underline draw + arrow nudge */}
            <motion.div variants={reveal.item} className="flex items-center gap-3">
              <a
                href="/work"
                className="group glass relative inline-flex items-center gap-1 overflow-hidden rounded-pill px-3 py-2 text-body text-text-primary transition-colors duration-base ease-physics hover:border-border-strong"
              >
                <span>Explore the system</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-base ease-physics group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <a
                href="/contact"
                className="group relative px-1 py-2 font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
              >
                Start a commission
                <span className="absolute inset-x-1 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-slow ease-physics group-hover:scale-x-100" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — signature asset layer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...physics, duration: 1.2, delay: 0.5 }}
          className="justify-self-center lg:justify-self-end"
        >
          <SystemConstellation />
        </motion.div>
      </div>

      {/* ── 3 · Interactive metric row — bento band ── */}
      <div className="container-wide border-t border-border-subtle py-4">
        <MetricRow />
      </div>
    </section>
  );
}
