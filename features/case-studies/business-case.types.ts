import type { ClientOrigin } from "./client-origin";

export interface Bilingual {
  en: string;
  ar: string;
}

export type CaseViewMode = "technical" | "business";

export interface BusinessSnapshotItem {
  label: Bilingual;
  value: Bilingual;
}

export interface BusinessRoleBenefit {
  role: Bilingual;
  benefit: Bilingual;
}

export interface BusinessWorkflowStep {
  step: string;
  actor: Bilingual;
  title: Bilingual;
  detail: Bilingual;
}

export interface BusinessFeatureItem {
  tag: Bilingual;
  title: Bilingual;
  body: Bilingual;
}

export interface BusinessCaseData {
  slug: string;
  /** Optional curated client-country detail displayed with the case-study headline. */
  clientOrigin?: ClientOrigin;
  /** Sector / business domain badge shown in the header */
  sector: Bilingual;
  /** Direct, practical headline explaining what the project does business-wise */
  headline: Bilingual;
  /** 2–3 plain-spoken sentences: what the project is, who uses it, and what job it performs */
  summary: Bilingual;
  /** 4-column executive snapshot: Sector, Target Users, Core Value, Operating Model */
  snapshot: readonly [
    BusinessSnapshotItem,
    BusinessSnapshotItem,
    BusinessSnapshotItem,
    BusinessSnapshotItem,
  ];
  /** Practical before/after operational shift & who benefits */
  problemAndShift: {
    beforeTitle: Bilingual;
    beforePoints: readonly Bilingual[];
    afterTitle: Bilingual;
    afterPoints: readonly Bilingual[];
    stakeholders: readonly BusinessRoleBenefit[];
  };
  /** Step-by-step operational / customer workflow (4–5 concrete steps) */
  workflowIntro: Bilingual;
  workflow: readonly BusinessWorkflowStep[];
  /** Concrete features & commercial/practical advantages */
  featuresIntro: Bilingual;
  features: readonly BusinessFeatureItem[];
  /** Honest operational status & commercial scope summary */
  operationalNote: {
    statusLabel: Bilingual;
    summary: Bilingual;
    highlights: readonly Bilingual[];
  };
}
