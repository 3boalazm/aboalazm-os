"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/providers/lang-provider";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaInstallButton({ variant = "floating" }: { variant?: "floating" | "inline" }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [appleMobile, setAppleMobile] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const syncInstalled = () => {
      const safariStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
      setInstalled(displayMode.matches || safariStandalone);
    };
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
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

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    displayMode.addEventListener("change", syncInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
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
      setInstallPrompt(null);
      setHelpOpen(false);
      if (result.outcome === "accepted") setInstalled(true);
    } catch {
      setInstallPrompt(null);
      setHelpOpen(true);
    }
  };

  if (installed) return null;

  return (
    <div
      className={variant === "floating" ? "fixed end-4 z-[80] flex flex-col items-end" : "relative flex w-full flex-col items-start"}
      style={variant === "floating" ? { bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" } : undefined}
    >
      {helpOpen ? (
        <section
          id="pwa-install-help"
          role="dialog"
          aria-labelledby="pwa-install-title"
          className="mb-3 w-72 max-w-[calc(100vw-2rem)] rounded-card border border-border-default bg-surface-1 p-4 text-start shadow-card backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-micro uppercase tracking-[0.1em] text-accent">
                {ar ? "تطبيق ويب قابل للتثبيت" : "INSTALLABLE WEB APP"}
              </p>
              <h2 id="pwa-install-title" className="mt-1 font-display text-subtitle text-text-primary">
                {ar ? "ثبّت الموقع كتطبيق" : "Install the site as an app"}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setHelpOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label={ar ? "إغلاق التعليمات" : "Close instructions"}
              className="grid size-8 shrink-0 place-items-center rounded-full text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary"
            >
              <Icon name="x" size={16} />
            </button>
          </div>

          <p className="mt-2 text-body-sm leading-relaxed text-text-secondary">
            {appleMobile
              ? ar
                ? "افتح قائمة المشاركة في Safari، ثم اختَر «إضافة إلى الشاشة الرئيسية»."
                : "Open Safari’s Share menu, then choose “Add to Home Screen.”"
              : ar
                ? "من قائمة المتصفح اختَر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»."
                : "Open your browser menu and choose “Install app” or “Add to Home screen.”"}
          </p>
          <p className="mt-3 border-t border-border-subtle pt-3 font-mono text-micro leading-relaxed text-text-tertiary">
            {ar
              ? "هيفتح كتطبيق مستقل، وتقدر ترجع للصفحات اللي زرتها حتى لو الاتصال فصل."
              : "It opens in its own app window; pages you’ve visited can be available offline."}
          </p>
        </section>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        onClick={handleInstall}
        aria-label={ar ? "ثبّت الموقع كتطبيق" : "Install this site as an app"}
        aria-expanded={helpOpen}
        aria-controls={helpOpen ? "pwa-install-help" : undefined}
        className={variant === "floating"
          ? "group inline-flex items-center gap-2 rounded-pill border border-accent/45 bg-surface-1/95 px-3 py-2.5 text-text-primary shadow-card backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
          : "group inline-flex w-full items-center justify-between gap-4 rounded-card border border-accent/45 bg-surface-1 px-4 py-3.5 text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent sm:w-auto sm:min-w-[18rem]"}
      >
        <span className="grid size-8 place-items-center rounded-full bg-accent text-obsidian transition-transform duration-200 group-hover:scale-105">
          <Icon name="download" size={17} />
        </span>
        <span className="flex flex-col items-start gap-0.5">
          <span className="font-mono text-micro font-semibold uppercase tracking-[0.06em]">
            {variant === "inline" ? (ar ? "ثبّت Aboalazm OS" : "GET THE OS APP") : (ar ? "ثبّت التطبيق" : "Install app")}
          </span>
          <span className="text-[0.65rem] leading-none text-text-tertiary">
            {variant === "inline" ? (ar ? "تجربة كاملة من شاشتك الرئيسية" : "A full-screen experience on your device") : (ar ? "أضِفه لشاشتك الرئيسية" : "Add to your home screen")}
          </span>
        </span>
      </button>
    </div>
  );
}
