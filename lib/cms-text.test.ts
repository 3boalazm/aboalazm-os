import assert from "node:assert/strict";
import { test } from "node:test";
import { GAD_NAME_AR, GAD_SHORT_AR } from "./client-names";
import { latinDigits, normalizeCmsText } from "./cms-text";

test("Arabic-Indic and Persian digits become Latin; the separators follow", () => {
  assert.equal(latinDigits("٩+ سنوات · ٢٠١٧–٢٠٢٦"), "9+ سنوات · 2017–2026");
  assert.equal(latinDigits("۱۲۳٫۵ و ٥٠٪ و ١٬٠٠٠"), "123.5 و 50% و 1,000");
  assert.equal(latinDigits("٠١ / نبذة"), "01 / نبذة");
});

test("text without them is returned as is", () => {
  const s = "9+ yrs · 2017–26 · V2.0 · مرحبا";
  assert.equal(latinDigits(s), s);
});

test("retired spellings of the GAD Arabic name become the client's own", () => {
  assert.equal(normalizeCmsText("معهد GAD للقلب والرئة"), GAD_NAME_AR);
  assert.equal(normalizeCmsText("  معهد   جاد "), GAD_NAME_AR);
  assert.equal(normalizeCmsText("معهد GAD"), GAD_SHORT_AR);
  assert.equal(normalizeCmsText(GAD_NAME_AR), GAD_NAME_AR);
});

test("a sentence that merely contains the words is left alone", () => {
  const s = "معهد GAD للقلب والرئة هو عميل من الشرقية";
  assert.equal(normalizeCmsText(s), s);
});

test("it walks arrays and plain objects and touches strings only", () => {
  const input = {
    nameAr: "معهد GAD للقلب والرئة",
    kpis: [{ value: "٥", labelAr: "٥ سنوات", n: 5, ok: true, none: null }],
    tuple: ["10 days", "٧ – ١٠ أيام"],
    when: new Date("2026-10-15T00:00:00Z"),
  };
  const out = normalizeCmsText(input);
  assert.equal(out.nameAr, GAD_NAME_AR);
  assert.deepEqual(out.kpis, [{ value: "5", labelAr: "5 سنوات", n: 5, ok: true, none: null }]);
  assert.deepEqual(out.tuple, ["10 days", "7 – 10 أيام"]);
  assert.equal(out.when, input.when, "a Date passes through by reference");
  assert.equal(input.kpis[0]?.value, "٥", "the input is not mutated");
});

test("the client name is a hospital, as on the sign — not an institute", () => {
  assert.match(GAD_NAME_AR, /^مستشفى د\. غنام الدوسري/);
  assert.ok(!/معهد/.test(GAD_NAME_AR));
});
