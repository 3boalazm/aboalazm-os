import type { MetadataRoute } from "next";
import { PROJECTS } from "@/features/work/projects.data";

const BASE = "https://aboalazm.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/work", "/capabilities", "/about", "/writing", "/contact"].map(
    (path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );
  const projects = PROJECTS.map((p) => ({
    url: `${BASE}/case-studies/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  return [...statics, ...projects];
}
