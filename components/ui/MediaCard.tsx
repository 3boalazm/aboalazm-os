import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared shell behind the 4 validated media-with-caption cards (see
 * design-preview/sprint-card-audit.md, Family 2): LivePreviewCard,
 * CaseGallery, gallery-view's masonry item, and ExecutionPanel's
 * deliverables gallery item. Only `overflow-hidden rounded-card border
 * border-border-subtle` + a background surface + the `group` class (every
 * validated row's hover-reveal children key off `group-hover:`) are baked
 * in — caption placement, overlay mechanics, and hover animation differ
 * across all four and stay caller-authored children, same as the fixed-
 * aspect-ratio inner "image wrapper" div each of LivePreviewCard/
 * CaseGallery renders (their required extra classes differ, so it isn't
 * safe to generalize into this primitive without guessing).
 *
 * rotating-gallery.tsx's Card and floating-preview.tsx's FloatingPreview
 * were explicitly excluded during validation (GSAP needs a direct DOM ref,
 * different border token, no aspect-ratio concept) and must not adopt this.
 */
const BASE = "group overflow-hidden rounded-card border border-border-subtle";

const SURFACE = {
  "surface-0": "bg-surface-0",
  "surface-1": "bg-surface-1",
} as const;

export type MediaCardSurface = keyof typeof SURFACE;

interface MediaCardVariantsOptions {
  surface?: MediaCardSurface;
  className?: string;
}

/**
 * Class-string builder — for the one call site (gallery-view.tsx's masonry
 * item) where the card surface must stay a `motion.button` rather than a
 * plain element MediaCard can render. Mirrors panelCardVariants() in
 * components/ui/PanelCard.tsx.
 */
export function mediaCardVariants({ surface = "surface-1", className }: MediaCardVariantsOptions = {}): string {
  return cn(BASE, SURFACE[surface], className);
}

type MediaCardOwnProps<T extends ElementType> = {
  as?: T;
  surface?: MediaCardSurface;
  className?: string;
  children?: ReactNode;
};

export type MediaCardProps<T extends ElementType = "div"> = MediaCardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof MediaCardOwnProps<T>>;

export function MediaCard<T extends ElementType = "div">({
  as,
  surface = "surface-1",
  className,
  children,
  ...props
}: MediaCardProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component className={cn(BASE, SURFACE[surface], className)} {...props}>
      {children}
    </Component>
  );
}
