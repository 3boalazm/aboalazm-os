# UX hierarchy vNext — 17 Sep 2026

Implements the experience audit (`Promise → Proof → Method → Offer → Action`) and Phase A/B of the additive design system, without a visual reset.

## Design system (Phase A)

- `components/ui/Badge.tsx` — metadata/status primitive.
- `components/ui/Section.tsx` + `SectionLabel` — vertical rhythm only.
- Named accent alpha steps: `--color-accent-08/14/24/40` (mirrored in `lib/tokens.ts`).
- Control heights `--size-control-sm/md` for dense UI, not page layout.

## P0 experience

- Homepage order is now Hero → Featured work → Process teaser → About → Stats → GitHub → CTA.
- Hero lead is practical; primary CTA is `See selected work`; secondary is `Start a project`.
- Persona is optional copy in the hero (`What are you here to solve?`), not a header control. Abbreviations `FND`/`TECH` are gone from first-run UI.
- Header no longer shows the persona toggle, the `$199` annotation, or a competing Start Here pill.
- `/work` floating preview uses a stable key so row-to-row hover cannot leave a stale card (P0-3).

## P1 surfaces

- `/work`: 2–3 featured cases (image, challenge, outcome, CTA) + compact ledger. Filters: All / Identity / Digital Products.
- `/contact`: name + email + what you're building first; company/budget/timeline optional; “still figuring out the scope” is a valid start.
- `/pricing`: comparison table before tier cards; contextual `Discuss {tier}` CTAs; à la carte collapsed as a production menu.
- `/process`: Discover → Strategize → Design → Deliver timeline in the first viewport.
- `/start`: Fit → What happens → Cost → Book. Explore is a link row, not a sitemap of cards.
- Footer splits Engage vs Studio so secondary knowledge pages are not on the purchase path.

## Naming

Primary conversion CTA is `Start a project`. WhatsApp discovery remains `Book a discovery call` because it is a different action.
