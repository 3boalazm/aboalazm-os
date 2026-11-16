import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";

/**
 * Satori has no bidi: it lays words out left to right and starts every line on the left. The
 * Arabic share cards get their right-to-left reading order from lib/og-rtl.tsx, which puts each
 * word in its own flex item inside a `row-reverse` wrapping container. These tests pin that
 * structure; lib/og-arabic.test.ts renders real titles through it.
 */

function useReact(): void {
  (globalThis as { React?: unknown }).React = React;
}

test("rtlRuns keeps Arabic words one by one, in reading order", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  assert.deepEqual(rtlRuns("اللوجو بـ٥٠ دولاراً: الفاتورة"), [
    { text: "اللوجو", arabic: true },
    { text: "بـ٥٠", arabic: true },
    { text: "دولاراً:", arabic: true },
    { text: "الفاتورة", arabic: true },
  ]);
});

test("rtlRuns keeps a run of Latin words together, left to right", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  assert.deepEqual(rtlRuns("كيف تبني Design Systems تخدم ERP"), [
    { text: "كيف", arabic: true },
    { text: "تبني", arabic: true },
    { text: "Design Systems", arabic: false },
    { text: "تخدم", arabic: true },
    { text: "ERP", arabic: false },
  ]);
});

test("rtlRuns ignores extra whitespace and empty input", async () => {
  const { rtlRuns } = await import("@/lib/og-rtl");
  assert.deepEqual(rtlRuns("   "), []);
  assert.deepEqual(rtlRuns(""), []);
  assert.deepEqual(rtlRuns("  مقالات \n"), [{ text: "مقالات", arabic: true }]);
});

type El = React.ReactElement<{ style: Record<string, unknown>; children: React.ReactElement<{ style: Record<string, unknown>; children: string }>[] }>;

test("RtlText is a row-reverse wrapping row, one item per word", async () => {
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
    el.props.children.map((c) => c.props.children),
    ["اللوجو", "بـ٥٠", "Design Systems"],
  );
});

test("RtlText pins an Arabic word to the width it is drawn at, and only that", async () => {
  useReact();
  const { RtlText } = await import("@/lib/og-rtl");
  const el = RtlText({
    text: "اللوجو Design",
    wordGap: 10,
    measure: (word) => (word === "اللوجو" ? 133.2 : 999),
  }) as El;
  const [arabic, latin] = el.props.children;
  assert.equal(arabic?.props.style.width, 134); // rounded up so the ink stays inside the box
  assert.equal(arabic?.props.style.flexShrink, 0);
  assert.equal(latin?.props.style.width, undefined); // Latin is measured correctly by Satori itself
});

test("RtlText leaves a word to Satori when it cannot be measured", async () => {
  useReact();
  const { RtlText } = await import("@/lib/og-rtl");
  const el = RtlText({ text: "اللوجو", wordGap: 10, measure: () => null }) as El;
  assert.equal(el.props.children[0]?.props.style.width, undefined);
});
