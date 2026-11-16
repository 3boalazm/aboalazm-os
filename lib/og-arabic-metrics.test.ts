import assert from "node:assert/strict";
import { test } from "node:test";

/**
 * Satori boxes an Arabic word at the sum of its letters measured one by one in isolated form,
 * but draws it shaped. lib/og-arabic-metrics.ts measures the word the way it is drawn.
 */

test("an Arabic word is measured shaped, not letter by letter", async () => {
  const { arabicWordWidth } = await import("@/lib/og-arabic-metrics");
  const w = arabicWordWidth("الفاتورة", 60);
  assert.ok(w !== null, "the Arabic face should be readable from public/fonts");
  // shaped advance is about 160px at 60px; Satori's own box for it is about 208px
  assert.ok(w > 140 && w < 180, `unexpected width ${w}`);
});

test("the width scales with the font size", async () => {
  const { arabicWordWidth } = await import("@/lib/og-arabic-metrics");
  const big = arabicWordWidth("الخفية", 60);
  const small = arabicWordWidth("الخفية", 30);
  assert.ok(big !== null && small !== null);
  assert.ok(Math.abs(big / small - 2) < 0.05, `${big} vs ${small}`);
});

test("a word the Arabic face has no glyph for is left to Satori", async () => {
  const { arabicWordWidth } = await import("@/lib/og-arabic-metrics");
  assert.equal(arabicWordWidth("漢字", 60), null); // no CJK in the face
  assert.equal(arabicWordWidth("الـ漢", 60), null); // one missing glyph is enough
  assert.equal(arabicWordWidth("", 60), null);
});

test("the face's word space is a sensible gap", async () => {
  const { arabicSpaceWidth } = await import("@/lib/og-arabic-metrics");
  const gap = arabicSpaceWidth(60);
  assert.ok(gap !== null && gap > 6 && gap < 36, `unexpected space ${gap}`);
});

test("the ESM build that Next bundles for the server has named exports only", async () => {
  // The tests above load opentype.js through its CommonJS build, where a default import works.
  // Next bundles dist/opentype.mjs for the server, which has no default export: a default import
  // is undefined there and the measure silently falls back to Satori's wide boxes (it did, once).
  const entry = "opentype.js/dist/opentype.mjs";
  const esm = (await import(entry)) as { parse?: unknown; default?: unknown };
  assert.equal(typeof esm.parse, "function");
  assert.equal(esm.default, undefined);

  const { readFileSync } = await import("node:fs");
  const source = readFileSync("lib/og-arabic-metrics.ts", "utf8");
  assert.doesNotMatch(source, /^import\s+\w+\s+from\s+"opentype\.js"/m, "a default import is undefined in the server bundle");
});
