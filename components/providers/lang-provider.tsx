"use client";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localeHref, type Locale } from "@/lib/locale";
export type Lang = Locale;
const LangContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: "en", toggle: () => {} });
export function LangProvider({ children, initialLang = "en" }: { children: ReactNode; initialLang?: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const lang: Lang = pathname?.startsWith("/ar/") || pathname === "/ar" ? "ar" : initialLang;
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  function toggle() {
    const target = lang === "ar" ? "en" : "ar";
    router.push(localeHref(window.location.pathname, target) + window.location.search + window.location.hash);
  }
  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}
export function useLang() { return useContext(LangContext); }
export function useT() { const { lang } = useLang(); return (en: string, ar: string) => lang === "ar" ? ar : en; }
