/**
 * BOOKS — registry for the interactive book library. Extensible: add a new
 * entry here + drop its self-contained bundle in /public/books/<slug>/.
 * Each book's content is a self-contained HTML bundle (its own fonts, images,
 * and design), framed by the reader chrome and shown in an isolated iframe.
 */

export interface BookChapter {
  id: string; // anchor id inside the bundle (chA, ch01, ...)
  title: string; // Arabic chapter title
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
    blurb: "دليل عربي شامل في أساسيات التصميم — من المنهجية والتفكير، مرورًا بالحرفة وعناصرها، وصولًا إلى المهنة وبناء المسيرة.",
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
          { id: "ch02", title: "إزّاي عينك بتجمّع العناصر؟" },
          { id: "ch03", title: "نقطة الارتكاز والتوجيه" },
          { id: "ch04", title: "التكوين" },
          { id: "ch05", title: "أنظمة الشبكة" },
          { id: "ch06", title: "الألوان" },
          { id: "ch07", title: "التايبوجرافي" },
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
    blurb: "من الاستراتيجية إلى الحرفة البصرية إلى المهنة — كيف تُبنى هويات البراند: الشعار، الألوان، التايبوجرافي، اللغة البصرية، ودليل الهوية وتقديمها.",
    blurbEn:
      "From strategy through visual craft to the profession — how brand identities are built: logo, colour, typography, visual language, and the identity guide and its presentation.",
    chapterCount: 16,
    bundle: "/books/visual-identity/index.html",
    journeys: [
      {
        ar: "الاستراتيجية",
        en: "Strategy",
        chapters: [
          { id: "chA", title: "إيه هي الهوية البصرية؟" },
          { id: "chB", title: "ليه الناس بتشتري البراندات؟" },
          { id: "chC", title: "استراتيجية البراند" },
          { id: "chD", title: "شخصية وصوت البراند" },
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
          { id: "ch05", title: "التايبوجرافي في الهوية" },
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
      "دليل عربي شامل في التسويق الحديث — من فهم العميل والاستراتيجية والعلامة، مرورًا بالمحتوى والإعلان والنمو، وصولًا إلى البيانات والتقنية والصورة الكاملة.",
    blurbEn:
      "A complete modern marketing guide — from customers, strategy, and brand, through content, advertising, and growth, to data, tech, and the integrated plan.",
    chapterCount: 59,
    bundle: "/books/marketing-fundamentals/index.html",
    journeys: [
      {
        ar: "مقدمة في التسويق",
        en: "Introduction to Marketing",
        chapters: [
          { id: "ch01", title: "What Is Marketing?" },
          { id: "ch02", title: "The Evolution of Marketing" },
          { id: "ch03", title: "The Marketing Ecosystem" },
        ],
      },
      {
        ar: "فهم العملاء",
        en: "Understanding Customers",
        chapters: [
          { id: "ch04", title: "Consumer Psychology" },
          { id: "ch05", title: "The Customer Journey" },
          { id: "ch06", title: "Customer Research" },
          { id: "ch07", title: "Buyer Personas" },
        ],
      },
      {
        ar: "استراتيجية التسويق",
        en: "Marketing Strategy",
        chapters: [
          { id: "ch08", title: "Strategic Thinking" },
          { id: "ch09", title: "Positioning" },
          { id: "ch10", title: "The Marketing Mix" },
          { id: "ch11", title: "Goals & KPIs" },
        ],
      },
      {
        ar: "العلامة التجارية",
        en: "Branding",
        chapters: [
          { id: "ch12", title: "Brand Foundations" },
          { id: "ch13", title: "Brand Identity" },
          { id: "ch14", title: "Voice & Messaging" },
          { id: "ch15", title: "Brand Equity" },
        ],
      },
      {
        ar: "المحتوى",
        en: "Content",
        chapters: [
          { id: "ch16", title: "Content Strategy" },
          { id: "ch17", title: "Formats & Channels" },
          { id: "ch18", title: "Storytelling" },
          { id: "ch19", title: "Distribution" },
        ],
      },
      {
        ar: "الإعلان",
        en: "Advertising",
        chapters: [
          { id: "ch20", title: "Ad Foundations" },
          { id: "ch21", title: "Anatomy of an Ad" },
          { id: "ch22", title: "Paid Channels" },
          { id: "ch23", title: "Budget & Optimization" },
        ],
      },
      {
        ar: "النمو",
        en: "Growth",
        chapters: [
          { id: "ch24", title: "Growth Mindset" },
          { id: "ch25", title: "The Growth Funnel" },
          { id: "ch26", title: "Retention & Loyalty" },
          { id: "ch27", title: "Analytics & Testing" },
        ],
      },
      {
        ar: "البحث و SEO",
        en: "Search & SEO",
        chapters: [
          { id: "ch28", title: "How Search Works" },
          { id: "ch29", title: "Keyword Intent" },
          { id: "ch30", title: "On-Page SEO" },
          { id: "ch31", title: "Authority & Links" },
        ],
      },
      {
        ar: "السوشيال ميديا",
        en: "Social Media",
        chapters: [
          { id: "ch32", title: "The Social Landscape" },
          { id: "ch33", title: "Platform Strategy" },
          { id: "ch34", title: "Building Community" },
          { id: "ch35", title: "Influencer Marketing" },
        ],
      },
      {
        ar: "البريد والأتمتة",
        en: "Email & Automation",
        chapters: [
          { id: "ch36", title: "Why Email Wins" },
          { id: "ch37", title: "List Building" },
          { id: "ch38", title: "Email Types" },
          { id: "ch39", title: "Automation & Lifecycle" },
        ],
      },
      {
        ar: "التحليلات والقياس",
        en: "Analytics & Measurement",
        chapters: [
          { id: "ch40", title: "The Data Mindset" },
          { id: "ch41", title: "KPIs & Metrics" },
          { id: "ch42", title: "Attribution" },
          { id: "ch43", title: "Dashboards" },
        ],
      },
      {
        ar: "التحويل و CRO",
        en: "Conversion & CRO",
        chapters: [
          { id: "ch44", title: "Conversion Mindset" },
          { id: "ch45", title: "Landing Pages" },
          { id: "ch46", title: "Funnels & Friction" },
          { id: "ch47", title: "A/B Testing" },
        ],
      },
      {
        ar: "التسعير والعروض",
        en: "Pricing & Offers",
        chapters: [
          { id: "ch48", title: "Pricing Psychology" },
          { id: "ch49", title: "Pricing Models" },
          { id: "ch50", title: "Crafting Offers" },
          { id: "ch51", title: "Discounts" },
        ],
      },
      {
        ar: "التقنية والذكاء الاصطناعي",
        en: "MarTech & AI",
        chapters: [
          { id: "ch52", title: "The MarTech Stack" },
          { id: "ch53", title: "CRM & Data" },
          { id: "ch54", title: "Automation" },
          { id: "ch55", title: "AI in Marketing" },
        ],
      },
      {
        ar: "الصورة الكاملة",
        en: "Putting It All Together",
        chapters: [
          { id: "ch56", title: "The Integrated Plan" },
          { id: "ch57", title: "Team & Workflow" },
          { id: "ch58", title: "Budget & Roadmap" },
          { id: "ch59", title: "The Capstone" },
        ],
      },
    ],
  },
];

export const getBook = (slug: string) => BOOKS.find((b) => b.slug === slug);
