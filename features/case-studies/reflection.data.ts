/** REFLECTION — Brand Identity · Art & Print */
import type { CaseStudyRecord } from "./types";

export const REFLECTION: CaseStudyRecord = {
  slug: "reflection",
  name: "Reflection",
  nameAr: "Reflection",
  discipline: "Systemic Identity",
  accent: {
    primary: "rgb(150 70 140 / 0.16)",
    secondary: "rgb(0 150 160 / 0.12)",
  },

  problem:
    "A premium art and print studio needing an identity that positioned it apart from mass-market poster shops — something that felt considered, gallery-adjacent, and collectable, while remaining legible and functional across both digital and physical surfaces.",
  problemAr:
    "استوديو فن ومطبوعات متميز يحتاج هوية تضعه بعيداً عن محلات الملصقات الشعبية — شيء يبدو مدروساً، قريباً من المعارض، وقابلاً للاقتناء، مع الحفاظ على وضوحه ووظيفيته عبر الأسطح الرقمية والمادية.",
  teamScale: "1 designer · founder · remote delivery",
  teamScaleAr: "١ مصمم · المؤسس · تسليم عن بُعد",
  timeline: "Aug 2022 · 18-page brand book delivered",
  timelineAr: "أغسطس 2022 · تسليم دليل براند 18 صفحة",
  kpis: [
    { value: "5",  label: "Brand principles",  labelAr: "مبادئ البراند",  context: "QUALITY · ADJUST · UNIQUE · DIFFERENT · ACCURATE", contextAr: "جودة · تكيّف · تميّز · اختلاف · دقة" },
    { value: "2",  label: "Type voices",       labelAr: "أصوات الخط",     context: "NEUE MACHINA + QUICKSAND",                         contextAr: "NEUE MACHINA + QUICKSAND"             },
    { value: "R",  label: "Built from one letter", labelAr: "مبني من حرف واحد", context: "ICON = INITIAL = SYMBOL",                   contextAr: "أيقونة = حرف أول = رمز"              },
  ],

  researchSummary:
    "Art-print brands cluster into two camps: mass-market (colorful, cheap-looking, generic) or fine-art gallery (minimal, cold, inaccessible). Reflection needed the third position: premium-accessible — aspirational without alienating, distinctive without being difficult.",
  researchSummaryAr:
    "براندات الفن والطباعة في معسكرين: شعبية (ملونة، رخيصة المظهر، عامة) أو معرض فنون راقية (بسيط، بارد، بعيد المنال). Reflection تحتاج الموضع الثالث: متميز ومتاح — طموح دون إبعاد، مميز دون صعوبة.",
  competitors: [
    { name: "Poster mass-market A",   x: 55, y: 20 },
    { name: "Poster mass-market B",   x: 65, y: 15 },
    { name: "Gallery originals C",    x: 20, y: 75 },
    { name: "Gallery originals D",    x: 15, y: 82 },
    { name: "Generic print-on-demand E", x: 45, y: 25 },
    { name: "Reflection",             x: 78, y: 78, isClient: true },
  ],
  visualVectors:   ["PREMIUM", "CONSIDERED", "AIRY", "STRUCTURED", "COLLECTABLE"],
  visualVectorsAr: ["متميز", "مدروس", "خفيف", "منظّم", "قابل للاقتناء"],

  tokens: [
    { token: "white",           value: "#FFFFFF", role: "Primary canvas · airy base",       roleAr: "قاعدة القماش الأبيضة"    },
    { token: "black",           value: "#0A0A0A", role: "Text / graphic accent · CMYK 0,0,0,100", roleAr: "نص / تمييز جرافيك" },
    { token: "spectrum-violet", value: "#9646BC", role: "Secondary · violet end",            roleAr: "ثانوي · نهاية البنفسجي" },
    { token: "spectrum-red",    value: "#E84040", role: "Secondary · red mid",               roleAr: "ثانوي · أحمر وسط"        },
    { token: "spectrum-teal",   value: "#009696", role: "Secondary · turquoise",             roleAr: "ثانوي · تركواز"          },
    { token: "Neue Machina",    value: "Ultra",   role: "Headlines · brand typeface",        roleAr: "عناوين · خط البراند"     },
    { token: "Quicksand",       value: "Regular", role: "Body / subheads",                   roleAr: "متن / عناوين فرعية"      },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "MOBILE",  cols: "4-col"  },
    { bp: "TABLET",  cols: "8-col"  },
    { bp: "DESKTOP", cols: "12-col" },
  ],

  results: [
    { value: "18p", label: "Brand book",       labelAr: "دليل البراند",     context: "OVERVIEW → LOGO → COLOR → TYPE → LAYOUT", contextAr: "نظرة عامة → لوجو → لون → خط → تخطيط" },
    { value: "3",   label: "Focal-area rules", labelAr: "قواعد المنطقة المحورية", context: "IMAGE · HEADLINE · ICON",          contextAr: "صورة · عنوان · أيقونة"               },
    { value: "V1.0",label: "Governed system",  labelAr: "نظام محكوم",       context: "MARGINS, LOCKUPS, FOCAL LOGIC",            contextAr: "هوامش، lockups، منطق محوري"          },
  ],

  retro: [
    { verdict: "KEEP",   note: "The constructed R — circle and triangle of equal weight stacked into a figure that reads as initial, icon, and reflection simultaneously.", noteAr: "الـ R المبنية — دائرة ومثلث بوزن متساوٍ يُكوّنان شكلاً يُقرأ كحرف أول وأيقونة وانعكاس في آن." },
    { verdict: "KEEP",   note: "Airy white system with black as accent: the calm that makes the work feel premium, without the coldness of all-white minimalism.",           noteAr: "نظام أبيض خفيف مع الأسود كتمييز: الهدوء الذي يجعل الشغل يبدو متميزاً دون برودة البسيط الأبيض كله." },
    { verdict: "CHANGE", note: "Focal-area doctrine — every layout resolves to Image, Headline, or Icon — keeps marketing collateral on-system forever.",                   noteAr: "عقيدة المنطقة المحورية — كل تخطيط يُحل إلى صورة أو عنوان أو أيقونة — تبقي المواد التسويقية on-system دائماً." },
  ],
};
