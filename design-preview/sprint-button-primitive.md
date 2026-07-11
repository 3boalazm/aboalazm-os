# Design System Sprint — Button Primitive
Status: **Production-complete.** Migration order: Heading (done) → Button (this doc) → Card (not started, per stop condition).

## Components created
- `components/ui/Button.tsx` — `buttonVariants()` (class-string builder, for `<Link>`/`<a>` CTAs that must keep Next.js routing semantics) + `<Button>` (forwardRef `<button>` component, for the 2 real form/action sites).
- `lib/utils.ts` — added `joinClasses()`, a shared plain-concatenation helper, consolidating a duplicate that had been defined identically in both `Heading.tsx` and `Button.tsx` (caught in code review, see below).

## Files migrated (11 files, 17 button elements)
| File | Sites | Notes |
|---|---|---|
| `features/offers/offer-blocks.tsx` (`CtaBand`) | 2 (primary+ghost) | Affects 9+ downstream renders (services, pricing, agreement, resources, labs, home) via one change |
| `app/(site)/services/services-view.tsx` | 2 | Independent byte-identical copy of CtaBand's classes |
| `app/(site)/start/start-view.tsx` | 4 (2 pairs) | CSS-trio family — own hover/duration/shadow values |
| `app/(site)/process/process-view.tsx` | 2 (1 pair) | Byte-identical to start-view's pair |
| `features/errors/not-found-content.tsx` | 2 | CSS-trio family, but numerically distinct from start/process (see Bugs below) |
| `components/layout/nav.tsx` | 1 | Has arrow-span child, smallest size in the family |
| `features/home/home-bands.tsx` | 1 | Has its own `flex w-fit items-center gap-2` — see Bugs below |
| `app/(site)/error.tsx` | 1 | Real `<button>`, opacity-hover (not translate) |
| `features/resources/resource-blocks.tsx` | 1 | Real `<button>`, has a loading/disabled state |
| `components/ui/Heading.tsx` | — | Touched only to consume the consolidated `joinClasses` |
| `lib/utils.ts` | — | New shared helper |

**Explicitly not migrated** (documented in Discovery, not silently dropped):
- `contact-form.tsx` submit button — inverted `bg-text-primary` skin, full-width, `aria-busy`. Single unique implementation; would need a speculative one-off color variant.
- `error.tsx` "Return home" text link — not pill-shaped, not a CTA-button pattern.
- nav.tsx language/theme toggle buttons — a third, distinct bordered-icon-toggle skin, outside the original CTA list.
- Gallery filter chips, contact-form budget toggle, work-filter, persona-toggle — `aria-pressed` toggle controls, a different UI role from CTA buttons.

## Duplication removed
- 17 render-site implementations → 1 component (2-part: `buttonVariants` + `Button`), 2 evidenced variants.
- ~85 lines of dead CSS deleted from `globals.css`: `.not-found-cta`/`.not-found-cta--primary`/`.not-found-cta--ghost`, `.start-cta-primary`/`.start-cta-ghost`, `.process-cta-primary`/`.process-cta-ghost` — all confirmed to have zero remaining `.tsx` references before deletion.
- `joinClasses` duplicate (Heading.tsx + Button.tsx had identical copies) consolidated into `lib/utils.ts`.

## LOC delta
```
11 files changed, 89 insertions(+), 32 deletions(-)   (component call sites + lib/utils.ts)
   + ~85 lines deleted from app/(site)/globals.css (dead CSS)
```
Call-site LOC is roughly flat to slightly up (explicit `buttonVariants({...})` calls aren't shorter than the className strings they replace) — consistent with the Heading sprint, the real win is duplication *count*, not raw line count. Net repo LOC is down once the deleted CSS is counted.

## Engineering decisions
- **Two-part API (`buttonVariants` + `Button`), not one polymorphic component.** 14 of 17 sites are `<Link>`/`<a>` (Next.js routing, external `wa.me` targets); only 3 are real `<button>`. A single polymorphic component would need `asChild`/`Slot`-style ref forwarding (not in this project's dependencies) to support both without breaking `next/link` semantics. Exporting the class-builder separately — the same pattern shadcn/ui uses — lets every site keep its native element type untouched.
- **No `hoverLift` boolean, no `size` prop, no `font` prop.** All three were drafted and then removed after measuring real values: the CSS-trio family hovers at a 2px lift over 200ms with a box-shadow glow, while everyone else lifts 4px over 400ms with no shadow — baking either as a togglable default would have silently corrupted the other family (this was caught before it shipped, see Bugs). Padding/font-size have no shared scale (7 distinct combinations across 8 primary-skin sites). Every site supplies its own transition/hover/size classes in full via `className`, mirroring `Heading`'s asymmetric-defaults approach.
- **`BASE` intentionally thin: `"rounded-pill uppercase disabled:opacity-60"`.** An earlier draft added `inline-flex items-center justify-center` speculatively; removed after discovering `home-bands.tsx` needs its own `flex w-fit items-center gap-2`, which would collide with a baked-in `inline-flex` (both are `display` utilities — cascade order between them is unpredictable). None of the 17 original sites actually needed flex-centering from Button itself.
- **`ghost` variant carries zero color/border defaults.** The 4 ghost sites split into two genuinely different skins (CtaBand/services' `.glass` backdrop-blur pill vs. not-found/start/process's plain bordered pill) with no shared CSS beyond the pill shape already in `BASE`. Naming it as a variant still documents intent at call sites even though it contributes no extra classes.
- **`joinClasses`, not `cn()`/tailwind-merge**, for the same reason established in the Heading sprint — nothing in Button's compositions needs override/conflict resolution, every className is additive.

## Bugs found and fixed before shipping
1. **Hover-distance/duration mismatch (caught during Discovery, before any code shipped).** Initial assumption (carried over from an earlier, less rigorous Phase 3A note) was that all three CSS-trio classes (`not-found-cta`, `start-cta`, `process-cta`) were byte-identical. Re-reading the actual CSS showed `start-cta`/`process-cta` genuinely are identical (0.8rem, 12px/24px padding, 200ms, translateY(-2px) + box-shadow glow on hover) but `not-found-cta` is numerically distinct (0.78rem, 10px/20px padding, translateY(-2px) only, no shadow). Separately, `CtaBand`/nav/home-bands/error/resource-blocks all use Tailwind's `hover:-translate-y-0.5` (4px) over `duration-base` (400ms) — a different distance and speed entirely from the CSS-trio's 200ms/2px. A first draft of `Button` baked a single `hoverLift` boolean mapping to the Tailwind value, which would have doubled the CSS-trio's hover distance and halved its duration. Caught by re-deriving every site's exact values before writing variant defaults, not after.
2. **`inline-flex` vs. `home-bands.tsx`'s explicit `flex` (caught during migration).** Same class of bug as #1 — a speculative `BASE` addition not backed by evidence, removed once the collision was identified.
3. **Stale Turbopack HMR cache producing phantom errors twice** (`Tag is not defined` from an already-reverted Heading edit, and a misleading default-404-page result) — both confirmed via a fresh browser tab + `git diff` to be dev-server cache artifacts, not real regressions. Root cause: running `npm run build` (production) while `next dev --turbopack` was also running against the same `.next` directory corrupts its manifest on Windows. Fixed the *workflow*, not the code: `rm -rf .next` + restart the dev server after every production build for the rest of the sprint.

## Verification performed
- `npm run typecheck` — clean, 0 errors, 5 passes across the sprint (after each migration batch + after the `joinClasses` consolidation + after the dead-CSS removal).
- `npm run build` — production build green (exit code 0), 5 passes, same checkpoints.
- Live DOM diffing (computed styles: background, color, border-radius, padding, font-size, transition-property, hover className) on every migrated site: CtaBand (`/services` CTA band), `services-view.tsx` direct links, `/start` (both CTA pairs), `/process`, the 404 page (`/case-studies/<bad-slug>`), nav's CONTACT pill, home-bands' journey CTA, `/resources`' unlock button (`type="button"`, `disabled` wiring intact). All matched pre-migration values exactly.
- Confirmed (via `git diff --stat`, zero changes) that a pre-existing hydration mismatch in `resource-blocks.tsx`'s `ResourceCard` — unrelated `motion.article whileInView` component, already logged in the Heading sprint report — was not touched or worsened by this migration.
- Confirmed the root-level `app/not-found.tsx` referenced in `not-found-content.tsx`'s own doc comment does not currently exist in the repo (pre-existing gap, unrelated to this sprint) — truly unmatched top-level URLs hit Next's built-in 404, while `(site)`-scoped `notFound()` calls correctly render the migrated custom page.

## Code review (before declaring completion)
- Removed `hoverLift`, a `size` enum, and a `font` enum — all drafted, none survived contact with the actual per-site values (see Bugs).
- Removed the speculative `inline-flex items-center justify-center` from `BASE`.
- Consolidated duplicate `joinClasses` (Heading.tsx + Button.tsx) into `lib/utils.ts`.
- No variant explosion: exactly 2 variants (`primary`, `ghost`), both evidenced by 4+ real sites each.
- `ButtonVariant` type export kept — mirrors the existing `HeadingProps` export pattern, not speculative.

## Remaining opportunities (not in scope, logged for later)
- `contact-form.tsx`'s submit button (inverted color, full-width, `aria-busy`) remains bespoke — revisit only if a second site needs the same inverted skin.
- nav.tsx's language/theme toggle buttons are a third, un-migrated bordered-icon skin — candidate for a future `IconButton` if it recurs elsewhere.
- Card primitive (next in the sprint order) has not been started, per the explicit stop condition.
