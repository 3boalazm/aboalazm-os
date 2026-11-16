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
