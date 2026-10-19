"use client";

/**
 * WorkFilter — two intentionally separate work streams for /work.
 * Brand identity has the optional visual wall; digital products stay in the
 * index so every project keeps its screenshot and direct production link.
 */

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { FeaturedCases, pickFeatured } from "./featured-cases";
import { ProjectLedger } from "./project-ledger";
import { GalleryView } from "@/features/gallery";
import type { GalleryImage, GalleryProject } from "@/lib/gallery";
import type { Project, ProjectCategory } from "./types";

type WorkView = "index" | "wall";

const OPTIONS: { value: ProjectCategory; en: string; ar: string }[] = [
  { value: "design", en: "Identity", ar: "هوية بصرية" },
  { value: "development", en: "Digital Products", ar: "منتجات رقمية" },
];

const VIEWS: { value: WorkView; en: string; ar: string }[] = [
  { value: "index", en: "Index", ar: "الفهرس" },
  { value: "wall", en: "Wall", ar: "الحيطة" },
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
  const [filter, setFilter] = useState<ProjectCategory>("design");
  const [view, setView] = useState<WorkView>("index");

  // Home's "All digital products" link lands directly on the matching stream.
  useEffect(() => {
    if (window.location.hash === "#digital-products") {
      setFilter("development");
      setView("index");
    }
  }, []);

  const counts = useMemo(
    () => ({
      design: projects.filter((p) => p.category === "design").length,
      development: projects.filter((p) => p.category === "development").length,
    }),
    [projects],
  );

  const filtered = useMemo(
    () => projects.filter((p) => p.category === filter),
    [filter, projects],
  );

  const featured = useMemo(() => pickFeatured(filtered), [filtered]);
  const featuredSlugs = useMemo(() => new Set(featured.map((p) => p.slug)), [featured]);
  const rest = useMemo(
    () => filtered.filter((p) => !featuredSlugs.has(p.slug)),
    [filtered, featuredSlugs],
  );

  const selectCategory = (category: ProjectCategory) => {
    setFilter(category);
    if (category === "development") setView("index");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-micro uppercase tracking-[0.1em] text-text-ghost">
            {ar ? "استكشف حسب التخصص" : "Browse by discipline"}
          </p>
          <div className="work-filter" role="group" aria-label={ar ? "اختار نوع الأعمال" : "Choose a work type"}>
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                id={option.value === "development" ? "digital-products" : "identity-projects"}
                type="button"
                onClick={() => selectCategory(option.value)}
                aria-pressed={filter === option.value}
                className={[
                  "work-filter__btn",
                  option.value === "development" ? "scroll-mt-20" : "",
                  filter === option.value ? "work-filter__btn--active" : "",
                ].join(" ")}
              >
                {ar ? option.ar : option.en}
                <span className="work-filter__count">{counts[option.value]}</span>
              </button>
            ))}
          </div>
        </div>

        {filter === "design" ? (
          <div className="work-filter" role="group" aria-label={ar ? "طريقة العرض" : "View as"}>
            {VIEWS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setView(item.value)}
                aria-pressed={view === item.value}
                className={["work-filter__btn", view === item.value ? "work-filter__btn--active" : ""].join(" ")}
              >
                {ar ? item.ar : item.en}
              </button>
            ))}
          </div>
        ) : (
          <p className="max-w-[42ch] font-mono text-micro leading-relaxed text-text-tertiary">
            {ar
              ? "كل منتج معه معاينة مصوّرة ورابط مباشر لنسخته المنشورة."
              : "Each product pairs a visual preview with a direct link to its production version."}
          </p>
        )}
      </div>

      {view === "wall" ? (
        <GalleryView projects={galleryProjects} images={galleryImages} embedded />
      ) : (
        <>
          <FeaturedCases
            projects={filtered}
            heading="none"
            variant={filter === "development" ? "digital" : "identity"}
            showIndexLink={false}
            contained={false}
          />

          {rest.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="font-mono text-label uppercase tracking-[0.08em] text-text-tertiary">
                {ar
                  ? filter === "design" ? "باقي مشاريع الهوية" : "باقي المنتجات الرقمية"
                  : filter === "design" ? "More identity projects" : "More digital products"}
              </p>
              <ProjectLedger projects={rest} compact />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
