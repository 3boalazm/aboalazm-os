# Phase 06 — Project ledger destination audit
**Date:** 2026-10-09  
**Base:** `main` at `b01eec3d122442b1c4f5602226f0dc2acf3422a9`

## Finding
The project ledger's click target ignored `liveUrl` when a project did not also define `externalUrl`. For entries such as Nile Pharma ERP and Farm Console, the visible destination could be described as an external portfolio and the click would fall back to Behance even though a local live showcase URL existed. This conflicted with the actual destination model used by the featured-cases component.

## Change proposed
- Resolve non-case-study links in this order: `liveUrl`, `externalUrl`, then Behance fallback.
- Label the row according to the actual destination: case study, live product, external link, or external portfolio.
- Keep the existing no-404 fallback behavior for projects without a written case study and without a live/external URL.

## Validation limits
Static source inspection only. No build/typecheck, browser click-through, or production deployment has been performed in this pass.
