import type { MDXComponents } from "mdx/types";

/**
 * MDX TYPOGRAPHIC SET — Writing articles & case study bodies.
 * Serif H2s, accent-rule blockquotes, mono captions. No H3+ by
 * doctrine: if a note needs H3, it's two notes.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-8 font-display text-title tracking-[-0.015em] text-text-primary"
        {...props}
      />
    ),
    p: (props) => (
      <p className="mt-3 max-w-[68ch] text-body text-text-secondary" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="mt-4 border-l border-accent pl-3 font-display text-lead italic text-text-primary"
        {...props}
      />
    ),
    code: (props) => (
      <code className="rounded-card bg-surface-1 px-1 font-geist text-body-sm text-text-primary" {...props} />
    ),
    pre: (props) => (
      <pre className="mt-4 overflow-x-auto rounded-card border border-border-subtle bg-surface-1 p-3 font-geist text-body-sm" {...props} />
    ),
    a: (props) => (
      <a className="text-text-primary underline decoration-border-strong underline-offset-4 transition-colors duration-base ease-physics hover:decoration-accent" {...props} />
    ),
    ...components,
  };
}
