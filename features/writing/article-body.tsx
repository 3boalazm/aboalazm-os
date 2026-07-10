"use client";

/**
 * ARTICLE BODY — renders a Post's Lexical richText using the exact same
 * typographic classes already designed in mdx-components.tsx (serif H2s,
 * accent-rule blockquotes) — that file was written for MDX content that
 * never shipped; Posts use Lexical richText instead, so the converters
 * here just point the same visual system at the actual data source.
 *
 * UPGRADE (systems series): adds converters for h3 subheadings,
 * bullet/numbered lists, and the two custom Payload blocks registered in
 * payload.config.ts — `diagram` (Mermaid, rendered client-side) and
 * `dataTable` (pipe-separated rows, first row = header). Logical
 * properties (ps-*, border-s) keep everything RTL-correct for Arabic
 * posts without a single conditional.
 */
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
    <div className="mt-6 overflow-x-auto rounded-md border border-border-subtle">
      <table className="w-full border-collapse text-start">
        <thead>
          <tr className="bg-surface-1">
            {header!.map((cell, i) => (
              <th
                key={i}
                className="border-b border-border-subtle px-3 py-2 text-start font-mono text-micro uppercase tracking-[0.06em] text-text-tertiary"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((cells, r) => (
            <tr key={r} className="border-b border-border-subtle last:border-b-0">
              {cells.map((cell, c) => (
                <td
                  key={c}
                  className={`px-3 py-2 align-top text-body-sm ${
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

type BlockFields = { blockType: string; code?: string; caption?: string; markdown?: string };

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    if (node.tag === "h3") {
      return (
        <h3 className="mt-6 font-display text-lead font-medium tracking-[-0.01em] text-text-primary">
          {children}
        </h3>
      );
    }
    return (
      <h2 className="mt-8 font-display text-title tracking-[-0.015em] text-text-primary">
        {children}
      </h2>
    );
  },
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    return <p className="mt-3 max-w-[68ch] text-body text-text-secondary">{children}</p>;
  },
  quote: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    return (
      <blockquote className="mt-4 border-s border-accent ps-3 font-display text-lead italic text-text-primary">
        {children}
      </blockquote>
    );
  },
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const cls = "mt-3 flex max-w-[68ch] flex-col gap-1.5 ps-5 text-body text-text-secondary";
    return node.listType === "number" ? (
      <ol className={`${cls} list-decimal`}>{children}</ol>
    ) : (
      <ul className={`${cls} list-disc`}>{children}</ul>
    );
  },
  listitem: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    return <li className="ps-1 marker:text-accent">{children}</li>;
  },
  blocks: {
    diagram: ({ node }: { node: { fields: BlockFields } }) => {
      const fields = node.fields;
      return <MermaidDiagram code={fields.code ?? ""} caption={fields.caption || undefined} />;
    },
    dataTable: ({ node }: { node: { fields: BlockFields } }) => {
      const fields = node.fields;
      return <DataTable markdown={fields.markdown ?? ""} />;
    },
  },
});

export function ArticleBody({ content }: { content: SerializedEditorState }) {
  return <RichText data={content} converters={converters} />;
}
