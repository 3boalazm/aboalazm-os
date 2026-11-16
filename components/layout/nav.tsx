"use client";

/**
 * HEADER + MENU — new site language (2026-11-16), written from zero.
 *
 *  · A bare bar: the orb + wordmark on one side; language, theme, one CTA
 *    and a MENU button on the other. It hides while you scroll down and
 *    comes back the moment you scroll up.
 *  · Over the dark portal of the home page it pins light text; anywhere
 *    else it follows the theme and turns solid once you scroll.
 *  · MENU opens a full-screen dark room with the destinations at poster
 *    scale, every language named in its own script, and the reach links.
 *
 * The only CTA opens a conversation (/contact) — never the deposit page.
 */
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "@/components/ui/localized-link";
import { useLang, type Lang } from "@/components/providers/lang-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { localeHref, type Locale } from "@/lib/locale";
import { CONTACT_EMAIL_HREF } from "@/lib/contact-details";
import { SkipLink } from "./skip-link";

const LINKS: { href: string; en: string; ar: string; ms: string }[] = [
  { href: "/work", en: "Work", ar: "الأعمال", ms: "Kerja" },
  { href: "/services", en: "Services", ar: "الخدمات", ms: "Perkhidmatan" },
  { href: "/pricing", en: "Pricing", ar: "الأسعار", ms: "Harga" },
  { href: "/process", en: "Process", ar: "المنهج", ms: "Proses" },
  { href: "/writing", en: "Writing", ar: "مقالات", ms: "Penulisan" },
  { href: "/about", en: "About", ar: "عن الاستوديو", ms: "Tentang" },
];

const MORE: { href: string; en: string; ar: string; ms: string }[] = [
  { href: "/reels", en: "Reels", ar: "ريلز", ms: "Reel" },
  { href: "/developer", en: "Maker", ar: "المطوّر", ms: "Pembangun" },
  { href: "/for-hiring", en: "For hiring", ar: "للتوظيف", ms: "Untuk pengambilan" },
  { href: "/labs", en: "Labs", ar: "المختبر", ms: "Makmal" },
  { href: "/books", en: "Library", ar: "المكتبة", ms: "Perpustakaan" },
  { href: "/portfolio", en: "Portfolio PDF", ar: "ملف الأعمال PDF", ms: "Portfolio PDF" },
];

/* Each language named in its own script, so a visitor recognises theirs. */
const NAV_LANGUAGES: readonly { locale: Locale; name: string; latin: string }[] = [
  { locale: "en", name: "English", latin: "EN" },
  { locale: "ar", name: "العربية", latin: "AR" },
  { locale: "ms", name: "Bahasa Melayu", latin: "MS" },
];

const label = (l: { en: string; ar: string; ms: string }, lang: Lang) => (lang === "ar" ? l.ar : lang === "ms" ? l.ms : l.en);
const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export function Nav() {
  const rawPath = usePathname() ?? "/";
  const pathname = rawPath.replace(/^\/(?:ar|en|ms)(?=\/|$)/, "") || "/";
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [langMenu, setLangMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [overPortal, setOverPortal] = useState(pathname === "/");
  const langRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const t = (en: string, ar: string, ms?: string) => (lang === "ar" ? ar : lang === "ms" ? (ms ?? en) : en);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const portalEnd = pathname === "/" ? window.innerHeight * 1.45 : 0;
      setOverPortal(pathname === "/" && y < portalEnd);
      setSolid(y > 40 && !(pathname === "/" && y < portalEnd));
      setHidden(y > 160 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
    setLangMenu(false);
  }, [pathname]);

  /* The full-screen menu owns the page while open. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("smooth-scroll:stop"));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.dispatchEvent(new Event("smooth-scroll:start"));
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!langMenu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLangMenu(false);
    const onDown = (e: PointerEvent) => !langRef.current?.contains(e.target as Node) && setLangMenu(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [langMenu]);

  const switchTo = (locale: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
    setLangMenu(false);
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setLang(locale);
  };

  return (
    <>
      <SkipLink />
      <header
        className="x-head"
        data-solid={solid && !open}
        data-hidden={hidden && !open && !langMenu}
        data-over={open || overPortal ? "dark" : "page"}
      >
        <Link href="/" className="x-brand" aria-label={t("Aboalazm OS — home", "Aboalazm OS — الرئيسية", "Aboalazm OS — utama")}>
          <span className="x-brand__orb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/work/icon.png" alt="" width={40} height={40} className="h-full w-full object-cover" />
          </span>
          <span className="x-brand__word max-[380px]:hidden" aria-hidden>
            ABOAL<span style={{ color: "#FF6B47" }}>A</span>ZM
          </span>
        </Link>

        <div className="x-head__right">
          <div className="relative" ref={langRef}>
            <button
              type="button"
              className="x-ctl x-mono"
              aria-label={t("Change language", "تغيير اللغة", "Tukar bahasa")}
              aria-expanded={langMenu}
              aria-controls={langMenu ? "x-lang" : undefined}
              onClick={() => setLangMenu((v) => !v)}
            >
              {lang === "ar" ? "AR" : lang === "ms" ? "MS" : "EN"}
            </button>
            <AnimatePresence>
              {langMenu ? (
                <motion.div
                  id="x-lang"
                  role="group"
                  aria-label={t("System languages", "لغات النظام", "Bahasa sistem")}
                  className="x-langmenu"
                  initial={reduce ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {NAV_LANGUAGES.map((l) => (
                    <Link
                      key={l.locale}
                      href={localeHref(pathname, l.locale)}
                      hrefLang={l.locale}
                      lang={l.locale}
                      aria-current={l.locale === lang ? "true" : undefined}
                      onClick={switchTo(l.locale)}
                    >
                      <span>{l.name}</span>
                      <span className="x-mono opacity-60">{l.latin}</span>
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="x-ctl x-head__theme"
            onClick={toggle}
            aria-label={theme === "dark" ? t("Switch to light mode", "التبديل إلى الوضع الفاتح", "Tukar ke mod cerah") : t("Switch to dark mode", "التبديل إلى الوضع الداكن", "Tukar ke mod gelap")}
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
              </svg>
            )}
          </button>

          <Link href="/contact" className="x-btn x-btn--solid x-head__cta" style={{ height: "2.75rem" }}>
            {t("Book a call", "احجز مكالمة", "Tempah panggilan")}
          </Link>

          <button
            ref={menuBtn}
            type="button"
            className="x-ctl x-mono"
            aria-expanded={open}
            aria-controls="x-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="x-burger" data-open={open} aria-hidden>
              <i />
              <i />
            </span>
            <span>{open ? t("Close", "إغلاق", "Tutup") : t("Menu", "القائمة", "Menu")}</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="x-menu"
            aria-label={t("Site menu", "قائمة الموقع", "Menu laman")}
            className="x-menu"
            initial={reduce ? false : { clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)", transition: { duration: 0.45 } }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          >
            <div aria-hidden className="x-menu__glow" />
            <ul className="x-menu__links">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                >
                  <Link href={l.href} className="x-menu__link" aria-current={isActive(pathname, l.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                    <span className="x-mono opacity-50">{String(i + 1).padStart(2, "0")}</span>
                    <span>{label(l, lang)}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="x-menu__side">
              <div className="grid gap-3">
                <p className="x-mono x-kicker">{t("More", "المزيد", "Lagi")}</p>
                <div className="x-menu__more">
                  {MORE.map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                      {label(l, lang)}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <p className="x-mono x-kicker">{t("System languages", "لغات النظام", "Bahasa sistem")}</p>
                <div className="x-menu__more">
                  {NAV_LANGUAGES.map((l) => (
                    <Link
                      key={l.locale}
                      href={localeHref(pathname, l.locale)}
                      hrefLang={l.locale}
                      lang={l.locale}
                      aria-current={l.locale === lang ? "true" : undefined}
                      onClick={() => setOpen(false)}
                      style={l.locale === lang ? { borderColor: "#FF6B47", color: "#FF6B47" } : undefined}
                    >
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <p className="x-mono x-kicker">{t("Reach", "تواصل", "Hubungi")}</p>
                <div className="x-menu__more">
                  <a href={CONTACT_EMAIL_HREF}>Email</a>
                  <a href="https://wa.me/201092500454" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  <a href="https://www.linkedin.com/in/aboalazm" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://www.behance.net/aboalazm" target="_blank" rel="noopener noreferrer">Behance</a>
                </div>
              </div>

              <Link href="/contact" className="x-btn x-btn--solid w-fit" onClick={() => setOpen(false)}>
                {t("Book a discovery call", "احجز مكالمة استكشافية", "Tempah panggilan penemuan")}
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
