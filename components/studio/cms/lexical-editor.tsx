"use client";

import { useMemo } from "react";
import { SIcon } from "@/components/studio/ui";
import { nextBlockId, toLexicalState, type EditableBlock } from "@/lib/studio/lexical";
import { extractSections, readingMinutes } from "@/features/writing/toc";

const BLOCK_LABELS: Record<EditableBlock["kind"], string> = {
  h2: "Section H2",
  h3: "Heading H3",
  p: "Paragraph",
  q: "Pull quote",
  ul: "Bullet list",
  ol: "Numbered list",
  dataTable: "Data table",
  diagram: "Mermaid diagram",
  stats: "Stats row",
  raw: "Custom node",
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
      return { id, kind, markdown: "Metric | Before | After\nLoad time | 2.4s | 0.6s" };
    case "diagram":
      return { id, kind, code: "flowchart TD\n  A[Start] --> B[End]", caption: "" };
    case "stats":
      return {
        id,
        kind,
        items: [
          { value: "42%", label: "First figure" },
          { value: "3x", label: "Second figure" },
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
      {/* Outline & reading stats */}
      <div className="studio-lexical-summary">
        <div>
          <span className="studio-up">Structure</span>
          <strong style={{ display: "block", fontSize: 13 }}>
            {blocks.length} block{blocks.length === 1 ? "" : "s"} · ~{previewMeta.minutes} min read
          </strong>
        </div>
        {previewMeta.sections.length > 0 ? (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {previewMeta.sections.map((sec) => (
              <span key={sec.id} className="studio-chip">
                <span style={{ color: "var(--s-accent)" }}>{sec.no}</span> {sec.text}
              </span>
            ))}
          </div>
        ) : (
          <span className="studio-tiny">Add H2 sections to populate the article rail TOC.</span>
        )}
      </div>

      {/* Blocks */}
      {blocks.length === 0 ? (
        <div className="studio-empty-state">
          <strong>Article body is empty</strong>
          <p>Add headings, paragraphs, pull-quotes, tables, Mermaid diagrams, or counter stats below.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {blocks.map((block, idx) => (
            <div key={block.id} className="studio-block-card">
              <div className="studio-block-card__head">
                <span className="studio-chip studio-chip--accent">{BLOCK_LABELS[block.kind]}</span>
                <span className="studio-tiny">#{idx + 1}</span>
                <span className="studio-spacer" />
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  disabled={idx === 0}
                  onClick={() => moveAt(idx, -1)}
                  title="Move up"
                  aria-label="Move block up"
                >
                  <SIcon name="arrowUp" size={11} />
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  disabled={idx === blocks.length - 1}
                  onClick={() => moveAt(idx, 1)}
                  title="Move down"
                  aria-label="Move block down"
                >
                  <SIcon name="arrowDown" size={11} />
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--sm"
                  onClick={() => removeAt(idx)}
                  title="Delete block"
                  aria-label="Delete block"
                >
                  <SIcon name="x" size={11} />
                </button>
              </div>

              {(block.kind === "h2" || block.kind === "h3") && (
                <input
                  className="studio-input"
                  dir={dir}
                  value={block.text}
                  onChange={(e) => updateAt(idx, { ...block, text: e.target.value })}
                  placeholder={block.kind === "h2" ? "Section heading (numbered 01, 02…)" : "Subheading"}
                  style={{ fontWeight: 700, fontSize: block.kind === "h2" ? 15 : 13.5 }}
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
                      ? "Pull-quote text (closing quote at the end renders full-width)…"
                      : "Paragraph body — supports **bold**, *italic*, `code`, and [link](https://…)…"
                  }
                />
              )}

              {(block.kind === "ul" || block.kind === "ol") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {block.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span className="studio-tiny" style={{ width: 22, textAlign: "end" }}>
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
                        placeholder="List item…"
                      />
                      <button
                        type="button"
                        className="studio-btn studio-btn--sm"
                        onClick={() => {
                          const nextItems = block.items.filter((_, j) => j !== itemIdx);
                          updateAt(idx, { ...block, items: nextItems.length ? nextItems : [""] });
                        }}
                        aria-label="Remove list item"
                      >
                        <SIcon name="x" size={11} />
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      className="studio-btn studio-btn--sm"
                      onClick={() => updateAt(idx, { ...block, items: [...block.items, ""] })}
                    >
                      + Add item
                    </button>
                  </div>
                </div>
              )}

              {block.kind === "dataTable" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <textarea
                    className="studio-input"
                    rows={4}
                    style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}
                    value={block.markdown}
                    onChange={(e) => updateAt(idx, { ...block, markdown: e.target.value })}
                    placeholder="Col A | Col B | Col C"
                  />
                  <span className="studio-tiny">One row per line, cells separated by `|`. First line is the header row.</span>
                </div>
              )}

              {block.kind === "diagram" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <textarea
                    className="studio-input"
                    rows={5}
                    style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}
                    value={block.code}
                    onChange={(e) => updateAt(idx, { ...block, code: e.target.value })}
                    placeholder="flowchart TD …"
                  />
                  <input
                    className="studio-input"
                    dir={dir}
                    value={block.caption}
                    onChange={(e) => updateAt(idx, { ...block, caption: e.target.value })}
                    placeholder="Optional figure caption"
                  />
                </div>
              )}

              {block.kind === "stats" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {block.items.map((stat, sIdx) => (
                    <div key={sIdx} style={{ display: "grid", gridTemplateColumns: "140px minmax(0,1fr) auto", gap: 6 }}>
                      <input
                        className="studio-input"
                        value={stat.value}
                        onChange={(e) => {
                          const nextItems = block.items.map((x, j) => (j === sIdx ? { ...x, value: e.target.value } : x));
                          updateAt(idx, { ...block, items: nextItems });
                        }}
                        placeholder="Value (e.g. 42%)"
                      />
                      <input
                        className="studio-input"
                        dir={dir}
                        value={stat.label}
                        onChange={(e) => {
                          const nextItems = block.items.map((x, j) => (j === sIdx ? { ...x, label: e.target.value } : x));
                          updateAt(idx, { ...block, items: nextItems });
                        }}
                        placeholder="Label"
                      />
                      <button
                        type="button"
                        className="studio-btn studio-btn--sm"
                        disabled={block.items.length <= 2}
                        onClick={() => updateAt(idx, { ...block, items: block.items.filter((_, j) => j !== sIdx) })}
                        aria-label="Remove stat"
                      >
                        <SIcon name="x" size={11} />
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
                        + Add stat (max 4)
                      </button>
                    </div>
                  ) : null}
                </div>
              )}

              {block.kind === "raw" && (
                <div className="studio-tiny">
                  Preserved custom Lexical node (<code>{block.nodeType}</code>) — kept intact on save.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Insert bar */}
      <div className="studio-insert-bar">
        <span className="studio-up" style={{ marginInlineEnd: 4 }}>
          Add block
        </span>
        {(
          [
            ["h2", "H2 Section"],
            ["h3", "H3 Heading"],
            ["p", "Paragraph"],
            ["q", "Pull quote"],
            ["ul", "Bullets"],
            ["ol", "Numbered"],
            ["dataTable", "Data table"],
            ["diagram", "Mermaid"],
            ["stats", "Stats row"],
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
