"use client";
import { useT } from "@/hooks/use-t";

/**
 * TRACK SIDEBAR — the anchor line.
 * A sticky monospace rail that tracks reading position through the
 * four narrative panels. Two synchronized signals:
 *
 *   1. The PROGRESS SPINE — a 1px vertical line whose fill scales
 *      with overall scroll progress (one scrubbed ScrollTrigger,
 *      GSAP writes scaleY directly — no React re-renders).
 *   2. The STATION LIGHTS — each panel label ignites when its
 *      section crosses the activation band (per-panel ScrollTriggers
 *      toggling React state; cheap, four booleans).
 *
 * Clicking a station scrolls to its panel via native anchor — Lenis
 * intercepts and applies the house scroll physics automatically.
 */
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { PanelId } from "./types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface TrackSidebarProps {
  /** Ref to the scrolling article these panels live in */
  articleRef: React.RefObject<HTMLElement | null>;
  /** Stations in reading order (from `panelsFor`) */
  panels: readonly { id: PanelId; index: string }[];
}

const LABEL = {
  overview: "csOverview",
  challenge: "csChallenge",
  idea: "csIdea",
  applications: "csInUse",
  system: "csSystem",
  outcome: "csOutcome",
} as const;

export function TrackSidebar({ articleRef, panels }: TrackSidebarProps) {
  const spineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<PanelId>("overview");
  const t = useT();

  useGSAP(
    () => {
      const article = articleRef.current;
      const spine = spineRef.current;
      if (!article || !spine) return;

      /* Progress spine — scrubbed, writes transform directly */
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: article,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 0.6, // slight lag = the spine has mass
          },
        },
      );

      /* Station lights — one trigger per panel */
      panels.forEach((panel) => {
        const el = article.querySelector<HTMLElement>(`#${panel.id}`);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(panel.id),
        });
      });
    },
    { dependencies: [articleRef, panels.length] },
  );

  return (
    <aside className="sticky top-16 hidden h-fit lg:block">
      <div className="relative flex gap-3">
        {/* Spine: track + animated fill */}
        <div className="relative w-px self-stretch bg-border-subtle">
          <div
            ref={spineRef}
            className="absolute inset-0 origin-top bg-accent"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        {/* Stations */}
        <nav aria-label={t.caseStudySections} className="flex flex-col gap-4 py-1">
          {panels.map((panel) => {
            const isActive = active === panel.id;
            return (
              <a
                key={panel.id}
                href={`#${panel.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-baseline gap-2"
              >
                <span
                  className={[
                    "font-mono text-micro tabular-nums transition-colors duration-base ease-physics",
                    isActive ? "text-accent" : "text-text-ghost",
                  ].join(" ")}
                >
                  {panel.index}
                </span>
                <span
                  className={[
                    "font-mono text-micro uppercase tracking-[0.10em]",
                    "transition-[color,transform] duration-base ease-physics",
                    isActive
                      ? "translate-x-0.5 text-text-primary"
                      : "text-text-tertiary group-hover:text-text-secondary",
                  ].join(" ")}
                >
                  {t[LABEL[panel.id]]}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
