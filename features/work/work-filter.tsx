"use client";

/**
 * WorkFilter — segmented category filter for /work.
 *
 * Featured cases sit above a compact ledger of the remaining records.
 * Filters are client-facing: All / Identity / Digital Products.
 *
 * Overhaul S4 (ABO-27): /gallery is merged here as a second view —
 * "Index" (filters + cards + ledger, below) or "Wall" (the cross-project
 * image wall with its own client filter chips and lightbox). The old
 * /gallery route 301s to /work, so this is now the only home of both.
 */

import { useMemo, useState } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { FeaturedCases, pickFeatured } from "./featured-cases";
import { ProjectLedger } from "./project-ledger";
import { GalleryView } from "@/features/gallery";
import type { GalleryImage, GalleryProject } from "@/lib/gallery";
import type { Project, ProjectCategory } from "./types";

type FilterValue = "all" | ProjectCategory;
type WorkView = "index" | "wall";

const OPTIONS: { value: FilterValue; en: string; ar: string }[] = [
  { value: "all",         en: "All",              ar: "الكل" },
  { value: "design",      en: "Identity",         ar: "هوية" },
  { value: "development", en: "Digital Products", ar: "منتجات رقمية" },
];

const VIEWS: { value: WorkView; en: string; ar: string }[] = [
  { value: "index", en: "Index", ar: "الفهرس" },
  { value: "wall",  en: "Wall",  ar: "الحيطة" },
];

export function WorkFilter({
  projects,
  galleryProjects,
  galleryImages,
}: {
  projects: readonly Project[];
  galleryProjects: readonly GalleryProject[];
  galleryImages: readonly GalleryImage[];
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [filter, setFilter] = useState<FilterValue>("all");
  const [view, setView] = useState<WorkView>("index");

  const counts = useMemo(() => {
    const design = projects.filter((p) => p.category === "design").length;
    const development = projects.filter((p) => p.category === "development").length;
    return { all: projects.length, design, development };
  }, [projects]);

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  const featured = useMemo(() => pickFeatured(filtered, 3), [filtered]);
  const featuredSlugs = useMemo(() => new Set(featured.map((p) => p.slug)), [featured]);
  const rest = useMemo(
    () => filtered.filter((p) => !featuredSlugs.has(p.slug)),
    [filtered, featuredSlugs],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {view === "index" ? (
          <div className="work-filter" role="group" aria-label={ar ? "فلترة الأعمال" : "Filter work"}>
            {OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setFilter(o.value)}
                aria-pressed={filter === o.value}
                className={["work-filter__btn", filter === o.value ? "work-filter__btn--active" : ""].join(" ")}
              >
                {ar ? o.ar : o.en}
                <span className="work-filter__count">{counts[o.value]}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {ar ? "المعرض المصوّر — كل مشاريع الهوية على حيطة واحدة" : "THE WALL — every identity project, one wall"}
          </p>
        )}

        {/* View toggle — /index (default) or /wall (the merged gallery) */}
        <div className="work-filter" role="group" aria-label={ar ? "طريقة العرض" : "View as"}>
          {VIEWS.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setView(v.value)}
              aria-pressed={view === v.value}
              className={["work-filter__btn", view === v.value ? "work-filter__btn--active" : ""].join(" ")}
            >
              {ar ? v.ar : v.en}
            </button>
          ))}
        </div>
      </div>

      {view === "wall" ? (
        <GalleryView projects={galleryProjects} images={galleryImages} embedded />
      ) : (
        <>
          <FeaturedCases projects={filtered} heading="none" showIndexLink={false} contained={false} />

          {rest.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="font-mono text-label uppercase tracking-[0.08em] text-text-tertiary">
                {ar ? "باقي الفهرس" : "The rest of the index"}
              </p>
              <ProjectLedger projects={rest} compact />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
