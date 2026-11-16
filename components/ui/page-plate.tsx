"use client";

/**
 * PAGE PLATE — the quiet picture behind an inner page's header.
 *
 * Why: the home page became an image-led page, and every page it links to was
 * still a column of type. /about, /process and /pricing had literally zero
 * images — a visitor leaving the home page stepped straight back into a
 * document. The reference boards' idiom is one authored plate per screen, so
 * each page now opens on its own plate, held far enough back that the heading
 * keeps its contrast.
 *
 * Deliberately quiet: this is not a hero. It sits behind the header block at
 * low alpha on phones and at a whisper from `md` up, so the page keeps the
 * typographic character the system was built around while never being a wall
 * of text. It bleeds to the page edge, which also gives the top of the page the
 * full-bleed break the home page gets from its statement band.
 */
import Image from "next/image";
import { joinClasses } from "@/lib/utils";

export function PagePlate({
  src,
  children,
  className = "",
  /** Which side the type sits on, so the light leads the eye to it. */
  align = "start",
}: {
  src: string;
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}) {
  const VEIL = {
    start:
      "bg-gradient-to-r from-obsidian/95 via-obsidian/78 to-obsidian/45 rtl:bg-gradient-to-l",
    end: "bg-gradient-to-l from-obsidian/95 via-obsidian/78 to-obsidian/45 rtl:bg-gradient-to-r",
    center:
      "bg-[radial-gradient(120%_120%_at_50%_0%,transparent_0%,var(--color-obsidian)_72%)]",
  } as const;

  return (
    <div className={joinClasses("relative isolate", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-55 md:opacity-40"
        />
        <div className={joinClasses("absolute inset-0", VEIL[align])} />
        {/* The plate stops at a hairline rather than fading into the page, so
            the header reads as a framed opening and not as a smudge. */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-border-subtle" />
      </div>
      <div className="relative z-elevated">{children}</div>
    </div>
  );
}
