/**
 * CASE STUDY — the 14-section record per Case-Study-Standard.md,
 * grouped into the four scrollytelling acts. Mirrors
 * features/case-studies/types.ts (CaseStudyRecord).
 */
import { defineField, defineType, defineArrayMember } from "sanity";

const kpi = {
  type: "object" as const,
  fields: [
    defineField({ name: "value", type: "string" }),
    defineField({ name: "label", type: "string" }),
    defineField({ name: "context", type: "string", description: "Mono provenance line — measurement basis" }),
  ],
};

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  groups: [
    { name: "act1", title: "01 · Context & Audit" },
    { name: "act2", title: "02 · Research & Logic" },
    { name: "act3", title: "03 · Execution & Governance" },
    { name: "act4", title: "04 · Performance & Post Mortem" },
  ],
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "discipline", type: "string" }),

    /* Act I */
    defineField({ name: "problem", type: "text", rows: 3, group: "act1" }),
    defineField({ name: "teamScale", type: "string", group: "act1" }),
    defineField({ name: "timeline", type: "string", group: "act1" }),
    defineField({ name: "kpis", title: "Audit KPIs (before)", type: "array", of: [defineArrayMember(kpi)], group: "act1", validation: (r) => r.max(3) }),

    /* Act II */
    defineField({ name: "researchSummary", type: "text", rows: 3, group: "act2" }),
    defineField({
      name: "competitors", type: "array", group: "act2",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "name", type: "string" }),
          defineField({ name: "x", title: "Distinct (0–100)", type: "number" }),
          defineField({ name: "y", title: "System (0–100)", type: "number" }),
          defineField({ name: "isClient", type: "boolean", initialValue: false }),
        ],
      })],
    }),
    defineField({ name: "visualVectors", type: "array", of: [{ type: "string" }], group: "act2" }),

    /* Act III */
    defineField({
      name: "tokens", type: "array", group: "act3",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "token", type: "string" }),
          defineField({ name: "value", type: "string" }),
          defineField({ name: "role", type: "string" }),
        ],
      })],
    }),
    defineField({ name: "componentStates", type: "array", of: [{ type: "string" }], group: "act3" }),
    defineField({
      name: "breakpoints", type: "array", group: "act3",
      of: [defineArrayMember({
        type: "object",
        fields: [defineField({ name: "bp", type: "string" }), defineField({ name: "cols", type: "string" })],
      })],
    }),
    defineField({ name: "body", title: "Long-form MDX body (Acts narrative)", type: "text", group: "act3", description: "Optional extended narrative; rendered through mdx-components" }),

    /* Act IV */
    defineField({ name: "results", type: "array", of: [defineArrayMember(kpi)], group: "act4", validation: (r) => r.max(5) }),
    defineField({
      name: "retro", type: "array", group: "act4",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "verdict", type: "string", options: { list: ["KEEP", "CHANGE", "DROP"] } }),
          defineField({ name: "note", type: "string" }),
        ],
      })],
      validation: (r) => r.min(3).max(6),
    }),
    defineField({ name: "testimonial", type: "reference", to: [{ type: "testimonial" }], group: "act4" }),
  ],
});
