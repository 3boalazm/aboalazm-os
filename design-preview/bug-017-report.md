# BUG-017 — English Single-Blog Mobile Layout Overflow
Status: **Fixed and verified.**

## Root Cause

`app/(site)/writing/writing-detail-view.tsx` renders the article hero title by splitting `post.title` into words and animating each word in its own `<motion.span className="inline-block">` (for the word-by-word reveal effect), inside an `<h1 className="max-w-[16ch] ...">`.

At mobile widths, the available column for the title is ~272–382px (`container-content`'s 24px×2 padding subtracted from the viewport). The title font is `--font-epicpro` (GC EPICPRO, weight 800) forced `uppercase` — a bold display face where uppercase Latin text runs wide. English post titles sometimes contain a single long word (e.g. **"infrastructure,"** in *"Design systems are infrastructure, not UI kits."*, W-008) that alone renders ~385–419px wide in that font — wider than the mobile column.

Because each word is `display: inline-block` with no width constraint, and neither the `<h1>` nor the spans had `overflow-wrap`/`word-break` set, the browser had no way to break that single word — `inline-block` boxes size to their content (shrink-to-fit) and only wrap *between* separate inline-level boxes, never *within* one, unless explicitly told to. The oversized word forced its own span (and therefore the `<h1>`, and therefore `<body>`) to overflow horizontally.

**Why only English, not Arabic:** the Arabic counterpart posts' titles (e.g. *"أنظمة التصميم بنية تحتية، لا مكتبات واجهات."*) simply don't currently contain a single word wide enough to trigger the same latent bug — their longest word measures ~147px, well inside the column. The underlying structural gap (no `overflow-wrap` on the title) exists in both languages equally; it just hadn't been *exposed* by Arabic content yet. This was confirmed empirically, not assumed — a fresh check on the Arabic page showed the same `<h1>` markup, same lack of overflow-wrap, and zero overflow, purely because of its content's word lengths.

**Why only mobile, not desktop:** at desktop widths the title column is hundreds of pixels wider, so even the longest English word fits comfortably before wrapping to the next line — the bug requires column width < longest single word's rendered width, which only happens in the ~320–430px range for this content.

**A secondary, non-causal finding, ruled out:** I initially suspected a mismatch between the site's global UI-language `dir` (`<html dir>`, driven by a separate language toggle) and the individual article's own `dir` (`postLang`) — viewing an English article while the site UI language is set to Arabic does flip the overflow's scroll direction (`window.scrollX` goes negative instead of the content simply scrolling right), because RTL documents redirect horizontal overflow to the start (right) edge. I verified this is **not the root cause**: switching the UI language to English (`<html dir="ltr">`, matching the article) reproduced the identical overflow (74px), just with a positive `scrollX` instead of negative. The RTL/LTR host mismatch only changes which direction the *already-broken* layout scrolls in — it doesn't cause the bug.

**A separate, unrelated bug found during verification, explicitly out of scope:** some English posts (e.g. W-008 "enterprise-design-systems", W-011 "digital-product-lifecycle") contain a comparison `<table>` in their article *body* (not the hero) that also overflows on mobile — a completely different component (the article body's table block renderer, not `writing-detail-view.tsx`'s hero), a different cause (fixed-width table cells with no `overflow-x-auto` wrapper, not a word-break issue), and confirmed to be content-length-dependent in the same way (the Arabic counterpart's table happens to fit). This does **not** match the ticket's description ("large heading exceeds container") and was left untouched, per instruction #4 ("Fix ONLY the English mobile overflow" — meaning this specific hero bug, not every overflow on the page). Flagged as a follow-up task rather than silently fixed or silently ignored.

## Files Changed

**`app/(site)/writing/writing-detail-view.tsx`** — one line:

```diff
   {titleWords.map((word, i) => (
     <motion.span
       key={i}
-      className="inline-block"
+      className="inline-block max-w-full [overflow-wrap:anywhere]"
       initial={{ opacity: 0, y: 28 }}
```

### Why the fix works (and why the first attempt didn't)

My first attempt added `break-words` (`overflow-wrap: break-word`) to the `<h1>` itself. This **did not work** — verified live, the overflow persisted (in fact grew, since layout shifted). The reason is a real, documented CSS nuance: `overflow-wrap: break-word` is explicitly defined to be ignored when computing an element's *intrinsic* (shrink-to-fit / min-content) size — which is exactly the sizing mode `display: inline-block` uses. A `break-word` value only affects how already-*overflowing* content is handled during layout, not the box-sizing calculation itself, so an `inline-block` span with no other width constraint just grows to fit the unbreakable word instead of shrinking and wrapping.

`overflow-wrap: anywhere` (Tailwind arbitrary value `[overflow-wrap:anywhere]`) is the one that **does** factor into intrinsic-size calculations (this is the documented distinction between the two values). Paired with `max-w-full` (ties the span's width ceiling to its container, the `<h1>`, instead of its unconstrained content width), this lets the shrink-to-fit algorithm correctly narrow the span to the available column and wrap "infrastructure," across two lines within its own `inline-block` box — exactly the same as any other over-long word would in a normal paragraph, just scoped to a single animated word-span here.

Because both `max-w-full` and `overflow-wrap: anywhere` are **no-ops unless a word is already too wide for its column**, this fix has zero effect on any content that already fits — which covers 100% of Arabic titles today and all English titles at desktop widths.

## Regression Report

| Check | Result |
|---|---|
| 320px, English (`enterprise-design-systems`) | `h1.scrollWidth - h1.clientWidth = 0` |
| 375px, English | `= 0` |
| 390px, English | `= 0` |
| 430px, English | `= 0` |
| 1440px desktop, English | `= 0`, wraps to 3 lines exactly as before (word-boundary wraps only — `anywhere`-breaking never triggers since every word fits) |
| 390px, Arabic (`enterprise-design-systems-ar`) | `= 0` (unaffected, same as pre-fix) |
| 1440px desktop, Arabic | `= 0`, 3-line wrap unchanged |
| Hydration warnings | None, on 2 independent fresh browser tabs (English page, both before and after resize) |
| React console errors | None |
| `npm run typecheck` | Clean, 0 errors |
| `npm run build` | Green, exit code 0 |
| CLS | No layout-affecting change to any element that doesn't currently overflow — the only elements whose box size can change are already-overflowing English words at narrow widths, which is the bug being fixed, not a regression |

**Not fixed, filed as a separate follow-up task:** the article-body `<table>` mobile overflow found during verification (different component, different root cause, content-length-dependent in both languages) — spawned as its own background task rather than bundled into this fix.
