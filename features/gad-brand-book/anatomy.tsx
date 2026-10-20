"use client";

import { useState } from "react";
import { BLUE, RED, RED_TEXT } from "./tokens";
import { MARK_BLUE, MARK_RED, MARK_VIEWBOX } from "./mark-paths";

type Part = 1 | 2 | 3 | 4;

const PARTS: { n: Part; title: string; text: string }[] = [
  { n: 1, title: "Lungs symbol", text: "Two stylised lungs forming the circular mark: breath, protection, vitality." },
  { n: 2, title: "Heart symbol", text: "The crimson core, set where the lungs meet — the pulse of the brand." },
  { n: 3, title: "Wordmarks", text: "GAD (the international corporate wordmark), the institute name in English and the hospital name in Arabic. The lock-up always carries all of them (book p.12)." },
  { n: 4, title: "Lock-up rules", text: "Always use the original artwork from the GAD Brand Team — never recreate, modify or realign. No URLs or other text locked up with the logo. The name is never translated beyond Arabic and English (book p.12)." },
];

const MUTED = "#6B7A88";

/**
 * Interactive anatomy of the mark. Hover or focus a part and the matching half
 * of the symbol lights up while the other half dims. Parts 3–4 are about the
 * lock-up / rules rather than a region of the symbol, so they show the whole mark.
 */
export function Anatomy() {
  const [hot, setHot] = useState<Part | null>(null);
  const blue = hot === 2 ? MUTED : BLUE;
  const red = hot === 1 ? MUTED : RED;

  return (
    <div className="grid items-center gap-5 @3xl:grid-cols-2">
      <div className="flex items-center justify-center rounded-2xl bg-white p-6">
        <svg viewBox={MARK_VIEWBOX} role="img" aria-label="GAD symbol: a circle of two lung arches around a heart" className="w-56 max-w-full">
          <g fill={blue} className="transition-[fill] duration-300 motion-reduce:transition-none">
            {MARK_BLUE.map((d, i) => <path key={i} d={d} />)}
          </g>
          <g fill={red} className="transition-[fill] duration-300 motion-reduce:transition-none">
            {MARK_RED.map((d, i) => <path key={i} d={d} />)}
          </g>
        </svg>
      </div>
      <ul className="space-y-3" onMouseLeave={() => setHot(null)}>
        {PARTS.map((p) => (
          <li key={p.n}>
            <button
              type="button"
              onMouseEnter={() => setHot(p.n)}
              onFocus={() => setHot(p.n)}
              onBlur={() => setHot(null)}
              aria-pressed={hot === p.n}
              className="flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                background: hot === p.n ? "rgb(171 18 28 / 0.14)" : "rgb(255 255 255 / 0.04)",
                borderColor: hot === p.n ? "rgb(232 133 139 / 0.55)" : "rgb(255 255 255 / 0.1)",
              }}
            >
              <span aria-hidden className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: RED }}>{p.n}</span>
              <span>
                <span className="block text-sm font-semibold text-white">{p.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-white/70">{p.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-white/65 @3xl:col-span-2">
        <span style={{ color: RED_TEXT }}>Tip:</span> hover or tab through the parts — the symbol responds.
      </p>
    </div>
  );
}
