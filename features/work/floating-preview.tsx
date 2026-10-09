"use client";

/**
 * FLOATING PREVIEW — the cursor-trailing thumbnail.
 * ─────────────────────────────────────────────────────────────────
 * Division of labor, deliberately:
 *   GSAP  → position physics. Two gsap.quickTo tweens (x, y) on
 *           "power3" give the preview fluid inertia — it chases the
 *           cursor, overshoots nothing, settles like mass.
 *           A third quickTo maps horizontal velocity → slight
 *           rotation, so fast sweeps make the card "lean" into
 *           the motion. Pure trail feel, zero re-renders.
 *   Framer → presence physics. AnimatePresence crossfades images
 *           between projects; scale/opacity reveal rides the house
 *           ease-physics curve.
 *
 * The component is a controlled visual: the ledger owns hover state
 * and pointer events; this layer only renders and follows. It is only
 * mounted from lg up (below that the card is display:none anyway) and
 * its follow loop only runs while a row is hovered.
 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_PHYSICS, DURATION } from "@/lib/tokens";
import type { Project } from "./types";

const SIZE = { w: 280, h: 200 } as const; // 8px-scale friendly footprint
const OFFSET = { x: 24, y: -100 } as const; // cursor anchor (md gap, vertical center)
const MAX_LEAN = 6; // degrees

interface FloatingPreviewProps {
  /** Currently hovered project, or null when idle */
  active: Project | null;
  /** Live pointer coords in viewport space (from the ledger) */
  pointer: React.RefObject<{ x: number; y: number }>;
}

export function FloatingPreview(props: FloatingPreviewProps) {
  /* No pointer trail below lg (the card is hidden there) — don't mount it. */
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop ? <PreviewLayer {...props} /> : null;
}

function PreviewLayer({ active, pointer }: FloatingPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const reduceMotion = useReducedMotion();
  const hovering = active !== null;

  /* GSAP trail engine — the quickTo tweens live for the component's life and
     run on GSAP's own ticker, so they cost nothing at rest. */
  const trail = useRef<{
    xTo: (v: number) => void;
    yTo: (v: number) => void;
    rTo: (v: number) => void;
  } | null>(null);
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    trail.current = {
      xTo: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" }),
      yTo: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" }),
      rTo: gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power2" }),
    };
    return () => {
      trail.current = null;
    };
  }, []);

  /* Follow loop — feeds the pointer into the tweens, but only while a row is
     hovered. On leave it stops and the lean settles back to level on its own
     tween, so an idle ledger schedules no animation frames. */
  useEffect(() => {
    if (!hovering) return;
    lastX.current = pointer.current?.x ?? 0; // no stale-velocity lean on re-enter
    let raf = 0;
    const loop = () => {
      const p = pointer.current;
      const t = trail.current;
      if (p && t) {
        t.xTo(p.x + OFFSET.x);
        t.yTo(p.y + OFFSET.y);
        // Horizontal velocity → lean
        const vx = p.x - lastX.current;
        t.rTo(gsap.utils.clamp(-MAX_LEAN, MAX_LEAN, vx * 0.35));
        lastX.current = p.x;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      trail.current?.rTo(0);
    };
  }, [hovering, pointer]);

  return (
    <div
      ref={frameRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-overlay hidden lg:block"
      style={{ width: SIZE.w, height: SIZE.h }}
    >
      {/* Stable key: row-to-row switches update content in place.
          AnimatePresence only handles idle ⇄ hovering, so a stale card
          can never linger behind the live one (P0-3). */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="preview"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.82, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: DURATION.base, ease: EASE_PHYSICS }}
            className="absolute inset-0 overflow-hidden rounded-card border border-border-default bg-surface-2 shadow-card"
          >
            {/* Accent fallback panel — always painted beneath the image.
                Until real thumbnails land in /public/images/work, the
                preview renders as a designed record card, never a 404. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120% 120% at 20% 0%, ${active.accent.primary}, transparent 60%),
                             radial-gradient(120% 120% at 90% 100%, ${active.accent.secondary}, transparent 65%)`,
              }}
            />
            <span className="absolute left-2 top-1 font-display text-display leading-none text-text-ghost">
              {active.name.charAt(0)}
            </span>
            <Image
              key={active.slug}
              src={active.thumbnail}
              alt=""
              fill
              sizes={`${SIZE.w}px`}
              className="object-cover"
              priority={false}
              onError={(e) => {
                // Missing asset → hide the img, keep the accent panel
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Record stamp — keeps the ledger fiction intact */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-surface-0/70 px-2 py-1 backdrop-blur-sm">
              <span className="font-geist text-micro uppercase tracking-[0.10em] text-text-secondary">
                {active.slug}
              </span>
              <span className="font-geist text-micro text-text-tertiary">
                {active.year}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
