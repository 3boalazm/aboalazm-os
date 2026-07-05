/**
 * ONE-TIME SEED — migrates the existing static data files into Payload.
 * Run once against a fresh DB: `npx tsx scripts/seed.ts`
 *
 * Idempotency: media uploads are keyed by original file path in `alt`'s
 * hidden prefix-free lookup via filename match, and documents are keyed
 * by `slug` — re-running will skip anything whose slug already exists
 * rather than duplicating it.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import { PROJECTS } from "../features/work/projects.data";
import { NILE_PHARMA } from "../features/case-studies/demo.data";
import { AHMED_BEDEER } from "../features/case-studies/ahmed-bedeer.data";
import { CODE_CANVAS } from "../features/case-studies/code-canvas.data";
import { GAD_INSTITUTE } from "../features/case-studies/gad-institute.data";
import { REFLECTION } from "../features/case-studies/reflection.data";
import { TIERS } from "../lib/offers";
import type { CaseStudyRecord } from "../features/case-studies/types";
import type { GalleryItem } from "../features/case-studies/case-gallery";

/**
 * REAL galleries — extracted from the hardcoded GALLERY consts that used
 * to live inside each app/(site)/case-studies/<slug>/page.tsx file (now
 * replaced by a single dynamic [slug]/page.tsx). ahmed-bedeer.data.ts /
 * code-canvas.data.ts / gad-institute.data.ts / reflection.data.ts never
 * populated CaseStudyRecord.images — this was the only place this data
 * existed, so it's inlined here rather than derived from the .data.ts
 * files (which would just be empty).
 */
const GALLERIES: Record<string, GalleryItem[]> = {
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
    { src: "/images/work/gad/gad-signage-environmental.png", caption: "ENVIRONMENTAL · FACADE SIGN", captionAr: "البيئي · لافتة الواجهة" },
    { src: "/images/work/gad/gad-mockup-outdoor.jpg", caption: "OUTDOOR · GENUINE ACCESSIBLE CARE", captionAr: "الخارجي · رعاية حقيقية متاحة" },
    { src: "/images/work/gad/gad-mockup-exhibition.jpg", caption: "EXHIBITION STAND · VISION 2030", captionAr: "ستاند المعرض · رؤية 2030", span: "full" },
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
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, "../public");

// Standalone scripts don't get Next.js's automatic .env.local loading, and
// payload.config.ts reads process.env.PAYLOAD_SECRET at module-evaluation
// time — a static top-level `import config from "../payload.config"` would
// be hoisted above this and see an empty env. Load env vars first, THEN
// dynamically import the config, so ordering is actually correct.
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && match[1] && match[2] !== undefined) process.env[match[1].trim()] ??= match[2].trim();
  }
}
const config = (await import("../payload.config")).default;
const mediaCache = new Map<string, number>();

async function uploadMedia(payload: Awaited<ReturnType<typeof getPayload>>, publicPath: string, alt: string) {
  if (mediaCache.has(publicPath)) return mediaCache.get(publicPath)!;

  const absPath = path.join(PUBLIC_DIR, publicPath);
  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠ missing file, skipping: ${publicPath}`);
    return undefined;
  }

  const data = fs.readFileSync(absPath);
  const name = path.basename(absPath);
  const ext = path.extname(name).slice(1).toLowerCase();
  const mimetype =
    { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp" }[ext] ??
    "application/octet-stream";

  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: { data, mimetype, name, size: data.length },
  });

  const id = Number(doc.id);
  mediaCache.set(publicPath, id);
  return id;
}

async function exists(payload: Awaited<ReturnType<typeof getPayload>>, collection: "projects" | "case-studies", slug: string) {
  const res = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 });
  return res.docs.length > 0;
}

async function seedProjects(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log(`\n▶ Projects (${PROJECTS.length})`);
  for (const p of PROJECTS) {
    if (await exists(payload, "projects", p.slug)) {
      console.log(`  · ${p.slug} — already exists, skipping`);
      continue;
    }
    const thumbnail = await uploadMedia(payload, p.thumbnail, `${p.name} thumbnail`);
    if (!thumbnail) continue;

    await payload.create({
      collection: "projects",
      data: {
        slug: p.slug,
        name: p.name,
        nameAr: p.nameAr,
        category: p.category,
        discipline: p.discipline,
        stack: [...p.stack],
        outcome: p.outcome,
        outcomeAr: p.outcomeAr,
        year: p.year,
        thumbnail,
        hasCaseStudy: p.hasCaseStudy,
        externalUrl: p.externalUrl,
        accent: { primary: p.accent.primary, secondary: p.accent.secondary },
      },
      // Publish immediately — these are already-live projects, not drafts.
      draft: false,
    });
    console.log(`  ✓ ${p.slug}`);
  }
}

async function seedCaseStudy(payload: Awaited<ReturnType<typeof getPayload>>, record: CaseStudyRecord) {
  if (await exists(payload, "case-studies", record.slug)) {
    console.log(`  · ${record.slug} — already exists, skipping`);
    return;
  }

  // Real gallery lives in GALLERIES (extracted from the old per-page
  // hardcoded arrays); nile-pharma never had one of those, so it falls
  // back to its CaseStudyRecord.images (the only case study that ever
  // populated that field) — defaulting span to "half" since that field
  // never carried layout info before.
  const galleryItems: GalleryItem[] =
    GALLERIES[record.slug] ??
    (record.images ?? []).map((img) => ({
      src: img.src,
      caption: img.caption ?? "",
      captionAr: img.captionAr,
      span: "half" as const,
    }));

  const images = [];
  for (const item of galleryItems) {
    const media = await uploadMedia(payload, item.src, item.caption || record.name);
    if (media) images.push({ image: media, caption: item.caption, captionAr: item.captionAr, span: item.span ?? "half" });
  }

  await payload.create({
    collection: "case-studies",
    data: {
      slug: record.slug,
      name: record.name,
      nameAr: record.nameAr,
      discipline: record.discipline,
      accent: { primary: record.accent.primary, secondary: record.accent.secondary },
      problem: record.problem,
      problemAr: record.problemAr,
      teamScale: record.teamScale,
      teamScaleAr: record.teamScaleAr,
      timeline: record.timeline,
      timelineAr: record.timelineAr,
      kpis: [...record.kpis],
      researchSummary: record.researchSummary,
      researchSummaryAr: record.researchSummaryAr,
      competitors: [...record.competitors],
      visualVectors: [...record.visualVectors],
      visualVectorsAr: record.visualVectorsAr ? [...record.visualVectorsAr] : undefined,
      tokens: [...record.tokens],
      componentStates: [...record.componentStates],
      breakpoints: [...record.breakpoints],
      images,
      results: [...record.results],
      retro: [...record.retro],
    },
    draft: false,
  });
  console.log(`  ✓ ${record.slug}`);
}

async function seedOffers(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log(`\n▶ Offers global`);
  const toBi = (b: readonly [string, string]) => ({ en: b[0], ar: b[1] });
  await payload.updateGlobal({
    slug: "offers",
    data: {
      tiers: TIERS.map((t) => ({
        tag: toBi(t.tag),
        name: toBi(t.name),
        price: t.price,
        priceNote: toBi(t.priceNote),
        bestFor: toBi(t.bestFor),
        duration: toBi(t.duration),
        payment: t.payment,
        recommended: t.recommended ?? false,
        includesHead: toBi(t.includesHead),
        includes: t.includes.map(toBi),
        excludes: t.excludes?.map(toBi) ?? [],
      })),
    },
  });
  console.log(`  ✓ ${TIERS.length} tiers written`);
}

async function main() {
  const payload = await getPayload({ config });

  await seedProjects(payload);

  console.log(`\n▶ Case Studies (5)`);
  await seedCaseStudy(payload, NILE_PHARMA);
  await seedCaseStudy(payload, AHMED_BEDEER);
  await seedCaseStudy(payload, CODE_CANVAS);
  await seedCaseStudy(payload, GAD_INSTITUTE);
  await seedCaseStudy(payload, REFLECTION);

  await seedOffers(payload);

  console.log("\n✅ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
