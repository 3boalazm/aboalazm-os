"use client";
import { useLang } from "@/components/providers/lang-provider";

/**
 * CASE GALLERY — accent-framed image strip.
 * Shared by all case studies that have real project visuals.
 * Full-span items take 16/9; halves are paired in a 2-col grid.
 */
import Image from "next/image";
import { MediaCard } from "@/components/ui/MediaCard";
import { lightMedia } from "@/lib/light-media";

export interface GalleryItem {
  src: string;
  caption: string;
  captionAr?: string;
  span?: "full" | "half";
  /**
   * "slide" = a page of the guidelines document (cover, palette, type…);
   * anything else is the identity in use. Untagged items (e.g. from the CMS)
   * count as in-use.
   */
  kind?: "application" | "slide";
}

/**
 * Halves are paired two to a row. A half left on its own (the next item is
 * full-width, or it is the last one) would leave an empty cell, so it goes
 * full-width instead.
 */
function effectiveSpans(items: readonly GalleryItem[]): ("full" | "half")[] {
  const out: ("full" | "half")[] = [];
  let open = -1; // index of a half waiting for a partner
  items.forEach((item, i) => {
    if (item.span === "full") {
      if (open >= 0) out[open] = "full";
      open = -1;
      out.push("full");
    } else if (open >= 0) {
      out.push("half");
      open = -1;
    } else {
      out.push("half");
      open = i;
    }
  });
  if (open >= 0) out[open] = "full";
  return out;
}

/**
 * `label` names the project. A CMS row's caption is an optional field, so an
 * image can arrive without one; its alt then falls back to "<project> — n"
 * instead of an empty string, which would hide an informational image
 * (a guideline page, a mock-up) from a screen reader.
 */
export function CaseGallery({ items, label }: { items: readonly GalleryItem[]; label?: string }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const spans = effectiveSpans(items);
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {items.map((item, i) => (
        <MediaCard
          key={item.src}
          as="figure"
          className={["relative", spans[i] === "full" ? "md:col-span-2" : ""].join(" ")}
        >
          <div className="relative aspect-[16/9]">
            <Image
              src={lightMedia(item.src)}
              alt={(ar && item.captionAr ? item.captionAr : item.caption) || (label ? `${label} — ${i + 1}` : "")}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-slow ease-physics group-hover:scale-[1.02]"
            />
          </div>
          <figcaption className="flex items-center justify-between gap-2 border-t border-border-subtle px-2 py-1">
            <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
              {ar && item.captionAr ? item.captionAr : item.caption}
            </span>
            <span
              aria-hidden
              className="size-1 rounded-pill bg-accent opacity-40 transition-opacity duration-base ease-physics group-hover:opacity-100"
            />
          </figcaption>
        </MediaCard>
      ))}
    </div>
  );
}
