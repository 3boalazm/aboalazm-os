"use client";

import { useCallback, useEffect, useState } from "react";
import { Drawer } from "@/components/studio/interactive";
import { SIcon } from "@/components/studio/ui";
import { searchMediaForPickerAction } from "@/app/studio/manage/actions";
import type { Media } from "@/payload-types";

export interface MediaRef {
  id: number;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  altAr?: string | null;
}

export function normalizeMediaRef(val: unknown): MediaRef | null {
  if (!val) return null;
  if (typeof val === "number" && Number.isFinite(val)) return { id: val };
  if (typeof val === "object" && "id" in val) {
    const obj = val as Record<string, unknown>;
    const id = typeof obj.id === "number" ? obj.id : Number(obj.id);
    if (!Number.isFinite(id)) return null;
    return {
      id,
      url: typeof obj.url === "string" ? obj.url : null,
      filename: typeof obj.filename === "string" ? obj.filename : null,
      mimeType: typeof obj.mimeType === "string" ? obj.mimeType : null,
      filesize: typeof obj.filesize === "number" ? obj.filesize : null,
      width: typeof obj.width === "number" ? obj.width : null,
      height: typeof obj.height === "number" ? obj.height : null,
      alt: typeof obj.alt === "string" ? obj.alt : null,
      altAr: typeof obj.altAr === "string" ? obj.altAr : null,
    };
  }
  return null;
}

export function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function uploadMediaViaRest(opts: {
  file: File;
  alt: string;
  altAr?: string;
  id?: number | string;
}): Promise<{ ok: true; media: MediaRef } | { ok: false; error: string }> {
  const formData = new FormData();
  formData.append("file", opts.file);
  formData.append("_payload", JSON.stringify({ alt: opts.alt.trim(), altAr: opts.altAr?.trim() || "" }));

  const target = opts.id ? `/api/media/${opts.id}` : "/api/media";
  const method = opts.id ? "PATCH" : "POST";

  try {
    const res = await fetch(target, {
      method,
      body: formData,
      credentials: "include",
    });
    const json = (await res.json().catch(() => ({}))) as {
      doc?: Media;
      errors?: { message?: string }[];
      message?: string;
    };
    if (!res.ok || !json.doc) {
      const msg = json.errors?.[0]?.message || json.message || `فشل الرفع (${res.status})`;
      return { ok: false, error: msg };
    }
    const ref = normalizeMediaRef(json.doc);
    if (!ref) return { ok: false, error: "أرجع الخادم مرجع وسائط غير صالح." };
    return { ok: true, media: ref };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "خطأ في الشبكة أثناء الرفع." };
  }
}

function isPdf(ref: MediaRef): boolean {
  return Boolean(ref.mimeType?.includes("pdf") || ref.filename?.toLowerCase().endsWith(".pdf"));
}

export function MediaPickerField({
  label,
  hint,
  value,
  onChange,
  mimePrefix,
  accept = "image/*,application/pdf",
  required,
}: {
  label: string;
  hint?: string;
  value: MediaRef | null;
  onChange: (next: MediaRef | null) => void;
  mimePrefix?: "image/" | "application/pdf";
  accept?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<MediaRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [altAr, setAltAr] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);
      const res = await searchMediaForPickerAction({ search: query, mimePrefix });
      setLoading(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setItems(res.docs.map(normalizeMediaRef).filter((x): x is MediaRef => Boolean(x)));
    },
    [mimePrefix],
  );

  useEffect(() => {
    if (!open) return;
    void load(search);
  }, [open, search, load]);

  const handleUpload = async () => {
    if (!file) return;
    const effectiveAlt = alt.trim() || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    setUploading(true);
    setError(null);
    const res = await uploadMediaViaRest({ file, alt: effectiveAlt, altAr });
    setUploading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setFile(null);
    setAlt("");
    setAltAr("");
    onChange(res.media);
    setOpen(false);
  };

  return (
    <div className="studio-field">
      <label>
        {label}
        {required ? " *" : ""}
      </label>

      <div className="studio-media-card">
        {value ? (
          <>
            <div className="studio-media-thumb">
              {value.url && !isPdf(value) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value.url} alt={value.alt ?? value.filename ?? "الملف المختار"} />
              ) : (
                <span className="studio-media-pdf">
                  <SIcon name={isPdf(value) ? "layers" : "image"} size={18} />
                  <span>{isPdf(value) ? "PDF" : `#${value.id}`}</span>
                </span>
              )}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <strong style={{ display: "block", fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value.alt || value.filename || `ملف #${value.id}`}
              </strong>
              <span className="studio-tiny studio-mono" style={{ display: "block" }}>
                {value.filename ?? "مختار"}
                {value.width && value.height ? ` · ${value.width}×${value.height}` : ""}
                {value.filesize ? ` · ${formatBytes(value.filesize)}` : ""}
              </span>
            </div>
          </>
        ) : (
          <div style={{ flex: 1 }}>
            <span className="studio-sub" style={{ fontSize: 13 }}>
              لم يُختر ملف بعد
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button type="button" className="studio-btn studio-btn--sm" onClick={() => setOpen(true)}>
            <SIcon name="image" size={13} /> {value ? "تغيير" : "اختيار / رفع ملف"}
          </button>
          {value ? (
            <button type="button" className="studio-btn studio-btn--sm" onClick={() => onChange(null)}>
              إزالة
            </button>
          ) : null}
        </div>
      </div>

      {hint ? <p className="studio-tiny" style={{ margin: "3px 0 0" }}>{hint}</p> : null}

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={
          <div>
            <strong style={{ fontSize: 15 }}>مكتبة الوسائط</strong>
            <span className="studio-tiny" style={{ display: "block" }}>
              اختر ملفًا موجودًا أو ارفع ملفًا جديدًا مباشرة إلى Vercel Blob
            </span>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* رفع سريع */}
          <div className="studio-upload-box">
            <p className="studio-up" style={{ margin: "0 0 8px" }}>
              رفع ملف جديد
            </p>
            <input
              type="file"
              accept={accept}
              className="studio-input"
              onChange={(e) => {
                const picked = e.target.files?.[0] ?? null;
                setFile(picked);
                if (picked && !alt) {
                  setAlt(picked.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
                }
              }}
            />
            {file ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBlockStart: 10 }}>
                <div className="studio-field" style={{ marginBlockEnd: 0 }}>
                  <label>النص البديل (بالإنجليزية) *</label>
                  <input className="studio-input" dir="ltr" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the asset" />
                </div>
                <div className="studio-field" style={{ marginBlockEnd: 0 }}>
                  <label>النص البديل (بالعربية)</label>
                  <input className="studio-input" dir="rtl" value={altAr} onChange={(e) => setAltAr(e.target.value)} placeholder="وصف الصورة بالعربية" />
                </div>
                <button type="button" className="studio-btn studio-btn--primary" disabled={uploading} onClick={() => void handleUpload()}>
                  {uploading ? "جارٍ الرفع…" : `رفع ${file.name}`}
                </button>
              </div>
            ) : null}
          </div>

          {error ? <div className="studio-login__err">{error}</div> : null}

          {/* البحث في المكتبة */}
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>البحث في المكتبة</label>
            <input
              className="studio-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="تصفية حسب النص البديل أو اسم الملف…"
            />
          </div>

          {loading ? (
            <p className="studio-tiny">جارٍ تحميل الملفات…</p>
          ) : items.length === 0 ? (
            <p className="studio-sub">لا توجد ملفات مطابقة.</p>
          ) : (
            <div className="studio-media-grid">
              {items.map((item) => {
                const active = value?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`studio-media-pick ${active ? "studio-media-pick--active" : ""}`}
                    onClick={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                  >
                    <div className="studio-media-pick__preview">
                      {item.url && !isPdf(item) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt={item.alt ?? item.filename ?? "ملف"} />
                      ) : (
                        <span className="studio-media-pdf">
                          <SIcon name={isPdf(item) ? "layers" : "image"} size={20} />
                          <span>{isPdf(item) ? "PDF" : `#${item.id}`}</span>
                        </span>
                      )}
                    </div>
                    <span className="studio-media-pick__label">{item.alt || item.filename || `#${item.id}`}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
