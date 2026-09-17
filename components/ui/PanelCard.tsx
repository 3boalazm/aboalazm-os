import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared box shape behind every bordered content panel in the codebase
 * (13 call sites audited — see design-preview/sprint-card-audit.md and
 * sprint-panelcard.md). Radius, padding, and layout (flex/gap) are NOT
 * defaulted here — they genuinely vary per site (p-3 to p-8, rounded-card
 * vs rounded-panel) and are supplied by the caller's className. Only the
 * `border` keyword and the three background/border-color states proven
 * byte-identical across ≥2 real sites are baked in; anything closer to a
 * one-off (e.g. `border-accent/40`, `border-accent/20`, `bg-surface-1/50`)
 * stays a per-site className override rather than a new enum value.
 */
const BASE = "border";

const EMPHASIS = {
  /** border-border-subtle + bg-surface-1 (full) — the most common resting state. */
  default: "border-border-subtle bg-surface-1",
  /** border-accent + bg-surface-1 + shadow-card — TierCard/start-view "recommended" tier. */
  accent: "border-accent bg-surface-1 shadow-card",
  /** border-border-subtle + bg-surface-1/60 — TierCard/start-view non-recommended tier + investment-value's value-prop card. */
  dimmed: "border-border-subtle bg-surface-1/60",
} as const;

export type PanelCardEmphasis = keyof typeof EMPHASIS;

interface PanelCardVariantsOptions {
  emphasis?: PanelCardEmphasis;
  /** Adds the exact hover treatment shared by ResourceCard/research-area: transition-colors duration-base ease-physics hover:border-border-strong. */
  interactive?: boolean;
  className?: string;
}

/**
 * Class-string builder — for call sites where the card surface must stay
 * something other than a plain element PanelCard can render (a Next.js
 * `<Link>` in books-view.tsx, a `motion.div`/`motion.article` elsewhere).
 * Mirrors buttonVariants() in components/ui/Button.tsx.
 */
export function panelCardVariants({ emphasis = "default", interactive, className }: PanelCardVariantsOptions = {}): string {
  return cn(
    BASE,
    EMPHASIS[emphasis],
    interactive && "transition-colors duration-base ease-physics hover:border-border-strong",
    className,
  );
}

export interface PanelCardProps extends PanelCardVariantsOptions, Omit<HTMLAttributes<HTMLElement>, "className"> {
  as?: "div" | "article";
  children?: ReactNode;
}

export function PanelCard({ as = "div", emphasis, interactive, className, children, ...props }: PanelCardProps) {
  const Component = as as ElementType;
  return (
    <Component className={panelCardVariants({ emphasis, interactive, className })} {...props}>
      {children}
    </Component>
  );
}
