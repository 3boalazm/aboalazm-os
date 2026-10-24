import type { CollectionConfig } from "payload";
import { MESSAGE_MAX, COMPANY_MAX, NAME_MAX, TIMELINE_MAX } from "@/features/contact/validate";

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
    description: "Project enquiries from /contact. Filter by service, source page or campaign, then update Lead stage as an enquiry qualifies, reaches proposal or closes.",
    defaultColumns: ["name", "company", "service", "leadStage", "budget", "sourcePage", "isRead", "createdAt"],
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
      maxLength: MESSAGE_MAX,
      admin: { description: "Service, package, source and campaign context followed by the client brief." },
    },
    /* Acquisition context is stored as fields so the inbox can be filtered without parsing free-text briefs. */
    {
      type: "row",
      fields: [
        { name: "service", type: "select", options: [
          { label: "Brand identity", value: "brand-identity" },
          { label: "Website / landing page", value: "website" },
          { label: "Digital product", value: "digital-product" },
          { label: "Brand support", value: "brand-support" },
          { label: "Scope not defined", value: "not-sure" },
        ], admin: { width: "50%" } },
        { name: "packageTier", type: "select", options: [
          { label: "Logo design", value: "logo-design" },
          { label: "Brand identity", value: "brand-identity" },
          { label: "Full brand system", value: "full-brand-system" },
        ], admin: { width: "50%" } },
      ],
    },
    { type: "row", fields: [
      { name: "sourcePage", type: "text", maxLength: 160, admin: { width: "60%", description: "Sanitized local page path, e.g. /services/brand-identity." } },
      { name: "locale", type: "select", options: [{ label: "English", value: "en" }, { label: "Arabic", value: "ar" }], admin: { width: "40%" } },
    ] },
    { type: "row", fields: [
      { name: "utmSource", type: "text", maxLength: 80, admin: { width: "33%", description: "Campaign ID only; no URL or visitor data." } },
      { name: "utmMedium", type: "text", maxLength: 80, admin: { width: "33%" } },
      { name: "utmCampaign", type: "text", maxLength: 80, admin: { width: "34%" } },
    ] },
    /* Manually maintained sales stage: a form submit is not automatically a qualified lead. */
    { type: "row", fields: [
      { name: "leadStage", type: "select", defaultValue: "new", required: true, options: [
        { label: "New enquiry", value: "new" },
        { label: "Qualified", value: "qualified" },
        { label: "Proposal sent", value: "proposal-sent" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
        { label: "Not a fit", value: "not-a-fit" },
      ], admin: { position: "sidebar", description: "Update manually after reviewing the actual conversation." } },
      { name: "closedReason", type: "select", options: [
        { label: "Budget", value: "budget" },
        { label: "Timing", value: "timing" },
        { label: "Scope mismatch", value: "scope" },
        { label: "No response", value: "no-response" },
        { label: "Other / unknown", value: "other" },
      ], admin: { position: "sidebar", description: "Optional when marking a lead Lost or Not a fit." } },
    ] },
    { type: "row", fields: [
      { name: "proposalValue", type: "number", min: 0, admin: { width: "50%", description: "Quoted amount in USD; fill only after sending a real proposal." } },
      { name: "wonValue", type: "number", min: 0, admin: { width: "50%", description: "Actual contracted amount in USD; fill only after the deal is won." } },
    ] },
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
