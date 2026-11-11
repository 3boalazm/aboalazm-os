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
import Link from "@/components/ui/localized-link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang, type Lang } from "@/components/providers/lang-provider";
import { localeHref, type Locale } from "@/lib/locale";
import { useTheme } from "@/components/providers/theme-provider";
import { buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SkipLink } from "./skip-link";

/* Primary nav — overhaul 2026-10-14: seven destinations + one CTA.
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
  { href: "/developer", en: "MAKER", ar: "المطوّر" },
  { href: "/for-hiring", en: "FOR HIRING", ar: "للتوظيف" },
  { href: "/books", en: "LIBRARY", ar: "المكتبة" },
  { href: "/labs", en: "LABS", ar: "المعمل" },
  { href: "/portfolio", en: "PORTFOLIO PDF ↓", ar: "بورتفوليو PDF ↓" },
] as const;

/* Malay labels, keyed by destination. Kept beside the bilingual links so a
   route's name is changed in one place. */
const NAV_MS: Record<string, string> = {
  "/work": "KERJA",
  "/services": "PERKHIDMATAN",
  "/pricing": "HARGA",
  "/process": "PROSES",
  "/writing": "PENULISAN",
  "/about": "TENTANG",
  "/developer": "PEMBANGUN",
  "/for-hiring": "UNTUK PENGAMBILAN",
  "/books": "PERPUSTAKAAN",
  "/labs": "MAKMAL",
  "/portfolio": "PORTFOLIO PDF ↓",
};

/* The header's language menu. Each language is named in its own script — the
   point is that a first-time visitor recognises theirs without knowing ours —
   with the Latin name as a second, quiet line for everyone else. */
const NAV_LANGUAGES: readonly { locale: Locale; name: string; latin: string }[] = [
  { locale: "en", name: "English", latin: "EN" },
  { locale: "ar", name: "العربية", latin: "AR" },
  { locale: "ms", name: "Bahasa Melayu", latin: "MS" },
];

function navLabel(link: { href: string; en: string; ar: string }, lang: Lang): string {
  if (lang === "ar") return link.ar;
  if (lang === "ms") return NAV_MS[link.href] ?? link.en;
  return link.en;
}

/* Exact match or a child route — a bare startsWith made /work claim /work-ui */
const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");

/* HEADER CONTROL SHAPE — one box for the language flip and the theme flip.
   Both are perfect circles of identical size: 48px on phones (still a
   comfortable 44px+ tap target), 56px from `sm` up. They used to be built
   independently — the language switch was a content-width `px-2 py-1` pill,
   so it rendered as an oval beside the theme's fixed square, and the two
   read as different control families. Never restate these dimensions at a
   call site; add to this constant. */
const NAV_CONTROL =
  "grid size-6 shrink-0 place-items-center rounded-full border border-border-subtle text-text-secondary " +
  "transition-colors duration-base ease-physics hover:border-border-strong hover:text-text-primary sm:size-7";

export function Nav() {
  const t = useT();
  const pathname = usePathname().replace(/^\/(?:ar|en)(?=\/|$)/, "") || "/";
  const { lang, setLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langMenu, setLangMenu] = useState(false);
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close the mobile panel and the language menu on route change */
  useEffect(() => {
    setOpen(false);
    setLangMenu(false);
  }, [pathname]);

  /* Close the panel and park focus on its trigger: the panel unmounts
     under whatever link was focused, which would drop focus to <body>. */
  const closePanel = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  /* The language menu borrows the mobile panel's manners: Escape closes it,
     and so does a press anywhere outside it. */
  useEffect(() => {
    if (!langMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangMenu(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!langMenuRef.current?.contains(e.target as Node)) setLangMenu(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [langMenu]);

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

  /* EN-ONLY COMPACT BAND, 1024-1279px (the `ltr:lg:max-xl:` classes below).
     In English the full bar - logo + MA, six links, two circles, "DISCUSS A PROJECT ->" -
     is ~1225px wide and only fits from 1243px. Between `lg` and `xl` the pill was clamped by
     max-w-[calc(100vw-16px)] and the CTA ran off the right edge of the screen. In that band the
     wordmark and the CTA arrow drop, the CTA takes the short label it already uses below `sm`,
     and the gaps and link padding tighten (-244px), so 1024px keeps ~21px of margin per side.
     The band runs up to the standard `xl` (1280px) although the full bar already fits from 1243px,
     because from there it has under 8px of margin. Arabic labels are shorter (that bar is ~976px)
     and keep the full bar. */

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
          "glass flex items-center gap-1 rounded-pill py-1 pl-2 pr-1 sm:gap-2 sm:pl-3 md:gap-3 ltr:lg:max-xl:gap-2",
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
            className="hidden font-display text-subtitle leading-none tracking-[-0.02em] text-text-primary sm:block ltr:lg:max-xl:hidden"
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
                    "group relative block px-2 py-1 font-display font-display-sm text-caption uppercase tracking-[0.08em] ltr:lg:max-xl:px-1.5",
                    "transition-colors duration-base ease-physics",
                    active
                      ? "text-text-primary"
                      : "text-text-tertiary hover:text-text-secondary",
                  ].join(" ")}
                >
                  {navLabel(link, lang)}
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

        {/* Language — all three, always visible.
            This was a single button that cycled en → ar → ms, so the header
            could only ever announce ONE language: Malay, the locale the
            Malaysia-facing positioning is written for, was two guesses away
            and nobody found it. The control now opens a menu that names each
            language in its own script, marks the current one, and stays a
            single NAV_CONTROL-sized circle in the bar.

            Latin short codes deliberately: a ع glyph here would make every
            English page fetch the 42 KB Arabic subset for one letter (the
            same trap that forced the old ع to be drawn as a path). */}
        <div className="relative" ref={langMenuRef}>
          <button
            type="button"
            onClick={() => setLangMenu((open) => !open)}
            aria-label={
              lang === "ar" ? "تغيير اللغة" : lang === "ms" ? "Tukar bahasa" : "Change language"
            }
            aria-expanded={langMenu}
            aria-controls={langMenu ? "nav-language-menu" : undefined}
            className={`${NAV_CONTROL} relative font-mono text-caption leading-none`}
          >
            {lang === "en" ? "EN" : lang === "ar" ? "AR" : "MS"}
            {/* The dot is the affordance: a bare two letters in a circle reads
                as a label, not a menu. */}
            <span aria-hidden className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-pill bg-accent" />
          </button>

          <AnimatePresence>
            {langMenu && (
              <motion.div
                id="nav-language-menu"
                role="group"
                aria-label={lang === "ar" ? "لغات النظام" : lang === "ms" ? "Bahasa sistem" : "System languages"}
                initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                transition={physics}
                /* Not `.glass`: the menu opens over the hero, and a 62%
                   translucent panel let the headline read straight through the
                   language names. Surface-3 is the popover token. */
                className="absolute end-0 top-[calc(100%+0.75rem)] w-60 origin-top overflow-hidden rounded-card border border-border-default bg-surface-3 p-1 shadow-panel"
              >
                <p className="px-2 pb-1 pt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-ghost">
                  {lang === "ar" ? "لغات النظام" : lang === "ms" ? "Bahasa sistem" : "System languages"}
                </p>
                {NAV_LANGUAGES.map((entry) => {
                  const current = entry.locale === lang;
                  return (
                    <Link
                      key={entry.locale}
                      href={localeHref(pathname || "/", entry.locale)}
                      onClick={(event) => {
                        setLangMenu(false);
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                        event.preventDefault();
                        setLang(entry.locale);
                      }}
                      hrefLang={entry.locale}
                      lang={entry.locale}
                      aria-current={current ? "true" : undefined}
                      className={[
                        "flex items-center justify-between gap-3 rounded-card px-2 py-1.5 transition-colors duration-base ease-physics",
                        current ? "bg-accent-14 text-text-primary" : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                      ].join(" ")}
                    >
                      <span className="flex flex-col">
                        {/* Arabic never inherits the Latin body stack: Montserrat
                            has no Arabic glyphs, so the name would land in
                            whichever system face the device happens to own. */}
                        <span className="text-body-sm leading-tight">{entry.name}</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-ghost">{entry.latin}</span>
                      </span>
                      {current ? <Icon name="check" size={14} className="text-accent" /> : null}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme flip — Obsidian (dark) / Alabaster (light) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            lang === "ar"
              ? theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"
              : lang === "ms"
                ? theme === "dark" ? "Tukar ke mod cerah" : "Tukar ke mod gelap"
                : theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className={`${NAV_CONTROL} max-[359px]:hidden`}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={14} />
        </button>

        <Link
          href="/contact"
          /* The visible label changes with the width ("DISCUSS A PROJECT" / "PROJECT"); the name does not.
             It still contains the visible word, so voice control by what is on screen keeps working. */
          aria-label={lang === "ar" ? undefined : lang === "ms" ? "Tempah panggilan penemuan" : "Book a discovery call"}
          className={buttonVariants({
            className:
              "group shrink-0 whitespace-nowrap px-2 py-1 font-display font-display-sm text-caption tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5",
          })}
        >
          {/* Discovery first (2026-11): the nav's only CTA opens a conversation,
              not a payment page. Same label discipline as before — the visible
              words change with width, the accessible name does not. */}
          <span className="sm:hidden ltr:lg:max-xl:inline">{lang === "ar" ? "ابدأ" : lang === "ms" ? "MULA" : "START"}</span><span className="hidden sm:inline ltr:lg:max-xl:hidden">{lang === "ar" ? "احجز مكالمة" : lang === "ms" ? "TEMPAH PANGGILAN" : "BOOK A CALL"}</span>
          <span
            aria-hidden
            className="ms-0.5 hidden transition-transform duration-base ease-physics group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 sm:inline-flex ltr:lg:max-xl:hidden"
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
          aria-label={open ? (lang === "ar" ? "إغلاق القائمة" : lang === "ms" ? "Tutup menu" : "Close menu") : (lang === "ar" ? "فتح القائمة" : lang === "ms" ? "Buka menu" : "Open menu")}
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
                      const label = navLabel(link, lang);
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
            {/* Languages, spelled out. The bar's circle opens the same menu,
                but on a phone the panel is where the visitor is already
                reading a list of destinations — naming the three locales here
                is what makes the site read as trilingual at first sight. */}
            <li className="mt-1 border-t border-border-subtle pt-1.5">
              <p className="px-2 pb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-ghost">
                {lang === "ar" ? "لغات النظام" : lang === "ms" ? "Bahasa sistem" : "System languages"}
              </p>
              <div className="flex flex-wrap gap-1 px-1">
                {NAV_LANGUAGES.map((entry) => {
                  const current = entry.locale === lang;
                  return (
                    <Link
                      key={entry.locale}
                      href={localeHref(pathname || "/", entry.locale)}
                      onClick={closePanel}
                      hrefLang={entry.locale}
                      lang={entry.locale}
                      aria-current={current ? "true" : undefined}
                      className={[
                        "inline-flex items-center gap-1 rounded-pill border px-2 py-1 font-mono text-[12px] leading-none transition-colors duration-base ease-physics",
                        current
                          ? "border-accent bg-accent-14 text-text-primary"
                          : "border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-primary",
                      ].join(" ")}
                    >
                      {entry.name}
                      {current ? <Icon name="check" size={11} className="text-accent" /> : null}
                    </Link>
                  );
                })}
              </div>
            </li>
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
