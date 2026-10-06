"use client";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";

/**
 * BEFORE / AFTER SLIDER — "Audit Finding vs Governed System".
 * A drag-split comparison cell. The AFTER layer (governed system)
 * sits beneath; the BEFORE layer (pre-system audit state) is clipped
 * from the right as the divider moves.
 */
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { physics } from "@/lib/motion";

const clamp = (v: number) => Math.min(96, Math.max(4, v));

interface BeforeAfterSliderProps {
  beforeTitle?: string;
  afterTitle?: string;
}

export function BeforeAfterSlider({
  beforeTitle,
  afterTitle,
}: BeforeAfterSliderProps = {}) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const frameRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(54); // % from left
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
      {/* ════ AFTER — Governed system (base layer) ════ */}
      <div className="absolute inset-0 flex flex-col justify-between gap-3 p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-pill bg-accent" />
            <span className="font-mono text-micro uppercase tracking-wider text-text-primary">
              {afterTitle ?? (ar ? "نظام هوية موحّد ومعتمد (V2.0)" : "Governed Identity System (V2.0)")}
            </span>
          </div>
          <span className="rounded-pill border border-border-default bg-surface-2 px-2 py-0.5 font-mono text-micro text-text-secondary">
            LOCKED TOKENS
          </span>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-2.5">
          <div className="col-span-2 flex flex-col justify-between rounded-card border border-border-subtle bg-surface-2 p-3">
            <div>
              <span className="block h-2 w-3/4 rounded-pill bg-text-primary/80" />
              <span className="mt-2 block h-1.5 w-1/2 rounded-pill bg-text-primary/30" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="size-3 rounded-pill bg-accent" />
              <span className="h-1.5 w-24 rounded-pill bg-text-primary/40" />
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface-2 p-3">
            <span className="font-mono text-micro uppercase tracking-wider text-text-tertiary">
              {ar ? "معايرة دقيقة" : "Calibrated"}
            </span>
            <span className="font-display text-title leading-none text-accent">0%</span>
            <span className="font-mono text-micro text-text-ghost">
              {ar ? "انحراف بالتطبيق" : "Design drift"}
            </span>
          </div>
          <div className="col-span-3 flex items-center justify-between rounded-card border border-border-subtle bg-surface-2 px-3 py-2">
            <span className="font-mono text-micro text-text-secondary">
              {ar ? "شعار ثنائي اللغة · ألوان بانتون مقفلة · خطوط متناغمة" : "Bilingual lockup · Pantone palette · Harmonized type"}
            </span>
            <span className="rounded-pill bg-accent px-2.5 py-1 font-mono text-micro font-medium text-obsidian">
              {ar ? "معتمد للإنتاج" : "PRODUCTION"}
            </span>
          </div>
        </div>
      </div>

      {/* ════ BEFORE — Audit state (clipped layer) ════ */}
      <div
        className="absolute inset-0 bg-surface-0"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          transition: dragging ? "none" : `clip-path 200ms var(--ease-physics)`,
        }}
        aria-hidden
      >
        <div className="relative size-full p-4 opacity-95">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-pill bg-text-tertiary" />
              <span className="font-mono text-micro uppercase tracking-wider text-text-tertiary">
                {beforeTitle ?? (ar ? "حالة التدقيق قبل النظام" : "Pre-system Audit State")}
              </span>
            </div>
            <span className="rounded-pill border border-border-subtle px-2 py-0.5 font-mono text-micro text-text-ghost">
              FRAGMENTED
            </span>
          </div>

          {/* Structured audit finding boxes — professional diagnostic annotations */}
          <div className="relative mt-3 h-[calc(100%-2.5rem)]">
            <div className="absolute left-[4%] top-[6%] rounded border border-dashed border-border-strong bg-surface-1/80 px-2.5 py-1.5 shadow-sm">
              <p className="font-mono text-micro uppercase tracking-wider text-text-tertiary">
                {ar ? "⚠ شعار موروث غير مقنن بالنسب" : "⚠ Legacy mark without grid lockup"}
              </p>
            </div>

            <div className="absolute right-[8%] top-[24%] rounded border border-dashed border-border-strong bg-surface-1/80 px-2.5 py-1.5 shadow-sm">
              <p className="font-mono text-micro uppercase tracking-wider text-text-ghost">
                {ar ? "⚠ تفاوت في درجات الألوان بين المطابع" : "⚠ Inconsistent color values across print runs"}
              </p>
            </div>

            <div className="absolute bottom-[28%] left-[6%] rounded border border-dashed border-border-strong bg-surface-1/80 px-2.5 py-1.5 shadow-sm">
              <p className="font-mono text-micro uppercase tracking-wider text-text-ghost">
                {ar ? "⚠ غياب شبكة الهوامش والارتفاعات" : "⚠ Arbitrary padding & lack of spatial hierarchy"}
              </p>
            </div>

            <div className="absolute bottom-[6%] right-[10%] rounded border border-dashed border-border-strong bg-surface-1/80 px-2.5 py-1.5 shadow-sm">
              <p className="font-mono text-micro uppercase tracking-wider text-text-tertiary">
                {ar ? "⚠ أنماط عناصر ومطبوعات متفرقة" : "⚠ Fragmented collateral & ununified styles"}
              </p>
            </div>
          </div>
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
          className="absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill border border-border-strong bg-surface-0 font-mono text-micro text-text-secondary shadow-card"
          animate={{ scale: dragging ? 1.15 : 1 }}
          transition={physics}
        >
          ⇔
        </motion.span>
      </div>

      {/* ════ State labels ════ */}
      <span className="pointer-events-none absolute bottom-2 left-2 z-elevated rounded-pill bg-surface-0/80 px-2 py-0.5 font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary backdrop-blur-sm">
        {ar ? "التدقيق قبل النظام" : "AUDIT // PRE-SYSTEM"}
      </span>
      <span className="pointer-events-none absolute bottom-2 right-2 rounded-pill bg-surface-0/80 px-2 py-0.5 font-mono text-micro uppercase tracking-[0.10em] text-accent backdrop-blur-sm">
        {ar ? "النظام المعتمد" : "GOVERNED // SYSTEM"}
      </span>
    </div>
  );
}
