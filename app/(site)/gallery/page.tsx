import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { GalleryView } from "@/features/gallery";
import { getGalleryData } from "@/lib/content";

export const revalidate = 60;


export const metadata: Metadata = {
  title: "Gallery — Selected Brand Work",
  description:
    "A cross-project image wall: brand identities, mockups, and campaigns from every case study, filterable by client.",
};

export default async function GalleryPage() {
  const { projects, images } = await getGalleryData();
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Gallery", path: "/gallery" }])} />
      <GalleryView projects={projects} images={images} />
    </>
  );
}
