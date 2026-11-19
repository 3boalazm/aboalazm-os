import assert from "node:assert/strict";
import test from "node:test";

import {
  isAnalyticsEventName,
  parseEventPayload,
  sanitizePath,
  sanitizeProps,
  sanitizeReferrerHost,
} from "@/lib/analytics-events";
import { buildDailySeries, buildSessionFunnel, normalizePath } from "@/lib/studio/analytics";
import { auditContent, matchContentViews } from "@/lib/studio/seo";

/**
 * P2–P4 contract tests. The collector's privacy rules and the console's
 * funnel/SEO math are pure functions, so they are tested here without a
 * database: what the route would store, what the funnel would claim, and
 * what the SEO audit would flag are all decided in these functions.
 */

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

/* ── the ingest contract ────────────────────────────────────────────────── */

test("event names are an allowlist, not a suggestion", () => {
  assert.equal(isAnalyticsEventName("pageview"), true);
  assert.equal(isAnalyticsEventName("contact_submit"), true);
  assert.equal(isAnalyticsEventName("user_email_captured"), false);
  assert.equal(isAnalyticsEventName(""), false);
  assert.equal(isAnalyticsEventName(undefined), false);
});

test("paths are local or nothing", () => {
  assert.equal(sanitizePath("/en/work"), "/en/work");
  assert.equal(sanitizePath("https://evil.example/en/work"), null);
  assert.equal(sanitizePath("//evil.example/x"), null);
  assert.equal(sanitizePath("/contact?email=a@b.c"), null);
  assert.equal(sanitizePath("/writing/x#frag"), null);
});

test("properties drop PII-shaped values key-by-key", () => {
  const clean = sanitizeProps({
    slug: "design-systems",
    email: "visitor@example.com",
    note: "see https://example.com/profile",
    utm_source: "google",
    count: 42,
    [("x".repeat(50))]: "key too long",
  });
  assert.deepEqual(clean, { slug: "design-systems", utm_source: "google" });
});

test("referrer contributes its host only", () => {
  assert.equal(sanitizeReferrerHost("https://www.google.com/search?q=private+terms"), "www.google.com");
  assert.equal(sanitizeReferrerHost("not a url"), null);
  assert.equal(sanitizeReferrerHost(""), null);
});

test("a full payload becomes a storable record; bots and unknowns are refused", () => {
  const ok = parseEventPayload(
    {
      name: "contact_submit",
      sessionId: "abc-123",
      path: "/en/contact",
      referrer: "https://www.linkedin.com/feed/?trk=secret",
      props: { service: "brand-identity", utm_source: "linkedin" },
    },
    UA,
  );
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.record.referrerHost, "www.linkedin.com");
    assert.equal(ok.record.utmSource, "linkedin");
    assert.equal(ok.record.device, "desktop");
    assert.equal(ok.record.path, "/en/contact");
  }

  assert.equal(parseEventPayload({ name: "pageview" }, "Googlebot/2.1").ok, false);
  assert.equal(parseEventPayload({ name: "made_up_event" }, UA).ok, false);
  assert.equal(parseEventPayload(null, UA).ok, false);
});

/* ── the funnel math ────────────────────────────────────────────────────── */

const ev = (name: string, sessionId: string | null, createdAt = "2026-11-10T10:00:00.000Z", path: string | null = null) => ({
  name,
  sessionId,
  createdAt,
  path,
});

test("the funnel counts distinct sessions per step, never events", () => {
  const { steps, eventsWithSession } = buildSessionFunnel([
    ev("pageview", "s1"),
    ev("pageview", "s1"),
    ev("pageview", "s2"),
    ev("pageview", null), // storage disabled: an event, not a session
    ev("form_start", "s1"),
    ev("contact_submit", "s1"),
  ]);
  const byKey = Object.fromEntries(steps.map((s) => [s.key, s]));
  assert.equal(byKey.pageview!.sessions, 2);
  assert.equal(byKey.pageview!.events, 4);
  assert.equal(byKey.form_start!.sessions, 1);
  assert.equal(byKey.contact_submit!.pctOfFirst, 50);
  assert.equal(eventsWithSession, 5);
});

test("daily series buckets by UTC day and leaves quiet days at zero", () => {
  const end = new Date("2026-11-12T12:00:00.000Z");
  const series = buildDailySeries(
    [ev("pageview", "s1", "2026-11-12T09:00:00.000Z"), ev("pageview", "s2", "2026-11-12T10:00:00.000Z")],
    3,
    end,
  );
  assert.equal(series.length, 3);
  assert.equal(series[0]!.pageviews, 0);
  assert.equal(series[2]!.pageviews, 2);
  assert.equal(series[2]!.sessions, 2);
});

test("locale prefixes fold so one page ranks once", () => {
  assert.equal(normalizePath("/en/writing/design-systems"), "/writing/design-systems");
  assert.equal(normalizePath("/ar/case-studies/npf"), "/case-studies/npf");
  assert.equal(normalizePath("/work"), "/work");
});

/* ── the SEO audit ──────────────────────────────────────────────────────── */

test("a published post without a standfirst is flagged as missing its meta description", () => {
  const issues = auditContent({
    posts: [{ id: 1, title: "Hello", slug: "hello", standfirst: null, _status: "published", updatedAt: "2026-11-01T00:00:00.000Z" }],
    projects: [],
    caseStudies: [],
  });
  assert.equal(issues.length, 1);
  assert.match(issues[0]!.title, /بدون وصف تعريفي|no meta description/);
});

test("duplicate slugs are danger, dead-end cards are warnings, clean content is silent", () => {
  const issues = auditContent({
    posts: [
      { id: 1, title: "A", slug: "dup", standfirst: "x", _status: "published" },
      { id: 2, title: "B", slug: "dup", standfirst: "y", _status: "published" },
    ],
    projects: [{ id: 3, name: "P", slug: "p", thumbnail: { id: 1 }, _status: "published", hasCaseStudy: false, externalUrl: null }],
    caseStudies: [{ id: 4, name: "C", slug: "c", nameAr: "ج", _status: "published" }],
  });
  assert.equal(issues[0]!.severity, "danger");
  assert.ok(issues.some((i) => /لا تؤدي إلى أي وجهة|leads nowhere/.test(i.title)));

  const clean = auditContent({
    posts: [{ id: 1, title: "A", slug: "a", standfirst: "x", _status: "published" }],
    projects: [],
    caseStudies: [],
  });
  assert.deepEqual(clean, []);
});

test("content views join to CMS rows by slug and ignore section pages", () => {
  const rows = matchContentViews(
    [
      ["/writing/design-systems", 12],
      ["/case-studies/npf", 7],
      ["/work", 30],
    ],
    [{ id: 1, title: "Design systems", slug: "design-systems", _status: "published" }],
    [{ id: 2, name: "NPF", slug: "npf", _status: "published" }],
  );
  assert.equal(rows.length, 2);
  assert.equal(rows[0]!.title, "Design systems");
  assert.equal(rows[0]!.views, 12);
});
