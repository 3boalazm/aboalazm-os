"use client";

/**
 * ContrastCheckerTool — WCAG Color Contrast Checker (Labs)
 *
 * Enter a foreground and background hex; the tool computes the actual
 * relative-luminance contrast ratio and shows pass/fail against the
 * WCAG 2.1 AA and AAA thresholds for normal and large text.
 *
 * Pure math (no external color libs) — the formulas are the official
 * WCAG relative luminance + contrast ratio definitions.
 */

import { useMemo, useState } from "react";
import { useLang } from "@/components/providers/lang-provider";

/** abc, #abc, aabbcc, #aabbcc (any case) -> "#rrggbb", or null when invalid. */
function normalizeHex(input: string): string | null {
  const digits = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim())?.[1];
  if (!digits) return null;
  const full = digits.length === 3 ? digits.split("").map((c) => c + c).join("") : digits;
  return `#${full.toLowerCase()}`;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const full = normalizeHex(hex);
  if (!full) return null;
  const num = parseInt(full.slice(1), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [sr, sg, sb] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * sr + 0.7152 * sg + 0.0722 * sb;
}

function contrastRatio(hex1: string, hex2: string): number | null {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const UI = {
  en: {
    title: "Contrast Checker",
    sub: "WCAG 2.1 relative-luminance contrast — enter two colors, see if they're legible.",
    fg: "Text color",
    bg: "Background",
    ratio: "Ratio",
    normalAA: "Normal text · AA (4.5:1)",
    normalAAA: "Normal text · AAA (7:1)",
    largeAA: "Large text · AA (3:1)",
    largeAAA: "Large text · AAA (4.5:1)",
    pass: "Pass",
    fail: "Fail",
    sample: "The quick brown fox",
    invalid: "Enter a valid hex color (e.g. #FF6B47)",
  },
  ar: {
    title: "فاحص التباين",
    sub: "معيار WCAG 2.1 لتباين السطوع النسبي — أدخل لونين لتعرف إذا كانا مقروءين.",
    fg: "لون النص",
    bg: "الخلفية",
    ratio: "النسبة",
    normalAA: "نص عادي · AA (4.5:1)",
    normalAAA: "نص عادي · AAA (7:1)",
    largeAA: "نص كبير · AA (3:1)",
    largeAAA: "نص كبير · AAA (4.5:1)",
    pass: "ناجح",
    fail: "راسب",
    sample: "نص تجريبي للقراءة",
    invalid: "أدخل لون hex صالح (مثل #FF6B47)",
  },
} as const;

export function ContrastCheckerTool() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = ar ? UI.ar : UI.en;

  const [fg, setFg] = useState("#F8F8FA");
  const [bg, setBg] = useState("#080710");

  // One normalised "#rrggbb" (or null) feeds the ratio, sample and swatches.
  const fgHex = normalizeHex(fg);
  const bgHex = normalizeHex(bg);
  const ratio = useMemo(() => (fgHex && bgHex ? contrastRatio(fgHex, bgHex) : null), [fgHex, bgHex]);
  const isValid = ratio !== null;

  const checks = isValid
    ? [
        { label: t.normalAA, pass: ratio! >= 4.5 },
        { label: t.normalAAA, pass: ratio! >= 7 },
        { label: t.largeAA, pass: ratio! >= 3 },
        { label: t.largeAAA, pass: ratio! >= 4.5 },
      ]
    : [];

  return (
    <div className="labtool-card">
      <p className="labtool-card__title">{t.title}</p>
      <p className="labtool-card__sub">{t.sub}</p>

      <div className="labtool-controls">
        <label className="labtool-field">
          <span className="labtool-field__label">{t.fg}</span>
          <div className="labtool-colorrow">
            <input type="color" value={fgHex ?? "#ffffff"} onChange={(e) => setFg(e.target.value)} className="labtool-colorswatch" />
            <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} aria-label={`${t.fg} (hex)`} className="labtool-colortext" spellCheck={false} />
          </div>
        </label>
        <label className="labtool-field">
          <span className="labtool-field__label">{t.bg}</span>
          <div className="labtool-colorrow">
            <input type="color" value={bgHex ?? "#000000"} onChange={(e) => setBg(e.target.value)} className="labtool-colorswatch" />
            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} aria-label={`${t.bg} (hex)`} className="labtool-colortext" spellCheck={false} />
          </div>
        </label>
      </div>

      {!isValid ? (
        <p className="labtool-warning">{t.invalid}</p>
      ) : (
        <>
          <div className="labtool-samplebox" style={{ background: bgHex!, color: fgHex! }}>
            <span className="labtool-samplebox__ratio">{ratio!.toFixed(2)}:1</span>
            <span className="labtool-samplebox__text">{t.sample}</span>
          </div>

          <div className="labtool-checklist">
            {checks.map((c) => (
              <div key={c.label} className={`labtool-check ${c.pass ? "labtool-check--pass" : "labtool-check--fail"}`}>
                <span className="labtool-check__dot" aria-hidden />
                <span className="labtool-check__label">{c.label}</span>
                <span className="labtool-check__result">{c.pass ? t.pass : t.fail}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
