/**
 * LABS — the R&D layer behind Aboalazm OS. Research areas, active projects,
 * lab notes, and the experiment methodology. All strings bilingual: [en, ar].
 */
import type { Bi } from "@/lib/offers";

export interface ResearchArea {
  n: string;
  title: Bi;
  blurb: Bi;
  items: readonly Bi[];
  question: Bi;
}

export const RESEARCH_AREAS: readonly ResearchArea[] = [
  {
    n: "01",
    title: ["AI Workflows", "تدفقات الذكاء الاصطناعي"],
    blurb: [
      "How AI can accelerate branding without replacing strategic thinking.",
      "كيف يسرّع الذكاء الاصطناعي البراندينج دون أن يحلّ محل التفكير الاستراتيجي.",
    ],
    items: [
      ["Brand Research Automation", "أتمتة بحث البراند"],
      ["Discovery Session Assistants", "مساعدو جلسات الاكتشاف"],
      ["Competitive Analysis Systems", "أنظمة تحليل المنافسين"],
      ["Strategy Generation Pipelines", "خطوط توليد الاستراتيجية"],
      ["AI-Assisted Documentation", "توثيق بمعاونة الذكاء الاصطناعي"],
      ["Knowledge Management Systems", "أنظمة إدارة المعرفة"],
    ],
    question: [
      "How can AI reduce operational effort while increasing strategic depth?",
      "كيف يقلّل الذكاء الاصطناعي الجهد التشغيلي ويزيد العمق الاستراتيجي في آن؟",
    ],
  },
  {
    n: "02",
    title: ["Brand OS Experiments", "تجارب نظام البراند"],
    blurb: [
      "New ways to structure, govern, and scale modern brands.",
      "طرق جديدة لهيكلة وحوكمة وتوسيع البراندات الحديثة.",
    ],
    items: [
      ["Identity Debt Measurement", "قياس ديون الهوية"],
      ["Brand Health Scoring", "تقييم صحة البراند"],
      ["Governance Frameworks", "أطر الحوكمة"],
      ["Brand Architecture Models", "نماذج معمارية البراند"],
      ["System Maturity Assessments", "تقييم نضج النظام"],
      ["Organizational Alignment Models", "نماذج المواءمة المؤسسية"],
    ],
    question: [
      "What makes a brand scalable beyond visual identity?",
      "ما الذي يجعل البراند قابلًا للتوسّع أبعد من الهوية البصرية؟",
    ],
  },
  {
    n: "03",
    title: ["Design Systems", "أنظمة التصميم"],
    blurb: [
      "Applying design-system thinking beyond products, into brand ecosystems.",
      "تطبيق تفكير أنظمة التصميم أبعد من المنتجات، داخل منظومات البراند.",
    ],
    items: [
      ["Brand Tokens", "توكنز البراند"],
      ["Visual Governance", "الحوكمة البصرية"],
      ["Component-Based Branding", "براندينج قائم على المكوّنات"],
      ["Multi-Platform Consistency", "اتساق متعدد المنصات"],
      ["Bilingual Design Systems", "أنظمة تصميم ثنائية اللغة"],
      ["AR / EN Identity Sync", "مزامنة الهوية عربي / إنجليزي"],
    ],
    question: ["Can branding operate like software?", "هل يمكن أن يعمل البراندينج كالبرمجيات؟"],
  },
  {
    n: "04",
    title: ["Prompt Systems", "أنظمة البرومبت"],
    blurb: [
      "Structured prompt architectures, not isolated prompts.",
      "معماريات برومبت منظّمة، لا برومبتات منعزلة.",
    ],
    items: [
      ["Research Prompt Libraries", "مكتبات برومبت البحث"],
      ["Strategy Prompt Libraries", "مكتبات برومبت الاستراتيجية"],
      ["Audit Prompt Systems", "أنظمة برومبت التشخيص"],
      ["Documentation Prompts", "برومبتات التوثيق"],
      ["Content Operations Prompts", "برومبتات عمليات المحتوى"],
      ["Agent-Based Workflows", "تدفقات قائمة على الوكلاء"],
    ],
    question: [
      "How do prompts evolve into operational systems?",
      "كيف تتطوّر البرومبتات إلى أنظمة تشغيلية؟",
    ],
  },
  {
    n: "05",
    title: ["Internal Tools", "أدوات داخلية"],
    blurb: [
      "Tools that improve clarity, consistency, and execution.",
      "أدوات ترفع الوضوح والاتساق وجودة التنفيذ.",
    ],
    items: [
      ["Brand Audit Engine", "محرّك تشخيص البراند"],
      ["Discovery Workshop Assistant", "مساعد ورشة الاكتشاف"],
      ["Positioning Generator", "مولّد التموضع"],
      ["Brand OS Canvas Builder", "باني كانفاس البراند"],
      ["Identity Architecture Mapper", "راسم معمارية الهوية"],
      ["Governance Documentation Assistant", "مساعد توثيق الحوكمة"],
    ],
    question: [
      "Which repetitive tasks should become systems?",
      "أي المهام المتكررة يجب أن تتحوّل إلى أنظمة؟",
    ],
  },
];

export type Status = "dev" | "active" | "experimental";

export interface LabProject {
  name: Bi;
  blurb: Bi;
  areas: readonly Bi[];
  status: Bi;
  kind: Status;
}

export const PROJECTS: readonly LabProject[] = [
  {
    name: ["Aboalazm OS", "Aboalazm OS"],
    blurb: [
      "A complete operating system for building, managing, and governing modern brands.",
      "نظام تشغيل متكامل لبناء وإدارة وحوكمة البراندات الحديثة.",
    ],
    areas: [
      ["Framework Design", "تصميم الأطر"],
      ["Documentation", "التوثيق"],
      ["Resource Library", "مكتبة المصادر"],
      ["Governance Models", "نماذج الحوكمة"],
    ],
    status: ["In Development", "قيد التطوير"],
    kind: "dev",
  },
  {
    name: ["Identity Debt Framework", "إطار ديون الهوية"],
    blurb: [
      "A model for identifying and measuring the cost of brand inconsistency.",
      "نموذج لرصد وقياس تكلفة عدم اتساق البراند.",
    ],
    areas: [
      ["Detection", "الرصد"],
      ["Scoring", "التقييم"],
      ["Prioritization", "ترتيب الأولويات"],
      ["Remediation", "المعالجة"],
    ],
    status: ["Experimental", "تجريبي"],
    kind: "experimental",
  },
  {
    name: ["Bilingual Brand Systems", "أنظمة البراند ثنائية اللغة"],
    blurb: [
      "How brands maintain consistency across Arabic and English environments.",
      "كيف تحافظ البراندات على الاتساق عبر البيئتين العربية والإنجليزية.",
    ],
    areas: [
      ["Typography Pairing", "إقران الخطوط"],
      ["RTL / LTR Systems", "أنظمة RTL / LTR"],
      ["Messaging Consistency", "اتساق الرسائل"],
      ["Cultural Adaptation", "التكيّف الثقافي"],
    ],
    status: ["Active", "نشط"],
    kind: "active",
  },
  {
    name: ["AI Brand Operations", "عمليات البراند بالذكاء الاصطناعي"],
    blurb: [
      "Operational workflows that combine human expertise with AI capabilities.",
      "تدفقات تشغيلية تمزج الخبرة البشرية بقدرات الذكاء الاصطناعي.",
    ],
    areas: [
      ["Research Automation", "أتمتة البحث"],
      ["Strategic Synthesis", "التركيب الاستراتيجي"],
      ["Documentation Systems", "أنظمة التوثيق"],
      ["Workflow Design", "تصميم التدفقات"],
    ],
    status: ["Active", "نشط"],
    kind: "active",
  },
];

export const NOTES: readonly Bi[] = [
  [
    "Brands often suffer from operational inconsistency before visual inconsistency.",
    "غالبًا ما تعاني البراندات من عدم الاتساق التشغيلي قبل البصري.",
  ],
  ["Most design systems fail because governance is missing.", "أغلب أنظمة التصميم تفشل لغياب الحوكمة."],
  [
    "AI increases speed but amplifies strategic mistakes when inputs are weak.",
    "الذكاء الاصطناعي يزيد السرعة لكنه يضخّم الأخطاء الاستراتيجية عند ضعف المدخلات.",
  ],
  [
    "Organizations scale better when identity is treated as infrastructure, not decoration.",
    "تتوسّع المؤسسات أفضل حين تُعامَل الهوية كبنية تحتية لا كزينة.",
  ],
];

export const METHOD: readonly Bi[] = [
  ["Question", "سؤال"],
  ["Research", "بحث"],
  ["Prototype", "نموذج أولي"],
  ["Test", "اختبار"],
  ["Measure", "قياس"],
  ["Refine", "تنقيح"],
  ["Document", "توثيق"],
  ["Framework", "إطار"],
];

/** Experiments that have already graduated into the public Resources library. */
export const OPEN_FRAMEWORKS: readonly Bi[] = [
  ["Brand OS Canvas", "كانفاس البراند"],
  ["Discovery Framework", "إطار الاكتشاف"],
  ["Positioning Canvas", "كانفاس التموضع"],
  ["Design System Starter Kit", "عدة نظام التصميم"],
  ["Governance Toolkit", "عدة الحوكمة"],
  ["AI Brand Operations Kit", "عدة عمليات الذكاء الاصطناعي"],
];
