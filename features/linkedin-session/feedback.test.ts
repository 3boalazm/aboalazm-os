import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectAnswers } from "./validate";
import {
  ALL_FEEDBACK_FIELDS,
  FEEDBACK_GROUPS,
  feedbackOptionLabel,
  feedbackOptionValues,
  firstFeedbackFieldWithError,
  validateCertificateName,
  validateFeedback,
} from "./feedback";

const VALID = {
  rating: "5",
  pace: "right",
  recommend: "yes",
  confidenceBefore: "2",
  confidenceAfter: "4",
  mostUseful: ["profile", "demos"],
  nextStep: "headline",
  linkedinUrl: "linkedin.com/in/mona-said",
};

describe("feedback vocabulary", () => {
  it("every field has a unique name and every choice field has options", () => {
    const names = ALL_FEEDBACK_FIELDS.map((f) => f.name);
    assert.equal(new Set(names).size, names.length);
    for (const f of ALL_FEEDBACK_FIELDS) {
      if (["radio", "scale", "multi"].includes(f.type)) assert.ok((f.options ?? []).length >= 2, f.name);
    }
  });

  it("every option has an Arabic and an English label", () => {
    for (const f of ALL_FEEDBACK_FIELDS) {
      assert.ok(f.label.ar && f.label.en, f.name);
      for (const o of f.options ?? []) assert.ok(o.label.ar && o.label.en, `${f.name}.${o.value}`);
    }
  });

  it("the three scales offer exactly 1 to 5", () => {
    for (const name of ["rating", "confidenceBefore", "confidenceAfter"]) {
      assert.deepEqual(feedbackOptionValues(name), ["1", "2", "3", "4", "5"]);
    }
  });

  it("groups are numbered in order", () => {
    assert.deepEqual(FEEDBACK_GROUPS.map((g) => g.index), ["01", "02", "03", "04"]);
  });

  it("labels fall back to the stored value, and a blank shows a dash", () => {
    assert.equal(feedbackOptionLabel("pace", "right", "ar"), "مظبوطة");
    assert.equal(feedbackOptionLabel("pace", "nope", "ar"), "nope");
    assert.equal(feedbackOptionLabel("pace", null), "—");
  });
});

describe("validateFeedback", () => {
  it("accepts the required answers and nothing else", () => {
    const r = validateFeedback(VALID);
    assert.ok(r.ok && !r.spam);
    if (r.ok && !r.spam) {
      assert.equal(r.data.rating, 5);
      assert.equal(r.data.confidenceBefore, 2);
      assert.equal(r.data.confidenceAfter, 4);
      assert.deepEqual(r.data.mostUseful, ["profile", "demos"]);
      assert.equal(r.data.allowQuote, false);
      assert.equal(r.data.fullName, undefined);
      assert.equal(r.data.linkedinUrl, "https://www.linkedin.com/in/mona-said");
    }
  });

  it("an empty form reports every required question and none of the optional ones", () => {
    const r = validateFeedback({});
    assert.ok(!r.ok);
    if (!r.ok) {
      assert.deepEqual(
        Object.keys(r.fields).sort(),
        ["confidenceAfter", "confidenceBefore", "linkedinUrl", "mostUseful", "nextStep", "pace", "rating", "recommend"].sort(),
      );
      for (const code of Object.values(r.fields)) assert.equal(code, "required");
    }
  });

  it("a value outside the list is invalid_option, not required", () => {
    const r = validateFeedback({ ...VALID, rating: "6", pace: "warp" });
    assert.ok(!r.ok);
    if (!r.ok) {
      assert.equal(r.fields.rating, "invalid_option");
      assert.equal(r.fields.pace, "invalid_option");
    }
  });

  it("refuses a rating that is a number-like but not a listed value", () => {
    for (const bad of ["0", "5.5", "05", "1e0", " ", "five", "-1"]) {
      const r = validateFeedback({ ...VALID, rating: bad });
      assert.ok(!r.ok, bad);
    }
  });

  it("a multi answer: one value or many, de-duplicated and put in questionnaire order", () => {
    const r = validateFeedback({ ...VALID, mostUseful: ["demos", "profile", "profile"] });
    assert.ok(r.ok && !r.spam);
    if (r.ok && !r.spam) assert.deepEqual(r.data.mostUseful, ["profile", "demos"]);
    const one = validateFeedback({ ...VALID, mostUseful: "content" });
    assert.ok(one.ok && !one.spam);
    const bad = validateFeedback({ ...VALID, mostUseful: ["profile", "hack"] });
    assert.ok(!bad.ok);
    const empty = validateFeedback({ ...VALID, mostUseful: [] });
    assert.ok(!empty.ok);
  });

  it("objects and arrays cannot ride in a text answer", () => {
    assert.ok(!validateFeedback({ ...VALID, bestPart: { a: 1 } }).ok);
    assert.ok(!validateFeedback({ ...VALID, rating: ["5"] }).ok);
    assert.ok(!validateFeedback(null).ok);
    assert.ok(!validateFeedback([VALID]).ok);
  });

  it("free text is trimmed, capped and may be left out", () => {
    const r = validateFeedback({ ...VALID, bestPart: "  حلو\n\n\n\nجدًا  ", improve: "   " });
    assert.ok(r.ok && !r.spam);
    if (r.ok && !r.spam) {
      assert.equal(r.data.bestPart, "حلو\n\nجدًا");
      assert.equal(r.data.improve, undefined);
    }
    const long = validateFeedback({ ...VALID, nextTopic: "x".repeat(1001) });
    assert.ok(!long.ok);
    if (!long.ok) assert.equal(long.fields.nextTopic, "too_long");
    assert.ok(validateFeedback({ ...VALID, nextTopic: "x".repeat(1000) }).ok);
  });

  it("the LinkedIn link is required, must be a profile link, and is normalised", () => {
    const missing = validateFeedback({ ...VALID, linkedinUrl: "  " });
    assert.ok(!missing.ok && missing.fields.linkedinUrl === "required");
    assert.ok(!validateFeedback({ ...VALID, linkedinUrl: "nope" }).ok);
    assert.ok(!validateFeedback({ ...VALID, linkedinUrl: "https://example.com/in/x" }).ok);
    const r = validateFeedback({ ...VALID, linkedinUrl: "  linkedin.com/in/mona-said?utm=1 " });
    assert.ok(r.ok && !r.spam);
    if (r.ok && !r.spam) assert.equal(r.data.linkedinUrl, "https://www.linkedin.com/in/mona-said");
  });

  it("allowQuote needs a name; with a name it is kept", () => {
    const noName = validateFeedback({ ...VALID, allowQuote: "on" });
    assert.ok(!noName.ok);
    if (!noName.ok) assert.equal(noName.fields.fullName, "needs_name");
    const ok = validateFeedback({ ...VALID, allowQuote: "on", fullName: "منى" });
    assert.ok(ok.ok && !ok.spam);
    if (ok.ok && !ok.spam) assert.equal(ok.data.allowQuote, true);
    const unticked = validateFeedback({ ...VALID, fullName: "منى" });
    assert.ok(unticked.ok && !unticked.spam);
    if (unticked.ok && !unticked.spam) assert.equal(unticked.data.allowQuote, false);
  });

  it("a filled honeypot is dropped as spam, an empty one is ignored", () => {
    const spam = validateFeedback({ ...VALID, _gotcha: "http://x" });
    assert.ok(spam.ok && spam.spam);
    const fine = validateFeedback({ ...VALID, _gotcha: "" });
    assert.ok(fine.ok && !fine.spam);
  });

  it("reads FormData the way the browser form sends it (repeated keys become a set)", () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(VALID)) {
      if (Array.isArray(v)) for (const item of v) fd.append(k, item);
      else fd.append(k, v);
    }
    fd.append("allowQuote", "on");
    fd.append("fullName", "Mona");
    const r = validateFeedback(collectAnswers(fd.entries()));
    assert.ok(r.ok && !r.spam);
    if (r.ok && !r.spam) {
      assert.deepEqual(r.data.mostUseful, ["profile", "demos"]);
      assert.equal(r.data.allowQuote, true);
    }
  });

  it("the form scrolls to the first problem in page order, not validator order", () => {
    assert.equal(firstFeedbackFieldWithError({ nextStep: "required", pace: "required" }), "pace");
    assert.equal(firstFeedbackFieldWithError({}), null);
  });
});

describe("certificate name", () => {
  it("accepts real names in Arabic and Latin, collapsing whitespace", () => {
    for (const [input, expected] of [
      ["  منى   سعيد ", "منى سعيد"],
      ["Mona O'Brien-Said", "Mona O'Brien-Said"],
      ["عبد الرحمن", "عبد الرحمن"],
    ] as const) {
      const r = validateCertificateName(input);
      assert.ok(r.ok && r.name === expected, input);
    }
  });

  it("refuses empty, too long, digits, markup, formulas and non-strings", () => {
    assert.deepEqual(validateCertificateName("   "), { ok: false, error: "required" });
    assert.deepEqual(validateCertificateName(undefined), { ok: false, error: "required" });
    assert.deepEqual(validateCertificateName("ا".repeat(121)), { ok: false, error: "too_long" });
    for (const bad of ["x", "Mona 2", "<b>Mona</b>", "=HYPERLINK(1)", "-Mona", "Mona\u0000"]) {
      assert.deepEqual(validateCertificateName(bad), { ok: false, error: "invalid" }, bad);
    }
  });
});
