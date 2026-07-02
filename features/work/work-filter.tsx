"use client";

/**
 * WorkFilter — segmented category filter for /work.
 *
 * "All" shows everything (the historical default — nothing changes for
 * existing visitors). "Design" and "Development" narrow the ledger to
 * that `category`. State lives here, not in the page, so /work/page.tsx
 * stays a plain server component with static metadata.
 */

import { useMemo, useState } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { ProjectLedger } from "./project-ledger";
import { PROJECTS } from "./projects.data";
import type { ProjectCategory } from "./types";

type FilterValue = "all" | ProjectCategory;

const OPTIONS: { value: FilterValue; en: string; ar: string }[] = [
  { value: "all",         en: "All",         ar: "الكل" },
  { value: "design",      en: "Design",      ar: "تصميم" },
  { value: "development", en: "Development", ar: "ديفلوبمنت" },
];

export function WorkFilter() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [filter, setFilter] = useState<FilterValue>("all");

  const counts = useMemo(() => {
    const design = PROJECTS.filter((p) => p.category === "design").length;
    const development = PROJECTS.filter((p) => p.category === "development").length;
    return { all: PROJECTS.length, design, development };
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
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

      <ProjectLedger projects={filtered} />
    </div>
  );
}
