"use client";

/**
 * CURSOR — a coral orb that trails the pointer (fine pointers only; the
 * native cursor stays). It opens into a ring over links and into a labelled
 * disc over anything carrying data-cursor="…".
 */
import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export function Cursor() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.4 });
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      setLabel(tagged?.dataset.cursor ?? null);
      setHot(Boolean(!tagged && el?.closest("a,button")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
    };
  }, [reduce, x, y]);

  if (!on) return null;
  return (
    <motion.div aria-hidden className="x-cursor" style={{ x: sx, y: sy }} data-hot={hot} data-label={label ? "true" : "false"}>
      <span>{label}</span>
    </motion.div>
  );
}
