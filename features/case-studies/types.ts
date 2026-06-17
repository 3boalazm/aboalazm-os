/**
 * SCROLLYTELLING — TYPE CONTRACTS
 * One CaseStudyRecord drives all four panels. The shape mirrors the
 * content engine doctrine: Problem → Research → Strategy → System →
 * Execution → Impact. Field names align with sanity/schemas/caseStudy.
 */
import type { ProjectAccent } from "@/lib/tokens";

export interface KPI {
  value: string;
  label: string;
  /** Mono proof-line under the number */
  context?: string;
}

export interface CompetitorVector {
  name: string;
  /** 0–100 placement on the two strategy axes */
  x: number; // Generic ←→ Distinct
  y: number; // Artifact ←→ System
  isClient?: boolean;
}

export interface TokenSpec {
  token: string;   // e.g. "--space-md"
  value: string;   // e.g. "24px"
  role: string;    // e.g. "Card padding"
}

export interface CaseStudyRecord {
  slug: string;
  name: string;
  discipline: string;
  accent: ProjectAccent;

  /* Panel 01 — Context & Audit */
  problem: string;
  teamScale: string;
  timeline: string;
  kpis: readonly KPI[];

  /* Panel 02 — Research & Logic */
  researchSummary: string;
  competitors: readonly CompetitorVector[];
  visualVectors: readonly string[]; // brand direction keywords

  /* Panel 03 — Execution & Governance */
  tokens: readonly TokenSpec[];
  componentStates: readonly string[];
  breakpoints: readonly { bp: string; cols: string }[];

  /* Panel 04 — Performance & Post Mortem */
  results: readonly KPI[];
  retro: readonly { verdict: "KEEP" | "CHANGE" | "DROP"; note: string }[];
}

/** Sidebar track definition — order is the narrative order. */
export const PANELS = [
  { id: "context", index: "01", label: "CONTEXT & AUDIT" },
  { id: "research", index: "02", label: "RESEARCH & LOGIC" },
  { id: "execution", index: "03", label: "EXECUTION & GOVERNANCE" },
  { id: "performance", index: "04", label: "PERFORMANCE & POST MORTEM" },
] as const;

export type PanelId = (typeof PANELS)[number]["id"];
