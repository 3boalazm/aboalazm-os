/**
 * LIGHT MEDIA — a heavy original, swapped for the same picture at a fraction
 * of the weight.
 *
 * `npf-logo-motion.gif` is 13.35 MB: 30 frames of 1400×700 in a 256-colour
 * palette, and Next does not recompress an animated GIF, so the Nile case
 * study shipped it as it was (13.76 MB on a cold visit). The animated WebP
 * beside it is the same 30 frames, same size, same 0.9 s loop, 660 KB — 21×
 * lighter, and the letterform comes out cleaner (no palette banding).
 *
 * The static data points at the WebP directly. This covers the other source,
 * a **live CMS row**, which still holds the GIF
 * (`…/api/media/file/npf-logo-motion-2.gif`, or the Blob URL behind it).
 * Matched on the basename so either form lands on the local file. Anything
 * that is not listed here is returned untouched.
 *
 * Delete an entry as soon as Admin replaces the upload with a light file.
 */
const LIGHT: readonly { readonly test: RegExp; readonly src: string }[] = [
  { test: /[/%]npf-logo-motion(-\d+)?\.gif/i, src: "/images/work/nile-pharma/npf-logo-motion.webp" },
];

export function lightMedia(src: string): string {
  const hit = LIGHT.find((l) => l.test.test(src));
  return hit ? hit.src : src;
}
