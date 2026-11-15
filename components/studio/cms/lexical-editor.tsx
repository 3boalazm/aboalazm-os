"use client";

import { useMemo } from "react";
import { SIcon } from "@/components/studio/ui";
import { nextBlockId, toLexicalState, type EditableBlock } from "@/lib/studio/lexical";
import { extractSections, readingMinutes } from "@/features/writing/toc";

const BLOCK_LABELS: Record<EditableBlock["kind"], string> = {
  h2: "عنوان قسم H2",
  h3: "عنوان فرعي H3",
  p: "فقرة نصية",
  q: "اقتباس مميز",
  ul: "قائمة نقطية",
  ol: "قائمة مرقمة",
  dataTable: "جدول بيانات",
  diagram: "مخطط Mermaid",
  stats: "صف إحصائيات",
  raw: "عقدة مخصصة",
};

function makeEmptyBlock(kind: Exclude<EditableBlock["kind"], "raw">): EditableBlock {
  const id = nextBlockId(kind);
  switch (kind) {
    case "h2":
    case "h3":
    case "p":
    case "q":
      return { id, kind, text: "" };
    case "ul":
    case "ol":
      return { id, kind, items: [""] };
    case "dataTable":
      return { id, kind, markdown: "المقياس | قبل | بعد\nزمن التحميل | 2.4s | 0.6s" };
    case "diagram":
      return { id, kind, code: "flowchart TD\n  A[البداية] --> B[النهاية]", caption: "" };
    case "stats":
      return {
        id,
        kind,
        items: [
          { value: "42%", label: "المؤشر الأول" },
          { value: "3x", label: "المؤشر الثاني" },
        ],
      };
  }
}

export function LexicalBlockEditor({
  blocks,
  lang,
  onChange,
}: {
  blocks: EditableBlock[];
  lang: "en" | "ar";
  onChange: (next: EditableBlock[]) => void;
}) {
  const dir = lang === "ar" ? "rtl" : "ltr";

  const previewMeta = useMemo(() => {
    const state = toLexicalState(blocks, dir);
    return {
      minutes: readingMinutes(state),
      sections: extractSections(state),
    };
  }, [blocks, dir]);

  const updateAt = (index: number, next: EditableBlock) => {
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  };

  const moveAt = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    const [item] = copy.splice(index, 1);
    if (!item) return;
    copy.splice(target, 0, item);
    onChange(copy);
  };

  const removeAt = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const addKind = (kind: Exclude<EditableBlock["kind"], "raw">, afterIndex?: number) => {
    const fresh = makeEmptyBlock(kind);
    if (afterIndex === undefined) {
      onChange([...blocks, fresh]);
      return;
    }
    const copy = [...blocks];
    copy.splice(afterIndex + 1, 0, fresh);
    onChange(copy);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* هيكل المقال وزمن القراءة */}
      <div className="studio-lexical-summary">
        <div>
          <span className="studio-up">بنية المقال</span>
          <strong style={{ display: "block", fontSize: 14 }}>
            {blocks.length} كتلة · نحو {previewMeta.minutes} دقيقة قراءة
          </strong>
        </div>
        {previewMeta.sections.length > 0 ? (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {previewMeta.sections.map((sec) => (
              <span key={sec.id} className="studio-chip">
                <span className="studio-mono" style={{ color: "var(--s-accent)" }}>{sec.no}</span> {sec.text}
              </span>
            ))}
          </div>
        ) : (
          <span className="studio-tiny">أضف عناوين H2 لتكوين فهرس الأقسام الجانبي في صفحة المقال.</span>
        )}
      </div>

      {/* الكتل */}
      {blocks.length === 0 ? (
        <div className="studio-empty-state">
          <strong>محتوى المقال فارغ حاليًا</strong>
          <p>أضف عناوين أو فقرات أو اقتباسات أو جداول بيانات أو مخططات Mermaid أو إحصائيات من الشريط أدناه.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {blocks.map((block, idx) => (
            <div key={block.id} className="studio-block-card">
              <div className="studio-block-card__head">
                <span className="studio-chip studio-chip--accent">{BLOCK_LABELS[block.kind]}</span>
                <span className="studio-tiny studio-mono">#{idx + 1}</span>
                <span className="studio-spacer" />
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  disabled={idx === 0}
                  onClick={() => moveAt(idx, -1)}
                  title="تحريك لأعلى"
                  aria-label="تحريك الكتلة لأعلى"
                >
                  <SIcon name="arrowUp" size={13} />
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  disabled={idx === blocks.length - 1}
                  onClick={() => moveAt(idx, 1)}
                  title="تحريك لأسفل"
                  aria-label="تحريك الكتلة لأسفل"
                >
                  <SIcon name="arrowDown" size={13} />
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  onClick={() => removeAt(idx)}
                  title="حذف الكتلة"
                  aria-label="حذف الكتلة"
                >
                  <SIcon name="x" size={13} />
                </button>
              </div>

              {(block.kind === "h2" || block.kind === "h3") && (
                <input
                  className="studio-input"
                  dir={dir}
                  value={block.text}
                  onChange={(e) => updateAt(idx, { ...block, text: e.target.value })}
                  placeholder={block.kind === "h2" ? "عنوان القسم (يُرقّم تلقائيًا 01، 02…)" : "عنوان فرعي"}
                  style={{ fontWeight: 700, fontSize: block.kind === "h2" ? 16 : 14.5 }}
                />
              )}

              {(block.kind === "p" || block.kind === "q") && (
                <textarea
                  className="studio-input"
                  dir={dir}
                  rows={block.kind === "q" ? 2 : 4}
                  value={block.text}
                  onChange={(e) => updateAt(idx, { ...block, text: e.target.value })}
                  placeholder={
                    block.kind === "q"
                      ? "نص الاقتباس المميز (الاقتباس الختامي يمتد بعرض الصفحة بالكامل)…"
                      : "نص الفقرة — يدعم **عريض** و *مائل* و `كود` و [رابط](https://…)…"
                  }
                />
              )}

              {(block.kind === "ul" || block.kind === "ol") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {block.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span className="studio-tiny studio-mono" style={{ width: 24, textAlign: "end" }}>
                        {block.kind === "ol" ? `${itemIdx + 1}.` : "•"}
                      </span>
                      <input
                        className="studio-input"
                        dir={dir}
                        value={item}
                        onChange={(e) => {
                          const nextItems = block.items.map((x, j) => (j === itemIdx ? e.target.value : x));
                          updateAt(idx, { ...block, items: nextItems });
                        }}
                        placeholder="عنصر في القائمة…"
                      />
                      <button
                        type="button"
                        className="studio-btn studio-btn--sm"
                        onClick={() => {
                          const nextItems = block.items.filter((_, j) => j !== itemIdx);
                          updateAt(idx, { ...block, items: nextItems.length ? nextItems : [""] });
                        }}
                        aria-label="إزالة العنصر"
                      >
                        <SIcon name="x" size={13} />
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      className="studio-btn studio-btn--sm"
                      onClick={() => updateAt(idx, { ...block, items: [...block.items, ""] })}
                    >
                      + إضافة عنصر
                    </button>
                  </div>
                </div>
              )}

              {block.kind === "dataTable" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <textarea
                    className="studio-input"
                    dir={dir}
                    rows={4}
                    style={{ fontFamily: "var(--s-font-mono)", fontSize: 13 }}
                    value={block.markdown}
                    onChange={(e) => updateAt(idx, { ...block, markdown: e.target.value })}
                    placeholder="العمود أ | العمود ب | العمود ج"
                  />
                  <span className="studio-tiny">صف واحد في كل سطر مع فصل الأعمدة بالرمز `|`. السطر الأول يمثل العناوين.</span>
                </div>
              )}

              {block.kind === "diagram" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <textarea
                    className="studio-input"
                    dir="ltr"
                    rows={5}
                    style={{ fontFamily: "var(--s-font-mono)", fontSize: 13 }}
                    value={block.code}
                    onChange={(e) => updateAt(idx, { ...block, code: e.target.value })}
                    placeholder="flowchart TD …"
                  />
                  <input
                    className="studio-input"
                    dir={dir}
                    value={block.caption}
                    onChange={(e) => updateAt(idx, { ...block, caption: e.target.value })}
                    placeholder="تعليق توضيحي اختياري أسفل المخطط"
                  />
                </div>
              )}

              {block.kind === "stats" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {block.items.map((stat, sIdx) => (
                    <div key={sIdx} style={{ display: "grid", gridTemplateColumns: "145px minmax(0,1fr) auto", gap: 6 }}>
                      <input
                        className="studio-input"
                        dir="ltr"
                        value={stat.value}
                        onChange={(e) => {
                          const nextItems = block.items.map((x, j) => (j === sIdx ? { ...x, value: e.target.value } : x));
                          updateAt(idx, { ...block, items: nextItems });
                        }}
                        placeholder="القيمة (مثل 42%)"
                      />
                      <input
                        className="studio-input"
                        dir={dir}
                        value={stat.label}
                        onChange={(e) => {
                          const nextItems = block.items.map((x, j) => (j === sIdx ? { ...x, label: e.target.value } : x));
                          updateAt(idx, { ...block, items: nextItems });
                        }}
                        placeholder="الوصف"
                      />
                      <button
                        type="button"
                        className="studio-btn studio-btn--sm"
                        disabled={block.items.length <= 2}
                        onClick={() => updateAt(idx, { ...block, items: block.items.filter((_, j) => j !== sIdx) })}
                        aria-label="إزالة الإحصائية"
                      >
                        <SIcon name="x" size={13} />
                      </button>
                    </div>
                  ))}
                  {block.items.length < 4 ? (
                    <div>
                      <button
                        type="button"
                        className="studio-btn studio-btn--sm"
                        onClick={() => updateAt(idx, { ...block, items: [...block.items, { value: "", label: "" }] })}
                      >
                        + إضافة مؤشر (الحد الأقصى 4)
                      </button>
                    </div>
                  ) : null}
                </div>
              )}

              {block.kind === "raw" && (
                <div className="studio-tiny">
                  عقدة Lexical مخصصة محفوظة تلقائيًا (<code>{block.nodeType}</code>) — ستبقى سليمة عند الحفظ.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* شريط الإضافة */}
      <div className="studio-insert-bar">
        <span className="studio-up" style={{ marginInlineEnd: 6 }}>
          إضافة كتلة
        </span>
        {(
          [
            ["h2", "عنوان H2"],
            ["h3", "عنوان H3"],
            ["p", "فقرة"],
            ["q", "اقتباس"],
            ["ul", "قائمة نقطية"],
            ["ol", "قائمة مرقمة"],
            ["dataTable", "جدول بيانات"],
            ["diagram", "مخطط Mermaid"],
            ["stats", "صف إحصائيات"],
          ] as const
        ).map(([kind, label]) => (
          <button key={kind} type="button" className="studio-btn studio-btn--sm" onClick={() => addKind(kind)}>
            + {label}
          </button>
        ))}
      </div>
    </div>
  );
}
