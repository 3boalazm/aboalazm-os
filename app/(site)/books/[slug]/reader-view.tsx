"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import type { Book } from "@/lib/books";

export function ReaderView({ book }: { book: Book }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState<string>(book.journeys[0]?.chapters[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  // listen for scroll progress + active chapter from the isolated bundle
  useEffect(() => {
    function onMsg(e: MessageEvent) {
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
    iframeRef.current?.contentWindow?.postMessage({ type: "bk-goto", id }, "*");
    setMenuOpen(false);
  }

  const allChapters = book.journeys.flatMap((j) => j.chapters);
  const activeTitle = allChapters.find((c) => c.id === active)?.title ?? "";

  return (
    <div className="flex h-[100svh] flex-col">
      {/* Reader chrome — brand header + progress */}
      <header className="relative z-elevated flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-0/95 px-4 py-2.5 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/books"
            className="shrink-0 font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
          >
            {ar ? "← المكتبة" : "← Library"}
          </Link>
          <span className="hidden truncate text-body-sm text-text-secondary sm:block">
            {ar ? book.title : book.titleEn}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex shrink-0 items-center gap-2 rounded-pill border border-border-subtle px-3 py-1.5 font-mono text-micro uppercase tracking-[0.06em] text-text-primary transition-colors duration-base ease-physics hover:border-border-strong"
          aria-expanded={menuOpen}
        >
          <span className="max-w-[42vw] truncate sm:max-w-[28ch]" dir="rtl">
            {activeTitle}
          </span>
          <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
        </button>
      </header>

      {/* progress bar */}
      <div className="relative z-elevated h-0.5 w-full bg-surface-2">
        <div
          className="h-full bg-accent transition-[width] duration-200 ease-physics"
          style={{ width: `${Math.round(pct * 100)}%` }}
        />
      </div>

      {/* chapter index drawer */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-[calc(2.75rem+2px)] z-overlay max-h-[70svh] overflow-y-auto border-b border-border-subtle bg-surface-0/98 px-4 py-5 backdrop-blur md:px-6">
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

      {/* the isolated book bundle */}
      <iframe
        ref={iframeRef}
        src={book.bundle}
        title={book.titleEn}
        className="min-h-0 w-full flex-1 border-0 bg-[#F2EFE6]"
      />
    </div>
  );
}
