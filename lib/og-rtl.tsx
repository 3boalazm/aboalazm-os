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
 * Latin-script words (and plain digits) keep their own left-to-right order, so a run such as
 * "Design Systems" inside an Arabic title stays one item instead of being flipped word by word.
 */

// Arabic, Arabic Supplement, Arabic Extended-A, Presentation Forms-A and -B.
const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

export type Run = { text: string; arabic: boolean };

/** The items of a right-to-left line, in reading order (the first item is the rightmost). */
export function rtlRuns(text: string): Run[] {
  const runs: Run[] = [];
  let latin: string[] = [];
  const flush = () => {
    if (latin.length > 0) {
      runs.push({ text: latin.join(" "), arabic: false });
      latin = [];
    }
  };
  for (const word of text.split(/\s+/)) {
    if (word === "") continue;
    if (ARABIC.test(word)) {
      flush();
      runs.push({ text: word, arabic: true });
    } else {
      latin.push(word);
    }
  }
  flush();
  return runs;
}

/**
 * `style` carries the text styling (font, size, colour, line height); it is inherited by the
 * words. `width` defaults to the full width of the parent so the text hugs its right edge;
 * pass "auto" inside a row.
 *
 * `measure` returns the width an Arabic word is actually drawn at (see lib/og-arabic-metrics.ts).
 * Satori would otherwise size each word's box from isolated letter widths, 15-25% too wide,
 * and the gaps between words open up. Without it, or when it answers null, the word is left
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
      {rtlRuns(text).map((run, i) => {
        const w = run.arabic ? measure?.(run.text) : null;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              ...(w ? { width: Math.ceil(w), flexShrink: 0 } : {}),
            }}
          >
            {run.text}
          </div>
        );
      })}
    </div>
  );
}
