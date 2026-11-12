import Link from "next/link";
import type { ReactNode } from "react";
import type { Probe, ProbeState } from "@/lib/studio/metrics";

/* ═══════════════════════════════════════════════════════════════════════════
   STUDIO UI — the small, shared vocabulary the console is assembled from.

   Kept in one module on purpose: this dashboard is a deliberately narrow,
   single-purpose surface (9 tiles, 4 screens). Extracting a component library
   for it would be the exact "30 admin pages that repeat the same data"
   failure the plan warns about, one abstraction at a time.

   The one rule encoded here rather than left to discipline:
   `<Provenance>` is REQUIRED on every numeric tile. A tile that renders a
   number without saying what it counts and when is a bug you can see.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── icons: inline, 24×24, stroke 1.6, currentColor. No icon dependency. ── */
const PATHS = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  inbox: "M4 13h4l1.5 2.5h5L16 13h4M5.5 5h13l2 8v4a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2v-4l2-8Z",
  column: "M4 4h4.5v16H4zM9.75 4h4.5v11h-4.5zM15.5 4H20v7h-4.5z",
  layers: "m12 3 9 5-9 5-9-5 9-5ZM3.5 12.5 12 17l8.5-4.5M3.5 16.5 12 21l8.5-4.5",
  pulse: "M2.5 12h4l2-5 3.5 10 2.5-5h7",
  arrowUp: "M12 19V5M6 11l6-6 6 6",
  arrowDown: "M12 5v14M18 13l-6 6-6-6",
  arrowRight: "M4 12h15M13 6l6 6-6 6",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  check: "m5 12.5 4.5 4.5L19 7",
  alert: "M12 4 2.8 20h18.4L12 4ZM12 10v4M12 17.2h.01",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01",
  x: "M6 6l12 12M18 6 6 18",
  minus: "M5 12h14",
  database: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  image: "M4 5h16v14H4zM8.5 9.5h.01M4.5 17l5-5 3 3 2.5-2.5 4.5 4.5",
  mail: "M3 6h18v12H3zM3.5 6.5 12 13l8.5-6.5",
  activity: "M3 12h3.5l2-6 3 12 2.5-6H21",
  refresh: "M20 11a8 8 0 1 0-2.2 6M20 5v6h-6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2",
  menu: "M4 7h16M4 12h16M4 17h16",
  external: "M14 4h6v6M20 4l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4",
  sparkle: "M12 3.5 13.8 9l5.5 1.8L13.8 12.6 12 18l-1.8-5.4L4.7 10.8 10.2 9 12 3.5Z",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  bolt: "M13 2 4.5 13.5H11L9.5 22 19 10.5h-6.5L13 2Z",
  chart: "M4 20V10M10 20V4M16 20v-8M2 20h20",
  sliders: "M5 7h9M18 7h1M5 17h3M12 17h7M8 4v6M15 14v6",
  search: "M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM20 20l-3.8-3.8",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z",
  grip: "M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01",
  send: "M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z",
} as const;

export type StudioIconName = keyof typeof PATHS;

export function SIcon({ name, className = "studio-ico", size }: { name: StudioIconName; className?: string; size?: number }) {
  return (
    <svg
      aria-hidden
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/* ── tile ─────────────────────────────────────────────────────────────────── */
export function Tile({
  span = "w6",
  title,
  aside,
  provenance,
  variant,
  children,
  className = "",
  as = "section",
}: {
  span?: "w12" | "w8" | "w7" | "w6" | "w5" | "w4" | "w3";
  title?: ReactNode;
  aside?: ReactNode;
  /** REQUIRED for any tile containing a number. Ignored only for layout tiles. */
  provenance?: ReactNode;
  variant?: "accent" | "invert" | "flush" | "aurora";
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div";
}) {
  const Tag = as;
  return (
    <Tag className={`studio-tile studio-${span} ${variant ? `studio-tile--${variant}` : ""} ${className}`}>
      {title || aside ? (
        <div className="studio-tile__head">
          {title ? <h2>{title}</h2> : null}
          <span className="studio-spacer" />
          {aside}
        </div>
      ) : null}
      {children}
      {provenance ? <Provenance>{provenance}</Provenance> : null}
    </Tag>
  );
}

/**
 * The provenance line. Renders the *definition* of the number and the moment
 * it was read — the two facts that turn a figure into a claim you can audit.
 */
export function Provenance({ children }: { children: ReactNode }) {
  return (
    <p className="studio-provenance">
      <SIcon name="info" />
      <span>{children}</span>
    </p>
  );
}

/* ── chips ────────────────────────────────────────────────────────────────── */
export type ChipTone = "neutral" | "ok" | "warn" | "danger" | "info" | "accent";

export function Chip({
  tone = "neutral",
  dot,
  live,
  icon,
  children,
}: {
  tone?: ChipTone;
  dot?: boolean;
  live?: boolean;
  icon?: StudioIconName;
  children: ReactNode;
}) {
  const cls = [
    "studio-chip",
    tone !== "neutral" ? `studio-chip--${tone}` : "",
    dot ? "studio-chip--dot" : "",
    live ? "studio-chip--live" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls}>
      {icon ? <SIcon name={icon} /> : null}
      {children}
    </span>
  );
}

/* ── stage vocabulary — one source, so labels never drift from the enum ───── */
export const STAGES = [
  { key: "new", label: "New", short: "New", tone: "info" as ChipTone },
  { key: "qualified", label: "Qualified", short: "Qual", tone: "neutral" as ChipTone },
  { key: "proposal-sent", label: "Proposal sent", short: "Proposal", tone: "warn" as ChipTone },
  { key: "won", label: "Won", short: "Won", tone: "ok" as ChipTone },
  { key: "lost", label: "Lost", short: "Lost", tone: "danger" as ChipTone },
  { key: "not-a-fit", label: "Not a fit", short: "No fit", tone: "danger" as ChipTone },
] as const;

export function stageMeta(key?: string | null) {
  return STAGES.find((s) => s.key === key) ?? STAGES[0];
}

/* ── the honest delta ─────────────────────────────────────────────────────── */
/**
 * Renders a change against the previous window. When there is no comparable
 * previous window it says so instead of printing "+100%" or a dash that reads
 * as zero.
 */
export function Delta({ pct, suffix = "vs previous" }: { pct: number | null; suffix?: string }) {
  if (pct == null) {
    return (
      <Chip icon="minus" tone="neutral">
        no prior window
      </Chip>
    );
  }
  const up = pct > 0;
  const flat = pct === 0;
  return (
    <span className="studio-row__meta" style={{ gap: 4 }}>
      <Chip tone={flat ? "neutral" : up ? "ok" : "danger"} icon={flat ? "minus" : up ? "arrowUp" : "arrowDown"}>
        {up ? "+" : ""}
        {pct}%
      </Chip>
      <span className="studio-tiny">{suffix}</span>
    </span>
  );
}

/* ── status chips for probes ─────────────────────────────────────────────── */
const PROBE_TONE: Record<ProbeState, ChipTone> = { ok: "ok", warn: "warn", fail: "danger", unconfigured: "neutral" };
const PROBE_ICON: Record<ProbeState, StudioIconName> = { ok: "check", warn: "alert", fail: "x", unconfigured: "minus" };

export function probeTone(state: ProbeState) {
  return PROBE_TONE[state];
}

export function ProbeRow({ probe }: { probe: Probe }) {
  return (
    <div className="studio-probe">
      <SIcon name={PROBE_ICON[probe.state]} className="studio-probe__ico" {...{ "data-state": probe.state }} />
      <div style={{ minWidth: 0 }}>
        <span className="studio-probe__name">{probe.name}</span>
        <p className="studio-probe__detail">{probe.detail}</p>
        {probe.fix ? <p className="studio-probe__fix">Fix: {probe.fix}</p> : null}
      </div>
      <span className="studio-probe__when">
        <time dateTime={probe.checkedAt}>{shortTime(probe.checkedAt)}</time>
      </span>
    </div>
  );
}

/* ── formatting ───────────────────────────────────────────────────────────── */
export function num(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function usd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function shortTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
}

/** "3 h ago" / "2 d ago" — for inbox freshness, never for a metric's asOf. */
export function ago(iso?: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return `${Math.round(days / 30)} mo ago`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]! : "";
  return (first[0]! + (last[0] ?? "")).toUpperCase();
}

/* ── empty state ──────────────────────────────────────────────────────────── */
export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="studio-empty-state">
      <strong>{title}</strong>
      <p>{body}</p>
      {action ? <div style={{ marginBlockStart: 10 }}>{action}</div> : null}
    </div>
  );
}

/* ── range control ────────────────────────────────────────────────────────── */
export function RangeControl({ current, basePath, extraQuery }: { current: string; basePath: string; extraQuery?: string }) {
  const suffix = extraQuery ? `&${extraQuery}` : "";
  return (
    <nav className="studio-range" aria-label="Reporting window">
      {[
        { key: "7", label: "7d", full: "7 days" },
        { key: "28", label: "28d", full: "28 days" },
        { key: "90", label: "90d", full: "90 days" },
      ].map((r) => (
        <Link key={r.key} href={`${basePath}?range=${r.key}${suffix}`} aria-current={current === r.key ? "true" : undefined} title={r.full}>
          {r.label}
        </Link>
      ))}
    </nav>
  );
}

/* ── charts: dependency-free SVG, drawn from real series ─────────────────── */

/**
 * Daily area chart: filled pageviews + a sessions line. Shapes only inside
 * the SVG (so preserveAspectRatio cannot distort text); axis labels are
 * HTML underneath. An all-zero series renders a flat baseline, never a
 * fake curve.
 */
export function AreaChart({
  points,
  height = 132,
}: {
  points: { label: string; pageviews: number; sessions: number }[];
  height?: number;
}) {
  const W = 640;
  const H = 160;
  const max = Math.max(1, ...points.map((p) => p.pageviews), ...points.map((p) => p.sessions));
  const x = (i: number) => (points.length <= 1 ? W / 2 : (i / (points.length - 1)) * W);
  const y = (v: number) => H - 6 - (v / max) * (H - 18);
  const line = (pick: (p: { pageviews: number; sessions: number }) => number) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(pick(p)).toFixed(1)}`).join(" ");
  const area = `${line((p) => p.pageviews)} L${x(points.length - 1).toFixed(1)},${H} L0,${H} Z`;
  const mid = points[Math.floor(points.length / 2)];

  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} preserveAspectRatio="none" role="img" aria-label="Daily pageviews and sessions">
        <defs>
          <linearGradient id="studio-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--s-accent)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--s-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#studio-area-fill)" />
        <path d={line((p) => p.pageviews)} fill="none" stroke="var(--s-accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={line((p) => p.sessions)} fill="none" stroke="var(--s-info)" strokeWidth="1.6" strokeDasharray="1 0" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
      </svg>
      <figcaption style={{ display: "flex", justifyContent: "space-between", marginBlockStart: 4 }}>
        <span className="studio-tiny">{points[0]?.label}</span>
        <span className="studio-tiny" style={{ display: "flex", gap: 12 }}>
          <span>
            <span style={{ color: "var(--s-accent)" }}>●</span> pageviews
          </span>
          <span>
            <span style={{ color: "var(--s-info)" }}>●</span> sessions
          </span>
        </span>
        <span className="studio-tiny">{mid?.label}</span>
        <span className="studio-tiny">{points[points.length - 1]?.label}</span>
      </figcaption>
    </figure>
  );
}

/** Tiny inline trend for KPI tiles. Renders a flat line for empty data. */
export function Sparkline({ values, width = 96, height = 28 }: { values: number[]; width?: number; height?: number }) {
  const max = Math.max(1, ...values);
  const pts = values
    .map((v, i) => `${values.length <= 1 ? width / 2 : (i / (values.length - 1)) * width},${height - 3 - (v / max) * (height - 8)}`)
    .join(" ");
  return (
    <svg width={width} height={height} aria-hidden style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke="var(--s-accent)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ── skeleton ─────────────────────────────────────────────────────────────── */
/** Loading placeholder shaped like the tile it replaces. */
export function Skeleton({ height = 18, width = "100%", radius = 8, style }: { height?: number; width?: number | string; radius?: number; style?: React.CSSProperties }) {
  return <span className="studio-skel" style={{ display: "block", height, width, borderRadius: radius, ...style }} aria-hidden />;
}

/* ── page header ──────────────────────────────────────────────────────────── */
export function ViewHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <header className="studio-view__head" style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", paddingInline: 4 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p className="studio-up" style={{ margin: "0 0 3px" }}>
          {eyebrow}
        </p>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 650, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{title}</h1>
        <p className="studio-sub" style={{ marginBlockStart: 4, maxWidth: "72ch" }}>
          {description}
        </p>
      </div>
      {aside}
    </header>
  );
}
