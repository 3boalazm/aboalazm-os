import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { CURATED_DEVELOPMENT_SLUGS, PROJECTS } from "./projects.data";
import { pickFeatured } from "./featured-cases";
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

test("every digital project has a screenshot and a production preview destination", () => {
  const digitalProjects = PROJECTS.filter((project) => project.category === "development");
  assert.ok(digitalProjects.length > 0, "expected digital projects in the portfolio");

  for (const project of digitalProjects) {
    assert.ok(project.thumbnail.startsWith("/images/work/"), `${project.slug} needs a screenshot preview`);
    assert.ok(
      existsSync(join(process.cwd(), "public", project.thumbnail.slice(1))),
      `${project.slug} screenshot is missing: ${project.thumbnail}`,
    );

    const destination = project.liveUrl ?? project.externalUrl;
    assert.ok(destination, `${project.slug} needs a production or external preview link`);
    if (destination.startsWith("/")) {
      assert.ok(
        existsSync(join(process.cwd(), "public", destination.slice(1))),
        `${project.slug} local demo is missing: ${destination}`,
      );
    } else {
      assert.equal(new URL(destination).protocol, "https:", `${project.slug} should use a secure preview URL`);
    }
  }
});

test("digital products feature six GitHub-reviewed projects with working preview destinations", () => {
  const digitalProjects = PROJECTS.filter((project) => project.category === "development");
  const featured = pickFeatured(digitalProjects);

  assert.deepEqual(
    featured.map((project) => project.slug),
    ["nile-pharma-erp", "ummah-academy", "speech-to-text-studio", "stemforge", "momo-collective", "farm-console"],
  );
  assert.equal(featured.length, 6);
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

test("Ummah Academy reflects the multilingual PWA and in-progress status documented in its repository", () => {
  const ummah = mergeCuratedDevelopmentProjects([]).find((project) => project.slug === "ummah-academy");
  assert.ok(ummah);
  assert.deepEqual(ummah.stack, ["Astro", "5 languages · RTL", "PWA · Offline"]);
  assert.match(ummah.outcome, /in progress — 5 languages, 23 routes, installable PWA/);
  assert.equal(ummah.status, "in-progress");
});
