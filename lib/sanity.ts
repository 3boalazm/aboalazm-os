/**
 * SANITY CLIENT + QUERIES.
 * The frontend never queries ad hoc — every GROQ lives here, typed
 * against the feature contracts. Falls back gracefully when env is
 * absent (local dev runs on seed data).
 */
import { createClient } from "next-sanity";
import type { Project } from "@/features/work/types";
import type { CaseStudyRecord } from "@/features/case-studies/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const sanity = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2025-01-01",
      useCdn: true,
      perspective: "published",
    })
  : null;

const PROJECT_FIELDS = /* groq */ `
  "slug": slug.current, name, discipline, stack, outcome, year,
  "thumbnail": thumbnail.asset->url,
  "accent": { "primary": accentPrimary, "secondary": accentSecondary }
`;

export async function getProjects(): Promise<Project[] | null> {
  if (!sanity) return null;
  return sanity.fetch(
    `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`,
    {},
    { next: { revalidate: 3600, tags: ["project"] } },
  );
}

export async function getCaseStudy(slug: string): Promise<CaseStudyRecord | null> {
  if (!sanity) return null;
  return sanity.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0]{
      "slug": slug.current, name, discipline,
      problem, teamScale, timeline, kpis,
      researchSummary, competitors, visualVectors,
      tokens, componentStates, breakpoints,
      results, retro,
      "accent": *[_type=="project" && references(^._id)][0]{
        "primary": accentPrimary, "secondary": accentSecondary
      }
    }`,
    { slug },
    { next: { revalidate: 3600, tags: ["caseStudy", slug] } },
  );
}

export interface PostSummary {
  index: string;
  title: string;
  slug: string;
  standfirst: string;
  publishedAt: string;
  topics?: string[];
}

export async function getPosts(): Promise<PostSummary[] | null> {
  if (!sanity) return null;
  return sanity.fetch(
    `*[_type == "post" && lang == "en"] | order(publishedAt desc){
      index, title, "slug": slug.current, standfirst, publishedAt, topics
    }`,
    {},
    { next: { revalidate: 3600, tags: ["post"] } },
  );
}
