// opentype.js ships two builds and they disagree about exports. The ESM build Next bundles for the
// server (dist/opentype.mjs) has named exports only, so `import opentype from "opentype.js"` is
// undefined there: that is how the first version of this file failed in production while the tests,
// which load the CommonJS build (everything under `default`), passed. Take whichever shape arrives.
import * as opentypeModule from "opentype.js";
import type { Font } from "opentype.js";
import { readFileSync } from "fs";
import path from "path";

/**
 * How wide Satori really draws an Arabic word.
 *
 * Satori lays text out from the width of each letter measured on its own, in isolated form, but
 * draws the word shaped, with the narrower joined forms. Every Arabic word therefore comes out
 * 15-25% wider as a box than as ink, and the slack piles up between words. Measuring the word
 * the way Satori draws it (opentype.js, the same shaping engine, the same face) gives the width
 * the box should have had. RtlText (lib/og-rtl.tsx) pins each word to it.
 *
 * `null` means "cannot say": the face is not readable, or has no glyph for part of the word
 * (a Latin letter, say). The caller then leaves that word to Satori's own measure.
 */

const ARABIC_FACE = "public/fonts/thmanyahserifdisplay-Bold.otf";

const opentype = ((opentypeModule as unknown as { default?: typeof opentypeModule }).default ??
  opentypeModule) as typeof opentypeModule;

let face: Font | null | undefined;

function arabicFace(): Font | null {
  if (face !== undefined) return face;
  try {
    const raw = readFileSync(path.join(process.cwd(), ARABIC_FACE));
    face = opentype.parse(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer);
  } catch (err) {
    // Never fatal: the card still renders, just with Satori's wider word boxes.
    console.warn(`[og] could not read the Arabic face for measuring: ${err instanceof Error ? err.message : String(err)}`);
    face = null;
  }
  return face;
}

/** The drawn width of one Arabic word at `fontSize`, or null when it cannot be measured. */
export function arabicWordWidth(word: string, fontSize: number): number | null {
  const f = arabicFace();
  if (!f || word === "") return null;
  for (const ch of word) {
    if (f.charToGlyphIndex(ch) === 0) return null;
  }
  return f.getAdvanceWidth(word, fontSize);
}

/** The face's own word space at `fontSize` — what a browser would put between two words. */
export function arabicSpaceWidth(fontSize: number): number | null {
  const f = arabicFace();
  if (!f) return null;
  const glyph = f.charToGlyph(" ");
  return (glyph.advanceWidth ?? 0) * (fontSize / f.unitsPerEm) || null;
}
