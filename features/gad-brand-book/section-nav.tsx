"use client";

import { useEffect, useState } from "react";
import { RED, SECTIONS } from "./tokens";

/**
 * Right-edge section dots (desktop only). Plain in-page links, so it works
 * without JS; the scroll-spy just highlights the section crossing the upper
 * third of the viewport.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Brand book sections"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={on ? "location" : undefined}
            className="group flex items-center justify-end gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span
              className={`rounded-full border border-white/20 bg-[#0D1B2A] px-2 py-0.5 text-xs font-medium text-white group-hover:opacity-100 group-focus-visible:opacity-100 ${on ? "opacity-100" : "opacity-0"}`}
            >
              {s.label}
            </span>
            <span
              className="block h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
              style={{ width: on ? 24 : 6, background: on ? RED : "rgb(255 255 255 / 0.4)" }}
            />
          </a>
        );
      })}
    </nav>
  );
}
