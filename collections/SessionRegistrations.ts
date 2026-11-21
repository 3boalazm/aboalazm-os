import type { CollectionConfig } from "payload";
import {
  ANSWER_MAX,
  COLLEGE_MAX,
  DEFAULT_SESSION_KEY,
  FULL_NAME_MAX,
  INTEREST_MAX,
  LINKEDIN_URL_MAX,
  UNIVERSITY_MAX,
  payloadOptions,
} from "@/features/linkedin-session/assessment";

/**
 * SESSION REGISTRATIONS — one row per person who fills a pre-session
 * assessment (today: the LinkedIn session at /linkedin-session).
 *
 * This collection is the reason the form exists. The answers are stored as
 * *coded fields*, not one JSON blob, so the Studio console (/studio/sessions)
 * can count them: which faculties showed up, how many arrive without an
 * account, which goal dominates the room, and what to answer first. Free-text
 * questions stay free text — they are read, not counted. A question that allows
 * several answers (goals) is stored as a set, so the chart counts choices, not
 * people, and says so.
 *
 * WRITE PATH: only features/linkedin-session/actions.ts, through Payload's
 * Local API. REST/GraphQL create is closed below, which keeps the rate limit,
 * the honeypot and the validation in validate.ts on every single write.
 *
 * The three questions marked required here are the ones the session cannot be
 * planned without; everything else the attendee may skip. `cvFile` points at
 * `session-files` (admin-only reads), never at the public `media` library.
 */
export const SessionRegistrations: CollectionConfig = {
  slug: "session-registrations",
  admin: {
    group: "Inbox",
    useAsTitle: "fullName",
    description:
      "Pre-session assessment answers. Filter by session, then use the follow-up and attendance fields to work the list before and after the room.",
    defaultColumns: ["fullName", "email", "college", "yearOfStudy", "linkedinStatus", "goals", "followUp", "createdAt"],
    listSearchableFields: ["fullName", "email", "college", "university", "interestArea"],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    /**
     * A résumé is the most personal thing in this row, so deleting the row has
     * to delete the file too — otherwise a "please remove my data" request
     * leaves the PDF in the bucket with nothing pointing at it. Payload's
     * cloud-storage adapter removes the blob when the upload doc is deleted.
     *
     * `req` MUST be passed on. It keeps this delete inside the transaction that
     * is deleting the registration. Without it the file delete runs in a second
     * transaction, and `session_files` is referenced by
     * `session_registrations.cv_file_id` (ON DELETE SET NULL): the second
     * transaction waits for the first to commit, the first waits for this hook,
     * and the delete never returns. Reproduced on a throwaway Postgres on
     * 20–21 Nov 2026: one connection `idle in transaction`, the other blocked
     * on `transactionid` running `delete from "session_files"`.
     *
     * No try/catch on purpose. In one transaction both rows go or neither does;
     * swallowing an error here would let a transaction that was already rolled
     * back report success, i.e. tell the operator a person's data is gone when
     * it is not.
     */
    afterDelete: [
      async ({ doc, req }) => {
        const file = doc.cvFile;
        const id = typeof file === "object" && file !== null ? file.id : file;
        if (id === undefined || id === null || id === "") return;
        await req.payload.delete({ collection: "session-files", id, req });
      },
    ],
  },
  fields: [
    /* ── who ─────────────────────────────────────────────────────────────── */
    {
      type: "row",
      fields: [
        { name: "fullName", type: "text", required: true, maxLength: FULL_NAME_MAX, admin: { width: "50%" } },
        /* Email has no maxLength option in Payload; the 254 cap lives in validate.ts — the only write path. */
        { name: "email", type: "email", required: true, admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "college", type: "text", required: true, maxLength: COLLEGE_MAX, index: true, admin: { width: "60%" } },
        { name: "university", type: "text", maxLength: UNIVERSITY_MAX, admin: { width: "40%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "yearOfStudy", type: "select", required: true, index: true, options: payloadOptions("yearOfStudy"), admin: { width: "50%" } },
        { name: "interestArea", type: "text", maxLength: INTEREST_MAX, admin: { width: "50%" } },
      ],
    },

    /* ── where they stand ────────────────────────────────────────────────── */
    {
      name: "linkedinStatus",
      type: "select",
      required: true,
      index: true,
      options: payloadOptions("linkedinStatus"),
    },
    {
      name: "linkedinUrl",
      type: "text",
      maxLength: LINKEDIN_URL_MAX,
      admin: {
        description: "Normalised to https://www.linkedin.com/in/<handle> with the query string dropped.",
      },
    },

    /* ── what they want ──────────────────────────────────────────────────── */
    {
      type: "row",
      fields: [
        /* `text hasMany`, not `select hasMany`, on purpose: the vocabulary is
           still the list in assessment.ts (validate.ts refuses anything else —
           the only write path), but it lands in `session_registrations_texts`
           as one row per chosen goal, which is countable in SQL and does not
           depend on an enum type Payload would name on its own. */
        { name: "goals", type: "text", required: true, hasMany: true, maxRows: 6, admin: { width: "50%" } },
        { name: "appliedBefore", type: "select", options: payloadOptions("appliedBefore"), admin: { width: "50%" } },
      ],
    },

    /* ── readiness ───────────────────────────────────────────────────────── */
    {
      type: "row",
      fields: [
        { name: "cvStatus", type: "select", index: true, options: payloadOptions("cvStatus"), admin: { width: "50%" } },
        {
          name: "cvFile",
          type: "relationship",
          relationTo: "session-files",
          admin: { width: "50%", description: "Optional upload. Private: served through the admin-only session-files collection." },
        },
      ],
    },
    {
      name: "biggestChallenge",
      type: "textarea",
      maxLength: ANSWER_MAX,
      admin: { description: "Read, not counted — the dashboard lists these verbatim." },
    },
    { name: "questionForSession", type: "textarea", maxLength: ANSWER_MAX },

    /* ── operator fields — never written by the form ─────────────────────── */
    {
      name: "followUp",
      type: "select",
      defaultValue: "new",
      index: true,
      options: payloadOptions("followUp"),
      admin: {
        position: "sidebar",
        description: "Where the studio got to with this person. Set by hand — a registration is not a reply.",
      },
    },
    {
      name: "attendance",
      type: "select",
      defaultValue: "registered",
      index: true,
      options: payloadOptions("attendance"),
      admin: { position: "sidebar", description: "Mark no-shows only after checking the room list." },
    },
    {
      name: "sessionKey",
      type: "text",
      required: true,
      index: true,
      defaultValue: DEFAULT_SESSION_KEY,
      admin: { position: "sidebar", description: "Which cohort this row belongs to. /studio/sessions filters on it." },
    },
    {
      name: "source",
      type: "text",
      defaultValue: "form",
      admin: { position: "sidebar", description: "How the sign-up reached us: form, qr, whatsapp…" },
    },
    { name: "notes", type: "textarea", admin: { position: "sidebar", description: "Internal only — never shown to the registrant." } },
  ],
};
