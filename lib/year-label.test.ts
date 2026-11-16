import assert from "node:assert/strict";
import { test } from "node:test";
import { yearLabel } from "./utils";
import { PROJECTS } from "../features/work/projects.data";

test("Arabic gets the leftwards arrow, which points the way an RTL line reads", () => {
  assert.equal(yearLabel("2024 →", true), "2024 ←");
  assert.equal(yearLabel("2017 → 2026", true), "2017 ← 2026");
});

test("English and Malay keep the rightwards arrow", () => {
  assert.equal(yearLabel("2024 →", false), "2024 →");
  assert.equal(yearLabel("2017 → 2026", false), "2017 → 2026");
});

test("a year with no arrow, or no year at all, comes back as it was", () => {
  assert.equal(yearLabel("2025", true), "2025");
  assert.equal(yearLabel("2020–25", true), "2020–25");
  assert.equal(yearLabel(undefined, true), undefined);
  assert.equal(yearLabel("", true), "");
});

test("it is safe to apply twice", () => {
  assert.equal(yearLabel(yearLabel("2024 →", true), true), "2024 ←");
});

test("every project year the site lists survives the Arabic pass with its digits intact", () => {
  for (const p of PROJECTS) {
    const ar = yearLabel(p.year, true);
    assert.equal(ar.replace(/[←→]/g, ""), p.year.replace(/[←→]/g, ""), p.slug);
    assert.ok(!ar.includes("→"), `${p.slug}: ${ar}`);
  }
});
