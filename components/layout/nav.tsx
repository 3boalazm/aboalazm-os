"use client";

/**
 * FLOATING PILL NAV — Design System C4.
 * Glass pill, fixed top, gains shadow when scrolled past 64px.
 * Active route carries the accent dot, layout-animated between
 * links via Framer layoutId (shared-element slide).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { physics } from "@/lib/motion";

const LINKS = [
  { href: "/work", label: "WORK" },
  { href: "/capabilities", label: "CAPABILITIES" },
  { href: "/about", label: "ABOUT" },
  { href: "/writing", label: "WRITING" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      aria-label="Primary"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...physics, delay: 0.9 }}
      className={[
        "glass fixed left-1/2 top-2 z-nav flex -translate-x-1/2 items-center gap-3 rounded-pill py-1 pl-3 pr-1",
        "transition-shadow duration-base ease-physics",
        scrolled ? "shadow-card" : "shadow-none",
      ].join(" ")}
    >
      <Link
        href="/"
        className="font-display text-body-sm tracking-[-0.015em] text-text-primary"
      >
        Aboalazm<span className="text-text-tertiary"> OS</span>
      </Link>

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
                {link.label}
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

      <Link
        href="/contact"
        className="group rounded-pill bg-text-primary px-2 py-1 font-mono text-micro uppercase tracking-[0.06em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5"
      >
        COMMISSION
        <span aria-hidden className="ml-0.5 inline-block transition-transform duration-base ease-physics group-hover:translate-x-0.5">→</span>
      </Link>
    </motion.nav>
  );
}
