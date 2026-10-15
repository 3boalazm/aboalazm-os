# Conversion Events — Source of Truth (M6 / S6 · 2026-10-14)

Vercel Analytics (`@vercel/analytics`, mounted in `app/(site)/layout.tsx`). Every event fires via `trackEvent` in `lib/analytics.ts` — the typed `EventName` union makes a name typo a compile error. **Any rename/addition: update this file and `lib/analytics.ts` in the same commit.**

Props schema: `placement` (where on the page), `surface` (which component), `slug`, `href`, `locale`.

| Event | Meaning | Fire sites (as of 2026-10-14) | Props |
|---|---|---|---|
| `cta_start_project` | A "Start a project / Book the call" primary CTA was clicked | `features/hero/hero.tsx` (hero primary), `features/offers/offer-blocks.tsx` `CtaBand` primary (home, services, pricing, agreement, labs), `contact-view.tsx` kickoff step "Book the Call" (wa.me) | `placement` = hero / cta_band / contact_steps · `href` (cta_band) |
| `case_study_open` | A click into a case-study page | `features/work/featured-cases.tsx` (internal card CTA only), `features/case-studies/next-case-link.tsx` | `slug` · `surface` = featured_card / next_case |
| `contact_submit` | Contact form reached the `sent` state (server accepted) | `features/contact/contact-form.tsx` submit success branch | `locale` = ar / en |
| `insight_open` | A writing post was opened | `features/home/insights-teaser.tsx` (home teaser), `writing/writing-view.tsx` (archive row) | `slug` · `surface` = home_teaser / archive |
| `cv_download` | The CV link on /for-hiring was clicked | `app/(site)/for-hiring/for-hiring-view.tsx` download anchor | — |

## Funnel read
`cta_start_project → contact_submit` = pipeline conversion.
`case_study_open` per-slug × surface tells which case/entry pulls weight.
`insight_open` proves the thinking→funnel hypothesis from the master plan.
`cv_download` isolates the hiring path (kept out of the studio funnel on purpose).

## Notes / dev
- Local dev won't show network calls unless Analytics debug is on (`NEXT_PUBLIC_VERCEL_ANALYTICS_DEBUG`); Vercel collects in production. The try/catch in `trackEvent` guarantees analytics never blocks a user action.
- Bot-trap submits of the contact form return `ok` to the visitor but store nothing — consider adding `contact_submit_spam` if the dashboard ever needs the noise split (deliberately not wired now: honeypot should stay invisible).
