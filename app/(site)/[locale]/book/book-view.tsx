"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Badge } from "@/components/ui/Badge";
import { PanelCard } from "@/components/ui/PanelCard";
import { FxSubline } from "@/components/ui/fx-price";
import {
  BOOKABLE_PLANS,
  PAYMENT,
  STORE_72H_OFFER,
  type PlanId,
} from "@/lib/offers";
import {
  getConfiguredPaymentMethods,
  RESPONSE_PROMISE,
  WHATSAPP_DISPLAY,
  WHATSAPP_HREF,
} from "@/lib/contact-details";
import {
  computeBookingQuote,
  type PaymentMode,
} from "@/lib/booking";
import { CURRENCIES, type CurrencyCode } from "@/lib/fx";

function CopyChip({
  value,
  labelEn,
  labelAr,
}: {
  value: string;
  labelEn: string;
  labelAr: string;
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-pill border border-border-default bg-surface-2 px-3 py-1 font-mono text-micro text-text-primary transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={ar ? `${labelAr}: ${value}` : `${labelEn}: ${value}`}
    >
      <span>{copied ? (ar ? "تم النسخ ✓" : "Copied ✓") : ar ? labelAr : labelEn}</span>
    </button>
  );
}

function buildBookQuery(params: {
  plan: PlanId;
  cur: CurrencyCode;
  mode: PaymentMode;
  addonLogo: boolean;
  ref: string;
}): string {
  const search = new URLSearchParams();
  search.set("plan", params.plan);
  search.set("cur", params.cur);
  if (params.mode === "full") search.set("mode", "full");
  if (params.addonLogo) search.set("addon", "logo");
  search.set("ref", params.ref);
  return `/book?${search.toString()}`;
}

export function BookView({
  initialPlanId,
  initialCurrency,
  initialMode,
  initialAddonLogo,
  reference,
}: {
  initialPlanId?: string;
  initialCurrency?: string;
  initialMode?: string;
  initialAddonLogo?: boolean;
  reference: string;
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const router = useRouter();

  const quote = computeBookingQuote({
    planId: initialPlanId,
    cur: initialCurrency,
    mode: initialMode,
    addonLogo: initialAddonLogo,
    ref: reference,
  });

  const configuredMethods = getConfiguredPaymentMethods();
  const { plan, requestedCurrency, mode, includeLogoAddon } = quote;

  const handlePlanChange = (nextPlanId: string) => {
    const nextHref = buildBookQuery({
      plan: nextPlanId as PlanId,
      cur: requestedCurrency,
      mode,
      addonLogo: nextPlanId === "store-72h" ? includeLogoAddon : false,
      ref: quote.reference,
    });
    router.push(ar ? `/ar${nextHref}` : nextHref);
  };

  return (
    <main className="container-content flex flex-col gap-8 pb-16 pt-6">
      {/* ─── HEADER ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-3 border-b border-border-default pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
          <Link
            href="/pricing"
            className="transition-colors hover:text-text-primary"
          >
            {ar ? "→ العودة إلى الأسعار والباقات" : "← Back to Pricing & Packages"}
          </Link>
          <span dir="ltr">REF · {quote.reference}</span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-micro uppercase tracking-[0.16em] text-accent">
            {ar ? "الحجز وتأكيد البدء" : "PROJECT KICKOFF & DEPOSIT"}
          </p>
          <h1 className="font-display text-title font-semibold tracking-tight text-text-primary">
            {ar ? "احجز بعربون." : "Book with a deposit."}
          </h1>
          <p className="max-w-[65ch] text-body text-text-secondary">
            {ar
              ? "احجز موعد مشروعك في أقل من دقيقتين: اختر الباقة والعملة، أرسل دفعة البدء (50%) أو ادفع كامل المبلغ بخصم 10%، ثم أرسل لقطة شاشة للإيصال عبر واتساب."
              : "Lock your slot in under two minutes: select your plan and currency, send the 50% kickoff deposit (or pay in full with -10%), and send the receipt screenshot on WhatsApp."}
          </p>
        </div>
      </header>

      {/* ─── PLAN & CURRENCY SELECTOR + SUMMARY ─────────────────────────── */}
      <section
        aria-label={ar ? "ملخص الباقة والمبلغ" : "Plan and deposit summary"}
        className="grid gap-4 lg:grid-cols-12"
      >
        {/* Left: Controls & Plan Details */}
        <PanelCard className="flex flex-col gap-5 rounded-panel p-4 sm:p-5 lg:col-span-7">
          <form
            method="get"
            action={ar ? "/ar/book" : "/book"}
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="ref" value={quote.reference} />
            <input type="hidden" name="cur" value={requestedCurrency} />
            <input type="hidden" name="mode" value={mode} />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="book-plan-select"
                className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary"
              >
                {ar ? "الباقة أو الخدمة المختارة" : "SELECTED PLAN OR PACKAGE"}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  id="book-plan-select"
                  name="plan"
                  value={plan.id}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="min-h-[42px] w-full rounded-card border border-border-default bg-surface-2 px-3 py-2 text-body-sm text-text-primary focus:border-accent focus:outline-none"
                >
                  {BOOKABLE_PLANS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {ar
                        ? `${item.name[1]} (${item.priceDisplay})`
                        : `${item.name[0]} (${item.priceDisplay})`}
                    </option>
                  ))}
                </select>
                <noscript>
                  <button
                    type="submit"
                    className="min-h-[42px] shrink-0 rounded-pill border border-border-strong bg-surface-2 px-4 py-2 font-mono text-micro text-text-primary"
                  >
                    {ar ? "تحديث" : "Update"}
                  </button>
                </noscript>
              </div>
            </div>
          </form>

          {/* Plan Description & Specs */}
          <div className="flex flex-col gap-2.5 rounded-card border border-border-default bg-surface-2/50 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone="creative" size="sm">
                {ar ? plan.category[1] : plan.category[0]}
              </Badge>
              <span className="font-mono text-micro text-text-tertiary">
                {ar ? `جدول الدفع: ${plan.paymentSchedule}` : `Schedule: ${plan.paymentSchedule}`}
              </span>
            </div>
            <h2 className="font-display text-subtitle text-text-primary">
              {ar ? plan.name[1] : plan.name[0]}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {ar ? plan.summary[1] : plan.summary[0]}
            </p>
            <div className="flex flex-wrap items-center gap-4 border-t border-border-default pt-2.5 font-mono text-micro text-text-tertiary">
              <span>
                {ar ? "المدة المتوقعة:" : "Timeline:"}{" "}
                <strong className="text-text-primary">
                  {ar ? plan.duration[1] : plan.duration[0]}
                </strong>
              </span>
              <span>
                {ar ? "سعر الباقة:" : "Published price:"}{" "}
                <strong dir="ltr" className="text-text-primary">
                  {plan.priceDisplay}
                </strong>
              </span>
            </div>

            {plan.supportsLogoAddon ? (
              <div className="mt-1 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border-default bg-surface-1 p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-body-sm font-medium text-text-primary">
                    {ar
                      ? `إضافة اختيارية: تصميم شعار سريع (+${STORE_72H_OFFER.logoAddonPrice})`
                      : `Optional add-on: Quick Logo (+${STORE_72H_OFFER.logoAddonPrice})`}
                  </span>
                  <FxSubline
                    usdOrPrice={STORE_72H_OFFER.logoAddonUsd}
                    lang={lang}
                    showValidity={false}
                    compact
                  />
                </div>
                <Link
                  href={buildBookQuery({
                    plan: plan.id,
                    cur: requestedCurrency,
                    mode,
                    addonLogo: !includeLogoAddon,
                    ref: quote.reference,
                  })}
                  className={`inline-flex min-h-[36px] items-center rounded-pill border px-3 py-1 font-mono text-micro transition-colors ${
                    includeLogoAddon
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border-default bg-surface-2 text-text-secondary hover:border-border-strong hover:text-text-primary"
                  }`}
                >
                  {includeLogoAddon
                    ? ar
                      ? "مضاف للباقة ✓ (إزالة)"
                      : "Added ✓ (Remove)"
                    : ar
                      ? "+ أضف الشعار السريع"
                      : "+ Add Quick Logo"}
                </Link>
              </div>
            ) : null}
          </div>

          {/* Currency & Payment Option Switchers (Pure Links -> works without JS) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
                {ar ? "عملة الدفع" : "CURRENCY"}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {CURRENCIES.map((cur) => {
                  const active = requestedCurrency === cur;
                  return (
                    <Link
                      key={cur}
                      href={buildBookQuery({
                        plan: plan.id,
                        cur,
                        mode,
                        addonLogo: includeLogoAddon,
                        ref: quote.reference,
                      })}
                      className={`flex min-h-[38px] items-center justify-center rounded-card border font-mono text-body-sm font-medium transition-colors ${
                        active
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-border-default bg-surface-2 text-text-secondary hover:border-border-strong hover:text-text-primary"
                      }`}
                    >
                      {cur}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
                {ar ? "خيار السداد" : "PAYMENT OPTION"}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={buildBookQuery({
                    plan: plan.id,
                    cur: requestedCurrency,
                    mode: "deposit",
                    addonLogo: includeLogoAddon,
                    ref: quote.reference,
                  })}
                  className={`flex min-h-[38px] flex-col items-center justify-center rounded-card border px-2 py-1 text-center transition-colors ${
                    mode === "deposit"
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border-default bg-surface-2 text-text-secondary hover:border-border-strong hover:text-text-primary"
                  }`}
                >
                  <span className="font-mono text-micro font-semibold">
                    {ar ? "عربون 50%" : "50% Deposit"}
                  </span>
                </Link>
                <Link
                  href={buildBookQuery({
                    plan: plan.id,
                    cur: requestedCurrency,
                    mode: "full",
                    addonLogo: includeLogoAddon,
                    ref: quote.reference,
                  })}
                  className={`flex min-h-[38px] flex-col items-center justify-center rounded-card border px-2 py-1 text-center transition-colors ${
                    mode === "full"
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border-default bg-surface-2 text-text-secondary hover:border-border-strong hover:text-text-primary"
                  }`}
                >
                  <span className="font-mono text-micro font-semibold">
                    {ar ? "كامل (-10%)" : "Pay in full (-10%)"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Right: Amount Breakdown & Reference */}
        <PanelCard
          emphasis="accent"
          className="flex flex-col justify-between gap-4 rounded-panel p-4 sm:p-5 lg:col-span-5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border-default pb-2.5">
              <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
                {ar ? "تفاصيل المبلغ" : "AMOUNT BREAKDOWN"}
              </span>
              <span dir="ltr" className="font-mono text-micro text-accent">
                {plan.paymentSchedule}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-body-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-text-secondary">
                  {ar ? "إجمالي الباقة (يبدأ من)" : "Total starting price"}
                </span>
                <span dir="ltr" className="font-mono font-medium text-text-primary">
                  {quote.totalConverted.formatted}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-text-secondary">
                  {ar
                    ? "50% من السعر المبدئي. السعر النهائي يُؤكَّد كتابياً قبل الدفع"
                    : "50% of the starting price. Final price is confirmed in writing before payment"}
                </span>
                <span dir="ltr" className="shrink-0 font-mono text-text-primary">
                  {quote.depositConverted.formatted}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-text-secondary">
                  {ar ? "بديل الدفع الكامل (خصم 10%)" : "Pay in full alternative (-10%)"}
                </span>
                <span dir="ltr" className="font-mono text-text-primary">
                  {quote.fullDiscountedConverted.formatted}
                </span>
              </div>
            </div>

            <FxSubline usdOrPrice={quote.totalUsd} lang={lang} />

            {quote.fxConfirmedOnWhatsApp && requestedCurrency !== "USD" ? (
              <p className="rounded-card border border-border-default bg-surface-2 px-3 py-2 font-mono text-micro text-text-secondary">
                {ar
                  ? `أسعار ${requestedCurrency} تُؤكَّد عبر واتساب. المبلغ أدناه موضح بالدولار (USD) كمرجع أساسي.`
                  : `${requestedCurrency} rate is confirmed on WhatsApp. Amounts are shown in USD below as the base reference.`}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 rounded-card border border-border-strong bg-surface-1 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
                  {mode === "full"
                    ? ar
                      ? "المطلوب دفعه الآن (كامل بخصم 10%)"
                      : "AMOUNT DUE NOW (FULL · -10%)"
                    : ar
                      ? "المطلوب دفعه الآن (عربون 50%)"
                      : "AMOUNT DUE NOW (50% DEPOSIT)"}
                </span>
                <span
                  dir="ltr"
                  className="font-display text-title font-semibold text-accent"
                >
                  {quote.dueNowConverted.formatted}
                </span>
              </div>
              <CopyChip
                value={quote.dueNowConverted.copyValue}
                labelEn="Copy amount"
                labelAr="نسخ المبلغ"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-default pt-2.5">
              <div className="flex flex-col">
                <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
                  {ar ? "رقم المرجع (أضفه في ملاحظة التحويل)" : "BOOKING REFERENCE"}
                </span>
                <span
                  dir="ltr"
                  className="font-mono text-body font-semibold text-text-primary"
                >
                  {quote.reference}
                </span>
              </div>
              <CopyChip
                value={quote.reference}
                labelEn="Copy reference"
                labelAr="نسخ المرجع"
              />
            </div>
          </div>
        </PanelCard>
      </section>

      {/* ─── NUMBERED STEPS (01 -> 04) ──────────────────────────────────── */}
      <section
        aria-label={ar ? "خطوات إرسال العربون" : "Deposit steps"}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* STEP 01: Pick a method */}
        <PanelCard className="flex flex-col gap-3 rounded-panel p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-micro uppercase tracking-[0.14em] text-accent">
              {ar ? "الخطوة 01" : "STEP 01"}
            </span>
            <Badge tone="neutral" size="sm">
              {ar ? "وسيلة الدفع" : "Payment Method"}
            </Badge>
          </div>
          <h2 className="font-display text-subtitle text-text-primary">
            {ar ? "1. اختر وسيلة الدفع" : "1. Pick a payment method"}
          </h2>

          {configuredMethods.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {configuredMethods.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col gap-2 rounded-card border border-border-default bg-surface-2 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-body-sm font-semibold text-text-primary">
                      {ar ? m.title[1] : m.title[0]}
                    </span>
                    <span className="font-mono text-micro text-text-tertiary">
                      {ar ? m.badge[1] : m.badge[0]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {m.isExternalLink ? (
                      <a
                        href={m.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className="break-all font-mono text-body-sm text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                      >
                        {m.value} ↗
                      </a>
                    ) : (
                      <span
                        dir="ltr"
                        className="select-all font-mono text-body font-semibold text-text-primary"
                      >
                        {m.value}
                      </span>
                    )}
                    <CopyChip
                      value={m.value}
                      labelEn="Copy number"
                      labelAr="نسخ الرقم"
                    />
                  </div>

                  {m.holderName ? (
                    <p className="font-mono text-micro text-text-secondary">
                      {ar ? "اسم صاحب الحساب:" : "Account holder:"}{" "}
                      <strong className="text-text-primary">{m.holderName}</strong>
                    </p>
                  ) : null}

                  <p className="text-caption text-text-tertiary">
                    {ar ? m.hint[1] : m.hint[0]}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 rounded-card border border-border-default bg-surface-2 p-3.5">
              <p className="font-display text-body font-medium text-text-primary">
                {ar
                  ? "اطلب بيانات الدفع عبر واتساب"
                  : "Ask me for payment details on WhatsApp"}
              </p>
              <p className="text-body-sm text-text-secondary">
                {ar
                  ? "اضغط على الزر بالأسفل لفتح محادثة واتساب جاهزة بملخص الباقة والمبلغ ورقم المرجع، وسأرسل لك بيانات التحويل المباشرة فوراً."
                  : "Tap below to open a prefilled WhatsApp chat with your selected plan, amount, and reference — I'll send you the direct transfer details right away."}
              </p>
              <a
                href={ar ? quote.whatsappHref.ar : quote.whatsappHref.en}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] w-fit items-center gap-2 rounded-pill border border-accent/40 bg-accent/15 px-3.5 py-1.5 font-mono text-body-sm font-medium text-accent transition-colors hover:bg-accent/25"
              >
                <span>
                  {ar
                    ? "اطلب بيانات الدفع عبر واتساب ←"
                    : "Ask me for payment details on WhatsApp →"}
                </span>
              </a>
            </div>
          )}

          <p className="border-t border-border-default pt-2.5 font-mono text-micro text-text-tertiary">
            {ar ? "طرق الدفع المتاحة:" : "Accepted channels:"}{" "}
            {ar ? PAYMENT.methods[1] : PAYMENT.methods[0]}
          </p>
        </PanelCard>

        {/* STEP 02: Send the deposit with the reference */}
        <PanelCard className="flex flex-col justify-between gap-3 rounded-panel p-4 sm:p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-micro uppercase tracking-[0.14em] text-accent">
                {ar ? "الخطوة 02" : "STEP 02"}
              </span>
              <Badge tone="neutral" size="sm">
                {ar ? "التحويل والمرجع" : "Transfer & Ref"}
              </Badge>
            </div>
            <h2 className="font-display text-subtitle text-text-primary">
              {ar
                ? "2. أرسل العربون مع رقم المرجع"
                : "2. Send the deposit with your reference"}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {ar
                ? `حوّل مبلغ ${quote.dueNowConverted.formatted} وأضف رقم المرجع (${quote.reference}) في خانة ملاحظات التحويل إن توفرت.`
                : `Send ${quote.dueNowConverted.formatted} and include your reference (${quote.reference}) in the transfer notes if supported.`}
            </p>

            <div className="flex flex-wrap gap-2">
              <CopyChip
                value={quote.dueNowConverted.copyValue}
                labelEn={`Copy amount (${quote.dueNowConverted.formatted})`}
                labelAr={`نسخ المبلغ (${quote.dueNowConverted.formatted})`}
              />
              <CopyChip
                value={quote.reference}
                labelEn={`Copy ref (${quote.reference})`}
                labelAr={`نسخ المرجع (${quote.reference})`}
              />
            </div>
          </div>

          {configuredMethods.length > 0 ? (
            <div className="rounded-card border border-accent/30 bg-accent/[0.06] px-3 py-2 text-caption text-text-primary">
              <strong className="font-mono uppercase tracking-wider text-accent">
                {ar ? "تنبيه أمان:" : "Safety note:"}
              </strong>{" "}
              {ar
                ? "لا تحوّل لأي بيانات دفع غير الموضحة في هذه الصفحة."
                : "Only send to the details shown on this page."}
            </div>
          ) : (
            <div className="rounded-card border border-border-default bg-surface-2 px-3 py-2 text-caption text-text-secondary">
              {ar ? (
                <>
                  لا تحوّل إلا لبيانات الدفع التي أؤكدها لك عبر واتساب (
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="font-mono text-accent underline underline-offset-4"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                  ).
                </>
              ) : (
                <>
                  Only send to payment details I confirm to you on WhatsApp (
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="font-mono text-accent underline underline-offset-4"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                  ).
                </>
              )}
            </div>
          )}
        </PanelCard>

        {/* STEP 03: Confirm on WhatsApp */}
        <PanelCard className="flex flex-col justify-between gap-3 rounded-panel p-4 sm:p-5">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-micro uppercase tracking-[0.14em] text-accent">
                {ar ? "الخطوة 03" : "STEP 03"}
              </span>
              <Badge tone="creative" size="sm">
                {ar ? "تأكيد عبر واتساب" : "WhatsApp Confirmation"}
              </Badge>
            </div>
            <h2 className="font-display text-subtitle text-text-primary">
              {ar
                ? "3. أرسل لقطة شاشة للإيصال + رقم العملية على واتساب"
                : "3. Send the receipt screenshot + transaction ID on WhatsApp"}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {ar
                ? "الرسالة مجهزة تلقائياً باسم الباقة، المبلغ، العملة، ورقم المرجع — أرفق فقط صورة الإيصال ورقم العملية."
                : "The WhatsApp message is prefilled with your plan, amount, currency, and reference — just attach the receipt screenshot and transaction ID."}
            </p>
          </div>

          <a
            href={ar ? quote.whatsappHref.ar : quote.whatsappHref.en}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-pill bg-accent px-5 py-2.5 font-mono text-label font-medium text-obsidian transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span>
              {ar
                ? "أرسل الإيصال وتأكيد الحجز عبر واتساب ←"
                : "Send receipt & confirm on WhatsApp →"}
            </span>
          </a>
        </PanelCard>

        {/* STEP 04: Work starts when the deposit lands */}
        <PanelCard className="flex flex-col justify-between gap-3 rounded-panel p-4 sm:p-5">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-micro uppercase tracking-[0.14em] text-accent">
                {ar ? "الخطوة 04" : "STEP 04"}
              </span>
              <Badge tone="neutral" size="sm">
                {ar ? "انطلاق المشروع" : "Project Kickoff"}
              </Badge>
            </div>
            <h2 className="font-display text-subtitle text-text-primary">
              {ar
                ? "4. يبدأ العمل فور وصول العربون."
                : "4. Work starts when the deposit lands."}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {ar
                ? "بمجرد تأكيد وصول الدفعة، تصلك رسالة تأكيد مكتوبة بجدول المراحل وموعد مكالمة أو ملخص البداية."
                : "As soon as the deposit lands, you receive written confirmation with your milestone schedule and kickoff brief."}
            </p>
            <p className="font-mono text-micro text-text-tertiary">
              {ar ? RESPONSE_PROMISE.ar : RESPONSE_PROMISE.en}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-2.5">
            <Link
              href="/agreement"
              className="font-mono text-micro text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {ar
                ? "اقرأ اتفاقية سير العمل والشروط (/agreement) ←"
                : "Read the full Work-Flow Agreement (/agreement) →"}
            </Link>
          </div>
        </PanelCard>
      </section>
    </main>
  );
}
