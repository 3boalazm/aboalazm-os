"use client";

/**
 * SCROLLY CASE STUDY — composition root.
 * Layout: [sticky TrackSidebar | scrolling article of four panels].
 * Route-level ambient glow: the record's accent tints the whole
 * page for the duration of the read (useAmbientGlow contract).
 * Panel entrances: one ScrollTrigger.batch over [data-panel] —
 * each panel rises 24px and unblurs on the house physics curve.
 */
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { GSAP_DEFAULTS, SCROLL_TRIGGER_DEFAULTS } from "@/lib/motion";
import { TrackSidebar } from "./track-sidebar";
import {
  ContextPanel,
  ResearchPanel,
  ExecutionPanel,
  PerformancePanel,
} from "./panels";
import type { CaseStudyRecord } from "./types";
import type { ReactNode } from "react";
import { useT } from "@/hooks/use-t";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollyCaseStudy({
  record,
  gallery,
}: {
  record: CaseStudyRecord;
  gallery?: ReactNode;
}) {
  const articleRef = useRef<HTMLElement>(null);

  /* The page atmosphere belongs to this record while it's open */
  useAmbientGlow(record.accent, 0.6);
  const t = useT();

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      panels.forEach((panel) => {
        gsap.from(panel, {
          y: 24,
          autoAlpha: 0,
          filter: "blur(6px)",
          duration: 0.7,
          ease: GSAP_DEFAULTS.ease, // expo.out — core-library match for ease-physics
          scrollTrigger: { trigger: panel, ...SCROLL_TRIGGER_DEFAULTS },
        });
      });
    },
    { scope: articleRef },
  );

  return (
    <div className="container-wide grid gap-8 py-16 lg:grid-cols-[16rem_1fr]">
      <TrackSidebar articleRef={articleRef} />
      <article ref={articleRef} className="flex min-w-0 flex-col">
        <header className="flex flex-col gap-2 pb-8">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
            {t.caseFile} // {record.slug.toUpperCase()}
          </p>
          <h1 className="font-display text-display tracking-[-0.025em]">
            {record.name}
          </h1>
        </header>
        <ContextPanel record={record} />
        <ResearchPanel record={record} />
        <ExecutionPanel record={record} />
        {gallery && (
          <section data-panel className="flex scroll-mt-16 flex-col gap-4 border-t border-border-subtle py-8">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {t.galleryRendered}
            </p>
            {gallery}
          </section>
        )}
        <PerformancePanel record={record} />
      </article>
    </div>
  );
}
