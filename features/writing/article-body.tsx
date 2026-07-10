"use client";

/**
 * ARTICLE BODY — renders a Post's Lexical richText, styled after the
 * Lovable "Editorial Brand Systems" reference design:
 *   · pull-quotes: 2px accent side-rule, large italic display type
 *   · data tables: strong top/bottom rules, mono uppercase headers,
 *     airy rows — editorial, not spreadsheet
 *   · diagram figures: numbered containers (FIGURE · 01) with mono
 *     captions, theme-aware Mermaid rendering
 * Logical properties (ps-*, border-s) keep everything RTL-correct for
 * Arabic posts without a single conditional.
 */
import { useMemo } from "react";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import { MermaidDiagram } from "./mermaid-diagram";

function DataTable({ markdown }: { markdown: string }) {
  const rows = markdown
    .split("\n")
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.some((c) => c.length > 0));
  if (rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div className="my-10 overflow-x-auto">
      <table className="w-full border-collapse text-body-sm">
        <thead>
          <tr className="border-y border-text-primary">
            {header!.map((cell, i) => (
              <th
                key={i}
                className="py-3 pe-6 text-start font-mono text-micro font-medium uppercase tracking-[0.14em] text-text-tertiary"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((cells, r) => (
            <tr key={r} className="border-b border-border-subtle">
              {cells.map((cell, c) => (
                <td
                  key={c}
                  className={`py-4 pe-6 align-top leading-relaxed ${
                    c === 0 ? "font-medium text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type BlockFields = { blockType: string; id?: string; code?: string; caption?: string; markdown?: string };

function makeConverters(figureNos: Map<string, number>): JSXConvertersFunction {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      if (node.tag === "h3") {
        return (
          <h3 className="mt-8 font-display text-lead font-semibold uppercase tracking-[0.01em] text-text-primary">
            {children}
          </h3>
        );
      }
      return (
        <h2 className="mt-14 font-display text-title font-bold uppercase tracking-[-0.01em] text-text-primary">
          {children}
        </h2>
      );
    },
    paragraph: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      return <p className="mt-4 max-w-[68ch] text-body leading-relaxed text-text-secondary">{children}</p>;
    },
    quote: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      return (
        <blockquote className="my-10 border-s-2 border-accent py-2 ps-6">
          <p className="max-w-[40ch] font-display text-lead font-semibold italic leading-tight text-text-primary md:text-title">
            {children}
          </p>
        </blockquote>
      );
    },
    list: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      const cls = "mt-4 flex max-w-[68ch] flex-col gap-2 ps-5 text-body leading-relaxed text-text-secondary";
      return node.listType === "number" ? (
        <ol className={`${cls} list-decimal marker:font-mono marker:text-accent`}>{children}</ol>
      ) : (
        <ul className={`${cls} list-disc marker:text-accent`}>{children}</ul>
      );
    },
    listitem: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      return <li className="ps-1">{children}</li>;
    },
    blocks: {
      diagram: ({ node }: { node: { fields: BlockFields } }) => {
        const fields = node.fields;
        return (
          <MermaidDiagram
            code={fields.code ?? ""}
            caption={fields.caption || undefined}
            figureNo={fields.id ? figureNos.get(fields.id) : undefined}
          />
        );
      },
      dataTable: ({ node }: { node: { fields: BlockFields } }) => {
        const fields = node.fields;
        return <DataTable markdown={fields.markdown ?? ""} />;
      },
    },
  });
}

export function ArticleBody({ content }: { content: SerializedEditorState }) {
  // Number the diagram figures in document order (FIGURE · 01, 02 …).
  const figureNos = useMemo(() => {
    const map = new Map<string, number>();
    let n = 0;
    const children =
      (content as unknown as { root?: { children?: { type?: string; fields?: BlockFields }[] } })?.root
        ?.children ?? [];
    for (const node of children) {
      if (node?.type === "block" && node.fields?.blockType === "diagram" && node.fields.id) {
        n += 1;
        map.set(node.fields.id, n);
      }
    }
    return map;
  }, [content]);

  const converters = useMemo(() => makeConverters(figureNos), [figureNos]);

  return <RichText data={content} converters={converters} />;
}
