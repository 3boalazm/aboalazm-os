"use client";
import Image from "next/image";
import { useLang } from "@/components/providers/lang-provider";
import type { Project } from "@/features/work/types";
import { ProjectEnquiry } from "@/features/contact/project-enquiry";

/** A visual overview, without inventing a client brief, role or measured result. */
export function ProjectOverview({ project }: { project: Project }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  return <main className="container-content flex flex-col gap-4 pb-6">
    <header className="flex flex-col gap-2"><p className="font-mono text-micro text-accent">{ar ? "نظرة على المشروع" : "PROJECT OVERVIEW"} · {project.year}</p><h1 className="font-display text-title">{ar ? project.nameAr ?? project.name : project.name}</h1><p className="max-w-[65ch] text-body text-text-secondary">{ar ? project.outcomeAr ?? project.outcome : project.outcome}</p></header>
    <Image src={project.thumbnail} alt={ar ? `عرض مشروع ${project.nameAr ?? project.name}` : `${project.name} project preview`} width={1280} height={800} className="h-auto w-full rounded-card border border-border-default" priority />
    <p className="text-body-sm text-text-secondary">{ar ? "الصور توضح اتجاه التصميم والمخرجات المعروضة. لا تُعرض هنا نتائج تجارية مقاسة." : "The images show the design direction and presented deliverables. No measured business outcome is claimed here."}</p>
    {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-fit rounded-pill border border-border-default px-3 py-1.5 text-body-sm">{ar ? "افتح الموقع" : "Open website"} ↗</a> : <p className="text-caption text-text-tertiary">{ar ? "المعاينة العامة غير متاحة حاليًا؛ العرض المحفوظ متاح بالأعلى." : "A public live preview is currently unavailable; the saved visual is shown above."}</p>}
    <ProjectEnquiry service={project.category === "design" ? "brand-identity" : "website"} />
  </main>;
}
