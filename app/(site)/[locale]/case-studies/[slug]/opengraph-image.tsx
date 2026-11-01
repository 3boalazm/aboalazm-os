import { ImageResponse } from "next/og";
import { getCaseStudy } from "@/lib/content";
import { PROJECTS } from "@/features/work/projects.data";
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "zad") {
    return new ImageResponse(<OgCard eyebrow="CASE FILE" title="Zad — Islamic Companion" />, { ...OG_SIZE, fonts: await ogFonts() });
  }
  const record = await getCaseStudy(slug);
  // Hand-built case pages (Nile Pharma ERP, Mahtool, the storefront, ...) have no record, so
  // they showed the generic title; the project list knows their name.
  const projectName = PROJECTS.find((p) => p.slug === slug)?.name;

  return new ImageResponse(
    <OgCard eyebrow="CASE FILE" title={record?.name ?? projectName ?? "Aboalazm OS — Case Studies"} />,
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
