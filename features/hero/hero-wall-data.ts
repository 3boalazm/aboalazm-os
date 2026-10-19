import type { Project } from "@/features/work/types";
import { GAD_NAME_AR } from "../../lib/client-names";

/**
 * FIRST-SCREEN PROOF — curated, art-directed, code-owned.
 *
 * The hero used to open on a decorative "system constellation": a diagram of
 * the idea, with none of the work in it. This is the work instead: the
 * flagship case large, two more brands from different sectors beside it.
 *
 * The artwork is deliberately NOT read from the CMS thumbnail. A stale or
 * badly cropped upload would put a cut-off logo in the biggest picture on the
 * site; these three files are cropped for the frame (see the 16:10 *-card.jpg
 * set in /public/images/work). Names and the "has a case study" gate do come
 * from the project data, so an unpublished case never gets a dead link.
 */
interface CuratedTile {
  slug: string;
  src: string;
  name: string;
  nameAr: string;
}

const CURATED: readonly CuratedTile[] = [
  { slug: "gad-institute", src: "/images/work/gad/gad-card.jpg", name: "GAD Heart & Lungs Institute", nameAr: GAD_NAME_AR },
  { slug: "code-canvas", src: "/images/work/cc-logo-hero.jpg", name: "Code & Canvas", nameAr: "Code & Canvas" },
  { slug: "nile-pharma", src: "/images/work/nile-pharma/npf-card.jpg", name: "Nile Pharma Food", nameAr: "نايل فارما فود" },
];

export interface HeroWallTile {
  slug: string;
  src: string;
  name: string;
  nameAr: string;
}

export function pickHeroWall(projects: readonly Project[]): HeroWallTile[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const tiles: HeroWallTile[] = [];
  for (const tile of CURATED) {
    const project = bySlug.get(tile.slug);
    if (!project?.hasCaseStudy) continue;
    tiles.push({
      slug: tile.slug,
      src: tile.src,
      name: project.name || tile.name,
      nameAr: project.nameAr || tile.nameAr,
    });
  }
  return tiles;
}
