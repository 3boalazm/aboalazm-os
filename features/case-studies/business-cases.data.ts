import type { Project } from "@/features/work/types";
import { BUSINESS_DESIGN_CASES } from "./business-design.data";
import { BUSINESS_DEVELOPMENT_A_CASES } from "./business-development-a.data";
import { BUSINESS_DEVELOPMENT_B_CASES } from "./business-development-b.data";
import type { BusinessCaseData } from "./business-case.types";
import type { CaseStudyRecord } from "./types";

const ALL_BUSINESS_CASES: readonly BusinessCaseData[] = [
  ...BUSINESS_DESIGN_CASES,
  ...BUSINESS_DEVELOPMENT_A_CASES,
  ...BUSINESS_DEVELOPMENT_B_CASES,
];

export const BUSINESS_CASES: Readonly<Record<string, BusinessCaseData>> =
  Object.fromEntries(ALL_BUSINESS_CASES.map((entry) => [entry.slug, entry]));

/**
 * Returns the authored BusinessCaseData for any built-in project slug, with a
 * structured fallback for future CMS-authored projects so the Business tab
 * never renders empty or throws.
 */
export function getBusinessCase(
  slug: string,
  project?: Project,
  record?: CaseStudyRecord | null,
): BusinessCaseData {
  const existing = BUSINESS_CASES[slug];
  if (existing) return existing;

  const isDev = project?.category === "development";
  const nameEn = project?.name ?? record?.name ?? slug;
  const nameAr = project?.nameAr ?? record?.nameAr ?? nameEn;
  const outcomeEn = project?.outcome ?? record?.problem ?? `${nameEn} project delivery.`;
  const outcomeAr = project?.outcomeAr ?? record?.problemAr ?? outcomeEn;
  const stackSummary = project?.stack.length ? project.stack.join(" · ") : record?.discipline ?? "System";

  return {
    slug,
    sector: {
      en: isDev ? "Digital Product & Engineering" : "Brand Identity & Visual System",
      ar: isDev ? "منتج رقمي وهندسة برمجية" : "هوية بصرية ونظام تصميمي",
    },
    headline: {
      en: outcomeEn,
      ar: outcomeAr,
    },
    summary: {
      en: record?.problem ?? `${nameEn} (${outcomeEn}) built around ${stackSummary}.`,
      ar: record?.problemAr ?? `${nameAr} — ${outcomeAr}.`,
    },
    snapshot: [
      {
        label: { en: "Discipline", ar: "التخصص" },
        value: {
          en: project?.discipline ?? record?.discipline ?? "System Architecture",
          ar: isDev ? "تطوير وهندسة منتجات رقمية" : "تصميم وبناء أنظمة هوية",
        },
      },
      {
        label: { en: "Core Stack / Scope", ar: "النطاق والأدوات" },
        value: { en: stackSummary, ar: stackSummary },
      },
      {
        label: { en: "Year", ar: "السنة" },
        value: { en: project?.year ?? record?.timeline ?? "—", ar: project?.year ?? record?.timelineAr ?? "—" },
      },
      {
        label: { en: "Primary Outcome", ar: "المخرج الأساسي" },
        value: { en: outcomeEn, ar: outcomeAr },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Challenge addressed",
        ar: "التحدي العملي",
      },
      beforePoints: [
        {
          en: record?.problem ?? `Establishing a clear, dependable system for ${nameEn}.`,
          ar: record?.problemAr ?? `بناء نظام واضح ومتماسك يلبي احتياجات ${nameAr} عملياً.`,
        },
      ],
      afterTitle: {
        en: "Delivered solution",
        ar: "الحل المنفّذ",
      },
      afterPoints: [
        {
          en: outcomeEn,
          ar: outcomeAr,
        },
      ],
      stakeholders: [
        {
          role: { en: "End Users & Customers", ar: "المستخدمون والعملاء" },
          benefit: {
            en: "Clearer experience and consistent execution across touchpoints.",
            ar: "تجربة أوضح واتساق عملي عبر مختلف نقاط التفاعل.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How the project operates from setup to delivery:",
      ar: "كيف يعمل المشروع من التأسيس وحتى الاستخدام الفعلي:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Foundation", ar: "التأسيس" },
        title: { en: "Scope & system rules", ar: "تحديد النطاق وقواعد النظام" },
        detail: { en: outcomeEn, ar: outcomeAr },
      },
      {
        step: "02",
        actor: { en: "Execution", ar: "التنفيذ" },
        title: { en: stackSummary, ar: stackSummary },
        detail: {
          en: "Implemented with reusable components and documented structure.",
          ar: "تنفيذ منظم بمكونات واضحة وقابلة للتوسع.",
        },
      },
    ],
    featuresIntro: {
      en: "Key capabilities delivered:",
      ar: "أبرز المميزات المسلمة:",
    },
    features: (project?.stack ?? ["System", "Bilingual", "Production"]).map((item) => ({
      tag: { en: "Capability", ar: "ميزة" },
      title: { en: item, ar: item },
      body: { en: outcomeEn, ar: outcomeAr },
    })),
    operationalNote: {
      statusLabel: {
        en: project?.status === "in-progress" ? "In Progress" : "Delivered Project",
        ar: project?.status === "in-progress" ? "قيد التنفيذ" : "مشروع منجز",
      },
      summary: { en: outcomeEn, ar: outcomeAr },
      highlights: [
        { en: stackSummary, ar: stackSummary },
      ],
    },
  };
}
