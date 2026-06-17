/**
 * CODE & CANVAS — Studio Identity (Feb 2024).
 * This is the studio's own brand — designed by Mustafa Aboalazm
 * for the agency he co-founded. The squircle </> mark, the
 * purple-to-teal gradient system, and the "Where creativity
 * meets technology" positioning are all his.
 * Accent: C&C's own purple + teal, worn as page atmosphere.
 */
import type { CaseStudyRecord } from "./types";

export const CODE_CANVAS: CaseStudyRecord = {
  slug: "code-canvas",
  name: "Code & Canvas",
  discipline: "Design Infrastructure — Studio Identity",
  accent: {
    primary:   "rgb(120 80 200 / 0.22)",  // C&C purple
    secondary: "rgb(72 204 200 / 0.14)",  // C&C teal  #48CCC8
  },

  problem:
    "Launching a creative agency that bridges IT and design with no brand of its own. Before Code & Canvas could sell identity systems to clients, it needed to live inside one — a mark that communicates both disciplines without splitting them.",
  teamScale: "Co-founders: Mustafa Aboalazm (Creative Lead) + partner",
  timeline: "February 2024 · V1.0 brand guidelines shipped at launch",
  kpis: [
    { value: "2",   label: "Disciplines unified",  context: "CODE + CREATIVE" },
    { value: "1",   label: "Mark that says both",   context: "THE SQUIRCLE </>" },
    { value: "V1.0",label: "Guidelines at launch",  context: "GOVERNED FROM DAY ONE" },
  ],

  researchSummary:
    "Agency identities in the MENA market split predictably: tech agencies look like SaaS dashboards (dark, data-heavy, no warmth); creative agencies look like art portfolios (expressive, inconsistent, no rigour). Code & Canvas needed to occupy the unclaimed center — a system that reads as both engineering precision and creative energy from the first glance.",
  competitors: [
    { name: "Tech-only agency A", x: 25, y: 55 },
    { name: "Tech-only agency B", x: 32, y: 38 },
    { name: "Creative-only C",    x: 70, y: 20 },
    { name: "Creative-only D",    x: 78, y: 28 },
    { name: "Generic digital E",  x: 45, y: 32 },
    { name: "Code & Canvas",      x: 85, y: 80, isClient: true },
  ],
  visualVectors: ["SQUIRCLE", "GRADIENT-SYSTEM", "PURPLE+TEAL", "DUAL-DISCIPLINE", "BOLD-TYPE"],

  tokens: [
    { token: "primary-bg",   value: "#00001E",  role: "Dark blue canvas"       },
    { token: "accent-teal",  value: "#48CCC8",  role: "Secondary / highlights" },
    { token: "outline",      value: "#C7C7E5",  role: "Borders / rules"        },
    { token: "heading",      value: "Signate Grotesk Black", role: "Display"   },
    { token: "subtitles",    value: "Raleway",  role: "Subheadings"            },
    { token: "body",         value: "Poppins",  role: "Articles / UI copy"     },
  ],
  componentStates: ["ON DARK", "ON LIGHT", "ON GRADIENT", "MONO"],
  breakpoints: [
    { bp: "ICON",     cols: "Squircle mark only" },
    { bp: "LOCKUP",   cols: "Icon + wordmark horizontal" },
    { bp: "STACKED",  cols: "Icon + wordmark vertical"   },
  ],

  results: [
    { value: "1",    label: "System at founding",     context: "IDENTITY = INFRASTRUCTURE" },
    { value: "3",    label: "Type families",           context: "GOVERNED HIERARCHY"        },
    { value: "8+",   label: "Gradient variants",       context: "EXPRESSION WITHIN SYSTEM"  },
  ],
  retro: [
    { verdict: "KEEP",   note: "The squircle with </> inside — it says 'code' and 'craft' in a single geometric form that scales from favicon to billboard." },
    { verdict: "KEEP",   note: "Purple-to-teal gradient as the expressive layer: constrained by the token system, so it never becomes decoration." },
    { verdict: "KEEP",   note: "Identity shipped as a live product — codeandcanvas.net built end to end: bilingual EN/AR, productized services, the system applied in code, not just guidelines." },
    { verdict: "CHANGE", note: "Three typefaces (Signate Grotesk / Raleway / Poppins) is one too many for long-term consistency — consolidate at V2." },
  ],
};
