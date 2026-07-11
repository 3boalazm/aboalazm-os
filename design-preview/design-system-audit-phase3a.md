# Enterprise Design System Audit — Phase 3A (Source-Only)
Date: 2026-07-11 · Method: static analysis of `app/(site)/globals.css` (2052 lines) + `**/*.tsx` (92 components). No pixel/visual judgement — that's Phase 3B, pending screenshot capability.

## TL;DR
The token layer itself (`@theme` block, lines 1–220 of globals.css) is well-designed and disciplined. The debt is almost entirely in **~1,830 lines of page-specific hand-rolled CSS classes** that sit outside that token system, plus **zero shared component layer** (`components/ui` doesn't exist — no `<Button>`, no `<Card>`). Every CTA, card, and control is reinvented per page. `/start` and `/process` are the worst offenders.

---

## 1. Design Tokens & CSS Variables — **Strong**
`@theme` in `globals.css:28-151` defines a clean, complete primitive set: 8px spacing base, 3 radii, 3 easing curves, 4 durations, semantic color ramps (surface/border/text, dark + light), a 7-step fluid type scale, shadow tokens, container widths, a z-index contract. Light/dark is a single reassignment block (`html[data-theme="light"]`, line 165) — genuinely well-architected, runtime-switchable, no component-level theme branching needed.

**Issue:** the token layer is aspirational — most of the file below it doesn't use it (see §2-5).

## 2. Color System — **Leaking primitives**
- `rgb(255 107 71 / …)` (the accent color, `--color-accent: #FF6B47`) is hardcoded **49 times** in globals.css instead of routed through a token, each with a different one-off opacity (0.04, 0.05, 0.06, 0.08, 0.12, 0.14, 0.15, 0.20, 0.25, 0.3, 0.30, 0.35, 0.35, 0.40, 0.4, 0.45, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85…). That's effectively ~20 undocumented accent-opacity "tokens" invented ad hoc.
- Compare to the deliberate `--color-accent-dim: rgb(255 107 71 / 0.14)` defined once in `@theme` (line 82) — a good pattern that isn't reused anywhere else in the file.
- Same pattern for the obsidian canvas: `rgb(8 7 16 / …)` appears repeatedly instead of `var(--color-surface-0)` + opacity via `color-mix()` (the `.glass` utility at line 402 already shows the correct approach).
- **Fix:** collapse the accent-opacity soup into 3-4 named tokens (e.g. `--color-accent-08/16/32`) and a `color-mix()` helper, matching the existing `.glass` utility's approach.

## 3. Typography — **Scale fragmentation**
7 tokens are defined (`--text-hero` → `--text-micro`), but the file contains dozens of untokenized one-off sizes: `0.63rem, 0.67rem, 0.69rem, 0.71rem, 0.78rem, 0.8rem, 0.82rem, 0.85rem, 0.9rem, 1.05rem, 1.1rem, 1.4rem, 1.6rem…`. These read as a second, informal type scale that grew organically per component (mostly in the `.labtool-*`, `.gate-*`, `.persona-*`, `.not-found-*` blocks).
- `"Montserrat"` is hardcoded as a literal string in 8 places (`.labtool-card__sub`, `.hook-sub`, `.jargon-note`, `.not-found-sub`, `.not-found-body`, `.persona-band__skip`, `.labtool-bilingual-tag`, `.labtool-samplebox__text`) instead of using `var(--font-sans)` alone — this duplicates and slightly diverges from the deliberate RTL font-lock system already built at `globals.css:305-334` (`.text-body`/`.text-body-sm`/`.text-lead` correctly use `var(--font-sans)` only). These 8 outliers still resolve correctly today (Montserrat has no Arabic glyphs, so RTL text silently falls through to the CSS fallback chain) but they're fragile — any future explicit Latin fallback added after Montserrat would break Arabic rendering silently.

## 4. Spacing — **Violates the file's own stated rule**
Header comment states: *"Spacing base = 8px → p-1/p-2/p-3/p-4/p-8/p-16 are the ONLY rhythm."* In practice, dozens of hand-written `gap`/`padding` values ignore the 8px grid: `gap: 2px` (persona-toggle), `gap: 3px` / `padding: 3px` (work-filter), `padding: 10px 14px` (gate-terminal__bar), `gap: 6px` (repeated ~15×), `padding: 7px 10px`, `padding: 4px 10px`, `margin-top: -4px`, etc. None of these are reachable from Tailwind's `--spacing: 8px` scale — they're all raw px in custom classes.
- **Fix:** either round these to the nearest 8px-derived Tailwind spacing utility, or (if 4/6px micro-adjustments are genuinely needed for optical alignment in dense UI) add a documented secondary micro-scale token rather than scattering raw px.

## 5. Component Consistency — **No shared component layer (biggest finding)**
`components/ui/` does not exist. There is no `<Button>`. Every CTA button in the app is a hand-rolled CSS class:
- `.not-found-cta--primary` / `.not-found-cta--ghost` (globals.css:797-811)
- `.start-cta-primary` / `.start-cta-ghost` (globals.css:920-955)
- `.process-cta-primary` / `.process-cta-ghost` (globals.css:1087-1121)

These three pairs are **byte-for-byte identical** in every property (font-display, weight 800, size 0.8rem, letter-spacing 0.07em, uppercase, radius-pill, padding 12px 24px, same hover transform/box-shadow) — copy-pasted three times under different class prefixes rather than defined once. Every future page that needs a primary CTA will likely paste a fourth copy.
- **Fix:** extract one `.cta-primary` / `.cta-ghost` utility (or a real `<CtaButton variant="primary|ghost">` component) and delete the three duplicates.

Beyond buttons, the same "one bespoke CSS block per page" pattern repeats for cards (`.site-card`, `.bento-cell`, `.jargon-card`, `.labtool-card` — four independently-styled card shells with overlapping but non-identical border/radius/background/hover rules that should likely share a base).

## 6. Tailwind Usage — **Concentrated arbitrary-value debt**
90 arbitrary-bracket Tailwind values (`[Npx]` / `[N.Nrem]`) across 13 files, heavily concentrated in exactly the two pages that also own the largest custom-CSS blocks:
- `app/(site)/start/start-view.tsx` — 35 occurrences
- `app/(site)/process/process-view.tsx` — 27 occurrences
- `app/(site)/type/type-view.tsx` — 6
- `features/offers/investment-value.tsx` — 5

`/start` and `/process` together account for **69% of all arbitrary Tailwind values in the codebase** — they're the least token-disciplined pages, consistent with §2-5 (both pages also introduced their own large custom-CSS sections rather than composing existing utilities).

## 7. Motion System — **Sound, one open item**
- Core physics tokens (`--ease-physics`, `--ease-entrance`, `--ease-exit`, 4 durations) are used consistently in the CSS layer.
- The `AnimatePresence`/`mode="wait"`/`popLayout` bug class (content silently stuck because a state update was gated behind an animation-library exit callback) was found and fixed in 5 components per the 2026-07-11 session (gate-stepper, persona-picker-band, gallery-view, process-view accordion, nav mobile menu).
- Two remaining `AnimatePresence` usages reviewed now:
  - `features/contact/contact-form.tsx` — **not a bug**; comment at line 91 explicitly documents why it was deliberately *replaced* with a plain conditional (this is the fix, not a regression).
  - `features/work/floating-preview.tsx:79` (`mode="popLayout"`) — decorative hover image crossfade only, not gating a functional state transition. Lower risk than the fixed instances, but same library/mode — worth a quick manual check in the Phase 3B regression pass (hover over `/work` preview cards, confirm image swaps don't stick).
- Reduced-motion kill-switch (`globals.css:355-364`) with the marquee exemption (`:438-447`) is a good, explicit, well-commented pattern.

## 8. Layout Consistency — **Fine**
Two container tokens (`--container-content: 76rem`, `--container-wide: 90rem`) are used consistently via the `.container-content`/`.container-wide` utilities. Z-index contract is explicit and centrally defined (`--z-*`, `globals.css:143-150`), with a documented Tailwind v4 gotcha (custom `@theme` z-* values don't auto-generate utilities, so they're re-declared as explicit `@utility` rules at `:387-393`) — correctly worked around, not a bug.

## 9. Design Debt Summary (ranked by impact)
| # | Finding | Impact | Effort to fix |
|---|---|---|---|
| 1 | No shared Button/CTA component — 3 identical copies | High (every new page repeats it) | Low |
| 2 | Accent color opacity hardcoded 49× with ~20 ad hoc values | Medium (hard to retheme) | Medium |
| 3 | `/start` + `/process` hold 69% of all arbitrary Tailwind values | Medium (concentrated, not systemic) | Medium |
| 4 | Untokenized micro type scale (dozens of one-off rem sizes) | Medium (visual drift risk) | Medium |
| 5 | Spacing violates the file's own 8px rule in ~15+ places | Low-medium | Low |
| 6 | 8 hardcoded `"Montserrat"` literals bypassing the RTL font-lock | Low (works today, fragile) | Low |
| 7 | `floating-preview.tsx` `AnimatePresence popLayout` unreviewed live | Low | Verify only |

## 10. Maintainability Outlook
The token foundation (`@theme` block) is genuinely enterprise-grade and the right base to build on — the fix is not "redesign the tokens," it's "migrate the ~1,830 lines of page-specific CSS to actually consume them," starting with the CTA-button triplication (#1) since it's the highest-impact, lowest-effort item.

---
**Next: Phase 3B (Visual Audit)** — pending screenshot tool availability. Will validate: rendered spacing rhythm, color contrast in both themes, actual visual consistency of the 4 card variants (§5), and the `floating-preview.tsx` hover interaction (§7) live in-browser.
