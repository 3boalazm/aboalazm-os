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
  timeline: "2023 · 2025 · Complete brand system, end to end",
  timelineAr: "2023 · 2025 · نظام براند كامل من الألف للياء",
  kpis: [
    { value: "0",    label: "Brand system before",    labelAr: "نظام براند قبل",      context: "STARTED FROM STRATEGY",    contextAr: "بدأنا من الاستراتيجية"     },
    { value: "2",    label: "Languages, one lockup",  labelAr: "لغتان في شعار واحد",  context: "AR / EN UNIFIED",          contextAr: "عربي / إنجليزي موحّد"       },
    { value: "4",    label: "Audiences to serve",     labelAr: "جماهير تخدمها",        context: "PATIENTS · FAMILIES · INSURERS · REFERRERS", contextAr: "مرضى · عائلات · تأمين · جهات إحالة" },
  ],

  researchSummary:
    "Working positioning hypothesis: healthcare identities can feel either clinical-corporate or consumer-promotional. GAD’s chosen direction was a trusted specialist voice — warmer than a hospital, more precise than a general clinic, and legible across Arabic and English. The accompanying map is illustrative, not a named-competitor audit.",
  researchSummaryAr:
    "فرضية التموضع التي قادت العمل: قد تبدو الهويات الصحية إما مؤسسية سريرية أو ترويجية استهلاكية. اختارت GAD صوت الأخصائي الموثوق — أدفأ من المستشفى، وأدق من العيادة العامة، ومقروءاً بالعربية والإنجليزية. خريطة التموضع توضيحية وليست تدقيقاً موثقاً لمنافسين بأسمائهم.",
  competitors: [
    { name: "Public-clinical A",  x: 22, y: 60 },
    { name: "Illustrative clinical B",  x: 15, y: 45 },
    { name: "Corporate-sterile C",x: 60, y: 70 },
    { name: "Corporate-sterile D",x: 70, y: 58 },
    { name: "Regional generic E", x: 38, y: 28 },
    { name: "GAD Institute",      x: 82, y: 88, isClient: true },
  ],
  visualVectors:   ["TRUST", "PRECISION", "WARMTH", "BILINGUAL", "HERITAGE"],
  visualVectorsAr: ["ثقة", "دقة", "دفء", "ثنائي اللغة", "عمق"],

  tokens: [
    { token: "deep-blue",    value: "#005895", role: "Approved Primary · Trust & Authority · Pantone 107-8 U",  roleAr: "اللون الأساسي المعتمد · ثقة ووقار طبي · بانتون 107-8 U" },
    { token: "crimson-red",  value: "#AB121C", role: "Approved Accent · Cardiac Vitality · Pantone 49-16 U",    roleAr: "لون التمييز المعتمد · حيوية القلب · بانتون 49-16 U" },
    { token: "cool-grey-8",  value: "#888B8D", role: "Approved Neutral · Supporting typography & balance",       roleAr: "محايد معتمد · نصوص داعمة وتوازن" },
    { token: "mist-white",   value: "#E8EDF2", role: "Approved Surface · Clinical clarity & backgrounds",        roleAr: "سطح معتمد · وضوح سريري وخلفيات" },
    { token: "alt-sky-blue", value: "#3A86FF (Rejected)", role: "Rejected during discovery: too generic / tech-like", roleAr: "خيار مرفوض في مرحلة البحث: يوحي بالبرمجيات لا الرعاية الطبية" },
    { token: "Trap",         value: "Bold",    role: "Approved Headline typeface · architectural structure",       roleAr: "خط العناوين اللاتيني المعتمد · بناء هيكلي" },
    { token: "Montserrat",   value: "Regular", role: "Approved Subhead & Body typeface · neutral reading",         roleAr: "خط النصوص الفرعية اللاتيني · قراءة محايدة" },
    { token: "Alexandria",   value: "SemiBold",role: "Approved Arabic title & body typeface · modern legibility", roleAr: "خط العناوين والنصوص العربية المعتمد · وضوح حديث" },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "MOBILE",  cols: "4-col"  },
    { bp: "TABLET",  cols: "8-col"  },
    { bp: "DESKTOP", cols: "12-col" },
  ],

  narrativeAnswers: {
    problem:
      "A specialized cardiac and pulmonary care institute operating under generic, cold hospital branding — with no mark reflecting its dual life-saving specialization, no visual governance across patient communications, and an urgent need to compete with internationally branded regional health groups.",
    problemAr:
      "معهد متخصص في رعاية القلب والرئة كان يعمل تحت هوية مستشفى تقليدية وباردة — دون رمز يعكس تخصصه المزدوج المنقذ للحياة، ودون حوكمة بصرية على مواد التواصل مع المرضى، مع حاجة ملحة لمنافسة مجموعات صحية إقليمية ذات هوية دولية.",
    audienceContext:
      "High-anxiety cardiac and pulmonary patients, their families seeking trusted reassurance, patients and families in the Eastern Province and regional private health insurers. In healthcare, visual inconsistency translates directly to perceived clinical risk.",
    audienceContextAr:
      "مرضى القلب والرئة في حالات دقيقة، عائلاتهم الباحثة عن الاطمئنان، المرضى وعائلاتهم في المنطقة الشرقية وهيئات التأمين الصحي الخاص إقليمياً. في الرعاية الصحية، غياب الاتساق البصري يُترجم فوراً إلى انعدام أمان سريري.",
    guidingIdea:
      "The Trusted Specialist ('Closer to Every Heart') — fusing anatomical heart and lung geometry into a continuous circular seal. The gesture combines circulatory vitality and pulmonary breath in one precise, human mark.",
    guidingIdeaAr:
      "الأخصائي الموثوق ('أقرب لكل قلب') — دمج التشريح الدقيق للقلب والرئة في ختم دائري واحد متصل، يجمع نبض الدورة الدموية وحركة التنفس في إيماءة إنسانية دقيقة.",
    rejectedDirections:
      "1) Generic medical cross and stethoscope tropes: Rejected because they commoditize the brand and fail to establish distinct trademark equity.\n2) High-saturation neon cyan (#3A86FF): Rejected during discovery for feeling like consumer software rather than clinical authority.",
    rejectedDirectionsAr:
      "١) الصليب السريري والسماعة الطبية: رُفضا لكونهما مكررين ولا يبنيان ملكية فكرية.\n٢) الأزرق النيون الفاقع (#3A86FF): رُفض في مرحلة البحث لأنه يوحي بالبرمجيات الاستهلاكية لا الوقار والمسؤولية الطبية.",
    roleAndTeam:
      "Sole Brand Identity Designer & Creative Lead (Mustafa Aboalazm). Designed the full system: brand strategy, bilingual symbol, typography system, Pantone palette, brand book (V2.0), and architectural signage specs. Collaborated with the Medical Director (anatomical accuracy) and Marketing Manager.",
    roleAndTeamAr:
      "مصمم الهوية البصرية والقائد الإبداعي (مصطفى أبوالعزم) منفرداً في التصميم: الاستراتيجية، الرمز ثنائي اللغة، نظام الخطوط، ألوان البانتون، دليل الهوية (V2.0)، ومواصفات اللافتات المعمارية. بالتعاون مع المدير الطبي (دقة التشريح) ومدير التسويق.",
    whereUsed:
      "Main hospital facade signage, 3D reception wall seals, internal patient wayfinding, staff uniforms, bilingual diagnosis folders, prescription stationery, digital presence, and healthcare summit exhibition stands (Vision 2030).",
    whereUsedAr:
      "لافتات الواجهة الرئيسية، ختم جدار الاستقبال ثلاثي الأبعاد، لافتات الإرشاد الداخلي، زي الأطباء والتمريض، ملفات المرضى، الروشتات، المنصات الرقمية، وأجنحة المعارض الطبية (رؤية 2030).",
  },

  designProofItems: [
    {
      title: "Logo Anatomy & Geometric Construction",
      titleAr: "تشريح الشعار وبناؤه الهندسي",
      description: "Mathematical alignment of heart and lung chambers inside a continuous golden-ratio curve.",
      descriptionAr: "المحاذاة الرياضية لحجرات القلب والرئة داخل منحنى دائري بنسب هندسية منضبطة.",
      image: "/images/work/gad/gad-logo-anatomy.png",
    },
    {
      title: "Scale & Favicon Legibility Test",
      titleAr: "اختبار الحجم والمقروئية الدقيقة",
      description: "Tested from 16px digital favicon to multi-meter exterior building signage without stroke collapse.",
      descriptionAr: "تم اختباره من مقاس 16px الرقمي وصولاً إلى لافتات المبنى الخارجية الضخمة دون انهدام للخطوط.",
      image: "/images/work/gad/gad-logo-symbol.png",
    },
    {
      title: "Bilingual Typography Pairing",
      titleAr: "مواءمة الخطين العربي واللاتيني",
      description: "Trap (Bold Display) paired with Alexandria (Arabic Title & Body) for structural optical parity.",
      descriptionAr: "خط Trap العريض مقترناً مع خط Alexandria العربي لتحقيق توازن بصري متكافئ في كل لافتة.",
      image: "/images/work/gad/gad-typography.png",
    },
    {
      title: "Environmental & Architectural Signage",
      titleAr: "تطبيق لافتات المبنى والبيئة",
      description: "Physical exterior facade signage fabricated with exact Pantone 107-8 U Deep Blue specs.",
      descriptionAr: "لافتات الواجهة الخارجية المصنعة طبقاً لمواصفات بانتون 107-8 U الأزرق المعتمد.",
      image: "/images/work/gad/gad-signage-environmental.jpg",
    },
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
