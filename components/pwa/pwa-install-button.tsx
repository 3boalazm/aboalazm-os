"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/providers/lang-provider";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * Three placements, one control:
 *  · floating — its own fixed corner pill. Unused since the 2026-11 home
 *    rewrite moved the mount into the layout's OS tray; kept because it is
 *    the shape a single-placement page would want.
 *  · docked   — a compact pill designed to sit INSIDE the fixed OS tray
 *    (components/layout/os-tray.tsx) next to the language switch, so the
 *    install control is always one tap away and still never overlaps the
 *    back-to-top button on long articles.
 *  · inline   — the wide card on /developer.
 */
export type PwaInstallVariant = "floating" | "inline" | "docked";

export function PwaInstallButton({ variant = "floating" }: { variant?: PwaInstallVariant }) {
  const docked = variant === "docked";
  const { lang } = useLang();
  const ar = lang === "ar";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [appleMobile, setAppleMobile] = useState(false);
  const [safariDesktop, setSafariDesktop] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const syncInstalled = () => {
      const safariStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
      setInstalled(displayMode.matches || safariStandalone);
    };
    type WindowWithPrompt = Window & { __pwaInstallPrompt?: InstallPromptEvent | null };
    const w = window as WindowWithPrompt;
    const adoptStashed = () => {
      if (w.__pwaInstallPrompt) setInstallPrompt(w.__pwaInstallPrompt);
    };
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      w.__pwaInstallPrompt = event as InstallPromptEvent;
      setInstallPrompt(event as InstallPromptEvent);
    };
    // The event usually fires before hydration — the boot script keeps it.
    adoptStashed();
    const onInstalled = () => {
      setInstalled(true);
      setHelpOpen(false);
      setInstallPrompt(null);
    };

    syncInstalled();
    const platform = navigator as Navigator & { userAgentData?: { platform?: string } };
    const isAppleTouchDevice =
      /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      /iOS/i.test(platform.userAgentData?.platform ?? "");
    setAppleMobile(isAppleTouchDevice);
    // macOS Safari 17+ installs via File → Add to Dock (no programmatic prompt).
    setSafariDesktop(
      !isAppleTouchDevice &&
        /Macintosh/.test(navigator.userAgent) &&
        /Version\/(1[7-9]|[2-9]\d)[\d.]* Safari/.test(navigator.userAgent),
    );

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("pwa:installable", adoptStashed);
    window.addEventListener("appinstalled", onInstalled);
    displayMode.addEventListener("change", syncInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("pwa:installable", adoptStashed);
      window.removeEventListener("appinstalled", onInstalled);
      displayMode.removeEventListener("change", syncInstalled);
    };
  }, []);

  useEffect(() => {
    if (!helpOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHelpOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [helpOpen]);

  const handleInstall = async () => {
    if (!installPrompt) {
      setHelpOpen((open) => !open);
      return;
    }

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      // A prompt event can only be used once.
      (window as Window & { __pwaInstallPrompt?: unknown }).__pwaInstallPrompt = null;
      setInstallPrompt(null);
      setHelpOpen(false);
      if (result.outcome === "accepted") setInstalled(true);
    } catch {
      setInstallPrompt(null);
      setHelpOpen(true);
    }
  };

  if (installed) return null;
  // In the tray the control means "install now": show it only where one tap
  // really installs (the browser handed us its native prompt) or on iOS,
  // where Safari's Share → Add to Home Screen is the only route. Browsers that
  // cannot install (in-app webviews, Firefox desktop…) get no dead button and
  // no manual-instructions popup. /developer's inline card keeps the help.
  if (variant !== "inline" && !installPrompt && !appleMobile && !safariDesktop) return null;

  return (
    <div
      id={variant === "floating" ? "pwa-install-control" : undefined}
      className={
        variant === "floating"
          ? "fixed end-4 z-[80] flex flex-col items-end"
          : variant === "inline"
            ? "relative flex w-full flex-col items-start"
            : /* docked: a ROW (divider beside the button, not above it) and no
                 w-full — as a flex child of the tray that would stretch the
                 pill across the whole bar. */
              "flex flex-row items-center"
      }
      style={variant === "floating" ? { bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" } : undefined}
    >
      {/* Docked, the anchor box itself has no width (it holds one inline-flex
          child), so an absolutely-positioned card would take the width of the
          BOX and collapse. It is anchored to the tray pill instead, which is
          the nearest positioned ancestor once it is open. See os-tray.css. */}
      {helpOpen ? (
        <section
          id="pwa-install-help"
          role="dialog"
          aria-labelledby="pwa-install-title"
          /* In the tray the help card must escape the pill: the tray is a flex
             row, so a card placed in the normal flow would sit BESIDE the
             button and stretch the bar. Docked, it is taken out of flow and
             anchored above its trigger. */
          className={docked
            ? "absolute bottom-[calc(100%+0.6rem)] end-0 z-50 w-72 max-w-[calc(100vw-4rem)] rounded-card border border-border-default bg-surface-3 p-3.5 text-start shadow-panel"
            : "mb-3 w-72 max-w-[calc(100vw-2rem)] rounded-card border border-border-default bg-surface-1 p-4 text-start shadow-card backdrop-blur-xl"}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-micro uppercase tracking-[0.1em] text-accent">
                {ar ? "تطبيق ويب قابل للتثبيت" : lang === "ms" ? "APLIKASI WEB BOLEH PASANG" : "INSTALLABLE WEB APP"}
              </p>
              <h2 id="pwa-install-title" className="mt-1 font-display text-subtitle text-text-primary">
                {ar ? "ثبّت الموقع كتطبيق" : lang === "ms" ? "Pasang laman ini sebagai aplikasi" : "Install the site as an app"}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setHelpOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label={ar ? "إغلاق التعليمات" : lang === "ms" ? "Tutup arahan" : "Close instructions"}
              /* Explicit 32px, not `size-8`: --spacing in this system is 8px,
                 so the Tailwind size scale doubles (size-8 = 64px) and the
                 close target rendered as a 64px ring around a faint glyph. */
              className="grid size-[2rem] shrink-0 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
            >
              <Icon name="x" size={16} />
            </button>
          </div>

          <p className="mt-2 text-body-sm leading-relaxed text-text-secondary">
            {safariDesktop
              ? ar
                ? "من قائمة File في Safari اختار «Add to Dock»."
                : lang === "ms"
                  ? "Dalam Safari, pilih File → “Add to Dock”."
                  : "In Safari, choose File → “Add to Dock.”"
              : appleMobile
              ? ar
                ? "افتح قائمة المشاركة في Safari، ثم اختَر «إضافة إلى الشاشة الرئيسية»."
                : lang === "ms"
                  ? "Buka menu Kongsi Safari, kemudian pilih “Tambah ke Skrin Utama”."
                  : "Open Safari’s Share menu, then choose “Add to Home Screen.”"
              : ar
                ? "من قائمة المتصفح اختَر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»."
                : lang === "ms"
                  ? "Buka menu pelayar dan pilih “Pasang aplikasi” atau “Tambah ke skrin utama”."
                  : "Open your browser menu and choose “Install app” or “Add to Home screen.”"}
          </p>
          <p className="mt-3 border-t border-border-subtle pt-3 font-mono text-micro leading-relaxed text-text-tertiary">
            {ar
              ? "هيفتح كتطبيق مستقل، وتقدر ترجع للصفحات اللي زرتها حتى لو الاتصال فصل."
              : lang === "ms"
                ? "Ia terbuka dalam tetingkap aplikasi tersendiri; halaman yang pernah dilawati boleh tersedia di luar talian."
                : "It opens in its own app window; pages you’ve visited can be available offline."}
          </p>
        </section>
      ) : null}

      {/* The divider belongs to the control, not to the tray: once the app is
          installed this component returns null, and a divider owned by the
          tray would be left hanging in front of the language chips. */}
      {docked ? <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border-default" /> : null}

      <button
        ref={buttonRef}
        type="button"
        onClick={handleInstall}
        aria-label={
          variant === "inline"
            ? (ar ? "ثبّت Aboalazm OS كتطبيق" : lang === "ms" ? "Pasang Aboalazm OS sebagai aplikasi" : "Install Aboalazm OS as an app")
            : (ar ? "ثبّت الموقع كتطبيق" : lang === "ms" ? "Pasang laman ini sebagai aplikasi" : "Install this site as an app")
        }
        aria-expanded={helpOpen}
        aria-controls={helpOpen ? "pwa-install-help" : undefined}
        className={
          docked
            /* No border/backdrop of its own: the tray pill IS the surface. A
               second bordered pill inside it read as two nested controls. */
            ? "group inline-flex items-center gap-1 rounded-pill p-0.5 text-text-primary sm:pe-1.5 transition-colors duration-base ease-physics hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
            : variant === "floating"
              ? "group inline-flex items-center gap-1.5 rounded-pill border border-accent/45 bg-surface-1/95 px-2 py-1 text-text-primary shadow-card backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent sm:gap-2 sm:px-2.5 sm:py-1.5"
              : "group inline-flex w-full items-center justify-between gap-4 rounded-card border border-accent/45 bg-surface-1 px-4 py-3.5 text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent sm:w-auto sm:min-w-[18rem]"
        }
      >
        <span
          className={
            docked
              ? "grid size-[2.25rem] shrink-0 place-items-center rounded-full bg-accent text-obsidian transition-transform duration-200 group-hover:scale-105"
              : variant === "floating"
              ? "grid size-6 shrink-0 place-items-center rounded-full bg-accent text-obsidian transition-transform duration-200 group-hover:scale-105"
              : "grid size-10 shrink-0 place-items-center rounded-full bg-accent text-obsidian transition-transform duration-200 group-hover:scale-105"
          }
        >
          <Icon name="download" size={variant === "inline" ? 20 : 14} />
        </span>
        {/* Docked on phones: icon only, so the language chips get the room. */}
        <span className={docked ? "hidden flex-col items-start gap-0.5 sm:flex" : "flex flex-col items-start gap-0.5"}>
          <span className={docked
            ? "whitespace-nowrap font-mono text-micro font-semibold uppercase leading-tight tracking-[0.06em]"
            : "whitespace-nowrap font-mono text-[13px] font-semibold uppercase leading-tight tracking-[0.06em] sm:text-micro"}>
            {variant === "inline"
              ? (ar ? "ثبّت Aboalazm OS" : lang === "ms" ? "DAPATKAN APLIKASI OS" : "GET THE OS APP")
              : (ar ? "ثبّت التطبيق" : lang === "ms" ? "Pasang aplikasi" : "Install app")}
          </span>
          {/* Phones get the one actionable line only — the sub-label is what
              made the floating control a 104px-tall card over the hero.
              Docked never shows it: the tray is one 32px row. */}
          <span
            className={
              variant === "inline"
                ? "text-[13px] leading-none text-text-tertiary"
                : docked
                  ? "hidden"
                  : "hidden text-[13px] leading-none text-text-tertiary sm:block"
            }
          >
            {variant === "inline"
              ? (ar ? "تجربة كاملة من شاشتك الرئيسية" : lang === "ms" ? "Pengalaman skrin penuh pada peranti anda" : "A full-screen experience on your device")
              : (ar ? "أضِفه لشاشتك الرئيسية" : lang === "ms" ? "Tambah ke skrin utama" : "Add to your home screen")}
          </span>
        </span>
      </button>
    </div>
  );
}
