"use client";
import { useT } from "@/hooks/use-t";

/**
 * BEFORE / AFTER SLIDER — "Chaos vs System".
 * A drag-split comparison cell. The AFTER layer (polished system UI)
 * sits beneath; the BEFORE layer (wireframe chaos) is clipped from
 * the right by `inset()` as the divider moves. Both layers are
 * rendered with tokens — no images required — so the widget ships
 * working today and accepts real screenshots later via props.
 *
 * Input model:
 *   · Pointer drag (capture-based — keeps tracking outside the cell)
 *   · Keyboard ← → on the divider (5% steps), Home/End
 *   · ARIA slider semantics for screen readers
 *
 * Motion: while dragging, the clip follows raw at 60fps (no easing —
 * direct manipulation must feel 1:1). On release, nothing snaps:
 * the position is the user's statement. Only the handle's halo
 * breathes on the physics curve.
 */
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { physics } from "@/lib/motion";

const clamp = (v: number) => Math.min(96, Math.max(4, v));

export function BeforeAfterSlider() {
  const t = useT();
  const frameRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(58); // % from left
  const [dragging, setDragging] = useState(false);

  const posFromEvent = useCallback((clientX: number) => {
    const r = frameRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(clamp(((clientX - r.left) / r.width) * 100));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(true);
      posFromEvent(e.clientX);
    },
    [posFromEvent],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging) posFromEvent(e.clientX);
    },
    [dragging, posFromEvent],
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => clamp(p - 5));
    if (e.key === "ArrowRight") setPos((p) => clamp(p + 5));
    if (e.key === "Home") setPos(4);
    if (e.key === "End") setPos(96);
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative aspect-[16/10] select-none overflow-hidden rounded-card border border-border-default bg-surface-1"
      onPointerMove={onPointerMove}
      onPointerUp={() => setDragging(false)}
    >
      {/* ════ AFTER — the polished system (base layer) ════ */}
      <div className="absolute inset-0 flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <span className="h-2 w-12 rounded-pill bg-text-primary/90" />
          <span className="rounded-pill border border-border-default px-2 py-0.5 font-mono text-micro text-text-secondary">
            v2.0
          </span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
          <div className="col-span-2 rounded-card border border-border-subtle bg-surface-2 p-2">
            <span className="block h-1.5 w-2/3 rounded-pill bg-text-primary/70" />
            <span className="mt-1 block h-1 w-1/2 rounded-pill bg-text-primary/30" />
          </div>
          <div className="rounded-card border border-border-subtle bg-surface-2 p-2">
            <span className="block font-mono text-label text-accent">+45%</span>
            <span className="block h-1 w-3/4 rounded-pill bg-text-primary/25" />
          </div>
          <div className="col-span-3 flex items-center gap-2 rounded-card border border-border-subtle bg-surface-2 p-2">
            <span className="h-1.5 flex-1 rounded-pill bg-text-primary/20" />
            <span className="rounded-pill bg-accent px-2 py-1 font-mono text-micro text-obsidian">
              CTA
            </span>
          </div>
        </div>
      </div>

      {/* ════ BEFORE — wireframe chaos (clipped layer) ════ */}
      <div
        className="absolute inset-0 bg-obsidian"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          // Direct manipulation: no transition while dragging
          transition: dragging ? "none" : `clip-path 200ms var(--ease-physics)`,
        }}
        aria-hidden
      >
        <div className="relative size-full p-3 opacity-90">
          {/* Deliberately misaligned, rotated, off-grid fragments */}
          <div className="absolute left-[6%] top-[10%] h-[18%] w-[42%] -rotate-2 border border-dashed border-text-ghost" />
          <div className="absolute left-[38%] top-[22%] h-[26%] w-[34%] rotate-1 border border-dashed border-text-ghost" />
          <div className="absolute left-[10%] top-[48%] h-[14%] w-[60%] rotate-[0.5deg] border border-dashed border-text-tertiary" />
          <div className="absolute left-[55%] top-[62%] h-[22%] w-[30%] -rotate-3 border border-dashed border-text-ghost" />
          <span className="absolute left-[12%] top-[14%] font-mono text-micro text-text-tertiary">
            logo_final_v7??
          </span>
          <span className="absolute left-[42%] top-[30%] font-mono text-micro text-text-ghost">
            #3A86FF or #2D7DF6?
          </span>
          <span className="absolute left-[14%] top-[52%] font-mono text-micro text-text-ghost">
            spacing: 13px · 22px · 37px
          </span>
          <span className="absolute bottom-[8%] left-[58%] font-mono text-micro text-text-tertiary">
            btn-styles (×9)
          </span>
        </div>
      </div>

      {/* ════ Divider + handle ════ */}
      <div
        role="slider"
        aria-label={t.sliderAria}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 z-elevated w-4 -translate-x-1/2 cursor-ew-resize outline-none"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-text-primary/80" />
        <motion.span
          className="absolute left-1/2 top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill border border-border-strong bg-obsidian font-mono text-micro text-text-secondary shadow-card"
          animate={{ scale: dragging ? 1.15 : 1 }}
          transition={physics}
        >
          ⇔
        </motion.span>
      </div>

      {/* ════ State labels ════ */}
      <span className="pointer-events-none absolute left-2 top-2 z-elevated rounded-pill bg-obsidian/70 px-2 py-0.5 font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary backdrop-blur-sm">
        BEFORE // AUDIT
      </span>
      <span className="pointer-events-none absolute right-2 top-2 rounded-pill bg-obsidian/70 px-2 py-0.5 font-mono text-micro uppercase tracking-[0.10em] text-text-secondary backdrop-blur-sm">
        AFTER // SYSTEM
      </span>
    </div>
  );
}
