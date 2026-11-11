"use client";

/**
 * OS TRAY — the persistent control dock, bottom-end, on every page.
 *
 * Why it exists: the install control used to be a corner pill mounted on the
 * home page only, and the 2026-11 home rewrite (commit ab02003) moved the
 * page into app/(site)/[locale] without carrying the mount across — so the
 * installable app shipped and then had no visible door. /developer kept the
 * inline card, which nobody visits to install an app.
 *
 * The tray is also where the system's LANGUAGES live. The header switch is a
 * blind EN → AR → MS cycle: two of the three languages are only discoverable
 * by pressing it repeatedly, so Malay — the newest locale, and the one this
 * studio's Malaysia positioning is written for — was effectively invisible.
 * Here all three are named, in their own script, always.
 *
 * Two behaviours keep it from becoming page furniture:
 *   · it hides while you read downward and returns the moment you scroll up
 *     (a fixed bar over a long article is otherwise a permanent lid);
 *   · it retracts completely when the terminal (Ctrl + `) opens, because that
 *     panel docks to the same bottom edge.
 *
 * Placement decisions worth keeping:
 *   · `bottom` (not `top`): the pill nav already owns the top edge and the
 *     reader view is built around it.
 *   · `end-4` / logical insets: Arabic flips the whole tray to the left.
 *   · z-40: above page content, below the nav (50), the terminal (999) and
 *     any modal — the tray must never sit on top of a dialog.
 *   · the article back-to-top button (writing-detail-view) is `bottom-6` on
 *     the same edge, so the tray adds --os-tray-offset and that button stays
 *     one clear line above it. Same contract, one place.
 */
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { LOCALES, localeHref, type Locale } from "@/lib/locale";
import { PwaInstallButton } from "@/components/pwa/pwa-install-button";
import { joinClasses } from "@/lib/utils";

/* The three languages. `short` is the visible chip and stays Latin on
   purpose: a حرف in a Latin stack would make every English page download the
   42 KB Arabic subset just for the tray, and the same trap already forced the
   header switch to draw its ع as a path. `name` is the native name used for
   the accessible name and the tooltip — text that only appears on hover, so
   it costs no font download. */
const LANGUAGES: Record<Locale, { name: string; short: string }> = {
  en: { name: "English", short: "EN" },
  ar: { name: "العربية", short: "AR" },
  ms: { name: "Bahasa Melayu", short: "MS" },
};

export function OsTray() {
  const { lang, setLang } = useLang();
  const ar = lang === "ar";
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const lastY = useRef(0);

  /* Reveal on intent, hide on descent. The threshold stops the tray
     flickering to every 2px of inertia scrolling. */
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 8) return;
      setHidden(delta > 0 && y > 320);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* The terminal overlay is mounted by the same layout and has no public
     state; it is the only element that owns Ctrl + `, so mirror the same
     shortcut rather than lifting state out of it. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "`") {
        setTerminalOpen((open) => !open);
      }
      if (event.key === "Escape") setTerminalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* Switching language must keep the query string and the #anchor — a
     filtered view or an open section is part of where the reader is. A plain
     href cannot carry them (reading them needs useSearchParams, which forces
     the whole statically-rendered page into client rendering), so the tray
     routes through the provider, which already builds that URL, exactly like
     the header control. Modified clicks (new tab, new window) keep the real
     link and its plain destination. */
  const switchTo = (locale: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setLang(locale);
  };

  return (
    <div
      id="os-tray"
      data-hidden={hidden || terminalOpen ? "true" : "false"}
      /* z-index lives in .os-tray (globals.css): it has to rise above the
         article's z-40 back-to-top button when the help card is open, and no
         single Tailwind z-* class expresses "40 normally, 60 while open".
         Keeping it in one place also means the tray never silently drops
         under the nav (50) or a modal (80). */
      className="os-tray fixed inset-x-0 bottom-0 flex justify-end px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]"
    >
      {/* `relative` is load-bearing: the install help card is absolutely
          positioned against this pill when the control is docked. */}
      <div className="glass relative flex max-w-[calc(100vw-2rem)] items-center rounded-pill p-1 shadow-card">
        {/* Renders its own divider, and nothing at all once installed. */}
        <PwaInstallButton variant="docked" />

        {/* Language — a real segmented control, so the system reads as
            trilingual at a glance instead of hiding two thirds of itself
            behind one cycle button in the header. */}
        <div
          role="group"
          aria-label={ar ? "اختر اللغة" : lang === "ms" ? "Pilih bahasa" : "Choose language"}
          className="flex items-center"
        >
          {LOCALES.map((locale) => {
            const current = locale === lang;
            const language = LANGUAGES[locale];
            return (
              <Link
                key={locale}
                href={localeHref(pathname ?? "/", locale)}
                onClick={switchTo(locale)}
                hrefLang={locale}
                lang={locale}
                dir={locale === "ar" ? "rtl" : "ltr"}
                aria-current={current ? "true" : undefined}
                aria-label={language.name}
                title={language.name}
                className={joinClasses(
                  "inline-flex h-6 min-w-6 items-center justify-center rounded-pill px-1 font-mono text-[13px] leading-none transition-colors duration-base ease-physics",
                  current
                    ? "bg-accent font-semibold text-obsidian"
                    : "text-text-tertiary hover:bg-surface-2 hover:text-text-primary",
                )}
              >
                {language.short}
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
