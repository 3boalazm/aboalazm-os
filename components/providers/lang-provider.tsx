"use client";

/**
 * LANGUAGE PROVIDER — the AR/EN flip.
 * One context, one toggle. Switching to Arabic:
 *   · sets <html lang="ar" dir="rtl">  → the whole layout mirrors
 *   · the [lang="ar"] rule in globals.css swaps the type system to
 *     IBM Plex Sans Arabic automatically (letter-spacing zeroed)
 *   · every page reads `lang` and renders its local dictionary
 * Choice persists in localStorage. Default: English.
 *
 * The server always renders English, so the first client render must be
 * English too (no hydration mismatch). A saved choice is restored in a
 * layout effect — i.e. before the browser paints the hydrated tree — and
 * nothing is written to localStorage / <html> until that restore has run,
 * otherwise the initial "en" would clobber the saved choice (and the
 * lang/dir the boot script already set, see lib/boot-script.ts).
 */
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
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
  const [restored, setRestored] = useState(false);

  /* Restore persisted choice — layout effect so the re-render with the saved
     language lands before paint (both setStates batch into one render). */
  useLayoutEffect(() => {
    const saved = window.localStorage.getItem("lang");
    if (saved === "ar" || saved === "en") setLang(saved);
    setRestored(true);
  }, []);

  /* Apply to the document — direction + font system flip here. Only after
     the restore above, or the initial "en" overwrites the saved choice. */
  useEffect(() => {
    if (!restored) return;
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("lang", lang);
  }, [lang, restored]);

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
