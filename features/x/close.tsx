"use client";

/**
 * 07 · CLOSE — the last frame. Always dark: a sun rising from the floor,
 * one question, a describe-it-in-a-line brief, and the index of the pages
 * that left the home page.
 *
 * Privacy contract (lib/contact-context.ts): the visitor's sentence never
 * travels in a URL or an analytics event. Only the service id goes in the
 * query; the text is parked in sessionStorage for the contact form.
 */
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "@/components/ui/localized-link";
import { BRIEF_HANDOFF_KEY, contactHref, type ServiceId } from "@/lib/contact-context";
import { localeHref } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { Arrow, useX } from "./shared";

const CHIPS: { id: ServiceId; en: string; ar: string; ms: string }[] = [
  { id: "brand-identity", en: "Brand identity", ar: "هوية", ms: "Identiti jenama" },
  { id: "website", en: "Website / store", ar: "موقع / متجر", ms: "Laman / kedai" },
  { id: "digital-product", en: "Business system", ar: "سيستم تشغيل", ms: "Sistem perniagaan" },
  { id: "not-sure", en: "Not sure yet", ar: "لسه مش محدد", ms: "Belum pasti" },
];

const INDEX: { href: string; en: string; ar: string; ms: string }[] = [
  { href: "/services", en: "Services", ar: "الخدمات", ms: "Perkhidmatan" },
  { href: "/pricing", en: "Pricing", ar: "التسعير", ms: "Harga" },
  { href: "/process", en: "Process", ar: "المنهجية", ms: "Proses" },
  { href: "/about", en: "About", ar: "نبذة", ms: "Tentang" },
  { href: "/writing", en: "Writing", ar: "مقالات", ms: "Penulisan" },
  { href: "/contact#faq", en: "FAQ", ar: "الأسئلة الشائعة", ms: "Soalan lazim" },
];

export function Close() {
  const { lang, t } = useX();
  const router = useRouter();
  const [service, setService] = useState<ServiceId>("not-sure");
  const [text, setText] = useState("");
  const pick = (c: { en: string; ar: string; ms: string }) => (lang === "ar" ? c.ar : lang === "ms" ? c.ms : c.en);

  const go = (e: FormEvent) => {
    e.preventDefault();
    try {
      const brief = text.trim().slice(0, 600);
      if (brief) sessionStorage.setItem(BRIEF_HANDOFF_KEY, brief);
      else sessionStorage.removeItem(BRIEF_HANDOFF_KEY);
    } catch {
      /* storage unavailable — the form still opens with the service chosen */
    }
    trackEvent("cta_start_project", { surface: "x_close", service });
    router.push(localeHref(contactHref({ service, source: "/" }), lang));
  };

  return (
    <section id="start" className="x-close x-iris">
      <div aria-hidden className="x-close__sun" />
      <div className="x-wrap">
        <div className="mb-6 text-center">
          <p className="x-mono x-kicker">07 — {t("Start", "ابدأ", "Mula")}</p>
        </div>
        <h2 className="x-display x-close__title">
          {t("Have a business", "عندك بيزنس", "Ada perniagaan")} <span className="x-accent">{t("to build?", "عايز تبنيه؟", "untuk dibina?")}</span>
        </h2>

        <form onSubmit={go} className="x-brief" aria-label={t("Describe your project", "اوصف مشروعك", "Terangkan projek anda")}>
          <label htmlFor="x-brief" className="sr-only">
            {t("Describe your project in a line", "اوصف مشروعك في سطر", "Terangkan projek anda dalam satu baris")}
          </label>
          <div className="x-brief__row">
            <input
              id="x-brief"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={600}
              autoComplete="off"
              placeholder={t(
                "Describe it in a line — e.g. identity for a new clinic",
                "اوصفه في سطر — مثلًا: هوية لعيادة جديدة",
                "Terangkan dalam satu baris — cth. identiti klinik baharu",
              )}
            />
            <button type="submit" className="x-btn x-btn--solid shrink-0">
              {t("Start", "ابدأ", "Mula")}
              <Arrow />
            </button>
          </div>
          <div className="x-brief__chips">
            {CHIPS.map((c) => (
              <button key={c.id} type="button" aria-pressed={service === c.id} onClick={() => setService(c.id)}>
                {pick(c)}
              </button>
            ))}
          </div>
        </form>

        <p className="mt-4 text-center text-[14px] text-[var(--color-text-tertiary)]">
          {t("Discovery call first — free, 30 minutes. Written scope before any payment.", "مكالمة استكشاف الأول — مجانية، 30 دقيقة. نطاق مكتوب قبل أي دفعة.", "Panggilan penemuan dahulu — percuma, 30 minit. Skop bertulis sebelum bayaran.")}
        </p>

        <nav className="x-index" aria-label={t("More of the studio", "باقي الاستوديو", "Lagi tentang studio")}>
          {INDEX.map((l) => (
            <Link key={l.href} href={l.href} className="x-mono">
              {pick(l)}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
