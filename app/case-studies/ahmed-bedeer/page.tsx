import type { Metadata } from "next";
import {
  ScrollyCaseStudy,
  CaseGallery,
  AHMED_BEDEER,
  type GalleryItem,
} from "@/features/case-studies";

export const metadata: Metadata = {
  title: "Ahmed Bedeer — Case File",
  description:
    "Personal brand identity for a Healthcare Digital Transformation leader — 'ab' monogram, Steel Blue + Bright Teal system, Lubalin Graph + Uncut Sans, V1.0 guidelines.",
};

const GALLERY: readonly GalleryItem[] = [
  {
    src: "/images/work/ahmed-bedeer-mockup.jpg",
    caption: "BUSINESS CARD MOCKUP · ab ON FABRIC",
    span: "full",
  },
  {
    src: "/images/work/ahmed-bedeer-cover.jpg",
    caption: "BRAND COVER · ab MONOGRAM",
    span: "full",
  },
  {
    src: "/images/work/ahmed-bedeer-logo.png",
    caption: "LOGO CONCEPT · QUOTATION FORM",
  },
  {
    src: "/images/work/ahmed-bedeer-construction.png",
    caption: "LOGO CONSTRUCTION · a + b",
  },
  {
    src: "/images/work/ahmed-bedeer-applications.jpg",
    caption: "ON MEDIA · SURFACE · COLOUR",
    span: "full",
  },
  {
    src: "/images/work/ahmed-bedeer-colors.png",
    caption: "PRIMARY PALETTE",
  },
  {
    src: "/images/work/ahmed-bedeer-colors-ext.png",
    caption: "EXTENDED PALETTE",
  },
  {
    src: "/images/work/ahmed-bedeer-type.png",
    caption: "TYPEFACE · LUBALIN GRAPH + UNCUT SANS",
    span: "full",
  },
];

export default function AhmedBedeerCaseStudy() {
  return (
    <main>
      <ScrollyCaseStudy
        record={AHMED_BEDEER}
        gallery={<CaseGallery items={GALLERY} />}
      />
    </main>
  );
}
