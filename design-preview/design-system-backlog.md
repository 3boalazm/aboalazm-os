# Design System Refactoring Backlog
Source: [`design-system-audit-phase3a.md`](design-system-audit-phase3a.md) · Status: **Phase 4 executed 2026-09-18 — see [`design-system-phase4-2026-09-18.md`](design-system-phase4-2026-09-18.md). P1-1/P1-2/P2-2/P3-1/P3-3 closed below.**

Priority key: **P0** Must Fix (breaks something / actively wrong) · **P1** High ROI (small effort, high leverage) · **P2** Nice to Have (polish, low urgency) · **P3** Technical Debt (correct today, fragile/costly long-term)

---

## P0 — Must Fix

### P0-1 · [FIXED & VERIFIED] `floating-preview.tsx` invisible under reduced-motion
- **Source:** Audit §7 → verified broken 2026-07-11 (V2) → fixed & verified 2026-07-11
- **Status:** ✅ **FIXED AND VERIFIED.**
- **Root cause:** `features/work/floating-preview.tsx` rendered the hover-preview card via a raw Framer Motion `animate` prop (`initial: {opacity:0, scale:0.82, y:12}` → `animate: {opacity:1, scale:1, y:0}`) with no reduced-motion branch — the one component that slipped through the 13-component `reduceMotion` sprint from the 2026-07-11 QA pass.
- **Fix applied** (matches the exact pattern already in `gate-stepper.tsx` and `gallery-view.tsx` — no new implementation introduced):
  - Imported `useReducedMotion` from `framer-motion` (already a project dependency).
  - Added `const reduceMotion = useReducedMotion();` inside the component.
  - Changed `initial={{ opacity: 0, scale: 0.82, y: 12 }}` → `initial={reduceMotion ? false : { opacity: 0, scale: 0.82, y: 12 }}`.
  - `animate`, `exit`, and `transition` props untouched — non-reduced-motion behavior is byte-identical to before.
- **Verification performed:**
  - `npm run typecheck` — clean, no errors.
  - `npm run build` — production build succeeded, `/work` route unchanged at 8.7 kB.
  - Local dev server (`next dev --turbopack`), live DOM inspection on `/work`:
    - Normal motion (`prefers-reduced-motion: no-preference`): hover → card animates to `opacity: 1; transform: none` — unchanged from pre-fix behavior.
    - Reduced motion (`prefers-reduced-motion: reduce`): hover → card renders **immediately** at `opacity: 1; transform: none` — confirmed fixed, no longer stuck at `opacity: 0`.
- **New, separate finding surfaced during verification (NOT fixed, out of scope for this task):** while testing row-to-row hover switching, the *outgoing* preview card does not unmount — hovering row A then row B leaves both cards in the DOM simultaneously (`opacity: 1` each), reproduced identically under both normal and reduced motion, so it predates and is unrelated to this fix. Likely an `AnimatePresence mode="popLayout"` exit-not-completing issue tied to how `onPointerEnter`/`onMouseLeave` are wired in `features/work/project-ledger.tsx` (the ledger only clears `active` on full ledger `onMouseLeave`, not on row-to-row switches — but the AnimatePresence `key` does change, so exit should still run and didn't). **Logged as a new backlog candidate below (P0-3) — not touched, per explicit "modify only floating-preview.tsx" / "no other refactors" scope for this task.**
- **Affected files:** `features/work/floating-preview.tsx` only, as instructed.
- **Migration risk:** None realized — build, typecheck, and live behavior all confirm no regression to the entrance animation.

### P0-3 · [NEW — surfaced during P0-1 verification, not yet triaged] Floating-preview card doesn't unmount on row switch
- **Source:** Discovered live while verifying P0-1 (2026-07-11), reproduced on local dev build.
- **What:** On `/work`, hovering project row A then row B (without the pointer leaving the ledger list entirely) leaves **both** preview cards mounted at `opacity: 1` — the outgoing card's `exit` animation never runs/completes. Reproduced identically with `prefers-reduced-motion` both on and off, so it's independent of the P0-1 fix (pre-existing).
- **Impact:** Medium — visually, a second stale preview card lingers behind/near the live one on `/work` when moving between rows quickly; doesn't block content (unlike P0-1), but is a visible glitch on the studio's most portfolio-critical page.
- **Effort:** Unestimated — needs isolated repro first (a plain browser test, not just automated hover, to rule out a synthetic-event artifact) before scoping a fix.
- **Affected files:** `features/work/floating-preview.tsx` and/or `features/work/project-ledger.tsx` (hover-state wiring).
- **Migration risk:** Unknown pending investigation.
- **Status:** Not fixed, not prioritized — flagging for your triage alongside the rest of the backlog. Recommend a first pass in a real (non-automated) browser to confirm this isn't a testing-harness artifact before scheduling work.

### P0-2 · [VERIFIED — PASS] Zad iframe loads clean on live
- **Source:** Handoff carry-over from 2026-07-11 session → verified 2026-07-11 (V1)
- **Status:** ✅ **PASS.** Live `iframe.src` on `/work-ui` confirmed as `https://zad.codeandcanvas.net/`; no mixed-content console warnings. Closed, no further action.

---

## P1 — High ROI

### P1-1 · [RESOLVED] Extract shared CTA button (kill the triple duplication)
- **Status:** ✅ Resolved by the Button primitive sprint — see [`sprint-button-primitive.md`](sprint-button-primitive.md) (`components/ui/Button.tsx`, 11 files / 17 sites migrated, production-complete).
- **Source:** Audit §5
- **What:** `.not-found-cta`, `.start-cta`, `.process-cta` (primary + ghost, 6 classes total) are byte-for-byte identical. Consolidate into one `.cta-primary` / `.cta-ghost` utility or a `<CtaButton>` component.
- **Impact:** High — removes the single largest duplication in the codebase; every future page currently invites a 4th copy-paste.
- **Effort:** Low (~1-2 hrs): define once, swap 3 call sites, delete ~60 lines of CSS.
- **Affected files:** `app/(site)/globals.css` (lines 778-811, 920-955, 1087-1121), plus the `.tsx` files rendering `not-found-cta*`/`start-cta*`/`process-cta*` class names (need a grep pass to enumerate exact call sites before touching).
- **Migration risk:** Low — purely additive if done as "new shared class, old classes kept as aliases during transition," but true cleanup requires touching 3+ page files. Visual regression risk is low since all 3 are pixel-identical already; still should be confirmed in Phase 3B before/after.

### P1-2 · [DONE 2026-09-18] Consolidate accent-opacity color soup into named tokens
- **Status:** ✅ Done in Phase 4 — 12-step `--color-accent-NN` ramp in `@theme`; all 41 hardcoded sites snapped (Δ ≤ 0.05, snap table in the Phase 4 doc §1); zero raw accent rgb() outside definitions; JS mirror updated in `lib/tokens.ts`. Also delivered alongside: contrast-safe `accent-text`/`accent-border`, completed role ramps, and the new status set.
- **Source:** Audit §2
- **What:** Replace ~20 ad hoc `rgb(255 107 71 / N)` opacity values (49 occurrences) with 3-4 semantic tokens (e.g. `--color-accent-08`, `-16`, `-32`) following the existing `--color-accent-dim` pattern.
- **Impact:** Medium-high — unlocks retheming, removes guesswork on which opacity to reach for in new code.
- **Effort:** Medium (~3-4 hrs): audit which of the ~20 values are true duplicates vs. genuinely distinct, define the token set, find/replace across `globals.css`.
- **Affected files:** `app/(site)/globals.css` only (all instances are in this one file per the grep).
- **Migration risk:** Medium — find/replace across 49 sites in one file is mechanical but easy to fat-finger an opacity step; needs a visual diff pass (Phase 3B) after, not before.

### P1-3 · [PARTIAL 2026-09-18] Reduce `/start` and `/process` arbitrary-Tailwind debt
- **Status:** 🟡 All **typography** arbitrary values on both pages migrated to tokens (Phase 4 §2); all **color** arbitrary values tokenized (accent-border/08). Remaining arbitrary values are layout/spacing (`px-[24px] py-[12px]` CTA paddings, `[2px]` hover lifts, `[900px]`-style max-widths) — the CTA paddings are the CSS-trio family's deliberately measured values per the Button sprint, so they stay until the spacing sprint (P3-2).
- **Source:** Audit §6
- **What:** 62 of the 90 total arbitrary-bracket Tailwind values (`[Npx]`/`[N.Nrem]`) live in these two files alone (35 + 27). Map them onto existing spacing/type tokens where a clean match exists.
- **Impact:** Medium — these two pages are the least systemized; fixing them closes most of the arbitrary-value gap codebase-wide in one pass.
- **Effort:** Medium-high (~1 day): each arbitrary value needs individual judgment (intentional one-off vs. should-be-token), not a blind find/replace.
- **Affected files:** `app/(site)/start/start-view.tsx`, `app/(site)/process/process-view.tsx`.
- **Migration risk:** Medium — these are the two most visually complex custom pages; layout-affecting changes here have the highest chance of visible regression, should follow (not precede) Phase 3B baseline screenshots.

---

## P2 — Nice to Have

### P2-1 · Consolidate the 4 card-shell variants
- **Source:** Audit §5
- **What:** `.site-card`, `.bento-cell`, `.jargon-card`, `.labtool-card` each independently define overlapping border/radius/background/hover rules. Candidate for one base `.card` class with modifiers.
- **Impact:** Medium — maintainability win, no user-visible change if done right.
- **Effort:** Medium (~half day): the 4 aren't identical (unlike the CTAs), so this requires diffing exact property differences first, not just merging.
- **Affected files:** `app/(site)/globals.css` + call sites in `features/gallery/`, `app/(site)/start/`, and wherever `.jargon-card`/`.labtool-card` render.
- **Migration risk:** Medium — genuine visual differences exist between the 4 today; risk of accidentally normalizing away an intentional distinction. Needs Phase 3B screenshots of all 4 as a baseline first.

### P2-2 · [DONE 2026-09-18] Untokenized micro type scale cleanup
- **Status:** ✅ Done in Phase 4 — scale extended 7 → 11 steps (`caption` 11px floor, `body-lg`, fluid `subtitle`); 61/61 one-off CSS font-sizes + all TSX arbitrary text sizes mapped; documented exceptions listed in the Phase 4 doc §2. The design decision the backlog flagged ("expand the scale vs. map down") was resolved as **expand by 3 steps + snap everything up to the 11px floor**.
- **Source:** Audit §3
- **What:** Dozens of one-off rem font sizes (0.63–1.6rem range) outside the 7 defined `--text-*` tokens, mostly in `.labtool-*`, `.gate-*`, `.persona-*`, `.not-found-*`.
- **Impact:** Medium-low — visual drift risk over time, not currently broken.
- **Effort:** High (~1-2 days): requires deciding whether to expand the token scale (add 2-3 more steps) or map existing values down to the current 7 — a design decision, not just mechanical.
- **Affected files:** `app/(site)/globals.css` (majority), scattered across many components' inline classes.
- **Migration risk:** Low-medium, but high effort-to-impact ratio relative to P1 items — lowest-priority "real" item in the backlog.

---

## P3 — Technical Debt

### P3-1 · [DONE 2026-09-18] Route hardcoded `"Montserrat"` literals through `var(--font-sans)`
- **Status:** ✅ Done in Phase 4 — the audit's 8 CSS sites **plus 28 more TSX inline styles** found this pass (same defect class); all now `var(--font-sans)` so the RTL font-lock covers them. `/type` specimen keeps literal Montserrat by design.
- **Source:** Audit §3
- **What:** 8 places hardcode `font-family: "Montserrat", var(--font-sans);` instead of `var(--font-sans)` alone, bypassing the deliberate RTL font-lock system.
- **Impact:** Low today (works via per-glyph fallback), but fragile — any future explicit Latin fallback added after Montserrat would silently break Arabic rendering in exactly these 8 spots.
- **Effort:** Trivial (~15 min): mechanical find/replace, 8 sites.
- **Affected files:** `app/(site)/globals.css` (`.labtool-card__sub`, `.hook-sub`, `.jargon-note`, `.not-found-sub`, `.not-found-body`, `.persona-band__skip`, `.labtool-bilingual-tag`, `.labtool-samplebox__text`).
- **Migration risk:** Very low — behavior-preserving by design, no visual change expected in either language.

### P3-2 · Spacing values off the 8px grid
- **Source:** Audit §4
- **What:** 15+ instances of `gap`/`padding` in 2-14px increments that don't map to the `--spacing: 8px` scale (violates the file's own documented rule).
- **Impact:** Low — mostly optical micro-adjustments in dense UI (`.gate-terminal__bar`, `.work-filter`, `.persona-toggle`), arguably intentional in some cases.
- **Effort:** Medium (~half day): each value needs a judgment call — "round to nearest 8px step" vs. "this micro-adjustment is load-bearing for optical alignment, document it as an explicit exception instead."
- **Affected files:** `app/(site)/globals.css`, scattered.
- **Migration risk:** Low, but easy to introduce visually-worse spacing if rounded blindly — lowest urgency, do last.

### P3-3 · [DONE 2026-09-18] Drop the dead `var(--radius-panel, var(--radius-card))` fallback
- **Status:** ✅ Done in Phase 4 (`.bento-cell` now `var(--radius-panel)`).
- **Source:** Audit §4 (noted in passing, not previously itemized)
- **What:** `.bento-cell` (globals.css:1528) uses a fallback for `--radius-panel` even though it's unconditionally defined in `@theme` — dead code, mildly confusing.
- **Impact:** Negligible — cosmetic code-cleanliness only.
- **Effort:** Trivial (1 line).
- **Affected files:** `app/(site)/globals.css:1528`.
- **Migration risk:** None.

---

## Summary Table

| ID | Title | Priority | Impact | Effort | Files | Risk |
|---|---|---|---|---|---|---|
| P0-1 | ✅ FIXED: floating-preview invisible under reduced-motion | P0 | High (resolved) | Low | 1 | None realized |
| P0-2 | ✅ VERIFIED: Zad iframe live, clean | P0 | — (closed) | — | 0 | — |
| P0-3 | 🆕 NEW: floating-preview card doesn't unmount on row switch | P0 (untriaged) | Medium | Unestimated | 1-2 | Unknown |
| P1-1 | ✅ RESOLVED: shared CTA button (Button primitive sprint) | P1 | High | Low | ~4-5 | Low |
| P1-2 | ✅ DONE 2026-09-18: accent-opacity tokens (12-step ramp) | P1 | Med-High | Medium | 1 | Medium |
| P1-3 | 🟡 PARTIAL 2026-09-18: `/start` + `/process` type/color done; layout values pending P3-2 | P1 | Medium | Med-High | 2 | Medium |
| P2-1 | Consolidate 4 card-shell variants | P2 | Medium | Medium | ~4-5 | Medium |
| P2-2 | ✅ DONE 2026-09-18: micro type scale (11-step scale + floor) | P2 | Med-Low | High | many | Low-Med |
| P3-1 | ✅ DONE 2026-09-18: Montserrat literals (36 sites, CSS + TSX) | P3 | Low | Trivial | 1+ | Very Low |
| P3-2 | Off-grid spacing values (audited 2026-09-18, untouched by design) | P3 | Low | Medium | 1 | Low |
| P3-3 | ✅ DONE 2026-09-18: dead radius-panel fallback | P3 | Negligible | Trivial | 1 | None |
| NEW-1 | Icon sweep follow-up: print deck toolbar + diagram labels still Unicode (documented exceptions, Phase 4 §4) | P3 | Low | Low | 3 | None |

**Recommended sequencing once both audits are done:** P0s first (verification only, can run anytime — no need to wait for Phase 3B), then P1-1 → P1-2 → P1-3 in order (each is a prerequisite-free, standalone win), then P2/P3 as capacity allows. Every item touching `globals.css` visually (P1-2, P1-3, P2-1, P2-2, P3-2) should run its own before/after screenshot diff once Phase 3B tooling is available — P0 and P3-1/P3-3 are behavior-preserving and don't strictly need one.
