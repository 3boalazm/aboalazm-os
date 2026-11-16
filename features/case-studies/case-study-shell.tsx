"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { useCaseT } from "./ms/context";
import { Icon } from "@/components/ui/Icon";
import { PanelCard } from "@/components/ui/PanelCard";
import { joinClasses } from "@/lib/utils";
import type { Project } from "@/features/work/types";
import { BusinessCaseView } from "./business-case-view";
import { EVIDENCE_COPY } from "@/features/work/project-evidence";
import { evidenceOf } from "@/features/work/project-evidence";
import type { BusinessCaseData, CaseViewMode } from "./business-case.types";

export interface CaseStudyShellProps {
  technicalView: ReactNode;
  businessData: BusinessCaseData;
  project?: Project;
  fallbackName?: string;
  fallbackNameAr?: string;
  fallbackYear?: string;
  fallbackThumbnail?: string;
  footer?: ReactNode;
}

export function CaseStudyShell({
  technicalView,
  businessData,
  project,
  fallbackName,
  fallbackNameAr,
  fallbackYear,
  fallbackThumbnail,
  footer,
}: CaseStudyShellProps) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = useCaseT();
  const [mode, setMode] = useState<CaseViewMode>("technical");
  const evidence = project ? evidenceOf(project) : "client";
  const topBarRef = useRef<HTMLDivElement>(null);
  const techBtnRef = useRef<HTMLButtonElement>(null);
  const bizBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("view");
      if (requested === "business" || window.location.hash === "#business") {
        setMode("business");
      } else if (requested === "technical" || window.location.hash === "#technical") {
        setMode("technical");
      }
    } catch {
      /* URL parsing should never block client hydration */
    }
  }, []);

  const selectMode = useCallback((next: CaseViewMode, scrollToTop = false) => {
    setMode(next);
    try {
      const url = new URL(window.location.href);
      if (next === "business") {
        url.searchParams.set("view", "business");
      } else {
        url.searchParams.delete("view");
      }
      if (url.hash === "#business" || url.hash === "#technical") {
        url.hash = "";
      }
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    } catch {
      /* history.replaceState is optional enhancement */
    }

    if (scrollToTop && topBarRef.current) {
      topBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
      return;
    }
    event.preventDefault();
    let next: CaseViewMode;
    if (event.key === "Home") {
      next = "technical";
    } else if (event.key === "End") {
      next = "business";
    } else {
      next = mode === "technical" ? "business" : "technical";
    }
    selectMode(next, false);
    if (next === "technical") {
      techBtnRef.current?.focus();
    } else {
      bizBtnRef.current?.focus();
    }
  };

  return (
    <main className="flex flex-col pb-4">
      {/* ═══ TOP-OF-PAGE VIEW MODE TAB BAR ═══ */}
      <div
        id="case-study-tabs"
        ref={topBarRef}
        className="container-wide scroll-mt-28 pb-2 pt-1"
      >
        {/* Provenance line (P2 · point 11) — "client work", "studio build",
            "demo" — so the reader knows what kind of proof they are looking at
            before they read a single scroll of it. Derived from the project
            record, never hand-written per case. */}
        {project ? (
          <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            <span className="text-accent">{ar ? EVIDENCE_COPY[evidence].ar : t(EVIDENCE_COPY[evidence].en)}</span>
            <span aria-hidden className="mx-2 text-text-ghost">/</span>
            {ar ? EVIDENCE_COPY[evidence].note.ar : t(EVIDENCE_COPY[evidence].note.en)}
          </p>
        ) : null}
        <div className="flex flex-col gap-2.5 rounded-card border border-border-default bg-surface-1/90 p-2.5 backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-4 md:py-2.5">
          <div
            role="tablist"
            aria-label={ar ? "طريقة عرض المشروع" : t("Project view mode")}
            onKeyDown={onTabKeyDown}
            className="grid w-full grid-cols-2 gap-1 rounded-pill border border-border-subtle bg-surface-2/80 p-1 sm:inline-flex sm:w-fit"
          >
            <button
              ref={techBtnRef}
              id="tab-technical"
              type="button"
              role="tab"
              aria-selected={mode === "technical"}
              aria-controls="panel-technical"
              tabIndex={mode === "technical" ? 0 : -1}
              onClick={() => selectMode("technical")}
              className={joinClasses(
                "cursor-pointer inline-flex items-center justify-center gap-2 rounded-pill px-3.5 py-2 font-mono text-micro uppercase tracking-[0.06em] transition-colors duration-base ease-physics sm:px-4",
                mode === "technical"
                  ? "bg-accent font-semibold text-obsidian shadow-sm"
                  : "text-text-secondary hover:bg-surface-1/70 hover:text-text-primary",
              )}
            >
              <span className="hidden opacity-90 sm:inline">01</span>
              <span>{ar ? "دراسة الحالة التقنية" : t("Technical Case Study")}</span>
            </button>

            <button
              ref={bizBtnRef}
              id="tab-business"
              type="button"
              role="tab"
              aria-selected={mode === "business"}
              aria-controls="panel-business"
              tabIndex={mode === "business" ? 0 : -1}
              onClick={() => selectMode("business")}
              className={joinClasses(
                "cursor-pointer inline-flex items-center justify-center gap-2 rounded-pill px-3.5 py-2 font-mono text-micro uppercase tracking-[0.06em] transition-colors duration-base ease-physics sm:px-4",
                mode === "business"
                  ? "bg-accent font-semibold text-obsidian shadow-sm"
                  : "text-text-secondary hover:bg-surface-1/70 hover:text-text-primary",
              )}
            >
              <span className="hidden opacity-90 sm:inline">02</span>
              <span>{ar ? "الجانب التجاري والمزايا" : t("Business Overview")}</span>
            </button>
          </div>

          <p className="px-1 text-caption leading-[1.45] text-text-tertiary md:text-end">
            {mode === "technical"
              ? ar
                ? "البنية التقنية، وقواعد النظام، والقرارات الهندسية، والأدلة الموثّقة."
                : t("Architecture, system rules, decisions & documented evidence.")
              : ar
                ? "ما هو المشروع، وكيف يعمل في الاستخدام اليومي، وأهم مزاياه التجارية."
                : t("What the project is, how it works day-to-day & its key advantages.")}
          </p>
        </div>
      </div>

      {/* ═══ ACTIVE TAB PANEL ═══ */}
      {mode === "technical" ? (
        <div
          id="panel-technical"
          role="tabpanel"
          aria-labelledby="tab-technical"
        >
          {technicalView}
        </div>
      ) : (
        <div
          id="panel-business"
          role="tabpanel"
          aria-labelledby="tab-business"
        >
          <BusinessCaseView
            data={businessData}
            project={project}
            fallbackName={fallbackName}
            fallbackNameAr={fallbackNameAr}
            fallbackYear={fallbackYear}
            fallbackThumbnail={fallbackThumbnail}
            onSwitchToTechnical={() => selectMode("technical", true)}
          />
        </div>
      )}

      {/* ═══ BOTTOM PERSPECTIVE SWITCHER ═══ */}
      <div className="container-wide pt-4">
        <PanelCard className="flex flex-col items-start justify-between gap-4 rounded-card p-4 sm:flex-row sm:items-center md:px-6 md:py-5">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-micro uppercase tracking-[0.1em] text-accent">
              {mode === "technical"
                ? ar ? "زاوية القراءة الثانية · 02" : t("Switch Reading Lens · 02")
                : ar ? "زاوية القراءة الأولى · 01" : t("Switch Reading Lens · 01")}
            </span>
            <p className="text-body-sm font-medium text-text-primary">
              {mode === "technical"
                ? ar
                  ? "هل تريد قراءة شرح المشروع من الجانب التجاري: ما يفعله، وكيف يعمل، وأهم مزاياه العملية؟"
                  : t("Want the practical business breakdown—what this project does, how it runs, and its core advantages?")
                : ar
                  ? "هل تريد مراجعة البنية التقنية والقرارات الهندسية وتفاصيل بناء النظام؟"
                  : t("Want to inspect the system architecture, engineering decisions, and technical specifications?")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectMode(mode === "technical" ? "business" : "technical", true)}
            className="cursor-pointer inline-flex shrink-0 items-center gap-2 rounded-pill border border-border-default bg-surface-2 px-4 py-2.5 font-mono text-micro uppercase tracking-[0.08em] text-text-primary transition-colors duration-base ease-physics hover:border-accent hover:text-accent"
          >
            <span>
              {mode === "technical"
                ? ar ? "افتح الجانب التجاري والمزايا" : t("Open Business Overview")
                : ar ? "افتح دراسة الحالة التقنية" : t("Open Technical Case Study")}
            </span>
            <Icon name="arrow-right" />
          </button>
        </PanelCard>
      </div>

      {footer}
    </main>
  );
}
