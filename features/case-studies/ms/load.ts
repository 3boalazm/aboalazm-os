import { CHROME_MS } from "./chrome";

/**
 * Server-side loader for the Malay case-study overlay.
 *
 * Only slugs listed here have translated body copy; every case study gets the
 * shared chrome (tabs, section kickers, buttons) because that is part of the
 * page frame. Anything missing falls back to English, per string.
 *
 * Each slug module is a dynamic import so it is bundled with the server only
 * and fetched only for a /ms request of that slug.
 */
export type CaseMsEntry = {
  /** Translated strings, keyed by the English source string. */
  default: Readonly<Record<string, string>>;
  /** Title and meta description for the /ms page. */
  meta: { title: string; description: string };
};

const SLUG_DICTS: Readonly<Record<string, () => Promise<CaseMsEntry>>> = {
  "code-canvas-dev": () => import("./code-canvas-dev"),
  "learn-in-arabic": () => import("./learn-in-arabic"),
  "youth-scope": () => import("./youth-scope"),
};

export const MALAY_CASE_SLUGS = Object.keys(SLUG_DICTS);

export async function loadCaseMs(slug: string): Promise<Readonly<Record<string, string>>> {
  const load = SLUG_DICTS[slug];
  return load ? { ...CHROME_MS, ...(await load()).default } : CHROME_MS;
}

export async function loadCaseMsMeta(slug: string): Promise<CaseMsEntry["meta"] | undefined> {
  const load = SLUG_DICTS[slug];
  return load ? (await load()).meta : undefined;
}
