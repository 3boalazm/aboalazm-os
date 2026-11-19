import type { CollectionConfig } from "payload";
import { revalidateSiteAfterChange, revalidateSiteAfterDelete } from "@/lib/revalidate";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    group: "People",
    useAsTitle: "author",
    description: "Client quotes — record № ties each quote to its source.",
    defaultColumns: ["author", "company", "record"],
    listSearchableFields: ["author", "company"],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSiteAfterChange],
    afterDelete: [revalidateSiteAfterDelete],
  },
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
      maxLength: 200,
    },
    {
      type: "row",
      fields: [
        { name: "author", type: "text", required: true, admin: { width: "33.3%" } },
        { name: "role", type: "text", admin: { width: "33.3%" } },
        { name: "company", type: "text", admin: { width: "33.3%" } },
      ],
    },
    { name: "record", label: "Record №", type: "text" },
  ],
};
