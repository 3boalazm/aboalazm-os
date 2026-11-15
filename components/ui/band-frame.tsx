"use client";

/**
 * BAND FRAME — one picture behind a text band, phones only.
 *
 * Why this exists: the home page runs a stretch where four sections in a row
 * are columns of type (method → practice → languages → how to start → writing).
 * Each one is well built on its own; stacked, a phone gets ~6 screens of prose
 * with nothing to look at, which is the "blocks of text" read.
 *
 * The fix is not more cards — it is one photograph per band, held back under a
 * veil so the copy keeps its contrast, with the band's own content sitting on
 * top. The picture changes the surface every screen or two while the words stay
 * exactly where they were.
 *
 * Desktop is untouched: from `lg` this renders nothing but its children, so the
 * band keeps the typographic treatment the system was built around.
 *
 * Padding lives on the content wrapper, not on the band, because the picture
 * has to bleed past the type for the frame to read as a frame.
 */
import type { ReactNode } from "react";
import Image from "next/image";
import { joinClasses } from "@/lib/utils";

export function BandFrame({
  src,
  children,
  className = "",
  contentClassName = "",
  veil = "bottom",
  /** `panel` = rounded, bordered picture; `bleed` = edge-to-edge with hairlines. */
  shape = "panel",
  priority = false,
}: {
  src: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  veil?: "bottom" | "start" | "full";
  shape?: "panel" | "bleed";
  priority?: boolean;
}) {
  const VEIL = {
    bottom: "bg-gradient-to-t from-obsidian/96 via-obsidian/82 to-obsidian/50",
    start:
      "bg-gradient-to-r from-obsidian/96 via-obsidian/84 to-obsidian/50 rtl:bg-gradient-to-l",
    full: "bg-obsidian/82",
  } as const;

  return (
    <div className={joinClasses("relative lg:overflow-visible", className)}>
      <div
        aria-hidden
        className={joinClasses(
          "pointer-events-none absolute inset-0 overflow-hidden lg:hidden",
          shape === "panel" ? "rounded-panel border border-border-subtle" : "",
        )}
      >
        <Image src={src} alt="" fill sizes="100vw" priority={priority} className="object-cover" />
        <div className={joinClasses("absolute inset-0", VEIL[veil])} />
        {shape === "bleed" ? (
          <div className="absolute inset-0 border-y border-border-subtle" />
        ) : null}
      </div>
      <div className={joinClasses("relative z-elevated", contentClassName)}>{children}</div>
    </div>
  );
}
