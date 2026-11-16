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
  return path.startsWith("/") && !path.startsWith("//") && !/\.[a-z0-9]+(?:[?#]|$)/i.test(path) && !/^\/(?:api|admin|studio|_next|fonts|images|icons|showcase|cv|portfolio)(?:\/|[?#]|$)/.test(path);
}
/** English keeps existing URLs; Arabic (/ar) and Malay (/ms) have stable prefixes. */
export function localeHref(href: string, locale: Locale): string {
  if (!isLocalizable(href)) return href;
  const plain = href.replace(new RegExp(`^\\/${LOCALE_PATTERN}(?=\\/|[?#]|$)`), "") || "/";
  if (locale === "en") return plain;
  return `/${locale}${plain === "/" ? "" : plain.startsWith("?") || plain.startsWith("#") ? `/${plain}` : plain}`;
}
/**
 * Where "switch language" should land when the page names its own counterparts
 * (`<link rel="alternate" hreflang>`). A translated article lives at a
 * different slug (`the-split-brand` ↔ `the-split-brand-ar`), so swapping the
 * /ar prefix alone is wrong in one direction: from the Arabic article it asks
 * for /writing/the-split-brand-ar, which the middleware — rightly, for old
 * links — sends straight back to /ar, and "English" does nothing. Returns a
 * path, or null when the page declares nothing for that language (then
 * `localeHref` is right). Malay has no translated articles of its own: it
 * reads the English twin.
 */
export function counterpartPath(
  alternates: ReadonlyArray<{ hreflang: string; href: string }>,
  target: Locale,
): string | null {
  const pathOf = (code: string): string | null => {
    const found = alternates.find((a) => a.hreflang.toLowerCase() === code);
    if (!found) return null;
    try {
      return new URL(found.href, "https://placeholder.invalid").pathname;
    } catch {
      return null;
    }
  };
  const exact = pathOf(target);
  if (exact) return exact;
  if (target === "ms") {
    const english = pathOf("en");
    if (english) return localeHref(english, "ms");
  }
  return null;
}
/** Text direction per locale. Malay is written in Latin script, so it is LTR. */
export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
