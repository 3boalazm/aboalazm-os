"use client";

import { Fragment, useEffect, useRef } from "react";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * SCRUB TEXT — a paragraph whose words light up one by one as it scrolls
 * through the viewport (the "quiet room" manifesto effect).
 *
 * Progressive enhancement by construction: the words are real spans in the
 * server HTML and CSS (.scrub__w in globals.css) defaults --p to 1, so with no
 * JS, or under prefers-reduced-motion, the paragraph is simply fully visible.
 * JS only writes --p (0 → 1) per word; the dimmest a word gets is the AA-safe
 * floor defined next to .scrub__w. Reading order is DOM order, so RTL works
 * unchanged. The scroll listener only runs while the paragraph is within a
 * viewport of the screen.
 */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".scrub__w"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.88; // the paragraph's top enters here → nothing lit yet
      const end = vh * 0.38;
      const progress = clamp01((start - rect.top) / (start - end + rect.height * 0.6));
      const lit = progress * (spans.length + 4);
      spans.forEach((span, i) => span.style.setProperty("--p", clamp01((lit - i) / 4).toFixed(3)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const listen = () => {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    };
    const unlisten = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) listen();
        else unlisten();
        update(); // settle: fully lit once scrolled past, fully dim while still below
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      unlisten();
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="scrub__w">{word}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
