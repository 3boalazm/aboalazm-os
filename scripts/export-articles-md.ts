/**
 * EXPORT ARTICLES → MARKDOWN — dumps every systems-series article
 * (W-006 … W-013, EN + AR) to clean .md files for external design work.
 * Content comes from the SAME source files the database was seeded from,
 * so what you hand to the designer is byte-identical to what's live.
 *
 * Usage:  npx tsx scripts/export-articles-md.ts
 * Output: exports/articles/<slug>.md
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import type { Block } from "./writing-content";
import { SYSTEMS_BODIES_EN } from "./writing-systems-en";
import { SYSTEMS_BODIES_AR } from "./writing-systems-ar";
import { WRITING_POSTS } from "./writing-posts-list";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../exports/articles");
fs.mkdirSync(OUT_DIR, { recursive: true });

function blockToMd(b: Block): string {
  if ("h" in b) return `## ${b.h}`;
  if ("h3" in b) return `### ${b.h3}`;
  if ("q" in b) return `> ${b.q}`;
  if ("ul" in b) return b.ul.map((i) => `- ${i}`).join("\n");
  if ("ol" in b) return b.ol.map((i, n) => `${n + 1}. ${i}`).join("\n");
  if ("table" in b) {
    const [head, ...rows] = b.table;
    return [
      `| ${head!.join(" | ")} |`,
      `| ${head!.map(() => "---").join(" | ")} |`,
      ...rows.map((r) => `| ${r.join(" | ")} |`),
    ].join("\n");
  }
  if ("mermaid" in b) {
    const caption = b.caption ? `\n*${b.caption}*` : "";
    return "```mermaid\n" + b.mermaid.trim() + "\n```" + caption;
  }
  if ("stats" in b) {
    return b.stats.map((s) => `- **${s.value}** — ${s.label}`).join("\n");
  }
  return b.p;
}

const ALL_BODIES: Record<string, Block[]> = { ...SYSTEMS_BODIES_EN, ...SYSTEMS_BODIES_AR };

let count = 0;
for (const post of WRITING_POSTS) {
  const blocks = ALL_BODIES[post.slug];
  if (!blocks) continue; // original W-001..005 essays — not part of the export

  const lang = post.lang ?? "en";
  const md = [
    "---",
    `index: ${post.index}`,
    `slug: ${post.slug}`,
    `lang: ${lang}`,
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `standfirst: "${post.standfirst.replace(/"/g, '\\"')}"`,
    `publishedAt: ${post.publishedAt}`,
    "---",
    "",
    `# ${post.title}`,
    "",
    `*${post.standfirst}*`,
    "",
    blocks.map(blockToMd).join("\n\n"),
    "",
  ].join("\n");

  fs.writeFileSync(path.join(OUT_DIR, `${post.slug}.md`), md, "utf-8");
  console.log(`  ✓ ${post.slug}.md`);
  count++;
}

console.log(`\n✅ ${count} articles exported to exports/articles/`);
