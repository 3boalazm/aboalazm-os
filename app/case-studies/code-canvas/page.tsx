import type { Metadata } from "next";
import {
  ScrollyCaseStudy,
  CaseGallery,
  CODE_CANVAS,
  type GalleryItem,
} from "@/features/case-studies";

export const metadata: Metadata = {
  title: "Code & Canvas — Case File",
  description:
    "The studio's own identity: a squircle </> mark uniting code and craft, purple-to-teal gradient system, three-typeface hierarchy — built at founding and governed from day one.",
};

const GALLERY: readonly GalleryItem[] = [
  {
    src: "/images/work/cc-logo-hero.jpg",
    caption: "BRAND MARK · THE SQUIRCLE </>",
    span: "full",
  },
  {
    src: "/images/work/cc-cover.jpg",
    caption: "BRAND GUIDELINES COVER · V1.0",
  },
  {
    src: "/images/work/cc-manifesto.png",
    caption: "BRAND MANIFESTO",
  },
  {
    src: "/images/work/cc-icon-construction.png",
    caption: "ICON CONSTRUCTION · SQUIRCLE GRID",
  },
  {
    src: "/images/work/cc-wordmark.png",
    caption: "WORDMARK · CODE & CANVAS",
  },
  {
    src: "/images/work/cc-logo-variants.jpg",
    caption: "LOGO VARIANTS · DARK / LIGHT / GRADIENT",
    span: "full",
  },
  {
    src: "/images/work/cc-poster-mockup.jpg",
    caption: "PRINT APPLICATION · POSTER MOCKUP",
  },
  {
    src: "/images/work/cc-colors-dark.png",
    caption: "COLOR SYSTEM · DARK CANVAS",
  },
  {
    src: "/images/work/cc-gradients.png",
    caption: "GRADIENT LIBRARY · 8 VARIANTS",
  },
  {
    src: "/images/work/cc-typography.png",
    caption: "TYPOGRAPHY · SIGNATE GROTESK + RALEWAY + POPPINS",
  },
  {
    src: "/images/work/cc-design-samples.png",
    caption: "DESIGN SAMPLES · SOCIAL + WEB",
    span: "full",
  },
  {
    src: "/images/work/cc-closing.jpg",
    caption: "WHERE CREATIVITY MEETS TECHNOLOGY",
    span: "full",
  },
];

export default function CodeCanvasCaseStudy() {
  return (
    <main>
      <ScrollyCaseStudy
        record={CODE_CANVAS}
        gallery={<CaseGallery items={GALLERY} />}
      />
    </main>
  );
}
