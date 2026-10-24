"use client";
import { useLang } from "@/components/providers/lang-provider";

/**
 * STATUS NODE — the OS heartbeat.
 * A floating system-readout strip: mono micro-text framed in brackets,
 * anchored by a pulsing green node. The pulse is two layered motions —
 * a soft outer ring expanding on ease-physics, and a core that breathes.
 * Reads as telemetry, not decoration.
 */
import Link from "@/components/ui/localized-link";
import { motion, useReducedMotion } from "framer-motion";
import { COLOR, EASE_PHYSICS } from "@/lib/tokens";

/* The system's one success green (mirrors --color-success in CSS).
   Was a one-off #3DDC84 — unified during the 2026-09-18 palette audit. */
const PULSE_GREEN = COLOR.status.success;

export function StatusNode() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  return (
    <Link
      href="/services"
      className="glass group inline-flex items-center gap-2 rounded-pill py-1 pl-2 pr-3 transition-colors duration-base ease-physics hover:border-accent"
      title={lang === "ar" ? "خدمات الهوية والمواقع" : "Brand identity and web services"}
    >
      {/* ── Node ── */}
      <span className="relative flex size-2 items-center justify-center">
        {/* Expanding ring */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-pill"
          style={{ backgroundColor: PULSE_GREEN }}
          animate={reduced ? undefined : { scale: [1, 2.6], opacity: [0.45, 0] }}
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
          animate={reduced ? undefined : { opacity: [1, 0.55, 1] }}
          transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
        />
      </span>

      {/* ── Readout ── */}
      <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-secondary transition-colors duration-base ease-physics group-hover:text-text-primary">
        [{lang === "ar" ? "هوية ومواقع · القاهرة / عن بُعد" : "BRAND & WEB · CAIRO / REMOTE"}]
      </span>
    </Link>
  );
}
