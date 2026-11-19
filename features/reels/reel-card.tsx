"use client";

/**
 * REEL CARD — 9:16 poster tile. On fine-pointer hover it plays a muted
 * preview from the card's start time; click opens the full player.
 */
import * as React from "react";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { formatTime, pickText, type Reel, type Bilingual } from "./reels.data";

export interface ReelCardProps {
  reel: Reel;
  at?: number;
  title?: Bilingual;
  poster?: string;
  /** Small label above the title, e.g. "01" or "PART 2". */
  index?: string;
  onOpen: () => void;
  /** Badge shows the start time (chapters) instead of the reel duration. */
  startBadge?: boolean;
  className?: string;
}

export function ReelCard({ reel, at = 0, title, poster, index, onOpen, startBadge = false, className = "" }: ReelCardProps) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const previewRef = React.useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = React.useState(false);

  const startPreview = () => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPreviewing(true);
  };
  const stopPreview = () => {
    setPreviewing(false);
    const v = previewRef.current;
    if (v) v.pause();
  };

  React.useEffect(() => {
    const v = previewRef.current;
    if (!previewing || !v) return;
    const go = () => {
      v.currentTime = at;
      void v.play().catch(() => {});
    };
    if (v.readyState >= 1) go();
    else v.addEventListener("loadedmetadata", go, { once: true });
    return () => v.removeEventListener("loadedmetadata", go);
  }, [previewing, at]);

  const label = pickText(title ?? reel.title, lang);
  const timeText = startBadge || at > 0 ? formatTime(at) : formatTime(reel.duration);
  /* Accessible name = a verb + the visible text, in reading order (WCAG 2.5.3:
     what a voice-control user sees on the card — the time badge, the index,
     the title — has to be inside the name they can say). */
  const accessibleName = [ar ? "شغّل" : "Play", timeText, index, label]
    .filter((part) => part !== undefined && part !== null && part !== "")
    .join(" ");

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
      aria-label={accessibleName}
      className={`group relative block aspect-[9/16] w-full overflow-hidden rounded-panel border border-border-subtle bg-surface-1 text-start transition-colors duration-base ease-physics hover:border-border-default focus-visible:border-accent ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster ?? reel.poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-transform duration-slow ease-physics group-hover:scale-[1.03]"
      />
      {previewing ? (
        <video
          ref={previewRef}
          src={reel.video}
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}

      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <span className="absolute start-1 top-1 flex items-center gap-0.5 rounded-pill md:start-2 md:top-2 md:gap-1 bg-black/55 px-1.5 py-0.5 font-mono text-micro uppercase tracking-[0.10em] text-white/85 backdrop-blur-sm">
        <Icon name="play" size="0.9em" />
        {timeText}
      </span>
      {/* Whitespace between the card's text runs: invisible (absolutely
          positioned siblings), but it keeps "0:00" and "01" apart when a
          checker reads the button's visible text. */}
      {" "}

      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-all duration-base ease-physics group-hover:scale-110 group-hover:border-accent group-hover:text-accent md:size-8"
      >
        <Icon name="play" size="1.4em" />
      </span>

      <span dir={ar ? "rtl" : "ltr"} className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-1.5 text-white md:gap-1 md:p-3">
        {index ? <span className="font-mono text-micro uppercase tracking-[0.10em] text-white/60">{index}</span> : null}
        {" "}
        <span className="font-display text-body-sm leading-[1.25] tracking-[-0.01em] md:text-subtitle md:leading-[1.2]">{label}</span>
      </span>
    </button>
  );
}
