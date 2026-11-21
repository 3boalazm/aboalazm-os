import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { UNANSWERED, fieldDef, optionValuesOf } from "@/features/linkedin-session/assessment";

import {
  CSV_COLUMNS,
  GROUPED_SELECTS,
  GROUPED_TEXTS,
  buildSessionReport,
  normalizeRegistrationId,
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
    row({ yearOfStudy: "year-3", linkedinStatus: "active", goals: ["internship", "networking"], cvStatus: "ready", appliedBefore: "never", attendance: "registered", followUp: "new", college: "الحاسبات" }),
    row({ yearOfStudy: "year-1", linkedinStatus: "none", goals: ["job-ready"], cvStatus: "not-started", attendance: "registered", followUp: "reviewed", college: "التجارة" }),
    row({ fullName: "منى", linkedinStatus: "incomplete", goals: ["networking", "personal-brand", "freelance"], college: "الآداب", followUp: "replied" }),
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
  /* goals is a set: a bar counts the people who chose it, so the bars add up to
     the number of choices, not to the cohort — and nobody disappears. */
  const goalBars = report.dists.goals ?? [];
  const answers = goalBars.filter((d) => d.key !== "");
  assert.equal(answers.reduce((n, d) => n + d.value, 0), 6, "each of the six chosen goals must be counted once");
  assert.equal(goalBars.find((d) => d.key === "")?.value, 1, "the row that chose nothing is still on the chart");
  assert.equal(goalBars.find((d) => d.key === "networking")?.value, 2);
  assert.equal(goalBars.find((d) => d.key === "networking")?.pct, 50, "the percentage is of the whole cohort — two of four, not two of three");
  assert.deepEqual((report.dists.goals ?? []).map((d) => d.key).sort(), ["", "freelance", "internship", "job-ready", "networking", "personal-brand"], "every chosen value plus the unanswered row");

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
  const rows = Array.from({ length: 4 }, (_, i) => row({ goals: i < 3 ? ["internship"] : ["freelance"] }));
  const dist = buildSessionReport(rows).dists.goals ?? [];
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

test("a row that chose nothing still shows up in the goals chart, as unanswered", () => {
  const report = buildSessionReport([row({ goals: ["internship"] }), row({ goals: [] }), row({})]);
  const bars = report.dists.goals ?? [];
  assert.equal(bars.find((d) => d.key === "")?.value, 2, "both the empty array and the absent value are unanswered");
  assert.equal(bars.find((d) => d.key === "")?.label, UNANSWERED.ar);
  assert.equal(bars.reduce((n, d) => n + d.value, 0), 3, "the chart still accounts for every row");
});

test("the CSV flattens a set into one cell and guards what it would run", () => {
  const rows = [
    row({
      fullName: 'أحمد, "الصف الأول"\nمكرر',
      email: "a@b.co",
      goals: ["internship", "explore"],
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
  assert.ok(line.includes("internship; explore"), `a set becomes one cell: ${line}`);
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

/* ── deleting a registration ─────────────────────────────────────────────────
   The delete is irreversible and the action behind it is a public POST
   endpoint, so what is pinned here is the shape of the safety, not the
   behaviour of a database: the id is checked, the operator session is checked
   first, Payload's own access rule stays the boundary, the CV file goes in the
   same transaction (the bug that made this hang), and the button takes two
   clicks. The behaviour itself was exercised on a throwaway Postgres. */

const ROOT = process.cwd(); // npm scripts run from the repo root, like lib/cpu-guard.test.ts
const source = (rel: string) =>
  readFileSync(join(ROOT, rel), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

test("normalizeRegistrationId accepts only what Payload's serial ids can be", () => {
  assert.equal(normalizeRegistrationId(7), 7);
  assert.equal(normalizeRegistrationId("7"), 7);
  assert.equal(normalizeRegistrationId("1234567890"), 1234567890);
  for (const bad of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 2, "", " 7", "7 ", "07", "0", "-3", "1.5", "1e3", "0x10", "7; drop table", "٧", null, undefined, {}, [], [7], true]) {
    assert.equal(normalizeRegistrationId(bad), null, `must refuse ${JSON.stringify(bad)}`);
  }
});

test("deleteRegistration checks the session, then the id, and leaves access to Payload", () => {
  const code = source("app/studio/sessions/actions.ts");
  const start = code.indexOf("export async function deleteRegistration");
  assert.ok(start > -1, "the action exists");
  const body = code.slice(start);
  const order = [body.indexOf("getStudioUser("), body.indexOf("normalizeRegistrationId("), body.indexOf("payload.delete(")];
  assert.ok(order.every((i) => i > -1), `session check, id check and delete must all be there: ${order}`);
  assert.ok(order[0]! < order[1]! && order[1]! < order[2]!, "order must be session -> id -> delete, so nothing runs for a logged-out caller");
  assert.match(body, /overrideAccess:\s*false/, "Payload's access rule must stay the boundary");
  assert.match(body, /user:\s*user as never/, "the delete must run as the operator");
  assert.match(body, /collection:\s*"session-registrations"/);
  assert.equal(/where\s*:/.test(body), false, "delete by one validated id, never by a filter: a filter can match many rows");
});

test("the CV file is deleted inside the registration's transaction, and a failure is not swallowed", () => {
  const code = source("collections/SessionRegistrations.ts");
  const hook = code.slice(code.indexOf("afterDelete"));
  assert.match(hook, /payload\.delete\(\{[^}]*collection:\s*"session-files"[^}]*\breq\b[^}]*\}\)/, "without `req` the file delete opens a second transaction and deadlocks against cv_file_id");
  assert.equal(/\bcatch\b/.test(hook.slice(0, hook.indexOf("fields:"))), false, "a swallowed error would report success for a delete that was rolled back");
});

test("deleting asks twice, in the detail panel — the table's button only opens it", () => {
  const view = source("components/studio/sessions-view.tsx");
  assert.equal((view.match(/deleteRegistration\(/g) ?? []).length, 1, "one call site for the delete action");
  const start = view.indexOf("function DeleteRegistration");
  const control = view.slice(start, view.indexOf("function RegistrationDetail"));
  assert.ok(start > 0 && control.length > 0, "the control is where the slice expects it");
  assert.match(control, /onClick=\{\(\) => setArmed\(true\)\}/, "the first click only arms the confirmation");
  assert.ok(control.indexOf("setArmed(true)") < control.indexOf("onConfirm(row)"), "confirmation comes before the call");
  assert.match(control, /Escape/, "Escape cancels");
  assert.match(control, /e\.stopPropagation\(\)/, "...the confirmation only: the panel listens for Escape on window and would close with it");
  assert.match(control, /cancelRef\.current\?\.focus\(\)/, "the safe button takes focus, so a stray Enter cancels");
  assert.match(control, /setTimeout\(\(\) => cancelRef\.current\?\.focus\(\)/, "...deferred: the panel's own focus-on-open effect runs after this one and would win");
  assert.equal(/window\.confirm/.test(view), false, "a native dialog can be muted by the browser, which would turn the delete into a silent no-op");
  assert.match(view, /setRows\(\(rs\) => rs\.filter/, "the row leaves the list only after the server answered");

  // One confirmation, in the panel. A confirmation inside a table cell widened its column and clipped its own Cancel
  // button at 1600px, and the action column is outside the frame at 1440px and narrower (both measured), so the table's
  // button never deletes and never asks: it opens the panel with the question already on the screen.
  assert.equal((view.match(/<DeleteRegistration\b/g) ?? []).length, 1, "one confirmation, in the detail panel");
  assert.match(view, /<DeleteRegistration row=\{row\} onConfirm=\{onDelete\} initiallyArmed=\{autoArmDelete\} \/>/, "it starts armed when the panel was opened from the table");
  assert.match(view, /onClick=\{\(\) => openForDelete\(row\.id\)\}/, "the table's button opens the panel...");
  assert.match(view, /const openForDelete = \(id[^)]*\) => \{\s*setArmDelete\(true\);\s*setSelectedId\(id\);/, "...armed");
  assert.match(view, /const openDetail = \(id[^)]*\) => \{\s*setArmDelete\(false\);/, "the name button opens it plain");
  assert.match(view, /<RegistrationDetail[\s\S]*?onDelete=\{remove\}[\s\S]*?autoArmDelete=\{armDelete\}/, "the panel deletes through the one handler");
  assert.match(view, /const closeDetail = useCallback\(/, "a stable onClose: the panel re-runs its focus-on-open effect when it changes, which would pull focus off the safe button");
  assert.match(view, /onClose=\{closeDetail\}/, "and the panel uses it");
});
