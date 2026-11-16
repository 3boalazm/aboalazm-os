import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";

/**
 * Satori shapes Arabic with a small OpenType engine. Handed a glyph that has no code point
 * of its own (the lam-alef ligature and its kin: لا، لأ، را …) it asks for "the font for no
 * character", receives the LAST font in the list, and throws ("Cannot read properties of
 * undefined (reading 'codePointAt')") unless that is the face it is shaping. Once, a preview
 * build died on «الأعمال» and «مقالات»; and in production the share card of every Arabic
 * article failed, because its «مقالات» eyebrow is one of those pairs. Neither `next dev` nor
 * the type checker notices, so the cards are rendered here the way the server renders them.
 *
 * The fix is in lib/og.tsx: ogFonts() lists the Arabic face last.
 */

// tsx compiles the OG modules with the classic JSX runtime, which needs React in scope.
function useReact(): void {
  (globalThis as { React?: unknown }).React = React;
}

async function render(node: React.ReactElement, size: { width: number; height: number }): Promise<number> {
  const { ImageResponse } = await import("next/og");
  const { ogFonts } = await import("@/lib/og");
  const image = new ImageResponse(node, { ...size, fonts: await ogFonts() });
  return (await image.arrayBuffer()).byteLength;
}

test("the Arabic display face is registered last", async () => {
  useReact();
  const { ogFonts } = await import("@/lib/og");
  const fonts = await ogFonts();
  assert.equal(fonts.at(-1)?.name, "Thmanyah Serif Display");
});

test("every Arabic share-card tag renders in the OG display face", async () => {
  useReact();
  const { OG_PAGES } = await import("@/lib/og-pages");

  for (const [id, page] of Object.entries(OG_PAGES)) {
    const node = React.createElement(
      "div",
      { style: { display: "flex", fontFamily: "Thmanyah Serif Display", fontSize: 30 } },
      page.tagAr,
    );
    try {
      await render(node, { width: 600, height: 120 });
    } catch (err) {
      const why = err instanceof Error ? err.message : String(err);
      assert.fail(`The Arabic tag of the "${id}" share card («${page.tagAr}») cannot be shaped by Satori (${why}).`);
    }
  }
});

/** Titles that are not in the seed list but stress the layout: Latin runs, digits, a very long headline. */
const EXTRA_TITLES: readonly string[] = [
  "كيف تبني Design Systems تخدم ٣٨ يوماً من العمل مع Figma و ERP",
  "لماذا تفشل معظم مواقع الشركات رغم جودة تصميمها، وكيف تتحول الواجهة إلى أصل تجاري عندما تُبنى من داخل الهوية لا فوقها؟",
];

test("the share card of every Arabic article renders, whatever letters its title holds", async () => {
  useReact();
  const { OgCard, OG_SIZE } = await import("@/lib/og");
  const { WRITING_POSTS } = await import("../scripts/writing-posts-list");

  // The seed list is the single source of the articles, so a new Arabic post is covered the day it is added.
  const titles = [...WRITING_POSTS.filter((p) => p.lang === "ar").map((p) => p.title), ...EXTRA_TITLES];
  assert.ok(titles.length >= 10, "expected the Arabic articles of the seed list");

  for (const title of titles) {
    try {
      const bytes = await render(React.createElement(OgCard, { eyebrow: "مقالات", title, lang: "ar" }), OG_SIZE);
      assert.ok(bytes > 10_000, `«${title}» rendered an empty card`);
    } catch (err) {
      const why = err instanceof Error ? err.message : String(err);
      assert.fail(`The share card of «${title}» failed to render (${why}). Is ogFonts() still listing the Arabic face last?`);
    }
  }
});
