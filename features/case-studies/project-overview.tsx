"use client";

import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import type { Project } from "@/features/work/types";
import { ProductCase } from "./product-case";
import { OVERVIEW_TECHNICAL_CASES } from "./overview-technical.data";

/**
 * Technical / system view for project-overview slugs.
 * Uses the structured `OVERVIEW_TECHNICAL_CASES` specification when available,
 * with a clean fallback for any future CMS-added overview record.
 */
export function ProjectOverview({ project }: { project: Project }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const spec = OVERVIEW_TECHNICAL_CASES[project.slug];

  if (spec) {
    return <ProductCase {...spec} />;
  }

  return (
    <div className="container-content flex flex-col gap-4 pb-6 pt-2">
      <div className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
        <Link href="/work" className="transition-colors hover:text-text-primary">
          ← {ar ? "كل الأعمال" : "All work"}
        </Link>
      </div>
      <header className="flex flex-col gap-2">
        <p className="font-mono text-micro text-accent">
          {ar ? "نظرة تقنية على المشروع" : "PROJECT OVERVIEW"} · {project.year}
        </p>
        <h1 className="font-display text-title">
          {ar ? project.nameAr ?? project.name : project.name}
        </h1>
        <p className="max-w-[65ch] text-body text-text-secondary">
          {ar ? project.outcomeAr ?? project.outcome : project.outcome}
        </p>
      </header>
      <Image
        src={project.thumbnail}
        alt={ar ? `عرض مشروع ${project.nameAr ?? project.name}` : `${project.name} project preview`}
        width={1280}
        height={800}
        className="h-auto w-full rounded-card border border-border-default"
        priority
      />
      <p className="text-body-sm text-text-secondary">
        {ar
          ? "الصور توضح اتجاه التصميم والمخرجات المعروضة. لا تُعرض هنا نتائج تجارية مقاسة."
          : "The images show the design direction and presented deliverables. No measured business outcome is claimed here."}
      </p>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded-pill border border-border-default px-3 py-1.5 text-body-sm hover:border-border-strong"
        >
          {ar ? "افتح الموقع" : "Open website"} ↗
        </a>
      ) : (
        <p className="text-caption text-text-tertiary">
          {ar
            ? "المعاينة العامة غير متاحة حاليًا؛ العرض المحفوظ متاح بالأعلى."
            : "A public live preview is currently unavailable; the saved visual is shown above."}
        </p>
      )}
    </div>
  );
}
