import { defineField, defineType } from "sanity";

/** POST — Writing section entries ("Notes from the system"). */
export const post = defineType({
  name: "post",
  title: "Writing",
  type: "document",
  fields: [
    defineField({ name: "index", title: "W-Index", type: "string", description: "e.g. W-003" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "standfirst", type: "string", validation: (r) => r.max(120) }),
    defineField({ name: "publishedAt", type: "date" }),
    defineField({ name: "lang", type: "string", options: { list: ["en", "ar"] }, initialValue: "en" }),
    defineField({ name: "body", title: "MDX body", type: "text" }),
    defineField({ name: "topics", type: "array", of: [{ type: "string" }], validation: (r) => r.max(5) }),
  ],
});
