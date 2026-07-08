"use client";
import { useAmbientGlowControls } from "@/hooks/use-ambient-glow";
import type { Project } from "@/features/work/types";

/**
 * LIVE PREVIEW CARD — a real, currently-live site rendered at its actual
 * desktop width (1440px) inside a fake browser chrome, then scaled down to
 * fit the card via a pure-CSS container-query trick (no JS/ResizeObserver
 * needed): the iframe is fixed at 1440×900, its parent has
 * `container-type: inline-size`, and `scale(100cqw / 1440)` does the rest —
 * the miniature reflows responsively with the grid.
 *
 * ⚠️ KNOWN LIMITATION: some sites send `X-Frame-Options: DENY` (or an
 * equivalent CSP), which blocks embedding entirely — the frame just stays
 * blank. There's no reliable way to detect that from the parent page and
 * swap in a fallback image. The card still works either way: the whole
 * thing is a real link to `liveUrl`, so "Open Live" always works even if
 * the preview itself doesn't render.
 */
export function LivePreviewCard({ project }: { project: Project }) {
  const { engage, release } = useAmbientGlowControls();
  const url = project.liveUrl!;
  let host = url;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // Relative path (e.g. a locally-hosted static mockup under /public) —
    // new URL() can't parse it without an origin. Show a clean label
    // instead of dumping the raw path into the fake address bar.
    host = "Local Preview";
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onPointerEnter={() => engage(project.accent, 0.6)}
      onPointerLeave={release}
      className="group block overflow-hidden rounded-card border border-border-subtle bg-surface-0 transition-colors duration-base ease-physics hover:border-border-strong"
    >
      {/* Fake browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border-subtle bg-surface-1 px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-text-ghost/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-text-ghost/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-text-ghost/40" />
        <span className="ml-1.5 truncate rounded-pill bg-obsidian px-1.5 py-0.5 font-mono text-micro text-text-tertiary">
          {host}
        </span>
        <span className="ms-auto flex items-center gap-1 font-mono text-micro uppercase tracking-[0.08em] text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Live
        </span>
      </div>

      {/* Scaled live preview */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-obsidian" style={{ containerType: "inline-size" }}>
        <iframe
          src={url}
          title={`${project.name} — live preview`}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: 1440, height: 900, transform: "scale(calc(100cqw / 1440))" }}
        />
        {/* Hover scrim */}
        <div className="absolute inset-0 flex items-center justify-center bg-obsidian/0 opacity-0 transition-all duration-base ease-physics group-hover:bg-obsidian/50 group-hover:opacity-100">
          <span className="rounded-pill border border-border-strong bg-obsidian px-2 py-1 font-mono text-micro uppercase tracking-[0.08em] text-text-primary">
            View Live ↗
          </span>
        </div>
      </div>

      {/* Caption */}
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <span className="truncate font-display text-body leading-tight text-text-primary">{project.name}</span>
        <span className="shrink-0 font-mono text-micro uppercase tracking-[0.06em] text-text-tertiary">
          {project.discipline}
        </span>
      </div>
    </a>
  );
}
