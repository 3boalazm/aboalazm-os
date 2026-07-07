/**
 * WORK FEATURE — TYPE CONTRACTS
 * The Project shape is the single contract shared by the ledger,
 * the floating preview, the ambient glow system, and the
 * Payload `projects` collection — field names mirror collections/Projects.ts.
 */
import type { ProjectAccent } from "@/lib/tokens";

export type Discipline =
  | "Systemic Identity"
  | "Product Architecture"
  | "Design Infrastructure"
  | "Identity Engineering"
  | "Studio & Identity";

/** Top-level split shown as a filter on /work — design (brand identity)
 *  vs development (built platforms, sites, tools). */
export type ProjectCategory = "design" | "development";

export interface Project {
  /** Stable id + route segment */
  slug: string;
  /** Display name — serif, largest element in the row */
  name: string;
  nameAr?: string;
  /** design (brand identity work) or development (built/coded work) */
  category: ProjectCategory;
  discipline: Discipline;
  /** Tech/design stack — rendered as Geist Mono micro-pills */
  stack: readonly string[];
  /** Strategic outcome — the why-care, shown at index level */
  outcome: string;
  outcomeAr?: string;
  /** Year band for the ledger's mono index column */
  year: string;
  /** Preview image for the floating cursor-trail reveal */
  thumbnail: string;
  /** Case file written? false → row opens a fallback link (no-404 rule) */
  hasCaseStudy: boolean;
  /**
   * Fallback link used when hasCaseStudy is false. For design projects
   * this is typically omitted (falls back to the Behance portfolio).
   * For development projects, point this at the live site or repo —
   * opening Behance for a coded project would be the wrong link.
   */
  externalUrl?: string;
  /**
   * Primary palette pair — consumed by useAmbientGlowControls to
   * override the global --glow-* tokens while the row is hovered.
   * Keep alpha low (0.10–0.22): atmosphere, never paint.
   */
  accent: ProjectAccent;
}
