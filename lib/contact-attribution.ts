import { parseContactContext } from "@/lib/contact-context";
import type { Locale } from "@/lib/locale";

/**
 * Structured acquisition metadata for the private Payload messages collection.
 * Keep only allowlisted service/package IDs, a sanitized local path, locale,
 * and bounded campaign IDs. Never record an email, brief, full URL or referrer.
 */
const PACKAGE_TIER_IDS = ["logo-design", "brand-identity", "full-brand-system"] as const;

/**
 * The messages.locale column is a Postgres enum with only en/ar (migrated in
 * 20261024_145000_lead_pipeline). Malay enquiries are stored as "en" so the
 * insert never fails; the brief text still records "ms (Bahasa Melayu)".
 * Extending the enum needs its own migration and schema snapshot.
 */
export function storedLocale(locale: Locale | undefined): "en" | "ar" {
  return locale === "ar" ? "ar" : "en";
}

export function buildContactAttribution(raw: Record<string, unknown>) {
  const context = parseContactContext(raw);
  const packageTier = PACKAGE_TIER_IDS.find((id) => id === context.tier);
  return {
    service: context.service,
    packageTier,
    sourcePage: context.source ?? "/contact",
    locale: storedLocale(context.locale),
    utmSource: context.utm_source,
    utmMedium: context.utm_medium,
    utmCampaign: context.utm_campaign,
  };
}
