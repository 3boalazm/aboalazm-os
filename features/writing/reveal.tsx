"use client";

/**
 * REVEAL — fade-in/up wrapper for article blocks as they enter the
 * viewport (Lovable reference behavior). Once-only, subtle, 60fps
 * (transform + opacity only).
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEntrance } from "@/lib/motion";

export function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={useEntrance({ opacity: 0, y: 24 })}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
