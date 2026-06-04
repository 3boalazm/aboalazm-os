"use client";

/**
 * DOCK SLIDER — the playground's control atom.
 * A labeled range input in system voice: mono label left, live
 * value readout right (tabular, so digits don't jitter), native
 * range styled via accent-color. The readout flashes to accent
 * for one beat on change — confirmation without a toast.
 */
import { useEffect, useRef, useState } from "react";

interface DockSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}

export function DockSlider({
  label,
  min,
  max,
  step = 1,
  value,
  unit,
  onChange,
}: DockSliderProps) {
  const [flash, setFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFlash(true);
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 350);
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [value]);

  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-baseline justify-between">
        <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
          {label}
        </span>
        <span
          className={[
            "font-geist text-micro tabular-nums transition-colors duration-base ease-physics",
            flash ? "text-accent" : "text-text-secondary",
          ].join(" ")}
        >
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-ew-resize appearance-none rounded-pill bg-border-default accent-[#FF6B47] outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-accent"
        aria-label={`${label}: ${value}${unit}`}
      />
    </label>
  );
}
