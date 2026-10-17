"use client";

/**
 * 404 NOT FOUND — Aboalazm OS
 *
 * Aesthetic: radar / HUD panel — inspired by the brand 404 reference image.
 * The bg image (error-404.png) fills the viewport; all copy and UI
 * layered over it in the site's design language.
 *
 * Bilingual via useLang (LTR/RTL aware).
 * Motion via Framer Motion (reveal + scanline pulse).
 * No external deps beyond what's already in the bundle.
 *
 * Shared between app/(site)/not-found.tsx (matched routes inside the
 * (site) route group) and the top-level app/global-not-found.tsx (unmatched
 * URLs outside any route group) — see both files for how each wraps
 * this component with the providers it needs.
 */

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { physics, physicsSlow, reveal } from "@/lib/motion";
import { buttonVariants } from "@/components/ui/Button";

/* ─── copy ───────────────────────────────────────────────────────── */
const COPY = {
  en: {
    status:      "SIGNAL LOST — ERROR 404",
    headline:    ["MAYBE", "THEY ARE", "THERE"],
    sub:         "...but this page isn't.",
    body:        "The URL you followed doesn't exist — or the signal was never sent. Head back to a known coordinate.",
    cta:         "Return to Base",
    ctaAlt:      "View Work",
    coords:      "LAT 30.2°N · LNG 31.7°E · ALT —",
    scanTicker:  "SCANNING SIGNAL · NO RESPONSE · RETRY IN PROGRESS ·",
    bottom:      "BIG EAR RADIO TELESCOPE  ·  AL OBOUR, EGYPT  ·  ABOALAZM OS  ·  2024 – 2026",
  },
  ar: {
    status:      "إشارة مفقودة — خطأ 404",
    headline:    ["ربما", "هم هناك", "فعلًا"],
    sub:         "...لكن هذه الصفحة لا وجود لها.",
    body:        "الرابط الذي اتبعته غير موجود — أو لم تُرسَل الإشارة أصلًا. عُد إلى إحداثية معروفة.",
    cta:         "العودة إلى القاعدة",
    ctaAlt:      "استعرض الأعمال",
    coords:      "خط العرض 30.2°ش · خط الطول 31.7°ق · الارتفاع —",
    scanTicker:  "· مسح الإشارة · لا استجابة · إعادة المحاولة ·",
    bottom:      "تلسكوب الأذن الكبيرة  ·  العبور، مصر  ·  Aboalazm OS  ·  2024 – 2026",
  },
} as const;

const QUICK_LINKS = {
  en: [
    { href: "/work",         label: "Work"         },
    { href: "/about",        label: "About"        },
    { href: "/services",     label: "Services"     },
    { href: "/contact",      label: "Contact"      },
    { href: "/resources",    label: "Resources"    },
  ],
  ar: [
    { href: "/work",         label: "الأعمال"      },
    { href: "/about",        label: "نبذة"         },
    { href: "/services",     label: "الخدمات"      },
    { href: "/contact",      label: "تواصل"        },
    { href: "/resources",    label: "المصادر"      },
  ],
} as const;

/* ─── content ────────────────────────────────────────────────────── */
export function NotFoundContent() {
  const { lang } = useLang();
  const ar   = lang === "ar";
  const copy = ar ? COPY.ar : COPY.en;
  const links = ar ? QUICK_LINKS.ar : QUICK_LINKS.en;
  const reduceMotion = useReducedMotion();

  return (
    <main
      className="not-found-root"
      dir={ar ? "rtl" : "ltr"}
    >
      {/* ── BG: 404 image full-bleed ─────────────────────────────── */}
      <div className="not-found-bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/work/error-404.png"
          alt=""
          className="not-found-bg__img"
        />
        {/* Dark vignette so text stays legible */}
        <div className="not-found-bg__vignette" />
      </div>

      {/* ── HUD grid overlay ─────────────────────────────────────── */}
      <div className="not-found-grid" aria-hidden />

      {/* ── Scanline ticker (top) ────────────────────────────────── */}
      <div className="not-found-ticker" aria-hidden>
        <div className="not-found-ticker__track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>{copy.scanTicker}&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      {/* ── Corner crosshairs ────────────────────────────────────── */}
      <Crosshair pos="tl" />
      <Crosshair pos="tr" />
      <Crosshair pos="bl" />
      <Crosshair pos="br" />

      {/* ── HUD status label ─────────────────────────────────────── */}
      <motion.div
        className="not-found-status"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...physics, delay: 0.3 }}
      >
        <span className="not-found-status__dot" aria-hidden />
        {copy.status}
      </motion.div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <motion.div
        className="not-found-content"
        variants={reveal.container}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        {/* Big headline — GC EPICPRO / Thmanyah */}
        <div className="not-found-headline" aria-label={copy.headline.join(" ")}>
          {copy.headline.map((line, i) => (
            <motion.span
              key={i}
              className="not-found-headline__line"
              variants={reveal.item}
              custom={i}
            >
              {line}
            </motion.span>
          ))}
        </div>

        {/* Sub + body */}
        <motion.p
          className="not-found-sub"
          variants={reveal.item}
        >
          {copy.sub}
        </motion.p>

        <motion.p
          className="not-found-body"
          variants={reveal.item}
        >
          {copy.body}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="not-found-ctas"
          variants={reveal.item}
        >
          <Link
            href="/"
            className={buttonVariants({
              className:
                "inline-flex items-center gap-1.5 px-[20px] py-[10px] font-display font-[800] text-micro tracking-[0.08em] transition-transform duration-[200ms] ease-physics hover:-translate-y-[2px]",
            })}
          >
            {copy.cta}
            <Icon name="arrow-right" />
          </Link>
          <Link
            href="/work"
            className={buttonVariants({
              variant: "ghost",
              className:
                "border border-accent-border bg-transparent px-[20px] py-[10px] font-display font-[800] text-micro tracking-[0.08em] text-accent-text transition-[transform,background-color] duration-[200ms] ease-physics hover:-translate-y-[2px] hover:bg-accent-08",
            })}
          >
            {copy.ctaAlt}
          </Link>
        </motion.div>

        {/* Quick nav */}
        <motion.nav
          className="not-found-nav"
          aria-label="Quick navigation"
          variants={reveal.item}
        >
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="not-found-nav__link">
              {label}
            </Link>
          ))}
        </motion.nav>
      </motion.div>

      {/* ── HUD coordinates (side) ───────────────────────────────── */}
      <motion.div
        className="not-found-coords"
        initial={reduceMotion ? false : { opacity: 0, x: ar ? 12 : -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...physicsSlow, delay: 0.8 }}
        aria-hidden
      >
        {copy.coords}
      </motion.div>

      {/* ── Bottom ticker ────────────────────────────────────────── */}
      <motion.div
        className="not-found-bottom"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...physics, delay: 1 }}
        aria-hidden
      >
        {copy.bottom}
      </motion.div>

      {/* ── Pulsing radar ring ───────────────────────────────────── */}
      <div className="not-found-radar" aria-hidden>
        <span className="not-found-radar__ring not-found-radar__ring--1" />
        <span className="not-found-radar__ring not-found-radar__ring--2" />
        <span className="not-found-radar__ring not-found-radar__ring--3" />
      </div>
    </main>
  );
}

/* ─── Crosshair corner component ─────────────────────────────────── */
function Crosshair({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`not-found-crosshair not-found-crosshair--${pos}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...physics, delay: 0.5 }}
      aria-hidden
    >
      <span className="not-found-crosshair__h" />
      <span className="not-found-crosshair__v" />
    </motion.div>
  );
}
