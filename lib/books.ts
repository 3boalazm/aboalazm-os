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
];

export const getBook = (slug: string) => BOOKS.find((b) => b.slug === slug);
