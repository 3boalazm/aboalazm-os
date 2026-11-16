import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

/**
 * An arrow typed into Arabic copy keeps the direction it was drawn in, because the bidi
 * algorithm never mirrors it. After Arabic text, "→" sits at the line's end pointing back
 * at the words, and "↗" points at them too. So in Arabic copy:
 *   - a back link opens with "→" (it sits at the start of the line, pointing toward it),
 *   - a forward link ends with "←",
 *   - an external link ends with "↖" (the mirror of "↗"),
 * and anything else with "→" or "↗" belongs in markup that is `dir="ltr"` or in Latin copy.
 * This test reads the sources and names the literal that breaks the rule.
 */

const ROOTS = ["app", "features", "components", "lib"];
const SKIP_DIRS = new Set(["node_modules", ".next", "studio"]);
const ARABIC = /[؀-ۿ]/;

function sources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) sources(join(dir, entry.name), out);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

test("Arabic copy never carries an arrow that points back at its own words", () => {
  const offenders: string[] = [];
  for (const root of ROOTS) {
    for (const file of sources(root)) {
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const m of line.matchAll(/"([^"\\\n]*)"/g)) {
          const text = m[1] ?? "";
          if (!ARABIC.test(text)) continue;
          const badRight = text.includes("→") && !/^\s*→/.test(text);
          const badExternal = text.includes("↗");
          if (badRight || badExternal) offenders.push(`${file}:${i + 1}  "${text.slice(0, 60)}"`);
        }
      });
    }
  }
  assert.deepEqual(offenders, [], `Arabic strings with an arrow facing the wrong way:\n${offenders.join("\n")}`);
});
