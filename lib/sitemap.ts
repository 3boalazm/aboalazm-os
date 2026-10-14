import type { MetadataRoute } from "next";
import { BOOKS } from "@/lib/books";
import { SITE_URL } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

interface Source {
  slug: string;
  updatedAt: string;
}

/**
 * Public, indexable top-level routes. Left out on purpose:
 *   /type      — internal specimen page, `robots: noindex`
 *   /admin, /api — Payload
 */
const STATIC_ROUTES = [
  "",
  "/work",
  "/for-hiring",
  "/work-ui",
  "/services",
  "/pricing",
  "/agreement",
  "/capabilities",
  "/about",
  "/why",
  "/process",
  "/writing",
  "/books",
  "/labs",
  "/resources",
  "/contact",
  "/portfolio",
];

const STATIC_PRIORITY: Record<string, number> = {
  "": 1,
  "/portfolio": 0.85,
};

const abs = (path: string) => `${SITE_URL}${path}`;

/**
 * Arabic posts live at `<slug>-ar` next to their English original (see
 * scripts/writing-posts-list.ts). Give both halves of a pair hreflang
 * alternates; unpaired posts get none.
 */
function postEntries(posts: Source[]): Entry[] {
  const slugs = new Set(posts.map((p) => p.slug));
  return posts.map((p) => {
    const isAr = p.slug.endsWith("-ar");
    const enSlug = isAr ? p.slug.slice(0, -3) : p.slug;
    const arSlug = `${enSlug}-ar`;
    const paired = slugs.has(enSlug) && slugs.has(arSlug);
    return {
      url: abs(`/writing/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "yearly",
      priority: 0.6,
      ...(paired && {
        alternates: {
          languages: {
            en: abs(`/writing/${enSlug}`),
            ar: abs(`/writing/${arSlug}`),
          },
        },
      }),
    };
  });
}

export function buildSitemap({
  posts,
  caseStudies,
}: {
  posts: Source[];
  caseStudies: Source[];
}): MetadataRoute.Sitemap {
  const statics: Entry[] = STATIC_ROUTES.map((path) => ({
    url: abs(path),
    changeFrequency: "monthly",
    priority: STATIC_PRIORITY[path] ?? 0.8,
  }));

  const books: Entry[] = BOOKS.map((b) => ({
    url: abs(`/books/${b.slug}`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const projects: Entry[] = caseStudies.map((c) => ({
    url: abs(`/case-studies/${c.slug}`),
    // static fallback entries have no real modification date — omit rather than lie
    ...(c.updatedAt && { lastModified: c.updatedAt }),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...statics, ...projects, ...postEntries(posts), ...books];
}
