"use client";

/**
 * SKIP LINK — first Tab stop on every page (WCAG 2.4.1 Bypass Blocks).
 * Invisible until focused, then a pill pinned top-start above the nav.
 *
 * It lives in the nav, so it can't count on any page's markup: pages don't
 * give <main> an id, and the book reader has no <main> at all. After mount
 * and on every route change it looks up the first <main>, stamps id="main"
 * on it (so the hash target resolves), and only then renders. tabindex="-1"
 * and the outline reset are added only on activation: a permanently
 * focusable <main> would pick up the global focus ring when Next focuses the
 * page segment (same-page link + Enter) or after a click inside it. No
 * <main>, no link: a skip control with nothing to skip to would be a dead
 * stop. Activation focuses first so the next Tab continues inside the page;
 * Lenis only hijacks wheel/touch, a programmatic scroll is safe.
 *
 * No-JS limitation: all of this runs client-side, so with scripts disabled
 * (or before hydration) the server HTML has no skip link, and an
 * `href="#main"` there would be dead anyway. Closing that gap needs
 * id="main" on each page's <main> (page/layout files, not owned here); the
 * link could then be server-rendered and work natively.
 */
import { useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useLang, type Lang } from "@/components/providers/lang-provider";

/* Arabic wording is pending the owner; until then both languages fall back
   to the English label (and the element is marked lang="en" to match). */
const LABELS: Record<Lang, string | null> = {
  en: "Skip to content",
  ar: null,
  ms: "Langkau ke kandungan",
};

/* The first <main> landmark; `focusable` also makes it a valid focus target. */
function claimMain(focusable = false): HTMLElement | null {
  const main = document.querySelector<HTMLElement>("main");
  if (!main) return null;
  if (!main.id) main.id = "main";
  if (focusable && !main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  return main;
}

export function SkipLink() {
  const { lang } = useLang();
  const pathname = usePathname();
  /* null = nothing to skip to (also the server render and first paint) */
  const [targetId, setTargetId] = useState<string | null>(null);
  const label = LABELS[lang] ?? LABELS.en;
  const labelLang = LABELS[lang] ? lang : "en";

  useEffect(() => setTargetId(claimMain()?.id ?? null), [pathname]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = claimMain(true);
    if (!main) {
      setTargetId(null);
      return;
    }
    /* <main> is a landmark, not a control: skip the global focus ring, which
       would otherwise outline the whole page body. */
    main.style.outline = "none";
    main.focus({ preventScroll: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    main.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  };

  if (!targetId) return null;

  return (
    <a
      href={`#${targetId}`}
      lang={labelLang}
      onClick={onClick}
      className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-overlay focus:rounded-pill focus:border focus:border-border-strong focus:bg-surface-1 focus:px-3 focus:py-2 focus:font-display focus:text-caption focus:uppercase focus:tracking-[0.08em] focus:text-text-primary focus:shadow-card"
    >
      {label}
    </a>
  );
}
