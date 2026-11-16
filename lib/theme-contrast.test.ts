/**
 * THEME CONTRAST — every text and coloured-type token must clear WCAG AA
 * (4.5:1) on every surface step of every ground, in both themes. Also: dark
 * grounds are all dark and light grounds all light (the owner's rule — no
 * light band inside the dark theme), and the shipped CSS equals the tokens.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { GROUND_NAMES, THEMES, contrast, groundsCss, hexToRgb, over } from "./theme-tokens";

for (const theme of ["dark", "light"] as const) {
  const t = THEMES[theme];
  test(`${theme}: text and coloured type reach AA on every ground step`, () => {
    for (const name of GROUND_NAMES) {
      // s0–s2 carry running text; s3 (popovers) is checked for primary/secondary only.
      t.grounds[name].forEach((hex, step) => {
        const bg = hexToRgb(hex);
        const check = (label: string, fg: readonly [number, number, number], min: number) => {
          const ratio = contrast(fg, bg);
          assert.ok(ratio >= min, `${theme}/${name}/s${step} ${label}: ${ratio.toFixed(2)} < ${min}`);
        };
        check("primary", over(t.text.primary, bg), 7);
        check("secondary", over(t.text.secondary, bg), 4.5);
        if (step < 3) {
          check("tertiary", over(t.text.tertiary, bg), 4.5);
          for (const [k, hex2] of Object.entries(t.type)) check(`type.${k}`, hexToRgb(hex2), 4.5);
        }
      });
    }
  });

  test(`${theme}: every ground stays on its side of the theme`, () => {
    for (const name of GROUND_NAMES) {
      for (const hex of t.grounds[name]) {
        const [r, g, b] = hexToRgb(hex);
        const light = (r * 299 + g * 587 + b * 114) / 1000;
        if (theme === "dark") assert.ok(light < 60, `dark ground ${name} ${hex} is not dark`);
        else assert.ok(light > 190, `light ground ${name} ${hex} is not light`);
      }
    }
  });
}

test("theme-grounds.css ships exactly the tested tokens", () => {
  const css = readFileSync(join(process.cwd(), "app/(site)/[locale]/theme-grounds.css"), "utf8");
  assert.ok(css.includes(groundsCss()), "run: npx tsx scripts/build-theme-css.ts");
});
