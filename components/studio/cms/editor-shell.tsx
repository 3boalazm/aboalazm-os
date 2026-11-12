"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Chip, SIcon, ViewHeader } from "@/components/studio/ui";
import { Toasts, useToasts } from "@/components/studio/interactive";
import { deleteCollectionDocAction } from "@/app/studio/manage/actions";
import { STUDIO_COLLECTIONS, STUDIO_GLOBALS } from "@/lib/studio/cms-meta";

/** Quick switcher across every collection & global in Studio Manage. */
export function ManageNavStrip({ activeSlug }: { activeSlug: string }) {
  return (
    <nav className="studio-switcher" aria-label="CMS collections and globals">
      {STUDIO_COLLECTIONS.map((c) => (
        <Link
          key={c.slug}
          href={`/studio/manage/${c.slug}`}
          className="studio-switcher__pill"
          aria-current={activeSlug === c.slug ? "page" : undefined}
        >
          {c.label}
        </Link>
      ))}
      <span className="studio-switcher__sep" aria-hidden />
      {STUDIO_GLOBALS.map((g) => (
        <Link
          key={g.slug}
          href={`/studio/manage/globals/${g.slug}`}
          className="studio-switcher__pill"
          aria-current={activeSlug === g.slug ? "page" : undefined}
        >
          {g.label}
        </Link>
      ))}
    </nav>
  );
}

/** Shared editor frame with status badge, Save / Save Draft / Publish / Delete controls. */
export function DocumentEditorFrame({
  collectionSlug,
  collectionLabel,
  singularLabel,
  docId,
  isNew,
  supportsDrafts,
  currentStatus,
  title,
  subtitle,
  liveUrl,
  saving,
  warning,
  error,
  onSave,
  allowDelete = true,
  children,
}: {
  collectionSlug: string;
  collectionLabel: string;
  singularLabel: string;
  docId?: string | number;
  isNew: boolean;
  supportsDrafts?: boolean;
  currentStatus?: string | null;
  title: string;
  subtitle?: string;
  liveUrl?: string | null;
  saving: boolean;
  warning?: string | null;
  error?: string | null;
  onSave: (targetStatus?: "draft" | "published") => Promise<void> | void;
  allowDelete?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const { toasts, push } = useToasts();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const wasSaving = useRef(false);

  useEffect(() => {
    if (wasSaving.current && !saving && !error) {
      push("ok", warning ? "Saved with notice" : "Changes saved");
    }
    wasSaving.current = saving;
  }, [saving, error, warning, push]);

  const handleDelete = async () => {
    if (!docId || isNew) return;
    setDeleting(true);
    const res = await deleteCollectionDocAction(collectionSlug, docId);
    setDeleting(false);
    if (!res.ok) {
      push("danger", res.error);
      setConfirmDelete(false);
      return;
    }
    router.push(`/studio/manage/${collectionSlug}`);
    router.refresh();
  };

  return (
    <>
      <ManageNavStrip activeSlug={collectionSlug} />

      <ViewHeader
        eyebrow={`${collectionLabel} · ${isNew ? "New" : `#${docId}`}`}
        title={title || `New ${singularLabel}`}
        description={subtitle ?? `Edits save directly through Payload (${collectionSlug}) with your operator session and trigger live revalidation.`}
        aside={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Link className="studio-btn studio-btn--sm" href={`/studio/manage/${collectionSlug}`}>
              ← All {collectionLabel}
            </Link>
            {liveUrl ? (
              <Link className="studio-btn studio-btn--sm" href={liveUrl} target="_blank" rel="noopener">
                View live <SIcon name="arrowUpRight" size={11} />
              </Link>
            ) : null}
            {supportsDrafts ? (
              <>
                <Chip tone={currentStatus === "published" ? "ok" : "warn"}>
                  {currentStatus === "published" ? "published" : "draft"}
                </Chip>
                <button
                  type="button"
                  className="studio-btn"
                  disabled={saving || deleting}
                  onClick={() => void onSave("draft")}
                >
                  {saving ? "Saving…" : "Save draft"}
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--primary"
                  disabled={saving || deleting}
                  onClick={() => void onSave("published")}
                >
                  {saving ? "Publishing…" : currentStatus === "published" ? "Update published" : "Publish"}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="studio-btn studio-btn--primary"
                disabled={saving || deleting}
                onClick={() => void onSave()}
              >
                {saving ? "Saving…" : isNew ? `Create ${singularLabel}` : "Save changes"}
              </button>
            )}
          </div>
        }
      />

      {error ? <div className="studio-login__err">{error}</div> : null}
      {warning ? (
        <div className="studio-warn-banner">
          <SIcon name="alert" size={14} />
          <span>{warning}</span>
        </div>
      ) : null}

      {children}

      {!isNew && allowDelete && docId !== undefined ? (
        <div className="studio-danger-bar">
          <div>
            <strong style={{ fontSize: 12.5 }}>Danger zone</strong>
            <p className="studio-tiny" style={{ margin: "2px 0 0" }}>
              Deleting removes this record from Postgres and revalidates dependent routes.
            </p>
          </div>
          {confirmDelete ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="studio-tiny" style={{ color: "var(--s-danger)" }}>
                Confirm delete?
              </span>
              <button
                type="button"
                className="studio-btn studio-btn--sm studio-btn--danger"
                disabled={deleting}
                onClick={() => void handleDelete()}
              >
                {deleting ? "Deleting…" : "Yes, delete permanently"}
              </button>
              <button type="button" className="studio-btn studio-btn--sm" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" className="studio-btn studio-btn--sm studio-btn--danger" onClick={() => setConfirmDelete(true)}>
              Delete {singularLabel}
            </button>
          )}
        </div>
      ) : null}

      <Toasts items={toasts} />
    </>
  );
}

/** Reusable tag/string list input (used for stack, topics, visualVectors, componentStates). */
export function StringListField({
  label,
  hint,
  items,
  onChange,
  placeholder,
  dir,
  maxItems,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  maxItems?: number;
}) {
  const canAdd = maxItems === undefined || items.length < maxItems;
  return (
    <div className="studio-field">
      <label>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: 6 }}>
            <input
              className="studio-input"
              dir={dir}
              value={item}
              placeholder={placeholder}
              onChange={(e) => onChange(items.map((x, j) => (j === idx ? e.target.value : x)))}
            />
            <button
              type="button"
              className="studio-btn studio-btn--sm"
              onClick={() => onChange(items.filter((_, j) => j !== idx))}
              aria-label="Remove item"
            >
              <SIcon name="x" size={11} />
            </button>
          </div>
        ))}
        {canAdd ? (
          <div>
            <button type="button" className="studio-btn studio-btn--sm" onClick={() => onChange([...items, ""])}>
              + Add item
            </button>
          </div>
        ) : null}
      </div>
      {hint ? <p className="studio-tiny" style={{ margin: "3px 0 0" }}>{hint}</p> : null}
    </div>
  );
}

/** Generate URL-safe slug from English title/name. */
export function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
