# Design System — Phase 4: Palette completion, typography unification, icon system
Date: 2026-09-18 · Continues the interrupted audit of 11 Sep (colors / typography /
spacing / icons over updated `main`). Scope executed: **audit → plan → apply**, with
technical verification on every step. No new dependency was added.

---

## 0 · TL;DR

Three gaps were confirmed by measurement, and all three now have a system in place:

| Gap (as found) | Resolution |
|---|---|
| Palette existed only partially as semantic tokens — effectively 2 dominant colors (monochrome + orange) | Full semantic palette: 12-step accent alpha ramp, completed violet/cyan/lime role ramps, new contrast-safe `accent-text`/`accent-border`, and a theme-aware **status set** (success / warning / danger / info × base/text/dim/border) |
| Typography leaned on arbitrary values, especially mobile (~100 one-off sizes, some sub-9px) | 3 new scale steps (`caption` floor, `body-lg`, fluid `subtitle`), 61 CSS + ~80 TSX one-offs mapped onto tokens, hardcoded Montserrat literals killed, RTL font-lock now covers every body-text site |
| Icons were raw Unicode (→ ← ↑ ↓ ↗ ✕ ✓ ★ ✦ ◆ ☰ ☀ ☾) across ~36 files | New `components/ui/Icon.tsx` — 21 hand-drawn 24px stroke icons, currentColor, RTL auto-flip, `1em` default; **~30 surfaces migrated**, the rest are documented content exceptions |

Verification: `tsc --noEmit` clean · full `next build` succeeds (56 pages) · dev
render against real Postgres: 18 routes at HTTP 200 · compiled-CSS probe confirms
every new utility generates · DOM probe confirms icons render with RTL classes.

---

## 1 · Color — audit findings → implemented system

### Findings (measured before any edit)

1. **Accent opacity soup — 41 hardcoded sites, 26 distinct alphas.**
   `rgb(255 107 71 / N)` appeared in `globals.css` with alphas from 0.02 to 0.85
   (0.02, 0.025, 0.04×4, 0.05×2, 0.06×3, 0.08×4, 0.10, 0.12, 0.14, 0.15, 0.20×2,
   0.24, 0.25×2, 0.30×2, 0.35×2, 0.40×5, 0.45, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8×2, 0.85).
   The 4 named steps that existed (08/14/24/40) were used in exactly 2 places.
2. **Accent fails as small type on Alabaster.** #FF6B47 measures **2.7:1** on
   #FBF9F6 — fails WCAG AA even for large text. Every `text-accent` on a light
   surface was below contrast (badges, nav active state, ghost CTAs).
3. **Role ramps were thin and light-mode values were raw hex.** Violet had 300/500
   only; cyan 300/400; lime 300/400. Light mode `--color-*-text` pointed at inline
   hexes (#6D28D9 etc.) instead of primitives.
4. **No functional status tokens at all.** Success green was a hardcoded `#3DDC84`
   in 5 sites (3 CSS, 2 TSX) — a fourth off-palette green next to the diagram set.
5. Badge `success` tone used raw Tailwind `emerald-400`.

### What was built

**Accent alpha ramp — 12 named steps** (`@theme`, generates utilities):
`04 · 08 · 14 · 20 · 24 · 32 · 40 · 48 · 64 · 72 · 80 · 88`
Chosen so all 41 historical values snap with Δ ≤ 0.05 (most ≤ 0.03). All 41 sites
migrated; **zero raw accent rgb() remain outside the token definitions**. Snap map:
0.02/0.025/0.04/0.05→04 · 0.06/0.08/0.10→08 · 0.12/0.14/0.15→14 · 0.20→20 ·
0.24/0.25→24 · 0.30/0.35→32 · 0.40/0.45→40 · 0.5→48 · 0.6/0.65→64 · 0.7/0.75→72 ·
0.8→80 · 0.85→88. `--color-accent-dim` kept as an alias of 14 (4 consumers).

**Contrast-safe accent members:**
- `--color-accent-text` — equals the anchor on Obsidian (7.1:1 already), reassigned
  to `#C2410C` (**4.9:1**) on Alabaster. Dark mode: zero visual change anywhere.
- `--color-accent-border` — alias of the 32 step; borders speak the ramp.
- Badge `accent` tone and the not-found ghost CTA moved onto these.

**Completed role ramps** (primitives, Tailwind-aligned): violet 300/400/500/700,
cyan 300/400/700, lime 300/400/700. Light-mode role text now resolves through
primitives instead of inline hex.

**Functional status set** (declared in `@theme` on purpose → real utilities like
`bg-success-dim`, `text-success-text`):
| state | dark base / text | light base / text |
|---|---|---|
| success | #34D399 / #6EE7B7 | #059669 / #047857 |
| warning | #FBBF24 / #FCD34D | #D97706 / #B45309 |
| danger  | #F87171 / #FCA5A5 | #DC2626 / #B91C1C |
| info    | #60A5FA / #93C5FD | #2563EB / #1D4ED8 |
plus `-dim` washes and `-border` hairlines per state, per theme. All 5 `#3DDC84`
sites migrated (checklist ✓ in pricing, KEEP verdicts, contact success line,
labtool pass states, hero status pulse via `COLOR.status.success` in
`lib/tokens.ts` — the JS mirror carries the new ramp + roles + status too).

**Palette after this pass** (all semantic, all theme-aware):
canvas (obsidian/alabaster) · surfaces 0–3 · borders 3 steps · text 4 steps ·
accent (solid + 12 alphas + text + border) · creative/live/proof (base/dim/border/
text × dark+light) · success/warning/danger/info (4 members × dark+light) ·
diagram node set (illustration, intentionally separate).

---

## 2 · Typography — audit findings → implemented system

### Findings

- **Second informal scale in CSS:** 61 one-off `font-size` declarations in
  `globals.css` custom blocks (0.53–1.6rem), the `.gate-*` / `.labtool-*` /
  `.persona-*` / `.not-found-*` families — exactly where the July audit pointed.
- **~100 arbitrary `text-[..]` in TSX**, concentrated: `/start` 38, `/process` 26,
  `/type` 7, `investment-value` 5, plus nav/footer/gate-stepper/home-bands/etc.
- **Sub-9px text existed** — `0.53rem` (8.5px), `0.55–0.62rem` terminal chrome.
  Illegible at 390px and below any accessibility floor.
- **Font-lock leaks:** 8 hardcoded `"Montserrat"` literals in `globals.css`
  (backlog P3-1) **plus 28 more** `style={{ fontFamily: "Montserrat, system-ui" }}`
  in TSX — all bypassing the RTL font-lock, so Arabic in those spots silently fell
  through glyph fallback.
- Mobile sizes were not a separate problem — the display steps are already `clamp()`
  fluid; the problem was the ~160 untokenized one-offs *around* them.

### What was built

**Scale: 7 → 11 steps.** New tokens (each ships its own line-height, tracking
where earned, via Tailwind v4 `--text-*--line-height/--letter-spacing` pairing):

| token | size | role |
|---|---|---|
| `subtitle` | clamp(1.125 → 1.375)rem, lh 1.3 | section subtitles, card titles, statements — absorbs 1.1–1.4rem one-offs |
| `body-lg` | 1.0625rem, lh 1.6 | long-form emphasis — absorbs 1.05rem |
| `caption` | **0.6875rem (11px), the FLOOR**, lh 1.35, ls 0.08em | terminal chrome, index markers, dense metadata — absorbs everything 0.53–0.72rem |

Nothing readable renders under 11px anymore. Display steps (`hero`/`display`/
`title`) unchanged — they were already fluid and were tuned on 18 Sep morning.

**Migration (values → nearest token):**
- `globals.css`: **61/61** one-off font-sizes mapped (0.53–0.71→caption ·
  0.75–0.78→micro · 0.8–0.82→label · 0.85–0.9→body-sm · 1→body · 1.05→body-lg ·
  1.1–1.6→subtitle · three display clamps → title/body-lg).
- TSX: all arbitrary small sizes in `/start`, `/process`, `/type`, pricing,
  nav, footer, gate-stepper, home-bands, github-band, diagram (11px→caption is
  exact), not-found CTAs → tokens. Explicit `leading-*`/`tracking-*` overrides are
  preserved by construction (verified against Tailwind v4's `--tw-leading` /
  `--tw-tracking` cascade mechanism before migrating).
- RTL/Arabic: `caption` tracking zeroes via the existing `[lang="ar"]` rule;
  `subtitle`/`body-lg`/`caption` added to the body-text font lock.

**Font-lock completed:** 8/8 CSS literals + 28/28 TSX inline styles now route
through `var(--font-sans)` — Arabic gets IBM Plex Sans Arabic everywhere. The
`/type` specimen page keeps literal Montserrat **by design** (it exhibits the face).

**Deliberate exceptions (documented, not forgotten):**
- Page-display clamps on `/start` `/process` `investment-value` (2rem–6rem hero
  ranges) — candidates for a future `display-sm` step if a third page needs them.
- Footer wordmark `text-[1.6rem]` (one site, identity-sized).
- `/type` specimen clamps (exhibit content) · `9px` SVG diagram text (viewBox
  coordinate space, not typography) · `text-[0.55em]` metric unit (relative em).
- Stats number `text-[2rem]` in `/process` (display data).

---

## 3 · Spacing — audited, intentionally not touched this pass

Measured state (for the record): the 8px rule holds in all Tailwind usage; the
violations remain the ~15 hand-written 2–10px micro-values the July audit listed
(`.gate-terminal__bar`, `.work-filter`, `.persona-toggle`), all in dense UI where
some are optically load-bearing. Per the backlog's own sequencing ("visually risky,
do last, needs before/after screenshots"), this pass **audits only** — nothing here
was worth a blind rounding. The new icon system did remove one class of spacing
noise (glyph baselines needed manual nudges; icons align by construction).

---

## 4 · Icons — audit findings → implemented system

### Findings

~110 raw Unicode glyphs across ~36 files (→ ×52, ↗ ×17, ← ×11, ↓ ×9, ↑ ×3,
✓ ×8, ★ ×9, ✕ ×5, ✦ ×4, ◆ ×1, ☰ ☀ ☾ ×4, « » › ×5). Problems: per-OS font
rendering differences, no stroke-weight relationship to the UI, **no RTL behavior**
(Arabic CTAs pointed the wrong way or hard-swapped glyphs manually), and no way to
size/align consistently. One inline SVG existed (GitHub mark in `github-band`).

### What was built

**`components/ui/Icon.tsx`** — zero-dependency, 21 icons on one canvas:
24×24 viewBox · stroke 1.5 · round caps/joins · `currentColor` · default size
`1em` (tracks the surrounding type token like the glyph it replaces).
Set: `arrow-right/left/up/down`, `arrow-up-right` (external), `x`, `check`,
`star`, `star-solid`, `sparkle`, `diamond`, `chevron-up/down/left/right`, `menu`,
`sun`, `moon`, `download`, `lock`.

System rules baked in:
- **RTL auto-flip** — directional icons mirror via `rtl:-scale-x-100`; `flip={false}`
  for literal arrows. This silently fixed several wrong-pointing Arabic CTAs
  (e.g. writing prev/next hardcoded `←` in AR).
- Decorative by default (`aria-hidden`); `title` upgrades to `role="img"`.
- Only filled marks are `star-solid`/`sparkle`/`diamond`.

### Migration inventory (~30 surfaces)

Layout: **nav** (sun/moon theme flip, menu/x trigger, contact arrow, portfolio ↓),
**footer** (all ↗/↓ labels now render as icons from the same strings).
Work: **project-ledger** (↗ mobile + desktop affordances), **featured-cases**
(→ see-all, ↗ CTA). Pricing: **offer-blocks** (✓/✕ rows — ✓ now rides
`text-success`, recommended ★ ×3, ✦/→ CTA pair). Process: **gate-stepper**
(node ✓), **process-view** (accordion ‹› → chevron with rotate, journey → separators,
✓ deliverables). Errors: **not-found** + **error** CTAs (arrows out of copy
strings, icons in). Home: **hero** (explore →), **home-bands** (marquee ✦,
two CTA arrows), **github-band** (◆ kicker, ↗ CTA). Others: writing detail
(↑ top, ← back, prev/next), books + reader (→ open, ← back, menu/x), labs,
services (✦ + → buttons), about (CV ↓), why, contact channels, resources
(→ spine, ↓ download, 🔒→lock), gallery (✕ close, › next, ↗ project link),
work-ui live preview (↗), token playground, type-scale tool (✓ copied),
terminal (esc ✕).

**Documented exceptions:** the `/portfolio` print deck (chrome-free root that
deliberately never loads site CSS — its toolbar glyphs stay), diagram/constellation/
mermaid labels (illustration content), terminal shell output (→ is the prompt
fiction), commit-log strings, career timeline "2024 →", agreement prose arrows,
Arabic «» guillemets.

---

## 5 · Verification

| Check | Result |
|---|---|
| `npm run typecheck` | clean, at every stage |
| `next build` (with live Postgres) | **succeeds — 56 pages**, same count as the 18-Sep morning pass |
| Compiled-CSS probe (PostCSS + project config) | all new utilities generate: `text-caption/subtitle/body-lg`, `bg-accent-08`, `border-accent-border/-32`, `text-accent-text`, `text-success-text/bg-success-dim/border-success-border`, `rtl:-scale-x-100`, `align-[-0.125em]` |
| Dev render vs real Postgres (embedded PG 18) | 18/18 routes HTTP 200 (`/ /work /pricing /start /process /contact /writing /labs /type /about /services /why /books /gallery /agreement /resources /work-ui`) |
| DOM probe | icons render with `viewBox 24` / stroke 1.5 / `aria-hidden` / `rtl:-scale-x-100`; new type tokens present in output HTML |
| Post-edit glyph sweep | remaining Unicode is 100% comments or documented content exceptions |

**Verification gap, stated plainly:** no headless browser was installable in this
sandbox (Playwright/Puppeteer CDNs unreachable), so no pixel diff was run. The two
riskiest visual deltas are the `/gate-*` `/labtool-*` micro-type bump to the 11px
caption floor (sizes go up ≤ 30% at the small end) and the light-mode accent-text
deepening. Both are deliberate audit outcomes, not accidents — flagging for the
first human eyeball pass.

---

## 6 · Files touched

```
app/(site)/globals.css            ramp + status tokens, 61 font-sizes, 8 font-locks,
                                  accent soup collapse, rules header updated
lib/tokens.ts                     JS mirror: ramp 12 steps, roles, status
components/ui/Icon.tsx            NEW — the icon system (21 icons)
components/ui/Badge.tsx           accent/success tones onto tokens
components/layout/nav.tsx         sun/moon/menu/x/arrow + MORE ↓ handling
components/layout/footer.tsx      ↗/↓ labels → icons
features/hero/hero.tsx            explore arrow
features/hero/status-node.tsx     pulse green → COLOR.status.success
features/work/project-ledger.tsx  ↗ affordances
features/work/featured-cases.tsx  → / ↗ CTAs
features/offers/offer-blocks.tsx  ✓ ✕ ★ ✦ → + success token
features/process/gate-stepper.tsx node ✓
features/errors/not-found-content.tsx + app/(site)/error.tsx   CTAs
features/contact/contact-form.tsx  success color
features/gallery/gallery-view.tsx  ✕ › ↗
features/home/home-bands.tsx       ✦ separator, two arrows
features/home/github-band.tsx      ◆ ↗
features/resources/resource-blocks.tsx  → ↓ lock
features/terminal/terminal-overlay.tsx  esc ✕
features/labs-tools/type-scale-tool.tsx ✓ copied
features/playground/token-playground.tsx reset arrow
features/work-ui/live-preview-card.tsx ↗
features/case-studies/panels.tsx   KEEP verdict color
app/(site)/{start,process,type,about,services,why,labs,books,writing,
agreement,contact,portfolio}/*    type tokens + icon migrations
```

Reverting is one `git revert`. The DB schema, routes, data models, and every
component API are untouched.
<<<<<<< HEAD
=======

---

## 7 · Addendum — cyan & lime ramps completed (same day)

Follow-up request: cyan + lime shades that sit well with orange + black (dark)
and orange + off-white (light). The roles existed but only as 3-step fragments
(300/400/700). Now both are **full 8-step ramps** (100→800):

| step | cyan (`live`) | lime (`proof`) | reach for it when |
|---|---|---|---|
| 100–200 | #CFFAFE · #A5F3FC | #ECFCCB · #D9F99D | whispers / highlight washes |
| 300 | #67E8F9 ⚓ | #BEF264 ⚓ | text tint on **Obsidian** (dark) |
| 400 | #22D3EE ⚓ | #A3E635 ⚓ | the role itself — fills, markers, glow |
| 500 | #06B6D4 | #84CC16 | hover / interactive |
| 600 | #0891B2 | #65A30D | pressed / emphasis on light |
| 700 | #0E7490 ⚓ | #4D7C0F ⚓ | text on **Alabaster** (light) |
| 800 | #155E75 | #3F6212 | deep edges on light, never large fills |

⚓ = audited anchor, byte-identical to before — every live surface keeps its
exact colour; only the gaps between were filled. Harmony logic: cyan ≈ 190° is
the **complement** of the #FF6B47 anchor (~11°), lime ≈ 80° its warm neighbour —
so both read as family with the orange on either canvas, never as foreign hues.
Semantic tokens (`-dim`/`-border`/`-text`, both themes) unchanged — they already
picked the theme-correct steps. JS mirror gained `COLOR.liveRamp` /
`COLOR.proofRamp` per the both-places contract.
>>>>>>> arena/01a0b5cf-aboalazm-os
