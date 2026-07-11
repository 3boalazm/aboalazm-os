# Phase 1 — Primitive Extraction Audit
Date: 2026-07-11 · Method: 5 parallel read-only codebase searches (Button, Card, Section/Container, Heading, Badge/Tag), full file:line evidence. **No code written yet — this is the audit gate.**

Rule applied throughout: extract only where 3+ genuinely near-identical sites exist. Where evidence fell short, the primitive is skipped regardless of the original request list.

---

## ✅ BUILD — Button

**Evidence:** 13 render sites converge on one visual skeleton (`rounded-pill`, uppercase, tracking-wide, weight-800-ish, hover-lift or hover-opacity), split across three origins:
- 3 CSS-class pairs in `globals.css` (`.not-found-cta`, `.start-cta`, `.process-cta`) → 6 render sites: `features/errors/not-found-content.tsx:163,166`; `app/(site)/start/start-view.tsx:320,328,603,611`; `app/(site)/process/process-view.tsx:547,550`.
- An informal shared component already doing this job for one style: `CtaBand` in `features/offers/offer-blocks.tsx:185-211`, reused 8+ places (home-bands, labs, pricing, agreement, resources, services).
- 6 more hand-rolled near-duplicates never routed through `CtaBand`: `components/layout/nav.tsx:184`, `features/home/home-bands.tsx:199-208`, `app/(site)/services/services-view.tsx:86`, `app/(site)/error.tsx:90`, `features/resources/resource-blocks.tsx:123`, `features/contact/contact-form.tsx:166`.

**Real, load-bearing differences found (must become variants/props, not be flattened):**
- Font: `font-mono` vs `font-display` (weight 800) — two families.
- Background: `bg-accent` (majority) vs `bg-text-primary` (contact form) — an intentional inverted variant.
- Hover behavior: `hover:-translate-y-0.5` (majority) vs `hover:opacity-90` (error page).
- Element type: renders as `<Link>`, `<a>`, and `<button>` (with `disabled:opacity-60` on 2 sites) — needs a polymorphic approach, not three copies.
- Ghost/outline pairing exists alongside every primary (`.not-found-cta--ghost`, `.start-cta-ghost`, `.process-cta-ghost`) — all three are already byte-identical to each other, confirmed in Phase 3A.

**Plan:** `buttonVariants` (cva) exporting `variant: primary | primary-invert | ghost`, `font: mono | display`, sized via existing padding scale, `hover: lift | opacity`. Export both `<Button>` (renders `<button>`) and the raw `buttonVariants()` fn so `<Link className={buttonVariants({...})}>` sites keep using `next/link` untouched — no new polymorphic-ref magic needed.

**Duplicate count removed:** 13 render-site implementations → 1 component, 3 CSS class-pairs deletable (~85 lines of `globals.css`).
**Migration risk:** Low-medium. The `bg-text-primary`/`hover:opacity-90` outliers must map to explicit variants, not get silently normalized to the majority style — visual parity depends on getting exactly these two right.

---

## ✅ BUILD — Card

**Evidence:** three separate genuine families, each independently duplicated 3+ times:

| Family | Sites | Signature |
|---|---|---|
| **Panel** (default) | 14+: `resource-blocks.tsx:89,172`, `investment-value.tsx:98,122`, `offer-blocks.tsx:42-45`, `start-view.tsx:349,366,411,498`, `books-view.tsx:48`, `pricing-view.tsx:66`, `process-view.tsx:445,513`, `labs-view.tsx:88,210`, `type-view.tsx:87,99,119,147` | `rounded-panel border border-border-subtle bg-surface-1`, variable padding (`p-3`→`p-8`), some with `hover:border-border-strong`, some with a **featured** state (`border-accent` + `shadow-card`) |
| **Outlined tile** | 3: `offer-blocks.tsx:145`, `agreement-view.tsx:81`, `services-view.tsx:65` | byte-identical `rounded-card border border-border-subtle bg-surface-1 p-3` |
| **Media** | 3: `panels.tsx:274`, `case-gallery.tsx:27`, `gallery-view.tsx:158` | byte-identical core `group relative overflow-hidden rounded-card border border-border-subtle bg-surface-1`, differing only in trailing layout utilities |

**Explicitly NOT merged (per your instruction — visually distinct, single-use):** `.site-card` (1 site), `.bento-cell` (1 site), `.jargon-card` (0 live render sites — dead CSS, flagged separately, not a Card concern).

**Plan:** `<Card variant="panel" | "outlined" | "media">`, `padding="sm" | "md" | "lg"`, `featured?: boolean` prop for the panel variant's accent state (kept as an explicit prop per your "do not merge visually different cards" instruction — the featured/non-featured distinction is real and stays visible in the API, not hidden behind a default).

**Duplicate count removed:** 20 render sites across 3 families → 1 component, 3 variants.
**Migration risk:** Medium. The panel family has the widest spread (4 different padding values, 2 different hover treatments, 1 conditional featured state) — highest chance of a subtle miss during replacement. Recommend doing Outlined and Media variants first (byte-identical, low risk), Panel last (needs per-site verification).

**Deferred, not built now:** `.labtool-card` (3 sites, but already de-duplicated via a shared CSS class — only the JSX wrapper repeats, e.g. `<div className="labtool-card"><p className="labtool-card__title">…`). Real but low-value; candidate for Sprint 2, not blocking.

---

## ✅ BUILD — Heading

**Evidence:** **15** page-hero sections share a byte-near-identical structure: `<header>` → eyebrow (`font-mono text-label uppercase tracking-[0.06em] text-text-tertiary`) → title (`font-display text-display tracking-[-0.025em]`, optional `<em className="text-accent">`) → optional subtitle (`text-lead text-text-secondary`).

Sites: `about-view.tsx:64`, `books-view.tsx:17`, `labs-view.tsx:38`, `resources-view.tsx:25`, `pricing-view.tsx:31`, `work-header.tsx:8`, `work-ui-header.tsx:9`, `why-view.tsx:90`, `writing-view.tsx:41`, `agreement-view.tsx:45`, `capabilities-view.tsx:10`, `contact-view.tsx:31`, `services-view.tsx:32`, `gallery-view.tsx:87`, `scrolly-case-study.tsx:68`.

**Plan:** `<Heading eyebrow title subtitle actions? />`. `actions` slot absorbs the pricing variant's extra meta line and services' CTA row without new page-specific branching.

**Explicitly NOT touched:**
- `SectionHead` (mid-page H2 pattern, different type tokens `text-micro`/`text-title`) — **already a shared component**, reused 6+ places. Leave as-is. One un-deduped copy found (`AboutTeaser` in `home-bands.tsx:41-48` hand-rolls it instead of calling `SectionHead`) — flagging as a 1-line Sprint 2 fix, not a reason to touch the new `Heading` primitive.
- `/start` and `/process` hero blocks — deliberately bespoke (arbitrary-value classes, distinct color/scale, Framer Motion `reveal` variants). Forcing these into `<Heading>` would either strip motion behavior or bloat the prop API. **Skip, by design.**

**Duplicate count removed:** 15 render sites → 1 component.
**Migration risk:** Low. Class signature is near-identical across all 15; the only variance is `max-w-[Nch]` wrapping and presence/absence of subtitle/actions — both cleanly expressible as props.

---

## ❌ SKIP — Section

**Evidence:** none. Grep for responsive `py-16 md:py-24`-style scales returned **zero matches** anywhere in the codebase. Vertical rhythm is handled by `gap-*` on a parent flex container (`flex flex-col gap-16`), not per-section padding — already consistent across 10+ files without a component. The only place fixed `py-*` values appear on `<section>` tags is `start-view.tsx`/`process-view.tsx` (their own bespoke chapter sections, 3 different values, 2 files, non-responsive) — too small and inconsistent a sample to codify.

**Verdict:** building `<Section>` now would impose structure the codebase doesn't actually have. Skipping, per your instruction to follow evidence over the original list.

## ❌ SKIP — Container

**Evidence:** `.container-content`/`.container-wide` (Tailwind v4 `@utility` classes, already in `globals.css`) are used consistently at 23 sites, almost always once per page at the outermost wrapper. A `<Container>` component would be a pass-through wrapper adding an abstraction layer with zero duplication removed — the CSS utility already *is* the reusable primitive. The only "reinvented container" hits (5, all `mx-auto max-w-[900px|1080px|46ch]`) are a third, narrower width tier used only in `start-view.tsx`/`process-view.tsx` — real, but not enough repetition in one signature to justify a component (candidate for a 4th CSS `@utility`, not a React wrapper, if revisited).

**Verdict:** skip. Extracting this would make the system more abstract without making it smaller, which is the opposite of what you asked for.

## ❌ SKIP — Badge

**Evidence:** no family reaches 3 occurrences. The example labels you gave ("NEW", "Featured", "Enterprise", "Case Study") don't exist as literal strings anywhere in the codebase — they were illustrative, not real. The one real near-duplicate (a "★ Recommended" tier label, 2 sites: `start-view.tsx:417` and `offer-blocks.tsx:52`, `TierCard`) is better fixed by having `start-view.tsx` reuse the existing `TierCard` component than by inventing a new `<Badge>` primitive for 2 sites.

**Verdict:** skip the primitive. Flag the 2-site "Recommended" duplication as a targeted Sprint 2 fix (reuse `TierCard`, don't build `Badge`).

## ⚠️ BORDERLINE — Tag (needs your call)

**Evidence:** 4 sites, split into two near-identical (not byte-identical) families:
- Family A (Geist mono, tight padding): `project-ledger.tsx:206`, `panels.tsx:166`.
- Family B (mono, looser padding): `labs-view.tsx:97`, `labs-view.tsx:238`.

Both are "outlined rounded-pill micro chip" in intent — same shape, differ only in font family and padding scale. Neither family alone hits 3 on an exact-string match; combined, loosely, they total 4. `writing-detail-view.tsx:235`'s topic tags are a genuinely distinct third family (square corners, wider tracking) and should stay separate regardless of what you decide here.

**This is the one call I'm not making unilaterally** — it's exactly the kind of "extract because it was on the list" temptation you told me to resist. My read: it clears the bar loosely (4 sites, one coherent visual intent) but not strictly (no exact className match at 3+). Options:
- **(A) Build it** — `<Tag size="sm"|"md" font="geist"|"mono">`, low effort since the component is trivial (a styled `<span>`).
- **(B) Skip it** — defer to Sprint 2, revisit if more tag sites appear.

---

## Summary

| Primitive | Verdict | Duplicate sites | Migration risk |
|---|---|---|---|
| Button | **Build** | 13 | Low-medium |
| Card | **Build** (3 variants) | 20 | Medium (Panel variant hardest) |
| Heading | **Build** | 15 | Low |
| Section | Skip — no evidence | 0 | — |
| Container | Skip — utilities already solve it | 0 | — |
| Badge | Skip — no 3+ family | 2 (fix directly, no primitive) | — |
| Tag | **Your call** — borderline (4, loose match) | 4 | Low if built |

**Net effect:** the design-system surface gets *smaller* — 3 new primitives replace 48 duplicate-pattern render sites, and 3 CSS class-pairs (~85 lines) become deletable, versus 2 requested primitives (Section, Container) rejected outright because they'd add abstraction without removing duplication.

**Recommended implementation order (if approved):**
1. **Heading** — lowest risk, cleanest evidence (15 near-identical sites), fastest win to validate the cva+cn pattern before touching riskier surfaces.
2. **Button** — medium risk but high duplicate count (13) and a clear existing reference point (`CtaBand`) to extend rather than invent from scratch.
3. **Card — Outlined and Media variants** — byte-identical sites, low risk.
4. **Card — Panel variant** — done last, needs per-site verification given the widest style spread (padding scale + hover + featured state).

Not proceeding to Phase 2 until you confirm this plan and the Tag call.
