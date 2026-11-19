"use client";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_CYCLE, counterpartPath, localeDir, localeHref, type Locale } from "@/lib/locale";
export type Lang = Locale;
type LangValue = { lang: Lang; toggle: () => void; setLang: (locale: Lang) => void };
const LangContext = createContext<LangValue>({ lang: "en", toggle: () => {}, setLang: () => {} });

function localeFromPath(pathname: string | null, fallback: Lang): Lang {
  if (pathname === "/ar" || pathname?.startsWith("/ar/")) return "ar";
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
    /* The page knows its own counterparts (hreflang alternates): a translated
       article sits at another slug, so the plain prefix swap would bounce back. */
    const alternates = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')).map((link) => ({
      hreflang: link.getAttribute("hreflang") ?? "",
      href: link.href,
    }));
    const path = counterpartPath(alternates, target) ?? localeHref(window.location.pathname, target);
    router.push(path + window.location.search + window.location.hash);
  }
  // The header switch steps through every locale in LOCALE_CYCLE.
  function toggle() {
    const next = LOCALE_CYCLE[(LOCALE_CYCLE.indexOf(lang) + 1) % LOCALE_CYCLE.length] ?? "en";
    setLang(next);
  }
  return <LangContext.Provider value={{ lang, toggle, setLang }}>{children}</LangContext.Provider>;
}
export function useLang() { return useContext(LangContext); }
/** Pick a string for the current locale. */
export function useT() {
  const { lang } = useLang();
  return (en: string, ar: string) => (lang === "ar" ? ar : en);
}
