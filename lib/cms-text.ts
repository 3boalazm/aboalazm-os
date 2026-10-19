/**
 * CMS TEXT — Arabic text from the database, brought in line with the source.
 *
 * Two things the static data was fixed on and the CMS rows were not, because a
 * row keeps whatever it was seeded with:
 *
 *  1. Digits. The site writes Arabic with Latin digits (0–9): they sit beside
 *     the prices, "V2.0", "2020–26" and the English page, and a Gulf business
 *     reader meets them in every other interface. Rows seeded with Arabic-Indic
 *     digits (٠–٩, and ٪ ٫ ٬) used to put "٩+ سنوات" next to "2017–26" in the
 *     same strip.
 *  2. A client's name. A row that still carries a retired spelling of GAD's
 *     Arabic name (see client-names.ts) gets the client's own. Whole-string
 *     matches only, so prose that merely contains the words is left alone.
 *
 * `normalizeCmsText` walks arrays and plain objects and touches strings only;
 * numbers, dates, class instances and everything else pass through.
 */
import { GAD_NAME_AR, GAD_SHORT_AR } from "./client-names";

const DIGITS: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  "٪": "%", "٫": ".", "٬": ",",
};
const HAS_EASTERN = /[\u0660-\u0669\u06F0-\u06F9\u066A-\u066C]/;
const EASTERN_ALL = /[\u0660-\u0669\u06F0-\u06F9\u066A-\u066C]/g;

/** Arabic-Indic / Persian digits and separators → Latin. Strings without any come back untouched. */
export function latinDigits(s: string): string {
  return HAS_EASTERN.test(s) ? s.replace(EASTERN_ALL, (c) => DIGITS[c] ?? c) : s;
}

/** Retired spellings → the client's own. Whole string, spacing-insensitive. */
const RETIRED_NAMES: ReadonlyMap<string, string> = new Map([
  ["معهد GAD للقلب والرئة", GAD_NAME_AR],
  ["معهد جاد", GAD_NAME_AR],
  ["معهد GAD", GAD_SHORT_AR],
]);

const squash = (s: string) => s.replace(/\s+/g, " ").trim();

function text(s: string): string {
  return RETIRED_NAMES.get(squash(s)) ?? latinDigits(s);
}

const isPlain = (v: object): boolean => {
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

export function normalizeCmsText<T>(value: T): T {
  if (typeof value === "string") return text(value) as T;
  if (Array.isArray(value)) return value.map((item) => normalizeCmsText(item)) as T;
  if (value && typeof value === "object" && isPlain(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = normalizeCmsText(v);
    return out as T;
  }
  return value;
}
