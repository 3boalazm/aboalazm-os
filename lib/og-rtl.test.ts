import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";

/**
 * Satori has no bidi: it lays words out left to right and starts every line on the left, and
 * inside a word it keeps that habit, so the colon of «دولاراً:» lands before the word and the
 * digits of «بـ٥٠» swap places with the letter. The Arabic share cards get their right-to-left
 * order from lib/og-rtl.tsx: one flex item per word inside a `row-reverse` wrapping container,
 * and inside a word one flex run per stretch of letters / digits / Latin text / punctuation.
 * These tests pin that structure and compare the order with the Unicode bidirectional algorithm
 * (the expected strings below were produced with python-bidi, base direction right to left,
 * glyph mirroring applied). lib/og-arabic.test.ts renders real titles through it.
 */

function useReact(): void {
  (globalThis as { React?: unknown }).React = React;
}

type Item = { text: string; arabic: boolean }[];

/** What a left-to-right renderer would show: the items reversed, Arabic letters reversed too (python-bidi's convention). */
function visual(items: Item[]): string {
  return [...items]
    .reverse()
    .map((item) =>
      [...item]
        .reverse()
        .map((run) => (run.arabic ? [...run.text].reverse().join("") : run.text))
        .join(""),
    )
    .join(" ");
}

test("rtlRuns keeps Arabic words one by one, in reading order", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  assert.deepEqual(rtlRuns("اللوجو الفاتورة الخفية"), [
    [{ text: "اللوجو", arabic: true }],
    [{ text: "الفاتورة", arabic: true }],
    [{ text: "الخفية", arabic: true }],
  ]);
});

test("rtlRuns puts a colon or a full stop after its word, not before it", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  // reading order: the word first (rightmost), then the mark to its left
  assert.deepEqual(rtlRuns("دولاراً: المتراكمة."), [
    [{ text: "دولاراً", arabic: true }, { text: ":", arabic: false }],
    [{ text: "المتراكمة", arabic: true }, { text: ".", arabic: false }],
  ]);
  assert.deepEqual(rtlRuns("لماذا النظام؟"), [
    [{ text: "لماذا", arabic: true }],
    [{ text: "النظام", arabic: true }, { text: "؟", arabic: false }],
  ]);
});

test("rtlRuns puts digits after the letter that comes before them", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  assert.deepEqual(rtlRuns("بـ٥٠"), [[{ text: "بـ", arabic: true }, { text: "٥٠", arabic: false }]]);
  // a decimal separator or a slash between digits stays inside the number
  assert.deepEqual(rtlRuns("٣٫٥ ٢٠٢٦/١١/١٦"), [
    [{ text: "٣٫٥", arabic: false }],
    [{ text: "٢٠٢٦/١١/١٦", arabic: false }],
  ]);
  // a percent sign follows its number
  assert.deepEqual(rtlRuns("٥٠٪"), [[{ text: "٥٠", arabic: false }, { text: "٪", arabic: false }]]);
});

test("rtlRuns keeps a run of Latin words together, left to right", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  assert.deepEqual(rtlRuns("كيف تبني Design Systems تخدم ERP"), [
    [{ text: "كيف", arabic: true }],
    [{ text: "تبني", arabic: true }],
    [{ text: "Design Systems", arabic: false }],
    [{ text: "تخدم", arabic: true }],
    [{ text: "ERP", arabic: false }],
  ]);
  // a dash or an ampersand between two Latin words belongs to the phrase; so does a hyphen inside one
  assert.deepEqual(rtlRuns("Code & Canvas e-commerce"), [[{ text: "Code & Canvas e-commerce", arabic: false }]]);
  assert.deepEqual(rtlRuns("A-B و C-D"), [
    [{ text: "A-B", arabic: false }],
    [{ text: "و", arabic: true }],
    [{ text: "C-D", arabic: false }],
  ]);
});

test("rtlRuns mirrors brackets and quotes, which face the other way in right-to-left text", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  // logical «Code & Canvas»: the opening mark is first (rightmost), drawn as the closing glyph
  assert.deepEqual(rtlRuns("«Code & Canvas»"), [
    [{ text: "»", arabic: false }, { text: "Code & Canvas", arabic: false }, { text: "«", arabic: false }],
  ]);
  assert.deepEqual(rtlRuns("(٢٠٢٦)"), [
    [{ text: ")", arabic: false }, { text: "٢٠٢٦", arabic: false }, { text: "(", arabic: false }],
  ]);
  assert.deepEqual(rtlRuns("«مقالات»"), [
    [{ text: "»", arabic: false }, { text: "مقالات", arabic: true }, { text: "«", arabic: false }],
  ]);
});

test("rtlRuns reads European digits after an Arabic word the way Unicode does", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  // after Arabic letters the digits are Arabic numbers: a range keeps its first number on the right
  assert.deepEqual(rtlRuns("بتكلفة 50-60"), [
    [{ text: "بتكلفة", arabic: true }],
    [{ text: "50", arabic: false }, { text: "-", arabic: false }, { text: "60", arabic: false }],
  ]);
  // at the start of the line, or after a Latin word, they are plain left-to-right text
  assert.deepEqual(rtlRuns("50-60"), [[{ text: "50-60", arabic: false }]]);
  assert.deepEqual(rtlRuns("Code 50-60"), [[{ text: "Code 50-60", arabic: false }]]);
});

test("rtlRuns ignores extra whitespace and empty input", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  assert.deepEqual(rtlRuns("   "), []);
  assert.deepEqual(rtlRuns(""), []);
  assert.deepEqual(rtlRuns("  مقالات \n"), [[{ text: "مقالات", arabic: true }]]);
});

test("rtlRuns agrees with the Unicode bidirectional algorithm on real titles", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  const cases: [string, string][] = [
    ["اللوجو بـ٥٠ دولاراً: الفاتورة الخفية المتراكمة.", ".ةمكارتملا ةيفخلا ةروتافلا :ًارالود ٥٠ـب وجوللا"],
    ["البراند المنفصم: ليه شركتك بتتكلم", "ملكتتب كتكرش هيل :مصفنملا دناربلا"],
    ["كيف تبني Design Systems تخدم ERP؟", "؟ERP مدخت Design Systems ينبت فيك"],
    ["مصمم هوية «Code & Canvas» (٢٠٢٦) — ٥٠٪", "٪٥٠ — (٢٠٢٦) «Code & Canvas» ةيوه ممصم"],
    ["شركة Nile Pharma Food، أبرز عملائنا (٢٠٢٠–٢٠٢٥).", ".(٢٠٢٥–٢٠٢٠) انئالمع زربأ ،Nile Pharma Food ةكرش"],
    ["مشروع e-commerce بتكلفة 50-60 دولارًا شهريًا", "اًيرهش اًرالود 60-50 ةفلكتب e-commerce عورشم"],
    ["الفرق بين «النسخة العربية» و«الهوية العربية»: دليل", "ليلد :«ةيبرعلا ةيوهلا»و «ةيبرعلا ةخسنلا» نيب قرفلا"],
  ];
  for (const [logical, expected] of cases) assert.equal(visual(rtlRuns(logical)), expected, logical);
});

type Run = React.ReactElement<{ style: Record<string, unknown>; children: string }>;
type ItemEl = React.ReactElement<{ style: Record<string, unknown>; children: Run[] }>;
type El = React.ReactElement<{ style: Record<string, unknown>; children: ItemEl[] }>;

test("RtlText is a row-reverse wrapping row, one item per word and one run per stretch of it", async () => {
  useReact();
  const { RtlText } = await import("@/lib/og-rtl");
  const el = RtlText({ text: "اللوجو بـ٥٠ Design Systems", wordGap: 14, lineGap: 6 }) as El;
  assert.equal(el.props.style.display, "flex");
  assert.equal(el.props.style.flexDirection, "row-reverse");
  assert.equal(el.props.style.flexWrap, "wrap");
  assert.equal(el.props.style.justifyContent, "flex-start");
  assert.equal(el.props.style.columnGap, 14);
  assert.equal(el.props.style.rowGap, 6);
  assert.equal(el.props.style.width, "100%");
  assert.deepEqual(
    el.props.children.map((item) => item.props.children.map((run) => run.props.children)),
    [["اللوجو"], ["بـ", "٥٠"], ["Design Systems"]],
  );
  // a word is a row-reverse unit that does not wrap or shrink; its runs touch (no gap between them)
  for (const item of el.props.children) {
    assert.equal(item.props.style.display, "flex");
    assert.equal(item.props.style.flexDirection, "row-reverse");
    assert.equal(item.props.style.whiteSpace, "nowrap");
    assert.equal(item.props.style.flexShrink, 0);
    assert.equal(item.props.style.columnGap, undefined);
  }
});

test("RtlText pins an Arabic run to the width it is drawn at, and only that", async () => {
  useReact();
  const { RtlText } = await import("@/lib/og-rtl");
  const el = RtlText({
    text: "اللوجو Design",
    wordGap: 10,
    measure: (word) => (word === "اللوجو" ? 133.2 : 999),
  }) as El;
  const [arabic, latin] = el.props.children.map((item) => item.props.children[0]);
  assert.equal(arabic?.props.style.width, 134); // rounded up so the ink stays inside the box
  assert.equal(arabic?.props.style.flexShrink, 0);
  assert.equal(latin?.props.style.width, undefined); // Latin is measured correctly by Satori itself
});

test("RtlText leaves a word to Satori when it cannot be measured", async () => {
  useReact();
  const { RtlText } = await import("@/lib/og-rtl");
  const el = RtlText({ text: "اللوجو", wordGap: 10, measure: () => null }) as El;
  assert.equal(el.props.children[0]?.props.children[0]?.props.style.width, undefined);
});

test("RtlText leaves the vowel marks out: Satori would draw them at the foot of the letter", async () => {
  useReact();
  const { RtlText, withoutArabicMarks } = await import("@/lib/og-rtl");
  assert.equal(withoutArabicMarks("دولاراً يدّيها تُبنى مَكتبة"), "دولارا يديها تبنى مكتبة");
  assert.equal(withoutArabicMarks("اللوجو بـ٥٠ دولاراً: الفاتورة"), "اللوجو بـ٥٠ دولارا: الفاتورة"); // tatweel and digits stay
  const el = RtlText({ text: "فعلاً يدّيها", wordGap: 10 }) as El;
  assert.deepEqual(
    el.props.children.map((item) => item.props.children.map((run) => run.props.children)),
    [["فعلا"], ["يديها"]],
  );
});
