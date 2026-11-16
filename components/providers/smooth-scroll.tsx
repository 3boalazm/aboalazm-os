"use client";

/**
 * SMOOTH SCROLL PROVIDER — Lenis + GSAP ScrollTrigger, synchronized.
 * Lenis drives the physics; ScrollTrigger listens to Lenis (not the
 * browser) so scroll-bound reveals share the same inertia.
 *
 * Everything heavy is loaded lazily: after the page has loaded, on an idle
 * callback, and only for fine-pointer users who haven't asked for reduced motion
 * (Lenis leaves touch scrolling native by default — syncTouch is off — so
 * touch devices never got smoothing from it anyway). Both Lenis and gsap
 * (~27 kB gzipped) therefore stay out of the first-load JS of every page,
 * and phones / reduced-motion visitors never download them unless the page
 * itself uses gsap. ScrollTrigger is NOT imported here: the modules that
 * use it register it themselves, and we forward Lenis scroll ticks to
 * whichever copy is registered.
 * gsap comes from "@/lib/gsap" (which applies `gsap.defaults`), and must
 * only ever be imported dynamically in this file — lib/bundle-guards.test.ts
 * fails the build if a static import sneaks back in.
 */
import { useEffect, useRef, type ReactNode } from "react";
import type Lenis from "lenis";

type Gsap = typeof import("@/lib/gsap").default;

/** Keep ScrollTrigger in step with Lenis, if a page has registered it.
    `core.globals()` is public GSAP API but missing from the bundled typings. */
function updateScrollTrigger(gsap: Gsap) {
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
    let gsapRef: Gsap | null = null;
    let tick: ((time: number) => void) | null = null;
    const stop = () => lenisRef.current?.stop();
    const resume = () => lenisRef.current?.start();
    window.addEventListener("smooth-scroll:stop", stop);
    window.addEventListener("smooth-scroll:start", resume);

    const start = async () => {
      // Smoothing is an enhancement: if a chunk fails to load (offline,
      // deploy skew) the page just keeps native scrolling.
      const [lenisModule, gsapModule] = await Promise.all([
        import("lenis").catch(() => null),
        import("@/lib/gsap").catch(() => null),
      ]);
      if (!lenisModule || !gsapModule || cancelled) return;
      const LenisCtor = lenisModule.default;
      const gsap = gsapModule.default;
      gsapRef = gsap;

      const lenis = new LenisCtor({
        // The same settle character as --ease-physics, expressed as lerp
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      lenisRef.current = lenis;
      // A modal may have opened before this idle-loaded enhancement initialized.
      if (document.documentElement.dataset.modalOpen === "true") lenis.stop();

      lenis.on("scroll", () => updateScrollTrigger(gsap));

      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      // Only while Lenis runs; touch / reduced-motion visitors keep GSAP's default.
      gsap.ticker.lagSmoothing(0);
    };

    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    let handle: number | undefined;
    const schedule = () => {
      handle = hasIdleCallback
        ? window.requestIdleCallback(() => void start(), { timeout: 2000 })
        : window.setTimeout(() => void start(), 200);
    };
    // Lenis + gsap are ~32 kB gzipped: fetch them only once the page has finished
    // loading so they never compete with the hero image or fonts for bandwidth.
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("smooth-scroll:stop", stop);
      window.removeEventListener("smooth-scroll:start", resume);
      window.removeEventListener("load", schedule);
      if (handle !== undefined) {
        if (hasIdleCallback) window.cancelIdleCallback(handle);
        else window.clearTimeout(handle);
      }
      if (tick) gsapRef?.ticker.remove(tick);
      tick = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
