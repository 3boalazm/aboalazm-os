import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

/**
 * Share cards are easy to forget: a page that sets its own `openGraph` metadata but has no
 * `opengraph-image` next to it is published with no og:image at all, and every link to it
 * unfurls as a bare title. A production crawl once found eight such routes (the four service
 * pages, /partnership, /book, /developer, /reels) × three locales.
 *
 * These checks read the route tree, not the rendered output, so they stay fast and run with
 * the rest of the suite:
 *   1. every indexable page has an `opengraph-image` file beside it;
 *   2. a route file that borrows a card from the registry borrows the card made for that route
 *      (a copy-pasted id would put the wrong picture on a page);
 *   3. every card in the registry is served by some route (no orphans).
 */

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "app");
const SITE = path.join(APP, "(site)", "[locale]");

function walk(dir: string, found: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, found);
    else found.push(full);
  }
  return found;
}

/** `/services/store-72h` for `app/(site)/[locale]/services/store-72h/…`; `/` for the locale root. */
function routeOf(file: string): string {
  const segments = path
    .relative(APP, path.dirname(file))
    .split(path.sep)
    .filter((s) => s && !/^\(.*\)$/.test(s) && s !== "[locale]");
  return "/" + segments.join("/");
}

const siteFiles = walk(SITE);
const appFiles = walk(APP);

test("every indexable page has a share card beside it", () => {
  const missing: string[] = [];
  for (const file of siteFiles.filter((f) => path.basename(f) === "page.tsx")) {
    const source = readFileSync(file, "utf8");
    if (/\bindex:\s*false\b/.test(source)) continue; // internal pages are not shared
    const card = path.join(path.dirname(file), "opengraph-image.tsx");
    if (!existsSync(card)) missing.push(routeOf(file));
  }
  assert.deepEqual(missing, [], `pages without an opengraph-image: ${missing.join(", ")}`);
});

test("a route file borrows the card made for its own route", () => {
  const wrong: string[] = [];
  let checked = 0;
  return import("./og-pages").then(({ OG_PAGES }) => {
    for (const file of appFiles.filter((f) => path.basename(f) === "opengraph-image.tsx")) {
      const source = readFileSync(file, "utf8");
      const image = /ogImage\("([a-z0-9-]+)"\)/.exec(source)?.[1];
      const alt = /ogAlt\("([a-z0-9-]+)"\)/.exec(source)?.[1];
      if (!image && !alt) continue; // draws its own card (articles, case studies, books)
      checked += 1;
      const route = routeOf(file);
      if (image !== alt) wrong.push(`${route}: ogImage("${image}") but ogAlt("${alt}")`);
      const def = (OG_PAGES as Record<string, { route: string } | undefined>)[image ?? ""];
      if (!def) wrong.push(`${route}: no card "${image}" in OG_PAGES`);
      else if (def.route !== route) wrong.push(`${route}: serves the card of ${def.route} ("${image}")`);
    }
    assert.ok(checked >= Object.keys(OG_PAGES).length, `expected to check every registry-backed route, found ${checked}`);
    assert.deepEqual(wrong, []);
  });
});

test("every card in the registry is served by a route", () => {
  return import("./og-pages").then(({ OG_PAGES }) => {
    const served = new Set<string>();
    for (const file of appFiles.filter((f) => path.basename(f) === "opengraph-image.tsx")) {
      const id = /ogImage\("([a-z0-9-]+)"\)/.exec(readFileSync(file, "utf8"))?.[1];
      if (id) served.add(id);
    }
    const orphans = Object.keys(OG_PAGES).filter((id) => !served.has(id));
    assert.deepEqual(orphans, [], `cards nothing serves: ${orphans.join(", ")}`);
  });
});
