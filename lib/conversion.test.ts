import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import assert from "node:assert/strict";
import { test } from "node:test";
import { validateContact, BRIEF_MAX, MESSAGE_MAX } from "@/features/contact/validate";
import { parseContactContext, contactHref, contextSummary } from "./contact-context";
import { deliverContact } from "./contact-delivery";
import { localeHref } from "./locale";
import { localizedMetadata } from "./localized-metadata";
import { buildSitemap } from "./sitemap";
import { BUILT_IN_CASE_SLUGS } from "./case-registry";
import { projectEnquiryService } from "@/features/work/project-enquiry-service";
import { PROJECTS } from "@/features/work/projects.data";
import { canSubmitContact } from "@/features/contact/submission-state";

const enquiry = { name: "Test Visitor", email: "visitor@example.test", brief: "A bilingual company website", elapsedMs: 0 };

test("contact submissions cannot be repeated while sending, after success, or with uncertain receipt", () => {
  assert.equal(canSubmitContact("working"), false);
  assert.equal(canSubmitContact("sent"), false);
  assert.equal(canSubmitContact("uncertain"), false);
  assert.equal(canSubmitContact("idle"), true);
  assert.equal(canSubmitContact("error"), true);
  assert.equal(canSubmitContact("rateLimited"), true);
});

test("localized metadata preserves absolute/default page titles in Open Graph", () => {
  const base = {
    title: { absolute: "About Mustafa Aboalazm — Senior Brand Identity Designer" },
    description: "A profile page",
  };
  const en = localizedMetadata(base, "en", "/about");
  const ar = localizedMetadata(base, "ar", "/about");
  const defaultTitle = localizedMetadata({
    title: { default: "Pricing", template: "%s · Mustafa Aboalazm" },
    description: "Pricing page",
  }, "en", "/pricing");

  assert.equal(en.openGraph?.title, "About Mustafa Aboalazm — Senior Brand Identity Designer");
  assert.equal(ar.openGraph?.title, "عن مصطفى أبوالعزم");
  assert.equal(defaultTitle.openGraph?.title, "Pricing");
});
test("case-study enquiry context matches the project track", () => {
  const project = (slug: string) => {
    const match = PROJECTS.find((item) => item.slug === slug);
    assert.ok(match, `missing project fixture: ${slug}`);
    return match;
  };

  assert.equal(projectEnquiryService(project("esfc")), "brand-identity");
  assert.equal(projectEnquiryService(project("ahmed-kamar")), "digital-product");
  assert.equal(projectEnquiryService(project("youssef-guba")), "digital-product");
  assert.equal(projectEnquiryService(project("nile-pharma-storefront")), "website");
});

test("fast autofilled enquiries survive, while filled honeypots and malformed input are rejected", () => {
  const fast = validateContact(enquiry);
  assert.ok(fast.ok && !fast.spam);
  assert.deepEqual(validateContact({ ...enquiry, _gotcha: "bot" }), { ok: true, spam: true, reason: "honeypot" });
  assert.equal(validateContact({ ...enquiry, email: "bad" }).ok, false);
  assert.equal(validateContact({ ...enquiry, brief: ["not text"] }).ok, false);
});
test("package context survives a URL round trip without accepting arbitrary URLs or packages", () => {
  const chosen = { service: "brand-identity" as const, tier: "full-brand-system", source: "/case-studies/gad-institute" };
  const href = new URL(contactHref(chosen), "https://example.test");
  const parsed = parseContactContext(Object.fromEntries(href.searchParams));
  assert.equal(parsed.tier, chosen.tier);
  assert.equal(parsed.source, chosen.source);
  assert.match(contextSummary(parsed), /Full Brand System/);
  assert.equal(parseContactContext({ service: "website", tier: chosen.tier, source: "https://spam.test/email" }).source, undefined);
  assert.equal(parseContactContext({ service: "website", tier: chosen.tier }).tier, undefined);
});
test("accepted message remains stored if the notification fails; storage failure never produces a success", async () => {
  const calls: string[] = [];
  const log: unknown[] = [];
  const result = await deliverContact(enquiry, async () => { calls.push("store"); return { id: 7 }; }, async () => { calls.push("email"); throw new Error("SMTP failure"); }, (e) => log.push(e));
  assert.deepEqual(result, { ok: true });
  assert.deepEqual(calls, ["store", "email"]);
  assert.deepEqual(log, [{ messageId: 7, notification: "failed" }]);
  let notified = false;
  await assert.rejects(() => deliverContact(enquiry, async () => { throw new Error("database unavailable"); }, async () => { notified = true; return true; }, () => {}));
  assert.equal(notified, false);
});
test("unconfigured SMTP is observable without exposing visitor data", async () => {
  const log: unknown[] = [];
  await deliverContact(enquiry, async () => ({ id: 8 }), async () => false, (e) => log.push(e));
  assert.deepEqual(log, [{ messageId: 8, notification: "unconfigured" }]);
  assert.ok(!JSON.stringify(log).includes(enquiry.email));
});
test("locale links retain query and fragments, preserve English addresses and leave assets alone", () => {
  assert.equal(localeHref("/contact?service=website#form", "ar"), "/ar/contact?service=website#form");
  assert.equal(localeHref("/ar/services", "en"), "/services");
  assert.equal(localeHref("/ar/services", "ar"), "/ar/services");
  for (const path of ["/cv", "/portfolio", "/images/logo.png", "/api/resources", "/showcase/nile-erp/index.html", "https://example.test/", "//example.test/"]) assert.equal(localeHref(path, "ar"), path);
});
test("sitemap includes every built-in case in both languages, paired articles and no invented modification dates", () => {
  const entries = buildSitemap({ caseStudies: BUILT_IN_CASE_SLUGS.map((slug) => ({ slug, updatedAt: "" })), posts: [{ slug: "story", updatedAt: "" }, { slug: "story-ar", updatedAt: "" }] });
  assert.equal(new Set(entries.map((e) => e.url)).size, entries.length);
  for (const slug of BUILT_IN_CASE_SLUGS) for (const prefix of ["", "/ar"]) assert.ok(entries.some((e) => new URL(e.url).pathname === `${prefix}/case-studies/${slug}`));
  assert.ok(entries.some((e) => new URL(e.url).pathname === "/ar/writing/story-ar"));
  assert.ok(entries.every((e) => !e.lastModified));
});

test("a maximum-length brief plus bounded attribution fits the existing message field", () => {
  const context = parseContactContext({ service: "brand-identity", tier: "full-brand-system", source: "/" + "a".repeat(150), locale: "ar", utm_source: "a".repeat(80), utm_medium: "b".repeat(80), utm_campaign: "c".repeat(80) });
  assert.ok((contextSummary(context) + "\n\nProject brief:\n" + "x".repeat(BRIEF_MAX)).length <= MESSAGE_MAX);
  assert.equal(parseContactContext({ utm_source: "person@example.com" }).utm_source, undefined);
});

test("default-locale routing terminates after its internal rewrite", () => {
  const response = middleware(new NextRequest("https://example.test/services"));
  const rewritten = response.headers.get("x-middleware-rewrite");
  assert.equal(rewritten, "https://example.test/en/services");
  const resolved = middleware(new NextRequest(rewritten!));
  assert.equal(resolved.headers.get("location"), null);
  assert.equal(resolved.headers.get("x-middleware-rewrite"), null);
});
