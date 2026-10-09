import type { CollectionConfig } from "payload";

/**
 * RESOURCE LEADS — emails captured at the /resources download gate.
 * Replaces the old best-effort Sanity write in app/api/resources.
 * createdAt is Payload's built-in timestamp — no need to duplicate it.
 */
export const ResourceLeads: CollectionConfig = {
  slug: "resource-leads",
  admin: {
    group: "Inbox",
    useAsTitle: "email",
    description: "Emails captured at the /resources download gate — newest first.",
    defaultColumns: ["email", "resource", "source", "createdAt"],
    listSearchableFields: ["email", "resource"],
  },
  access: {
    // Leads are created only by app/api/resources (Payload local API, which
    // skips access control) — that route owns the rate limit + email
    // validation. Leaving REST/GraphQL create open let anyone POST straight
    // to /api/resource-leads and bypass both, so only admins may use it.
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "email", type: "email", required: true },
    { name: "resource", label: "Resource requested", type: "text" },
    { name: "source", type: "text" },
  ],
};
