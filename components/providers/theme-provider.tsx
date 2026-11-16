"use client";
import { createContext, useContext, useEffect, type ReactNode } from "react";
export type Theme = "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
    try { window.localStorage.setItem("theme", "dark"); } catch { /* Storage may be unavailable. */ }
  }, []);
  return <ThemeContext.Provider value={{ theme: "dark", toggle: () => {} }}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }
