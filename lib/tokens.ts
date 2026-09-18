/**
 * ═══════════════════════════════════════════════════════════════
 * DESIGN TOKENS — TYPED MIRROR
 * ───────────────────────────────────────────────────────────────
 * The CSS layer (app/globals.css @theme) is the source of truth.
 * This file mirrors it for Framer Motion, GSAP, and any logic
 * that needs token values in JavaScript. If a value changes,
 * it changes in BOTH places — enforced in code review.
 * ═══════════════════════════════════════════════════════════════
 */

/* ── 1 · SPACING — strict 8px scale ───────────────────────────── */
export const SPACE = {
  /**  8px — icon padding, micro gaps          */ xs: 8,
  /** 16px — inline gaps, card inner rhythm    */ sm: 16,
  /** 24px — card padding                      */ md: 24,
  /** 32px — component separation              */ lg: 32,
  /** 64px — section inner padding             */ xl: 64,
  /** 128px — section-to-section breathing     */ xxl: 128,
} as const satisfies Record<string, number>;

export type SpaceToken = keyof typeof SPACE;

/* ── 2 · RADII ────────────────────────────────────────────────── */
export const RADIUS = {
  card: 12,
  panel: 24,
  pill: 999,
} as const;

/* ── 3 · MOTION ───────────────────────────────────────────────── */

/** Signature curve — fast exit, long luxurious settle. */
export const EASE_PHYSICS = [0.16, 1, 0.3, 1] as const;
export const EASE_ENTRANCE = [0.22, 1, 0.36, 1] as const;
export const EASE_EXIT = [0.7, 0, 0.84, 0] as const;

/** GSAP expects the CSS string form. */
export const EASE_PHYSICS_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  cinematic: 1.2,
} as const satisfies Record<string, number>; // seconds (Framer/GSAP convention)

/* ── 4 · COLOR ────────────────────────────────────────────────── */
export const COLOR = {
  obsidian: "#080710",
  alabaster: "#FBF9F6",
  surface: {
    0: "#080710",
    1: "#0D0C18",
    2: "#121120",
    3: "#181729",
  },
  border: {
    subtle: "rgb(255 255 255 / 0.08)",
    default: "rgb(255 255 255 / 0.12)",
    strong: "rgb(255 255 255 / 0.20)",
  },
  accent: "#FF6B47",
  /**
   * The sanctioned accent alpha ramp (mirrors --color-accent-* in
   * globals.css @theme). 12 steps so any historical one-off opacity
   * snaps within Δ ≤ 0.05. Never invent an in-between in JS either.
   */
  accentAlpha: {
    4: "rgb(255 107 71 / 0.04)",
    8: "rgb(255 107 71 / 0.08)",
    14: "rgb(255 107 71 / 0.14)",
    20: "rgb(255 107 71 / 0.20)",
    24: "rgb(255 107 71 / 0.24)",
    32: "rgb(255 107 71 / 0.32)",
    40: "rgb(255 107 71 / 0.40)",
    48: "rgb(255 107 71 / 0.48)",
    64: "rgb(255 107 71 / 0.64)",
    72: "rgb(255 107 71 / 0.72)",
    80: "rgb(255 107 71 / 0.80)",
    88: "rgb(255 107 71 / 0.88)",
  },
  /** Expressive supporting roles — meaning carriers, never decoration. */
  roles: {
    creative: "#8B5CF6", // violet — creative intelligence / experimental
    live: "#22D3EE", // cyan    — live system / digital surface
    proof: "#A3E635", // lime    — shipped result / forward energy
  },
  /**
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> origin/arena/01a0b5cf-aboalazm-os
   * Full role ramps (mirrors --color-cyan-* / --color-lime-* in
   * globals.css). Tuned to sit with the coral-orange anchor: cyan is its
   * complement, lime its warm neighbour. Dark mode reads from 300/400;
   * light mode from 600/700 — never reach for an off-ramp hex in JS.
   */
  liveRamp: {
    100: "#CFFAFE",
    200: "#A5F3FC",
    300: "#67E8F9", // dark-mode text tint
    400: "#22D3EE", // role base
    500: "#06B6D4", // hover / interactive
    600: "#0891B2", // pressed / emphasis
    700: "#0E7490", // light-mode text
    800: "#155E75", // deep edge on light
  },
  proofRamp: {
    100: "#ECFCCB",
    200: "#D9F99D",
    300: "#BEF264", // dark-mode text tint
    400: "#A3E635", // role base
    500: "#84CC16", // hover / interactive
    600: "#65A30D", // pressed / emphasis
    700: "#4D7C0F", // light-mode text
    800: "#3F6212", // deep edge on light
  },
  /**
<<<<<<< HEAD
>>>>>>> arena/01a0b5cf-aboalazm-os
=======
>>>>>>> origin/arena/01a0b5cf-aboalazm-os
   * Functional states (dark-canvas values). Light mode reassigns these
   * in CSS; JS consumers drawing on Alabaster should read the computed
   * custom property instead of these constants.
   */
  status: {
    success: "#34D399",
    warning: "#FBBF24",
    danger: "#F87171",
    info: "#60A5FA",
  },
} as const;

/** Dense-control heights — not a page layout language. */
export const CONTROL = {
  sm: 24,
  md: 32,
} as const;

/* ── 5 · AMBIENT GLOW CONTRACT ────────────────────────────────── */
/**
 * Every project in the Payload `projects`/`case-studies` collections carries
 * an accent pair. The use-ambient-glow hook writes these into the runtime
 * CSS custom properties --glow-1 / --glow-2.
 */
export interface ProjectAccent {
  /** Primary glow, e.g. "rgb(255 107 71 / 0.22)" */
  primary: string;
  /** Secondary glow — usually a cooler complement at lower alpha */
  secondary: string;
}

export const GLOW_VARS = {
  primary: "--glow-1",
  secondary: "--glow-2",
  x: "--glow-x",
  y: "--glow-y",
  opacity: "--glow-opacity",
  /** Resting intensity a route keeps when nothing is in focus. */
  floor: "--glow-floor",
} as const;

/* ── 6 · BREAKPOINTS (mirror of Tailwind defaults we rely on) ─── */
export const BP = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 } as const;
