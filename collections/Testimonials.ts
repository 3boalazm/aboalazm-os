import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "author",
    defaultColumns: ["author", "company", "record"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
      maxLength: 200,
    },
    { name: "author", type: "text", required: true },
    { name: "role", type: "text" },
    { name: "company", type: "text" },
    { name: "record", label: "Record №", type: "text" },
  ],
};
