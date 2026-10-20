"use client";

/**
 * ARTICLE BODY — renders a Post's Lexical richText as the interactive
 * editorial experience from the Lovable reference:
 *   · h2 sections get a big outlined index number (01, 02 …), an
 *     anchor id (for the side-nav scrollspy) and a rule line
 *   · every block fades in as it enters the viewport
 *   · pull-quotes: 2px accent side-rule, large italic display type
 *   · data tables: strong rules, mono uppercase headers, row hover
 *   · diagram figures: numbered containers with theme-aware Mermaid
 * Logical properties (ps-*, border-s) keep everything RTL-correct.
 */
import { useMemo } from "react";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import { MermaidDiagram } from "./mermaid-diagram";
import { Reveal } from "./reveal";
import { StatsRow } from "./stats-row";
import { extractSections, sectionAnchor } from "./toc";

function DataTable({ markdown }: { markdown: string }) {
  const rows = markdown
    .split("\n")
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.some((c) => c.length > 0));
  if (rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div className="my-6 max-w-full overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-body-sm">
        <thead>
          <tr className="border-y border-text-primary">
            {header!.map((cell, i) => (
              <th
                key={i}
                className="py-3 pe-6 text-start font-mono text-micro font-medium uppercase tracking-[0.14em] text-text-tertiary [overflow-wrap:anywhere]"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((cells, r) => (
            <tr
              key={r}
              className="border-b border-border-subtle transition-colors duration-base hover:bg-surface-1"
            >
              {cells.map((cell, c) => (
                <td
                  key={c}
                  className={`py-4 pe-6 align-top leading-relaxed [overflow-wrap:anywhere] ${
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

type BlockFields = {
  blockType: string;
  id?: string;
  code?: string;
  caption?: string;
  markdown?: string;
  items?: { value?: string | null; label?: string | null }[];
};

function makeConverters(
  figureNos: Map<string, number>,
  sectionNos: Map<string, string>,
  closingQuote: string | null,
): JSXConvertersFunction {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      if (node.tag === "h3") {
        return (
          <Reveal>
            <h3 className="mt-4 font-display font-display-sm text-lead font-semibold uppercase tracking-[0.01em] text-text-primary">
              {children}
            </h3>
          </Reveal>
        );
      }
      // h2 — numbered section header with anchor + rule (Lovable style)
      const text = (node.children ?? [])
        .map((c) => (c as { text?: string }).text ?? "")
        .join("");
      const no = sectionNos.get(text);
      const id = sectionAnchor(text);
      return (
        <Reveal>
          <div id={id} data-section-anchor className="mt-10 scroll-mt-28 first:mt-4">
            {no ? (
              <span
                aria-hidden
                className="block font-display text-6xl font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-text-ghost,currentColor)] md:text-7xl"
              >
                {no}
              </span>
            ) : null}
            <h2 className="mt-2 font-display text-title font-bold uppercase tracking-[-0.01em] text-text-primary">
              {children}
            </h2>
            <div className="mt-4 h-px w-full bg-border-subtle" />
          </div>
        </Reveal>
      );
    },
    paragraph: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      return (
        <Reveal>
          <p className="mt-5 max-w-[68ch] text-body leading-relaxed text-text-secondary">{children}</p>
        </Reveal>
      );
    },
    quote: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      const text = (node.children ?? [])
        .map((c) => (c as { text?: string }).text ?? "")
        .join("");
      // Closing quote → full-width accent panel (Lovable final section)
      if (closingQuote && text === closingQuote) {
        return (
          <Reveal>
            <blockquote className="my-8 border-2 border-accent bg-surface-1 px-8 py-5 text-center md:px-16">
              <p className="mx-auto max-w-[46ch] font-display text-title font-bold italic leading-tight text-text-primary">
                {children}
              </p>
            </blockquote>
          </Reveal>
        );
      }
      return (
        <Reveal>
          <blockquote className="my-6 border-s-2 border-accent py-2 ps-6">
            <p className="max-w-[40ch] font-display text-lead font-semibold italic leading-tight text-text-primary md:text-title">
              {children}
            </p>
          </blockquote>
        </Reveal>
      );
    },
    list: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });
      const cls = "mt-5 flex max-w-[68ch] flex-col gap-2 ps-5 text-body leading-relaxed text-text-secondary";
      return (
        <Reveal>
          {node.listType === "number" ? (
            <ol className={`${cls} list-decimal marker:font-mono marker:text-accent`}>{children}</ol>
          ) : (
            <ul className={`${cls} list-disc marker:text-accent`}>{children}</ul>
          )}
        </Reveal>
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
          <Reveal>
            <MermaidDiagram
              code={fields.code ?? ""}
              caption={fields.caption || undefined}
              figureNo={fields.id ? figureNos.get(fields.id) : undefined}
            />
          </Reveal>
        );
      },
      dataTable: ({ node }: { node: { fields: BlockFields } }) => {
        const fields = node.fields;
        return (
          <Reveal>
            <DataTable markdown={fields.markdown ?? ""} />
          </Reveal>
        );
      },
      stats: ({ node }: { node: { fields: BlockFields } }) => {
        const items = (node.fields.items ?? []).map((i) => ({
          value: i.value ?? "",
          label: i.label ?? "",
        }));
        return (
          <Reveal>
            <StatsRow items={items} />
          </Reveal>
        );
      },
    },
  });
}

export function ArticleBody({ content }: { content: SerializedEditorState }) {
  // Number diagram figures (FIGURE · 01 …) and h2 sections (01, 02 …)
  // in document order.
  const { figureNos, sectionNos, closingQuote } = useMemo(() => {
    const figures = new Map<string, number>();
    let n = 0;
    const children =
      (content as unknown as { root?: { children?: { type?: string; fields?: BlockFields }[] } })?.root
        ?.children ?? [];
    for (const node of children) {
      if (node?.type === "block" && node.fields?.blockType === "diagram" && node.fields.id) {
        n += 1;
        figures.set(node.fields.id, n);
      }
    }
    const sections = new Map<string, string>();
    for (const s of extractSections(content)) sections.set(s.text, s.no);

    // If the article ENDS on a quote (last or second-to-last block),
    // render it as the full-width closing panel.
    let closing: string | null = null;
    const tail = children.slice(-2) as { type?: string; children?: { text?: string }[] }[];
    for (const node of tail) {
      if (node?.type === "quote") {
        closing = (node.children ?? []).map((c) => c.text ?? "").join("");
      }
    }
    return { figureNos: figures, sectionNos: sections, closingQuote: closing };
  }, [content]);

  const converters = useMemo(
    () => makeConverters(figureNos, sectionNos, closingQuote),
    [figureNos, sectionNos, closingQuote],
  );

  return <RichText data={content} converters={converters} />;
}
