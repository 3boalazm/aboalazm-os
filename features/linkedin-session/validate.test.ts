import assert from "node:assert/strict";
import test from "node:test";

import { ANSWER_MAX, FULL_NAME_MAX, optionValuesOf } from "./assessment";
import { collectAnswers, normalizeLinkedInUrl, validateRegistration } from "./validate";

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

test("any non-empty combination of goals is a valid answer, and no goal at all is not", () => {
  /* 19–20 Nov 2026: the browser demanded every goal be ticked (see isNativelyRequired). The
     validator was never the problem, but nothing pinned that a person may tick any subset —
     so every one of the 2^n − 1 subsets is run, not just the ones that came to mind. */
  const all = optionValuesOf("goals");
  assert.ok(all.length >= 2, "the goals question offers several options");
  for (let mask = 0; mask < 1 << all.length; mask += 1) {
    const goals = all.filter((_, i) => mask & (1 << i));
    const res = validateRegistration({ ...valid, goals });
    if (goals.length === 0) {
      assert.equal(res.ok, false, "an empty goals set must be refused");
      if (!res.ok) assert.equal(res.fields.goals, "required");
    } else {
      assert.equal(res.ok, true, `goals ${goals.join(" + ")} must be accepted`);
      if (res.ok && !res.spam) assert.deepEqual(res.data.goals, goals);
    }
  }
});

test("collectAnswers reads a checkbox group the way a browser sends it: one key per ticked box", () => {
  const form = new FormData();
  form.append("fullName", "محمد مصطفى");
  for (const goal of ["networking", "internship", "explore"]) form.append("goals", goal);
  form.append("linkedinStatus", "inactive");
  form.append("cvFile", new Blob(["%PDF-1.4"], { type: "application/pdf" }), "cv.pdf");

  const raw = collectAnswers(form.entries());
  assert.deepEqual(raw.goals, ["networking", "internship", "explore"], "every ticked box is kept, in the order sent");
  assert.equal(raw.fullName, "محمد مصطفى", "a key that appears once stays a string");
  assert.equal("cvFile" in raw, false, "the file is never an answer — only its metadata reaches the validator");
});

test("one ticked box stays a plain string, and the validator accepts it as a one-goal set", () => {
  const form = new FormData();
  form.append("goals", "internship");
  const raw = collectAnswers(form.entries());
  assert.equal(raw.goals, "internship");
  const res = validateRegistration({ ...valid, ...raw });
  assert.equal(res.ok, true);
});

test("what the browser form collects is judged the same as what the server action collects", () => {
  /* The form now runs validateRegistration itself before it sends, on the output of
     collectAnswers — the same two functions the server action uses. Three ticked goals pass,
     none give the one error the form shows under that question. */
  const build = (goals: string[]) => {
    const form = new FormData();
    for (const [key, value] of Object.entries({ ...valid, goals: undefined })) if (typeof value === "string") form.append(key, value);
    for (const goal of goals) form.append("goals", goal);
    return validateRegistration(collectAnswers(form.entries()));
  };
  const three = build(["internship", "networking", "explore"]);
  assert.equal(three.ok, true);
  if (three.ok && !three.spam) assert.deepEqual(three.data.goals, ["internship", "networking", "explore"]);
  const none = build([]);
  assert.equal(none.ok, false);
  if (!none.ok) assert.deepEqual(Object.keys(none.fields), ["goals"], "only the unanswered question is reported");
});

test("collectAnswers is safe against hostile keys and non-string entries", () => {
  const raw = collectAnswers([
    ["constructor", "a"],
    ["constructor", "b"],
    ["__proto__", "x"],
    ["notes", new Blob(["x"]) as unknown],
  ]);
  assert.deepEqual(raw.constructor, ["a", "b"], "a key that shadows an Object.prototype member is still just a repeated key");
  assert.equal(raw.notes, "", "a File/Blob smuggled under a text key never reaches a text answer");
  assert.equal(Object.getPrototypeOf(raw), Object.prototype, "assigning __proto__ must not swap the object's prototype");
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
