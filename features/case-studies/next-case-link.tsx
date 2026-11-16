"use client";

/**
 * NEXT CASE — the closing beat of every case study (overhaul S4 / ABO-27).
 * A reader who reaches the bottom is engaged; the band routes that
 * momentum into the next file instead of dead-ending the funnel.
 * The link borrows the NEXT record's accent as a faint field, so the
 * hand-off already feels like a different project before the click.
 */
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { useCaseT } from "./ms/context";
import { Icon } from "@/components/ui/Icon";
import { panelCardVariants } from "@/components/ui/PanelCard";
import { trackEvent } from "@/lib/analytics";
import type { ProjectAccent } from "@/lib/tokens";

export function NextCaseLink({
  slug,
  name,
  nameAr,
  accent,
}: {
  slug: string;
  name: string;
  nameAr?: string;
  accent: ProjectAccent;
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = useCaseT();
  return (
    <section className="container-wide pb-4" aria-label={ar ? "دراسة الحالة التالية" : t("Next case study")}>
      <Link
        href={`/case-studies/${slug}`}
        onClick={() => trackEvent("case_study_open", { slug, surface: "next_case" })}
        className={panelCardVariants({ className: "group relative block overflow-hidden rounded-panel px-4 py-6 sm:px-6 sm:py-8 transition-[border-color] duration-base ease-physics hover:border-accent" })}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 transition-opacity duration-slow ease-physics group-hover:opacity-70"
          style={{
            background: `radial-gradient(120% 160% at 85% 50%, ${accent.primary}, transparent 65%)`,
          }}
        />
        <div className="relative z-elevated flex flex-col gap-2">
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
            {ar ? "الدراسة التالية · من الأرشيف" : t("NEXT CASE ↳ FROM THE FILES")}
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="min-w-0 [overflow-wrap:anywhere] font-display text-[clamp(1.75rem,4vw,3rem)] font-[800] leading-[1.05] tracking-[-0.02em] text-text-primary">
              {ar && nameAr ? nameAr : name}
            </h2>
            <span className="inline-flex shrink-0 rounded-full border border-border-subtle p-3 text-text-secondary transition-[transform,border-color,color] duration-base ease-physics group-hover:translate-x-0.5 group-hover:border-accent group-hover:text-accent rtl:group-hover:-translate-x-0.5">
              <Icon name="arrow-right" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
