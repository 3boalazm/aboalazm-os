# Sprint 1-C — PanelCard Implementation

Scope: **PanelCard only**, per `design-preview/sprint-card-audit.md` and its validation pass. MediaCard is untouched. Typography was **not** normalized — every arbitrary-value/inline-Montserrat site keeps its exact prior typography via `className`.

## Implementation Summary

Created `components/ui/PanelCard.tsx` — the smallest primitive the evidence supports:

```tsx
const EMPHASIS = {
  default: "border-border-subtle bg-surface-1",      // most common resting state
  accent:  "border-accent bg-surface-1 shadow-card", // TierCard/start-view "recommended" tier
  dimmed:  "border-border-subtle bg-surface-1/60",   // TierCard/start-view non-recommended + investment value-prop
} as const;
```

- **`emphasis`** — 3 values, each backed by ≥2 literally-identical call sites (verified in the validation pass, not assumed).
- **`interactive`** — boolean, adds the exact `transition-colors duration-base ease-physics hover:border-border-strong` bundle shared byte-for-byte by `research-area` (labs) and — partially — `ResourceCard`. Used directly only where the bundle is unconditional (research-area); `ResourceCard`'s conditional hover is composed manually via `panelCardVariants()` instead (see below).
- **`as`** — `'div' | 'article'`, both with a real consumer.
- **`className`** — always required in practice, since radius, padding, and one-off border/bg tweaks (`border-accent/40`, `border-accent/20`, `bg-surface-1/50`, `hover:border-accent/40`) are never baked in — they vary per site and are passed through, merged with `cn()` (tailwind-merge-aware, so a caller's `bg-surface-1/50` correctly overrides the base `bg-surface-1`, etc.).

Also exported `panelCardVariants()` — a class-string builder (mirrors `buttonVariants()` in `components/ui/Button.tsx`) for the 6 call sites where the card surface must stay something PanelCard can't render as an element: a Next.js `<Link>` (books), or a `motion.div`/`motion.article` (investment metric card, investment value-prop card, process operating-principles card, start-view's how-do-start step card, ResourceCard).

**No speculative props.** `density`, `captionMode`-style helpers, and an `li` value for `as` were all considered during the validation pass and dropped — none had a real call site.

## Files Changed

| File | Change |
|---|---|
| `components/ui/PanelCard.tsx` | **New**, 62 lines |
| `features/offers/offer-blocks.tsx` | `TierCard` → `<PanelCard emphasis>` |
| `app/(site)/start/start-view.tsx` | 4 sites: tier card → `<PanelCard emphasis>`; fits/not-fits cards → `<PanelCard className>` (border/bg override); how-do-start step → `panelCardVariants()` (motion.div) |
| `features/resources/resource-blocks.tsx` | `ResourceCard` → `panelCardVariants()` (motion.article, conditional hover composed manually) |
| `app/(site)/labs/labs-view.tsx` | research-area card → `<PanelCard as="article" interactive>` |
| `features/offers/investment-value.tsx` | metric card + value-prop card → `panelCardVariants()` (motion.div ×2) |
| `app/(site)/process/process-view.tsx` | operating-principles card → `panelCardVariants()` (motion.div) |
| `app/(site)/books/books-view.tsx` | book card → `panelCardVariants()` (Next `Link`) |
| `app/(site)/agreement/agreement-view.tsx` | discovery-question card → `<PanelCard className="rounded-card p-3">` |
| `app/(site)/type/type-view.tsx` | 4× context panel → `<PanelCard className="rounded-panel p-8">` |
| `app/(site)/globals.css` | Deleted `.jargon-card` and `.persona-emphasis` (+ its `::before`) |

**Not touched**, confirmed out of scope: `process-view.tsx`'s phase-detail expand panel and its nested "gate" block (never part of the validated 13-row PanelCard evidence set), `SpineRail`/`EmailGate`/`PaymentBlock` in `resource-blocks.tsx`, all MediaCard candidates, all typography (every arbitrary-value/inline-Montserrat site keeps its exact prior classes/styles).

## Migration Statistics

- **13 call sites migrated** across **9 feature/page files** + 1 new primitive file.
- **11 files touched** by `git diff --stat` (10 modified + `PanelCard.tsx` new, untracked so not in the stat tool but counted here): **49 insertions, 69 deletions** in the modified files (net **‑20 LOC**) plus **+62 LOC** for the new primitive — net **+42 LOC** repo-wide. This is expected and consistent with the original audit's estimate: the win is centralizing the box logic in one reviewable place, not a line-count reduction, since most call sites still carry a full `className` string for their own padding/radius/layout.
- **Duplicated Tailwind class-substrings eliminated**: the conditional `tier.recommended ? "border-accent bg-surface-1 shadow-card" : "border-border-subtle bg-surface-1/60"` ternary, previously hand-written independently in `offer-blocks.tsx` and `start-view.tsx`, now exists in exactly one place (`PanelCard`'s `EMPHASIS` map). The `border-border-subtle bg-surface-1` pair, previously repeated literally in 8 different files, is now sourced from one constant.
- **`.jargon-card`**: 9 lines removed from `globals.css`.
- **`.persona-emphasis`**: 16 lines removed from `globals.css` (rule + `::before` + its explanatory comment).

## Regression Results

- **`npm run typecheck`** — clean, 0 errors.
- **`npm run build`** — succeeded, exit 0, all 54 routes generated (`Generating static pages (54/54)`). Only warnings present are pre-existing `pg`/`pg-connection-string` SSL-mode deprecation notices from an unrelated database driver, present before this change.
- **Regression on every migrated page** — verified live in a running dev server for `/pricing`, `/services`, `/agreement`, `/start`, `/resources`, `/labs`, `/process`, `/books`, `/type` (every route touched by the 13 migrated sites):

| Page | Card(s) checked | Result |
|---|---|---|
| `/pricing`, `/services`, `/agreement` | `TierCard` (via `TierGrid`) — both recommended (`accent`) and non-recommended (`dimmed`) states | ✅ exact class sets + computed border-color/bg/radius match pre-migration values |
| `/start` | tier card (accent/dimmed), fits card (`border-accent/20` override), not-fits card (`bg-surface-1/50` override), how-do-start step | ✅ all four confirmed — `cn()` correctly overrode the base `border-border-subtle`/`bg-surface-1` with each site's one-off value (computed styles read back exactly: e.g. fits card's `border-color` = accent at 20% opacity, not the default subtle color) |
| `/resources` | `ResourceCard`, both recommended (`border-accent/40`, no hover) and non-recommended (`border-border-subtle`, `hover:border-border-strong`) states | ✅ confirmed the recommended card carries **no** hover class (matches original — adding it would've been a real, incorrect behavior change) |
| `/labs` | research-area card (`as="article"`, `interactive`) | ✅ renders as `<article>`, exact class set incl. `hover:border-border-strong` |
| `/pricing` | investment metric card + value-prop card | ✅ both confirmed, value-prop's `/60` opacity intact |
| `/process` | operating-principles card | ✅ confirmed |
| `/books` | book card (`Link`, `hover:border-accent/40`) | ✅ confirmed, distinct hover color preserved exactly (not the shared `hover:border-border-strong`) |
| `/agreement` | discovery-question card (`rounded-card`, compact) | ✅ confirmed, 12px radius vs. the 24px used elsewhere |
| `/type` | 4× context panel | ✅ all 4 present, identical classes |

- **Computed styles**: spot-checked `border-color`, `background-color`, `border-radius`, and `padding` via `getComputedStyle()` on every card family above — all match the pre-migration values (see table).
- **Console warnings**: no new warnings introduced. Only pre-existing warnings observed (React DevTools suggestion, Vercel Analytics debug-mode notice, "Reduced Motion enabled" from Framer Motion).
- **Hydration warnings**: a hydration mismatch **is** present on pages using `whileInView`/`initial={false}` Framer Motion elements (e.g. `motion.div`/`motion.article` wrapping several migrated cards) — but this was verified to be **pre-existing and unrelated to this migration**: the exact same warning shape (mismatched `style.opacity`/`style.transform`, or SVG `opacity`/`strokeDasharray` on `/why`) reproduces identically on `/why` and other pages this sprint never touched, caused by the test browser's `prefers-reduced-motion: reduce` setting interacting with Framer Motion's SSR/client reduced-motion detection. The mismatch is **only ever on the `style` attribute**, never on `className` — confirming the migration itself introduced no new hydration issue.

## Remaining Follow-ups

1. **Typography normalization** (flagged, not done): 6 of the 13 sites (`start-view.tsx`'s tier/fits/not-fits/step cards, `investment-value.tsx`'s value-prop card, `process-view.tsx`'s operating-principles card) still use arbitrary Tailwind values (`text-[0.6rem]`, `text-[0.95rem]`, etc.) plus inline `style={{fontFamily: "Montserrat"}}` instead of the design-system's `text-title`/`text-body-sm`/`font-sans` tokens. Per this sprint's explicit instruction, these were preserved exactly via `className`, not touched. A future sprint could normalize them, but that is a visible rendering change and should get its own review, not be silently bundled into a primitive-extraction sprint.
2. **`start-view.tsx`'s inline tier-card content** duplicates `TierCard`'s emphasis logic but intentionally renders different, condensed content (see the validation pass — this is not a `TierCard` reuse opportunity, the data shapes differ).
3. **MediaCard** — untouched, per scope. The validated plan (shell-only, 4 core rows, `rotating-gallery.tsx`/`floating-preview.tsx` explicitly excluded) is ready whenever that sprint is approved.
4. **Nav-bar overflow at 320px viewport** — unrelated pre-existing bug found during a prior session, already flagged as its own background task; not touched here.

## Stop Point

Typecheck, build, and full regression verification are green. `PanelCard` is implemented and 13 call sites are migrated with confirmed pixel parity. **Stopping here per instructions — awaiting commit approval. MediaCard has not been started.**
