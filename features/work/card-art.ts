/**
 * CARD ART — the one place a card's picture is decided.
 *
 * Cards share a 16:10 frame (see `MediaCard` on the featured cards, the
 * floating ledger preview, and the 28rem column on /for-hiring). The art in
 * `/public/images/work/*-card.jpg` is cropped for exactly that frame; the
 * first-generation `*-thumb.jpg` files were composed for a wider slot, so the
 * frame cuts them to the middle of the mark — GAD reads "GA", Reflection comes
 * out a black panel, Nile loses the box.
 *
 * `projects.data.ts` already points at the new crops. This module covers the
 * other source: a **live CMS row**, which still holds the old upload
 * (`…/api/media/file/gad-thumb-2.jpg` and friends) and would otherwise put the
 * bad crop back on screen the moment the database answers.
 *
 * Rules, in order:
 *   1. a legacy filename → the code-owned 16:10 crop;
 *   2. anything else → the project's own thumbnail, respected as-is.
 *
 * Rule 2 is the point: once Admin uploads new art under its own name, the CMS
 * wins again and this file stops mattering for that project. Delete a mapping
 * here as soon as its asset is replaced.
 */

const GAD_CARD = "/images/work/gad/gad-card.jpg";
const REFL_CARD = "/images/work/reflection/refl-card.jpg";
const NILE_CARD = "/images/work/nile-pharma/npf-card.jpg";
const AHMED_CARD = "/images/work/ahmed-bedeer-card.jpg";

/** slug → the crop composed for the shared 16:10 frame. */
export const CARD_ART: Readonly<Record<string, string>> = {
  "gad-institute": GAD_CARD,
  "reflection": REFL_CARD,
  "nile-pharma": NILE_CARD,
  "ahmed-bedeer": AHMED_CARD,
};

/**
 * The filenames this site has used for those four pictures. Written against
 * the basename only, so it matches a CMS `/api/media/file/…` URL, a Next
 * `/_next/image?url=…` URL, and a local `/images/work/…` path alike.
 *
 * `nile-pharma-2.jpg` is the CMS copy; `npf-business-card-box.jpg` is the
 * local original the crop was taken from, still referenced by the case study.
 */
const LEGACY_ART: readonly { readonly test: RegExp; readonly src: string }[] = [
  { test: /[/%]gad-thumb(-\d+)?\.(jpe?g|png|webp)/i, src: GAD_CARD },
  { test: /[/%]refl-thumb(-\d+)?\.(jpe?g|png|webp)/i, src: REFL_CARD },
  { test: /[/%]nile-pharma(-\d+)?\.(jpe?g|png|webp)/i, src: NILE_CARD },
  { test: /[/%]npf-business-card-box(-\d+)?\./i, src: NILE_CARD },
  { test: /[/%]ahmed-bedeer-(cover|mockup)(-\d+)?\./i, src: AHMED_CARD },
];

/** Resolve the picture a card should render, from whatever the data holds. */
export function cardArt(src: string | undefined | null): string {
  if (!src) return "";
  const legacy = LEGACY_ART.find((l) => l.test.test(src));
  return legacy ? legacy.src : src;
}
