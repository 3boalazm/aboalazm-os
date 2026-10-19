/** NILE PHARMA — real engagement record (2020–2025). */
import type { CaseStudyRecord } from "./types";

export const NILE_PHARMA: CaseStudyRecord = {
  slug: "nile-pharma",
  name: "Nile Pharma Food",
  nameAr: "نايل فارما فود",
  discipline: "Systemic Identity",
  accent: {
    primary: "rgb(27 42 91 / 0.22)",
    secondary: "rgb(57 160 214 / 0.12)",
  },

  problem:
    "A pharma and food-supplements company operating with no visual identity at all — no logo system, no palette, no templates, no website. Every sales document, label, and post was improvised, and in a regulated sector, improvisation reads as risk.",
  problemAr:
    "شركة أدوية ومكملات غذائية تعمل بدون هوية بصرية على الإطلاق — لا نظام لوجو، لا لوحة ألوان، لا قوالب، لا موقع. كل وثيقة مبيعات وملصق وبوست كان مرتجلاً، وفي قطاع منظَّم، الارتجال يُقرأ كخطر.",
  teamScale: "Brand Lead (Mustafa) · Sales Director · Regulatory Affairs · Print Vendors",
  teamScaleAr: "مدير البراند (مصطفى) · مدير المبيعات · الشؤون التنظيمية · مطابع التغليف",
  timeline: "2020 → 2025 · identity from zero, then full rebrand",
  timelineAr: "2020 → 2025 · هوية من الصفر ثم إعادة براند كاملة",
  kpis: [
    { value: "0",  label: "Brand assets at start",   labelAr: "أصول البراند في البداية", context: "BUILT FROM ZERO",  contextAr: "بُني من الصفر"          },
    { value: "4",  label: "Departments to align",    labelAr: "أقسام تم توحيدها",        context: "CENTRAL LIAISON",  contextAr: "حلقة الوصل المركزية"   },
    { value: "1",  label: "Designer on the system",  labelAr: "مصمم على النظام",          context: "FULL OWNERSHIP",   contextAr: "ملكية كاملة"            },
  ],

  researchSummary:
    "Working positioning hypothesis: the brand needed to balance pharmaceutical credibility with the warmth and accessibility expected of food-supplement products. The chosen direction joined both needs in one visual system. The accompanying map is illustrative, not a named-competitor audit.",
  researchSummaryAr:
    "فرضية التموضع التي قادت العمل: احتاجت العلامة إلى الجمع بين المصداقية الصيدلانية والدفء والوضوح المتوقعين من منتجات المكملات الغذائية. وجاء الاتجاه المختار ليجمع الاحتياجين في نظام بصري واحد. خريطة التموضع توضيحية وليست تدقيقاً موثقاً لمنافسين بأسمائهم.",
  competitors: [
    { name: "Illustrative clinical A",  x: 30, y: 55 },
    { name: "Clinical B",  x: 22, y: 40 },
    { name: "Loud C",      x: 62, y: 18 },
    { name: "Loud D",      x: 70, y: 25 },
    { name: "Importer E",  x: 40, y: 30 },
    { name: "Nile Pharma", x: 82, y: 84, isClient: true },
  ],
  visualVectors:   ["TRUST-FIRST", "BILINGUAL", "SHELF-READY", "TEMPLATE-DRIVEN", "WARM CLINICAL"],
  visualVectorsAr: ["الثقة أولاً", "ثنائي اللغة", "جاهز للرف", "قائم على القوالب", "دفء سريري"],

  tokens: [
    { token: "nile-navy",      value: "#1B2A5B", role: "Approved Primary · Corporate Heritage & Trust",           roleAr: "اللون الأساسي المعتمد · وقار مؤسسي وثقة صيدلانية" },
    { token: "wave-blue",      value: "#39A0D6", role: "Approved Secondary · Product Packaging & Hydration",      roleAr: "لون ثانوي معتمد · تغليف المنتجات والنقاء" },
    { token: "life-green",     value: "#37A66B", role: "Approved Accent · Nutrition & Herbal Supplement Line",     roleAr: "لون التمييز المعتمد · المكملات الغذائية والحيوية" },
    { token: "pure-white",     value: "#FFFFFF", role: "Approved Canvas · Clean packaging readability",           roleAr: "أرضية معتمدة · مقروئية التغليف" },
    { token: "alt-cyan",       value: "#00C8D2 (Rejected)", role: "Rejected in testing: neon tone reduced clinical trust", roleAr: "خيار مرفوض في الاختبار: النيون قلل من موثوقية الدواء" },
    { token: "cairo-font",     value: "Bold",    role: "Approved Bilingual Display & Arabic Hierarchy",          roleAr: "خط العرض المعتمد للنصوص والعناوين العربية" },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "MOBILE",  cols: "4-col"  },
    { bp: "TABLET",  cols: "8-col"  },
    { bp: "DESKTOP", cols: "12-col" },
  ],

  results: [
    {
      value: "SYSTEM",
      label: "Brand system",
      labelAr: "نظام الهوية",
      context: "Identity and visual governance across the engagement.",
      contextAr: "الهوية والحوكمة البصرية خلال فترة العمل.",
    },
    {
      value: "PACK",
      label: "Product & campaign applications",
      labelAr: "تطبيقات المنتجات والحملات",
      context: "Packaging, product-line applications, and campaign governance.",
      contextAr: "التغليف وتطبيقات خطوط المنتجات وحوكمة الحملات.",
    },
    {
      value: "5y",
      label: "Engagement span",
      labelAr: "مدة العمل",
      context: "Five-year engagement across pharmacy retail channels (2020–2025).",
      contextAr: "فترة عمل امتدت خمس سنوات عبر قنوات بيع الصيدليات (2020–2025).",
    },
  ],

  narrativeAnswers: {
    problem:
      "A pharmaceutical and health-supplements manufacturer operating without brand governance or visual standards. Packaging was fragmented across outside printers, marketing materials were improvised, and products struggled for shelf presence in major pharmacy chains against imported brands.",
    problemAr:
      "شركة أدوية ومكملات غذائية كانت تعمل لسنوات دون حوكمة بصرية أو معايير تصميم. علب المنتجات كانت متباينة بين المطابع، والمواد التسويقية مرتجلة، مما أضعف حضورها على أرفف الصيدليات الكبرى أمام المنتجات المستوردة.",
    audienceContext:
      "Consumers purchasing everyday nutritional supplements (Proxeed Plus, Proxerex), community pharmacists dispensing healthcare products (e.g. El Ezaby Pharmacy), physicians, and national pharmaceutical distributors.",
    audienceContextAr:
      "المستهلكون الباحثون عن مكملات غذائية موثوقة (Proxeed, Proxerex)، صيادلة المجتمع (سلاسل مثل صيدليات العزبي)، الأطباء، وموزعو الأدوية في مختلف المحافظات.",
    guidingIdea:
      "Pharmaceutical Rigor + Food Supplement Vitality — anchoring the identity in corporate stability ('Nile Navy') combined with the active freshness of dietary health. Embodied by 'The Blue Box' packaging architecture and a bespoke geometric bilingual wordmark.",
    guidingIdeaAr:
      "الصرامة الصيدلانية + حيوية المكملات — ترسيخ الهوية في وقار مؤسسي ('كحلي النيل') ممزوجاً بحيوية العافية والتغذية. تجسد ذلك في معمارية تغليف 'العلبة الزرقاء' وشعار عربي/إنجليزي هندسي دقيق.",
    rejectedDirections:
      "1) Cliché green leaf & water droplet symbols: Rejected because the company produces regulated pharmaceutical-grade formulations, not raw herbal teas.\n2) High-vibrancy electric cyan (#00C8D2): Rejected in packaging press proofs because it compromised the clinical seriousness required on pharmacy shelves.",
    rejectedDirectionsAr:
      "1) كليشيهات ورقة الشجر وقطرة الماء: رُفضت لأن الشركة تنتج تركيبات دوائية مصرحة وليست أعشاباً شعبية، وتحتاج مصداقية علمية.\n2) الأزرق النيون الفاقع (#00C8D2): رُفض في تجارب الطباعة لكونه يقلل من وقار وموثوقية عبوة الدواء في الصيدلية.",
    roleAndTeam:
      "Official role: Media Director & Account Manager (Mustafa Aboalazm, 2020–2025). Functional scope included brand direction, identity redesign, packaging architecture, marketing campaign systems, and digital web presence. Collaborated closely with the Sales Director, Regulatory Pharmacist, and print production houses.",
    roleAndTeamAr:
      "المسمى الوظيفي الرسمي: مدير الميديا ومدير الحسابات (مصطفى أبوالعزم) من 2020 حتى 2025. شمل النطاق الوظيفي توجيه البراند، إعادة تصميم الهوية، معمارية التغليف، أنظمة الحملات التسويقية، والحضور الرقمي، بالتنسيق مع مدير المبيعات والصيادلة ومطابع التغليف.",
    whereUsed:
      "Distributed across pharmacy retail channels across Egypt, primary product carton boxes (Proxeed line), highway outdoor billboards, medical presentation flyers, official website, and bilingual Ramadan & seasonal campaigns.",
    whereUsedAr:
      "معروض على أرفف قنوات الصيدليات والبيع بالتجزئة في مصر، علب المنتجات الدوائية (خط بروكسيد)، لوحات الطرق السريعة الإعلانية، مطبوعات المؤتمرات الطبية، الموقع الرسمي، وحملات رمضان الترويجية.",
  },

  designProofItems: [
    {
      title: "Logo Geometric Construction Grid",
      titleAr: "شبكة بناء اللوجو الهندسية",
      description: "Bilingual wordmark engineered on a strict geometric modular grid ensuring identical optical balance in Arabic and English.",
      descriptionAr: "شعار لفظي ثنائي اللغة مبني على شبكة قياسية تضمن التكافؤ البصري والوزني بين العربية والإنجليزية.",
      image: "/images/work/nile-pharma/npf-logo-grid.png",
    },
    {
      title: "Consumer Packaging — 'The Blue Box'",
      titleAr: "التغليف الاستهلاكي — 'العلبة الزرقاء'",
      description: "Rigid pharmaceutical box architecture pairing deep navy authority with clear product differentiation for the pharmacy shelf.",
      descriptionAr: "معمارية علب صيدلانية متينة تجمع بين هيبة الكحلي وتمييز المنتجات بوضوح على أرفف الصيدليات.",
      image: "/images/work/nile-pharma/npf-business-card-box.jpg",
    },
    {
      title: "Product Line Packaging (Proxeed Plus & Proxerex)",
      titleAr: "تغليف خط منتجات المكملات (Proxeed Plus و Proxerex)",
      description: "Standardized carton packaging layout maintaining regulatory clarity, bilingual dosing instructions, and high shelf impact.",
      descriptionAr: "تخطيط معياري لعلب المنتجات يحافظ على وضوح البيانات الدوائية والجرعات باللغتين مع جاذبية العرض.",
      image: "/images/work/nile-pharma/npf-proxeed-products.png",
    },
    {
      title: "Outdoor Billboard & Campaign Advertising",
      titleAr: "حملات اللوحات الإعلانية بالطرق السريعة",
      description: "Large-scale highway advertising translating the brand voice ('We Care About You') with immediate high-speed legibility.",
      descriptionAr: "إعلانات الطرق السريعة واسعة النطاق ناقلة صوت البراند ('نهتم بك') بمقروئية فورية للمركبات المارة.",
      image: "/images/work/nile-pharma/npf-img-b.png",
    },
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
    { src: "/images/work/nile-pharma/npf-logo-motion.webp",      caption: "Logo motion study",         captionAr: "دراسة حركة اللوجو",        w: 1400, h: 700  },
  ],

  retro: [
    { verdict: "KEEP",   note: "Templates as deliverables — every department could publish on-brand without me.", noteAr: "القوالب كمخرجات — كل قسم يقدر ينشر on-brand من غيري." },
    { verdict: "KEEP",   note: "Stakeholder liaison role from day one; alignment was design work too.",            noteAr: "دور التنسيق مع أصحاب المصلحة من اليوم الأول؛ التوافق كان شغل تصميم هو الآخر." },
    { verdict: "CHANGE", note: "Brand guidelines should have shipped in year one, not at the rebrand.",           noteAr: "دليل الهوية كان لازم يتسلّم في السنة الأولى، مش عند إعادة البراند." },
  ],
};

/** @deprecated kept for import compatibility */
export const ART_REFLECTION = NILE_PHARMA;
