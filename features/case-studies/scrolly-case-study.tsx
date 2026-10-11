"use client";
import { useLang } from "@/components/providers/lang-provider";

/**
 * SCROLLY CASE STUDY — composition root.
 * Layout: [sticky TrackSidebar | scrolling article of panels].
 * Reading order: the work first (overview, in use), then the thinking and the
 * system, then the outcome — see `panelsFor`.
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
  OverviewPanel,
  ChallengePanel,
  IdeaPanel,
  ApplicationsPanel,
  SystemPanel,
  OutcomePanel,
} from "./panels";
import { panelsFor, type CaseStudyRecord } from "./types";
import type { GalleryItem } from "./case-gallery";
import type { ReactNode } from "react";
import { useT } from "@/hooks/use-t";
import { Heading } from "@/components/ui/Heading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollyCaseStudy({
  record,
  gallery = [],
  brandBook,
}: {
  record: CaseStudyRecord;
  /** Project imagery; items tagged `kind: "slide"` are pages of the guidelines document */
  gallery?: readonly GalleryItem[];
  /** The full guidelines document, rendered inside the System panel in place of the generic token/guideline pages */
  brandBook?: ReactNode;
}) {
  const articleRef = useRef<HTMLElement>(null);

  /* The page atmosphere belongs to this record while it's open */
  useAmbientGlow(record.accent, 0.6);
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";

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

  // First in-use image is the hero; the rest fill the "In use" panel. The
  // document's own pages go to the System panel (or are dropped when the full
  // brand book is shown, which already contains them).
  const inUse = gallery.filter((g) => g.kind !== "slide");
  const slides = brandBook ? [] : gallery.filter((g) => g.kind === "slide");
  const hero = inUse[0];
  const appItems = inUse.slice(1);
  const hasApplications = appItems.length > 0 || !!record.narrativeAnswers?.whereUsed;
  const panels = panelsFor({ applications: hasApplications });
  const idx = (id: string) => panels.find((p) => p.id === id)!.index;

  return (
    <div className="container-wide grid gap-8 py-16 lg:grid-cols-[16rem_1fr]">
      <TrackSidebar articleRef={articleRef} panels={panels} />
      <article ref={articleRef} className="flex min-w-0 flex-col">
        <header className="flex flex-col gap-2 pb-8">
          <Heading
            eyebrow={<>{t.caseFile} // {record.slug.toUpperCase()}</>}
            title={record.name}
          />
        </header>
        <OverviewPanel record={record} index={idx("overview")} hero={hero} />
        <ChallengePanel record={record} index={idx("challenge")} />
        <IdeaPanel record={record} index={idx("idea")} />
        {hasApplications && <ApplicationsPanel record={record} index={idx("applications")} items={appItems} />}
        <SystemPanel record={record} index={idx("system")} slides={slides} brandBook={brandBook} shown={inUse.map((g) => g.src)} />
        <OutcomePanel record={record} index={idx("outcome")} />
      </article>
    </div>
  );
}
