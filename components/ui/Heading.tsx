import type { ReactNode } from "react";

/**
 * Plain concatenation, deliberately NOT the project's `cn()` (tailwind-merge)
 * helper: twMerge's class-group heuristics key off the `text-` prefix and
 * treat custom v4 theme utilities like `text-display`/`text-lead` as
 * conflicting with `text-text-secondary`/`text-balance-pretty` (both also
 * `text-*`), silently dropping the base font-size utility. No override
 * semantics are needed here — every className passed in is additive.
 */
function joinClasses(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Page-hero section header: eyebrow + title (+ optional subtitle/meta).
 * Extracted from 15 near-identical call sites — renders no wrapper of its
 * own so each page keeps its existing <header>/<div> layout (gap-2/3/4,
 * pb-*, etc. all vary per page and are intentionally left with the caller).
 */
export interface HeadingProps {
  eyebrow: ReactNode;
  /** Secondary label rendered inline with the eyebrow (pricing's USD/negotiable line). */
  eyebrowMeta?: ReactNode;
  title: ReactNode;
  /** Per-page title overrides (e.g. `max-w-[18ch] text-balance-pretty`). */
  titleClassName?: string;
  subtitle?: ReactNode;
  /** Per-page subtitle overrides (e.g. `max-w-[52ch]`). */
  subtitleClassName?: string;
}

export function Heading({
  eyebrow,
  eyebrowMeta,
  title,
  titleClassName,
  subtitle,
  subtitleClassName,
}: HeadingProps) {
  const eyebrowEl = (
    <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
      {eyebrow}
    </p>
  );

  return (
    <>
      {eyebrowMeta ? (
        <div className="flex items-baseline justify-between gap-2">
          {eyebrowEl}
          {eyebrowMeta}
        </div>
      ) : (
        eyebrowEl
      )}
      <h1 className={joinClasses("font-display text-display tracking-[-0.025em]", titleClassName)}>
        {title}
      </h1>
      {subtitle ? (
        <p className={joinClasses("text-lead text-text-secondary", subtitleClassName)}>{subtitle}</p>
      ) : null}
    </>
  );
}
