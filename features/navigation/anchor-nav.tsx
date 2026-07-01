"use client";

/**
 * AnchorNav — floating scrollspy dots for long pages.
 *
 * Renders a small dot per section; the dot for the section currently
 * in view is highlighted, and hovering any dot reveals its label.
 * Clicking scrolls smoothly to that section. Desktop only (hidden via
 * CSS below 1100px — the affordance is decorative there, not required).
 *
 * Usage:
 *   <AnchorNav sections={[{ id: "is-this-for-me", label: "Fit" }, ...]} />
 *   (place once per page; each `id` must exist on an element in the DOM)
 */

import { useEffect, useRef, useState } from "react";

export type AnchorSection = { id: string; label: string };

export function AnchorNav({ sections }: { sections: readonly AnchorSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's intersecting
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          setActive(topMost.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (sections.length === 0) return null;

  return (
    <nav className="anchor-nav" aria-label="Section navigation">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className={["anchor-nav__dot", active === s.id ? "anchor-nav__dot--active" : ""].join(" ")}
          aria-label={s.label}
          aria-current={active === s.id}
        >
          <span className="anchor-nav__label">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
