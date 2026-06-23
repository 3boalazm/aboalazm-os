"use client";

/**
 * /type — undefined font variations showcase
 * Internal reference page for Mustafa to preview all heading styles.
 */

const SPECIMEN_TEXT = "Brand System";
const SPECIMEN_LONG = "Systemic Identity Architect";
const SPECIMEN_ALPHA = "ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\n0123456789";

type Variation = {
  name: string;
  className: string;
  description: string;
  size?: string;
  sampleText?: string;
};

const VARIATIONS: Variation[] = [
  {
    name: "Base",
    className: "font-undefined",
    description: "Raw undefined medium — the default heading voice across all EN pages.",
    size: "text-[clamp(2.5rem,5vw,4.5rem)]",
  },
  {
    name: "Outline",
    className: "font-undefined-outline",
    description: "Hollow letterforms. Works at large scale for hero backgrounds or secondary headings.",
    size: "text-[clamp(2.5rem,5vw,4.5rem)]",
  },
  {
    name: "Condensed",
    className: "font-undefined-condensed",
    description: "Tighter horizontal rhythm via scaleX. Good for sub-headings or label chips.",
    size: "text-[clamp(2rem,4vw,3.5rem)]",
  },
  {
    name: "Expanded",
    className: "font-undefined-expanded",
    description: "Wide tracking — loose, airy, editorial feel for section dividers.",
    size: "text-[clamp(1.25rem,2.5vw,2rem)]",
    sampleText: "Brand Identity",
  },
  {
    name: "Ghost",
    className: "font-undefined-ghost",
    description: "6% opacity — used as a decorative background texture behind content, not for reading.",
    size: "text-[clamp(4rem,10vw,9rem)]",
    sampleText: "UNDEFINED",
  },
  {
    name: "Stamp",
    className: "font-undefined-stamp",
    description: "Uppercase compressed — print-block energy. Good for category labels at small sizes.",
    size: "text-[clamp(2rem,4vw,3.5rem)]",
    sampleText: "Creative Lead",
  },
  {
    name: "Editorial",
    className: "font-undefined-editorial",
    description: "Loose uppercase tracking, reduced size — magazine pull-quote energy.",
    size: "text-[clamp(0.9rem,1.6vw,1.25rem)]",
    sampleText: "Senior Brand Identity Designer",
  },
  {
    name: "Oblique",
    className: "font-undefined-oblique",
    description: "Synthetic 10° oblique — no italic cut exists, this is CSS oblique.",
    size: "text-[clamp(2.5rem,5vw,4.5rem)]",
  },
  {
    name: "Hero (outline + expanded)",
    className: "font-undefined-hero",
    description: "Combines outline stroke with expanded tracking. Hero-scale only — 60px+.",
    size: "text-[clamp(3rem,7vw,6.5rem)]",
    sampleText: "Aboalazm",
  },
];

const REAL_WORLD: { label: string; className: string; text: string; sub?: string }[] = [
  {
    label: "Hero headline (index page)",
    className: "font-undefined text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.95] tracking-[-0.03em]",
    text: "Systemic\nIdentity.",
  },
  {
    label: "Section title (work, services)",
    className: "font-undefined text-[clamp(1.5rem,2.8vw,2.25rem)] tracking-[-0.015em] leading-[1.15]",
    text: "Selected Work",
  },
  {
    label: "Outline + base stacked (hero overlay technique)",
    className: "",
    text: "",
  },
  {
    label: "Category chip / discipline tag",
    className: "font-undefined-stamp text-[0.75rem]",
    text: "Brand Identity",
  },
  {
    label: "Ghost watermark (behind hero)",
    className: "font-undefined-ghost text-[clamp(3rem,8vw,7rem)] leading-none",
    text: "CODE & CANVAS",
  },
];

export default function TypePage() {
  return (
    <main className="min-h-screen bg-obsidian px-6 py-16 lg:px-16">
      {/* ── Header ── */}
      <div className="mb-16 border-b border-border-subtle pb-8">
        <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-ghost">
          INTERNAL · TYPE SYSTEM
        </p>
        <h1 className="font-undefined text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-text-primary">
          undefined
          <span className="ml-4 font-undefined-outline text-accent">medium</span>
        </h1>
        <p className="mt-4 max-w-xl text-text-secondary" style={{ fontFamily: "system-ui, sans-serif" }}>
          One weight, eight variations. All derived via CSS — letter-spacing,
          scaleX, -webkit-text-stroke, oblique. No extra font files needed.
        </p>
      </div>

      {/* ── Alphabet specimen ── */}
      <section className="mb-16">
        <Label>Full character set · 500 weight</Label>
        <pre
          className="font-undefined mt-4 whitespace-pre-wrap text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.3] tracking-[0.02em] text-text-secondary"
        >
          {SPECIMEN_ALPHA}
        </pre>
      </section>

      {/* ── Variations grid ── */}
      <section className="mb-20">
        <Label>Variations</Label>
        <div className="mt-8 space-y-12">
          {VARIATIONS.map((v) => (
            <VariationRow key={v.name} v={v} />
          ))}
        </div>
      </section>

      {/* ── Real-world contexts ── */}
      <section className="mb-20">
        <Label>Real-world contexts</Label>
        <div className="mt-8 space-y-10">
          {/* Hero stacked */}
          <div className="rounded-panel border border-border-subtle bg-surface-1 p-8">
            <CtxLabel>Hero overlay — base + outline stacked</CtxLabel>
            <div className="relative mt-4">
              <span className="font-undefined-ghost pointer-events-none absolute inset-0 select-none text-[clamp(4rem,10vw,9rem)] leading-none text-text-primary">
                OS
              </span>
              <span className="font-undefined relative block text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-text-primary">
                Brand
              </span>
              <span className="font-undefined-outline relative block text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-accent">
                Systems.
              </span>
            </div>
          </div>

          {/* Section heading */}
          <div className="rounded-panel border border-border-subtle bg-surface-1 p-8">
            <CtxLabel>Section title — work/services pages</CtxLabel>
            <h2 className="font-undefined mt-4 text-[clamp(1.5rem,2.8vw,2.25rem)] tracking-[-0.015em] text-text-primary">
              A handful of brands I&apos;ve{" "}
              <em className="font-undefined-outline not-italic text-accent">shaped.</em>
            </h2>
          </div>

          {/* Editorial pull */}
          <div className="rounded-panel border border-border-subtle bg-surface-1 p-8">
            <CtxLabel>Editorial pull — about / why pages</CtxLabel>
            <p className="font-undefined-editorial mt-4 text-[clamp(0.85rem,1.4vw,1.1rem)] text-text-tertiary">
              Senior Brand Identity Designer · Co-founder
            </p>
            <p className="font-undefined mt-2 text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.05] tracking-[-0.02em] text-text-primary">
              7 years of systems thinking.
            </p>
          </div>

          {/* Stamp tag */}
          <div className="rounded-panel border border-border-subtle bg-surface-1 p-8">
            <CtxLabel>Discipline / category tags</CtxLabel>
            <div className="mt-4 flex flex-wrap gap-3">
              {["Brand Identity", "Visual Systems", "Art Direction", "Pharma", "Education"].map((t) => (
                <span
                  key={t}
                  className="font-undefined-stamp inline-block rounded-pill border border-border-default px-3 py-1 text-[0.68rem] text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CSS reference ── */}
      <section>
        <Label>CSS class reference</Label>
        <div className="mt-6 overflow-x-auto rounded-card border border-border-subtle bg-surface-1 p-6">
          <table className="w-full text-left font-mono text-[0.72rem] text-text-secondary">
            <thead>
              <tr className="border-b border-border-subtle text-text-ghost">
                <th className="pb-3 pr-8">Class</th>
                <th className="pb-3 pr-8">letter-spacing</th>
                <th className="pb-3 pr-8">stroke</th>
                <th className="pb-3">transform</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {[
                [".font-undefined", "-0.01em", "—", "—"],
                [".font-undefined-outline", "0.02em", "1px currentColor (transparent fill)", "—"],
                [".font-undefined-condensed", "-0.04em", "—", "scaleX(0.85)"],
                [".font-undefined-expanded", "0.12em", "—", "—"],
                [".font-undefined-ghost", "-0.01em", "—", "opacity: 0.06"],
                [".font-undefined-stamp", "0.06em", "—", "scaleX(0.78) + uppercase"],
                [".font-undefined-editorial", "0.22em", "—", "uppercase + 0.72em size"],
                [".font-undefined-oblique", "-0.01em", "—", "oblique 10deg"],
                [".font-undefined-hero", "0.06em", "1.5px (transparent fill)", "—"],
              ].map(([cls, ls, stroke, tx]) => (
                <tr key={cls} className="border-b border-border-subtle/40">
                  <td className="py-2 pr-8 text-text-primary">{cls}</td>
                  <td className="py-2 pr-8">{ls}</td>
                  <td className="py-2 pr-8">{stroke}</td>
                  <td className="py-2">{tx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* ── Local helpers ── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-text-ghost">
      {children}
    </p>
  );
}

function CtxLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-text-ghost">
      {children}
    </p>
  );
}

function VariationRow({ v }: { v: Variation }) {
  const text = v.sampleText ?? SPECIMEN_TEXT;
  return (
    <div className="grid gap-4 border-b border-border-subtle pb-10 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="mb-3 flex items-baseline gap-4">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent">
            {v.name}
          </span>
          <code className="font-mono text-[0.6rem] text-text-ghost">.{v.className}</code>
        </div>
        <p
          className={`${v.className} ${v.size ?? "text-[clamp(2rem,4vw,3.5rem)]"} leading-[1.05] text-text-primary`}
          style={{ whiteSpace: "pre-line" }}
        >
          {text}
        </p>
      </div>
      <div className="self-end">
        <p className="text-[0.78rem] leading-relaxed text-text-tertiary" style={{ fontFamily: "system-ui" }}>
          {v.description}
        </p>
      </div>
    </div>
  );
}
