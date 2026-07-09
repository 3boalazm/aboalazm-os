"use client";

/**
 * ═══════════════════════════════════════════════════════════════
 * useAmbientGlow — THE LIVING ATMOSPHERE
 * ───────────────────────────────────────────────────────────────
 * The OS is monochrome by discipline; color enters from exactly
 * one source — the work. When a project comes into focus (route
 * or hover), its accent pair is written into runtime CSS custom
 * properties. The fixed `ambient-glow` canvas (see globals.css)
 * reads them and the entire page atmosphere shifts to match.
 *
 * Usage — route level (case study page):
 *   useAmbientGlow({ primary: "rgb(64 156 255 / 0.20)",
 *                    secondary: "rgb(140 90 255 / 0.10)" });
 *
 * Usage — hover level (work card):
 *   const { engage, release } = useAmbientGlowControls();
 *   <Card onMouseEnter={() => engage(project.accent)}
 *         onMouseLeave={release} />
 * ═══════════════════════════════════════════════════════════════
 */
import { useEffect, useCallback } from "react";
import { GLOW_VARS, type ProjectAccent } from "@/lib/tokens";

const root = () =>
  typeof document !== "undefined" ? document.documentElement : null;

function write(accent: ProjectAccent, opacity: number): void {
  const el = root();
  if (!el) return;
  el.style.setProperty(GLOW_VARS.primary, accent.primary);
  el.style.setProperty(GLOW_VARS.secondary, accent.secondary);
  el.style.setProperty(GLOW_VARS.opacity, String(opacity));
}

function clear(): void {
  const el = root();
  if (!el) return;
  el.style.setProperty(GLOW_VARS.opacity, "0");
  // Color vars are left in place so the fade-out keeps its hue.
}

/** Declarative: mount = glow on, unmount = glow off. For routes. */
export function useAmbientGlow(accent: ProjectAccent, opacity = 1): void {
  useEffect(() => {
    write(accent, opacity);
    return clear;
  }, [accent.primary, accent.secondary, opacity]);
}

/** Imperative controls. For hover interactions inside grids. */
export function useAmbientGlowControls() {
  const engage = useCallback(
    (accent: ProjectAccent, opacity = 0.8) => write(accent, opacity),
    [],
  );
  const release = useCallback(clear, []);
  return { engage, release } as const;
}

/**
 * Optional: pointer-tracked glow origin. Attach to a section.
 *
 * ⚠️ Fixed a real memory leak here: the `pointermove` listener was being
 * added on mount but never removed — every remount/swap of the attached
 * node left a dangling listener + closure behind. React 19 lets a ref
 * callback return its own cleanup function (runs on unmount or when the
 * ref detaches), so no restructuring to useRef+useEffect was needed —
 * just returning the teardown.
 */
export function useGlowPointer<T extends HTMLElement>() {
  return useCallback((node: T | null) => {
    if (!node) return;
    const onMove = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      const el = root();
      if (!el) return;
      el.style.setProperty(
        GLOW_VARS.x,
        `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`,
      );
      el.style.setProperty(
        GLOW_VARS.y,
        `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`,
      );
    };
    node.addEventListener("pointermove", onMove, { passive: true });
    return () => node.removeEventListener("pointermove", onMove);
  }, []);
}
