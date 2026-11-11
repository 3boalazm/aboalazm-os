import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { LOCALES } from "@/lib/locale";

/**
 * STUDIO CONSOLE — contract tests.
 *
 * These do not test React rendering (there is no DOM harness in this repo, and
 * adding one for a single dashboard would dwarf the dashboard). They test the
 * properties that actually broke, or would break silently:
 *
 *   1. NO INVENTED NUMBERS — a hard rule from the brief. Enforced structurally:
 *      the metrics module must not contain a literal used as a metric value, and
 *      every tile that renders a figure must carry a <Provenance> line.
 *   2. AUTH IS THE PAYLOAD SESSION — no second user store, no console-only
 *      credentials, and every screen requires a user before it reads data.
 *   3. ABSENT DATA IS ABSENT — the traffic/analytics tile that could not be
 *      built must not exist anywhere, not even as a placeholder.
 *   4. THE CONSOLE STAYS ISOLATED — its stylesheet never touches site tokens,
 *      and /studio is excluded from the locale middleware.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const read = (...p: string[]) => readFileSync(path.join(root, ...p), "utf8");

const METRICS = read("lib/studio", "metrics.ts");
const AUTH = read("lib/studio", "auth.ts");
const SHELL = read("components/studio", "shell.tsx");
const OVERVIEW = read("components/studio", "overview-view.tsx");
const LEADS = read("components/studio", "leads-view.tsx");
const CONTENT = read("components/studio", "content-view.tsx");
const SYSTEM = read("components/studio", "system-view.tsx");
const CSS = read("app/studio", "studio.css");
const MIDDLEWARE = read("middleware.ts");
const PAGES = ["page.tsx", "leads/page.tsx", "content/page.tsx", "system/page.tsx"].map((p) => read("app/studio", p));

/* ───────────────────────────────────────────────────────────── 1 · no fake numbers */

test("metrics module never hardcodes a metric value", () => {
  // Every returned number must be derived: a count, a sum, a division, or a
  // Date difference. A bare literal assigned to `value:` would be a demo number.
  const literalValue = /value:\s*-?\d/;
  assert.equal(literalValue.test(METRICS), false, "a metric value is a literal — metrics must be computed from queries");

  // The module must actually query. If someone replaces an implementation with
  // a constant, this drops to zero and the test fails.
  const queries = METRICS.match(/payload\.find\(|payload\.db\.drizzle\.execute\(/g) ?? [];
  assert.ok(queries.length >= 8, `expected real queries, found ${queries.length}`);
});

test("every numeric tile carries a provenance line", () => {
  for (const [name, source] of Object.entries({ OVERVIEW, LEADS, CONTENT, SYSTEM })) {
    // Count tiles that open, and provenance props supplied to them.
    const tiles = source.match(/<Tile\b/g) ?? [];
    const withProvenance = source.match(/<Tile\b[\s\S]*?provenance=/g) ?? [];
    assert.ok(tiles.length > 0, `${name}: no tiles found`);
    assert.equal(
      withProvenance.length,
      tiles.length,
      `${name}: ${tiles.length - withProvenance.length} tile(s) render without provenance — every number must state what it counts`,
    );
  }
});

test("the analytics gap is stated, not hidden", () => {
  // The 402 limitation has to be visible to the operator who wonders where the
  // traffic panel went. It is stated on three screens, in the metrics module,
  // and in the docs.
  for (const source of [OVERVIEW, SYSTEM]) {
    assert.match(source, /402/, "the analytics-plan limitation must be explained on screen");
  }
  assert.match(METRICS, /402/, "metrics.ts must document why traffic is absent");
  assert.match(read("docs/studio", "02_BLUEPRINT.md"), /402/);

  // …and no traffic/session/value metric may be faked anywhere.
  const forbidden = [
    /sessions?\s*[:=]\s*\d/i,
    /pageviews?\s*[:=]\s*\d/i,
    /visitors?\s*[:=]\s*\d/i,
    /bounceRate\s*[:=]/,
    /uniqueVisitors/,
  ];
  for (const pattern of forbidden) {
    assert.equal(pattern.test(METRICS), false, `metrics must not invent ${pattern}`);
  }
});

test("contracted value is never presented as revenue", () => {
  assert.match(
    METRICS + OVERVIEW + LEADS,
    /(not revenue|never as revenue|revenue booked is a different number)/i,
    "wonValue must be labelled as contracted value, not revenue",
  );
});

/* ─────────────────────────────────────────────────────────────── 2 · one auth system */

test("studio auth reuses the Payload session and has no second store", () => {
  assert.match(AUTH, /payload\.auth\(\{\s*headers/i, "must authenticate through Payload's own auth()");
  assert.match(AUTH, /redirect\(`\/studio\/login\?redirect=/);

  const all = Object.values({ AUTH, SHELL, OVERVIEW, LEADS, CONTENT, SYSTEM, ...PAGES }).join("\n");
  // No console-local password handling, no bcrypt, no own user table.
  assert.equal(/bcrypt|argon2|scrypt|new Map<string, .*password/i.test(all), false, "no second credential store");
  assert.equal(/process\.env\.STUDIO_PASSWORD|STUDIO_SECRET/i.test(all), false, "no console-only secret");
});

test("every studio page requires a user before reading data", () => {
  for (const [i, source] of PAGES.entries()) {
    const requireIdx = source.indexOf("requireStudioUser(");
    assert.ok(requireIdx > -1, `page ${i} does not call requireStudioUser()`);
    // The guard must come before the payload instance and before any metrics call.
    const payloadIdx = source.indexOf("await getPayload()");
    const metricsIdx = source.indexOf("loadOverview(");
    assert.ok(requireIdx < payloadIdx, `page ${i}: getPayload() runs before the auth guard`);
    if (metricsIdx > -1) assert.ok(requireIdx < metricsIdx, `page ${i}: metrics load before the auth guard`);
    // Pages must be dynamic: a cached dashboard lies about "now".
    assert.match(source, /export const dynamic = "force-dynamic"/);
  }
});

test("studio routes are excluded from locale rewriting", () => {
  // Without this, /studio → /en/studio → 404. It was a real bug.
  assert.match(MIDDLEWARE, /path === "\/studio" \|\| path\.startsWith\("\/studio\/"\)/);
  assert.match(MIDDLEWARE, /studio\(\?:\/\|\$\)/, "the middleware matcher must also skip /studio");
  // …and the marketing routes are still rewritten exactly as before.
  assert.match(MIDDLEWARE, /url\.pathname = `\/en\$\{path === "\/" \? "" : path\}`/);
});

/* ──────────────────────────────────────────────────── 3 · honest empty + error states */

test("empty states are real and explain themselves", () => {
  // The brief requires a genuine empty and error state per screen.
  for (const [name, source] of Object.entries({ OVERVIEW, LEADS, SYSTEM })) {
    assert.match(source, /EmptyState/, `${name} has no empty state`);
  }
  // No placeholder copy from a mock-up.
  const all = Object.values({ OVERVIEW, LEADS, CONTENT, SYSTEM }).join("\n");
  for (const junk of ["Lorem ipsum", "1234 visitors", "coming soon", "TODO"]) {
    assert.equal(all.toLowerCase().includes(junk.toLowerCase()), false, `placeholder copy found: ${junk}`);
  }
});

test("probes run real checks, and unverifiable ones say so", () => {
  assert.match(METRICS, /drizzle\.execute\("select 1 as ok"\)/, "database probe must round-trip the DB");
  assert.match(METRICS, /BLOB_READ_WRITE_TOKEN/, "storage probe must read the token the upload path uses");
  assert.match(METRICS, /SMTP_HOST/, "email probe must read the SMTP config");
  // Vercel/deployment status is not readable from the runtime; it must be
  // declared unverified rather than shown green.
  assert.match(SYSTEM, /Not verified from here/);
});

/* ───────────────────────────────────────────────────────── 4 · isolation of the console */

test("studio stylesheet cannot leak into the marketing site", () => {
  // Every rule is scoped under .studio (or a keyframes / media query wrapper).
  const rules = CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors = [...rules.matchAll(/(^|\})\s*([^{}@]+)\{/g)].map((m) => m[2]!.trim()).filter(Boolean);
  const unscoped = selectors.filter((sel) => {
    if (sel.startsWith("@")) return false;
    if (/^(from|to|\d+%)/.test(sel)) return false;
    return !sel.split(",").every((part) => part.trim().startsWith(".studio") || part.trim().startsWith("[dir="));
  });
  assert.deepEqual(unscoped, [], `unscoped selectors would leak into the site: ${unscoped.join(" | ")}`);

  // It must not redefine a site token either.
  for (const token of ["--color-accent:", "--color-surface-0:", "--spacing:"]) {
    assert.equal(CSS.includes(token), false, `studio.css must not redefine ${token}`);
  }
});

test("the console does not ship the marketing site's providers", () => {
  const layout = read("app/studio", "layout.tsx");
  for (const heavy of ["SmoothScroll", "TerminalOverlay", "PersonaProvider", "Analytics", "OsTray", "PwaRegistration"]) {
    assert.equal(layout.includes(heavy), false, `studio layout must not mount ${heavy}`);
  }
  // …but it does use the brand's real faces.
  assert.match(layout, /montserrat/);
  assert.match(layout, /jetbrains-mono/);
});

/* ──────────────────────────────────────────────────────────── 5 · language drift guard */

test("Messages.locale covers every live LOCALES entry", () => {
  // Finding #2 in docs/studio/03_SCHEMA_FINDINGS.md: Malay went live while the
  // select still offered only en/ar, so a Malay enquiry could not be saved.
  const messages = read("collections", "Messages.ts");
  const localeField = messages.slice(messages.indexOf('name: "locale"'), messages.indexOf('name: "locale"') + 400);
  for (const locale of LOCALES) {
    assert.ok(
      localeField.includes(`value: "${locale}"`) || localeField.includes(`"${locale}"`),
      `messages.locale is missing "${locale}" — a visitor using that locale cannot submit the form`,
    );
  }
});

test("studio css has no external network dependency", () => {
  // Fonts are self-hosted; a dashboard must render on an air-gapped preview.
  assert.equal(/@import\s+url\(|https?:\/\/[^"')\s]+\.(woff2?|css)/.test(CSS), false);
  assert.equal(/fonts\.googleapis|fonts\.gstatic/.test(CSS), false);
});

test("studio files are the only ones added outside the site tree", () => {
  // A guard against the console quietly becoming its own app: everything it
  // adds lives under app/studio, components/studio, lib/studio or docs/studio.
  const allowed = ["app/studio", "components/studio", "lib/studio", "docs/studio"];
  for (const dir of ["app", "components", "lib"]) {
    const entries = readdirSync(path.join(root, dir));
    for (const entry of entries) {
      if (!entry.includes("studio")) continue;
      const full = path.join(root, dir, entry);
      const rel = path.relative(root, statSync(full).isDirectory() ? full : path.dirname(full)).split(path.sep).join("/");
      assert.ok(allowed.some((a) => rel === a || rel.startsWith(`${a}/`)), `${rel} is outside the studio tree`);
    }
  }
});
