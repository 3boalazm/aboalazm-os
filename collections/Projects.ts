import type { CollectionConfig } from "payload";
import { revalidateCollection, revalidateOnDelete } from "@/lib/revalidate";
import { authenticatedOrPublished } from "@/lib/access";

/**
 * PROJECTS — mirrors features/work/types.ts `Project` exactly.
 * Consumed by the ledger, floating preview, and ambient glow system.
 *
 * ⚠️ Discipline is a LOCKED enum per project doctrine (see memory notes /
 * ARCHITECTURE.md). Adding a value here is a code-review decision, not a
 * content-editor one — that's why it's a `select`, not free text.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    group: "Portfolio",
    useAsTitle: "name",
    description: "Work ledger entries. EN/AR pairs and links live in tabs; flags live in the sidebar.",
    defaultColumns: ["name", "category", "discipline", "year", "status", "hasCaseStudy"],
    listSearchableFields: ["name", "nameAr"],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: authenticatedOrPublished,
  },
  hooks: {
    afterChange: [revalidateCollection(["/work", "/", "/sitemap.xml"])],
    afterDelete: [revalidateOnDelete(["/work", "/", "/sitemap.xml"])],
  },
  /* UNNAMED TABS — pure layout: field paths stay flat, so this changes
     nothing in the database or the frontend. The old single-scroll edit
     view stacked 15 fields into one wall; now they sit in three rooms. */
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Design (Brand Identity)", value: "design" },
        { label: "Development (Built/Coded)", value: "development" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "discipline",
      type: "select",
      required: true,
      options: [
        "Systemic Identity",
        "Product Architecture",
        "Design Infrastructure",
        "Identity Engineering",
        "Studio & Identity",
      ],
      admin: {
        position: "sidebar",
        description: "Locked enum — do not add values from the dashboard.",
      },
    },
    {
      name: "year",
      type: "text",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "complete",
      options: [
        { label: "Complete", value: "complete" },
        { label: "In progress", value: "in-progress" },
      ],
      admin: {
        position: "sidebar",
        description: "Use In progress for active work; completed records can keep the default.",
      },
    },
    {
      name: "hasCaseStudy",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "If off, the row opens externalUrl (no-404 rule) instead of a case study.",
      },
    },
    {
      name: "isUiUx",
      label: "Show on UI/UX Showcase",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Tags this project for the dedicated /work-ui page.",
      },
    },

    {
      type: "tabs",
      tabs: [
        {
          label: "Identity & Story",
          description: "Names (EN/AR side by side), stack pills, and the one-line outcome.",
          fields: [
            {
              type: "row",
              fields: [
                { name: "name", type: "text", required: true, admin: { width: "50%" } },
                { name: "nameAr", type: "text", admin: { width: "50%" } },
              ],
            },
            {
              name: "stack",
              type: "text",
              hasMany: true,
              admin: { description: "Rendered as Geist Mono micro-pills." },
            },
            {
              type: "row",
              fields: [
                {
                  name: "outcome",
                  type: "textarea",
                  required: true,
                  admin: { width: "50%" },
                },
                {
                  name: "outcomeAr",
                  type: "textarea",
                  admin: { width: "50%" },
                },
              ],
            },
          ],
        },
        {
          label: "Visuals & Glow",
          description: "Thumbnail and the ambient-glow accent pair.",
          fields: [
            {
              name: "thumbnail",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "accent",
              type: "group",
              admin: { description: "Ambient glow pair (rgb(...) / alpha 0.10–0.22)." },
              fields: [
                { name: "primary", type: "text", required: true },
                { name: "secondary", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Links",
          description: "Destinations — shown conditionally by the sidebar flags.",
          fields: [
            {
              name: "externalUrl",
              type: "text",
              admin: {
                condition: (data) => !data?.hasCaseStudy,
                description: "Live site / repo / Behance link — used when there's no case study.",
              },
            },
            {
              name: "liveUrl",
              label: "Live Preview URL",
              type: "text",
              admin: {
                condition: (data) => Boolean(data?.isUiUx || data?.category === "development"),
                description: "Live destination for project cards; UI/UX-tagged projects also use it for the /work-ui preview.",
              },
            },
          ],
        },
      ],
    },
  ],
};
