"use client";

/**
 * THEME PROVIDER — the Obsidian (dark) / Alabaster (light) flip.
 *
 * Mirrors LangProvider's exact pattern. Switching sets
 * `<html data-theme="light">`, which the `html[data-theme="light"]`
 * override block in globals.css picks up — it reassigns the semantic
 * surface, text, and border custom properties, so every component
 * using those token classes repaints automatically. No component code
 * needs to know a theme switch exists.
 *
 * Choice persists in localStorage. Default: dark (Obsidian) — the
 * site's original, designed-for-first appearance.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  /* Restore persisted choice */
  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  /* Apply to the document */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
