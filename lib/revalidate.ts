import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/**
 * REVALIDATION — replaces the old Sanity webhook (/api/revalidate).
 * Payload calls this directly after every save/delete, no external HTTP
 * round-trip and no secret to manage.
 *
 * TWO LAYERS, AND WHY THE SECOND ONE MATTERS FOR COST
 * 1. Time: CMS-backed pages declare `export const revalidate = 86400`
 *    (a daily safety net — Next needs that value as a literal in each file).
 * 2. Events: every CMS save that can change a public page calls
 *    `revalidatePublicSite()` below, so edits still show immediately.
 *
 * The pages used to carry `revalidate = 60`. With ~110 page variants
 * (14 pages × 3 locales, plus every article and case study) that meant a
 * server re-render on almost every visit, link prefetch and crawler hit, and
 * it exhausted Vercel Hobby's Fluid Active CPU (the team was paused, HTTP 402,
 * on 19 Nov 2026). Do not shorten the page TTL again — lib/revalidate.test.ts
 * fails if any page drops below one hour.
 *
 * ⚠️ `revalidatePath`/`revalidateTag` only work inside a live Next.js
 * request (dashboard saves, API calls while `next dev`/`next start` is
 * running). Standalone scripts that import payload.config directly
 * (scripts/seed.ts, migrations, one-off CLI tasks) have no such context —
 * calling them there throws "Invariant: static generation store missing"
 * and crashes the whole script. `safePath` swallows that specific
 * case: nothing to invalidate yet if the app isn't even serving requests.
 */

type Scope = "page" | "layout";
export type Invalidate = (path: string, type?: Scope) => void;

type DocStatus = { _status?: string } | null | undefined;

/**
 * A save that only touches an unpublished draft (or an autosave tick) cannot
 * change anything a visitor sees, so it must not invalidate the site.
 * Collections without drafts have no `_status` and always count.
 */
export function touchesPublicContent(doc: DocStatus, previousDoc: DocStatus): boolean {
  if (doc?._status === "draft") return previousDoc?._status === "published"; // unpublishing is a public change
  return true;
}

/** Factory so tests can observe the calls; the default instance below binds Next's functions. */
export function createRevalidators(invalidate: Invalidate) {
  function safePath(path: string, type?: Scope) {
    try {
      invalidate(path, type);
    } catch {
      // Not running inside a Next.js request (e.g. scripts/seed.ts) — skip.
    }
  }

  /**
   * Marks every public page stale. "/" + "layout" is the root layout tag that
   * every page carries, so no per-collection page map has to be maintained.
   * It is lazy: nothing re-renders until a visitor requests a page, so a save
   * costs one render per page that is actually visited, not one per page.
   */
  function revalidatePublicSite() {
    safePath("/", "layout");
  }

  function slugPath(paths: readonly string[], doc: { slug?: unknown } | null | undefined) {
    return doc?.slug && paths[0] ? `${paths[0]}/${String(doc.slug)}`.replace(/\/{2,}/g, "/") : null;
  }

  function revalidateCollection(paths: readonly string[]): CollectionAfterChangeHook {
    return ({ doc, previousDoc }) => {
      if (!touchesPublicContent(doc, previousDoc)) return doc;
      for (const p of paths) safePath(p);
      const own = slugPath(paths, doc);
      if (own) safePath(own);
      revalidatePublicSite();
      return doc;
    };
  }

  function revalidateOnDelete(paths: readonly string[]): CollectionAfterDeleteHook {
    return ({ doc }) => {
      for (const p of paths) safePath(p);
      const own = slugPath(paths, doc);
      if (own) safePath(own);
      revalidatePublicSite();
      return doc;
    };
  }

  function revalidateGlobal(paths: readonly string[]): GlobalAfterChangeHook {
    return ({ doc, previousDoc }) => {
      if (!touchesPublicContent(doc, previousDoc)) return doc;
      for (const p of paths) safePath(p);
      revalidatePublicSite();
      return doc;
    };
  }

  return {
    revalidatePublicSite,
    revalidateCollection,
    revalidateOnDelete,
    revalidateGlobal,
    /** For content that has no page of its own (media, testimonials, settings): refresh the whole site. */
    revalidateSiteAfterChange: revalidateCollection([]),
    revalidateSiteAfterDelete: revalidateOnDelete([]),
    revalidateSiteAfterGlobalChange: revalidateGlobal([]),
  };
}

const next = createRevalidators((path, type) => {
  if (type) revalidatePath(path, type);
  else revalidatePath(path);
});

export const {
  revalidatePublicSite,
  revalidateCollection,
  revalidateOnDelete,
  revalidateGlobal,
  revalidateSiteAfterChange,
  revalidateSiteAfterDelete,
  revalidateSiteAfterGlobalChange,
} = next;

function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag);
  } catch {
    // Same as above.
  }
}

/** For anything keyed by a cache tag instead of a fixed path. */
export function revalidateTags(tags: readonly string[]) {
  for (const t of tags) safeRevalidateTag(t);
}
