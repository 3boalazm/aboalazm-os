/** GAD HEART & LUNGS INSTITUTE — Complete Brand System · Healthcare */
import type { CaseStudyRecord } from "./types";

export const GAD_INSTITUTE: CaseStudyRecord = {
  slug: "gad-institute",
  name: "GAD Heart & Lungs Institute",
  nameAr: "معهد GAD للقلب والرئة",
  discipline: "Systemic Identity",
  accent: {
    primary: "rgb(0 88 149 / 0.22)",
    secondary: "rgb(171 18 28 / 0.12)",
  },

  problem:
    "A specialist cardiac and pulmonary care institute operating under a generic hospital visual identity — no mark that signaled its dual specialization, no system governing patient-facing communications, and an ambition to expand regionally while competing against internationally branded healthcare groups.",
  problemAr:
    "معهد متخصص في رعاية القلب والرئة يعمل تحت هوية بصرية مستشفى عامة — لا شعار يُشير لتخصصه المزدوج، لا نظام يحكم التواصل مع المرضى، وطموح للتوسع إقليمياً بينما ينافس مجموعات رعاية صحية ذات هوية دولية.",
  teamScale: "Creative lead (Mustafa) · medical director · marketing manager",
  teamScaleAr: "القائد الإبداعي (مصطفى) · المدير الطبي · مدير التسويق",
  timeline: "2023 · Complete brand system, end to end",
  timelineAr: "2023 · نظام براند كامل من الألف للياء",
  kpis: [
    { value: "0",    label: "Brand system before",    labelAr: "نظام براند قبل",      context: "STARTED FROM STRATEGY",    contextAr: "بدأنا من الاستراتيجية"     },
    { value: "2",    label: "Languages, one lockup",  labelAr: "لغتان في شعار واحد",  context: "AR / EN UNIFIED",          contextAr: "عربي / إنجليزي موحّد"       },
    { value: "4",    label: "Audiences to serve",     labelAr: "جماهير تخدمها",        context: "PATIENTS · TOURISTS · INSURERS · FAMILIES", contextAr: "مرضى · سياح · تأمين · عائلات" },
  ],

  researchSummary:
    "Healthcare identity in Egypt clustered into two poles: clinical-corporate (cold, bureaucratic) or consumer-pharma (loud, promotional). GAD needed a third voice — the trusted specialist: warmer than a hospital, more precise than a clinic, internationally legible without losing Egyptian rootedness.",
  researchSummaryAr:
    "الهوية الصحية في مصر تتجمع في قطبين: شركي-سريري (بارد، بيروقراطي) أو صيدلاني-استهلاكي (صاخب، ترويجي). GAD تحتاج صوتاً ثالثاً — الأخصائي الموثوق: أدفأ من المستشفى، وأدق من العيادة، ومقروء دولياً دون أن يفقد عروبته.",
  competitors: [
    { name: "Public-clinical A",  x: 22, y: 60 },
    { name: "Public-clinical B",  x: 15, y: 45 },
    { name: "Corporate-sterile C",x: 60, y: 70 },
    { name: "Corporate-sterile D",x: 70, y: 58 },
    { name: "Regional generic E", x: 38, y: 28 },
    { name: "GAD Institute",      x: 82, y: 88, isClient: true },
  ],
  visualVectors:   ["TRUST", "PRECISION", "WARMTH", "BILINGUAL", "HERITAGE"],
  visualVectorsAr: ["ثقة", "دقة", "دفء", "ثنائي اللغة", "عمق"],

  tokens: [
    { token: "deep-blue",    value: "#005895", role: "Trust / primary · P 107-8U",  roleAr: "ثقة / أساسي · P 107-8U"   },
    { token: "crimson-red",  value: "#AB121C", role: "Vitality / accent · P 49-16U", roleAr: "حيوية / تمييز · P 49-16U" },
    { token: "cool-grey-8",  value: "#888B8D", role: "Neutral / dark grey",          roleAr: "محايد / رمادي داكن"        },
    { token: "Trap",         value: "Bold",    role: "Bold headlines / titles",       roleAr: "عناوين عريضة"              },
    { token: "Montserrat",   value: "Regular", role: "Body / subheads",               roleAr: "متن / عناوين فرعية"        },
    { token: "Alexandria",   value: "Regular", role: "Arabic titles + body",          roleAr: "عناوين وجسم عربي"          },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "MOBILE",  cols: "4-col"  },
    { bp: "TABLET",  cols: "8-col"  },
    { bp: "DESKTOP", cols: "12-col" },
  ],

  results: [
    { value: "V2.0", label: "System, end to end",      labelAr: "نظام من الألف للياء",    context: "STRATEGY → IDENTITY → GUIDELINES", contextAr: "استراتيجية → هوية → دليل"       },
    { value: "6+",   label: "Branded applications",    labelAr: "تطبيقات مبرندة",         context: "SIGNAGE · UNIFORM · STATIONERY · STAND", contextAr: "لافتات · يونيفورم · قرطاسية · ستاند" },
    { value: "1",    label: "Governed brand book",     labelAr: "دليل براند محكوم",        context: "PANTONE-LOCKED, NOT GUESSED",      contextAr: "Pantone مقفول لا مرتجل"         },
  ],

  retro: [
    { verdict: "KEEP",   note: "The heart-and-lung mark — two symbols fused into one circular form, vitality and breath in one gesture.",                         noteAr: "شعار القلب والرئة — رمزان في شكل دائري واحد، حيوية وتنفس في إيماءة واحدة."                      },
    { verdict: "KEEP",   note: "Caregiver archetype as doctrine: 'closer to every heart' drives messaging, color, and environmental design consistently.",         noteAr: "نموذج مقدم الرعاية كعقيدة: 'أقرب لكل قلب' يقود الرسائل واللون والتصميم البيئي باتساق."       },
    { verdict: "CHANGE", note: "Tighten Arabic/English vertical lockup balance at small sizes before the next signage run.",                                       noteAr: "تحسين توازن الـ lockup العمودي عربي/إنجليزي في الأحجام الصغيرة قبل جولة اللافتات القادمة." },
    { verdict: "KEEP",   note: "Branded-house structure linking GAD Institute to GAD International — one equity, many expressions.",                               noteAr: "هيكل Branded House يربط GAD Institute بـ GAD International — حقوق واحدة، تعبيرات متعددة." },
  ],
};
