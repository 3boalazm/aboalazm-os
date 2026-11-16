import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Token-aware class merger — the only way classes are composed. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * A year that runs on ("2024 →") or a span ("2017 → 2026") is drawn with a
 * rightwards arrow. On an RTL line the number sits on the right and the arrow
 * lands to its left, still pointing right: back at the year it should lead
 * away from. Arabic gets the leftwards arrow, which then points the way the
 * line reads. A year with no arrow, or any other language, comes back as it was.
 */
export function yearLabel(year: string, ar: boolean): string;
export function yearLabel(year: string | undefined, ar: boolean): string | undefined;
export function yearLabel(year: string | undefined, ar: boolean): string | undefined {
  return ar && year ? year.replace(/→/g, "←") : year;
}

/**
 * Plain concatenation — deliberately NOT `cn()`. tailwind-merge's
 * class-group heuristics key off prefixes like `text-` and misread custom
 * v4 theme utilities (`text-display`, `text-lead`, etc.) as conflicting
 * with unrelated `text-*` classes, silently dropping the base utility
 * (confirmed in components/ui/Heading.tsx and Button.tsx, both of which
 * only ever compose additive classes with no override semantics needed).
 * Use this instead of `cn()` wherever nothing is meant to override
 * anything else in the same call.
 */
export function joinClasses(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(" ");
}
