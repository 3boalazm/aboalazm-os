import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/**
 * REVALIDATION — replaces the old Sanity webhook (/api/revalidate).
 * Payload calls this directly after every save/delete, no external HTTP
 * round-trip and no secret to manage. Paths listed here are static-rendered
 * (generateStaticParams) so they need an explicit revalidatePath to pick
 * up dashboard edits before the next full deploy.
 */
export function revalidateCollection(paths: readonly string[]): CollectionAfterChangeHook {
  return ({ doc }) => {
    for (const p of paths) revalidatePath(p);
    if (doc?.slug) revalidatePath(`${paths[0]}/${doc.slug}`.replace(/\/{2,}/g, "/"));
    return doc;
  };
}

export function revalidateOnDelete(paths: readonly string[]): CollectionAfterDeleteHook {
  return ({ doc }) => {
    for (const p of paths) revalidatePath(p);
    if (doc?.slug) revalidatePath(`${paths[0]}/${doc.slug}`.replace(/\/{2,}/g, "/"));
    return doc;
  };
}

export function revalidateGlobal(paths: readonly string[]): GlobalAfterChangeHook {
  return ({ doc }) => {
    for (const p of paths) revalidatePath(p);
    return doc;
  };
}

/** For anything keyed by a cache tag instead of a fixed path. */
export function revalidateTags(tags: readonly string[]) {
  for (const t of tags) revalidateTag(t);
}
