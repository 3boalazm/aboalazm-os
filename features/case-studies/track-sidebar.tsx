"use client";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/hooks/use-t";
import type { PanelId } from "./types";

const LABEL = { overview: "csOverview", challenge: "csChallenge", idea: "csIdea", applications: "csInUse", system: "csSystem", outcome: "csOutcome" } as const;
export function TrackSidebar({ articleRef, panels }: { articleRef: React.RefObject<HTMLElement | null>; panels: readonly { id: PanelId; index: string }[] }) {
  const [active, setActive] = useState<PanelId>("overview");
  const spine = useRef<HTMLDivElement>(null);
  const t = useT();
  const ids = panels.map((p) => p.id).join(",");
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: PanelId = "overview";
      for (const id of ids.split(",") as PanelId[]) {
        const panel = article.querySelector<HTMLElement>(`#${id}`);
        if (panel && panel.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      }
      setActive(current);
      const bounds = article.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.35 - bounds.top) / Math.max(1, bounds.height - window.innerHeight * 0.35)));
      if (spine.current) spine.current.style.transform = `scaleY(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [articleRef, ids]);
  return <aside className="sticky top-16 hidden h-fit lg:block"><div className="relative flex gap-3"><div className="relative w-px self-stretch bg-border-subtle"><div ref={spine} className="absolute inset-0 origin-top bg-accent" style={{ transform: "scaleY(0)" }} /></div><nav aria-label={t.caseStudySections} className="flex flex-col gap-3 py-1">{panels.map((p) => <a key={p.id} href={`#${p.id}`} aria-current={active === p.id ? "location" : undefined} className={`flex min-h-3 items-center gap-2 font-mono text-micro ${active === p.id ? "text-accent" : "text-text-tertiary hover:text-text-primary"}`}><span aria-hidden>{p.index}</span><span>{t[LABEL[p.id]]}</span></a>)}</nav></div></aside>;
}
