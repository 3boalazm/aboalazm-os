import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { BUILT_IN_CASE_SLUGS, PROJECT_OVERVIEW_SLUGS } from "@/lib/case-registry";
import { PROJECTS } from "@/features/work/projects.data";
import { BUSINESS_CASES, getBusinessCase } from "./business-cases.data";
import { GAD_INSTITUTE } from "./gad-institute.data";
import { OVERVIEW_TECHNICAL_CASES } from "./overview-technical.data";

test("every built-in project has a complete bilingual Business Overview specification", () => {
  assert.equal(Object.keys(BUSINESS_CASES).length, BUILT_IN_CASE_SLUGS.length);

  for (const slug of BUILT_IN_CASE_SLUGS) {
    const entry = BUSINESS_CASES[slug];
    assert.ok(entry, `missing BUSINESS_CASES entry for ${slug}`);
    assert.equal(entry.slug, slug);
    assert.ok(entry.sector.en.trim().length > 3 && entry.sector.ar.trim().length > 3, `${slug}: sector`);
    assert.ok(entry.headline.en.trim().length > 20 && entry.headline.ar.trim().length > 20, `${slug}: headline`);
    assert.ok(entry.summary.en.trim().length > 60 && entry.summary.ar.trim().length > 60, `${slug}: summary`);
    assert.notEqual(entry.summary.en, entry.summary.ar, `${slug}: summary must be translated`);
    assert.equal(entry.snapshot.length, 4, `${slug}: expected 4 snapshot items`);
    assert.ok(entry.problemAndShift.beforePoints.length >= 3, `${slug}: expected >= 3 beforePoints`);
    assert.ok(entry.problemAndShift.afterPoints.length >= 3, `${slug}: expected >= 3 afterPoints`);
    assert.ok(entry.problemAndShift.stakeholders.length >= 3, `${slug}: expected >= 3 stakeholders`);
    assert.ok(entry.workflow.length >= 4, `${slug}: expected >= 4 workflow steps`);
    assert.equal(entry.features.length, 6, `${slug}: expected 6 feature cards`);
    assert.ok(entry.operationalNote.highlights.length >= 2, `${slug}: expected >= 2 operational highlights`);
  }

  for (const project of PROJECTS.filter((p) => p.hasCaseStudy)) {
    assert.ok(BUSINESS_CASES[project.slug], `missing BUSINESS_CASES for ledger project ${project.slug}`);
  }
});

test("GAD's client origin is explicit and consistent in both case-study views", () => {
  const expected = {
    code: "KSA",
    country: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
  };
  assert.deepEqual(GAD_INSTITUTE.clientOrigin, expected);
  assert.deepEqual(BUSINESS_CASES["gad-institute"]?.clientOrigin, expected);
  assert.match(GAD_INSTITUTE.researchSummary, /Saudi/i);
  assert.match(GAD_INSTITUTE.researchSummaryAr ?? "", /المملكة العربية السعودية/);
});

test("every project-overview slug has a structured Technical Case Study spec with an existing cover image", () => {
  for (const slug of PROJECT_OVERVIEW_SLUGS) {
    const spec = OVERVIEW_TECHNICAL_CASES[slug];
    assert.ok(spec, `missing OVERVIEW_TECHNICAL_CASES entry for ${slug}`);
    const imagePath = join(process.cwd(), "public", spec.cover.src.slice(1));
    assert.ok(existsSync(imagePath), `${slug} cover missing: ${spec.cover.src}`);
    assert.ok(spec.system.modules.length >= 4, `${slug}: expected >= 4 system modules`);
    assert.ok(spec.decisions.items.length >= 4, `${slug}: expected >= 4 decisions`);
  }
});

test("neither Business nor Technical overview specs reintroduce retired outcome claims", () => {
  const payload = JSON.stringify({ BUSINESS_CASES, OVERVIEW_TECHNICAL_CASES });
  assert.doesNotMatch(payload, /\+40%|\+25%|record registrations|تسجيلات قياسية/iu);
});

test("getBusinessCase synthesizes a valid fallback for future CMS-only slugs", () => {
  const fallback = getBusinessCase("future-cms-case");
  assert.equal(fallback.slug, "future-cms-case");
  assert.equal(fallback.snapshot.length, 4);
  assert.ok(fallback.workflow.length >= 2);
  assert.ok(fallback.features.length >= 1);
});

test("the speech-to-text product is published as Speech to Text Studio, never under its codename", () => {
  // The owner confirmed the public name. The codename may only survive inside the live URL
  // (https://mahtool.vercel.app), which cannot be renamed from here.
  const project = PROJECTS.find((p) => p.slug === "speech-to-text-studio");
  assert.equal(project?.name, "Speech to Text Studio");
  assert.equal(project?.nameAr, "استوديو تحويل الكلام إلى نص");
  const business = BUSINESS_CASES["speech-to-text-studio"];
  assert.ok(business, "missing BUSINESS_CASES entry for speech-to-text-studio");
  const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");
  const sources: Record<string, string> = {
    "business overview data": JSON.stringify(business),
    "case page": read("features/case-studies/speech-to-text-studio.tsx"),
    "case routes and metadata": read("app/(site)/[locale]/case-studies/[slug]/page.tsx"),
    "share card": read("app/(site)/[locale]/case-studies/[slug]/opengraph-image.tsx"),
    "project list": read("features/work/projects.data.ts"),
    "card teasers": read("features/work/featured-cases.tsx"),
  };
  // Only the https:// URL is allowed to carry the old spelling. Arabic vowel marks and tatweel are
  // stripped first, so a vowelled or stretched spelling cannot slip through.
  const normalise = (text: string) => text.replace(/https:\/\/mahtool\.vercel\.app\/?/gi, "").replace(/[\u064B-\u065F\u0640]/g, "");
  for (const [where, text] of Object.entries(sources)) {
    assert.doesNotMatch(normalise(text), /\bma+h?[-\s]?tool|ماهتول|مهتول|\bMHT\b/i, `${where} still names the product by its old codename`);
  }
});
