import type { Metadata } from "next";
import { GalleryTestView } from "@/features/gallery/gallery-test-view";
import { GALLERY_IMAGES, GALLERY_PROJECTS } from "@/lib/gallery";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Gallery Test — Visual Applications",
  description: "Temporary visual layout test for brand identity applications.",
  robots: { index: false, follow: false },
};

export default function GalleryTestPage() {
  return <GalleryTestView images={GALLERY_IMAGES} projects={GALLERY_PROJECTS} />;
}
