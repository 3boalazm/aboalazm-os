import type { CSSProperties } from "react";

/**
 * Right-to-left text for the share cards.
 *
 * Satori (the renderer behind next/og) lays every line out left to right. Inside a single
 * word it shapes Arabic correctly, joined letters and all, but it never reorders the words
 * of a line, never starts a wrapped line on the right and ignores `direction: rtl`. A bare
 * Arabic sentence therefore comes out reading backwards: first word on the left, last word
 * on the right.
 *
 * What survives wrapping is to let flexbox do the reordering: one flex item per word, inside
 * a `row-reverse` wrapping container. The first word lands on the right edge, the line breaks
 * where the width runs out, and the next line starts on the right again.
 *
 * The same left-to-right habit applies *inside* a word that is not pure Arabic letters, and
 * there it is wrong in a way readers notice at once: the colon of «دولاراً:» lands before the
 * word instead of after it, the full stop of a title lands at the start of its last word, and
 * the digits of «بـ٥٠» swap places with the letter. So a word is cut into runs (Arabic letters,
 * digits, Latin text, single punctuation marks) and the runs are laid out right to left like
 * the words are, without a gap between them. This is a small version of the Unicode
 * bidirectional algorithm, enough for titles: a colon, a full stop, an Arabic comma, a question
 * mark, guillemets, brackets, digits and Latin names.
 *
 * Latin-script words (and plain digits) keep their own left-to-right order, so a run such as
 * "Design Systems" inside an Arabic title stays one run instead of being flipped word by word.
 *
 * Vowel marks (tashkeel) are left out of the cards: Satori does no mark positioning, so a
 * fathatan, damma or shadda is drawn at the foot of its letter, where it reads as a smudge
 * (and, after «دولاراً», collides with the colon) instead of above it. The pages keep their marks.
 */

// Arabic, Arabic Supplement, Arabic Extended-A, Presentation Forms-A and -B (+ ZWNJ/ZWJ, which
// live inside Persian-style words).
const ARABIC_SCRIPT = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿‌‍]/;
const ARABIC_DIGIT = /[٠-٩۰-۹]/;
// Punctuation that lives in the Arabic block but is not a letter: ، ؍ ؛ ؞ ؟ ٪ ٭ ۔ and the
// decimal / thousands separators ٫ ٬ (the last two only join digits).
const ARABIC_PUNCTUATION = /[،؍؛؞؟٪٭۔]/;
const ARABIC_NUMBER_SEPARATOR = /[٫٬]/;
const COMMON_NUMBER_SEPARATOR = /[.,:/]/;
// Marks, letters and digits of any other script (Latin, mostly) read left to right.
const LTR_CHAR = /[\p{L}\p{N}\p{M}]/u;

function isArabicLetter(ch: string): boolean {
  return (
    ARABIC_SCRIPT.test(ch) &&
    !ARABIC_DIGIT.test(ch) &&
    !ARABIC_PUNCTUATION.test(ch) &&
    !ARABIC_NUMBER_SEPARATOR.test(ch)
  );
}
const isArabicScript = (ch: string) => ARABIC_SCRIPT.test(ch);
const isArabicDigit = (ch: string) => ARABIC_DIGIT.test(ch);
const isLtrChar = (ch: string) => !isArabicScript(ch) && LTR_CHAR.test(ch);

/** Brackets and quotes are mirrored in right-to-left text: the one that opens is drawn facing left. */
const MIRROR: Record<string, string> = {
  "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<",
  "«": "»", "»": "«", "‹": "›", "›": "‹",
};

// Arabic combining marks: small signs above/below a letter (fathatan … shadda, dagger alef, Quranic signs).
const ARABIC_MARKS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g;

/** The text without vowel marks, as the cards draw it (see above). */
export function withoutArabicMarks(text: string): string {
  return text.replace(ARABIC_MARKS, "");
}

/** A stretch of text drawn as one piece; `arabic` marks shaped Arabic letters (measured, see RtlText). */
export type Run = { text: string; arabic: boolean };
/** The runs of one word, in reading order (the first is the rightmost), drawn without a gap between them. */
export type Item = Run[];

type Kind = "arabic" | "ltr" | "digits" | "neutral";
type Unit = { text: string; kind: Kind };
/** The last strong letter seen: nothing yet (the line start, right to left), Latin, or Arabic. */
type Strong = "start" | "latin" | "arabic";

const isEuropeanDigit = (ch: string) => ch >= "0" && ch <= "9";

/**
 * Cuts a word (no whitespace) into Arabic letters, left-to-right text, digits and single neutrals.
 * Digits follow the Unicode rule that European digits after an Arabic letter are Arabic numbers,
 * which never join a Latin phrase: a range such as 50-60 after an Arabic word reads 50 first,
 * from the right, like the Arabic-Indic digits do.
 */
function units(word: string, strong: Strong): { units: Unit[]; strong: Strong } {
  const chars = Array.from(word);
  const out: Unit[] = [];
  const digitAt = (j: number) => j < chars.length && (isArabicDigit(chars[j]!) || isEuropeanDigit(chars[j]!));
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i]!;
    if (isArabicLetter(ch)) {
      let j = i;
      while (j < chars.length && isArabicLetter(chars[j]!)) j += 1;
      out.push({ text: chars.slice(i, j).join(""), kind: "arabic" });
      strong = "arabic";
      i = j;
    } else if (isArabicDigit(ch) || (isEuropeanDigit(ch) && strong === "arabic")) {
      // Arabic numbers; a decimal point, comma, colon or slash between two digits stays inside the number.
      let j = i;
      for (;;) {
        while (digitAt(j)) j += 1;
        const sep = chars[j];
        if (
          sep !== undefined &&
          (ARABIC_NUMBER_SEPARATOR.test(sep) || COMMON_NUMBER_SEPARATOR.test(sep)) &&
          digitAt(j + 1)
        ) {
          j += 1;
        } else break;
      }
      out.push({ text: chars.slice(i, j).join(""), kind: "digits" });
      i = j;
    } else if (isLtrChar(ch)) {
      // Letters and digits, plus any neutral that sits between two of them (e-commerce, Q&A, 2026-11-16).
      let j = i;
      for (;;) {
        while (j < chars.length && isLtrChar(chars[j]!)) j += 1;
        let k = j;
        while (k < chars.length && !isLtrChar(chars[k]!) && !isArabicScript(chars[k]!)) k += 1;
        if (k > j && k < chars.length && isLtrChar(chars[k]!)) j = k;
        else break;
      }
      const text = chars.slice(i, j).join("");
      if (/\p{L}/u.test(text)) strong = "latin";
      out.push({ text, kind: "ltr" });
      i = j;
    } else {
      out.push({ text: ch, kind: "neutral" });
      i += 1;
    }
  }
  return { units: out, strong };
}

const isNeutralOnly = (us: Unit[]) => us.every((u) => u.kind === "neutral");
/** True for a word that reads left to right as a whole: Latin text / European digits and maybe punctuation. */
const isLtrWord = (us: Unit[]) => us.some((u) => u.kind === "ltr") && us.every((u) => u.kind !== "arabic" && u.kind !== "digits");

function neutralRun(ch: string): Run {
  return { text: MIRROR[ch] ?? ch, arabic: false };
}

/** The words of a right-to-left line, in reading order (the first item is the rightmost). */
export function rtlRuns(text: string): Item[] {
  let strong: Strong = "start";
  const words = text
    .split(/\s+/)
    .filter((w) => w !== "")
    .map((w) => {
      const cut = units(w, strong);
      strong = cut.strong;
      return { text: w, units: cut.units };
    });

  const items: Item[] = [];
  let i = 0;
  while (i < words.length) {
    const word = words[i]!;
    if (!isLtrWord(word.units)) {
      items.push(
        word.units.map((u) => (u.kind === "neutral" ? neutralRun(u.text) : { text: u.text, arabic: u.kind === "arabic" })),
      );
      i += 1;
      continue;
    }
    // A phrase of Latin words keeps its own order. A lone dash or ampersand between two of them is part of it.
    let end = i;
    for (let k = i + 1; k < words.length; k += 1) {
      const w = words[k]!;
      if (isLtrWord(w.units)) end = k;
      else if (isNeutralOnly(w.units) && k + 1 < words.length && isLtrWord(words[k + 1]!.units)) continue;
      else break;
    }
    const chars = Array.from(words.slice(i, end + 1).map((w) => w.text).join(" "));
    let from = 0;
    let to = chars.length;
    // Punctuation hugging the phrase belongs to the right-to-left line, not to the phrase: it is drawn
    // beside it (and mirrored, if it is a bracket or a quote) instead of inside it.
    while (from < to && !isLtrChar(chars[from]!)) from += 1;
    while (to > from && !isLtrChar(chars[to - 1]!)) to -= 1;
    const item: Item = [];
    for (const ch of chars.slice(0, from)) if (ch.trim() !== "") item.push(neutralRun(ch));
    item.push({ text: chars.slice(from, to).join(""), arabic: false });
    for (const ch of chars.slice(to)) if (ch.trim() !== "") item.push(neutralRun(ch));
    items.push(item);
    i = end + 1;
  }
  return items;
}

/**
 * `style` carries the text styling (font, size, colour, line height); it is inherited by the
 * words. `width` defaults to the full width of the parent so the text hugs its right edge;
 * pass "auto" inside a row.
 *
 * `measure` returns the width an Arabic run is actually drawn at (see lib/og-arabic-metrics.ts).
 * Satori would otherwise size each run's box from isolated letter widths, 15-25% too wide,
 * and the gaps between words open up. Without it, or when it answers null, the run is left
 * to Satori.
 */
export function RtlText({
  text,
  style,
  wordGap,
  lineGap = 0,
  width = "100%",
  measure,
}: {
  text: string;
  style?: CSSProperties;
  wordGap: number;
  lineGap?: number;
  width?: CSSProperties["width"];
  measure?: (word: string) => number | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignContent: "flex-start",
        columnGap: wordGap,
        rowGap: lineGap,
        width,
        ...style,
      }}
    >
      {rtlRuns(withoutArabicMarks(text)).map((item, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "row-reverse", flexShrink: 0, whiteSpace: "nowrap" }}>
          {item.map((run, j) => {
            const w = run.arabic ? measure?.(run.text) : null;
            return (
              <div key={j} style={{ display: "flex", ...(w ? { width: Math.ceil(w), flexShrink: 0 } : {}) }}>
                {run.text}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
