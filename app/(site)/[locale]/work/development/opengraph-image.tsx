import { ogImage, ogAlt, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-pages";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = ogAlt("work-development");

export default function Image() {
  return ogImage("work-development");
}
