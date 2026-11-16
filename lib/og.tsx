import type { Locale } from "@/lib/locale";
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
  const dir = lang === "ar" ? "rtl" : "ltr";
  const displayFont = lang === "ar" ? FONT_AR : FONT_EN;

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
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
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
        <div
          style={{
            display: "flex",
            fontFamily: displayFont,
            fontSize: 60,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#fff",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 18,
          color: TEXT_SECONDARY,
        }}
      >
        <div style={{ display: "flex", width: 28, height: 1, background: ACCENT }} />
        <div style={{ display: "flex" }}>
          {lang === "ar" ? "مصمم هوية بصرية أول" : "Senior Brand Identity Designer"}
        </div>
      </div>
    </div>
  );
}
