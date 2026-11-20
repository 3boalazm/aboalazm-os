import { ogImage, ogAlt, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-pages";
import { ogLocaleParams } from "@/lib/og-static";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = ogAlt("agreement");

export default function Image() {
  return ogImage("agreement");
}

// Prerendered at build (one card per locale): a share-card request is a CDN hit, not a function render.
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = ogLocaleParams;
