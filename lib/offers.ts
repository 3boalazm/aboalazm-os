/**
 * OFFERS — single source of truth for tiers, 72h store offer, à la carte tables,
 * process phases, payment structure, and agreement terms.
 *
 * PRICING (2025 research — charm pricing: xx9/xx7 endings):
 * · Egypt agency floor: ~$370–$600 full brand
 * · MENA senior freelancer: $500–$5,000 logo; $1,500–$10,000 identity
 * · Mustafa positioned 20–30% above Egypt floor, 40–60% below intl agency
 */
import type { Locale } from "@/lib/locale";
import type { CurrencyCode } from "./fx";
import { whatsappPrefillHref } from "./contact-details";

export type Bi = readonly [en: string, ar: string];

export type PlanId =
  | "logo-design"
  | "brand-identity"
  | "full-brand-system"
  | "store-72h"
  | "landing-page"
  | "wordpress-website"
  | "bilingual-site"
  | "custom-web-platform"
  | "social-retainer"
  | "brand-maintenance"
  | "full-marketing-retainer";

/** Step 04 only — used on /book and after a scope is agreed, never as the first ask. */
export const DEPOSIT_CTA_LABEL: Bi = ["Pay the kickoff deposit", "ادفع دفعة البدء"];
export const DISCOVERY_CTA_LABEL: Bi = ["Book a discovery call", "احجز مكالمة استكشافية"];
export const SCOPE_CTA_LABEL: Bi = ["Scope a project", "حدّد نطاق مشروعك"];

/**
 * ENGAGEMENT PATH — the single entry point (2026-11 repositioning, P1 · point 8).
 *
 * The site used to offer two competing first steps: talk to us, or pay a
 * deposit. The deposit is the right step only *after* scope is agreed, so the
 * funnel is now ordered: discovery call → written scope & proposal → agreement
 * → deposit. `FUNNEL_STEPS` is the copy every page renders; keep the order.
 */
export const FUNNEL_STEPS: readonly { n: string; title: Bi; body: Bi }[] = [
  {
    n: "01",
    title: ["Discovery call — free, 30 minutes", "مكالمة استكشافية: مجانية، 30 دقيقة"],
    body: [
      "We talk about the business problem, not the deliverables. No scope, no commitment, no deck.",
      "نتحدّث عن المشكلة التي يواجهها عملك، لا عن المخرجات. بلا نطاق ولا التزام ولا عرض تقديمي.",
    ],
  },
  {
    n: "02",
    title: ["Written scope & proposal", "نطاق مكتوب وعرض"],
    body: [
      "You receive the recommended solution, the deliverables, the timeline and the price in writing — usually within two working days.",
      "يصلك الحل المقترح والمخرجات والجدول الزمني والسعر كتابةً، عادةً خلال يومَي عمل.",
    ],
  },
  {
    n: "03",
    title: ["Agreement signed", "توقيع الاتفاقية"],
    body: [
      "Both sides approve the same document: scope, milestones, payments, revisions, IP and cancellation.",
      "يعتمد الطرفان المستند نفسه: النطاق والمراحل والدفعات والتعديلات والملكية وشروط الإلغاء.",
    ],
  },
  {
    n: "04",
    title: ["Kickoff deposit & start", "دفعة البدء وانطلاق العمل"],
    body: [
      "Only after the scope is agreed: the kickoff instalment reserves the studio slot and phase 01 begins.",
      "بعد اعتماد النطاق فقط: تحجز دفعة البدء موعد المشروع في جدول الاستوديو، وتنطلق المرحلة 01.",
    ],
  },
];

/** Where the primary CTA points. Discovery first; the deposit page is step 04. */
export const START_HREF = "/contact";
export const WHATSAPP_ORDER_CTA_LABEL: Bi = ["Order on WhatsApp", "اطلب عبر واتساب"];
export const WHATSAPP_ASK_CTA_LABEL: Bi = ["Ask on WhatsApp", "اسأل عبر واتساب"];
export const RECOMMENDED_LABEL: Bi = ["Recommended", "موصى بها"];

export interface Tier {
  id: PlanId;
  startingUsd: number;
  hasDiscoveryCall?: boolean;
  tag: Bi;
  name: Bi;
  price: string;
  priceNote: Bi;
  bestFor: Bi;
  duration: Bi;
  payment: string;
  recommended?: boolean;
  includesHead: Bi;
  includes: readonly Bi[];
  excludes?: readonly Bi[];
}

export const TIERS: readonly Tier[] = [
  {
    id: "logo-design",
    startingUsd: 199,
    hasDiscoveryCall: true,
    tag: ["TIER 01", "الفئة 01"],
    name: ["Logo Design", "تصميم الشعار"],
    price: "$199 – $279",
    priceNote: ["Starting at $199", "يبدأ من $199"],
    bestFor: ["MVP startups · Small businesses", "شركات ناشئة · مشاريع صغيرة"],
    duration: ["7 – 10 days", "7 – 10 أيام"],
    payment: "50% / 50%",
    includesHead: ["What's included", "ما يشمله"],
    includes: [
      ["Discovery Call (30 min)", "مكالمة استكشافية (30 دقيقة)"],
      ["3 concept directions with strategic logic", "3 اتجاهات مفاهيمية بمنطق استراتيجي"],
      ["One direction developed to final", "تطوير الاتجاه المختار للشكل النهائي"],
      ["2 revision rounds", "جولتا مراجعة"],
      ["Files: AI · EPS · SVG · PNG · JPG", "الملفات: AI · EPS · SVG · PNG · JPG"],
      ["Versions: Color · White · Black · Mono", "النسخ: ملوّن · أبيض · أسود · أحادي اللون"],
      ["CMYK + RGB formats", "صيغ CMYK للطباعة وRGB للشاشات"],
      ["Mini Usage Guide (5 pages)", "دليل استخدام مصغّر (5 صفحات)"],
    ],
    excludes: [
      ["Brand strategy", "استراتيجية العلامة"],
      ["Full color system", "نظام ألوان كامل"],
      ["Brand applications", "تطبيقات الهوية"],
    ],
  },
  {
    id: "brand-identity",
    startingUsd: 697,
    hasDiscoveryCall: true,
    tag: ["TIER 02", "الفئة 02"],
    name: ["Brand Identity Essentials", "أساسيات الهوية البصرية"],
    price: "$697 – $1,097",
    priceNote: ["Starting at $697", "يبدأ من $697"],
    bestFor: ["Emerging brands · SMEs", "علامات صاعدة · شركات صغيرة ومتوسطة"],
    duration: ["3 – 4 weeks", "3 – 4 أسابيع"],
    payment: "50% / 25% / 25%",
    recommended: true,
    includesHead: ["Everything in Tier 01, plus", "كل ما في الفئة 01، بالإضافة إلى"],
    includes: [
      ["Brand Audit (if existing)", "مراجعة شاملة للعلامة الحالية"],
      ["Competitor Analysis", "تحليل المنافسين"],
      ["Concise Audience Persona", "شخصية مختصرة للجمهور"],
      ["Full Logo System (Primary + Secondary + Submark)", "نظام شعار كامل (أساسي + ثانوي + مصغّر)"],
      ["Color System (HEX · RGB · CMYK · Pantone)", "نظام ألوان (HEX · RGB · CMYK · Pantone)"],
      ["Typography Hierarchy", "هرمية الخطوط"],
      ["Brand Guidelines PDF (12–18 pages)", "دليل هوية PDF (12–18 صفحة)"],
      ["3 applications: Card · Letterhead · Social", "3 تطبيقات: بطاقة أعمال · ورق رسمي · وسائل التواصل"],
    ],
  },
  {
    id: "full-brand-system",
    startingUsd: 1497,
    hasDiscoveryCall: true,
    tag: ["TIER 03", "الفئة 03"],
    name: ["Full Brand System", "نظام علامة متكامل"],
    price: "$1,497 – $2,997+",
    priceNote: ["Starting at $1,497", "يبدأ من $1,497"],
    bestFor: ["Launches & re-launches at scale", "إطلاق العلامات وإعادة إطلاقها على نطاق واسع"],
    duration: ["5 – 7 weeks", "5 – 7 أسابيع"],
    payment: "50% / 25% / 25%",
    includesHead: ["Everything in Tier 02, plus", "كل ما في الفئة 02، بالإضافة إلى"],
    includes: [
      ["Extended Discovery & Research", "استكشاف وبحث موسّعان"],
      ["Full Brand Strategy Document", "وثيقة استراتيجية العلامة كاملة"],
      ["Purpose · Vision · Mission · Values", "الغاية · الرؤية · الرسالة · القيم"],
      ["Positioning · UVP · Personality · Archetype", "التموضع · القيمة الفريدة · الشخصية · النموذج الأصلي"],
      ["Tone of Voice · Brand Story", "نبرة الصوت · قصة العلامة"],
      ["Bilingual Lockup (Arabic / English)", "شعار ثنائي اللغة (عربي / إنجليزي)"],
      ["Brand Elements (Patterns · Icons · Photo Direction)", "عناصر بصرية (أنماط · أيقونات · توجيه التصوير)"],
      ["Brand Guidelines PDF (25–40 pages)", "دليل هوية PDF (25–40 صفحة)"],
      ["8+ applications", "أكثر من 8 تطبيقات"],
      ["Brand Training Workshop (1–2h)", "ورشة تدريب للفريق (1–2 ساعة)"],
      ["30 days post-delivery support", "دعم لمدة 30 يومًا بعد التسليم"],
      ["Portfolio Case Study setup", "إعداد دراسة حالة لملف الأعمال"],
    ],
  },
];

/**
 * DISCIPLINES — the three things a client can actually buy (2026-11 repositioning).
 *
 * The site used to list twelve services side by side, which read as a menu of
 * tasks rather than a studio. Every offer now belongs to one of three
 * disciplines, phrased as the business outcome the client gets, and each one
 * points at the page that already carries its detail. Prices are lead-in
 * figures only where a published starting price exists; systems work is
 * scoped per engagement instead of being forced into a fake number.
 */
export type DisciplineId = "brand" | "digital" | "systems";

export interface Discipline {
  id: DisciplineId;
  n: string;
  name: Bi;
  /** Who this is for — the sentence a decision-maker recognises themselves in. */
  forWhom: Bi;
  /** What the client walks away with, in business terms. */
  outcome: Bi;
  /** Concrete deliverables, kept short enough to scan. */
  includes: readonly Bi[];
  /** Published starting price, or the scope note when there is no fixed floor. */
  from: Bi;
  href: string;
  /** Used by /book and enquiry routing. */
  plans: readonly PlanId[];
}

export const DISCIPLINES: readonly Discipline[] = [
  {
    id: "brand",
    n: "01",
    name: ["Brand & Business Identity", "الهوية والتموضع"],
    forWhom: [
      "A new venture, or an established company whose image no longer matches the business it has become.",
      "شركة جديدة، أو شركة قائمة لم تعد صورتها تعبّر عن حجم عملها الفعلي.",
    ],
    outcome: [
      "A position your market understands, an identity system in Arabic and English, and guidelines your team can run without me in the room.",
      "تموضع يفهمه السوق، ونظام هوية بالعربية والإنجليزية، ودليل استخدام يستطيع فريقك العمل به دون الحاجة إليّ.",
    ],
    includes: [
      ["Positioning · naming · brand strategy", "التموضع · التسمية · استراتيجية العلامة"],
      ["Logo systems + bilingual lockups", "أنظمة الشعار والصيغ ثنائية اللغة"],
      ["Packaging & print systems", "التغليف وأنظمة المطبوعات"],
      ["Brand guidelines & team training", "دليل الهوية وتدريب الفريق"],
    ],
    from: ["From $697", "من $697"],
    href: "/services/brand-identity",
    plans: ["logo-design", "brand-identity", "full-brand-system"],
  },
  {
    id: "digital",
    n: "02",
    name: ["Digital Experience", "التجربة الرقمية"],
    forWhom: [
      "A company with a brand to carry online: a site, a store, or a product launch that has to look and work like the brand, not like a template.",
      "شركة لديها علامة تحتاج إلى حضور على الإنترنت: موقع أو متجر أو إطلاق منتج، ينبغي أن يبدو ويعمل كعلامة لا كقالب جاهز.",
    ],
    outcome: [
      "Sites and storefronts built on the identity itself — bilingual, fast, and measurable from the day they launch.",
      "مواقع ومتاجر مبنية على الهوية نفسها: ثنائية اللغة وسريعة وقابلة للقياس منذ اليوم الأول.",
    ],
    includes: [
      ["Bilingual marketing sites (AR / EN · RTL)", "مواقع تعريفية ثنائية اللغة (عربي/إنجليزي · RTL)"],
      ["E-commerce & 72-hour stores", "متاجر إلكترونية، ومتجر خلال 72 ساعة"],
      ["Landing pages & launch campaigns", "صفحات هبوط وحملات إطلاق"],
      ["CMS, SEO foundation & analytics", "نظام إدارة محتوى وأساس SEO وتحليلات"],
    ],
    from: ["From $197", "من $197"],
    href: "/services/websites",
    plans: ["landing-page", "wordpress-website", "bilingual-site", "store-72h", "custom-web-platform"],
  },
  {
    id: "systems",
    n: "03",
    name: ["Business Systems & Automation", "أنظمة التشغيل والأتمتة"],
    forWhom: [
      "A business losing hours to spreadsheets, WhatsApp orders and disconnected tools — or one that needs its operations visible in one place.",
      "شركة تخسر ساعات بين الجداول وطلبات واتساب وأدوات متفرقة، أو تحتاج إلى رؤية تشغيلها في مكان واحد.",
    ],
    outcome: [
      "Internal dashboards, ERPs and automations that replace manual steps, so decisions rest on numbers instead of memory.",
      "لوحات تحكم داخلية وأنظمة ERP وأتمتة تحلّ محل الخطوات اليدوية، لتُبنى القرارات على الأرقام لا على الذاكرة.",
    ],
    includes: [
      ["Operations & sales dashboards", "لوحات تشغيل ومبيعات"],
      ["ERP modules & inventory workflows", "وحدات ERP ومسارات المخزون"],
      ["Arabic-first internal tools (RTL)", "أدوات داخلية عربية أولًا (RTL)"],
      ["Automation & AI-assisted workflows", "أتمتة وتدفقات مدعومة بالذكاء الاصطناعي"],
    ],
    from: ["Scoped per system", "يُسعَّر حسب النظام"],
    href: "/services/systems",
    plans: ["custom-web-platform"],
  },
];

export function disciplineById(id: DisciplineId): Discipline {
  return DISCIPLINES.find((d) => d.id === id) ?? DISCIPLINES[0]!;
}

/** Tier ids that belong to the strategic engagement, not the production menu. */
export const STRATEGIC_TIER_IDS: readonly PlanId[] = [
  "logo-design",
  "brand-identity",
  "full-brand-system",
];

/**
 * Production-menu framing (P1 · point 7). Small print/social items stay
 * published — they are real work — but they are explicitly labelled as
 * production for an existing identity, so they can never be read as a
 * cheaper alternative to the strategic engagement.
 */
export const PRODUCTION_MENU_NOTE: Bi = [
  "Production menu — standalone print and social items, ordered directly on WhatsApp. These are production services for a brand that already has its system; they are not a substitute for identity or systems work.",
  "قائمة الإنتاج: بنود مطبوعات ومحتوى اجتماعي مستقلة تُطلب مباشرة عبر واتساب. هذه خدمات تنفيذ لعلامة لديها نظامها بالفعل، وليست بديلًا عن أعمال الهوية أو الأنظمة.",
];

export interface AlaCarteRow {
  id: string;
  service: Bi;
  details: Bi;
  price: string;
  startingUsd: number;
  ctaKind: "deposit" | "whatsapp";
  planId?: PlanId;
}

export interface AlaCarteGroup {
  group: Bi;
  rows: readonly AlaCarteRow[];
}

export const ALACARTE: readonly AlaCarteGroup[] = [
  {
    group: ["Print & Brand Applications", "مطبوعات وتطبيقات الهوية"],
    rows: [
      { id: "business-card", service: ["Business Card", "بطاقة الأعمال"], details: ["Two-sided · 2 versions · 3 revisions", "وجهان · نسختان · 3 تعديلات"], price: "$27", startingUsd: 27, ctaKind: "whatsapp" },
      { id: "brochure", service: ["Brochure", "بروشور"], details: ["4 pages · A4 / A5 · up to 4 folds", "4 صفحات · A4 / A5 · حتى 4 طيّات"], price: "$39", startingUsd: 39, ctaKind: "whatsapp" },
      { id: "flyer", service: ["Flyer", "نشرة دعائية"], details: ["Bi / Tri / Quad fold", "طيّة ثنائية / ثلاثية / رباعية"], price: "$29 – $47", startingUsd: 29, ctaKind: "whatsapp" },
      { id: "promotional-poster", service: ["Promotional Poster", "ملصق دعائي"], details: ["Digital or print", "رقمي أو مطبوع"], price: "$29 – $47", startingUsd: 29, ctaKind: "whatsapp" },
      { id: "banner", service: ["Banner", "لافتة"], details: ["Square meter + $12 / additional sq.m", "المتر المربع + $12 لكل متر إضافي"], price: "$37", startingUsd: 37, ctaKind: "whatsapp" },
      { id: "standard-roll-up", service: ["Standard Roll-Up", "رول أب"], details: ["80×200 / 85×200 / 90×200 cm", "80×200 / 85×200 / 90×200 سم"], price: "$37", startingUsd: 37, ctaKind: "whatsapp" },
    ],
  },
  {
    group: ["Social Media Design", "تصميم وسائل التواصل الاجتماعي"],
    rows: [
      { id: "single-post", service: ["Single Post", "منشور واحد"], details: ["Facebook · Instagram · LinkedIn", "Facebook · Instagram · LinkedIn"], price: "$14", startingUsd: 14, ctaKind: "whatsapp" },
      { id: "pack-10", service: ["Pack of 10", "باقة من 10 منشورات"], details: ["Save $29", "وفّر $29"], price: "$111", startingUsd: 111, ctaKind: "whatsapp" },
      { id: "pack-20", service: ["Pack of 20", "باقة من 20 منشورًا"], details: ["Save $69", "وفّر $69"], price: "$211", startingUsd: 211, ctaKind: "whatsapp" },
    ],
  },
  {
    group: ["Web Design & Development", "تصميم وتطوير الويب"],
    rows: [
      {
        id: "store-72h",
        service: ["Bilingual Online Store / Catalogue (72h)", "متجر أو كتالوج إلكتروني ثنائي اللغة (72 ساعة)"],
        details: ["Up to ~30 products · AR + EN · Order on WhatsApp · COD + InstaPay · custom domain", "حتى 30 منتجًا تقريبًا · عربي وإنجليزي · الطلب عبر واتساب · الدفع عند الاستلام أو عبر إنستاباي · ربط اسم النطاق"],
        price: "From $197",
        startingUsd: 197,
        ctaKind: "deposit",
        planId: "store-72h",
      },
      { id: "custom-web-platform", service: ["Custom Web Platform", "منصة ويب مخصّصة"], details: ["Next.js · Bilingual EN/AR + RTL · multi-section · performance-tuned · brand-aligned", "Next.js · ثنائي اللغة مع RTL · متعدد الأقسام · أداء محسّن · متوافق مع الهوية"], price: "$1,297 – $2,997", startingUsd: 1297, ctaKind: "deposit", planId: "custom-web-platform" },
      { id: "bilingual-site", service: ["Bilingual Marketing Site", "موقع تعريفي ثنائي اللغة"], details: ["Up to 7 pages · EN/AR · responsive · CMS-ready · SEO foundation", "حتى 7 صفحات · عربي/إنجليزي · متجاوب · جاهز لـ CMS · أساس SEO"], price: "$597 – $1,097", startingUsd: 597, ctaKind: "deposit", planId: "bilingual-site" },
      { id: "wordpress-website", service: ["WordPress Website", "موقع ووردبريس"], details: ["Up to 7 pages · Responsive · Auth · 3 months support", "حتى 7 صفحات · متجاوب · تسجيل دخول · دعم 3 أشهر"], price: "$297 – $597", startingUsd: 297, ctaKind: "deposit", planId: "wordpress-website" },
      { id: "landing-page", service: ["Landing Page", "صفحة هبوط"], details: ["Single conversion-focused page · responsive · fast", "صفحة واحدة موجّهة للتحويل · متجاوبة · سريعة"], price: "$197 – $397", startingUsd: 197, ctaKind: "deposit", planId: "landing-page" },
    ],
  },
  {
    group: ["Retainer Services (monthly)", "خدمات شهرية بعقد مستمر"],
    rows: [
      { id: "social-retainer", service: ["Social Media Retainer", "عقد مستمر لوسائل التواصل الاجتماعي"], details: ["15–20 designs + content templates", "15–20 تصميمًا مع قوالب محتوى"], price: "$197 – $297", startingUsd: 197, ctaKind: "deposit", planId: "social-retainer" },
      { id: "brand-maintenance", service: ["Brand Maintenance", "صيانة الهوية"], details: ["Templates · light edits · quality oversight", "قوالب · تعديلات خفيفة · إشراف على الجودة"], price: "$247", startingUsd: 247, ctaKind: "deposit", planId: "brand-maintenance" },
      { id: "full-marketing-retainer", service: ["Full Marketing Design", "تصميم تسويقي شامل"], details: ["Social + Print + Digital + Light Video", "وسائل التواصل + مطبوعات + رقمي + فيديو خفيف"], price: "$447 – $697", startingUsd: 447, ctaKind: "deposit", planId: "full-marketing-retainer" },
    ],
  },
];

export const PROCESS = [
  { n: "01", name: ["Discovery & Research", "الاكتشاف والبحث"], body: ["Brand audit, competitor analysis, color-gap mapping, audience persona, cultural research. The foundation no logo can replace.", "مراجعة العلامة، وتحليل المنافسين، وخريطة فجوات الألوان، وشخصية الجمهور، والبحث الثقافي: الأساس الذي لا يعوّضه أي شعار."], days: ["Days 1–6", "الأيام 1–6"] },
  { n: "02", name: ["Brand Strategy", "استراتيجية العلامة"], body: ["Purpose, positioning, archetype, voice & tone, value proposition. Approved on paper before a single shape is drawn.", "الغاية والتموضع والنموذج الأصلي ونبرة الصوت والقيمة الفريدة، وتُعتمد كتابةً قبل رسم أي شكل."], days: ["Days 5–9", "الأيام 5–9"] },
  { n: "03", name: ["Concept & Design", "المفهوم والتصميم"], body: ["Sketches in dozens, narrowed to 2–3 directions. Logo system, color, typography, brand elements, and key applications.", "عشرات المسودات تُختصر إلى 2–3 اتجاهات: نظام الشعار والألوان والخطوط والعناصر والتطبيقات الأساسية."], days: ["Days 9–27", "الأيام 9–27"] },
  { n: "04", name: ["Refine & Deliver", "المراجعة والتسليم"], body: ["Two structured revision rounds, sign-off, final files in every format, brand guidelines PDF, handover call & 30-day support.", "جولتا مراجعة منظّمتان، واعتماد نهائي، وملفات بكل الصيغ، ودليل هوية PDF، ومكالمة تسليم، ودعم لمدة 30 يومًا."], days: ["Days 27–38", "الأيام 27–38"] },
] as const;

export const PAYMENT = {
  t1: { title: ["Tier 1 — Logo Design", "الفئة 1: تصميم الشعار"], split: "50% / 50%", steps: [["50% at Kickoff", "50% عند البدء"], ["50% before final file delivery", "50% قبل تسليم الملفات النهائية"]] },
  t23: { title: ["Tier 2 & 3 — Brand Identity", "الفئتان 2 و3: الهوية البصرية"], split: "50% / 25% / 25%", steps: [["50% at Kickoff", "50% عند البدء"], ["25% at Strategy Sign-off", "25% عند اعتماد الاستراتيجية"], ["25% before final delivery", "25% قبل التسليم النهائي"]] },
  methods: ["Bank transfer (local / international) · PayPal & Wise (international) · Electronic wallets (local) · Cash for in-person meetings. Transfer fees may apply.", "تحويل بنكي (محلي / دولي) · PayPal وWise (للعملاء الدوليين) · محافظ إلكترونية (محليًا) · نقدًا عند اللقاء المباشر. قد تُضاف رسوم تحويل بحسب الوسيلة."],
} as const;

/**
 * The one-line terms ruling — THE single source of truth (overhaul S3,
 * QA #19-22/#66). Every page that mentions payment says exactly this or
 * links here; never paraphrase it locally again.
 * Rule: kickoff is always 50%; the balance depends on the tier
 * (Tier 1: 50 before files · Tiers 2–3: 25 at strategy sign-off + 25 before delivery).
 */
export const TERMS_LINE: readonly [string, string] = [
  "How payment works: 50% kickoff for every tier. The balance is due before final files — Tier 1 pays it as one 50% installment, Tiers 2–3 as 25% at strategy sign-off + 25% before delivery. The agreed scope and milestones are confirmed in writing before kickoff.",
  "آلية الدفع: 50% مقدّمًا لكل الفئات، ويُسدَّد الباقي قبل تسليم الملفات النهائية: دفعة واحدة بنسبة 50% للفئة 1، و25% عند اعتماد الاستراتيجية و25% قبل التسليم للفئتين 2 و3. نتفق كتابةً على النطاق والمراحل قبل البدء.",
] as const;

/**
 * Prices are stored as single English strings ("From $197"). Arabic pages show
 * the same figure with the Arabic lead-in the rest of the site already uses
 * ("من $197"); everything else (plain "$14", ranges) passes through untouched.
 */
export function localizePrice(price: string, lang: Locale): string {
  return lang === "ar" ? price.replace(/^From\s+/i, "من ") : price;
}

export interface Store72hProofItem {
  slug: string;
  name: Bi;
  domain: string;
  href: string;
  summary: Bi;
  tags: readonly Bi[];
  thumbnail?: string;
}

export const STORE_72H_OFFER = {
  id: "store-72h" as PlanId,
  price: "From $197",
  startingUsd: 197,
  depositPercent: 50,
  payment: "50% / 50%",
  logoAddonUsd: 199,
  logoAddonPrice: "$199",
  headline: [
    "Bilingual online store or catalogue, ready in 72 hours",
    "متجر أو كتالوج إلكتروني ثنائي اللغة، جاهز خلال 72 ساعة",
  ] as Bi,
  subheadline: [
    "Designed by a senior brand designer and built on a fast, mobile-first bilingual architecture — with WhatsApp ordering, COD & InstaPay instructions, and a shipping-policy page.",
    "بتصميم هوية بصرية احترافية وبنية تقنية سريعة ثنائية اللغة (عربي/إنجليزي)، مع الطلب عبر واتساب، وتعليمات الدفع عند الاستلام وإنستاباي، وصفحة سياسة الشحن، وربط اسم النطاق.",
  ] as Bi,
  clockRule: [
    "The 72 hours start when I receive all content (products, photos, texts), not at payment.",
    "تبدأ مهلة الـ72 ساعة عند استلام كل المحتوى كاملًا (المنتجات والصور والنصوص)، لا عند الدفع.",
  ] as Bi,
  included: [
    [
      "Up to ~30 products organized in clean categories",
      "إضافة حتى 30 منتجًا تقريبًا وتنظيمها في أقسام واضحة",
    ],
    [
      "Full Arabic (RTL) + English (LTR) bilingual interface",
      "واجهة ثنائية اللغة بالكامل: عربي (RTL) + إنجليزي (LTR)",
    ],
    [
      "Direct “Order on WhatsApp” button with prefilled cart/product details",
      "زر «اطلب عبر واتساب» برسالة جاهزة تتضمن تفاصيل الطلب والمنتج",
    ],
    [
      "Cash-on-delivery (COD) + InstaPay instructions built into the checkout flow",
      "تعليمات الدفع عند الاستلام (COD) والتحويل عبر إنستاباي (InstaPay) داخل مسار الطلب",
    ],
    [
      "Shipping rates / delivery policy link and clear customer steps",
      "ربط صفحة سياسة وأسعار الشحن وخطوات الاستلام للعميل",
    ],
    [
      "Custom-domain connection + HTTPS / SSL setup",
      "ربط اسم النطاق الخاص بك مع تفعيل شهادة الأمان HTTPS / SSL",
    ],
    [
      "One structured revision round before launch",
      "جولة تعديلات واحدة منظمة قبل الإطلاق النهائي",
    ],
  ] as readonly Bi[],
  notIncluded: [
    [
      "Product photography (you provide existing product photos)",
      "تصوير المنتجات (يرسل العميل صور المنتجات المتوفرة لديه)",
    ],
    [
      "Payment-gateway merchant activation (automated card gateways are scoped separately if needed)",
      "تفعيل بوابات الدفع البنكية الآلية (يمكن إضافتها في نطاق منفصل عند الحاجة)",
    ],
  ] as readonly Bi[],
  whyDifferent: [
    {
      title: ["Senior brand identity craft", "صنعة هوية بصرية بمستوى خبير"] as Bi,
      body: [
        "Most low-cost store setups drop your products into an unstyled theme. Your store is art-directed with paired Arabic/English typography, disciplined spacing, and brand-consistent colors.",
        "تضع أغلب المتاجر السريعة منتجاتك في قالب مكرر. هنا يُبنى المتجر بإخراج بصري متقن وتنسيق مدروس للخطوط العربية والإنجليزية وألوان علامتك.",
      ] as Bi,
    },
    {
      title: ["Built for how Egypt & Gulf buyers actually pay", "مبني على طريقة الشراء الفعلية في مصر والخليج"] as Bi,
      body: [
        "Warm traffic from Instagram, TikTok, and WhatsApp converts fastest when buyers can inspect products in Arabic or English, see clear COD or InstaPay steps, and confirm their order on WhatsApp in one tap.",
        "يشتري الزوار القادمون من Instagram وTikTok وواتساب أسرع حين يتصفحون بالعربية أو الإنجليزية، ويرون خطوات الدفع عند الاستلام أو عبر إنستاباي بوضوح، ويؤكدون الطلب عبر واتساب بضغطة واحدة.",
      ] as Bi,
    },
    {
      title: ["Live production proof you can test today", "أعمال حية يمكنك تجربتها الآن قبل التعاقد"] as Bi,
      body: [
        "Inspect four live commerce and catalogue deployments below — on your phone right now — before you send a deposit.",
        "تصفّح أربعة متاجر وكتالوجات منشورة بالأسفل، من هاتفك الآن، قبل إرسال العربون.",
      ] as Bi,
    },
  ],
  proof: [
    {
      slug: "momo-collective",
      name: ["OLTRÈ", "أولتريه (OLTRÈ)"],
      domain: "momo-shop.vercel.app",
      href: "https://momo-shop.vercel.app",
      summary: [
        "Drop-led streetwear store with product variants, lookbook, cart & wishlist, and EGP checkout.",
        "متجر ملابس شبابية يقوم على الإصدارات المحدودة، بخيارات المنتجات ودليل إطلالات وسلة مشتريات وقائمة مفضلة والدفع بالجنيه المصري.",
      ],
      tags: [
        ["E-Commerce", "متجر إلكتروني"],
        ["EGP Checkout", "دفع بالجنيه المصري"],
        ["Mobile-First", "مصمم للهاتف أولًا"],
      ],
      thumbnail: "/images/work/dev-cards/oltre-collective-card.jpg",
    },
    {
      slug: "nile-pharma-storefront",
      name: ["Nile Pharma Food Storefront", "متجر نايل فارما للصناعات الغذائية"],
      domain: "nile-vercel-seven.vercel.app/ar",
      href: "https://nile-vercel-seven.vercel.app/ar",
      summary: [
        "Bilingual Arabic/English storefront with structured product catalogue, dynamic pricing, and order flow.",
        "واجهة متجر ثنائية اللغة (عربي/إنجليزي) بكتالوج منتجات منظم وتسعير ديناميكي ومسار طلب واضح.",
      ],
      tags: [
        ["Bilingual AR/EN", "ثنائي اللغة عربي/إنجليزي"],
        ["Catalogue", "كتالوج"],
        ["Next.js", "Next.js"],
      ],
      thumbnail: "/images/work/dev-cards/nile-pharma-storefront-card.jpg",
    },
    {
      slug: "nile-bed",
      name: ["Nile Bed", "نايل بد (Nile Bed)"],
      domain: "nile-bed.vercel.app",
      href: "https://nile-bed.vercel.app",
      summary: [
        "Bilingual B2B spring manufacturing & mattress supply catalogue (69 products across 8 categories) with WhatsApp inquiry routing.",
        "كتالوج صناعي ثنائي اللغة لمصنع نوابض وخامات مراتب (69 منتجًا في 8 أقسام) مع طلب عروض الأسعار عبر واتساب.",
      ],
      tags: [
        ["B2B Catalogue", "كتالوج جملة وتوريد"],
        ["Bilingual AR/EN", "ثنائي اللغة عربي/إنجليزي"],
        ["WhatsApp Flow", "مسار طلب عبر واتساب"],
      ],
    },
    {
      slug: "craft-egypt",
      name: ["Craft Egypt", "كرافت إيجيبت (Craft Egypt)"],
      domain: "craft-egypt.vercel.app",
      href: "https://craft-egypt.vercel.app",
      summary: [
        "Arabic RTL storefront and regional craft catalogue for handmade Egyptian copperware, textiles, pottery, and home decor.",
        "متجر وكتالوج عربي RTL للحرف اليدوية والتراثية المصرية (النحاس والتطريز والفخار والديكور المنزلي) مع دليل للطلبات المخصصة.",
      ],
      tags: [
        ["Mobile-First", "مصمم للهاتف أولًا"],
        ["Handmade Storefront", "متجر حرف يدوية"],
        ["Product Catalogue", "كتالوج منتجات"],
      ],
    },
  ] as readonly Store72hProofItem[],
} as const;

export interface BookablePlan {
  id: PlanId;
  category: Bi;
  name: Bi;
  priceDisplay: string;
  startingUsd: number;
  paymentSchedule: string;
  depositPercent: number;
  duration: Bi;
  summary: Bi;
  supportsLogoAddon?: boolean;
}

export const BOOKABLE_PLANS: readonly BookablePlan[] = [
  {
    id: "store-72h",
    category: ["72-Hour Store", "متجر خلال 72 ساعة"],
    name: ["72-Hour Bilingual Online Store / Catalogue", "متجر أو كتالوج إلكتروني ثنائي اللغة (72 ساعة)"],
    priceDisplay: STORE_72H_OFFER.price,
    startingUsd: STORE_72H_OFFER.startingUsd,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["72 hours (once all content is received)", "72 ساعة (تبدأ عند استلام المحتوى كاملًا)"],
    summary: [
      "Up to ~30 products, AR + EN, Order on WhatsApp, COD + InstaPay instructions, shipping link, custom domain, 1 revision round.",
      "حتى 30 منتجًا تقريبًا، عربي وإنجليزي، الطلب عبر واتساب، الدفع عند الاستلام أو عبر إنستاباي، ربط الشحن واسم النطاق، وجولة تعديل واحدة.",
    ],
    supportsLogoAddon: true,
  },
  {
    id: "logo-design",
    category: ["Tier 01 · Brand Identity", "الفئة 01 · الهوية البصرية"],
    name: ["Logo Design (Tier 01)", "تصميم الشعار (الفئة 01)"],
    priceDisplay: "$199 – $279",
    startingUsd: 199,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["7 – 10 days", "7 – 10 أيام"],
    summary: [
      "Discovery call, 3 concept directions, final logo files (AI, EPS, SVG, PNG, JPG), color/mono versions, and 5-page mini usage guide.",
      "مكالمة استكشافية، و3 اتجاهات للشعار، والملفات النهائية بكل الصيغ، والنسخ اللونية، ودليل استخدام مصغّر (5 صفحات).",
    ],
  },
  {
    id: "brand-identity",
    category: ["Tier 02 · Recommended", "الفئة 02 · موصى بها"],
    name: ["Brand Identity Essentials (Tier 02)", "أساسيات الهوية البصرية (الفئة 02)"],
    priceDisplay: "$697 – $1,097",
    startingUsd: 697,
    paymentSchedule: "50% / 25% / 25%",
    depositPercent: 50,
    duration: ["3 – 4 weeks", "3 – 4 أسابيع"],
    summary: [
      "Brand audit, competitor analysis, full logo system, color & typography hierarchy, 12–18p brand guidelines PDF, and 3 key applications.",
      "مراجعة العلامة، وتحليل المنافسين، ونظام شعار كامل، والألوان والخطوط، ودليل هوية PDF (12–18 صفحة)، و3 تطبيقات.",
    ],
  },
  {
    id: "full-brand-system",
    category: ["Tier 03 · Full System", "الفئة 03 · النظام الكامل"],
    name: ["Full Brand System (Tier 03)", "نظام علامة متكامل (الفئة 03)"],
    priceDisplay: "$1,497 – $2,997+",
    startingUsd: 1497,
    paymentSchedule: "50% / 25% / 25%",
    depositPercent: 50,
    duration: ["5 – 7 weeks", "5 – 7 أسابيع"],
    summary: [
      "Full brand strategy, bilingual Arabic/English lockups, brand elements, 25–40p guidelines PDF, 8+ applications, training workshop, and 30-day support.",
      "وثيقة استراتيجية كاملة، وشعار ثنائي اللغة، وعناصر بصرية، ودليل هوية (25–40 صفحة)، وأكثر من 8 تطبيقات، وورشة تدريب، ودعم لمدة 30 يومًا.",
    ],
  },
  {
    id: "landing-page",
    category: ["Web Design & Development", "تصميم وتطوير الويب"],
    name: ["Landing Page", "صفحة هبوط"],
    priceDisplay: "$197 – $397",
    startingUsd: 197,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["5 – 7 days", "5 – 7 أيام"],
    summary: [
      "Single conversion-focused page · responsive · fast.",
      "صفحة واحدة موجّهة للتحويل · متجاوبة · سريعة.",
    ],
  },
  {
    id: "wordpress-website",
    category: ["Web Design & Development", "تصميم وتطوير الويب"],
    name: ["WordPress Website", "موقع ووردبريس"],
    priceDisplay: "$297 – $597",
    startingUsd: 297,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["1 – 2 weeks", "من أسبوع إلى أسبوعين"],
    summary: [
      "Up to 7 pages · Responsive · Auth · 3 months support.",
      "حتى 7 صفحات · متجاوب · تسجيل دخول · دعم 3 أشهر.",
    ],
  },
  {
    id: "bilingual-site",
    category: ["Web Design & Development", "تصميم وتطوير الويب"],
    name: ["Bilingual Marketing Site", "موقع تعريفي ثنائي اللغة"],
    priceDisplay: "$597 – $1,097",
    startingUsd: 597,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["2 – 3 weeks", "2 – 3 أسابيع"],
    summary: [
      "Up to 7 pages · EN/AR · responsive · CMS-ready · SEO foundation.",
      "حتى 7 صفحات · عربي/إنجليزي · متجاوب · جاهز لـ CMS · أساس SEO.",
    ],
  },
  {
    id: "custom-web-platform",
    category: ["Web Design & Development", "تصميم وتطوير الويب"],
    name: ["Custom Web Platform", "منصة ويب مخصّصة"],
    priceDisplay: "$1,297 – $2,997",
    startingUsd: 1297,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["3 – 6 weeks", "3 – 6 أسابيع"],
    summary: [
      "Next.js · Bilingual EN/AR + RTL · multi-section · performance-tuned · brand-aligned.",
      "Next.js · ثنائي اللغة مع RTL · متعدد الأقسام · أداء محسّن · متوافق مع الهوية.",
    ],
  },
  {
    id: "social-retainer",
    category: ["Retainer Services (monthly)", "خدمات شهرية بعقد مستمر"],
    name: ["Social Media Retainer", "عقد مستمر لوسائل التواصل الاجتماعي"],
    priceDisplay: "$197 – $297",
    startingUsd: 197,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["Monthly", "شهريًا"],
    summary: [
      "15–20 designs + content templates.",
      "15–20 تصميمًا مع قوالب محتوى.",
    ],
  },
  {
    id: "brand-maintenance",
    category: ["Retainer Services (monthly)", "خدمات شهرية بعقد مستمر"],
    name: ["Brand Maintenance", "صيانة الهوية"],
    priceDisplay: "$247",
    startingUsd: 247,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["Monthly", "شهريًا"],
    summary: [
      "Templates · light edits · quality oversight.",
      "قوالب · تعديلات خفيفة · إشراف على الجودة.",
    ],
  },
  {
    id: "full-marketing-retainer",
    category: ["Retainer Services (monthly)", "خدمات شهرية بعقد مستمر"],
    name: ["Full Marketing Design", "تصميم تسويقي شامل"],
    priceDisplay: "$447 – $697",
    startingUsd: 447,
    paymentSchedule: "50% / 50%",
    depositPercent: 50,
    duration: ["Monthly", "شهريًا"],
    summary: [
      "Social + Print + Digital + Light Video.",
      "وسائل التواصل + مطبوعات + رقمي + فيديو خفيف.",
    ],
  },
];

export function getBookablePlan(id?: string | null): BookablePlan {
  const found = BOOKABLE_PLANS.find((p) => p.id === id);
  return found ?? BOOKABLE_PLANS.find((p) => p.id === "brand-identity") ?? BOOKABLE_PLANS[0]!;
}

export function bookHref(
  plan: PlanId = "brand-identity",
  cur?: CurrencyCode,
  extra?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  params.set("plan", plan);
  if (cur) params.set("cur", cur);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) params.set(k, v);
    }
  }
  return `/book?${params.toString()}`;
}

export function alacarteWhatsappHref(row: AlaCarteRow, lang: Locale): string {
  const msg =
    lang === "ar"
      ? `أهلًا مصطفى، أودّ طلب خدمة: ${row.service[1]} (${row.price}).`
      : `Hi Mustafa, I'd like to order: ${row.service[0]} (${row.price}).`;
  return whatsappPrefillHref(msg);
}

/** Public revision date of the agreement clauses (shown on /agreement). */
export const AGREEMENT_REVISED = "2026-11-10";

export interface AgreementTerm {
  n: string;
  head: Bi;
  body: Bi;
}

/**
 * Canonical agreement clauses read by /agreement (Task 6).
 * Clause 05 matches /pricing schedules (Logo 50/50; Identity Essentials & Full System 50/25/25).
 * Clauses 11 and 12 were owner-approved on 2026-11-10 and are published terms
 * now — the `draft` flag and every public "DRAFT" label were retired with them.
 */
export const AGREEMENT_TERMS: readonly AgreementTerm[] = [
  { n: "01", head: ["Scope of Work", "نطاق العمل"], body: ["The attached terms apply per signed invoice; deliverables and scope are listed in the proposal approved before kickoff.", "تسري البنود المرفقة على الفاتورة الموقّعة، وتُحدَّد المخرجات والنطاق في العرض المعتمد قبل البدء."] },
  { n: "02", head: ["Commitment & Content Standards", "الالتزام والمعايير"], body: ["The designer commits to delivering the agreed designs within the agreed period, and refrains from including any material deemed religiously or socially inappropriate.", "يلتزم المصمم بتنفيذ التصاميم المتفق عليها خلال المدة المحددة، ويمتنع عن إدخال أي مواد غير لائقة دينيًا أو اجتماعيًا."] },
  { n: "03", head: ["Confidentiality", "السرية"], body: ["No project information is shared with third parties before completion — except seeking professional opinion or assistance.", "لا تُقدَّم أي معلومات عن التصاميم وبنود العمل إلى أطراف ثالثة قبل إتمامه، باستثناء طلب رأي مهني أو مساعدة مهنية."] },
  { n: "04", head: ["Portfolio Rights", "حقوق العرض"], body: ["Portfolio publication, its timing and any confidentiality requirements are agreed in writing before kickoff. Any commercial adjustment is itemised in the proposal; there is no automatic publication or confidentiality fee.", "يُتفق كتابةً قبل البدء على نشر المشروع في ملف الأعمال وتوقيته وأي متطلبات سرية. وأي تعديل تجاري يُذكر كبند واضح في العرض، ولا توجد رسوم نشر أو رسوم سرية تلقائية."] },
  {
    n: "05",
    head: ["Payment Structure", "نظام الدفع"],
    body: [
      "Kickoff is 50% for every tier. Tier 01 (Logo Design) follows a 50% / 50% schedule (50% before work begins, 50% before final files are delivered). Tier 02 (Brand Identity Essentials) and Tier 03 (Full Brand System) follow a 50% / 25% / 25% schedule (50% at kickoff, 25% at strategy sign-off, 25% before final delivery). A 10% discount applies when paid upfront in full at kickoff.",
      "دفعة البدء 50% لكل الفئات. الفئة 01 (تصميم الشعار) بنظام 50% / 50% (50% قبل بدء العمل، و50% قبل تسليم الملفات النهائية). الفئة 02 (أساسيات الهوية البصرية) والفئة 03 (نظام براند متكامل) بنظام 50% / 25% / 25% (50% عند البدء، و25% عند اعتماد الاستراتيجية، و25% قبل التسليم النهائي). يُطبَّق خصم 10% عند سداد إجمالي الفاتورة كاملًا مقدمًا عند البدء.",
    ],
  },
  { n: "06", head: ["Payment Methods", "وسائل الدفع"], body: ["EGP, SAR or USD — cash, bank transfer, electronic wallets, InstaPay, or Vodafone Cash (01092500454). A 1% service fee may apply.", "بالجنيه أو الريال أو الدولار: نقدًا، أو تحويلًا بنكيًا أو إلكترونيًا، أو عبر إنستاباي أو فودافون كاش (01092500454)، مع إضافة رسوم خدمة بنسبة 1% من قيمة المبلغ."] },
  { n: "07", head: ["Revisions", "التعديلات"], body: ["Each tier includes its stated revision rounds; revisions that don't alter the overall design substantially. Beyond the included rounds, each additional revision is billed as stated per tier.", "تشمل كل فئة جولات المراجعة المذكورة فيها، وهي تعديلات لا تغيّر التصميم العام كثيرًا. وما زاد على ذلك يُحاسَب عليه كل تعديل إضافي كما هو موضح في كل فئة."] },
  { n: "08", head: ["Additional Terms", "بنود إضافية"], body: ["Further terms may be added at the client's request upon mutual agreement.", "تُضاف أي بنود أخرى في حال طلب العميل ذلك بعد الاتفاق بين الطرفين."] },
  { n: "09", head: ["IP Transfer", "نقل الملكية"], body: ["Full design rights transfer to the client in writing after the final payment clears.", "تنتقل حقوق التصميم كاملة إلى العميل كتابةً بعد سداد الدفعة الأخيرة."] },
  { n: "10", head: ["Good Faith", "حسن التعامل"], body: ["The designer guarantees flexibility and good conduct within a framework that protects both parties' rights.", "يضمن المصمم للعميل مرونة وحسن التعامل في إطار حفظ حقوق الطرفين."] },
  {
    n: "11",
    head: ["Cancellation & Refunds", "الإلغاء والاسترداد"],
    body: [
      "Cancellation must be sent in writing. The tier's kickoff payment is non-refundable once work has started because it reserves studio time. If cancelled before strategy sign-off (Tiers 02–03) the kickoff payment is retained and any unused paid milestone is refunded; after strategy sign-off, the kickoff and the strategy milestone are retained. Once final concepts have been delivered no refund is issued. Any refund is transferred within 14 working days of the written cancellation.",
      "يُقدَّم طلب الإلغاء كتابيًا. دفعة البدء غير قابلة للاسترداد بعد بدء العمل لأنها تحجز وقت الاستوديو. في حال الإلغاء قبل اعتماد الاستراتيجية (الفئتان 02–03) تُحتفظ بدفعة البدء ويُرد أي دفعة مرحلة مدفوعة ولم تُستهلك؛ وبعد اعتماد الاستراتيجية تُحتفظ دفعة البدء ودفعة الاستراتيجية. بعد تسليم المفاهيم النهائية لا يُسترد أي مبلغ. ويُحوَّل أي مبلغ مسترد خلال 14 يوم عمل من تاريخ الإلغاء الكتابي.",
    ],
  },
  {
    n: "12",
    head: ["Late Payment", "تأخر الدفعات"],
    body: [
      "Each milestone is due on the date stated in the invoice. If a payment is more than 5 working days late, work pauses until it arrives; no interest or penalty is added. If the delay passes 21 days the project moves to the back of the studio schedule and the agreed delivery date shifts by the same number of days. Files and IP transfer follow clause 09 and are released after the final payment clears.",
      "تُستحق كل دفعة في التاريخ المحدد بالفاتورة. إذا تأخرت الدفعة أكثر من 5 أيام عمل يتوقف العمل مؤقتًا حتى وصولها، دون أي فوائد أو غرامات. وإذا تجاوز التأخير 21 يومًا ينتقل المشروع إلى نهاية جدول الاستوديو ويتحرك موعد التسليم المتفق عليه بعدد الأيام نفسه. وتسليم الملفات ونقل الملكية وفق البند 09 بعد سداد الدفعة الأخيرة.",
    ],
  },
];
