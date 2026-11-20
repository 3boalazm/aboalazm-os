import { LOCALES } from "@/lib/locale";

/**
 * Params for prerendering the share cards (`[locale]/**\/opengraph-image`).
 *
 * Without `generateStaticParams` every one of these routes is a function that renders a PNG per request
 * (~1.3 s of CPU, ~400 KB out, never cached). With it, Next renders each card once at build time and the CDN
 * serves the file, so a crawler hit costs no function invocation at all.
 */
export function ogLocaleParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function ogLocaleSlugParams(slugs: readonly string[]) {
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}
