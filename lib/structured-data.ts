/**
 * STRUCTURED DATA (Schema.org / JSON-LD) — sitewide.
 *
 * Two schemas, both rendered once in the root layout so they apply to
 * every page:
 *   - Person: Mustafa Aboalazm as an individual professional (this is
 *     what lets Google show a Knowledge Panel-style rich result and
 *     correctly associate the site with a named person, not just a
 *     generic "brand").
 *   - WebSite: the site itself, mainly so search engines have an
 *     unambiguous canonical name + url pairing.
 *
 * Kept deliberately minimal and accurate — every field here maps to a
 * real, verifiable fact already stated elsewhere on the site (contact
 * page, about page). No aspirational or unverifiable claims.
 */

import { SITE_URL } from "@/lib/site";

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mustafa Aboalazm",
    alternateName: "مصطفى أبوالعزم",
    url: SITE_URL,
    image: `${SITE_URL}/images/work/icon.png`,
    jobTitle: "Senior Brand Identity Designer & Visual Systems Specialist",
    description:
      "Senior Brand Identity Designer and Co-founder of Code & Canvas, working across brand strategy, bilingual visual identity systems, and design governance.",
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
      "https://www.linkedin.com/in/aboalazm",
      "https://www.behance.net/aboalazm",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mustafa Aboalazm — Senior Brand Identity Designer & Visual Systems Specialist",
    url: SITE_URL,
    inLanguage: ["en", "ar"],
  };
}
