import {
  BOOKABLE_PLANS,
  getBookablePlan,
  STORE_72H_OFFER,
  type BookablePlan,
  type PlanId,
} from "./offers";
import {
  convertUsdAmount,
  CURRENCIES,
  resolveFxState,
  type CurrencyCode,
  type FxEnvInput,
} from "./fx";
import { whatsappPrefillHref } from "./contact-details";

export type PaymentMode = "deposit" | "full";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function isValidBookingReference(ref?: string | null): ref is string {
  if (!ref) return false;
  return /^AZM-\d{6}-[A-Z0-9]{4}$/.test(ref.trim());
}

export function generateBookingReference(now: Date = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    const idx = Math.floor(Math.random() * REF_ALPHABET.length);
    suffix += REF_ALPHABET[idx] ?? "X";
  }
  return `AZM-${yy}${mm}${dd}-${suffix}`;
}

export function normalizeCurrency(raw?: string | null): CurrencyCode {
  const upper = (raw ?? "").trim().toUpperCase();
  if ((CURRENCIES as readonly string[]).includes(upper)) {
    return upper as CurrencyCode;
  }
  return "USD";
}

export function normalizePaymentMode(raw?: string | null): PaymentMode {
  return (raw ?? "").trim().toLowerCase() === "full" ? "full" : "deposit";
}

export interface BookingQuote {
  plan: BookablePlan;
  includeLogoAddon: boolean;
  requestedCurrency: CurrencyCode;
  effectiveCurrency: CurrencyCode;
  fxConfirmedOnWhatsApp: boolean;
  fxValidUntil: string | null;
  mode: PaymentMode;
  totalUsd: number;
  depositUsd: number;
  fullDiscountedUsd: number;
  dueNowUsd: number;
  totalConverted: { amount: number; formatted: string };
  depositConverted: { amount: number; formatted: string };
  fullDiscountedConverted: { amount: number; formatted: string };
  dueNowConverted: { amount: number; formatted: string; copyValue: string };
  reference: string;
  whatsappHref: { en: string; ar: string };
}

export function computeBookingQuote(options: {
  planId?: string | null;
  cur?: string | null;
  mode?: string | null;
  addonLogo?: boolean;
  ref?: string | null;
  now?: Date;
  fxEnv?: FxEnvInput;
}): BookingQuote {
  const plan = getBookablePlan(options.planId);
  const includeLogoAddon = Boolean(
    plan.supportsLogoAddon && options.addonLogo,
  );
  const requestedCurrency = normalizeCurrency(options.cur);
  const mode = normalizePaymentMode(options.mode);
  const reference = isValidBookingReference(options.ref)
    ? options.ref.trim()
    : generateBookingReference(options.now);

  const fxState = resolveFxState(options.fxEnv);

  const baseUsd = plan.startingUsd;
  const addonUsd = includeLogoAddon ? STORE_72H_OFFER.logoAddonUsd : 0;
  const totalUsd = baseUsd + addonUsd;

  // 50% kickoff deposit across all plans; -10% when paying 100% upfront.
  const depositUsd = Number((totalUsd * (plan.depositPercent / 100)).toFixed(2));
  const fullDiscountedUsd = Math.round(totalUsd * 0.9);
  const dueNowUsd = mode === "full" ? fullDiscountedUsd : depositUsd;

  const totalConv = convertUsdAmount(totalUsd, requestedCurrency, options.fxEnv);
  const depositConv = convertUsdAmount(depositUsd, requestedCurrency, options.fxEnv);
  const fullConv = convertUsdAmount(
    fullDiscountedUsd,
    requestedCurrency,
    options.fxEnv,
  );
  const dueNowConv = mode === "full" ? fullConv : depositConv;

  const effectiveCurrency = dueNowConv.currency;
  const fxConfirmedOnWhatsApp = dueNowConv.confirmedOnWhatsApp;

  const planTitleEn = includeLogoAddon
    ? `${plan.name[0]} + Quick Logo Add-on`
    : plan.name[0];
  const planTitleAr = includeLogoAddon
    ? `${plan.name[1]} + إضافة تصميم شعار سريع`
    : plan.name[1];

  const modeLabelEn =
    mode === "full"
      ? "Pay in full (-10% upfront discount)"
      : `50% kickoff deposit (schedule: ${plan.paymentSchedule})`;
  const modeLabelAr =
    mode === "full"
      ? "دفع المبلغ كاملًا مقدّمًا (خصم 10%)"
      : `عربون البدء 50% (جدول الدفعات: ${plan.paymentSchedule})`;

  const currencyNoteEn =
    fxConfirmedOnWhatsApp && requestedCurrency !== "USD"
      ? `${dueNowConv.formatted} (requested ${requestedCurrency} — please confirm today's ${requestedCurrency} rate)`
      : dueNowConv.formatted;

  const currencyNoteAr =
    fxConfirmedOnWhatsApp && requestedCurrency !== "USD"
      ? `${dueNowConv.formatted} (العملة المطلوبة ${requestedCurrency} — يرجى تأكيد المقابل بالـ ${requestedCurrency})`
      : dueNowConv.formatted;

  const waMessageEn = [
    `Hi Mustafa, I'm ready to book: ${planTitleEn}.`,
    `Option: ${modeLabelEn}`,
    `Amount: ${currencyNoteEn}`,
    `Currency: ${requestedCurrency}`,
    `Reference: ${reference}`,
    `Transaction ID: [paste here]`,
    `(Attaching receipt screenshot)`,
  ].join("\n");

  const waMessageAr = [
    `أهلًا مصطفى، أودّ حجز: ${planTitleAr}.`,
    `نظام الدفع: ${modeLabelAr}`,
    `المبلغ: ${currencyNoteAr}`,
    `العملة: ${requestedCurrency}`,
    `رقم المرجع: ${reference}`,
    `رقم العملية (Transaction ID): [اكتب الرقم هنا]`,
    `(مرفق لقطة شاشة لإيصال التحويل)`,
  ].join("\n");

  return {
    plan,
    includeLogoAddon,
    requestedCurrency,
    effectiveCurrency,
    fxConfirmedOnWhatsApp,
    fxValidUntil: fxState.validUntilDateLabel,
    mode,
    totalUsd,
    depositUsd,
    fullDiscountedUsd,
    dueNowUsd,
    totalConverted: {
      amount: totalConv.amount,
      formatted: totalConv.formatted,
    },
    depositConverted: {
      amount: depositConv.amount,
      formatted: depositConv.formatted,
    },
    fullDiscountedConverted: {
      amount: fullConv.amount,
      formatted: fullConv.formatted,
    },
    dueNowConverted: {
      amount: dueNowConv.amount,
      formatted: dueNowConv.formatted,
      copyValue: String(dueNowConv.amount),
    },
    reference,
    whatsappHref: {
      en: whatsappPrefillHref(waMessageEn),
      ar: whatsappPrefillHref(waMessageAr),
    },
  };
}

export { BOOKABLE_PLANS, type PlanId };
