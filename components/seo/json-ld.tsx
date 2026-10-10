/**
 * Server-rendered <script type="application/ld+json">.
 *
 * "<" and the two JS line-separator characters are escaped so a value that
 * contains "</script>" (e.g. a CMS-driven title) can never break out of the
 * tag. The escapes are written with double backslashes on purpose: the
 * output must contain the literal six characters <, which JSON.parse
 * turns back into "<".
 */
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

const escapeJsonLd = (json: string) =>
  json
    .replace(/</g, "\\u003c")
    .split(LINE_SEP).join("\\u2028")
    .split(PARA_SEP).join("\\u2029");

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(data)) }}
    />
  );
}
