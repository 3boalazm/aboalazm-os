"use client";

/**
 * SingleSourceDiagram — visual metaphor replacing a paragraph of prose.
 *
 * One "Master Tokens" node branches into three outputs (Design, Docs,
 * Code) — the idea that one approved source drives every surface,
 * instead of three disconnected files that drift apart over time.
 *
 * Pure SVG, theme-token colors only (no hardcoded hex), bilingual labels.
 */

import { useLang } from "@/components/providers/lang-provider";

const LABELS = {
  en: {
    master: "Brand Tokens",
    outputs: ["Design Files", "Documentation", "Production Code"],
  },
  ar: {
    master: "Brand Tokens",
    outputs: ["ملفات التصميم", "التوثيق", "كود الإنتاج"],
  },
} as const;

export function SingleSourceDiagram() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = ar ? LABELS.ar : LABELS.en;
  const flip = ar; // mirror horizontally for RTL reading direction

  return (
    <svg
      viewBox="0 0 480 200"
      className="ssot-diagram"
      role="img"
      aria-label={`${t.master} → ${t.outputs.join(", ")}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* connecting lines */}
      <line x1="120" y1="100" x2="330" y2="40"  className="ssot-diagram__line" />
      <line x1="120" y1="100" x2="330" y2="100" className="ssot-diagram__line" />
      <line x1="120" y1="100" x2="330" y2="160" className="ssot-diagram__line" />

      {/* master node */}
      <rect x="20" y="72" width="100" height="56" rx="8" className="ssot-diagram__master-fill ssot-diagram__master-stroke" />
      <text
        x="70" y="104" textAnchor="middle"
        className="ssot-diagram__text ssot-diagram__text--accent"
        style={flip ? { transform: "scaleX(-1)", transformOrigin: "70px 104px" } : undefined}
      >
        {t.master}
      </text>

      {/* output nodes */}
      {[
        { y: 16, label: t.outputs[0] },
        { y: 76, label: t.outputs[1] },
        { y: 136, label: t.outputs[2] },
      ].map((o, i) => (
        <g key={i}>
          <rect x="330" y={o.y} width="130" height="48" rx="8" className="ssot-diagram__node-fill ssot-diagram__node-stroke" />
          <text
            x="395" y={o.y + 29} textAnchor="middle"
            className="ssot-diagram__text"
            style={flip ? { transform: "scaleX(-1)", transformOrigin: `395px ${o.y + 29}px` } : undefined}
          >
            {o.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
