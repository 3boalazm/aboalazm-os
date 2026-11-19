import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { buildContactAttribution } from "./contact-attribution";

test("lead attribution stores bounded service, package, source, locale and campaign fields", () => {
  assert.deepEqual(buildContactAttribution({
    service: "brand-identity",
    tier: "full-brand-system",
    source: "/services/brand-identity",
    locale: "ar",
    utm_source: "linkedin",
    utm_medium: "organic",
    utm_campaign: "october-2026",
  }), {
    service: "brand-identity",
    packageTier: "full-brand-system",
    sourcePage: "/services/brand-identity",
    locale: "ar",
    utmSource: "linkedin",
    utmMedium: "organic",
    utmCampaign: "october-2026",
  });
});

test("invalid attribution values are dropped and never store URL/referrer or free text", () => {
  assert.deepEqual(buildContactAttribution({
    service: "DROP TABLE messages",
    tier: "admin",
    source: "https://evil.example/path?email=somebody@example.com",
    locale: "fr",
    utm_source: "https://linkedin.com/in/someone",
    utm_medium: "somebody@example.com",
    utm_campaign: "campaign name with spaces",
  }), {
    service: "not-sure",
    packageTier: undefined,
    sourcePage: "/contact",
    locale: "en",
    utmSource: undefined,
    utmMedium: undefined,
    utmCampaign: undefined,
  });
});

test("Payload inbox has stage and attribution fields while public REST create remains closed", () => {
  const schema = readFileSync(join(process.cwd(), "collections/Messages.ts"), "utf8");
  for (const field of ["service", "packageTier", "sourcePage", "locale", "utmSource", "utmMedium", "utmCampaign", "leadStage", "proposalValue", "wonValue"]) {
    assert.match(schema, new RegExp(`name: "${field}"`), `${field} must exist in Messages`);
  }
  assert.match(schema, /create:\s*\(\)\s*=>\s*false/u);
  assert.match(schema, /defaultValue:\s*"new"/u);
});

