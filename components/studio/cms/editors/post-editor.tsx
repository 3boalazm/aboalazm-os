"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tile } from "@/components/studio/ui";
import { DocumentEditorFrame, StringListField, slugify } from "@/components/studio/cms/editor-shell";
import { LexicalBlockEditor } from "@/components/studio/cms/lexical-editor";
import { fromLexical, toLexicalState, type EditableBlock } from "@/lib/studio/lexical";
import { saveCollectionDocAction } from "@/app/studio/manage/actions";

export function PostEditor({
  initialDoc,
  isNew,
}: {
  initialDoc: Record<string, unknown> | null;
  isNew: boolean;
}) {
  const router = useRouter();
  const doc = initialDoc ?? {};

  const [title, setTitle] = useState(String(doc.title ?? ""));
  const [slug, setSlug] = useState(String(doc.slug ?? ""));
  const [indexCode, setIndexCode] = useState(String(doc.index ?? ""));
  const [standfirst, setStandfirst] = useState(String(doc.standfirst ?? ""));
  const [publishedAt, setPublishedAt] = useState(() => {
    const raw = doc.publishedAt ? String(doc.publishedAt) : "";
    return raw ? raw.slice(0, 10) : "";
  });
  const [lang, setLang] = useState<"en" | "ar">(doc.lang === "ar" ? "ar" : "en");
  const [topics, setTopics] = useState<string[]>(Array.isArray(doc.topics) ? doc.topics.map(String) : []);
  const [blocks, setBlocks] = useState<EditableBlock[]>(() => fromLexical(doc.body));
  const [docStatus, setDocStatus] = useState<string>(String(doc._status ?? "draft"));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (targetStatus?: "draft" | "published") => {
    setSaving(true);
    setError(null);
    const nextStatus = targetStatus ?? (docStatus === "published" ? "published" : "draft");
    const dir = lang === "ar" ? "rtl" : "ltr";

    const res = await saveCollectionDocAction("posts", isNew ? "new" : String(doc.id ?? ""), {
      title: title.trim(),
      slug: slug.trim(),
      index: indexCode.trim() || null,
      standfirst: standfirst.trim() || null,
      publishedAt: publishedAt ? new Date(`${publishedAt}T12:00:00.000Z`).toISOString() : null,
      lang,
      topics: topics.map((t) => t.trim()).filter(Boolean).slice(0, 5),
      body: toLexicalState(blocks, dir),
      _status: nextStatus,
    });

    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDocStatus(nextStatus);
    if (isNew && res.id) {
      router.push(`/studio/manage/posts/${res.id}`);
    }
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="posts"
      collectionLabel="المقالات"
      singularLabel="مقال"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      supportsDrafts
      currentStatus={docStatus}
      title={title || "مقال بدون عنوان"}
      liveUrl={!isNew && slug && docStatus === "published" ? `/${lang}/writing/${slug}` : null}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <div className="studio-bento">
        <div className="studio-w8" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>ترويسة المقال</b>}>
            <div className="studio-field">
              <label htmlFor="post-title">العنوان *</label>
              <input
                id="post-title"
                className="studio-input"
                dir={lang === "ar" ? "rtl" : "ltr"}
                value={title}
                onChange={(e) => {
                  const v = e.target.value;
                  setTitle(v);
                  if (isNew && (!slug || slug === slugify(title))) setSlug(slugify(v));
                }}
              />
              <span className="studio-tiny">
                {title.length} حرف {title.length > 60 ? "· تقتطع محركات البحث العناوين فوق ~60 حرفًا" : ""}
              </span>
            </div>

            <div className="studio-field" style={{ marginBlockEnd: 0 }}>
              <label htmlFor="post-standfirst">المقدمة المختصرة / الوصف التعريفي للسيو ({standfirst.length}/120)</label>
              <textarea
                id="post-standfirst"
                className="studio-input"
                dir={lang === "ar" ? "rtl" : "ltr"}
                maxLength={120}
                rows={2}
                value={standfirst}
                onChange={(e) => setStandfirst(e.target.value)}
                placeholder="جملة مركّزة تلخّص المقال — وتُستخدم أيضًا كوصف meta description لمحركات البحث."
              />
            </div>
          </Tile>

          <Tile span="w12" title={<b>محتوى المقال (كتل Lexical)</b>}>
            <LexicalBlockEditor blocks={blocks} lang={lang} onChange={setBlocks} />
          </Tile>
        </div>

        <div className="studio-w4" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>البيانات الوصفية والتصنيف</b>}>
            <div className="studio-field">
              <label htmlFor="post-slug">المعرّف (Slug) *</label>
              <input
                id="post-slug"
                className="studio-input"
                dir="ltr"
                style={{ fontFamily: "var(--s-font-mono)", fontSize: 13 }}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="studio-field">
              <label htmlFor="post-index">رقم السجل (W-Index)</label>
              <input
                id="post-index"
                className="studio-input"
                dir="ltr"
                value={indexCode}
                onChange={(e) => setIndexCode(e.target.value)}
                placeholder="مثال: W-003"
              />
            </div>

            <div className="studio-field">
              <label htmlFor="post-lang">لغة المقال</label>
              <select
                id="post-lang"
                className="studio-input"
                value={lang}
                onChange={(e) => setLang(e.target.value === "ar" ? "ar" : "en")}
              >
                <option value="en">الإنجليزية (en)</option>
                <option value="ar">العربية (ar)</option>
              </select>
            </div>

            <div className="studio-field">
              <label htmlFor="post-date">تاريخ النشر</label>
              <input
                id="post-date"
                type="date"
                dir="ltr"
                className="studio-input"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>

            <StringListField
              label="المواضيع (الحد الأقصى 5)"
              items={topics}
              onChange={setTopics}
              maxItems={5}
              dir={lang === "ar" ? "rtl" : "ltr"}
              placeholder="مثال: أنظمة التصميم"
            />
          </Tile>
        </div>
      </div>
    </DocumentEditorFrame>
  );
}
