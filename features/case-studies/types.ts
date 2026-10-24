/**
 * SCROLLYTELLING — TYPE CONTRACTS
 * One CaseStudyRecord drives all four panels. The shape mirrors the
 * content engine doctrine: Problem → Research → Strategy → System →
 * Execution → Impact. Field names align with collections/CaseStudies.ts.
 */
import type { ProjectAccent } from "@/lib/tokens";
import type { ClientOrigin } from "./client-origin";

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
  /** Curated client-country detail; optional because it is not part of the CMS schema. */
  clientOrigin?: ClientOrigin;

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

/**
 * Sidebar track — the reading order of a case study:
 * the work first (overview, applications), then the thinking and the system.
 * Station numbers are assigned by `panelsFor`, so a case study without
 * applications imagery simply has one fewer station.
 */
export const PANEL_IDS = ["overview", "challenge", "idea", "applications", "system", "outcome"] as const;

export type PanelId = (typeof PANEL_IDS)[number];

export function panelsFor(opts: { applications: boolean }): { id: PanelId; index: string }[] {
  return PANEL_IDS.filter((id) => id !== "applications" || opts.applications).map((id, i) => ({
    id,
    index: String(i + 1).padStart(2, "0"),
  }));
}
