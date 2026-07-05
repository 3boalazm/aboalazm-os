import type { CollectionConfig, Field } from "payload";

/**
 * CASE STUDIES — mirrors features/case-studies/types.ts `CaseStudyRecord`
 * field-for-field. Four panels: Context & Audit → Research & Logic →
 * Execution & Governance → Performance & Post Mortem.
 *
 * `kpis` and `results` share the exact same shape (KPI), so it's factored
 * out once and reused — keep them in sync if the shape ever changes.
 */
const kpiFields: Field[] = [
  { name: "value", type: "text", required: true },
  { name: "label", type: "text", required: true },
  { name: "labelAr", type: "text" },
  { name: "context", type: "text" },
  { name: "contextAr", type: "text" },
];

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "discipline", "_status"],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
    },
    { name: "name", type: "text", required: true },
    { name: "nameAr", type: "text" },
    {
      name: "discipline",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
        description: "Free text here (unlike Projects.discipline, which is locked).",
      },
    },
    {
      name: "accent",
      type: "group",
      fields: [
        { name: "primary", type: "text", required: true },
        { name: "secondary", type: "text", required: true },
      ],
    },

    /* ── Panel 01 — Context & Audit ─────────────────────────────── */
    {
      type: "collapsible",
      label: "Panel 01 — Context & Audit",
      fields: [
        { name: "problem", type: "textarea", required: true },
        { name: "problemAr", type: "textarea" },
        { name: "teamScale", type: "text" },
        { name: "teamScaleAr", type: "text" },
        { name: "timeline", type: "text" },
        { name: "timelineAr", type: "text" },
        {
          name: "kpis",
          type: "array",
          fields: kpiFields,
        },
      ],
    },

    /* ── Panel 02 — Research & Logic ─────────────────────────────── */
    {
      type: "collapsible",
      label: "Panel 02 — Research & Logic",
      fields: [
        { name: "researchSummary", type: "textarea", required: true },
        { name: "researchSummaryAr", type: "textarea" },
        {
          name: "competitors",
          type: "array",
          admin: { description: "Placed on the Generic↔Distinct / Artifact↔System axes." },
          fields: [
            { name: "name", type: "text", required: true },
            { name: "x", type: "number", required: true, min: 0, max: 100 },
            { name: "y", type: "number", required: true, min: 0, max: 100 },
            { name: "isClient", type: "checkbox", defaultValue: false },
          ],
        },
        { name: "visualVectors", type: "text", hasMany: true },
        { name: "visualVectorsAr", type: "text", hasMany: true },
      ],
    },

    /* ── Panel 03 — Execution & Governance ───────────────────────── */
    {
      type: "collapsible",
      label: "Panel 03 — Execution & Governance",
      fields: [
        {
          name: "tokens",
          type: "array",
          fields: [
            { name: "token", type: "text", required: true },
            { name: "value", type: "text", required: true },
            { name: "role", type: "text", required: true },
            { name: "roleAr", type: "text" },
          ],
        },
        { name: "componentStates", type: "text", hasMany: true },
        {
          name: "breakpoints",
          type: "array",
          fields: [
            { name: "bp", type: "text", required: true },
            { name: "cols", type: "text", required: true },
          ],
        },
        {
          name: "images",
          type: "array",
          admin: { description: "Rendered via <CaseGallery> below the scrolly panels." },
          fields: [
            { name: "image", type: "upload", relationTo: "media", required: true },
            { name: "caption", type: "text" },
            { name: "captionAr", type: "text" },
            {
              name: "span",
              type: "select",
              defaultValue: "half",
              options: ["full", "half"],
            },
          ],
        },
      ],
    },

    /* ── Panel 04 — Performance & Post Mortem ────────────────────── */
    {
      type: "collapsible",
      label: "Panel 04 — Performance & Post Mortem",
      fields: [
        {
          name: "results",
          type: "array",
          fields: kpiFields,
        },
        {
          name: "retro",
          type: "array",
          fields: [
            {
              name: "verdict",
              type: "select",
              required: true,
              options: ["KEEP", "CHANGE", "DROP"],
            },
            { name: "note", type: "textarea", required: true },
            { name: "noteAr", type: "textarea" },
          ],
        },
      ],
    },
  ],
};
