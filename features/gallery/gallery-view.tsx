"use client";

/* ────────────────────────────────────────────────────────────────────────
 *  GALLERY — cross-project image wall.
 *  Aggregates brand imagery from every case study, filterable by client,
 *  laid out as a balanced masonry, with a keyboard-driven lightbox.
 * ──────────────────────────────────────────────────────────────────────── */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import {
  GALLERY_PROJECTS,
  GALLERY_IMAGES,
  type GalleryImage,
  type GalleryProject,
} from "@/lib/gallery";

const EASE = [0.16, 1, 0.3, 1] as const;

const ALL_ACCENT = "#FF6B47";

function projectOf(slug: string): GalleryProject | undefined {
  return GALLERY_PROJECTS.find((p) => p.slug === slug);
}

export function GalleryView() {
  const { lang } = useLang();
  const ar = lang === "ar";

  const [active, setActive] = useState<string>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

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
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, close, go]);

  const chips = [
    { slug: "all", label: ar ? "الكل" : "All", accent: ALL_ACCENT },
    ...GALLERY_PROJECTS.map((p) => ({
      slug: p.slug,
      label: ar ? p.labelAr : p.label,
      accent: p.accent,
    })),
  ];

  return (
    <main className="container-content flex flex-col gap-10 py-16">
      {/* ── header ─────────────────────────────────────────────── */}
      <header className="flex flex-col gap-3">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          {ar ? "المعرض" : "GALLERY"}
        </p>
        <h1 className="font-display text-display tracking-[-0.025em]">
          {ar ? "كل الأعمال، " : "Every project, "}
          <em className="text-accent">{ar ? "على حيطة واحدة." : "one wall."}</em>
        </h1>
        <p className="max-w-[56ch] text-lead text-text-secondary">
          {ar
            ? "صور مجمّعة من كل مشاريع الهوية البصرية — مقسّمة حسب العميل. اختَر مشروعًا للفلترة، واضغط أي صورة لتكبيرها."
            : "Brand imagery pulled from every identity project — grouped by client. Filter by project, then tap any image to open it full-size."}
        </p>
      </header>

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
              className="rounded-pill border px-4 py-2 font-mono text-micro uppercase tracking-[0.05em] transition-all duration-200"
              style={{
                borderColor: isActive ? c.accent : "rgb(255 255 255 / 0.12)",
                backgroundColor: isActive ? `${c.accent}22` : "transparent",
                color: isActive ? "#fff" : "rgb(255 255 255 / 0.55)",
              }}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: c.accent }}
                />
                {c.label}
                <span className="tabular-nums opacity-50">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── masonry wall ───────────────────────────────────────── */}
      <motion.div
        layout
        className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4"
        style={{ columnFill: "balance" }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((img, i) => {
            const p = projectOf(img.project);
            return (
              <motion.button
                layout
                key={img.src}
                type="button"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE }}
                onClick={() => setLightbox(i)}
                className="group relative mb-3 block w-full overflow-hidden rounded-card border border-border-subtle bg-surface-1 text-left md:mb-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={ar ? img.captionAr : img.caption}
                  loading="lazy"
                  className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ aspectRatio: `${img.w} / ${img.h}` }}
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
        </AnimatePresence>
      </motion.div>

      {/* ── lightbox ───────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null &&
          (() => {
            const img = filtered[lightbox];
            if (!img) return null;
            const p = projectOf(img.project);
            return (
              <motion.div
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              >
                {/* close */}
                <button
                  type="button"
                  onClick={close}
                  aria-label={ar ? "إغلاق" : "Close"}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
                {/* prev */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={ar ? "السابق" : "Previous"}
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:left-6"
                >
                  ‹
                </button>
                {/* next */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={ar ? "التالي" : "Next"}
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:right-6"
                >
                  ›
                </button>

                <motion.figure
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex max-h-full max-w-[min(1100px,92vw)] flex-col gap-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={ar ? img.captionAr : img.caption}
                    className="mx-auto max-h-[78vh] w-auto rounded-card object-contain"
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
                          {ar ? p.labelAr : p.label} ↗
                        </Link>
                      ) : null}
                      <span className="text-body-sm text-white/90">
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
    </main>
  );
}
