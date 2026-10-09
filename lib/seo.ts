/**
 * Cut `text` to at most `max` characters on a word boundary, for meta
 * descriptions. Text that already fits is returned unchanged; otherwise the
 * last whole word within `max` is kept, trailing punctuation is dropped and
 * an ellipsis is appended (so the result is at most `max + 1` characters).
 */
export function truncateAtWord(text: string, max = 155): string {
  if (text.length <= max) return text;

  // text.slice(0, end) ends on a whole word when text[end] is whitespace:
  // start at `max` and back up to the nearest whitespace. A single unbroken
  // run with no boundary at all is cut hard.
  let end = max;
  while (end > 0 && !/\s/.test(text.charAt(end))) end--;
  if (end === 0) end = max;

  return `${text.slice(0, end).replace(/[\s.,;:!?\-–—،؛؟]+$/, "")}…`;
}
