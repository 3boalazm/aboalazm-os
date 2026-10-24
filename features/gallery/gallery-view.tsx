"use client";

/* ────────────────────────────────────────────────────────────────────────
 *  GALLERY — cross-project image wall.
 *  Aggregates brand imagery from every case study, filterable by client,
 *  laid out as a balanced masonry, with a keyboard-driven lightbox.
 * ──────────────────────────────────────────────────────────────────────── */

import { useState, useEffect, useCallback, useId, useRef } from "react";
import Link from "@/components/ui/localized-link";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import type { GalleryImage, GalleryProject } from "@/lib/gallery";
import { Heading } from "@/components/ui/Heading";
import { mediaCardVariants } from "@/components/ui/MediaCard";

// Deferred: GSAP + ScrollTrigger only load once this component actually
// mounts, instead of bundling into /gallery's initial JS unconditionally.
const RotatingGallery = dynamic(
  () => import("./rotating-gallery").then((m) => m.RotatingGallery),
  { ssr: false },
);

const EASE = [0.16, 1, 0.3, 1] as const;

const ALL_ACCENT = "#FF6B47";

interface GalleryData {
  projects: readonly GalleryProject[];
  images: readonly GalleryImage[];
  /** Overhaul S4: /gallery merged into /work as a view toggle (301'd).
      Embedded mode renders the wall without its own <main>/<header>. */
  embedded?: boolean;
}

export function GalleryView({ projects: GALLERY_PROJECTS, images: GALLERY_IMAGES, embedded = false }: GalleryData) {
  const projectOf = (slug: string): GalleryProject | undefined =>
    GALLERY_PROJECTS.find((p) => p.slug === slug);
  const { lang } = useLang();
  const ar = lang === "ar";
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState<string>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const isOpen = lightbox !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const captionId = useId();

  const filtered: readonly GalleryImage[] =
    active === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((g) => g.project === active);

  const close = useCallback(() => setLightbox(null), []);
  const go = useCallback(
    (dir: number) =>
      setLightbox((i) =>
        i === null ? i : (i + dir + filtered.length) % filtered.length,
      ),
    [filtered.length],
  );

  /* keyboard + scroll-lock while lightbox is open */
  useEffect(() => {
    if (!isOpen) return;
    // Deliberate: arrow keys follow the screen, not the DOM order. In RTL the
    // "previous" button sits on the right, so ArrowRight steps back and
    // ArrowLeft steps forward (the reverse of the pre-fix Arabic behaviour).
    const step = ar ? -1 : 1;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(step);
      else if (e.key === "ArrowLeft") go(-step);
      else if (e.key === "Tab") {
        // Trap Tab inside the dialog (close / prev / next / project link).
        const dialog = dialogRef.current;
        if (!dialog) return;
        const items = dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        const current = document.activeElement;
        if (!dialog.contains(current)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && current === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.modalOpen = "true";
    window.dispatchEvent(new Event("smooth-scroll:stop"));
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      delete document.documentElement.dataset.modalOpen;
      window.dispatchEvent(new Event("smooth-scroll:start"));
    };
  }, [isOpen, close, go, ar]);

  /* move focus into the dialog on open, hand it back to the tile on close */
  useEffect(() => {
    if (!isOpen) return;
    const origin = document.activeElement;
    closeRef.current?.focus();
    return () => {
      if (origin instanceof HTMLElement && origin !== document.body && origin.isConnected) {
        origin.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  const chips = [
    { slug: "all", label: ar ? "الكل" : "All", accent: ALL_ACCENT },
    ...GALLERY_PROJECTS.map((p) => ({
      slug: p.slug,
      label: ar ? p.labelAr : p.label,
      accent: p.accent,
    })),
  ];

  const Wall = embedded ? "div" : "main";

  return (
    <Wall className={embedded ? "flex flex-col gap-6" : "container-content flex flex-col gap-5 py-6"}>
      {/* ── header ─────────────────────────────────────────────── */}
      {embedded ? null : (
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "المعرض" : "GALLERY"}
          title={
            <>
              {ar ? "كل الأعمال، " : "Every project, "}
              <em className="text-accent">{ar ? "على حيطة واحدة." : "one wall."}</em>
            </>
          }
          subtitle={
            ar
              ? "صور مجمّعة من كل مشاريع الهوية البصرية — مقسّمة حسب العميل. اختَر مشروعًا للفلترة، واضغط أي صورة لتكبيرها."
              : "Brand imagery pulled from every identity project — grouped by client. Filter by project, then tap any image to open it full-size."
          }
          subtitleClassName="max-w-[56ch]"
        />
      </header>
      )}

      {/* ── filter chips ───────────────────────────────────────── */}
      <div className="-mx-1 flex flex-wrap gap-2 px-1">
        {chips.map((c) => {
          const isActive = active === c.slug;
          const count =
            c.slug === "all"
              ? GALLERY_IMAGES.length
              : GALLERY_IMAGES.filter((g) => g.project === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              aria-pressed={isActive}
              className={[
                "rounded-pill border px-4 py-2 font-mono text-micro uppercase tracking-[0.05em] transition-all duration-200",
                // theme tokens, not hard-coded white (invisible on the light canvas)
                isActive ? "text-text-primary" : "border-border-subtle text-text-secondary",
              ].join(" ")}
              style={
                isActive
                  ? { borderColor: c.accent, backgroundColor: `${c.accent}22` }
                  : { backgroundColor: "transparent" }
              }
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: c.accent }}
                />
                {c.label}
                <span className="tabular-nums text-text-secondary">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── masonry wall ───────────────────────────────────────── */}
      {/* No AnimatePresence here: filtering must remove non-matching
          items from the DOM the instant `filtered` changes, not wait on
          each item's exit transition to report finished — that's what
          left the grid showing all images regardless of the active
          filter chip. The layout prop still gives remaining items a
          smooth FLIP reflow. */}
      <motion.div
        layout
        className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4"
        style={{ columnFill: "balance" }}
      >
          {filtered.map((img, i) => {
            const p = projectOf(img.project);
            return (
              <motion.button
                layout
                key={img.src}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                onClick={() => setLightbox(i)}
                className={mediaCardVariants({ className: "relative mb-3 block w-full text-start md:mb-4" })}
              >
                <Image
                  src={img.src}
                  alt={ar ? img.captionAr : img.caption}
                  width={img.w}
                  height={img.h}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  loading="lazy"
                  className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ aspectRatio: `${img.w} / ${img.h}`, height: "auto" }}
                />
                {/* hover reveal */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-2 px-3 pt-3">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: p?.accent ?? ALL_ACCENT }}
                    />
                    <span className="font-mono text-micro uppercase tracking-[0.05em] text-white/75">
                      {ar ? p?.labelAr : p?.label}
                    </span>
                  </div>
                  <p className="px-3 pb-3 pt-1 text-body-sm text-white">
                    {ar ? img.captionAr : img.caption}
                  </p>
                </div>
              </motion.button>
            );
          })}
      </motion.div>

      {/* ── lightbox ───────────────────────────────────────────── */}

      {/* ── rotating scroll gallery ────────────────────────────── */}
      {/* -mx-3 = the 24px container gutter (--spacing is 8px, so the old
          -mx-4/-mx-8 overshot it). overflow-x-clip keeps the GSAP-scattered
          cards from widening the page on narrow screens. The whole section is
          aria-hidden: the reel is click-only and mirrors the grid above. */}
      <section aria-hidden className="relative -mx-3 mt-4 overflow-x-clip border-t border-border-subtle pt-6">
        <div className="px-4 sm:px-6 lg:px-8 mb-4">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {ar ? "عرض بصري — اسكرول للاستكشاف" : "VISUAL REEL — SCROLL TO EXPLORE"}
          </p>
          <h2 className="mt-1 font-display text-title tracking-[-0.02em] text-text-primary">
            {ar ? "النظام، مُرَندَر." : "The system, rendered."}
          </h2>
        </div>
        <RotatingGallery
          images={filtered}
          projects={GALLERY_PROJECTS}
          onOpen={(idx) => setLightbox(idx)}
          activeSlug={active}
          ar={ar}
        />
      </section>

      <AnimatePresence>
        {lightbox !== null &&
          (() => {
            const img = filtered[lightbox];
            if (!img) return null;
            const p = projectOf(img.project);
            return (
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={captionId}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              >
                {/* close */}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label={ar ? "إغلاق" : "Close"}
                  className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon name="x" size={18} />
                </button>
                {/* prev */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={ar ? "السابق" : "Previous"}
                  className="absolute start-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:start-6"
                >
                  <Icon name="chevron-left" size={22} />
                </button>
                {/* next */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={ar ? "التالي" : "Next"}
                  className="absolute end-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:end-6"
                >
                  <Icon name="chevron-right" size={22} />
                </button>

                <motion.figure
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex max-h-full max-w-[calc(100vw-8rem)] flex-col gap-3 md:max-w-[min(1100px,92vw)]"
                >
                  <Image
                    src={img.src}
                    alt={ar ? img.captionAr : img.caption}
                    width={img.w}
                    height={img.h}
                    sizes="92vw"
                    className="mx-auto max-h-[78vh] w-auto max-w-full rounded-card object-contain"
                  />
                  <figcaption className="flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: p?.accent ?? ALL_ACCENT }}
                      />
                      {p ? (
                        <Link
                          href={p.href}
                          className="font-mono text-micro uppercase tracking-[0.05em] text-white/80 underline-offset-4 hover:underline"
                        >
                          <span className="inline-flex items-center gap-1">
                            {ar ? p.labelAr : p.label} <Icon name="arrow-up-right" size="0.9em" />
                          </span>
                        </Link>
                      ) : null}
                      <span id={captionId} className="text-body-sm text-white/90">
                        {ar ? img.captionAr : img.caption}
                      </span>
                    </span>
                    <span className="font-mono text-micro tabular-nums text-white/40">
                      {lightbox + 1} / {filtered.length}
                    </span>
                  </figcaption>
                </motion.figure>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </Wall>
  );
}
