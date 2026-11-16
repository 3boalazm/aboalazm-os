"use client";

import Image from "next/image";
import Link from "@/components/ui/localized-link";
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
 * On a phone the wall is a swipeable poster strip (first tile 84% wide,
 * portrait 4:5, the rest peeking at 62%) sitting under the CTAs — the first
 * screen finally shows the work instead of pure type. On desktop it keeps
 * the two-column grid.
 */
export function HeroWall({ tiles }: { tiles: readonly HeroWallTile[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="flex flex-col gap-1.5">
      {/* On a phone the strip is labelled and counted, so the shelf reads as a
          gallery you can swipe rather than an image that happens to overflow. */}
      <div className="flex items-baseline justify-between gap-3 lg:hidden">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "من الأعمال" : "FROM THE WORK"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
          {ar ? `اسحب · ${tiles.length}` : `SWIPE · ${tiles.length}`}
        </p>
      </div>
      <ul
        className="grid grid-cols-2 gap-3 max-lg:-mx-3 max-lg:flex max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-3 max-lg:gap-2 max-lg:overflow-x-auto max-lg:px-3 max-lg:pb-2 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
        aria-label={ar ? "من الأعمال" : "From the work"}
      >
      {tiles.map((tile, i) => {
        const first = i === 0;
        const name = ar ? tile.nameAr : tile.name;
        return (
          <li
            key={tile.slug}
            className={joinClasses(
              first && "col-span-2",
              "max-lg:w-[88%] max-lg:shrink-0 max-lg:snap-start",
              !first && "max-lg:w-[64%]",
            )}
          >
            <Link
              href={`/case-studies/${tile.slug}`}
              className="group relative block aspect-[16/10] overflow-hidden rounded-card border border-border-subtle bg-surface-1 max-lg:aspect-[4/3]"
            >
              <Image
                src={tile.src}
                alt=""
                fill
                sizes={first ? "(min-width: 1024px) 40vw, 88vw" : "(min-width: 1024px) 20vw, 64vw"}
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
    </div>
  );
}
