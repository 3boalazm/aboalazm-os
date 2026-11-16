/**
 * POSITIONING GUARDRAILS — the 2026-11 repositioning, pinned down.
 *
 * These are not style tests. Each one protects a decision that was made
 * because a prospective client could not answer a commercial question:
 *
 *   · "Am I buying a studio or a freelancer?"        → studio model on /about
 *   · "What do they actually sell?"                  → three disciplines, not 12
 *   · "Who does the work?"                            → studio model band
 *   · "Which proof is a real client?"                 → evidence labels
 *   · "Do I have to pay before we even talk?"         → discovery-first funnel
 *   · "Is that contract finished?"                     → no public DRAFT markers
 *
 * If a future change reintroduces any of those doubts, this file fails.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import {
  AGREEMENT_TERMS,
  DEPOSIT_CTA_LABEL,
  DISCIPLINES,
  DISCOVERY_CTA_LABEL,
  FUNNEL_STEPS,
  PRODUCTION_MENU_NOTE,
  STRATEGIC_TIER_IDS,
  TIERS,
} from "@/lib/offers";
import { PROJECTS } from "@/features/work/projects.data";
import { evidenceOf, EVIDENCE_COPY, MEASURED_OUTCOME_SLUGS } from "@/features/work/project-evidence";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

test("the offer is grouped into exactly three disciplines, each with a real destination", () => {
  assert.equal(DISCIPLINES.length, 3);
  assert.deepEqual(
    DISCIPLINES.map((d) => d.id),
    ["brand", "digital", "systems"],
  );

  const hrefs = new Set<string>();
  for (const d of DISCIPLINES) {
    assert.ok(d.name[0].trim() && d.name[1].trim(), `${d.id}: bilingual name`);
    assert.ok(d.forWhom[0].length > 40 && d.forWhom[1].length > 20, `${d.id}: audience sentence`);
    assert.ok(d.outcome[0].length > 40 && d.outcome[1].length > 20, `${d.id}: business outcome`);
    assert.ok(d.includes.length >= 3, `${d.id}: deliverables`);
    assert.ok(d.from[0].trim() && d.from[1].trim(), `${d.id}: starting point`);
    assert.match(d.href, /^\/(services|contact)/, `${d.id}: href must resolve inside the site`);
    assert.ok(!hrefs.has(d.href), `${d.id}: duplicate href ${d.href}`);
    hrefs.add(d.href);
    assert.ok(d.plans.length >= 1, `${d.id}: must map to at least one bookable plan`);
  }
});

test("every strategic tier belongs to a discipline, and no plan is orphaned", () => {
  const mapped = new Set(DISCIPLINES.flatMap((d) => d.plans));
  for (const id of STRATEGIC_TIER_IDS) {
    assert.ok(mapped.has(id), `strategic tier ${id} is not reachable from any discipline`);
  }
  for (const tier of TIERS) {
    assert.ok(mapped.has(tier.id), `tier ${tier.id} has no discipline`);
  }
});

test("the funnel is discovery-first and the deposit is the last step, not the first", () => {
  assert.equal(FUNNEL_STEPS.length, 4);
  assert.match(FUNNEL_STEPS[0]!.title[0], /discovery call/i);
  assert.match(FUNNEL_STEPS[3]!.title[0], /deposit/i);
  assert.match(DISCOVERY_CTA_LABEL[0], /discovery call/i);
  assert.doesNotMatch(DISCOVERY_CTA_LABEL[0], /deposit/i);
  // The deposit label must never read as the opening ask.
  assert.doesNotMatch(DEPOSIT_CTA_LABEL[0], /^book with a deposit$/i);
  assert.match(DEPOSIT_CTA_LABEL[0], /deposit/i);

  // Home's primary conversion surfaces point at the conversation, not /book.
  for (const path of [
    "features/x/portal.tsx",
    "features/x/close.tsx",
    "features/home/home-bands.tsx",
    "features/offers/start-funnel.tsx",
    "components/layout/nav.tsx",
  ]) {
    const source = read(path);
    assert.doesNotMatch(
      source,
      /primaryHref=\{bookHref|href=\{bookHref\((?:tier\.id|"brand-identity")/,
      `${path} must not make the deposit page the primary first step`,
    );
  }
});

test("the production menu is explicitly framed as production, not strategy", () => {
  assert.match(PRODUCTION_MENU_NOTE[0], /not a substitute/i);
  assert.match(PRODUCTION_MENU_NOTE[1], /ليست بديلًا/);
  for (const path of ["app/(site)/[locale]/pricing/pricing-view.tsx", "app/(site)/[locale]/agreement/agreement-view.tsx"]) {
    assert.match(read(path), /PRODUCTION_MENU_NOTE/, `${path} must state the production-menu framing`);
  }
});

test("the founder-led studio model is stated wherever the visitor asks who they are buying", () => {
  const about = read("app/(site)/[locale]/about/about-view.tsx");
  assert.match(about, /StudioModelBand/);
  /* The new home (2026-11-16) states the model in its PROOF bento, from the
     same STUDIO_MODEL copy /about renders. */
  const home = read("app/(site)/[locale]/page.tsx");
  assert.match(home, /<Proof \/>/);
  assert.match(read("features/x/proof.tsx"), /STUDIO_MODEL/);
  const band = read("features/offers/disciplines.tsx");
  assert.match(band, /founder-led studio/i);
  assert.match(band, /when the scope needs more hands/i);
  assert.match(band, /استوديو يقوده مؤسسه/, "the studio model must exist in Arabic too");
});

test("every public project is labelled client / internal / demo / in development", () => {
  const labelable = PROJECTS.filter((p) => p.thumbnail);
  assert.ok(labelable.length > 10, "expected the full ledger");

  const seen = new Set<string>();
  for (const project of labelable) {
    const kind = evidenceOf(project);
    seen.add(kind);
    assert.ok(EVIDENCE_COPY[kind], `${project.slug}: unknown evidence kind ${kind}`);
    assert.ok(EVIDENCE_COPY[kind].en.trim() && EVIDENCE_COPY[kind].ar.trim());
    assert.ok(EVIDENCE_COPY[kind].note.en.length > 20 && EVIDENCE_COPY[kind].note.ar.length > 15);
  }

  // The classification must actually differentiate — a single bucket means the
  // label tells the reader nothing.
  assert.ok(seen.size >= 2, `expected several evidence kinds, got ${[...seen].join(", ")}`);
  assert.equal(evidenceOf({ slug: "code-canvas", category: "design", hasCaseStudy: true }), "internal");
  assert.equal(evidenceOf({ slug: "clinic-appointment-system", category: "development", isDemo: true, hasCaseStudy: false }), "demo");
  assert.equal(evidenceOf({ slug: "gad-institute", category: "design", hasCaseStudy: true }), "client");

  // `in-development` must be reachable from a real record — a defined-but-unused
  // bucket silently let work-in-progress ship under the "Client work" label.
  assert.equal(
    evidenceOf({ slug: "ummah-academy", category: "development", hasCaseStudy: true, status: "in-progress" }),
    "in-development",
  );
  // …but the more specific provenance of a studio/demo build still wins.
  assert.equal(
    evidenceOf({ slug: "code-canvas-dev", category: "development", hasCaseStudy: true, status: "in-progress" }),
    "internal",
  );
  assert.equal(
    evidenceOf({ slug: "clinic-appointment-system", category: "development", hasCaseStudy: false, isDemo: true, status: "in-progress" }),
    "demo",
  );

  for (const path of ["features/work/featured-cases.tsx", "features/case-studies/case-study-shell.tsx"]) {
    assert.match(read(path), /evidenceOf|EVIDENCE_COPY/, `${path} must show the provenance label`);
  }
});

test("no business outcome is claimed for a project with no measured evidence", () => {
  // The retired Nile Pharma figures may never return without a period + source.
  const banned = /\+40%|\+25%|data-stat-sales|increase in sales/i;
  for (const path of ["features/work/projects.data.ts", "features/x/proof.tsx", "portfolio/js/data.js"]) {
    assert.doesNotMatch(read(path), banned, `${path} still claims an unmeasured outcome`);
  }
  // Adding a slug here is the ONLY way to publish a measured figure — and it
  // must come with the case study stating period, method and source.
  for (const slug of MEASURED_OUTCOME_SLUGS) {
    assert.ok(PROJECTS.some((p) => p.slug === slug), `measured-outcome slug ${slug} is not a real project`);
  }
});

test("the published agreement carries no draft markers and states real cancellation terms", () => {
  assert.equal(AGREEMENT_TERMS.length, 12);
  const cancellation = AGREEMENT_TERMS.find((t) => t.n === "11");
  const late = AGREEMENT_TERMS.find((t) => t.n === "12");
  assert.ok(cancellation && late);
  assert.match(cancellation.body[0], /non-refundable/i);
  assert.match(late.body[0], /pauses/i);
  for (const path of [
    "app/(site)/[locale]/agreement/agreement-view.tsx",
    "lib/offers.ts",
  ]) {
    const source = read(path);
    // "draft" may only appear in comments that explain its retirement.
    const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.doesNotMatch(withoutComments, /DRAFT|مسودة/, `${path} must not publish draft wording`);
  }
});

test("the studio is described consistently on the pages and in structured data", () => {
  const schema = read("lib/structured-data.ts");
  assert.match(schema, /ORGANIZATION_ID/);
  assert.match(schema, /Aboalazm OS/);
  assert.match(read("features/x/portal.tsx"), /Aboalazm OS/, "the hero names the studio");
  assert.match(read("lib/structured-data.ts"), /founder: \{ "@id": PERSON_ID \}/);
});

test("the metadata still describes the repositioned offer, in both languages", () => {
  // The service catalogue was regrouped into three disciplines, but the page
  // description, the OG card and the Arabic homepage title were left describing
  // the retired five-service list. Social previews and Arabic SERP results were
  // selling a model the pages no longer use.
  for (const path of [
    "app/(site)/[locale]/services/page.tsx",
    "lib/og-pages.tsx",
  ]) {
    assert.doesNotMatch(read(path), /Five services/i, `${path} must not advertise the retired five-service model`);
  }

  const arMetadata = read("lib/localized-metadata.ts");
  for (const route of ["/partnership", "/services/systems"]) {
    assert.match(arMetadata, new RegExp(`"${route}": \\[`), `${route} needs an Arabic title/description`);
  }
  // The Arabic homepage title must name the studio, not only the person.
  const homeTitle = arMetadata.match(/"\/": \["([^"]+)"/)?.[1] ?? "";
  assert.match(homeTitle, /Aboalazm OS/, "the Arabic homepage title must name the studio");
  assert.match(homeTitle, /استوديو/, "the Arabic homepage title must say it is a studio");
  // Every discipline in the offer must be reachable in Arabic metadata.
  for (const d of DISCIPLINES) {
    const normalised = `/${d.href.replace(/^\/+/, "").replace(/^ar\//, "")}`;
    if (normalised !== "/services") {
      assert.match(arMetadata, new RegExp(`"${normalised}": \\[`), `${normalised} is missing from the Arabic metadata map`);
    }
  }
});
