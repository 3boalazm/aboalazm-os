import { PROJECT_OVERVIEW_SLUGS } from "@/lib/case-registry";
import { CURATED_DEVELOPMENT_SLUGS, PROJECTS } from "./projects.data";
import type { Project } from "./types";

const curatedSlugs = new Set<string>(CURATED_DEVELOPMENT_SLUGS);
const curatedProjects = PROJECTS.filter((project) => curatedSlugs.has(project.slug));
const curatedBySlug = new Map(curatedProjects.map((project) => [project.slug, project]));

/**
 * Keep approved GitHub projects visible even when Payload is populated, and
 * prefer their reviewed source data for the slugs we explicitly curate.
 * Unrelated CMS-owned projects remain untouched and duplicate slugs collapse.
 */
export function mergeCuratedDevelopmentProjects(cmsProjects: readonly Project[]): Project[] {
  const merged = new Map<string, Project>();

  for (const project of cmsProjects) {
    merged.set(project.slug, curatedBySlug.get(project.slug) ?? ((PROJECT_OVERVIEW_SLUGS as readonly string[]).includes(project.slug) ? { ...project, hasCaseStudy: true, overviewOnly: true } : project));
  }

  for (const project of curatedProjects) {
    if (!merged.has(project.slug)) merged.set(project.slug, project);
  }

  return [...merged.values()];
}
