"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIcon, Tile, shortTime } from "@/components/studio/ui";
import { DocumentEditorFrame } from "@/components/studio/cms/editor-shell";
import { formatBytes, uploadMediaViaRest } from "@/components/studio/cms/media-picker";
import { saveCollectionDocAction } from "@/app/studio/manage/actions";

export function MediaEditor({
  initialDoc,
  isNew,
}: {
  initialDoc: Record<string, unknown> | null;
  isNew: boolean;
}) {
  const router = useRouter();
  const doc = initialDoc ?? {};

  const [alt, setAlt] = useState(String(doc.alt ?? ""));
  const [altAr, setAltAr] = useState(String(doc.altAr ?? ""));
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const url = typeof doc.url === "string" ? doc.url : null;
  const filename = typeof doc.filename === "string" ? doc.filename : null;
  const mimeType = typeof doc.mimeType === "string" ? doc.mimeType : null;
  const filesize = typeof doc.filesize === "number" ? doc.filesize : null;
  const width = typeof doc.width === "number" ? doc.width : null;
  const height = typeof doc.height === "number" ? doc.height : null;
  const pdf = Boolean(mimeType?.includes("pdf") || filename?.toLowerCase().endsWith(".pdf"));

  const handleSave = async () => {
    setError(null);
    if (!alt.trim()) {
      setError("النص البديل (بالإنجليزية) مطلوب.");
      return;
    }

    setSaving(true);
    if (isNew || file) {
      if (!file) {
        setSaving(false);
        setError("اختر صورة أو ملف PDF لرفعه.");
        return;
      }
      const res = await uploadMediaViaRest({
        file,
        alt: alt.trim(),
        altAr: altAr.trim(),
        id: isNew ? undefined : (doc.id as number | string),
      });
      setSaving(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setFile(null);
      if (isNew) {
        router.push(`/studio/manage/media/${res.media.id}`);
      }
      router.refresh();
      return;
    }

    const res = await saveCollectionDocAction("media", String(doc.id ?? ""), {
      alt: alt.trim(),
      altAr: altAr.trim() || null,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="media"
      collectionLabel="الوسائط"
      singularLabel="ملف"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      title={altAr || alt || filename || "رفع ملف وسائط"}
      liveUrl={url}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <div className="studio-bento">
        <div className="studio-w7">
          <Tile span="w12" title={<b>{isNew ? "رفع ملف جديد" : "معاينة الملف واستبداله"}</b>}>
            {!isNew && url ? (
              <div className="studio-media-stage">
                {!pdf ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={alt || filename || "ملف وسائط مرفوع"} />
                ) : (
                  <div className="studio-media-pdf" style={{ padding: 32 }}>
                    <SIcon name="layers" size={34} />
                    <strong>{filename}</strong>
                    <a className="studio-btn studio-btn--sm" href={url} target="_blank" rel="noopener">
                      فتح ملف PDF <SIcon name="arrowUpRight" size={13} />
                    </a>
                  </div>
                )}
              </div>
            ) : null}

            <div className="studio-field" style={{ marginBlockEnd: 0 }}>
              <label htmlFor="media-file">{isNew ? "اختر صورة أو ملف PDF *" : "استبدال الملف (اختياري)"}</label>
              <input
                id="media-file"
                type="file"
                accept="image/*,application/pdf"
                className="studio-input"
                onChange={(e) => {
                  const picked = e.target.files?.[0] ?? null;
                  setFile(picked);
                  if (picked && !alt) {
                    setAlt(picked.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
                  }
                }}
              />
              <p className="studio-tiny">
                الصيغ المدعومة: جميع الصور (<code>image/*</code>) وملفات PDF (<code>application/pdf</code>). تُحفظ على Vercel Blob في الإنتاج.
              </p>
            </div>
          </Tile>
        </div>

        <div className="studio-w5" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>إمكانية الوصول والبيانات الوصفية</b>}>
            <div className="studio-field">
              <label htmlFor="media-alt">النص البديل (بالإنجليزية) *</label>
              <input id="media-alt" className="studio-input" dir="ltr" value={alt} onChange={(e) => setAlt(e.target.value)} />
            </div>
            <div className="studio-field">
              <label htmlFor="media-alt-ar">النص البديل (بالعربية)</label>
              <input id="media-alt-ar" className="studio-input" dir="rtl" value={altAr} onChange={(e) => setAltAr(e.target.value)} />
            </div>

            {!isNew ? (
              <dl className="studio-kv">
                <div className="studio-kv__row">
                  <dt>اسم الملف</dt>
                  <dd className="studio-mono">{filename ?? "—"}</dd>
                </div>
                <div className="studio-kv__row">
                  <dt>النوع</dt>
                  <dd className="studio-mono">{mimeType ?? "—"}</dd>
                </div>
                <div className="studio-kv__row">
                  <dt>الحجم</dt>
                  <dd className="studio-mono">{formatBytes(filesize)}</dd>
                </div>
                {width && height ? (
                  <div className="studio-kv__row">
                    <dt>الأبعاد</dt>
                    <dd className="studio-mono">{width} × {height}px</dd>
                  </div>
                ) : null}
                {doc.updatedAt ? (
                  <div className="studio-kv__row">
                    <dt>آخر تعديل</dt>
                    <dd>{shortTime(String(doc.updatedAt))}</dd>
                  </div>
                ) : null}
                {url ? (
                  <div className="studio-kv__row">
                    <dt>الرابط العام</dt>
                    <dd>
                      <button
                        type="button"
                        className="studio-btn studio-btn--sm"
                        onClick={() => {
                          void navigator.clipboard?.writeText(url);
                          setCopied(true);
                          window.setTimeout(() => setCopied(false), 1800);
                        }}
                      >
                        {copied ? "تم النسخ!" : "نسخ الرابط العام"}
                      </button>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </Tile>
        </div>
      </div>
    </DocumentEditorFrame>
  );
}
