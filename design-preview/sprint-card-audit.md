# Sprint 1 — Phase 2: Shared Card Primitive Audit

Status: **Audit only. No code changed.** Scope excludes Button and Heading (already production-complete).

Method: full-repo inventory of every card-like wrapper in `features/`, `components/`, `app/(site)/`, grouped by **rendered DOM structure and exact class string**, not by naming or intent. Families below are only proposed for extraction where ≥3 genuinely independent implementations share near-identical structure; everything else is left independent or flagged for deletion.

---

## Executive Summary

| # | Family | Verdict | Confidence |
|---|---|---|---|
| 1 | Bordered content panel (label/title/body, optional list/footer) | **Extract → `<PanelCard />`** | High — 9 independent implementations, near-identical class strings |
| 2 | Media card with hover-reveal caption (image + overlay) | **Extract → `<MediaCard />`** | High — 5 independent implementations, near-identical class strings |
| 3 | Glass / floating overlay panels | **Do not extract** | N/A — already abstracted at the CSS-utility level (`.glass`), each consumer is single-use |
| 4 | Small horizontal chips/tiles (SpineRail, WHY tile, methodology chip, gate-detail block) | **Do not extract** | Low — shares vocabulary (`rounded-card`, `border`, `bg-surface-*`) but not exact classes, layout hierarchy differs per use, each has only 1 in-file usage |
| 5 | Stat tiles (`StatsRow` vs `.stats-dash__cell`) | **Do not extract** | N/A — two deliberately different structures (rounded surface tile vs. flat border-top dashboard cell) serving different pages |
| 6 | `TierCard` (existing component) + its 3 uncoordinated re-implementations | **Consolidate onto existing `TierCard`, do not create a new primitive** | High — this is a "stop duplicating," not a "build new," fix |
| — | `.jargon-card`, `.persona-emphasis` CSS | **Delete — dead CSS** | High — zero `.tsx` consumers found |
| — | `SiteCard` (`.site-card` custom CSS class family) | **Legacy, migrate later** | Medium — real card, but written as bespoke CSS instead of Tailwind; migrating it is higher-risk/lower-value than the two primitives above |

Net recommendation: build **two** primitives (`PanelCard`, `MediaCard`), fix one pre-existing duplication (`TierCard` re-implementations), delete two dead CSS rules. Do **not** build `<Card />` as a generic catch-all, and do **not** build `<GlassCard />` — there is no genuine duplication behind either name once components are grouped by actual structure instead of vibes.

---

## Family 1 — `PanelCard` (bordered content panel)

**Shared shape:** `rounded-panel` (24px) or `rounded-card` (12px) outer box, `border border-border-subtle` (sometimes conditional to `border-accent`/`border-accent/20`), `bg-surface-1` (sometimes `/50`–`/60` opacity), padding `p-3`–`p-5`/`p-8`, wrapping a **label/eyebrow → title → body copy**, sometimes a `<ul>` list, sometimes a footer divider + meta row.

### Evidence table

| # | File | Exact className | Usage count | Structure |
|---|---|---|---|---|
| 1 | `features/offers/offer-blocks.tsx` (`TierCard`) | `"flex flex-col gap-2 rounded-panel border p-3"` + conditional `border-accent bg-surface-1 shadow-card` / `border-border-subtle bg-surface-1/60` | `TierGrid` (which renders it) imported/used **9×** across `pricing-view.tsx`, `services-view.tsx`, `agreement-view.tsx` | tag pill + "recommended" badge → title → price → price note → `<dl>` meta → divider → checklist `<ul>` |
| 2 | `app/(site)/start/start-view.tsx` (inline tier card) | `"relative flex flex-col gap-3 rounded-panel border p-5"` + same conditional accent/subtle pair | Local `.map()`, 3 tiers, **1 file** | badge (absolute) → tag → name → price → duration → footer note (`mt-auto border-t`) |
| 3 | `features/resources/resource-blocks.tsx` (`ResourceCard`) | `"flex flex-col rounded-panel border bg-surface-1 p-4 transition-colors duration-base ease-physics md:p-5"` + conditional `border-accent/40` / `border-border-subtle hover:border-border-strong` | 3 (def + import + `.map()` render) in `resources-view.tsx` | id/stage header → title (h3) → subtitle → description → "feeds" meta → divider → download/lock CTA |
| 4 | `app/(site)/labs/labs-view.tsx` (research-area card) | `"flex flex-col rounded-panel border border-border-subtle bg-surface-1 p-4 transition-colors duration-base ease-physics hover:border-border-strong md:p-5"` | Local `.map()`, 1 file | index → title (h3) → blurb → tag pills `<ul>` → footnote (top border) |
| 5 | `features/offers/investment-value.tsx` (value-prop card) | `"flex gap-3 rounded-panel border border-border-subtle bg-surface-1/60 p-4"` | Local `.map()`, used via `InvestmentValue` in `pricing-view.tsx` | accent dot → title → body |
| 6 | `app/(site)/process/process-view.tsx` (operating-principles card) | `"flex gap-3 rounded-panel border border-border-subtle bg-surface-1 p-4"` | Local `.map()`, 6 items, 1 file | icon/number → title → body — near-byte-identical to #5 |
| 7 | `app/(site)/books/books-view.tsx` (book card) | `"group flex h-full flex-col justify-between gap-6 rounded-panel border border-border-subtle bg-surface-1 p-5 transition-colors duration-base ease-physics hover:border-accent/40 md:p-6"` | Local `.map()`, 1 file | edition label → title (h2) → blurb → divider → chapter count + CTA |
| 8 | `app/(site)/start/start-view.tsx` (fits/not-fits card) | `"flex flex-col gap-3 rounded-panel border border-accent/20 bg-surface-1 p-5"` / `"... border-border-subtle bg-surface-1/50 p-5"` | Local, 2 blocks, 1 file | label → `<ul>` bullets |
| 9 | `app/(site)/start/start-view.tsx` ("how do we start" step card) | `"flex flex-col gap-3 rounded-panel border border-border-subtle bg-surface-1 p-5"` | Local `.map()`, 1 file | step number + "Free" badge → name → body → optional CTA |
| — | `app/(site)/agreement/agreement-view.tsx` (discovery-question card) | `"rounded-card border border-border-subtle bg-surface-1 p-3"` | Local `.map()`, 4 groups, 1 file | head label → `<ul>` questions — same vocabulary, smaller `rounded-card` variant, included as a size variant not a new family |
| — | `app/(site)/type/type-view.tsx` (4× "context" showcase panel) | `"rounded-panel border border-border-subtle bg-surface-1 p-8"` (literal, repeated 4×) | 4 static blocks, 1 file, internal reference page | mono label → live type sample. Included per the "nearly byte-identical" exception even though it's a low-traffic internal page. |

**Identical across all 9 core instances:** `rounded-panel` (or `rounded-card` for the compact variant), `border`, `bg-surface-1` (base or with opacity modifier), a padding scale from a small fixed set (`p-3`/`p-4`/`p-5`/`p-8`), and the header→body (→list→footer) content shape.

**Differs:** border color state (static `border-subtle` vs conditional `accent`/`hover:border-strong`), background opacity (`bg-surface-1` vs `/50` vs `/60`), padding value, presence/absence of a footer divider+meta row, presence/absence of a leading icon/number/badge, list vs. no list.

### Required variants
- **Emphasis**: `default` (border-subtle) / `accent` (border-accent, optionally `shadow-card` + full-opacity surface) / `subtle` (bg-surface-1 at reduced opacity, no hover)
- **Density/size**: `compact` (`p-3`, `rounded-card`) / `default` (`p-4`/`p-5`, `rounded-panel`) / `spacious` (`p-8`, static reference-page use)
- **Interactive**: `hover:border-border-strong` toggle for card-as-link/hoverable list items vs. static informational panels
- **Slots**: optional leading icon/number/dot, optional header eyebrow/tag row, optional trailing divider+footer row

### Migration difficulty & regression risk
- **Low-to-medium.** All 9 sites are plain `<div>`/`<article>` wrappers with Tailwind classes only — no unique JS behavior tied to the wrapper itself (motion/animation wraps *around* these divs, e.g. `books-view.tsx`'s `motion.div`, so `PanelCard` would sit *inside* that wrapper, not replace it).
- Main risk is **visual drift**: 9 independent authors chose slightly different padding/opacity/hover values over time; consolidating to one primitive's default prop values will change a few pixels/opacity percentages on some pages (e.g., `investment-value.tsx`'s `bg-surface-1/60` vs `process-view.tsx`'s solid `bg-surface-1` for the *same* icon+title+body shape — this is a real inconsistency worth fixing, but it is a visible diff, not a no-op).
- `TierCard` (site #1) is the **only** one of these 9 that is already a shared, imported component with 9 real call sites — it should **not** be folded into the new generic `PanelCard`; instead, `TierCard` should keep owning its own price-specific markup (price/duration/payment `<dl>`) and the start-view.tsx duplicate (site #2) should be migrated to **reuse `TierCard`/`TierGrid` directly**, not to a new primitive. That's a bug-fix-shaped migration (delete ~40 duplicated lines), independent of the `PanelCard` work.

### Verdict: **`<PanelCard />`**
Props sketch: `emphasis?: 'default' | 'accent' | 'subtle'`, `density?: 'compact' | 'default' | 'spacious'`, `interactive?: boolean`, `as?: 'div' | 'li' | 'article'`, plus `children` for full slot freedom (label/title/body/footer stay as free-form children — don't over-templatize the internals, only the outer box + emphasis/density tokens are genuinely duplicated).

*(Revised by the validation pass below — see "Family 1 — line-by-line validation".)*

---

## Family 2 — `MediaCard` (image + hover-reveal caption)

**Shared shape:** `group relative overflow-hidden rounded-card border border-border-subtle bg-surface-1|2`, wrapping an image/iframe/preview, with a hover-triggered caption/gradient overlay.

### Evidence table

| # | File | Exact className | Usage count | Structure |
|---|---|---|---|---|
| 1 | `features/work-ui/live-preview-card.tsx` (`LivePreviewCard`) | `"group block overflow-hidden rounded-card border border-border-subtle bg-surface-0 transition-colors duration-base ease-physics hover:border-border-strong"` | 4 (def + `live-preview-grid.tsx` import/render ×3, grid used in a 1–3 col responsive layout) | fake browser-chrome header (dots + host + "Live" pulse) → scaled live iframe → hover scrim CTA → caption footer |
| 2 | `features/case-studies/case-gallery.tsx` (`CaseGallery` figure) | `"group relative overflow-hidden rounded-card border border-border-subtle bg-surface-1"` (+ conditional `md:col-span-2`) | 4 (def + export + import + render in `[slug]/page.tsx`) | `<figure>` → `next/image` (16:9) → `<figcaption>` footer bar (caption + accent dot) |
| 3 | `features/case-studies/panels.tsx` (deliverables gallery item, inside `ExecutionPanel`) | `"group relative mb-3 overflow-hidden rounded-card border border-border-subtle bg-surface-1 break-inside-avoid"` | Local `.map()` over `record.images`, CSS-columns masonry, 1 per case-study render | `<img>` → hover-reveal gradient caption overlay |
| 4 | `features/gallery/gallery-view.tsx` (masonry gallery button) | `"group relative mb-3 block w-full overflow-hidden rounded-card border border-border-subtle bg-surface-1 text-left md:mb-4"` | Local `.map()`, masonry columns, 1 file | `next/image` → hover gradient overlay (project label + caption) |
| 5 | `features/gallery/rotating-gallery.tsx` (`Card` sub-component) | `"group relative cursor-pointer overflow-hidden rounded-card"` (border applied via inline `style`, not class) | Local `.map()`, 1 file, nested inside `gallery-view.tsx` | `next/image` with GSAP 3D scroll-tilt → hover caption reveal |
| (nice-to-have, not counted as core evidence) | `features/work/floating-preview.tsx` (`FloatingPreview`) | `"absolute inset-0 overflow-hidden rounded-card border border-border-default bg-surface-2 shadow-card"` | **1** — single mounted instance inside `ProjectLedger`, not a repeated list item | accent gradient fallback → watermark → `next/image` thumbnail → bottom "record stamp" bar |

**Identical across the 5 core instances:** `group relative overflow-hidden rounded-card border border-border-subtle bg-surface-1|2|0`, plus the hover-reveal caption mechanic (gradient overlay + text fade-in on `group-hover`).

**Differs:** background surface level (`bg-surface-0` vs `bg-surface-1`), presence of `<figure>`/`<figcaption>` semantic tags (case-gallery) vs plain `<div>`/`<button>`, masonry `break-inside-avoid`/`mb-*` layout classes (which are placement concerns, not card concerns), the "browser chrome" header (unique to `LivePreviewCard`), and 3D scroll-tilt (unique to `rotating-gallery`).

### Required variants
- **Surface**: `bg-surface-0` / `bg-surface-1` / `bg-surface-2`
- **Caption mode**: `footer-bar` (static caption strip, `CaseGallery`) vs. `hover-overlay` (gradient reveal on hover, the other 3)
- **Semantic tag**: `figure`/`figcaption` vs `div`/`button` vs `a` (`LivePreviewCard` is a link) — the primitive needs an `as`/render-prop escape hatch, this is a real structural difference worth a prop, not a reason to keep separate (the *box* is identical; only the semantic wrapper tag differs)
- Slot for arbitrary header content (only `LivePreviewCard` needs the browser-chrome header — expose as a `header` slot, don't build it into the primitive)

### Migration difficulty & regression risk
- **Medium.** Unlike `PanelCard`, three of these five wrap complex behavior directly against the card boundary: GSAP scroll-tilt (`rotating-gallery`), a live iframe + hover scrim (`live-preview-card`), and Framer `motion`/masonry (`gallery-view`, `panels.tsx`). The *box* (border/radius/overflow/bg) is trivially identical, but the interaction layer is bespoke per site — a `MediaCard` primitive must be a thin visual shell (box + optional caption slot) and must **not** try to own the hover/tilt/reveal logic, or migration risk jumps from medium to high.
- `FloatingPreview` should **not** be forced onto the new primitive as day-one evidence (it's 1 usage) — but once `MediaCard` exists, it's a natural, low-risk adopter later since its classes already match.
- Regression risk is concentrated in `rotating-gallery.tsx`'s inline `style`-based border (not a class) — migrating it to `MediaCard`'s `border-border-subtle` class needs a visual diff check against its current custom accent-left-border-via-inline-style behavior.

### Verdict: **`<MediaCard />`**
Props sketch: `surface?: 'surface-0' | 'surface-1' | 'surface-2'`, `as?: 'div' | 'figure' | 'a' | 'button'`, `header?: ReactNode`, `caption?: ReactNode` (rendered as either a static footer bar or a hover overlay via a `captionMode` prop), `children` for the media itself.

*(Revised by the validation pass below — see "Family 2 — line-by-line validation": the primitive's scope shrinks and its job narrows to a shell only.)*

---

## Family 3 — Glass / overlay panels (no extraction)

| File | Classes | Usage count |
|---|---|---|
| `features/terminal/terminal-overlay.tsx` | `"glass w-full max-w-xl rounded-panel border border-border-default shadow-card"` | 1 |
| `components/layout/nav.tsx` (mobile dropdown) | `"glass mt-1 flex max-h-[calc(100svh-5.5rem)] flex-col overflow-y-auto overscroll-contain rounded-panel p-2 shadow-card md:hidden"` | 1 |
| `features/playground/token-playground.tsx` (control dock) | `"glass top-16 flex h-fit flex-col gap-3 rounded-panel p-3 lg:sticky"` | 1 |
| `features/contact/contact-form.tsx` | `"rounded-panel border border-border-subtle bg-surface-1 p-4 shadow-card"` (no `.glass`) | 1 |

**Verdict: no `<GlassCard />`.** Each of these is single-use, and the actual shared primitive — the `.glass` CSS utility itself (backdrop blur/translucency) — already exists and is already correctly reused as a *CSS utility*, not duplicated as markup (9 total `.glass` usages across the repo, each combined with different one-off layout classes appropriate to its own context: modal, dropdown, sticky dock). Wrapping these in a component would only formalize four one-off usages with no shared behavior beyond what the CSS utility already provides — this is exactly the "feels similar, isn't backed by duplication" trap the audit rules warn against.

---

## Family 4 — Small chips/tiles (no extraction, watch list only)

| File | Classes | Notes |
|---|---|---|
| `features/resources/resource-blocks.tsx` (`SpineRail` step tile) | `"rounded-card border border-border-subtle bg-surface-1 px-2.5 py-1.5"` | horizontal rail chip |
| `app/(site)/labs/labs-view.tsx` (WHY tile) | `"flex items-center gap-2 rounded-card border border-border-subtle bg-surface-1 px-3 py-2.5"` | 3-up grid tile |
| `app/(site)/labs/labs-view.tsx` (methodology step chip) | `"rounded-card bg-surface-2 px-3 py-1.5"` (no border) | inline flow chip |
| `features/process/gate-stepper.tsx` (`.gate-detail__block`, CSS) | `border, rounded-card, bg-surface-1, padding: 0.85rem` | 10 grep hits, but all within one feature/CSS block |
| `features/case-studies/before-after-slider.tsx` (mock mini-cards) | `"rounded-card border border-border-subtle bg-surface-2 p-2"` (×2–3) | **illustrative fake UI**, not real content — must not be touched by any refactor |

**Verdict: keep independent.** These share vocabulary (`rounded-card`, `border-subtle`, `bg-surface-*`) but not exact class strings, and per the audit rule ("if two cards differ in layout hierarchy... keep separate") — horizontal single-line chips are a different layout hierarchy from the vertical title+body panels in Family 1. Each individual site also has only one in-file usage; grouping them into a "Chip" primitive would be exactly the "feels similar" abstraction the brief warns against. Revisit only if a 4th genuinely near-identical chip appears.

---

## Family 5 — Stat tiles (no extraction)

| File | Mechanism | Structure |
|---|---|---|
| `features/writing/stats-row.tsx` (`StatsRow`) | Tailwind: `"flex flex-col gap-3 bg-surface-1 p-6 md:p-8"`, no border/rounding, animated counters | article-embedded stat cells |
| `features/home/home-bands.tsx` (`StatsBand`, via `.stats-dash__cell`) | CSS: `border-top: 1px solid var(--color-border-subtle)` only, no rounding, no background | 8-metric homepage dashboard grid |

**Verdict: keep independent.** These are two deliberately different visual systems (rounded padded surface vs. flat bordered dashboard cell) serving different pages with different design intent — grouping by "both show a stat" (intent) rather than by structure would violate the audit's core rule. No action.

---

## Dead CSS / Unused Styles / Legacy Abstractions

| Item | File | Finding | Recommendation |
|---|---|---|---|
| `.jargon-card` | `app/(site)/globals.css:1353` | Zero `.tsx` references anywhere in the repo (verified directly, not just via the inventory agent). The jargon tiles in `why-view.tsx` actually render via `.bento-cell` + `.jargon-term`/`.jargon-note`, which *are* used. | **Delete.** Dead CSS, safe removal. |
| `.persona-emphasis` (+ `::before`) | `app/(site)/globals.css:1899` | Zero `.tsx` references anywhere in the repo (verified directly). | **Delete.** Dead CSS, safe removal. |
| `.site-card` family (`.site-card`, `__emoji`, `__label`, `__desc`, `__arrow`) | `app/(site)/globals.css:960`, consumed only by `app/(site)/start/start-view.tsx` | Not dead (14 real usages), but it's a **legacy, pre-Tailwind-refactor abstraction**: a bespoke CSS-class card living alongside 9 Tailwind-class card implementations that do the same "icon/label/desc + hover reveal" job. It is real, working, single-consumer CSS — not urgent, but it's the one card family in this audit still written in the "old" style. | **Do not touch now.** Flag as a future migration target once `PanelCard` exists — converting it to `PanelCard` would retire an entire bespoke CSS block, but only after the primitive itself has proven out on lower-risk pages. Not a Sprint 1 action. |
| Inline `<TierCard>`-shaped duplicate | `app/(site)/start/start-view.tsx` (~line 416) | Not dead CSS, but a **real, already-abstracted-elsewhere duplicate**: `TierCard`/`TierGrid` already exists and is used in 3 other files; `start-view.tsx` re-implements the same box + badge + price layout locally instead of importing it. | **Fix directly (small, targeted PR), independent of the two new primitives** — this is "stop duplicating an existing component," not "extract a new one." |

---

## Variant Matrix

| Variant axis | `PanelCard` | `MediaCard` |
|---|---|---|
| Emphasis | `default` / `accent` / `subtle` | — (use `surface` instead) |
| Surface | `surface-1` (default), `/50`–`/60` opacity modifier | `surface-0` / `surface-1` / `surface-2` |
| Radius | `card` (12px, compact) / `panel` (24px, default) | `card` (12px) only — no observed `rounded-panel` media card |
| Density/padding | `compact` (p-3) / `default` (p-4–p-5) / `spacious` (p-8) | n/a — image fills bleed, only caption padding varies |
| Interactive hover | optional `hover:border-border-strong` | built-in `group`/`group-hover` caption reveal, or static `figcaption` mode |
| Root tag | `div` / `article` / `li` | `div` / `figure` / `a` / `button` |
| Content model | free-form children (label/title/body/list/footer) | `header?` slot + `children` (media) + `caption?` slot |

---

## Proposed API

```tsx
// PanelCard — bordered content panel (Family 1)
<PanelCard
  emphasis="default" | "accent" | "subtle"
  density="compact" | "default" | "spacious"
  interactive={boolean}
  as="div" | "article" | "li"
>
  {/* free-form: eyebrow/label, title, body, optional <ul>, optional footer divider+meta */}
</PanelCard>

// MediaCard — image/preview card with caption (Family 2)
<MediaCard
  surface="surface-0" | "surface-1" | "surface-2"
  as="div" | "figure" | "a" | "button"
  header={<BrowserChrome />}       // optional, e.g. LivePreviewCard's dots+host bar
  caption={<span>...</span>}
  captionMode="overlay" | "footer-bar"
>
  {/* the image / iframe / GSAP-driven media itself */}
</MediaCard>
```

Deliberately **not** templatizing internal content (title/body/list markup) inside either primitive — every real duplication found was in the **outer box** (border/radius/background/padding/overflow) and, for `MediaCard`, the **caption mechanic**. The inner content varies too much per site (price tables, chapter counts, tag pills, download links) to force into a shared sub-API without adding indirection that the evidence doesn't justify.

---

## Migration Order

1. **Fix `start-view.tsx`'s inline tier-card duplicate** → import `TierCard`/`TierGrid` instead. Zero new primitive needed; smallest, lowest-risk change; removes the largest single chunk of byte-identical duplication in the audit.
2. **Delete dead CSS**: `.jargon-card`, `.persona-emphasis`. Zero risk, zero consumers.
3. **Build `<PanelCard />`**, migrate in this order (lowest to highest risk):
   a. `app/(site)/type/type-view.tsx` (4× static, internal reference page, no interactivity — safest proving ground)
   b. `features/offers/investment-value.tsx` + `app/(site)/process/process-view.tsx` operating-principles card (near-byte-identical pair, migrate together to immediately collapse a real duplication)
   c. `app/(site)/agreement/agreement-view.tsx` discovery-question card (compact variant)
   d. `features/resources/resource-blocks.tsx` `ResourceCard` and `app/(site)/labs/labs-view.tsx` research-area card (near-identical pair, migrate together)
   e. `app/(site)/books/books-view.tsx` book card, `app/(site)/start/start-view.tsx` fits/not-fits + "how do we start" cards (each has a `motion.div`/CTA wrapper around the card — verify hover/animation still composes correctly)
   f. Leave `TierCard` itself and `.site-card` alone for now (see Dead/Legacy section)
4. **Build `<MediaCard />`**, migrate in this order:
   a. `features/case-studies/case-gallery.tsx` (simplest — static figure/figcaption, no hover-JS dependency beyond CSS)
   b. `features/gallery/gallery-view.tsx` masonry item
   c. `features/case-studies/panels.tsx` deliverables gallery item
   d. `features/work-ui/live-preview-card.tsx` (verify the browser-chrome header slot and live-iframe hover scrim still work identically — highest interaction complexity)
   e. `features/gallery/rotating-gallery.tsx` (verify GSAP scroll-tilt still targets the correct element after the border moves from inline `style` to a class — highest visual-regression risk, do last)
   f. Optionally adopt `features/work/floating-preview.tsx` once the primitive is proven (not required — single usage, no urgency)

---

## Risk Analysis

| Risk | Where | Mitigation |
|---|---|---|
| Visual drift from consolidating inconsistent opacity/padding values (`bg-surface-1` vs `/50` vs `/60`, `p-4` vs `p-5`) | `PanelCard` migration, especially step 3b/3d pairs | Treat consolidation as an intentional visual normalization, not a "no-op refactor" — screenshot-diff each migrated page before/after and get explicit sign-off on the (small) visual changes rather than assuming pixel parity |
| Breaking GSAP scroll-tilt or live-iframe hover scrim by moving styling ownership into a shared component | `MediaCard` migration steps 4d/4e | Keep `MediaCard` as a pure visual shell with slots; do the two highest-complexity migrations last, after the primitive's contract is stable from 3 easier migrations |
| RTL correctness (`ps-*`/`pe-*`/logical properties are a known repo convention — see `article-body.tsx`) | Both primitives, if any physical `pl-*`/`pr-*`/`text-left` sneaks into the shared component | Audit primitive source for physical (non-logical) properties before merging; several source sites already use `text-start`/`ps-*` correctly, don't regress that |
| Scope creep: pressure to also fold in Family 3/4/5 "because they're cards too" | Post-primitive follow-up work | This audit explicitly recommends against it — no genuine duplication was found there; revisit only if a 3rd/4th truly identical instance shows up later |
| `TierCard` fix (migration step 1) touching pricing/checkout-adjacent copy | `start-view.tsx` | Lowest technical risk (pure markup swap) but highest **content** risk since it's user-facing pricing — diff the rendered tier data carefully, this page may have subtly different tier content than the other 3 `TierGrid` consumers |

---

## Stop Point (original audit)

This was the full initial audit. No components, CSS, or primitives were created or modified. The validation pass below was performed after the audit was accepted, re-reading every candidate file line-by-line before any implementation. **No code has been changed by this validation pass either** — findings below revise, and in two places correct, the original audit's conclusions.

---
---

# Validation Pass (post-acceptance, pre-implementation)

Every file below was re-read in full (not re-summarized from the prior inventory) specifically to check DOM hierarchy, interaction model, hover behavior, padding, border, radius, background, and typography hierarchy against each other. Where the evidence disagreed with the original audit, the conclusion below overrides it and says so explicitly.

## 1. PanelCard — line-by-line validation

### Evidence table (every candidate, fully re-verified)

| # | File / component | DOM hierarchy | Interaction model | Hover behavior | Padding | Border | Radius | Background | Typography |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `offer-blocks.tsx` `TierCard` | `div` → (row: tag `span` + optional recommended `span`) → name `p` → price `p` → priceNote `p` → `dl` (bestFor/duration/payment) → includesHead `p` → `ul` (includes `li` + excludes `li`) | Static — no motion wrapper; `TierGrid` lays out in plain CSS grid | None (no `hover:` class on the card itself) | `p-3` | `border` + conditional `border-accent` / `border-border-subtle` | `rounded-panel` | `bg-surface-1` (full) / `bg-surface-1/60` | Tag/badge: `font-mono text-micro uppercase tracking-[0.10em]`. Name: `font-display text-title tracking-[-0.015em]`. Price: `font-geist text-lead text-accent`. Meta (`dl`): `font-mono text-micro`. List: `text-body-sm`. **All design tokens.** |
| 2 | `start-view.tsx` inline tier card (~line 416) | `div` → **absolute-positioned** badge `span` (not inline, unlike #1) → tag `p` → name `p` → price `p` → duration `p` → note `p` (`mt-auto border-t pt-3`) — **no `dl`, no includes/excludes `ul`** | Static — plain `div`, no motion wrapper on the card itself (sibling "how-we-start" cards in the *same file* DO use `motion.div` — inconsistent even within this one file) | None | `p-5` (not `p-3`) | Same conditional `border-accent` / `border-border-subtle` pattern | `rounded-panel` | Same `bg-surface-1` / `bg-surface-1/60` pattern | Tag: `text-[0.6rem]` (arbitrary). Name: `text-[1.2rem]` (arbitrary). Price: `text-[1.5rem]` (arbitrary) — **none of these are `text-micro`/`text-title`/`text-lead` tokens.** Note body: `text-[0.8rem]` + inline `style={{fontFamily:"Montserrat"}}` override. |
| 3 | `resource-blocks.tsx` `ResourceCard` | `motion.article` → (row: id `span` + stage `span`) → title `h3` → subtitle `p` (italic) → desc `p` → feeds `p` → divider `div` → download/lock CTA | `motion.article` `whileInView` fade+slide-y (`physics` transition, once) | `hover:border-border-strong` (non-recommended only); no image/overlay | `p-4` / `p-5` (md) | `border` + conditional `border-accent/40` / `border-border-subtle` | `rounded-panel` | `bg-surface-1` | id/stage/feeds: `font-mono text-micro`. Title: `font-display text-title tracking-[-0.015em]`. Subtitle: `text-body-sm italic text-accent`. Desc: `text-body-sm`. **All tokens — identical vocabulary to #4.** |
| 4 | `labs-view.tsx` research-area card | `article` → (index `span`) → title `h3` → blurb `p` → tag pills `ul` → footer note `p` (top border) | Static — plain `article`, no motion | `hover:border-border-strong` | `p-4` / `p-5` (md) | `border border-border-subtle` (no accent-state variant — this card has no "recommended" concept) | `rounded-panel` | `bg-surface-1` | Title: `font-display text-title tracking-[-0.015em]` (**byte-identical to #3**). Blurb: `text-body-sm` (**identical to #3**). Tag pills: `font-mono text-micro`. **All tokens.** |
| 5 | `investment-value.tsx` metric card | `motion.div` → value `span` → label `span` → sub-copy `span` | `motion.div` `whileInView` fade+slide-y, staggered `delay: i * 0.08` | None | `p-4` | `border border-border-subtle` | `rounded-panel` | `bg-surface-1` | Value: `text-[clamp(2rem,4vw,2.75rem)]` (arbitrary/clamp). Label: `text-[0.6rem]` (arbitrary). Sub: `text-[0.72rem]` (arbitrary) + inline Montserrat. |
| 6 | `investment-value.tsx` value-prop card | `motion.div` → accent dot `span` → title `p` → body `p` | `motion.div` `whileInView` fade+slide-y, staggered `delay: i * 0.06` | None | `p-4` | `border border-border-subtle` | `rounded-panel` | `bg-surface-1/60` | Title: `text-[0.95rem] tracking-[-0.01em]` (arbitrary). Body: `text-[0.8rem] leading-[1.6]` (arbitrary) + inline Montserrat. **Byte-identical arbitrary values to #7.** |
| 7 | `process-view.tsx` operating-principles card | `motion.div` → number `span` → title `p` → body `p` | `motion.div` `whileInView` fade+slide-y, staggered `delay: i * 0.06` — **identical mechanic and delay formula to #6** | None | `p-4` | `border border-border-subtle` | `rounded-panel` | `bg-surface-1` (full opacity — the one difference from #6's `/60`) | Title: `text-[0.95rem] tracking-[-0.01em]` (**byte-identical to #6**). Body: `text-[0.8rem] leading-[1.6]` (**byte-identical to #6**) + inline Montserrat. |
| 8 | `books-view.tsx` book card | outer `motion.div` (entrance only) → `Link` (**the card surface itself is the `<a>`**) → title block `div` (edition `span`, title `h2`, blurb `p`) → footer `div` (border-t: chapter count `span` + CTA `span` with arrow) | `motion.div` `whileInView` fade+slide-y (entrance) around a `Link` that is itself the card | `hover:border-accent/40` on the `Link`; `group-hover:translate-x-1` on the arrow | `p-5` / `p-6` (md) | `border border-border-subtle` | `rounded-panel` | `bg-surface-1` | Edition/footer meta: `font-mono text-micro`. Title: `font-display text-title tracking-[-0.02em]`. Blurb: `text-body-sm`. **All tokens.** |
| 9 | `start-view.tsx` fits card | `div` → label `p` → `ul` (bullet `li`s, custom dot marker) | Static, no motion | None | `p-5` | `border border-accent/20` | `rounded-panel` | `bg-surface-1` | Label: `text-[0.6rem]` (arbitrary). List item: `text-[0.875rem] leading-[1.65]` (arbitrary) + inline Montserrat. |
| 10 | `start-view.tsx` not-fits card | `div` → label `p` → `ul` (bullet `li`s, dash marker) | Static, no motion | None | `p-5` | `border border-border-subtle` | `rounded-panel` | `bg-surface-1/50` | Same arbitrary-value pattern as #9. |
| 11 | `start-view.tsx` "how do we start" step card | `motion.div` → (row: step-number `span` + optional "Free" badge `span`) → name `p` → body `p` (flex-1) → optional CTA `a` | `motion.div` `whileInView` fade+slide-y, staggered `delay: i * 0.12` | CTA link has `hover:text-text-primary`; card itself has no hover state | `p-5` | `border border-border-subtle` | `rounded-panel` | `bg-surface-1` | Step/badge: `text-[0.6rem]`/`text-[0.55rem]` (arbitrary). Name: `text-[1.1rem]` (arbitrary). Body: `text-[0.82rem]` (arbitrary) + inline Montserrat. |
| 12 | `agreement-view.tsx` discovery-question card | `div` → head label `p` → `ul` (question `li`s) | Static, no motion | None | `p-3` (compact) | `border border-border-subtle` | **`rounded-card`** (not `-panel` — the compact variant) | `bg-surface-1` | Head: `font-mono text-micro uppercase`. Items: `text-body-sm`. **Tokens** — matches the token cohort, not the arbitrary-value cohort. |
| 13 | `type-view.tsx` ×4 context panels | `div` → `CtxLabel` (`p`, mono label) → live type sample (`h1`–`h3`/`p`/`span` with inline `style={{fontSize, lineHeight, letterSpacing}}`) | Static, no motion | None | `p-8` | `border border-border-subtle` | `rounded-panel` | `bg-surface-1` | The label is tokenized (`font-mono text-[0.62rem]`, itself arbitrary); the *sample content* is deliberately raw inline-styled (it's a type-scale reference page — the whole point is showing exact px/clamp values, not applying tokens) |

### Confirmed structurally identical enough for one primitive?

**Yes for the outer box — with one important caveat surfaced by this pass that the original audit did not call out.**

Across all 13 rows the **shell** — `rounded-panel` (or `rounded-card` for the compact variant), a `border` in one of `{border-subtle, accent, accent/20, accent/40}`, a `bg-surface-1` in one of `{full, /50, /60}`, and padding from the fixed set `{p-3, p-4, p-5, p-8}` — is genuinely, provably identical or near-identical (differs only in emphasis/density modifiers that map cleanly to variant props). That part of the original audit holds up.

**What the original audit missed:** there are **two incompatible typography conventions** living inside this one family, not one:
- **Token cohort** (rows 1, 3, 4, 8, 12): uses `text-title`, `text-body-sm`, `text-micro`, `font-display`/`font-mono` design-system classes throughout.
- **Arbitrary-value cohort** (rows 2, 5, 6, 7, 9, 10, 11): uses raw bracket values (`text-[0.6rem]`, `text-[0.95rem]`, `text-[1.2rem]`, etc.) plus an inline `style={{fontFamily: "Montserrat, system-ui"}}` override instead of a `font-sans` token, on almost every body-copy line.

This is not a per-card quirk — it's a **page-level** convention split: `pricing`/`services`/`resources`/`labs`/`books`/`agreement` (editorial/library pages) consistently use tokens; `start`, `process`, and `investment-value` (conversion-focused pages) consistently use arbitrary values + inline Montserrat. Rows 6 and 7 are close to byte-identical to each other (`text-[0.95rem] tracking-[-0.01em]` / `text-[0.8rem] leading-[1.6]`, same stagger-delay formula) — strong, confirmed duplication, good first migration pair. But building `PanelCard` around the token cohort's typography (the more "correct" convention, matching the rest of the design system) means rows 2, 5, 6, 7, 9, 10, 11 need their type values converted to tokens **as part of migration, not as a side effect of it** — this is real, visible work, not a mechanical class swap, and it changes six files' rendered font sizes by fractions of a rem/line-height. Flagged as a **migration cost**, not a blocker.

### Required variants (final list, each justified by a specific row above)

| Variant | Values | Justified by |
|---|---|---|
| `emphasis` | `default` (border-subtle) / `accent` (border-accent + optional `shadow-card`, full-opacity surface) / `subtle` (border-subtle, `bg-surface-1/50`–`/60`) | Rows 1, 2 (recommended/emphasized tier), 6, 9, 10 |
| `density` | `compact` (`p-3`, `rounded-card`) / `default` (`p-4`/`p-5`, `rounded-panel`) / `spacious` (`p-8`) | Rows 1/12 (compact) vs. 3/4/8/9/10/11 (default) vs. 13 (spacious) |
| `interactive` | boolean, toggles `hover:border-border-strong` | Rows 3, 4, 8 (only these three are ever hover-styled; rows 1, 2, 5–7, 9–13 have zero hover state on the card) |
| `as` | `div` / `article` / `li` | Row 3 uses `article` (semantically a card), most others use plain `div`; `TierGrid`/lists don't use `li` today but nothing precludes it |

No variant for "entrance animation" — motion is applied by the *consumer* wrapping `PanelCard` in their own `motion.div` (rows 3, 5, 6, 7, 8, 11 already do this; rows 1, 2, 4, 9, 10, 12, 13 don't animate at all). The primitive should not own `motion` — baking it in would force animation onto the seven currently-static consumers, which is a real visible regression risk for zero justified benefit (no call site asked for it as a *card* concern; it's applied per-page, inconsistently, by choice).

---

## 2. MediaCard — line-by-line validation

### Evidence table

| # | File / component | Overlay positioning | Aspect ratio | Image wrapper | Caption placement | Hover animation | Border treatment |
|---|---|---|---|---|---|---|---|
| 1 | `live-preview-card.tsx` `LivePreviewCard` | **Centered** scrim (`flex items-center justify-center`) over the media only | Fixed `aspect-[16/10]` | `<iframe>` (not an image at all) scaled via `container-type: inline-size` + `scale(100cqw/1440)` | **Static footer bar below media** (name + discipline), separate from the hover scrim | Border-color change (`hover:border-border-strong`) **+** centered scrim fade-in on the media | `border border-border-subtle` static, color-shifts on hover |
| 2 | `case-gallery.tsx` `CaseGallery` | **None** — no overlay at all | Fixed `aspect-[16/9]` | `next/image` with `fill`, inside a `position:relative aspect-[16/9]` div | **Static `<figcaption>` footer bar below media** (caption + accent dot) | Image itself scales `group-hover:scale-[1.02]`; figcaption accent-dot opacity increases | `border border-border-subtle` static, no hover change |
| 3 | `gallery-view.tsx` masonry item | **Bottom-aligned** overlay (`flex flex-col justify-end`), opacity 0→100 | **Dynamic**, per-image (`style={{aspectRatio: w/h}}`, `height:auto`) — required for CSS-columns masonry packing | `next/image` **without** `fill`, sized via width/height props, no wrapping div | **Hover-only overlay caption** inside the media bounds (gradient + label + text) | Image scales `group-hover:scale-[1.03]` **and** gradient overlay fades in (opacity transition) | `border border-border-subtle` static, no hover change |
| 4 | `panels.tsx` `ExecutionPanel` gallery item | **Bottom-aligned** overlay via `translate-y-full` → `translate-y-0` (slide, not fade) | **Dynamic**, per-image inline `aspectRatio` — masonry (`break-inside-avoid`) | Plain `<img>` tag (**not `next/image`** — inconsistent with #2/#3), no wrapping div | **Hover-only overlay caption**, but via slide transform, not opacity | Image scales `group-hover:scale-105` **and** caption slides up (translate transition — different technique from #3's opacity fade) | `border border-border-subtle` static, no hover change |
| 5 | `rotating-gallery.tsx` `Card` | Bottom overlay via `translate-y-full`→`0` (same technique as #4) | Two-bucket dynamic: `aspectRatio: isPortrait ? "3/4" : "16/9"` — not per-image, not a single fixed ratio either | `next/image` with a forwarded `ref` so **GSAP can drive its `filter` directly** — sized via inline style, no wrapping div | Hover-only overlay caption (slide, matches #4) | **Not primarily hover-driven at all** — the whole card's 3D rotation/z/brightness is scroll-scrubbed via GSAP `ScrollTrigger` acting directly on the card's DOM ref; hover only affects the caption slide | **No `border-border-subtle` class** — uses inline `style={{borderLeft: "2px solid " + accent}}`, a single accent-colored edge, not the shared border token at all |
| (excluded, single-use) | `floating-preview.tsx` `FloatingPreview` | n/a (no image-overlay caption at all — a bottom "record stamp" bar with `backdrop-blur` + `bg-surface-0/70`, a third distinct caption technique) | `absolute inset-0` — sized entirely by parent, no aspect-ratio concept | `next/image` with `fill` + `onError` fallback-hide, plus a gradient/watermark base layer underneath | Static bottom bar, but styled with translucency+blur instead of the `bg-surface-1` solid footer used elsewhere | `motion.div` crossfade (Framer `AnimatePresence`) driven by parent hover state — not a `group-hover` on itself | **`border-border-default`** — yet a *third* different border color token from the rest of the family |

### Are overlay positioning / aspect ratio / image wrapper / caption placement / hover animation / border treatment truly shared?

**No — verified false on all six axes for the full 6-instance set.** Specifically:

- **Overlay positioning**: 3 distinct answers (centered scrim / none / bottom-aligned), and bottom-aligned itself splits into 2 different techniques (opacity-fade vs. translate-slide).
- **Aspect ratio**: fixed-ratio cards (rows 1–2) vs. masonry cards that *must* stay dynamic to pack correctly (rows 3–4) vs. a two-bucket heuristic (row 5) vs. no-ratio-at-all (excluded row). A single `aspectRatio` prop would actively break the masonry consumers.
- **Image wrapper**: `<iframe>` (row 1) vs. `next/image fill` in a positioned div (row 2) vs. bare `next/image` with no wrapper (row 3) vs. bare `<img>` (row 4, not even the same base element as row 3) vs. `next/image` with a GSAP-forwarded ref (row 5).
- **Caption placement**: static-footer-below-media (rows 1–2) vs. hover-only-overlay-on-media (rows 3–5) — two genuinely different content models, not a styling variant of one model.
- **Hover animation**: five instances, five different mechanisms (border-highlight+scrim / scale-only / scale+opacity-overlay / scale+slide-overlay / scroll-scrub-3D-not-hover-at-all).
- **Border treatment**: 4 of 6 share `border border-border-subtle` literally; row 5 uses an inline single-edge accent border (structurally incompatible with a `border` class prop); the excluded row uses yet a third token (`border-default`).

### Verdict: **split, per the brief's own rule** ("if two cards differ in layout hierarchy or interaction model, keep them separate")

- **`<MediaCard />` should be built, but only as a pure visual *shell*** — `overflow-hidden`, `rounded-card`, `border border-border-subtle`, a `surface` background prop — with **zero owned caption or hover behavior**. That shell genuinely is shared, near-verbatim, across rows 1–4 (LivePreviewCard, CaseGallery, gallery-view masonry item, ExecutionPanel gallery item). Caption and hover-reveal stay as free-form children, exactly like `PanelCard`'s internals — the primitive supplies the box, not the interaction.
- **`rotating-gallery.tsx`'s `Card` must be explicitly excluded**, not treated as a future "nice-to-have" adopter as the original audit implied. Its GSAP `ScrollTrigger` needs a direct, stable ref to the actual rendered DOM node to drive 3D transforms every scroll frame; wrapping it in a shell component adds an indirection layer between GSAP and the node it must animate, and its border isn't even the shared token — it's a per-project inline accent color on one edge. Forcing this into `MediaCard` is a correctness risk for a component that today has zero bugs.
- **`floating-preview.tsx`'s `FloatingPreview` stays excluded** — confirmed on a third, previously-unchecked axis (border token): it uses `border-border-default`, not `border-border-subtle` like every other row. Combined with being `absolute inset-0` (parent-sized, no aspect ratio) and single-use, there is no genuine duplication here at all, in any direction. The original audit's "nice-to-have adopter" framing is dropped.

### Revised required variants (shell-only primitive)

| Variant | Values | Justified by |
|---|---|---|
| `surface` | `surface-0` / `surface-1` | Row 1 uses `bg-surface-0`; rows 2–4 use `bg-surface-1`. (`surface-2` dropped — no remaining core row uses it after excluding rows 5 and the floating-preview row.) |
| `as` | `div` / `figure` / `a` / `button` | Row 1 is an `a`, row 2 is a `figure`, rows 3–4 are `button`/`div` |
| `aspect` | `'16/9'` \| `'16/10'` \| `undefined` (auto, image sets its own height) | Rows 1–2 need a fixed ratio; rows 3–4 must NOT get one (masonry) — this has to be opt-in, never a default |

No `captionMode`/`header` "mode" props as originally sketched — those implied the primitive owns caption/overlay rendering. It doesn't, after this pass. `header` (browser-chrome bar) and `caption` (footer or overlay) are just `children`, laid out by each consumer exactly as they are today.

---

## 3. API validation — smallest possible surface, every prop tied to a call site

### `PanelCard`

| Prop | Values | Call site(s) that require it | Kept? |
|---|---|---|---|
| `emphasis` | `default` \| `accent` \| `subtle` | Rows 1 (`recommended`), 2 (`emphasized`), 6/9/10 (`/50`–`/60` opacity) | ✅ Kept |
| `density` | `compact` \| `default` \| `spacious` | Row 1/12 = compact; rows 3/4/8/9/10/11 = default; row 13 = spacious | ✅ Kept |
| `interactive` | `boolean` | Rows 3, 4, 8 (`hover:border-border-strong`) — all others never set it | ✅ Kept |
| `as` | `'div'` \| `'article'` \| `'li'` | Row 3 uses `article` | ✅ Kept, but `li` has **no current call site** — every consumer above renders inside a `<div>` grid, not a `<ul>`. **Removed** until a real `<li>` consumer exists; add it back the day one does. |
| ~~`onEntrance`/animation props~~ | — | No call site asks the card itself to animate — animation is always the *consumer's* wrapping `motion.div`, applied inconsistently (7 of 13 rows animate, 6 don't) | ❌ Removed — would be a "for future flexibility" prop with zero backing call sites |

Final: `emphasis`, `density`, `interactive`, `as` (`'div' | 'article'` only), `children`. Four props, all with ≥1 real call site.

### `MediaCard`

| Prop | Values | Call site(s) that require it | Kept? |
|---|---|---|---|
| `surface` | `surface-0` \| `surface-1` | Row 1 vs. rows 2–4 | ✅ Kept, `surface-2` **removed** — no core row (1–4) uses it after excluding rows 5/floating-preview |
| `as` | `'div'` \| `'figure'` \| `'a'` \| `'button'` | Rows 1 (`a`), 2 (`figure`), 3 (`button`), 4 (`div`) | ✅ Kept — all four have a real, distinct consumer |
| `aspect` | `'16/9'` \| `'16/10'` \| `undefined` | Rows 1–2 vs. rows 3–4 | ✅ Kept, opt-in only |
| ~~`header`~~ | — | Only row 1 (browser chrome) uses anything like a header, and it's a fully bespoke 5-element chrome bar, not a generic slot worth naming | ❌ Removed — becomes ordinary `children`, first child in the JSX, no named prop needed |
| ~~`caption`/`captionMode`~~ | — | Every row's caption differs in placement, trigger, and animation (see table above) — templating it would either under-fit 4 of 5 cases or require its own mini-API that duplicates what plain `children` already does | ❌ Removed — caption stays hand-authored `children` per consumer, same as today |

Final: `surface`, `as`, `aspect`, `children`. Three props, all with ≥1 real call site, down from the original sketch's five.

---

## 4. Migration impact (estimated from the files actually read)

| Metric | `PanelCard` | `MediaCard` |
|---|---|---|
| **Files affected** | 8 files: `offer-blocks.tsx`, `start-view.tsx` (3 separate card sites in this one file), `resource-blocks.tsx`, `labs-view.tsx`, `investment-value.tsx` (2 sites), `process-view.tsx`, `books-view.tsx`, `agreement-view.tsx`, `type-view.tsx` | 4 files: `live-preview-card.tsx`, `case-gallery.tsx`, `gallery-view.tsx`, `panels.tsx` (`ExecutionPanel` only) |
| **LOC removed (outer-box boilerplate only, not content)** | ~2–3 lines per site (the conditional class-array/ternary for emphasis, replaced by one prop) × 13 sites ≈ **25–40 LOC** | ~1 line per site (the fixed className string) × 4 sites ≈ **4–6 LOC**, plus the eventual retirement of the ternary in `case-gallery.tsx`'s span conditional |
| **Duplicated Tailwind class-substrings eliminated** | The 4-token combo `rounded-panel border … bg-surface-1 p-*` currently hand-written 13 times collapses to 1 definition | The 4-token combo `overflow-hidden rounded-card border border-border-subtle bg-surface-*` currently hand-written 4 times collapses to 1 definition |
| **Estimated bundle impact** | Negligible to slightly negative in isolation — a new ~20–30 line component adds a small amount of JS, while removing ~30 LOC of inline class strings across 8 files saves roughly the same. Tailwind's generated CSS is unaffected either way (same utility classes get used, just centrally instead of repeated) — **no measurable CSS bundle change**, since Tailwind already dedupes identical utility classes across files. Net effect: roughly bundle-neutral, not a size win — the value is maintainability, not payload. | Same reasoning, smaller scale (4 sites): bundle-neutral. |
| **Regression risk** | **Medium**, driven entirely by the typography-token normalization identified in §1 (6 of 13 sites need arbitrary values converted to tokens, a visible rendering change) rather than by the box itself (low risk). Recommend doing the box-only migration first for all 13 sites, confirming zero visual diff, then doing the typography-token normalization as a **separate, explicitly-reviewed follow-up PR** — bundling both changes into one migration risks an unreviewable, hard-to-bisect diff. | **Medium-to-high** if scope creeps to rows 5 (`rotating-gallery`) or the excluded `FloatingPreview` — both are now explicitly out of scope, which caps the risk at **low-to-medium** for the 4 in-scope rows (pure shell swap, no behavior change since caption/hover stay as consumer-owned children). |

---

## 5. TierCard / start-view — investigated, verdict reversed from the original audit

**Original audit said:** "start-view.tsx re-implements the same box + badge + price layout locally instead of importing [`TierCard`] — fix directly, independent of the two new primitives."

**This is wrong, and the validation pass caught it.** Line-by-line comparison of `lib/offers.ts`'s `Tier` interface against `start-view.tsx`'s local `COPY.en.tiers`/`COPY.ar.tiers` data:

```ts
// Tier (what TierCard requires):
interface Tier {
  tag: Bi; name: Bi; price: string; priceNote: Bi;
  bestFor: Bi; duration: Bi; payment: string; recommended?: boolean;
  includesHead: Bi; includes: readonly Bi[]; excludes?: readonly Bi[];
}

// start-view.tsx's actual local tier objects:
{ tag: "TIER 01", name: "Logo Design", price: "$199 – $279",
  duration: "7 – 10 days", note: "..." }
```

`start-view`'s tiers are missing `priceNote`, `bestFor`, `payment`, `includesHead`, `includes`, and `excludes` entirely — and its rendered card (row 2 in the table above) has no `<dl>` meta block and no checklist `<ul>` to put that data in even if it existed. This isn't an accidental re-implementation of `TierCard` — it's a **deliberately different, condensed 3-line teaser** (badge/tag/name/price/duration/one-line-note) that exists specifically because the page's own copy says so: *"Every tier is ultra-condensed"* (`s02sub` in the file), with an explicit "Detailed breakdown →" link to `/pricing` (where the real `TierCard` is used) immediately below the grid.

Forcing this onto the existing `TierCard` would require either (a) fabricating `bestFor`/`payment`/`includes` data nobody wants shown here, or (b) adding a `condensed` variant to `TierCard` that exactly one call site would ever use — which fails this same report's own API-validation rule in §3 (no prop without ≥1 *distinct* justified call site, and "exactly one site wants a fundamentally shorter card" is a `PanelCard` job, not a `TierCard` job).

**Corrected verdict:** `start-view.tsx`'s tier card is not a `TierCard` duplicate — it's a legitimate `PanelCard` consumer (see row 2 in the Family 1 table), sharing the box/emphasis pattern with the other 12 rows but rendering its own condensed content, same as every other `PanelCard` consumer renders its own content. **Remove this from any "isolated reuse" task list** — there is no reuse task here. It folds into the normal `PanelCard` migration (step 3, per the migration order below), not a separate pre-step.

*(One genuine, separate, much smaller finding stands: `start-view.tsx` uses arbitrary-value typography throughout, including this card — that's real, but it's the typography-normalization work already called out in §1/§4, not a `TierCard` reuse question.)*

---

## 6. Dead CSS — proof, not inference

Both classes were re-checked directly (not re-quoted from the prior inventory agent) across every extension that could reference a class name, plus a manual check for dynamic/concatenated references.

### `.jargon-card` (`app/(site)/globals.css:1353`)

- `grep -r "jargon-card"` across `*.md`, `*.mdx`, `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`: **zero hits outside this audit's own `.md` files** (which only *discuss* the class, they don't apply it).
- Checked `app/(site)/why/why-view.tsx` specifically (the one page with a "jargon" section) line-by-line: it renders `<span className="jargon-term">` and `<span className="jargon-note">` — both real, used, different classes — inside a wrapper that uses `.bento-cell`, **not** `.jargon-card`. The jargon tiles never touch this class.
- Checked for dynamic/template-literal construction (e.g. `` `jargon-${x}` `` or a lookup table mapping some state to `"jargon-card"`): none found — `jargon` and `card` never co-occur as a built string anywhere in source.
- **Verdict: confirmed dead. Zero runtime consumers. Safe to delete.**

### `.persona-emphasis` (`app/(site)/globals.css:1899`)

- `grep -r "persona-emphasis"` across the same extension set: **zero hits outside this audit's own `.md` files**.
- Checked `features/persona/persona-picker-band.tsx` (the one component name-adjacent enough to suspect) directly: it references `.persona-band__option` and related suffixes — a completely different, actually-used class family — and contains no reference to `persona-emphasis` anywhere in the file.
- Checked `components/providers/persona-provider.tsx` (matched a broad `emphasis` grep): the only hit is the plain English word "emphasis" inside a code comment ("...adapt copy/emphasis..."), not the CSS class.
- Checked for dynamic construction: none found.
- **Verdict: confirmed dead. Zero runtime consumers. Safe to delete.**

Both deletions remain low-risk, zero-dependency removals, exactly as the original audit concluded — this pass just replaces "the inventory agent didn't find a consumer" with "I directly verified there is no consumer, including non-tsx files and dynamic string construction."

---

## Stop Point (validation pass)

This completes the requested validation. Summary of what changed versus the original audit:

1. **`PanelCard`**: confirmed viable, but the family contains two incompatible typography conventions (token-based vs. arbitrary-value-with-inline-Montserrat) that must be normalized as an explicit, separately-reviewed step — not folded silently into the box migration.
2. **`MediaCard`**: **narrowed** from 5 core + 2 nice-to-have rows down to **4 core rows, shell-only** (no owned caption/hover/overlay behavior). `rotating-gallery.tsx` and `floating-preview.tsx` are now explicitly excluded, not deferred.
3. **API surface**: trimmed on both primitives — removed `li` from `PanelCard.as` (no call site), removed `surface-2`, `header`, and `caption`/`captionMode` from `MediaCard` (no justified call site once rows 5/floating-preview are excluded).
4. **Migration impact**: quantified per the actual files read; flagged as bundle-neutral (maintainability win, not a payload win), with typography normalization as the main risk driver for `PanelCard`.
5. **`TierCard`/`start-view`**: **verdict reversed** — this is not a reuse-the-existing-component task, it's a legitimate independent `PanelCard` consumer with genuinely different data and content. Removed from any isolated-reuse list.
6. **Dead CSS**: both `.jargon-card` and `.persona-emphasis` directly re-verified dead across all source file types and dynamic-construction patterns, not just the original inventory pass. Cleared to delete.

No code, CSS, or primitives have been created or modified during this validation pass. Awaiting approval before any implementation work begins.
