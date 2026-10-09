# Site inventory - Phase 00.1

Repo `/home/user/aboalazm-os`, commit `cfaeb07` (= origin/main). Production build served at `http://localhost:3120`. Date 2026-10-09.
Read-only. Nothing in the repo was changed, no form was submitted, `/admin` was not logged into.

Scratch evidence (all under `.../scratchpad/p0/`): `routes.txt`, `http-status.tsv`, `meta.jsonl`, `harvest.json` (rendered anchors, 24 pages x desktop 1440 + mobile 390), `internal-status.tsv`, `external-hrefs.txt`.

## 0. Limits of this inventory (what is NOT checkable here)

- The live deployment (`*.vercel.app`) and Neon Postgres are unreachable from this sandbox. All DB-driven content (`/writing` posts, DB case-study rows, DB project rows, DB offers, Settings `cvUrl`) fell back to static data or is empty. Production may have more or different slugs than listed below.
- A server start log in the scratchpad (`start3.log`) shows `Invalid token format for Vercel Blob adapter` / `payloadInitError`, which matches the 500s, so Payload cannot initialise here. That is why `/admin` returns 500 and `/api/media` returns 500 locally. This is an environment limit, not evidence of a production defect.
- `sitemap.xml` locally contains no case-study and no post URLs for the same reason (see section 7, finding S1). Production output is not checkable.
- External hosts are blocked by the sandbox proxy. Every external link is "unverifiable from sandbox" (section 4).
- Visual quality, copy quality and positioning were not judged. Content/positioning calls are flagged for the user, not decided.

---

## 1. Route inventory

Legend. Primary nav = `LINKS` in `components/layout/nav.tsx:23-29` (the only items in the desktop header >= 1024px). MORE = `nav.tsx:34-47` (rendered only in the mobile panel `lg:hidden`, `nav.tsx:206-267`, and not in the desktop header). Footer = `components/layout/footer.tsx:12-58`. Sitemap = `app/sitemap.ts` -> `lib/sitemap.ts:13-33` (+ books, + DB case studies/posts). "Indexable" is from rendered `<meta name="robots">` (`meta.jsonl`) and `app/robots.ts:8`. No page emits a `rel=canonical` (0 matches on `/about`, `/`; see S5).

### 1.1 Site pages (`app/(site)`) and the print deck

| Route | Purpose (one line) | Primary nav | MORE (mobile) | Footer | Sitemap | Indexable | Local HTTP |
|---|---|---|---|---|---|---|---|
| `/` | Home: hero, 3 featured cases, why/value, process, about teaser, FAQ, "Start a Project" CTA (`app/(site)/page.tsx`) | logo link only (`nav.tsx:83`) | - | - (footer brand block is not a link) | yes (1.0) | yes | 200 |
| `/about` | Bio, timeline, CV download | yes | - | STUDIO | yes | yes | 200 |
| `/work` | 3 featured cards + 10-row project ledger = 13 projects, 5 with case studies (`features/work/projects.data.ts`) | yes | - | ENGAGE | yes | yes | 200 |
| `/for-hiring` | Candidate dossier for hiring teams: CV, deck, 4 case briefs with role breakdown, competencies, timeline, mailto | yes | - | ENGAGE | yes | yes | 200 |
| `/services` | Studio services, 3 tiers, FAQ, CTAs to `/contact` | yes | - | ENGAGE | yes | yes | 200 |
| `/pricing` | Tier compare, à la carte tables, payment, FAQ | yes | - | ENGAGE | yes | yes | 200 |
| `/contact` | Brief form (server action `features/contact/actions.ts`, NOT submitted) + email/WhatsApp/LinkedIn/Behance | CTA pill `nav.tsx:177-191` (not in LINKS) | - | ENGAGE | yes | yes | 200 |
| `/start` | Client journey: who it fits, condensed tiers, 4-phase timeline, mini site map, WhatsApp call | - | yes | ENGAGE | yes (0.9) | yes | 200 |
| `/why` | The case for systemic identity (stats, argument) | - | yes | STUDIO | yes | yes | 200 |
| `/process` | "38-day method", four gates | - | yes | **not in footer** | yes | yes | 200 |
| `/agreement` | Work-flow agreement, 8 phases, terms, tiers again | - | yes | STUDIO | yes | yes | 200 |
| `/capabilities` | "Live Token Playground" - drag design tokens, watch a layout recalculate (`capabilities/page.tsx:6`) | - | yes | STUDIO | yes | yes | 200 |
| `/resources` | 8 framework PDFs behind a client-side email gate (`POST /api/resources`) | - | yes | STUDIO | yes | yes | 200 |
| `/labs` | R&D page: research areas, 3 small tools, notes | - | yes | STUDIO | yes | yes | 200 |
| `/writing` | Article index (DB only, no static fallback) | - | yes | STUDIO | yes | yes | 200 (list empty locally) |
| `/writing/[slug]` | Article; `-ar` suffix = Arabic twin | - | - | - | yes, DB only | yes | not checkable |
| `/books` | "Library": 3 interactive books | - | yes | STUDIO | yes | yes | 200 |
| `/books/[slug]` (3) | Reader shell that iframes `/books/<slug>/index.html` | - | - | - | yes | yes | 200 x3 |
| `/gallery` | Cross-project image wall, filter by client | - | yes | STUDIO | yes | yes | 200 |
| `/work-ui` | "UI/UX Showcase - live previews" (3 iframes: 2 local demos, 1 external) | - | yes | STUDIO | yes | yes | 200 |
| `/portfolio` | 16:9 slide deck, web view with PRINT and "PDF download" buttons; separate `(print)` root layout without nav/footer | - | yes (last, "PORTFOLIO PDF ↓") | STUDIO + PORTFOLIO ("Slide Deck") | yes (0.85) | yes (explicit `index, follow`, `app/(print)/layout.tsx:16`) | 200 |
| `/case-studies/[slug]` (5 static) | Scrolly case file: context, research, execution, performance | - | - | - | **DB only** (see S1) | yes | 200 x5 |
| `/gallery-test` | "TEMPORARY PREVIEW - LAYOUT TEST" of the gallery data | - | - | - | no | **noindex,nofollow** (`gallery-test/page.tsx:9`) | 200 |
| `/type` | "INTERNAL - TYPE SYSTEM" font specimen | - | - | - | no | **noindex,follow** (`type/page.tsx:7`) | 200 |

### 1.2 Route handlers, metadata routes, system routes

| Route | Purpose | Footer | Sitemap | Indexable | Local HTTP |
|---|---|---|---|---|---|
| `/cv` (`app/cv/route.ts`) | 307 redirect to `/Mustafa_Taha_Brand_Identity_CV.docx` (a Word file, not PDF) | PORTFOLIO col, hero, `/for-hiring`, `/about` | no | n/a (redirect) | 307 -> docx 200 |
| `/sitemap.xml`, `/robots.txt` | Metadata routes (`revalidate=3600`) | - | - | - | 200 |
| `/opengraph-image-12o0cb` | Site default OG card | - | - | - | 200 png |
| `/case-studies/[slug]/opengraph-image-1ieeiq` | Per-case OG card | - | - | - | 200 png (also 200 for a non-existent slug, S6) |
| `/books/[slug]/opengraph-image-6941mx` | Per-book OG card | - | - | - | 200 png |
| `/writing/[slug]/opengraph-image-cvh5yn` | Per-post OG card | - | - | - | not checkable (needs DB posts) |
| `/api/resources` (`app/api/resources/route.ts`) | POST lead capture for resource unlock; rate-limited 5/10 min/IP | - | no | not blocked by robots | GET 405 (correct, POST only; not called) |
| `/api/[...slug]`, `/api/graphql` (Payload) | CMS REST/GraphQL | - | no | `/api` deliberately crawlable (`robots.ts:6-7`) | graphql GET 405; `/api/media` 500 (sandbox blob token) |
| `/admin/[[...segments]]` (Payload) | CMS admin | - | no | `Disallow: /admin` + page meta `noindex` | 500 here (sandbox), not logged into |
| 404 | `app/global-not-found.tsx` + `app/(site)/not-found.tsx` | - | - | noindex | 404 verified on `/nope`, `/wp-admin`, `/case-studies/does-not-exist` |

### 1.3 Public static files that are effectively pages

| Path | What it is | Notes |
|---|---|---|
| `/Mustafa_Taha_Brand_Identity_CV.docx` | the CV (Word) | 200, correct content-type. File name says "Taha", site brand says "Aboalazm" (naming call is the user's) |
| `/resources/01..08-*.pdf` | the 8 "gated" framework PDFs | **All 8 return 200 without any unlock** (S3) |
| `/books/{basics-of-design,visual-identity,marketing-fundamentals}/index.html` | stand-alone reader bundles, no `noindex` | 200; `visual-identity` bundle `<title>` is "أساسيات التصميم الجرافيكي", identical to `basics-of-design` bundle title |
| `/showcase/nile-erp/index.html`, `/showcase/farm/index.html` | static demo UIs (React from unpkg) | 200; self-described DEMO data (S4) |

---

## 2. Slugs

**Case studies, static (`lib/content.ts:23-29`)**: `gad-institute`, `nile-pharma`, `reflection`, `ahmed-bedeer`, `code-canvas`. All 5 return 200 locally. In production the list comes from the Payload `case-studies` collection (`getAllCaseStudySlugs`, `lib/content.ts:290-307`); the static five are only the fallback. Production slug set: not checkable.

**Project ledger slugs without a case file (return 404 if typed)**: `code-canvas-dev`, `esfc`, `learn-in-arabic`, `youth-scope` (all 404 locally, correct, nothing links to them). Ledger rows that point outward instead: `nile-pharma-erp` and `farm-console` -> local `/showcase/*`, `momo-collective` -> `momo-collective3.vercel.app`, `code-canvas-dev` -> `codeandcanvas.net`, and **4 rows (`esfc`, `learn-in-arabic`, `youth-scope`, `zad`) all point to the same Behance profile root** `https://www.behance.net/aboalazm` (`projects.data.ts:8,217`; confirmed in DOM of `/work`). Project-specific Behance URLs would be user-supplied content.

**Books (`lib/books.ts:34,82,129`)**: `basics-of-design`, `visual-identity`, `marketing-fundamentals`. `dynamicParams=false`, so any other slug is a hard 404.

**Writing**: DB-driven. The seed list `scripts/writing-posts-list.ts` names 26 slugs (13 EN + Arabic `-ar` twins, e.g. `website-is-not-an-interface` / `website-is-not-an-interface-ar`). Whether they are published on production: not checkable. Locally `/writing` renders the header and filter with an empty list and no empty-state message.

---

## 3. Test / temporary / orphan pages and what they expose

| Page | State | What a visitor who finds it sees |
|---|---|---|
| `/gallery-test` | 200, `noindex,nofollow`, not in sitemap, **zero inbound links in source or DOM**. Added in commit `0c32f27` "feat: add temporary visual applications test page". | Full site chrome plus the eyebrow "TEMPORARY PREVIEW - LAYOUT TEST" and the note "Temporary test page. Imagery comes from existing project files; no fabricated 'before' images are shown." (`features/gallery/gallery-test-view.tsx:60,66`). It re-lists every `GALLERY_IMAGES` item (same data as `/gallery`) with application-type filters. No secrets; exposes only the unfinished layout and an internal-process sentence. |
| `/type` | 200, `noindex,follow`, not in sitemap, **zero inbound links**. | "INTERNAL - TYPE SYSTEM" specimen of GC EPICPRO + Montserrat, type scale. Contains the line "7+ years of building visual identity systems for 20+ clients across pharma, food, education, and government" (`type-view.tsx:113`), which disagrees with "9+ years" used on `/for-hiring` and `/about`. Not indexed but publicly readable and `follow` lets crawlers follow its links. |
| `/labs` | Indexed, in sitemap, footer, MORE; no content page links to it (only chrome). | R&D pitch ("Where systems are tested before they become frameworks"), 3 small tools, notes. Not a test page, but it is the most "internal-facing" indexed page. |
| `/work-ui` | Indexed, in sitemap, footer, MORE; only chrome links to it. | See S4: header promises "real sites, live right now" while 2 of 3 cards are local demo files. |
| `/capabilities` | Indexed, in sitemap, footer, MORE. | A token-drag playground (S2) with zero outbound links (DOM: 0 anchors in `<main>`, desktop and mobile). |

Orphan classes (from source scan of all `href` targets plus DOM harvest of 24 pages):
- True orphans (no inbound link anywhere, not even chrome): `/gallery-test`, `/type`.
- Chrome-only (reachable only via the mobile hamburger panel or the footer; no content page links to them): `/gallery`, `/work-ui`, `/labs`. `/books` and `/writing` are linked only from chrome plus their own child pages' back links (`reader-view.tsx:48`, `writing-detail-view.tsx:164`).
- On desktop (>= 1024px) the header shows only 5 links + CONTACT; the 12 MORE items are reachable only through the footer or in-page links.
- `/process` is the one MORE item missing from the footer (footer.tsx has no `/process`); on desktop it is reachable only from Home ("See the full method", `home-bands.tsx:209`) and `/services` (`services-view.tsx:97`).
- The Ctrl+` terminal overlay (`features/terminal/terminal-overlay.tsx:25-43`) can `open` 17 routes; it does not include `/for-hiring`, `/portfolio` or `/cv`.
- Dead components (defined, imported nowhere): `GithubBand` (`features/home/github-band.tsx:66`) and `StatsBand` (`features/home/home-bands.tsx:86`).

---

## 4. Overlapping, duplicate or low-value pages (flags only; every keep/merge/remove call is the user's)

1. **Pricing tiers appear on four pages**: `/services` (`services-view.tsx:105`, TierGrid), `/pricing` (`pricing-view.tsx:79-80`, TierCompare + TierGrid), `/agreement` (`agreement-view.tsx:100`, TierGrid), `/start` (condensed tiers, `start-view.tsx` s02). Each also ends in a `CtaBand`.
2. **The method/process is told on four surfaces**: Home `ClientJourneyBand` (`home-bands.tsx:139`), `/process` (605 lines), `/start` (4-phase timeline), `/services` (link to it). `/why` overlaps Home `WhyValueBand` (`home-bands.tsx:259`) and `/about`.
3. **Four "knowledge" hubs**: `/writing`, `/resources`, `/labs`, `/books`. `/labs` itself says public frameworks were "born here" and links on to `/resources` (`labs-view.tsx:257,274`) and `/capabilities` (`:144`).
4. **UI/UX appears twice**: the 4 digital products are rows in the `/work` ledger and `/work-ui` re-shows 3 of them as iframes.
5. **`/gallery` vs `/gallery-test`**: same image data, second page is a layout experiment.
6. **`/portfolio` vs `/for-hiring` vs `/work`**: three "here is my work" artefacts; the deck is also linked three times in the footer/nav under two different names ("Portfolio PDF ↓", "Slide Deck - 16:9").
7. **Not on either primary path** (judgement left to the user): `/books`, `/labs`, `/resources`, `/type`, `/gallery-test`, `/work-ui`.

---

## 5. Link graph

### 5.1 Internal hrefs (30 distinct, harvested from rendered DOM of 24 pages x 2 viewports, then requested)

Requested with `curl -s -o /dev/null -w "%{http_code}"` against `localhost:3120` (full table: `internal-status.tsv`):

- 200: `/`, `/about`, `/agreement`, `/books`, `/books/basics-of-design`, `/books/marketing-fundamentals`, `/books/visual-identity`, `/capabilities`, `/case-studies/ahmed-bedeer`, `/case-studies/code-canvas`, `/case-studies/gad-institute`, `/case-studies/nile-pharma`, `/case-studies/reflection`, `/contact`, `/for-hiring`, `/gallery`, `/labs`, `/portfolio`, `/pricing`, `/process`, `/resources`, `/services`, `/showcase/farm/index.html`, `/showcase/nile-erp/index.html`, `/start`, `/why`, `/work`, `/work-ui`, `/writing`.
- 307: `/cv` -> `/Mustafa_Taha_Brand_Identity_CV.docx` (200, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`). Expected, a temporary redirect (307) to a Word file; this is not a PDF, which matters for anyone expecting a PDF CV (user call).
- No non-200 surprises among the links that nav, footer, Home and `/for-hiring` actually render. The only 404s are intentional (4 ledger slugs with no case file, unknown slugs).
- Nav, footer, Home, `/for-hiring` coverage: all 5 primary + CONTACT, all 12 MORE (mobile menu verified open at 390px), every footer link (17 page links + CV, Behance, LinkedIn, GitHub, WhatsApp, mailto, tel), Home's 12 body links, `/for-hiring`'s 9 distinct body links.

### 5.2 Link-behaviour findings

- **N1 Active-state collision**: `pathname.startsWith(link.href)` (`nav.tsx:122,218`). On `/work-ui` the DOM has `aria-current="page"` on `/work` (verified with Playwright) so WORK is highlighted on the UI/UX page; on case-study pages nothing is highlighted.
- **N2** Footer sets `target="_blank"` on `mailto:` and `tel:` links (`footer.tsx:111-113`), which can open an empty tab in some browsers.
- **N3** `CtaBand` uses plain `<a href>` (`features/offers/offer-blocks.tsx:341,345`), so those CTAs do a full page load instead of client navigation. Home's "Start a Project" is one of them.
- **N4** "Read the case study" is an internal link but carries the `arrow-up-right` icon that elsewhere marks external links (`featured-cases.tsx:242`).
- **N5** Labels vs destinations: nav/footer "PORTFOLIO PDF ↓" opens an HTML slide deck page, not a file download; the actual PDF export is a button inside that page (`portfolio-view.tsx:402`). Footer "Download CV ↓" and hero "Download CV" go to a `.docx`.

### 5.3 External links in source (`externalLinks[]`)

All HEAD attempts failed at the sandbox proxy (`CONNECT tunnel failed, response 403`), except GitHub which got a proxy-level `HTTP 403`. None of this says anything about whether the targets work. All are **unverifiable from sandbox**.

| URL | Where in source | Result |
|---|---|---|
| `https://www.behance.net/aboalazm` | `footer.tsx:52`, `contact-view.tsx:15,21`, `projects.data.ts:8` (+4 ledger rows), `lib/structured-data.ts:43` | unverifiable from sandbox |
| `https://www.linkedin.com/in/aboalazm` | `footer.tsx:53`, `for-hiring-view.tsx:564`, `contact-view.tsx:14,20`, `lib/structured-data.ts:42` | unverifiable from sandbox |
| `https://github.com/3boalazm` | `footer.tsx:54`, `features/home/github-band.tsx:15` (dead component) | unverifiable from sandbox (proxy returned 403) |
| `https://codeandcanvas.net/` | `projects.data.ts:23` (ledger row `code-canvas-dev`); also named in `features/portfolio/data.ts:61` and `code-canvas.data.ts:66` | unverifiable from sandbox |
| `https://momo-collective3.vercel.app/` | `projects.data.ts:197-198` (ledger + `/work-ui` iframe) | unverifiable from sandbox |
| `https://wa.me/201092500454` | `footer.tsx:44`, `contact-view.tsx:13,19`, `start-view.tsx:319,612`, `process-view.tsx:581` | unverifiable from sandbox |
| `mailto:m1aboalazm@gmail.com` | `footer.tsx:43`, `for-hiring-view.tsx:318,555`, `contact-view.tsx:12,18`, `lib/structured-data.ts:31` | not a web URL, not testable |
| `tel:+201092500454` | `footer.tsx:45` | not a web URL, not testable |
| `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js` | `features/writing/mermaid-diagram.tsx:21` (runtime CDN script for articles; floating major `@11`) | unverifiable from sandbox |
| `https://unpkg.com/react@18/...`, `react-dom@18/...`, `htm@3.1.1` | `public/showcase/nile-erp/index.html`, `public/showcase/farm/index.html` (floating `@18`) | unverifiable from sandbox |
| `https://aboalazm-os.vercel.app` | `lib/site.ts:13` fallback origin used for sitemap, canonical base, OG URLs, deck footer text (`features/portfolio/data.ts:60`) | unverifiable from sandbox |
| Contra | **not present anywhere in source** (grep `contra` over app, features, components, lib, collections, globals: 0 hits) | n/a. The task brief expected a Contra link; none exists. Whether to add one is the user's call. |

---

## 6. Hiring and client paths (click counts from source + DOM)

"Click" = one navigation or anchor action. Hero anchor `#selected-work` counts as a click though it does not change route.

### Path A: Home -> Selected Work -> Case Study -> CV / Contact: **reachable in 3 clicks (2 if the visitor scrolls instead of using the hero anchor)**

| Hop | Where | CTA the visitor sees | Evidence |
|---|---|---|---|
| 1 Home -> Selected Work | `/` hero | **"View Selected Work →"** (filled accent pill, primary) next to **"Download CV ↓"** (outlined, secondary). Second row of text links: "For hiring teams →", "Client services →". | `hero.tsx:136-168`, copy `lib/i18n.ts:121-122`. Anchor `#selected-work` -> `featured-cases.tsx:80`. The section sits directly below the hero. |
| 2 Selected Work -> Case Study | Home section 01: three cards (`FEATURED_SLUGS` = gad-institute, reflection, nile-pharma, `featured-cases.tsx:21`) | **"Read the case study ↗"** (ghost button, `text-tertiary`, lowest-emphasis style on the page). Also "See all work" -> `/work` (`featured-cases.tsx:109`). | DOM: 3x `/case-studies/<slug>` "Read the case study". |
| 3 Case Study -> CV / Contact | `/case-studies/<slug>` | **No in-page CTA at all.** Verified on all 5 case studies at 1440 and 390: 0 anchors inside `<main>` other than 4 section anchors (`#context`, `#research`, `#execution`, `#performance`). The page ends at the retro ledger (`panels.tsx:448-489`) with no next-case, no back-to-work, no CV, no contact. Exits exist only through global chrome: fixed nav pill **"CONTACT →"** (`nav.tsx:177-191`, visible at 390px) and footer **"Download CV ↓"** (`footer.tsx:51`, needs scrolling to the page bottom). | `ScrollyCaseStudy` (`scrolly-case-study.tsx`) imports no `Link`. |

Result: Home -> (anchor) -> case study -> CONTACT pill or footer CV = 3 clicks, so within the limit, but the third hop depends entirely on chrome, not on a CTA written for that moment. Flag for the user: a case study that ends without a next step is where a hiring manager or client has just been convinced.

Hiring-manager variant (shorter, and stronger): Home -> **"[OPEN TO BRAND IDENTITY DESIGNER ROLES - RIYADH / REMOTE - 2026]"** status pill (`status-node.tsx:23-24`) or "For hiring teams →" (`hero.tsx:161`) or header "FOR HIRING" -> `/for-hiring` with primary **"Download Updated CV"** (`for-hiring-view.tsx:303`), **"View Portfolio Deck (16:9)"**, **"Email Directly"** (mailto) and per-project **"Read Full Case Study"**. That is 2 clicks to the CV. Note `/for-hiring` has no link to the `/contact` form (its "Contact Mustafa" is a `mailto:`, lines 318, 555), and it has no link back to `/work`.

### Path B: Home -> Relevant Work -> Capabilities -> Contact: **no such in-page path exists in source**

- **"Relevant Work" does not exist as a named step.** `grep -ri "relevant work"` over `.ts/.tsx/.md` returns 0. The closest real things are Home "SELECTED WORK" (section 01), `/work`, and `/for-hiring` "SELECTED WORK & ROLE BREAKDOWN". Treat it as unmapped; mapping it is the user's call.
- **Home does not link to `/capabilities`** (Home body links: `/for-hiring`, `/services`, `/work`, 3 case studies, `/why`, `/process`, `/about`, `/contact`). Nothing in Selected Work, any case study, `/work` or `/for-hiring` links to `/capabilities`. It is reachable from: desktop footer STUDIO column, mobile MORE list, `/start` mini-map (`start-view.tsx:686`), `/labs` ("Try the full Token Playground", `labs-view.tsx:144`).
- **`/capabilities` has no exit CTA**: 0 anchors in `<main>` on desktop and mobile. The only route onward to Contact is the global CONTACT pill.
- Reachability by chrome only: Home -> `#selected-work` (1) -> footer "Capabilities" (2) -> nav "CONTACT" (3) = 3 clicks, or Home -> footer "Capabilities" (1) -> "CONTACT" (2) = 2 clicks. Within the limit, but there is no authored sequence.
- **Label/content mismatch (S2)**: the page called "Capabilities" is a design-token drag playground (`capabilities/page.tsx:6`, `i18n.ts:65-66`: "Hold the tokens. Watch the system hold."). The `/start` mini-map describes the same link as "The full stack: software, production, languages, and industry experience." (`start-view.tsx:686`). A hiring manager or client expecting a skills/services statement lands on a demo. The skills-style content currently lives on `/for-hiring` section 04 "What I Bring to Your Design Team" and, for clients, `/services` ("Five capabilities, one studio"). Which page should carry the word "Capabilities" is a positioning decision for the user.

Strongest client path in source today: Home -> "Client services →" (`hero.tsx:165`) -> `/services` -> "Discuss ..."/"Start a Project" (`services-view.tsx:124` etc.) -> `/contact` = 3 clicks, with a written CTA at every hop. Or Home -> final "Start a Project" band (`home-bands.tsx:355-367`) = 1 scroll + 1 click.

---

## 7. Other findings recorded during the inventory (each with evidence; none fixed)

- **S1 Sitemap depends entirely on the DB for case studies and posts.** `getSitemapSources` returns empty arrays when the DB is down (`lib/content.ts:264,286`) and the sitemap does not fall back to the 5 static case slugs, unlike every page loader. With `revalidate = 3600` (`app/sitemap.ts:5`) one failed regeneration can publish a sitemap without any case study. Locally: sitemap has 22 URLs, 0 case studies, 0 posts. Production: not checkable. Related: `getPosts`/`getAllPostSlugs` also return `[]` on error with no static fallback, so `/writing` can render empty.
- **S2** See path B (Capabilities label vs content).
- **S3 "Gated" resources are not gated at the file level.** The email gate is client-side state in `localStorage` (`resource-blocks.tsx:19-34,197-200`); `lib/resources.ts:17` says "gated download - lives in /public/resources". All 8 PDFs return 200 at `/resources/0N-*.pdf` with no unlock, and the paths are in the shipped JS. Whether the gate is meant to be real is the user's call.
- **S4 `/work-ui` promise vs reality.** Header: "Not screenshots - these are the real sites, live right now" (`work-ui-header.tsx:17`). Two of the three cards load local files `public/showcase/nile-erp/index.html` and `farm/index.html`, whose own source says "DEMO DATA (mirrors the real seed data)" (`nile-erp/index.html:34`), "demo actions (no real backend)" (`:234`), "DEMO DATA (matches the sanitized ...)" (`farm/index.html:30`), "same pattern as the Nile ERP mockup" (`:91`). `/work` and Home label the same entries "Live Product" / "Visit the live site" (`featured-cases.tsx:159`, `project-ledger.tsx:175,179`). Wording decision belongs to the user.
- **S5 No canonical, no hreflang on regular pages.** `metadataBase` is set (`layout.tsx:17`) but no page sets `alternates.canonical`; hreflang exists only for paired `-ar` posts in the sitemap. The EN/AR switch is a client-side toggle on one URL, with server HTML fixed to `<html lang="en" dir="ltr">` (`layout.tsx:58`). So the Arabic copy is not a separately crawlable URL. SEO/positioning decision for the user. Also `lib/site.ts:13` falls back to `aboalazm-os.vercel.app` until `NEXT_PUBLIC_SITE_URL` is set.
- **S6** The OG route returns a 200 PNG even for a non-existent slug (`/case-studies/nope/opengraph-image-1ieeiq` -> 200, 238 KB). Harmless; noted.
- **S7 Two CV sources.** `/about` links `cvUrl ?? "/cv"` where `cvUrl` comes from the Payload Settings global (`about-view.tsx:98`, `lib/content.ts:336`); hero, footer and `/for-hiring` always use `/cv` -> the static docx. If Settings has a value in production, About can serve a different file. Not checkable here.
- **S8 Reply-time claims disagree, including inside `/contact`.** `/contact` meta description: "Replies within two working days" (`contact/page.tsx:6`); the same page shows "AVG. RESPONSE: UNDER 24H" (`contact-view.tsx:62`, `i18n.ts:102`); the form note says "within two working days - usually sooner" (`i18n.ts:110`); `/for-hiring` says "Typically replies within 24 hours" (`for-hiring-view.tsx:549`). Needs one sourced answer from the user.
- **S9 "20+" appears as an unsourced number in several places**: `/start` "20+ brand identity projects" (`start-view.tsx:681`) while `/work` lists 13 projects (3 featured + 10 ledger rows; 5 have case studies), `/for-hiring` "20+ Clients" (`:354`), `/why` stats (`why-view.tsx:36`), `/about` (`about-view.tsx:30`), `/type` "7+ years ... 20+ clients" (`type-view.tsx:113`). Projects vs clients are different units; no source is cited in the repo for the count. Handled in the claims phase; flagged here because it spans routes.
- **S10 Persona picker is not the hiring/client split.** `PersonaProvider` has `founder` / `technical` and only Home and `/start` read it (`persona-provider.tsx` header comment). The hiring-vs-client split is carried only by the two text links under the hero buttons (`hero.tsx:161-167`).

---

## 8. Summary counts

- 19 indexable top-level routes + 3 book readers + 5 case studies (static) + DB posts; 2 noindex test pages (`/gallery-test`, `/type`); 1 redirect (`/cv`); 4 OG routes; 1 POST API; Payload admin/API.
- Sitemap: 19 static routes + 3 books always; case studies and posts only with DB.
- Internal link check: 30 distinct hrefs, 29 x 200, 1 x 307 (`/cv`), 0 broken.
- External: 8 distinct web URLs + mailto + tel, all unverifiable from sandbox; Contra absent from source.
- Both requested paths: A reachable in <= 3 clicks, no in-page CTA on the case-study hop; B does not exist as an authored path ("Relevant Work" unmapped, `/capabilities` is a token demo with no exits).
