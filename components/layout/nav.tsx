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
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const LINKS = [
  { href: "/about",      en: "ABOUT",          ar: "نبذة"       },
  { href: "/work",       en: "WORK",           ar: "الأعمال"    },
  { href: "/for-hiring", en: "FOR HIRING",     ar: "للتوظيف"    },
  { href: "/services",   en: "SERVICES",       ar: "الخدمات"    },
  { href: "/pricing",    en: "PRICING",        ar: "التسعير"    },
] as const;

/* Secondary set — mobile panel + footer carry these.
   PORTFOLIO PDF is pinned LAST on purpose: the 16:9 slide deck is the
   "take me with you" exit at the very end of the menu. */
const MORE = [
  { href: "/start", en: "START HERE", ar: "ابدأ هنا" },
  { href: "/books", en: "LIBRARY", ar: "المكتبة" },
  { href: "/gallery", en: "GALLERY", ar: "المعرض" },
  { href: "/why", en: "WHY", ar: "لماذا" },
  { href: "/process", en: "PROCESS", ar: "المنهجية" },
  { href: "/agreement", en: "AGREEMENT", ar: "الاتفاقية" },
  { href: "/writing", en: "WRITING", ar: "مقالات" },
  { href: "/capabilities", en: "CAPABILITIES", ar: "القدرات" },
  { href: "/resources", en: "RESOURCES", ar: "المصادر" },
  { href: "/labs", en: "LABS", ar: "المعمل" },
  { href: "/work-ui", en: "UI/UX SHOWCASE", ar: "معرض الواجهات" },
  { href: "/portfolio", en: "PORTFOLIO PDF ↓", ar: "بورتفوليو PDF ↓" },
] as const;

export function Nav() {
  const t = useT();
  const pathname = usePathname();
  const { lang, toggle } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close the mobile panel on route change */
  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.nav
      aria-label={t.navPrimary}
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...physics, delay: 0.9 }}
      className="fixed left-1/2 top-2 z-nav w-max max-w-[calc(100vw-16px)] -translate-x-1/2"
    >
      <div
        className={[
          "glass flex items-center gap-2 rounded-pill py-1 pl-3 pr-1 md:gap-3",
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
            className="brand-orb h-7 w-7 md:h-8 md:w-8"
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
              className="brand-orb__img h-7 w-7 md:h-8 md:w-8"
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
        <ul className="hidden items-center gap-2 md:flex">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group relative block px-2 py-1 font-display text-caption uppercase tracking-[0.08em]",
                    "transition-colors duration-base ease-physics",
                    active
                      ? "text-text-primary"
                      : "text-text-tertiary hover:text-text-secondary",
                  ].join(" ")}
                >
                  {lang === "ar" ? link.ar : link.en}
                  <span className="absolute inset-x-1 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-slow ease-physics group-hover:scale-x-100" />
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
          className="rounded-pill border border-border-subtle px-2 py-1 font-mono text-micro text-text-secondary transition-colors duration-base ease-physics hover:border-border-strong hover:text-text-primary"
        >
          {lang === "ar" ? (
            "EN"
          ) : (
            <span style={{ fontFamily: "var(--font-thmanyah)", fontSize: "1rem", lineHeight: 1, fontWeight: 500 }}>
              ع
            </span>
          )}
        </button>

        {/* Theme flip — Obsidian (dark) / Alabaster (light) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="grid size-7 place-items-center rounded-pill border border-border-subtle font-mono text-text-secondary transition-colors duration-base ease-physics hover:border-border-strong hover:text-text-primary"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={14} />
        </button>

        <Link
          href="/contact"
          className={buttonVariants({
            className:
              "group whitespace-nowrap px-2 py-1 font-display text-caption tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5",
          })}
        >
          {lang === "ar" ? "تواصل" : "CONTACT"}
          <span
            aria-hidden
            className="ms-0.5 hidden transition-transform duration-base ease-physics group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 sm:inline-flex"
          >
            <Icon name="arrow-right" />
          </span>
        </Link>

        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="grid size-8 place-items-center rounded-pill font-mono text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary md:hidden"
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
            className="glass mt-1 flex max-h-[calc(100svh-5.5rem)] flex-col overflow-y-auto overscroll-contain rounded-panel p-2 shadow-card md:hidden"
          >
            {[...LINKS, ...MORE].map((link, i) => {
              const active = pathname.startsWith(link.href);
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
                    className={[
                      "flex items-center gap-1.5 rounded-card px-2 py-2 font-display text-micro uppercase tracking-[0.08em]",
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
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
