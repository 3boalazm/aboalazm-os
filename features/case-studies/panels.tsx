"use client";
import { useLayoutEffect, useRef } from "react";
import { useLang } from "@/components/providers/lang-provider";

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
import { useT } from "@/hooks/use-t";
import { MediaCard } from "@/components/ui/MediaCard";

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

function MonumentalKPI({ kpi, ar = false }: { kpi: KPI; ar?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-display leading-[1.02] tracking-[-0.025em] text-text-primary">
        {kpi.value}
      </span>
      <span className="text-body-sm text-text-secondary">{ar && kpi.labelAr ? kpi.labelAr : kpi.label}</span>
      {kpi.context && (
        <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar && kpi.contextAr ? kpi.contextAr : kpi.context}
        </span>
      )}
    </div>
  );
}

/* ── 01 · CONTEXT & AUDIT ──────────────────────────────────────── */

export function ContextPanel({ record }: { record: CaseStudyRecord }) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const n = record.narrativeAnswers;

  return (
    <PanelShell id="context" index="01" label={t.contextAudit}>
      {/* Huge structural statement */}
      <div className="flex flex-col gap-2">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
          {ar ? "المشكلة والرهان الأساسي" : "THE PROBLEM & STAKES"}
        </p>
        <h2 className="max-w-[28ch] font-display text-title tracking-[-0.015em] text-text-primary">
          {ar && (n?.problemAr ?? record.problemAr)
            ? (n?.problemAr ?? record.problemAr)
            : (n?.problem ?? record.problem)}
        </h2>
      </div>

      {/* Structural facts band */}
      <dl className="grid grid-cols-2 gap-3 border-y border-border-subtle py-3 md:grid-cols-4">
        {[
          [t.discipline, record.discipline],
          [t.teamScale, ar && record.teamScaleAr ? record.teamScaleAr : record.teamScale],
          [t.timeline, ar && record.timelineAr ? record.timelineAr : record.timeline],
          [t.record, record.slug.toUpperCase()],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5">
            <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {k}
            </dt>
            <dd className="text-body-sm text-text-secondary">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Narrative context: Audience & Exact Role */}
      {n && (
        <div className="grid grid-cols-1 gap-3 rounded-card border border-border-subtle bg-surface-1 p-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 border-b border-border-subtle pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4 rtl:md:border-l rtl:md:border-r-0 rtl:md:pl-4 rtl:md:pr-0">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {ar ? "ما الجمهور أو السياق؟" : "AUDIENCE & MARKET CONTEXT"}
            </p>
            <p className="text-body-sm text-text-secondary">
              {ar && n.audienceContextAr ? n.audienceContextAr : n.audienceContext}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 pt-1 md:pt-0">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
              {ar ? "ما الذي صممته أنت، ومن كان في الفريق؟" : "EXACT ROLE & COLLABORATION"}
            </p>
            <p className="text-body-sm text-text-secondary">
              {ar && n.roleAndTeamAr ? n.roleAndTeamAr : n.roleAndTeam}
            </p>
          </div>
        </div>
      )}

      {/* Audit KPIs — the "before" numbers, stated plainly */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {record.kpis.map((kpi) => (
          <MonumentalKPI key={kpi.label} kpi={kpi} ar={ar} />
        ))}
      </div>
    </PanelShell>
  );
}

/* ── 02 · RESEARCH & LOGIC ─────────────────────────────────────── */

type Box = { left: number; right: number; top: number; bottom: number };

/* Labels sit beside their dots, so two close dots can put their labels on top
   of each other once none of them is clipped any more. Walk the labels top to
   bottom and nudge each one down (the dot stays put) until its text clears the
   labels and captions above it; then walk back up and lift whatever ended past
   the bottom edge (or on top of a label below it). */
function spreadLabels(fig: HTMLElement) {
  const labels = Array.from(fig.querySelectorAll<HTMLElement>("[data-map-label]"));
  labels.forEach((el) => {
    el.style.marginTop = "0px";
  });
  const limit = fig.getBoundingClientRect().bottom - 4;
  const textBox = (el: HTMLElement): Box => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = Array.from(range.getClientRects());
    return {
      left: Math.min(...rects.map((r) => r.left)),
      right: Math.max(...rects.map((r) => r.right)),
      top: Math.min(...rects.map((r) => r.top)),
      bottom: Math.max(...rects.map((r) => r.bottom)),
    };
  };
  const hits = (a: Box, b: Box) =>
    Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5 &&
    Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5;

  const fixed = Array.from(fig.querySelectorAll<HTMLElement>("[data-map-fixed]")).map((el) =>
    el.getBoundingClientRect(),
  );
  const items = labels
    .map((el) => ({ el, box: textBox(el), dy: 0 }))
    .sort((a, b) => a.box.top - b.box.top);
  const at = (it: (typeof items)[number]): Box => ({ ...it.box, top: it.box.top + it.dy, bottom: it.box.bottom + it.dy });

  items.forEach((it, i) => {
    const above = [...fixed, ...items.slice(0, i).map(at)];
    for (let n = 0; n <= above.length; n++) {
      const hit = above.filter((o) => hits(at(it), o)).sort((a, b) => b.bottom - a.bottom)[0];
      if (!hit) break;
      it.dy = hit.bottom - it.box.top + 1;
    }
  });
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i]!;
    const below = items.slice(i + 1).map(at);
    for (let n = 0; n <= below.length + 1; n++) {
      const b = at(it);
      const hit = below.filter((o) => hits(b, o)).sort((a, b) => a.top - b.top)[0];
      const lift = Math.max(b.bottom - limit, hit ? b.bottom - hit.top + 1 : 0);
      if (lift <= 0) break;
      it.dy -= lift;
    }
  }
  items.forEach((it) => {
    it.el.style.marginTop = `${it.dy}px`;
  });
}

function CompetitorMap({
  competitors,
}: {
  competitors: readonly CompetitorVector[];
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const figRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    let live = true;
    const run = () => {
      if (live) spreadLabels(fig);
    };
    run();
    // Label wrapping follows the figure width; label size follows the web
    // font's real glyph metrics (the Arabic face swaps in after the lang flip).
    const ro = new ResizeObserver(run);
    ro.observe(fig);
    fig.querySelectorAll("[data-map-label]").forEach((el) => ro.observe(el));
    return () => {
      live = false;
      ro.disconnect();
    };
  }, [competitors, lang]);

  return (
    <figure
      ref={figRef}
      className="@container relative aspect-square overflow-hidden rounded-card border border-border-subtle bg-surface-1"
    >
      {/* Axes */}
      <span className="absolute inset-x-2 top-1/2 h-px bg-border-subtle" />
      <span className="absolute inset-y-2 left-1/2 w-px bg-border-subtle" />
      <span data-map-fixed className="absolute bottom-1 right-2 font-mono text-micro text-text-ghost">
        {ar ? "تميّز ←" : "DISTINCT →"}
      </span>
      <span data-map-fixed className="absolute left-1 top-2 font-mono text-micro text-text-ghost [writing-mode:vertical-rl]">
        {ar ? "← نظام" : "← SYSTEM"}
      </span>

      {/* Vectors. Past the midline the label sits left of its dot, otherwise
          right of it, and its width is capped to the room on that side
          (cqw = 1% of the figure) so it wraps instead of being clipped. */}
      {competitors.map((c) => {
        const flip = c.x > 50;
        return (
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
              data-map-label
              className={[
                "absolute top-1/2 w-max -translate-y-1/2 font-mono text-micro",
                flip ? "right-2 text-right" : "left-2 text-left",
                c.isClient ? "text-text-primary" : "text-text-ghost",
              ].join(" ")}
              style={{ maxWidth: `calc(${flip ? c.x : 100 - c.x}cqw - 24px)` }}
            >
              {c.name}
            </span>
          </span>
        );
      })}
      <figcaption className="sr-only">
        {ar ? "خريطة تموضع توضيحية وليست دراسة سوق منشورة" : "Illustrative positioning map; not a published market study."}
      </figcaption>
      <span data-map-fixed className="absolute right-2 top-2 rounded-pill border border-border-subtle bg-surface-0/80 px-2 py-0.5 font-mono text-micro text-text-ghost backdrop-blur-sm">
        {ar ? "توضيحي" : "ILLUSTRATIVE"}
      </span>
    </figure>
  );
}

export function ResearchPanel({ record }: { record: CaseStudyRecord }) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const n = record.narrativeAnswers;

  return (
    <PanelShell id="research" index="02" label={t.researchLogic}>
      {/* Guiding concept & rejected directions */}
      {n && (
        <div className="grid grid-cols-1 gap-4 rounded-card border border-border-subtle bg-surface-1 p-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 border-b border-border-subtle pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4 rtl:md:border-l rtl:md:border-r-0 rtl:md:pl-4 rtl:md:pr-0">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
              {ar ? "ما الفكرة التي وجّهت الهوية؟" : "GUIDING CONCEPT & METAPHOR"}
            </p>
            <p className="text-body-sm leading-relaxed text-text-primary">
              {ar && n.guidingIdeaAr ? n.guidingIdeaAr : n.guidingIdea}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 pt-1 md:pt-0">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {ar ? "ما الاتجاهات التي رفضتها ولماذا؟" : "REJECTED DIRECTIONS & RATIONALE"}
            </p>
            <p className="whitespace-pre-line text-body-sm leading-relaxed text-text-secondary">
              {ar && n.rejectedDirectionsAr ? n.rejectedDirectionsAr : n.rejectedDirections}
            </p>
          </div>
        </div>
      )}

      {/* Asymmetric bento: 5/7 split, map dominant */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-3 rounded-card border border-border-subtle bg-surface-1 p-3 md:col-span-5">
          <p className="text-lead text-text-secondary">{ar && record.researchSummaryAr ? record.researchSummaryAr : record.researchSummary}</p>
          <div className="flex flex-wrap gap-1">
            {(ar && record.visualVectorsAr ? record.visualVectorsAr : record.visualVectors).map((v) => (
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
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const n = record.narrativeAnswers;
  const proof = record.designProofItems;

  return (
    <PanelShell id="execution" index="03" label={t.executionGov}>
      <h2 className="max-w-[20ch] font-display text-title tracking-[-0.015em]">
        {t.executionH2}
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Token table — the design system core */}
        <div className="@container rounded-card border border-border-subtle bg-surface-1 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {t.structuralTokens}
            </p>
            <span className="font-mono text-micro text-text-ghost">
              {ar ? "قيم معتمدة وخيارات مرفوضة" : "Approved vs Rejected"}
            </span>
          </div>
          {/* The three columns need ~500px; in a narrower card each row
              stacks (token + value, then role) instead of overflowing. */}
          <table className="w-full">
            <tbody>
              {record.tokens.map((tok) => {
                const isRejected = tok.value.toLowerCase().includes("rejected");
                return (
                  <tr
                    key={tok.token}
                    className="border-b border-border-subtle last:border-0 @max-xl:flex @max-xl:flex-wrap @max-xl:gap-x-3 @max-xl:px-3 @max-xl:py-2"
                  >
                    <td className="px-3 py-2 font-geist text-micro @max-xl:p-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            isRejected ? "bg-text-ghost" : "bg-accent"
                          }`}
                        />
                        <span className={isRejected ? "text-text-ghost line-through" : "text-accent"}>
                          {tok.token}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-geist text-micro text-text-secondary @max-xl:min-w-0 @max-xl:p-0">
                      <div className="flex items-center gap-1.5 @max-xl:flex-wrap @max-xl:break-words">
                        <span>{tok.value}</span>
                        {isRejected ? (
                          <span className="rounded bg-surface-2 px-1 py-0.2 font-mono text-[9px] uppercase text-text-ghost">
                            {ar ? "مرفوض" : "REJECTED"}
                          </span>
                        ) : (
                          <span className="rounded bg-accent/15 px-1 py-0.2 font-mono text-[9px] uppercase text-accent">
                            {ar ? "معتمد" : "LOCKED"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-micro text-text-ghost @max-xl:basis-full @max-xl:p-0 @max-xl:text-start">
                      {ar && tok.roleAr ? tok.roleAr : tok.role}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Component states — live button row */}
          <p className="border-y border-border-subtle px-3 py-1.5 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {t.componentStates}
          </p>
          <div className="flex flex-wrap items-center gap-2 p-3">
            <button className="rounded-pill bg-text-primary px-2.5 py-1 font-mono text-micro text-surface-0 transition-transform duration-fast ease-physics hover:-translate-y-0.5">
              DEFAULT
            </button>
            <button className="rounded-pill border border-border-strong px-2.5 py-1 font-mono text-micro text-text-primary">
              HOVER
            </button>
            <button className="rounded-pill border border-accent px-2.5 py-1 font-mono text-micro text-text-primary outline outline-1 outline-offset-2 outline-accent/40">
              FOCUS
            </button>
            <button
              disabled
              className="rounded-pill border border-border-subtle px-2.5 py-1 font-mono text-micro text-text-ghost"
            >
              DISABLED
            </button>
          </div>

          {/* Responsive spec */}
          <p className="border-y border-border-subtle px-3 py-1.5 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {t.responsiveLayout}
          </p>
          <div className="flex gap-4 p-3">
            {record.breakpoints.map((b) => (
              <span key={b.bp} className="font-geist text-micro text-text-tertiary">
                {b.bp} <span className="font-medium text-text-secondary">{b.cols}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Before/After widget — audit vs system */}
        <div className="flex flex-col gap-1 lg:col-span-7">
          <BeforeAfterSlider />
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {t.dragLine}
          </p>
        </div>
      </div>

      {/* Where the system shipped / real world deployment */}
      {n?.whereUsed && (
        <div className="mt-2 rounded-card border border-border-subtle bg-surface-1 p-4">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
            {ar ? "أين استُخدم النظام في الإنتاج والواقع؟" : "WHERE THE SYSTEM LIVES — PRODUCTION DEPLOYMENT"}
          </p>
          <p className="mt-1 text-body-sm leading-relaxed text-text-secondary">
            {ar && n.whereUsedAr ? n.whereUsedAr : n.whereUsed}
          </p>
        </div>
      )}

      {/* ── DESIGN PROOF: Original, Legible Assets ── */}
      {proof && proof.length > 0 && (
        <div className="mt-4 flex flex-col gap-4 border-t border-border-subtle pt-8">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
              {ar ? "إثباتات التصميم — أصول أصلية ومقروءة" : "DESIGN PROOF — ORIGINAL & LEGIBLE ARTIFACTS"}
            </p>
            <h3 className="font-display text-subtitle text-text-primary">
              {ar ? "بناء الشعار، اختبار المقروئية، وتطبيقات الإنتاج" : "Logo Construction, Scale Verification & Production Applications"}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {proof.map((item) => (
              <article
                key={item.title}
                className="flex flex-col overflow-hidden rounded-card border border-border-subtle bg-surface-1 transition-all duration-base ease-physics hover:border-border-strong"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={ar && item.titleAr ? item.titleAr : item.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 ease-physics hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <h4 className="font-display text-body-sm font-semibold text-text-primary">
                    {ar && item.titleAr ? item.titleAr : item.title}
                  </h4>
                  <p className="text-body-sm text-text-secondary">
                    {ar && item.descriptionAr ? item.descriptionAr : item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Project gallery — rendered when record.images is populated */}
      {record.images && record.images.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-border-subtle pt-6">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {t.deliverables}
          </p>
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {record.images.map((img) => (
              <MediaCard
                key={img.src}
                className="relative mb-3 break-inside-avoid"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.caption ?? ""}
                  width={img.w}
                  height={img.h}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-300 ease-physics group-hover:scale-105"
                  style={{ aspectRatio: `${img.w}/${img.h}` }}
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 transition-transform duration-300 ease-physics group-hover:translate-y-0">
                    <p className="font-mono text-micro uppercase tracking-[0.08em] text-white/80">
                      {img.caption}
                    </p>
                  </div>
                )}
              </MediaCard>
            ))}
          </div>
        </div>
      )}
    </PanelShell>
  );
}

/* ── 04 · PERFORMANCE & POST MORTEM ────────────────────────────── */

export function PerformancePanel({ record }: { record: CaseStudyRecord }) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <PanelShell id="performance" index="04" label={t.performancePM}>
      {/* Monumental callouts */}
      <div className="grid grid-cols-1 gap-4 border-b border-border-subtle pb-8 sm:grid-cols-3">
        {record.results.map((kpi) => (
          <MonumentalKPI key={kpi.label} kpi={kpi} ar={ar} />
        ))}
      </div>

      {/* Systematic retro */}
      <div className="flex flex-col">
        <p className="pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {t.retroLedger}
        </p>
        {record.retro.map((r) => (
          <div
            key={r.note}
            className="grid grid-cols-[5rem_1fr] items-baseline gap-2 border-b border-border-subtle py-2 last:border-0"
          >
            <span
              className={[
                "font-mono text-micro tracking-[0.10em]",
                r.verdict === "KEEP" && "text-success",
                r.verdict === "CHANGE" && "text-accent",
                r.verdict === "DROP" && "text-text-ghost",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              [{ar ? (r.verdict === "KEEP" ? "احتفظ" : r.verdict === "CHANGE" ? "غيّر" : "أسقط") : r.verdict}]
            </span>
            <span className="text-body-sm text-text-secondary">{ar && r.noteAr ? r.noteAr : r.note}</span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
