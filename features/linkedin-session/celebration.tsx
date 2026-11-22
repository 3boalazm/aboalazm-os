"use client";

/**
 * GRADUATION BURST — stars and confetti fired across the screen when someone
 * asks for their attendance certificate.
 *
 * Two "cannons" at the bottom corners and one burst from the middle, ~90
 * pieces in all: four-point stars, sparkles and a few paper squares in the
 * brand's orange, white and gold. Each piece flies out on a ballistic arc
 * (fast up, then gravity pulls it down while it spins and fades) — framer-motion
 * drives plain `x`/`y` keyframes, so it costs nothing at rest and unmounts
 * itself when done.
 *
 * It decorates a success state, so it never gets in the way: `fixed`,
 * `pointer-events-none`, `aria-hidden`. With `prefers-reduced-motion` it
 * renders nothing at all — the "name sent" message is the whole feedback.
 */
import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["var(--color-accent)", "#ffffff", "#ffd166", "#ff9a5c", "#f4f1ea"];
const GLYPHS = ["★", "✦", "✧", "✶", "■"];
const DURATION = 2.6;

type Piece = {
  id: number;
  glyph: string;
  color: string;
  size: number;
  /** origin as a fraction of the viewport */
  ox: number;
  oy: number;
  dx: number;
  rise: number;
  fall: number;
  spin: number;
  delay: number;
};

function makePieces(): Piece[] {
  const pieces: Piece[] = [];
  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  const cannons = [
    { ox: 0.04, oy: 0.98, dir: 1, count: 34 },
    { ox: 0.96, oy: 0.98, dir: -1, count: 34 },
    { ox: 0.5, oy: 0.55, dir: 0, count: 26 },
  ];
  let id = 0;
  for (const c of cannons) {
    for (let i = 0; i < c.count; i += 1) {
      const centre = c.dir === 0;
      pieces.push({
        id: id++,
        glyph: GLYPHS[Math.floor(rand(0, GLYPHS.length))]!,
        color: COLORS[Math.floor(rand(0, COLORS.length))]!,
        size: rand(12, 30),
        ox: c.ox,
        oy: c.oy,
        dx: centre ? rand(-420, 420) : c.dir * rand(60, 560),
        rise: centre ? rand(140, 380) : rand(260, 720),
        fall: rand(260, 620),
        spin: rand(-540, 540),
        delay: rand(0, centre ? 0.25 : 0.12),
      });
    }
  }
  return pieces;
}

export function CelebrationBurst({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(() => (reduce ? [] : makePieces()), [reduce]);
  /* A ref, so a parent that re-renders with a new inline callback cannot restart the clock. */
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (reduce) return;
    const timer = window.setTimeout(() => done.current?.(), (DURATION + 0.6) * 1000);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
          animate={{
            x: [0, p.dx * 0.55, p.dx],
            y: [0, -p.rise, p.fall - p.rise * 0.2],
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1, 1, 0.8],
            rotate: [0, p.spin * 0.5, p.spin],
          }}
          transition={{
            duration: DURATION,
            delay: p.delay,
            times: [0, 0.38, 1],
            ease: ["easeOut", "easeIn"],
          }}
          style={{
            position: "absolute",
            left: `${p.ox * 100}%`,
            top: `${p.oy * 100}%`,
            color: p.color,
            fontSize: p.size,
            lineHeight: 1,
            textShadow: "0 0 10px currentColor",
          }}
        >
          {p.glyph}
        </motion.span>
      ))}
    </div>
  );
}
