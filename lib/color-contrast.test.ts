import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const cssPath = fileURLToPath(new URL("../app/(site)/[locale]/globals.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");
const layout = readFileSync(fileURLToPath(new URL("../app/(site)/[locale]/layout.tsx", import.meta.url)), "utf8");
const boot = readFileSync(fileURLToPath(new URL("./boot-script.ts", import.meta.url)), "utf8");
const nav = readFileSync(fileURLToPath(new URL("../components/layout/nav.tsx", import.meta.url)), "utf8");
const command = readFileSync(fileURLToPath(new URL("../components/command/command-palette.tsx", import.meta.url)), "utf8");
const homepage = readFileSync(fileURLToPath(new URL("../app/(site)/[locale]/page.tsx", import.meta.url)), "utf8");
const homeIndex = readFileSync(fileURLToPath(new URL("../features/home/home-index.tsx", import.meta.url)), "utf8");
const theme = css.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1];
assert.ok(theme, "CSS @theme block must be present");

const colors = new Map(
  [...theme.matchAll(/--color-([a-z0-9-]+):\s*(#[\da-fA-F]{6})\b/g)].map((match) => [match[1]!, match[2]!.toUpperCase()] as const),
);
const surfaces = ["surface-0", "surface-1", "surface-2", "surface-3"] as const;
const readableRoles = [
  "text-primary",
  "text-secondary",
  "text-tertiary",
  "text-ghost",
  "accent-text",
  "secondary-cyan",
  "secondary-mint",
  "secondary-pink",
  "secondary-mauve",
  "secondary-lime",
  "secondary-blue",
  "success-text",
  "warning-text",
  "danger-text",
  "info-text",
] as const;

function luminance(hex: string): number {
  const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
}

function contrastRatio(first: string, second: string): number {
  const sorted = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (sorted[0]! + 0.05) / (sorted[1]! + 0.05);
}

test("the public site has four distinct, dark-only elevation surfaces", () => {
  const values = surfaces.map((name) => colors.get(name));
  assert.ok(values.every(Boolean), "all four surface tokens must be explicit hex colors");
  assert.equal(new Set(values).size, 4, "surface planes must be visually distinct");
  for (const [index, value] of values.entries()) {
    assert.ok(luminance(value!) < 0.03, `${surfaces[index]} must remain charcoal-dark`);
  }
});

test("raised homepage chapters alternate only between two dark surface tokens", () => {
  const chapterSurfaces = [...css.matchAll(/--chapter-surface:\s*var\(--color-(surface-[12])\)/g)].map((match) => match[1]!);
  assert.deepEqual(new Set(chapterSurfaces), new Set(["surface-1", "surface-2"]));
  assert.ok(chapterSurfaces.length >= 4, "proof, process, about, and CTA chapters must state their dark surface role");
});

test("all semantic text and accent colors meet WCAG AA on every dark surface", () => {
  for (const role of readableRoles) {
    const foreground = colors.get(role);
    assert.ok(foreground, `missing semantic color token --color-${role}`);
    for (const surface of surfaces) {
      const background = colors.get(surface);
      assert.ok(background, `missing background token --color-${surface}`);
      const ratio = contrastRatio(foreground!, background!);
      assert.ok(ratio >= 4.5, `--color-${role} on --color-${surface} is ${ratio.toFixed(2)}:1 (needs 4.5:1)`);
    }
  }
});

test("the orange primary action keeps dark ink readable on its filled surface", () => {
  const orange = colors.get("accent");
  const ink = colors.get("obsidian");
  assert.ok(orange && ink, "accent and ink tokens must be defined");
  assert.ok(contrastRatio(ink!, orange!) >= 4.5, "dark button text on orange must meet WCAG AA");
});

test("light mode cannot be restored or selected from the public interface", () => {
  assert.match(layout, /data-theme="dark"/);
  assert.match(boot, /setAttribute\("data-theme","dark"\)/);
  assert.match(boot, /localStorage\.setItem\("theme","dark"\)/);
  assert.doesNotMatch(nav, /Switch to light mode|LIGHT MODE/);
  assert.doesNotMatch(command, /Toggle light \/ dark/);
});

test("the homepage chapter index links to real sections without replacing their content", () => {
  const targets = [...homeIndex.matchAll(/href: "#([^\"]+)"/g)].map((match) => match[1]!);
  assert.deepEqual(targets, ["selected-work", "home-digital-products", "home-process", "home-writing"]);
  for (const target of targets) {
    assert.ok(homepage.includes(`sectionId="${target}"`) || homepage.includes(`id="${target}"`), `missing homepage target #${target}`);
  }
  assert.match(homepage, /<HomeIndex\s*\/>/);
});
