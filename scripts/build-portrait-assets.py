#!/usr/bin/env python3
"""
build-portrait-assets.py — every size of the portrait, generated from the one original.

The original is media/mustafa-aboalazm.png (768x768, untouched). Nothing on the site may be a
scaled-up copy of a smaller copy: that is how the avatar, the favicons and the app icons ended up
soft and blocky. When the picture changes, replace the original and re-run:

    python3 scripts/build-portrait-assets.py

Needs Pillow (pip install pillow). Output is deterministic.

  public/images/work/portrait-512.png   512  share cards (OG "About" tile, 420px), JSON-LD image/logo
  public/images/work/portrait-256.png   256  favicon, /developer orb, folio avatar, small share-card avatars
  public/images/work/portrait-128.webp  128  header avatar (40px, up to 3x) — ~3 kB instead of a 38 kB PNG
  public/images/work/icon.png           256  legacy path (older caches, the print portfolio); same pixels as portrait-256
  public/icons/app-192.png              192  manifest icon
  public/icons/app-512.png              512  manifest icon (also precached by sw.js)
  public/icons/app-512-maskable.png     512  manifest maskable icon (same file, full-bleed as before)
  public/icons/apple-touch-icon.png     180  iOS home screen

New file names (not in-place overwrites) are deliberate: /images is cached for a day and the service
worker serves images stale-while-revalidate, so a changed file behind an old URL keeps showing the old
picture for returning visitors.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "media" / "mustafa-aboalazm.png"


def load() -> Image.Image:
    im = Image.open(SRC)
    assert im.size == (768, 768), f"expected the 768x768 original, got {im.size}"
    return im.convert("RGB")  # the original is opaque (alpha is 255 everywhere)


def scaled(im: Image.Image, size: int) -> Image.Image:
    return im if size == im.width else im.resize((size, size), Image.LANCZOS)


def png(im: Image.Image, size: int, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    scaled(im, size).save(dest, "PNG", optimize=True, compress_level=9)


def main() -> None:
    im = load()
    work = ROOT / "public" / "images" / "work"
    icons = ROOT / "public" / "icons"

    png(im, 512, work / "portrait-512.png")
    png(im, 256, work / "portrait-256.png")
    png(im, 256, work / "icon.png")
    scaled(im, 128).save(work / "portrait-128.webp", "WEBP", quality=92, method=6)

    png(im, 192, icons / "app-192.png")
    png(im, 512, icons / "app-512.png")
    png(im, 512, icons / "app-512-maskable.png")
    png(im, 180, icons / "apple-touch-icon.png")

    for p in sorted([*work.glob("portrait-*"), work / "icon.png", *icons.glob("*.png")]):
        print(f"{p.relative_to(ROOT)}  {Image.open(p).size}  {p.stat().st_size / 1024:.1f} kB")


if __name__ == "__main__":
    main()
