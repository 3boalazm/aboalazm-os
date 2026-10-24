export type Locale = "en" | "ar";
export const LOCALES = ["en", "ar"] as const;
export function stripLocale(path: string): string {
  return path.replace(/^\/(?:ar|en)(?=\/|$)/, "") || "/";
}
export function isLocalizable(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !/\.[a-z0-9]+(?:[?#]|$)/i.test(path) && !/^\/(?:api|admin|_next|fonts|images|icons|showcase|cv|portfolio)(?:\/|[?#]|$)/.test(path);
}
/** English keeps existing URLs; Arabic has a stable /ar prefix. */
export function localeHref(href: string, locale: Locale): string {
  if (!isLocalizable(href)) return href;
  const plain = href.replace(/^\/(?:ar|en)(?=\/|[?#]|$)/, "") || "/";
  return locale === "ar" ? `/ar${plain === "/" ? "" : plain.startsWith("?") || plain.startsWith("#") ? `/${plain}` : plain}` : plain;
}
