import { parseContactContext } from "@/lib/contact-context";

/**
 * Structured acquisition metadata for the private Payload messages collection.
 * Keep only allowlisted service/package IDs, a sanitized local path, locale,
 * and bounded campaign IDs. Never record an email, brief, full URL or referrer.
 */
const PACKAGE_TIER_IDS = ["logo-design", "brand-identity", "full-brand-system"] as const;

export function buildContactAttribution(raw: Record<string, unknown>) {
  const context = parseContactContext(raw);
  const packageTier = PACKAGE_TIER_IDS.find((id) => id === context.tier);
  return {
    service: context.service,
    packageTier,
    sourcePage: context.source,
    locale: context.locale ?? "en",
    utmSource: context.utm_source,
    utmMedium: context.utm_medium,
    utmCampaign: context.utm_campaign,
  };
}
