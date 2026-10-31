import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

/**
 * The share cards read their pictures with readFile(process.cwd()/public/<path>) at
 * request time (lib/og-kit.tsx). Vercel only ships the files the tracer can see plus
 * the ones next.config.ts lists in outputFileTracingIncludes, so a picture that is not
 * listed is missing on the deployed site and its tile renders empty. Everything works
 * locally, which is why this is checked here.
 */
const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

/** The "/images/…" paths lib/og-pages.tsx hands to ogImgs(). */
function picturesUsedByShareCards(): string[] {
  const source = read("lib/og-pages.tsx");
  return [...new Set([...source.matchAll(/"(\/images\/[^"]+)"/g)].map((m) => m[1] as string))];
}

/** The public files next.config.ts force-includes for the opengraph-image routes. */
function picturesBundledForShareCards(): Set<string> {
  const config = read("next.config.ts");
  const start = config.indexOf("outputFileTracingIncludes");
  assert.ok(start >= 0, "next.config.ts must set outputFileTracingIncludes");
  const block = config.slice(start, config.indexOf("async headers()", start));
  assert.match(block, /"\/\*\*\/opengraph-image\*"/, "the include list must target the opengraph-image routes");
  return new Set([...block.matchAll(/"\.\/public(\/images\/[^"]+)"/g)].map((m) => m[1] as string));
}

test("every picture a share card reads exists and is bundled into the OG functions", () => {
  const used = picturesUsedByShareCards();
  const bundled = picturesBundledForShareCards();
  assert.ok(used.length >= 10, `expected lib/og-pages.tsx to reference its pictures, found ${used.length}`);

  for (const file of used) {
    assert.ok(existsSync(join(root, "public", file)), `${file} is used by lib/og-pages.tsx but is missing from public/`);
    assert.ok(
      bundled.has(file),
      `${file} is read by a share card but is not in outputFileTracingIncludes (next.config.ts): it would be missing on Vercel and its tile would be empty`,
    );
  }
});

test("the include list names only files that exist and that a share card actually uses", () => {
  const used = new Set(picturesUsedByShareCards());
  for (const file of picturesBundledForShareCards()) {
    assert.ok(existsSync(join(root, "public", file)), `${file} is listed in outputFileTracingIncludes but is missing from public/`);
    assert.ok(used.has(file), `${file} is bundled for the share cards but nothing in lib/og-pages.tsx reads it (remove it to keep the functions small)`);
  }
});
