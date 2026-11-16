import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";

/**
 * Every share card prints one Arabic tag in Thmanyah Serif Display. Satori shapes Arabic
 * with a small OpenType engine that throws ("Cannot read properties of undefined
 * (reading 'codePointAt')") on a handful of letter pairs in that face: lam + alef
 * (لا، لأ), reh + alef (را) and more. The throw is raised while Next prerenders the
 * route, so one unlucky word in a tag fails the whole deploy; a preview build once died
 * on «الأعمال» and «مقالات». Neither `next dev` nor the type checker notices, so the tags
 * are rendered here the way the build renders them.
 */
test("every Arabic share-card tag renders in the OG display face", async () => {
  // tsx compiles lib/og-pages.tsx with the classic JSX runtime, which needs React in scope.
  (globalThis as { React?: unknown }).React = React;
  const { ImageResponse } = await import("next/og");
  const { ogFonts } = await import("@/lib/og");
  const { OG_PAGES } = await import("@/lib/og-pages");
  const fonts = await ogFonts();

  for (const [id, page] of Object.entries(OG_PAGES)) {
    const card = new ImageResponse(
      React.createElement(
        "div",
        { style: { display: "flex", fontFamily: "Thmanyah Serif Display", fontSize: 30 } },
        page.tagAr,
      ),
      { width: 600, height: 120, fonts },
    );
    try {
      await card.arrayBuffer();
    } catch (err) {
      const why = err instanceof Error ? err.message : String(err);
      assert.fail(
        `The Arabic tag of the "${id}" share card («${page.tagAr}») cannot be shaped by Satori (${why}). ` +
          "Reword it, avoiding the letter pairs لا، لأ، را, and run this test again.",
      );
    }
  }
});
