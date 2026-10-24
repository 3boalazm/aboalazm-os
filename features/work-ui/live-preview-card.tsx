"use client";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { useAmbientGlowControls } from "@/hooks/use-ambient-glow";
import type { Project } from "@/features/work/types";

/** Stable first-party screenshots: external frame policies cannot break the gallery. */
export function LivePreviewCard({ project }: { project: Project }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const { engage, release } = useAmbientGlowControls();
  return <article onPointerEnter={() => engage(project.accent, 0.6)} onPointerLeave={release} className="overflow-hidden rounded-card border border-border-default bg-surface-1">
    <Link href={`/case-studies/${project.slug}`} className="block">
      <Image src={project.thumbnail} alt={ar ? `واجهة ${project.nameAr ?? project.name}` : `${project.name} interface`} width={1280} height={800} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="aspect-[16/10] w-full object-cover" />
      <h2 className="px-3 pt-3 font-display font-display-sm text-subtitle">{ar ? project.nameAr ?? project.name : project.name}</h2>
    </Link>
    <p className="px-3 pt-1 text-body-sm text-text-secondary">{ar ? project.outcomeAr ?? project.outcome : project.outcome}</p>
    <div className="flex flex-wrap gap-3 p-3 text-body-sm"><Link href={`/case-studies/${project.slug}`} className="text-accent underline underline-offset-4">{ar ? "تفاصيل المشروع" : "Project details"} →</Link>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{ar ? "افتح المعاينة" : "Open preview"} ↗</a>}</div>
  </article>;
}
