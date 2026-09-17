import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Mustafa Aboalazm — Systemic Identity Architect";

export default async function Image() {
  return new ImageResponse(
    <OgCard eyebrow="ABOALAZM OS" title="Designing code-aligned digital systems." />,
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
