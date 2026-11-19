"use client";

import * as React from "react";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { CtaBand } from "@/features/offers/offer-blocks";
import { trackEvent } from "@/lib/analytics";
import { ReelCard } from "@/features/reels/reel-card";
import { ReelPlayer } from "@/features/reels/reel-player";
import { REELS, formatTime, pickText, type Reel } from "@/features/reels/reels.data";

type Open = { reel: Reel; at: number } | null;

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  x: "X",
};

export function ReelsView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [open, setOpen] = React.useState<Open>(null);
  const close = React.useCallback(() => setOpen(null), []);

  const openReel = (reel: Reel, at = 0, surface = "reels_page") => {
    trackEvent("reel_open", { slug: reel.slug, surface });
    setOpen({ reel, at });
  };

  // Deep link: /reels?r=<slug>&t=<seconds> opens the player directly.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("r");
    if (!slug) return;
    const reel = REELS.find((r) => r.slug === slug);
    if (!reel) return;
    const t = Number(params.get("t") ?? 0);
    setOpen({ reel, at: Number.isFinite(t) && t >= 0 ? t : 0 });
  }, []);

  const fmt = new Intl.DateTimeFormat(ar ? "ar-EG-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const [featured, ...rest] = REELS;

  return (
    <main className="container-content flex flex-col gap-8 pb-6">
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "ريلز / المنهج بالفيديو" : "REELS / THE METHOD ON VIDEO"}
          title={
            <>
              {ar ? "الأنظمة التي تقف وراء العمل، " : "The systems behind the work, "}
              <em className="text-accent">{ar ? "في دقائق." : "in minutes."}</em>
            </>
          }
          subtitle={
            ar
              ? "ريلز قصيرة تشرح كيف نفكّر ونبني: البحث والتخطيط والتنفيذ والمراجعة، وهو المنهج نفسه الذي يُطبَّق على مشروعك."
              : "Short reels on how we think and build: research, planning, execution and audit — the same method applied to your project."
          }
          subtitleClassName="max-w-[58ch]"
        />
      </header>

      {featured ? (
        <section aria-labelledby="reel-featured" className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 md:grid-cols-[minmax(0,340px)_1fr] md:gap-8">
          <ReelCard reel={featured} className="max-md:mx-auto max-md:max-w-[300px]" onOpen={() => openReel(featured)} index={ar ? "الأحدث" : "LATEST"} />

          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              <time dateTime={featured.publishedAt}>{fmt.format(new Date(featured.publishedAt))}</time>
              <span aria-hidden>·</span>
              <span>{formatTime(featured.duration)}</span>
              <span aria-hidden>·</span>
              <span>{featured.topics.join(" + ")}</span>
            </div>
            <h2 id="reel-featured" className="font-display text-title tracking-[-0.015em] text-text-primary [overflow-wrap:anywhere]">
              {pickText(featured.title, lang)}
            </h2>
            <p className="max-w-[56ch] text-body text-text-secondary">{pickText(featured.summary, lang)}</p>

            {featured.chapters?.length ? (
              <div className="mt-1 flex flex-col gap-2">
                <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                  {ar ? "الفصول" : "CHAPTERS"}
                </p>
                <ol className="flex flex-col divide-y divide-border-subtle rounded-panel border border-border-subtle">
                  {featured.chapters.map((c, i) => (
                    <li key={c.at}>
                      <button
                        type="button"
                        onClick={() => openReel(featured, c.at, "reels_chapter")}
                        className="group flex w-full items-center gap-3 px-3 py-2 text-start transition-colors duration-base ease-physics hover:bg-surface-1/60"
                      >
                        <span className="font-mono text-micro text-text-ghost">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-body text-text-primary transition-colors duration-base ease-physics group-hover:text-accent">
                          {pickText(c.title, lang)}
                        </span>
                        <span className="font-mono text-micro text-text-tertiary">{formatTime(c.at)}</span>
                        <span aria-hidden className="inline-flex text-text-ghost group-hover:text-accent">
                          <Icon name="play" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {featured.links?.length ? (
              <ul className="flex flex-wrap gap-2">
                {featured.links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-pill border border-border-default px-2 py-0.5 font-mono text-micro uppercase tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:border-border-strong hover:text-text-primary"
                    >
                      {PLATFORM_LABEL[l.platform] ?? l.platform}
                      <Icon name="arrow-up-right" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section aria-labelledby="reels-all" className="flex flex-col gap-3">
          <h2 id="reels-all" className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
            {ar ? "كل الريلز" : "ALL REELS"}
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {rest.map((reel) => (
              <li key={reel.slug}>
                <ReelCard reel={reel} onOpen={() => openReel(reel)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CtaBand
        kicker={["THE SAME METHOD, ON YOUR PROJECT", "المنهج نفسه، على مشروعك"]}
        title={["Seen how it runs?", "هل رأيت كيف يعمل؟"]}
        italic={["Let's scope yours.", "لنحدد نطاق مشروعك."]}
        primary={["Start a project", "ابدأ مشروعك"]}
        primaryHref="/contact"
        secondary={["Read the writing", "اقرأ المقالات"]}
        secondaryHref="/writing"
      />

      {open ? <ReelPlayer reel={open.reel} startAt={open.at} onClose={close} /> : null}
    </main>
  );
}
