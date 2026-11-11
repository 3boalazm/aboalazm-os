"use client";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_CYCLE, localeDir, localeHref, type Locale } from "@/lib/locale";
export type Lang = Locale;
type LangValue = { lang: Lang; toggle: () => void; setLang: (locale: Lang) => void };
const LangContext = createContext<LangValue>({ lang: "en", toggle: () => {}, setLang: () => {} });

function localeFromPath(pathname: string | null, fallback: Lang): Lang {
  if (pathname === "/ar" || pathname?.startsWith("/ar/")) return "ar";
  if (pathname === "/ms" || pathname?.startsWith("/ms/")) return "ms";
  return fallback;
}

export function LangProvider({ children, initialLang = "en" }: { children: ReactNode; initialLang?: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const lang: Lang = localeFromPath(pathname, initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = localeDir(lang);
  }, [lang]);
  function setLang(target: Lang) {
    if (target === lang) return;
    router.push(localeHref(window.location.pathname, target) + window.location.search + window.location.hash);
  }
  // The header switch steps through every locale in LOCALE_CYCLE.
  function toggle() {
    const next = LOCALE_CYCLE[(LOCALE_CYCLE.indexOf(lang) + 1) % LOCALE_CYCLE.length] ?? "en";
    setLang(next);
  }
  return <LangContext.Provider value={{ lang, toggle, setLang }}>{children}</LangContext.Provider>;
}
export function useLang() { return useContext(LangContext); }
/** Pick a string for the current locale. Malay falls back to English when no Malay string is given. */
export function useT() {
  const { lang } = useLang();
  return (en: string, ar: string, ms?: string) => (lang === "ar" ? ar : lang === "ms" ? (ms ?? en) : en);
}
