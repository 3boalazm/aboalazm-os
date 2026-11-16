import { isValidElement, type ReactNode } from "react";
import { joinClasses } from "@/lib/utils";

/**
 * Page-hero section header: eyebrow + title (+ optional subtitle/meta).
 * Wears the X page head (.x-page-title / .x-kicker / .x-page-lead in x.css);
 * call-site utilities still override because those rules live in `components`.
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


/** Characters of visible text in a node — statement headlines (about, hiring) are set smaller than poster ones. */
function textLength(node: ReactNode): number {
  if (node == null || typeof node === "boolean") return 0;
  if (typeof node === "string" || typeof node === "number") return String(node).length;
  if (Array.isArray(node)) return node.reduce<number>((n, child) => n + textLength(child), 0);
  if (isValidElement(node)) return textLength((node.props as { children?: ReactNode }).children);
  return 0;
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
    <p className="x-mono x-kicker">
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
      <h1 className={joinClasses("x-page-title", textLength(title) > 34 && "x-page-title--long", titleClassName)}>
        {title}
      </h1>
      {subtitle ? (
        <p className={joinClasses("x-page-lead", subtitleClassName)}>{subtitle}</p>
      ) : null}
    </>
  );
}
