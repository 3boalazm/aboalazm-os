# Visual refinement + QA — 18 Sep 2026

Refinement pass over four surfaces only: **Homepage Hero**, **Selected Work / Ledger**,
**Pricing comparison**, **Contact form**. No architectural replacement, no route changes,
no new dependencies, no new palette, no new typography, no CMS or backend changes.

Verified against a real render (local Postgres + seeded Payload, headless Chromium) —
not against source reading. Every claim below has a measurement or screenshot behind it.

---

## 1. Method correction (read this first)

Two premises inherited from the brief did **not** hold against the actual repository or
the deployed site. Both changed what was worth doing:

**A. Pass 2 (Expressive System Layer) was not present in the source.**
The brief states it is implemented. In the repository at `4d4e4fa` there were **no**
Violet / Cyan / Lime role tokens — `--color-creative`, `--color-live`, `--color-proof`,
`--color-violet-500`, `#8B5CF6`, `#22D3EE`, `#A3E635` all returned zero matches across
`app/`, `features/`, `components/`, `lib/`. There was no grain layer, no gradient-border
utility, no `atmos-*`, no `edge-light`, and no material system beyond the existing
`@utility glass`. The only decorative gradient in the entire component tree was two
inline radial washes on the featured/ledger *thumbnails*.

Conclusion: **the colour foundation had to be built**, not merely tuned. This is the
opposite of "refine opacity values", so it is called out explicitly rather than folded
silently into the diff.

**B. The docs and the code already agree; the deployed site is ahead of GitHub `main`.**
`design-preview/ux-hierarchy-vnext.md` documents the hardening pass, and the homepage /
`/work` / `/pricing` / `/contact` structures described in audit v2 are present. The repo
tree was clean and `git diff origin/main` was empty. GitHub `main` is pinned at
`4d4e4fa` (17 Sep 20:49 UTC); the live site serves `gad-thumb-2.jpg`, which is not in
the repo. So the live deploy is **ahead** of `main`, not diverged from it.

**No audit decision was made from source alone.** The site was rendered locally at
1440/768/390 in dark/light and en/ar before any edit.

---

## 2. Baseline defects (measured, before any change)

| # | Surface | Defect | Evidence |
|---|---|---|---|
| 1 | Home hero | Atmosphere invisible in the static state | Sections were full-bleed flat `bg-surface-0`. The only colour was a `blur(80px)` glow at effective alpha ~0.08 over a near-black canvas — below the visible threshold. |
| 2 | Home hero | Constellation collapsed to a postage stamp | Fixed **300×350px** at 1440 in a ~570px column's void. Cause: `justify-self-center` on a wrapper with no width + `w-full` inside it, so `w-full` resolved against an auto-width parent. |
| 3 | Home hero | Caption collided with the EXPERIENCE node label | Caption at `bottom-2 left-3` while the node sits at y=508 of a 560 viewBox. |
| 4 | Home hero | Node core invisible in light mode | `<motion.circle fill="#F8F8FA">` — hardcoded near-white on Alabaster. |
| 5 | Home hero | Metric band rule stopped short | Band measured **785px wide on a 1440 viewport**. `container-wide` (margin-inline:auto + max-width, no width) shrink-to-fit as a flex child. |
| 6 | **All bar home** | Atmosphere was off entirely | `--glow-opacity: 0` on `/work`, `/pricing`, `/contact`. The site was flat everywhere except the homepage, where it was near-invisible. |
| 7 | Selected work | No project atmosphere on the cards | The project colour wash sat **underneath** the opaque thumbnail — invisible by construction. |
| 8 | Selected work | Outcomes presented as raw metadata | `font-mono text-micro uppercase` buried under the body copy, identical typographic weight for every destination. |
| 9 | Ledger | Destination type not stated | Every row read `// Open` regardless of whether it opened a case file, a live product, or Behance. |
| 10 | Ledger (mobile) | Affordance was a bare ↗ | No word, no hint of what opens. |
| 11 | **Pricing (mobile)** | Comparison table clipped — third tier unreachable | `tb.width 584px` inside `wrapW 342px`. `Full Brand System` could not be compared on a phone at all. |
| 12 | Pricing | Duplicate recommendation signal | `★ RECOMMENDED` in the header **and** `BEST FOR MOST PROJECTS` in the tier-1 column header — two signals on one screen. |
| 13 | Pricing (mobile) | Label/value split broke words | `Best for:` rendered as `Best` / `for:` at 390px. |
| 14 | Contact | No focal object; no warmth | One matte panel among many, at `--glow-opacity: 0`. |

Baseline screenshots: `qa/baseline/` (48 states) · final: `qa/final/` (48 states).

---

## 3. What changed, surface by surface

### 3.1 Homepage Hero

**Built the expressive layer the brief assumed existed.** Added semantic role tokens and,
critically, made `useAmbientGlow` support a **floor**: a route now rests at a declared
intensity instead of falling to 0 when nothing is hovered.

Before → after: a flat near-black field with a faint grey box.
After → a warm light field leaning toward the constellation, with a violet counter-pool,
a 3.5% grain surface, and a constellation that finally occupies its side of the
composition — **518×604px** (from 300×350), caption welded into its own band so the node
collision is impossible by construction, and every stroke routed through semantic tokens
so light mode keeps its contrast.

The focal light mirrors in RTL (`--atmos-x` flips 74% → 26%), so the Arabic composition
balances instead of becoming a lopsided mirror.

### 3.2 Selected Work / Ledger

- The project's colour wash is now a **visible** layer: image, then a bottom-up
  `from-obsidian/85` scrim, then the project accent. The thumbnail no longer buries it.
- **Outcome moved onto the image** — where a portfolio reader actually looks — replacing a
  mono line buried in the card body.
- **Destination is a typed value.** New `Destination = "case" | "live" | "external"` drives
  the badge, the CTA label, and the arrow together, so the CTA no longer says
  "Read the case" on a card that opens a live site. `live` gets a cyan `Badge`; `case`
  stays quiet (it is the default reading for a portfolio card).
- Ledger rows state their destination: `Case Study` / `Live Product` / `External
  Portfolio`, on desktop as a column and on mobile inline in place of the bare ↗.
- A glass edge-light on the media object gives it material presence in the static state.

### 3.3 Pricing comparison

Rewritten as **two presentations of one data source** rather than one squeezed table:
below `md` the same rows stack into one card per tier; from `md` up the table returns.
All three tiers are now reachable at 390px. The ★ marks `recommended` in exactly one
place and the duplicated header phrase is gone. Tier-card `dl` rows stack instead of
splitting `Best for:` across lines.

### 3.4 Contact form

Given its role — the last step of the funnel — the form is now the route's focal object:
a warm coral floor plus a light field behind it. Warm, human, low-terminal, per the
route-mood goal.

---

## 4. Expressive System Layer — rules encoded

Orange remains the **authorial anchor**: CTAs, focus rings, authorial emphasis, and the
`accent` Badge tone. It was not demoted. Violet / Cyan / Lime are **supporting roles that
carry meaning**:

| Role | Token | Meaning |
|---|---|---|
| creative | `--color-creative` (violet) | creative intelligence / experimental identity |
| live | `--color-live` (cyan) | live system, digital surface, interaction |
| proof | `--color-proof` (lime) | shipped result, forward energy |

Rules enforced in the diff:

1. **One accent family per surface.** Home = orange + violet. Contact = coral. Pricing =
   orange + a lime whisper. Work = violet + cyan floor, with project accents on top.
   No surface uses all three.
2. **Atmosphere, never paint.** Alpha lands between 0.05 and 0.18. `PRICING_MOOD` is
   0.10/0.05, `WORK_MOOD` 0.11/0.07.
3. **Functional states stay separate** — red/amber/green untouched.
4. **No gradient on every card.** Gradients appear on three surfaces only: the hero,
   the contact form, and the constellation frame.
5. **Light mode has its own values**, not a shared one — Alabaster reflects a wash more
   readily than Obsidian absorbs it (`--atmos-strength-1: 16%` dark vs `10%` light).
6. **Role text colours are theme-aware** (`--color-*-text`): the 400-level tints fail as
   type on Alabaster, so light mode defers to deeper 500/600 values.

---

## 5. Responsive notes

**390px**
- Hero: constellation now renders in flow (340×397) instead of being pushed off-screen.
- Work: outcome sits on the image; destination badge and CTA label both readable.
- Ledger: each row states its destination word inline where the bare ↗ used to be.
- Pricing: comparison stacks into three cards — previously the third tier was clipped
  off-screen with no way to reach it.
- Contact: form stays in the first scroll; hero + CTA unchanged.
- `document.scrollWidth - clientWidth === 0` on all four surfaces (no horizontal overflow).

**768px**
- Hero grid is still single-column until `lg`, so the constellation sits below the fold by
  design. Verified it renders at 518×604 with no nav collision.
- Pricing table shows all three tiers with comfortable gutters and a single recommendation
  signal.
- Work cards run 2-up, unchanged.

**Collision check:** the fixed nav (`navTop 16`) previously sat on top of every route's
`h1` on initial load (nav is 98px tall, `h1` at 162–194px). Now `no` on all routes at all
three widths.

---

## 6. Dark / light and Arabic / RTL notes

**Dark / light**
- Node cores, halos, edges, and the origin ring all resolve through semantic tokens
  (defect 4 fixed — they were a hardcoded `#F8F8FA`).
- Grain inverts and drops to 2.2% on Alabaster; the edge-light switches off
  `mix-blend-mode: screen` (a no-op on a light canvas) for a top-down sheen.
- An `overflow-hidden` clip on the hero clears the 80px-blur glow's overdraw, which
  removed a hairline seam at the viewport edge.

**Arabic / RTL**
- The hero light field mirrors (74% → 26%): verified on `home-1440-light-ar`.
- Ledger destination strings, CTA labels, and tier-comparison fields are all bilingual.
- Nothing was added that assumes LTR: `atmos-field`/`grain-layer`/`edge-light` are
  physically symmetric; the `--atmos-x` flip is the only directional value, and it is
  explicit.

---

## 7. Required checks — results

| Check | Result |
|---|---|
| 1440 / 768 / 390 | ✅ no horizontal overflow, no nav/heading collision |
| Dark + light | ✅ both rendered; light mode has its own atmospheric values |
| English + Arabic/RTL | ✅ 48-state capture set, RTL mirror verified |
| `prefers-reduced-motion` | ✅ **depth retained**: field still painted, `animation: none`, grain and edge-light static, `h1` opacity 1 |
| Focus / keyboard | ✅ 7 tab stops per route, **0** missing visible outlines |
| `npm run typecheck` | ✅ clean (`tsc --noEmit`, exit 0) |
| `npm run build` | ✅ **succeeded** — all routes compiled |

### Focus-state audit (the specific review question)

Keyboard navigation is preserved and now automatically correct on the new controls: focus
was never hover-gated. The `2-col` tier `dl`, the stacked mobile comparison cards, and the
destination badges are all static content or native elements. The form's checkbox uses
`accent-[var(--color-accent)]` and the global `:focus-visible` ring is untouched. Because
the new pricing comparison renders two DOM presentations, only one is ever in the
accessibility tree at a given breakpoint (`hidden md:block` / `md:hidden`), so there is no
duplicate landmark — but this is the one element worth a screen-reader spot-check on a
device before shipping.

---

## 8. `npm run build` — reported separately, as requested

**The build is not blocked by missing Postgres, and no database configuration was
modified.** Details:

- The repository has no `.env`. `DATABASE_URI` and `PAYLOAD_SECRET` were supplied **as
  process environment only** for local verification. No project file was changed.
- Without `PAYLOAD_SECRET`, Payload throws `missing secret key` and the site renders
  its error boundary — so a real render was impossible without it.
- A local Postgres (port 5432) was created and migrated with exactly one run of the
  repo's own `scripts/seed.ts`.
- **First two build attempts were OOM-killed**, not configuration failures. The sandbox
  has 3.9GB RAM, no swap, and only ~1.8GB free with the dev server running.
  `NODE_OPTIONS=--max-old-space-size=1024` (lower, not higher) made it pass in ~133s. This
  is an environment constraint, not a repository defect — Vercel's build image is not
  RAM-constrained in the same way.
- One existing content gap surfaced: `scripts/seed.ts` reports
  `missing file, skipping: /images/work/gad/gad-signage-environmental.png`. Pre-existing,
  unrelated to this pass.

---

## 9. Files changed (12 source files, no new files)

| File | Change |
|---|---|
| `app/(site)/globals.css` | + Expressive role tokens, theme-aware role text colours, `--glow-floor`, `--atmos-strength-*`; new utilities `atmos-field`, `atmos-drift`, `edge-light`, `border-energy`, `grain-layer`; reduced-motion guard for `.atmos-drift`. |
| `hooks/use-ambient-glow.ts` | Floor semantics: `write` sets the resting level, `clear` returns to the floor instead of 0. |
| `lib/tokens.ts` | `GLOW_VARS.floor`. |
| `features/hero/hero.tsx` | Static atmosphere + grain layers, `overflow-hidden`, `z-elevated` on content, `w-full` on the metric band and constellation column, `pt-12 lg:pt-16`. |
| `features/hero/system-constellation.tsx` | Frame is a composed object (caption band), atmosphere inside the frame, semantic node/edge colours, spine vs cross-link edge weight, dashed origin ring, definite sizing. |
| `features/work/featured-cases.tsx` | `Destination` type + copy map, scrim over image, outcome on image, edge-light, `live` badge. |
| `features/work/project-ledger.tsx` | Destination column (desktop) and inline destination (mobile). |
| `features/offers/offer-blocks.tsx` | `TierCompare` split into mobile cards + desktop table from one data source; single recommendation signal; stacked tier-card `dl`. |
| `components/ui/Badge.tsx` | Added `creative` / `live` / `proof` tones. Existing tones untouched. |
| `app/(site)/work/work-header.tsx` | `WORK_MOOD` route floor (violet/cyan). |
| `app/(site)/pricing/pricing-view.tsx` | `PRICING_MOOD` route floor (restrained). |
| `app/(site)/contact/contact-view.tsx` | Coral route floor + light field behind the form. |

**Not changed:** routes, backend logic, data models, content structure, `Button`,
`Heading`, `MediaCard`, `PanelCard`, `Section`, dark/light theme, Arabic/RTL support,
typography system, orange as the brand anchor. No new dependency. Reverting is a single
`git revert` on this commit.

---

## 10. Success criteria — status

| Criterion | Status |
|---|---|
| Feels like a designer portfolio without relying on metadata | ✅ outcome on image, destination stated in words, project colour visible |
| Extra colour appears **before** interaction, still controlled | ✅ every atmosphere layer is static; none is hover-gated |
| Focal composition in hero and selected work | ✅ hero light field; per-project card atmosphere |
| Value not dependent on labels/terminal language | ✅ destination + outcome now carry meaning |
| Gradients/effects serve hierarchy | ✅ 3 surfaces only; cards keep `bg-surface-1` |
| Orange remains the anchor | ✅ unchanged role; roles are additive |
| Static mobile state is rich without hover | ✅ verified at 390 |
| Arabic + light mode are not visually poorer | ✅ mirrored focal light; theme-aware tokens |
| Reduced motion keeps depth via colour and composition | ✅ verified — gradient, grain, edge-light all persist |

**Known limit / next step:** the mobile pricing comparison now duplicates no information,
but it is longer than the table. It was not verified with a screen reader on a real
device — that is the one open item worth a follow-up pass.
