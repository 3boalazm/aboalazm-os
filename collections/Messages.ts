import type { CollectionConfig } from "payload";
import { BRIEF_MAX, COMPANY_MAX, NAME_MAX, TIMELINE_MAX } from "@/features/contact/validate";

/**
 * MESSAGES — contact form submissions (features/contact/contact-form.tsx
 * → features/contact/actions.ts). Stored here AND emailed to the studio
 * inbox via lib/email.ts (SMTP env vars, see .env.example) — the email
 * is best-effort; this record is the source of truth.
 */
export const Messages: CollectionConfig = {
  slug: "messages",
  admin: {
    group: "Inbox",
    useAsTitle: "name",
    description: "Commission briefs from the /contact form — newest first. Also emailed to the studio inbox.",
    defaultColumns: ["name", "email", "budget", "isRead", "createdAt"],
    listSearchableFields: ["name", "email", "company"],
  },
  access: {
    /* The contact form saves through the local API (server action), which
       bypasses access control — so closing REST create plugs the public
       spam hole without affecting submissions. */
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    /* Sender — one row, so the eye reads it as a single address block. */
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, maxLength: NAME_MAX, admin: { width: "50%" } },
        /* Email fields have no maxLength option; the 254 cap is enforced in
           features/contact/validate.ts (the only write path — REST create
           is closed above). */
        { name: "email", type: "email", required: true, admin: { width: "50%" } },
      ],
    },
    { name: "company", type: "text", maxLength: COMPANY_MAX },
    {
      name: "brief",
      type: "textarea",
      required: true,
      maxLength: BRIEF_MAX,
      admin: { description: "What are we building — the client's own words." },
    },
    /* Qualifiers — side by side, they scan as one line. */
    {
      type: "row",
      fields: [
        { name: "timeline", type: "text", maxLength: TIMELINE_MAX, admin: { width: "50%" } },
        {
          name: "budget",
          type: "select",
          options: ["< $1K", "$1–3K", "$3–8K", "$8K+"],
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "isRead",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
};
