"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIcon, Tile } from "@/components/studio/ui";
import { DocumentEditorFrame, StringListField, slugify } from "@/components/studio/cms/editor-shell";
import { MediaPickerField, normalizeMediaRef, type MediaRef } from "@/components/studio/cms/media-picker";
import { saveCollectionDocAction } from "@/app/studio/manage/actions";

type KpiRow = { value: string; label: string; labelAr: string; context: string; contextAr: string };
type CompetitorRow = { name: string; x: number; y: number; isClient: boolean };
type TokenRow = { token: string; value: string; role: string; roleAr: string };
type BreakpointRow = { bp: string; cols: string };
type ImageRow = { image: MediaRef | null; caption: string; captionAr: string; span: "full" | "half" };
type RetroRow = { verdict: "KEEP" | "CHANGE" | "DROP"; note: string; noteAr: string };

function mapKpis(raw: unknown): KpiRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = (item ?? {}) as Record<string, unknown>;
    return {
      value: String(r.value ?? ""),
      label: String(r.label ?? ""),
      labelAr: String(r.labelAr ?? ""),
      context: String(r.context ?? ""),
      contextAr: String(r.contextAr ?? ""),
    };
  });
}

function KpiArrayEditor({
  label,
  rows,
  onChange,
}: {
  label: string;
  rows: KpiRow[];
  onChange: (next: KpiRow[]) => void;
}) {
  const empty: KpiRow = { value: "", label: "", labelAr: "", context: "", contextAr: "" };
  return (
    <div className="studio-field">
      <label>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((row, i) => (
          <div key={i} className="studio-block-card">
            <div className="studio-block-card__head">
              <span className="studio-tiny studio-mono">#{i + 1}</span>
              <span className="studio-spacer" />
              <button
                type="button"
                className="studio-btn studio-btn--sm"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
                aria-label="إزالة المؤشر"
              >
                <SIcon name="x" size={13} />
              </button>
            </div>
            <div className="studio-grid-3">
              <input
                className="studio-input"
                dir="ltr"
                placeholder="القيمة * (مثل +42%)"
                value={row.value}
                onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
              />
              <input
                className="studio-input"
                dir="ltr"
                placeholder="التسمية (EN) *"
                value={row.label}
                onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              />
              <input
                className="studio-input"
                dir="rtl"
                placeholder="التسمية (عربي)"
                value={row.labelAr}
                onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, labelAr: e.target.value } : x)))}
              />
            </div>
            <div className="studio-grid-2">
              <input
                className="studio-input"
                dir="ltr"
                placeholder="السياق (EN)"
                value={row.context}
                onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, context: e.target.value } : x)))}
              />
              <input
                className="studio-input"
                dir="rtl"
                placeholder="السياق (عربي)"
                value={row.contextAr}
                onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, contextAr: e.target.value } : x)))}
              />
            </div>
          </div>
        ))}
        <div>
          <button type="button" className="studio-btn studio-btn--sm" onClick={() => onChange([...rows, empty])}>
            + إضافة صف مؤشر (KPI)
          </button>
        </div>
      </div>
    </div>
  );
}

export function CaseStudyEditor({
  initialDoc,
  isNew,
}: {
  initialDoc: Record<string, unknown> | null;
  isNew: boolean;
}) {
  const router = useRouter();
  const doc = initialDoc ?? {};
  const accent = (doc.accent as { primary?: string; secondary?: string } | undefined) ?? {};

  const [slug, setSlug] = useState(String(doc.slug ?? ""));
  const [name, setName] = useState(String(doc.name ?? ""));
  const [nameAr, setNameAr] = useState(String(doc.nameAr ?? ""));
  const [discipline, setDiscipline] = useState(String(doc.discipline ?? ""));
  const [primaryGlow, setPrimaryGlow] = useState(String(accent.primary ?? "rgba(255, 117, 79, 0.18)"));
  const [secondaryGlow, setSecondaryGlow] = useState(String(accent.secondary ?? "rgba(96, 165, 250, 0.14)"));

  const [problem, setProblem] = useState(String(doc.problem ?? ""));
  const [problemAr, setProblemAr] = useState(String(doc.problemAr ?? ""));
  const [teamScale, setTeamScale] = useState(String(doc.teamScale ?? ""));
  const [teamScaleAr, setTeamScaleAr] = useState(String(doc.teamScaleAr ?? ""));
  const [timeline, setTimeline] = useState(String(doc.timeline ?? ""));
  const [timelineAr, setTimelineAr] = useState(String(doc.timelineAr ?? ""));
  const [kpis, setKpis] = useState<KpiRow[]>(() => mapKpis(doc.kpis));

  const [researchSummary, setResearchSummary] = useState(String(doc.researchSummary ?? ""));
  const [researchSummaryAr, setResearchSummaryAr] = useState(String(doc.researchSummaryAr ?? ""));
  const [competitors, setCompetitors] = useState<CompetitorRow[]>(() =>
    Array.isArray(doc.competitors)
      ? doc.competitors.map((c) => {
          const r = (c ?? {}) as Record<string, unknown>;
          return {
            name: String(r.name ?? ""),
            x: Number(r.x ?? 50),
            y: Number(r.y ?? 50),
            isClient: Boolean(r.isClient),
          };
        })
      : [],
  );
  const [visualVectors, setVisualVectors] = useState<string[]>(
    Array.isArray(doc.visualVectors) ? doc.visualVectors.map(String) : [],
  );
  const [visualVectorsAr, setVisualVectorsAr] = useState<string[]>(
    Array.isArray(doc.visualVectorsAr) ? doc.visualVectorsAr.map(String) : [],
  );

  const [tokens, setTokens] = useState<TokenRow[]>(() =>
    Array.isArray(doc.tokens)
      ? doc.tokens.map((t) => {
          const r = (t ?? {}) as Record<string, unknown>;
          return {
            token: String(r.token ?? ""),
            value: String(r.value ?? ""),
            role: String(r.role ?? ""),
            roleAr: String(r.roleAr ?? ""),
          };
        })
      : [],
  );
  const [componentStates, setComponentStates] = useState<string[]>(
    Array.isArray(doc.componentStates) ? doc.componentStates.map(String) : [],
  );
  const [breakpoints, setBreakpoints] = useState<BreakpointRow[]>(() =>
    Array.isArray(doc.breakpoints)
      ? doc.breakpoints.map((b) => {
          const r = (b ?? {}) as Record<string, unknown>;
          return { bp: String(r.bp ?? ""), cols: String(r.cols ?? "") };
        })
      : [],
  );
  const [images, setImages] = useState<ImageRow[]>(() =>
    Array.isArray(doc.images)
      ? doc.images.map((img) => {
          const r = (img ?? {}) as Record<string, unknown>;
          return {
            image: normalizeMediaRef(r.image),
            caption: String(r.caption ?? ""),
            captionAr: String(r.captionAr ?? ""),
            span: r.span === "full" ? "full" : "half",
          };
        })
      : [],
  );

  const [results, setResults] = useState<KpiRow[]>(() => mapKpis(doc.results));
  const [retro, setRetro] = useState<RetroRow[]>(() =>
    Array.isArray(doc.retro)
      ? doc.retro.map((item) => {
          const r = (item ?? {}) as Record<string, unknown>;
          const v = r.verdict === "CHANGE" || r.verdict === "DROP" ? r.verdict : "KEEP";
          return { verdict: v, note: String(r.note ?? ""), noteAr: String(r.noteAr ?? "") };
        })
      : [],
  );

  const [docStatus, setDocStatus] = useState<string>(String(doc._status ?? "draft"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (targetStatus?: "draft" | "published") => {
    const missingImgIdx = images.findIndex((img) => !img.image?.id);
    if (missingImgIdx !== -1) {
      setError(`الصورة رقم #${missingImgIdx + 1} في المعرض تفتقد ملفًا مرفوعًا — اختر صورة أو احذف الصف.`);
      return;
    }
    setSaving(true);
    setError(null);
    const nextStatus = targetStatus ?? (docStatus === "published" ? "published" : "draft");

    const res = await saveCollectionDocAction("case-studies", isNew ? "new" : String(doc.id ?? ""), {
      slug: slug.trim(),
      name: name.trim(),
      nameAr: nameAr.trim() || null,
      discipline: discipline.trim(),
      accent: {
        primary: primaryGlow.trim(),
        secondary: secondaryGlow.trim(),
      },
      problem: problem.trim(),
      problemAr: problemAr.trim() || null,
      teamScale: teamScale.trim() || null,
      teamScaleAr: teamScaleAr.trim() || null,
      timeline: timeline.trim() || null,
      timelineAr: timelineAr.trim() || null,
      kpis: kpis.map((k) => ({
        value: k.value.trim(),
        label: k.label.trim(),
        labelAr: k.labelAr.trim() || null,
        context: k.context.trim() || null,
        contextAr: k.contextAr.trim() || null,
      })),
      researchSummary: researchSummary.trim(),
      researchSummaryAr: researchSummaryAr.trim() || null,
      competitors: competitors.map((c) => ({
        name: c.name.trim(),
        x: Math.min(100, Math.max(0, Number(c.x) || 0)),
        y: Math.min(100, Math.max(0, Number(c.y) || 0)),
        isClient: c.isClient,
      })),
      visualVectors: visualVectors.map((s) => s.trim()).filter(Boolean),
      visualVectorsAr: visualVectorsAr.map((s) => s.trim()).filter(Boolean),
      tokens: tokens.map((t) => ({
        token: t.token.trim(),
        value: t.value.trim(),
        role: t.role.trim(),
        roleAr: t.roleAr.trim() || null,
      })),
      componentStates: componentStates.map((s) => s.trim()).filter(Boolean),
      breakpoints: breakpoints.map((b) => ({ bp: b.bp.trim(), cols: b.cols.trim() })),
      images: images
        .filter((img) => img.image?.id)
        .map((img) => ({
          image: img.image!.id,
          caption: img.caption.trim() || null,
          captionAr: img.captionAr.trim() || null,
          span: img.span,
        })),
      results: results.map((k) => ({
        value: k.value.trim(),
        label: k.label.trim(),
        labelAr: k.labelAr.trim() || null,
        context: k.context.trim() || null,
        contextAr: k.contextAr.trim() || null,
      })),
      retro: retro.map((r) => ({
        verdict: r.verdict,
        note: r.note.trim(),
        noteAr: r.noteAr.trim() || null,
      })),
      _status: nextStatus,
    });

    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDocStatus(nextStatus);
    if (isNew && res.id) {
      router.push(`/studio/manage/case-studies/${res.id}`);
    }
    router.refresh();
  };

  return (
    <DocumentEditorFrame
      collectionSlug="case-studies"
      collectionLabel="دراسات الحالة"
      singularLabel="دراسة حالة"
      docId={doc.id as number | string | undefined}
      isNew={isNew}
      supportsDrafts
      currentStatus={docStatus}
      title={nameAr || name || "دراسة حالة بدون عنوان"}
      liveUrl={!isNew && slug && docStatus === "published" ? `/en/case-studies/${slug}` : null}
      saving={saving}
      error={error}
      onSave={handleSave}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
        {/* الهوية */}
        <Tile span="w12" title={<b>الهوية والتوهج المحيط</b>}>
          <div className="studio-grid-3">
            <div className="studio-field">
              <label htmlFor="cs-name">الاسم (بالإنجليزية) *</label>
              <input
                id="cs-name"
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
              <label htmlFor="cs-name-ar">الاسم (بالعربية)</label>
              <input id="cs-name-ar" className="studio-input" dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>
            <div className="studio-field">
              <label htmlFor="cs-slug">المعرّف (Slug) *</label>
              <input
                id="cs-slug"
                className="studio-input"
                dir="ltr"
                style={{ fontFamily: "var(--s-font-mono)", fontSize: 13 }}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>

          <div className="studio-grid-3">
            <div className="studio-field">
              <label htmlFor="cs-disc">التخصص *</label>
              <input id="cs-disc" className="studio-input" dir="ltr" value={discipline} onChange={(e) => setDiscipline(e.target.value)} />
            </div>
            <div className="studio-field">
              <label htmlFor="cs-glow-1">التوهج الأساسي *</label>
              <input id="cs-glow-1" className="studio-input" dir="ltr" value={primaryGlow} onChange={(e) => setPrimaryGlow(e.target.value)} />
            </div>
            <div className="studio-field">
              <label htmlFor="cs-glow-2">التوهج الثانوي *</label>
              <input id="cs-glow-2" className="studio-input" dir="ltr" value={secondaryGlow} onChange={(e) => setSecondaryGlow(e.target.value)} />
            </div>
          </div>
        </Tile>

        {/* اللوحة 01 */}
        <Tile span="w12" title={<b>اللوحة 01 — السياق والتشخيص</b>}>
          <div className="studio-grid-2">
            <div className="studio-field">
              <label htmlFor="cs-prob">بيان المشكلة (بالإنجليزية) *</label>
              <textarea id="cs-prob" className="studio-input" dir="ltr" rows={4} value={problem} onChange={(e) => setProblem(e.target.value)} />
            </div>
            <div className="studio-field">
              <label htmlFor="cs-prob-ar">بيان المشكلة (بالعربية)</label>
              <textarea id="cs-prob-ar" className="studio-input" dir="rtl" rows={4} value={problemAr} onChange={(e) => setProblemAr(e.target.value)} />
            </div>
          </div>

          <div className="studio-grid-2">
            <div className="studio-field">
              <label>حجم الفريق (إنجليزي / عربي)</label>
              <div className="studio-grid-2">
                <input className="studio-input" dir="ltr" placeholder="English" value={teamScale} onChange={(e) => setTeamScale(e.target.value)} />
                <input className="studio-input" dir="rtl" placeholder="عربي" value={teamScaleAr} onChange={(e) => setTeamScaleAr(e.target.value)} />
              </div>
            </div>
            <div className="studio-field">
              <label>المدة الزمنية (إنجليزي / عربي)</label>
              <div className="studio-grid-2">
                <input className="studio-input" dir="ltr" placeholder="English" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
                <input className="studio-input" dir="rtl" placeholder="عربي" value={timelineAr} onChange={(e) => setTimelineAr(e.target.value)} />
              </div>
            </div>
          </div>

          <KpiArrayEditor label="مؤشرات خط الأساس (Baseline KPIs)" rows={kpis} onChange={setKpis} />
        </Tile>

        {/* اللوحة 02 */}
        <Tile span="w12" title={<b>اللوحة 02 — البحث والتموضع</b>}>
          <div className="studio-grid-2">
            <div className="studio-field">
              <label htmlFor="cs-res">ملخص البحث (بالإنجليزية) *</label>
              <textarea id="cs-res" className="studio-input" dir="ltr" rows={4} value={researchSummary} onChange={(e) => setResearchSummary(e.target.value)} />
            </div>
            <div className="studio-field">
              <label htmlFor="cs-res-ar">ملخص البحث (بالعربية)</label>
              <textarea id="cs-res-ar" className="studio-input" dir="rtl" rows={4} value={researchSummaryAr} onChange={(e) => setResearchSummaryAr(e.target.value)} />
            </div>
          </div>

          <div className="studio-field">
            <label>مصفوفة تموضع المنافسين (عام ↔ متميز / مخرج مفرد ↔ منظومة)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {competitors.map((comp, i) => (
                <div key={i} className="studio-block-card">
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 90px 90px auto auto", gap: 8, alignItems: "center" }}>
                    <input
                      className="studio-input"
                      placeholder="الاسم *"
                      value={comp.name}
                      onChange={(e) => setCompetitors(competitors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                    />
                    <input
                      className="studio-input"
                      dir="ltr"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="X (0-100)"
                      value={comp.x}
                      onChange={(e) => setCompetitors(competitors.map((x, j) => (j === i ? { ...x, x: Number(e.target.value) } : x)))}
                    />
                    <input
                      className="studio-input"
                      dir="ltr"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Y (0-100)"
                      value={comp.y}
                      onChange={(e) => setCompetitors(competitors.map((x, j) => (j === i ? { ...x, y: Number(e.target.value) } : x)))}
                    />
                    <label className="studio-check">
                      <input
                        type="checkbox"
                        checked={comp.isClient}
                        onChange={(e) => setCompetitors(competitors.map((x, j) => (j === i ? { ...x, isClient: e.target.checked } : x)))}
                      />
                      <span>العميل</span>
                    </label>
                    <button
                      type="button"
                      className="studio-btn studio-btn--sm"
                      onClick={() => setCompetitors(competitors.filter((_, j) => j !== i))}
                      aria-label="إزالة المنافس"
                    >
                      <SIcon name="x" size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  onClick={() => setCompetitors([...competitors, { name: "", x: 50, y: 50, isClient: false }])}
                >
                  + إضافة نقطة منافس
                </button>
              </div>
            </div>
          </div>

          <div className="studio-grid-2">
            <StringListField label="الموجهات البصرية (بالإنجليزية)" items={visualVectors} onChange={setVisualVectors} dir="ltr" />
            <StringListField label="الموجهات البصرية (بالعربية)" items={visualVectorsAr} onChange={setVisualVectorsAr} dir="rtl" />
          </div>
        </Tile>

        {/* اللوحة 03 */}
        <Tile span="w12" title={<b>اللوحة 03 — التنفيذ والحوكمة</b>}>
          <div className="studio-field">
            <label>متغيرات التصميم (Design Tokens)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tokens.map((tok, i) => (
                <div key={i} className="studio-block-card">
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) auto", gap: 6 }}>
                    <input
                      className="studio-input"
                      dir="ltr"
                      placeholder="المتغير *"
                      value={tok.token}
                      onChange={(e) => setTokens(tokens.map((x, j) => (j === i ? { ...x, token: e.target.value } : x)))}
                    />
                    <input
                      className="studio-input"
                      dir="ltr"
                      placeholder="القيمة *"
                      value={tok.value}
                      onChange={(e) => setTokens(tokens.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                    />
                    <input
                      className="studio-input"
                      dir="ltr"
                      placeholder="الدور (EN) *"
                      value={tok.role}
                      onChange={(e) => setTokens(tokens.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))}
                    />
                    <input
                      className="studio-input"
                      dir="rtl"
                      placeholder="الدور (عربي)"
                      value={tok.roleAr}
                      onChange={(e) => setTokens(tokens.map((x, j) => (j === i ? { ...x, roleAr: e.target.value } : x)))}
                    />
                    <button
                      type="button"
                      className="studio-btn studio-btn--sm"
                      onClick={() => setTokens(tokens.filter((_, j) => j !== i))}
                      aria-label="إزالة المتغير"
                    >
                      <SIcon name="x" size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  onClick={() => setTokens([...tokens, { token: "", value: "", role: "", roleAr: "" }])}
                >
                  + إضافة متغير
                </button>
              </div>
            </div>
          </div>

          <div className="studio-grid-2">
            <StringListField label="حالات المكونات" items={componentStates} onChange={setComponentStates} dir="ltr" placeholder="مثال: default, hover, disabled" />
            <div className="studio-field">
              <label>نقاط التوقف الشبكية (Breakpoints)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {breakpoints.map((bp, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 6 }}>
                    <input
                      className="studio-input"
                      dir="ltr"
                      placeholder="نقطة التوقف (مثل 1280px)"
                      value={bp.bp}
                      onChange={(e) => setBreakpoints(breakpoints.map((x, j) => (j === i ? { ...x, bp: e.target.value } : x)))}
                    />
                    <input
                      className="studio-input"
                      dir="ltr"
                      placeholder="الأعمدة (مثل 12)"
                      value={bp.cols}
                      onChange={(e) => setBreakpoints(breakpoints.map((x, j) => (j === i ? { ...x, cols: e.target.value } : x)))}
                    />
                    <button
                      type="button"
                      className="studio-btn studio-btn--sm"
                      onClick={() => setBreakpoints(breakpoints.filter((_, j) => j !== i))}
                      aria-label="إزالة نقطة التوقف"
                    >
                      <SIcon name="x" size={13} />
                    </button>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    className="studio-btn studio-btn--sm"
                    onClick={() => setBreakpoints([...breakpoints, { bp: "", cols: "" }])}
                  >
                    + إضافة نقطة توقف
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="studio-field">
            <label>معرض صور دراسة الحالة</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {images.map((img, i) => (
                <div key={i} className="studio-block-card">
                  <div className="studio-block-card__head">
                    <span className="studio-tiny">صورة #{i + 1}</span>
                    <span className="studio-spacer" />
                    <select
                      className="studio-input"
                      style={{ width: 130, padding: "5px 9px", fontSize: 13 }}
                      value={img.span}
                      onChange={(e) =>
                        setImages(images.map((x, j) => (j === i ? { ...x, span: e.target.value === "full" ? "full" : "half" } : x)))
                      }
                    >
                      <option value="half">نصف العرض</option>
                      <option value="full">كامل العرض</option>
                    </select>
                    <button
                      type="button"
                      className="studio-btn studio-btn--sm"
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      aria-label="إزالة الصورة"
                    >
                      <SIcon name="x" size={13} />
                    </button>
                  </div>
                  <MediaPickerField
                    label="الملف"
                    required
                    value={img.image}
                    onChange={(next) => setImages(images.map((x, j) => (j === i ? { ...x, image: next } : x)))}
                    mimePrefix="image/"
                    accept="image/*"
                  />
                  <div className="studio-grid-2">
                    <input
                      className="studio-input"
                      dir="ltr"
                      placeholder="التعليق (EN)"
                      value={img.caption}
                      onChange={(e) => setImages(images.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
                    />
                    <input
                      className="studio-input"
                      dir="rtl"
                      placeholder="التعليق (عربي)"
                      value={img.captionAr}
                      onChange={(e) => setImages(images.map((x, j) => (j === i ? { ...x, captionAr: e.target.value } : x)))}
                    />
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  onClick={() => setImages([...images, { image: null, caption: "", captionAr: "", span: "half" }])}
                >
                  + إضافة صورة للمعرض
                </button>
              </div>
            </div>
          </div>
        </Tile>

        {/* اللوحة 04 */}
        <Tile span="w12" title={<b>اللوحة 04 — الأداء والمراجعة الختامية</b>}>
          <KpiArrayEditor label="نتائج الأداء النهائية" rows={results} onChange={setResults} />

          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label>خلاصات المراجعة (Post Mortem)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {retro.map((item, i) => (
                <div key={i} className="studio-block-card">
                  <div className="studio-block-card__head">
                    <select
                      className="studio-input"
                      dir="ltr"
                      style={{ width: 135, padding: "5px 9px", fontSize: 13, fontWeight: 700 }}
                      value={item.verdict}
                      onChange={(e) => {
                        const v = e.target.value === "CHANGE" || e.target.value === "DROP" ? e.target.value : "KEEP";
                        setRetro(retro.map((x, j) => (j === i ? { ...x, verdict: v } : x)));
                      }}
                    >
                      <option value="KEEP">KEEP — يُبقى</option>
                      <option value="CHANGE">CHANGE — يُعدّل</option>
                      <option value="DROP">DROP — يُلغى</option>
                    </select>
                    <span className="studio-spacer" />
                    <button
                      type="button"
                      className="studio-btn studio-btn--sm"
                      onClick={() => setRetro(retro.filter((_, j) => j !== i))}
                      aria-label="إزالة الملاحظة"
                    >
                      <SIcon name="x" size={13} />
                    </button>
                  </div>
                  <div className="studio-grid-2">
                    <textarea
                      className="studio-input"
                      dir="ltr"
                      rows={2}
                      placeholder="الملاحظة (EN) *"
                      value={item.note}
                      onChange={(e) => setRetro(retro.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))}
                    />
                    <textarea
                      className="studio-input"
                      dir="rtl"
                      rows={2}
                      placeholder="الملاحظة (عربي)"
                      value={item.noteAr}
                      onChange={(e) => setRetro(retro.map((x, j) => (j === i ? { ...x, noteAr: e.target.value } : x)))}
                    />
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  onClick={() => setRetro([...retro, { verdict: "KEEP", note: "", noteAr: "" }])}
                >
                  + إضافة خلاصة مراجعة
                </button>
              </div>
            </div>
          </div>
        </Tile>
      </div>
    </DocumentEditorFrame>
  );
}
