import type { CollectionConfig, Field } from "payload";
import { revalidateCollection, revalidateOnDelete } from "@/lib/revalidate";
import { authenticatedOrPublished } from "@/lib/access";

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
  {
    type: "row",
    fields: [
      { name: "label", type: "text", required: true, admin: { width: "50%" } },
      { name: "labelAr", type: "text", admin: { width: "50%" } },
    ],
  },
  {
    type: "row",
    fields: [
      { name: "context", type: "text", admin: { width: "50%" } },
      { name: "contextAr", type: "text", admin: { width: "50%" } },
    ],
  },
];

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    group: "Portfolio",
    useAsTitle: "name",
    description: "Four-panel case files. EN/AR sit side by side inside each panel.",
    defaultColumns: ["name", "discipline", "_status"],
    listSearchableFields: ["name", "nameAr"],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: authenticatedOrPublished,
  },
  hooks: {
    afterChange: [revalidateCollection(["/case-studies", "/gallery", "/sitemap.xml"])],
    afterDelete: [revalidateOnDelete(["/case-studies", "/gallery", "/sitemap.xml"])],
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        { name: "nameAr", type: "text", admin: { width: "50%" } },
      ],
    },
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
      admin: { description: "Ambient glow pair (rgb(...) / alpha 0.10–0.22)." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "primary", type: "text", required: true, admin: { width: "50%" } },
            { name: "secondary", type: "text", required: true, admin: { width: "50%" } },
          ],
        },
      ],
    },

    /* ── Panel 01 — Context & Audit ─────────────────────────────── */
    {
      type: "collapsible",
      label: "Panel 01 — Context & Audit",
      fields: [
        {
          type: "row",
          fields: [
            { name: "problem", type: "textarea", required: true, admin: { width: "50%" } },
            { name: "problemAr", type: "textarea", admin: { width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "teamScale", type: "text", admin: { width: "50%" } },
            { name: "teamScaleAr", type: "text", admin: { width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "timeline", type: "text", admin: { width: "50%" } },
            { name: "timelineAr", type: "text", admin: { width: "50%" } },
          ],
        },
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
        {
          type: "row",
          fields: [
            { name: "researchSummary", type: "textarea", required: true, admin: { width: "50%" } },
            { name: "researchSummaryAr", type: "textarea", admin: { width: "50%" } },
          ],
        },
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
        {
          type: "row",
          fields: [
            { name: "visualVectors", type: "text", hasMany: true, admin: { width: "50%" } },
            { name: "visualVectorsAr", type: "text", hasMany: true, admin: { width: "50%" } },
          ],
        },
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
            {
              type: "row",
              fields: [
                { name: "caption", type: "text", admin: { width: "50%" } },
                { name: "captionAr", type: "text", admin: { width: "50%" } },
              ],
            },
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
            {
              type: "row",
              fields: [
                { name: "note", type: "textarea", required: true, admin: { width: "50%" } },
                { name: "noteAr", type: "textarea", admin: { width: "50%" } },
              ],
            },
          ],
        },
      ],
    },
  ],
};
