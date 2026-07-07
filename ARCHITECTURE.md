# Mustafa Aboalazm OS — Architecture

> **Positioning:** Systemic Identity Architect
> **DNA:** 40% Quiet Luxury · 25% Strategic Expert · 20% Design Engineer · 10% Creative Authority · 5% Technical Wizard
> **Stack:** Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · Payload CMS 3 (Postgres/Neon) · Framer Motion · GSAP · Lenis · MDX

---

## 1. Folder Structure

```
aboalazm-os/
│
├── app/
│   ├── (site)/                           # The public site — its own root layout
│   │   ├── layout.tsx                    # Root: fonts, providers, ambient canvas
│   │   ├── page.tsx                      # Home — the OS boot screen
│   │   ├── globals.css                   # ★ Design Token Layer (Tailwind v4 @theme)
│   │   ├── work/page.tsx                 # Work ledger (fetches Payload `projects`)
│   │   ├── case-studies/[slug]/page.tsx  # Single dynamic route — fetches `case-studies`
│   │   ├── writing/                      # Blog — fetches Payload `posts`
│   │   ├── pricing/ · services/ · agreement/  # All fetch the `offers` global
│   │   ├── gallery/                      # Derived from case-studies image fields
│   │   ├── contact/                      # Submits to `messages` (server action)
│   │   ├── resources/                    # Lead-gated downloads → `resource-leads`
│   │   └── about/ · why/ · process/ · capabilities/ · start/ · labs/ · books/ · type/
│   │
│   ├── (payload)/                        # Admin dashboard — its own root layout
│   │   ├── layout.tsx
│   │   ├── custom.css                    # Brand theme overrides (obsidian/coral)
│   │   ├── admin/[[...segments]]/        # Payload's admin UI
│   │   └── api/[...slug]/ · api/graphql/ # Auto-generated REST + GraphQL
│   │
│   ├── api/resources/route.ts            # Public lead-capture endpoint
│   ├── sitemap.ts                        # Dynamic — reads case-study slugs from DB
│   └── robots.ts
│
├── collections/                          # Payload collection definitions
│   ├── Users.ts                          # Single-admin, no public registration
│   ├── Media.ts · Projects.ts · CaseStudies.ts
│   ├── Testimonials.ts · Posts.ts · TeamMembers.ts
│   ├── ResourceLeads.ts · Messages.ts
│
├── globals/
│   ├── Offers.ts                         # Pricing tiers, à la carte, investment metrics
│   └── Settings.ts                       # Social links, CV, default SEO
│
├── components/
│   ├── ui/ · layout/ · providers/ · shared/
│
├── features/                             # Domain-driven feature modules
│   ├── work/ · case-studies/ · gallery/ · offers/ · contact/ · persona/ · home/
│
├── lib/
│   ├── tokens.ts · motion.ts · fonts.ts · utils.ts · i18n.ts · offers.ts · gallery.ts
│   ├── payload.ts                        # Cached Payload Local API instance
│   ├── content.ts                        # Adapter: Payload docs → existing UI types
│   └── revalidate.ts                     # afterChange/afterDelete hooks → revalidatePath
│
├── scripts/
│   └── seed.ts                           # One-time migration of the old static data
│
├── migrations/                           # Payload/Postgres schema migrations
│
├── payload.config.ts                     # Postgres (Neon) adapter, Lexical editor
│
├── public/
│   ├── fonts/ · images/ · og/
│
├── next.config.ts                        # withPayload() wrapper
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

### Architectural rules

1. **`components/` is generic, `features/` is domain.** A `work-card` knows what a project is; a `button` does not. Never import from `features/` into `components/`.
2. **Tokens flow one way:** `globals.css` (@theme) → `lib/tokens.ts` (typed mirror) → components. No magic numbers anywhere in JSX.
3. **All motion passes through `lib/motion.ts`** — one easing language across Framer, GSAP, and CSS.
4. **The ambient glow is a contract:** any route or hover can write `--glow-1` / `--glow-2`; only `ambient-canvas.tsx` reads them.
5. **Server Components by default.** `"use client"` only on leaves that need pointer/scroll physics.
6. **Content flows through `lib/content.ts` only.** Pages never call Payload's Local API directly — they call the adapter, which returns the exact shapes the UI components already expect. This is the one place that would need to change if the CMS were ever swapped again.
7. **Every Collection/Global that feeds a statically-generated route needs a `revalidatePath` hook** (`lib/revalidate.ts`). Without it, dashboard edits won't appear on the live site until the next deploy.

---

## 2. Spacing Doctrine (8px Quiet-Luxury Scale)

Tailwind v4's `--spacing` base is set to **8px**, so the numeric utilities map 1:1
to the approved scale — no custom class names needed:

| Utility | Value  | Use |
|---------|--------|-----|
| `p-1`   | 8px    | Icon padding, micro gaps |
| `p-2`   | 16px   | Inline gaps, card inner rhythm |
| `p-3`   | 24px   | Card padding |
| `p-4`   | 32px   | Component separation |
| `p-8`   | 64px   | Section inner padding |
| `p-16`  | 128px  | Section-to-section breathing room |

Anything off-scale (`p-5`, `p-7`…) is treated as a lint error in review.

---

## 3. Radius & Motion Doctrine

| Token | Value | Use |
|-------|-------|-----|
| `rounded-card` | 12px | Cards, inputs, media |
| `rounded-panel` | 24px | Bento tiles, modals, large surfaces |
| `rounded-pill` | 999px | Nav, buttons, tags |

One easing curve rules everything: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-physics) —
a fast-out, long-settle curve that reads as weight and inertia, not "animation."
Durations come from the token scale only (200 / 400 / 700 / 1200ms).

---

## 4. Color Doctrine (Semantic Monochrome + Living Atmosphere)

The system is monochromatic by discipline: **Obsidian** (#080710) and **Alabaster**
(#FBF9F6) canvases, white-alpha borders, and a text hierarchy built from opacity —
never new grays. Color enters the system from exactly one place: **the work itself.**
Each project carries an accent; the `use-ambient-glow` hook writes it into
`--glow-1`/`--glow-2`, and the atmosphere of the entire page shifts to match the
project being viewed. The site has no color of its own — it borrows it from the work.
That is the Quiet Luxury move.
