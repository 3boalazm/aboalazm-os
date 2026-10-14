/**
 * STRUCTURED DATA (Schema.org / JSON-LD).
 *
 * Rendered once in the root layout (every page) as ONE @graph block:
 *   - Person: Mustafa Aboalazm as an individual professional — lets Google
 *     tie the site, Behance, LinkedIn and GitHub to one named entity.
 *   - WebSite: the site itself. `name` is deliberately SHORT — Google's
 *     "site name" feature reads it, and a long tagline here is what leaves
 *     the result headed by the hosting domain ("Vercel") instead of the name.
 *
 * Rendered per page where relevant:
 *   - ProfilePage (/about): marks the page as the profile of the Person. The
 *     Person is inlined (same @id) so the page never depends on another
 *     <script> block being merged by the crawler.
 *   - BreadcrumbList (inner pages): "Mustafa Aboalazm › About" instead of the
 *     raw URL trail in results.
 *
 * Every field here maps to a fact already stated on the site (about page,
 * contact page, footer links) or to how the name is actually spelled in
 * search ("Mostafa Abo Alazm" is Google's own suggestion for the query). No
 * aspirational or unverifiable claims.
 */

import { SITE_URL } from "@/lib/site";

/** Stable node ids so schemas can reference each other. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const SITE_NAME = "Mustafa Aboalazm";

function personNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Mustafa Aboalazm",
    // Arabic name, the common alternate Latin spelling, and the handle used
    // on GitHub / Facebook (an identifier, not a display name).
    alternateName: ["مصطفى أبوالعزم", "Mostafa Abo Alazm", "3boalazm"],
    url: SITE_URL,
    mainEntityOfPage: `${SITE_URL}/about`,
    image: `${SITE_URL}/images/work/icon.png`,
    jobTitle: "Senior Brand Identity Designer",
    description:
      "Senior Brand Identity Designer and Co-founder of Code & Canvas, working across brand strategy, bilingual (Arabic / English) visual identity systems, and design governance.",
    knowsAbout: [
      "Brand identity",
      "Brand strategy",
      "Logo design",
      "Visual systems",
      "Brand guidelines",
      "Bilingual Arabic / English design",
      "Design systems",
    ],
    knowsLanguage: ["ar", "en"],
    email: "mailto:m1aboalazm@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Al Obour",
      addressCountry: "EG",
    },
    worksFor: {
      "@type": "Organization",
      name: "Code & Canvas",
    },
    sameAs: [
      "https://www.behance.net/aboalazm",
      "https://www.linkedin.com/in/aboalazm",
      "https://github.com/3boalazm",
    ],
  };
}

function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: ["Aboalazm OS", "مصطفى أبوالعزم"],
    url: SITE_URL,
    inLanguage: ["en", "ar"],
    publisher: { "@id": PERSON_ID },
  };
}

/** Sitewide block (root layout): Person + WebSite in a single @graph. */
export function getSiteGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), webSiteNode()],
  };
}

/** /about — the page IS the profile of the Person (inlined, same @id). */
export function getProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#profile`,
    url: `${SITE_URL}/about`,
    name: "About Mustafa Aboalazm",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: personNode(),
  };
}

/** Home › Page — one level is enough for this site's flat structure. */
export function getBreadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      ...trail.map((t, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: t.name,
        item: `${SITE_URL}${t.path}`,
      })),
    ],
  };
}

/* ── Overhaul S6 (ABO-29) — content-type schemas (QA #48) ── */

/** /writing/[slug] — Article (links back to the Person/WebSite graph). */
export function getArticleSchema(post: {
  slug: string;
  title: string;
  standfirst?: string | null;
  publishedAt?: string | null;
  lang?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/writing/${post.slug}#article`,
    headline: post.title,
    ...(post.standfirst ? { description: post.standfirst } : {}),
    url: `${SITE_URL}/writing/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/writing/${post.slug}`,
    inLanguage: post.lang === "ar" ? "ar" : "en",
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** /books — the shelf as an ItemList of the book records. */
export function getBookListSchema(
  books: readonly { slug: string; title: string; titleEn: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/books#list`,
    name: "Library — Interactive Design Books",
    itemListElement: books.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/books/${b.slug}`,
      name: `${b.titleEn} — ${b.title}`,
    })),
  };
}

/** /books/[slug] — one Book record (Arabic interactive edition). */
export function getBookSchema(book: {
  slug: string;
  title: string;
  titleEn: string;
  edition: string;
  blurbEn: string;
  chapterCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${SITE_URL}/books/${book.slug}#book`,
    name: book.title,
    alternateName: book.titleEn,
    description: book.blurbEn,
    bookEdition: book.edition,
    inLanguage: "ar",
    isPartOf: { "@id": `${SITE_URL}/books#list` },
    url: `${SITE_URL}/books/${book.slug}`,
    author: { "@id": PERSON_ID },
  };
}
