/** AHMED BEDEER — Personal Brand Identity · Healthcare IT */
import type { CaseStudyRecord } from "./types";

export const AHMED_BEDEER: CaseStudyRecord = {
  slug: "ahmed-bedeer",
  name: "Ahmed Bedeer",
  nameAr: "أحمد بدير",
  discipline: "Identity Engineering",
  accent: {
    primary: "rgb(17 138 178 / 0.22)",
    secondary: "rgb(6 214 160 / 0.12)",
  },

  problem:
    "A senior Healthcare IT consultant operating without any personal brand presence — no visual identity, no unified digital positioning, no system connecting his international credentials to his professional narrative. In a sector where trust is the product, invisibility is a liability.",
  problemAr:
    "استشاري تكنولوجيا معلومات صحية أول يعمل بدون أي حضور براند شخصي — لا هوية بصرية، لا تموضع رقمي موحّد، لا نظام يربط مؤهلاته الدولية بروايته المهنية. في قطاع الثقة هي المنتج، الغياب مسؤولية.",
  teamScale: "1 designer · 1 client · remote collaboration",
  teamScaleAr: "1 مصمم · 1 عميل · تعاون عن بُعد",
  timeline: "October 2025 · V1.0 guidelines delivered",
  timelineAr: "أكتوبر 2025 · تسليم دليل V1.0",
  kpis: [
    { value: "0",  label: "Brand assets before",  labelAr: "أصول البراند قبل",  context: "STARTED FROM ZERO",         contextAr: "بدأنا من الصفر"           },
    { value: "4",  label: "Standards to signal",  labelAr: "معايير للتعبير عنها", context: "HL7 · FHIR · CPHIMS · HIMSS", contextAr: "HL7 · FHIR · CPHIMS · HIMSS" },
    { value: "2",  label: "Markets targeted",     labelAr: "أسواق مستهدفة",      context: "KSA + WIDER MENA",           contextAr: "المملكة + منطقة MENA"     },
  ],

  researchSummary:
    "Healthcare IT consultants cluster into two poles: clinical-technical (white-coat formality) or generic tech (dark-mode-startup aesthetics). Neither commands authority at the strategy table. The gap: a personal brand that signals domain mastery through precision and restraint — not loud, but unmistakably expert.",
  researchSummaryAr:
    "استشاريو تكنولوجيا المعلومات الصحية يتجمعون في قطبين: سريري-تقني (رسمية المعطف الأبيض) أو تقني عام (جماليات الستارت أب الداكنة). لا أيٌّ منهما يمنح سلطة على طاولة الاستراتيجية. الفجوة: براند شخصي يُشير إلى إتقان المجال بالدقة والتحفظ — لا صاخب، لكنه خبير بلا لبس.",
  competitors: [
    { name: "Clinical-corporate A", x: 28, y: 62 },
    { name: "Clinical-corporate B", x: 18, y: 50 },
    { name: "Tech-generic C",       x: 60, y: 30 },
    { name: "Tech-generic D",       x: 72, y: 22 },
    { name: "Consultant E",         x: 45, y: 45 },
    { name: "Ahmed Bedeer",         x: 80, y: 82, isClient: true },
  ],
  visualVectors:   ["AUTHORITY", "PRECISION", "CLINICAL", "INTERNATIONAL", "TRUST"],
  visualVectorsAr: ["سلطة", "دقة", "سريري", "دولي", "ثقة"],

  tokens: [
    { token: "monogram",     value: "a + b",        role: "Quotation-mark form",  roleAr: "شكل علامة الاقتباس" },
    { token: "dark-gunmetal", value: "#1C2B33",      role: "Anchor / authority",  roleAr: "ثبات / سلطة"        },
    { token: "steel-blue",   value: "#118AB2",       role: "Trust / technical",   roleAr: "ثقة / تقني"         },
    { token: "teal-accent",  value: "#06D6A0",       role: "Innovation accent",   roleAr: "لمسة الابتكار"       },
    { token: "Lubalin Graph", value: "Display",      role: "Geometric precision", roleAr: "دقة هندسية"          },
    { token: "Uncut Sans",   value: "Body",          role: "Clarity / reading",   roleAr: "وضوح / قراءة"        },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "MOBILE",  cols: "4-col"  },
    { bp: "TABLET",  cols: "8-col"  },
    { bp: "DESKTOP", cols: "12-col" },
  ],

  results: [
    { value: "V1.0", label: "Coherent system shipped",  labelAr: "نظام متماسك تم تسليمه",  context: "LOGO → COLOR → TYPE → APPS",     contextAr: "لوجو → لون → خط → تطبيقات"     },
    { value: "1",    label: "Brand guidelines PDF",     labelAr: "ملف دليل الهوية PDF",     context: "GOVERNED, NOT GUESSED",          contextAr: "محكوم لا مرتجل"               },
    { value: "3",    label: "Palette tokens defined",   labelAr: "توكنز لوحة الألوان",      context: "PRIMARY + EXTENDED + SECONDARY", contextAr: "أساسي + موسّع + ثانوي"        },
  ],

  retro: [
    { verdict: "KEEP",   note: "The 'ab' quotation-mark monogram — initials that signal dialogue and thought leadership simultaneously.",   noteAr: "مونوجرام علامة الاقتباس 'ab' — أحرف أولى تُشير إلى الحوار والريادة الفكرية في آن."        },
    { verdict: "KEEP",   note: "Blue for trust, teal for transformation — never decoration, always doctrine.",                               noteAr: "الأزرق للثقة، والتيل للتحول — ليست ديكوراً أبداً، دائماً عقيدة."                       },
    { verdict: "CHANGE", note: "Lock 'Healthcare' spelling in the lockup before any print run.",                                             noteAr: "اقفل إملاء 'Healthcare' في الـ lockup قبل أي طباعة." },
  ],
};
