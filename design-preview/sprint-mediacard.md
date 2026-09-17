# Sprint 1 — Phase 4: MediaCard Implementation

Scope: **MediaCard only**, migrating exactly the 4 validated rows from `design-preview/sprint-card-audit.md`'s Family 2 validation pass. `rotating-gallery.tsx` and `floating-preview.tsx` were not touched, per explicit exclusion. Typography, color tokens, spacing, broader Tailwind cleanup, accessibility, and performance were not touched.

## Implementation Summary

Created `components/ui/MediaCard.tsx` — a shell-only primitive:

```tsx
const BASE = "group overflow-hidden rounded-card border border-border-subtle";
const SURFACE = { "surface-0": "bg-surface-0", "surface-1": "bg-surface-1" } as const;
```

- **`surface`** — 2 values (`surface-0` used by `LivePreviewCard`, `surface-1` used by the other 3), matching the validated spec exactly. `surface-2` was already dropped during validation (no core row uses it) and stays dropped.
- **`as`** — polymorphic (`'div' | 'figure' | 'a' | 'button'`), one real consumer per value: `LivePreviewCard` (`a`), `CaseGallery` (`figure`), gallery-view's masonry item (`button`, via the variants builder since it's a `motion.button`), `ExecutionPanel`'s gallery item (`div`, the default). Implemented as a proper generic polymorphic component (`MediaCardProps<T extends ElementType>`) so `href`/`target`/`rel`/`onPointerEnter` etc. type-check correctly when `as="a"`, rather than loosening the prop types generically.
- **`group`** is baked into `BASE` — verified present, identically, on all 4 validated rows' outer element (every one of their hover-reveal children keys off `group-hover:`).
- **No `aspect` prop, no `header`/`caption` props.** During implementation I re-verified the "image wrapper" concept from the audit against the actual source: `LivePreviewCard`'s inner aspect-ratio div needs 3 extra classes (`w-full overflow-hidden bg-surface-0`) that `CaseGallery`'s doesn't, and both wrappers are DOM *siblings* alongside a chrome bar / figcaption outside the box, not something MediaCard's own root could apply directly without either forcing extra classes onto one site or reintroducing the `header`/`caption` slot props the validation pass explicitly rejected. Per this sprint's own rule ("if it differs, leave it outside"), both inner aspect-ratio wrappers stayed exactly as hand-authored `children`, untouched.
- Exported `mediaCardVariants()` — a class-string builder (mirrors `panelCardVariants()` from Sprint 1-C) for the one call site (`gallery-view.tsx`) where the card surface must stay a `motion.button`.

## Files Changed

| File | Change |
|---|---|
| `components/ui/MediaCard.tsx` | **New**, 68 lines |
| `features/work-ui/live-preview-card.tsx` | Outer `<a>` → `<MediaCard as="a" surface="surface-0">`; inner aspect-ratio div, chrome bar, and caption untouched |
| `features/case-studies/case-gallery.tsx` | Outer `<figure>` → `<MediaCard as="figure">` (default `surface-1`); inner aspect-ratio div and `<figcaption>` untouched |
| `features/gallery/gallery-view.tsx` | `motion.button` className → `mediaCardVariants({ className: "relative mb-3 block w-full text-left md:mb-4" })`; hover-reveal overlay untouched |
| `features/case-studies/panels.tsx` | `ExecutionPanel`'s deliverables gallery `<div>` → `<MediaCard>` (default `as="div"`, `surface-1`); hover-reveal caption untouched |

**Not touched**, confirmed out of scope: `features/gallery/rotating-gallery.tsx`'s `Card` (GSAP needs a direct DOM ref; inline single-edge accent border, not the shared token), `features/work/floating-preview.tsx`'s `FloatingPreview` (different border token, `absolute inset-0` sizing, single-use). No dead code was found to delete for MediaCard specifically — the two dead CSS rules already identified and removed (`.jargon-card`, `.persona-emphasis`) belonged to Sprint 1-C's PanelCard scope, not this one, and are not touched again here.

## Migration Statistics

- **4 call sites migrated** across 4 files + 1 new primitive file.
- `git diff --stat` on the 4 modified files: **17 insertions, 13 deletions** (net +4 LOC in the modified files), plus **+68 LOC** for the new primitive.
- **Duplicated Tailwind class-substring eliminated**: the literal string `overflow-hidden rounded-card border border-border-subtle bg-surface-1` (or `bg-surface-0` for the one row that needs it), previously hand-written independently in 4 separate files, now exists in exactly one place (`MediaCard`'s `BASE`/`SURFACE`).
- **Duplicated JSX removed**: none in the sense of removed markup — each of the 4 call sites still authors its own children (chrome bar, figcaption, hover overlay, caption slide) exactly as before. The duplication removed is the *shell wrapper's own opening tag*, not any inner JSX, consistent with this sprint's "shell only" scope.

## Regression Results

- **`npm run typecheck`** — clean, 0 errors (the generic polymorphic `MediaCardProps<T>` typing correctly admits `href`/`target`/`rel`/`onPointerEnter`/`onPointerLeave` on `as="a"` for `LivePreviewCard` without any type-widening workaround).
- **`npm run build`** — succeeded, exit 0, all 54 routes generated, including `/case-studies/[slug]` (which statically renders `ExecutionPanel`, the one migrated component I could not exercise with live client-side data — see below — but which the build itself compiles and type-checks against real `CaseStudyRecord` data during static generation without error).
- **Live verification, per page:**

| Page | Card checked | Result |
|---|---|---|
| `/work-ui` | `LivePreviewCard` (3 instances) | ✅ exact class set (`group overflow-hidden rounded-card border border-border-subtle bg-surface-0 block transition-colors duration-base ease-physics hover:border-border-strong`), computed `border-color`/`background-color`/`border-radius`/`overflow` all match pre-migration; inner `aspect-[16/10]` wrapper (`relative aspect-[16/10] w-full overflow-hidden bg-surface-0`) untouched, `aspect-ratio` computed style = `16 / 10` |
| `/case-studies/reflection` | `CaseGallery` (10 figures) | ✅ exact class set (`group overflow-hidden rounded-card border border-border-subtle bg-surface-1 relative [md:col-span-2]`), inner `aspect-[16/9]` wrapper untouched |
| `/gallery` | gallery-view masonry item (52 images) | ✅ exact class set, dynamic per-image `aspect-ratio` preserved (e.g. `1400 / 1000`, confirming masonry packing is unaffected) |
| `/case-studies/[slug]` (`ExecutionPanel`) | deliverables masonry item | ⚠️ **could not be exercised with live client-side data** — see finding below |

- **Console warnings**: no new warnings on any successfully-loaded page.
- **Hydration warnings**: the same pre-existing Framer Motion + `prefers-reduced-motion` mismatch documented in the PanelCard sprint reproduces on `/gallery`'s masonry (`motion.button`) — confirmed, as before, to be a `style`-only mismatch (`opacity`/`transform`/`scale`), never `className` (checked directly: zero `className` diff lines in the mismatch payload). This is the identical pre-existing condition already documented in `sprint-panelcard.md`, not something this migration introduced.

### Finding: `ExecutionPanel`'s deliverables gallery has no live data to render through right now

While trying to verify the 4th site, I traced why `record.images.map(...)` never produced any DOM nodes on any of the 5 available case studies (`ahmed-bedeer`, `code-canvas`, `gad-institute`, `nile-pharma`, `reflection`):

- `app/(site)/case-studies/[slug]/page.tsx` fetches **two separate data sources**: `record = await getCaseStudy(slug)` (feeds `ScrollyCaseStudy` → `ExecutionPanel`) and `gallery = await getCaseStudyGallery(slug)` (feeds a page-level `<CaseGallery items={gallery} />` directly).
- The visible "GALLERY / THE SYSTEM, RENDERED" section on `/case-studies/nile-pharma` (11 named images, e.g. "Logo construction grid") is rendered by that page-level `CaseGallery`, confirmed via its DOM ancestry (`grid grid-cols-1 gap-2 md:grid-cols-2` + `<figure>`/`<figcaption>`) — **not** `ExecutionPanel`'s own masonry (`columns-2 ... break-inside-avoid`), which I confirmed via `document.documentElement.outerHTML.includes('break-inside-avoid')` returning `false` on that page.
- `features/case-studies/demo.data.ts` (nile-pharma's static source data) does have an `images: [...]` array with 11 entries, matching `CaseStudyRecord`'s shape — but whatever `getCaseStudy()` returns to the live page apparently doesn't carry a populated `images` field through to `ExecutionPanel` in a way that satisfies its `record.images && record.images.length > 0` guard, for any of the 5 case studies I could reach.

This is a **pre-existing data-plumbing condition** in `lib/content.ts`'s `getCaseStudy()`/`getCaseStudyGallery()` split — I did not touch either function, or `page.tsx`, or any data-fetching code, in this sprint. I could not find a single live case study where `ExecutionPanel`'s deliverables masonry renders at all, migrated or not, which means this specific code path currently has zero live consumers to visually regression-test against, independent of my change.

What I did verify instead for this one site:
1. **Typecheck** passes against `ExecutionPanel`'s real prop types.
2. **Production build** compiles and statically renders `ExecutionPanel` (as part of `/case-studies/[slug]`'s successful build) without error.
3. **Class-string equivalence**, reasoned the same way as the 3 confirmed-live sites: original was `"group relative mb-3 overflow-hidden rounded-card border border-border-subtle bg-surface-1 break-inside-avoid"`; migrated is `<MediaCard className="relative mb-3 break-inside-avoid">`, which resolves to `group overflow-hidden rounded-card border border-border-subtle bg-surface-1 relative mb-3 break-inside-avoid` — the same class set, order aside. This is the *simplest* of the 4 migrations (plain `<div>`, no motion, no polymorphism), and uses the exact same `MediaCard` default path (`as="div"`, `surface="surface-1"`) already proven correct on the other 3 pages.

Flagged below as a follow-up rather than silently claimed as "verified" — I want this gap visible, not papered over.

## Screenshots

Live browser screenshot capture was unreliable in this sandbox during this session (the Browser pane's `computer` screenshot action repeatedly timed out, a tooling issue unrelated to the migration — see also the intermittent Postgres connectivity noted above, which independently caused several page loads to fail with `CONNECTION INTERRUPTED` before succeeding on retry). In place of screenshots, the report above documents `getComputedStyle()` readouts (`border-color`, `background-color`, `border-radius`, `overflow`, `aspect-ratio`) captured directly from the live DOM for every successfully-loaded page, which is a stronger, numeric form of the same pixel-parity evidence a screenshot would provide.

## Remaining Follow-ups

1. **`ExecutionPanel`'s deliverables masonry has no live data path right now** (see finding above) — worth a separate, focused investigation into whether `getCaseStudy()` should be passing through `images` from the CMS/static source, independent of any Card-primitive work. Not caused by, or fixed by, this sprint.
2. **MediaCard is intentionally incomplete as "the" media primitive** — by design. `rotating-gallery.tsx` and `floating-preview.tsx` remain independent, exactly as validated. Do not revisit without new evidence.
3. **Typography, color tokens, spacing, Tailwind cleanup, accessibility, performance** — explicitly out of scope per this sprint's instructions, untouched.
4. **Screenshots** — if visual proof beyond computed-style readouts is needed, a follow-up pass with a more stable browser-preview session (this sandbox's Postgres connection and the `computer` screenshot action were both intermittently unreliable this session, unrelated to the code) could capture them.

## Stop Point

Typecheck and build are green. 3 of 4 migrated call sites are confirmed live with exact computed-style parity; the 4th (`ExecutionPanel`) is verified by typecheck + successful build + exact class-string equivalence, with a documented, pre-existing, unrelated reason why it currently has no live data to exercise. **Stopping here per instructions — awaiting commit approval. Sprint 2 has not been started.**
