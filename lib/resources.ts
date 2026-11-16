/**
 * RESOURCES — single source of truth for the Aboalazm OS knowledge base.
 * The 8 frameworks + their spine stage, ordering, and gated PDF path.
 * Consumed by /resources. All strings bilingual: [en, ar].
 */
import type { Bi } from "@/lib/offers";

export interface Resource {
  id: string; // R01 … R08
  n: string; // "01"
  slug: string;
  stage: Bi; // spine-stage label
  title: Bi;
  subtitle: Bi;
  desc: Bi;
  feeds: string; // what it feeds, e.g. "R05 · R01"
  file: string; // gated download — lives in /public/resources
  recommended?: boolean;
}

/** The 7-stage operating spine, rendered as the rail at the top of the page. */
export const SPINE: readonly { stage: Bi; ref: string }[] = [
  { stage: ["Audit", "تدقيق"], ref: "R02" },
  { stage: ["Research", "بحث"], ref: "R03" },
  { stage: ["Positioning", "تموضع"], ref: "R05" },
  { stage: ["Architecture", "بنية"], ref: "R04" },
  { stage: ["Identity", "هوية"], ref: "R01" },
  { stage: ["Design System", "نظام التصميم"], ref: "R06" },
  { stage: ["Governance", "حوكمة"], ref: "R07" },
];

export const RESOURCES: readonly Resource[] = [
  {
    id: "R01",
    n: "01",
    slug: "brand-os-canvas",
    stage: ["Master Hub", "المركز"],
    title: ["Brand OS Canvas", "لوحة نظام العلامة"],
    subtitle: ["One-page strategic blueprint", "مخطط استراتيجي في صفحة واحدة"],
    desc: [
      "The living master canvas that aligns business, market, brand, identity, and systems into a single source of truth.",
      "اللوحة الرئيسية الحيّة التي توائم بين العمل والسوق والعلامة والهوية والأنظمة في مصدر واحد للحقيقة.",
    ],
    feeds: "→ Everything",
    file: "/resources/01-brand-os-canvas.pdf",
    recommended: true,
  },
  {
    id: "R02",
    n: "02",
    slug: "audit-framework",
    stage: ["01 · Audit", "01 · تدقيق"],
    title: ["Audit Framework", "إطار التدقيق"],
    subtitle: ["Diagnose before you design", "شخّص قبل أن تصمّم"],
    desc: [
      "Scores strategic, identity, digital, and operational debt into a complete Brand Health Report.",
      "يقيس الدين الاستراتيجي والبصري والرقمي والتشغيلي، ويجمعها في تقرير متكامل لصحة العلامة.",
    ],
    feeds: "→ R01 · R05",
    file: "/resources/02-audit-framework.pdf",
  },
  {
    id: "R03",
    n: "03",
    slug: "discovery-framework",
    stage: ["02 · Research", "02 · بحث"],
    title: ["Discovery Framework", "إطار الاكتشاف"],
    subtitle: ["Ask better questions", "اطرح أسئلة أفضل"],
    desc: [
      "A structured 90-minute workshop system across four tracks, producing a Discovery Report.",
      "نظام ورش عمل منظّم مدته 90 دقيقة عبر أربعة مسارات، ينتج تقرير اكتشاف.",
    ],
    feeds: "→ R01 · R05",
    file: "/resources/03-discovery-framework.pdf",
  },
  {
    id: "R05",
    n: "05",
    slug: "positioning-canvas",
    stage: ["03 · Positioning", "03 · تموضع"],
    title: ["Positioning Canvas", "لوحة التموضع"],
    subtitle: ["Clarify what makes you different", "وضّح ما يميّزك"],
    desc: [
      "One sentence, one archetype, one voice, and a messaging matrix — so every word pulls one way.",
      "جملة واحدة، ونموذج أصلي واحد، وصوت واحد، ومصفوفة رسائل، لتسير كل كلمة في الاتجاه نفسه.",
    ],
    feeds: "→ R01 (Brand layer)",
    file: "/resources/05-positioning-canvas.pdf",
  },
  {
    id: "R04",
    n: "04",
    slug: "identity-architecture-map",
    stage: ["04 · Architecture", "04 · بنية"],
    title: ["Identity Architecture Map", "خريطة بنية الهوية"],
    subtitle: ["Design the system behind the brand", "صمّم النظام الذي يقف خلف العلامة"],
    desc: [
      "Maps brand hierarchies and relationships — Branded House, House of Brands, Hybrid — before visuals.",
      "ترسم تراتبية العلامات وعلاقاتها (العلامة الموحّدة Branded House، وبيت العلامات House of Brands، والهجين) قبل الشكل البصري.",
    ],
    feeds: "→ R01 · R05 · R07",
    file: "/resources/04-identity-architecture-map.pdf",
  },
  {
    id: "R06",
    n: "06",
    slug: "design-system-starter-kit",
    stage: ["06 · Design System", "06 · نظام التصميم"],
    title: ["Design System Starter Kit", "عدة بداية نظام التصميم"],
    subtitle: ["Build consistency faster", "ابنِ الاتساق بسرعة أكبر"],
    desc: [
      "A token-driven, bilingual-aware system — the contract between design and code. The system that runs this site.",
      "نظام قائم على متغيّرات التصميم وواعٍ بثنائية اللغة: العقد بين التصميم والكود. وهو النظام الذي يشغّل هذا الموقع.",
    ],
    feeds: "→ R01 · R07",
    file: "/resources/06-design-system-starter-kit.pdf",
  },
  {
    id: "R07",
    n: "07",
    slug: "brand-governance-toolkit",
    stage: ["07 · Governance", "07 · حوكمة"],
    title: ["Brand Governance Toolkit", "عدة حوكمة العلامة"],
    subtitle: ["Protect the brand over time", "احمِ العلامة عبر الزمن"],
    desc: [
      "Who decides, who approves, who owns — the matrix, workflow, and standards that keep a system intact.",
      "من يقرر، ومن يوافق، ومن يملك: المصفوفة وسير العمل والمعايير التي تُبقي النظام سليمًا.",
    ],
    feeds: "→ All",
    file: "/resources/07-brand-governance-toolkit.pdf",
  },
  {
    id: "R08",
    n: "08",
    slug: "ai-brand-operations-kit",
    stage: ["Cross-cutting", "شامل"],
    title: ["AI Brand Operations Kit", "عدة عمليات العلامة بالذكاء الاصطناعي"],
    subtitle: ["Integrating AI into branding", "دمج الذكاء الاصطناعي في بناء العلامات"],
    desc: [
      "Five prompt libraries plus human-in-the-loop rules across every stage of the system.",
      "خمس مكتبات موجّهات، مع قواعد لإبقاء الإنسان في دائرة القرار عبر كل مرحلة.",
    ],
    feeds: "→ R03 · R05 · R02 · R01 · R07",
    file: "/resources/08-ai-brand-operations-kit.pdf",
  },
];
