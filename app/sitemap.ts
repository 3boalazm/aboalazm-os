import type { MetadataRoute } from "next";
import { getAllCaseStudySlugs } from "@/lib/content";

export const revalidate = 3600;

const BASE = "https://aboalazm.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics = ["", "/work", "/services", "/pricing", "/agreement", "/capabilities", "/about", "/why", "/process", "/start", "/writing", "/contact", "/portfolio"].map(
    (path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/start" ? 0.9 : path === "/portfolio" ? 0.85 : 0.8,
    }),
  );
  const slugs = await getAllCaseStudySlugs();
  const projects = slugs.map((slug) => ({
    url: `${BASE}/case-studies/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  return [...statics, ...projects];
}
