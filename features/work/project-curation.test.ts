import assert from "node:assert/strict";
import { test } from "node:test";
import { CURATED_DEVELOPMENT_SLUGS, PROJECTS } from "./projects.data";
import { mergeCuratedDevelopmentProjects } from "./project-curation";
import type { Project } from "./types";

const projectBySlug = (slug: string): Project => {
  const project = PROJECTS.find((candidate) => candidate.slug === slug);
  assert.ok(project, `expected static project ${slug}`);
  return project;
};

test("merges every approved development project without duplicate slugs", () => {
  const merged = mergeCuratedDevelopmentProjects([]);
  const slugs = new Set(merged.map((project) => project.slug));

  for (const slug of CURATED_DEVELOPMENT_SLUGS) assert.ok(slugs.has(slug), `missing ${slug}`);
  assert.equal(slugs.size, merged.length);
});

test("curated records update reviewed CMS projects and preserve unrelated CMS content", () => {
  const oldMomo: Project = {
    ...projectBySlug("momo-collective"),
    name: "Momo Collective",
    liveUrl: "https://stale.example.test/momo",
  };
  const cmsOwnedProject: Project = {
    ...projectBySlug("gad-institute"),
    name: "CMS-edited identity project",
  };

  const merged = mergeCuratedDevelopmentProjects([oldMomo, cmsOwnedProject]);
  const momo = merged.find((project) => project.slug === "momo-collective");
  const gad = merged.find((project) => project.slug === "gad-institute");

  assert.equal(momo?.name, "OLTRÈ Collective");
  assert.equal(momo?.liveUrl, "https://momo-shop.vercel.app/");
  assert.equal(gad?.name, "CMS-edited identity project");
  assert.equal(new Set(merged.map((project) => project.slug)).size, merged.length);
});

test("Ummah Academy retains its in-progress lifecycle status", () => {
  const ummah = mergeCuratedDevelopmentProjects([]).find((project) => project.slug === "ummah-academy");
  assert.equal(ummah?.status, "in-progress");
});
