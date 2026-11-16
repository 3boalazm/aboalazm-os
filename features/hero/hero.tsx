"use client";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";

/**
 * HERO — redesign v3: a film frame, not a layout.
 *
 * One figure walking across one coral sun (the studio's own poster plate),
 * rising from the foot of the screen; the claim set large and centred in the
 * dark above it. Nothing else competes in the first viewport: the work wall
 * that used to share this screen is the next module (02 WORK), and the
 * metrics sit in a glass strip at the foot of the frame.
 *
 * Always dark, in both themes (.hero-cinema pins its own tokens): the sun
 * only reads against black.
 *
 * The h1 still carries the studio + founder + role for search and screen
 * readers; the visible line is the claim.
 */
import Link from "@/components/ui/localized-link";
import Image from "next/image";
import { preload } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import type { CSSProperties } from "react";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { StatusNode } from "./status-node";
import { MetricRow } from "./metric-row";
import { HeroBrief } from "./hero-brief";
import type { HeroWallTile } from "./hero-wall-data";
import "./hero.css";

const STUDIO_CORAL = {
  primary: "rgb(255 107 71 / 0.10)",
  secondary: "rgb(255 107 71 / 0.05)",
} as const;

const ITALIC_LINE = 1;

// `wall` is accepted for API compatibility; the work now opens module 02.
export function Hero(_props: { wall?: readonly HeroWallTile[] } = {}) {
  preload("/fonts/Gc_Epicpro.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  useAmbientGlow(STUDIO_CORAL, 0.5);
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const HEADLINE = [t.heroLine1, t.heroLine2, t.heroLine3];

  return (
    <section className="home-hero hero-cinema flex flex-col">
      <div aria-hidden className="hero-cinema__stars" />
      <div aria-hidden className="hero-cinema__bloom" />
      <div aria-hidden className="hero-cinema__sun">
        <Image src="/images/generated/hero-poster.jpg" alt="" width={768} height={1376} priority sizes="(min-width: 1024px) 60vw, 130vw" />
      </div>
      <div aria-hidden className="hero-cinema__veil" />

      <div className="container-wide relative flex flex-1 flex-col items-center pt-6 text-center lg:pt-10">
        <div className="hero-rise flex flex-wrap items-center justify-center gap-2" style={{ "--rise-y": "-8px" } as CSSProperties}>
          <StatusNode />
        </div>

        <p aria-hidden className="hero-rise mt-3 font-mono text-label uppercase tracking-[0.14em] text-text-secondary" style={{ "--i": 0 } as CSSProperties}>
          {ar ? (
            <>Aboalazm OS<span className="hidden sm:inline"> — استوديو هوية ورقمي يقوده مصطفى أبوالعزم</span></>
          ) : lang === "ms" ? (
            <>Aboalazm OS<span className="hidden sm:inline"> — studio identiti dan digital yang dipimpin Mustafa Aboalazm</span></>
          ) : (
            <>Aboalazm OS<span className="hidden sm:inline"> — a founder-led brand & digital studio by Mustafa Aboalazm</span></>
          )}
        </p>

        <h1 className="hero-cinema__title mt-3 max-w-[16ch] text-text-primary">
          <span className="sr-only">
            {ar
              ? "Aboalazm OS — استوديو هوية ورقمي وأنظمة تشغيل يقوده مصطفى أبوالعزم، مصمم هوية بصرية أول. "
              : "Aboalazm OS — a founder-led brand, digital and business systems studio by Mustafa Aboalazm, senior brand identity designer. "}
          </span>
          {HEADLINE.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em] rtl:pb-[0.1em]">
              <span className="hero-line block" style={{ "--i": i } as CSSProperties}>
                {i === ITALIC_LINE ? <em className="text-accent">{line}</em> : line}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-rise mt-4 max-w-[52ch] text-lead text-text-secondary" style={{ "--i": 0 } as CSSProperties}>
          {t.heroLead}
        </p>

        <div className="hero-rise mt-4 flex flex-wrap items-center justify-center gap-2" style={{ "--i": 1 } as CSSProperties}>
          <Link href="/contact?source=%2F" className="inline-flex min-h-6 items-center gap-2 rounded-pill bg-accent px-3 py-1.5 font-mono text-label text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5">
            {t.heroCommission} <Icon name="arrow-right" />
          </Link>
          <a href="#work" className="glass inline-flex min-h-6 items-center gap-2 rounded-pill px-3 py-1.5 font-mono text-label text-text-primary">
            {t.heroExplore} <Icon name="arrow-down" />
          </a>
        </div>

        {/* The frame's lower third belongs to the sun and the figure. */}
        <div className="min-h-[34svh] flex-1" aria-hidden />

        <div className="hero-rise mb-4 grid w-full items-end gap-3 text-start lg:grid-cols-[1fr_auto]" style={{ "--i": 2 } as CSSProperties}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-micro text-text-secondary">
            <Link href="/for-hiring" className="underline decoration-border-default underline-offset-4 transition-colors hover:text-text-primary">
              {ar ? "للشركات والتوظيف ←" : lang === "ms" ? "Untuk pasukan pengambilan →" : "For hiring teams →"}
            </Link>
            <span aria-hidden>·</span>
            <Link href="/services" className="underline decoration-border-default underline-offset-4 transition-colors hover:text-text-primary">
              {ar ? "خدمات العملاء ←" : lang === "ms" ? "Perkhidmatan klien →" : "Client services →"}
            </Link>
          </div>
          <div className="max-sm:hidden">
            <HeroBrief />
          </div>
        </div>
      </div>

      <div className="container-wide relative w-full border-t border-border-subtle py-4">
        <MetricRow />
      </div>
    </section>
  );
}
