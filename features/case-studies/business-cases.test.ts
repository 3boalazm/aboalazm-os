import assert from "node:assert/strict";
import { existsSync } from "node:fs";
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
