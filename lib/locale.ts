export type Locale = "en" | "ar" | "ms";
export const LOCALES = ["en", "ar", "ms"] as const;
/** Order the header language switch cycles through. */
export const LOCALE_CYCLE: readonly Locale[] = ["en", "ar", "ms"];
/** Non-English locales carry a stable URL prefix; English keeps the bare URLs. */
export const PREFIXED_LOCALES = ["ar", "ms"] as const;
export const LOCALE_PATTERN = "(?:ar|ms|en)";
export function stripLocale(path: string): string {
  return path.replace(new RegExp(`^\\/${LOCALE_PATTERN}(?=\\/|$)`), "") || "/";
}
export function isLocalizable(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !/\.[a-z0-9]+(?:[?#]|$)/i.test(path) && !/^\/(?:api|admin|_next|fonts|images|icons|showcase|cv|portfolio)(?:\/|[?#]|$)/.test(path);
}
/** English keeps existing URLs; Arabic (/ar) and Malay (/ms) have stable prefixes. */
export function localeHref(href: string, locale: Locale): string {
  if (!isLocalizable(href)) return href;
  const plain = href.replace(new RegExp(`^\\/${LOCALE_PATTERN}(?=\\/|[?#]|$)`), "") || "/";
  if (locale === "en") return plain;
  return `/${locale}${plain === "/" ? "" : plain.startsWith("?") || plain.startsWith("#") ? `/${plain}` : plain}`;
}
/** Text direction per locale. Malay is written in Latin script, so it is LTR. */
export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
