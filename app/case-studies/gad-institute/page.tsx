import type { Metadata } from "next";
import {
  ScrollyCaseStudy,
  CaseGallery,
  GAD_INSTITUTE,
  type GalleryItem,
} from "@/features/case-studies";

export const metadata: Metadata = {
  title: "GAD Heart & Lungs Institute — Case File",
  description:
    "A complete brand system for a pioneering cardiopulmonary institute in Al Khobar, KSA — Caregiver archetype, bilingual heart-and-lung mark, Deep Blue + Crimson Red Pantone system, Trap + Montserrat + Alexandria, governed V2.0 guidelines.",
};

const GALLERY: readonly GalleryItem[] = [
  {
    src: "/images/work/gad/gad-mockup-logo.jpg",
    caption: "BRAND MARK · HEART + LUNG, FUSED",
    span: "full",
  },
  {
    src: "/images/work/gad/gad-cover.png",
    caption: "BRAND IDENTITY · V2.0 COVER",
  },
  {
    src: "/images/work/gad/gad-logo-anatomy.png",
    caption: "LOGO ANATOMY · LOCKUP ELEMENTS",
  },
  {
    src: "/images/work/gad/gad-logo-variations.png",
    caption: "VARIATIONS · EN / AR · H / V",
    span: "full",
  },
  {
    src: "/images/work/gad/gad-logo-symbol.png",
    caption: "SYMBOL ONLY · FAVICON-READY",
  },
  {
    src: "/images/work/gad/gad-colors-primary.png",
    caption: "PRIMARY PALETTE · DEEP BLUE + CRIMSON",
  },
  {
    src: "/images/work/gad/gad-colors-infographic.png",
    caption: "INFOGRAPHIC PALETTE · DATA SYSTEM",
  },
  {
    src: "/images/work/gad/gad-typography.png",
    caption: "TYPE · TRAP · MONTSERRAT · ALEXANDRIA",
    span: "full",
  },
  {
    src: "/images/work/gad/gad-mockup-card.jpg",
    caption: "STATIONERY · BUSINESS CARD",
  },
  {
    src: "/images/work/gad/gad-signage-environmental.png",
    caption: "ENVIRONMENTAL · FACADE SIGN",
  },
  {
    src: "/images/work/gad/gad-mockup-outdoor.jpg",
    caption: "OUTDOOR · GENUINE ACCESSIBLE CARE",
  },
  {
    src: "/images/work/gad/gad-mockup-exhibition.jpg",
    caption: "EXHIBITION STAND · VISION 2030",
    span: "full",
  },
];

export default function GadInstituteCaseStudy() {
  return (
    <main>
      <ScrollyCaseStudy
        record={GAD_INSTITUTE}
        gallery={<CaseGallery items={GALLERY} />}
      />
    </main>
  );
}
