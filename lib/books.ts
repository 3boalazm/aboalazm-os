/**
 * BOOKS — registry for the interactive book library. Extensible: add a new
 * entry here + drop its self-contained bundle in /public/books/<slug>/.
 * Each book's content is a self-contained HTML bundle (its own fonts, images,
 * and design), framed by the reader chrome and shown in an isolated iframe.
 */

export interface BookChapter {
  id: string;
  title: string;   // display title (Arabic for AR books)
  titleAr?: string; // override for English-titled chapters
}

export interface BookJourney {
  ar: string;
  en: string;
  chapters: readonly BookChapter[];
}

export interface Book {
  slug: string;
  title: string; // Arabic
  titleEn: string;
  edition: string;
  blurb: string; // Arabic
  blurbEn: string;
  chapterCount: number;
  bundle: string; // self-contained reader HTML
  journeys: readonly BookJourney[];
}

export const BOOKS: readonly Book[] = [
  {
    slug: "basics-of-design",
    title: "أساسيات التصميم الجرافيكي",
    titleEn: "Basics of Graphic Design",
    edition: "3rd Edition · 2026 · v3.0",
    blurb: "دليل عربي شامل في أساسيات التصميم: من المنهجية والتفكير، مرورًا بالحرفة وعناصرها، وصولًا إلى المهنة وبناء المسيرة.",
    blurbEn:
      "A comprehensive Arabic guide to design fundamentals — from methodology and thinking, through the craft and its elements, to the profession and building a career.",
    chapterCount: 17,
    bundle: "/books/basics-of-design/index.html",
    journeys: [
      {
        ar: "المنهجية",
        en: "Methodology",
        chapters: [
          { id: "chA", title: "لماذا نُصمِّم؟" },
          { id: "chB", title: "تفكير التصميم والعملية الإبداعية" },
          { id: "chC", title: "أدوات التصميم" },
          { id: "chD", title: "جماليات التصميم" },
        ],
      },
      {
        ar: "الحرفة",
        en: "Craft",
        chapters: [
          { id: "ch01", title: "عناصر التصميم" },
          { id: "ch02", title: "كيف تجمّع عينك العناصر؟" },
          { id: "ch03", title: "نقطة الارتكاز والتوجيه" },
          { id: "ch04", title: "التكوين" },
          { id: "ch05", title: "أنظمة الشبكة" },
          { id: "ch06", title: "الألوان" },
          { id: "ch07", title: "التيبوغرافيا" },
          { id: "ch08", title: "الصور والملفات" },
          { id: "ch09", title: "الإنتاج الطباعي وتسليم الملفات" },
        ],
      },
      {
        ar: "المهنة",
        en: "Profession",
        chapters: [
          { id: "ch10", title: "مجالات التصميم" },
          { id: "ch11", title: "أساسيات تجربة المستخدم · UX" },
          { id: "ch12", title: "أنظمة التصميم" },
          { id: "ch13", title: "الذكاء الاصطناعي للمصممين" },
        ],
      },
    ],
  },
  {
    slug: "visual-identity",
    title: "أساسيات الهوية البصرية",
    titleEn: "Basics of Visual Identity",
    edition: "1st Edition · 2026 · v1.0",
    blurb: "من الاستراتيجية إلى الحرفة البصرية ثم المهنة: كيف تُبنى هويات العلامات (الشعار، والألوان، والتيبوغرافيا، واللغة البصرية)، ودليل الهوية وكيفية تقديمها.",
    blurbEn:
      "From strategy through visual craft to the profession — how brand identities are built: logo, colour, typography, visual language, and the identity guide and its presentation.",
    chapterCount: 16,
    bundle: "/books/visual-identity/index.html",
    journeys: [
      {
        ar: "الاستراتيجية",
        en: "Strategy",
        chapters: [
          { id: "chA", title: "ما الهوية البصرية؟" },
          { id: "chB", title: "لماذا يشتري الناس العلامات التجارية؟" },
          { id: "chC", title: "استراتيجية العلامة" },
          { id: "chD", title: "شخصية العلامة وصوتها" },
        ],
      },
      {
        ar: "الحرفة البصرية",
        en: "Visual Craft",
        chapters: [
          { id: "ch01", title: "الاكتشاف والبحث" },
          { id: "ch02", title: "الاتجاه الإبداعي" },
          { id: "ch03", title: "تصميم الشعار" },
          { id: "ch04", title: "أنظمة الألوان" },
          { id: "ch05", title: "التيبوغرافيا في الهوية" },
          { id: "ch06", title: "اللغة البصرية" },
          { id: "ch07", title: "اتجاه التصوير" },
        ],
      },
      {
        ar: "المهنة",
        en: "Profession",
        chapters: [
          { id: "ch08", title: "تطبيقات الهوية" },
          { id: "ch09", title: "دليل الهوية" },
          { id: "ch10", title: "تقديم الهوية" },
          { id: "ch11", title: "أنظمة العالم الحقيقي" },
          { id: "ch12", title: "المشروع وورش العمل" },
        ],
      },
    ],
  },
  {
    slug: "marketing-fundamentals",
    title: "أساسيات التسويق",
    titleEn: "Marketing Fundamentals",
    edition: "1st Edition · 2026 · v1.0",
    blurb:
      "دليل عربي شامل في التسويق الحديث: من فهم العميل والاستراتيجية والعلامة، مرورًا بالمحتوى والإعلان والنمو، وصولًا إلى البيانات والتقنية والصورة الكاملة.",
    blurbEn:
      "A complete modern marketing guide — from customers, strategy, and brand, through content, advertising, and growth, to data, tech, and the integrated plan.",
    chapterCount: 59,
    bundle: "/books/marketing-fundamentals/index.html",
    journeys: [
      {
        ar: "مقدمة في التسويق",
        en: "Introduction to Marketing",
        chapters: [
          { id: "ch01", title: "ما هو التسويق؟" },
          { id: "ch02", title: "تطور التسويق" },
          { id: "ch03", title: "منظومة التسويق" },
        ],
      },
      {
        ar: "فهم العملاء",
        en: "Understanding Customers",
        chapters: [
          { id: "ch04", title: "علم نفس المستهلك" },
          { id: "ch05", title: "رحلة العميل" },
          { id: "ch06", title: "أبحاث العميل" },
          { id: "ch07", title: "شخصيات المشتري" },
        ],
      },
      {
        ar: "استراتيجية التسويق",
        en: "Marketing Strategy",
        chapters: [
          { id: "ch08", title: "التفكير الاستراتيجي" },
          { id: "ch09", title: "التموضع" },
          { id: "ch10", title: "المزيج التسويقي" },
          { id: "ch11", title: "الأهداف والمؤشرات" },
        ],
      },
      {
        ar: "العلامة التجارية",
        en: "Branding",
        chapters: [
          { id: "ch12", title: "أسس العلامة" },
          { id: "ch13", title: "هوية العلامة" },
          { id: "ch14", title: "الصوت والرسائل" },
          { id: "ch15", title: "قيمة العلامة" },
        ],
      },
      {
        ar: "المحتوى",
        en: "Content",
        chapters: [
          { id: "ch16", title: "استراتيجية المحتوى" },
          { id: "ch17", title: "الأشكال والقنوات" },
          { id: "ch18", title: "فن السرد" },
          { id: "ch19", title: "التوزيع" },
        ],
      },
      {
        ar: "الإعلان",
        en: "Advertising",
        chapters: [
          { id: "ch20", title: "أسس الإعلان" },
          { id: "ch21", title: "تشريح الإعلان" },
          { id: "ch22", title: "القنوات المدفوعة" },
          { id: "ch23", title: "الميزانية والتحسين" },
        ],
      },
      {
        ar: "النمو",
        en: "Growth",
        chapters: [
          { id: "ch24", title: "عقلية النمو" },
          { id: "ch25", title: "قمع النمو" },
          { id: "ch26", title: "الاحتفاظ والولاء" },
          { id: "ch27", title: "التحليلات والاختبار" },
        ],
      },
      {
        ar: "البحث و SEO",
        en: "Search & SEO",
        chapters: [
          { id: "ch28", title: "كيف يعمل البحث" },
          { id: "ch29", title: "نية الكلمة المفتاحية" },
          { id: "ch30", title: "تحسين الصفحة" },
          { id: "ch31", title: "السلطة والروابط" },
        ],
      },
      {
        ar: "وسائل التواصل الاجتماعي",
        en: "Social Media",
        chapters: [
          { id: "ch32", title: "المشهد الاجتماعي" },
          { id: "ch33", title: "استراتيجية المنصات" },
          { id: "ch34", title: "بناء المجتمع" },
          { id: "ch35", title: "التسويق بالمؤثرين" },
        ],
      },
      {
        ar: "البريد والأتمتة",
        en: "Email & Automation",
        chapters: [
          { id: "ch36", title: "لماذا يفوز البريد" },
          { id: "ch37", title: "بناء القائمة" },
          { id: "ch38", title: "أنواع البريد" },
          { id: "ch39", title: "الأتمتة ودورة الحياة" },
        ],
      },
      {
        ar: "التحليلات والقياس",
        en: "Analytics & Measurement",
        chapters: [
          { id: "ch40", title: "عقلية البيانات" },
          { id: "ch41", title: "المؤشرات والمقاييس" },
          { id: "ch42", title: "الإسناد" },
          { id: "ch43", title: "لوحات المعلومات" },
        ],
      },
      {
        ar: "التحويل و CRO",
        en: "Conversion & CRO",
        chapters: [
          { id: "ch44", title: "عقلية التحويل" },
          { id: "ch45", title: "صفحات الهبوط" },
          { id: "ch46", title: "القمع والاحتكاك" },
          { id: "ch47", title: "اختبار A/B" },
        ],
      },
      {
        ar: "التسعير والعروض",
        en: "Pricing & Offers",
        chapters: [
          { id: "ch48", title: "سيكولوجية التسعير" },
          { id: "ch49", title: "نماذج التسعير" },
          { id: "ch50", title: "صياغة العروض" },
          { id: "ch51", title: "الخصومات" },
        ],
      },
      {
        ar: "التقنية والذكاء الاصطناعي",
        en: "MarTech & AI",
        chapters: [
          { id: "ch52", title: "حزمة تقنيات التسويق" },
          { id: "ch53", title: "CRM والبيانات" },
          { id: "ch54", title: "الأتمتة" },
          { id: "ch55", title: "الذكاء الاصطناعي في التسويق" },
        ],
      },
      {
        ar: "الصورة الكاملة",
        en: "Putting It All Together",
        chapters: [
          { id: "ch56", title: "الخطة المتكاملة" },
          { id: "ch57", title: "الفريق وسير العمل" },
          { id: "ch58", title: "الميزانية وخارطة الطريق" },
          { id: "ch59", title: "المشروع الختامي" },
        ],
      },
    ],
  },
];

export const getBook = (slug: string) => BOOKS.find((b) => b.slug === slug);
