"use client";

/**
 * 05 · PROOF — one bento instead of three bands.
 *
 * Numbers (only the documented ones: practice since 2017, 20+ clients and
 * organizations, five years of identity stewardship at Nile Pharma Food),
 * the founder-led studio model (STUDIO_MODEL, shared with /about), and the
 * three authored languages, each set in its own face.
 */
import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "@/components/ui/localized-link";
import { STUDIO_MODEL } from "@/features/offers/disciplines";
import { LOCALES, localeHref, type Locale } from "@/lib/locale";
import { Chapter, useX } from "./shared";

/* Each specimen is pinned to its own face, independent of page direction. */
const SCRIPTS: { locale: Locale; native: string; font: string; reach: [string, string, string] }[] = [
  { locale: "en", native: "English", font: '"GC EPICPRO", Georgia, serif', reach: ["International clients & hiring teams", "العملاء الدوليون وفرق التوظيف", "Klien antarabangsa & pasukan pengambilan"] },
  { locale: "ar", native: "العربية", font: '"Thmanyah Serif Display", "IBM Plex Sans Arabic", sans-serif', reach: ["Egypt, the Gulf, Arabic-first brands", "مصر والخليج والبراندات العربية أولًا", "Mesir, Teluk, jenama Arab"] },
  { locale: "ms", native: "Bahasa Melayu", font: '"Montserrat", system-ui, sans-serif', reach: ["Malaysia — where the studio is heading", "ماليزيا — السوق اللي الاستوديو رايحله", "Malaysia — hala tuju studio"] },
];

const span = (n: number) => ({ "--span": n }) as CSSProperties;

export function Proof() {
  const { lang, ar, t } = useX();
  const model = ar ? STUDIO_MODEL.ar : STUDIO_MODEL.en;
  const k = lang === "ar" ? 1 : lang === "ms" ? 2 : 0;

  return (
    <section id="studio" className="x-room ground-base">
      <Chapter
        n="05"
        kicker={t("Proof & studio", "الدليل والاستوديو", "Bukti & studio")}
        title={
          <>
            {t("Who you are", "إنت بتشتغل", "Siapa yang")} <span className="x-accent">{t("buying.", "مع مين.", "anda pilih.")}</span>
          </>
        }
        lead={model.lead}
      />

      <div className="x-wrap">
        <div className="x-bento">
          <div className="x-tile x-tile--orange x-tile--half x-rise max-lg:order-[-2]" style={span(4)}>
            <p className="x-mono">{t("Practice", "الممارسة", "Amalan")}</p>
            <div>
              <p className="x-big">9<sup>+</sup></p>
              <p className="x-tile__label">{t("years of professional practice", "سنين ممارسة مهنية", "tahun amalan profesional")}</p>
              <p className="x-tile__text">{t("Since July 2017.", "من يوليو 2017.", "Sejak Julai 2017.")}</p>
            </div>
          </div>

          <div className="x-tile x-tile--image x-rise" style={span(4)} data-rows="2">
            <Image src="/images/generated/creative-chrome-figure.jpg" alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" />
            <div className="x-tile__in">
              <p className="x-mono">{model.label}</p>
              <p className="x-display" style={{ fontSize: "clamp(1.9rem, 2.8vw, 2.8rem)", lineHeight: ar ? 1.3 : 0.95 }}>
                {model.title}
              </p>
              <p className="x-tile__text">
                <strong className="text-[var(--color-text-primary)]">{model.points[0][0]} — </strong>
                {model.points[0][1]}
              </p>
            </div>
          </div>

          {/* Phone: pulled up beside the orange tile so the two halves pair. */}
          <div className="x-tile x-tile--half x-rise max-lg:order-[-1]" style={span(4)}>
            <p className="x-mono x-kicker">{t("Clients", "العملاء", "Klien")}</p>
            <div>
              <p className="x-big">20<sup>+</sup></p>
              <p className="x-tile__label">{t("clients & organizations", "عميل ومؤسسة", "klien & organisasi")}</p>
              <p className="x-tile__text">{t("Pharma, food, education, government and more.", "أدوية وغذاء وتعليم وحكومة وغيرها.", "Farmasi, makanan, pendidikan, kerajaan dan lain-lain.")}</p>
            </div>
          </div>

          <div className="x-tile x-tile--glass x-rise" style={span(4)}>
            <p className="x-mono x-kicker">Nile Pharma Food · 2020–25</p>
            <div>
              <p className="x-big" style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}>
                5{t("Y", " سنين", "T")}
              </p>
              <p className="x-tile__label">{t("of identity stewardship", "إدارة هوية متواصلة", "pengurusan identiti")}</p>
              <p className="x-tile__text">{t("Rebrand, packaging and campaign systems, kept consistent for five years.", "إعادة هوية وتغليف وأنظمة حملات، متسقة على مدار خمس سنين.", "Penjenamaan semula, pembungkusan dan sistem kempen, konsisten selama lima tahun.")}</p>
            </div>
          </div>

          <div className="x-tile x-rise" style={span(4)}>
            <p className="x-mono x-kicker">02 — {model.points[1][0]}</p>
            <p className="x-tile__text">{model.points[1][1]}</p>
            <p className="x-mono text-[var(--color-text-tertiary)]">{model.points[2][0]}</p>
          </div>

          {/* Three scripts, one system — each a real link to that locale. */}
          <div className="x-tile x-rise" style={span(8)}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="x-mono x-kicker">{t(`System languages · ${LOCALES.length} installed`, `لغات النظام · ${LOCALES.length} مثبتة`, `Bahasa sistem · ${LOCALES.length} dipasang`)}</p>
              <p className="x-mono text-[var(--color-text-tertiary)]">{t("Same page, same URL", "نفس الصفحة ونفس العنوان", "Halaman sama, URL sama")}</p>
            </div>
            <div className="x-scripts">
              {SCRIPTS.map((s) => (
                <Link
                  key={s.locale}
                  href={localeHref("/", s.locale)}
                  hrefLang={s.locale}
                  lang={s.locale}
                  aria-current={s.locale === lang ? "true" : undefined}
                  className="x-script"
                >
                  <span className="x-mono text-[var(--color-text-tertiary)]">
                    {s.locale.toUpperCase()} · {s.locale === "ar" ? "RTL" : "LTR"}
                  </span>
                  <span className="x-script__word" dir={s.locale === "ar" ? "rtl" : "ltr"} style={{ fontFamily: s.font, letterSpacing: s.locale === "ar" ? 0 : "-0.02em" }}>
                    {s.native}
                  </span>
                  <span className="text-[13px] leading-snug text-[var(--color-text-secondary)]">{s.reach[k]}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="x-tile x-tile--glass x-rise" style={span(4)}>
            <p className="x-mono x-kicker">{model.points[3][0]}</p>
            <p className="x-tile__text">{model.points[3][1]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
