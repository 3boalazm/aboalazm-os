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
import { formatFxForUsd, roundEgp, roundSar } from "./fx";
import { computeBookingQuote, generateBookingReference, isValidBookingReference } from "./booking";
import { getConfiguredPaymentMethods, RESPONSE_PROMISE } from "./contact-details";
import { AGREEMENT_TERMS, STORE_72H_OFFER, TIERS } from "./offers";
import { CLIENTS, getPermittedClients } from "@/content/clients";
import { TESTIMONIALS, getPermittedTestimonials } from "@/content/testimonials";

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
  assert.deepEqual(result, { ok: true, notification: "failed" });
  assert.deepEqual(calls, ["store", "email"]);
  assert.deepEqual(log, [{ messageId: 7, notification: "failed" }]);
  let notified = false;
  await assert.rejects(() => deliverContact(enquiry, async () => { throw new Error("database unavailable"); }, async () => { notified = true; return true; }, () => {}));
  assert.equal(notified, false);
});
test("delivery returns each email-notification state after storage", async () => {
  const sent = await deliverContact(enquiry, async () => ({ id: 8 }), async () => true, () => {});
  assert.deepEqual(sent, { ok: true, notification: "sent" });

  const log: unknown[] = [];
  const unconfigured = await deliverContact(enquiry, async () => ({ id: 9 }), async () => false, (e) => log.push(e));
  assert.deepEqual(unconfigured, { ok: true, notification: "unconfigured" });
  assert.deepEqual(log, [{ messageId: 9, notification: "unconfigured" }]);
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

test("fx helper rounds EGP to nearest 50, SAR to nearest 5, and falls back when missing or expired", () => {
  assert.equal(roundEgp(197, 50), 9850);
  assert.equal(roundSar(197), 740);

  const missing = formatFxForUsd(197, { egpPerUsdRaw: "", validUntilRaw: "" });
  assert.equal(missing.active, false);
  assert.equal(missing.conversionLine.en, "EGP/SAR confirmed on WhatsApp");
  assert.equal(missing.validityLine, null);

  const expired = formatFxForUsd(197, {
    egpPerUsdRaw: "50",
    validUntilRaw: "2026-10-01",
    now: new Date("2026-10-31T12:00:00Z"),
  });
  assert.equal(expired.active, false);
  assert.equal(expired.conversionLine.en, "EGP/SAR confirmed on WhatsApp");

  const active = formatFxForUsd("$197", {
    egpPerUsdRaw: "50",
    validUntilRaw: "2026-11-07",
    now: new Date("2026-10-31T12:00:00Z"),
  });
  assert.equal(active.active, true);
  assert.equal(active.conversionLine.en, "≈ 9,850 EGP · ≈ 740 SAR");
  assert.equal(active.validityLine?.en, "EGP/SAR prices valid until 2026-11-07");
});

test("booking quote generates AZM-YYMMDD-XXXX reference, 50% deposit, -10% full option, and prefilled WhatsApp links", () => {
  const ref = generateBookingReference(new Date("2026-10-31T12:00:00Z"));
  assert.ok(isValidBookingReference(ref), `invalid reference: ${ref}`);
  assert.match(ref, /^AZM-261031-[A-Z0-9]{4}$/);

  const quote = computeBookingQuote({
    planId: "brand-identity",
    cur: "EGP",
    mode: "deposit",
    ref,
    now: new Date("2026-10-31T12:00:00Z"),
    fxEnv: {
      egpPerUsdRaw: "50",
      validUntilRaw: "2026-11-07",
      now: new Date("2026-10-31T12:00:00Z"),
    },
  });
  assert.equal(quote.totalUsd, 697);
  assert.equal(quote.depositUsd, 348.5);
  assert.equal(quote.fullDiscountedUsd, 627);
  assert.equal(quote.dueNowConverted.formatted, "17,450 EGP");
  assert.match(decodeURIComponent(quote.whatsappHref.en), /Brand Identity Essentials/);
  assert.match(decodeURIComponent(quote.whatsappHref.en), new RegExp(ref));
  assert.match(decodeURIComponent(quote.whatsappHref.ar), /أساسيات الهوية البصرية/);
});

test("payment methods only appear when their env vars are configured", () => {
  assert.deepEqual(getConfiguredPaymentMethods({}), []);
  const configured = getConfiguredPaymentMethods({
    NEXT_PUBLIC_VODAFONE_CASH_NUMBER: "01092500454",
    NEXT_PUBLIC_WALLET_HOLDER_NAME: "Mustafa Taha",
    NEXT_PUBLIC_INSTAPAY_ADDRESS: "mustafa@instapay",
  });
  assert.equal(configured.length, 2);
  assert.equal(configured[0]?.holderName, "Mustafa Taha");
});

test("social-proof files ship empty and filter strictly on permission: true", () => {
  assert.equal(TESTIMONIALS.length, 0);
  assert.equal(CLIENTS.length, 0);
  assert.equal(getPermittedTestimonials().length, 0);
  assert.equal(getPermittedClients().length, 0);

  assert.equal(
    getPermittedTestimonials([
      { name: "A", role: "Founder", company: "X", quote_en: "Good", quote_ar: "جيد", permission: false },
      { name: "B", role: "CEO", company: "Y", quote_en: "Great", quote_ar: "ممتاز", permission: true },
    ]).length,
    1,
  );
});

test("single source of truth for Recommended badge, 72h store, response promise, and agreement clauses", () => {
  const recommended = TIERS.filter((t) => t.recommended);
  assert.equal(recommended.length, 1);
  assert.equal(recommended[0]?.id, "brand-identity");
  assert.equal(STORE_72H_OFFER.startingUsd, 197);
  assert.equal(STORE_72H_OFFER.proof.length, 4);
  assert.match(STORE_72H_OFFER.subheadline[0], /a shipping-policy page/);
  assert.doesNotMatch(STORE_72H_OFFER.subheadline[0], /live shipping setup/);
  assert.match(STORE_72H_OFFER.subheadline[1], /صفحة سياسة الشحن/);

  for (const item of STORE_72H_OFFER.proof) {
    for (const [enTag, arTag] of item.tags) {
      assert.ok(enTag.length > 0);
      assert.ok(arTag.length > 0);
      if (enTag === "Next.js") {
        assert.equal(arTag, "Next.js");
      } else {
        assert.match(arTag, /[\u0600-\u06FF]/, `Expected Arabic characters for tag ${enTag}, got ${arTag}`);
      }
    }
  }

  const clause05 = AGREEMENT_TERMS.find((c) => c.n === "05");
  assert.ok(clause05);
  assert.match(clause05.body[0], /50% \/ 50%/);
  assert.match(clause05.body[0], /50% \/ 25% \/ 25%/);

  const drafts = AGREEMENT_TERMS.filter((c) => c.draft);
  assert.equal(drafts.length, 2);
  assert.match(drafts[0]!.body[0], /50%.*75%.*no refund/i);
  assert.match(drafts[1]!.body[0], /work pauses until payment arrives/i);

  assert.equal(
    RESPONSE_PROMISE.en,
    "Same-day reply on working days (Sun-Thu, Cairo time). WhatsApp is fastest.",
  );
  assert.equal(
    RESPONSE_PROMISE.ar,
    "رد في نفس اليوم في أيام العمل (الأحد–الخميس بتوقيت القاهرة). واتساب أسرع وسيلة.",
  );

  const entries = buildSitemap({ caseStudies: [], posts: [] });
  assert.ok(entries.some((e) => new URL(e.url).pathname === "/services/store-72h"));
  assert.ok(entries.some((e) => new URL(e.url).pathname === "/ar/services/store-72h"));
  assert.ok(entries.some((e) => new URL(e.url).pathname === "/book"));
  assert.ok(entries.some((e) => new URL(e.url).pathname === "/ar/book"));
});

