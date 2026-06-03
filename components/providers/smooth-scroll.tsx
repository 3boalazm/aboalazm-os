"use client";

/**
 * SMOOTH SCROLL PROVIDER — Lenis + GSAP ScrollTrigger, synchronized.
 * Lenis drives the physics; ScrollTrigger listens to Lenis (not the
 * browser) so scroll-bound reveals share the same inertia.
 * Respects prefers-reduced-motion by simply not mounting Lenis.
 */
import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GSAP_DEFAULTS } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults(GSAP_DEFAULTS);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // The same settle character as --ease-physics, expressed as lerp
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
