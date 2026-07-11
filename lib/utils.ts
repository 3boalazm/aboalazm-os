import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Token-aware class merger — the only way classes are composed. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
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
