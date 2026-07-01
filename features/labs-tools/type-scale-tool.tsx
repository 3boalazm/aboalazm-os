"use client";

/**
 * TypeScaleTool — Typography Scale Calculator (Labs)
 *
 * Pick a base size and a ratio; every step of the scale (body → h1)
 * recomputes live, both as a visual preview and as a copy-ready CSS
 * custom-properties block. Pure math, zero external deps.
 */

import { useMemo, useState } from "react";
import { useLang } from "@/components/providers/lang-provider";

const RATIOS = [
  { value: 1.125, label: "1.125 — Major Second" },
  { value: 1.2,   label: "1.2 — Minor Third" },
  { value: 1.25,  label: "1.25 — Major Third" },
  { value: 1.333, label: "1.333 — Perfect Fourth" },
  { value: 1.5,   label: "1.5 — Perfect Fifth" },
] as const;

const STEPS = [
  { key: "body",  n: 0,  tag: "Body" },
  { key: "lead",  n: 1,  tag: "Lead" },
  { key: "h4",    n: 2,  tag: "H4" },
  { key: "h3",    n: 3,  tag: "H3" },
  { key: "h2",    n: 4,  tag: "H2" },
  { key: "h1",    n: 5,  tag: "H1" },
] as const;

const UI = {
  en: {
    title: "Typography Scale",
    sub: "Set a base size and ratio — every step recalculates, largest to smallest.",
    base: "Base size",
    ratio: "Scale ratio",
    copy: "Copy CSS",
    copied: "Copied ✓",
  },
  ar: {
    title: "مقياس الطباعة",
    sub: "حدّد الحجم الأساسي والنسبة — كل درجة تُعاد حسابها تلقائيًا.",
    base: "الحجم الأساسي",
    ratio: "نسبة التدرّج",
    copy: "نسخ CSS",
    copied: "تم النسخ ✓",
  },
} as const;

export function TypeScaleTool() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = ar ? UI.ar : UI.en;

  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState<number>(1.25);
  const [copied, setCopied] = useState(false);

  const sizes = useMemo(
    () => STEPS.map((s) => ({ ...s, px: Math.round(base * Math.pow(ratio, s.n) * 100) / 100 })),
    [base, ratio],
  );

  const css = useMemo(
    () =>
      sizes
        .map((s) => `--text-${s.key}: ${s.px}px; /* ${s.tag} */`)
        .join("\n"),
    [sizes],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — silently ignore, non-critical */
    }
  };

  return (
    <div className="labtool-card">
      <p className="labtool-card__title">{t.title}</p>
      <p className="labtool-card__sub">{t.sub}</p>

      <div className="labtool-controls">
        <label className="labtool-field">
          <span className="labtool-field__label">{t.base}: {base}px</span>
          <input
            type="range"
            min={12}
            max={24}
            step={1}
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="labtool-slider"
          />
        </label>

        <label className="labtool-field">
          <span className="labtool-field__label">{t.ratio}</span>
          <select
            value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
            className="labtool-select"
          >
            {RATIOS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* live preview, largest first */}
      <div className="labtool-typepreview">
        {[...sizes].reverse().map((s) => (
          <div key={s.key} className="labtool-typepreview__row">
            <span className="labtool-typepreview__tag">{s.tag}</span>
            <span
              className="labtool-typepreview__sample"
              style={{ fontSize: `${Math.min(s.px, 48)}px`, lineHeight: 1.15 }}
            >
              Aa
            </span>
            <span className="labtool-typepreview__px">{s.px}px</span>
          </div>
        ))}
      </div>

      <div className="labtool-code">
        <pre className="labtool-code__pre">{css}</pre>
        <button onClick={handleCopy} className="labtool-code__copy">
          {copied ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}
