/**
 * SCROLLYTELLING — TYPE CONTRACTS
 * One CaseStudyRecord drives all four panels. The shape mirrors the
 * content engine doctrine: Problem → Research → Strategy → System →
 * Execution → Impact. Field names align with collections/CaseStudies.ts.
 */
import type { ProjectAccent } from "@/lib/tokens";

export interface KPI {
  value: string;
  label: string;
  /** Arabic label */
  labelAr?: string;
  /** Mono proof-line under the number */
  context?: string;
  /** Arabic context */
  contextAr?: string;
}

export interface CompetitorVector {
  name: string;
  /** 0–100 placement on the two strategy axes */
  x: number; // Generic ←→ Distinct
  y: number; // Artifact ←→ System
  isClient?: boolean;
}

export interface TokenSpec {
  token: string;
  value: string;
  role: string;
  roleAr?: string;
}

export interface GalleryImage {
  src: string;
  caption?: string;
  captionAr?: string;
  w: number;
  h: number;
}

export interface CaseStudyOverview {
  problem: string;
  problemAr?: string;
  audienceContext: string;
  audienceContextAr?: string;
  guidingIdea: string;
  guidingIdeaAr?: string;
  rejectedDirections: string;
  rejectedDirectionsAr?: string;
  roleAndTeam: string;
  roleAndTeamAr?: string;
  whereUsed: string;
  whereUsedAr?: string;
}

export interface DesignProofItem {
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  image: string;
  aspect?: string;
}

export interface CaseStudyRecord {
  slug: string;
  name: string;
  nameAr?: string;
  discipline: string;
  accent: ProjectAccent;

  /* Panel 01 — Context & Audit */
  problem: string;
  problemAr?: string;
  teamScale: string;
  teamScaleAr?: string;
  timeline: string;
  timelineAr?: string;
  kpis: readonly KPI[];

  /* Structured 6 narrative answers */
  narrativeAnswers?: CaseStudyOverview;

  /* Panel 02 — Research & Logic */
  researchSummary: string;
  researchSummaryAr?: string;
  competitors: readonly CompetitorVector[];
  visualVectors: readonly string[];
  visualVectorsAr?: readonly string[];

  /* Panel 03 — Execution & Governance */
  tokens: readonly TokenSpec[];
  componentStates: readonly string[];
  breakpoints: readonly { bp: string; cols: string }[];

  /* Design proof items — original, legible visual assets */
  designProofItems?: readonly DesignProofItem[];

  /** Optional project gallery — rendered in Execution panel */
  images?: readonly GalleryImage[];

  /* Panel 04 — Performance & Post Mortem */
  results: readonly KPI[];
  retro: readonly { verdict: "KEEP" | "CHANGE" | "DROP"; note: string; noteAr?: string }[];
}

/** Sidebar track definition — order is the narrative order. */
export const PANELS = [
  { id: "context", index: "01", label: "CONTEXT & AUDIT" },
  { id: "research", index: "02", label: "RESEARCH & LOGIC" },
  { id: "execution", index: "03", label: "EXECUTION & GOVERNANCE" },
  { id: "performance", index: "04", label: "PERFORMANCE & POST MORTEM" },
] as const;

/**
 * Optional fifth station: a case study that ships its brand book inline gets
 * it between Execution and Performance. Indexes are renumbered when present.
 */
export const BRAND_BOOK_PANEL = { id: "brand-book", index: "04", label: "BRAND BOOK" } as const;

export type PanelId = (typeof PANELS)[number]["id"] | typeof BRAND_BOOK_PANEL.id;

/** Panels for the sidebar, in reading order. */
export function panelsFor(hasBrandBook: boolean) {
  if (!hasBrandBook) return PANELS.map((p) => ({ ...p }));
  return [
    ...PANELS.slice(0, 3).map((p) => ({ ...p })),
    { ...BRAND_BOOK_PANEL },
    { ...PANELS[3], index: "05" },
  ];
}
