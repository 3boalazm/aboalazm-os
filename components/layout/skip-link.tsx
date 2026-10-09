"use client";

/**
 * SKIP LINK — first Tab stop on every page (WCAG 2.4.1 Bypass Blocks).
 * Invisible until focused, then a pill pinned top-start above the nav.
 * Pages don't give <main> an id, so the click handler finds the first
 * <main>, makes it focusable and moves focus there. Focus goes first so
 * the next Tab continues inside the page; Lenis only hijacks wheel/touch,
 * a programmatic scroll is safe.
 */
import type { MouseEvent } from "react";
import { useLang, type Lang } from "@/components/providers/lang-provider";

/* Arabic wording is pending the owner; until then both languages fall back
   to the English label (and the element is marked lang="en" to match). */
const LABELS: Record<Lang, string | null> = {
  en: "Skip to content",
  ar: null,
};

export function SkipLink() {
  const { lang } = useLang();
  const label = LABELS[lang] ?? LABELS.en;
  const labelLang = LABELS[lang] ? lang : "en";

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.querySelector<HTMLElement>("main");
    if (!main) return;
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    /* <main> is a landmark, not a control: skip the global focus ring, which
       would otherwise outline the whole page body. */
    main.style.outline = "none";
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: "start" });
  };

  return (
    <a
      href="#main"
      lang={labelLang}
      onClick={onClick}
      className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-overlay focus:rounded-pill focus:border focus:border-border-strong focus:bg-surface-1 focus:px-3 focus:py-2 focus:font-display focus:text-caption focus:uppercase focus:tracking-[0.08em] focus:text-text-primary focus:shadow-card"
    >
      {label}
    </a>
  );
}
