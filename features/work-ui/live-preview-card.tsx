"use client";
import { useEffect, useRef } from "react";
import { useAmbientGlowControls } from "@/hooks/use-ambient-glow";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/features/work/types";
import { MediaCard } from "@/components/ui/MediaCard";

/**
 * LIVE PREVIEW CARD — a real, currently-live site rendered at its actual
 * desktop width (1440px) inside a fake browser chrome, then scaled down to
 * fit the card: the iframe is fixed at 1440×900 and a ResizeObserver on its
 * frame keeps `--preview-scale` (frame width / 1440) current, so the
 * miniature reflows responsively with the grid. (`scale(calc(100cqw / 1440))`
 * is an invalid declaration — a length divided by a number is still a
 * length — hence the JS-driven variable.)
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
  const frameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const setScale = (width: number) => el.style.setProperty("--preview-scale", String(width / 1440));
    setScale(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => entry && setScale(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
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
    <MediaCard
      as="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onPointerEnter={() => engage(project.accent, 0.6)}
      onPointerLeave={release}
      surface="surface-0"
      className="block transition-colors duration-base ease-physics hover:border-border-strong"
    >
      {/* Fake browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border-subtle bg-surface-1 px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-text-ghost/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-text-ghost/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-text-ghost/40" />
        <span className="ml-1.5 truncate rounded-pill bg-surface-0 px-1.5 py-0.5 font-mono text-micro text-text-tertiary">
          {host}
        </span>
        <span className="ms-auto flex items-center gap-1 font-mono text-micro uppercase tracking-[0.08em] text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Live
        </span>
      </div>

      {/* Scaled live preview */}
      <div ref={frameRef} className="relative aspect-[16/10] w-full overflow-hidden bg-surface-0">
        <iframe
          src={url}
          title={`${project.name} — live preview`}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: 1440, height: 900, transform: "scale(var(--preview-scale, 0.25))" }}
        />
        {/* Hover scrim */}
        <div className="absolute inset-0 flex items-center justify-center bg-surface-0/0 opacity-0 transition-all duration-base ease-physics group-hover:bg-surface-0/50 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1 rounded-pill border border-border-strong bg-surface-0 px-2 py-1 font-mono text-micro uppercase tracking-[0.08em] text-text-primary">
            View Live <Icon name="arrow-up-right" size="0.9em" />
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
    </MediaCard>
  );
}
