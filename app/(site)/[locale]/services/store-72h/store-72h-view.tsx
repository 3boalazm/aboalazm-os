"use client";

import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { FxSubline } from "@/components/ui/fx-price";
import { PanelCard } from "@/components/ui/PanelCard";
import { SectionHead } from "@/features/offers/offer-blocks";
import { SocialProof } from "@/components/shared/social-proof";
import {
  bookHref,
  DEPOSIT_CTA_LABEL,
  STORE_72H_OFFER,
  WHATSAPP_ASK_CTA_LABEL,
} from "@/lib/offers";
import {
  BOOKING_CTA_LABEL,
  BOOKING_URL,
  RESPONSE_PROMISE,
  whatsappPrefillHref,
} from "@/lib/contact-details";

export function Store72hView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const offer = STORE_72H_OFFER;

  const depositHref = bookHref("store-72h");
  const depositWithLogoHref = bookHref("store-72h", undefined, {
    addon: "logo",
  });
  const askWhatsappHref = whatsappPrefillHref(
    ar
      ? "أهلاً مصطفى، أود الاستفسار عن باقة المتجر أو الكتالوج الإلكتروني ثنائي اللغة (جاهز خلال 72 ساعة — يبدأ من 197$)."
      : "Hi Mustafa, I have a question about the 72-Hour Bilingual Online Store / Catalogue (From $197).",
  );

  return (
    <main className="container-content flex flex-col gap-12 pb-16 pt-6">
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-5 border-b border-border-default pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
          <Link
            href="/services"
            className="transition-colors hover:text-text-primary"
          >
            {ar ? "→ كل الخدمات" : "← All Services"}
          </Link>
          <span>
            {ar
              ? "خدمة محددة النطاق · مصر والخليج"
              : "FIXED-SCOPE SERVICE · EGYPT & GULF"}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="creative" size="sm">
                {ar ? "جاهز خلال 72 ساعة" : "READY IN 72 HOURS"}
              </Badge>
              <Badge tone="neutral" size="sm">
                {ar ? "عربي RTL + إنجليزي LTR" : "ARABIC RTL + ENGLISH LTR"}
              </Badge>
            </div>

            <h1 className="font-display text-title tracking-tight text-text-primary">
              {ar ? offer.headline[1] : offer.headline[0]}
            </h1>

            <p className="max-w-[64ch] text-body text-text-secondary">
              {ar ? offer.subheadline[1] : offer.subheadline[0]}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <Link
                href={depositHref}
                className={buttonVariants({
                  variant: "primary",
                  className:
                    "inline-flex items-center gap-1.5 px-4 py-2 font-mono text-label tracking-[0.06em]",
                })}
              >
                {ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]} →
              </Link>
              <a
                href={askWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "inline-flex items-center gap-1.5 border border-border-default px-4 py-2 font-mono text-label tracking-[0.06em] text-text-secondary hover:text-text-primary",
                })}
              >
                {ar ? WHATSAPP_ASK_CTA_LABEL[1] : WHATSAPP_ASK_CTA_LABEL[0]} ↗
              </a>
              {BOOKING_URL ? (
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-booking-click="true"
                  className="inline-flex min-h-[38px] items-center px-2 font-mono text-micro text-accent underline underline-offset-4"
                >
                  {ar ? BOOKING_CTA_LABEL[1] : BOOKING_CTA_LABEL[0]} ↗
                </a>
              ) : null}
            </div>

            <p className="font-mono text-micro text-text-tertiary">
              {ar ? RESPONSE_PROMISE.ar : RESPONSE_PROMISE.en}
            </p>
          </div>

          {/* Pricing & Clock Rule Card */}
          <PanelCard
            emphasis="accent"
            className="flex flex-col gap-4 rounded-panel p-4 sm:p-5 lg:col-span-5"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border-default pb-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-micro uppercase tracking-[0.14em] text-accent">
                  {ar ? "الاستثمار ونظام الدفع" : "INVESTMENT & SCHEDULE"}
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    dir="ltr"
                    className="font-display text-title font-semibold text-text-primary"
                  >
                    {offer.price}
                  </span>
                  <span className="font-mono text-micro text-text-tertiary">
                    USD
                  </span>
                </div>
                <FxSubline usdOrPrice={offer.startingUsd} lang={lang} />
              </div>

              <span className="rounded-pill border border-accent/40 bg-accent/15 px-3 py-1 font-mono text-micro font-semibold text-accent">
                {ar ? "عربون 50%" : "50% Deposit"}
              </span>
            </div>

            <div className="rounded-card border border-border-default bg-surface-2 p-3 text-body-sm text-text-primary">
              <strong className="block font-mono text-micro uppercase tracking-[0.12em] text-accent">
                {ar ? "متى تبدأ مهلة الـ 72 ساعة؟" : "WHEN THE 72-HOUR CLOCK STARTS"}
              </strong>
              <p className="mt-1 text-body-sm text-text-secondary">
                {ar ? offer.clockRule[1] : offer.clockRule[0]}
              </p>
            </div>

            {/* Optional Quick Logo Add-on */}
            <div className="flex flex-col gap-1.5 rounded-card border border-border-default bg-surface-1 p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-body-sm font-semibold text-text-primary">
                  {ar
                    ? "إضافة اختيارية: تصميم شعار سريع"
                    : "Optional add-on: Quick Logo"}
                </span>
                <span
                  dir="ltr"
                  className="font-mono text-body-sm font-semibold text-accent"
                >
                  +{offer.logoAddonPrice}
                </span>
              </div>
              <FxSubline
                usdOrPrice={offer.logoAddonUsd}
                lang={lang}
                showValidity={false}
                compact
              />
              <Link
                href={depositWithLogoHref}
                className="mt-0.5 inline-flex w-fit items-center font-mono text-micro text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                {ar
                  ? "احجز المتجر + الشعار السريع بعربون ←"
                  : "Book Store + Quick Logo with a deposit →"}
              </Link>
            </div>

            <Link
              href={depositHref}
              className={buttonVariants({
                variant: "primary",
                className:
                  "w-full justify-center px-4 py-2 font-mono text-label tracking-[0.06em]",
              })}
            >
              {ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]} →
            </Link>
          </PanelCard>
        </div>
      </header>

      {/* ─── WHY THIS BEATS CHEAP GIGS ──────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SectionHead
          label={["01 / WHY THIS FORMAT", "01 / القيمة الفعلية"]}
          title={["What cheap template gigs", "ما لا تقدمه القوالب الجاهزة"]}
          italic={["leave out.", "الرخيصة."]}
        />

        <div className="grid gap-3 md:grid-cols-3">
          {offer.whyDifferent.map((item, idx) => (
            <PanelCard key={idx} className="flex flex-col gap-2 rounded-card p-4">
              <span className="font-mono text-micro text-accent">
                0{idx + 1}
              </span>
              <h2 className="font-display text-subtitle text-text-primary">
                {ar ? item.title[1] : item.title[0]}
              </h2>
              <p className="text-body-sm leading-relaxed text-text-secondary">
                {ar ? item.body[1] : item.body[0]}
              </p>
            </PanelCard>
          ))}
        </div>
      </section>

      {/* ─── SCOPE: INCLUDED VS NOT INCLUDED ────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SectionHead
          label={["02 / EXACT SCOPE", "02 / النطاق والمخرجات"]}
          title={["What is included —", "ما يشمله العرض بوضوح —"]}
          italic={["and what is not.", "وما لا يشمله."]}
        />

        <div className="grid gap-4 lg:grid-cols-12">
          <PanelCard className="flex flex-col gap-3 rounded-panel p-4 sm:p-5 lg:col-span-7">
            <p className="font-mono text-micro uppercase tracking-[0.14em] text-accent">
              {ar ? "المشمول في الباقة" : "INCLUDED IN THE 72-HOUR BUILD"}
            </p>
            <ul className="flex flex-col gap-2.5">
              {offer.included.map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-body-sm text-text-primary"
                >
                  <span className="mt-0.5 font-mono text-accent">✓</span>
                  <span>{ar ? line[1] : line[0]}</span>
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard className="flex flex-col justify-between gap-4 rounded-panel p-4 sm:p-5 lg:col-span-5">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
                {ar ? "غير مشمول في هذه الباقة" : "NOT INCLUDED"}
              </p>
              <ul className="flex flex-col gap-2.5">
                {offer.notIncluded.map((line, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-body-sm text-text-secondary"
                  >
                    <span className="mt-0.5 font-mono text-text-tertiary">
                      —
                    </span>
                    <span>{ar ? line[1] : line[0]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-card border border-border-default bg-surface-2 p-3 text-caption text-text-secondary">
              {ar
                ? "هل تحتاج أكثر من 30 منتجاً، أو ربط بوابة دفع إلكتروني ومخزون متكامل؟ راجع باقة المنصات المخصصة على صفحة الأسعار."
                : "Need more than ~30 products, automated payment-gateway onboarding, or ERP inventory sync? See the Custom Web Platform package on /pricing."}
            </div>
          </PanelCard>
        </div>
      </section>

      {/* ─── LIVE PROOF: 4 SHIPPED REFERENCES ───────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SectionHead
          label={["03 / LIVE SHIPPED PROOF", "03 / أعمال حية ومنشورة"]}
          title={["Four live stores and catalogues", "أربعة متاجر وكتالوجات منشورة"]}
          italic={["you can inspect right now.", "يمكنك تصفحها الآن."]}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {offer.proof.map((refItem) => (
            <a
              key={refItem.slug}
              href={refItem.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-card border border-border-default bg-surface-1 transition-colors hover:border-accent/50"
            >
              {refItem.thumbnail ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border-default bg-surface-2">
                  <Image
                    src={refItem.thumbnail}
                    alt={ar ? refItem.name[1] : refItem.name[0]}
                    fill
                    sizes="(min-width: 768px) 48vw, 96vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                /* Clean Name + Domain Card (no mock-ups) per Task 3 */
                <div className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden border-b border-border-default bg-gradient-to-br from-surface-2 via-surface-1 to-surface-2 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-pill border border-border-default bg-surface-1 px-2.5 py-0.5 font-mono text-micro text-accent">
                      {ar ? "موقع مباشر" : "LIVE DEPLOYMENT"}
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono text-micro text-text-tertiary"
                    >
                      https://{refItem.domain} ↗
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-title font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent">
                      {ar ? refItem.name[1] : refItem.name[0]}
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono text-body-sm text-text-secondary"
                    >
                      {refItem.domain}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-subtitle text-text-primary transition-colors group-hover:text-accent">
                      {ar ? refItem.name[1] : refItem.name[0]}
                    </h3>
                    <span
                      dir="ltr"
                      className="font-mono text-micro text-accent"
                    >
                      {refItem.domain} ↗
                    </span>
                  </div>
                  <p className="text-body-sm text-text-secondary">
                    {ar ? refItem.summary[1] : refItem.summary[0]}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {refItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-pill border border-border-default bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-text-tertiary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── SOCIAL PROOF (renders nothing when empty) ──────────────────── */}
      <SocialProof />

      {/* ─── BOTTOM CTA BAND ────────────────────────────────────────────── */}
      <PanelCard
        emphasis="accent"
        className="flex flex-col items-start justify-between gap-4 rounded-panel p-5 sm:p-6 md:flex-row md:items-center"
      >
        <div className="flex flex-col gap-1">
          <p className="font-mono text-micro uppercase tracking-[0.14em] text-accent">
            {ar ? "ابدأ الآن · عربون 50%" : "START TODAY · 50% DEPOSIT"}
          </p>
          <h2 className="font-display text-subtitle text-text-primary">
            {ar
              ? "جاهز لإطلاق متجرك أو كتالوجك خلال 72 ساعة؟"
              : "Ready to launch your bilingual store or catalogue in 72 hours?"}
          </h2>
          <p className="max-w-[58ch] text-body-sm text-text-secondary">
            {ar ? offer.clockRule[1] : offer.clockRule[0]}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={depositHref}
            className={buttonVariants({
              variant: "primary",
              className:
                "inline-flex items-center gap-1.5 px-4 py-2 font-mono text-label tracking-[0.06em]",
            })}
          >
            {ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]} →
          </Link>
          <a
            href={askWhatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "ghost",
              className:
                "inline-flex items-center gap-1.5 border border-border-default px-4 py-2 font-mono text-label tracking-[0.06em] text-text-secondary hover:text-text-primary",
            })}
          >
            {ar ? WHATSAPP_ASK_CTA_LABEL[1] : WHATSAPP_ASK_CTA_LABEL[0]} ↗
          </a>
        </div>
      </PanelCard>
    </main>
  );
}
