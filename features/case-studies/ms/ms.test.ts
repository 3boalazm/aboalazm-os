import { test } from "node:test";
import assert from "node:assert/strict";
import { CHROME_MS } from "./chrome";
import { MALAY_CASE_SLUGS, loadCaseMs, loadCaseMsMeta } from "./load";
import { collectCaseStrings } from "./source-strings";

/** English function words that never belong in a finished Malay sentence. */
const ENGLISH_LEAK = /\b(the|and|with|your|that|this|for|of)\b/i;
const words = (s: string) => s.trim().split(/\s+/).length;
/** File names such as ASSET-AND-CLAIM-REGISTER and `code spans` are identifiers, not prose. */
const withoutIdentifiers = (s: string) => s.replace(/`[^`]*`/g, " ").replace(/\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+\b/g, " ");

/** Command lines and product-name + route labels that are shown verbatim in every language on purpose. */
const VERBATIM = new Set(["npm run check · npm run check:generated", "CanvasOne ERP · /erp/"]);

test("frame copy: every entry is a real translation", () => {
  for (const [en, ms] of Object.entries(CHROME_MS)) {
    assert.ok(ms.trim().length > 0, `empty Malay for "${en}"`);
    if (words(en) >= 4) assert.notEqual(ms, en, `untranslated frame copy: "${en}"`);
  }
});

for (const slug of MALAY_CASE_SLUGS) {
  test(`${slug}: every English string has a Malay line`, async () => {
    const dict = await loadCaseMs(slug);
    const missing = collectCaseStrings(slug).filter((s) => !(s in dict));
    assert.deepEqual(missing, [], `${missing.length} strings without Malay`);
  });

  test(`${slug}: no stale entries after the English copy changed`, async () => {
    const dict = await loadCaseMs(slug);
    const live = new Set([...collectCaseStrings(slug), ...Object.keys(CHROME_MS)]);
    const stale = Object.keys(dict).filter((k) => !live.has(k));
    assert.deepEqual(stale, [], `${stale.length} entries whose English source no longer exists`);
  });

  test(`${slug}: translations are real, complete sentences`, async () => {
    const dict = await loadCaseMs(slug);
    for (const [en, ms] of Object.entries(dict)) {
      assert.ok(ms.trim().length > 0, `empty Malay for "${en}"`);
      if (words(en) >= 4 && !VERBATIM.has(en)) assert.notEqual(ms, en, `untranslated: "${en}"`);
      if (words(ms) >= 6) assert.ok(!ENGLISH_LEAK.test(withoutIdentifiers(ms)), `English left in: "${ms}"`);
    }
  });

  test(`${slug}: Malay title and description fit a search result`, async () => {
    const meta = await loadCaseMsMeta(slug);
    assert.ok(meta, "meta missing");
    assert.ok(meta.title.length >= 20 && meta.title.length <= 50, `title ${meta.title.length} chars (the "· Mustafa Aboalazm" suffix adds 19)`);
    assert.ok(meta.description.length >= 110 && meta.description.length <= 165, `description ${meta.description.length} chars`);
  });
}

test("verbatim allow-list only names strings that still exist", async () => {
  const live = new Set<string>();
  for (const slug of MALAY_CASE_SLUGS) for (const k of Object.keys(await loadCaseMs(slug))) live.add(k);
  for (const en of VERBATIM) assert.ok(live.has(en), `"${en}" is on the allow-list but no longer in any dictionary`);
});
