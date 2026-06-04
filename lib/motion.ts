/**
 * ═══════════════════════════════════════════════════════════════
 * MOTION LANGUAGE — ONE PHYSICS, EVERY LIBRARY
 * ───────────────────────────────────────────────────────────────
 * All motion in the OS flows through this file so that Framer
 * Motion, GSAP, and CSS transitions speak the same dialect:
 * weight, inertia, and a long settle. Nothing "animates" —
 * things MOVE, then come to rest.
 * ═══════════════════════════════════════════════════════════════
 */
import type { Variants, Transition } from "framer-motion";
import { EASE_PHYSICS, EASE_ENTRANCE, DURATION } from "@/lib/tokens";

/* ── Core transitions ─────────────────────────────────────────── */

export const physics: Transition = {
  duration: DURATION.base,
  ease: EASE_PHYSICS,
};

export const physicsSlow: Transition = {
  duration: DURATION.slow,
  ease: EASE_PHYSICS,
};

export const cinematic: Transition = {
  duration: DURATION.cinematic,
  ease: EASE_ENTRANCE,
};

/** True spring for pointer-driven elements (magnetic nav, cursor). */
export const spring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

/* ── Entrance variants ─────────────────────────────────────────── */

/** Staggered page-load reveal. Parent gets `container`, children get `item`. */
export const reveal = {
  container: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.09, delayChildren: 0.12 },
    },
  } satisfies Variants,

  item: {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: physicsSlow,
    },
  } satisfies Variants,
};

/** Hero headline — clip-path rise, the signature first impression. */
export const heroLine: Variants = {
  hidden: { y: "110%", rotate: 1.5 },
  visible: (i: number = 0) => ({
    y: "0%",
    rotate: 0,
    transition: { ...cinematic, delay: 0.1 + i * 0.12 },
  }),
};

/** Bento tiles — scale-settle, never bounce. */
export const tile: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: physicsSlow },
};

/* ── Hover grammar ─────────────────────────────────────────────── */

export const hoverLift = {
  whileHover: { y: -4, transition: physics },
  whileTap: { scale: 0.985, transition: { duration: DURATION.fast } },
} as const;

/* ── GSAP defaults ─────────────────────────────────────────────── */
/**
 * Call once in the SmoothScroll provider after registering plugins:
 *
 *   import gsap from "gsap";
 *   gsap.defaults(GSAP_DEFAULTS);
 *
 * CustomEase is avoided deliberately — "expo.out" is the closest
 * core-library match to cubic-bezier(0.16, 1, 0.3, 1), keeping the
 * club plugin out of the bundle.
 */
export const GSAP_DEFAULTS = {
  ease: "expo.out",
  duration: DURATION.slow,
} as const;

/** ScrollTrigger house rules — reveal once, no scrubbing UI into jelly. */
export const SCROLL_TRIGGER_DEFAULTS = {
  start: "top 78%",
  toggleActions: "play none none none",
  once: true,
} as const;
