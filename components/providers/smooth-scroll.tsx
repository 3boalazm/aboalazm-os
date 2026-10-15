"use client";

/**
 * SMOOTH SCROLL PROVIDER — Lenis + GSAP ScrollTrigger, synchronized.
 * Lenis drives the physics; ScrollTrigger listens to Lenis (not the
 * browser) so scroll-bound reveals share the same inertia.
 *
 * Lenis is loaded lazily: after hydration, on an idle callback, and only
 * for fine-pointer users who haven't asked for reduced motion (Lenis
 * leaves touch scrolling native by default — syncTouch is off — so touch
 * devices never got smoothing from it anyway). ScrollTrigger is NOT
 * imported here: the modules that use it register it themselves, and we
 * forward Lenis scroll ticks to whichever copy is registered.
 * `gsap` itself stays a static import so `gsap.defaults` is applied
 * before any consumer builds a tween.
 */
import { useEffect, useRef, type ReactNode } from "react";
import type Lenis from "lenis";
import gsap from "gsap";
import { GSAP_DEFAULTS } from "@/lib/motion";

gsap.defaults(GSAP_DEFAULTS);

/** Keep ScrollTrigger in step with Lenis, if a page has registered it.
    `core.globals()` is public GSAP API but missing from the bundled typings. */
function updateScrollTrigger() {
  const core = gsap.core as unknown as {
    globals: () => { ScrollTrigger?: { update: () => void } };
  };
  core.globals().ScrollTrigger?.update();
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let cancelled = false;
    let tick: ((time: number) => void) | null = null;
    const stop = () => lenisRef.current?.stop();
    const resume = () => lenisRef.current?.start();
    window.addEventListener("smooth-scroll:stop", stop);
    window.addEventListener("smooth-scroll:start", resume);

    const start = async () => {
      // Smoothing is an enhancement: if the chunk fails to load (offline,
      // deploy skew) the page just keeps native scrolling.
      const lenisModule = await import("lenis").catch(() => null);
      if (!lenisModule || cancelled) return;
      const LenisCtor = lenisModule.default;

      const lenis = new LenisCtor({
        // The same settle character as --ease-physics, expressed as lerp
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      lenisRef.current = lenis;
      // A modal may have opened before this idle-loaded enhancement initialized.
      if (document.documentElement.dataset.modalOpen === "true") lenis.stop();

      lenis.on("scroll", updateScrollTrigger);

      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      // Only while Lenis runs; touch / reduced-motion visitors keep GSAP's default.
      gsap.ticker.lagSmoothing(0);
    };

    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const handle = hasIdleCallback
      ? window.requestIdleCallback(() => void start(), { timeout: 2000 })
      : window.setTimeout(() => void start(), 200);

    return () => {
      cancelled = true;
      window.removeEventListener("smooth-scroll:stop", stop);
      window.removeEventListener("smooth-scroll:start", resume);
      if (hasIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
