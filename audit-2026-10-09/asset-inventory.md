# Asset inventory — Phase 00.2 (read-only)

- Repo: `/home/user/aboalazm-os`, commit `cfaeb07` (= origin/main). Date: 2026-10-09.
- Nothing in the repo was edited. All scratch scripts and raw data are in this folder (`p0/`): `refscan.py`, `crawl-assets.mjs`, `crawl-assets.json`, `books-requests.mjs`, `dups.json`, `woff2name.mjs`, `cv-unzip/` (the unzipped docx).
- Runtime evidence = Playwright/Chromium against the local production build `http://localhost:3120` (31 routes x desktop 1440x900 + mobile 390x844, full scroll to trigger lazy images; EN default, plus an AR-language pass for fonts). Byte values from the crawl are **decoded body sizes** (a gzip-able file such as an OTF travels smaller; images do not).
- NOT checkable from this sandbox (live `*.vercel.app` and Neon are blocked): Payload `media` rows and DB-driven case-study/post content, Vercel edge compression and cache headers, LinkedIn, Behance link validity, whether any licence was actually purchased, whether any client gave permission to show their work.

---

## 0. Top findings (ranked)

1. **Thmanyah Serif Display licence vs. how the site ships it.** All 5 weights are served as raw `.otf` files at public URLs (`/fonts/thmanyahserifdisplay-*.otf`, HTTP 200, `font/otf`) and are copied again into 3 book bundles and the archived `portfolio/`. The licence embedded in each OTF (name ID 13) lists as prohibited "make the Font Software available ... so end users ... can extract, download, access ... including through web embedding", and permits web embedding "only as part of a compiled, packaged, or obfuscated product". This is a licence question for the owner, not something I decide (section 4).
2. **99 unreferenced JPGs (6.0 MiB) in `public/books/basics-of-design/assets/` are third-party-looking material** (film posters, big-brand logos, caricature and portrait photos of real people, etc.). They are not used by the book HTML and never requested at runtime, but they are in the repo and publicly addressable by URL (section 3 and 4).
3. **Nile Pharma case study page weighs 24.5 MiB of images** (desktop and mobile identical) because `features/case-studies/panels.tsx:387,421` use raw `<img>` (no `next/image`); the 14.0 MB animated GIF alone is 13.35 MiB. `/gallery` also ships the full GIF (the optimizer returns the original for animated GIF): 14.2 MiB.
4. **Any 404 response carries `Link: </images/work/error-404.png>; rel=preload; as="image"`** (1.6 MB). Locally this fires on every page because `/_vercel/insights/script.js` 404s under `next start`; on Vercel that URL is platform-served, so the live effect is **not checkable**. It is also triggered by `/favicon.ico` (404, no file exists) on pages without an icon link, e.g. `public/showcase/*`.
5. **CV vs website**: 18 differences listed in section 5, notably: surname (Taha vs Aboalazm), three different titles inside the one docx, "Studio Lead & Visual Director - Learn in Arabic (MSP)" on the site vs "Managed the Illustrations team at MSP Tech Club" on the CV, three different GAD role titles, "+40% / +25%" still live on `/about` and in the AR deck data after the earlier removal from home/for-hiring, "7+ years" vs "9+ years", and the for-hiring heading that claims the timeline is an exact CV/LinkedIn match.
6. `media/` is 65.3 MiB tracked in git: 100% byte-identical copies of `public/images/work/*`, and 57 of its 115 files are `-1/-2` re-seed duplicates.
7. The 8 "locked" resource PDFs are plain static files: `GET /resources/01-brand-os-canvas.pdf` returns 200 without any form (verified with a GET only; no form was submitted).

---

## 1. Inventory by directory

| Directory | Files | Bytes | MiB | Formats (count / bytes) | Served to browsers? |
|---|---:|---:|---:|---|---|
| `public/` (all) | 347 | 54,116,698 | 51.6 | see below | yes, static |
| `public/` excl. `books/` | 102 | 39,422,576 | 37.6 | png 29 / 16,331,944; gif 1 / 14,001,060; jpg 33 / 5,898,786; otf 7 / 1,279,016; pdf 8 / 730,612; js 2 / 564,419; woff2 15 / 354,140; css 2 / 135,450; html 2 / 57,734; docx 1 / 40,923; woff 2 / 28,492 | yes |
| `public/books/` | 245 | 14,694,122 | 14.0 | jpg 108 / 7,025,297; otf 15 / 3,694,548; woff2 117 / 2,622,568; html 3 / 1,243,759; js 2 / 107,950 | yes (3 self-contained bundles) |
| `media/` | 115 | 68,488,003 | 65.3 | png 54 / 29,348,088; jpg 59 / 11,137,795; gif 2 / 28,002,120 | **no** (outside `public/`; Payload local-disk upload dir, `payload.config.ts` uses `vercelBlobStorage` in prod) |
| `portfolio/` | 27 | 10,360,892 | 9.9 | js 6 / 9,234,007 (`assets/img.js` alone 8,596,747); otf 3 / 741,956; woff2 14 / 343,284; css/md/mjs/html | **no** (README: "ARCHIVED ... offline archive") |
| `exports/` | 21 | 173,439 | 0.17 | md 21 (`exports/articles/*.md`) | no |
| `design-preview/` | 14 | 204,046 | 0.19 | md 13 / 187,894; html 1 / 16,152 | no |
| `scripts/` | 11 | 235,259 | 0.22 | ts 11 (largest: `writing-systems-ar.ts` 104,374; `writing-systems-en.ts` 66,007; `seed.ts` 27,531) | no |

Sub-breakdown of `public/`:

| Sub-dir | Files | Size | Notes |
|---|---:|---:|---|
| `public/images/work/` | 63 | 34.55 MiB | 33 jpg, 29 png, 1 gif. Sub-folders `gad/` 13, `nile-pharma/` 12, `reflection/` 11, `code-canvas-dev/` 1; the rest at top level |
| `public/fonts/` | 24 | 1.58 MiB | 7 otf, 15 woff2, 2 woff (families below) |
| `public/books/basics-of-design/` | 159 | 9.7 MB | 1 html + 158 assets (108 jpg, 44 woff2, 5 otf, 1 js) |
| `public/books/visual-identity/` | 57 | 2.7 MB | 1 html + 56 assets (50 woff2, 5 otf, 1 js); no images |
| `public/books/marketing-fundamentals/` | 29 | 2.3 MB | 1 html + 28 assets (23 woff2, 5 otf); no images |
| `public/resources/` | 8 | 0.70 MiB | 8 PDFs, 74,801-120,580 B each (Chromium/Skia PDFs created 2026-06-19) |
| `public/showcase/` | 4 | 0.18 MiB | `farm/` and `nile-erp/`: index.html + tailwind.css each; load React/htm from unpkg, Google Fonts, Font Awesome 6.5.1 from CDNs |
| `public/portfolio-vendor/` | 2 | 0.54 MiB | `html2canvas.min.js` 198,689; `jspdf.umd.min.js` 365,730 (byte-identical copies also in `portfolio/assets/vendor/`) |
| `public/` root | 1 | 40,923 B | `Mustafa_Taha_Brand_Identity_CV.docx` (`/cv` 307-redirects to it: `app/cv/route.ts`) |

Font families in `public/fonts/`: GC EPICPRO (otf+woff+woff2), Thmanyah Serif Display (5 x otf: Light/Regular/Medium/Bold/Black), "undefined medium" (otf+woff+woff2), Montserrat (5 woff2), IBM Plex Sans Arabic (5 woff2), JetBrains Mono (3 woff2).

Stray files at repo root (tracked in git): `er.email` (763 B, a dump of a git config: two `user.email` values and `remote.origin.url`), `npx` (0 bytes), `QA_REPORT_2026-10-04.md` (240,770 B), `.claude/launch.json`.

Outputs of `scripts/`: only `scripts/export-articles-md.ts` writes files (to `exports/articles/<slug>.md`: 10 EN + 11 AR; `the-split-brand` exists only as `-ar`, consistent with `scripts/writing-posts-list.ts:19`). The other scripts write to the database, not to disk.

---

## 2. (a) Oversized files and duplicates

### 2.1 Images over 500 KB (all in `public/images/work/`)

"Where served / measured" is from the crawl (decoded bytes; desktop and mobile identical unless noted).

| File | Bytes | Where it is actually served | Evidence |
|---|---:|---|---|
| `nile-pharma/npf-logo-motion.gif` (1400x700, 30 frames) | 14,001,060 | `/case-studies/nile-pharma` raw `<img>` (13,673 KB) and `/gallery` via `/_next/image?...w=640` which returns the **original GIF**, 13,673 KB | `features/case-studies/demo.data.ts:150`, `lib/gallery.ts:40`, `panels.tsx:421`; crawl |
| `nile-pharma/npf-ramadan.png` (1880x1576) | 5,008,906 | case study raw (4,892 KB); `/gallery` optimized to 70 KB AVIF | `demo.data.ts:144`, crawl |
| `nile-pharma/npf-img-b.png` | 1,785,994 | case study raw (1,744 KB); gallery optimized | `demo.data.ts:136,146` |
| `error-404.png` (1375x768 RGBA) | 1,613,244 | 404 page, plain `<img>` (`features/errors/not-found-content.tsx:86-90`); plus the `Link: rel=preload` header on every 404 response (see 0.4) | crawl `/nonexistent-xyz`; `curl -D - /favicon.ico` shows the header |
| `nile-pharma/npf-business-card-box.jpg` (4000x3000) | 1,594,820 | case study raw (1,557 KB) **and** `/portfolio` deck cover photo (`features/portfolio/data.ts:76,209`) | crawl |
| `nile-pharma/npf-logo-waves.png` | 849,714 | case study raw (830 KB) | crawl |
| `cc-design-samples.png` | 792,629 | `/portfolio` deck raw (774 KB) | `features/portfolio/data.ts` frames |
| `nile-pharma/npf-img-c.png` | 767,314 | case study raw (749 KB) | crawl |
| `nile-pharma/npf-ezaby-post.jpg` | 693,644 | case study raw (677 KB) | crawl |
| `public/books/basics-of-design/assets/79a68d2d....jpg` and `dae44ce8....jpg` (identical) | 569,770 each | **not served** (orphans, section 3) | not requested in book run |

Near the threshold: `gad/gad-logo-variations.png` 497,424 (raw on `/portfolio`). Not in `public/`: `portfolio/assets/img.js` 8.6 MB (archived, not served) and every large file also exists in `media/` (not served).

Measured image weight per page after full scroll, **excluding** the 1.54 MiB `error-404.png` preload artifact:

| Route | Total | Raw (unoptimized) | Via `/_next/image` |
|---|---:|---:|---:|
| `/case-studies/nile-pharma` | 24.56 MiB (mobile 24.50) | 24.48 MiB / 14 files | 0.08 MiB / 5 |
| `/gallery` | 14.20 MiB | 0.13 | 14.07 MiB / 52 (13.35 is the GIF) |
| `/portfolio` | 4.88 MiB | 4.88 MiB / 17 | 0 |
| `/case-studies/gad-institute` | 1.49 MiB | 1.28 | 0.21 |
| `/case-studies/reflection` | 0.63 MiB | 0.53 | 0.10 |
| `/for-hiring` | 0.35 MiB (mobile 0.18) | 0.13 | 0.22 |
| `/`, `/work` | 0.17 MiB | 0.13 | 0.04 |
| `/case-studies/ahmed-bedeer`, `/code-canvas` | 0.20 / 0.18 MiB | 0.13 | 0.07 / 0.06 |

Cause: case-study pages (`features/case-studies/panels.tsx:387,421`), the 404 page and the nav/footer icon use raw `<img>` (all carry `eslint-disable @next/next/no-img-element`); `/portfolio` deck frames also load originals. `icon.png` is 256x256 (44,656 B) shown at 24-32 px and fetched 3 times per page (`nav.tsx:105`, `footer.tsx:72`, preload) - small, noted only.

Headers: `next.config.ts` `headers()` adds only security headers; `/images/*` and `/fonts/*` come back from `next start` with `Cache-Control: public, max-age=0` and a weak ETag. Live behaviour on Vercel is not checkable.

### 2.2 Fonts over 100 KB

| Font | Bytes | Served? |
|---|---:|---|
| `thmanyahserifdisplay-Medium.otf` | 249,124 | **every page** (EN too: `components/layout/nav.tsx:161` uses `var(--font-thmanyah)` at weight 500) |
| `-Black.otf` | 247,992 | AR mode, all pages |
| `-Bold.otf` | 247,296 | AR on `/for-hiring` and case studies; EN `/portfolio`; OG image route (`lib/og.tsx:39`) |
| `-Regular.otf` | 246,668 | AR on `/work` only (not fetched on EN `/portfolio`) |
| `-Light.otf` | 240,436 | declared (`globals.css:448`), not observed in the crawl |
| 2 woff2 in books (`dfdc73d7...`, `e94ae965...`, Agbalumo) | 261,124 each | inside `basics-of-design` / `visual-identity` bundles (declared, not observed) |

Measured per page: EN = `Gc_Epicpro.woff2` 13 KB + Thmanyah Medium 243 KB = **256 KB of fonts on every route**; AR = Epicpro + 2-4 Thmanyah OTFs (about 0.5-1.0 MB decoded). `next start` gzips the OTF to 107,054 B when asked (curl); Chromium-side decoded size is what is listed. No woff2 build of Thmanyah exists in the repo. Converting or subsetting it is a licence question (it prohibits "Modify, edit, adapt"), so I make no recommendation.

### 2.3 Duplicated fonts and formats

- `Gc_Epicpro` exists as `.otf` 24,644 + `.woff` 15,384 + `.woff2` 12,984. `globals.css:437-439` lists all three; browsers fetched only the woff2 (observed on all pages). The `.otf` is required by `lib/og.tsx:38` and `next.config.ts:42`. The `.woff` is only a fallback.
- `undefinedmedium.otf/.woff/.woff2` (46,820 B): unused (section 3).
- Montserrat / IBM Plex Sans Arabic / JetBrains Mono woff2: 13 files in `public/fonts/` are used **only** by `/portfolio` (`features/portfolio/portfolio.css:26-37`); the main site loads Montserrat and IBM Plex Sans Arabic from the **Google Fonts CDN** (`app/(site)/globals.css:25` `@import url(https://fonts.googleapis.com/...)`). JetBrains Mono (`--font-mono`, `globals.css:175`) has no `@font-face` or CDN import on the main site and `lib/fonts.ts` is a stub, so mono falls back to `ui-monospace` there.
- The same 13 woff2 are duplicated in `portfolio/assets/fonts/` (archived); the 5 Thmanyah OTFs exist in 5 places (Regular/Bold/Black: `public/fonts`, 3 book bundles, `portfolio/assets/fonts`; Light/Medium: `public/fonts` + 3 books); IBM Plex Sans Arabic files also sit inside each book bundle.
- Whole-tree md5 scan: **123 duplicate groups, 76,510,888 redundant bytes**: media vs public 68,488,003 (includes media-internal copies); portfolio vs public 736,611; books vs public 1,468,680; books+portfolio+public 3,652,192; between books only 2,165,402 (e.g. the same two 53,975 B runtime JS files, identical woff2 subsets, 4 duplicate JPG pairs inside `basics-of-design`: 169,361 / 569,770 / 74,603 / 259,801 B).
- `media/`: 58 unique hashes (34,246,605 B unique) for 115 files; 57 files are `-1`/`-2` suffixed re-seed copies (e.g. `cc-dev-thumb.jpg`, `-1`, `-2`); every file has a byte-identical twin in `public/images/work/`. Five `public/images/work` files have no copy in `media/`: `icon.png`, `error-404.png`, `farm-thumb.jpg`, `gad/gad-signage-environmental.jpg`, `nile-pharma/npf-logo-waves.jpg`.

---

## 3. (b) Unreferenced files (true orphans) and dangling references

Method: for every file under `public/`, `media/` and the book bundles, searched `app`, `components`, `features`, `lib`, `collections`, `globals`, `scripts` (including `seed.ts`, `lib/content.ts`, `lib/gallery.ts`), `hooks`, `migrations`, `payload.config.ts`, `next.config.ts`, `public/**/*.html|css|js`, the book HTML files, plus a repo-wide grep (excluding `node_modules`, `.next`, `.git`) and runtime requests in Chromium. Dynamic references were checked: the only template-string asset paths are `/books/${book.slug}` (`books-view.tsx:53`, `lib/sitemap.ts:90`); `lib/og.tsx` builds `public/fonts/<file>` from two literal names.

### 3.1 True orphans in `public/`

| Path | Bytes | Confidence | Evidence |
|---|---:|---|---|
| `public/fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2` | 45,296 | high | 0 references in the Next app; `features/portfolio/portfolio.css:31,33` declare only the 400 and 700 Arabic files; only the archived `portfolio/css/portfolio.css` names it (its own `assets/fonts` copy); not requested in the crawl |
| `public/fonts/undefinedmedium.otf` / `.woff` / `.woff2` | 22,856 / 13,108 / 10,856 | high | no `@font-face` for family "undefined" exists; `.font-undefined*` classes (`globals.css` about L798-L900) are dead CSS (no TSX uses them); the string occurs nowhere but inside the font itself |
| `public/images/work/nile-pharma/npf-logo-waves.jpg` | 135,906 | high for the app | only reference: archived `portfolio/tools/gen-assets.mjs:49`; the app uses `npf-logo-waves.png` |
| `public/books/basics-of-design/assets/*.jpg` x **99** (all except the 9 referenced) | 6,308,772 | high | `index.html` contains 9 `assets/*.jpg` references; the other 99 UUIDs appear in no file in the repo (repo-wide grep: none) and none was requested after stepping through all slides and scrolling; none is byte-identical to a referenced one |
| `public/books/basics-of-design/assets/7c98819a....js`, `public/books/visual-identity/assets/c3506848....js` (identical) | 53,975 each | high | the book HTML has one 2.4 KB inline slide script and no `<script src>`; neither file is named anywhere nor requested |

Total: 106 files, 6,644,744 B (6.34 MiB). `marketing-fundamentals` has 0 unreferenced assets (28/28 referenced).

Referenced-but-lazy (not orphans): 4 hover thumbnails (`code-canvas-dev/cc-dev-thumb.jpg`, `farm-thumb.jpg`, `nile-erp-thumb.jpg`, `zad-thumb.jpg`) are in `features/work/projects.data.ts` and load in `floating-preview.tsx` on hover; they were not requested because the crawl did not hover. Book fonts declared with `unicode-range` (32 woff2 + 3 otf in `basics-of-design`, 37 + 4 in `visual-identity`, 16 + 4 in `marketing-fundamentals`) were not fetched in my session but are declared in each book's CSS.

### 3.2 Whole directories

| Dir | Verdict | Confidence | Evidence |
|---|---|---|---|
| `media/` | not served; no file-name references in source; their real consumers are DB rows I cannot see | medium | `payload.config.ts` plugins -> `vercelBlobStorage` (prod storage); `collections/Media.ts` has no `staticDir` (Payload default `media/`); `scripts/seed.ts:107-135` uploads from `public/` into it; `.next` nft trace lists no `media/` file |
| `portfolio/` | unused by the app, archived | high | `portfolio/README.md` says "kept only as an offline archive"; the live deck is `features/portfolio/`; only `portfolio/tools/gen-assets.mjs` reads `public/images/work/*` |
| `exports/articles/` | generated output, no runtime use | high | written by `scripts/export-articles-md.ts`; mentioned only in `HANDOFF.md:76,104` |
| `design-preview/` | internal audit notes + a standalone HTML | high | mentioned in `HANDOFF.md` and two code comments (`MediaCard.tsx:6`, `PanelCard.tsx:6`); the HTML has no external URLs |

### 3.3 The reverse: referenced but missing

| Reference | Missing file |
|---|---|
| `features/work/projects.data.ts:124` | `/images/work/esfc.jpg` |
| `projects.data.ts:141` | `/images/work/learn-in-arabic.jpg` |
| `projects.data.ts:158` | `/images/work/youth-scope.jpg` |
| `projects.data.ts:194` | `/images/work/momo-thumb.jpg` |
| `scripts/seed.ts:72` | `/images/work/gad/gad-signage-environmental.png` (real file is `.jpg`; seed logs "missing file, skipping"; already noted in `design-preview/visual-refinement-2026-09-18.md:227`) |

`floating-preview.tsx:106-113` hides the broken image and keeps the accent card, so this is invisible to users.

---

## 4. (c) Provenance and licence that the repo cannot establish

### 4.1 Fonts (read from each font's own name table)

| Font | What the file says | In repo | Status |
|---|---|---|---|
| **Thmanyah Serif Display** x5 (`public/fonts`, 3 books, archived portfolio) | name ID 13: "Thmanyah's Font License ... Copyright (c) 2026, Thmanyah Publishing and Distribution". Permitted: commercial use in logos, branding, websites, apps, print; "Embed the Font Software in websites ... **only as part of a compiled, packaged, or obfuscated product**". Prohibited: "Redistribute, share, upload, **host, or make the Font Software available for download on any website**"; "Make the Font Software available in any manner that allows end users or third parties to extract, download, access, reuse ... as font files, **including through web embedding**"; "Modify, edit, adapt ..."; "Create Derivative Works". Contact: ask@thmanyah.com | no separate licence file, no permission letter | **Flag for owner/legal.** Observed: `/fonts/thmanyahserifdisplay-Medium.otf` returns 200 to anyone. Not for me to conclude on compliance |
| **GC EPICPRO** Extra Bold (otf, woff, woff2; woff2 copy in `portfolio/`) | "Copyright (c) 2025 by Glyphonic. All rights reserved."; designer "Hanif Dwi Sulistyo Of Glyphonic"; trademark of Glyphonic; no licence text or URL embedded | none | **Undeterminable.** Web-use licence, and whether the woff/woff2 conversions were permitted, cannot be established |
| undefined medium (unused) | "Copyright (c) 2018-2019 by Andi Rueckel", SIL OFL 1.1 | none | OFL (web use allowed); licence text not shipped; file is an orphan anyway |
| Montserrat, IBM Plex Sans Arabic, JetBrains Mono (woff2) | Copyright strings + OFL URLs embedded (Montserrat Project Authors; IBM Corp 2019; JetBrains Mono Project Authors) | no OFL text in repo | OFL; low risk (OFL asks that the licence text accompany redistribution) |
| Book-bundle woff2 (57 unique) | Agbalumo, IBM Plex Mono, IBM Plex Sans Arabic, Montserrat, Reem Kufi, Space Grotesk: all OFL | no | low risk |

### 4.2 Images and files

| Asset(s) | Observation | Status |
|---|---|---|
| **99 unreferenced book JPGs** (`public/books/basics-of-design/assets/`) | Viewed on contact sheets: film posters (including a Disney title), big-brand logos (e.g. FedEx, McDonald's, Chevron, Pepsi, Apple, Google, Toyota, USA Network, National Geographic), photographs and portraits of real people, a caricature carrying JBL branding, a Venom image, a stock-looking "Kenya Reed" card and "Donne Staples" vans, font-specimen collages, game screenshots. Publicly addressable at `/books/basics-of-design/assets/<uuid>.jpg` | **Provenance unknown, third-party copyright/trademark likely.** Also orphans |
| 9 referenced book JPGs | mostly self-made diagrams (grid, WCAG chart, RGB/CMYK, hue wheel); the Arabic calligraphy poster (`682425dd....jpg`) author unknown | uncertain |
| `error-404.png` | radio-telescope photo; the image itself carries a credit line "BIG EAR RADIO TELESCOPE. OHIO STATE UNIVERSITY. PD, OHIO STATE UNIVERSITY ..." (truncated at the edge; "PD" suggests public domain) | partial, unverified |
| Nile Pharma campaign set (`npf-ezaby-post.jpg`, `npf-proxeed-post.jpg`, `npf-ramadan.png`, `npf-img-c.png`, `npf-business-card-box.jpg`) | stock-looking photography (adult with toddler, baby, nuts platter, props); third-party retail brand "El Ezaby" in the post; employer's product marks (Proxeed, Proxerex). Metadata only shows Adobe Photoshop (CS6, 24.5, 25.7, 27.0) | photo licences and employer permission: **not determinable** |
| GAD mockups (`gad-mockup-logo/card/outdoor/exhibition.jpg`), `ahmed-bedeer-mockup.jpg`, `cc-poster-mockup.jpg`, `npf-business-card-box.jpg` | scene mockups; the GAD boards carry visible captions "Logo Mouckup", "Business Card Mouckup", "Outdoor Banner mouckup", "Exhibition Stand mouckup", i.e. a mockup-pack layout | mockup/photo licence **not determinable** |
| Client brand work: GAD Heart & Lungs Institute, Nile Pharma Food (employer), Ahmed Bedeer, Reflection | the site cites a generic "Portfolio Rights" clause (`agreement-view.tsx:32`) but the repo has no per-client approval | permission **not determinable** |
| `public/resources/*.pdf` (8) | created by Chromium/Skia on 2026-06-19 from HTML; authorship = site owner by inference | likely first-party |
| `public/showcase/*` | first-party demo apps; load React 18 (`unpkg.com/react@18`, unpinned), htm 3.1.1, Font Awesome 6.5.1, Google Fonts at runtime | third-party CDN dependencies |
| `public/portfolio-vendor/` | html2canvas, jsPDF minified, no licence header checked/file shipped (both MIT upstream, from general knowledge) | licence file absent |
| CV `.docx` | python-docx file; core.xml `created/modified` = 2013-12-23 (template default); see section 5 for the leaking title/subject | first-party |

---

## 5. (d) The CV

File: `public/Mustafa_Taha_Brand_Identity_CV.docx` (40,923 B, committed `a99e836`, 2026-10-06, "Add files via upload"). `/cv` 307-redirects to it. Extracted from `word/document.xml`, `word/footer1.xml`, `word/_rels/document.xml.rels`, `docProps/core.xml` (unzipped copy in `p0/cv-unzip/`). No tracked changes, comments or hidden text.

### 5.1 What the CV says

- **Name (p01):** "MUSTAFA MUHAMMED TAHA".
- **Title line (p02, style CVTitle):** "Brand Identity Designer | Visual Identity Systems | Arabic/English (RTL/LTR)".
- **Footer:** "Mustafa Muhammed Taha | Senior Brand Identity Designer |".
- **Metadata (`core.xml`, publicly downloadable):** Title "Mustafa Muhammed Taha - Senior Graphic Designer CV (Saudi Arabia)"; Subject "Tailored ATS-friendly resume for Senior Graphic Designer role at Müllers Solutions"; Creator "Mustafa Muhammed Taha"; Description "generated by python-docx".
- **Contact (p03/p04):** "+20 109 250 0454 | m1aboalazm@gmail.com | Al Obour, Egypt | Remote / MENA | Open to relocation to Riyadh, Saudi Arabia". Links: LinkedIn `https://linkedin.com/in/aboalazm`, Behance `https://www.behance.net/aboalazm`, GitHub `https://github.com/3boalazm`, Portfolio `https://aboalazm-os.vercel.app/`.
- **Summary (p06):** "Brand identity designer with 9 years of design practice, specializing in brand identity systems since 2022 ... in-house and client work across pharma, healthcare, food, education, and public-sector projects".
- **Experience (employer / title / dates):**
  1. Nile Pharma Food & Food Supplements - "Digital Product & Platform Lead" - Sep 2026 - Present
  2. Code & Canvas - "Co-Founder & Creative Lead" - Feb 2024 - Present
  3. Self-Employed - "Independent Brand & Identity Consultant" - 2022 - Present
  4. Nile Pharma Food & Food Supplements - "Media Director & Account Manager" - Nov 2020 - Jul 2025
  5. Self-Employed - "Freelance Graphic Designer" - Jul 2017 - 2022
- **Quantified claims:** "9 years"; "20+ organizations across pharma, healthcare, food, education, and government in Egypt and the Gulf" (p22); "online visibility rose 40% after launch" (p26, tied to the responsive WordPress website); "customer engagement increased 25% within six months of rollout" (p27, tied to the brand audit and rebrand); "two seasons ... named Best Head both seasons" (p40); "named Best Leader of the Season" (p41); "paid workshops ... across six partner organizations since 2019" (p42); "signed international service agreement" (GAD, p23).
- **Selected projects (p33-38):** Code & Canvas Visual Identity; GAD Heart & Lungs Institute ("Lead Brand Consultant"); Nile Pharma Food ("Corporate identity & rebrand").
- **Education (p44-45):** "Bachelor of Agriculture - Al-Azhar University | 2017-2024"; "specialized in brand identity from 2022 and digital design from 2024". **Certification (p47):** "Photography - Abdelrahman Salah Studio". **Languages (p49):** "Arabic (Native) | English (Professional Working Proficiency)". **Military (p51):** "Egyptian Armed Forces | Jul 2025 - Sep 2026". **Tools (p12):** Illustrator, Photoshop, InDesign, Figma, After Effects, Premiere Pro.
- **Hyperlink targets in `document.xml.rels` (12):** the 6 contact/portfolio ones above, GAD case study `https://aboalazm-os.vercel.app/case-studies/gad-institute`, Behance galleries `219707183` (Code & Canvas) and `175649297` (Nile Pharma), and three that **no visible text uses**: `https://zad.codeandcanvas.net/`, `https://himssv02.vercel.app/`, `https://www.behance.net/gallery/161876545/Ummah-Academy-Brand-Identity`.

### 5.2 Where the CV and the website differ (both sources quoted)

Site sources: `A` = `app/(site)/about/about-view.tsx`, `H` = `app/(site)/for-hiring/for-hiring-view.tsx`. Rendered text on `/about` and `/for-hiring` was confirmed from the running build.

| # | Topic | CV says | Website says | Note |
|---|---|---|---|---|
| D1 | Name | "MUSTAFA MUHAMMED TAHA" (p01; file name `Mustafa_Taha_...`; `core.xml` creator) | "Mustafa Aboalazm" / "مصطفى أبوالعزم" everywhere (`lib/structured-data.ts:24-25`, `H:285`); the download attribute keeps "Mustafa_Taha" (`A:99`, `H:304`) | surname never reconciled on either side; user decision |
| D2 | Title | body: "Brand Identity Designer | Visual Identity Systems | ..." (p02); footer: "Senior Brand Identity Designer"; metadata: "Senior Graphic Designer CV (Saudi Arabia)" and "... role at Müllers Solutions" | "Senior Brand Identity Designer & Visual Systems Specialist" (`layout.tsx:19`, `page.tsx:13`, `structured-data.ts:28`); "Senior Brand Identity Designer" (`H:285`, `about-view.tsx:82`, `features/portfolio/data.ts:54`); "Seeking full-time Senior Brand & Product Designer / Brand Identity Designer opportunities" (`H:296`); "Open to Senior Brand Identity / Product Design opportunities" (`features/home/home-bands.tsx:60`); "Open to Brand Identity Designer roles" (`A:43`); dead copy "Senior Brand & Product Designer" (`lib/i18n.ts:71`, key `aboutLead` is never read) | three titles inside one docx; metadata exposes an employer-specific tailoring. I did not change or rank titles |
| D3 | Years of practice | "9 years" (p06) | "9+" (`H:296,353`, `why-view.tsx:36`, `features/hero/metric-row.tsx:36`), "9" (`features/portfolio/data.ts:87`), "nine years" (`services-view.tsx:86`), **"7+ years"** (`start-view.tsx:176` EN; `type-view.tsx:65,113`) while the AR FAQ says "+٩ سنوات" (`start-view.tsx:182`); deck cover meta "2019 -> 2026" (`data.ts:74`) vs "SINCE 2017" (`data.ts:87`) | Jul 2017 -> Oct 2026 is 9 y 3 m; "7+" and "2019" are the outliers |
| D4 | "4+ years on identity" | "specializing in brand identity systems since 2022" | "4+ years focused on brand identity" (`A:30`, `H:261`, `why-view.tsx:36`) | consistent |
| D5 | Month-level dates and "five years" | Media Director "Nov 2020 - Jul 2025"; Co-Founder "Feb 2024"; Freelance "Jul 2017" | year-only: "2020-25", "2024 ->", "2017 -> 2022"; "Five-year visual stewardship" (`H:221`), "REBRAND - 5 YEARS" (`data.ts:205`), "5y" (`demo.data.ts`) | Nov 2020-Jul 2025 = 4 y 8 m |
| D6 | Roles on site that are not CV jobs | CV lists only the 5 jobs above; Youth Scope and MSP appear under LEADERSHIP | `H:225-231` "2020 - 2021 / Studio Lead & Visual Director / Learn in Arabic (MSP)"; `H:235-241` "2019 - 2021 / Head of Media (2 Consecutive Seasons) / Youth Scope"; same in `A:28-29` | "Learn in Arabic" is never named in the CV |
| D7 | MSP role content | "Managed the Illustrations team at MSP Tech Club, Al-Azhar University; named Best Leader of the Season." (p41) | "Studio Lead & Visual Director - Learn in Arabic (MSP)": "Built educational visual identity, motion guidelines, and DIY production studio from scratch." (`H:225-231`) | different role, scope and organization name; CV freelance bullet "built physical studio production environments for an educational YouTube channel" (p31) may be the studio, cannot be determined |
| D8 | Youth Scope team size | "managing a production team" (p40) | "Led team of 12 designers" / "قيادة فريق من ١٢ مصمماً" (`H:241-242`) | number has no source in CV |
| D9 | "Exact match" claim | n/a | "Verified Work History (CV & LinkedIn Aligned)" / "مطابقة تامة مع الـ CV ولينكد إن" (`H:511`) | contradicted by D5-D8, D12-D13; LinkedIn not checkable |
| D10 | About timeline is incomplete | has Sep 2026 Platform Lead and 2017-2022 Freelance | `A:25-31` (EN) has neither; `H:195-202,245-252` has both | commit `325bcc3` "align About career timeline with CV" left these out |
| D11 | +40% / +25% | "online visibility rose 40% after launch" (website) and "engagement increased 25% within six months of rollout" (rebrand) | `A:27` "identity from zero: +40% visibility, +25% engagement"; `A:34` AR "+40% ظهور رقمي، +25% تفاعل"; `features/portfolio/data.ts:211` AR-only `outcomeAr: "+٤٠٪ ظهور · +٢٥٪ تفاعل"` (EN `outcome` omits them) | already removed from home/for-hiring as unverified (commits `95416a2`, `PHASE_02_CLAIMS_CONSISTENCY_2026-10-09.md`) but still live here; no source or method in the repo; the CV adds a different context for each figure |
| D12 | 20+ clients scope | "20+ organizations across pharma, healthcare, food, education, and government in Egypt and the Gulf" (p22) | "...pharma, food, education, NGOs, government" (`A:30`); "healthcare, pharmaceuticals, food, education, government, and related sectors" (`H:261`); "Local and international clients" (`metric-row.tsx`); "working worldwide" (`A:82`); AR "مشاريع عالمية" (`A:81`) | geography "Egypt and the Gulf" vs "international/worldwide"; NGOs only on site |
| D13 | Site-only numbers | not in CV | "6+ industries", "500+ design assets", "10+ websites & digital experiences" (`why-view.tsx:36`); "15+ identity systems", "38 Day method", "3x Award-winning" exist only in `StatsBand` (`home-bands.tsx:93-100`), which nothing imports (dead code) | no CV or repo source; CV names 5 sectors |
| D14 | GAD role | "GAD Heart & Lungs Institute \| Lead Brand Consultant" (p35); "under a signed international service agreement" (p23) | `H:43` "Lead Brand Identity Designer & Creative Director" + "Mustafa (Sole Designer)"; `features/case-studies/gad-institute.data.ts:78` "Sole Brand Identity Designer & Creative Lead"; `:18` "Creative lead (Mustafa)" | three titles for one engagement; "signed agreement" appears only on the CV |
| D15 | Project selection | Code & Canvas, GAD, Nile Pharma | dossier `H:31-164`: GAD, Reflection, Nile Pharma, Ahmed Bedeer | Reflection and Ahmed Bedeer absent from CV; Code & Canvas absent from dossier |
| D16 | 2026 Nile Pharma scope | "Lead corporate brand, website, and ERP visual direction" (p16) | "Leading the company digital product and platform direction across brand, website, ERP, marketing, UX/UI, and technical coordination." (`H:201`) | site scope is broader than "visual direction" |
| D17 | Education / training | "Bachelor of Agriculture - Al-Azhar University \| 2017-2024"; certification "Photography - Abdelrahman Salah Studio"; "digital design from 2024" | "B.Sc. - Al-Azhar University - 2017-2024" (`A:46`, field omitted); "TRAINING: MSP - Youth Scope - AYB - Bedaya - Resalah" (`A:47`) | no overlap between CV certification and site training; CV "six partner organizations" workshops not on site |
| D18 | Military service | "Egyptian Armed Forces \| Jul 2025 - Sep 2026" (p51) | not mentioned anywhere; site shows "2024 ->" and "2022 ->" as present, and "Sep 2026 -> Present" | visibility decision belongs to the user |

Also noted: `H:307` button "Download Updated CV" while the file's internal dates are the 2013 template default (the commit date 2026-10-06 is the only update evidence).

### 5.3 Where they agree

Email `m1aboalazm@gmail.com`, phone `+20 109 250 0454` (`contact-view.tsx:12-13`, `footer.tsx:43-45`), Al Obour, Egypt; "Open to relocation to Riyadh" (`A:44`, `H:277`); Arabic native / English professional; LinkedIn `/in/aboalazm`, Behance `/aboalazm`, GitHub `3boalazm`; Platform Lead from Sep 2026; Co-Founder from 2024; Media Director 2020-2025; Freelance 2017-2022; independent from 2022; Nile Pharma stack "WordPress" (`projects.data.ts:69`).

### 5.4 Not checkable

LinkedIn content; Behance gallery links (`219707183`, `175649297`, `161876545`); `zad.codeandcanvas.net` and `himssv02.vercel.app`; the 3 orphan hyperlink relationships; any evidence behind 40%, 25%, 20+, 12 designers, Best Head/Best Leader, six partner organizations, or the signed agreement.

---

## 6. Items that are the owner's decision (flagged, not decided)

1. Thmanyah and GC EPICPRO web-use licensing and how the files are delivered (4.1).
2. Whether the 99 third-party-looking book JPGs stay in the repo (4.2).
3. Surname and title on the CV vs the site (D1-D2); whether the docx metadata should keep the "Müllers Solutions" tailoring.
4. Which MSP / Learn in Arabic description is correct (D6-D7); the "team of 12"; the "Verified ... Aligned" heading (D8-D9).
5. Whether "+40% / +25%" stays anywhere, and the numbers with no source (D11, D13).
6. Whether the military service line should appear on the site (D18).
7. Whether the "locked" resource PDFs are meant to be gated (0.7).
8. Client/employer permission to display Nile Pharma, GAD, Ahmed Bedeer, Reflection and the stock photos inside the campaign boards.

## 7. Method notes

- Reference scan: `refscan.py` -> `public-scan.json`, `media-scan.json`; duplicate scan -> `dups.json`.
- Browser evidence: `crawl-assets.json` (31 routes x 2 viewports), `crawl-seen.json`, `crawl-ar-fonts.json`, `books-requests.json`; root cause of the 404 preload traced with CDP in `why404*.mjs` (`/_vercel/insights/script.js` -> 404 -> `Link` header; `/favicon.ico` reproduces on `/showcase/farm/index.html`).
- Font tables read directly (`woff2name.mjs` decodes WOFF2 name tables; OTF parsed in Python).
- No form was submitted, no `/admin` access, no secrets read, no git remote touched.
