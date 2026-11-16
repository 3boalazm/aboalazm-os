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
    title: ["AI Workflows", "سير العمل بالذكاء الاصطناعي"],
    blurb: [
      "How AI can accelerate branding without replacing strategic thinking.",
      "كيف يسرّع الذكاء الاصطناعي بناء العلامات دون أن يحلّ محل التفكير الاستراتيجي.",
    ],
    items: [
      ["Brand Research Automation", "أتمتة بحث العلامة"],
      ["Discovery Session Assistants", "مساعدو جلسات الاكتشاف"],
      ["Competitive Analysis Systems", "أنظمة تحليل المنافسين"],
      ["Strategy Generation Pipelines", "مسارات توليد الاستراتيجية"],
      ["AI-Assisted Documentation", "توثيق بمساعدة الذكاء الاصطناعي"],
      ["Knowledge Management Systems", "أنظمة إدارة المعرفة"],
    ],
    question: [
      "How can AI reduce operational effort while increasing strategic depth?",
      "كيف يقلّل الذكاء الاصطناعي الجهد التشغيلي ويزيد العمق الاستراتيجي في آنٍ واحد؟",
    ],
  },
  {
    n: "02",
    title: ["Brand OS Experiments", "تجارب نظام تشغيل العلامة"],
    blurb: [
      "New ways to structure, govern, and scale modern brands.",
      "طرق جديدة لهيكلة العلامات الحديثة وحوكمتها وتوسيعها.",
    ],
    items: [
      ["Identity Debt Measurement", "قياس دين الهوية"],
      ["Brand Health Scoring", "تقييم صحة العلامة"],
      ["Governance Frameworks", "أطر الحوكمة"],
      ["Brand Architecture Models", "نماذج بنية العلامة"],
      ["System Maturity Assessments", "تقييم نضج النظام"],
      ["Organizational Alignment Models", "نماذج المواءمة المؤسسية"],
    ],
    question: [
      "What makes a brand scalable beyond visual identity?",
      "ما الذي يجعل العلامة قابلة للتوسع بما يتجاوز الهوية البصرية؟",
    ],
  },
  {
    n: "03",
    title: ["Design Systems", "أنظمة التصميم"],
    blurb: [
      "Applying design-system thinking beyond products, into brand ecosystems.",
      "تطبيق تفكير أنظمة التصميم خارج المنتجات، داخل منظومات العلامة.",
    ],
    items: [
      ["Brand Tokens", "متغيّرات العلامة"],
      ["Visual Governance", "الحوكمة البصرية"],
      ["Component-Based Branding", "بناء العلامة بالمكوّنات"],
      ["Multi-Platform Consistency", "اتساق عبر المنصات"],
      ["Bilingual Design Systems", "أنظمة تصميم ثنائية اللغة"],
      ["AR / EN Identity Sync", "مزامنة الهوية بين العربية والإنجليزية"],
    ],
    question: ["Can branding operate like software?", "هل يمكن للعلامة أن تعمل كما تعمل البرمجيات؟"],
  },
  {
    n: "04",
    title: ["Prompt Systems", "أنظمة الموجّهات"],
    blurb: [
      "Structured prompt architectures, not isolated prompts.",
      "بنى موجّهات منظّمة، لا موجّهات منفردة.",
    ],
    items: [
      ["Research Prompt Libraries", "مكتبات موجّهات البحث"],
      ["Strategy Prompt Libraries", "مكتبات موجّهات الاستراتيجية"],
      ["Audit Prompt Systems", "أنظمة موجّهات التدقيق"],
      ["Documentation Prompts", "موجّهات التوثيق"],
      ["Content Operations Prompts", "موجّهات عمليات المحتوى"],
      ["Agent-Based Workflows", "سير عمل قائم على الوكلاء"],
    ],
    question: [
      "How do prompts evolve into operational systems?",
      "كيف تتطور الموجّهات إلى أنظمة تشغيلية؟",
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
      ["Brand Audit Engine", "محرّك تدقيق العلامة"],
      ["Discovery Workshop Assistant", "مساعد ورشة الاكتشاف"],
      ["Positioning Generator", "مولّد التموضع"],
      ["Brand OS Canvas Builder", "منشئ لوحة نظام العلامة"],
      ["Identity Architecture Mapper", "مخطِّط بنية الهوية"],
      ["Governance Documentation Assistant", "مساعد توثيق الحوكمة"],
    ],
    question: [
      "Which repetitive tasks should become systems?",
      "أي المهام المتكررة ينبغي أن تتحول إلى أنظمة؟",
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
      "نظام تشغيل متكامل لبناء العلامات التجارية الحديثة وإدارتها وحوكمتها.",
    ],
    areas: [
      ["Framework Design", "تصميم الأطر"],
      ["Documentation", "التوثيق"],
      ["Resource Library", "مكتبة الموارد"],
      ["Governance Models", "نماذج الحوكمة"],
    ],
    status: ["In Development", "قيد التطوير"],
    kind: "dev",
  },
  {
    name: ["Identity Debt Framework", "إطار دين الهوية"],
    blurb: [
      "A model for identifying and measuring the cost of brand inconsistency.",
      "نموذج لرصد تكلفة عدم اتساق العلامة وقياسها.",
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
    name: ["Bilingual Brand Systems", "أنظمة العلامة ثنائية اللغة"],
    blurb: [
      "How brands maintain consistency across Arabic and English environments.",
      "كيف تحافظ العلامات على اتساقها عبر البيئتين العربية والإنجليزية.",
    ],
    areas: [
      ["Typography Pairing", "مزاوجة الخطوط"],
      ["RTL / LTR Systems", "أنظمة RTL / LTR"],
      ["Messaging Consistency", "اتساق الرسائل"],
      ["Cultural Adaptation", "التكيّف الثقافي"],
    ],
    status: ["Active", "نشط"],
    kind: "active",
  },
  {
    name: ["AI Brand Operations", "عمليات العلامة بالذكاء الاصطناعي"],
    blurb: [
      "Operational workflows that combine human expertise with AI capabilities.",
      "سير عمل تشغيلي يمزج الخبرة البشرية بقدرات الذكاء الاصطناعي.",
    ],
    areas: [
      ["Research Automation", "أتمتة البحث"],
      ["Strategic Synthesis", "التوليف الاستراتيجي"],
      ["Documentation Systems", "أنظمة التوثيق"],
      ["Workflow Design", "تصميم سير العمل"],
    ],
    status: ["Active", "نشط"],
    kind: "active",
  },
];

export const NOTES: readonly Bi[] = [
  [
    "Brands often suffer from operational inconsistency before visual inconsistency.",
    "غالبًا ما تعاني العلامات من عدم الاتساق التشغيلي قبل أن تعاني من عدم الاتساق البصري.",
  ],
  ["Most design systems fail because governance is missing.", "تفشل أغلب أنظمة التصميم لغياب الحوكمة."],
  [
    "AI increases speed but amplifies strategic mistakes when inputs are weak.",
    "يرفع الذكاء الاصطناعي السرعة، لكنه يضخّم الأخطاء الاستراتيجية حين تكون المدخلات ضعيفة.",
  ],
  [
    "Organizations scale better when identity is treated as infrastructure, not decoration.",
    "تتوسع المؤسسات بصورة أفضل حين تُعامَل الهوية كبنية تحتية لا كزينة.",
  ],
];

export const METHOD: readonly Bi[] = [
  ["Question", "سؤال"],
  ["Research", "بحث"],
  ["Prototype", "نموذج أولي"],
  ["Test", "اختبار"],
  ["Measure", "قياس"],
  ["Refine", "تحسين"],
  ["Document", "توثيق"],
  ["Framework", "إطار عمل"],
];

/** Experiments that have already graduated into the public Resources library. */
export const OPEN_FRAMEWORKS: readonly Bi[] = [
  ["Brand OS Canvas", "لوحة نظام العلامة"],
  ["Discovery Framework", "إطار الاكتشاف"],
  ["Positioning Canvas", "لوحة التموضع"],
  ["Design System Starter Kit", "عدة بداية نظام التصميم"],
  ["Governance Toolkit", "عدة الحوكمة"],
  ["AI Brand Operations Kit", "عدة عمليات العلامة بالذكاء الاصطناعي"],
];
