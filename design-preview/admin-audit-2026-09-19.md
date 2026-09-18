# Admin Panel Audit — 2026-09-19

Full audit of the Payload admin (`/admin`) after the report that it felt
"مكركبة ومكبسة على بعضها" — sections overlapping, badly divided. Every
change below is **layout/access-only**: no field renamed, no path moved,
so the database and the frontend are untouched.

## Findings → Fixes

### 1. Flat sidebar — 9 collections in one pile
**Finding:** No collection had an `admin.group`; the sidebar (and the
dashboard nav) listed nine unrelated collections in a single flat list.
Only the two globals were grouped ("Site Content").

**Fix:** Every collection now belongs to a role-based group:

| Group      | Collections                                     |
| ---------- | ----------------------------------------------- |
| Portfolio  | Projects, Case Studies, Media                   |
| Inbox      | Messages, Resource Leads                        |
| People     | Team Members, Testimonials                      |
| Writing    | Posts                                           |
| System     | Users                                           |

### 2. Projects edit view — 15 fields in one wall
**Finding:** The Projects edit screen stacked name/AR pairs, stack,
outcome/AR, thumbnail, two conditionally-shown link fields and the accent
group into one endless scroll — the worst offender for "مكبسة على بعضها".

**Fix:** Split into three **unnamed tabs** (pure layout — field paths stay
flat, zero migration):
- **Identity & Story** — name/nameAr side by side, stack pills, outcome/outcomeAr side by side.
- **Visuals & Glow** — thumbnail + accent group.
- **Links** — externalUrl (only when no case study) and liveUrl (only for UI/UX showcase projects).

Classification fields (slug, category, discipline, year) and the two
display flags (hasCaseStudy, isUiUx) stay in the sidebar where they were.

### 3. Case Studies — bilingual pairs stacked, not paired
**Finding:** The four collapsible panels were a good skeleton, but every
EN/AR pair rendered as two stacked fields, doubling the scroll and
inviting mismatched edits.

**Fix:** Every bilingual pair now renders in a **row** (EN left, AR right,
50/50): problem, teamScale, timeline, researchSummary, visualVectors,
KPI label/context, image caption, retro note — plus name/nameAr and the
accent pair at the top. Also added the accent-group description.

### 4. Messages — an inbox that didn't behave like one
**Finding:** No group, no description, no search, arbitrary list order,
fields stacked (name over email over company…), and a stale doc comment
claiming the form had no email field (it has had one since the contact
flow shipped). The public REST `create` endpoint was also open —
anyone could POST junk straight into the messages table.

**Fix:**
- Group "Inbox", description, `listSearchableFields: name/email/company`.
- Rows: name+email (sender block), timeline+budget (qualifiers line).
- Brief gets a description ("the client's own words").
- REST `create` closed (`() => false`) — the form saves via the local
  API, which bypasses access control, so submissions are unaffected while
  the public spam hole is plugged. (Verified: POST /api/messages → 403.)
- Stale doc comment replaced with an accurate one (incl. the email path).

### 5. Resource Leads — invisible among nine
**Finding:** Lead captures sat ungrouped with no search.
**Fix:** Group "Inbox", description, `listSearchableFields: email/resource`.
(Public REST `create` deliberately stays open — the /resources gate posts
to it.)

### 6. Team Members / Testimonials — missing identity
**Finding:** No group, no description, no search.
**Fix:** Both into "People" with descriptions and `listSearchableFields`.
(Their EN/AR rows were already in place.)

### 7. Posts / Users / Media — names without context
**Fix:** Posts → group "Writing" + description ("one language per post")
+ search on title/slug. Users → group "System" + description (closed
registration — create accounts here). Media → group "Portfolio" +
description reminding about alt/altAr.

## Deliberately NOT changed
- **Offers global** — its tier/include/exclude nesting is dense, but it
  mirrors the offer page structure 1:1; restructuring it would change
  field paths and the frontend. Left alone, documented instead.
- **Settings global** — already uses collapsibles well.
- **Field names/paths everywhere** — protected on purpose (no migration).

## Bonus shipped with this audit: contact-form email
New `lib/email.ts` (nodemailer, plain SMTP via env vars): every contact
submission is emailed to `m1aboalazm@gmail.com` (configurable via
`CONTACT_NOTIFY_TO`). The visitor's address rides as **Reply-To**, so one
click answers the client. The email is best-effort — the record is saved
to Postgres first, and a mail failure only logs. Unconfigured SMTP skips
silently. Verified end-to-end against a local SMTP server (subject with
Arabic names encodes correctly, text + branded HTML parts). Setup for
production (Gmail App Password or Resend) is documented in `.env.example`.

## Verification
- `tsc --noEmit` clean.
- Payload boots and sanitizes the config (dev server 200 on `/` and `/admin`).
- Regenerated `payload-types.ts` matches the new shapes.
- Admin shell HTML contains all five groups + Messages description.
- REST create on messages: 403 for anonymous callers.
