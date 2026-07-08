import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/**
 * REVALIDATION — replaces the old Sanity webhook (/api/revalidate).
 * Payload calls this directly after every save/delete, no external HTTP
 * round-trip and no secret to manage. Paths listed here are static-rendered
 * (generateStaticParams) so they need an explicit revalidatePath to pick
 * up dashboard edits before the next full deploy.
 *
 * ⚠️ `revalidatePath`/`revalidateTag` only work inside a live Next.js
 * request (dashboard saves, API calls while `next dev`/`next start` is
 * running). Standalone scripts that import payload.config directly
 * (scripts/seed.ts, migrations, one-off CLI tasks) have no such context —
 * calling them there throws "Invariant: static generation store missing"
 * and crashes the whole script. `safeRevalidate*` swallows that specific
 * case: nothing to invalidate yet if the app isn't even serving requests.
 */
function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Not running inside a Next.js request (e.g. scripts/seed.ts) — skip.
  }
}

function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag);
  } catch {
    // Same as above.
  }
}

export function revalidateCollection(paths: readonly string[]): CollectionAfterChangeHook {
  return ({ doc }) => {
    for (const p of paths) safeRevalidatePath(p);
    if (doc?.slug) safeRevalidatePath(`${paths[0]}/${doc.slug}`.replace(/\/{2,}/g, "/"));
    return doc;
  };
}

export function revalidateOnDelete(paths: readonly string[]): CollectionAfterDeleteHook {
  return ({ doc }) => {
    for (const p of paths) safeRevalidatePath(p);
    if (doc?.slug) safeRevalidatePath(`${paths[0]}/${doc.slug}`.replace(/\/{2,}/g, "/"));
    return doc;
  };
}

export function revalidateGlobal(paths: readonly string[]): GlobalAfterChangeHook {
  return ({ doc }) => {
    for (const p of paths) safeRevalidatePath(p);
    return doc;
  };
}

/** For anything keyed by a cache tag instead of a fixed path. */
export function revalidateTags(tags: readonly string[]) {
  for (const t of tags) safeRevalidateTag(t);
}
