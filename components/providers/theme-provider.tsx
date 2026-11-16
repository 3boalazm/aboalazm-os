"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Public site appearance is intentionally dark-only.
 * The context shape remains stable for any existing consumer, but toggling
 * theme can no longer produce light sections or restore a stale preference.
 */
export type Theme = "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
    try {
      window.localStorage.setItem("theme", "dark");
    } catch {
      // Dark remains the CSS default when browser storage is unavailable.
    }
  }, []);

  return <>{children}</>;
}
