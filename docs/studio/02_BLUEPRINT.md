# Studio console — technical blueprint (P0 + P1)

**Status:** P1 shipped on `arena/afc7d79f-aboalazm-os` · P0 findings are in
`03_SCHEMA_FINDINGS.md`
**Scope:** turn `/admin` from a CMS into an operations surface — without a
second backend.

---

## 0 · The one-paragraph version

The console is a **read-mostly operations layer inside the existing Next
app**. It authenticates with the Payload session, queries through Payload's
Local API with `overrideAccess: false`, renders in its own document
(`app/studio/layout.tsx`) so the marketing CSS can't touch it, and links out to
the real editors for every write. No new database tables, no second user
store, no duplicated Payload collections, no mock data. Every figure on screen
declares what it counts and when it was read.

---

## 1 · Why not rebuild the CMS

The brief was explicit: keep Payload, build on the link that already exists.
That link is good. `lib/revalidate.ts` runs `revalidatePath` from collection
hooks, `lib/payload.ts` gives every server component an in-process Local API,
and all nine collections plus two globals are already wired to real pages.

What was missing was not *editing* — it was **knowing**. So the console adds
exactly one thing: a surface that answers

1. **What is happening?**
2. **What is performing?**
3. **What needs attention?**

…and nothing else. Any screen that does not answer one of those three was cut.

---

## 2 · Decisions, and what they rule out

| Decision | Rationale | Rules out |
| --- | --- | --- |
| **Payload session only** (`lib/studio/auth.ts`) | One user table, one revocation path. `payload.auth({headers})` reads the same `payload-token` the admin panel uses. | A console password, a second login endpoint, a role table. |
| **Local API, `overrideAccess: false`** | The dashboard is a client of the access rules, never a bypass. | "Just give the dashboard an admin token" shortcuts. |
| **Own root layout** (`app/studio/layout.tsx`) | The site's CSS/JS (Lenis, terminal overlay, persona provider, analytics) is wrong for a table. Isolation is at the document level, inside one deploy. | A separate app, subdomain, or second Vercel project. |
| **Every tile states its provenance** | The brief's non-negotiable. Encoded as a required `<Provenance>` and a test that fails if a tile omits it. | Metrics whose definition lives only in someone's head. |
| **Writes go to Payload** | `leadStage`, `proposalValue`, `wonValue` already have an editor with history, validation and revalidation hooks. Rebuilding that for one field is how dashboards start drifting from their source. | An inline CRM that saves its own copy of a lead. |
| **No traffic panel at all** | Analytics aggregation returns HTTP 402 on this plan. | A zeroed or "coming soon" traffic tile — both read as data. |

---

## 3 · Information architecture

Seven sections were proposed. Five exist; two were rejected for P1 with
reasons, because a nav item that leads to nothing is worse than no nav item.
The sixth screen, `Sessions`, was not in the original seven: it exists because a
cohort form needs a board before the room fills up.

```
Overview          /studio           9 bento tiles, the three questions
Leads & pipeline  /studio/leads     4 KPIs · 4-column board · all-enquiries table
Sessions          /studio/sessions  cohort board · distributions · open answers
Content           /studio/content   live/draft counts · editorial health · recent edits
System            /studio/system    live probes · what is *not* verified
Manage (leaves the console → /admin/*)   projects · case studies · writing ·
                                          media · messages · offers · settings · users
```

| Proposed | Status | Why |
| --- | --- | --- |
| 01 Overview | **shipped** | — |
| 02 Growth & Analytics | **not built** | No readable event source (402). The funnel it would have led is rendered from the *lead* table instead, starting at "saved enquiry". |
| 03 Leads & CRM | **shipped** (read + route to editor) | The data already existed in `messages`; this is the highest-value screen in the whole plan. |
| 04 Content Performance | **partially shipped** | State and gaps ship (live/draft/missing thumbnail). *Ranking* needs pageviews — can't be done honestly. |
| 05 SEO & Site Health | **deferred to P4** | Needs Search Console + PageSpeed credentials. The System screen states this instead of showing an empty chart. |
| 06 Site Management | **delegated to Payload** | Projects/Writing/Media/Offers already have good editors. The console links to them. |
| 07 System & Integrations | **shipped** | Real probes, plus an explicit "not verified from here" list. |

---

## 4 · Tile → data source map

Every tile, the exact query behind it, and what it deliberately does not claim.

### Overview (`app/studio/page.tsx` → `loadOverview`)

| Tile | Definition | Source |
| --- | --- | --- |
| Waiting on you | Enquiries nobody opened | `messages` sorted `-createdAt`, `isRead === false` |
| Pipeline | `sum(proposalValue)` on open stages; `sum(wonValue)` on Won | `messages` grouped by `leadStage` |
| Enquiry funnel | Captured → qualified → proposal → won | `messages.leadStage` counts (stages set by hand) |
| This window | New leads in range, vs the previous range | `messages.createdAt between` |
| Where enquiries came from | `sourcePage` + `utmSource` per saved lead | `messages` — **not** clicks |
| Resource gate | Emails captured at /resources | `resource-leads`, all-time + window + per resource |
| Content | live/draft per collection, missing thumbnails | `_status`, `thumbnail` on published rows |
| Recently changed | Newest `updatedAt` | projects / posts / case-studies |
| System | 5 probes, ok/warn/fail | DB round-trip, blob token, SMTP config, analytics plan, revalidation context |

### Leads (`/studio/leads`)

| Tile | Definition | Source |
| --- | --- | --- |
| Open enquiries | New + Qualified + Proposal | `messages.leadStage` |
| Quoted & open | `sum(proposalValue)` where stage is open | `messages` |
| Contracted | `sum(wonValue)` where Won — **not** revenue | `messages` |
| Enquiry → won | Won ÷ all saved enquiries | derived |
| Board | 4 columns by commitment | `leadStage` |
| Untouched 3+ days | stage `new` and `createdAt` older than 3 days | derived |
| Closed without work | Lost + Not-a-fit, grouped by `closedReason` | `messages` |

### Sessions (`/studio/sessions`)

The pre-session board for `session-registrations` — the rows the LinkedIn
assessment form writes. It is a *preparation* screen, so the order on the page
is the order of the decision: four counts, then who is in the room
(distributions), then what they wrote (open answers), then the list.

| Tile | Definition | Source |
| --- | --- | --- |
| Registered | rows in the cohort | `session-registrations`, `sessionKey` filter |
| Need an account | `linkedinStatus` is `none` or `incomplete` | `buildSessionReport` over the same rows |
| CVs | uploads that actually arrived, plus what people said about theirs | `cvFile` (relationship) vs `cvStatus` |
| Open answers | rows with at least one free-text answer | `biggestChallenge` / `questionForSession` |
| What to cover | open answers grouped by typed text, with names | `answerLines()` — **not** a sentiment model |
| Distributions | one bar per option of a coded field, blanks under «لم يُجب» | `distribution()` over `GROUPED_SELECTS` |
| Faculties / interests | free text, top 8 plus a folded remainder | `GROUPED_TEXTS`, `limit = 8` |
| The list | every row, newest first, searchable | `session-registrations` |

What it does not claim: it never scores a person, never infers a level from
prose, and never counts an answer that was not given — a blank is drawn as
"unanswered" so every chart adds up to the cohort. Attendance and follow-up
stage are the operator's words, written back through
`app/studio/sessions/actions.ts` with `overrideAccess: false`; the values come
from the same option lists `features/linkedin-session/assessment.ts` uses to
build the Postgres enums, so a stage the form does not know cannot be typed in.

The CSV export (`/studio/sessions/export`) is the same rows, formula-guarded,
with a BOM for Excel. It is `private, no-store`: it carries names, emails and
résumé answers.

### System (`/studio/system`)

| Probe | What it actually does | On failure |
| --- | --- | --- |
| Database | `select 1` round-trip, timed | Names the env var to check |
| Media storage | Reads the same token the upload path reads | Links RUN_LOCALLY.md |
| Email | `SMTP_HOST` / `CONTACT_NOTIFY_TO` presence | Says enquiries still save |
| Analytics reporting | States the 402 limitation | No traffic figure anywhere |
| Revalidation | Runs only inside a request — reported honestly | — |

---

## 5 · The analytics problem, resolved without lying

Three options were considered for the missing traffic data:

1. **Scrape Vercel's dashboard.** Fragile, unauthorised, and the numbers would
   be unattributable. Rejected.
2. **Show a zeros tile.** Reads as "no visitors", which is false. Rejected.
3. **Start the funnel where a database row exists.** Shipped.

The intended long-term fix is a first-party collector (P2): the event
taxonomy in `lib/analytics.ts` already covers the funnel, so a collector would
add `page_view` + `form_view`, write to an aggregate table, and the funnel
would gain a real top. That is a separate, testable piece of work — and until
it exists, the console says so on-screen in three places.

---

## 6 · Security posture

- Every `/studio` page calls `requireStudioUser()` **before** `getPayload()`;
  a test asserts the ordering so a refactor cannot open a hole.
- Every query passes `overrideAccess: false` with the session user.
- Post-login redirects accept only same-origin paths that start with
  `/studio` — an open redirect on a login screen is a phishing primitive.
- `noindex, nofollow` on every console route; nothing links to it from the
  marketing nav.
- The console adds no new endpoint. The only network call it makes is the
  login POST to Payload's existing `/api/users/login`.

**Known limit, stated:** there is no role system. Payload's `Users` collection
is single-admin by design (`collections/Users.ts`), so "any studio user is the
owner" is accurate today. Adding `roles` is a schema change that belongs with
the P3 CRM work, not smuggled into P1.

---

## 7 · What P1 deliberately does not do

| Not done | Reason |
| --- | --- |
| Light theme | An inverted dark ramp fails contrast on glass tiles. A half-tuned light theme is worse than none; scoping it properly is its own task. |
| Drag-and-drop stages | A stage change carries a value (`proposalValue`) and a decision. A gesture that silently sets one is a bug waiting to happen. |
| Inline editing of leads | Payload's editor has validation, versioning and revalidation hooks. Duplicating it is the "duplicate backend" failure mode. |
| Search Console / PageSpeed | Needs credentials + a decision about storing them. Stated as unverified on `/studio/system`. |
| Backup/restore UI | Neon owns this. A button that claims to restore a database it does not control is a liability. |
| Scheduled reports / email digests | No cron infrastructure in this repo yet. |

---

## 8 · File map

```
app/studio/
  layout.tsx        own <html>, fonts, no site providers
  studio.css        all rules scoped under .studio (test-enforced)
  page.tsx          Overview
  leads/page.tsx    Leads & pipeline
  content/page.tsx  Content state
  system/page.tsx   Probes
  login/page.tsx    Payload-endpoint login (same cookie)

components/studio/
  shell.tsx         sidebar, groups, counts, attention card, drawer
  ui.tsx            Tile · Provenance · Chip · Delta · ProbeRow · formatting
  overview-view.tsx · leads-view.tsx · content-view.tsx · system-view.tsx
  login-form.tsx

lib/studio/
  metrics.ts        every query + the Metric contract
  auth.ts           payload.auth() wrapper + requireStudioUser()
  studio.test.ts    14 contract tests

docs/studio/
  02_BLUEPRINT.md   this file
  03_SCHEMA_FINDINGS.md   four pre-existing defects found while verifying

scripts/studio-dev-db.sh   real Postgres + migrations + seed, for verification
migrations/20261111_120000_messages_locale_ms.ts   Malay enquiries could not save
```

---

## 9 · How P1 was verified

Because this sandbox has no browser (no NSS/cairo, and no package source to
install them), verification was done the only honest way available:

1. **Real database.** A real PostgreSQL 16 was started, the repo's real
   migrations applied, and 22 projects / 26 posts / 16 leads with a full stage
   distribution / 6 resource leads were written. `scripts/studio-dev-db.sh`
   reproduces it.
2. **Real auth.** A user was created through Payload's own API, logged in with
   `POST /api/users/login`, and the returned cookie used for every request.
   Unauthenticated `/studio` → `307 → /studio/login?redirect=/studio`.
3. **Numbers cross-checked against SQL.** Every figure rendered was compared to
   a direct query: open proposals `$14,200` = `sum(proposal_value)` on open
   stages; contracted `$24,200` = `sum(won_value)` on Won; funnel `16 → 8 → 5 →
   3` = stage counts. They match exactly.
4. **Contract tests.** 14 tests in `lib/studio/studio.test.ts` pin the rules
   that would break silently: no literal metric values, provenance on every
   tile, the 402 statement present, auth ordering, no second user store,
   stylesheet isolation, locale-enum drift.
5. **What is *not* verified:** pixel layout. Stated plainly rather than
   claimed. The CSS was written against the existing token system and every
   rule is scoped, but a screenshot pass on a machine with a browser is the
   remaining step before this is called visually signed off.
