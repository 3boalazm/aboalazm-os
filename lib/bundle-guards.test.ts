import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";

/**
 * Source-level guards for first-load JS. They are cheap to run and catch a regression the
 * moment it is written, long before anyone notices the route table grew.
 */
const ROOT = process.cwd();

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

const rel = (file: string) => relative(ROOT, file).split("\\").join("/");
const STATIC_IMPORT = (spec: string) => new RegExp(String.raw`^\s*import\s[^;]*?from\s+["']${spec}["']`, "m");

test("gsap is imported through @/lib/gsap only (so its defaults are always applied)", () => {
  const bare = STATIC_IMPORT("gsap");
  const offenders = [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components")), ...walk(join(ROOT, "features")), ...walk(join(ROOT, "hooks")), ...walk(join(ROOT, "lib"))]
    .filter((file) => rel(file) !== "lib/gsap.ts")
    .filter((file) => bare.test(readFileSync(file, "utf8")))
    .map(rel);
  assert.deepEqual(offenders, []);
});

test("nothing in the root layout graph imports gsap statically (~27 kB gz on every page)", () => {
  const staticLibGsap = STATIC_IMPORT("@/lib/gsap");
  const layoutLevel = [...walk(join(ROOT, "components")), join(ROOT, "app", "(site)", "[locale]", "layout.tsx")];
  const offenders = layoutLevel.filter((file) => staticLibGsap.test(readFileSync(file, "utf8"))).map(rel);
  assert.deepEqual(offenders, [], "load gsap with import(\"@/lib/gsap\") inside an effect instead");
});

test("lib/gsap.ts applies the house defaults", () => {
  const source = readFileSync(join(ROOT, "lib", "gsap.ts"), "utf8");
  assert.match(source, /gsap\.defaults\(GSAP_DEFAULTS\)/);
});
