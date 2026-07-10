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
import type { Bi, Tier, AlaCarteGroup } from "@/lib/offers";
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
    isUiUx: doc.isUiUx ?? false,
    liveUrl: doc.liveUrl ?? undefined,
    accent: { primary: doc.accent.primary, secondary: doc.accent.secondary },
  };
}

/** Projects tagged for the /work-ui showcase — only ones with a real
 *  liveUrl set (no point showing a preview card with nothing to preview). */
export async function getUiUxProjects(): Promise<Project[]> {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "projects",
    where: {
      and: [{ isUiUx: { equals: true } }, { liveUrl: { exists: true } }],
    },
    limit: 100,
    sort: "-year",
    overrideAccess: false,
  });
  return res.docs.map(toProject).filter((p) => p.liveUrl);
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
    overrideAccess: false,
  });
  const doc = res.docs[0];
  return doc ? toCaseStudy(doc) : null;
}

export async function getPost(slug: string) {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  });
  const doc = res.docs[0];
  if (!doc) return null;
  return {
    index: doc.index ?? "",
    slug: doc.slug,
    title: doc.title,
    standfirst: doc.standfirst ?? "",
    publishedAt: doc.publishedAt ?? "",
    lang: doc.lang ?? "en",
    body: doc.body,
  };
}

export async function getAllPostSlugs(): Promise<string[]> {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "posts",
    limit: 100,
    select: { slug: true },
    overrideAccess: false,
  });
  return res.docs.map((d) => d.slug);
}

export async function getPosts(): Promise<
  { index: string; slug: string; title: string; standfirst: string; publishedAt: string; lang: "en" | "ar" }[]
> {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "posts",
    limit: 100,
    sort: "-publishedAt",
    overrideAccess: false,
  });
  return res.docs.map((d) => ({
    index: d.index ?? "",
    slug: d.slug,
    title: d.title,
    standfirst: d.standfirst ?? "",
    publishedAt: d.publishedAt
      ? new Date(d.publishedAt).toLocaleDateString("en-CA").slice(0, 7)
      : "",
    lang: d.lang ?? "en",
  }));
}
export async function getAllCaseStudySlugs(): Promise<string[]> {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "case-studies",
    limit: 100,
    select: { slug: true },
    overrideAccess: false,
  });
  return res.docs.map((d) => d.slug);
}

export async function getGalleryData(): Promise<{
  projects: { slug: string; label: string; labelAr: string; accent: string; href: string }[];
  images: { src: string; project: string; caption: string; captionAr: string; w: number; h: number }[];
}> {
  const payload = await getPayload();
  const res = await payload.find({ collection: "case-studies", limit: 100, overrideAccess: false });

  const projects = res.docs
    .filter((d) => (d.images ?? []).length > 0)
    .map((d) => ({
      slug: d.slug,
      label: d.name,
      labelAr: d.nameAr ?? d.name,
      accent: d.accent.primary,
      href: `/case-studies/${d.slug}`,
    }));

  const images = res.docs.flatMap((d) =>
    (d.images ?? []).map((img) => {
      const media = img.image;
      const isMediaObj = typeof media === "object" && media !== null;
      return {
        src: mediaUrl(media),
        project: d.slug,
        caption: img.caption ?? "",
        captionAr: img.captionAr ?? img.caption ?? "",
        w: isMediaObj ? media.width ?? 1200 : 1200,
        h: isMediaObj ? media.height ?? 800 : 800,
      };
    }),
  );

  return { projects, images };
}

export async function getSettings(): Promise<{ cvUrl: string | null }> {
  const payload = await getPayload();
  const settings = await payload.findGlobal({ slug: "settings" });
  return { cvUrl: mediaUrl(settings.cv) || null };
}

export async function getOffers(): Promise<{
  tiers: Tier[];
  investmentValue: { value: string; en: string; ar: string; subEn?: string | null; subAr?: string | null; pending?: boolean | null }[];
  alaCarte: AlaCarteGroup[];
}> {
  const payload = await getPayload();
  const offers = await payload.findGlobal({ slug: "offers" });
  const toBi = (g: { en?: string | null; ar?: string | null } | null | undefined): Bi => [
    g?.en ?? "",
    g?.ar ?? "",
  ];

  const tiers: Tier[] = (offers.tiers ?? []).map((t) => ({
    tag: toBi(t.tag),
    name: toBi(t.name),
    price: t.price,
    priceNote: toBi(t.priceNote),
    bestFor: toBi(t.bestFor),
    duration: toBi(t.duration),
    payment: t.payment,
    recommended: t.recommended ?? undefined,
    includesHead: toBi(t.includesHead),
    includes: (t.includes ?? []).map(toBi),
    excludes: (t.excludes ?? []).map(toBi),
  }));

  const alaCarte: AlaCarteGroup[] = (offers.alaCarte ?? []).map((g) => ({
    group: toBi(g.group),
    rows: (g.rows ?? []).map((r) => ({
      service: toBi(r.service),
      details: toBi(r.details),
      price: r.price,
    })),
  }));

  return { tiers, investmentValue: offers.investmentValue ?? [], alaCarte };
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
    overrideAccess: false,
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
