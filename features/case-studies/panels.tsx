"use client";

/**
 * NARRATIVE PANELS — the four architectural blocks.
 * Each panel is a <section id> the TrackSidebar listens to. Entrances
 * use a shared GSAP batch (registered in ScrollyCaseStudy); inside,
 * layout is pure token grid — minimal noise, absolute hierarchy:
 *
 *   mono micro-label → serif display statement → structured data.
 */
import type {
  CaseStudyRecord,
  KPI,
  CompetitorVector,
} from "./types";
import { BeforeAfterSlider } from "./before-after-slider";

/* ── Shared atoms ──────────────────────────────────────────────── */

function PanelShell({
  id,
  index,
  label,
  children,
}: {
  id: string;
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-panel
      className="flex scroll-mt-16 flex-col gap-4 border-t border-border-subtle py-8"
    >
      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        {index} / {label}
      </p>
      {children}
    </section>
  );
}

function MonumentalKPI({ kpi }: { kpi: KPI }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-display leading-[1.02] tracking-[-0.025em] text-text-primary">
        {kpi.value}
      </span>
      <span className="text-body-sm text-text-secondary">{kpi.label}</span>
      {kpi.context && (
        <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {kpi.context}
        </span>
      )}
    </div>
  );
}

/* ── 01 · CONTEXT & AUDIT ──────────────────────────────────────── */

export function ContextPanel({ record }: { record: CaseStudyRecord }) {
  return (
    <PanelShell id="context" index="01" label="CONTEXT & AUDIT">
      {/* Huge structural statement */}
      <h2 className="max-w-[24ch] font-display text-title tracking-[-0.015em] text-text-primary">
        {record.problem}
      </h2>

      {/* Structural facts band */}
      <dl className="grid grid-cols-2 gap-3 border-y border-border-subtle py-3 md:grid-cols-4">
        {[
          ["DISCIPLINE", record.discipline],
          ["TEAM SCALE", record.teamScale],
          ["TIMELINE", record.timeline],
          ["RECORD", record.slug.toUpperCase()],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5">
            <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {k}
            </dt>
            <dd className="text-body-sm text-text-secondary">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Audit KPIs — the "before" numbers, stated plainly */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {record.kpis.map((kpi) => (
          <MonumentalKPI key={kpi.label} kpi={kpi} />
        ))}
      </div>
    </PanelShell>
  );
}

/* ── 02 · RESEARCH & LOGIC ─────────────────────────────────────── */

function CompetitorMap({
  competitors,
}: {
  competitors: readonly CompetitorVector[];
}) {
  return (
    <figure className="relative aspect-square overflow-hidden rounded-card border border-border-subtle bg-surface-1 p-2">
      {/* Axes */}
      <span className="absolute inset-x-2 top-1/2 h-px bg-border-subtle" />
      <span className="absolute inset-y-2 left-1/2 w-px bg-border-subtle" />
      <span className="absolute bottom-1 right-2 font-mono text-micro text-text-ghost">
        DISTINCT →
      </span>
      <span className="absolute left-1 top-2 font-mono text-micro text-text-ghost [writing-mode:vertical-rl]">
        ← SYSTEM
      </span>

      {/* Vectors */}
      {competitors.map((c) => (
        <span
          key={c.name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${c.x}%`, top: `${100 - c.y}%` }}
        >
          <span
            className={[
              "block rounded-pill",
              c.isClient
                ? "size-2 bg-accent shadow-[0_0_12px_rgb(255_107_71/0.5)]"
                : "size-1 bg-text-tertiary",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-micro",
              c.isClient ? "text-text-primary" : "text-text-ghost",
            ].join(" ")}
          >
            {c.name}
          </span>
        </span>
      ))}
      <figcaption className="sr-only">
        Competitor landscape: distinctiveness vs system maturity.
      </figcaption>
    </figure>
  );
}

export function ResearchPanel({ record }: { record: CaseStudyRecord }) {
  return (
    <PanelShell id="research" index="02" label="RESEARCH & LOGIC">
      {/* Asymmetric bento: 5/7 split, map dominant */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-3 rounded-card border border-border-subtle bg-surface-1 p-3 md:col-span-5">
          <p className="text-lead text-text-secondary">{record.researchSummary}</p>
          <div className="flex flex-wrap gap-1">
            {record.visualVectors.map((v) => (
              <span
                key={v}
                className="rounded-pill border border-border-subtle px-1 py-0.5 font-geist text-micro tracking-[0.02em] text-text-tertiary"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
        <div className="md:col-span-7">
          <CompetitorMap competitors={record.competitors} />
        </div>
      </div>
    </PanelShell>
  );
}

/* ── 03 · EXECUTION & GOVERNANCE ───────────────────────────────── */

export function ExecutionPanel({ record }: { record: CaseStudyRecord }) {
  return (
    <PanelShell id="execution" index="03" label="EXECUTION & GOVERNANCE">
      <h2 className="max-w-[20ch] font-display text-title tracking-[-0.015em]">
        The system, governed: tokens, states, and the grid they live on.
      </h2>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
        {/* Token table — the design system core */}
        <div className="rounded-card border border-border-subtle bg-surface-1 lg:col-span-5">
          <p className="border-b border-border-subtle px-2 py-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            STRUCTURAL TOKENS
          </p>
          <table className="w-full">
            <tbody>
              {record.tokens.map((t) => (
                <tr key={t.token} className="border-b border-border-subtle last:border-0">
                  <td className="px-2 py-1 font-geist text-micro text-accent">
                    {t.token}
                  </td>
                  <td className="px-2 py-1 font-geist text-micro text-text-secondary">
                    {t.value}
                  </td>
                  <td className="px-2 py-1 text-right font-mono text-micro text-text-ghost">
                    {t.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Component states — live button row */}
          <p className="border-y border-border-subtle px-2 py-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            COMPONENT STATES
          </p>
          <div className="flex flex-wrap items-center gap-2 p-2">
            <button className="rounded-pill bg-text-primary px-2 py-1 font-mono text-micro text-obsidian transition-transform duration-fast ease-physics hover:-translate-y-0.5">
              DEFAULT
            </button>
            <button className="rounded-pill border border-border-strong px-2 py-1 font-mono text-micro text-text-primary">
              HOVER
            </button>
            <button className="rounded-pill border border-accent px-2 py-1 font-mono text-micro text-text-primary outline outline-1 outline-offset-2 outline-accent/40">
              FOCUS
            </button>
            <button
              disabled
              className="rounded-pill border border-border-subtle px-2 py-1 font-mono text-micro text-text-ghost"
            >
              DISABLED
            </button>
          </div>

          {/* Responsive spec */}
          <p className="border-y border-border-subtle px-2 py-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            RESPONSIVE LAYOUT
          </p>
          <div className="flex gap-3 p-2">
            {record.breakpoints.map((b) => (
              <span key={b.bp} className="font-geist text-micro text-text-tertiary">
                {b.bp} <span className="text-text-secondary">{b.cols}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Before/After widget — chaos vs system */}
        <div className="flex flex-col gap-1 lg:col-span-7">
          <BeforeAfterSlider />
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            DRAG THE LINE — AUDIT STATE ⇄ GOVERNED SYSTEM
          </p>
        </div>
      </div>
    </PanelShell>
  );
}

/* ── 04 · PERFORMANCE & POST MORTEM ────────────────────────────── */

export function PerformancePanel({ record }: { record: CaseStudyRecord }) {
  return (
    <PanelShell id="performance" index="04" label="PERFORMANCE & POST MORTEM">
      {/* Monumental callouts */}
      <div className="grid grid-cols-1 gap-4 border-b border-border-subtle pb-8 sm:grid-cols-3">
        {record.results.map((kpi) => (
          <MonumentalKPI key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Systematic retro */}
      <div className="flex flex-col">
        <p className="pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          RETRO LEDGER
        </p>
        {record.retro.map((r) => (
          <div
            key={r.note}
            className="grid grid-cols-[5rem_1fr] items-baseline gap-2 border-b border-border-subtle py-2 last:border-0"
          >
            <span
              className={[
                "font-mono text-micro tracking-[0.10em]",
                r.verdict === "KEEP" && "text-[#3DDC84]",
                r.verdict === "CHANGE" && "text-accent",
                r.verdict === "DROP" && "text-text-ghost",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              [{r.verdict}]
            </span>
            <span className="text-body-sm text-text-secondary">{r.note}</span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
