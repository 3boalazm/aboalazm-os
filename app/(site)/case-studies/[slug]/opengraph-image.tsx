import { ImageResponse } from "next/og";
import { getCaseStudy } from "@/lib/content";
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = await getCaseStudy(slug);

  return new ImageResponse(
    <OgCard eyebrow="CASE FILE" title={record?.name ?? "Aboalazm OS — Case Studies"} />,
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
