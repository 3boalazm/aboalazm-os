import type { SVGAttributes } from "react";
import { joinClasses } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════
 * ICON — the studio's single icon system.
 * ───────────────────────────────────────────────────────────────
 * Before this existed the site shipped ~110 raw Unicode glyphs
 * (→ ← ↑ ↓ ↗ ✕ ✓ ★ ✦ ◆ ☰ ☀ ☾) across ~36 files. They rendered
 * differently per OS/font, couldn't flip for RTL, and carried no
 * stroke-weight relationship to the UI. This set replaces them.
 *
 * CONVENTIONS
 *  · One canvas: 24×24, stroke 1.5, round caps and joins, no fill —
 *    the same quiet-luxury restraint as the rest of the system.
 *    `star-solid` and `diamond` are the only filled marks.
 *  · currentColor everywhere: icons inherit text color tokens, so
 *    theme switches and role tints work with zero extra work.
 *  · Default size `1em` — an icon sits inside text like the glyph
 *    it replaces; scale it with the surrounding type token.
 *  · Directional icons (arrows, side chevrons) auto-flip in RTL via
 *    `rtl:-scale-x-100`, because "forward" points left there. Pass
 *    `flip={false}` for a literal, non-semantic arrow.
 *  · Decorative by default (`aria-hidden`). Give it a `title` to make
 *    it a named `role="img"` when an icon stands alone.
 *  · No icon library dependency: 20 hand-drawn paths, tree-shaken by
 *    virtue of being data in this one file.
 * ═══════════════════════════════════════════════════════════════
 */

interface IconDef {
  /** SVG children — drawn on a 24×24 canvas. */
  d: string;
  /** Render filled with currentColor instead of stroked. */
  filled?: boolean;
  /** Meaning carries a direction → mirror automatically in RTL. */
  rtl?: boolean;
}

const ICON_DEFS = {
  "arrow-right": { d: "M4 12h16M13 5l7 7-7 7", rtl: true },
  "arrow-left": { d: "M20 12H4M11 5l-7 7 7 7", rtl: true },
  "arrow-up": { d: "M12 20V4M5 11l7-7 7 7" },
  "arrow-down": { d: "M12 4v16M5 13l7 7 7-7" },
  /** External / open-out — the ↗ of the old system. */
  "arrow-up-right": { d: "M7 17 17 7M8 7h9v9", rtl: true },
  x: { d: "M6 6l12 12M18 6 6 18" },
  check: { d: "m5 12.5 4.5 4.5L19 7" },
  star: { d: "m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z" },
  "star-solid": { d: "m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z", filled: true },
  sparkle: { d: "M12 2.5l2.3 7.2 7.2 2.3-7.2 2.3-2.3 7.2-2.3-7.2-7.2-2.3 7.2-2.3z", filled: true },
  diamond: { d: "M12 2.5 21.5 12 12 21.5 2.5 12z", filled: true },
  "chevron-down": { d: "m6 9 6 6 6-6" },
  "chevron-up": { d: "m6 15 6-6 6 6" },
  "chevron-left": { d: "m15 6-6 6 6 6", rtl: true },
  "chevron-right": { d: "m9 6 6 6-6 6", rtl: true },
  menu: { d: "M4 7h16M4 12h16M4 17h16" },
  play: { d: "M8 5.5v13l10.5-6.5z", filled: true },
  sun: { d: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" },
  moon: { d: "M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" },
  download: { d: "M12 4v11m0 0-5-5m5 5 5-5M5 20h14" },
  lock: { d: "M7 10V7a5 5 0 0 1 10 0v3M5.5 10h13a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1z" },
} as const;

export const ICONS: { [K in keyof typeof ICON_DEFS]: IconDef } = ICON_DEFS;
export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "title"> {
  name: IconName;
  /**
   * CSS size (any length). Defaults to `1em` so the icon tracks the
   * surrounding type token exactly like the Unicode glyph it replaces.
   */
  size?: string | number;
  /** Stroke width override — the system default is 1.5. */
  strokeWidth?: number;
  /**
   * RTL mirroring for directional icons. `undefined` = auto (flip when
   * the icon's meaning is directional), `false` = literal arrow.
   */
  flip?: boolean;
  /** Accessible name for a standalone icon; omit for decorative use. */
  title?: string;
}

export function Icon({
  name,
  size = "1em",
  strokeWidth = 1.5,
  flip,
  title,
  className,
  ...rest
}: IconProps) {
  const def = ICONS[name];
  const rtlFlip = flip ?? def.rtl ?? false;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={def.filled ? "currentColor" : "none"}
      stroke={def.filled ? "none" : "currentColor"}
      strokeWidth={def.filled ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={joinClasses("inline-block shrink-0 align-[-0.125em]", rtlFlip && "rtl:-scale-x-100", className)}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={def.d} />
    </svg>
  );
}
