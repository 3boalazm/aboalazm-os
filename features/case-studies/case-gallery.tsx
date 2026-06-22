"use client";
import { useLang } from "@/components/providers/lang-provider";

/**
 * CASE GALLERY — accent-framed image strip.
 * Shared by all case studies that have real project visuals.
 * Full-span items take 16/9; halves are paired in a 2-col grid.
 */
import Image from "next/image";

export interface GalleryItem {
  src: string;
  caption: string;
  captionAr?: string;
  span?: "full" | "half";
}

export function CaseGallery({ items }: { items: readonly GalleryItem[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {items.map((item) => (
        <figure
          key={item.src}
          className={[
            "group relative overflow-hidden rounded-card border border-border-subtle bg-surface-1",
            item.span === "full" ? "md:col-span-2" : "",
          ].join(" ")}
        >
          <div className="relative aspect-[16/9]">
            <Image
              src={item.src}
              alt={ar && item.captionAr ? item.captionAr : item.caption}
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
        </figure>
      ))}
    </div>
  );
}
