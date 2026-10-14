"use client";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";
import { trackEvent } from "@/lib/analytics";

/**
 * VIEWPORT HERO — "Mustafa Aboalazm OS" · overhaul S2 (2026-10-14)
 * ─────────────────────────────────────────────────────────────────
 * The hero now resolves the site's old audience conflict: ONE primary
 * action (Start a project → /contact) + ONE quiet secondary (See the
 * work). "For hiring teams" survives as a tertiary text link — recruiting
 * has its own page and no longer shares the first screen's weight.
 *
 * The System Constellation stays as the signature ambient asset; the
 * metric data-panel moved out to ProofStrip right below the hero (and the
 * headline still paints in the first frame — no hydration gate).
 *
 *   ┌─[STATUS CHIP · STUDIO]──────────────────────────────────────┐
 *   │                                                             │
 *   │  EDITORIAL SERIF HEADLINE           SYSTEM CONSTELLATION™   │
 *   │  sub-lede · [START A PROJECT] [See the work]                │
 *   │  For hiring teams → (tertiary, text only)                   │
 *   │                                                             │
 *   └─────────────────────────────────────────────────────────────┘
 *   ProofStrip follows immediately (own component).
 *
 * Spacing: 8px scale only. Motion: CSS keyframes from hero.css so the
 * text is visible in the server HTML (G1 contract, do not regress).
 */
import Link from "next/link";
import { preload } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import type { CSSProperties } from "react";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { motion } from "framer-motion";
import { COLOR, EASE_PHYSICS } from "@/lib/tokens";

/* The studio's own coral — the old site's red, worn as atmosphere */
const STUDIO_CORAL = {
  primary: "rgb(255 107 71 / 0.16)",
  secondary: "rgb(196 69 31 / 0.08)",
} as const;
import { SystemConstellation } from "./system-constellation";
import "./hero.css";

/* Headline comes from the i18n dictionary (t.heroLine1..3) */
const ITALIC_LINE = 1;

export function Hero() {
  /* The headline is painted in the first frame (no opacity:0 wait), so the
     display face must arrive before it — otherwise the late swap reflows
     the headline and shifts the constellation. Do not remove. */
  preload("/fonts/Gc_Epicpro.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  /* Home rests warm: faint coral glow — color presence without paint */
  useAmbientGlow(STUDIO_CORAL, 0.5);
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const HEADLINE = [t.heroLine1, t.heroLine2, t.heroLine3];

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-surface-0" style={{ isolation: "isolate" }}>
      {/* ── Expressive atmosphere — legible BEFORE any interaction.
          Focal light leans toward the constellation and mirrors in RTL. */}
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

      <div className="container-wide relative z-elevated grid flex-1 items-center gap-8 pb-8 pt-12 lg:pt-16 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left — typographic architecture */}
        <div className="flex flex-col gap-4">
          {/* Studio status chip — the pulse node from the old hiring strip,
              repurposed: the hero now speaks studio-first (overhaul S2).
              Plain span, not a link: a status, not a door. */}
          <div
            className="hero-rise flex flex-wrap items-center gap-2"
            style={{ "--rise-y": "-8px" } as CSSProperties}
          >
            <span className="glass inline-flex items-center gap-2 rounded-pill py-1 pl-2 pr-3">
              <span className="relative flex size-2 items-center justify-center" aria-hidden>
                <motion.span
                  className="absolute inset-0 rounded-pill"
                  style={{ backgroundColor: COLOR.status.success }}
                  animate={{ scale: [1, 2.6], opacity: [0.45, 0] }}
                  transition={{ duration: 2.2, ease: EASE_PHYSICS, repeat: Infinity, repeatDelay: 0.4 }}
                />
                <span className="relative size-1.5 rounded-pill" style={{ backgroundColor: COLOR.status.success }} />
              </span>
              <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-secondary">
                {ar ? "استوديو هويات — يستقبل مشاريع جديدة · ٢٠٢٦" : "IDENTITY STUDIO — ACCEPTING NEW PROJECTS · 2026"}
              </span>
            </span>
            <span className="hidden font-mono text-micro uppercase tracking-[0.10em] text-text-ghost lg:inline">
              {ar ? t.heroCoords : "30.1936° N, 31.4603° E · AL OBOUR"}
            </span>
          </div>

          <h1
            className="font-display tracking-[-0.03em] text-text-primary"
            style={{
              fontSize: "var(--text-hero)",
              lineHeight: "var(--text-hero--line-height)",
            }}
          >
            {/* The visible headline is a statement, not the page's subject — give the
                h1 (and the search snippet / screen readers) the person + role too. */}
            <span className="sr-only">
              {ar ? "مصطفى أبوالعزم — مصمم هوية بصرية أول. " : "Mustafa Aboalazm — Senior Brand Identity Designer. "}
            </span>
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block" style={{ "--i": i } as CSSProperties}>
                  {i === ITALIC_LINE ? <em className="text-accent">{line}</em> : line}
                </span>
              </span>
            ))}
          </h1>

          <div className="flex flex-col gap-3">
            <p
              className="hero-rise max-w-[46ch] text-lead text-text-secondary"
              style={{ "--i": 0 } as CSSProperties}
            >
              {t.heroLead}
            </p>

            {/* ONE primary action + ONE quiet secondary (overhaul S2).
                The old dual pair (View Work + Download CV) split the fold's
                attention; CV now lives in the footer and on /for-hiring. */}
            <div className="hero-rise flex flex-wrap items-center gap-3 pt-1" style={{ "--i": 1 } as CSSProperties}>
              <Link
                href="/contact"
                onClick={() => trackEvent("cta_start_project", { placement: "hero" })}
                className="group relative inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-2.5 font-mono text-label uppercase tracking-[0.06em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5"
              >
                <span>{ar ? "ابدأ مشروعك" : "Start a project"}</span>
                <span
                  aria-hidden
                  className="inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                >
                  <Icon name="arrow-right" />
                </span>
              </Link>
              <a
                href="#selected-work"
                className="group relative inline-flex items-center gap-2 rounded-pill border border-border-default bg-surface-1 px-4 py-2.5 font-mono text-label uppercase tracking-[0.06em] text-text-primary transition-colors duration-base ease-physics hover:border-accent hover:text-accent"
              >
                <span>{ar ? "شوف الأعمال" : "See the work"}</span>
                <span aria-hidden className="inline-flex transition-transform duration-base ease-physics group-hover:translate-y-0.5">
                  <Icon name="arrow-down" />
                </span>
              </a>
            </div>

            {/* Tertiary: recruiting reads its own page — text link only. */}
            <div
              className="hero-rise flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-micro text-text-ghost"
              style={{ "--i": 2 } as CSSProperties}
            >
              <Link href="/for-hiring" className="underline decoration-border-default underline-offset-4 transition-colors hover:text-text-primary">
                {ar ? "للشركات والتوظيف ←" : "For hiring teams →"}
              </Link>
            </div>
          </div>
        </div>

        {/* Right — signature ambient asset. */}
        <div className="hero-settle w-full">
          <SystemConstellation />
        </div>
      </div>
    </section>
  );
}
