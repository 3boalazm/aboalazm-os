import type { CollectionConfig } from "payload";

/**
 * TEAM MEMBERS — new collection, doesn't map to an existing type file.
 * Exists to finally complete the /team page (scaffolding was started
 * and left incomplete in a prior session).
 */
export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "nameAr", type: "text" },
    { name: "role", type: "text", required: true },
    { name: "roleAr", type: "text" },
    { name: "photo", type: "upload", relationTo: "media" },
    { name: "bio", type: "textarea" },
    { name: "bioAr", type: "textarea" },
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
