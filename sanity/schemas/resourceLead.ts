import { defineField, defineType } from "sanity";

/** RESOURCE LEAD — email captured at the Resources download gate. */
export const resourceLead = defineType({
  name: "resourceLead",
  title: "Resource Lead",
  type: "document",
  fields: [
    defineField({ name: "email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "resource", title: "Resource requested", type: "string" }),
    defineField({ name: "source", type: "string" }),
    defineField({ name: "createdAt", title: "Captured at", type: "datetime" }),
  ],
  preview: {
    select: { title: "email", subtitle: "createdAt" },
  },
});
