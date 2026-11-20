import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { ALL_FIELDS, CV_MAX_BYTES, FIELD_GROUPS, SESSIONS, firstFieldWithError, isNativelyRequired, optionValuesOf, payloadOptions } from "./assessment";

/**
 * The questionnaire is the contract between four files: the form, the
 * validator, the Payload collection and the console. Each of them derives from
 * ./assessment.ts, so the tests here are not about behaviour — they pin the
 * invariants that make deriving safe. Every one of them is a defect that has
 * already happened somewhere in this repo's history (an option the database
 * enum lacked, a required question that was not required, a form and a column
 * disagreeing about length).
 */

const root = process.cwd();
const collectionSource = readFileSync(path.join(root, "collections/SessionRegistrations.ts"), "utf8");
const formSource = readFileSync(path.join(root, "features/linkedin-session/registration-form.tsx"), "utf8");

test("field names are unique and grouped in the order the brief dictates", () => {
  const names = ALL_FIELDS.map((f) => f.name);
  assert.equal(new Set(names).size, names.length, "a repeated field name would overwrite its own answer");
  assert.deepEqual(
    FIELD_GROUPS.map((g) => g.id),
    ["identity", "level", "goals", "prep"],
  );
});

test("the questions the session cannot be planned without are the required ones", () => {
  /* من ملاحظة التنفيذ: الاسم والبريد والتخصص والسنة الدراسية ومستوى LinkedIn
     والهدف المهني أساسية، ورابط LinkedIn ورفع الـ CV اختياريان. */
  assert.deepEqual(
    ALL_FIELDS.filter((f) => f.required).map((f) => f.name),
    ["fullName", "email", "college", "yearOfStudy", "linkedinStatus", "goals"],
  );
  for (const optional of ["linkedinUrl", "cvFile", "university", "appliedBefore", "cvStatus", "interestArea", "biggestChallenge", "questionForSession"]) {
    const field = ALL_FIELDS.find((f) => f.name === optional);
    assert.ok(field, `${optional} must exist`);
    assert.equal(field.required, false, `${optional} was agreed to be optional`);
  }
});

test("every select, radio and multi field offers at least two coded answers, and values are unique", () => {
  for (const field of ALL_FIELDS) {
    if (field.type !== "select" && field.type !== "radio" && field.type !== "multi") continue;
    const values = optionValuesOf(field.name);
    assert.ok(values.length >= 2, `${field.name} must offer real choices`);
    assert.equal(new Set(values).size, values.length, `${field.name} repeats an option value`);
    for (const value of values) assert.match(value, /^[a-z0-9-]+$/, `${field.name}: "${value}" must be enum-safe (lowercase, digits, hyphen)`);
  }
});

test("the collection declares the same fields, options and caps as the questionnaire", () => {
  for (const field of ALL_FIELDS) {
    assert.ok(collectionSource.includes(`name: "${field.name}"`), `collections/SessionRegistrations.ts has no field "${field.name}"`);
  }
  for (const field of ALL_FIELDS) {
    if (field.type !== "select" && field.type !== "radio") continue;
    const declared = payloadOptions(field.name);
    assert.ok(declared.length > 0, `${field.name} has no options to give Payload`);
    assert.ok(
      collectionSource.includes(`payloadOptions("${field.name}")`),
      `${field.name} must take its options from payloadOptions() rather than a second literal list`,
    );
  }
  for (const cap of ["FULL_NAME_MAX", "COLLEGE_MAX", "UNIVERSITY_MAX", "LINKEDIN_URL_MAX", "INTEREST_MAX", "ANSWER_MAX"]) {
    assert.ok(collectionSource.includes(cap), `the collection must import ${cap} so input and column agree`);
    assert.ok(collectionSource.includes(`maxLength: ${cap}`), `${cap} must be applied as maxLength on the column`);
  }
  /* Required in the form means required in the database: an optional column is
     how a half-filled row becomes invisible to the dashboard. */
  for (const field of ALL_FIELDS.filter((f) => f.required && f.type !== "file")) {
    const at = collectionSource.indexOf(`name: "${field.name}"`);
    assert.ok(at > -1);
    const window = collectionSource.slice(at, at + 240);
    assert.match(window, /required:\s*true/, `${field.name} is required in the form but not in the collection`);
  }
});

/** The form without comments: a comment that explains why something is gone must not satisfy (or trip) a guard. */
const formCode = formSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

test("required answers are enforced by our own check, not by the browser — a browser block is silent", () => {
  /* 19–20 Nov 2026: this test used to demand `required={field.required}`, i.e. that the browser
     enforce it. Every goals checkbox then carried `required`, HTML reads that as "THIS box must be
     ticked", and someone who ticked 4 goals of 6 was stopped on the other two before any of our
     code ran — with a bubble that is easy to miss and that some browsers never draw. Nothing was
     sent and nothing said why. The contract is now: the form asks isNativelyRequired, is noValidate, and
     submit runs the server's own validator before it sends. */
  assert.match(formCode, /required=\{isNativelyRequired\(field\)\}/, "the form must ask isNativelyRequired(field), not read field.required");
  assert.doesNotMatch(formCode, /required=\{field\.required\}/, "required={field.required} puts `required` on every checkbox of a multi group");
  assert.match(formCode, /\bnoValidate\b/, "the form must be noValidate: submit shows what is wrong, the browser would only block");
  const check = formCode.indexOf("validateRegistration(");
  const send = formCode.indexOf("submitSessionRegistration(");
  assert.ok(check > -1 && send > -1 && check < send, "submit must run validateRegistration before it calls the server action");
  assert.match(formCode, /maxLength=\{field\.maxLength\}/);
  assert.match(formCode, /name=\{field\.name\}/);
});

test("only a multi answer is kept off the browser's `required` — HTML has no 'at least one checkbox'", () => {
  const multi = ALL_FIELDS.filter((f) => f.type === "multi");
  assert.ok(multi.length > 0, "the goals question is a multi answer");
  for (const field of multi) {
    assert.equal(isNativelyRequired(field), false, `${field.name}: required on each checkbox demands them all`);
  }
  for (const field of ALL_FIELDS.filter((f) => f.type !== "multi")) {
    assert.equal(isNativelyRequired(field), field.required, `${field.name}: a ${field.type} answer keeps its own required flag`);
  }
});

test("the first question with an error is found in page order, whatever order the errors were found in", () => {
  assert.equal(firstFieldWithError({}), null);
  assert.equal(firstFieldWithError({ goals: "required", fullName: "required" }), "fullName");
  /* The validator checks `goals` before `university`; the page shows `university` first. */
  assert.equal(firstFieldWithError({ goals: "required", university: "too_long" }), "university");
  assert.equal(firstFieldWithError({ cvFile: "file_too_large", questionForSession: "too_long" }), "cvFile");
  assert.equal(firstFieldWithError({ somethingElse: "x" }), null);
});

test("the CV rule the form advertises is the rule the server applies", () => {
  const fileField = ALL_FIELDS.find((f) => f.name === "cvFile");
  assert.ok(fileField?.accept?.includes("pdf"), "the CV picker must accept PDF");
  assert.equal(fileField?.maxBytes, CV_MAX_BYTES);
  assert.match(formSource, /accept="\.pdf,application\/pdf"/, "the input's accept must match the field definition");
});

test("a multi-answer is stored as a set, not squeezed into one enum value", () => {
  const collectionSource = readFileSync(path.join(root, "collections/SessionRegistrations.ts"), "utf8");
  for (const field of ALL_FIELDS.filter((f) => f.type === "multi")) {
    const at = collectionSource.indexOf(`name: "${field.name}"`);
    assert.ok(at > -1, `${field.name} must exist in the collection`);
    const window = collectionSource.slice(at, at + 200);
    assert.match(window, /type: "text"/, `${field.name} must be text hasMany, not a single select`);
    assert.match(window, /hasMany: true/, `${field.name} must be hasMany`);
    assert.equal(window.includes(`payloadOptions("${field.name}")`), false, `${field.name} has no enum column — the vocabulary is enforced in validate.ts`);
    /* Every option the form can send must be accepted by the validator, which
       reads the same list; a stale allowlist here would drop a real answer. */
    for (const option of field.options ?? []) {
      assert.ok(optionValuesOf(field.name).includes(option.value), `${field.name}.${option.value} is unreachable for validation`);
    }
  }
});

test("session keys are unique, and the default is one of them", () => {
  const keys = SESSIONS.map((s) => s.key);
  assert.equal(new Set(keys).size, keys.length, "duplicate session keys would mix two cohorts into one board");
  assert.ok(keys.includes("linkedin-2026"), "the LinkedIn session must be registered");
  for (const session of SESSIONS) {
    assert.match(session.route, /^\//, `${session.key}: route must be a local path`);
    for (const lang of ["ar", "en"] as const) assert.ok(session.title[lang].length > 0, `${session.key}: title missing in ${lang}`);
  }
});
