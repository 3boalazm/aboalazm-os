import type { MetadataRoute } from "next";
import { getSitemapSources } from "@/lib/content";
import { buildSitemap } from "@/lib/sitemap";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(await getSitemapSources());
}
