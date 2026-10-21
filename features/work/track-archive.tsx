"use client";

/**
 * TRACK ARCHIVE — Dedicated full-archive view for each portfolio track:
 *   - /work/design       -> all Brand Identity & Visual Systems projects (8)
 *   - /work/development  -> all Digital Products & Engineering projects (14)
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { GalleryView } from "@/features/gallery";
import type { GalleryImage, GalleryProject } from "@/lib/gallery";
import { joinClasses } from "@/lib/utils";
import { FeaturedCard } from "./featured-cases";
import type { Project, ProjectCategory } from "./types";

type SubFilter = "all" | "case-studies" | "wall";

const DESIGN_MOOD = {
  primary: "rgb(255 107 71 / 0.12)",
  secondary: "rgb(139 92 246 / 0.08)",
} as const;

const DEV_MOOD = {
  primary: "rgb(34 211 238 / 0.11)",
  secondary: "rgb(139 92 246 / 0.09)",
} as const;

interface TrackArchiveProps {
  track: ProjectCategory;
  projects: readonly Project[];
  siblingCount: number;
  galleryProjects?: readonly GalleryProject[];
  galleryImages?: readonly GalleryImage[];
}

export function TrackArchive({
  track,
  projects,
  siblingCount,
  galleryProjects = [],
  galleryImages = [],
}: TrackArchiveProps) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const isDev = track === "development";
  useAmbientGlow(isDev ? DEV_MOOD : DESIGN_MOOD, 0.4);

  const [subFilter, setSubFilter] = useState<SubFilter>("all");

  const caseStudyProjects = useMemo(
    () => projects.filter((p) => p.hasCaseStudy),
    [projects],
  );

  const visibleProjects = subFilter === "case-studies" ? caseStudyProjects : projects;
  const designCount = isDev ? siblingCount : projects.length;
  const devCount = isDev ? projects.length : siblingCount;
  const hasBrandWall = !isDev && galleryImages.length > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Header + Breadcrumb + Track Switcher */}
      <header className="flex flex-col gap-5">
        <nav
          aria-label={ar ? "مسار التنقل" : "Breadcrumb"}
          className="flex flex-wrap items-center gap-2 font-mono text-micro uppercase tracking-[0.1em] text-text-tertiary"
        >
          <Link href="/" className="transition-colors hover:text-text-primary">
            {ar ? "الرئيسية" : "Home"}
          </Link>
          <span aria-hidden className="text-text-ghost">
            /
          </span>
          <Link href="/work" className="transition-colors hover:text-text-primary">
            {ar ? "الأعمال" : "Work"}
          </Link>
          <span aria-hidden className="text-text-ghost">
            /
          </span>
          <span className="text-accent">
            {isDev
              ? ar
                ? "مسار التطوير"
                : "Development Track"
              : ar
                ? "مسار التصميم"
                : "Design Track"}
          </span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <Heading
            eyebrow={
              isDev
                ? ar
                  ? "المسار 02 · التطوير والمنتجات الرقمية"
                  : "Track 02 · Digital Products & Engineering"
                : ar
                  ? "المسار 01 · الهوية البصرية والأنظمة التصميمية"
                  : "Track 01 · Brand Identity & Visual Systems"
            }
            title={
              isDev ? (
                ar ? (
                  <>
                    مشاريع <em>التطوير</em> والمنتجات الرقمية
                  </>
                ) : (
                  <>
                    Development <em>&amp; Digital</em> Products
                  </>
                )
              ) : ar ? (
                <>
                  مشاريع <em>التصميم</em> والهوية البصرية
                </>
              ) : (
                <>
                  Brand Identity <em>&amp; Visual</em> Systems
                </>
              )
            }
            titleClassName="max-w-[18ch] text-balance-pretty"
            subtitle={
              isDev
                ? ar
                  ? "الأرشيف الكامل للمنصات والأنظمة والأدوات الرقمية المنشورة — كل مشروع مرفق بلقطة حية من الواجهة، دراسة حالة معمارية، أو رابط معاينة مباشر."
                  : "The complete archive of shipped platforms, tools, and bilingual web applications — each paired with an interface preview, architectural case study, and live destination."
                : ar
                  ? "الأرشيف الكامل لأنظمة الهوية البصرية، معمارية التغليف، اللافتات الإرشادية، وأدلة الحوكمة المصممة للعمل في الواقع."
                  : "The complete archive of brand identity systems, packaging architecture, environmental signage, and governance guidelines built to hold up in production."
            }
            subtitleClassName="max-w-[58ch]"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="outline" size="sm">
              {ar ? `${projects.length} مشروع` : `${projects.length} Projects`}
            </Badge>
            <Badge tone="live" size="sm">
              {ar
                ? `${caseStudyProjects.length} دراسة حالة`
                : `${caseStudyProjects.length} Case Studies`}
            </Badge>
          </div>
        </div>

        {/* Track Switcher + Sub-filter Bar */}
        <div className="flex flex-col gap-3 border-t border-border-default pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="navigation"
            aria-label={ar ? "التنقل بين المسارات" : "Switch portfolio track"}
            className="inline-flex w-fit flex-wrap items-center gap-1 rounded-pill border border-border-default bg-surface-1 p-1"
          >
            <Link
              href="/work/design"
              aria-current={!isDev ? "page" : undefined}
              className={joinClasses(
                "inline-flex items-center gap-2 rounded-pill px-4 py-2 font-mono text-micro uppercase tracking-[0.08em] transition-colors duration-base ease-physics",
                !isDev
                  ? "bg-accent font-semibold text-obsidian"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <span>{ar ? "مسار التصميم" : "Design Track"}</span>
              <span className="opacity-75">{designCount}</span>
            </Link>

            <Link
              href="/work/development"
              aria-current={isDev ? "page" : undefined}
              className={joinClasses(
                "inline-flex items-center gap-2 rounded-pill px-4 py-2 font-mono text-micro uppercase tracking-[0.08em] transition-colors duration-base ease-physics",
                isDev
                  ? "bg-accent font-semibold text-obsidian"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <span>{ar ? "مسار التطوير" : "Development Track"}</span>
              <span className="opacity-75">{devCount}</span>
            </Link>

            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 rounded-pill px-3.5 py-2 font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
            >
              <span>{ar ? "الفهرس العام" : "All Work"}</span>
            </Link>
          </div>

          <div className="inline-flex w-fit flex-wrap items-center gap-1 rounded-pill border border-border-default bg-surface-1 p-1">
            <button
              type="button"
              onClick={() => setSubFilter("all")}
              aria-pressed={subFilter === "all"}
              className={joinClasses(
                "cursor-pointer rounded-pill px-3.5 py-1.5 font-mono text-micro uppercase tracking-[0.08em] transition-colors duration-base ease-physics",
                subFilter === "all"
                  ? "bg-surface-3 font-medium text-text-primary"
                  : "text-text-tertiary hover:text-text-primary",
              )}
            >
              {ar ? `كل المشاريع (${projects.length})` : `All (${projects.length})`}
            </button>

            <button
              type="button"
              onClick={() => setSubFilter("case-studies")}
              aria-pressed={subFilter === "case-studies"}
              className={joinClasses(
                "cursor-pointer rounded-pill px-3.5 py-1.5 font-mono text-micro uppercase tracking-[0.08em] transition-colors duration-base ease-physics",
                subFilter === "case-studies"
                  ? "bg-surface-3 font-medium text-text-primary"
                  : "text-text-tertiary hover:text-text-primary",
              )}
            >
              {ar
                ? `دراسات الحالة (${caseStudyProjects.length})`
                : `Case Studies (${caseStudyProjects.length})`}
            </button>

            {hasBrandWall ? (
              <button
                type="button"
                onClick={() => setSubFilter("wall")}
                aria-pressed={subFilter === "wall"}
                className={joinClasses(
                  "cursor-pointer rounded-pill px-3.5 py-1.5 font-mono text-micro uppercase tracking-[0.08em] transition-colors duration-base ease-physics",
                  subFilter === "wall"
                    ? "bg-surface-3 font-medium text-text-primary"
                    : "text-text-tertiary hover:text-text-primary",
                )}
              >
                {ar ? "الحائط البصري" : "Brand Wall"}
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Full Track Cards Grid or Brand Wall */}
      {subFilter === "wall" && hasBrandWall ? (
        <GalleryView projects={galleryProjects} images={galleryImages} embedded />
      ) : (
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <FeaturedCard
              key={project.slug}
              project={project}
              ar={ar}
              priority={index < 3}
              showStack
            />
          ))}
        </div>
      )}

      {/* Sibling Track Cross-Navigation Callout */}
      <div className="mt-4 flex flex-col items-start justify-between gap-6 rounded-card border border-border-default bg-surface-1 p-6 sm:flex-row sm:items-center md:p-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-micro uppercase tracking-[0.1em] text-accent">
            {isDev
              ? ar
                ? "المسار الآخر · 01"
                : "Explore Track 01"
              : ar
                ? "المسار الآخر · 02"
                : "Explore Track 02"}
          </span>
          <h2 className="font-display text-subtitle text-text-primary">
            {isDev
              ? ar
                ? "استكشف مسار التصميم والهوية البصرية"
                : "Explore Brand Identity & Visual Systems"
              : ar
                ? "استكشف مسار التطوير والمنتجات الرقمية"
                : "Explore Digital Products & Engineering"}
          </h2>
          <p className="text-body-sm text-text-secondary">
            {isDev
              ? ar
                ? `تصفّح جميع مشاريع الهوية البصرية والتغليف والحوكمة (${siblingCount} مشاريع).`
                : `Browse all ${siblingCount} brand identity, packaging, and governance systems.`
              : ar
                ? `تصفّح جميع المنصات والأنظمة والأدوات الرقمية المنشورة (${siblingCount} مشروعاً).`
                : `Browse all ${siblingCount} shipped platforms, web applications, and tools.`}
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <Link
            href={isDev ? "/work/design" : "/work/development"}
            className={buttonVariants({
              variant: "ghost",
              className:
                "inline-flex items-center gap-2 border border-border-default bg-surface-2 px-5 py-3 font-mono text-label tracking-[0.08em] text-text-primary transition-colors duration-base ease-physics hover:border-accent/50 hover:text-accent",
            })}
          >
            <span>
              {isDev
                ? ar
                  ? "مسار التصميم"
                  : "Design Track"
                : ar
                  ? "مسار التطوير"
                  : "Development Track"}
            </span>
            <span aria-hidden className="inline-flex">
              <Icon name="arrow-right" />
            </span>
          </Link>

          <Link
            href="/contact"
            className={buttonVariants({
              variant: "primary",
              className:
                "inline-flex items-center gap-2 px-6 py-3 font-mono text-label font-semibold tracking-[0.08em] transition-transform duration-base ease-physics hover:-translate-y-0.5",
            })}
          >
            <span>{ar ? "ابدأ مشروعك" : "Start a project"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
