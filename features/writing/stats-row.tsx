"use client";

/**
 * STATS ROW — animated counter cards (Lovable reference). Each card
 * shows a key figure; numeric parts count up from 0 when the row
 * enters the viewport. Non-numeric values ("1:5", "20–30%") render
 * statically — no fake motion on figures that aren't single numbers.
 */
import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type StatItem = { value: string; label: string };

/** Split "69.8%" → ["", 69.8, "%"], "$13T" → ["$", 13, "T"]; null if not countable. */
function parseCountable(value: string): { prefix: string; n: number; suffix: string; decimals: number } | null {
  const m = value.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
  if (!m) return null;
  const n = parseFloat(m[2]!);
  const decimals = m[2]!.includes(".") ? m[2]!.split(".")[1]!.length : 0;
  return { prefix: m[1] ?? "", n, suffix: m[3] ?? "", decimals };
}

function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const countable = parseCountable(value);
  const [display, setDisplay] = useState(countable ? `${countable.prefix}0${countable.suffix}` : value);

  useEffect(() => {
    if (!inView || !countable) return;
    const controls = animate(0, countable.n, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) =>
        setDisplay(`${countable.prefix}${v.toFixed(countable.decimals)}${countable.suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className="font-display text-4xl font-extrabold leading-none text-accent md:text-5xl" dir="ltr">
      {display}
    </span>
  );
}

export function StatsRow({ items }: { items: StatItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="my-12 grid grid-cols-2 gap-px border border-border-subtle bg-border-subtle lg:grid-cols-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-3 bg-surface-1 p-6 md:p-8">
          <StatValue value={item.value} />
          <span className="font-mono text-micro uppercase leading-relaxed tracking-[0.1em] text-text-tertiary">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
