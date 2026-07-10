/**
 * TOC EXTRACTION — walks a Post's Lexical richText and returns the h2
 * sections in document order, numbered 01… with stable anchor ids.
 * Shared by ArticleBody (renders the numbered headers) and
 * WritingDetailView (renders the side navigation rail).
 */

export type ArticleSection = { no: string; id: string; text: string };

type LexicalNode = {
  type?: string;
  tag?: string;
  children?: { text?: string }[];
};

export function sectionAnchor(text: string): string {
  return (
    "s-" +
    text
      .toLowerCase()
      .replace(/[^\w؀-ۿ]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
  );
}

export function extractSections(content: unknown): ArticleSection[] {
  const children =
    (content as { root?: { children?: LexicalNode[] } })?.root?.children ?? [];
  const sections: ArticleSection[] = [];
  for (const node of children) {
    if (node?.type === "heading" && node.tag === "h2") {
      const text = (node.children ?? []).map((c) => c.text ?? "").join("");
      if (!text) continue;
      sections.push({
        no: String(sections.length + 1).padStart(2, "0"),
        id: sectionAnchor(text),
        text,
      });
    }
  }
  return sections;
}
