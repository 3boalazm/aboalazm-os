/** NILE PHARMA — real engagement record (2020–2025). */
import type { CaseStudyRecord } from "./types";

export const NILE_PHARMA: CaseStudyRecord = {
  slug: "nile-pharma",
  name: "Nile Pharma Food",
  discipline: "Systemic Identity",
  accent: {
    primary: "rgb(0 200 210 / 0.18)",
    secondary: "rgb(64 156 255 / 0.10)",
  },

  problem:
    "A pharma and food-supplements company operating with no visual identity at all — no logo system, no palette, no templates, no website. Every sales document, label, and post was improvised, and in a regulated sector, improvisation reads as risk.",
  teamScale: "1 designer (me) · sales, accounting & warehouse stakeholders",
  timeline: "2020 → 2025 · identity from zero, then full rebrand",
  kpis: [
    { value: "0", label: "Brand assets at start", context: "BUILT FROM ZERO" },
    { value: "4", label: "Departments to align", context: "CENTRAL LIAISON" },
    { value: "1", label: "Designer on the system", context: "FULL OWNERSHIP" },
  ],

  researchSummary:
    "Pharma-food competitors clustered in two camps: clinical-and-cold or bazaar-loud. Neither earned consumer trust and shelf presence at once. The open position: pharmaceutical credibility carried by food-grade warmth — one system serving both worlds.",
  competitors: [
    { name: "Clinical A", x: 30, y: 55 },
    { name: "Clinical B", x: 22, y: 40 },
    { name: "Loud C", x: 62, y: 18 },
    { name: "Loud D", x: 70, y: 25 },
    { name: "Importer E", x: 40, y: 30 },
    { name: "Nile Pharma", x: 82, y: 84, isClient: true },
  ],
  visualVectors: ["TRUST-FIRST", "BILINGUAL", "SHELF-READY", "TEMPLATE-DRIVEN", "WARM CLINICAL"],

  tokens: [
    { token: "logo-system", value: "3 lockups", role: "AR/EN + mark" },
    { token: "palette", value: "2+3", role: "Primary + support" },
    { token: "type-scale", value: "2 scripts", role: "One hierarchy" },
    { token: "templates", value: "12+", role: "Social · print · docs" },
  ],
  componentStates: ["DEFAULT", "HOVER", "FOCUS", "DISABLED"],
  breakpoints: [
    { bp: "MOBILE", cols: "4-col" },
    { bp: "TABLET", cols: "8-col" },
    { bp: "DESKTOP", cols: "12-col" },
  ],

  results: [
    { value: "+40%", label: "Online Visibility", context: "POST WEBSITE LAUNCH" },
    { value: "+25%", label: "Customer Engagement", context: "6 MONTHS POST-REBRAND" },
    { value: "5y", label: "System In Production", context: "2020 → 2025" },
  ],
  images: [
    { src: "/images/work/nile-pharma/npf-logo-grid.png",       caption: "Logo construction grid",    w: 1400, h: 700 },
    { src: "/images/work/nile-pharma/npf-logo-waves.png",      caption: "Identity on palm leaves",    w: 1181, h: 1594 },
    { src: "/images/work/nile-pharma/npf-business-card-box.jpg", caption: "Business card & packaging", w: 4000, h: 3000 },
    { src: "/images/work/nile-pharma/npf-proxeed-products.png", caption: "Proxeed Plus & Proxerex",   w: 652,  h: 454 },
    { src: "/images/work/nile-pharma/npf-ramadan.png",          caption: "Ramadan campaign post",     w: 1880, h: 1576 },
    { src: "/images/work/nile-pharma/npf-proxeed-post.jpg",     caption: "Proxeed — campaign",        w: 1880, h: 1576 },
    { src: "/images/work/nile-pharma/npf-img-b.png",            caption: "Billboard — New Story",     w: 1400, h: 1050 },
    { src: "/images/work/nile-pharma/npf-img-c.png",            caption: "Product flyers",            w: 1400, h: 700 },
    { src: "/images/work/nile-pharma/npf-img-a.png",            caption: "We care about you",         w: 1400, h: 700 },
    { src: "/images/work/nile-pharma/npf-ezaby-post.jpg",       caption: "Ezaby — social post",       w: 1880, h: 1576 },
    { src: "/images/work/nile-pharma/npf-logo-motion.gif",      caption: "Logo motion study",         w: 1400, h: 700 },
  ],

  retro: [
    { verdict: "KEEP", note: "Templates as deliverables — every department could publish on-brand without me." },
    { verdict: "KEEP", note: "Stakeholder liaison role from day one; alignment was design work too." },
    { verdict: "CHANGE", note: "Brand guidelines should have shipped in year one, not at the rebrand." },
  ],
};

/** @deprecated kept for import compatibility — points to the real record */
export const ART_REFLECTION = NILE_PHARMA;
