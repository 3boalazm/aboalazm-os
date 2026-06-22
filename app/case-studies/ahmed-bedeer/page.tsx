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
    captionAr: "ماكيت الكارت · ab على القماش",
    
    span: "full",
  },
  {
    src: "/images/work/ahmed-bedeer-cover.jpg",
    caption: "BRAND COVER · ab MONOGRAM",
    captionAr: "غلاف البراند · مونوجرام ab",
    
    span: "full",
  },
  {
    src: "/images/work/ahmed-bedeer-logo.png",
    caption: "LOGO CONCEPT · QUOTATION FORM",
    captionAr: "مفهوم اللوجو · شكل الاقتباس",
    
  },
  {
    src: "/images/work/ahmed-bedeer-construction.png",
    caption: "LOGO CONSTRUCTION · a + b",
    captionAr: "بناء اللوجو · a + b",
    
  },
  {
    src: "/images/work/ahmed-bedeer-applications.jpg",
    caption: "ON MEDIA · SURFACE · COLOUR",
    captionAr: "على الميديا · السطح · اللون",
    
    span: "full",
  },
  {
    src: "/images/work/ahmed-bedeer-colors.png",
    caption: "PRIMARY PALETTE",
    captionAr: "اللوحة الأساسية",
    
  },
  {
    src: "/images/work/ahmed-bedeer-colors-ext.png",
    caption: "EXTENDED PALETTE",
    captionAr: "اللوحة الموسّعة",
    
  },
  {
    src: "/images/work/ahmed-bedeer-type.png",
    caption: "TYPEFACE · LUBALIN GRAPH + UNCUT SANS",
    captionAr: "الخط · Lubalin Graph + Uncut Sans",
    
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
