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

type Rect = { l: number; r: number; t: number; b: number };

/* Put every label beside its own dot without covering another dot, a caption
   or another label, and without clipping it. A label sits right of its dot in
   the left half and left of it in the right half; when that spot is taken it
   may flip sides and/or slide up or down, whichever costs the least travel.
   Its width is capped to the room on the chosen side, so it wraps instead.
   Dots are fixed; only labels move. */
function placeLabels(fig: HTMLElement) {
  const labels = Array.from(fig.querySelectorAll<HTMLElement>("[data-map-label]"));
  const F = fig.getBoundingClientRect();
  if (labels.length === 0 || F.width < 80) return;
  const INSET = 4; // text stays this far inside the figure
  const rel = (r: DOMRect): Rect => ({ l: r.left - F.left, r: r.right - F.left, t: r.top - F.top, b: r.bottom - F.top });
  const grow = (r: Rect, by: number): Rect => ({ l: r.l - by, r: r.r + by, t: r.t - by, b: r.b + by });
  const overlap = (a: Rect, b: Rect) =>
    Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
  const textSize = (el: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const q = Array.from(range.getClientRects());
    if (q.length === 0) return { w: 0, h: 0 };
    return {
      w: Math.max(...q.map((x) => x.right)) - Math.min(...q.map((x) => x.left)),
      h: Math.max(...q.map((x) => x.bottom)) - Math.min(...q.map((x) => x.top)),
    };
  };

  // Back to the stylesheet defaults, so the measurements start clean.
  labels.forEach((el) => ["left", "right", "width", "margin-top", "text-align"].forEach((p) => el.style.removeProperty(p)));

  const fixed = Array.from(fig.querySelectorAll<HTMLElement>("[data-map-fixed]")).map((el) =>
    grow(rel(el.getBoundingClientRect()), 2),
  );
  const items = labels.map((el) => {
    const dot = rel(el.parentElement!.querySelector<HTMLElement>("[data-map-dot]")!.getBoundingClientRect());
    const first = el.dataset.mapSide === "l" ? "l" : "r";
    const gap = parseFloat(getComputedStyle(el)[first === "l" ? "right" : "left"]) || 16; // dot edge -> label edge
    const reach = gap - (dot.r - dot.l) / 2; // dot centre -> near edge of the label
    const cx = (dot.l + dot.r) / 2;
    const cy = (dot.t + dot.b) / 2;
    // One option per side: the label wrapped to the room it has there.
    const opts = (["r", "l"] as const).flatMap((side) => {
      const room = side === "r" ? F.width - cx - reach - INSET : cx - reach - INSET;
      if (room < 24) return [];
      el.style.maxWidth = `${room}px`;
      const { w, h } = textSize(el);
      return [{ side, room, w, h, l: side === "r" ? cx + reach : cx - reach - w }];
    });
    return { el, dot, avoid: grow(dot, 2), cx, cy, gap, first, opts, client: dot.r - dot.l > 12 };
  });
  type Item = (typeof items)[number];
  type Pick = { opt: Item["opts"][number]; dy: number };

  const boxOf = (it: Item, p: Pick): Rect => ({
    l: p.opt.l,
    r: p.opt.l + p.opt.w,
    t: it.cy + p.dy - p.opt.h / 2,
    b: it.cy + p.dy + p.opt.h / 2,
  });
  // Any collision outweighs any travel; travel grows faster than linearly so
  // one far-flung label loses to several small nudges; flipping sides is a
  // small tax on top.
  const costOf = (it: Item, p: Pick, others: Rect[]) => {
    const box = boxOf(it, p);
    let hit = box.l < INSET || box.r > F.width - INSET ? 1e4 : 0;
    for (const o of fixed) hit += overlap(box, o);
    for (const o of items) if (o !== it) hit += overlap(box, o.avoid);
    for (const o of others) hit += overlap(box, o);
    return hit * 1e3 + Math.abs(p.dy) + (p.dy * p.dy) / 32 + (p.opt.side === it.first ? 0 : 10);
  };
  const bestFor = (it: Item, others: Rect[]) => {
    let best: Pick | null = null;
    let bestCost = Infinity;
    for (const opt of it.opts) {
      for (let dy = Math.ceil(INSET + opt.h / 2 - it.cy); dy <= Math.floor(F.height - INSET - opt.h / 2 - it.cy); dy++) {
        const c = costOf(it, { opt, dy }, others);
        if (c < bestCost) {
          best = { opt, dy };
          bestCost = c;
        }
      }
    }
    return best;
  };

  // Place greedily in some order, then let each label re-pick its spot
  // against the final positions of the rest until nothing improves. Greedy
  // order matters, so start from several and keep the cheapest. The
  // highlighted (client) label always goes first.
  const byY = [...items].sort((a, b) => a.cy - b.cy);
  const byX = [...items].sort((a, b) => a.cx - b.cx);
  const tightest = [...items].sort((a, b) => Math.max(...a.opts.map((o) => o.room)) - Math.max(...b.opts.map((o) => o.room)));
  let best: { picks: Map<Item, Pick>; total: number } | null = null;
  for (const o of [byY, [...byY].reverse(), byX, [...byX].reverse(), tightest]) {
    const order = [...o.filter((it) => it.client), ...o.filter((it) => !it.client)];
    const picks = new Map<Item, Pick>();
    const around = (it: Item) => [...picks].filter(([o2]) => o2 !== it).map(([o2, p]) => grow(boxOf(o2, p), 2));
    for (const it of order) {
      const p = bestFor(it, around(it));
      if (!p) break;
      picks.set(it, p);
    }
    if (picks.size < items.length) continue;
    for (let pass = 0; pass < 8; pass++) {
      let moved = false;
      for (const it of order) {
        const others = around(it);
        const p = bestFor(it, others)!;
        if (costOf(it, p, others) < costOf(it, picks.get(it)!, others) - 1e-6) {
          picks.set(it, p);
          moved = true;
        }
      }
      if (!moved) break;
    }
    const total = items.reduce((sum, it) => sum + costOf(it, picks.get(it)!, around(it)), 0);
    if (!best || total < best.total) best = { picks, total };
  }
  const leaders = Array.from(fig.querySelectorAll<SVGLineElement>("[data-map-leader]"));
  const lead = (i: number, pts: [number, number, number, number]) =>
    (["x1", "y1", "x2", "y2"] as const).forEach((a, n) => leaders[i]?.setAttribute(a, String(pts[n])));
  items.forEach((it, i) => {
    const p = best?.picks.get(it);
    lead(i, [0, 0, 0, 0]);
    if (!p) {
      it.el.style.removeProperty("max-width"); // no spot found: keep the CSS placement
      return;
    }
    // A label that had to slide until its dot is no longer level with it gets a
    // thin leader from the dot to the nearest corner of the label, so it still
    // reads as that dot's.
    const box = boxOf(it, p);
    const ny = Math.min(Math.max(it.cy, box.t), box.b);
    if (Math.abs(ny - it.cy) > 0.5) {
      lead(i, [it.cx - fig.clientLeft, it.cy - fig.clientTop, (p.opt.side === "r" ? box.l : box.r) - fig.clientLeft, ny - fig.clientTop]);
    }
    const right = p.opt.side === "r";
    it.el.style.maxWidth = `${p.opt.room}px`;
    it.el.style.width = `${Math.ceil(p.opt.w)}px`;
    it.el.style.left = right ? `${it.gap}px` : "auto";
    it.el.style.right = right ? "auto" : `${it.gap}px`;
    it.el.style.textAlign = right ? "left" : "right";
    it.el.style.marginTop = `${p.dy}px`;
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
    let raf = 0;
    const run = () => placeLabels(fig);
    // Label size follows the figure width (wrapping) and the type system:
    // the lang provider flips <html lang/dir> after this effect and the
    // Arabic face may still be loading, and none of that changes a label's
    // box. Re-run from a frame callback so the pass can't loop its observers.
    const later = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(run);
    };
    run();
    const ro = new ResizeObserver(later);
    ro.observe(fig);
    const mo = new MutationObserver(later);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir"] });
    document.fonts?.addEventListener("loadingdone", later);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      document.fonts?.removeEventListener("loadingdone", later);
    };
  }, [competitors]);

  return (
    <figure
      ref={figRef}
      className="@container relative aspect-square overflow-hidden rounded-card border border-border-subtle bg-surface-1"
    >
      {/* Axes */}
      <span className="absolute inset-x-2 top-1/2 h-px bg-border-subtle" />
      <span className="absolute inset-y-2 left-1/2 w-px bg-border-subtle" />
      {/* Leaders — placeLabels() draws one only for a label that sits off its dot's own height */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full stroke-text-ghost">
        {competitors.map((c) => (
          <line key={c.name} data-map-leader strokeWidth={1} strokeOpacity={0.7} />
        ))}
      </svg>
      <span data-map-fixed className="absolute bottom-1 right-2 font-mono text-micro text-text-ghost">
        {ar ? "تميّز ←" : "DISTINCT →"}
      </span>
      <span data-map-fixed className="absolute left-1 top-2 font-mono text-micro text-text-ghost [writing-mode:vertical-rl]">
        {ar ? "← نظام" : "← SYSTEM"}
      </span>

      {/* Vectors. Past the midline the label sits left of its dot, otherwise
          right of it, and its width is capped to the room on that side
          (cqw = 1% of the figure) so it wraps instead of being clipped. That
          is the first-paint placement; placeLabels() then refines it. */}
      {competitors.map((c) => {
        const flip = c.x > 50;
        return (
          <span
            key={c.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.x}%`, top: `${100 - c.y}%` }}
          >
            <span
              data-map-dot
              className={[
                "block rounded-pill",
                c.isClient
                  ? "size-2 bg-accent shadow-[0_0_12px_rgb(255_107_71/0.5)]"
                  : "size-1 bg-text-tertiary",
              ].join(" ")}
            />
            <span
              data-map-label
              data-map-side={flip ? "l" : "r"}
              className={[
                "absolute top-1/2 w-max max-w-[var(--map-room)] -translate-y-1/2 font-mono text-micro",
                flip ? "right-2 text-right" : "left-2 text-left",
                c.isClient ? "text-text-primary" : "text-text-ghost",
              ].join(" ")}
              style={{ "--map-room": `calc(${flip ? c.x : 100 - c.x}cqw - 24px)` } as React.CSSProperties}
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
          {/* The long role column leaves the token names (a hyphen can break
              them) too little room until the card is ~900px wide; in a
              narrower card each row stacks (token + value, then role)
              instead. Rows become display:flex there, which drops the table
              semantics in Safari/VoiceOver, so the roles are stated explicitly. */}
          <table className="w-full" role="table">
            <tbody role="rowgroup">
              {record.tokens.map((tok) => {
                const isRejected = tok.value.toLowerCase().includes("rejected");
                return (
                  <tr
                    key={tok.token}
                    role="row"
                    className="border-b border-border-subtle last:border-0 @max-4xl:flex @max-4xl:flex-wrap @max-4xl:gap-x-3 @max-4xl:px-3 @max-4xl:py-2"
                  >
                    <td role="cell" className="px-3 py-2 font-geist text-micro @max-4xl:p-0">
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
                    <td role="cell" className="px-3 py-2 font-geist text-micro text-text-secondary @max-4xl:min-w-0 @max-4xl:p-0">
                      <div className="flex items-center gap-1.5 @max-4xl:flex-wrap @max-4xl:break-words">
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
                    <td role="cell" className="px-3 py-2 text-right font-mono text-micro text-text-ghost @max-4xl:basis-full @max-4xl:p-0 @max-4xl:text-start">
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
          <div className="flex flex-wrap gap-x-4 gap-y-1 p-3">
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

export function PerformancePanel({ record, index = "04" }: { record: CaseStudyRecord; index?: string }) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <PanelShell id="performance" index={index} label={t.performancePM}>
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
