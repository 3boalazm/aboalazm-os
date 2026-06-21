"use client";
import { useLang } from "@/components/providers/lang-provider";
import { UI } from "@/lib/i18n";

/** Returns the full UI string dictionary for the current language. */
export function useT() {
  const { lang } = useLang();
  return UI[lang];
}
