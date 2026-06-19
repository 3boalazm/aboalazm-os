/**
 * REFLECTION — Brand Identity System (V1.0, Aug 2022).
 * A premium custom-art-print studio: framed paintings produced to order
 * with after-sales adjustment. Designed by Mustafa Aboalazm.
 * Content sourced from the Reflection Brand Guidelines V1.0 — a Creator
 * brand built on five principles, a constructed-letter mark, and an
 * airy white system accented by a violet→red→turquoise→navy spectrum.
 */
import type { CaseStudyRecord } from "./types";

export const REFLECTION: CaseStudyRecord = {
  slug: "reflection",
  name: "Reflection",
  discipline: "Brand Identity — Art & Print",
  accent: {
    primary: "rgb(150 70 140 / 0.16)", // violet end of the spectrum
    secondary: "rgb(0 150 160 / 0.12)", // turquoise end
  },

  /* Panel 01 — Context & Audit */
  problem:
    "A made-to-order art-print studio selling something deeply personal — a piece for the wall you live with — needed a brand that read premium and precise without turning cold. The product is customizable and adjustable after delivery; the identity had to carry that promise of care and accuracy, not just sell a poster.",
  teamScale: "1 designer · full identity + guidelines V1.0",
  timeline: "Aug 2022 · 18-page brand book delivered",
  kpis: [
    { value: "5", label: "Brand principles", context: "QUALITY · ADJUST · UNIQUE · DIFFERENT · ACCURATE" },
    { value: "2", label: "Type voices", context: "NEUE MACHINA + QUICKSAND" },
    { value: "R", label: "Built from one letter", context: "CIRCLE + TRIANGLE = THE MARK" },
  ],

  /* Panel 02 — Research & Logic */
  researchSummary:
    "Wall-art retail skews two ways: mass-market poster shops (cheap, generic, disposable) or gallery-priced originals (exclusive, intimidating, no customization). The open lane was a Creator brand — premium and exact, but warm and adjustable: art made specifically for you, refined after it arrives. Airy white space signals quality; a constructed mark signals precision.",
  competitors: [
    { name: "Poster mass-market A", x: 22, y: 24 },
    { name: "Poster mass-market B", x: 30, y: 18 },
    { name: "Gallery originals C", x: 64, y: 38 },
    { name: "Gallery originals D", x: 70, y: 30 },
    { name: "Generic print-on-demand E", x: 40, y: 26 },
    { name: "Reflection", x: 84, y: 82, isClient: true },
  ],
  visualVectors: [
    "CREATOR",
    "PRECISION",
    "AIRY-WHITE",
    "CONSTRUCTED-R",
    "ADJUSTABLE",
    "PREMIUM-CALM",
  ],

  /* Panel 03 — Execution & Governance */
  tokens: [
    { token: "white", value: "#FFFFFF", role: "Primary canvas · airy base" },
    { token: "black", value: "#000000", role: "Text / graphic accent · CMYK 0,0,0,100" },
    { token: "spectrum-violet", value: "#9B4C8C", role: "Secondary · violet end" },
    { token: "spectrum-red", value: "#D6336C", role: "Secondary · red mid" },
    { token: "spectrum-teal", value: "#1FA8A4", role: "Secondary · turquoise" },
    { token: "heading", value: "Neue Machina", role: "Headlines · brand typeface" },
    { token: "body", value: "Quicksand", role: "Body / subheads" },
  ],
  componentStates: ["ON WHITE", "ON BLACK", "ON GRADIENT", "ICON ONLY"],
  breakpoints: [
    { bp: "ICON", cols: "Constructed R — circle + triangle" },
    { bp: "VERTICAL", cols: "Icon stacked over wordmark" },
    { bp: "HORIZONTAL", cols: "Icon + wordmark · 0.3x / 1x / 0.3x" },
  ],

  /* Panel 04 — Performance & Post Mortem */
  results: [
    { value: "18", label: "Page brand book", context: "OVERVIEW → LOGO → COLOR → TYPE → LAYOUT" },
    { value: "3", label: "Focal-area rules", context: "IMAGE · HEADLINE · ICON" },
    { value: "V1.0", label: "Governed system", context: "MARGINS, LOCKUPS, FOCAL LOGIC" },
  ],
  retro: [
    {
      verdict: "KEEP",
      note: "The constructed R — circle and triangle of equal weight stacked into a figure that reads as both a letter and a person looking at art. Geometric, ownable, scales to a clothing tag.",
    },
    {
      verdict: "KEEP",
      note: "Airy white system with black as accent: the calm that makes the work feel premium, with a violet→red→turquoise→navy spectrum held in reserve for vitality.",
    },
    {
      verdict: "KEEP",
      note: "Focal-area doctrine — every layout resolves to Image, Headline, or Icon — keeps marketing output consistent without a designer in the loop each time.",
    },
    {
      verdict: "CHANGE",
      note: "Two display-adjacent typefaces plus custom wordmark editing is expressive but heavy to govern; tighten the hierarchy rules at V2.",
    },
  ],
};
