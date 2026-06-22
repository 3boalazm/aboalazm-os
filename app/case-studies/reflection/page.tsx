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
    captionAr: "هوية البراند · غلاف V1.0",
    span: "full",
  },
  {
    src: "/images/work/reflection/refl-logo-anatomy.jpg",
    caption: "LOGO ANATOMY · ICON + WORDMARK",
    captionAr: "تشريح اللوجو · الأيقونة + الـ Wordmark",
  },
  {
    src: "/images/work/reflection/refl-logo-lockup.jpg",
    caption: "LOCKUPS · VERTICAL + HORIZONTAL",
    captionAr: "الـ Lockups · عمودي + أفقي",
  },
  {
    src: "/images/work/reflection/refl-colors.jpg",
    caption: "COLOR · WHITE BASE + SPECTRUM",
    captionAr: "اللون · قاعدة بيضاء + الطيف",
    span: "full",
  },
  {
    src: "/images/work/reflection/refl-typeface.jpg",
    caption: "TYPE · NEUE MACHINA + QUICKSAND",
    captionAr: "الخط · Neue Machina + Quicksand",
  },
  {
    src: "/images/work/reflection/refl-fonts-preview.jpg",
    caption: "WEIGHTS · DISPLAY TO BODY",
    captionAr: "الأوزان · من العرض للمتن",
  },
  {
    src: "/images/work/reflection/refl-focal-area.jpg",
    caption: "FOCAL AREA · IMAGE · HEADLINE · ICON",
    captionAr: "المنطقة المحورية · صورة · عنوان · أيقونة",
    span: "full",
  },
  {
    src: "/images/work/reflection/refl-overview.jpg",
    caption: "PRODUCT · FRAMED ART IN CONTEXT",
    captionAr: "المنتج · فن مؤطّر في السياق",
  },
  {
    src: "/images/work/reflection/refl-example.jpg",
    caption: "SYSTEM · COMPOSITION RECIPES",
    captionAr: "النظام · وصفات التكوين",
  },
  {
    src: "/images/work/reflection/refl-preview.jpg",
    caption: "IN USE · STOREFRONT + TAG",
    captionAr: "في الاستخدام · واجهة + علامة",
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
