import type { MetadataRoute } from "next";
import { BOOKS } from "@/lib/books";
import { SITE_URL } from "@/lib/site";
import { LOCALES, localeHref, type Locale } from "@/lib/locale";

type Entry = MetadataRoute.Sitemap[number];
interface Source { slug: string; updatedAt: string }
const ROUTES = ["/", "/work", "/work/design", "/work/development", "/for-hiring", "/work-ui", "/services", "/services/brand-identity", "/services/websites", "/services/systems", "/services/store-72h", "/pricing", "/partnership", "/book", "/agreement", "/capabilities", "/about", "/developer", "/why", "/process", "/writing", "/books", "/labs", "/reels", "/resources", "/contact"];
const abs = (path: string) => `${SITE_URL}${path}`;
function localizedEntries(path: string, priority: number, updatedAt?: string): Entry[] {
  const languages = { en: abs(path), ar: abs(localeHref(path, "ar")), ms: abs(localeHref(path, "ms")), "x-default": abs(path) };
  return LOCALES.map((locale: Locale) => ({ url: abs(localeHref(path, locale)), priority, changeFrequency: "monthly", ...(updatedAt ? { lastModified: updatedAt } : {}), alternates: { languages } }));
}
export function buildSitemap({ posts, caseStudies }: { posts: Source[]; caseStudies: Source[] }): MetadataRoute.Sitemap {
  const slugs = new Set(posts.map((p) => p.slug));
  const articles: Entry[] = posts.map((p) => {
    const ar = p.slug.endsWith("-ar");
    const enSlug = ar ? p.slug.slice(0, -3) : p.slug;
    const arSlug = `${enSlug}-ar`;
    const paired = slugs.has(enSlug) && slugs.has(arSlug);
    return { url: abs(localeHref(`/writing/${p.slug}`, ar ? "ar" : "en")), priority: 0.6, changeFrequency: "yearly", ...(p.updatedAt ? { lastModified: p.updatedAt } : {}), ...(paired ? { alternates: { languages: { en: abs(`/writing/${enSlug}`), ar: abs(`/ar/writing/${arSlug}`) } } } : {}) };
  });
  return [
    ...ROUTES.flatMap((p) => localizedEntries(p, p === "/" ? 1 : 0.8)),
    ...caseStudies.flatMap((c) => localizedEntries(`/case-studies/${c.slug}`, 0.7, c.updatedAt)),
    ...BOOKS.flatMap((b) => localizedEntries(`/books/${b.slug}`, 0.6)),
    ...articles,
    { url: abs("/portfolio"), priority: 0.7, changeFrequency: "monthly" },
  ];
}
