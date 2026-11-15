"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tile } from "@/components/studio/ui";
import { DocumentEditorFrame, StringListField, slugify } from "@/components/studio/cms/editor-shell";
import { MediaPickerField, normalizeMediaRef, type MediaRef } from "@/components/studio/cms/media-picker";
import { saveCollectionDocAction } from "@/app/studio/manage/actions";

const DISCIPLINES = [
  "Systemic Identity",
  "Product Architecture",
  "Commerce Platform",
  "Design Infrastructure",
  "Identity Engineering",
  "Studio & Identity",
] as const;

export function ProjectEditor({
  initialDoc,
  isNew,
  deliveryStatusAvailable,
}: {
  initialDoc: Record<string, unknown> | null;
  isNew: boolean;
  deliveryStatusAvailable: boolean;
}) {
  const router = useRouter();
  const doc = initialDoc ?? {};
  const accent = (doc.accent as { primary?: string; secondary?: string } | undefined) ?? {};

  const [name, setName] = useState(String(doc.name ?? ""));
  const [nameAr, setNameAr] = useState(String(doc.nameAr ?? ""));
  const [slug, setSlug] = useState(String(doc.slug ?? ""));
  const [category, setCategory] = useState(String(doc.category ?? "design"));
  const [discipline, setDiscipline] = useState(String(doc.discipline ?? DISCIPLINES[0]));
  const [year, setYear] = useState(String(doc.year ?? String(new Date().getFullYear())));
  const [status, setStatus] = useState(String(doc.status ?? "complete"));
  const [hasCaseStudy, setHasCaseStudy] = useState(Boolean(doc.hasCaseStudy));
  const [isUiUx, setIsUiUx] = useState(Boolean(doc.isUiUx));
  const [stack, setStack] = useState<string[]>(Array.isArray(doc.stack) ? doc.stack.map(String) : []);
  const [outcome, setOutcome] = useState(String(doc.outcome ?? ""));
  const [outcomeAr, setOutcomeAr] = useState(String(doc.outcomeAr ?? ""));
  const [thumbnail, setThumbnail] = useState<MediaRef | null>(() => normalizeMediaRef(doc.thumbnail));
  const [primaryGlow, setPrimaryGlow] = useState(String(accent.primary ?? "rgba(255, 107, 71, 0.18)"));
  const [secondaryGlow, setSecondaryGlow] = useState(String(accent.secondary ?? "rgba(96, 165, 250, 0.14)"));
  const [externalUrl, setExternalUrl] = useState(String(doc.externalUrl ?? ""));
  const [liveUrl, setLiveUrl] = useState(String(doc.liveUrl ?? ""));
  const [docStatus, setDocStatus] = useState<string>(String(doc._status ?? "draft"));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(
    deliveryStatusAvailable
      ? null
      : "تنبيه: عمود `projects.status` غير موجود في مخطط قاعدة البيانات الحالية (42703). تُحفظ التعديلات بأمان دون المساس بحالة التسليم.",
  );

  const handleSave = async (targetStatus?: "draft" | "published") => {
    setSaving(true);
    setError(null);
    const nextStatus = targetStatus ?? (docStatus === "published" ? "published" : "draft");
    const payload: Record<string, unknown> = {
      name: name.trim(),
      nameAr: nameAr.trim() || null,
      slug: slug.trim(),
      category,
      discipline,
      year: year.trim(),
      hasCaseStudy,
      isUiUx,
      stack: stack.map((s) => s.trim()).filter(Boolean),
      outcome: outcome.trim(),
      outcomeAr: outcomeAr.trim() || null,
      thumbnail: thumbnail?.id ?? null,
      accent: {
        primary: primaryGlow.trim(),
        secondary: secondaryGlow.trim(),
      },
      externalUrl: externalUrl.trim() || null,
      liveUrl: liveUrl.trim() || null,
      _status: nextStatus,
    };
    if (deliveryStatusAvailable) {
      payload.status = status;
    }

    const res = await saveCollectionDocAction("projects", isNew ? "new" : String(doc.id ?? ""), payload);
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDocStatus(nextStatus);
    if (res.warning) setWarning(res.warning);
    if (isNew && res.id) {
      router.push(`/studio/manage/projects/${res.id}`);
    }
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="projects"
      collectionLabel="المشاريع"
      singularLabel="مشروع"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      supportsDrafts
      currentStatus={docStatus}
      title={nameAr || name || "مشروع بدون عنوان"}
      liveUrl={!isNew && slug ? (hasCaseStudy ? `/en/case-studies/${slug}` : "/en/work") : null}
      saving={saving}
      warning={warning}
      error={error}
      onSave={handleSave}
    >
      <div className="studio-bento">
        <div className="studio-w8" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>الهوية والوصف</b>}>
            <div className="studio-grid-2">
              <div className="studio-field">
                <label htmlFor="proj-name">الاسم (بالإنجليزية) *</label>
                <input
                  id="proj-name"
                  className="studio-input"
                  dir="ltr"
                  value={name}
                  onChange={(e) => {
                    const v = e.target.value;
                    setName(v);
                    if (isNew && (!slug || slug === slugify(name))) setSlug(slugify(v));
                  }}
                />
              </div>
              <div className="studio-field">
                <label htmlFor="proj-name-ar">الاسم (بالعربية)</label>
                <input
                  id="proj-name-ar"
                  className="studio-input"
                  dir="rtl"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                />
              </div>
            </div>

            <StringListField
              label="التقنيات والأدوات (Stack)"
              hint="تظهر كوسوم مصغرة على بطاقات الأعمال."
              items={stack}
              onChange={setStack}
              dir="ltr"
              placeholder="مثال: Next.js, Payload, TypeScript"
            />

            <div className="studio-grid-2">
              <div className="studio-field">
                <label htmlFor="proj-outcome">النتيجة / المخرج (بالإنجليزية) *</label>
                <textarea
                  id="proj-outcome"
                  className="studio-input"
                  dir="ltr"
                  rows={4}
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                />
              </div>
              <div className="studio-field">
                <label htmlFor="proj-outcome-ar">النتيجة / المخرج (بالعربية)</label>
                <textarea
                  id="proj-outcome-ar"
                  className="studio-input"
                  dir="rtl"
                  rows={4}
                  value={outcomeAr}
                  onChange={(e) => setOutcomeAr(e.target.value)}
                />
              </div>
            </div>
          </Tile>

          <Tile span="w12" title={<b>الصورة والتوهج المحيط</b>}>
            <MediaPickerField
              label="الصورة المصغرة"
              required
              value={thumbnail}
              onChange={setThumbnail}
              mimePrefix="image/"
              accept="image/*"
            />

            <div className="studio-grid-2">
              <div className="studio-field">
                <label htmlFor="proj-glow-1">لون التوهج الأساسي *</label>
                <input
                  id="proj-glow-1"
                  className="studio-input"
                  dir="ltr"
                  style={{ fontFamily: "var(--s-font-mono)", fontSize: 13 }}
                  value={primaryGlow}
                  onChange={(e) => setPrimaryGlow(e.target.value)}
                />
              </div>
              <div className="studio-field">
                <label htmlFor="proj-glow-2">لون التوهج الثانوي *</label>
                <input
                  id="proj-glow-2"
                  className="studio-input"
                  dir="ltr"
                  style={{ fontFamily: "var(--s-font-mono)", fontSize: 13 }}
                  value={secondaryGlow}
                  onChange={(e) => setSecondaryGlow(e.target.value)}
                />
              </div>
            </div>

            <div
              className="studio-glow-preview"
              style={{
                background: `radial-gradient(circle at 20% 50%, ${primaryGlow}, transparent 60%), radial-gradient(circle at 80% 50%, ${secondaryGlow}, transparent 60%), rgb(12 11 22 / 0.8)`,
              }}
            >
              <span>معاينة التوهج المحيط</span>
            </div>
          </Tile>

          <Tile span="w12" title={<b>الروابط والوجهات</b>}>
            {!hasCaseStudy ? (
              <div className="studio-field">
                <label htmlFor="proj-ext">الرابط الخارجي</label>
                <input
                  id="proj-ext"
                  className="studio-input"
                  dir="ltr"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://…"
                />
                <p className="studio-tiny">رابط الموقع المباشر أو المستودع أو Behance عند تعطيل خيار دراسة الحالة.</p>
              </div>
            ) : null}

            {isUiUx || category === "development" ? (
              <div className="studio-field">
                <label htmlFor="proj-live">رابط المعاينة الحية</label>
                <input
                  id="proj-live"
                  className="studio-input"
                  dir="ltr"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://…"
                />
                <p className="studio-tiny">يُستخدم في بطاقات التطوير ومعرض المعاينات الحية (/work-ui).</p>
              </div>
            ) : null}

            {hasCaseStudy && !isUiUx && category !== "development" ? (
              <p className="studio-sub">يفتح هذا المشروع دراسة الحالة المرتبطة به مباشرة.</p>
            ) : null}
          </Tile>
        </div>

        <div className="studio-w4" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
          <Tile span="w12" title={<b>التصنيف والخصائص</b>}>
            <div className="studio-field">
              <label htmlFor="proj-slug">المعرّف (Slug) *</label>
              <input
                id="proj-slug"
                className="studio-input"
                dir="ltr"
                style={{ fontFamily: "var(--s-font-mono)", fontSize: 13 }}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="studio-field">
              <label htmlFor="proj-cat">الفئة *</label>
              <select id="proj-cat" className="studio-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="design">تصميم وهوية بصرية</option>
                <option value="development">تطوير وبرمجة</option>
              </select>
            </div>

            <div className="studio-field">
              <label htmlFor="proj-disc">التخصص (قيمة معتمدة) *</label>
              <select id="proj-disc" className="studio-input" value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="studio-field">
              <label htmlFor="proj-year">السنة *</label>
              <input id="proj-year" className="studio-input" dir="ltr" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>

            {deliveryStatusAvailable ? (
              <div className="studio-field">
                <label htmlFor="proj-status">حالة التسليم</label>
                <select id="proj-status" className="studio-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="complete">مكتمل</option>
                  <option value="in-progress">قيد التنفيذ</option>
                </select>
              </div>
            ) : null}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBlockStart: 8 }}>
              <label className="studio-check">
                <input type="checkbox" checked={hasCaseStudy} onChange={(e) => setHasCaseStudy(e.target.checked)} />
                <span>يمتلك دراسة حالة (<code>/case-studies/[slug]</code>)</span>
              </label>
              <label className="studio-check">
                <input type="checkbox" checked={isUiUx} onChange={(e) => setIsUiUx(e.target.checked)} />
                <span>عرض في معرض UI/UX (<code>/work-ui</code>)</span>
              </label>
            </div>
          </Tile>
        </div>
      </div>
    </DocumentEditorFrame>
  );
}
