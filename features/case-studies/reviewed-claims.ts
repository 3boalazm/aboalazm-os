/**
 * REVIEWED CLAIMS — tiles the reviewed source no longer carries.
 *
 * A case study's KPI and outcome tiles come from the CMS when the database
 * answers, and from `*.data.ts` when it does not. Two tiles were retired in the
 * source and never in the database, so the live site still shows what the
 * source dropped:
 *
 *   · Nile Pharma — "+40% Online Visibility" and "+25% Customer Engagement".
 *     Retired in b629644 ("replace unverified Nile Pharma metrics with
 *     deliverables"); the Outcome panel on the live case still prints both.
 *   · GAD — "0 Brand system before". Corrected in #36: it was a rebrand of an
 *     existing identity, and the V2.0 brand book on the same page says so.
 *
 * `getCaseStudy` already lets the reviewed source win for the narrative
 * answers and the design-proof items; this does the same for these tiles, and
 * only for these tiles.
 *
 * The rule is narrow on purpose. A tile is replaced only when value, label AND
 * context all still equal the retired text (case, spacing and punctuation
 * ignored), so the moment Admin edits any of the three — a new number with its
 * source, say — the CMS wins again. The replacement is the reviewed record's
 * tile at the same position; if there is none the stale tile is dropped.
 *
 * Delete an entry as soon as the database row is corrected.
 */
import type { CaseStudyRecord, KPI } from "./types";

type Field = "kpis" | "results";

interface RetiredTile {
  slug: string;
  field: Field;
  value: string;
  label: string;
  context: string;
}

const RETIRED_TILES: readonly RetiredTile[] = [
  { slug: "nile-pharma", field: "results", value: "+40%", label: "Online Visibility", context: "POST WEBSITE LAUNCH" },
  { slug: "nile-pharma", field: "results", value: "+25%", label: "Customer Engagement", context: "6 MONTHS POST-REBRAND" },
  { slug: "gad-institute", field: "kpis", value: "0", label: "Brand system before", context: "STARTED FROM STRATEGY" },
];

/** Lower-case, letters and digits only — "6 months post-rebrand" === "6 MONTHS POST REBRAND". */
const norm = (s: string | undefined | null): string => (s ?? "").toLowerCase().replace(/[^\p{L}\p{N}+%]+/gu, "");

export function isRetiredTile(slug: string, field: Field, tile: KPI): boolean {
  return RETIRED_TILES.some(
    (r) =>
      r.slug === slug &&
      r.field === field &&
      norm(tile.value) === norm(r.value) &&
      norm(tile.label) === norm(r.label) &&
      norm(tile.context) === norm(r.context),
  );
}

/**
 * Returns `record` itself when nothing is retired (the common case), otherwise
 * a copy whose `kpis` / `results` carry the reviewed tiles instead.
 */
export function applyReviewedClaims(record: CaseStudyRecord, reviewed?: CaseStudyRecord): CaseStudyRecord {
  let changed = false;

  const fix = (field: Field): readonly KPI[] => {
    const out: KPI[] = [];
    record[field].forEach((tile, i) => {
      if (!isRetiredTile(record.slug, field, tile)) {
        out.push(tile);
        return;
      }
      changed = true;
      const counterpart = reviewed?.[field][i];
      if (counterpart && !isRetiredTile(record.slug, field, counterpart)) out.push(counterpart);
    });
    return out;
  };

  const kpis = fix("kpis");
  const results = fix("results");
  return changed ? { ...record, kpis, results } : record;
}
