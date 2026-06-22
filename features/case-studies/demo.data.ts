/** NILE PHARMA — real engagement record (2020–2025). */
import type { CaseStudyRecord } from "./types";

export const NILE_PHARMA: CaseStudyRecord = {
  slug: "nile-pharma",
  name: "Nile Pharma Food",
  nameAr: "نايل فارما فود",
  discipline: "Systemic Identity",
  accent: {
    primary: "rgb(0 200 210 / 0.18)",
    secondary: "rgb(64 156 255 / 0.10)",
  },

  problem:
    "A pharma and food-supplements company operating with no visual identity at all — no logo system, no palette, no templates, no website. Every sales document, label, and post was improvised, and in a regulated sector, improvisation reads as risk.",
  problemAr:
    "شركة أدوية ومكملات غذائية تعمل بدون هوية بصرية على الإطلاق — لا نظام لوجو، لا لوحة ألوان، لا قوالب، لا موقع. كل وثيقة مبيعات وملصق وبوست كان مرتجلاً، وفي قطاع منظَّم، الارتجال يُقرأ كخطر.",
  teamScale: "1 designer (me) · sales, accounting & warehouse stakeholders",
  teamScaleAr: "١ مصمم (أنا) · أصحاب مصلحة من المبيعات والمحاسبة والمستودع",
  timeline: "2020 → 2025 · identity from zero, then full rebrand",
  timelineAr: "2020 → 2025 · هوية من الصفر ثم إعادة براند كاملة",
  kpis: [
    { value: "0",  label: "Brand assets at start",   labelAr: "أصول البراند في البداية", context: "BUILT FROM ZERO",  contextAr: "بُني من الصفر"          },
    { value: "4",  label: "Departments to align",    labelAr: "أقسام تم توحيدها",        context: "CENTRAL LIAISON",  contextAr: "حلقة الوصل المركزية"   },
    { value: "1",  label: "Designer on the system",  labelAr: "مصمم على النظام",          context: "FULL OWNERSHIP",   contextAr: "ملكية كاملة"            },
  ],

  researchSummary:
    "Pharma-food competitors clustered in two camps: clinical-and-cold or bazaar-loud. Neither earned consumer trust and shelf presence at once. The open position: pharmaceutical credibility carried by food-grade warmth — one system serving both worlds.",
  researchSummaryAr:
    "منافسو الدواء والغذاء تجمّعوا في معسكرين: سريري-بارد أو سوق-صاخب. لا أحدهما أكسب ثقة المستهلك وحضور الرف في آن. الموضع المفتوح: مصداقية صيدلانية يحملها دفء غذائي — نظام واحد يخدم العالمين.",
  competitors: [
    { name: "Clinical A",  x: 30, y: 55 },
    { name: "Clinical B",  x: 22, y: 40 },
    { name: "Loud C",      x: 62, y: 18 },
    { name: "Loud D",      x: 70, y: 25 },
    { name: "Importer E",  x: 40, y: 30 },
    { name: "Nile Pharma", x: 82, y: 84, isClient: true },
  ],
  visualVectors:   ["TRUST-FIRST", "BILINGUAL", "SHELF-READY", "TEMPLATE-DRIVEN", "WARM CLINICAL"],
  visualVectorsAr: ["الثقة أولاً", "ثنائي اللغة", "جاهز للرف", "قائم على القوالب", "دفء سريري"],

  tokens: [
    { token: "logo-system", value: "3 lockups", role: "AR/EN + mark",       roleAr: "عربي/إنجليزي + علامة" },
    { token: "palette",     value: "2+3",        role: "Primary + support",  roleAr: "أساسي + داعم"         },
    { token: "type-scale",  value: "2 scripts",  role: "One hierarchy",      roleAr: "تسلسل هرمي واحد"      },
    { token: "templates",   value: "12+",         role: "Social · print · docs", roleAr: "سوشيال · مطبوعات · وثائق" },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "MOBILE",  cols: "4-col"  },
    { bp: "TABLET",  cols: "8-col"  },
    { bp: "DESKTOP", cols: "12-col" },
  ],

  results: [
    { value: "+40%", label: "Online Visibility",    labelAr: "الظهور الرقمي",   context: "POST WEBSITE LAUNCH",    contextAr: "بعد إطلاق الموقع"       },
    { value: "+25%", label: "Customer Engagement",  labelAr: "تفاعل العملاء",   context: "6 MONTHS POST-REBRAND",  contextAr: "٦ أشهر بعد إعادة البراند" },
    { value: "5y",   label: "System In Production", labelAr: "النظام في الإنتاج", context: "2020 → 2025",           contextAr: "2020 → 2025"              },
  ],
  images: [
    { src: "/images/work/nile-pharma/npf-logo-grid.png",        caption: "Logo construction grid",    captionAr: "شبكة بناء اللوجو",         w: 1400, h: 700  },
    { src: "/images/work/nile-pharma/npf-logo-waves.png",       caption: "Identity on palm leaves",   captionAr: "الهوية على أوراق النخيل",   w: 1181, h: 1594 },
    { src: "/images/work/nile-pharma/npf-business-card-box.jpg",caption: "Business card & packaging", captionAr: "كارت البيزنيس والتغليف",    w: 4000, h: 3000 },
    { src: "/images/work/nile-pharma/npf-proxeed-products.png", caption: "Proxeed Plus & Proxerex",   captionAr: "Proxeed Plus و Proxerex",   w: 652,  h: 454  },
    { src: "/images/work/nile-pharma/npf-ramadan.png",          caption: "Ramadan campaign post",     captionAr: "بوست حملة رمضان",          w: 1880, h: 1576 },
    { src: "/images/work/nile-pharma/npf-proxeed-post.jpg",     caption: "Proxeed — campaign",        captionAr: "Proxeed — الحملة",          w: 1880, h: 1576 },
    { src: "/images/work/nile-pharma/npf-img-b.png",            caption: "Billboard — New Story",     captionAr: "لوحة إعلانية — قصة جديدة", w: 1400, h: 1050 },
    { src: "/images/work/nile-pharma/npf-img-c.png",            caption: "Product flyers",            captionAr: "فلايرات المنتجات",          w: 1400, h: 700  },
    { src: "/images/work/nile-pharma/npf-img-a.png",            caption: "We care about you",         captionAr: "نهتم بك",                  w: 1400, h: 700  },
    { src: "/images/work/nile-pharma/npf-ezaby-post.jpg",       caption: "Ezaby — social post",       captionAr: "Ezaby — بوست سوشيال",      w: 1880, h: 1576 },
    { src: "/images/work/nile-pharma/npf-logo-motion.gif",      caption: "Logo motion study",         captionAr: "دراسة حركة اللوجو",        w: 1400, h: 700  },
  ],

  retro: [
    { verdict: "KEEP",   note: "Templates as deliverables — every department could publish on-brand without me.", noteAr: "القوالب كمخرجات — كل قسم يقدر ينشر on-brand من غيري." },
    { verdict: "KEEP",   note: "Stakeholder liaison role from day one; alignment was design work too.",            noteAr: "دور التنسيق مع أصحاب المصلحة من اليوم الأول؛ التوافق كان شغل تصميم هو الآخر." },
    { verdict: "CHANGE", note: "Brand guidelines should have shipped in year one, not at the rebrand.",           noteAr: "دليل الهوية كان لازم يتسلّم في السنة الأولى، مش عند إعادة البراند." },
  ],
};

/** @deprecated kept for import compatibility */
export const ART_REFLECTION = NILE_PHARMA;
