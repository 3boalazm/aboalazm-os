"use client";
import { useT } from "@/hooks/use-t";

/**
 * FLOATING PILL NAV — Design System C4 (v1.1).
 * Fixes ported from the home review:
 *  · width-safe on small screens (max-w guard, tighter gaps)
 *  · proper MOBILE MENU: ☰ toggles a glass panel under the pill
 *    with the full link set (was: links simply hidden < md)
 *  · status pill moved out of the nav band (now in hero flow),
 *    so nothing collides at the top edge.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SkipLink } from "./skip-link";

/* Primary nav — overhaul 2026-10-14: six destinations + one CTA.
   Benchmark rule (docs/overhaul-2026-10-14/01): no world-class studio
   runs more than 5–6 primary links. FOR HIRING deliberately left the bar:
   the homepage now sells the studio, recruiting lives on its own page. */
const LINKS = [
  { href: "/work",     en: "WORK",     ar: "الأعمال"  },
  { href: "/services", en: "SERVICES", ar: "الخدمات"  },
  { href: "/pricing",  en: "PRICING",  ar: "التسعير"  },
  { href: "/process",  en: "PROCESS",  ar: "المنهجية" },
  { href: "/writing",  en: "WRITING",  ar: "مقالات"   },
  { href: "/about",    en: "ABOUT",    ar: "نبذة"     },
] as const;

/* Secondary set — the mobile panel is the only place these live outside
   the footer. Routes stay reachable; the 12-item "MORE" sink is gone.
   PORTFOLIO PDF is pinned LAST on purpose: the 16:9 slide deck is the
   "take me with you" exit at the very end of the menu. */
const MORE = [
  { href: "/for-hiring", en: "FOR HIRING", ar: "للتوظيف" },
  { href: "/books", en: "LIBRARY", ar: "المكتبة" },
  { href: "/labs", en: "LABS", ar: "المعمل" },
  { href: "/portfolio", en: "PORTFOLIO PDF ↓", ar: "بورتفوليو PDF ↓" },
] as const;

/* Exact match or a child route — a bare startsWith made /work claim /work-ui */
const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");

export function Nav() {
  const t = useT();
  const pathname = usePathname();
  const { lang, toggle } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close the mobile panel on route change */
  useEffect(() => setOpen(false), [pathname]);

  /* Close the panel and park focus on its trigger: the panel unmounts
     under whatever link was focused, which would drop focus to <body>. */
  const closePanel = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  /* While the panel is open: Escape closes it (focus back on the trigger)
     and so does a press anywhere outside the nav. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  /* Plain <nav>: the old opacity:0 entrance left it invisible in the SSR
     HTML (and for ~1s after hydration, or forever without JS). */
  const nav = (
    <nav
      ref={navRef}
      aria-label={t.navPrimary}
      className="fixed left-1/2 top-2 z-nav w-max max-w-[calc(100vw-16px)] -translate-x-1/2"
    >
      <div
        className={[
          "glass flex items-center gap-1 rounded-pill py-1 pl-2 pr-1 sm:gap-2 sm:pl-3 md:gap-3",
          "transition-shadow duration-base ease-physics",
          scrolled || open ? "shadow-card" : "shadow-none",
        ].join(" ")}
      >
        <Link
          href="/"
          aria-label={t.navBrandName}
          className="flex items-center gap-2"
        >
          {/* tabIndex={-1} is load-bearing, not decoration. The press gesture
              makes motion elements keyboard-reachable by adding tabindex="0"
              when they have none (motion-dom: `if (!isElementKeyboardAccessible
              (target) && !target.hasAttribute("tabindex")) target.tabIndex = 0`).
              This orb is a decorative <span> inside a link that already has an
              accessible name, so that produced a second, nameless, no-op tab
              stop after the logo on every route. Declaring the attribute
              suppresses the injection and the tap animation still works. */}
          <motion.span
            className="brand-orb h-6 w-6 shrink-0 sm:h-7 sm:w-7 md:h-8 md:w-8"
            tabIndex={-1}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            transition={physics}
          >
            <span className="brand-orb__glow" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/work/icon.png"
              alt={t.navLogoAlt}
              className="brand-orb__img h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
            />
          </motion.span>
          <span
            className="hidden font-display text-subtitle leading-none tracking-[-0.02em] text-text-primary sm:block"
            aria-hidden
          >
            M<span className="text-accent">A</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-2 lg:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group relative block px-2 py-1 font-display font-display-sm text-caption uppercase tracking-[0.08em]",
                    "transition-colors duration-base ease-physics",
                    active
                      ? "text-text-primary"
                      : "text-text-tertiary hover:text-text-secondary",
                  ].join(" ")}
                >
                  {lang === "ar" ? link.ar : link.en}
                  <span className="absolute inset-x-1 -bottom-px h-px origin-left rtl:origin-right scale-x-0 bg-accent transition-transform duration-slow ease-physics group-hover:scale-x-100" />
                </Link>
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    transition={physics}
                    className="absolute -bottom-0.5 left-1/2 size-0.5 -translate-x-1/2 rounded-pill bg-accent"
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Language flip — the AR/EN switch */}
        <button
          type="button"
          onClick={toggle}
          aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          lang={lang === "ar" ? "en" : "ar"}
          className="shrink-0 rounded-pill border border-border-subtle px-2 py-1 font-mono text-micro text-text-secondary transition-colors duration-base ease-physics hover:border-border-strong hover:text-text-primary"
        >
          {lang === "ar" ? (
            "EN"
          ) : (
            /* ع (U+0639) from Thmanyah Serif Display Medium, drawn as a path:
               as text it made every English page download the 249 KB
               thmanyahserifdisplay-Medium.otf for this one glyph. Box = the
               glyph's advance width (0.477em) by its ink height (0.884em) at
               1rem. The ink may overhang the advance, as it did as text; the
               margins keep the old span's line box (14px above the baseline,
               none of the 4.7px descender counted) so the button keeps its
               height and the glyph its position; align-baseline undoes
               preflight's vertical-align:middle on svg. */
            <svg
              aria-hidden
              focusable="false"
              viewBox="0 -588 477 884"
              className="mt-[0.287rem] -mb-[0.296rem] inline-block h-[0.884rem] w-[0.477rem] overflow-visible fill-current align-baseline"
            >
              <path d="M452-323L443-332L354-310C315-300 279-296 246-296C138-296 67-342 67-390C67-429 133-460 210-460C279-460 349-436 385-412L395-420C369-535 301-588 233-588C146-588 54-502 54-379C54-299 94-237 174-201C106-143 25-68 25 60C25 229 165 296 295 296L535 177L535 162L320 162C181 162 43 121 43 38C43-64 252-166 388-198L419-205Z" />
            </svg>
          )}
        </button>

        {/* Theme flip — Obsidian (dark) / Alabaster (light) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            lang === "ar"
              ? theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"
              : theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className="grid size-6 shrink-0 place-items-center rounded-pill border border-border-subtle max-[359px]:hidden sm:size-7 font-mono text-text-secondary transition-colors duration-base ease-physics hover:border-border-strong hover:text-text-primary"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={14} />
        </button>

        <Link
          href="/contact"
          className={buttonVariants({
            className:
              "group shrink-0 whitespace-nowrap px-2 py-1 font-display font-display-sm text-caption tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5",
          })}
        >
          {/* One canonical action site-wide (overhaul S1). Long label only
              where the bar provably fits: below xl the short form keeps the
              pill inside the viewport (overflow was QA'd at 768–910px). */}
          {lang === "ar" ? (
            <>
              <span className="hidden xl:inline">ابدأ مشروعك</span>
              <span className="xl:hidden">ابدأ</span>
            </>
          ) : (
            <>
              <span className="hidden xl:inline">START A PROJECT</span>
              <span className="xl:hidden">START</span>
            </>
          )}
          <span
            aria-hidden
            className="ms-0.5 hidden transition-transform duration-base ease-physics group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 sm:inline-flex"
          >
            <Icon name="arrow-right" />
          </span>
        </Link>

        {/* Mobile menu trigger */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          lang={lang === "ar" ? "en" : undefined}
          onClick={() => setOpen((v) => !v)}
          className="grid size-6 shrink-0 place-items-center rounded-pill font-mono sm:size-8 text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary lg:hidden"
        >
          <Icon name={open ? "x" : "menu"} size={16} />
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }}
            transition={physics}
            className="glass mt-1 flex max-h-[calc(100svh-7rem)] flex-col overflow-y-auto overscroll-contain rounded-panel p-2 shadow-card lg:hidden"
          >
            {[...LINKS, ...MORE].map((link, i) => {
              const active = isActive(pathname, link.href);
              return (
                <motion.li
                  key={link.href}
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...physics, delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closePanel}
                    className={[
                      "flex items-center gap-1.5 rounded-card px-2 py-2 font-display font-display-sm text-micro uppercase tracking-[0.08em]",
                      "transition-colors duration-base ease-physics",
                      active
                        ? "text-accent"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                    ].join(" ")}
                  >
                    {(() => {
                      const label = lang === "ar" ? link.ar : link.en;
                      const download = label.endsWith("↓");
                      return (
                        <>
                          {label.replace(/\s*↓$/, "")}
                          {download && (
                            <Icon name="arrow-down" size="0.9em" className="text-text-ghost" />
                          )}
                        </>
                      );
                    })()}
                  </Link>
                </motion.li>
              );
            })}
            {/* The bar hides its theme toggle below 360px (no room), so the
                panel carries it there. */}
            <li className="hidden border-t border-border-subtle pt-1 max-[359px]:block">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center gap-1.5 rounded-card px-2 py-2 font-display font-display-sm text-micro uppercase tracking-[0.08em] text-text-secondary transition-colors duration-base ease-physics hover:bg-surface-2 hover:text-text-primary"
              >
                <Icon name={theme === "dark" ? "sun" : "moon"} size={14} />
                {theme === "dark"
                  ? lang === "ar" ? "الوضع الفاتح" : "LIGHT MODE"
                  : lang === "ar" ? "الوضع الداكن" : "DARK MODE"}
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );

  /* Skip link goes first so it is the first Tab stop on every page. */
  return (
    <>
      <SkipLink />
      {nav}
    </>
  );
}
