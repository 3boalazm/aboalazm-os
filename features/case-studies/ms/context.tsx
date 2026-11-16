"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLang } from "@/components/providers/lang-provider";

/**
 * Malay copy for case studies, keyed by the English source string.
 *
 * Case-study copy lives in bilingual `{ en, ar }` records that are edited in
 * place, so Malay is an overlay instead of a third field on every record. The
 * server page loads the dictionary for the requested slug only when the locale
 * is "ms" and hands it to this provider: English and Arabic visitors never
 * download a byte of it. A string with no entry renders in English, which is
 * the fallback the rest of /ms already uses.
 */
export type CaseMsDict = Readonly<Record<string, string>>;

const CaseMsContext = createContext<CaseMsDict | null>(null);

export function CaseMsProvider({ dict, children }: { dict: CaseMsDict; children: ReactNode }) {
  return <CaseMsContext.Provider value={dict}>{children}</CaseMsContext.Provider>;
}

const IDENTITY = (en: string) => en;

/** `t(english)`: the Malay line on /ms, the English string everywhere else. */
export function useCaseT(): (en: string) => string {
  const { lang } = useLang();
  const dict = useContext(CaseMsContext);
  return useMemo(
    () => (lang === "ms" && dict ? (en: string) => dict[en] ?? en : IDENTITY),
    [lang, dict],
  );
}
