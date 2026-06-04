/**
 * WORK FEATURE — TYPE CONTRACTS
 * The Project shape is the single contract shared by the ledger,
 * the floating preview, the ambient glow system, and (later) the
 * Sanity schema — field names here mirror sanity/schemas/project.ts.
 */
import type { ProjectAccent } from "@/lib/tokens";

export type Discipline =
  | "Systemic Identity"
  | "Product Architecture"
  | "Design Infrastructure"
  | "Identity Engineering"
  | "Studio & Identity";

export interface Project {
  /** Stable id + route segment */
  slug: string;
  /** Display name — serif, largest element in the row */
  name: string;
  discipline: Discipline;
  /** Tech/design stack — rendered as Geist Mono micro-pills */
  stack: readonly string[];
  /** Strategic outcome — the why-care, shown at index level */
  outcome: string;
  /** Year band for the ledger's mono index column */
  year: string;
  /** Preview image for the floating cursor-trail reveal */
  thumbnail: string;
  /** Case file written? false → row opens Behance (no-404 rule) */
  hasCaseStudy: boolean;
  /**
   * Primary palette pair — consumed by useAmbientGlowControls to
   * override the global --glow-* tokens while the row is hovered.
   * Keep alpha low (0.10–0.22): atmosphere, never paint.
   */
  accent: ProjectAccent;
}
