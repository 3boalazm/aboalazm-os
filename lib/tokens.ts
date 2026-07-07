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
} as const;

/* ── 6 · BREAKPOINTS (mirror of Tailwind defaults we rely on) ─── */
export const BP = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 } as const;
