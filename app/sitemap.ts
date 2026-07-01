import type { MetadataRoute } from "next";
import { PROJECTS } from "@/features/work/projects.data";

const BASE = "https://aboalazm.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/work", "/services", "/pricing", "/agreement", "/capabilities", "/about", "/why", "/process", "/start", "/writing", "/contact"].map(
    (path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/start" ? 0.9 : 0.8,
    }),
  );
  const projects = PROJECTS.filter((p) => p.hasCaseStudy).map((p) => ({
    url: `${BASE}/case-studies/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  return [...statics, ...projects];
}
