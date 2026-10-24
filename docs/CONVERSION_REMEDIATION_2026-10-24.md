# Aboalazm OS — conversion and usability remediation

Date: 24 October 2026 (Cairo). Starting source: main `1b581a55396db68ce689bffc5bcf6c1e74b1d5e3`.

This change implements the actionable code and editorial findings from the site audit. The primary visitor journey is a paid project enquiry; recruiting remains available through `/for-hiring` and the menu/footer. No business uplift, client testimonial or production delivery result is invented.

## What changed

| Audit area | Implementation |
| --- | --- |
| First impression and navigation | Project enquiry is the primary hero/header CTA. Selected work is the secondary hero action. Recruitment remains a distinct route. Small-screen CTA text is shorter. The status badge describes services rather than claiming unverified availability. |
| Homepage focus | The installation promotion no longer interrupts the route from the hero to selected work. Existing identity, motion and project imagery are retained. |
| Service positioning | Two entry paths for identity and websites/products; dedicated `/services/brand-identity` and `/services/websites` pages contain scope, actual relevant projects, handover expectations and contextual enquiries. |
| Contact | Form and direct channels first, one H1, friendly introduction, optional scoping, visible next steps. Commercial details follow in a disclosure. One response promise: two working days. WhatsApp links are named as a conversation, not a booked appointment. |
| Package and source context | Service/package selectors are visible and editable. Bounded source and first-campaign identifiers follow the enquiry into the existing message brief and notification. No new database columns are required. |
| Message reliability | Valid fast/autofilled submissions are accepted. Filled honeypots are rejected without reporting success. Save failures return an error; notification failures do not discard saved enquiries. Logs include message ID and notification state, never brief/email. SMTP timeouts are bounded. Email table text is readable on its dark background. |
| Pricing trust | Unmeasured efficiency percentages are removed from the public presentation and replaced with concrete deliverables. Recommendation labels describe a recommendation rather than purchase popularity. No quoted package prices were changed. |
| Offer consistency | Logo/identity/full-system durations are distinguished. The 38-day walkthrough is explicitly illustrative of a full system. Language scope and outside services are clarified. Ambiguous automatic portfolio/confidentiality fee language is replaced with written, project-specific agreement. |
| Case studies | A brief/role/application summary precedes the identity proof. Contextual project CTAs appear within and after cases. GAD's full guidelines are a disclosure. Its title uses the Arabic name in Arabic, the displayed dates are labelled, and the mockup carrying template text is excluded. |
| Portfolio coverage | All 22 projects have an individual destination. Five short visual overviews remain labelled as overviews and are excluded from the full case-study count. Mini Exam and Youssef Guba retain saved visuals and now link to verified Vercel production domains. Both homepages returned HTTP 200 on 24 October 2026; the Vercel project domains are verified. |
| Interface gallery | First-party screenshots replace cross-origin iframes. Details and available public previews are separate links. |
| ERP | Theme-aware surfaces/text, readable paragraphs and a clear sample-data label. The private source repository is removed as a public proof link. The standalone demonstration has return/enquiry links and a deliberate noindex policy. |
| Accessibility | Header clearance, article section names, reduced-motion case entrances, visible form labels/focus, one contact H1. Case scroll tracking handles long sections and resized disclosures without assuming short viewport intersections. Accidental numeric Tailwind leading is replaced with proportional leading in product cases. |
| Arabic and SEO | SSR locale segment with public `/ar` URLs; English addresses are preserved through middleware rewrites. Localized navigation, page metadata, canonical and hreflang. Arabic article suffix links migrate without losing content; only actual article pairs are advertised. |
| Sitemap | One built-in case registry covers the five identity cases, twelve custom product cases and five overviews. Both service pages and locale versions are included. Static dates are not fabricated. |
| Knowledge content | Post-reading enquiry CTA; Arabic shelf/resource headings fixed. Resource intent is optional, selected resource is retained, and saved leads are counted separately from unlocks/downloads. Access does not silently subscribe a reader to marketing. |
| PWA | Existing icon paths, offline document precache, independent optional asset caching and an offline fallback. A failed optional file does not discard the entire precache. |

## Routing and deployment

- Visitor routes now live under `app/(site)/[locale]/`. Payload, API, CV, static readers/showcases and the print portfolio retain their existing paths.
- `/` and English paths rewrite internally to `/en`; `/ar` is an independently rendered locale. The internal `/en/...` alias declares the original English address as canonical; it does not redirect back into the rewrite.
- Existing Arabic article URLs redirect to `/ar/writing/...-ar`. Existing aliases have Arabic equivalents.
- Locale comes from the URL, not from localStorage after hydration. Theme preference remains local.
- `SITE_URL` is the single canonical origin source. `NEXT_PUBLIC_SITE_URL` is pinned to `https://aboalazm-os.vercel.app` for Preview, Production and Development; the same value is recorded in `.env.example`.
- The contact record uses the existing `brief` varchar field. The maximum public brief remains 5,000 characters; validation reserves an additional 1,000 characters for sanitized context. The installed Postgres adapter represents textarea as an unbounded varchar, so this validation change adds no DDL requirement.
- Existing CMS-backed content remains the source where applicable. Built-in project navigation, custom case discovery and public metrics presentation apply their reviewed safeguards even with a populated CMS.

## Measurement contract

| Event | Meaning |
| --- | --- |
| `cta_start_project` | Click through to the contact route. Not a lead. |
| `contact_channel_click` | Email or WhatsApp opened. Not proof of a sent message or booked call. |
| `form_start` | First focus within the enquiry form. |
| `form_submit_attempt` | Browser-valid submission attempted. |
| `form_error` | Field validation, rate limit, storage or network/timeout failure. |
| `contact_submit` | Server confirms the enquiry was stored. Notification arrival is separate. |
| `resource_unlock` | Reader gained access to the resource library. |
| `resource_lead_saved` | Resource endpoint confirms lead storage. |
| `resource_download` | Resource download link clicked. |

Existing case/work/article/CV events remain. Event properties are service, package, source page, placement, locale and optional campaign identifiers. Personal details and free-text briefs are excluded. Campaign identifiers accept only short ASCII letters, numbers, hyphens and underscores; URLs/emails are not accepted as campaign values.

Follow up operationally with qualified-enquiry, proposal and won-project counts. Compare periods while accounting for traffic source and audience changes. Do not treat total visits or channel clicks as sales enquiries.

## Verification commands

- `npm run typecheck`
- `npm run build` (includes all required existing suites plus conversion regression checks)
- `python scripts/verify-public-site.py` (starts a local production server; read-only requests)
- `python scripts/verify-public-site.py --base https://<verified-preview-origin>`
- `npm run check:contact` (loads local/deployment environment, verifies SMTP connection/authentication, sends no mail)

The test runner uses `node --import tsx --test`, avoiding the CLI IPC socket dependency while preserving Node's real test runner.

## Remaining operational evidence

These require real data or production credentials, not invented content:

1. **Production email delivery is not yet operational; only the Gmail app password remains missing.** The Vercel project now has `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_FROM`, and `CONTACT_NOTIFY_TO` configured for Production and Preview. `SMTP_PASS` has deliberately not been fabricated or populated: a Gmail App Password must be created by the account owner and stored as a Sensitive environment variable. The code saves the Payload message before notifying and explicitly tells the visitor when the alert is not sent, with direct email/WhatsApp fallback links. Add `SMTP_PASS` in Vercel, redeploy, run `npm run check:contact` (it verifies configuration but sends no mail), then send a clearly marked test enquiry and confirm inbox arrival before treating delivery as operational. Historical runtime-log verification was unavailable because the active plan did not retain the requested 30-day log range.
2. Add permitted named client testimonials, actual usage evidence and measured outcomes as they become available.
3. **Conversion counts remain unverified.** A production Vercel Analytics snapshot for approximately 24 September–24 October returned about 190 visitors and 1,856 pageviews. Approximately 1,157–1,158 views were concentrated on 3 October with an empty referrer and unusually repeated views, so the raw pageview total is not reliable evidence of buyer intent. Per-route reach included `/contact` (17 visitors), `/services` (16), `/pricing` (14), `/work` (43), and the homepage (92); these are not a path-cohort conversion rate. The custom-event aggregate endpoint returned HTTP 402 under the current plan, so no count of successful enquiries, qualified leads, proposals or won projects is claimed. Field CWV must also be measured after release; no Lighthouse score or improvement percentage is claimed.
4. The stable canonical origin is `https://aboalazm-os.vercel.app`. No custom domain was purchased and no DNS changes were made.

A Vercel Preview build for code commit `a8979e72257d185786bea685702b8145e3f5c389` reached `READY`; the conversion regression suite passed 11/11 tests, and the Next.js production build completed type/lint checks and generated all 159 static pages. Read-only HTTP checks returned 200 for the English and Arabic homepages, contact routes, pricing, about and project overviews; the sitemap contains 120 unique URLs. The temporary `public/__audit-responsive.html` fixture was removed in commit `b95435d648c69d15ed18dacfa4f5be283b2c8a9b`. The production domains for Mini Exam and Youssef Guba were re-verified through the Vercel project inventory and each homepage returned HTTP 200; their live-preview links now have regression coverage. Pixel-level responsive screenshot review is still outstanding because the available browser process did not produce a usable capture. This is not a formal WCAG conformance certificate or a production audit of the external products.


## Follow-up alignment — 24 October 2026

- Centralized the public contact destination in `lib/contact-details.ts` and reused it in the main contact page, enquiry-form fallbacks, footer, mail notification fallback, JSON-LD Person schema, and generated slide-deck data. The standalone A4 portfolio data also uses the same email.
- Set `NEXT_PUBLIC_SITE_URL=https://aboalazm-os.vercel.app` in Vercel for Preview, Production and Development, and updated `.env.example` and origin documentation.
- Replaced the standalone portfolio's obsolete `aboalazm.com` link and removed unverified +40% visibility / +25% engagement claims in favour of documented project deliverables.
- Added the current Digital Product & Platform Lead role to the bilingual About timeline and portfolio-deck timeline.
- Added a build-gated consistency test for email links, canonical origin, portfolio website URL, current role and retired outcome metrics.
- Remaining: `SMTP_PASS` (Gmail App Password) is still missing, so a real email notification/inbox arrival is not verified. Mobile/Arabic RTL screenshot QA, real lead qualification outcomes, and defensible source material for any future outcome metrics remain outstanding.
## Follow-up: CRM attribution, profile copy and diagnostics — 24 October 2026

- `collections/Messages.ts` now models lead acquisition and sales-stage information in structured, filterable fields: service, package tier, source page, language, bounded UTM source/medium/campaign IDs, lead stage, close reason, proposal value and won value.
- `features/contact/actions.ts` saves sanitized attribution metadata on the same Messages record as the actual enquiry. The original source-page/campaign context remains in the readable brief for backwards compatibility.
- Lead stage starts at `new` and is manually maintained in Payload Admin. The path is `new → qualified → proposal-sent → won`, with `lost` and `not-a-fit` outcomes. Proposal and won amounts are manually entered USD values only when those business events actually occur.
- Historical Messages records do not receive invented attribution or stage values. Existing rows should remain unclassified unless a corresponding source or outcome can be substantiated.
- Vercel custom-event totals remain plan-blocked; the first-party Messages pipeline is a reporting fallback for submitted enquiries and real sales progress, not for pageviews, form starts or anonymous visitor journeys.
- Added `docs/PROFILE_SYNC_2026-10-24.md` with copy-ready LinkedIn/Behance text, role timeline, offer priorities and the shared contact/site details. External profiles themselves were not edited because no authenticated write integration is connected.
- Added `scripts/check-db-ssl-mode.ts` and `npm run check:db-ssl`. It reports only sanitized SSL-mode metadata from a locally available `DATABASE_URI` and never prints credentials. The current Vercel connection does not expose the Sensitive database URI, so no SSL mode was changed blindly.
- The Gmail App Password still requires the account owner. `SMTP_PASS` remains unset; real email notification delivery is unverified.
## Database migration reality check — 24 October 2026

- The read-only `payload migrate:status` step in a Vercel build reported `20260705_212937_initial: No` and `20261024_145000_lead_pipeline: No`. The `messages` and `payload_migrations` tables exist, and the existing migration ledger contains a `dev` row with batch `-1`; the new lead fields are not present in the live schema.
- This is consistent with an existing schema that was initialized via Payload/Drizzle push mode rather than recorded migration execution. Do not run `payload migrate` blindly: it may try to re-create the initial schema. A new read-only audit compares the live public tables, columns, types, and enums to the initial migration snapshot before anyone decides how to baseline history.
- Vercel exposes a single `DATABASE_URI` variable scoped to both Preview and Production in this project, so treat them as the same database. No migration command, direct SQL DDL, migration-ledger baseline or test enquiry was explicitly executed. However, early diagnostics initialized Payload before the explicit production-only push guard was added, so the logs do not establish exactly when the observed lead fields appeared; do not treat those earlier inspections as fully read-only.
- Next gate: review the output of `npm run check:db-schema`, confirm whether the initial snapshot is represented in the current schema, then choose a controlled baseline procedure and add/run the lead-pipeline migration only with explicit database-owner authorization. The PR stays Draft until this gate and the latest build pass.
## Final safety pass — production-mode schema audit and controlled baseline

- `payload.config.ts` now explicitly enables automatic Drizzle schema push only when `NODE_ENV === "development"`. Non-development builds must rely on reviewed migrations instead of config-driven schema mutation.
- The build no longer runs the Payload `migrate:status` CLI before compiling. The post-build schema diagnostic forces `NODE_ENV=production`, performs SELECT-only inspection of the public schema and migration ledger, and blocks release unless the full lead-pipeline snapshot matches exactly and both migrations are recorded without a `dev` batch `-1` marker.
- `lib/payload-schema-audit.ts` compares expected tables, columns/types, indexes, foreign keys, enum values, extra columns/tables/enums, and migration records against the initial and lead-pipeline snapshots.
- `scripts/baseline-payload-migrations.ts` is a dry-run by default. It will only offer a ledger baseline if the full live schema exactly matches `migrations/20261024_145000_lead_pipeline.json` and the ledger contains exactly one `dev` row at batch `-1`. A deliberate `APPLY_PAYLOAD_MIGRATION_BASELINE=YES_ABOALZAM_OS_2026_10_24` opt-in is required to modify the ledger; that operation deletes only the dev marker and records the initial migration as batch 1 and lead-pipeline migration as batch 2. It executes no schema DDL and touches no customer rows.
- Do not use the opt-in against the current shared Vercel database until an owner-approved backup and the full exact-snapshot preflight have been reviewed. Vercel has one sensitive `DATABASE_URI` targeting both Preview and Production, so those build environments are not isolated from the database by this variable.
- Vercel then reported the current commit's status as `build-rate-limit`; the newest source changes have not completed a Vercel build as of this report. Earlier builds passed the CRM unit tests, but that is not a substitute for the strict new schema gate or a full build of the latest commit.
- Actual Gmail delivery is still blocked on the account owner's Sensitive `SMTP_PASS`. The profile-sync document contains copy-ready LinkedIn and Behance content, but the external profiles remain unchanged.

