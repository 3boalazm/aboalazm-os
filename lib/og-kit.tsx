import { readFile } from "fs/promises";
import path from "path";
import type { ReactNode, CSSProperties } from "react";
import { ogFonts } from "@/lib/og";

/**
 * OG KIT — building blocks for the per-page share cards (1200×630).
 *
 * Every card = the same obsidian shell (brand mark · page index · title ·
 * description · URL) + one bespoke visual on the right that shows what the
 * page *is* (a pricing ladder, a 38-day timeline, a browser window, …).
 *
 * Satori rules (it is not a browser): every element with more than one child
 * needs `display:flex`; no grid; no CSS variables; images must be data URLs.
 * That is why the helpers below always set `display:"flex"`.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/* ── tokens (hand-copied from app/(site)/globals.css) ─────────────────── */
export const C = {
  bg: "#080710",
  panel: "#100E1B",
  panel2: "#16132A",
  accent: "#FF6B47",
  cyan: "#48CCCC",
  mint: "#06D6A0",
  violet: "#7850C8",
  pink: "#E8579A",
  text: "#FFFFFF",
  text2: "rgba(255,255,255,0.72)",
  text3: "rgba(255,255,255,0.46)",
  line: "rgba(255,255,255,0.12)",
  lineSoft: "rgba(255,255,255,0.07)",
} as const;

export const F_EN = "GC EPICPRO";
export const F_AR = "Thmanyah Serif Display";
export const F_BODY = "Noto Sans";

/** Satori lays Arabic words out left-to-right (glyphs inside a word are shaped
 *  correctly, but the word order is not bidi-reordered). Reversing the words
 *  makes a single-line Arabic phrase read right-to-left as intended. */
export const rtlWords = (s: string) => s.split(" ").reverse().join(" ");

/* ── tiny style helpers ───────────────────────────────────────────────── */
export const flex = (s: CSSProperties = {}): CSSProperties => ({ display: "flex", ...s });
export const col = (s: CSSProperties = {}): CSSProperties => ({ display: "flex", flexDirection: "column", ...s });

/* ── image loader: resize + inline as a data URL (Satori can't fetch local
      files, and some source images are many MB) ──────────────────────── */
const imgCache = new Map<string, string>();

export async function ogImg(rel: string, width = 640, quality = 72): Promise<string> {
  const key = `${rel}@${width}`;
  const hit = imgCache.get(key);
  if (hit) return hit;
  const abs = path.join(process.cwd(), "public", rel);
  let out = "";
  try {
    const raw = await readFile(abs);
    try {
      // sharp ships with Next on the host but has no local types
      // @ts-ignore
      const sharp = (await import("sharp")).default;
      const buf = await sharp(raw).resize({ width, withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality }).toBuffer();
      out = `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      // sharp unavailable — only inline files that are already small
      if (raw.length < 400 * 1024) {
        const mime = /\.png$/i.test(rel) ? "image/png" : "image/jpeg";
        out = `data:${mime};base64,${raw.toString("base64")}`;
      }
    }
  } catch {
    out = "";
  }
  imgCache.set(key, out);
  return out;
}

export async function ogImgs<T extends string>(map: Record<T, [rel: string, width?: number]>): Promise<Record<T, string>> {
  const entries = await Promise.all(
    (Object.entries(map) as [T, [string, number?]][]).map(async ([k, [rel, w]]) => [k, await ogImg(rel, w ?? 640)] as const),
  );
  return Object.fromEntries(entries) as Record<T, string>;
}

/* ── primitives used by the page visuals ──────────────────────────────── */
export function Pic({
  src, w, h, radius = 16, pos = "center", style,
}: { src: string; w: number | string; h: number | string; radius?: number; pos?: string; style?: CSSProperties }) {
  return (
    <div
      style={flex({
        width: w, height: h, borderRadius: radius, overflow: "hidden",
        background: C.panel2, border: `1px solid ${C.line}`, ...style,
      })}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img src={src} width="100%" height="100%" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
      ) : null}
    </div>
  );
}

export function Chip({ children, tone = "ghost" }: { children: ReactNode; tone?: "ghost" | "accent" | "solid" }) {
  const t =
    tone === "accent"
      ? { color: C.accent, border: `1px solid rgba(255,107,71,0.5)`, background: "rgba(255,107,71,0.1)" }
      : tone === "solid"
        ? { color: C.bg, border: `1px solid ${C.text}`, background: C.text }
        : { color: C.text2, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.04)" };
  return (
    <div
      style={flex({
        alignItems: "center", fontFamily: F_EN, fontSize: 15, letterSpacing: "0.08em",
        textTransform: "uppercase", padding: "8px 14px", borderRadius: 999, ...t,
      })}
    >
      {children}
    </div>
  );
}

export function Label({ children, color = C.text3, size = 14 }: { children: ReactNode; color?: string; size?: number }) {
  return (
    <div style={flex({ fontFamily: F_EN, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color, whiteSpace: "nowrap" })}>
      {children}
    </div>
  );
}

/** A framed panel — the stage the page visual sits on. */
export function Stage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={col({
        width: "100%", height: "100%", borderRadius: 28, position: "relative", overflow: "hidden",
        background: `linear-gradient(160deg, ${C.panel2} 0%, ${C.panel} 60%)`,
        border: `1px solid ${C.line}`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        ...style,
      })}
    >
      {children}
    </div>
  );
}

/* ── the shell ────────────────────────────────────────────────────────── */
export interface ShellProps {
  /** section index shown top-left, e.g. "03" */
  idx: string;
  /** eyebrow, e.g. "METHOD / PROCESS" */
  eyebrow: string;
  /** Arabic page tag (Thmanyah) shown under the eyebrow */
  tagAr: string;
  /** title lines (each its own line); the last line is accent-coloured when `hot` */
  title: string[];
  hot?: boolean;
  desc: string;
  /** route, shown as the URL chip, e.g. "/process" */
  route: string;
  children: ReactNode;
}

function titleSize(lines: string[]): number {
  // GC EPICPRO is wide (~0.8em per capital) — fit the longest line into the 560px column
  const longest = Math.max(...lines.map((l) => l.length));
  let s = Math.min(88, Math.floor(540 / (0.8 * longest)));
  if (lines.length >= 3) s = Math.min(s, 62);
  return s;
}

export function Shell({ idx, eyebrow, tagAr, title, hot = true, desc, route, children }: ShellProps) {
  const size = titleSize(title);
  return (
    <div
      style={col({
        width: "100%", height: "100%", position: "relative", background: C.bg, color: C.text,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      })}
    >
      {/* glows */}
      <div
        style={{
          position: "absolute", right: -160, top: -200, width: 760, height: 760, display: "flex",
          backgroundImage: "radial-gradient(closest-side, rgba(255,107,71,0.20), rgba(255,107,71,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute", left: -240, bottom: -300, width: 760, height: 760, display: "flex",
          backgroundImage: "radial-gradient(closest-side, rgba(120,80,200,0.14), rgba(120,80,200,0) 70%)",
        }}
      />

      <div style={flex({ flex: 1, padding: "52px 60px 48px", gap: 44 })}>
        {/* left column */}
        <div style={col({ width: 560, justifyContent: "space-between" })}>
          <div style={flex({ alignItems: "center", gap: 14 })}>
            <div style={flex({ fontFamily: F_EN, fontSize: 30, letterSpacing: "-0.02em" })}>
              M<span style={{ color: C.accent }}>A</span>
            </div>
            <div style={flex({ width: 1, height: 22, background: C.line })} />
            <Label>Aboalazm OS</Label>
          </div>

          <div style={col({ flex: 1, justifyContent: "center", gap: 16, padding: "22px 0" })}>
            <div style={flex({ alignItems: "center", gap: 14 })}>
              <div style={flex({ fontFamily: F_EN, fontSize: 20, color: C.accent })}>{idx}</div>
              <div style={flex({ width: 28, height: 1, background: C.accent })} />
              <Label color={C.accent} size={17}>{eyebrow}</Label>
            </div>
            <div style={col({ fontFamily: F_EN, fontSize: size, lineHeight: 1.0, letterSpacing: "-0.03em" })}>
              {title.map((l, i) => (
                <div key={i} style={flex({ whiteSpace: "nowrap", color: hot && i === title.length - 1 ? C.accent : C.text })}>{l}</div>
              ))}
            </div>
            <div style={flex({ fontFamily: F_AR, fontSize: 30, color: C.text2 })}>{rtlWords(tagAr)}</div>
            <div style={flex({ fontFamily: F_BODY, fontSize: 22, lineHeight: 1.45, color: C.text2, maxWidth: 530 })}>{desc}</div>
          </div>

          <div style={flex({ alignItems: "center", gap: 14 })}>
            <div style={flex({ width: 28, height: 2, background: C.accent })} />
            <div style={flex({ fontFamily: F_EN, fontSize: 16, letterSpacing: "0.1em", color: C.text2 })}>
              aboalazm-os.vercel.app{route === "/" ? "" : route}
            </div>
          </div>
        </div>

        {/* right column — the page visual */}
        <div style={flex({ flex: 1, minWidth: 0 })}>{children}</div>
      </div>
    </div>
  );
}

export { ogFonts };
