/**
 * LEDGER DATA — the real five, ported from the live portfolio.
 * Records with `hasCaseStudy: false` open Behance in a new tab —
 * the established no-404 principle until each case file is written.
 */
import type { Project } from "./types";

export const BEHANCE = "https://www.behance.net/aboalazm";

export const PROJECTS: readonly Project[] = [
  {
    slug: "gad-institute",
    name: "GAD Heart & Lungs Institute",
    nameAr: "معهد GAD للقلب والرئة",
    discipline: "Systemic Identity",
    stack: ["Brand Strategy", "Bilingual Identity", "Guidelines"],
    outcome: "Strategy → Identity → Governed System",
    outcomeAr: "استراتيجية → هوية → نظام محكوم",
    year: "2025",
    thumbnail: "/images/work/gad/gad-thumb.jpg",
    hasCaseStudy: true,
    accent: {
      primary: "rgb(0 88 149 / 0.20)",
      secondary: "rgb(171 18 28 / 0.10)",
    },
  },
  {
    slug: "ahmed-bedeer",
    name: "Ahmed Bedeer",
    nameAr: "أحمد بدير",
    discipline: "Systemic Identity",
    stack: ["Personal Brand", "Brand Guidelines", "Monogram"],
    outcome: "Healthcare IT Personal Brand",
    outcomeAr: "براند شخصي · تكنولوجيا معلومات صحية",
    year: "2025",
    thumbnail: "/images/work/ahmed-bedeer-mockup.jpg",
    hasCaseStudy: true,
    accent: {
      primary: "rgb(17 138 178 / 0.20)",
      secondary: "rgb(6 214 160 / 0.10)",
    },
  },
  {
    slug: "nile-pharma",
    name: "Nile Pharma Food",
    nameAr: "نايل فارما فود",
    discipline: "Systemic Identity",
    stack: ["Brand System", "WordPress", "Rebrand"],
    outcome: "+40% Online Visibility",
    outcomeAr: "+٤٠٪ ظهور رقمي",
    year: "2020–25",
    thumbnail: "/images/work/nile-pharma.jpg",
    hasCaseStudy: true,
    accent: {
      primary: "rgb(0 200 210 / 0.18)",
      secondary: "rgb(64 156 255 / 0.10)",
    },
  },
  {
    slug: "code-canvas",
    name: "Code & Canvas",
    nameAr: "Code & Canvas",
    discipline: "Design Infrastructure",
    stack: ["Studio Identity", "Brand System", "Guidelines"],
    outcome: "Studio Built on Its Own System",
    outcomeAr: "استوديو مبني على نظامه الخاص",
    year: "2024 →",
    thumbnail: "/images/work/cc-logo-hero.jpg",
    hasCaseStudy: true,
    accent: {
      primary: "rgb(120 80 200 / 0.22)",
      secondary: "rgb(72 204 200 / 0.14)",
    },
  },
  {
    slug: "reflection",
    name: "Reflection",
    nameAr: "Reflection",
    discipline: "Identity Engineering",
    stack: ["Identity", "Art & Print", "Guidelines"],
    outcome: "Premium Art Brand · V1.0 System",
    outcomeAr: "براند فن متميز · نظام V1.0",
    year: "2022",
    thumbnail: "/images/work/reflection/refl-thumb.jpg",
    hasCaseStudy: true,
    accent: {
      primary: "rgb(150 70 140 / 0.18)",
      secondary: "rgb(31 168 164 / 0.12)",
    },
  },
  {
    slug: "esfc",
    name: "Egypt SEG Field Camp",
    nameAr: "مخيم SEG مصر الميداني",
    discipline: "Identity Engineering",
    stack: ["Identity", "Print", "Event"],
    outcome: "Record Registrations",
    outcomeAr: "تسجيلات قياسية",
    year: "2020",
    thumbnail: "/images/work/esfc.jpg",
    hasCaseStudy: false,
    accent: {
      primary: "rgb(255 200 60 / 0.18)",
      secondary: "rgb(255 107 71 / 0.10)",
    },
  },
  {
    slug: "learn-in-arabic",
    name: "Learn in Arabic",
    nameAr: "تعلّم بالعربي",
    discipline: "Studio & Identity",
    stack: ["Identity", "Studio Build", "Motion"],
    outcome: "Studio From Scratch",
    outcomeAr: "استوديو من الصفر",
    year: "2020–21",
    thumbnail: "/images/work/learn-in-arabic.jpg",
    hasCaseStudy: false,
    accent: {
      primary: "rgb(96 165 250 / 0.20)",
      secondary: "rgb(45 212 191 / 0.10)",
    },
  },
  {
    slug: "youth-scope",
    name: "Youth Scope",
    nameAr: "Youth Scope",
    discipline: "Systemic Identity",
    stack: ["Identity", "Campaigns", "Team Lead"],
    outcome: "From Scratch, Twice",
    outcomeAr: "من الصفر، مرتين",
    year: "2019–21",
    thumbnail: "/images/work/youth-scope.jpg",
    hasCaseStudy: false,
    accent: {
      primary: "rgb(61 220 132 / 0.18)",
      secondary: "rgb(150 220 61 / 0.10)",
    },
  },
];
