# Design System Sprint — Heading Primitive
Status: **Production-complete.** Stabilized 2026-07-11. Migration order per sprint plan: Heading (this doc) → Button → Card.

## Files migrated (15 call sites + 1 new component)
`components/ui/Heading.tsx` (new) — consumed by:
1. `app/(site)/about/about-view.tsx`
2. `app/(site)/books/books-view.tsx`
3. `app/(site)/capabilities/capabilities-view.tsx`
4. `app/(site)/contact/contact-view.tsx`
5. `app/(site)/agreement/agreement-view.tsx`
6. `app/(site)/pricing/pricing-view.tsx` (uses `eyebrowMeta` — the only site with a secondary eyebrow line)
7. `app/(site)/services/services-view.tsx`
8. `app/(site)/labs/labs-view.tsx` (only site with a second free-standing paragraph after the subtitle — left outside `<Heading>` by design)
9. `app/(site)/resources/resources-view.tsx`
10. `app/(site)/why/why-view.tsx`
11. `app/(site)/work/work-header.tsx`
12. `app/(site)/work-ui/work-ui-header.tsx`
13. `app/(site)/writing/writing-view.tsx`
14. `features/gallery/gallery-view.tsx`
15. `features/case-studies/scrolly-case-study.tsx` (only site with no subtitle)

## Duplicated markup removed
45 hand-written elements (3 per site × 15 sites: eyebrow `<p>`, title `<h1>`, subtitle `<p>`) collapsed into 15 `<Heading>` calls. Each page keeps its own wrapper (`<header>`/`<div>`, varying `gap-2`/`gap-3`/`gap-4`/`pb-8`) — deliberately not touched, since that wrapper markup was never actually duplicated (verified in Phase 1 audit).

## LOC delta
```
15 files changed, 211 insertions(+), 174 deletions(-)
```
Net LOC in call sites is roughly flat (JSX props aren't shorter than the markup they replace) — the win is duplication count, not raw line count: 45 copy-pasted elements → 1 component definition (Heading.tsx, 62 lines) consumed 15 times. Any future eyebrow/title/subtitle styling change now edits 1 file instead of 15.

## Bugs discovered

### 1. `cn()`/tailwind-merge silently dropped base typography classes — found and fixed
`Heading.tsx` initially composed classes with the project's `cn()` helper (`clsx` + `tailwind-merge`). `twMerge`'s class-group heuristics key off the `text-` prefix; it treated custom Tailwind v4 `@theme` utilities (`text-display`, `text-lead`) as conflicting with unrelated `text-*` classes (`text-balance-pretty`, `text-text-secondary`) passed in via `titleClassName`/`subtitleClassName`, and silently dropped the base font-size utility on every merge. Verified impact: title collapsed from the `--text-display` clamp scale (~70px) to default 16px body text; subtitle collapsed from `--text-lead` (20px) to 16px — on every one of the 15 pages.
**Fix:** replaced `cn()` with a local `joinClasses()` (plain `Array.filter(Boolean).join(" ")`) inside `Heading.tsx` — no override/conflict-resolution semantics were ever needed for these compositions, only additive concatenation. Documented inline in the component with the reasoning, so a future contributor doesn't reach for `cn()` here out of habit.
**This is a latent risk elsewhere in the codebase** wherever `cn()`/`twMerge` combines a custom `text-*` @theme token with another `text-*` utility — worth a follow-up grep across the codebase in a future sprint (flagged below, not fixed now — out of scope for Heading).

### 2. Two pre-existing hydration mismatches found during verification, confirmed NOT caused by this migration
- `features/hero/system-constellation.tsx` (rendered on `/why`) — SVG `motion.line`/`motion.g` elements with `initial={false}` mismatch server/client `opacity`/`transform` on hydration.
- `features/resources/resource-blocks.tsx`'s `ResourceCard` (rendered on `/resources`) — `motion.article` using `whileInView` mismatches server/client `opacity`/`transform` similarly.

Both confirmed via `git diff --stat` to have zero changes from this sprint. Not fixed — out of scope (this sprint touches only Heading call sites). Flagged for a future reduced-motion/hydration cleanup pass, same family as the `floating-preview.tsx` fix from the prior QA sprint.

## Engineering decisions
- **No wrapper element.** `Heading` renders eyebrow/title/subtitle as a fragment, not inside its own `<header>`. Each page's wrapper (`<header>`/`<div>`) has real per-page variance (`gap-2` vs `gap-3` vs `gap-4`, occasional `pb-8`) that was never actually duplicated — componentizing it would have imposed structure the codebase doesn't have, so it stays with the caller.
- **`eyebrowMeta` prop, not a variant.** Only `pricing-view.tsx` needs a second inline label next to the eyebrow. Modeled as an optional slot rather than a `variant="withMeta"` — one boolean-shaped concern, not a taxonomy.
- **`titleClassName`/`subtitleClassName` instead of a `size` enum.** Every one of the 15 sites has a different `max-w-[Nch]` value (14ch → 20ch for titles, 46ch → 58ch for subtitles) — there's no repeating scale to name as variants, so raw className passthrough was the only option that didn't lose per-page precision.
- **Dropped the speculative `as?: "h1" | "h2"` prop during code review.** Every one of the 15 call sites used the default (`h1`); nothing ever passed `h2`. Kept as unconditional `<h1>` — removing unused flexibility per the "no over-engineering" directive. Behavior-preserving (default was always `h1`).
- **Second/extra paragraphs stay outside `Heading`.** `labs-view.tsx` has a second paragraph after the subtitle (`text-body`, not `text-lead`) — that's a distinct element with different type tokens, not part of the eyebrow/title/subtitle shape, so it remains a sibling `<p>` in the page, not a 4th `Heading` slot.

## Verification performed
- `npm run typecheck` — clean (0 errors), 3 passes (initial migration, joinClasses fix, `as` prop removal).
- `npm run build` — production build green, exit code 0, all 3 passes.
- Live DOM diffing on all 15 migrated pages (local dev server) — every page's rendered `<header>`/wrapper `outerHTML` matches the pre-migration source byte-for-byte (className strings, text content, `<h1>` tag name all identical).
- Console/hydration-warning check across all 15 pages (fresh browser tabs to avoid cross-navigation log buffering) — zero new warnings; the two pre-existing hydration mismatches above are unrelated and confirmed via git diff.

## Remaining opportunities (not in scope, logged for later)
- Audit other `cn()` call sites project-wide for the same `text-*` twMerge collision risk (found here, likely latent elsewhere).
- Fix the two pre-existing hydration mismatches (`system-constellation.tsx`, `resource-blocks.tsx`) in a dedicated reduced-motion/hydration pass.
- `AboutTeaser` (`home-bands.tsx`) still hand-rolls `SectionHead`'s markup instead of calling it — deferred to the "final cleanup" step after Button and Card land, per sprint plan.
