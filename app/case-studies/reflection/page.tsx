import type { Metadata } from "next";
import {
  ScrollyCaseStudy,
  CaseGallery,
  REFLECTION,
  type GalleryItem,
} from "@/features/case-studies";

export const metadata: Metadata = {
  title: "Reflection — Case File",
  description:
    "Brand identity for a premium made-to-order art-print studio — a constructed-R mark, an airy white system with a violet→turquoise spectrum, Neue Machina + Quicksand, and a focal-area layout doctrine. V1.0 brand book.",
};

const GALLERY: readonly GalleryItem[] = [
  {
    src: "/images/work/reflection/refl-cover.png",
    caption: "BRAND IDENTITY · V1.0 COVER",
    span: "full",
  },
  {
    src: "/images/work/reflection/refl-logo-anatomy.jpg",
    caption: "LOGO ANATOMY · ICON + WORDMARK",
  },
  {
    src: "/images/work/reflection/refl-logo-lockup.jpg",
    caption: "LOCKUPS · VERTICAL + HORIZONTAL",
  },
  {
    src: "/images/work/reflection/refl-colors.jpg",
    caption: "COLOR · WHITE BASE + SPECTRUM",
    span: "full",
  },
  {
    src: "/images/work/reflection/refl-typeface.jpg",
    caption: "TYPE · NEUE MACHINA + QUICKSAND",
  },
  {
    src: "/images/work/reflection/refl-fonts-preview.jpg",
    caption: "WEIGHTS · DISPLAY TO BODY",
  },
  {
    src: "/images/work/reflection/refl-focal-area.jpg",
    caption: "FOCAL AREA · IMAGE · HEADLINE · ICON",
    span: "full",
  },
  {
    src: "/images/work/reflection/refl-overview.jpg",
    caption: "PRODUCT · FRAMED ART IN CONTEXT",
  },
  {
    src: "/images/work/reflection/refl-example.jpg",
    caption: "SYSTEM · COMPOSITION RECIPES",
  },
  {
    src: "/images/work/reflection/refl-preview.jpg",
    caption: "IN USE · STOREFRONT + TAG",
    span: "full",
  },
];

export default function ReflectionCaseStudy() {
  return (
    <main>
      <ScrollyCaseStudy
        record={REFLECTION}
        gallery={<CaseGallery items={GALLERY} />}
      />
    </main>
  );
}
