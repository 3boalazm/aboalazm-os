/**
 * PROJECT EVIDENCE — how each public entry is labelled (P2 · point 11).
 *
 * The audit's fair complaint: the site never said which projects were paid
 * client work, which were internal studio builds, and which were demos or
 * works-in-progress. A decision-maker eventually finds out and discounts
 * everything else. This module states it on the card and on the case page.
 *
 * The classification is derived from data the project record already carries —
 * never hand-copied — so the label cannot drift from the record:
 *
 *   · client            — delivered for a named external organization
 *   · internal          — built and owned by Aboalazm OS / Code & Canvas
 *   · demo              — a demonstration build with no client behind it
 *   · in-development    — shown while still being built
 */
import type { Project } from "./types";

export type EvidenceKind = "client" | "internal" | "demo" | "in-development";

export const EVIDENCE_COPY: Record<EvidenceKind, { en: string; ar: string; note: { en: string; ar: string } }> = {
  client: {
    en: "Client work",
    ar: "مشروع عميل",
    note: {
      en: "Built for an external organization under a paid engagement.",
      ar: "مُنفَّذ لمؤسسة خارجية في إطار تعاقد مدفوع.",
    },
  },
  internal: {
    en: "Studio build",
    ar: "بناء داخلي",
    note: {
      en: "Designed and built by the studio itself — an internal project used as proof of method, not a client deliverable.",
      ar: "صُمم ونُفّذ داخل الاستوديو نفسه — مشروع داخلي يُعرض كدليل على المنهج لا كتسليم لعميل.",
    },
  },
  demo: {
    en: "Demo build",
    ar: "نسخة تجريبية",
    note: {
      en: "A demonstration build with no client behind it. Shown to illustrate capability; no commercial result is claimed.",
      ar: "بناء تجريبي بدون عميل. يُعرض لتوضيح القدرة فقط؛ ولا ننسب إليه أي نتيجة تجارية.",
    },
  },
  "in-development": {
    en: "In development",
    ar: "قيد التطوير",
    note: {
      en: "Still being built and not yet launched. Shown as current work in progress.",
      ar: "ما زال يُبنى ولم يُطلق بعد. يُعرض كعمل جارٍ.",
    },
  },
};

/** Internal builds: the studio's own products and platforms. */
const INTERNAL_SLUGS = new Set(["code-canvas", "code-canvas-dev"]);
/** Internal brand explorations with no external client. */
const INTERNAL_DESIGN_SLUGS = new Set(["reflection"]);

export function evidenceOf(project: Pick<Project, "slug" | "category" | "isDemo" | "previewStatus" | "hasCaseStudy" | "status">): EvidenceKind {
  if (project.previewStatus === "archived") return "internal";
  if (INTERNAL_SLUGS.has(project.slug) || INTERNAL_DESIGN_SLUGS.has(project.slug)) return "internal";
  if (project.isDemo) return "demo";
  if (!project.hasCaseStudy && project.category === "design") return "demo";
  // A record still being built must never be presented as delivered client work.
  // Checked after the demo/internal cases so those keep their more specific label,
  // and before the default so `status: "in-progress"` actually reaches the reader.
  if (project.status === "in-progress") return "in-development";
  return "client";
}

/**
 * Which projects carry a measured business outcome. Nothing on the site may
 * show a percentage or a saved-hours figure unless the slug is listed here and
 * the case study states the period, the method and the source (P2 · point 10).
 *
 * Deliberately empty: the previously published Nile Pharma +40% / +25% figures
 * were retired (see features/case-studies/reviewed-claims.ts) because no
 * measurement period or data source accompanied them. Add a slug only together
 * with that evidence, and then publish it in the case study itself.
 */
export const MEASURED_OUTCOME_SLUGS: readonly string[] = [];

export function hasMeasuredOutcome(slug: string): boolean {
  return MEASURED_OUTCOME_SLUGS.includes(slug);
}
