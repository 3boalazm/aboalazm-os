import assert from "node:assert/strict";
import test from "node:test";

import { ALL_FEEDBACK_FIELDS, feedbackOptionValues } from "@/features/linkedin-session/feedback";

import {
  FEEDBACK_CSV_COLUMNS,
  buildFeedbackReport,
  feedbackCsv,
  normalizeFeedbackId,
  responseRate,
  type FeedbackRow,
} from "./feedback";

function row(over: Partial<FeedbackRow> = {}): FeedbackRow {
  return {
    id: Math.random().toString(36).slice(2),
    rating: 5,
    confidenceBefore: 2,
    confidenceAfter: 4,
    pace: "right",
    recommend: "yes",
    nextStep: "headline",
    mostUseful: ["profile"],
    ...over,
  };
}

test("an empty cohort gives nulls, not NaN", () => {
  const r = buildFeedbackReport([]);
  assert.equal(r.total, 0);
  assert.equal(r.avgRating, null);
  assert.equal(r.lift, null);
  assert.deepEqual(r.mostUseful, []);
  assert.equal(r.ratingDist.length, 5);
  assert.ok(r.ratingDist.every((d) => d.value === 0 && d.pct === 0));
});

test("averages, lift and who got more confident are counted from rows", () => {
  const r = buildFeedbackReport([
    row({ rating: 5, confidenceBefore: 1, confidenceAfter: 4 }),
    row({ rating: 4, confidenceBefore: 3, confidenceAfter: 3 }),
    row({ rating: 3, confidenceBefore: 4, confidenceAfter: 3 }),
  ]);
  assert.equal(r.avgRating, 4);
  assert.equal(r.avgBefore, 2.7);
  assert.equal(r.avgAfter, 3.3);
  assert.equal(r.lift, 0.6);
  assert.equal(r.moreConfident, 1);
  assert.equal(r.same, 1);
  assert.equal(r.lessConfident, 1);
});

test("multi-answer bars count each person once per choice and may pass 100%", () => {
  const r = buildFeedbackReport([
    row({ mostUseful: ["profile", "scams", "profile"] }),
    row({ mostUseful: ["profile", "demos"] }),
  ]);
  const profile = r.mostUseful.find((d) => d.key === "profile");
  assert.equal(profile?.value, 2);
  assert.equal(profile?.pct, 100);
  assert.equal(r.mostUseful.reduce((s, d) => s + d.value, 0), 4);
});

test("every stored option has an Arabic label, never the raw key", () => {
  for (const field of ["pace", "recommend", "nextStep", "mostUseful"] as const) {
    const values = feedbackOptionValues(field);
    const r = buildFeedbackReport(
      values.map((v) => row(field === "mostUseful" ? { mostUseful: [v] } : ({ [field]: v } as Partial<FeedbackRow>))),
    );
    for (const d of r[field]) assert.notEqual(d.label, d.key, `${field}:${d.key} has no label`);
  }
});

test("open answers keep anonymity; quotes need both consent and a name", () => {
  const r = buildFeedbackReport([
    row({ bestPart: "  الديمو  ", fullName: "منى", allowQuote: true }),
    row({ bestPart: "الرسايل", allowQuote: true }),
    row({ bestPart: "التمارين", fullName: "علي", allowQuote: false }),
    row({ bestPart: "   " }),
  ]);
  assert.equal(r.bestPart.length, 3);
  assert.deepEqual(r.quotes.map((q) => q.name), ["منى"]);
  assert.equal(r.bestPart[1]?.name, null);
});

test("response rate is null with no audience and capped at 100", () => {
  assert.equal(responseRate(3, 0), null);
  assert.equal(responseRate(3, 12), 25);
  assert.equal(responseRate(15, 12), 100);
});

test("feedback id is validated like the registration id", () => {
  assert.equal(normalizeFeedbackId(7), 7);
  assert.equal(normalizeFeedbackId("12"), 12);
  for (const bad of [0, -1, 1.5, "0", "01", "1e3", "0x10", " 1", {}, null, undefined]) assert.equal(normalizeFeedbackId(bad), null);
});

test("CSV: header matches columns, formulas are defanged, sets use '; '", () => {
  const csv = feedbackCsv([row({ fullName: "=HYPERLINK(1)", bestPart: 'قال "حلو", جدًا\nفعلًا', mostUseful: ["profile", "demos"], allowQuote: true })]);
  const [head, line] = csv.split("\r\n");
  assert.equal(head, FEEDBACK_CSV_COLUMNS.join(","));
  assert.ok(line!.includes("'=HYPERLINK(1)"));
  assert.ok(line!.includes("profile; demos"));
  assert.ok(line!.includes('"قال ""حلو"", جدًا فعلًا"'));
  assert.ok(line!.includes(",yes,"));
});

test("every CSV column is a real feedback field or bookkeeping", () => {
  const known = new Set([...ALL_FEEDBACK_FIELDS.map((f) => f.name), "sessionKey", "createdAt"]);
  for (const c of FEEDBACK_CSV_COLUMNS) assert.ok(known.has(c), c);
});
