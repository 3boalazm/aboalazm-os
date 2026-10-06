"use client";

import { motion, useScroll, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="scroll-progress"
      style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
      transition={reduceMotion ? { duration: 0 } : undefined}
    />
  );
}
