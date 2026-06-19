"use client";

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
import { AnimatePresence, motion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";

const LINKS = [
  { href: "/about", en: "ABOUT", ar: "نبذة" },
  { href: "/why", en: "WHY", ar: "لماذا" },
  { href: "/work", en: "WORK", ar: "الأعمال" },
  { href: "/services", en: "SERVICES", ar: "الخدمات" },
  { href: "/resources", en: "RESOURCES", ar: "المصادر" },
  { href: "/pricing", en: "PRICING", ar: "التسعير" },
] as const;

/* Secondary set — mobile panel + footer carry these */
const MORE = [
  { href: "/agreement", en: "AGREEMENT", ar: "الاتفاقية" },
  { href: "/writing", en: "WRITING", ar: "مقالات" },
  { href: "/capabilities", en: "CAPABILITIES", ar: "القدرات" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
      aria-label="Primary"
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
          className="whitespace-nowrap font-display text-body-sm tracking-[-0.015em] text-text-primary"
        >
          Aboalazm<span className="text-accent"> OS</span>
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
                    "group relative block px-1 py-1 font-mono text-micro uppercase tracking-[0.10em]",
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
          {lang === "ar" ? "EN" : "ع"}
        </button>

        <Link
          href="/contact"
          className="group whitespace-nowrap rounded-pill bg-accent px-2 py-1 font-mono text-micro uppercase tracking-[0.06em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5"
        >
          {lang === "ar" ? "تواصل" : "CONTACT"}
          <span
            aria-hidden
            className="ml-0.5 hidden transition-transform duration-base ease-physics group-hover:translate-x-0.5 sm:inline-block"
          >
            →
          </span>
        </Link>

        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-pill px-2 py-1 font-mono text-label text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }}
            transition={physics}
            className="glass mt-1 flex flex-col rounded-panel p-2 shadow-card md:hidden"
          >
            {[...LINKS, ...MORE].map((link, i) => {
              const active = pathname.startsWith(link.href);
              return (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...physics, delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block rounded-card px-2 py-2 font-mono text-label uppercase tracking-[0.10em]",
                      "transition-colors duration-base ease-physics",
                      active
                        ? "text-accent"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                    ].join(" ")}
                  >
                    {lang === "ar" ? link.ar : link.en}
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
