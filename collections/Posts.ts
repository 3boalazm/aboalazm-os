import type { CollectionConfig } from "payload";

/**
 * POSTS — the "Writing" section ("Notes from the system").
 * `body` upgrades from the old plain-text MDX string to a real Lexical
 * richText field — free with Payload, no separate editor to wire up.
 */
export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "index", "lang", "publishedAt", "_status"],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "index",
      label: "W-Index",
      type: "text",
      admin: { description: "e.g. W-003", position: "sidebar" },
    },
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
    },
    { name: "standfirst", type: "text", maxLength: 120 },
    {
      name: "publishedAt",
      type: "date",
      admin: { position: "sidebar" },
    },
    {
      name: "lang",
      type: "select",
      defaultValue: "en",
      options: ["en", "ar"],
      admin: { position: "sidebar" },
    },
    { name: "body", type: "richText" },
    {
      name: "topics",
      type: "text",
      hasMany: true,
      maxRows: 5,
    },
  ],
};
