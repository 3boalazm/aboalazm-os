"use client";

/**
 * ROTATING GALLERY — Scroll-driven 3D reveal strip.
 *
 * Inspired by the "Rotating On-Scroll Animations" technique (Codrops / Jason Booth).
 * Adaptation: Theme 3 logic — each card enters tilted on X, snaps flat at centre,
 * then tilts out — with brightness/saturate dimming at extremes.
 *
 * Architecture choices for Aboalazm OS:
 * - Pure React + GSAP ScrollTrigger (already in the stack)
 * - Cards use next/image (AVIF/WebP + responsive srcset) — GSAP still
 *   drives the filter animation via a forwarded ref to the underlying
 *   <img>, same as before
 * - Cards carry the project accent color as a left border flash
 * - Sine-wave horizontal scatter (Theme 1 layout + Theme 3 animation)
 * - Marquee scrolls the current filter label across the viewport (mix-blend: difference)
 * - Clicking a card opens the main gallery lightbox
 */

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/components/providers/lang-provider";
import type { GalleryImage, GalleryProject } from "@/lib/gallery";

gsap.registerPlugin(ScrollTrigger);

/* ── config ───────────────────────────────────────────────────────── */
const ITEM_W   = 320;   // px — card width
const AMPLITUDE = 0.18; // fraction of viewport width for sine scatter
const OVERLAP  = -110;  // px — negative margin-bottom (cards overlap)

interface RotatingGalleryProps {
  /** Images to show */
  images: readonly GalleryImage[];
  /** All gallery projects — for accent/label lookups */
  projects: readonly GalleryProject[];
  /** Called when a card is clicked, with global image index */
  onOpen?: (globalIdx: number) => void;
  /** Active project slug (for marquee label) */
  activeSlug?: string;
  /** Lang */
  ar?: boolean;
}

/* ── sub-component: one card ──────────────────────────────────────── */
function Card({
  img,
  index,
  scatter,
  accent,
  ar,
  onClick,
}: {
  img: GalleryImage;
  index: number;
  scatter: number;
  accent: string;
  ar: boolean;
  onClick: () => void;
}) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const image = imgRef.current;
    if (!wrap || !card || !image) return;

    /* Reduced motion: skip the scroll-tilt effect entirely and leave
       cards flat/at rest instead of driving them via ScrollTrigger. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    /* Horizontal scatter via sine wave (Theme 1 positioning) */
    gsap.set(wrap, { x: scatter });

    /* Transform + filter setters — bypass React re-renders */
    const setTransform = gsap.quickSetter(card, "css");
    const setFilter    = gsap.quickSetter(image, "filter");

    const st = ScrollTrigger.create({
      trigger: wrap,
      start:   "top bottom+=15%",
      end:     "bottom top-=15%",
      scrub:   true,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress; // 0 → 1

        /* Theme 3 math:
           - cos goes 1 → −1 over the scroll;
           - raising abs(cos) to 0.6 softens the flat zone;
           - multiply by sign to preserve direction. */
        const cosP = Math.cos(p * Math.PI);
        const rotX =
          Math.sign(cosP) *
          Math.pow(Math.abs(cosP), 0.6) *
          75; // max ±75°

        /* Z push: deepest at entry/exit, flat in the centre */
        const z = Math.pow(Math.sin(p * Math.PI), 8) * -700;

        /* Subtle Y shift so card drifts up as it arrives */
        const yPct = 1 + Math.pow(cosP, 2) * -30;

        /* Dim at extremes, vivid at centre */
        const vivid = Math.pow(Math.sin(p * Math.PI), 3);
        const sat   = 0.2 + vivid * 0.8;
        const bri   = 0.3 + vivid * 0.7;

        setTransform({ rotationX: rotX, z, yPercent: yPct });
        setFilter(`saturate(${sat}) brightness(${bri})`);
      },
    });

    return () => st.kill();
  }, [scatter]);

  const isPortrait = img.h > img.w;

  return (
    <div
      ref={wrapRef}
      style={{
        width:       ITEM_W,
        perspective: "900px",
        marginBottom: OVERLAP,
        flexShrink:  0,
      }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        className="group relative cursor-pointer overflow-hidden rounded-card"
        style={{
          transformStyle: "preserve-3d",
          willChange:     "transform",
          borderLeft:     `2px solid ${accent}`,
          boxShadow:      `0 0 0 0 ${accent}`,
        }}
      >
        <Image
          ref={imgRef}
          src={img.src}
          alt={ar ? img.captionAr : img.caption}
          width={img.w || 1200}
          height={img.h || 800}
          sizes="(max-width: 768px) 100vw, 420px"
          loading="lazy"
          style={{
            width:      "100%",
            height:     "auto",
            aspectRatio: isPortrait ? "3/4" : "16/9",
            objectFit:  "cover",
            display:    "block",
            willChange: "filter",
          }}
        />

        {/* Caption on hover */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-obsidian/90 to-transparent px-3 pb-3 pt-8 transition-transform duration-300 ease-out group-hover:translate-y-0"
        >
          <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-secondary">
            {ar ? img.captionAr : img.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Marquee ──────────────────────────────────────────────────────── */
function Marquee({ label }: { label: string }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    /* Reduced motion: leave the watermark static instead of scrolling it. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    /* scroll the marquee across the page while the gallery is in view */
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { x: "100vw" },
        {
          x: "-100%",
          ease: "none",
          scrollTrigger: {
            trigger: el.closest(".rotating-gallery-root"),
            start:   "top bottom",
            end:     "bottom top",
            scrub:   true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [label]);

  const text = Array(6).fill(label).join("  ·  ");

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-1/2 z-10 -translate-y-1/2 overflow-hidden"
      style={{ mixBlendMode: "difference" }}
    >
      <div ref={innerRef} className="flex whitespace-nowrap">
        <span
          className="font-display text-[clamp(2rem,8vw,5rem)] uppercase leading-none tracking-[-0.03em] text-white/10"
          style={{ willChange: "transform" }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────────────── */
export function RotatingGallery({
  images,
  projects,
  onOpen,
  activeSlug = "all",
  ar = false,
}: RotatingGalleryProps) {
  const items = images;
  const globalIdx = (img: GalleryImage): number => items.findIndex((g) => g.src === img.src);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Pre-compute sine scatter per item */
  const scatters = items.map((_, i) => {
    const amplitude = (typeof window !== "undefined" ? window.innerWidth : 1280) * AMPLITUDE;
    return Math.sin(i * 0.45) * amplitude;
  });

  /* Recompute scatter on resize */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>(".rg-wrap");
    function recompute() {
      const amp = window.innerWidth * AMPLITUDE;
      cards.forEach((el, i) => gsap.set(el, { x: Math.sin(i * 0.45) * amp }));
      ScrollTrigger.refresh();
    }
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [items.length]);

  /* Active project accent for marquee + borders */
  const project = projects.find((p) => p.slug === activeSlug);
  const accent  = project?.accent ?? "#FF6B47";
  const marqLabel = ar
    ? (project?.labelAr ?? "الأعمال")
    : (project?.label  ?? "Selected Work");

  return (
    <div
      ref={rootRef}
      className="rotating-gallery-root relative"
      style={{ paddingTop: "5vh", paddingBottom: "15vh" }}
    >
      {/* Marquee watermark */}
      <Marquee label={marqLabel} />

      {/* Centred column of cards */}
      <div
        className="flex flex-col items-center"
        style={{ gap: 0 }}
      >
        {items.map((img, i) => (
          <div key={img.src} className="rg-wrap" style={{ width: ITEM_W, marginBottom: OVERLAP }}>
            <Card
              img={img}
              index={i}
              scatter={Math.sin(i * 0.45) * (typeof window !== "undefined" ? window.innerWidth * AMPLITUDE : 256)}
              accent={
                projects.find((p) => p.slug === img.project)?.accent ?? accent
              }
              ar={ar}
              onClick={() => onOpen?.(globalIdx(img))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
