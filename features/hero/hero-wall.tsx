"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { joinClasses } from "@/lib/utils";
import type { HeroWallTile } from "./hero-wall-data";

/**
 * HERO WALL — three real pieces of work in the first screen.
 *
 * Layout: the first tile spans both columns (the flagship, shown whole at
 * 16:10 — no crop), the other two share the row beneath. Every tile is a
 * link to its case study, named in the tile itself, so the picture is never
 * the only thing telling you what you are about to open.
 *
 * Desktop only (the parent hides it below `lg`): on a phone the featured
 * cards are the very next thing down, so repeating them above the fold would
 * only push the call to action off the screen.
 */
export function HeroWall({ tiles }: { tiles: readonly HeroWallTile[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <ul className="grid grid-cols-2 gap-3" aria-label={ar ? "من الأعمال" : "From the work"}>
      {tiles.map((tile, i) => {
        const first = i === 0;
        const name = ar ? tile.nameAr : tile.name;
        return (
          <li key={tile.slug} className={joinClasses(first && "col-span-2")}>
            <Link
              href={`/case-studies/${tile.slug}`}
              className="group relative block aspect-[16/10] overflow-hidden rounded-card border border-border-subtle bg-surface-1"
            >
              <Image
                src={tile.src}
                alt=""
                fill
                /* The wall is `hidden` under lg: a 1px slot makes a phone that
                   still resolves this <img> pick the 16w variant instead of a
                   full-size file it will never show. */
                sizes={first ? "(min-width: 1024px) 40vw, 1px" : "(min-width: 1024px) 20vw, 1px"}
                loading={first ? "eager" : "lazy"}
                fetchPriority={first ? "high" : "auto"}
                className="object-cover transition-transform duration-700 ease-physics group-hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian/80 via-obsidian/25 to-transparent"
              />
              <span className="absolute inset-x-0 bottom-0 z-elevated flex items-center justify-between gap-2 px-3 pb-2.5 font-mono text-micro uppercase tracking-[0.08em] text-alabaster">
                <span className="truncate">{name}</span>
                <span
                  aria-hidden
                  className="inline-flex shrink-0 transition-transform duration-base ease-physics group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                >
                  <Icon name="arrow-up-right" />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
