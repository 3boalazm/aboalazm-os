import type { CollectionConfig } from "payload";

/**
 * SESSION FILES — CVs uploaded by the LinkedIn-session registration form.
 *
 * A separate upload collection instead of reusing `media` for one reason:
 * `media` is world-readable (`read: () => true`) because the public site has
 * to render its images. A CV is not an image — a registrant handing us their
 * résumé must not end up on an unlisted-but-fetchable public bucket path.
 * Reads here are admin-only.
 *
 * The storage adapter still comes from payload.config.ts: this slug is listed
 * in `vercelBlobStorage({ collections: … })`, so bytes land in Vercel Blob
 * rather than the serverless filesystem. With `disablePayloadAccessControl`
 * left at its default (false), the stored `url` points at Payload's own
 * `/api/session-files/file/:filename` route, which enforces the access control
 * above on every request.
 *
 * PDF only, enforced twice: `upload.mimeTypes` (Payload sniffs the bytes, so a
 * renamed .docx that is really a zip is rejected) and the form's own check in
 * features/linkedin-session/validate.ts, which can say "too large" in Arabic
 * instead of failing with a storage error.
 */
export const SessionFiles: CollectionConfig = {
  slug: "session-files",
  admin: {
    group: "Inbox",
    useAsTitle: "owner",
    description:
      "Résumés attached to session registrations. Admin-only reads — never exposed through the public site.",
    defaultColumns: ["owner", "filename", "mimeType", "createdAt"],
    listSearchableFields: ["owner", "filename"],
  },
  access: {
    /* Written only by the registration server action through the Local API
       (which bypasses access control); closing REST create stops anyone
       posting files into our bucket directly. */
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    mimeTypes: ["application/pdf"],
  },
  fields: [
    {
      name: "owner",
      type: "text",
      admin: {
        description: "Registrant email, copied here so an orphaned file can still be traced to a person.",
      },
    },
    {
      name: "sessionKey",
      type: "text",
      index: true,
      admin: { description: "Cohort this file was uploaded for, e.g. linkedin-2026." },
    },
  ],
};
