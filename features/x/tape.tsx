"use client";

/**
 * TAPE — two crossed ribbons that slide against each other as you scroll.
 * One coral with dark type, one outlined. Decorative (aria-hidden): the
 * words repeat what the sections around it already say.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

function Row({ words }: { words: readonly string[] }) {
  const loop = Array.from({ length: 6 }, () => words).flat();
  return (
    <>
      {loop.map((w, i) => (
        <span key={i}>
          {w} <b>✺</b>
        </span>
      ))}
    </>
  );
}

export function Tape({ a, b }: { a: readonly string[]; b: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-28%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-28%", reduce ? "-28%" : "0%"]);
  return (
    <div ref={ref} className="x-tape ground-base" aria-hidden dir="ltr">
      <div className="x-tape__band x-tape__band--line">
        <motion.div className="x-tape__row" style={{ x: x2 }}>
          <Row words={b} />
        </motion.div>
      </div>
      <div className="x-tape__band x-tape__band--hot">
        <motion.div className="x-tape__row" style={{ x: x1 }}>
          <Row words={a} />
        </motion.div>
      </div>
    </div>
  );
}
