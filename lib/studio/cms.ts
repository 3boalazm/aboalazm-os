import type { Payload, Where } from "payload";
import { allLeads, contentHealth } from "@/lib/studio/metrics";
import type { NavCounts } from "@/components/studio/shell";
import {
  STUDIO_COLLECTIONS,
  STUDIO_GLOBALS,
  getCollectionMeta,
  getGlobalMeta,
  type CollectionMeta,
  type GlobalMeta,
  type StudioCollectionSlug,
  type StudioGlobalSlug,
} from "@/lib/studio/cms-meta";
import type {
  AnalyticsEvent,
  CaseStudy,
  Media,
  Message,
  Offer,
  Post,
  Project,
  ResourceLead,
  Setting,
  TeamMember,
  Testimonial,
  User,
} from "@/payload-types";
import type { StudioUser } from "@/lib/studio/auth";

export {
  STUDIO_COLLECTIONS,
  STUDIO_GLOBALS,
  getCollectionMeta,
  getGlobalMeta,
  type CollectionMeta,
  type GlobalMeta,
  type StudioCollectionSlug,
  type StudioGlobalSlug,
};

/**
 * STUDIO CMS LAYER — عمليات CRUD المباشرة عبر Payload Local API لكل
 * المجموعات والإعدادات العامة المعلنة في payload.config.ts.
 */

export function isMissingColumnError(error: unknown): boolean {
  const err = error as { cause?: { code?: string }; code?: string } | null | undefined;
  return (err?.cause?.code ?? err?.code) === "42703";
}

export function formatPayloadError(error: unknown): string {
  if (!error || typeof error !== "object") return String(error || "خطأ غير معروف");
  const err = error as {
    message?: string;
    data?: { errors?: { field?: string; path?: string; message?: string }[] };
  };
  const fieldErrors = err.data?.errors;
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    return fieldErrors
      .map((item) => {
        const key = item.field || item.path;
        const msg = item.message || "قيمة غير صالحة";
        return key ? `${key}: ${msg}` : msg;
      })
      .join(" · ");
  }
  return err.message || "تعذر إتمام العملية.";
}

export function extractMediaId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "number" && Number.isFinite(id)) return id;
    if (typeof id === "string" && /^\d+$/.test(id)) return Number(id);
  }
  return null;
}

/** استعلام آمن يستثني `projects.status` عند وقوع خطأ 42703 في قواعد البيانات المعتمدة على الترحيلات فقط. */
export const SAFE_PROJECT_EDITOR_SELECT = {
  slug: true,
  category: true,
  discipline: true,
  year: true,
  hasCaseStudy: true,
  isUiUx: true,
  name: true,
  nameAr: true,
  stack: true,
  outcome: true,
  outcomeAr: true,
  thumbnail: true,
  accent: true,
  externalUrl: true,
  liveUrl: true,
  _status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface ListDocsResult<T = Record<string, unknown>> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  deliveryStatusAvailable: boolean;
}

export async function listCollectionDocs(
  payload: Payload,
  user: StudioUser,
  slug: StudioCollectionSlug,
  opts: {
    search?: string;
    status?: string;
    filter?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<ListDocsResult> {
  const meta = getCollectionMeta(slug);
  if (!meta) throw new Error(`مجموعة غير معروفة: ${slug}`);

  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const limit = Math.min(60, Math.max(1, Math.floor(opts.limit ?? 24)));

  const clauses: Where[] = [];
  const q = opts.search?.trim();
  if (q) {
    clauses.push({
      or: meta.searchFields.map((field) => ({ [field]: { contains: q } })),
    });
  }
  if (meta.drafts && (opts.status === "published" || opts.status === "draft")) {
    clauses.push({ _status: { equals: opts.status } });
  }
  if (slug === "projects" && (opts.filter === "design" || opts.filter === "development")) {
    clauses.push({ category: { equals: opts.filter } });
  }
  if (slug === "posts" && (opts.filter === "en" || opts.filter === "ar")) {
    clauses.push({ lang: { equals: opts.filter } });
  }
  if (slug === "messages" && opts.filter === "unread") {
    clauses.push({ isRead: { equals: false } });
  } else if (slug === "messages" && opts.filter) {
    clauses.push({ leadStage: { equals: opts.filter } });
  }

  const where: Where | undefined =
    clauses.length === 0 ? undefined : clauses.length === 1 ? clauses[0] : { and: clauses };

  const baseArgs = {
    collection: slug as never,
    where,
    sort: meta.defaultSort,
    page,
    limit,
    depth: slug === "projects" || slug === "team-members" || slug === "case-studies" ? 1 : 0,
    overrideAccess: false,
    user: user as never,
  };

  try {
    const res = await payload.find(baseArgs as never);
    return {
      docs: res.docs as unknown as Record<string, unknown>[],
      totalDocs: res.totalDocs,
      totalPages: Math.max(1, res.totalPages),
      page: res.page ?? page,
      limit,
      deliveryStatusAvailable: true,
    };
  } catch (error) {
    if (slug === "projects" && isMissingColumnError(error)) {
      const res = await payload.find({
        ...(baseArgs as object),
        select: { ...SAFE_PROJECT_EDITOR_SELECT },
      } as never);
      return {
        docs: res.docs as unknown as Record<string, unknown>[],
        totalDocs: res.totalDocs,
        totalPages: Math.max(1, res.totalPages),
        page: res.page ?? page,
        limit,
        deliveryStatusAvailable: false,
      };
    }
    throw error;
  }
}

export async function getCollectionDoc(
  payload: Payload,
  user: StudioUser,
  slug: StudioCollectionSlug,
  idParam: string,
): Promise<{ doc: Record<string, unknown> | null; deliveryStatusAvailable: boolean }> {
  if (!/^\d+$/.test(idParam)) return { doc: null, deliveryStatusAvailable: true };
  const id = Number(idParam);
  const depth =
    slug === "projects" || slug === "case-studies" || slug === "team-members" || slug === "media" ? 1 : 0;

  try {
    const doc = await payload.findByID({
      collection: slug as never,
      id,
      depth,
      draft: true,
      overrideAccess: false,
      user: user as never,
    } as never);
    return { doc: doc as unknown as Record<string, unknown>, deliveryStatusAvailable: true };
  } catch (error) {
    if (slug === "projects" && isMissingColumnError(error)) {
      try {
        const doc = await payload.findByID({
          collection: "projects",
          id,
          depth,
          draft: true,
          select: { ...SAFE_PROJECT_EDITOR_SELECT },
          overrideAccess: false,
          user: user as never,
        } as never);
        return { doc: doc as unknown as Record<string, unknown>, deliveryStatusAvailable: false };
      } catch {
        return { doc: null, deliveryStatusAvailable: false };
      }
    }
    return { doc: null, deliveryStatusAvailable: true };
  }
}

export async function listMediaChoices(
  payload: Payload,
  user: StudioUser,
  opts: { search?: string; mimePrefix?: string; limit?: number } = {},
): Promise<Media[]> {
  const clauses: Where[] = [];
  if (opts.search?.trim()) {
    const q = opts.search.trim();
    clauses.push({
      or: [{ alt: { contains: q } }, { altAr: { contains: q } }, { filename: { contains: q } }],
    });
  }
  if (opts.mimePrefix?.trim()) {
    clauses.push({ mimeType: { contains: opts.mimePrefix.trim() } });
  }
  const where: Where | undefined =
    clauses.length === 0 ? undefined : clauses.length === 1 ? clauses[0] : { and: clauses };

  const res = await payload.find({
    collection: "media",
    where,
    sort: "-createdAt",
    limit: opts.limit ?? 48,
    depth: 0,
    overrideAccess: false,
    user: user as never,
  });
  return res.docs as Media[];
}

export async function getGlobalDoc(
  payload: Payload,
  user: StudioUser,
  slug: StudioGlobalSlug,
): Promise<Offer | Setting> {
  const doc = await payload.findGlobal({
    slug,
    depth: slug === "settings" ? 1 : 0,
    overrideAccess: false,
    user: user as never,
  });
  return doc as Offer | Setting;
}

export async function loadManageShellProps(
  payload: Payload,
  user: StudioUser,
): Promise<{
  counts: NavCounts;
  attention: { title: string; body: string; href: string; cta: string } | null;
}> {
  const [leads, content] = await Promise.all([
    allLeads({ payload, user }),
    contentHealth({ payload, user }),
  ]);
  const unreadLeads = leads.filter((l) => !l.isRead).length;
  const newLeads = leads.filter((l) => (l.leadStage ?? "new") === "new").length;
  const drafts = content.projectsDraft + content.postsDraft;
  return {
    counts: { unreadLeads, newLeads, drafts },
    attention: unreadLeads
      ? {
          title: unreadLeads === 1 ? "استفسار واحد غير مقروء" : `${unreadLeads} استفسارات غير مقروءة`,
          body: "التعديل يمكن أن ينتظر؛ هناك شخص ينتظر الرد.",
          href: "/studio/leads",
          cta: "فتح قائمة العملاء",
        }
      : null,
  };
}

export type AnyStudioDoc =
  | Project
  | CaseStudy
  | Post
  | Media
  | Testimonial
  | TeamMember
  | Message
  | ResourceLead
  | AnalyticsEvent
  | User;
