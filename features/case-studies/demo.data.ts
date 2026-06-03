/** DEMO RECORD — replace with Sanity query when the studio is live. */
import type { CaseStudyRecord } from "./types";

export const ART_REFLECTION: CaseStudyRecord = {
  slug: "art-reflection",
  name: "Art Reflection",
  discipline: "Systemic Identity",
  accent: {
    primary: "rgb(96 165 250 / 0.20)",
    secondary: "rgb(45 212 191 / 0.10)",
  },

  problem:
    "A growing studio whose brand lived in five inconsistent decks. Every new surface — site, proposals, social — was redesigned from memory, and the drift was costing trust in enterprise conversations.",
  teamScale: "1 founder · 3 designers · 2 engineers",
  timeline: "38 days · playbook phases 1–7",
  kpis: [
    { value: "5", label: "Conflicting brand sources", context: "AT AUDIT" },
    { value: "0", label: "Documented tokens", context: "AT AUDIT" },
    { value: "12d", label: "Avg. asset turnaround", context: "AT AUDIT" },
  ],

  researchSummary:
    "Eight competitors mapped across two axes: visual distinctiveness and system maturity. The upper-right quadrant — distinct AND systematized — was empty. That gap became the strategy.",
  competitors: [
    { name: "Studio A", x: 22, y: 30 },
    { name: "Studio B", x: 38, y: 18 },
    { name: "Agency C", x: 55, y: 35 },
    { name: "Agency D", x: 30, y: 62 },
    { name: "Studio E", x: 68, y: 28 },
    { name: "Art Reflection", x: 84, y: 86, isClient: true },
  ],
  visualVectors: ["EDITORIAL", "MONOCHROME+1", "GRID-FIRST", "BILINGUAL", "QUIET"],

  tokens: [
    { token: "--space-md", value: "24px", role: "Card padding" },
    { token: "--radius-card", value: "12px", role: "Surfaces" },
    { token: "--ease-physics", value: "0.16,1,0.3,1", role: "All motion" },
    { token: "--ink-primary", value: "#101014", role: "Text base" },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "SM 640", cols: "4-col" },
    { bp: "MD 768", cols: "8-col" },
    { bp: "LG 1024", cols: "12-col" },
  ],

  results: [
    { value: "+45%", label: "System Speed", context: "ASSET TURNAROUND" },
    { value: "0%", label: "Design Drift", context: "POST-LAUNCH QUARTER" },
    { value: "3X", label: "Handoff Efficiency", context: "DESIGN → ENG" },
  ],
  retro: [
    { verdict: "KEEP", note: "Strategy sign-off before any concept — zero late-stage debates." },
    { verdict: "CHANGE", note: "Token naming workshop should happen in week 1, not week 3." },
    { verdict: "DROP", note: "Three moodboard directions; two created sharper decisions." },
  ],
};
