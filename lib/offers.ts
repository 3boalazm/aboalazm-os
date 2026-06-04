/**
 * OFFERS — single source of truth for tiers, à la carte tables,
 * process phases, and payment structure. Consumed by /services,
 * /pricing, and /agreement so the numbers can never disagree.
 * All strings bilingual: [en, ar].
 */
export type Bi = readonly [en: string, ar: string];

export interface Tier {
  tag: Bi;
  name: Bi;
  price: string;
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
    tag: ["TIER 01", "الفئة ٠١"],
    name: ["Logo Design", "تصميم الشعار"],
    price: "$170 – $260",
    bestFor: ["MVP startups · Small businesses", "شركات ناشئة · مشاريع صغيرة"],
    duration: ["7 – 10 days", "٧ – ١٠ أيام"],
    payment: "50% / 50%",
    includesHead: ["What's included", "ما يشمله"],
    includes: [
      ["Discovery Call (30 min)", "مكالمة اكتشاف (٣٠ دقيقة)"],
      ["3 concept directions with strategic logic", "٣ اتجاهات بمنطق استراتيجي"],
      ["One direction developed to final", "تطوير الاتجاه المختار للشكل النهائي"],
      ["2 revision rounds", "جولتا مراجعة"],
      ["Files: AI · EPS · SVG · PNG · JPG", "الملفات: AI · EPS · SVG · PNG · JPG"],
      ["Versions: Color · White · Black · Mono", "نسخ: ملوّن · أبيض · أسود · أحادي"],
      ["CMYK + RGB formats", "صيغ CMYK للطباعة و RGB للديجيتال"],
      ["Mini Usage Guide (5 pages)", "دليل استخدام مصغّر (٥ صفحات)"],
    ],
    excludes: [
      ["Brand strategy", "استراتيجية البراند"],
      ["Full color system", "نظام ألوان كامل"],
      ["Brand applications", "تطبيقات الهوية"],
    ],
  },
  {
    tag: ["TIER 02", "الفئة ٠٢"],
    name: ["Brand Identity Essentials", "أساسيات الهوية البصرية"],
    price: "$640 – $1,065",
    bestFor: ["Emerging brands · SMEs", "براندات صاعدة · شركات صغيرة ومتوسطة"],
    duration: ["3 – 4 weeks", "٣ – ٤ أسابيع"],
    payment: "50% / 25% / 25%",
    recommended: true,
    includesHead: ["Everything in Tier 01, plus", "كل ما في الفئة ٠١، بالإضافة إلى"],
    includes: [
      ["Brand Audit (if existing)", "مراجعة شاملة للبراند الحالي"],
      ["Competitor Analysis", "تحليل المنافسين"],
      ["Concise Audience Persona", "بيرسونا مختصرة للجمهور"],
      ["Full Logo System (Primary + Secondary + Submark)", "نظام شعار كامل (أساسي + ثانوي + مصغّر)"],
      ["Color System (HEX · RGB · CMYK · Pantone)", "نظام ألوان (HEX · RGB · CMYK · Pantone)"],
      ["Typography Hierarchy", "هرمية الخطوط"],
      ["Brand Guidelines PDF (12–18 pages)", "دليل هوية PDF (١٢–١٨ صفحة)"],
      ["3 applications: Card · Letterhead · Social", "٣ تطبيقات: كارت · ورق رسمي · سوشيال"],
    ],
  },
  {
    tag: ["TIER 03", "الفئة ٠٣"],
    name: ["Full Brand System", "نظام براند متكامل"],
    price: "$1,490 – $2,975+",
    bestFor: ["Launches & re-launches at scale", "إطلاقات وإعادة إطلاق على نطاق واسع"],
    duration: ["5 – 7 weeks", "٥ – ٧ أسابيع"],
    payment: "50% / 25% / 25%",
    includesHead: ["Everything in Tier 02, plus", "كل ما في الفئة ٠٢، بالإضافة إلى"],
    includes: [
      ["Extended Discovery & Research", "بحث واكتشاف موسّع"],
      ["Full Brand Strategy Document", "وثيقة استراتيجية كاملة"],
      ["Purpose · Vision · Mission · Values", "الغاية · الرؤية · الرسالة · القيم"],
      ["Positioning · UVP · Personality · Archetype", "التموضع · القيمة الفريدة · الشخصية · النموذج"],
      ["Tone of Voice · Brand Story", "نبرة الصوت · قصة البراند"],
      ["Bilingual Lockup (Arabic / English)", "شعار ثنائي اللغة (عربي / إنجليزي)"],
      ["Brand Elements (Patterns · Icons · Photo Direction)", "عناصر بصرية (أنماط · أيقونات · توجيه التصوير)"],
      ["Brand Guidelines PDF (25–40 pages)", "دليل هوية PDF (٢٥–٤٠ صفحة)"],
      ["8+ applications", "٨+ تطبيقات"],
      ["Brand Training Workshop (1–2h)", "ورشة تدريب للفريق (١–٢ ساعة)"],
      ["30 days post-delivery support", "دعم ٣٠ يومًا بعد التسليم"],
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
      { service: ["Business Card", "بيزنس كارد"], details: ["Two-sided · 2 versions · 3 revisions", "وجهان · نسختان · ٣ تعديلات"], price: "$22" },
      { service: ["Brochure", "بروشور"], details: ["4 pages · A4 / A5 · up to 4 folds", "٤ صفحات · A4 / A5 · حتى ٤ طيّات"], price: "$34" },
      { service: ["Flyer", "فلاير"], details: ["Bi / Tri / Quad fold", "طيّة ثنائية / ثلاثية / رباعية"], price: "$26 – $38" },
      { service: ["Promotional Poster", "بوستر دعائي"], details: ["Digital or print", "ديجيتال أو مطبوع"], price: "$26 – $43" },
      { service: ["Banner", "بانر"], details: ["Square meter + $9 / additional sq.m", "متر مربع + ٩$ لكل متر إضافي"], price: "$34" },
      { service: ["Standard Roll-Up", "رول أب"], details: ["80×200 / 85×200 / 90×200 cm", "٨٠×٢٠٠ / ٨٥×٢٠٠ / ٩٠×٢٠٠ سم"], price: "$30" },
    ],
  },
  {
    group: ["Social Media Design", "تصميم السوشيال ميديا"],
    rows: [
      { service: ["Single Post", "بوست واحد"], details: ["Facebook · Instagram · LinkedIn", "فيسبوك · انستجرام · لينكدإن"], price: "$11" },
      { service: ["Pack of 10", "باقة ١٠"], details: ["Save $25", "وفّر ٢٥$"], price: "$85" },
      { service: ["Pack of 20", "باقة ٢٠"], details: ["Save $65", "وفّر ٦٥$"], price: "$155" },
    ],
  },
  {
    group: ["Web Design & Development", "تصميم وتطوير الويب"],
    rows: [
      { service: ["WordPress Website", "موقع ووردبريس"], details: ["Up to 7 pages · Responsive · Auth · 3 months support", "حتى ٧ صفحات · متجاوب · تسجيل دخول · دعم ٣ شهور"], price: "$255 – $510" },
    ],
  },
  {
    group: ["Retainer Services (monthly)", "خدمات شهرية (ريتينر)"],
    rows: [
      { service: ["Social Media Retainer", "ريتينر سوشيال ميديا"], details: ["15–20 designs + content templates", "١٥–٢٠ تصميم + قوالب محتوى"], price: "$170 – $255" },
      { service: ["Brand Maintenance", "صيانة الهوية"], details: ["Templates · light edits · quality oversight", "قوالب · تعديلات خفيفة · إشراف على الجودة"], price: "$215" },
      { service: ["Full Marketing Design", "تصميم تسويقي شامل"], details: ["Social + Print + Digital + Light Video", "سوشيال + مطبوعات + ديجيتال + فيديو خفيف"], price: "$425 – $640" },
    ],
  },
];

export const PROCESS = [
  { n: "01", name: ["Discovery & Research", "الاكتشاف والبحث"], body: ["Brand audit, competitor analysis, color-gap mapping, audience persona, cultural research. The foundation no logo can replace.", "مراجعة البراند، تحليل المنافسين، خريطة فجوات الألوان، بيرسونا الجمهور، والبحث الثقافي — الأساس الذي لا يعوّضه أي شعار."], days: ["Days 1–6", "الأيام ١–٦"] },
  { n: "02", name: ["Brand Strategy", "استراتيجية البراند"], body: ["Purpose, positioning, archetype, voice & tone, value proposition. Approved on paper before a single shape is drawn.", "الغاية، التموضع، النموذج، نبرة الصوت، والقيمة الفريدة — تُعتمد كتابيًا قبل رسم أي شكل."], days: ["Days 5–9", "الأيام ٥–٩"] },
  { n: "03", name: ["Concept & Design", "المفهوم والتصميم"], body: ["Sketches in dozens, narrowed to 2–3 directions. Logo system, color, typography, brand elements, and key applications.", "عشرات الإسكتشات تُختصر إلى ٢–٣ اتجاهات: نظام الشعار، الألوان، الخطوط، العناصر، والتطبيقات الأساسية."], days: ["Days 9–27", "الأيام ٩–٢٧"] },
  { n: "04", name: ["Refine & Deliver", "المراجعة والتسليم"], body: ["Two structured revision rounds, sign-off, final files in every format, brand guidelines PDF, handover call & 30-day support.", "جولتا مراجعة منظمتان، اعتماد نهائي، ملفات بكل الصيغ، دليل هوية PDF، مكالمة تسليم ودعم ٣٠ يومًا."], days: ["Days 27–38", "الأيام ٢٧–٣٨"] },
] as const;

export const PAYMENT = {
  t1: { title: ["Tier 1 — Logo Design", "الفئة ١ — تصميم الشعار"], split: "50% / 50%", steps: [["50% at Kickoff", "٥٠٪ عند البدء"], ["50% before final file delivery", "٥٠٪ قبل تسليم الملفات النهائية"]] },
  t23: { title: ["Tier 2 & 3 — Brand Identity", "الفئتان ٢ و٣ — الهوية البصرية"], split: "50% / 25% / 25%", steps: [["50% at Kickoff", "٥٠٪ عند البدء"], ["25% at Strategy Sign-off", "٢٥٪ عند اعتماد الاستراتيجية"], ["25% before final delivery", "٢٥٪ قبل التسليم النهائي"]] },
  methods: ["Bank transfer (local / international) · PayPal & Wise (international) · Electronic wallets (local) · Cash for in-person meetings. Transfer fees may apply.", "تحويل بنكي (محلي / دولي) · PayPal وWise (للعملاء الدوليين) · محافظ إلكترونية (محليًا) · كاش للمقابلات المباشرة. قد تُضاف رسوم تحويل حسب الوسيلة."],
} as const;
