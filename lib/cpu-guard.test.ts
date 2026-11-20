import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { LOCALES } from "./locale";
import { ogLocaleParams, ogLocaleSlugParams } from "./og-static";
import { parseContactContext, parseContactContextFromSearch } from "./contact-context";

/**
 * CPU GUARD #2 (20 Nov 2026). Vercel Hobby meters Fluid Active CPU for the whole team, and what filled it was
 * not the pages but small things that run as a serverless function: share cards rendered per request
 * (~1.3 s of CPU and ~400 KB each, uncached), and pages that read `searchParams`, which turns the page and every
 * <Link> prefetch of it into a function run on every page view. These tests keep those out of the build.
 * (lib/revalidate.test.ts is guard #1: page TTLs and on-demand invalidation.)
 */
const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");
/** Source without comments: a comment that explains why `searchParams` is gone must not trip the guard. */
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

function filesUnder(dir: string, test: (file: string) => boolean, out: string[] = []): string[] {
  for (const name of readdirSync(join(root, dir))) {
    const rel = join(dir, name);
    if (statSync(join(root, rel)).isDirectory()) filesUnder(rel, test, out);
    else if (test(rel)) out.push(rel);
  }
  return out;
}

test("every share card under [locale] is prerendered at build time, not rendered per request", () => {
  const cards = filesUnder("app/(site)/[locale]", (f) => /(^|\/)opengraph-image\.tsx$/.test(f));
  assert.ok(cards.length >= 25, `expected the share-card routes, found ${cards.length}`);
  for (const file of cards) {
    const source = read(file);
    assert.match(source, /export (async )?function generateStaticParams|export const generateStaticParams/, `${relative(root, file)} must export generateStaticParams (lib/og-static.ts): without it the card is a function that renders a PNG on every request`);
    assert.match(source, /export const dynamic = "force-static"/, `${file} must export dynamic = "force-static"`);
  }
});

test("share-card params cover every locale, and slug cards cover every locale x slug", () => {
  assert.deepEqual(ogLocaleParams(), LOCALES.map((locale) => ({ locale })));
  const params = ogLocaleSlugParams(["a", "b"]);
  assert.equal(params.length, LOCALES.length * 2);
  for (const locale of LOCALES) for (const slug of ["a", "b"]) assert.ok(params.some((p) => p.locale === locale && p.slug === slug));
});

test("/contact stays a static page: it must not read searchParams, cookies, headers or force dynamic rendering", () => {
  const source = code("app/(site)/[locale]/contact/page.tsx");
  assert.doesNotMatch(source, /searchParams/, "contact/page.tsx reads searchParams: the page and every <Link> prefetch of /contact?source=… would become a function run again. Read the URL in the browser (contact-from-url.tsx)");
  assert.doesNotMatch(source, /\b(cookies|headers)\(/);
  assert.doesNotMatch(source, /dynamic\s*=\s*["']force-dynamic["']/);
  assert.match(read("app/(site)/[locale]/contact/contact-from-url.tsx"), /useSearchParams/);
});

test("/contact hydrates its form normally: only the URL reader sits in a Suspense boundary and the form is never keyed on the URL", () => {
  const view = code("app/(site)/[locale]/contact/contact-view.tsx");
  assert.match(view, /<Suspense fallback=\{null\}>\s*<ContactContextFromUrl/, "the useSearchParams reader must be wrapped in its own <Suspense fallback={null}> inside contact-view.tsx");
  assert.doesNotMatch(view, /<ContactForm[^>]*\bkey=/, "keying <ContactForm> on the URL remounts it when the context arrives and drops what the visitor already typed");
  assert.doesNotMatch(code("app/(site)/[locale]/contact/page.tsx"), /Suspense/, "a Suspense boundary around the whole view makes React throw the server HTML away and client-render it, which loses text typed before hydration finishes (measured: on a slow connection the name field came back empty). Keep the boundary around <ContactContextFromUrl> only");
});

test("the context read in the browser is the one the server used to read, repeated keys included", () => {
  const url = new URLSearchParams("service=brand-identity&tier=full-brand-system&source=%2Fpricing&utm_source=linkedin&utm_campaign=built-to-run&locale=ar");
  assert.deepEqual(parseContactContextFromSearch(url), parseContactContext(Object.fromEntries(url)));
  assert.equal(parseContactContextFromSearch(new URLSearchParams("")).service, "not-sure");
  // `?service=website&service=brand-identity` arrived as an array through searchParams and was ignored; it still is.
  assert.equal(parseContactContextFromSearch(new URLSearchParams("service=website&service=brand-identity")).service, "not-sure");
  // hostile values are dropped exactly as before
  assert.equal(parseContactContextFromSearch(new URLSearchParams("source=https%3A%2F%2Fspam.test%2Fx")).source, undefined);
});

test("links to /book and /cv are not prefetched (a per-visit page and a redirect: a prefetch of either is a function run)", () => {
  const source = read("components/ui/localized-link.tsx");
  assert.match(source, /prefetch\s*=\s*typeof href === "string" && \/\^\\\/\(\?:ar\\\/\)\?\(\?:book\|cv\)/, "LocalizedLink must switch prefetch off for /book and /cv");
  assert.match(source, /prefetch=\{prefetch\}\s*\{\.\.\.props\}/, "an explicit prefetch prop must still win");
});

test("the sitemap is regenerated at most once a day, and /cv is a config redirect, not a function", () => {
  const sitemap = read("app/sitemap.ts");
  const ttl = Number(sitemap.match(/export const revalidate = (\d+)/)?.[1]);
  assert.ok(ttl >= 86400, `sitemap revalidate is ${ttl}s; every regeneration is a CMS query plus a cold function`);
  assert.equal(filesUnder("app", (f) => /(^|\/)cv\/route\.ts$/.test(f)).length, 0, "app/cv/route.ts is back: /cv is a redirect in next.config.ts (a route handler is a function run per click)");
  assert.match(read("next.config.ts"), /source: "\/cv", destination: "\/Mustafa_Taha_Brand_Identity_CV\.docx"/);
});

test("the analytics beacon stores its row without loading Payload (it runs once per page view)", () => {
  // Loading and starting the CMS in a cold instance cost ~250 ms of CPU to write ten short strings. The table is
  // still Payload's; lib/analytics-store.test.ts keeps the hand-written INSERT in step with it.
  for (const rel of ["app/api/track/route.ts", "lib/analytics-store.ts"]) {
    const source = code(rel);
    assert.doesNotMatch(source, /from\s+["'](?:@\/lib\/payload|payload|@payload-config|@payloadcms\/[^"']+)["']/, `${rel} imports Payload: every cold POST /api/track would boot the CMS again`);
    assert.doesNotMatch(source, /import\(\s*["'](?:@\/lib\/payload|payload|@payload-config)/, `${rel} loads Payload dynamically`);
    assert.doesNotMatch(source, /\bgetPayload\b/, `${rel} calls getPayload()`);
  }
  assert.match(code("app/api/track/route.ts"), /insertAnalyticsEvent\(parsed\.record\)/, "the beacon route must store through lib/analytics-store.ts");
});
