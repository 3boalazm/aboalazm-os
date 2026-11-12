/**
 * STUDIO LEXICAL CONVERTER — lossless bidirectional bridge between
 * Payload's Lexical SerializedEditorState JSON and structured editable
 * blocks inside Studio's Writing editor.
 *
 * Matches the exact node shapes consumed by:
 *   · features/writing/article-body.tsx (ArticleBody)
 *   · features/writing/toc.ts (extractSections, readingMinutes)
 *   · scripts/writing-content.ts (toLexical)
 */

export type EditableBlock =
  | { id: string; kind: "h2"; text: string }
  | { id: string; kind: "h3"; text: string }
  | { id: string; kind: "p"; text: string }
  | { id: string; kind: "q"; text: string }
  | { id: string; kind: "ul"; items: string[] }
  | { id: string; kind: "ol"; items: string[] }
  | { id: string; kind: "dataTable"; markdown: string }
  | { id: string; kind: "diagram"; code: string; caption: string }
  | { id: string; kind: "stats"; items: { value: string; label: string }[] }
  | { id: string; kind: "raw"; nodeType: string; json: Record<string, unknown> };

type LexicalTextNode = {
  type?: string;
  text?: string;
  format?: number;
  detail?: number;
  mode?: string;
  style?: string;
  version?: number;
  url?: string;
  fields?: { url?: string; newTab?: boolean; linkType?: string };
  children?: LexicalTextNode[];
};

type LexicalBlockNode = {
  type?: string;
  tag?: string;
  listType?: string;
  direction?: "ltr" | "rtl" | null;
  children?: LexicalTextNode[];
  fields?: {
    id?: string;
    blockName?: string;
    blockType?: string;
    code?: string;
    caption?: string;
    markdown?: string;
    items?: { id?: string; value?: string; label?: string }[];
  };
  [key: string]: unknown;
};

let seq = 0;
export function nextBlockId(prefix = "blk"): string {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

/* ── inline serialization (bold, italic, inline code, links) ──────────── */

function inlineNodesToMarkdown(nodes: LexicalTextNode[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === "linebreak") return "\n";
      if (node.type === "link" || node.type === "autolink") {
        const label = inlineNodesToMarkdown(node.children ?? []);
        const url = node.fields?.url ?? node.url ?? "";
        return url ? `[${label}](${url})` : label;
      }
      const raw = node.text ?? "";
      if (!raw) return "";
      const fmt = typeof node.format === "number" ? node.format : 0;
      let out = raw;
      if (fmt & 16) out = `\`${out}\``;
      if (fmt & 1) out = `**${out}**`;
      if (fmt & 2) out = `*${out}*`;
      return out;
    })
    .join("");
}

function makeTextNode(text: string, format = 0) {
  return {
    type: "text",
    detail: 0,
    format,
    mode: "normal",
    style: "",
    text,
    version: 1,
  };
}

/**
 * Parses inline markdown spans (`[label](url)`, `**bold**`, `*italic*`, `` `code` ``)
 * into Payload Lexical inline nodes. Always returns at least valid nodes for
 * plain text; empty text returns `[]`.
 */
export function markdownToInlineNodes(input: string, dir: "ltr" | "rtl" = "ltr"): unknown[] {
  if (!input) return [];
  const nodes: unknown[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(makeTextNode(input.slice(lastIndex, match.index), 0));
    }
    if (match[2] !== undefined && match[3] !== undefined) {
      nodes.push({
        type: "link",
        version: 3,
        format: "",
        indent: 0,
        direction: dir,
        fields: {
          linkType: "custom",
          url: match[3],
          newTab: /^https?:\/\//i.test(match[3]),
        },
        children: [makeTextNode(match[2], 0)],
      });
    } else if (match[4] !== undefined) {
      nodes.push(makeTextNode(match[4], 1));
    } else if (match[5] !== undefined) {
      nodes.push(makeTextNode(match[5], 2));
    } else if (match[6] !== undefined) {
      nodes.push(makeTextNode(match[6], 16));
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < input.length) {
    nodes.push(makeTextNode(input.slice(lastIndex), 0));
  }

  return nodes;
}

/* ── Lexical -> EditableBlock[] ───────────────────────────────────────── */

export function fromLexical(content: unknown): EditableBlock[] {
  const root = (content as { root?: { children?: LexicalBlockNode[] } } | null | undefined)?.root;
  const children = Array.isArray(root?.children) ? root.children : [];
  const blocks: EditableBlock[] = [];

  for (const node of children) {
    if (!node || typeof node !== "object") continue;

    if (node.type === "heading") {
      const text = inlineNodesToMarkdown(node.children);
      if (node.tag === "h2") {
        blocks.push({ id: nextBlockId("h2"), kind: "h2", text });
        continue;
      }
      if (node.tag === "h3") {
        blocks.push({ id: nextBlockId("h3"), kind: "h3", text });
        continue;
      }
    }

    if (node.type === "paragraph") {
      const text = inlineNodesToMarkdown(node.children);
      blocks.push({ id: nextBlockId("p"), kind: "p", text });
      continue;
    }

    if (node.type === "quote") {
      const text = inlineNodesToMarkdown(node.children);
      blocks.push({ id: nextBlockId("q"), kind: "q", text });
      continue;
    }

    if (node.type === "list") {
      const items = (node.children ?? []).map((li) => inlineNodesToMarkdown(li.children ?? []));
      blocks.push({
        id: nextBlockId(node.listType === "number" ? "ol" : "ul"),
        kind: node.listType === "number" ? "ol" : "ul",
        items: items.length ? items : [""],
      });
      continue;
    }

    if (node.type === "block" && node.fields) {
      const bt = node.fields.blockType;
      if (bt === "dataTable") {
        blocks.push({
          id: node.fields.id || nextBlockId("tbl"),
          kind: "dataTable",
          markdown: node.fields.markdown ?? "",
        });
        continue;
      }
      if (bt === "diagram") {
        blocks.push({
          id: node.fields.id || nextBlockId("mmd"),
          kind: "diagram",
          code: node.fields.code ?? "",
          caption: node.fields.caption ?? "",
        });
        continue;
      }
      if (bt === "stats") {
        const items = (node.fields.items ?? []).map((i) => ({
          value: i.value ?? "",
          label: i.label ?? "",
        }));
        blocks.push({
          id: node.fields.id || nextBlockId("sts"),
          kind: "stats",
          items: items.length >= 2 ? items : [{ value: "", label: "" }, { value: "", label: "" }],
        });
        continue;
      }
    }

    blocks.push({
      id: nextBlockId("raw"),
      kind: "raw",
      nodeType: String(node.type ?? "unknown"),
      json: node as Record<string, unknown>,
    });
  }

  return blocks;
}

/* ── EditableBlock[] -> Lexical SerializedEditorState ─────────────────── */

export function toLexicalState(blocks: EditableBlock[], dir: "ltr" | "rtl" = "ltr") {
  const effectiveBlocks: EditableBlock[] =
    blocks.length > 0 ? blocks : [{ id: nextBlockId("p"), kind: "p", text: "" }];

  const children = effectiveBlocks.map((b) => {
    if (b.kind === "h2") {
      return {
        type: "heading",
        tag: "h2",
        format: "",
        indent: 0,
        version: 1,
        direction: dir,
        children: markdownToInlineNodes(b.text, dir),
      };
    }
    if (b.kind === "h3") {
      return {
        type: "heading",
        tag: "h3",
        format: "",
        indent: 0,
        version: 1,
        direction: dir,
        children: markdownToInlineNodes(b.text, dir),
      };
    }
    if (b.kind === "q") {
      return {
        type: "quote",
        format: "",
        indent: 0,
        version: 1,
        direction: dir,
        children: markdownToInlineNodes(b.text, dir),
      };
    }
    if (b.kind === "ul" || b.kind === "ol") {
      const listType = b.kind === "ol" ? "number" : "bullet";
      const tag = b.kind === "ol" ? "ol" : "ul";
      const items = b.items.length ? b.items : [""];
      return {
        type: "list",
        listType,
        tag,
        start: 1,
        format: "",
        indent: 0,
        version: 1,
        direction: dir,
        children: items.map((item, i) => ({
          type: "listitem",
          value: i + 1,
          format: "",
          indent: 0,
          version: 1,
          direction: dir,
          children: markdownToInlineNodes(item, dir),
        })),
      };
    }
    if (b.kind === "dataTable") {
      return {
        type: "block",
        format: "",
        version: 2,
        fields: {
          id: b.id,
          blockName: "",
          blockType: "dataTable",
          markdown: b.markdown,
        },
      };
    }
    if (b.kind === "diagram") {
      return {
        type: "block",
        format: "",
        version: 2,
        fields: {
          id: b.id,
          blockName: "",
          blockType: "diagram",
          code: b.code,
          caption: b.caption,
        },
      };
    }
    if (b.kind === "stats") {
      return {
        type: "block",
        format: "",
        version: 2,
        fields: {
          id: b.id,
          blockName: "",
          blockType: "stats",
          items: b.items.slice(0, 4).map((item, idx) => ({
            id: `${b.id}-item-${idx + 1}`,
            value: item.value,
            label: item.label,
          })),
        },
      };
    }
    if (b.kind === "raw") {
      return b.json;
    }
    return {
      type: "paragraph",
      format: "",
      indent: 0,
      version: 1,
      direction: dir,
      textFormat: 0,
      children: markdownToInlineNodes(b.text, dir),
    };
  });

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: dir,
      children,
    },
  };
}
