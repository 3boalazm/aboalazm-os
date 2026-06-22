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
    captionAr: "غلاف دليل الهوية · V1.0",
  },
  {
    src: "/images/work/cc-manifesto.png",
    caption: "BRAND MANIFESTO",
    captionAr: "البيان التأسيسي",
  },
  {
    src: "/images/work/cc-icon-construction.png",
    caption: "ICON CONSTRUCTION · SQUIRCLE GRID",
    captionAr: "بناء الأيقونة · شبكة Squircle",
  },
  {
    src: "/images/work/cc-wordmark.png",
    caption: "WORDMARK · CODE & CANVAS",
    captionAr: "الـ Wordmark · Code & Canvas",
  },
  {
    src: "/images/work/cc-logo-variants.jpg",
    caption: "LOGO VARIANTS · DARK / LIGHT / GRADIENT",
    captionAr: "متغيرات اللوجو · داكن / فاتح / متدرج",
    span: "full",
  },
  {
    src: "/images/work/cc-poster-mockup.jpg",
    caption: "PRINT APPLICATION · POSTER MOCKUP",
    captionAr: "تطبيق مطبوع · ماكيت بوستر",
  },
  {
    src: "/images/work/cc-colors-dark.png",
    caption: "COLOR SYSTEM · DARK CANVAS",
    captionAr: "نظام الألوان · القماش الداكن",
  },
  {
    src: "/images/work/cc-gradients.png",
    caption: "GRADIENT LIBRARY · 8 VARIANTS",
    captionAr: "مكتبة التدرجات · ٨ متغيرات",
  },
  {
    src: "/images/work/cc-typography.png",
    caption: "TYPOGRAPHY · SIGNATE GROTESK + RALEWAY + POPPINS",
    captionAr: "الطباعة · Signate + Raleway + Poppins",
  },
  {
    src: "/images/work/cc-design-samples.png",
    caption: "DESIGN SAMPLES · SOCIAL + WEB",
    captionAr: "نماذج تصميم · سوشيال + ويب",
    span: "full",
  },
  {
    src: "/images/work/cc-closing.jpg",
    caption: "WHERE CREATIVITY MEETS TECHNOLOGY",
    captionAr: "حيث يلتقي الإبداع بالتكنولوجيا",
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
