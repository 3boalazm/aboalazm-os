"use client";

/**
 * REEL PLAYER — full-screen vertical player for one reel.
 * Opens at a given timestamp (chapter shortcuts), lists the chapters as
 * jump points, closes on Esc / backdrop / ✕, and locks page scroll
 * (native + Lenis via the smooth-scroll events) while open.
 */
import * as React from "react";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { formatTime, pickText, type Reel } from "./reels.data";

export function ReelPlayer({ reel, startAt = 0, onClose }: { reel: Reel; startAt?: number; onClose: () => void }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const [current, setCurrent] = React.useState(startAt);

  // Scroll lock + focus + Esc.
  React.useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    html.dataset.modalOpen = "true";
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("smooth-scroll:stop"));
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      delete html.dataset.modalOpen;
      document.body.style.overflow = prevOverflow;
      window.dispatchEvent(new Event("smooth-scroll:start"));
      opener?.focus?.();
    };
  }, [onClose]);

  // Seek to the requested start once metadata is ready.
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const seek = () => {
      v.currentTime = startAt;
      void v.play().catch(() => {
        /* autoplay with sound can be blocked — controls stay available */
      });
    };
    if (v.readyState >= 1) seek();
    else v.addEventListener("loadedmetadata", seek, { once: true });
    return () => v.removeEventListener("loadedmetadata", seek);
  }, [startAt, reel.slug]);

  const jump = (at: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = at;
    void v.play().catch(() => {});
  };

  const chapters = reel.chapters ?? [];
  const activeIndex = chapters.reduce((acc, c, i) => (current >= c.at ? i : acc), 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={pickText(reel.title, lang)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-2 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={ar ? "إغلاق" : lang === "ms" ? "Tutup" : "Close"}
        className="absolute end-2 top-2 grid size-6 place-items-center rounded-full border border-white/20 text-white/80 transition-colors duration-base ease-physics hover:border-white/50 hover:text-white sm:end-4 sm:top-4"
      >
        <Icon name="x" />
      </button>

      <div className="flex max-h-full w-full max-w-[920px] flex-col items-center gap-3 md:flex-row md:items-stretch md:justify-center md:gap-4">
        <div className="relative aspect-[9/16] h-[min(78vh,820px)] max-w-full overflow-hidden rounded-panel border border-white/10 bg-black md:h-[min(88vh,860px)]">
          <video
            ref={videoRef}
            key={reel.slug}
            src={reel.video}
            poster={reel.poster}
            controls
            playsInline
            preload="metadata"
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            className="size-full object-cover"
          />
        </div>

        <aside dir={ar ? "rtl" : "ltr"} className="flex w-full max-w-[420px] flex-col gap-2 text-white md:w-[300px] md:justify-end md:pb-2">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-white/50">
            {ar ? "ريلز" : "REEL"} · {formatTime(reel.duration)}
          </p>
          <h2 className="font-display text-subtitle leading-[1.2] tracking-[-0.01em]">{pickText(reel.title, lang)}</h2>
          <p className="text-body-sm leading-[1.6] text-white/70 max-md:hidden">{pickText(reel.summary, lang)}</p>
          {chapters.length > 0 ? (
            <ol className="mt-1 flex flex-col gap-1 max-md:flex-row max-md:overflow-x-auto">
              {chapters.map((c, i) => (
                <li key={c.at} className="max-md:shrink-0">
                  <button
                    type="button"
                    onClick={() => jump(c.at)}
                    aria-current={i === activeIndex ? "step" : undefined}
                    className={`flex w-full items-baseline gap-2 rounded-card border px-2 py-1 text-start text-body-sm transition-colors duration-base ease-physics ${
                      i === activeIndex ? "border-accent/60 text-white" : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <span className="font-mono text-micro text-white/50">{formatTime(c.at)}</span>
                    <span className="max-md:whitespace-nowrap">{pickText(c.title, lang)}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
