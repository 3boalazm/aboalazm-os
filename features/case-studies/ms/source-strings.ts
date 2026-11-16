/**
 * Tooling and tests only; no page imports this. It collects the English prose
 * a case study can render, so a test can prove the Malay overlay covers every
 * string and holds nothing stale.
 */
import * as React from "react";
import type { ReactElement } from "react";
import { OVERVIEW_TECHNICAL_CASES } from "../overview-technical.data";
import { CodeCanvasDevCaseStudy } from "../code-canvas-dev";
import { getBusinessCase } from "../business-cases.data";
import { PROJECTS } from "@/features/work/projects.data";
import { CHROME_MS } from "./chrome";

/** Data keys that hold identifiers, links or styling hooks rather than copy. */
const NON_COPY_KEYS = new Set([
  "src", "href", "accent", "track", "fileNo", "code", "wordmark", "wordmarkTail",
  "slug", "no", "n", "step", "origin", "id", "key", "tone", "icon",
]);

/** Arabic copy is Arabic-dominant; an English sentence may still carry an Arabic name in parentheses. */
const isArabicCopy = (s: string) => (s.match(/[؀-ۿ]/g)?.length ?? 0) > (s.match(/[A-Za-z]/g)?.length ?? 0);
const looksLikeCopy = (s: string) => /[A-Za-z]{3,}/.test(s) && !/^(\/|https?:|#)/.test(s) && !isArabicCopy(s);

function leaves(value: unknown, key = "", out: string[] = []): string[] {
  if (typeof value === "string") {
    if (!NON_COPY_KEYS.has(key) && looksLikeCopy(value)) out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => leaves(v, key, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) leaves(v, k, out);
  }
  return out;
}

/**
 * Views whose technical copy is built inside a component, not in a data file. Such a view is a plain
 * function returning <ProductCase …/>, so its props are the copy. tsx compiles JSX to
 * React.createElement, so React has to be in scope when it is called outside Next.
 */
const readProps = (view: () => unknown) => () => {
  (globalThis as { React?: unknown }).React ??= React;
  return (view() as ReactElement).props;
};
const TECHNICAL_SOURCES: Readonly<Record<string, () => unknown>> = {
  "code-canvas-dev": readProps(CodeCanvasDevCaseStudy),
};

/** Every distinct English string of a case study that the shared frame copy does not already cover. */
export function collectCaseStrings(slug: string): string[] {
  const project = PROJECTS.find((p) => p.slug === slug);
  const technical = (OVERVIEW_TECHNICAL_CASES as Record<string, unknown>)[slug] ?? TECHNICAL_SOURCES[slug]?.();
  const all = [...(technical ? leaves(technical) : []), ...leaves(getBusinessCase(slug, project))];
  return [...new Set(all)].filter((s) => !(s in CHROME_MS));
}
