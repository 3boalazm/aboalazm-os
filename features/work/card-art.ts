/**
 * Maps CMS and static thumbnail URLs to canonical 16:10 local card assets.
 *
 * Resolving by basename ensures both newly deployed code and pre-existing
 * Payload CMS rows (e.g. `/media/cc-dev-thumb.jpg`) always render crisp,
 * cache-busted 16:10 artwork under `/images/work/`.
 */
const CARD_ART: Record<string, string> = {
  // Design & brand identity cards
  "gad-thumb.jpg": "/images/work/gad/gad-card.jpg",
  "reflection-thumb.jpg": "/images/work/reflection/reflection-card.jpg",
  "bedeer-thumb.jpg": "/images/work/ahmed-bedeer/bedeer-card.jpg",
  "cc-thumb.jpg": "/images/work/code-canvas/cc-card.jpg",
  "nile-thumb.jpg": "/images/work/nile-pharma/nile-card.jpg",
  "esfc-thumb.jpg": "/images/work/esfc/esfc-card.jpg",
  "lia-thumb.jpg": "/images/work/learn-in-arabic/lia-card.jpg",
  "ys-thumb.jpg": "/images/work/youth-scope/ys-card.jpg",

  // Development & digital product cards (canonical 16:10 UI screenshots + legacy CMS basenames)
  // Real Command Center screen (cropped from the owner's annotated slide). The older
  // basenames stay mapped so CMS rows that still point at them render the real screen.
  // nile-erp-thumb-1.jpg is the name the production CMS actually stores (Payload adds -1
  // when a file name is taken).
  "nile-erp-command-center-card.jpg": "/images/work/dev-cards/nile-erp-command-center-card.jpg",
  "nile-erp-card.jpg": "/images/work/dev-cards/nile-erp-command-center-card.jpg",
  "nile-erp-thumb.jpg": "/images/work/dev-cards/nile-erp-command-center-card.jpg",
  "nile-erp-thumb-1.jpg": "/images/work/dev-cards/nile-erp-command-center-card.jpg",

  "ummah-academy-card.jpg": "/images/work/dev-cards/ummah-academy-card.jpg",
  "ummah-academy-thumb.jpg": "/images/work/dev-cards/ummah-academy-card.jpg",

  "speech-to-text-studio-card.jpg": "/images/work/dev-cards/speech-to-text-studio-card.jpg",
  "speech-to-text-studio-thumb.jpg": "/images/work/dev-cards/speech-to-text-studio-card.jpg",

  "stemforge-card.jpg": "/images/work/dev-cards/stemforge-card.jpg",
  "stemforge-thumb.jpg": "/images/work/dev-cards/stemforge-card.jpg",

  "oltre-collective-card.jpg": "/images/work/dev-cards/oltre-collective-card.jpg",
  "oltre-collective-thumb.jpg": "/images/work/dev-cards/oltre-collective-card.jpg",

  "farm-console-card.jpg": "/images/work/dev-cards/farm-console-card.jpg",
  "farm-thumb.jpg": "/images/work/dev-cards/farm-console-card.jpg",

  "code-canvas-dev-card.jpg": "/images/work/dev-cards/code-canvas-dev-card.jpg",
  "cc-dev-thumb.jpg": "/images/work/dev-cards/code-canvas-dev-card.jpg",

  "nile-pharma-storefront-card.jpg": "/images/work/dev-cards/nile-pharma-storefront-card.jpg",
  "nile-pharma-storefront-thumb.jpg": "/images/work/dev-cards/nile-pharma-storefront-card.jpg",

  "zad-card.jpg": "/images/work/dev-cards/zad-card.jpg",
  "zad-thumb.jpg": "/images/work/dev-cards/zad-card.jpg",

  "mini-exam-card.jpg": "/images/work/dev-cards/mini-exam-card.jpg",
  "mini-exam-thumb.jpg": "/images/work/dev-cards/mini-exam-card.jpg",

  "ahmed-kamar-card.jpg": "/images/work/dev-cards/ahmed-kamar-card.jpg",
  "ahmed-kamar-thumb.jpg": "/images/work/dev-cards/ahmed-kamar-card.jpg",

  "continuum-card.jpg": "/images/work/dev-cards/continuum-card.jpg",
  "continuum-thumb.jpg": "/images/work/dev-cards/continuum-card.jpg",

  "pharmacy-web-card.jpg": "/images/work/dev-cards/pharmacy-web-card.jpg",
  "pharmacy-web-thumb.jpg": "/images/work/dev-cards/pharmacy-web-card.jpg",

  "youssef-guba-card.jpg": "/images/work/dev-cards/youssef-guba-card.jpg",
  "youssef-guba-thumb.jpg": "/images/work/dev-cards/youssef-guba-card.jpg",
};

export function cardArt(src: string): string {
  const base = src.split("/").pop()?.split("?")[0] ?? "";
  return CARD_ART[base] ?? src;
}
