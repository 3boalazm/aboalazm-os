/** Single source of truth for public contact destinations, response promise, booking link & payment methods. */
export const CONTACT_EMAIL = "m1aboalazm@gmail.com";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const WHATSAPP_NUMBER = "201092500454";
export const WHATSAPP_DISPLAY = "+20 109 250 0454";
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}`;

export function whatsappPrefillHref(message: string): string {
  return `${WHATSAPP_HREF}?text=${encodeURIComponent(message)}`;
}

/**
 * Single response-time promise string used across /contact, metadata, OG cards, and forms (Task 5).
 */
export const RESPONSE_PROMISE = {
  en: "Same-day reply on working days (Sun-Thu, Cairo time). WhatsApp is fastest.",
  ar: "رد في نفس اليوم في أيام العمل (الأحد–الخميس بتوقيت القاهرة). واتساب أسرع وسيلة.",
  ms: "Balas pada hari yang sama pada hari bekerja (Ahad–Khamis, waktu Kaherah). WhatsApp paling pantas.",
} as const;

export const RESPONSE_PROMISE_BI: readonly [string, string] = [
  RESPONSE_PROMISE.en,
  RESPONSE_PROMISE.ar,
] as const;

export const RESPONSE_PROMISE_MS = RESPONSE_PROMISE.ms;

/**
 * Optional Cal.com / Google appointment URL (Task 5).
 * Hidden across the UI when unset.
 */
export function getBookingUrl(): string {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "";
  // Owner-set, but it becomes the href of every booking link: https only (a bare
  // "cal.com/x" would turn into a relative link, "javascript:" into a script).
  return /^https:\/\//i.test(url) ? url : "";
}

export const BOOKING_URL = getBookingUrl();

export const BOOKING_CTA_LABEL: readonly [string, string] = [
  "Book a free 30-min call",
  "احجز مكالمة مجانية 30 دقيقة",
] as const;

export interface ConfiguredPaymentMethod {
  id: "vodafone-cash" | "instapay" | "paypal" | "paymob";
  title: readonly [string, string];
  badge: readonly [string, string];
  value: string;
  holderName?: string;
  isExternalLink: boolean;
  hint: readonly [string, string];
}

/**
 * Reads payment-method environment variables for /book (Task 1).
 * Never invents payment details: returns only methods whose env var is set.
 */
export function getConfiguredPaymentMethods(envOverride?: Record<string, string | undefined>): ConfiguredPaymentMethod[] {
  // Literal `process.env.NEXT_PUBLIC_*` reads: Next inlines only those into the
  // client bundle, and /book calls this from a "use client" component. Reading
  // through an alias (`const env = process.env`) left the browser with an empty
  // env, so SSR drew the payment cards and hydration then replaced them with the
  // WhatsApp fallback — exactly when the owner had configured them.
  const env: Record<string, string | undefined> = envOverride ?? {
    NEXT_PUBLIC_WALLET_HOLDER_NAME: process.env.NEXT_PUBLIC_WALLET_HOLDER_NAME,
    NEXT_PUBLIC_VODAFONE_CASH_NUMBER: process.env.NEXT_PUBLIC_VODAFONE_CASH_NUMBER,
    NEXT_PUBLIC_INSTAPAY_ADDRESS: process.env.NEXT_PUBLIC_INSTAPAY_ADDRESS,
    NEXT_PUBLIC_PAYPAL_ME: process.env.NEXT_PUBLIC_PAYPAL_ME,
    NEXT_PUBLIC_PAYMOB_LINK: process.env.NEXT_PUBLIC_PAYMOB_LINK,
  };
  const holderName = env.NEXT_PUBLIC_WALLET_HOLDER_NAME?.trim() || undefined;
  const vodafone = env.NEXT_PUBLIC_VODAFONE_CASH_NUMBER?.trim() || "";
  const instapay = env.NEXT_PUBLIC_INSTAPAY_ADDRESS?.trim() || "";
  const paypal = env.NEXT_PUBLIC_PAYPAL_ME?.trim() || "";
  const paymob = env.NEXT_PUBLIC_PAYMOB_LINK?.trim() || "";

  const methods: ConfiguredPaymentMethod[] = [];

  if (vodafone) {
    methods.push({
      id: "vodafone-cash",
      title: ["Vodafone Cash", "فودافون كاش"],
      badge: ["Egypt · EGP", "مصر · EGP"],
      value: vodafone,
      ...(holderName ? { holderName } : {}),
      isExternalLink: false,
      hint: [
        "Transfer to this wallet number and save the confirmation screenshot.",
        "حوّل إلى رقم المحفظة الموضح واحتفظ بلقطة شاشة لتأكيد العملية.",
      ],
    });
  }

  if (instapay) {
    methods.push({
      id: "instapay",
      title: ["InstaPay (IPN)", "إنستاباي (InstaPay)"],
      badge: ["Instant · EGP", "تحويل لحظي · EGP"],
      value: instapay,
      ...(holderName ? { holderName } : {}),
      isExternalLink: false,
      hint: [
        "Send to this InstaPay address, include the booking reference in notes, and screenshot the receipt.",
        "أرسل إلى عنوان إنستاباي الموضح مع كتابة رقم المرجع في الملاحظات والتقاط صورة للإيصال.",
      ],
    });
  }

  if (paypal) {
    methods.push({
      id: "paypal",
      title: ["PayPal", "باي بال (PayPal)"],
      badge: ["International · USD", "دولي · USD"],
      value: paypal,
      ...(holderName ? { holderName } : {}),
      isExternalLink: /^https:\/\//i.test(paypal),
      hint: [
        "Send in USD with your booking reference in the payment note.",
        "أرسل بالدولار (USD) مع إضافة رقم المرجع في ملاحظة الدفع.",
      ],
    });
  }

  if (paymob) {
    methods.push({
      id: "paymob",
      title: ["Card / Wallet via Paymob", "بطاقة بنكية / محفظة عبر Paymob"],
      badge: ["Card · EGP / SAR / USD", "بطاقة · EGP / SAR / USD"],
      value: paymob,
      ...(holderName ? { holderName } : {}),
      isExternalLink: /^https:\/\//i.test(paymob),
      hint: [
        "Pay via the secure Paymob checkout link and share the transaction ID on WhatsApp.",
        "ادفع عبر رابط Paymob الآمن وشارك رقم العملية عبر واتساب.",
      ],
    });
  }

  return methods;
}
