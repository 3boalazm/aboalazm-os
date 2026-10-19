/**
 * HERO PICK — which gallery image opens a case study, and where the rest go.
 *
 * Default: the first image that is not a guidelines page opens the case; the
 * remaining ones fill "In use"; the pages go to "The system".
 *
 * Reflection is the exception. Its first non-page image is `refl-overview`:
 * a white, text-heavy page of the guidelines with a strip of framed prints in
 * the middle. Of the five case heroes it is the one that reads as a document
 * rather than a brand, and the only one on white — the other four open on a
 * picture (GAD's facade sign, Nile's box, Ahmed's card, Code & Canvas's icon).
 * The cover is the same brand at its strongest: the mark at full size on
 * black, which also sits on the dark page without a white slab.
 *
 * The match is on the file's basename so it holds for a local path and for a
 * live CMS row (`/api/media/file/refl-cover-1.png`) alike. A project with no
 * entry here, or whose cover is not in its gallery, falls through to the
 * default — nothing breaks if the CMS renames the file.
 */
import type { GalleryItem } from "./case-gallery";

const HERO_PICK: Readonly<Record<string, RegExp>> = {
  reflection: /[/%]refl-cover(-\d+)?\.(png|jpe?g|webp)/i,
};

export interface SplitGallery {
  hero: GalleryItem | undefined;
  /** the "In use" panel — everything that is not the hero and not a page */
  appItems: GalleryItem[];
  /** pages of the guidelines document ("The system"); none when the full brand book is shown */
  slides: GalleryItem[];
  /** every src already on screen as hero or in use, so "The system" never repeats one */
  shown: string[];
}

export function splitGallery(
  slug: string,
  gallery: readonly GalleryItem[],
  opts: { brandBook: boolean },
): SplitGallery {
  const pick = HERO_PICK[slug];
  const picked = pick ? gallery.find((g) => pick.test(g.src)) : undefined;
  const rest = picked ? gallery.filter((g) => g !== picked) : gallery;
  const inUse = rest.filter((g) => g.kind !== "slide");
  const slides = opts.brandBook ? [] : rest.filter((g) => g.kind === "slide");
  const hero = picked ?? inUse[0];
  const appItems = picked ? inUse : inUse.slice(1);
  return {
    hero,
    appItems,
    slides,
    shown: [...(hero ? [hero.src] : []), ...appItems.map((g) => g.src)],
  };
}
