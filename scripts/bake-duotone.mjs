#!/usr/bin/env node
/**
 * Bake the studio duotone into a JPEG.
 *
 *   node scripts/bake-duotone.mjs <input> <output> [--crop left,top,width,height] [--width 2400] [--quality 80]
 *
 * Recipe (the same maths as design-preview/editorial-duotone-preview.html):
 *   luma (Rec.709 on sRGB values) → linear contrast → 4-stop gradient map.
 * The brightest stop IS --color-accent (#FF6B47), so a picture speaks the
 * studio accent without introducing a new hue.
 *
 * Why baked instead of a runtime CSS/SVG filter: Safari and low-end phones
 * pay nothing, the result is identical everywhere, and next/image can still
 * serve AVIF/WebP. A different picture → run this again with the same stops.
 *
 * Needs `sharp` (an optional dependency of Next.js; `npm i --no-save sharp`
 * if it is not installed).
 *
 * Used for: public/images/cta/closing-duotone-npf.jpg (home closing CTA) —
 *   node scripts/bake-duotone.mjs public/images/work/nile-pharma/npf-business-card-box.jpg \
 *     public/images/cta/closing-duotone-npf.jpg --crop 1333,285,2667,1667 --width 2400
 */
import { statSync } from "node:fs";
import { basename } from "node:path";

/** shadow → accent. Keep the last stop equal to --color-accent in globals.css. */
const STOPS = ["#0b0201", "#4a0904", "#b81f0e", "#ff6b47"];
/** Contrast about zero plus a slight darkening — tuned on the first picture. */
const SLOPE = 1.4;
const INTERCEPT = -0.1;

function fail(message) {
  console.error(`${message}\n`);
  console.error("usage: node scripts/bake-duotone.mjs <input> <output> [--crop left,top,width,height] [--width 2400] [--quality 80]");
  process.exit(1);
}

const argv = process.argv.slice(2);
const positional = [];
const opts = { width: 2400, quality: 80, crop: null };
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--crop") opts.crop = (argv[++i] ?? "").split(",").map(Number);
  else if (arg === "--width") opts.width = Number(argv[++i]);
  else if (arg === "--quality") opts.quality = Number(argv[++i]);
  else if (arg.startsWith("--")) fail(`unknown option ${arg}`);
  else positional.push(arg);
}
const [input, output] = positional;
if (!input || !output) fail("need an input and an output path");
if (opts.crop && (opts.crop.length !== 4 || opts.crop.some((n) => !Number.isFinite(n)))) {
  fail("--crop needs four numbers: left,top,width,height");
}

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  fail("sharp is not installed — run: npm i --no-save sharp");
}

// 256-entry lookup: 8-bit luma → RGB, piecewise-linear across the stops.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const stops = STOPS.map(hex);
const lut = new Uint8Array(256 * 3);
for (let i = 0; i < 256; i++) {
  const v = Math.min(1, Math.max(0, (i / 255) * SLOPE + INTERCEPT));
  const pos = v * (stops.length - 1);
  const k = Math.min(stops.length - 2, Math.floor(pos));
  const t = pos - k;
  for (let c = 0; c < 3; c++) {
    lut[i * 3 + c] = Math.round(stops[k][c] * (1 - t) + stops[k + 1][c] * t);
  }
}

let img = sharp(input, { failOn: "none" });
if (opts.crop) {
  const [left, top, width, height] = opts.crop;
  img = img.extract({ left, top, width, height });
}
img = img.resize({ width: opts.width, withoutEnlargement: true });

const { data, info } = await img
  .removeAlpha()
  .toColourspace("srgb")
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = info.width * info.height;
const out = Buffer.allocUnsafe(pixels * 3);
for (let p = 0; p < pixels; p++) {
  const s = p * info.channels;
  const luma = Math.round(0.2126 * data[s] + 0.7152 * data[s + 1] + 0.0722 * data[s + 2]);
  const d = luma * 3;
  out[p * 3] = lut[d];
  out[p * 3 + 1] = lut[d + 1];
  out[p * 3 + 2] = lut[d + 2];
}

await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
  .jpeg({ quality: opts.quality, mozjpeg: true })
  .toFile(output);

const kb = (statSync(output).size / 1024).toFixed(0);
console.log(`${basename(output)} · ${info.width}×${info.height} · ${kb} KB`);
