import type { MetadataRoute } from "next";
import { getSitemapSources } from "@/lib/content";
import { buildSitemap } from "@/lib/sitemap";

// A day, like the pages: every regeneration is a CMS query plus a cold function. New posts reach crawlers within 24 h.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(await getSitemapSources());
}
