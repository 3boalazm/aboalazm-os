"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "@/lib/payload";
import { getStudioUser } from "@/lib/studio/auth";
import {
  formatPayloadError,
  getCollectionMeta,
  getGlobalMeta,
  isMissingColumnError,
  listMediaChoices,
  SAFE_PROJECT_EDITOR_SELECT,
  type StudioCollectionSlug,
  type StudioGlobalSlug,
} from "@/lib/studio/cms";
import type { Media } from "@/payload-types";

export type SaveDocResult =
  | { ok: true; id: number | string; doc: Record<string, unknown>; warning?: string }
  | { ok: false; error: string };

export type DeleteDocResult =
  | { ok: true }
  | { ok: false; error: string };

export type SaveGlobalResult =
  | { ok: true; doc: Record<string, unknown> }
  | { ok: false; error: string };

function revalidateStudioTree(slug?: string, id?: string | number) {
  revalidatePath("/studio");
  revalidatePath("/studio/content");
  revalidatePath("/studio/leads");
  revalidatePath("/studio/analytics");
  revalidatePath("/studio/system");
  revalidatePath("/studio/manage");
  if (slug) {
    revalidatePath(`/studio/manage/${slug}`);
    if (id !== undefined) revalidatePath(`/studio/manage/${slug}/${id}`);
  }
}

/**
 * Create or update any Payload collection document using the operator's own
 * Payload session (`overrideAccess: false`), preserving all collection hooks,
 * access checks, validation, and public-site revalidation.
 */
export async function saveCollectionDocAction(
  slugRaw: string,
  idOrNew: string | number,
  rawPayload: Record<string, unknown>,
): Promise<SaveDocResult> {
  const user = await getStudioUser();
  if (!user) return { ok: false, error: "Session expired — sign in again." };

  const meta = getCollectionMeta(slugRaw);
  if (!meta) return { ok: false, error: `Unknown collection “${slugRaw}”.` };

  const slug = meta.slug;
  const isCreate = idOrNew === "new" || idOrNew === "";
  if (isCreate && !meta.allowsCreate) {
    return { ok: false, error: `${meta.label} cannot be created manually here.` };
  }

  const data: Record<string, unknown> = { ...rawPayload };

  /* Users: empty password during edit means "keep current password". */
  if (slug === "users" && !isCreate) {
    if (typeof data.password !== "string" || data.password.trim() === "") {
      delete data.password;
    }
  }

  const draft = meta.drafts && data._status === "draft";
  const payload = await getPayload();

  try {
    if (isCreate) {
      const created = (await payload.create({
        collection: slug as never,
        data: data as never,
        draft,
        overrideAccess: false,
        user: user as never,
      } as never)) as unknown as Record<string, unknown>;

      revalidateStudioTree(slug, (created.id as number | string | undefined) ?? undefined);
      return {
        ok: true,
        id: (created.id as number | string) ?? "",
        doc: created,
      };
    }

    const id = typeof idOrNew === "number" ? idOrNew : /^\d+$/.test(idOrNew) ? Number(idOrNew) : idOrNew;
    const updated = (await payload.update({
      collection: slug as never,
      id,
      data: data as never,
      draft,
      overrideAccess: false,
      user: user as never,
    } as never)) as unknown as Record<string, unknown>;

    revalidateStudioTree(slug, id);
    return {
      ok: true,
      id,
      doc: updated,
    };
  } catch (error) {
    if (slug === "projects" && isMissingColumnError(error)) {
      /* On migration-only databases missing projects.status (42703), return a clear
         explanation rather than an opaque 500. */
      if (!isCreate && /^\d+$/.test(String(idOrNew))) {
        try {
          const { status: _omitted, ...withoutStatus } = data;
          void _omitted;
          const retry = (await payload.update({
            collection: "projects",
            id: Number(idOrNew),
            data: withoutStatus as never,
            draft,
            select: { ...SAFE_PROJECT_EDITOR_SELECT },
            overrideAccess: false,
            user: user as never,
          } as never)) as unknown as Record<string, unknown>;
          revalidateStudioTree(slug, idOrNew);
          return {
            ok: true,
            id: idOrNew,
            doc: retry,
            warning: "Saved without delivery status (projects.status column is absent in this database).",
          };
        } catch (retryErr) {
          if (!isMissingColumnError(retryErr)) {
            return { ok: false, error: formatPayloadError(retryErr) };
          }
        }
      }
      return {
        ok: false,
        error:
          "Projects write failed because `projects.status` is missing in this database schema (Postgres 42703). See docs/studio/03_SCHEMA_FINDINGS.md §3.",
      };
    }
    return { ok: false, error: formatPayloadError(error) };
  }
}

export async function deleteCollectionDocAction(
  slugRaw: string,
  idRaw: string | number,
): Promise<DeleteDocResult> {
  const user = await getStudioUser();
  if (!user) return { ok: false, error: "Session expired — sign in again." };

  const meta = getCollectionMeta(slugRaw);
  if (!meta) return { ok: false, error: `Unknown collection “${slugRaw}”.` };

  const slug = meta.slug as StudioCollectionSlug;
  const id = typeof idRaw === "number" ? idRaw : /^\d+$/.test(idRaw) ? Number(idRaw) : idRaw;

  const payload = await getPayload();

  if (slug === "users") {
    if (String(id) === String(user.id)) {
      return { ok: false, error: "You cannot delete the user you are currently signed in with." };
    }
    const existing = await payload.count({
      collection: "users",
      overrideAccess: false,
      user: user as never,
    });
    if (existing.totalDocs <= 1) {
      return { ok: false, error: "Cannot delete the last admin account." };
    }
  }

  try {
    await payload.delete({
      collection: slug as never,
      id,
      overrideAccess: false,
      user: user as never,
    });
    revalidateStudioTree(slug);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: formatPayloadError(error) };
  }
}

export async function saveGlobalDocAction(
  slugRaw: string,
  data: Record<string, unknown>,
): Promise<SaveGlobalResult> {
  const user = await getStudioUser();
  if (!user) return { ok: false, error: "Session expired — sign in again." };

  const meta = getGlobalMeta(slugRaw);
  if (!meta) return { ok: false, error: `Unknown global “${slugRaw}”.` };

  const slug = meta.slug as StudioGlobalSlug;
  const payload = await getPayload();

  try {
    const updated = (await payload.updateGlobal({
      slug,
      data: data as never,
      overrideAccess: false,
      user: user as never,
    })) as unknown as Record<string, unknown>;
    revalidateStudioTree();
    revalidatePath(`/studio/manage/globals/${slug}`);
    return { ok: true, doc: updated };
  } catch (error) {
    return { ok: false, error: formatPayloadError(error) };
  }
}

export async function searchMediaForPickerAction(opts: {
  search?: string;
  mimePrefix?: string;
}): Promise<{ ok: true; docs: Media[] } | { ok: false; error: string }> {
  const user = await getStudioUser();
  if (!user) return { ok: false, error: "Session expired — sign in again." };
  try {
    const payload = await getPayload();
    const docs = await listMediaChoices(payload, user, {
      search: opts.search,
      mimePrefix: opts.mimePrefix,
      limit: 48,
    });
    return { ok: true, docs };
  } catch (error) {
    return { ok: false, error: formatPayloadError(error) };
  }
}
