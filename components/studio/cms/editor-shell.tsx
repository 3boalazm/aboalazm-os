"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Chip, SIcon, ViewHeader } from "@/components/studio/ui";
import { Toasts, useToasts } from "@/components/studio/interactive";
import { deleteCollectionDocAction } from "@/app/studio/manage/actions";
import { STUDIO_COLLECTIONS, STUDIO_GLOBALS } from "@/lib/studio/cms-meta";

/** شريط التنقل السريع بين المجموعات والإعدادات العامة في إدارة المحتوى. */
export function ManageNavStrip({ activeSlug }: { activeSlug: string }) {
  return (
    <nav className="studio-switcher" aria-label="مجموعات وإعدادات نظام المحتوى">
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

/** إطار التحرير المشترك مع شارة الحالة وأزرار الحفظ / حفظ كمسودة / النشر / الحذف. */
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
      push("ok", warning ? "تم الحفظ مع وجود تنبيه" : "تم حفظ التعديلات بنجاح");
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
        eyebrow={`${collectionLabel} · ${isNew ? "جديد" : `#${docId}`}`}
        title={title || `إضافة ${singularLabel}`}
        description={
          subtitle ??
          `تُحفظ التعديلات مباشرة عبر Payload (${collectionSlug}) بنفس جلسة دخولك وتُحدّث صفحات الموقع تلقائيًا.`
        }
        aside={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Link className="studio-btn studio-btn--sm" href={`/studio/manage/${collectionSlug}`}>
              <SIcon name="chevronRight" size={13} /> كل {collectionLabel}
            </Link>
            {liveUrl ? (
              <Link className="studio-btn studio-btn--sm" href={liveUrl} target="_blank" rel="noopener">
                معاينة على الموقع <SIcon name="arrowUpRight" size={12} />
              </Link>
            ) : null}
            {supportsDrafts ? (
              <>
                <Chip tone={currentStatus === "published" ? "ok" : "warn"}>
                  {currentStatus === "published" ? "منشور" : "مسودة"}
                </Chip>
                <button
                  type="button"
                  className="studio-btn"
                  disabled={saving || deleting}
                  onClick={() => void onSave("draft")}
                >
                  {saving ? "جارٍ الحفظ…" : "حفظ كمسودة"}
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--primary"
                  disabled={saving || deleting}
                  onClick={() => void onSave("published")}
                >
                  {saving ? "جارٍ النشر…" : currentStatus === "published" ? "تحديث المنشور" : "نشر الآن"}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="studio-btn studio-btn--primary"
                disabled={saving || deleting}
                onClick={() => void onSave()}
              >
                {saving ? "جارٍ الحفظ…" : isNew ? `إنشاء ${singularLabel}` : "حفظ التعديلات"}
              </button>
            )}
          </div>
        }
      />

      {error ? <div className="studio-login__err">{error}</div> : null}
      {warning ? (
        <div className="studio-warn-banner">
          <SIcon name="alert" size={16} />
          <span>{warning}</span>
        </div>
      ) : null}

      {children}

      {!isNew && allowDelete && docId !== undefined ? (
        <div className="studio-danger-bar">
          <div>
            <strong style={{ fontSize: 14 }}>منطقة الخطر</strong>
            <p className="studio-tiny" style={{ margin: "2px 0 0" }}>
              يؤدي الحذف إلى إزالة هذا السجل نهائيًا من PostgreSQL وتحديث المسارات المرتبطة به.
            </p>
          </div>
          {confirmDelete ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span className="studio-tiny" style={{ color: "var(--s-danger)" }}>
                هل تؤكد الحذف النهائي؟
              </span>
              <button
                type="button"
                className="studio-btn studio-btn--sm studio-btn--danger"
                disabled={deleting}
                onClick={() => void handleDelete()}
              >
                {deleting ? "جارٍ الحذف…" : "نعم، احذف نهائيًا"}
              </button>
              <button type="button" className="studio-btn studio-btn--sm" onClick={() => setConfirmDelete(false)}>
                إلغاء
              </button>
            </div>
          ) : (
            <button type="button" className="studio-btn studio-btn--sm studio-btn--danger" onClick={() => setConfirmDelete(true)}>
              حذف {singularLabel}
            </button>
          )}
        </div>
      ) : null}

      <Toasts items={toasts} />
    </>
  );
}

/** حقل قائمة نصوص قابل للتعديل (للتقنيات والمواضيع وغيرها). */
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
              aria-label="إزالة العنصر"
            >
              <SIcon name="x" size={13} />
            </button>
          </div>
        ))}
        {canAdd ? (
          <div>
            <button type="button" className="studio-btn studio-btn--sm" onClick={() => onChange([...items, ""])}>
              + إضافة عنصر
            </button>
          </div>
        ) : null}
      </div>
      {hint ? <p className="studio-tiny" style={{ margin: "3px 0 0" }}>{hint}</p> : null}
    </div>
  );
}

export function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
