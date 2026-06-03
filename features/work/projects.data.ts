/**
 * PROJECT RECORDS — seed data.
 * Swap for the Sanity query (lib/sanity.ts → getProjects()) once the
 * studio is populated; the Project contract is already aligned.
 */
import type { Project } from "./types";

export const PROJECTS: readonly Project[] = [
  {
    slug: "art-reflection",
    name: "Art Reflection",
    discipline: "Systemic Identity",
    stack: ["Identity System", "Design Tokens", "Figma Library"],
    outcome: "+45% System Speed",
    year: "2025",
    thumbnail: "/images/work/art-reflection.jpg",
    accent: {
      primary: "rgb(96 165 250 / 0.20)",   // signal blue
      secondary: "rgb(45 212 191 / 0.10)", // teal undertone
    },
  },
  {
    slug: "zadullashr",
    name: "Zadullashr",
    discipline: "Product Architecture",
    stack: ["Next.js", "Tailwind v4", "Supabase"],
    outcome: "Automated Cloud Sync",
    year: "2025",
    thumbnail: "/images/work/zadullashr.jpg",
    accent: {
      primary: "rgb(52 211 153 / 0.20)",   // emerald
      secondary: "rgb(250 204 21 / 0.08)", // amber undertone
    },
  },
  {
    slug: "momas-farm",
    name: "Momas Farm",
    discipline: "Systemic Identity",
    stack: ["Brand System", "Packaging", "Bilingual Lockup"],
    outcome: "Retail-Ready in 38 Days",
    year: "2024",
    thumbnail: "/images/work/momas-farm.jpg",
    accent: {
      primary: "rgb(163 230 53 / 0.18)",   // farm lime
      secondary: "rgb(251 146 60 / 0.10)", // harvest orange
    },
  },
  {
    slug: "nile-pharma-food",
    name: "Nile Pharma Food",
    discipline: "Design Infrastructure",
    stack: ["WordPress", "Design System", "Social Templates"],
    outcome: "+40% Online Visibility",
    year: "2023",
    thumbnail: "/images/work/nile-pharma.jpg",
    accent: {
      primary: "rgb(56 189 248 / 0.20)",   // pharma cyan
      secondary: "rgb(129 140 248 / 0.10)",// indigo undertone
    },
  },
  {
    slug: "code-and-canvas",
    name: "Code & Canvas",
    discipline: "Product Architecture",
    stack: ["Next.js", "Sanity", "Token Pipeline"],
    outcome: "0% Design Drift",
    year: "2024",
    thumbnail: "/images/work/code-canvas.jpg",
    accent: {
      primary: "rgb(255 107 71 / 0.20)",   // studio coral
      secondary: "rgb(244 241 236 / 0.06)",// ink wash
    },
  },
] as const;
