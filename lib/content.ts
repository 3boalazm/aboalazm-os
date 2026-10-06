/**
 * CONTENT ADAPTERS — bridge Payload's document shape to the exact
 * `Project` / `CaseStudyRecord` types the UI already consumes.
 *
 * Resilience: When running in environments where DATABASE_URI or PAYLOAD_SECRET
 * are not configured (local preview, tests, CI/CD, or offline), it gracefully
 * falls back to the rich static repository data so the application never breaks.
 */
import type { Project } from "@/features/work/types";
import type { CaseStudyRecord } from "@/features/case-studies/types";
import type { GalleryItem } from "@/features/case-studies/case-gallery";
import type { Bi, Tier, AlaCarteGroup } from "@/lib/offers";
import type { Media, Project as PayloadProject, CaseStudy as PayloadCaseStudy } from "@/payload-types";

import { PROJECTS as STATIC_PROJECTS } from "@/features/work/projects.data";
import { GAD_INSTITUTE } from "@/features/case-studies/gad-institute.data";
import { NILE_PHARMA } from "@/features/case-studies/demo.data";
import { REFLECTION } from "@/features/case-studies/reflection.data";
import { AHMED_BEDEER } from "@/features/case-studies/ahmed-bedeer.data";
import { CODE_CANVAS } from "@/features/case-studies/code-canvas.data";
import { TIERS, ALACARTE } from "@/lib/offers";

const STATIC_CASE_STUDIES: Record<string, CaseStudyRecord> = {
  "gad-institute": GAD_INSTITUTE,
  "nile-pharma": NILE_PHARMA,
  reflection: REFLECTION,
  "ahmed-bedeer": AHMED_BEDEER,
  "code-canvas": CODE_CANVAS,
};

const STATIC_GALLERIES: Record<string, GalleryItem[]> = {
  "gad-institute": [
    { src: "/images/work/gad/gad-mockup-logo.jpg", caption: "BRAND MARK · HEART + LUNG, FUSED", captionAr: "الشعار · قلب + رئة، مدموجان", span: "full" },
    { src: "/images/work/gad/gad-cover.png", caption: "BRAND IDENTITY · V2.0 COVER", captionAr: "هوية البراند · غلاف V2.0" },
    { src: "/images/work/gad/gad-logo-anatomy.png", caption: "LOGO ANATOMY · LOCKUP ELEMENTS", captionAr: "تشريح اللوجو · عناصر الـ Lockup" },
    { src: "/images/work/gad/gad-logo-variations.png", caption: "VARIATIONS · EN / AR · H / V", captionAr: "المتغيرات · إنجليزي / عربي · أفقي / عمودي", span: "full" },
    { src: "/images/work/gad/gad-logo-symbol.png", caption: "SYMBOL ONLY · FAVICON-READY", captionAr: "الرمز فقط · جاهز للـ Favicon" },
    { src: "/images/work/gad/gad-colors-primary.png", caption: "PRIMARY PALETTE · DEEP BLUE + CRIMSON", captionAr: "اللوحة الأساسية · أزرق عميق + قرمزي" },
    { src: "/images/work/gad/gad-colors-infographic.png", caption: "INFOGRAPHIC PALETTE · DATA SYSTEM", captionAr: "لوحة الإنفوجرافيك · نظام البيانات" },
    { src: "/images/work/gad/gad-typography.png", caption: "TYPE · TRAP · MONTSERRAT · ALEXANDRIA", captionAr: "الخطوط · Trap + Montserrat + Alexandria", span: "full" },
    { src: "/images/work/gad/gad-mockup-card.jpg", caption: "STATIONERY · BUSINESS CARD", captionAr: "القرطاسية · الكارت" },
    { src: "/images/work/gad/gad-signage-environmental.jpg", caption: "ENVIRONMENTAL · FACADE SIGN", captionAr: "البيئي · لافتة الواجهة" },
    { src: "/images/work/gad/gad-mockup-outdoor.jpg", caption: "OUTDOOR · GENUINE ACCESSIBLE CARE", captionAr: "الخارجي · رعاية حقيقية متاحة" },
    { src: "/images/work/gad/gad-mockup-exhibition.jpg", caption: "EXHIBITION STAND · VISION 2030", captionAr: "ستاند المعرض · رؤية 2030", span: "full" },
  ],
  "nile-pharma": [
    { src: "/images/work/nile-pharma/npf-business-card-box.jpg", caption: "PACKAGING · THE BLUE BOX & CARDS", captionAr: "التغليف · العلبة الزرقاء والكروت", span: "full" },
    { src: "/images/work/nile-pharma/npf-logo-grid.png", caption: "LOGO CONSTRUCTION GRID", captionAr: "شبكة بناء الشعار الهندسية" },
    { src: "/images/work/nile-pharma/npf-logo-waves.png", caption: "IDENTITY ON PALM LEAVES", captionAr: "الهوية على سعف النخيل" },
    { src: "/images/work/nile-pharma/npf-proxeed-products.png", caption: "PROXEED PLUS & PROXEREX PACKAGING", captionAr: "تغليف بروكسيد بلس وبروكسيركس", span: "full" },
    { src: "/images/work/nile-pharma/npf-img-b.png", caption: "HIGHWAY BILLBOARD CAMPAIGN", captionAr: "حملة اللوحات الإعلانية بالطرق السريعة", span: "full" },
    { src: "/images/work/nile-pharma/npf-img-c.png", caption: "CLINICAL PRODUCT FLYERS", captionAr: "فلايرات المنتجات الطبية" },
    { src: "/images/work/nile-pharma/npf-img-a.png", caption: "BRAND VOICE · WE CARE ABOUT YOU", captionAr: "صوت البراند · نهتم بك" },
    { src: "/images/work/nile-pharma/npf-ramadan.png", caption: "RAMADAN CAMPAIGN POST", captionAr: "منشور حملة رمضان المبارك" },
    { src: "/images/work/nile-pharma/npf-ezaby-post.jpg", caption: "RETAIL PHARMACY SOCIAL POST", captionAr: "منشور صيدليات العزبي" },
    { src: "/images/work/nile-pharma/npf-logo-motion.gif", caption: "LOGO MOTION STUDY", captionAr: "دراسة حركة الشعار", span: "full" },
  ],
  reflection: [
    { src: "/images/work/reflection/refl-cover.png", caption: "BRAND IDENTITY · V1.0 COVER", captionAr: "هوية البراند · غلاف V1.0", span: "full" },
    { src: "/images/work/reflection/refl-logo-anatomy.jpg", caption: "LOGO ANATOMY · ICON + WORDMARK", captionAr: "تشريح اللوجو · الأيقونة + الـ Wordmark" },
    { src: "/images/work/reflection/refl-logo-lockup.jpg", caption: "LOCKUPS · VERTICAL + HORIZONTAL", captionAr: "الـ Lockups · عمودي + أفقي" },
    { src: "/images/work/reflection/refl-colors.jpg", caption: "COLOR · WHITE BASE + SPECTRUM", captionAr: "اللون · قاعدة بيضاء + الطيف", span: "full" },
    { src: "/images/work/reflection/refl-typeface.jpg", caption: "TYPE · NEUE MACHINA + QUICKSAND", captionAr: "الخط · Neue Machina + Quicksand" },
    { src: "/images/work/reflection/refl-fonts-preview.jpg", caption: "WEIGHTS · DISPLAY TO BODY", captionAr: "الأوزان · من العرض للمتن" },
    { src: "/images/work/reflection/refl-focal-area.jpg", caption: "FOCAL AREA · IMAGE · HEADLINE · ICON", captionAr: "المنطقة المحورية · صورة · عنوان · أيقونة", span: "full" },
    { src: "/images/work/reflection/refl-overview.jpg", caption: "PRODUCT · FRAMED ART IN CONTEXT", captionAr: "المنتج · فن مؤطّر في السياق" },
    { src: "/images/work/reflection/refl-example.jpg", caption: "SYSTEM · COMPOSITION RECIPES", captionAr: "النظام · وصفات التكوين" },
    { src: "/images/work/reflection/refl-preview.jpg", caption: "IN USE · STOREFRONT + TAG", captionAr: "في الاستخدام · واجهة + علامة", span: "full" },
  ],
  "ahmed-bedeer": [
    { src: "/images/work/ahmed-bedeer-mockup.jpg", caption: "BUSINESS CARD MOCKUP · ab ON FABRIC", captionAr: "ماكيت الكارت · ab على القماش", span: "full" },
    { src: "/images/work/ahmed-bedeer-cover.jpg", caption: "BRAND COVER · ab MONOGRAM", captionAr: "غلاف البراند · مونوجرام ab", span: "full" },
    { src: "/images/work/ahmed-bedeer-logo.png", caption: "LOGO CONCEPT · QUOTATION FORM", captionAr: "مفهوم اللوجو · شكل الاقتباس" },
    { src: "/images/work/ahmed-bedeer-construction.png", caption: "LOGO CONSTRUCTION · a + b", captionAr: "بناء اللوجو · a + b" },
    { src: "/images/work/ahmed-bedeer-applications.jpg", caption: "ON MEDIA · SURFACE · COLOUR", captionAr: "على الميديا · السطح · اللون", span: "full" },
    { src: "/images/work/ahmed-bedeer-colors.png", caption: "PRIMARY PALETTE", captionAr: "اللوحة الأساسية" },
    { src: "/images/work/ahmed-bedeer-colors-ext.png", caption: "EXTENDED PALETTE", captionAr: "اللوحة الموسّعة" },
    { src: "/images/work/ahmed-bedeer-type.png", caption: "TYPEFACE · LUBALIN GRAPH + UNCUT SANS", captionAr: "الخط · Lubalin Graph + Uncut Sans", span: "full" },
  ],
  "code-canvas": [
    { src: "/images/work/cc-logo-hero.jpg", caption: "BRAND MARK · THE SQUIRCLE </>", span: "full" },
    { src: "/images/work/cc-cover.jpg", caption: "BRAND GUIDELINES COVER · V1.0", captionAr: "غلاف دليل الهوية · V1.0" },
    { src: "/images/work/cc-manifesto.png", caption: "BRAND MANIFESTO", captionAr: "البيان التأسيسي" },
    { src: "/images/work/cc-icon-construction.png", caption: "ICON CONSTRUCTION · SQUIRCLE GRID", captionAr: "بناء الأيقونة · شبكة Squircle" },
    { src: "/images/work/cc-wordmark.png", caption: "WORDMARK · CODE & CANVAS", captionAr: "الـ Wordmark · Code & Canvas" },
    { src: "/images/work/cc-logo-variants.jpg", caption: "LOGO VARIANTS · DARK / LIGHT / GRADIENT", captionAr: "متغيرات اللوجو · داكن / فاتح / متدرج", span: "full" },
    { src: "/images/work/cc-poster-mockup.jpg", caption: "PRINT APPLICATION · POSTER MOCKUP", captionAr: "تطبيق مطبوع · ماكيت بوستر" },
    { src: "/images/work/cc-colors-dark.png", caption: "COLOR SYSTEM · DARK CANVAS", captionAr: "نظام الألوان · القماش الداكن" },
    { src: "/images/work/cc-gradients.png", caption: "GRADIENT LIBRARY · 8 VARIANTS", captionAr: "مكتبة التدرجات · ٨ متغيرات" },
    { src: "/images/work/cc-typography.png", caption: "TYPOGRAPHY · SIGNATE GROTESK + RALEWAY + POPPINS", captionAr: "الطباعة · Signate + Raleway + Poppins" },
    { src: "/images/work/cc-design-samples.png", caption: "DESIGN SAMPLES · SOCIAL + WEB", captionAr: "نماذج تصميم · سوشيال + ويب", span: "full" },
    { src: "/images/work/cc-closing.jpg", caption: "WHERE CREATIVITY MEETS TECHNOLOGY", captionAr: "حيث يلتقي الإبداع بالتكنولوجيا", span: "full" },
  ],
};

function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URI && process.env.PAYLOAD_SECRET);
}

function mediaUrl(media: number | Media | null | undefined): string {
  if (media && typeof media === "object") return media.url ?? "";
  return "";
}

function toProject(doc: PayloadProject): Project {
  return {
    slug: doc.slug,
    name: doc.name,
    nameAr: doc.nameAr ?? undefined,
    category: doc.category,
    discipline: doc.discipline,
    stack: doc.stack ?? [],
    outcome: doc.outcome,
    outcomeAr: doc.outcomeAr ?? undefined,
    year: doc.year,
    thumbnail: mediaUrl(doc.thumbnail),
    hasCaseStudy: doc.hasCaseStudy ?? false,
    externalUrl: doc.externalUrl ?? undefined,
    isUiUx: doc.isUiUx ?? false,
    liveUrl: doc.liveUrl ?? undefined,
    accent: { primary: doc.accent.primary, secondary: doc.accent.secondary },
  };
}

export async function getUiUxProjects(): Promise<Project[]> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({
        collection: "projects",
        where: {
          and: [{ isUiUx: { equals: true } }, { liveUrl: { exists: true } }],
        },
        limit: 100,
        sort: "-year",
        overrideAccess: false,
      });
      if (res.docs.length > 0) return res.docs.map(toProject).filter((p) => p.liveUrl);
    } catch {
      // Fall through to static
    }
  }
  return (STATIC_PROJECTS as unknown as Project[]).filter((p) => p.isUiUx && p.liveUrl);
}

export async function getProjects(): Promise<Project[]> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({
        collection: "projects",
        limit: 100,
        sort: "-year",
        overrideAccess: false,
      });
      if (res.docs.length > 0) return res.docs.map(toProject);
    } catch {
      // Fall through to static
    }
  }
  return STATIC_PROJECTS as unknown as Project[];
}

function toCaseStudy(doc: PayloadCaseStudy): CaseStudyRecord {
  return {
    slug: doc.slug,
    name: doc.name,
    nameAr: doc.nameAr ?? undefined,
    discipline: doc.discipline,
    accent: { primary: doc.accent.primary, secondary: doc.accent.secondary },

    problem: doc.problem,
    problemAr: doc.problemAr ?? undefined,
    teamScale: doc.teamScale ?? "",
    teamScaleAr: doc.teamScaleAr ?? undefined,
    timeline: doc.timeline ?? "",
    timelineAr: doc.timelineAr ?? undefined,
    kpis: (doc.kpis ?? []).map((k) => ({
      value: k.value,
      label: k.label,
      labelAr: k.labelAr ?? undefined,
      context: k.context ?? undefined,
      contextAr: k.contextAr ?? undefined,
    })),

    researchSummary: doc.researchSummary,
    researchSummaryAr: doc.researchSummaryAr ?? undefined,
    competitors: (doc.competitors ?? []).map((c) => ({
      name: c.name,
      x: c.x,
      y: c.y,
      isClient: c.isClient ?? undefined,
    })),
    visualVectors: doc.visualVectors ?? [],
    visualVectorsAr: doc.visualVectorsAr ?? undefined,

    tokens: (doc.tokens ?? []).map((t) => ({
      token: t.token,
      value: t.value,
      role: t.role,
      roleAr: t.roleAr ?? undefined,
    })),
    componentStates: doc.componentStates ?? [],
    breakpoints: (doc.breakpoints ?? []).map((b) => ({ bp: b.bp, cols: b.cols })),
    images: [],

    results: (doc.results ?? []).map((k) => ({
      value: k.value,
      label: k.label,
      labelAr: k.labelAr ?? undefined,
      context: k.context ?? undefined,
      contextAr: k.contextAr ?? undefined,
    })),
    retro: (doc.retro ?? []).map((r) => ({
      verdict: r.verdict,
      note: r.note,
      noteAr: r.noteAr ?? undefined,
    })),
  };
}

export async function getCaseStudy(slug: string): Promise<CaseStudyRecord | null> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({
        collection: "case-studies",
        where: { slug: { equals: slug } },
        limit: 1,
        overrideAccess: false,
      });
      const doc = res.docs[0];
      if (doc) {
        const record = toCaseStudy(doc);
        const staticRecord = STATIC_CASE_STUDIES[slug];
        if (staticRecord) {
          record.narrativeAnswers = staticRecord.narrativeAnswers;
          record.designProofItems = staticRecord.designProofItems;
        }
        return record;
      }
    } catch {
      // Fall through to static
    }
  }
  return STATIC_CASE_STUDIES[slug] ?? null;
}

export interface SitemapSource {
  slug: string;
  updatedAt: string;
}

/** Slug + last-modified for every published post / case study (sitemap.xml). */
export async function getSitemapSources(): Promise<{
  posts: SitemapSource[];
  caseStudies: SitemapSource[];
}> {
  // Sitemap generation must remain safe when Payload/DB is unavailable
  // (local preview, CI, or environments without CMS credentials).
  if (!hasDb()) return { posts: [], caseStudies: [] };

  try {
    const { getPayload } = await import("./payload");
    const payload = await getPayload();
    const [posts, caseStudies] = await Promise.all([
      payload.find({
        collection: "posts",
        limit: 100,
        select: { slug: true, updatedAt: true },
        overrideAccess: false,
      }),
      payload.find({
        collection: "case-studies",
        limit: 100,
        select: { slug: true, updatedAt: true },
        overrideAccess: false,
      }),
    ]);
    const pick = (d: { slug: string; updatedAt: string }) => ({ slug: d.slug, updatedAt: d.updatedAt });
    return { posts: posts.docs.map(pick), caseStudies: caseStudies.docs.map(pick) };
  } catch {
    return { posts: [], caseStudies: [] };
  }
}

export async function getAllCaseStudySlugs(): Promise<string[]> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({
        collection: "case-studies",
        limit: 100,
        select: { slug: true },
        overrideAccess: false,
      });
      if (res.docs.length > 0) return res.docs.map((d) => d.slug);
    } catch {
      // Fall through
    }
  }
  return Object.keys(STATIC_CASE_STUDIES);
}

export async function getCaseStudyGallery(slug: string): Promise<GalleryItem[]> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({
        collection: "case-studies",
        where: { slug: { equals: slug } },
        limit: 1,
        overrideAccess: false,
      });
      const doc = res.docs[0];
      if (doc && (doc.images ?? []).length > 0) {
        return (doc.images ?? []).map((img) => ({
          src: mediaUrl(img.image),
          caption: img.caption ?? "",
          captionAr: img.captionAr ?? undefined,
          span: img.span ?? undefined,
        }));
      }
    } catch {
      // Fall through to static
    }
  }
  return STATIC_GALLERIES[slug] ?? [];
}

export async function getSettings(): Promise<{ cvUrl: string | null }> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const settings = await payload.findGlobal({ slug: "settings" });
      const url = mediaUrl(settings.cv);
      if (url && url.endsWith("Mustafa_Taha_Brand_Identity_CV.docx")) return { cvUrl: "/Mustafa_Taha_Brand_Identity_CV.docx" };
    } catch {
      // Fall through
    }
  }
  return { cvUrl: "/cv" };
}

export async function getOffers(): Promise<{
  tiers: Tier[];
  investmentValue: { value: string; en: string; ar: string; subEn?: string | null; subAr?: string | null; pending?: boolean | null }[];
  alaCarte: AlaCarteGroup[];
}> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const offers = await payload.findGlobal({ slug: "offers" });
      const toBi = (g: { en?: string | null; ar?: string | null } | null | undefined): Bi => [
        g?.en ?? "",
        g?.ar ?? "",
      ];

      const tiers: Tier[] = (offers.tiers ?? []).map((t) => ({
        tag: toBi(t.tag),
        name: toBi(t.name),
        price: t.price,
        priceNote: toBi(t.priceNote),
        bestFor: toBi(t.bestFor),
        duration: toBi(t.duration),
        payment: t.payment,
        recommended: t.recommended ?? undefined,
        includesHead: toBi(t.includesHead),
        includes: (t.includes ?? []).map(toBi),
        excludes: (t.excludes ?? []).map(toBi),
      }));

      const alaCarte: AlaCarteGroup[] = (offers.alaCarte ?? []).map((g) => ({
        group: toBi(g.group),
        rows: (g.rows ?? []).map((r) => ({
          service: toBi(r.service),
          details: toBi(r.details),
          price: r.price,
        })),
      }));

      if (tiers.length > 0) {
        return { tiers, investmentValue: offers.investmentValue ?? [], alaCarte };
      }
    } catch {
      // Fall through
    }
  }
  return { tiers: TIERS as unknown as Tier[], investmentValue: [], alaCarte: ALACARTE as unknown as AlaCarteGroup[] };
}

export async function getPost(slug: string) {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({
        collection: "posts",
        where: { slug: { equals: slug } },
        limit: 1,
        overrideAccess: false,
      });
      const doc = res.docs[0];
      if (doc) {
        return {
          index: doc.index ?? "",
          slug: doc.slug,
          title: doc.title,
          standfirst: doc.standfirst ?? "",
          publishedAt: doc.publishedAt ?? "",
          lang: doc.lang ?? "en",
          topics: doc.topics ?? [],
          body: doc.body,
        };
      }
    } catch {
      // Fall through
    }
  }
  return null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({
        collection: "posts",
        limit: 100,
        select: { slug: true },
        overrideAccess: false,
      });
      if (res.docs.length > 0) return res.docs.map((d) => d.slug);
    } catch {
      // Fall through
    }
  }
  return [];
}

export async function getPosts(): Promise<
  {
    index: string;
    slug: string;
    title: string;
    standfirst: string;
    publishedAt: string;
    lang: "en" | "ar";
    topics: string[];
  }[]
> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({
        collection: "posts",
        limit: 100,
        sort: "-publishedAt",
        overrideAccess: false,
      });
      return res.docs.map((d) => ({
        index: d.index ?? "",
        slug: d.slug,
        title: d.title,
        standfirst: d.standfirst ?? "",
        publishedAt: d.publishedAt ?? "",
        lang: d.lang ?? "en",
        topics: d.topics ?? [],
      }));
    } catch {
      // Fall through
    }
  }
  return [];
}

export async function getGalleryData(): Promise<{
  projects: { slug: string; label: string; labelAr: string; accent: string; href: string }[];
  images: { src: string; project: string; caption: string; captionAr: string; w: number; h: number }[];
}> {
  if (hasDb()) {
    try {
      const { getPayload } = await import("./payload");
      const payload = await getPayload();
      const res = await payload.find({ collection: "case-studies", limit: 100, overrideAccess: false });

      if (res.docs.length > 0) {
        const projects = res.docs
          .filter((d) => (d.images ?? []).length > 0)
          .map((d) => ({
            slug: d.slug,
            label: d.name,
            labelAr: d.nameAr ?? d.name,
            accent: d.accent.primary,
            href: `/case-studies/${d.slug}`,
          }));

        const images = res.docs.flatMap((d) =>
          (d.images ?? []).map((img) => {
            const media = img.image;
            const isMediaObj = typeof media === "object" && media !== null;
            return {
              src: mediaUrl(media),
              project: d.slug,
              caption: img.caption ?? "",
              captionAr: img.captionAr ?? img.caption ?? "",
              w: isMediaObj ? media.width ?? 1200 : 1200,
              h: isMediaObj ? media.height ?? 800 : 800,
            };
          }),
        );

        return { projects, images };
      }
    } catch {
      // Fall through
    }
  }

  // Static gallery data fallback
  const projects = Object.entries(STATIC_CASE_STUDIES).map(([slug, s]) => ({
    slug,
    label: s.name,
    labelAr: s.nameAr ?? s.name,
    accent: s.accent.primary,
    href: `/case-studies/${slug}`,
  }));

  const images = Object.entries(STATIC_GALLERIES).flatMap(([slug, items]) =>
    items.map((img) => ({
      src: img.src,
      project: slug,
      caption: img.caption ?? "",
      captionAr: img.captionAr ?? img.caption ?? "",
      w: 1200,
      h: 800,
    })),
  );

  return { projects, images };
}
