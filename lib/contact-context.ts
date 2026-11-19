import type { Locale } from "@/lib/locale";
/** Public funnel context. Never carry a visitor's brief or email in a URL/event. */
/** The one-line brief typed on the home page is parked here (sessionStorage), never in the URL;
    the contact form reads it once and clears it. */
export const BRIEF_HANDOFF_KEY = "os:brief-handoff";
export const SERVICES = [
  { id: "brand-identity", en: "Brand identity", ar: "هوية بصرية" },
  { id: "website", en: "Website or landing page", ar: "موقع أو صفحة هبوط" },
  { id: "digital-product", en: "Digital product or business tool", ar: "منتج رقمي أو أداة تشغيل" },
  { id: "brand-support", en: "Print, packaging or ongoing design", ar: "مطبوعات وتغليف أو تصميم مستمر" },
  { id: "not-sure", en: "Help me define the scope", ar: "ساعدني في تحديد النطاق" },
] as const;
export type ServiceId = (typeof SERVICES)[number]["id"];
export const PACKAGES = [
  { id: "logo-design", en: "Logo Design", ar: "تصميم الشعار" },
  { id: "brand-identity", en: "Brand Identity", ar: "الهوية البصرية" },
  { id: "full-brand-system", en: "Full Brand System", ar: "نظام علامة متكامل" },
] as const;
export type ContactContext = {
  service: ServiceId;
  tier?: string;
  source?: string;
  locale?: Locale;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};
export function parseContactContext(raw: Record<string, unknown>): ContactContext {
  const service = SERVICES.find((s) => s.id === raw.service)?.id ?? "not-sure";
  const tier = service === "brand-identity" ? PACKAGES.find((p) => p.id === raw.tier)?.id : undefined;
  const source = typeof raw.source === "string" && /^\/(?:[a-z0-9-]+\/?)*$/.test(raw.source) && raw.source.length <= 160 ? raw.source : undefined;
  const campaign = parseCampaign(raw);
  const locale: Locale = raw.locale === "ar" ? "ar" : "en";
  return { service, tier, source, locale, ...campaign };
}
export function parseCampaign(raw: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const value = raw[key];
    if (typeof value === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) result[key] = value;
  }
  return result;
}
export function contactHref(context: Partial<ContactContext> = {}): string {
  const query = new URLSearchParams();
  for (const key of ["service", "tier", "source"] as const) {
    const value = context[key];
    if (value) query.set(key, value);
  }
  return `/contact${query.size ? `?${query}` : ""}`;
}
export function tierId(tag: string): string | undefined {
  const index = Number(tag.match(/\d+/)?.[0]) - 1;
  return PACKAGES[index]?.id;
}
export function contextSummary(context: ContactContext): string {
  return [
    `Service: ${SERVICES.find((s) => s.id === context.service)?.en ?? "Help me define the scope"}`,
    context.tier ? `Package: ${PACKAGES.find((p) => p.id === context.tier)?.en ?? context.tier}` : null,
    context.source ? `Source page: ${context.source}` : null,
    `Language: ${context.locale ?? "en"}`,
    ...Object.entries(parseCampaign(context)).map(([key, value]) => `${key}: ${value}`),
  ].filter(Boolean).join("\n");
}
