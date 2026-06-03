/**
 * PROJECT — drives the Engineering Ledger (features/work).
 * Field names mirror features/work/types.ts exactly.
 */
import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({
      name: "discipline",
      type: "string",
      options: { list: ["Systemic Identity", "Product Architecture", "Design Infrastructure"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "stack", type: "array", of: [{ type: "string" }], validation: (r) => r.max(5) }),
    defineField({ name: "outcome", type: "string", description: "One strategic outcome. A metric beats an adjective." }),
    defineField({ name: "year", type: "string" }),
    defineField({ name: "thumbnail", type: "image", options: { hotspot: true } }),
    defineField({
      name: "accentPrimary",
      title: "Accent · primary glow",
      type: "string",
      description: 'rgb() with alpha 0.10–0.22, e.g. "rgb(96 165 250 / 0.20)"',
      validation: (r) => r.regex(/^rgb\(\d+ \d+ \d+ \/ 0\.\d+\)$/),
    }),
    defineField({
      name: "accentSecondary",
      title: "Accent · secondary glow",
      type: "string",
      validation: (r) => r.regex(/^rgb\(\d+ \d+ \d+ \/ 0\.\d+\)$/),
    }),
    defineField({ name: "order", type: "number", description: "Ledger position" }),
    defineField({ name: "caseStudy", type: "reference", to: [{ type: "caseStudy" }] }),
  ],
  orderings: [{ title: "Ledger order", name: "order", by: [{ field: "order", direction: "asc" }] }],
});
