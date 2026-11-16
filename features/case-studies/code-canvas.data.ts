/** CODE & CANVAS — Studio Identity · Design Infrastructure */
import type { CaseStudyRecord } from "./types";

export const CODE_CANVAS: CaseStudyRecord = {
  slug: "code-canvas",
  name: "Code & Canvas",
  nameAr: "Code & Canvas",
  discipline: "Identity Engineering",
  accent: {
    primary: "rgb(120 80 200 / 0.22)",
    secondary: "rgb(72 204 200 / 0.14)",
  },

  problem:
    "A new digital studio — co-founded by Mustafa Aboalazm — that needed a brand identity before it could credibly sell brand identity. The challenge: design a system that proves the methodology without over-explaining it, in two languages, shipped before launch day.",
  problemAr:
    "استوديو رقمي جديد، أسّسه مصطفى أبوالعزم، يحتاج هوية لعلامته قبل أن يبيع هويات العلامات بمصداقية. التحدي: تصميم نظام يُثبت المنهجية دون شرح مفرط، بلغتين، ومُسلَّم قبل يوم الإطلاق.",
  teamScale: "Co-founders: Mustafa Aboalazm (Creative Lead) + partner",
  teamScaleAr: "المؤسسان: مصطفى أبوالعزم (القيادة الإبداعية) + شريك",
  timeline: "February 2024 · V1.0 brand guidelines shipped at launch",
  timelineAr: "فبراير 2024 · تسليم دليل V1.0 عند الإطلاق",
  kpis: [
    { value: "2",    label: "Disciplines unified",   labelAr: "تخصصات موحّدة",       context: "CODE + CREATIVE",        contextAr: "كود + إبداع"              },
    { value: "1",    label: "Mark that says both",   labelAr: "شعار يعبّر عن الاثنين", context: "SQUIRCLE GRID SYSTEM",   contextAr: "نظام شبكة Squircle"       },
    { value: "V1.0", label: "Guidelines at launch",  labelAr: "دليل الهوية عند الإطلاق", context: "GOVERNED FROM DAY ONE", contextAr: "محكوم من اليوم الأول"   },
  ],

  researchSummary:
    "Digital agencies split into two camps: pure-tech (all code, zero craft) or pure-creative (all art, no system). Neither owns both worlds. Code & Canvas needed a mark that literally fuses the two — a squircle that reads as icon at small scale, as geometric canvas at large.",
  researchSummaryAr:
    "الوكالات الرقمية تنقسم معسكرين: تقني بحت (كود فقط، صفر حرفة) أو إبداعي بحت (فن فقط، لا نظام). لا أيٌّ منهما يمتلك العالمين. Code & Canvas تحتاج شعارًا يدمج الاثنين حرفيًا — squircle يُقرأ كأيقونة في الصغر، وكقماش هندسي في الكبير.",
  competitors: [
    { name: "Tech-only agency A",  x: 25, y: 35 },
    { name: "Tech-only agency B",  x: 18, y: 28 },
    { name: "Creative-only C",     x: 65, y: 55 },
    { name: "Creative-only D",     x: 75, y: 48 },
    { name: "Generic digital E",   x: 40, y: 20 },
    { name: "Code & Canvas",       x: 78, y: 85, isClient: true },
  ],
  visualVectors:   ["PRECISION", "CRAFT", "SYSTEM", "GRADIENT", "BILINGUAL"],
  visualVectorsAr: ["دقة", "حرفة", "نظام", "تدرج", "ثنائي اللغة"],

  tokens: [
    { token: "primary-bg",     value: "#0B0F1A", role: "Dark blue canvas",      roleAr: "قماش أزرق داكن"    },
    { token: "accent-teal",    value: "#48CCCC", role: "Secondary / highlights", roleAr: "ثانوي / إضاءات"    },
    { token: "stroke-purple",  value: "#7850C8", role: "Borders / rules",        roleAr: "حدود / خطوط"       },
    { token: "Signate Grotesk",value: "Black",   role: "Display",                roleAr: "عرض"               },
    { token: "Raleway",        value: "Medium",  role: "Subheadings",            roleAr: "عناوين فرعية"       },
    { token: "Poppins",        value: "Regular", role: "Articles / UI copy",     roleAr: "مقالات / نصوص UI"  },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "MOBILE",  cols: "4-col"  },
    { bp: "TABLET",  cols: "8-col"  },
    { bp: "DESKTOP", cols: "12-col" },
  ],

  results: [
    { value: "1",    label: "System at founding",   labelAr: "نظام عند التأسيس",   context: "NOT RETROFITTED",       contextAr: "لا ترقيع لاحق"            },
    { value: "3",    label: "Type families",        labelAr: "عائلات الخط",         context: "GOVERNED HIERARCHY",    contextAr: "تسلسل هرمي محكوم"          },
    { value: "8",    label: "Gradient variants",    labelAr: "متغيرات التدرج",      context: "EXPRESSION WITHIN SYSTEM", contextAr: "تعبير داخل النظام"      },
  ],

  retro: [
    { verdict: "KEEP",   note: "Purple-to-teal gradient as the expressive layer: constrained by the token system, so every use is on-brand automatically.",   noteAr: "التدرج من البنفسجي للتيل كطبقة تعبيرية: محكوم بنظام التوكنز، فكل استخدام on-brand تلقائيًا."     },
    { verdict: "KEEP",   note: "Identity shipped as a live product — codeandcanvas.net built end to end: bilingual EN/AR, design system in production.",        noteAr: "الهوية تم تسليمها كمنتج حي — codeandcanvas.net بُني من الألف للياء: ثنائي اللغة، نظام تصميم في الإنتاج." },
    { verdict: "CHANGE", note: "Three typefaces (Signate Grotesk / Raleway / Poppins) is one too many for long-term consistency.",                              noteAr: "ثلاث خطوط كثير على المدى البعيد للاتساق." },
  ],
};
