import { defineField, defineType } from "sanity";

/** TESTIMONIAL — C9. One sentence, outcome-focused, attributed. */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 2, validation: (r) => r.required().max(200) }),
    defineField({ name: "author", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "record", title: "Record №", type: "string" }),
  ],
});
