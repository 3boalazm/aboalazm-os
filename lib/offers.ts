/**
 * OFFERS — single source of truth for tiers, à la carte tables,
 * process phases, and payment structure.
 *
 * PRICING (2025 research — charm pricing: xx9/xx7 endings):
 * · Egypt agency floor: ~$370–$600 full brand
 * · MENA senior freelancer: $500–$5,000 logo; $1,500–$10,000 identity
 * · Mustafa positioned 20–30% above Egypt floor, 40–60% below intl agency
 */
export type Bi = readonly [en: string, ar: string];

export interface Tier {
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
    tag: ["TIER 01", "الفئة 01"],
    name: ["Logo Design", "تصميم الشعار"],
    price: "$199 – $279",
    priceNote: ["Starting at $199", "يبدأ من $199"],
    bestFor: ["MVP startups · Small businesses", "شركات ناشئة · مشاريع صغيرة"],
    duration: ["7 – 10 days", "7 – 10 أيام"],
    payment: "50% / 50%",
    includesHead: ["What's included", "ما يشمله"],
    includes: [
      ["Discovery Call (30 min)", "مكالمة اكتشاف (30 دقيقة)"],
      ["3 concept directions with strategic logic", "3 اتجاهات بمنطق استراتيجي"],
      ["One direction developed to final", "تطوير الاتجاه المختار للشكل النهائي"],
      ["2 revision rounds", "جولتا مراجعة"],
      ["Files: AI · EPS · SVG · PNG · JPG", "الملفات: AI · EPS · SVG · PNG · JPG"],
      ["Versions: Color · White · Black · Mono", "نسخ: ملوّن · أبيض · أسود · أحادي"],
      ["CMYK + RGB formats", "صيغ CMYK للطباعة و RGB للديجيتال"],
      ["Mini Usage Guide (5 pages)", "دليل استخدام مصغّر (5 صفحات)"],
    ],
    excludes: [
      ["Brand strategy", "استراتيجية البراند"],
      ["Full color system", "نظام ألوان كامل"],
      ["Brand applications", "تطبيقات الهوية"],
    ],
  },
  {
    tag: ["TIER 02", "الفئة 02"],
    name: ["Brand Identity Essentials", "أساسيات الهوية البصرية"],
    price: "$697 – $1,097",
    priceNote: ["Starting at $697", "يبدأ من $697"],
    bestFor: ["Emerging brands · SMEs", "براندات صاعدة · شركات صغيرة ومتوسطة"],
    duration: ["3 – 4 weeks", "3 – 4 أسابيع"],
    payment: "50% / 25% / 25%",
    recommended: true,
    includesHead: ["Everything in Tier 01, plus", "كل ما في الفئة 01، بالإضافة إلى"],
    includes: [
      ["Brand Audit (if existing)", "مراجعة شاملة للبراند الحالي"],
      ["Competitor Analysis", "تحليل المنافسين"],
      ["Concise Audience Persona", "بيرسونا مختصرة للجمهور"],
      ["Full Logo System (Primary + Secondary + Submark)", "نظام شعار كامل (أساسي + ثانوي + مصغّر)"],
      ["Color System (HEX · RGB · CMYK · Pantone)", "نظام ألوان (HEX · RGB · CMYK · Pantone)"],
      ["Typography Hierarchy", "هرمية الخطوط"],
      ["Brand Guidelines PDF (12–18 pages)", "دليل هوية PDF (12–18 صفحة)"],
      ["3 applications: Card · Letterhead · Social", "3 تطبيقات: كارت · ورق رسمي · سوشيال"],
    ],
  },
  {
    tag: ["TIER 03", "الفئة 03"],
    name: ["Full Brand System", "نظام براند متكامل"],
    price: "$1,497 – $2,997+",
    priceNote: ["Starting at $1,497", "يبدأ من $1,497"],
    bestFor: ["Launches & re-launches at scale", "إطلاقات وإعادة إطلاق على نطاق واسع"],
    duration: ["5 – 7 weeks", "5 – 7 أسابيع"],
    payment: "50% / 25% / 25%",
    includesHead: ["Everything in Tier 02, plus", "كل ما في الفئة 02، بالإضافة إلى"],
    includes: [
      ["Extended Discovery & Research", "بحث واكتشاف موسّع"],
      ["Full Brand Strategy Document", "وثيقة استراتيجية كاملة"],
      ["Purpose · Vision · Mission · Values", "الغاية · الرؤية · الرسالة · القيم"],
      ["Positioning · UVP · Personality · Archetype", "التموضع · القيمة الفريدة · الشخصية · النموذج"],
      ["Tone of Voice · Brand Story", "نبرة الصوت · قصة البراند"],
      ["Bilingual Lockup (Arabic / English)", "شعار ثنائي اللغة (عربي / إنجليزي)"],
      ["Brand Elements (Patterns · Icons · Photo Direction)", "عناصر بصرية (أنماط · أيقونات · توجيه التصوير)"],
      ["Brand Guidelines PDF (25–40 pages)", "دليل هوية PDF (25–40 صفحة)"],
      ["8+ applications", "8+ تطبيقات"],
      ["Brand Training Workshop (1–2h)", "ورشة تدريب للفريق (1–2 ساعة)"],
      ["30 days post-delivery support", "دعم 30 يومًا بعد التسليم"],
      ["Portfolio Case Study setup", "تجهيز دراسة حالة"],
    ],
  },
];

export interface AlaCarteGroup {
  group: Bi;
  rows: readonly { service: Bi; details: Bi; price: string }[];
}

export const ALACARTE: readonly AlaCarteGroup[] = [
  {
    group: ["Print & Brand Applications", "مطبوعات وتطبيقات الهوية"],
    rows: [
      { service: ["Business Card", "بيزنس كارد"], details: ["Two-sided · 2 versions · 3 revisions", "وجهان · نسختان · 3 تعديلات"], price: "$27" },
      { service: ["Brochure", "بروشور"], details: ["4 pages · A4 / A5 · up to 4 folds", "4 صفحات · A4 / A5 · حتى 4 طيّات"], price: "$39" },
      { service: ["Flyer", "فلاير"], details: ["Bi / Tri / Quad fold", "طيّة ثنائية / ثلاثية / رباعية"], price: "$29 – $47" },
      { service: ["Promotional Poster", "بوستر دعائي"], details: ["Digital or print", "ديجيتال أو مطبوع"], price: "$29 – $47" },
      { service: ["Banner", "بانر"], details: ["Square meter + $12 / additional sq.m", "متر مربع + 12$ لكل متر إضافي"], price: "$37" },
      { service: ["Standard Roll-Up", "رول أب"], details: ["80×200 / 85×200 / 90×200 cm", "80×200 / 85×200 / 90×200 سم"], price: "$37" },
    ],
  },
  {
    group: ["Social Media Design", "تصميم السوشيال ميديا"],
    rows: [
      { service: ["Single Post", "بوست واحد"], details: ["Facebook · Instagram · LinkedIn", "فيسبوك · انستجرام · لينكدإن"], price: "$14" },
      { service: ["Pack of 10", "باقة 10"], details: ["Save $29", "وفّر 29$"], price: "$111" },
      { service: ["Pack of 20", "باقة 20"], details: ["Save $69", "وفّر 69$"], price: "$211" },
    ],
  },
  {
    group: ["Web Design & Development", "تصميم وتطوير الويب"],
    rows: [
      { service: ["Custom Web Platform", "منصة ويب مخصّصة"], details: ["Next.js · Bilingual EN/AR + RTL · multi-section · performance-tuned · brand-aligned", "Next.js · ثنائي اللغة + RTL · متعدد الأقسام · أداء محسّن · متوافق مع الهوية"], price: "$1,297 – $2,997" },
      { service: ["Bilingual Marketing Site", "موقع تعريفي ثنائي اللغة"], details: ["Up to 7 pages · EN/AR · responsive · CMS-ready · SEO foundation", "حتى 7 صفحات · عربي/إنجليزي · متجاوب · جاهز لـ CMS · أساس SEO"], price: "$597 – $1,097" },
      { service: ["WordPress Website", "موقع ووردبريس"], details: ["Up to 7 pages · Responsive · Auth · 3 months support", "حتى 7 صفحات · متجاوب · تسجيل دخول · دعم 3 شهور"], price: "$297 – $597" },
      { service: ["Landing Page", "صفحة هبوط"], details: ["Single conversion-focused page · responsive · fast", "صفحة واحدة موجّهة للتحويل · متجاوبة · سريعة"], price: "$197 – $397" },
    ],
  },
  {
    group: ["Retainer Services (monthly)", "خدمات شهرية (ريتينر)"],
    rows: [
      { service: ["Social Media Retainer", "ريتينر سوشيال ميديا"], details: ["15–20 designs + content templates", "15–20 تصميم + قوالب محتوى"], price: "$197 – $297" },
      { service: ["Brand Maintenance", "صيانة الهوية"], details: ["Templates · light edits · quality oversight", "قوالب · تعديلات خفيفة · إشراف على الجودة"], price: "$247" },
      { service: ["Full Marketing Design", "تصميم تسويقي شامل"], details: ["Social + Print + Digital + Light Video", "سوشيال + مطبوعات + ديجيتال + فيديو خفيف"], price: "$447 – $697" },
    ],
  },
];

export const PROCESS = [
  { n: "01", name: ["Discovery & Research", "الاكتشاف والبحث"], body: ["Brand audit, competitor analysis, color-gap mapping, audience persona, cultural research. The foundation no logo can replace.", "مراجعة البراند، تحليل المنافسين، خريطة فجوات الألوان، بيرسونا الجمهور، والبحث الثقافي — الأساس الذي لا يعوّضه أي شعار."], days: ["Days 1–6", "الأيام 1–6"] },
  { n: "02", name: ["Brand Strategy", "استراتيجية البراند"], body: ["Purpose, positioning, archetype, voice & tone, value proposition. Approved on paper before a single shape is drawn.", "الغاية، التموضع، النموذج، نبرة الصوت، والقيمة الفريدة — تُعتمد كتابيًا قبل رسم أي شكل."], days: ["Days 5–9", "الأيام 5–9"] },
  { n: "03", name: ["Concept & Design", "المفهوم والتصميم"], body: ["Sketches in dozens, narrowed to 2–3 directions. Logo system, color, typography, brand elements, and key applications.", "عشرات الإسكتشات تُختصر إلى 2–3 اتجاهات: نظام الشعار، الألوان، الخطوط، العناصر، والتطبيقات الأساسية."], days: ["Days 9–27", "الأيام 9–27"] },
  { n: "04", name: ["Refine & Deliver", "المراجعة والتسليم"], body: ["Two structured revision rounds, sign-off, final files in every format, brand guidelines PDF, handover call & 30-day support.", "جولتا مراجعة منظمتان، اعتماد نهائي، ملفات بكل الصيغ، دليل هوية PDF، مكالمة تسليم ودعم 30 يومًا."], days: ["Days 27–38", "الأيام 27–38"] },
] as const;

export const PAYMENT = {
  t1: { title: ["Tier 1 — Logo Design", "الفئة 1 — تصميم الشعار"], split: "50% / 50%", steps: [["50% at Kickoff", "50% عند البدء"], ["50% before final file delivery", "50% قبل تسليم الملفات النهائية"]] },
  t23: { title: ["Tier 2 & 3 — Brand Identity", "الفئتان 2 و3 — الهوية البصرية"], split: "50% / 25% / 25%", steps: [["50% at Kickoff", "50% عند البدء"], ["25% at Strategy Sign-off", "25% عند اعتماد الاستراتيجية"], ["25% before final delivery", "25% قبل التسليم النهائي"]] },
  methods: ["Bank transfer (local / international) · PayPal & Wise (international) · Electronic wallets (local) · Cash for in-person meetings. Transfer fees may apply.", "تحويل بنكي (محلي / دولي) · PayPal وWise (للعملاء الدوليين) · محافظ إلكترونية (محليًا) · كاش للمقابلات المباشرة. قد تُضاف رسوم تحويل حسب الوسيلة."],
} as const;

/**
 * The one-line terms ruling — THE single source of truth (overhaul S3,
 * QA #19-22/#66). Every page that mentions payment says exactly this or
 * links here; never paraphrase it locally again.
 * Rule: kickoff is always 50%; the balance depends on the tier
 * (Tier 1: 50 before files · Tiers 2–3: 25 at strategy sign-off + 25 before delivery).
 */
export const TERMS_LINE: readonly [string, string] = [
  "How payment works: 50% kickoff for every tier. The balance is due before final files — Tier 1 pays it as one 50% installment, Tiers 2–3 as 25% at strategy sign-off + 25% before delivery. No work before the deposit; no files before the balance — it protects both sides.",
  "إزاي بيتم الدفع: 50% مقدّم لكل الفئات. الباقي قبل تسليم الملفات النهائية — الفئة 1 دفعة واحدة 50%، والفئتان 2 و3: 25% عند اعتماد الاستراتيجية + 25% قبل التسليم. لا بدء بدون مقدّم ولا ملفات قبل الباقي — حماية للطرفين.",
] as const;
