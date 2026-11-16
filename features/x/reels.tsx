"use client";

/**
 * 04 · REELS — directly under the work (owner's placement rule).
 * Exactly three shortcuts (pickHomeShortcuts), drawn as three phones with
 * the middle one raised. Each opens the existing player in place.
 */
import { useCallback, useMemo, useState } from "react";
import Link from "@/components/ui/localized-link";
import { ReelPlayer } from "@/features/reels/reel-player";
import { formatTime, pickHomeShortcuts, pickText, type ReelShortcut } from "@/features/reels/reels.data";
import { trackEvent } from "@/lib/analytics";
import { Arrow, Chapter, useX } from "./shared";

export function Reels() {
  const { lang, t } = useX();
  const shortcuts = useMemo(() => pickHomeShortcuts(), []);
  const [open, setOpen] = useState<ReelShortcut | null>(null);
  const close = useCallback(() => setOpen(null), []);
  if (shortcuts.length === 0) return null;

  return (
    <section id="watch" className="x-room x-iris ground-ink">
      <Chapter
        n="04"
        kicker={t("Watch it run", "شاهده يعمل", "Lihat ia berjalan")}
        title={
          <>
            {t("The method,", "المنهج،", "Kaedahnya,")} <span className="x-accent">{t("in minutes.", "في دقائق.", "dalam minit.")}</span>
          </>
        }
        lead={t(
          "Short reels on the systems behind the work — research, a real execution plan, an independent audit.",
          "ريلز قصيرة عن الأنظمة التي تقف خلف العمل: بحث، وخطة تنفيذ حقيقية، ومراجعة مستقلة.",
          "Reel pendek tentang sistem di sebalik kerja — penyelidikan, pelan pelaksanaan sebenar, audit bebas.",
        )}
      >
        <Link href="/reels" className="x-btn x-btn--line w-fit">
          {t("All reels", "كل الريلز", "Semua reel")}
          <Arrow />
        </Link>
      </Chapter>

      <div className="x-wrap">
        <div className="x-phones">
          {shortcuts.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className="x-phone"
              data-cursor={t("Play", "تشغيل", "Main")}
              onClick={() => {
                trackEvent("reel_open", { slug: s.reel.slug, surface: "x_reels" });
                setOpen(s);
              }}
              aria-label={`${pickText(s.title, lang)} — ${formatTime(s.at)}`}
            >
              {/* Plain img: /reels/* sits outside images.localPatterns (media is served as-is). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <span aria-hidden className="x-phone__notch" />
              <span aria-hidden className="x-phone__play">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
              <span className="x-phone__meta">
                <span className="x-mono opacity-80">
                  {String(i + 1).padStart(2, "0")} · {formatTime(s.at)}
                </span>
                <span className="x-phone__title">{pickText(s.title, lang)}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {open ? <ReelPlayer reel={open.reel} startAt={open.at} onClose={close} /> : null}
    </section>
  );
}
