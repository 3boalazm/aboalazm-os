"use client";

/**
 * PHOTO STRIP — the visual breath in the middle of the page.
 *
 * Home sections 06 → 11 (offer, method, practice, languages, start, thinking)
 * are all type: the visitor reads six blocks of prose with nothing to look at
 * between the two work showcases and the closing CTA. On a phone that stretch
 * is exactly where the page stopped feeling like a studio and started reading
 * like a document.
 *
 * This band is a swiped shelf of real deliverables — identity frames and
 * shipped interfaces, each captioned with the project it belongs to. It is
 * mobile-only (`lg:hidden`): on desktop the page already runs two work
 * showcases, the hero wall and a duotone statement, so another row of the same
 * pictures would only repeat itself.
 */
import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/components/providers/lang-provider";

interface Frame {
  src: string;
  /** Project name, painted on the frame. */
  name: readonly [string, string];
  /** What the frame shows, in one or two words. */
  kind: readonly [string, string];
}

const FRAMES: readonly Frame[] = [
  {
    src: "/images/generated/creative-type-texture.jpg",
    name: ["Type & texture", "الحرف والملمس"],
    kind: ["Identity plate", "لوحة هوية"],
  },
  {
    src: "/images/generated/creative-glass-ribbon.jpg",
    name: ["Glass study", "دراسة زجاج"],
    kind: ["Art direction", "إدارة فنية"],
  },
  {
    src: "/images/generated/discipline-brand.jpg",
    name: ["Print system", "نظام مطبوعات"],
    kind: ["Deboss & foil", "دِبوس ومعدن"],
  },
  {
    src: "/images/generated/creative-mirror-shard.jpg",
    name: ["Chrome shards", "شظايا كروم"],
    kind: ["Form study", "دراسة شكل"],
  },
  {
    src: "/images/generated/creative-chrome-figure.jpg",
    name: ["Figure", "شكل"],
    kind: ["Art direction", "إدارة فنية"],
  },
  {
    src: "/images/generated/discipline-digital.jpg",
    name: ["Interface", "واجهة"],
    kind: ["Digital product", "منتج رقمي"],
  },
  {
    src: "/images/generated/creative-smoke-type.jpg",
    name: ["Smoke column", "عمود دخان"],
    kind: ["Texture", "ملمس"],
  },
  {
    src: "/images/generated/discipline-systems.jpg",
    name: ["System map", "خريطة نظام"],
    kind: ["Operations", "تشغيل"],
  },
  {
    src: "/images/generated/creative-paper-arc.jpg",
    name: ["Paper arc", "قوس ورق"],
    kind: ["Print & material", "مطبوع ومادة"],
  },
  {
    src: "/images/generated/band-faq.jpg",
    name: ["Material", "مادة"],
    kind: ["Paper & light", "ورق وضوء"],
  },
];

export function PhotoStrip() {
  const { lang } = useLang();
  const ar = lang === "ar";
  /* Slit gallery: every frame is a narrow strip; one is open at a time.
     Tap (or hover on a pointer device) opens a strip — six pictures in the
     height of one, instead of a swipe shelf that hid five of them. */
  const [open, setOpen] = useState(1);

  return (
    <section
      aria-label={ar ? "من داخل الملفات" : "Inside the files"}
      className="overflow-hidden border-y border-border-subtle bg-surface-0 py-4"
    >
      <div className="container-wide flex items-end justify-between gap-3 pb-3">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "من داخل الملفات" : "INSIDE THE FILES"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent tabular-nums">
          {String(open + 1).padStart(2, "0")}
          {/* phones show six strips (see .slit-gallery), so the total is desktop-only */}
          <span className="max-sm:hidden"> / {String(FRAMES.length).padStart(2, "0")}</span>
        </p>
      </div>
      <ul className="slit-gallery container-wide" dir="ltr">
        {FRAMES.map((frame, i) => {
          const isOpen = i === open;
          const name = ar ? frame.name[1] : frame.name[0];
          const kind = ar ? frame.kind[1] : frame.kind[0];
          return (
            <li key={frame.src} data-open={isOpen}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setOpen(i);
                }}
                onFocus={() => setOpen(i)}
                aria-expanded={isOpen}
                aria-label={`${name} — ${kind}`}
                className="absolute inset-0 block size-full cursor-pointer"
              >
                <figure className="absolute inset-0">
                  <Image
                    src={frame.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 80vw"
                    loading="lazy"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian/85 via-obsidian/30 to-transparent"
                  />
                  <figcaption dir={ar ? "rtl" : "ltr"} className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 text-start">
                    <span className="whitespace-nowrap font-display text-body font-medium leading-tight text-alabaster">{name}</span>
                    <span className="whitespace-nowrap font-mono text-micro uppercase tracking-[0.08em] text-alabaster/80">{kind}</span>
                  </figcaption>
                </figure>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
