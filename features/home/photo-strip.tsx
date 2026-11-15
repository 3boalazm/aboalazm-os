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
    src: "/images/work/ahmed-bedeer-card.jpg",
    name: ["Ahmed Bedeer", "أحمد بدير"],
    kind: ["Identity system", "نظام هوية"],
  },
  {
    src: "/images/work/cc-poster-mockup.jpg",
    name: ["Code & Canvas", "كود آند كانفس"],
    kind: ["Poster system", "نظام بوسترات"],
  },
  {
    src: "/images/work/dev-cards/nile-erp-command-center-card.jpg",
    name: ["Nile Pharma ERP", "نايل فارما ERP"],
    kind: ["Operations dashboard", "لوحة تشغيل"],
  },
  {
    src: "/images/work/dev-cards/farm-console-card.jpg",
    name: ["Farm Console", "فارم كونسول"],
    kind: ["Business system", "نظام أعمال"],
  },
  {
    src: "/images/work/dev-cards/oltre-collective-card.jpg",
    name: ["Oltre Collective", "أولتري كولكتيف"],
    kind: ["Digital experience", "تجربة رقمية"],
  },
  {
    src: "/images/work/ahmed-bedeer-applications.jpg",
    name: ["Ahmed Bedeer", "أحمد بدير"],
    kind: ["Applications", "تطبيقات الهوية"],
  },
];

export function PhotoStrip() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <section
      aria-label={ar ? "من داخل الملفات" : "Inside the files"}
      className="overflow-hidden border-y border-border-subtle bg-surface-0 py-4 lg:hidden"
    >
      <div className="container-wide flex items-end justify-between gap-3 pb-3">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "من داخل الملفات" : "INSIDE THE FILES"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
          {ar ? "اسحب →" : "SWIPE →"}
        </p>
      </div>
      <ul
        className="-mx-3 flex snap-x snap-mandatory scroll-px-3 gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        dir={ar ? "rtl" : "ltr"}
      >
        {FRAMES.map((frame, i) => (
          <li
            key={frame.src}
            className={
              i % 2 === 0
                ? "w-[68%] shrink-0 snap-start"
                : "w-[68%] shrink-0 snap-start translate-y-3"
            }
          >
            <figure className="relative aspect-[4/3] overflow-hidden rounded-card border border-border-subtle bg-surface-1">
              <Image
                src={frame.src}
                alt={`${ar ? frame.name[1] : frame.name[0]} — ${ar ? frame.kind[1] : frame.kind[0]}`}
                fill
                sizes="68vw"
                loading="lazy"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian/85 via-obsidian/35 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3">
                <span className="font-display text-body font-medium leading-tight text-alabaster">
                  {ar ? frame.name[1] : frame.name[0]}
                </span>
                <span className="font-mono text-micro uppercase tracking-[0.08em] text-alabaster/80">
                  {ar ? frame.kind[1] : frame.kind[0]}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
