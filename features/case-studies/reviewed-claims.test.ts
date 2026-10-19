import assert from "node:assert/strict";
import { test } from "node:test";
import { NILE_PHARMA } from "./demo.data";
import { GAD_INSTITUTE } from "./gad-institute.data";
import { applyReviewedClaims, isRetiredTile } from "./reviewed-claims";
import type { CaseStudyRecord, KPI } from "./types";

/** What the database rows still hold: the strings the CMS was seeded with. */
const NILE_40: KPI = { value: "+40%", label: "Online Visibility", context: "POST WEBSITE LAUNCH" };
const NILE_25: KPI = { value: "+25%", label: "Customer Engagement", context: "6 MONTHS POST-REBRAND" };
const NILE_5Y: KPI = { value: "5y", label: "System In Production", context: "2020 → 2025" };
const LIVE_NILE_RESULTS: KPI[] = [NILE_40, NILE_25, NILE_5Y];

const GAD_0: KPI = { value: "0", label: "Brand system before", context: "STARTED FROM STRATEGY" };
const GAD_2: KPI = { value: "2", label: "Languages, one lockup", context: "AR / EN UNIFIED" };
const GAD_4: KPI = { value: "4", label: "Audiences to serve", context: "PATIENTS · TOURISTS · INSURERS · FAMILIES" };
const LIVE_GAD_KPIS: KPI[] = [GAD_0, GAD_2, GAD_4];

const liveNile = (): CaseStudyRecord => ({ ...NILE_PHARMA, results: LIVE_NILE_RESULTS });
const liveGad = (): CaseStudyRecord => ({ ...GAD_INSTITUTE, kpis: LIVE_GAD_KPIS });

test("Nile: the two retired outcome tiles give way to the reviewed ones, the third stays the CMS's", () => {
  const out = applyReviewedClaims(liveNile(), NILE_PHARMA);
  assert.equal(out.results.length, 3);
  assert.deepEqual(out.results[0], NILE_PHARMA.results[0]);
  assert.deepEqual(out.results[1], NILE_PHARMA.results[1]);
  assert.deepEqual(out.results[2], NILE_5Y);
  assert.ok(!out.results.some((r) => /40%|25%/.test(r.value)));
});

test("GAD: 'Brand system before' becomes the reviewed rebrand tile; the other two tiles are untouched", () => {
  const out = applyReviewedClaims(liveGad(), GAD_INSTITUTE);
  assert.deepEqual(out.kpis[0], GAD_INSTITUTE.kpis[0]);
  assert.deepEqual(out.kpis[1], GAD_2);
  assert.deepEqual(out.kpis[2], GAD_4);
});

test("a record with nothing retired comes back as the same object", () => {
  const record = { ...NILE_PHARMA };
  assert.equal(applyReviewedClaims(record, NILE_PHARMA), record);
  const gad = { ...GAD_INSTITUTE };
  assert.equal(applyReviewedClaims(gad, GAD_INSTITUTE), gad);
});

test("an edited tile is the CMS's again: any change to value, label or context stops the rule", () => {
  const edits: Partial<KPI>[] = [
    { context: "POST WEBSITE LAUNCH · GA4, 2021–22" },
    { label: "Online Visibility (organic sessions)" },
    { value: "+38%" },
  ];
  for (const edit of edits) {
    const record: CaseStudyRecord = {
      ...NILE_PHARMA,
      results: [{ ...NILE_40, ...edit }, NILE_25, NILE_5Y],
    };
    const out = applyReviewedClaims(record, NILE_PHARMA);
    assert.deepEqual(out.results[0], { ...NILE_40, ...edit }, JSON.stringify(edit));
  }
});

test("case, spacing and punctuation do not defeat the match", () => {
  assert.ok(isRetiredTile("nile-pharma", "results", { value: "+25 %", label: "customer  engagement", context: "6 months post rebrand" }));
  assert.ok(isRetiredTile("gad-institute", "kpis", { value: "0", label: "BRAND SYSTEM BEFORE", context: "Started from strategy" }));
});

test("the same words on another case study are left alone", () => {
  for (const slug of ["reflection", "ahmed-bedeer", "code-canvas"]) {
    assert.equal(isRetiredTile(slug, "results", NILE_40), false, slug);
    assert.equal(isRetiredTile(slug, "kpis", GAD_0), false, slug);
  }
  // …and a field mix-up: the Nile claims only count in `results`, the GAD one only in `kpis`.
  assert.equal(isRetiredTile("nile-pharma", "kpis", NILE_40), false);
  assert.equal(isRetiredTile("gad-institute", "results", GAD_0), false);
});

test("with no reviewed counterpart the retired tile is dropped and nothing else moves", () => {
  const out = applyReviewedClaims(liveNile(), undefined);
  assert.deepEqual(out.results, [NILE_5Y]);
  const short = applyReviewedClaims(liveNile(), { ...NILE_PHARMA, results: [] });
  assert.deepEqual(short.results, [NILE_5Y]);
});

test("the input record is not mutated", () => {
  const record = liveNile();
  applyReviewedClaims(record, NILE_PHARMA);
  assert.deepEqual(record.results, LIVE_NILE_RESULTS);
});

test("the reviewed source itself carries none of the retired tiles", () => {
  for (const [slug, record] of [["nile-pharma", NILE_PHARMA], ["gad-institute", GAD_INSTITUTE]] as const) {
    for (const field of ["kpis", "results"] as const) {
      for (const tile of record[field]) assert.equal(isRetiredTile(slug, field, tile), false, `${slug}.${field}: ${tile.value}`);
    }
  }
});
