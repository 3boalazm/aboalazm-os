"use client";

/**
 * BilingualToggleTool — RTL / LTR layout demo (Labs)
 *
 * A small identity-card mockup that flips reading direction on toggle,
 * showing that the same grid holds its balance in both directions —
 * the concrete proof behind the "bilingual identity architecture" claim.
 *
 * Self-contained: does not touch the site's own `dir` attribute, only
 * the demo card's.
 */

import { useState } from "react";

const UI = {
  toggle_ltr: "Show English (LTR)",
  toggle_rtl: "Show Arabic (RTL)",
  label: "Bilingual grid demo",
  sub: "Same grid, same rules — direction flips, balance holds.",
} as const;

const CARD = {
  en: {
    kicker: "BRAND IDENTITY",
    title: "Aboalazm",
    tag: "Systemic Identity Architect",
    meta: ["Strategy", "Systems", "Bilingual"],
  },
  ar: {
    kicker: "هوية بصرية",
    title: "أبوالعزم",
    tag: "معماري الهوية الجهازية",
    meta: ["استراتيجية", "أنظمة", "ثنائي اللغة"],
  },
} as const;

export function BilingualToggleTool() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const c = dir === "ltr" ? CARD.en : CARD.ar;

  return (
    <div className="labtool-card">
      <p className="labtool-card__title">{UI.label}</p>
      <p className="labtool-card__sub">{UI.sub}</p>

      <button
        onClick={() => setDir((d) => (d === "ltr" ? "rtl" : "ltr"))}
        className="labtool-toggle-btn"
      >
        {dir === "ltr" ? UI.toggle_rtl : UI.toggle_ltr}
      </button>

      <div className="labtool-bilingual-frame" dir={dir}>
        <div className="labtool-bilingual-card">
          <span className="labtool-bilingual-kicker">{c.kicker}</span>
          <span className="labtool-bilingual-title">{c.title}</span>
          <span className="labtool-bilingual-tag">{c.tag}</span>
          <div className="labtool-bilingual-meta">
            {c.meta.map((m) => (
              <span key={m} className="labtool-bilingual-pill">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
