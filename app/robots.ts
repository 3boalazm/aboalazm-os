import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /api/ stays crawlable on purpose: uploaded images are served from
    // /api/media/file/** and blocking it would hide them from image search.
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/admin"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
