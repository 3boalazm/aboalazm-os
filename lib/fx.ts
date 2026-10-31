/**
 * FX HELPER — Single source of truth for EGP and SAR conversions beside USD.
 *
 * Rules:
 * - NEXT_PUBLIC_EGP_PER_USD is supplied by the owner (never invented).
 * - SAR uses the official USD peg (1 USD = 3.75 SAR).
 * - NEXT_PUBLIC_FX_VALID_UNTIL is an ISO date (e.g. "2026-11-07").
 * - EGP rounds to the nearest 50; SAR rounds to the nearest 5.
 * - When the rate or validity date is missing, malformed, or expired,
 *   every price automatically falls back to "EGP/SAR confirmed on WhatsApp".
 */

export type CurrencyCode = "USD" | "EGP" | "SAR";
export const CURRENCIES: readonly CurrencyCode[] = ["EGP", "SAR", "USD"] as const;

export const SAR_PER_USD = 3.75;

export interface FxEnvInput {
  egpPerUsdRaw?: string;
  validUntilRaw?: string;
  now?: Date;
}

export interface FxState {
  active: boolean;
  egpPerUsd: number | null;
  sarPerUsd: number;
  validUntilIso: string | null;
  validUntilDateLabel: string | null;
}

export const FX_FALLBACK_TEXT = {
  en: "EGP/SAR confirmed on WhatsApp",
  ar: "أسعار EGP/SAR تُؤكَّد عبر واتساب",
} as const;

export function roundEgp(usd: number, egpPerUsd: number): number {
  return Math.round((usd * egpPerUsd) / 50) * 50;
}

export function roundSar(usd: number): number {
  return Math.round((usd * SAR_PER_USD) / 5) * 5;
}

function parseValidUntilMs(raw: string): { ms: number; label: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Date-only ISO string (YYYY-MM-DD): valid through the end of that UTC day.
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const ms = Date.parse(`${trimmed}T23:59:59.999Z`);
    if (Number.isNaN(ms)) return null;
    return { ms, label: trimmed };
  }

  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) return null;
  const isoDay = new Date(ms).toISOString().slice(0, 10);
  return { ms, label: isoDay };
}

export function resolveFxState(input?: FxEnvInput): FxState {
  const egpRaw = input?.egpPerUsdRaw ?? process.env.NEXT_PUBLIC_EGP_PER_USD ?? "";
  const untilRaw = input?.validUntilRaw ?? process.env.NEXT_PUBLIC_FX_VALID_UNTIL ?? "";
  const now = input?.now ?? new Date();

  const rate = Number(egpRaw.trim());
  const parsedUntil = parseValidUntilMs(untilRaw);

  if (!egpRaw.trim() || !Number.isFinite(rate) || rate <= 0 || !parsedUntil) {
    return {
      active: false,
      egpPerUsd: null,
      sarPerUsd: SAR_PER_USD,
      validUntilIso: null,
      validUntilDateLabel: null,
    };
  }

  if (now.getTime() > parsedUntil.ms) {
    return {
      active: false,
      egpPerUsd: null,
      sarPerUsd: SAR_PER_USD,
      validUntilIso: untilRaw.trim(),
      validUntilDateLabel: parsedUntil.label,
    };
  }

  return {
    active: true,
    egpPerUsd: rate,
    sarPerUsd: SAR_PER_USD,
    validUntilIso: untilRaw.trim(),
    validUntilDateLabel: parsedUntil.label,
  };
}

export interface ParsedUsdPrice {
  min: number;
  max?: number;
  hasPlus: boolean;
}

/**
 * Extracts numeric USD amount(s) from a display string such as
 * "$199 – $279", "$1,497 – $2,997+", "From $197", or "$27".
 */
export function parseUsdPrice(price: string): ParsedUsdPrice | null {
  const matches = [...price.matchAll(/\$?\s*(\d[\d,]*)/g)]
    .map((m) => Number((m[1] ?? "").replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (matches.length === 0) return null;
  const min = matches[0]!;
  const max = matches.length > 1 ? matches[1] : undefined;
  const hasPlus = price.includes("+");
  return { min, ...(max !== undefined ? { max } : {}), hasPlus };
}

function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

export interface FxPriceDisplay {
  active: boolean;
  conversionLine: { en: string; ar: string };
  validityLine: { en: string; ar: string } | null;
}

/**
 * Formats the secondary line shown under every USD price.
 * When active:
 *   conversionLine: "≈ X EGP · ≈ Y SAR"
 *   validityLine:   "EGP/SAR prices valid until <date>"
 * When missing or expired:
 *   conversionLine: "EGP/SAR confirmed on WhatsApp"
 *   validityLine:   null
 */
export function formatFxForUsd(
  usdOrPrice: number | string,
  envInput?: FxEnvInput,
): FxPriceDisplay {
  const state = resolveFxState(envInput);
  const parsed: ParsedUsdPrice | null =
    typeof usdOrPrice === "number"
      ? { min: usdOrPrice, hasPlus: false }
      : parseUsdPrice(usdOrPrice);

  if (!state.active || !state.egpPerUsd || !state.validUntilDateLabel || !parsed) {
    return {
      active: false,
      conversionLine: FX_FALLBACK_TEXT,
      validityLine: null,
    };
  }

  const egpMin = fmtNum(roundEgp(parsed.min, state.egpPerUsd));
  const sarMin = fmtNum(roundSar(parsed.min));

  const plus = parsed.hasPlus ? "+" : "";
  const egpText =
    parsed.max !== undefined
      ? `${egpMin}–${fmtNum(roundEgp(parsed.max, state.egpPerUsd))}${plus}`
      : `${egpMin}${plus}`;
  const sarText =
    parsed.max !== undefined
      ? `${sarMin}–${fmtNum(roundSar(parsed.max))}${plus}`
      : `${sarMin}${plus}`;

  const line = `≈ ${egpText} EGP · ≈ ${sarText} SAR`;

  return {
    active: true,
    conversionLine: {
      en: line,
      ar: line,
    },
    validityLine: {
      en: `EGP/SAR prices valid until ${state.validUntilDateLabel}`,
      ar: `أسعار EGP/SAR سارية حتى ${state.validUntilDateLabel}`,
    },
  };
}

/**
 * Converts a USD amount to the requested currency for the /book deposit flow.
 * If EGP or SAR is requested while FX is not active, `confirmedOnWhatsApp` is true
 * and the amount falls back to USD so no rate is ever fabricated.
 */
export function convertUsdAmount(
  usd: number,
  requestedCurrency: CurrencyCode,
  envInput?: FxEnvInput,
): {
  amount: number;
  currency: CurrencyCode;
  formatted: string;
  confirmedOnWhatsApp: boolean;
} {
  const state = resolveFxState(envInput);

  if (requestedCurrency === "USD") {
    const clean = Number.isInteger(usd) ? usd : Number(usd.toFixed(2));
    const formattedNum = Number.isInteger(clean)
      ? clean.toLocaleString("en-US")
      : clean.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return {
      amount: clean,
      currency: "USD",
      formatted: `$${formattedNum} USD`,
      confirmedOnWhatsApp: false,
    };
  }

  if (!state.active || !state.egpPerUsd) {
    const clean = Number.isInteger(usd) ? usd : Number(usd.toFixed(2));
    const formattedNum = Number.isInteger(clean)
      ? clean.toLocaleString("en-US")
      : clean.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return {
      amount: clean,
      currency: "USD",
      formatted: `$${formattedNum} USD`,
      confirmedOnWhatsApp: true,
    };
  }

  if (requestedCurrency === "EGP") {
    const egp = roundEgp(usd, state.egpPerUsd);
    return {
      amount: egp,
      currency: "EGP",
      formatted: `${egp.toLocaleString("en-US")} EGP`,
      confirmedOnWhatsApp: false,
    };
  }

  const sar = roundSar(usd);
  return {
    amount: sar,
    currency: "SAR",
    formatted: `${sar.toLocaleString("en-US")} SAR`,
    confirmedOnWhatsApp: false,
  };
}
