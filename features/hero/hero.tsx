"use client";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";

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
 * Canvas: bg-surface-0 (theme-reactive — Obsidian in dark, Alabaster in light).
 * Motion: every transition rides --ease-physics via lib/motion.
 */
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { heroLine, reveal, physics } from "@/lib/motion";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";

/* The studio's own coral — the old site's red, worn as atmosphere */
const STUDIO_CORAL = {
  primary: "rgb(255 107 71 / 0.16)",
  secondary: "rgb(196 69 31 / 0.08)",
} as const;
import { usePersona } from "@/components/providers/persona-provider";
import { StatusNode } from "./status-node";
import { MetricRow } from "./metric-row";
import { SystemConstellation } from "./system-constellation";

/* Headline is dynamic — see inside Hero() */
const ITALIC_LINE = 1;

export function Hero() {
  /* Home rests warm: faint coral glow — color presence without paint */
  useAmbientGlow(STUDIO_CORAL, 0.5);
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  /* One reduced-motion read per render — reused below instead of calling
     a hook per headline line inside .map(). */
  const reduceMotion = useReducedMotion();
  const HEADLINE = ar
    ? [t.heroLine1, t.heroLine2, t.heroLine3]
    : [t.heroLine1, t.heroLine2, t.heroLine3];

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-surface-0" style={{ isolation: "isolate" }}>
      {/* ── Expressive atmosphere — legible BEFORE any interaction ──
          The audit's core finding: the hero's colour existed only as a
          diffuse blurred glow whose alpha was too low to read. These two
          static layers give the first viewport an authored light source
          and a material surface. Both are aria-hidden, both sit under the
          content, and neither is hover-gated.

          Focal light leans right in LTR (toward the constellation) and
          mirrors in RTL so the composition stays balanced. */}
      <div
        aria-hidden
        className="atmos-field atmos-drift"
        style={
          {
            "--atmos-1": "var(--color-accent)",
            "--atmos-2": "var(--color-creative)",
            "--atmos-x": ar ? "26%" : "74%",
            "--atmos-y": "16%",
          } as CSSProperties
        }
      />
      <div aria-hidden className="grain-layer" />

      {/* ── 2 + 4 · Split hierarchy (status row in-flow, clear of nav) ── */}
      <div className="container-wide relative z-elevated grid flex-1 items-center gap-8 pb-8 pt-12 lg:pt-16 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left — typographic architecture */}
        <div className="flex flex-col gap-4">
          {/* Live status row — in-flow micro-frame */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...physics, delay: 0.9 }}
            className="flex flex-wrap items-center gap-2"
          >
            <StatusNode />
            <span className="hidden font-mono text-micro uppercase tracking-[0.10em] text-text-ghost lg:inline">
{ar ? t.heroCoords : "30.1936° N, 31.4603° E · AL OBOUR"}
            </span>
          </motion.div>

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
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                >
                  {i === ITALIC_LINE ? <em className="text-accent">{line}</em> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            variants={reveal.container}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            className="flex flex-col gap-3"
          >
            <motion.p
              variants={reveal.item}
              className="max-w-[46ch] text-lead text-text-secondary"
            >
              {t.heroLead}
            </motion.p>

            {/* One primary action, one secondary. Promise → Proof, then convert. */}
            <motion.div variants={reveal.item} className="flex flex-wrap items-center gap-3">
              <a
                href="#selected-work"
                className="group relative inline-flex items-center gap-1 rounded-pill bg-accent px-3 py-2 font-mono text-label uppercase tracking-[0.06em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5"
              >
                <span>{t.heroExplore}</span>
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
                {t.heroCommission}
                <span className="absolute inset-x-1 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-slow ease-physics group-hover:scale-x-100" />
              </a>
            </motion.div>
            <PersonaHint ar={ar} />
          </motion.div>
        </div>

        {/* Right — signature asset layer.
            This used to be `justify-self-center` with no width of its own,
            which made the frame's `w-full` resolve against an auto-width
            parent and collapse to ~300px on a 1440 viewport — a postage
            stamp in a large void. A definite width lets the asset scale
            with the column and hold its side of the composition. */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...physics, duration: 1.2, delay: 0.5 }}
          className="w-full"
        >
          <SystemConstellation />
        </motion.div>
      </div>

      {/* ── 3 · Interactive metric row — bento band ──
          `w-full` is load-bearing: as a flex child of a column container,
          `container-wide` (margin-inline:auto, max-width, no width) shrank
          to fit its content, so the band's top rule only spanned ~785px of
          a 1440px viewport instead of the container. */}
      <div className="container-wide relative z-elevated w-full border-t border-border-subtle py-4">
        <MetricRow />
      </div>
    </section>
  );
}

/** Optional, non-blocking framing — never a header control, never required. */
function PersonaHint({ ar }: { ar: boolean }) {
  const { persona, setPersona } = usePersona();

  if (persona) {
    return (
      <p className="font-mono text-micro text-text-ghost">
        {persona === "founder"
          ? ar
            ? "بتتشاف نسخة النتائج والعائد."
            : "Framed for business outcomes."
          : ar
            ? "بتتشاف نسخة الأنظمة والتسليم."
            : "Framed for systems and handoff."}{" "}
        <button
          type="button"
          onClick={() => setPersona(null)}
          className="underline decoration-border-default underline-offset-4 transition-colors duration-base ease-physics hover:text-text-secondary"
        >
          {ar ? "ارجع للعام" : "Keep it general"}
        </button>
      </p>
    );
  }

  return (
    <p className="max-w-[46ch] font-mono text-micro text-text-ghost">
      {ar ? "عايز الكلام يتظبط على دورك؟" : "What are you here to solve?"}{" "}
      <button
        type="button"
        onClick={() => setPersona("founder")}
        className="text-text-tertiary underline decoration-border-default underline-offset-4 transition-colors duration-base ease-physics hover:text-text-secondary"
      >
        {ar ? "براند يشتغل" : "A brand that performs"}
      </button>
      <span aria-hidden> · </span>
      <button
        type="button"
        onClick={() => setPersona("technical")}
        className="text-text-tertiary underline decoration-border-default underline-offset-4 transition-colors duration-base ease-physics hover:text-text-secondary"
      >
        {ar ? "نظام الفريق يقدر يبني عليه" : "A system the team can ship"}
      </button>
    </p>
  );
}
