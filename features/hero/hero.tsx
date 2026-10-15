"use client";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";

/**
 * VIEWPORT HERO — "Mustafa Aboalazm OS"
 * ─────────────────────────────────────────────────────────────────
 * Architecture: Left-Aligned Split Hierarchy + Portfolio Work Wall.
 *
 *   ┌─[STATUS NODE]──────────────────────────────────────────────┐
 *   │                                                            │
 *   │  NAME + EDITORIAL HEADLINE          CASE-STUDY WALL      │
 *   │  lead · [VIEW WORK] [DOWNLOAD CV]                          │
 *   │                                                            │
 *   ├─[PROJECT OUTCOMES & SYSTEM STANDARDS]─────────────────────┤
 *   │  5Y · LOCKED · 20+ — evidence row                          │
 *   └────────────────────────────────────────────────────────────┘
 *
 * Spacing: 8px scale only (gap-2/3/4, py-8, pt-16 → 16/24/32/64/128).
 * Canvas: bg-surface-0 (theme-reactive — Obsidian in dark, Alabaster in light).
 * Motion: every transition rides --ease-physics via lib/motion; the page-load
 * entrances are CSS keyframes (hero.css) so the text is visible in the server
 * HTML instead of waiting on hydration.
 */
import Link from "next/link";
import { preload } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import type { CSSProperties } from "react";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { trackEvent } from "@/lib/analytics";

/* The studio's own coral — the old site's red, worn as atmosphere */
const STUDIO_CORAL = {
  primary: "rgb(255 107 71 / 0.16)",
  secondary: "rgb(196 69 31 / 0.08)",
} as const;
import { StatusNode } from "./status-node";
import { MetricRow } from "./metric-row";
import { SystemConstellation } from "./system-constellation";
import { HeroWall } from "./hero-wall";
import type { HeroWallTile } from "./hero-wall-data";
import "./hero.css";

/* Headline is dynamic — see inside Hero() */
const ITALIC_LINE = 1;

export function Hero({ wall = [] }: { wall?: readonly HeroWallTile[] }) {
  /* The headline is painted in the first frame. Preload the display face so
     its late swap cannot reflow the headline or the work wall. */
  preload("/fonts/Gc_Epicpro.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  /* Home rests warm: faint coral glow — color presence without paint */
  useAmbientGlow(STUDIO_CORAL, 0.5);
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const HEADLINE = [t.heroLine1, t.heroLine2, t.heroLine3];

  return (
    <section className="home-hero relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-surface-0" style={{ isolation: "isolate" }}>
      {/* ── Expressive atmosphere — legible BEFORE any interaction ──
          The audit's core finding: the hero's colour existed only as a
          diffuse blurred glow whose alpha was too low to read. These two
          static layers give the first viewport an authored light source
          and a material surface. Both are aria-hidden, both sit under the
          content, and neither is hover-gated.

          Focal light leans right in LTR (toward the work wall) and
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
      <div className="container-wide relative z-elevated grid flex-1 items-center gap-8 pb-8 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:pt-14">
        {/* Left — typographic architecture */}
        <div className="flex flex-col gap-2 lg:gap-3">
          {/* Live status row — in-flow micro-frame */}
          <div
            className="hero-rise flex flex-wrap items-center gap-2"
            style={{ "--rise-y": "-8px" } as CSSProperties}
          >
            <StatusNode />
            <span className="hidden font-mono text-micro uppercase tracking-[0.10em] text-text-ghost 2xl:inline">
{ar ? t.heroCoords : "30.1936° N, 31.4603° E · AL OBOUR"}
            </span>
          </div>

          {/* Who this is — the first thing a hiring manager looks for, and the
              one thing the first screen never said (the nav carries only the
              "MA" mark). Decorative here: the <h1> below already carries the
              same name + role for search and screen readers. */}
          <p
            aria-hidden
            className="hero-rise font-mono text-label uppercase tracking-[0.12em] text-text-secondary"
            style={{ "--i": 0 } as CSSProperties}
          >
            {/* On a phone the name alone: the role is already in the pill above
                ("brand identity designer roles") and a second wrapped line would
                push the second button off the first screen. */}
            {ar ? (
              <>مصطفى أبوالعزم<span className="hidden sm:inline"> — مصمم هوية بصرية أول</span></>
            ) : (
              <>Mustafa Aboalazm<span className="hidden sm:inline"> — Senior Brand Identity Designer</span></>
            )}
          </p>

          <h1
            className="font-display tracking-[-0.03em] text-text-primary"
            style={{
              fontSize: "var(--text-hero)",
              /* 0.95 is right for the Latin caps face; Arabic needs room for its
                 tails and dots — each line sits in an overflow-hidden wrapper
                 (for the rise-in), so at 0.95 the last line lost its descenders. */
              lineHeight: ar ? 1.2 : "var(--text-hero--line-height)",
            }}
          >
            {/* The visible headline is a statement, not the page's subject — give the
                h1 (and the search snippet / screen readers) the person + role too. */}
            <span className="sr-only">
              {ar ? "مصطفى أبوالعزم — مصمم هوية بصرية أول. " : "Mustafa Aboalazm — Senior Brand Identity Designer. "}
            </span>
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em] text-balance rtl:pb-[0.1em]">
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

            {/* Two clear primary actions: View Selected Work & Download CV */}
            <div className="hero-rise flex flex-wrap items-center gap-3 pt-1" style={{ "--i": 1 } as CSSProperties}>
              <a
                href="#selected-work"
                className="group relative inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-2.5 font-mono text-label uppercase tracking-[0.06em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5"
              >
                <span>{t.heroExplore}</span>
                <span
                  aria-hidden
                  className="inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                >
                  <Icon name="arrow-right" />
                </span>
              </a>
              <a
                href="/cv"
                onClick={() => trackEvent("cv_download", { placement: "hero" })}
                download="Mustafa_Taha_Brand_Identity_CV.docx"
                className="group relative inline-flex items-center gap-2 rounded-pill border border-border-default bg-surface-1 px-4 py-2.5 font-mono text-label uppercase tracking-[0.06em] text-text-primary transition-colors duration-base ease-physics hover:border-accent hover:text-accent"
              >
                <span>{t.heroDownloadCv}</span>
                <span aria-hidden className="inline-flex transition-transform duration-base ease-physics group-hover:translate-y-0.5">
                  <Icon name="arrow-down" />
                </span>
              </a>
            </div>

            <div
              className="hero-rise flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-micro text-text-ghost"
              style={{ "--i": 2 } as CSSProperties}
            >
              <Link href="/for-hiring" className="underline decoration-border-default underline-offset-4 transition-colors hover:text-text-primary">
                {ar ? "للشركات والتوظيف ←" : "For hiring teams →"}
              </Link>
              <span aria-hidden>·</span>
              <Link href="/services" className="underline decoration-border-default underline-offset-4 transition-colors hover:text-text-primary">
                {ar ? "خدمات العملاء ←" : "Client services →"}
              </Link>
            </div>
          </div>
        </div>

        {/* Right — proof, not decoration.
            The column used to hold the system constellation: an animated
            diagram of the idea and not one pixel of the work. It now holds
            the work (desktop only; see HeroWall). If fewer than two curated
            cases are available it falls back to the constellation, so the
            column is never empty. A definite `w-full` still matters: without
            it the frame resolved against an auto-width parent and collapsed. */}
        {wall.length >= 2 ? (
          <div className="hero-settle hidden w-full lg:block">
            <HeroWall tiles={wall} />
          </div>
        ) : (
          <div className="hero-settle w-full">
            <SystemConstellation />
          </div>
        )}
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
