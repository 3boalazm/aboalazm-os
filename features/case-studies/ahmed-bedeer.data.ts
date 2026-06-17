/**
 * AHMED BEDEER — Healthcare IT Personal Brand Identity (2025).
 * Designed by Mustafa Aboalazm / Art Visual Aboalazm.
 * Content sourced from the V1.0 Brand Guidelines PDF.
 * Accent uses Ahmed's own Steel Blue + Bright Teal as page atmosphere.
 */
import type { CaseStudyRecord } from "./types";

export const AHMED_BEDEER: CaseStudyRecord = {
  slug: "ahmed-bedeer",
  name: "Ahmed Bedeer",
  discipline: "Personal Brand Identity — Healthcare IT",
  accent: {
    primary: "rgb(17 138 178 / 0.22)",   // Steel Blue  #118AB2
    secondary: "rgb(6 214 160 / 0.12)",  // Bright Teal #06D6A0
  },

  problem:
    "A Healthcare Digital Transformation leader with deep credentials — CPHIMS, HL7, FHIR, HIMSS, JCI, CBAHI — but no personal brand to carry that authority into the KSA and MENA markets. The expertise was real; the identity that should represent it didn't exist.",
  teamScale: "1 designer · 1 subject (personal brand)",
  timeline: "October 2025 · V1.0 guidelines delivered",
  kpis: [
    { value: "0",  label: "Brand assets before", context: "STARTED FROM ZERO" },
    { value: "4",  label: "Standards to signal",  context: "HL7 · FHIR · CPHIMS · HIMSS" },
    { value: "2",  label: "Markets targeted",      context: "KSA + WIDER MENA" },
  ],

  researchSummary:
    "Healthcare-IT personal brands split into two camps: clinical-sterile (cold, corporate, forgettable) or tech-generic (gradients and buzzwords, no authority). The open position — a calm, geometric, thought-leadership identity that reads as both clinical trust and digital precision — was unoccupied.",
  competitors: [
    { name: "Clinical-corporate A", x: 28, y: 48 },
    { name: "Clinical-corporate B", x: 35, y: 30 },
    { name: "Tech-generic C",       x: 60, y: 22 },
    { name: "Tech-generic D",       x: 68, y: 30 },
    { name: "Consultant E",         x: 44, y: 40 },
    { name: "Ahmed Bedeer",         x: 84, y: 82, isClient: true },
  ],
  visualVectors: ["GEOMETRIC", "MONOGRAM", "TRUST-BLUE", "TEAL-INNOVATION", "THOUGHT-LEADERSHIP"],

  tokens: [
    { token: "monogram",       value: "a + b",        role: "Quotation-mark form" },
    { token: "dark-gunmetal",  value: "#1C1C28",       role: "Anchor / authority" },
    { token: "steel-blue",     value: "#118AB2",       role: "Trust / technical" },
    { token: "bright-teal",    value: "#06D6A0",       role: "Innovation accent"  },
    { token: "heading",        value: "Lubalin Graph", role: "Geometric precision" },
    { token: "body",           value: "Uncut Sans",    role: "Clarity / reading"  },
  ],
  componentStates: ["FULL COLOR", "ON MEDIA", "ON SURFACE", "MONO"],
  breakpoints: [
    { bp: "CLEAR SPACE", cols: "1x minimum" },
    { bp: "H-GRID",      cols: "1x"         },
    { bp: "V-GRID",      cols: "1.5x"       },
  ],

  results: [
    { value: "1",   label: "Coherent system shipped", context: "LOGO → COLOR → TYPE → APPS" },
    { value: "V1.0",label: "Brand guidelines PDF",    context: "GOVERNED, NOT GUESSED"       },
    { value: "6",   label: "Palette tokens defined",  context: "PRIMARY + EXTENDED + SECONDARY" },
  ],
  retro: [
    { verdict: "KEEP",   note: "The 'ab' quotation-mark monogram — initials that signal dialogue and thought leadership in one geometric form." },
    { verdict: "KEEP",   note: "Blue for trust, teal for transformation — never decoration, always doctrine." },
    { verdict: "CHANGE", note: "Lock 'Healthcare' spelling in the lockup before any print run." },
  ],
};
