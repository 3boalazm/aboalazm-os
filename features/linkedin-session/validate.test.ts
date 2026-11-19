import assert from "node:assert/strict";
import test from "node:test";

import { ANSWER_MAX, FULL_NAME_MAX } from "./assessment";
import { normalizeLinkedInUrl, validateRegistration } from "./validate";

/**
 * A server action is a public endpoint: the only thing standing between a
 * hand-built request and a database write is this file. The tests below are the
 * hostile cases, not the happy path — a payload that fills an enum column with
 * a value the enum lacks fails at write time, and a submission that stores a
 * stranger's URL in the "LinkedIn profile" field ends up as a link inside the
 * operator's console.
 */

const valid = {
  fullName: "محمد مصطفى",
  email: "Mohamed@Example.com",
  college: "حاسبات ومعلومات — نظم معلومات",
  yearOfStudy: "year-3",
  linkedinStatus: "inactive",
  goals: ["internship"],
};

function ok(input: Record<string, unknown>) {
  const res = validateRegistration(input);
  assert.equal(res.ok, true, `expected ok, got ${JSON.stringify(res)}`);
  if (!res.ok) throw new Error("unreachable");
  assert.equal(res.spam, false);
  return res.data;
}

test("a minimal valid submission is accepted, trimmed and lower-cased where it matters", () => {
  const data = ok(valid);
  assert.equal(data.fullName, "محمد مصطفى");
  assert.equal(data.email, "mohamed@example.com", "the address is stored lower-cased, so re-registration finds the row");
  assert.equal(data.college, "حاسبات ومعلومات — نظم معلومات");
  assert.equal(data.yearOfStudy, "year-3");
  assert.equal(data.linkedinStatus, "inactive");
  assert.deepEqual(data.goals, ["internship"]);
  for (const optional of ["university", "linkedinUrl", "appliedBefore", "cvStatus", "interestArea", "biggestChallenge", "questionForSession"]) {
    assert.equal(data[optional as keyof typeof data], undefined, `${optional} must stay absent, not become an empty string`);
  }
});

test("each missing required question is reported on that question", () => {
  for (const name of ["fullName", "email", "college", "yearOfStudy", "linkedinStatus", "goals"]) {
    const input = { ...valid };
    delete (input as Record<string, unknown>)[name];
    const res = validateRegistration(input);
    assert.equal(res.ok, false, `${name} must be required`);
    if (res.ok) continue;
    assert.equal(res.fields[name as keyof typeof res.fields], "required");
  }
});

test("blank answers and empty selects are 'not answered', not stored as empty strings", () => {
  const data = ok({
    ...valid,
    university: "   ",
    appliedBefore: "",
    cvStatus: "",
    interestArea: "",
    biggestChallenge: "\n\n",
  });
  assert.equal(data.university, undefined);
  assert.equal(data.appliedBefore, undefined);
  assert.equal(data.interestArea, undefined);
  assert.equal(data.biggestChallenge, undefined);
});

test("a select only accepts a value its enum contains", () => {
  for (const [field, bad] of [
    ["yearOfStudy", "year-99"],
    ["linkedinStatus", "expert"],
    ["goals", "world-peace"],
  ] as const) {
    const res = validateRegistration({ ...valid, [field]: bad });
    assert.equal(res.ok, false, `${field}: "${bad}" would break the Postgres enum`);
    if (res.ok) continue;
    assert.equal(res.fields[field], "invalid_option");
  }
  /* Optional selects may be skipped, never invented. */
  assert.equal(validateRegistration({ ...valid, cvStatus: "great" }).ok, false);
});

test("the goals question accepts a set: de-duplicated, in the questionnaire's order", () => {
  /* FormData repeats the key once per checked box; a hand-built request may
     also send one value or a JSON-ish mess. */
  assert.deepEqual(ok({ ...valid, goals: ["networking", "internship"] }).goals, ["internship", "networking"]);
  assert.deepEqual(ok({ ...valid, goals: ["explore", "explore", " freelance " ] }).goals, ["freelance", "explore"]);
  assert.deepEqual(ok({ ...valid, goals: "freelance" }).goals, ["freelance"], "a single value is still one answer");

  const unknown = validateRegistration({ ...valid, goals: ["internship", "crypto-wealth"] });
  assert.equal(unknown.ok, false);
  if (!unknown.ok) assert.equal(unknown.fields.goals, "invalid_option");

  for (const skipped of [undefined, "", [], ["  "]]) {
    const res = validateRegistration({ ...valid, goals: skipped });
    assert.equal(res.ok, false, `${JSON.stringify(skipped)} is not an answer to a required question`);
    if (!res.ok) assert.equal(res.fields.goals, "required");
  }
  /* Padding inside the set is noise, not a second answer — a browser never
     sends it, and refusing a real submission over one empty entry is worse
     than ignoring it. */
  assert.deepEqual(ok({ ...valid, goals: ["internship", ""] }).goals, ["internship"]);
  for (const junk of [[{}], 42, ["internship", 7]]) {
    assert.equal(validateRegistration({ ...valid, goals: junk }).ok, false, `${JSON.stringify(junk)} must be refused`);
  }
});

test("email must be an address, not merely a string with @", () => {
  for (const email of ["a@localhost", "nope", "a b@c.com", "", "a@b"]) {
    const res = validateRegistration({ ...valid, email });
    assert.equal(res.ok, false, `"${email}" is not an address`);
  }
});

test("over-long answers are refused instead of silently cut", () => {
  assert.equal(validateRegistration({ ...valid, fullName: "ن".repeat(FULL_NAME_MAX + 1) }).ok, false);
  const res = validateRegistration({ ...valid, biggestChallenge: "ا".repeat(ANSWER_MAX + 1) });
  assert.equal(res.ok, false);
  if (!res.ok) assert.equal(res.fields.biggestChallenge, "too_long");
});

test("newlines in a name collapse; newlines in an answer survive", () => {
  const data = ok({ ...valid, fullName: "  محمد\n\tمصطفى ", biggestChallenge: "سطر أول\nسطر ثانٍ" });
  assert.equal(data.fullName, "محمد مصطفى");
  assert.equal(data.biggestChallenge, "سطر أول\nسطر ثانٍ");
});

test("non-string values from a hand-built request never reach the database", () => {
  for (const input of [null, undefined, 42, "text", [1, 2], { email: ["a@b.co"] }]) {
    const res = validateRegistration(input);
    assert.equal(res.ok, false, `${JSON.stringify(input)} must be refused`);
  }
});

test("the honeypot rejects quietly and logs nothing about the person", () => {
  const res = validateRegistration({ ...valid, _gotcha: "spray@example.com" });
  assert.equal(res.ok, true);
  assert.equal(res.spam, true);
  if (res.ok && res.spam) assert.equal(res.reason, "honeypot");
  /* A real attendee leaves it empty (or absent) and is unaffected. */
  assert.equal(validateRegistration({ ...valid, _gotcha: "" }).ok, true);
});

test("the LinkedIn field stores a LinkedIn profile link or nothing", () => {
  const data = ok({ ...valid, linkedinUrl: "  linkedin.com/in/mostafa?trackingId=abc " });
  assert.equal(data.linkedinUrl, "https://www.linkedin.com/in/mostafa");

  for (const bad of ["https://evil.test/in/me", "javascript:alert(1)", "not a url", "https://linkedin.com/company/x", "https://linkedin.com/in"]) {
    const res = validateRegistration({ ...valid, linkedinUrl: bad });
    assert.equal(res.ok, false, `"${bad}" must not become a link in the console`);
    if (!res.ok) assert.equal(res.fields.linkedinUrl, "invalid_url");
  }
});

test("normalizeLinkedInUrl keeps the handle and drops everything else", () => {
  for (const input of [
    "https://www.linkedin.com/in/handle",
    "http://linkedin.com/in/handle/",
    "www.linkedin.com/in/handle",
    "linkedin.com/in/handle",
  ]) {
    assert.equal(normalizeLinkedInUrl(input), "https://www.linkedin.com/in/handle", input);
  }
  for (const input of ["", "   ", "https://linkedin.com/in/handle/extra", "//linkedin.com/in/x", "https://x@linkedin.com/in/handle"]) {
    assert.equal(normalizeLinkedInUrl(input), null, `"${input}" must be refused`);
  }
});

test("the CV follows the rule printed under the question: PDF, 5 MB", () => {
  const tooBig = { name: "cv.pdf", size: 5 * 1024 * 1024 + 1, type: "application/pdf" };
  const res = validateRegistration(valid, tooBig);
  assert.equal(res.ok, false);
  if (!res.ok) assert.equal(res.fields.cvFile, "file_too_large");

  const wrongType = validateRegistration(valid, { name: "cv.docx", size: 1000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  assert.equal(wrongType.ok, false);
  if (!wrongType.ok) assert.equal(wrongType.fields.cvFile, "file_wrong_type");

  /* An untouched file picker reaches the action as a zero-byte File, and
     submitSessionRegistration drops it before the validator ever sees it — so a
     zero-length file arriving here is a hand-built request and is refused. */
  const empty = validateRegistration(valid, { name: "", size: 0, type: "" });
  assert.equal(empty.ok, false, "an empty upload is not a submission");
  if (!empty.ok) assert.equal(empty.fields.cvFile, "file_wrong_type");

  /* The same request without a file at all is simply a skipped question. */
  assert.equal(typeof ok(valid).fullName, "string");
});
