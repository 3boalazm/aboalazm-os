import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { cardArt } from "./card-art";
import { STORIES, pickFeatured } from "./featured-cases";
import { CURATED_DEVELOPMENT_SLUGS, PROJECTS } from "./projects.data";
import { mergeCuratedDevelopmentProjects } from "./project-curation";
import type { Project } from "./types";

const projectBySlug = (slug: string): Project => {
  const project = PROJECTS.find((candidate) => candidate.slug === slug);
  assert.ok(project, `expected static project ${slug}`);
  return project;
};

test("merges all 17 approved development projects without duplicate slugs", () => {
  const digitalProjects = PROJECTS.filter((p) => p.category === "development");
  assert.equal(digitalProjects.length, 17);
  assert.equal(CURATED_DEVELOPMENT_SLUGS.length, 17);

  const merged = mergeCuratedDevelopmentProjects([]);
  const slugs = new Set(merged.map((project) => project.slug));

  for (const slug of CURATED_DEVELOPMENT_SLUGS) assert.ok(slugs.has(slug), `missing ${slug}`);
  assert.equal(slugs.size, merged.length);
});

test("every portfolio project references an existing high-detail thumbnail asset or a clean name+domain card", () => {
  for (const project of PROJECTS) {
    if (!project.thumbnail) {
      assert.ok(
        ["nile-bed", "craft-egypt", "clinic-appointment-system"].includes(project.slug),
        `${project.slug} must either provide a thumbnail or be an explicit name+domain/demo card`,
      );
      continue;
    }
    const thumbnailPath = join(process.cwd(), "public", project.thumbnail.slice(1));
    assert.ok(existsSync(thumbnailPath), `${project.slug} thumbnail is missing: ${project.thumbnail}`);
    const stats = statSync(thumbnailPath);
    const minBytes = project.category === "development" ? 50_000 : 10_000;
    assert.ok(stats.size > minBytes, `${project.slug} thumbnail appears to be a low-detail placeholder (${stats.size} bytes)`);
  }
});

test("every digital project uses a dedicated 16:10 dev-cards preview or name+domain card and maps legacy CMS basenames", () => {
  const digitalProjects = PROJECTS.filter((project) => project.category === "development");
  assert.equal(digitalProjects.length, 17);

  for (const project of digitalProjects) {
    if (project.thumbnail) {
      assert.ok(
        project.thumbnail.startsWith("/images/work/dev-cards/"),
        `${project.slug} should use a cache-busted /images/work/dev-cards/ preview`,
      );
      assert.ok(
        existsSync(join(process.cwd(), "public", project.thumbnail.slice(1))),
        `${project.slug} screenshot is missing: ${project.thumbnail}`,
      );
    }

    const destination = project.liveUrl ?? project.externalUrl;
    if (project.previewStatus === "archived") {
      assert.equal(destination, undefined);
      assert.ok(project.hasCaseStudy, `${project.slug} needs a saved overview`);
      continue;
    }
    if (project.isDemo) {
      assert.equal(destination, undefined, `${project.slug} is a demo and must not expose a client-specific link`);
      assert.ok(
        project.stack.some((s) => /Easy!Appointments.*GPL-3\.0/i.test(s)),
        `${project.slug} must credit Easy!Appointments (GPL-3.0)`,
      );
      continue;
    }
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

  // Legacy Payload CMS basenames also resolve to the crisp 16:10 dev-cards assets
  assert.equal(cardArt("/media/cc-dev-thumb.jpg"), "/images/work/dev-cards/code-canvas-dev-card.jpg");
  assert.equal(cardArt("/media/nile-erp-thumb.jpg"), "/images/work/dev-cards/nile-erp-card.jpg");
  assert.equal(cardArt("/media/oltre-collective-thumb.jpg"), "/images/work/dev-cards/oltre-collective-card.jpg");
  assert.equal(cardArt("/media/farm-thumb.jpg"), "/images/work/dev-cards/farm-console-card.jpg");
});

test("Mini Exam and Youssef Guba link to verified production previews", () => {
  assert.equal(projectBySlug("mini-exam").liveUrl, "https://mraboqamarexams.vercel.app/");
  assert.equal(projectBySlug("youssef-guba").liveUrl, "https://youssefguba-os.vercel.app/");
  assert.equal(projectBySlug("mini-exam").previewStatus, undefined);
  assert.equal(projectBySlug("youssef-guba").previewStatus, undefined);
});

test("every design and development project carries distinct EN + AR card narrative copy", () => {
  for (const project of PROJECTS) {
    const story = STORIES[project.slug];
    assert.ok(story, `missing STORIES entry for ${project.slug}`);
    assert.notEqual(story.challenge, project.outcome, `${project.slug} repeats outcome verbatim in EN card body`);
    assert.notEqual(story.challengeAr, project.outcomeAr, `${project.slug} repeats outcome verbatim in AR card body`);
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
