"use client";

/**
 * PROOF STRIP — the credibility line directly under the hero (overhaul S2,
 * spec §4.3-02). One thin band: practice metrics on one side, the six
 * sectors on the other. Numbers mirror the site's already-approved claims
 * (9+ yrs / 20+ clients / 5-yr stewardship) — nothing new asserted here.
 * Pure SSR text: the strip is readable in the first paint, no entrance.
 */
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";

const METRICS = [
  ["9+ yrs", "practice", "9+ سنوات", "ممارسة"],
  ["20+", "clients & orgs", "20+", "عميل ومؤسسة"],
  ["5-yr", "longest stewardship", "5 سنوات", "أطول شراكة"],
] as const;

const SECTORS_EN = ["Pharma", "Food", "Education", "Government", "Art & Print", "Consumer"];
const SECTORS_AR = ["دواء", "غذاء", "تعليم", "حكومة", "فن ومطبوعات", "استهلاكي"];

export function ProofStrip() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const sectors = ar ? SECTORS_AR : SECTORS_EN;
  const ms = lang === "ms";
  return (
    <section
      aria-label={ar ? "إثبات الخبرة" : ms ? "Bukti pengalaman" : "Practice proof"}
      className="border-y border-border-subtle bg-surface-1/40"
    >
      <div className="container-wide flex flex-col gap-2 py-3 lg:flex-row lg:items-center lg:justify-between">
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {METRICS.map(([v, unit, var_, unitAr]) => (
            <div key={v} className="flex items-baseline gap-1.5">
              <dt className="sr-only">{ar ? unitAr : unit}</dt>
              <dd className="font-display text-subtitle leading-none text-text-primary">{ar ? var_ : v}</dd>
              <dd className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{ar ? unitAr : unit}</dd>
            </div>
          ))}
        </dl>
        <ul aria-label={ar ? "القطاعات" : ms ? "Sektor" : "Sectors"} className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {sectors.map((s, i) => (
            <li key={s} className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.12em] text-text-tertiary">
              {i > 0 && <Icon name="sparkle" size="0.7em" className="text-accent/70" />}
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
