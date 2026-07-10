"use client";

/**
 * ARTICLE BODY — renders a Post's Lexical richText using the exact same
 * typographic classes already designed in mdx-components.tsx (serif H2s,
 * accent-rule blockquotes) — that file was written for MDX content that
 * never shipped; Posts use Lexical richText instead, so the converters
 * here just point the same visual system at the actual data source.
 */
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
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
      <blockquote className="mt-4 border-l border-accent pl-3 font-display text-lead italic text-text-primary">
        {children}
      </blockquote>
    );
  },
});

export function ArticleBody({ content }: { content: SerializedEditorState }) {
  return <RichText data={content} converters={converters} />;
}
