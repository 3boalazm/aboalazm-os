import type { CollectionConfig } from "payload";

/**
 * TEAM MEMBERS — new collection, doesn't map to an existing type file.
 * Exists to finally complete the /team page (scaffolding was started
 * and left incomplete in a prior session).
 */
export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  admin: {
    group: "People",
    useAsTitle: "name",
    description: "Humans behind the studio — order on the page follows the order field.",
    defaultColumns: ["name", "role", "order"],
    listSearchableFields: ["name"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        { name: "nameAr", type: "text", admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "role", type: "text", required: true, admin: { width: "50%" } },
        { name: "roleAr", type: "text", admin: { width: "50%" } },
      ],
    },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      type: "row",
      fields: [
        { name: "bio", type: "textarea", admin: { width: "50%" } },
        { name: "bioAr", type: "textarea", admin: { width: "50%" } },
      ],
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower shows first." },
    },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        {
          name: "platform",
          type: "select",
          options: ["LinkedIn", "Behance", "Dribbble", "GitHub", "X"],
          required: true,
        },
        { name: "url", type: "text", required: true },
      ],
    },
  ],
};
