"use client";
import { useT } from "@/hooks/use-t";
import { Icon } from "@/components/ui/Icon";

/**
 * LIVE TOKEN PLAYGROUND — "the system, hands-on."
 * ─────────────────────────────────────────────────────────────────
 * The pitch made tactile: visitors drag the studio's actual tokens
 * and watch a real layout recalculate. The mechanism IS the message —
 * change one value, everything stays coherent. That's what zero
 * design drift means.
 *
 * Architecture:
 *   · React state holds four tokens: space unit, radius, motion
 *     duration, theme mode.
 *   · State is written ONCE as CSS custom properties on the canvas
 *     frame (style attribute). Every element inside derives its
 *     geometry from calc() on those vars — so a single state write
 *     re-flows the entire card, and the browser does the math.
 *   · Every property that moves carries
 *       transition: <props> var(--pg-duration) var(--ease-physics)
 *     so each recalculation ANIMATES into place on the house curve,
 *     at the duration the visitor chose. The motion slider tunes
 *     the very easing you feel while using it.
 *
 * No external state lib, no context — useState + CSS variables.
 */
import { useState } from "react";
import { DockSlider } from "./dock-slider";

type ThemeMode = "obsidian" | "alabaster";

interface PlaygroundTokens {
  /** Base spacing unit in px — the 8px doctrine, made adjustable */
  space: number;
  /** Border radius in px (12–48 per spec) */
  radius: number;
  /** Motion duration in ms */
  duration: number;
  theme: ThemeMode;
}

const DEFAULTS: PlaygroundTokens = {
  space: 8,
  radius: 12,
  duration: 400,
  theme: "obsidian",
};

/* Theme palettes — written into the same CSS variable slots so the
   canvas re-skins through one mechanism, identical to geometry. */
const THEMES: Record<ThemeMode, Record<string, string>> = {
  obsidian: {
    "--pg-bg": "#080710",
    "--pg-surface": "#0D0C18",
    "--pg-surface-2": "#121120",
    "--pg-ink": "rgb(248 248 250 / 1)",
    "--pg-ink-2": "rgb(248 248 250 / 0.62)",
    "--pg-ink-3": "rgb(248 248 250 / 0.5)", /* 4.5:1 needs >= .47 on these surfaces (was .38 = 3.4:1) */
    "--pg-line": "rgb(255 255 255 / 0.08)",
  },
  alabaster: {
    "--pg-bg": "#FBF9F6",
    "--pg-surface": "#FFFFFF",
    "--pg-surface-2": "#F3F0EA",
    "--pg-ink": "rgb(8 7 16 / 0.96)",
    "--pg-ink-2": "rgb(8 7 16 / 0.76)", /* stays a visible step above ink-3 (.6) */
    "--pg-ink-3": "rgb(8 7 16 / 0.6)", /* 4.5:1 needs >= .57 on these surfaces (was .40 = 2.7:1) */
    "--pg-line": "rgb(8 7 16 / 0.10)",
  },
};

/** Shorthand: transition driven by the playground's own tokens. */
const SYNC =
  "background-color var(--pg-duration) var(--ease-physics), border-radius var(--pg-duration) var(--ease-physics), padding var(--pg-duration) var(--ease-physics), gap var(--pg-duration) var(--ease-physics), color var(--pg-duration) var(--ease-physics), border-color var(--pg-duration) var(--ease-physics)";

export function TokenPlayground() {
  const ui = useT();
  const [t, setT] = useState<PlaygroundTokens>(DEFAULTS);
  const patch = (p: Partial<PlaygroundTokens>) => setT((s) => ({ ...s, ...p }));

  return (
    <section className="grid gap-2 lg:grid-cols-[16rem_1fr]">
      {/* ════ 1 · CONTROLS DOCK (floating left) ════ */}
      <div className="glass top-16 flex h-fit flex-col gap-3 rounded-panel p-3 lg:sticky">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          TOKEN CONTROLS // LIVE
        </p>

        <DockSlider
          label="Spacing Scale"
          min={4}
          max={16}
          value={t.space}
          unit="px"
          onChange={(space) => patch({ space })}
        />
        <DockSlider
          label="Border Radius"
          min={12}
          max={48}
          value={t.radius}
          unit="px"
          onChange={(radius) => patch({ radius })}
        />
        <DockSlider
          label="Motion Duration"
          min={100}
          max={1200}
          step={50}
          value={t.duration}
          unit="ms"
          onChange={(duration) => patch({ duration })}
        />

        {/* Theme mode — segmented toggle */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
            Theme Mode
          </span>
          <div
            role="radiogroup"
            aria-label={ui.playgroundTheme}
            className="grid grid-cols-2 gap-1 rounded-pill border border-border-subtle p-0.5"
          >
            {(["obsidian", "alabaster"] as const).map((mode) => (
              <button
                key={mode}
                role="radio"
                aria-checked={t.theme === mode}
                onClick={() => patch({ theme: mode })}
                className={[
                  "rounded-pill px-2 py-1 font-mono text-micro uppercase tracking-[0.06em]",
                  "transition-colors duration-base ease-physics",
                  t.theme === mode
                    ? "bg-text-primary text-surface-0"
                    : "text-text-tertiary hover:text-text-secondary",
                ].join(" ")}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setT(DEFAULTS)}
          className="inline-flex items-center gap-1 self-start font-mono text-micro uppercase tracking-[0.10em] text-text-ghost transition-colors duration-base ease-physics hover:text-accent"
        >
          [RESET <Icon name="arrow-right" flip={false} /> SYSTEM DEFAULTS]
        </button>
      </div>

      {/* ════ 2 · CANVAS PREVIEW (right frame) ════ */}
      <div
        /* Keyed on theme so a theme switch always forces a fresh
           subtree — every var(--pg-*) consumer below re-evaluates
           against the new palette with no reconciliation ambiguity. */
        key={t.theme}
        className="overflow-hidden rounded-panel border border-border-subtle p-4 sm:p-5"
        style={{
          /* ── THE SYNC POINT ──
             One state write lands here as CSS variables; every node
             below derives from them via calc(). This is the token
             pipeline in miniature. */
          ...THEMES[t.theme],
          "--pg-space": `${t.space}px`,
          "--pg-radius": `${t.radius}px`,
          "--pg-duration": `${t.duration}ms`,
          backgroundColor: "var(--pg-bg)",
          transition: SYNC,
        } as React.CSSProperties}
      >
        {/* Complex layout card */}
        <div
          className="mx-auto flex max-w-[36rem] flex-col"
          style={{
            backgroundColor: "var(--pg-surface)",
            border: "1px solid var(--pg-line)",
            borderRadius: "var(--pg-radius)",
            padding: "calc(var(--pg-space) * 3)",
            gap: "calc(var(--pg-space) * 2)",
            transition: SYNC,
          }}
        >
          {/* Bento header */}
          <div
            className="grid grid-cols-3"
            style={{ gap: "var(--pg-space)" }}
          >
            <div
              className="col-span-2"
              style={{
                backgroundColor: "var(--pg-surface-2)",
                borderRadius: "calc(var(--pg-radius) * 0.6)",
                padding: "calc(var(--pg-space) * 2)",
                transition: SYNC,
              }}
            >
              <p
                className="font-display text-title tracking-[-0.015em]"
                style={{ color: "var(--pg-ink)", transition: SYNC }}
              >
                System Card
              </p>
              <p
                className="text-body-sm"
                style={{ color: "var(--pg-ink-2)", transition: SYNC }}
              >
                Every value below derives from the tokens you're holding.
              </p>
            </div>
            <div
              className="flex flex-col items-start justify-between"
              style={{
                backgroundColor: "var(--pg-surface-2)",
                borderRadius: "calc(var(--pg-radius) * 0.6)",
                padding: "calc(var(--pg-space) * 2)",
                transition: SYNC,
              }}
            >
              <span className="font-geist text-micro" style={{ color: "var(--pg-ink-3)" }}>
                UNIT
              </span>
              <span
                className="font-display text-title tabular-nums"
                style={{ color: "var(--pg-ink)", transition: SYNC }}
              >
                {t.space}px
              </span>
            </div>
          </div>

          {/* Form fields */}
          <div className="flex flex-col" style={{ gap: "var(--pg-space)" }}>
            {["Project name", "Commission brief"].map((ph) => (
              <input
                key={ph}
                placeholder={ph}
                className="w-full text-body-sm outline-none placeholder:opacity-60"
                style={{
                  backgroundColor: "var(--pg-bg)",
                  border: "1px solid var(--pg-line)",
                  borderRadius: "calc(var(--pg-radius) * 0.5)",
                  padding: "calc(var(--pg-space) * 1.5)",
                  color: "var(--pg-ink)",
                  transition: SYNC,
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center" style={{ gap: "var(--pg-space)" }}>
            <button
              className="font-mono text-label uppercase tracking-[0.06em]"
              style={{
                backgroundColor: "var(--pg-ink)",
                color: "var(--pg-bg)",
                borderRadius: "var(--pg-radius)",
                padding: "var(--pg-space) calc(var(--pg-space) * 2)",
                transition: SYNC,
              }}
            >
              Primary
            </button>
            <button
              className="font-mono text-label uppercase tracking-[0.06em]"
              style={{
                border: "1px solid var(--pg-line)",
                color: "var(--pg-ink-2)",
                borderRadius: "var(--pg-radius)",
                padding: "var(--pg-space) calc(var(--pg-space) * 2)",
                transition: SYNC,
              }}
            >
              Ghost
            </button>
          </div>

          {/* Sub-metrics */}
          <div
            className="grid grid-cols-3"
            style={{
              borderTop: "1px solid var(--pg-line)",
              paddingTop: "calc(var(--pg-space) * 2)",
              gap: "var(--pg-space)",
              transition: SYNC,
            }}
          >
            {[
              ["+42%", "DELIVERY"],
              ["0%", "DRIFT"],
              ["3X", "HANDOFF"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col">
                <span
                  className="font-display text-title tabular-nums"
                  style={{ color: "var(--pg-ink)", transition: SYNC }}
                >
                  {v}
                </span>
                <span
                  className="font-geist text-micro tracking-[0.10em]"
                  style={{ color: "var(--pg-ink-3)", transition: SYNC }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live token readout — the receipts */}
        <p
          className="pt-4 text-center font-geist text-micro tracking-[0.02em]"
          style={{ color: "var(--pg-ink-3)", transition: SYNC }}
        >
          --space: {t.space}px · --radius: {t.radius}px · --duration: {t.duration}ms ·
          --ease: cubic-bezier(0.16, 1, 0.3, 1)
        </p>
      </div>
    </section>
  );
}
