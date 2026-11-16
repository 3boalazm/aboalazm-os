"use client";

/**
 * REELS SHORTCUTS — home band. Always EXACTLY three entry points
 * (`pickHomeShortcuts`): newest reels, topped up with chapters when there
 * are fewer than three reels. Each opens the player in place; "All reels"
 * goes to /reels.
 */
import * as React from "react";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/lib/analytics";
import { ReelCard } from "./reel-card";
import { ReelPlayer } from "./reel-player";
import { pickHomeShortcuts, type ReelShortcut } from "./reels.data";

export function ReelsShortcuts() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const shortcuts = React.useMemo(() => pickHomeShortcuts(), []);
  const [open, setOpen] = React.useState<ReelShortcut | null>(null);
  const close = React.useCallback(() => setOpen(null), []);

  if (shortcuts.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div className="flex flex-col gap-2 lg:max-w-[36ch] lg:gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
            {ar ? (
              <>المنهج في دقايق. <em className="text-accent">شوفه بيشتغل.</em></>
            ) : lang === "ms" ? (
              <>Kaedahnya dalam beberapa minit. <em className="text-accent">Lihat ia berfungsi.</em></>
            ) : (
              <>The method in minutes. <em className="text-accent">Watch it run.</em></>
            )}
          </h2>
          <p className="text-body-sm text-text-secondary">
            {ar
              ? "ريلز قصيرة بتشرح الأنظمة اللي ورا الشغل — من البحث للتنفيذ للمراجعة."
              : lang === "ms"
                ? "Reel pendek yang menunjukkan sistem di sebalik kerja — dari penyelidikan ke pelaksanaan dan audit."
                : "Short reels on the systems behind the work — from research to execution to audit."}
          </p>
        </div>
        <Link
          href="/reels"
          className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
        >
          {ar ? "كل الريلز" : lang === "ms" ? "Semua reel" : "All reels"}
          <span aria-hidden className="ms-1 inline-flex">
            <Icon name="arrow-right" />
          </span>
        </Link>
      </div>

      <ul className="shelf-focus -mx-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-[19%] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:w-[min(100%,840px)] lg:shrink-0">
        {shortcuts.map((s, i) => (
          <li key={s.key} className="w-full shrink-0 snap-center sm:w-[60%] md:w-auto">
            <ReelCard
              reel={s.reel}
              at={s.at}
              title={s.title}
              poster={s.poster}
              startBadge={Boolean(s.chapter)}
              index={s.chapter ? `${ar ? "جزء" : lang === "ms" ? "BAHAGIAN" : "PART"} ${String(i + 1).padStart(2, "0")}` : String(i + 1).padStart(2, "0")}
              onOpen={() => {
                trackEvent("reel_open", { slug: s.reel.slug, surface: "home_shortcuts" });
                setOpen(s);
              }}
            />
          </li>
        ))}
      </ul>

      {open ? <ReelPlayer reel={open.reel} startAt={open.at} onClose={close} /> : null}
    </div>
  );
}
