# Mustafa Aboalazm OS — Architecture

> **Positioning:** Systemic Identity Architect
> **DNA:** 40% Quiet Luxury · 25% Strategic Expert · 20% Design Engineer · 10% Creative Authority · 5% Technical Wizard
> **Stack:** Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · shadcn/ui · Framer Motion · GSAP · Lenis · MDX · Sanity

---

## 1. Folder Structure

```
aboalazm-os/
│
├── app/                                  # Next.js 15 App Router
│   ├── layout.tsx                        # Root: fonts, providers, ambient canvas
│   ├── page.tsx                          # Home — the OS boot screen
│   ├── globals.css                       # ★ Design Token Layer (Tailwind v4 @theme)
│   │
│   ├── work/
│   │   ├── page.tsx                      # Work index (bento grid, filterable)
│   │   └── [slug]/
│   │       └── page.tsx                  # Project detail (sets ambient glow)
│   │
│   ├── case-studies/
│   │   ├── page.tsx                      # Case study index
│   │   └── [slug]/
│   │       └── page.tsx                  # MDX-rendered: Problem→Research→Strategy→System→Execution→Impact
│   │
│   ├── services/page.tsx                 # 5 core services
│   ├── process/page.tsx                  # The 38-day playbook, visualized
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   │
│   ├── api/
│   │   └── revalidate/route.ts           # Sanity webhook → ISR revalidation
│   │
│   ├── sitemap.ts                        # Generated sitemap
│   ├── robots.ts
│   └── opengraph-image.tsx               # Dynamic OG images
│
├── components/
│   ├── ui/                               # shadcn/ui primitives (Radix), token-themed
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── separator.tsx
│   │   └── tooltip.tsx
│   │
│   ├── layout/
│   │   ├── nav.tsx                       # Floating pill nav (glass, magnetic items)
│   │   ├── footer.tsx
│   │   └── ambient-canvas.tsx            # Atmospheric glow layer (reads CSS tokens)
│   │
│   ├── providers/
│   │   ├── smooth-scroll.tsx             # Lenis provider + GSAP ScrollTrigger sync
│   │   └── theme-provider.tsx            # Obsidian / Alabaster mode
│   │
│   └── shared/
│       ├── magnetic.tsx                  # Physics-based magnetic wrapper
│       ├── reveal.tsx                    # Staggered entrance (ease-physics)
│       ├── section.tsx                   # Spacing-token-enforced section shell
│       └── bilingual-text.tsx            # AR/EN lockup (IBM Plex Sans Arabic)
│
├── features/                             # Domain-driven feature modules
│   ├── work/
│   │   ├── work-grid.tsx                 # Bento system layout
│   │   ├── work-card.tsx                 # Hover → emits project accent to glow
│   │   ├── work-filter.tsx
│   │   └── types.ts
│   │
│   └── case-studies/
│       ├── case-study-hero.tsx
│       ├── case-study-metrics.tsx        # Impact numbers (counts up on scroll)
│       ├── case-study-toc.tsx            # Sticky table of contents
│       ├── mdx-components.tsx            # MDX → custom typographic components
│       └── types.ts
│
├── lib/
│   ├── tokens.ts                         # ★ Typed mirror of the CSS token layer
│   ├── motion.ts                         # ★ Framer/GSAP physics presets
│   ├── fonts.ts                          # next/font setup (4 families)
│   ├── sanity.ts                         # Sanity client + GROQ queries
│   ├── mdx.ts                            # MDX compile pipeline
│   └── utils.ts                          # cn() + helpers
│
├── hooks/
│   ├── use-ambient-glow.ts               # ★ Dynamic project-color atmosphere
│   ├── use-magnetic.ts                   # Pointer-physics for magnetic elements
│   ├── use-reduced-motion.ts             # Accessibility gate for all motion
│   └── use-scroll-progress.ts
│
├── content/
│   └── work/                             # Local MDX case studies (Sanity optional)
│       └── *.mdx
│
├── sanity/
│   ├── sanity.config.ts
│   └── schemas/
│       ├── project.ts                    # includes accentColor field → drives glow
│       ├── caseStudy.ts
│       └── testimonial.ts
│
├── public/
│   ├── fonts/                            # Self-hosted woff2 (zero layout shift)
│   ├── images/
│   └── og/
│
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── components.json                       # shadcn/ui config
└── package.json
```

### Architectural rules

1. **`components/` is generic, `features/` is domain.** A `work-card` knows what a project is; a `button` does not. Never import from `features/` into `components/`.
2. **Tokens flow one way:** `globals.css` (@theme) → `lib/tokens.ts` (typed mirror) → components. No magic numbers anywhere in JSX.
3. **All motion passes through `lib/motion.ts`** — one easing language across Framer, GSAP, and CSS.
4. **The ambient glow is a contract:** any route or hover can write `--glow-1` / `--glow-2`; only `ambient-canvas.tsx` reads them.
5. **Server Components by default.** `"use client"` only on leaves that need pointer/scroll physics.

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
