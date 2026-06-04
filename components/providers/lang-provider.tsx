"use client";

/**
 * LANGUAGE PROVIDER — the AR/EN flip.
 * One context, one toggle. Switching to Arabic:
 *   · sets <html lang="ar" dir="rtl">  → the whole layout mirrors
 *   · the [lang="ar"] rule in globals.css swaps the type system to
 *     IBM Plex Sans Arabic automatically (letter-spacing zeroed)
 *   · every page reads `lang` and renders its local dictionary
 * Choice persists in localStorage. Default: English.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";

const LangContext = createContext<{ lang: Lang; toggle: () => void }>({
  lang: "en",
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  /* Restore persisted choice */
  useEffect(() => {
    const saved = window.localStorage.getItem("lang");
    if (saved === "ar" || saved === "en") setLang(saved);
  }, []);

  /* Apply to the document — direction + font system flip here */
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("lang", lang);
  }, [lang]);

  const toggle = () => setLang((l) => (l === "en" ? "ar" : "en"));

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Pick the right string pair: d(en, ar) */
export function useT() {
  const { lang } = useLang();
  return (en: string, ar: string) => (lang === "ar" ? ar : en);
}
