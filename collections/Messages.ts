import type { CollectionConfig } from "payload";

/**
 * MESSAGES — contact form submissions. This is entirely new; the site
 * had no backend for features/contact/contact-form.tsx before (it just
 * faked a 900ms delay and showed a success state — nothing was sent
 * anywhere). Wiring the real submit is Phase 6.
 *
 * ⚠️ KNOWN GAP: the current form has no `email` input, only
 * name/company/brief/timeline/budget. There's no way to reply to a
 * submission without one. `email` is required here anyway — the form
 * needs that field added in Phase 6 before this can go live.
 */
export const Messages: CollectionConfig = {
  slug: "messages",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "budget", "isRead", "createdAt"],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "company", type: "text" },
    { name: "brief", type: "textarea", required: true },
    { name: "timeline", type: "text" },
    {
      name: "budget",
      type: "select",
      options: ["< $1K", "$1–3K", "$3–8K", "$8K+"],
    },
    {
      name: "isRead",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
};
