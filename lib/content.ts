/**
 * CONTENT ADAPTERS — bridge Payload's document shape to the exact
 * `Project` / `CaseStudyRecord` types the UI already consumes. This is
 * the ONLY layer that changes; ProjectLedger, ScrollyCaseStudy, etc.
 * never know their data used to come from a static file.
 */
import { getPayload } from "./payload";
import type { Project } from "@/features/work/types";
import type { CaseStudyRecord } from "@/features/case-studies/types";
import type { GalleryItem } from "@/features/case-studies/case-gallery";
import type { Media, Project as PayloadProject, CaseStudy as PayloadCaseStudy } from "@/payload-types";

function mediaUrl(media: number | Media | null | undefined): string {
  if (media && typeof media === "object") return media.url ?? "";
  return "";
}

function toProject(doc: PayloadProject): Project {
  return {
    slug: doc.slug,
    name: doc.name,
    nameAr: doc.nameAr ?? undefined,
    category: doc.category,
    discipline: doc.discipline,
    stack: doc.stack ?? [],
    outcome: doc.outcome,
    outcomeAr: doc.outcomeAr ?? undefined,
    year: doc.year,
    thumbnail: mediaUrl(doc.thumbnail),
    hasCaseStudy: doc.hasCaseStudy ?? false,
    externalUrl: doc.externalUrl ?? undefined,
    accent: { primary: doc.accent.primary, secondary: doc.accent.secondary },
  };
}

export async function getProjects(): Promise<Project[]> {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "projects",
    limit: 100,
    sort: "-year",
    overrideAccess: false,
  });
  return res.docs.map(toProject);
}

function toCaseStudy(doc: PayloadCaseStudy): CaseStudyRecord {
  return {
    slug: doc.slug,
    name: doc.name,
    nameAr: doc.nameAr ?? undefined,
    discipline: doc.discipline,
    accent: { primary: doc.accent.primary, secondary: doc.accent.secondary },

    problem: doc.problem,
    problemAr: doc.problemAr ?? undefined,
    teamScale: doc.teamScale ?? "",
    teamScaleAr: doc.teamScaleAr ?? undefined,
    timeline: doc.timeline ?? "",
    timelineAr: doc.timelineAr ?? undefined,
    kpis: (doc.kpis ?? []).map((k) => ({
      value: k.value,
      label: k.label,
      labelAr: k.labelAr ?? undefined,
      context: k.context ?? undefined,
      contextAr: k.contextAr ?? undefined,
    })),

    researchSummary: doc.researchSummary,
    researchSummaryAr: doc.researchSummaryAr ?? undefined,
    competitors: (doc.competitors ?? []).map((c) => ({
      name: c.name,
      x: c.x,
      y: c.y,
      isClient: c.isClient ?? undefined,
    })),
    visualVectors: doc.visualVectors ?? [],
    visualVectorsAr: doc.visualVectorsAr ?? undefined,

    tokens: (doc.tokens ?? []).map((t) => ({
      token: t.token,
      value: t.value,
      role: t.role,
      roleAr: t.roleAr ?? undefined,
    })),
    componentStates: doc.componentStates ?? [],
    breakpoints: (doc.breakpoints ?? []).map((b) => ({ bp: b.bp, cols: b.cols })),
    // NOTE: CaseStudyRecord.images (w/h shape) is dead in the current UI —
    // ScrollyCaseStudy never reads it. The gallery that's actually
    // rendered (<CaseGallery>, span-based) comes from getCaseStudyGallery()
    // below, sourced from the same Payload field.
    images: [],

    results: (doc.results ?? []).map((k) => ({
      value: k.value,
      label: k.label,
      labelAr: k.labelAr ?? undefined,
      context: k.context ?? undefined,
      contextAr: k.contextAr ?? undefined,
    })),
    retro: (doc.retro ?? []).map((r) => ({
      verdict: r.verdict,
      note: r.note,
      noteAr: r.noteAr ?? undefined,
    })),
  };
}

export async function getCaseStudy(slug: string): Promise<CaseStudyRecord | null> {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const doc = res.docs[0];
  return doc ? toCaseStudy(doc) : null;
}

export async function getAllCaseStudySlugs(): Promise<string[]> {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "case-studies",
    limit: 100,
    select: { slug: true },
  });
  return res.docs.map((d) => d.slug);
}

/** The gallery actually rendered by <CaseGallery> — span-based, not the
 *  dead w/h shape on CaseStudyRecord.images. Empty array is valid
 *  (nile-pharma's page never rendered one either) — callers should skip
 *  rendering <CaseGallery> when this comes back empty. */
export async function getCaseStudyGallery(slug: string): Promise<GalleryItem[]> {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const doc = res.docs[0];
  if (!doc) return [];
  return (doc.images ?? []).map((img) => ({
    src: mediaUrl(img.image),
    caption: img.caption ?? "",
    captionAr: img.captionAr ?? undefined,
    span: img.span ?? undefined,
  }));
}
