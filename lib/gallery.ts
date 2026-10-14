// AUTO-GENERATED gallery data — cross-project image gallery.
// Aggregates brand imagery from every case study, grouped by project.

export interface GalleryProject {
  slug: string;
  label: string;
  labelAr: string;
  accent: string; // hex used for chips, tags, hover ring
  href: string;   // link to the full case study
}

export interface GalleryImage {
  src: string;
  project: string; // GalleryProject.slug
  caption: string;
  captionAr: string;
  w: number;
  h: number;
}

export const GALLERY_PROJECTS: readonly GalleryProject[] = [
  { slug: "nile-pharma", label: "Nile Pharma Food", labelAr: "نايل فارما", accent: "#4263EB", href: "/case-studies/nile-pharma" },
  { slug: "gad-institute", label: "GAD Institute", labelAr: "معهد GAD", accent: "#1E72C8", href: "/case-studies/gad-institute" },
  { slug: "reflection", label: "Reflection", labelAr: "ريفلكشن", accent: "#A06BD0", href: "/case-studies/reflection" },
  { slug: "ahmed-bedeer", label: "Ahmed Bedeer", labelAr: "أحمد بدير", accent: "#15A0C8", href: "/case-studies/ahmed-bedeer" },
  { slug: "code-canvas", label: "Code & Canvas", labelAr: "كود آند كانفاس", accent: "#8A63D2", href: "/case-studies/code-canvas" },
] as const;

export const GALLERY_IMAGES: readonly GalleryImage[] = [
  { src: "/images/work/nile-pharma/npf-logo-waves.png", project: "nile-pharma", caption: "Identity on palm leaves", captionAr: "الهوية على سعف النخيل", w: 1181, h: 1594 },
  { src: "/images/work/nile-pharma/npf-logo-grid.png", project: "nile-pharma", caption: "Geometric logo construction", captionAr: "بناء الشعار الهندسي", w: 1400, h: 700 },
  { src: "/images/work/nile-pharma/npf-business-card-box.jpg", project: "nile-pharma", caption: "Business card — packaging", captionAr: "الكارت — التغليف", w: 4000, h: 3000 },
  { src: "/images/work/nile-pharma/npf-proxeed-products.png", project: "nile-pharma", caption: "Proxeed Plus & Proxerex", captionAr: "بروكسيد بلس وبروكسيركس", w: 652, h: 454 },
  { src: "/images/work/nile-pharma/npf-ramadan.png", project: "nile-pharma", caption: "Ramadan campaign", captionAr: "حملة رمضان", w: 1880, h: 1576 },
  { src: "/images/work/nile-pharma/npf-proxeed-post.jpg", project: "nile-pharma", caption: "Proxeed — campaign", captionAr: "بروكسيد — حملة", w: 1880, h: 1576 },
  { src: "/images/work/nile-pharma/npf-img-b.png", project: "nile-pharma", caption: "Billboard — New Story", captionAr: "بيلبورد — قصة جديدة", w: 1400, h: 1050 },
  { src: "/images/work/nile-pharma/npf-img-c.png", project: "nile-pharma", caption: "Product flyers", captionAr: "فلايرات المنتجات", w: 1400, h: 700 },
  { src: "/images/work/nile-pharma/npf-img-a.png", project: "nile-pharma", caption: "We care about you", captionAr: "نهتم بك", w: 1400, h: 700 },
  { src: "/images/work/nile-pharma/npf-ezaby-post.jpg", project: "nile-pharma", caption: "Ezaby — social post", captionAr: "إزابي — بوست سوشيال", w: 1880, h: 1576 },
  { src: "/images/work/nile-pharma/npf-logo-motion.webp", project: "nile-pharma", caption: "Logo motion study", captionAr: "دراسة حركة الشعار", w: 1400, h: 700 },
  { src: "/images/work/gad/gad-cover.png", project: "gad-institute", caption: "Cover", captionAr: "Cover", w: 1400, h: 933 },
  { src: "/images/work/gad/gad-logo-symbol.png", project: "gad-institute", caption: "Logo symbol", captionAr: "Logo symbol", w: 1400, h: 933 },
  { src: "/images/work/gad/gad-logo-anatomy.png", project: "gad-institute", caption: "Logo anatomy", captionAr: "Logo anatomy", w: 1400, h: 933 },
  { src: "/images/work/gad/gad-logo-variations.png", project: "gad-institute", caption: "Logo variations", captionAr: "Logo variations", w: 1400, h: 933 },
  { src: "/images/work/gad/gad-colors-primary.png", project: "gad-institute", caption: "Colors primary", captionAr: "Colors primary", w: 1400, h: 933 },
  { src: "/images/work/gad/gad-colors-infographic.png", project: "gad-institute", caption: "Colors infographic", captionAr: "Colors infographic", w: 1400, h: 933 },
  { src: "/images/work/gad/gad-typography.png", project: "gad-institute", caption: "Typography", captionAr: "Typography", w: 1400, h: 933 },
  { src: "/images/work/gad/gad-mockup-logo.jpg", project: "gad-institute", caption: "Mockup logo", captionAr: "Mockup logo", w: 1600, h: 1067 },
  { src: "/images/work/gad/gad-mockup-card.jpg", project: "gad-institute", caption: "Mockup card", captionAr: "Mockup card", w: 1600, h: 1067 },
  { src: "/images/work/gad/gad-mockup-outdoor.jpg", project: "gad-institute", caption: "Mockup outdoor", captionAr: "Mockup outdoor", w: 1600, h: 1067 },
  { src: "/images/work/gad/gad-mockup-exhibition.jpg", project: "gad-institute", caption: "Mockup exhibition", captionAr: "Mockup exhibition", w: 1600, h: 1067 },
  { src: "/images/work/gad/gad-signage-environmental.jpg", project: "gad-institute", caption: "Signage environmental", captionAr: "Signage environmental", w: 1600, h: 1067 },
  { src: "/images/work/reflection/refl-cover.png", project: "reflection", caption: "Cover", captionAr: "Cover", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-overview.jpg", project: "reflection", caption: "Overview", captionAr: "Overview", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-logo-lockup.jpg", project: "reflection", caption: "Logo lockup", captionAr: "Logo lockup", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-logo-anatomy.jpg", project: "reflection", caption: "Logo anatomy", captionAr: "Logo anatomy", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-focal-area.jpg", project: "reflection", caption: "Focal area", captionAr: "Focal area", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-colors.jpg", project: "reflection", caption: "Colors", captionAr: "Colors", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-typeface.jpg", project: "reflection", caption: "Typeface", captionAr: "Typeface", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-fonts-preview.jpg", project: "reflection", caption: "Fonts preview", captionAr: "Fonts preview", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-preview.jpg", project: "reflection", caption: "Preview", captionAr: "Preview", w: 1400, h: 1000 },
  { src: "/images/work/reflection/refl-example.jpg", project: "reflection", caption: "Example", captionAr: "Example", w: 1400, h: 1000 },
  { src: "/images/work/ahmed-bedeer-cover.jpg", project: "ahmed-bedeer", caption: "Cover", captionAr: "Cover", w: 1600, h: 889 },
  { src: "/images/work/ahmed-bedeer-logo.png", project: "ahmed-bedeer", caption: "Logo", captionAr: "Logo", w: 1600, h: 889 },
  { src: "/images/work/ahmed-bedeer-construction.png", project: "ahmed-bedeer", caption: "Construction", captionAr: "Construction", w: 1600, h: 889 },
  { src: "/images/work/ahmed-bedeer-colors.png", project: "ahmed-bedeer", caption: "Colors", captionAr: "Colors", w: 1600, h: 889 },
  { src: "/images/work/ahmed-bedeer-colors-ext.png", project: "ahmed-bedeer", caption: "Colors ext", captionAr: "Colors ext", w: 1600, h: 889 },
  { src: "/images/work/ahmed-bedeer-type.png", project: "ahmed-bedeer", caption: "Type", captionAr: "Type", w: 1600, h: 889 },
  { src: "/images/work/ahmed-bedeer-applications.jpg", project: "ahmed-bedeer", caption: "Applications", captionAr: "Applications", w: 1600, h: 889 },
  { src: "/images/work/ahmed-bedeer-mockup.jpg", project: "ahmed-bedeer", caption: "Mockup", captionAr: "Mockup", w: 1600, h: 1200 },
  { src: "/images/work/cc-cover.jpg", project: "code-canvas", caption: "Cover", captionAr: "Cover", w: 1600, h: 947 },
  { src: "/images/work/cc-logo-hero.jpg", project: "code-canvas", caption: "Logo hero", captionAr: "Logo hero", w: 1600, h: 947 },
  { src: "/images/work/cc-wordmark.png", project: "code-canvas", caption: "Wordmark", captionAr: "Wordmark", w: 1600, h: 947 },
  { src: "/images/work/cc-logo-variants.jpg", project: "code-canvas", caption: "Logo variants", captionAr: "Logo variants", w: 1600, h: 947 },
  { src: "/images/work/cc-icon-construction.png", project: "code-canvas", caption: "Icon construction", captionAr: "Icon construction", w: 1600, h: 947 },
  { src: "/images/work/cc-colors-dark.png", project: "code-canvas", caption: "Colors dark", captionAr: "Colors dark", w: 1600, h: 947 },
  { src: "/images/work/cc-gradients.png", project: "code-canvas", caption: "Gradients", captionAr: "Gradients", w: 1600, h: 947 },
  { src: "/images/work/cc-typography.png", project: "code-canvas", caption: "Typography", captionAr: "Typography", w: 1600, h: 947 },
  { src: "/images/work/cc-design-samples.png", project: "code-canvas", caption: "Design samples", captionAr: "Design samples", w: 1600, h: 947 },
  { src: "/images/work/cc-manifesto.png", project: "code-canvas", caption: "Manifesto", captionAr: "Manifesto", w: 1600, h: 947 },
  { src: "/images/work/cc-poster-mockup.jpg", project: "code-canvas", caption: "Poster mockup", captionAr: "Poster mockup", w: 1600, h: 947 },
  { src: "/images/work/cc-closing.jpg", project: "code-canvas", caption: "Closing", captionAr: "Closing", w: 1600, h: 947 },
] as const;

export function imagesFor(project: string | null): readonly GalleryImage[] {
  if (!project || project === "all") return GALLERY_IMAGES;
  return GALLERY_IMAGES.filter((g) => g.project === project);
}
