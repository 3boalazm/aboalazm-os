# Conversion Events — Source of Truth (M6 / S6 · 2026-10-24)

Vercel Analytics is mounted in `app/(site)/[locale]/layout.tsx`; events are sent through `trackEvent` in `lib/analytics.ts`. Keep this document and the typed `EventName` union in sync in the same commit.

## Events

| Event | Meaning | Main source | Properties |
| --- | --- | --- | --- |
| `cta_start_project` | A same-origin link into the contact route was clicked. This is intent, not a lead. | `components/seo/funnel-analytics.tsx` | `service`, `tier`, `source`, `placement`, `locale`, valid campaign IDs |
| `contact_channel_click` | Email or WhatsApp link was opened. Does not prove a message was sent or a call was booked. | `components/seo/funnel-analytics.tsx` | `channel`, `source`, `placement`, `locale`, valid campaign IDs |
| `form_start` | First focus in the enquiry form. | `features/contact/contact-form.tsx` | `service`, `tier`, `source`, `locale` |
| `form_submit_attempt` | Browser-valid form submission was attempted. | `features/contact/contact-form.tsx` | `service`, `tier`, `source`, `locale` |
| `form_error` | Field validation, rate limit, storage, network or uncertain-receipt failure. | `features/contact/contact-form.tsx` | Context above plus a non-PII `reason` |
| `contact_submit` | Server confirms the enquiry was saved in the existing message store. Notification arrival is separate. | `features/contact/contact-form.tsx` after a successful server response | `service`, `tier`, `source`, `locale` |
| `contact_notification_issue` | The enquiry was saved, but the email alert was unconfigured or failed; the visitor is shown fallback channels. | `features/contact/contact-form.tsx` | `service`, `tier`, `source`, `locale`, non-PII `notification_status` |
| `case_study_open` | A project card's media, title or primary CTA was opened. | `features/work/featured-cases.tsx` | `slug`, `surface` |
| `track_see_more` | A visitor opened the rest of the design or development track. | `features/work/featured-cases.tsx` | `track` |
| `insight_open` | A writing post was opened from a teaser. | `features/home/insights-teaser.tsx` and the writing archive | `slug`, `surface` |
| `resource_unlock` | The reader gained access to a resource. | `features/resources/resource-blocks.tsx` | `resource`, `intent`, `locale` |
| `resource_lead_saved` | The resource endpoint confirmed that its lead was saved. | `features/resources/resource-blocks.tsx` | `resource`, `intent`, `locale` |
| `resource_download` | A resource download link was clicked. | `features/resources/resource-blocks.tsx` | `resource`, `locale` |
| `cv_download` | The CV link was clicked on the hiring page. | `app/(site)/[locale]/for-hiring/for-hiring-view.tsx` | None |

## Privacy and interpretation

Event properties must stay contextual and non-identifying. Never send visitor names, email addresses, briefs, or other free-text form values. Campaign identifiers are limited to 1–80 ASCII letters, numbers, hyphens and underscores; email addresses and URLs are rejected. `source` is a bounded local path, not a full URL.

These events represent different stages: `cta_start_project` is a click, `form_start` is focus, `form_submit_attempt` is an attempt, and `contact_submit` means the database accepted the enquiry. If email is unconfigured or fails after a successful save, `contact_notification_issue` records the non-PII status and the visitor is shown email/WhatsApp fallback links. Do not use clicks or pageviews as a proxy for qualified leads, proposals, or won projects.

## Reporting limitation recorded during the 24 October 2026 audit

The connected Vercel Analytics custom-event aggregation request returned HTTP 402 with a message that custom-event reporting requires a Pro or Enterprise plan. This means event definitions are in code, but event totals and conversion sequences could not be independently queried during this audit. Resolve the plan/access requirement or configure an approved alternative before using these events for quantitative conversion claims.

Local development does not provide production counts. The try/catch around `trackEvent` ensures analytics failures never block a user action.
## First-party lead reporting fallback — 24 October 2026

Vercel still receives the browser intent events above, but the current plan cannot return event aggregates. To avoid buying a plan merely to know whether sales conversations progress, the private Payload `messages` collection is the source of truth for actual form submissions and manual sales outcomes.

- Every new saved enquiry stores structured `service`, `packageTier`, `sourcePage`, `locale`, `utmSource`, `utmMedium`, and `utmCampaign` fields. These are normalized allowlisted IDs, a same-site path, a language, and bounded campaign identifiers. They do not store the full referrer URL, email or brief as analytics properties.
- `leadStage` starts as `new` and must be manually updated after reviewing the real enquiry: `qualified`, `proposal-sent`, `won`, `lost`, or `not-a-fit`. A form submission alone is not a qualified lead.
- `proposalValue` and `wonValue` are manually entered USD amounts. Set proposal value only when a real proposal is sent and won value only when the work is contracted; do not estimate them from the form budget band.
- In Payload Admin → Inbox → Messages, use the service, source page, campaign and lead-stage columns/filters to count submissions and pipeline progress. `wonValue` is the source for contracted revenue only after the stage is actually Won.
- Records created before these fields were added will not have structured attribution/stage values. Do not infer missing historical source or outcome fields from the free-text brief; leave them unclassified unless the underlying record supports them.

This gives a reliable answer to “How many enquiries did the form actually save, which source was attached, and how many progressed to qualified/proposal/won?” It does not replace visitor-level pageview or form-start analytics. Those event totals remain unavailable under the current Vercel Analytics plan and are not claimed.
