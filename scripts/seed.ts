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
import { TIERS, ALACARTE } from "../lib/offers";
import type { CaseStudyRecord } from "../features/case-studies/types";
import type { GalleryItem } from "../features/case-studies/case-gallery";
import { ARTICLE_BODIES, toLexical } from "./writing-content";
import { SYSTEMS_BODIES_EN } from "./writing-systems-en";
import { SYSTEMS_BODIES_AR } from "./writing-systems-ar";

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
    const foundProject = (await payload.find({ collection: "projects", where: { slug: { equals: p.slug } }, limit: 1, overrideAccess: true })).docs[0];
    if (foundProject) {
      console.log(`  · ${p.slug} — already exists, skipping`);
      // REPAIR: docs created before the _status fix landed as drafts and
      // were invisible to the public site. Publish in place instead of
      // silently skipping, so re-running the seed heals old databases.
      if (foundProject._status !== "published") {
        await payload.update({ collection: "projects", id: foundProject.id, data: { _status: "published" }, draft: false });
        console.log(`    ↳ published (was ${foundProject._status})`);
      }
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
        isUiUx: p.isUiUx,
        liveUrl: p.liveUrl,
        externalUrl: p.externalUrl,
        accent: { primary: p.accent.primary, secondary: p.accent.secondary },
        // _status MUST be explicit: with drafts enabled, create() without it
        // lands as 'draft', and authenticatedOrPublished then hides the doc
        // from the entire public site. `draft: false` alone is NOT enough.
        _status: "published" as const,
      },
      // Publish immediately — these are already-live projects, not drafts.
      draft: false,
    });
    console.log(`  ✓ ${p.slug}`);
  }
}

async function seedCaseStudy(payload: Awaited<ReturnType<typeof getPayload>>, record: CaseStudyRecord) {
  const foundCase = (await payload.find({ collection: "case-studies", where: { slug: { equals: record.slug } }, limit: 1, overrideAccess: true })).docs[0];
  if (foundCase) {
    console.log(`  · ${record.slug} — already exists, skipping`);
    // REPAIR — same as projects: publish draft-stuck case studies.
    if (foundCase._status !== "published") {
      await payload.update({ collection: "case-studies", id: foundCase.id, data: { _status: "published" }, draft: false });
      console.log(`    ↳ published (was ${foundCase._status})`);
    }
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
      // See seedProjects — explicit status, or the case study stays invisible.
      _status: "published" as const,
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
      alaCarte: ALACARTE.map((g) => ({
        group: toBi(g.group),
        rows: g.rows.map((r) => ({
          service: toBi(r.service),
          details: toBi(r.details),
          price: r.price,
        })),
      })),
      // These three figures were hardcoded (with pending:true) in
      // features/offers/investment-value.tsx — moved here so they're
      // dashboard-editable. Still placeholders pending real measurement.
      investmentValue: [
        {
          value: "42%",
          en: "Faster delivery",
          ar: "أسرع في التسليم",
          subEn: "Fixed 38-day timeline vs open-ended scope",
          subAr: "جدول ثابت ٣٨ يوم مقابل نطاق مفتوح",
          pending: true,
        },
        {
          value: "3×",
          en: "Handoff efficiency",
          ar: "كفاءة التسليم للمطورين",
          subEn: "Token-driven handoff — exact values, not guesses",
          subAr: "تسليم معتمد على التوكنز — قيم دقيقة لا تخمين",
          pending: true,
        },
        {
          value: "0%",
          en: "Design drift",
          ar: "انحراف في التصميم",
          subEn: "What's approved at the gate is what ships",
          subAr: "ما يُعتمد عند البوابة هو ما يُنفَّذ",
          pending: true,
        },
      ],
    },
  });
  console.log(`  ✓ ${TIERS.length} tiers, ${ALACARTE.length} à la carte groups, 3 investment metrics written`);
}

/** The 3 posts that used to be hardcoded SEED data inside writing-view.tsx.
 *  `body` is empty — nobody ever wrote the actual MDX bodies, so there's
 *  nothing to migrate there; Mustafa will need to author them from the
 *  dashboard (or the /writing/[slug] detail page still needs building —
 *  it never existed, this isn't a regression).
 *
 *  W-006 … W-012 — the SYSTEMS SERIES, seeded in both languages. Arabic
 *  versions share the W-index with their English counterpart and use the
 *  `-ar` slug suffix (the convention writing-view.tsx uses to pair them). */
type SeedPost = {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  lang?: "en" | "ar";
  topics?: string[];
};

const WRITING_POSTS: SeedPost[] = [
  // — Systems series, volume 3 (EN + AR) —
  { index: "W-013", slug: "brand-identity-blueprint", title: "The brand identity blueprint: from core purpose to market touchpoints.", standfirst: "The four-tier stack, the balance-sheet case, the growth loop, and the Brand OS that runs it all.", publishedAt: "2026-08-07", lang: "en", topics: ["brand", "identity", "strategy"] },
  { index: "W-013", slug: "brand-identity-blueprint-ar", title: "مخطط الهوية التجارية: من الغاية الجوهرية إلى نقاط التماس مع السوق.", standfirst: "هرم الطبقات الأربع، القضية المالية، حلقة النمو، ونظام التشغيل الذي يدير كل ذلك.", publishedAt: "2026-08-07", lang: "ar", topics: ["brand", "identity", "strategy"] },
  // — Systems series, volume 2 (EN) —
  { index: "W-012", slug: "brand-case-studies", title: "Case studies in scale: how iconic brands actually run.", standfirst: "Apple, Stripe, Nike, McDonald's, Airbnb — the operating systems behind the logos.", publishedAt: "2026-07-31", lang: "en", topics: ["brand", "case-studies", "strategy"] },
  { index: "W-011", slug: "digital-product-lifecycle", title: "The digital product lifecycle: idea to enterprise, one system.", standfirst: "Smoke tests, the meaning layer, contract-first builds, and the loop that makes scaling repeatable.", publishedAt: "2026-07-24", lang: "en", topics: ["product", "lifecycle", "operations"] },
  { index: "W-010", slug: "ux-strategy-playbook", title: "The UX strategy playbook: engineering meaning and growth.", standfirst: "Discovery, JTBD, the emotional arc, and the KPI dashboard that ties UX to revenue.", publishedAt: "2026-07-17", lang: "en", topics: ["ux", "strategy", "research"] },
  // — Systems series, volume 2 (AR) —
  { index: "W-012", slug: "brand-case-studies-ar", title: "دراسات حالة في التوسع: كيف تعمل العلامات الأيقونية فعلاً.", standfirst: "آبل وStripe ونايكي وماكدونالدز وAirbnb — أنظمة التشغيل خلف الشعارات.", publishedAt: "2026-07-31", lang: "ar", topics: ["brand", "case-studies", "strategy"] },
  { index: "W-011", slug: "digital-product-lifecycle-ar", title: "دورة حياة المنتج الرقمي: من الفكرة إلى المؤسسة بنظام واحد.", standfirst: "اختبارات الدخان، طبقة المعنى، البناء بالعقود أولاً، والحلقة التي تجعل التوسع قابلاً للتكرار.", publishedAt: "2026-07-24", lang: "ar", topics: ["product", "lifecycle", "operations"] },
  { index: "W-010", slug: "ux-strategy-playbook-ar", title: "دليل استراتيجية تجربة المستخدم: هندسة المعنى والنمو.", standfirst: "الاكتشاف، مهام المستخدم، القوس العاطفي، ولوحة المؤشرات التي تربط التجربة بالإيراد.", publishedAt: "2026-07-17", lang: "ar", topics: ["ux", "strategy", "research"] },
  // — Systems series (EN) —
  { index: "W-009", slug: "product-led-expansion", title: "Product-led expansion: UX is a revenue variable.", standfirst: "The product operating model, progressive architecture, and the four metrics UX actually moves.", publishedAt: "2026-07-10", lang: "en", topics: ["product", "operations", "ux"] },
  { index: "W-008", slug: "enterprise-design-systems", title: "Design systems are infrastructure, not UI kits.", standfirst: "Tokens as the single source of truth, semantic naming, and the contribution loop that keeps it alive.", publishedAt: "2026-07-04", lang: "en", topics: ["design-systems", "tokens"] },
  { index: "W-007", slug: "brand-operating-system", title: "The Brand OS: from static assets to dynamic infrastructure.", standfirst: "Twelve pillars, tiered governance, and guidelines a language model can actually consume.", publishedAt: "2026-06-27", lang: "en", topics: ["brand", "governance", "ai"] },
  { index: "W-006", slug: "business-operating-system", title: "The Business Operating System: run the company like software.", standfirst: "The maturity ladder, telemetry, and the meeting pulse that replaces founder memory.", publishedAt: "2026-06-20", lang: "en", topics: ["operations", "systems"] },
  // — Systems series (AR) —
  { index: "W-009", slug: "product-led-expansion-ar", title: "التوسع المرتكز على المنتج: تجربة المستخدم متغير إيرادات.", standfirst: "نموذج تشغيل المنتج، المعمارية التدرجية، والمقاييس الأربعة التي تحركها تجربة المستخدم فعلاً.", publishedAt: "2026-07-10", lang: "ar", topics: ["product", "operations", "ux"] },
  { index: "W-008", slug: "enterprise-design-systems-ar", title: "أنظمة التصميم بنية تحتية، لا مكتبات واجهات.", standfirst: "الرموز كمصدر وحيد للحقيقة، التسمية الدلالية، وحلقة المساهمة التي تبقي النظام حياً.", publishedAt: "2026-07-04", lang: "ar", topics: ["design-systems", "tokens"] },
  { index: "W-007", slug: "brand-operating-system-ar", title: "نظام تشغيل العلامة التجارية: من الأصول الساكنة إلى البنية الديناميكية.", standfirst: "اثنا عشر ركناً، حوكمة مدرجة بالمخاطر، وأدلة يستطيع نموذج لغوي استهلاكها فعلاً.", publishedAt: "2026-06-27", lang: "ar", topics: ["brand", "governance", "ai"] },
  { index: "W-006", slug: "business-operating-system-ar", title: "نظام تشغيل الأعمال: أدر الشركة كبرمجية.", standfirst: "سلم النضج، القياس الحي، وإيقاع الاجتماعات الذي يحل محل ذاكرة المؤسس.", publishedAt: "2026-06-20", lang: "ar", topics: ["operations", "systems"] },
  // — Original essays —
  { index: "W-005", slug: "the-38-day-argument", title: "Why 38 days, not \"it's ready when it's ready.\"", standfirst: "What a fixed timeline actually protects.", publishedAt: "2026-06-01" },
  { index: "W-004", slug: "systems-not-deliverables", title: "Systems, not deliverables.", standfirst: "The handoff test every brand identity should pass and usually doesn't.", publishedAt: "2026-05-01" },
  { index: "W-003", slug: "logo-smallest-part", title: "The logo is the smallest part.", standfirst: "Why guidelines fail and token systems don't.", publishedAt: "2026-04-01" },
  { index: "W-002", slug: "arabic-deserves-design", title: "Arabic deserves design, not translation.", standfirst: "Building bilingual lockups as one system, not two compromises.", publishedAt: "2026-02-01" },
  { index: "W-001", slug: "strategy-is-a-standard", title: "Strategy is a standard, not a phase.", standfirst: "What \"I'll know it when I see it\" actually costs.", publishedAt: "2026-01-01" },
];

async function seedPosts(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log(`\n▶ Posts (${WRITING_POSTS.length})`);
  for (const p of WRITING_POSTS) {
    const lang = p.lang ?? "en";
    const blocks = ARTICLE_BODIES[p.slug] ?? SYSTEMS_BODIES_EN[p.slug] ?? SYSTEMS_BODIES_AR[p.slug];
    const body = blocks ? toLexical(blocks, lang === "ar" ? "rtl" : "ltr") : undefined;
    const found = await payload.find({ collection: "posts", where: { slug: { equals: p.slug } }, limit: 1 });

    if (found.docs.length > 0) {
      const existing = found.docs[0];
      if (!existing) continue;
      const hasBody = existing.body && JSON.stringify(existing.body).length > 40;
      if (hasBody) {
        console.log(`  · ${p.slug} — already exists with a body, skipping`);
        continue;
      }
      // Existing post from an earlier seed run had an empty body — backfill
      // it now instead of leaving it stuck forever (the old "skip if
      // exists by slug" logic never updates content, only creates new).
      await payload.update({ collection: "posts", id: existing.id, data: { body, _status: "published" } as never, draft: false });
      console.log(`  ✓ ${p.slug} — backfilled body`);
      continue;
    }

    await payload.create({
      collection: "posts",
      data: { ...p, lang, body, _status: "published" } as never,
      draft: false,
    });
    console.log(`  ✓ ${p.slug} (${lang})`);
  }
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
  await seedPosts(payload);

  console.log("\n✅ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
