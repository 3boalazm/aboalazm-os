/**
 * TYPOGRAPHY LOADOUT — four voices, one system.
 * Instrument Serif  → editorial display (the Quiet Luxury voice)
 * Inter Tight       → interface & body (the Strategic Expert voice)
 * JetBrains Mono    → system labels, metrics (the Design Engineer voice)
 * Geist Mono        → ledger stack pills (the engineering-ledger voice)
 * IBM Plex Sans Arabic → bilingual lockups (the native voice)
 *
 * next/font self-hosts everything: zero layout shift, zero FOUT.
 */
import {
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/** Ledger voice — stack pills & data-dense tables only. */
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const fontVariables = [
  instrumentSerif.variable,
  interTight.variable,
  jetbrainsMono.variable,
  geistMono.variable,
  plexArabic.variable,
].join(" ");
