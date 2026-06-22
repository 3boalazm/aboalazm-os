"use client";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";

/**
 * STATUS NODE — the OS heartbeat.
 * A floating system-readout strip: mono micro-text framed in brackets,
 * anchored by a pulsing green node. The pulse is two layered motions —
 * a soft outer ring expanding on ease-physics, and a core that breathes.
 * Reads as telemetry, not decoration.
 */
import { motion } from "framer-motion";
import { EASE_PHYSICS } from "@/lib/tokens";

const PULSE_GREEN = "#3DDC84";

export function StatusNode() {
  const { lang } = useLang();
  const t = useT();
  return (
    <div className="glass inline-flex items-center gap-2 rounded-pill py-1 pl-2 pr-3">
      {/* ── Node ── */}
      <span className="relative flex size-2 items-center justify-center">
        {/* Expanding ring */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-pill"
          style={{ backgroundColor: PULSE_GREEN }}
          animate={{ scale: [1, 2.6], opacity: [0.45, 0] }}
          transition={{
            duration: 2.2,
            ease: EASE_PHYSICS,
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        />
        {/* Breathing core */}
        <motion.span
          className="relative size-1 rounded-pill"
          style={{
            backgroundColor: PULSE_GREEN,
            boxShadow: `0 0 8px ${PULSE_GREEN}66`,
          }}
          animate={{ opacity: [1, 0.55, 1] }}
          transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
        />
      </span>

      {/* ── Readout ── */}
      <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-secondary">
        {lang === "ar" ? `[${t.heroStatusOpen} · ${t.heroYear}]` : `[STATUS: OPEN FOR SELECT PROJECTS · ${t.heroYear}]`}
      </span>
    </div>
  );
}
