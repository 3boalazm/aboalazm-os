"use client";

/**
 * WorkFilter — segmented category filter for /work.
 *
 * Featured cases sit above a compact ledger of the remaining records.
 * Filters are client-facing: All / Identity / Digital Products.
 */

import { useMemo, useState } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { FeaturedCases, pickFeatured } from "./featured-cases";
import { ProjectLedger } from "./project-ledger";
import type { Project, ProjectCategory } from "./types";

type FilterValue = "all" | ProjectCategory;

const OPTIONS: { value: FilterValue; en: string; ar: string }[] = [
  { value: "all",         en: "All",              ar: "الكل" },
  { value: "design",      en: "Identity",         ar: "هوية" },
  { value: "development", en: "Digital Products", ar: "منتجات رقمية" },
];

export function WorkFilter({ projects }: { projects: readonly Project[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [filter, setFilter] = useState<FilterValue>("all");

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

      <FeaturedCases projects={filtered} heading="none" showIndexLink={false} contained={false} />

      {rest.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-label uppercase tracking-[0.08em] text-text-tertiary">
            {ar ? "باقي الفهرس" : "The rest of the index"}
          </p>
          <ProjectLedger projects={rest} compact />
        </div>
      ) : null}
    </div>
  );
}
