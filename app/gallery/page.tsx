import type { Metadata } from "next";
import { GalleryView } from "@/features/gallery";

export const metadata: Metadata = {
  title: "Gallery — Selected Brand Work",
  description:
    "A cross-project image wall: brand identities, mockups, and campaigns from every case study, filterable by client.",
};

export default function GalleryPage() {
  return <GalleryView />;
}
