import type { Locale } from "@/lib/locale";
import { arabicSpaceWidth, arabicWordWidth } from "@/lib/og-arabic-metrics";
import { RtlText } from "@/lib/og-rtl";
import { readFile } from "fs/promises";
import path from "path";

/**
 * Shared OG/Twitter share-card renderer — used by every route's
 * opengraph-image.tsx (see app/(site)/opengraph-image.tsx and the
 * per-slug variants under writing/case-studies/books). Brand-consistent:
 * obsidian canvas, accent-orange rule, display type — the same tokens as
 * app/(site)/globals.css, hand-copied since ImageResponse (Satori) can't
 * read CSS custom properties or Tailwind classes.
 *
 * Two display fonts, picked by `lang`: GC EPICPRO has no Arabic glyphs —
 * Satori doesn't fall back gracefully when a font lacks coverage, it
 * throws ("lookupType: 5 - substFormat: 3 is not yet supported"), so
 * Arabic titles must render with Thmanyah Serif Display instead (the
 * site's own AR heading font) rather than sharing GC EPICPRO.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const OBSIDIAN = "#080710";
const ACCENT = "#FF6B47";
const TEXT_SECONDARY = "rgba(255,255,255,0.72)";
const TEXT_GHOST = "rgba(255,255,255,0.4)";

const FONT_EN = "GC EPICPRO";
const FONT_AR = "Thmanyah Serif Display";

let epicproData: ArrayBuffer | null = null;
let thmanyahData: ArrayBuffer | null = null;
let notoData: ArrayBuffer | null = null;

async function loadFont(file: string): Promise<ArrayBuffer> {
  const buf = await readFile(path.join(process.cwd(), "public/fonts", file));
  return new Uint8Array(buf).buffer;
}

/**
 * Satori takes its fonts as an ordered list, and the order matters here.
 *
 * When it shapes a glyph that has no code point of its own (the lam-alef ligature and
 * its kin: لا، لأ، را …) it asks which font to use "for no character at all", is handed
 * the LAST font in the list, and throws ("Cannot read properties of undefined (reading
 * 'codePointAt')") unless that is the very face it is shaping. Every Arabic title with
 * one of those pairs, and the «مقالات» eyebrow of every Arabic article, used to fail
 * for that reason. So the Arabic face goes last. Reordering this array brings the
 * failure back; lib/og-arabic.test.ts renders real Arabic titles to catch it.
 */
export async function ogFonts() {
  epicproData ??= await loadFont("Gc_Epicpro.otf");
  thmanyahData ??= await loadFont("thmanyahserifdisplay-Bold.otf");
  notoData ??= await loadFont("noto-sans-latin-400.ttf");
  return [
    { name: FONT_EN, data: epicproData, weight: 800 as const, style: "normal" as const },
    // sentence-case body face — the two display fonts are display-only (GC EPICPRO is all-caps)
    { name: "Noto Sans", data: notoData, weight: 400 as const, style: "normal" as const },
    { name: FONT_AR, data: thmanyahData, weight: 700 as const, style: "normal" as const },
  ];
}

/**
 * Arabic headlines run longer than the English ones and the face is narrower per character,
 * so 60px holds up to ~80 characters on at most three lines; only a very long title steps down.
 */
const arTitleSize = (title: string) => (title.length <= 80 ? 60 : 52);

/** eyebrow: small mono label (e.g. "WRITING", "CASE FILE"). title: the big display line. */
export function OgCard({
  eyebrow,
  title,
  lang = "en",
}: {
  eyebrow: string;
  title: string;
  lang?: Locale;
}) {
  const ar = lang === "ar";
  const dir = ar ? "rtl" : "ltr";
  const displayFont = ar ? FONT_AR : FONT_EN;
  // Satori has no bidi and ignores `dir`, so the Arabic card is mirrored by hand: rows run
  // right to left, the text block hugs the right edge and every Arabic line goes through
  // RtlText (see lib/og-rtl.tsx). The English card is untouched.
  const row = ar ? "row-reverse" : "row";
  const titleSize = ar ? arTitleSize(title) : 60;
  // The gap between words is the face's own word space; 0.25em if the face cannot be read.
  const gapFor = (size: number) => Math.round(arabicSpaceWidth(size) ?? size * 0.25);
  const measureFor = (size: number) => (word: string) => arabicWordWidth(word, size);

  return (
    <div
      dir={dir}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: OBSIDIAN,
        backgroundImage: `radial-gradient(closest-side, rgba(255,107,71,0.16), transparent 70%)`,
        backgroundPosition: "top right",
        backgroundSize: "900px 900px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ display: "flex", flexDirection: row, alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontFamily: FONT_EN,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          M<span style={{ color: ACCENT }}>A</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: TEXT_GHOST,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Aboalazm OS
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 980,
          ...(ar ? { width: 980, alignSelf: "flex-end" } : {}),
        }}
      >
        {ar ? (
          // letter-spacing would pull the joined Arabic letters apart, so none here
          <RtlText
            text={eyebrow}
            wordGap={gapFor(28)}
            measure={measureFor(28)}
            style={{ fontFamily: FONT_AR, fontSize: 28, color: ACCENT }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: ACCENT,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        )}
        {ar ? (
          <RtlText
            text={title}
            wordGap={gapFor(titleSize)}
            measure={measureFor(titleSize)}
            style={{ fontFamily: displayFont, fontSize: titleSize, lineHeight: 1.3, color: "#fff" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              fontFamily: displayFont,
              fontSize: titleSize,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            {title}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: row,
          alignItems: "center",
          gap: 12,
          fontSize: 18,
          color: TEXT_SECONDARY,
        }}
      >
        <div style={{ display: "flex", width: 28, height: 1, background: ACCENT }} />
        {ar ? (
          <RtlText
            text="مصمم هوية بصرية أول"
            width="auto"
            wordGap={gapFor(22)}
            measure={measureFor(22)}
            style={{ fontFamily: FONT_AR, fontSize: 22 }}
          />
        ) : (
          <div style={{ display: "flex" }}>Senior Brand Identity Designer</div>
        )}
      </div>
    </div>
  );
}
