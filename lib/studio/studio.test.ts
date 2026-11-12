import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { LOCALES } from "@/lib/locale";
import { STUDIO_COLLECTIONS, STUDIO_GLOBALS, extractMediaId, formatPayloadError, getCollectionMeta, getGlobalMeta, isMissingColumnError } from "@/lib/studio/cms";
import { fromLexical, toLexicalState } from "@/lib/studio/lexical";
import { extractSections, readingMinutes } from "@/features/writing/toc";

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
const PAGES = [
  "page.tsx",
  "analytics/page.tsx",
  "leads/page.tsx",
  "content/page.tsx",
  "manage/page.tsx",
  "manage/[collection]/page.tsx",
  "manage/[collection]/new/page.tsx",
  "manage/[collection]/[id]/page.tsx",
  "manage/globals/[slug]/page.tsx",
  "system/page.tsx",
].map((p) => read("app/studio", p));

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

/* ─────────────────────────────────────────────────────────── 6 · missing-column resilience */

test("content health degrades to an honest null instead of failing the page", () => {
  /* Collections/Projects.ts declares a `status` select that collides with
     Payload's `_status` enum (both map to enum_projects_status), so no
     migration creates projects.status. A database built from migrations only
     therefore fails the Projects read with Postgres 42703 — which used to take
     down every /studio page. The console must report "cannot source this"
     rather than print 0, and must never crash. */
  const metrics = read("lib", "studio/metrics.ts");
  assert.match(metrics, /projectsInProgress: number \| null/, "the metric must be nullable, not silently zero");
  assert.match(metrics, /42703/, "the missing-column error must be detected explicitly");
  assert.match(
    metrics,
    /select:\s*\{\s*\.\.\.SAFE_PROJECT_SELECT\s*\}/,
    "on 42703 it must retry selecting only columns that must exist",
  );

  /* The guard only helps if every projects read goes through it. Two callers
     (content health and the recent-activity feed) queried the collection
     directly, and fixing just one left every /studio page 500-ing. So: strip
     the helper's own body, and nothing outside it may read projects. */
  const helperStart = metrics.indexOf("async function readProjects(");
  const helperEnd = metrics.indexOf("\n}", helperStart);
  assert.ok(helperStart > -1 && helperEnd > helperStart, "readProjects helper not found");
  const outsideHelper = metrics.slice(0, helperStart) + metrics.slice(helperEnd);
  assert.doesNotMatch(
    outsideHelper,
    /collection:\s*"projects"/,
    "projects must be read only inside readProjects(), which tolerates the missing column",
  );
  assert.equal(
    [...metrics.matchAll(/readProjects\(/g)].length,
    3,
    "expected readProjects to be defined once and used by both callers",
  );

  const view = read("components/studio", "content-view.tsx");
  assert.match(view, /projectsInProgress === null/, "the UI must explain the missing column");
  assert.doesNotMatch(
    view,
    /<strong>\{content\.projectsInProgress\}<\/strong>/,
    "a null metric must not render as a bare number",
  );
});

/* ─────────────────────────────────────────────────────────── 7 · native CMS parity & safety */

test("all 10 collections and 2 globals are ported into Studio Manage", () => {
  const expectedCollections = [
    "projects",
    "case-studies",
    "posts",
    "media",
    "testimonials",
    "team-members",
    "messages",
    "resource-leads",
    "analytics-events",
    "users",
  ];
  const expectedGlobals = ["offers", "settings"];
  assert.deepEqual(
    STUDIO_COLLECTIONS.map((c) => c.slug).sort(),
    [...expectedCollections].sort(),
  );
  assert.deepEqual(
    STUDIO_GLOBALS.map((g) => g.slug).sort(),
    [...expectedGlobals].sort(),
  );
  for (const slug of expectedCollections) assert.ok(getCollectionMeta(slug));
  for (const slug of expectedGlobals) assert.ok(getGlobalMeta(slug));
  assert.equal(getCollectionMeta("nonexistent"), null);
  assert.equal(getGlobalMeta("nonexistent"), null);
});

test("CMS layer and actions never bypass Payload access control", () => {
  for (const file of [read("lib/studio", "cms.ts"), read("app/studio/manage", "actions.ts")]) {
    const calls = [...file.matchAll(/payload\.(find|findByID|create|update|delete|count|findGlobal|updateGlobal)\(/g)];
    assert.ok(calls.length > 0, "expected payload API calls");
    assert.match(file, /overrideAccess:\s*false/, "every Payload operation must enforce overrideAccess: false");
    assert.doesNotMatch(file, /overrideAccess:\s*true/, "Studio CMS must never bypass Payload access rules");
  }
});

test("no operational /admin links remain in Studio navigation or views", () => {
  const files = [
    SHELL,
    OVERVIEW,
    LEADS,
    CONTENT,
    SYSTEM,
    read("components/studio", "analytics-view.tsx"),
    read("components/studio", "manage-view.tsx"),
    read("lib/studio", "metrics.ts"),
    read("lib/studio", "seo.ts"),
    read("app/studio/content", "page.tsx"),
  ];
  for (const src of files) {
    assert.doesNotMatch(src, /\/admin(?:\/collections|\/globals|["'`])/, "all Studio links must stay on /studio/manage");
  }
});

test("Lexical bridge round-trips rich blocks, inline formatting, RTL, and TOC extraction", () => {
  const sample = {
    root: {
      type: "root",
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
      children: [
        { type: "heading", tag: "h2", version: 1, children: [{ type: "text", text: "System Architecture", version: 1 }] },
        {
          type: "paragraph",
          version: 1,
          children: [
            { type: "text", text: "Read ", format: 0, version: 1 },
            { type: "text", text: "bold", format: 1, version: 1 },
            { type: "text", text: " and ", format: 0, version: 1 },
            {
              type: "link",
              fields: { url: "https://example.com", newTab: true },
              version: 1,
              children: [{ type: "text", text: "docs", format: 0, version: 1 }],
            },
          ],
        },
        {
          type: "block",
          version: 2,
          fields: {
            blockType: "stats",
            items: [{ value: "99.9%", label: "Uptime" }],
          },
        },
        {
          type: "block",
          version: 2,
          fields: {
            blockType: "dataTable",
            markdown: "| Metric | Result |\n| --- | --- |\n| LCP | 0.8s |",
          },
        },
        {
          type: "block",
          version: 2,
          fields: {
            blockType: "diagram",
            caption: "Flow",
            code: "Manual sync -> Instant webhook",
          },
        },
      ],
    },
  };

  const blocks = fromLexical(sample);
  assert.equal(blocks.length, 5);
  assert.equal(blocks[0]!.kind, "h2");
  assert.equal(blocks[1]!.kind, "p");
  assert.equal(blocks[2]!.kind, "stats");
  assert.equal(blocks[3]!.kind, "dataTable");
  assert.equal(blocks[4]!.kind, "diagram");

  const rebuilt = toLexicalState(blocks, "ltr");
  assert.equal(rebuilt.root.children.length, 5);
  const reExtracted = fromLexical(rebuilt);
  assert.equal(reExtracted.length, 5);
  assert.equal(reExtracted[1]!.kind === "p" ? reExtracted[1]!.text : "", "Read **bold** and [docs](https://example.com)");
  const sections = extractSections(rebuilt);
  assert.deepEqual(sections, [{ no: "01", id: "s-system-architecture", text: "System Architecture" }]);
  assert.ok(readingMinutes(rebuilt) >= 1);

  assert.deepEqual(fromLexical(null), []);
  assert.equal(toLexicalState([], "rtl").root.direction, "rtl");
});

test("CMS utility helpers handle media IDs, 42703 detection, and validation messages", () => {
  assert.equal(extractMediaId(null), null);
  assert.equal(extractMediaId(42), 42);
  assert.equal(extractMediaId({ id: 17, url: "/media/x.png" }), 17);
  assert.equal(isMissingColumnError({ cause: { code: "42703" } }), true);
  assert.equal(isMissingColumnError({ code: "23505" }), false);
  assert.match(formatPayloadError({ data: { errors: [{ message: "Slug must be unique" }] } }), /Slug must be unique/);
});
