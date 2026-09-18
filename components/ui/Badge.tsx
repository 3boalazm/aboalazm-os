import type { HTMLAttributes, ReactNode } from "react";
import { joinClasses } from "@/lib/utils";

/**
 * Tones map onto the Expressive System Layer's semantic roles. `creative`,
 * `live`, and `proof` are the violet / cyan / lime supporting roles — they
 * annotate meaning (experimental, live, shipped) and never stand in for the
 * orange brand anchor, which keeps `accent` to itself.
 */
const TONES = {
  neutral: "border-border-subtle bg-surface-1 text-text-secondary",
  accent: "border-accent-border bg-accent-dim text-accent-text",
  outline: "border-border-default bg-transparent text-text-tertiary",
  success: "border-success-border bg-success-dim text-success-text",
  creative: "border-[var(--color-creative-border)] bg-[var(--color-creative-dim)] text-[var(--color-creative-text)]",
  live: "border-[var(--color-live-border)] bg-[var(--color-live-dim)] text-[var(--color-live-text)]",
  proof: "border-[var(--color-proof-border)] bg-[var(--color-proof-dim)] text-[var(--color-proof-text)]",
} as const;

const SIZES = {
  sm: "min-h-6 px-2 text-micro",
  md: "min-h-8 px-3 text-label",
} as const;

export type BadgeTone = keyof typeof TONES;
export type BadgeSize = keyof typeof SIZES;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  leading?: ReactNode;
}

/**
 * Compact metadata/status primitive. It intentionally stays quieter than a
 * CTA and is designed for tags, filters, status labels, and project metadata.
 */
export function Badge({
  tone = "neutral",
  size = "sm",
  leading,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={joinClasses(
        "inline-flex w-fit items-center gap-1.5 rounded-pill border font-mono uppercase tracking-[0.08em] transition-colors duration-fast ease-physics",
        TONES[tone],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {leading ? <span aria-hidden>{leading}</span> : null}
      {children}
    </span>
  );
}

export function badgeVariants({
  tone = "neutral",
  size = "sm",
  className,
}: Pick<BadgeProps, "tone" | "size" | "className"> = {}) {
  return joinClasses(
    "inline-flex w-fit items-center gap-1.5 rounded-pill border font-mono uppercase tracking-[0.08em] transition-colors duration-fast ease-physics",
    TONES[tone],
    SIZES[size],
    className,
  );
}
