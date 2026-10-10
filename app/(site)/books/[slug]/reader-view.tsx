"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/providers/lang-provider";
import type { Book } from "@/lib/books";

export function ReaderView({ book }: { book: Book }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState<string>(book.journeys[0]?.chapters[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape dismisses the chapter drawer; focus stays on its trigger button.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // listen for scroll progress + active chapter from the isolated bundle
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      // only trust our own framed bundle (same window, same origin)
      if (e.source !== iframeRef.current?.contentWindow || e.origin !== window.location.origin) return;
      const d = e.data;
      if (d && d.type === "bk-progress") {
        setPct(d.pct ?? 0);
        if (d.active) setActive(d.active);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  function goto(id: string) {
    iframeRef.current?.contentWindow?.postMessage({ type: "bk-goto", id }, window.location.origin);
    setMenuOpen(false);
  }

  const allChapters = book.journeys.flatMap((j) => j.chapters);
  const activeTitle = allChapters.find((c) => c.id === active)?.title ?? "";

  return (
    // pt-[100px]: the global floating <Nav/> is fixed at y 16–98 on every
    // viewport (z-nav), so the reader's own header starts just below it —
    // otherwise the Library link and chapter menu sit under the nav and
    // can't be tapped.
    <main className="flex h-[100svh] flex-col pt-[100px]">
      {/* Reader chrome — brand header + progress */}
      <header className="relative z-elevated flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-0/95 px-4 py-2.5 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/books"
            className="shrink-0 font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
          >
            <><Icon name="arrow-left" /> {ar ? "المكتبة" : "Library"}</>
          </Link>
          {/* h1 wraps the span so globals.css's h1 rules (weight 800, Thmanyah
              in RTL) don't restyle the title; sr-only below sm keeps it out
              of the layout there while staying in the a11y tree. */}
          <h1
            lang={ar ? "ar" : undefined}
            className="min-w-0 [font-weight:inherit] max-sm:sr-only"
          >
            <span className="block truncate text-body-sm text-text-secondary">
              {ar ? book.title : book.titleEn}
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex shrink-0 items-center gap-2 rounded-pill border border-border-subtle px-3 py-1.5 font-mono text-micro uppercase tracking-[0.06em] text-text-primary transition-colors duration-base ease-physics hover:border-border-strong"
          aria-expanded={menuOpen}
          aria-controls="reader-chapters"
        >
          {/* lang="ar" would swap in the Arabic font and zero the tracking
              (globals.css [lang="ar"]); inherit keeps the label as drawn. */}
          <span
            className="max-w-[42vw] truncate [font-family:inherit] [letter-spacing:inherit] sm:max-w-[28ch]"
            dir="rtl"
            lang="ar"
          >
            {activeTitle}
          </span>
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>

        {/* chapter index drawer */}
        {menuOpen && (
          <div id="reader-chapters" className="absolute inset-x-0 top-full z-overlay max-h-[70svh] overflow-y-auto border-b border-border-subtle bg-surface-0/98 px-4 py-5 backdrop-blur md:px-6">
            <div className="container-content grid grid-cols-1 gap-6 md:grid-cols-3">
              {book.journeys.map((j, ji) => (
                <div key={j.en} className="flex flex-col gap-2">
                  <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                    {String(ji + 1).padStart(2, "0")} · {ar ? j.ar : j.en}
                  </p>
                  <ul className="flex flex-col">
                    {j.chapters.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => goto(c.id)}
                          dir="rtl"
                          lang="ar"
                          className={[
                            "w-full rounded-card px-2 py-1.5 text-start text-body-sm transition-colors duration-base ease-physics hover:bg-surface-2",
                            c.id === active ? "text-accent" : "text-text-secondary",
                          ].join(" ")}
                        >
                          {c.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* progress bar */}
      <div className="relative z-elevated h-0.5 w-full bg-surface-2">
        <div
          className="h-full bg-accent transition-[width] duration-200 ease-physics"
          style={{ width: `${Math.round(pct * 100)}%` }}
        />
      </div>

      {/* Indexable text for crawlers + screen readers (the book itself lives
          in the iframe): same blurb and chapter titles the Library card and
          the drawer show. sr-only, not display:none, so it stays readable. */}
      <div className="sr-only">
        <p>{ar ? book.blurb : book.blurbEn}</p>
        <ul>
          {book.journeys.map((j) => (
            <li key={j.en}>
              {ar ? j.ar : j.en}
              <ul>
                {j.chapters.map((c) => (
                  <li key={c.id} dir="rtl" lang="ar">
                    {c.title}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* the isolated book bundle */}
      <iframe
        ref={iframeRef}
        src={book.bundle}
        title={book.titleEn}
        className="min-h-0 w-full flex-1 border-0 bg-[#F2EFE6]"
      />
    </main>
  );
}
