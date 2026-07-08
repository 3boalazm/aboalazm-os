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
    useAsTitle: "name",
    defaultColumns: ["name", "category", "discipline", "year", "hasCaseStudy"],
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
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "nameAr",
      type: "text",
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
      name: "stack",
      type: "text",
      hasMany: true,
      admin: { description: "Rendered as Geist Mono micro-pills." },
    },
    {
      name: "outcome",
      type: "textarea",
      required: true,
    },
    {
      name: "outcomeAr",
      type: "textarea",
    },
    {
      name: "year",
      type: "text",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
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
      name: "externalUrl",
      type: "text",
      admin: {
        condition: (data) => !data?.hasCaseStudy,
        description: "Live site / repo / Behance link — used when there's no case study.",
      },
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
      name: "liveUrl",
      label: "Live Preview URL",
      type: "text",
      admin: {
        condition: (data) => Boolean(data?.isUiUx),
        description: "The real, currently-live URL — this is what loads in the mini preview and what the Live button opens. Independent of externalUrl, since this project may also have a case study.",
      },
    },
  ],
};
