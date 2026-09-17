import type { HTMLAttributes, ReactNode } from "react";
import { joinClasses } from "@/lib/utils";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: "section" | "div";
  density?: "default" | "compact" | "spacious";
}

const DENSITIES = {
  compact: "py-8 md:py-12",
  default: "py-12 md:py-16",
  spacious: "py-16 md:py-24",
} as const;

/**
 * Page rhythm primitive. It adds section spacing only; container width,
 * surface, and layout remain caller-owned so existing compositions stay
 * visually intact during migration.
 */
export function Section({
  as = "section",
  density = "default",
  className,
  children,
  ...props
}: SectionProps) {
  const Component = as;
  return (
    <Component className={joinClasses(DENSITIES[density], className)} {...props}>
      {children}
    </Component>
  );
}

export interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p className={joinClasses("font-mono text-label uppercase tracking-[0.08em] text-text-tertiary", className)}>
      {children}
    </p>
  );
}
