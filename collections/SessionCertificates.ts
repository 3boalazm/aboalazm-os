import type { CollectionConfig } from "payload";
import { DEFAULT_SESSION_KEY, FULL_NAME_MAX } from "@/features/linkedin-session/assessment";

/**
 * SESSION CERTIFICATES — names people ask to have on an attendance
 * certificate, collected on the thank-you screen after the feedback form.
 *
 * A separate collection from `session-feedback` on purpose: the feedback
 * stays anonymous, and nothing here can be joined to a rating or a comment.
 *
 * WRITE PATH: only `requestCertificate` in
 * features/linkedin-session/feedback-actions.ts (Local API). REST/GraphQL
 * create is closed so the rate limit and the validation sit on every write.
 * The studio reads the list on /studio/sessions and exports it as CSV.
 */
export const SessionCertificates: CollectionConfig = {
  slug: "session-certificates",
  admin: {
    group: "Inbox",
    useAsTitle: "fullName",
    description: "Names requested for the attendance certificate. Not linked to any feedback answer.",
    defaultColumns: ["fullName", "sessionKey", "createdAt"],
    listSearchableFields: ["fullName"],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "fullName", type: "text", required: true, maxLength: FULL_NAME_MAX },
    {
      name: "sessionKey",
      type: "text",
      required: true,
      index: true,
      defaultValue: DEFAULT_SESSION_KEY,
      admin: { description: "Which cohort this name belongs to — the same key as session-registrations." },
    },
    { name: "source", type: "text", defaultValue: "form", admin: { readOnly: true } },
  ],
};
