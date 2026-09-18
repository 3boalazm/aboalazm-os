"use client";

/**
 * NATIVE DIAGRAM — renders the Writing section's flowcharts as styled
 * HTML/CSS (Lovable "Editorial Brand Systems" look) instead of Mermaid
 * SVG. It parses the SAME mermaid definitions stored in the database
 * (our diagrams use a constrained dialect: flowchart TD/LR, quoted
 * labels with <br/> subtitles, :::gov/tech/risk/sot classes, --> and
 * -.-> edges with optional |labels|, & fan-outs, classDef lines).
 *
 * Layout: nodes are ranked by longest path and rendered as vertical
 * levels; back-edges (cycles) become a dashed feedback bracket at the
 * bottom — exactly how the reference handled the Airbnb flywheel.
 * Colors come from the --node-* CSS tokens (globals.css), so diagrams
 * restyle with the theme for free. If parsing fails, the caller falls
 * back to the Mermaid renderer.
 */
import type { CSSProperties, ReactNode } from "react";
import { Fragment } from "react";

/* ------------------------------------------------------------------ */
/* Parser                                                              */
/* ------------------------------------------------------------------ */
export type NodeKind = "gov" | "tech" | "risk" | "sot" | "plain";
type DNode = { id: string; title: string; sub?: string; kind: NodeKind; shape: "rect" | "sot" | "decision" };
type DEdge = { from: string; to: string; label?: string; dashed: boolean };
export type ParsedDiagram = { nodes: Map<string, DNode>; edges: DEdge[]; direction: "TD" | "LR" };

function parseNodeToken(token: string, nodes: Map<string, DNode>): string | null {
  const t = token.trim();
  const idMatch = t.match(/^([A-Za-z0-9_]+)/);
  if (!idMatch) return null;
  const id = idMatch[1]!;
  let rest = t.slice(id.length);

  let shape: DNode["shape"] = "rect";
  let label = "";
  let kind: NodeKind = "plain";

  if (rest.startsWith('[("')) {
    shape = "sot";
    const end = rest.indexOf('")]');
    if (end === -1) return null;
    label = rest.slice(3, end);
    rest = rest.slice(end + 3);
  } else if (rest.startsWith('["')) {
    const end = rest.indexOf('"]');
    if (end === -1) return null;
    label = rest.slice(2, end);
    rest = rest.slice(end + 2);
  } else if (rest.startsWith('{"')) {
    shape = "decision";
    const end = rest.indexOf('"}');
    if (end === -1) return null;
    label = rest.slice(2, end);
    rest = rest.slice(end + 2);
  }

  const kindMatch = rest.match(/^:::(\w+)/);
  if (kindMatch) {
    const k = kindMatch[1]!;
    if (k === "gov" || k === "tech" || k === "risk" || k === "sot") kind = k;
  }

  if (label || !nodes.has(id)) {
    const [title, ...subParts] = label.split(/<br\s*\/?>/i);
    const existing = nodes.get(id);
    nodes.set(id, {
      id,
      title: (title || existing?.title || id).trim(),
      sub: subParts.join(" · ").trim() || existing?.sub,
      kind: kind !== "plain" ? kind : existing?.kind ?? "plain",
      shape: shape !== "rect" ? shape : existing?.shape ?? "rect",
    });
  } else if (kind !== "plain") {
    const existing = nodes.get(id)!;
    nodes.set(id, { ...existing, kind });
  }
  return id;
}

export function parseMermaid(code: string): ParsedDiagram | null {
  const nodes = new Map<string, DNode>();
  const edges: DEdge[] = [];
  let direction: "TD" | "LR" = "TD";

  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("classDef") && !l.startsWith("%%"));

  for (const line of lines) {
    const flow = line.match(/^flowchart\s+(TD|TB|LR|RL)/);
    if (flow) {
      direction = flow[1] === "LR" || flow[1] === "RL" ? "LR" : "TD";
      continue;
    }

    // Split the line on arrows, capturing arrow type + optional |label|
    const arrowRe = /\s*(-\.->|-->)\s*(?:\|"?([^|]*?)"?\|)?\s*/g;
    const segments: string[] = [];
    const arrows: { dashed: boolean; label?: string }[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = arrowRe.exec(line)) !== null) {
      segments.push(line.slice(last, m.index));
      arrows.push({ dashed: m[1] === "-.->", label: m[2]?.trim() || undefined });
      last = m.index + m[0].length;
    }
    segments.push(line.slice(last));

    if (arrows.length === 0) {
      // standalone node definition
      if (!parseNodeToken(line, nodes)) return null;
      continue;
    }

    // Each segment may fan out with & — but only split on & OUTSIDE
    // quoted labels ("Vision & Goals" must stay intact).
    const splitFanOut = (seg: string): string[] => {
      const parts: string[] = [];
      let buf = "";
      let inQuote = false;
      for (const ch of seg) {
        if (ch === '"') inQuote = !inQuote;
        if (ch === "&" && !inQuote) {
          parts.push(buf);
          buf = "";
        } else {
          buf += ch;
        }
      }
      parts.push(buf);
      return parts;
    };

    const groups: string[][] = [];
    for (const seg of segments) {
      const ids: string[] = [];
      for (const token of splitFanOut(seg)) {
        const id = parseNodeToken(token, nodes);
        if (!id) return null;
        ids.push(id);
      }
      groups.push(ids);
    }
    for (let i = 0; i < arrows.length; i++) {
      for (const from of groups[i]!) {
        for (const to of groups[i + 1]!) {
          edges.push({ from, to, label: arrows[i]!.label, dashed: arrows[i]!.dashed });
        }
      }
    }
  }

  if (nodes.size === 0 || edges.length === 0) return null;
  return { nodes, edges, direction };
}

/* ------------------------------------------------------------------ */
/* Layout: longest-path ranks; back edges become feedback loops        */
/* ------------------------------------------------------------------ */
function layout(d: ParsedDiagram) {
  const ids = [...d.nodes.keys()];
  const forward: DEdge[] = [];
  const loops: DEdge[] = [];

  // DFS back-edge detection (edge order = document order)
  const adj = new Map<string, DEdge[]>();
  for (const e of d.edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push(e);
  }
  const state = new Map<string, 0 | 1 | 2>();
  const visit = (id: string) => {
    state.set(id, 1);
    for (const e of adj.get(id) ?? []) {
      const s = state.get(e.to) ?? 0;
      if (s === 1) loops.push(e);
      else {
        forward.push(e);
        if (s === 0) visit(e.to);
      }
    }
    state.set(id, 2);
  };
  for (const id of ids) if ((state.get(id) ?? 0) === 0) visit(id);

  // Longest-path rank over forward edges
  const rank = new Map<string, number>();
  for (const id of ids) rank.set(id, 0);
  let changed = true;
  let guard = 0;
  while (changed && guard++ < 200) {
    changed = false;
    for (const e of forward) {
      const r = rank.get(e.from)! + 1;
      if (r > rank.get(e.to)!) {
        rank.set(e.to, r);
        changed = true;
      }
    }
  }

  const maxRank = Math.max(...rank.values());
  const levels: DNode[][] = [];
  for (let r = 0; r <= maxRank; r++) {
    levels.push(ids.filter((id) => rank.get(id) === r).map((id) => d.nodes.get(id)!));
  }

  // Connector labels between consecutive levels
  const connectors: { labels: string[]; dashed: boolean }[] = [];
  for (let r = 0; r < maxRank; r++) {
    const spanning = forward.filter((e) => rank.get(e.from)! <= r && rank.get(e.to)! > r);
    const labels = [...new Set(spanning.map((e) => e.label).filter((l): l is string => !!l))];
    connectors.push({ labels, dashed: spanning.length > 0 && spanning.every((e) => e.dashed) });
  }

  return { levels, connectors, loops };
}

/* ------------------------------------------------------------------ */
/* Rendering (Lovable node language)                                   */
/* ------------------------------------------------------------------ */
function kindStyle(kind: NodeKind): CSSProperties {
  if (kind === "plain") {
    return {
      background: "var(--color-surface-2, transparent)",
      borderColor: "var(--color-border-default)",
      color: "var(--color-text-primary)",
    };
  }
  return {
    background: `var(--node-${kind})`,
    borderColor: `var(--node-${kind}-border)`,
    color: `var(--node-${kind}-text)`,
  };
}

function Node({ node }: { node: DNode }) {
  const emphasis = node.shape === "sot" || node.kind === "sot";
  return (
    <div
      className={`border-2 px-4 py-3 text-center ${emphasis ? "shadow-[5px_5px_0_0_var(--node-sot-border)]" : ""} ${
        node.shape === "decision" ? "rounded-full px-6" : ""
      }`}
      style={kindStyle(node.kind)}
    >
      <div className={`font-display font-bold uppercase leading-tight ${emphasis ? "text-base md:text-lg" : "text-sm"}`}>
        {node.title}
      </div>
      {node.sub ? (
        <div className="mt-1 font-mono text-caption uppercase leading-snug tracking-wider opacity-80">{node.sub}</div>
      ) : null}
    </div>
  );
}

function Connector({ labels, dashed }: { labels: string[]; dashed: boolean }) {
  return (
    <div className="flex flex-col items-center py-1">
      {labels.length > 0 ? (
        <span className="mb-1 bg-surface-1 px-2 font-mono text-caption uppercase tracking-wider text-text-tertiary">
          {labels.join(" · ")}
        </span>
      ) : null}
      <div className={`h-6 w-px ${dashed ? "border-s border-dashed border-text-ghost" : "bg-text-ghost"}`} />
      <div className="-mt-1 text-sm leading-none text-text-tertiary">▼</div>
    </div>
  );
}

export function NativeDiagram({ parsed }: { parsed: ParsedDiagram }): ReactNode {
  const { levels, connectors, loops } = layout(parsed);
  const nodeCount = parsed.nodes.size;

  return (
    <div className="mx-auto w-full max-w-2xl" dir="ltr">
      {levels.map((level, r) => (
        <Fragment key={r}>
          <div className={`flex flex-wrap items-stretch justify-center gap-3 ${level.length > 3 ? "gap-2" : ""}`}>
            {level.map((node) => (
              <div key={node.id} className={nodeCount > 8 ? "min-w-[120px] flex-1 basis-[140px]" : "min-w-[160px]"}>
                <Node node={node} />
              </div>
            ))}
          </div>
          {r < levels.length - 1 ? <Connector labels={connectors[r]?.labels ?? []} dashed={connectors[r]?.dashed ?? false} /> : null}
        </Fragment>
      ))}

      {loops.map((loop, i) => {
        const from = parsed.nodes.get(loop.from);
        const to = parsed.nodes.get(loop.to);
        return (
          <div key={i} className="relative mx-auto mt-5 w-4/5 border-2 border-t-0 border-dashed border-text-ghost pb-4 pt-1">
            <div className="absolute -bottom-2.5 left-1/2 max-w-[92%] -translate-x-1/2 text-center [overflow-wrap:anywhere] bg-surface-1 px-2 font-mono text-caption uppercase tracking-wider text-text-tertiary">
              ⟲ {loop.label ?? "feedback"} · {from?.title} → {to?.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}
