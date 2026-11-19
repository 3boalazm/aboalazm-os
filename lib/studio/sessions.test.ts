import assert from "node:assert/strict";
import test from "node:test";

import { UNANSWERED, fieldDef, optionValuesOf } from "@/features/linkedin-session/assessment";

import {
  CSV_COLUMNS,
  GROUPED_SELECTS,
  GROUPED_TEXTS,
  buildSessionReport,
  registrationCsv,
  type SessionRegistrationRow,
} from "./sessions";

/**
 * اللوحة تعرض أرقامًا تُقرأ منها خطة محاضرة، فالحساب يجب أن يكون صحيحًا بلا
 * قاعدة بيانات: هذه الاختبارات تبني صفوفًا يدويًا وتتحقق من أن كل مسجّل يُعدّ
 * مرة واحدة بالضبط، وأن النسبة لا تنفجر عند الصفر، وأن الفراغ يظهر كـ"لم يُجب"
 * بدل أن يختفي، وأن الـ CSV لا ينفّذ صيغة جدول ولا يكسر صفًا بفاصلة.
 */

function row(over: Partial<SessionRegistrationRow> = {}): SessionRegistrationRow {
  return {
    id: Math.random().toString(36).slice(2),
    fullName: "مسجّل",
    email: "a@example.com",
    ...over,
  };
}

test("an empty cohort reports zeros, not NaN and not a crash", () => {
  const report = buildSessionReport([]);
  assert.equal(report.total, 0);
  assert.equal(report.needsAccount, 0);
  assert.deepEqual(report.challenges, []);
  for (const field of [...GROUPED_SELECTS, ...GROUPED_TEXTS]) {
    assert.deepEqual(report.dists[field] ?? [], [], `${field} must be an empty list with no rows`);
  }
  const json = JSON.stringify(report);
  assert.equal(/NaN|Infinity|null,"/.test(json), false, `unusable number in the report: ${json.slice(0, 200)}`);
});

test("every registrant is counted exactly once in every chart", () => {
  const rows = [
    row({ yearOfStudy: "year-3", linkedinStatus: "active", goal: "internship", cvStatus: "ready", appliedBefore: "never", attendance: "registered", followUp: "new", college: "الحاسبات" }),
    row({ yearOfStudy: "year-1", linkedinStatus: "none", goal: "job-ready", cvStatus: "not-started", attendance: "registered", followUp: "reviewed", college: "التجارة" }),
    row({ fullName: "منى", linkedinStatus: "incomplete", goal: "networking", college: "الآداب", followUp: "replied" }),
    /* لم يُجب عن كل شيء اختياري — يجب أن يظهر تحت "لم يُجب" لا أن يسقط. */
    row({ fullName: "مهملة", college: undefined, interestArea: "  " }),
  ];
  const report = buildSessionReport(rows);
  assert.equal(report.total, rows.length);

  for (const field of GROUPED_SELECTS) {
    const list = report.dists[field] ?? [];
    const sum = list.reduce((n, d) => n + d.value, 0);
    assert.equal(sum, rows.length, `${field}: a chart that does not add up to the cohort hides people`);
  }

  const statuses = report.dists.linkedinStatus ?? [];
  const blank = statuses.find((d) => d.key === "");
  assert.equal(statuses.find((d) => d.key === "incomplete")?.value, 1);
  assert.ok(blank, "a row with no answer must still appear");
  assert.equal(blank.label, UNANSWERED.ar);
  assert.equal(statuses.find((d) => d.key === "active")?.value, 1);
  assert.equal(report.needsAccount, 2, "none and incomplete both need the first 20 minutes");
  assert.equal(report.unreviewed, 2, "new plus the row that never got a stage");
  assert.equal(report.activeAccounts, 1);
});

test("percentages are of the whole cohort, so two charts can be read together", () => {
  const rows = Array.from({ length: 4 }, (_, i) => row({ goal: i < 3 ? "internship" : "freelance" }));
  const dist = buildSessionReport(rows).dists.goal ?? [];
  assert.equal(dist.find((d) => d.key === "internship")?.pct, 75);
  assert.equal(dist.find((d) => d.key === "freelance")?.pct, 25);
  assert.equal(dist.reduce((n, d) => n + d.pct, 0), 100);
});

test("a free-text field folds its long tail instead of flooding the panel", () => {
  const rows = Array.from({ length: 10 }, (_, i) => row({ college: `كلية ${i}` }));
  const dist = buildSessionReport(rows).dists.college ?? [];
  assert.equal(dist.length, 9, "eight real values plus one folded remainder");
  const other = dist.at(-1);
  assert.equal(other?.key, "__other__");
  assert.equal(other?.value, 2);
  assert.equal(dist.reduce((n, d) => n + d.value, 0), rows.length, "folding must not lose rows");
});

test("open answers are grouped by their typed text and keep who said them", () => {
  const rows = [
    row({ fullName: "أحمد", biggestChallenge: "لا أعرف كيف أكتب headline" }),
    row({ fullName: "سارة", biggestChallenge: "لا أعرف كيف أكتب HEADLINE" }),
    row({ fullName: "منى", biggestChallenge: "الخوف من النشر", questionForSession: "هل أبدأ بشركة أم بعمل حر؟" }),
    row({ fullName: "فارس", biggestChallenge: "   " }),
  ];
  const report = buildSessionReport(rows);
  assert.equal(report.challenges.length, 2, "one blank answer is not a challenge, and case-only differences are one line");
  assert.deepEqual(
    report.challenges.map((c) => [c.text, c.count]),
    [
      ["لا أعرف كيف أكتب headline", 2],
      ["الخوف من النشر", 1],
    ],
  );
  assert.deepEqual(report.challenges[0]?.names, ["أحمد", "سارة"]);
  assert.equal(report.questions.length, 1);
  assert.equal(report.withOpenAnswer, 3, "three people wrote something open-ended");
});

test("the CV figure counts the stored file, not the answer about it", () => {
  const rows = [
    row({ cvFile: 12 }),
    row({ cvFile: { id: 13, url: "/x.pdf", filename: "x.pdf" } }),
    row({ cvFile: null, cvStatus: "ready" }),
  ];
  const report = buildSessionReport(rows);
  assert.equal(report.withCvFile, 2);
  assert.equal(report.cvReady, 1);
  assert.equal(report.unreviewed, 3, "a missing followUp stage means nobody has looked at it yet");
});

test("the CSV escapes what Excel would eat and guards what it would run", () => {
  const rows = [
    row({
      fullName: 'أحمد, "الصف الأول"\nمكرر',
      email: "a@b.co",
      college: "=HYPERLINK(\"http://evil.test\")",
      biggestChallenge: "+15 سببًا كررتها كل كلية",
      cvFile: { id: 9, url: "/cv.pdf", filename: "cv.pdf" },
      createdAt: "2026-11-19T10:00:00.000Z",
    }),
  ];
  const [head, line] = registrationCsv(rows).split("\r\n");
  assert.equal(head, CSV_COLUMNS.join(","));
  assert.ok(line, "one row per registrant");
  assert.ok(line.includes('"أحمد, ""الصف الأول"" مكرر"'), `newlines and quotes must be quoted and doubled: ${line}`);
  assert.ok(line.includes("'=HYPERLINK"), "a leading = must not become a formula");
  assert.ok(line.includes("'+15"), "a leading + must not become a formula");
  assert.ok(line.includes(",yes,"), "the file column reports presence, never a raw object");
  assert.equal(line.includes("[object Object]"), false);
  assert.equal(registrationCsv([]).split("\r\n").length, 1, "an empty cohort still exports a header row");
});

test("every column the export promises is a field the form actually collects", () => {
  for (const column of CSV_COLUMNS) {
    if (column === "hasCvFile") {
      assert.ok(fieldDef("cvFile"), "the presence column stands in for the upload field");
      continue;
    }
    if (["attendance", "followUp", "notes", "sessionKey", "createdAt"].includes(column)) continue; // حقول المشغّل
    assert.ok(fieldDef(column), `${column} is exported but no question collects it`);
  }
});

test("every grouped field has a real option list to label the chart with", () => {
  for (const field of GROUPED_SELECTS) {
    const values = optionValuesOf(field);
    assert.ok(values.length >= 2, `${field} is charted but has no options in assessment.ts`);
  }
  for (const field of GROUPED_TEXTS) {
    assert.equal(optionValuesOf(field).length, 0, `${field} must stay free text — a chart of invented buckets is worse than none`);
  }
});
