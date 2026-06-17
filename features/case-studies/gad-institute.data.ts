/**
 * GAD HEART & LUNGS INSTITUTE — Complete Brand System (V2.0, 2025).
 * مستشفى د. غنام الدوسري للقلب والرئتين — Al Khobar, KSA.
 * Designed by Mustafa Aboalazm. Content sourced from the V2.0 Brand
 * Identity & Guidelines document: a full system spanning Strategy,
 * Identity, and Governance — not a logo, an operating system for a brand.
 * Accent uses the institute's own Deep Blue + Crimson Red as atmosphere.
 */
import type { CaseStudyRecord } from "./types";

export const GAD_INSTITUTE: CaseStudyRecord = {
  slug: "gad-institute",
  name: "GAD Heart & Lungs Institute",
  discipline: "Complete Brand System — Healthcare",
  accent: {
    primary: "rgb(0 88 149 / 0.22)", // Deep Blue  #005895
    secondary: "rgb(171 18 28 / 0.12)", // Crimson Red #AB121C
  },

  /* Panel 01 — Context & Audit */
  problem:
    "A pioneering private cardiopulmonary institute entering Saudi Arabia and the Gulf — competing for international medical tourists against established hospitals — with no unified brand to carry clinical authority and human warmth at the same time. World-class expertise existed; a system to communicate it did not.",
  teamScale: "1 designer · bilingual EN/AR system · branded-house structure",
  timeline: "2025 · V2.0 full brand identity + guidelines delivered",
  kpis: [
    { value: "0", label: "Brand system before", context: "STARTED FROM STRATEGY" },
    { value: "2", label: "Languages, one lockup", context: "ENGLISH + العربية" },
    { value: "4", label: "Audiences to serve", context: "PATIENTS · TOURISTS · INSURERS · FAMILIES" },
  ],

  /* Panel 02 — Research & Logic */
  researchSummary:
    "Healthcare branding in the Gulf splits two ways: public-clinical (cold, generic, low-cost signalling) or corporate-sterile (polished but impersonal). The open position — a Caregiver archetype reading as both clinical trust and genuine human warmth, anchored to Vision 2030 and medical tourism — was unoccupied. Deep Blue for trust, Crimson Red for vitality: a color gap nobody owned.",
  competitors: [
    { name: "Public-clinical A", x: 26, y: 30 },
    { name: "Public-clinical B", x: 34, y: 22 },
    { name: "Corporate-sterile C", x: 58, y: 40 },
    { name: "Corporate-sterile D", x: 64, y: 48 },
    { name: "Regional generic E", x: 42, y: 28 },
    { name: "GAD Institute", x: 86, y: 84, isClient: true },
  ],
  visualVectors: [
    "CAREGIVER",
    "HEART+LUNG MARK",
    "TRUST-BLUE",
    "VITALITY-RED",
    "BILINGUAL",
    "BRANDED-HOUSE",
  ],

  /* Panel 03 — Execution & Governance */
  tokens: [
    { token: "deep-blue", value: "#005895", role: "Trust / primary · P 107-8U" },
    { token: "crimson-red", value: "#AB121C", role: "Vitality / accent · P 49-16U" },
    { token: "cool-grey-8", value: "#878787", role: "Neutral / dark grey" },
    { token: "heading-en", value: "Trap", role: "Bold headlines / titles" },
    { token: "body-en", value: "Montserrat", role: "Body / subheads" },
    { token: "arabic", value: "Alexandria", role: "Arabic titles + body" },
  ],
  componentStates: ["FULL COLOR", "ON DARK", "ON LIGHT", "SYMBOL ONLY"],
  breakpoints: [
    { bp: "CLEAR SPACE", cols: "0.5x" },
    { bp: "LOGO RATIO", cols: "1/10 shorter side" },
    { bp: "EDGE MARGIN", cols: "0.5x height" },
  ],

  /* Panel 04 — Performance & Post Mortem */
  results: [
    { value: "1", label: "System, end to end", context: "STRATEGY → IDENTITY → GUIDELINES" },
    { value: "12+", label: "Branded applications", context: "SIGNAGE · UNIFORM · STATIONERY · STAND" },
    { value: "V2.0", label: "Governed brand book", context: "PANTONE-LOCKED, NOT GUESSED" },
  ],
  retro: [
    {
      verdict: "KEEP",
      note: "The heart-and-lung mark — two symbols fused into one circular form, vitality and breath in a single recognizable glyph that survives down to a favicon.",
    },
    {
      verdict: "KEEP",
      note: "Caregiver archetype as doctrine: 'closer to every heart' drives messaging, color, and imagery — warmth and clinical authority held together, not traded off.",
    },
    {
      verdict: "KEEP",
      note: "Branded-house structure linking GAD Institute to GAD International — one equity, many offerings, governed from day one.",
    },
    {
      verdict: "CHANGE",
      note: "Tighten Arabic/English vertical lockup balance at small sizes before the next signage print run.",
    },
  ],
};
