import type { CollectionConfig } from "payload";
import { ANSWER_MAX, DEFAULT_SESSION_KEY, FULL_NAME_MAX } from "@/features/linkedin-session/assessment";
import { feedbackPayloadOptions } from "@/features/linkedin-session/feedback";

/**
 * SESSION FEEDBACK — one row per person who fills the after-session form
 * (today: /linkedin-session/feedback).
 *
 * The mirror of `session-registrations`, for the other end of the same
 * session: that collection says who is coming and what they need, this one
 * says whether the room got what it came for. /studio/sessions reads both, so
 * the cohort's before and after sit on one screen.
 *
 * Answers are coded fields, not a JSON blob, so the dashboard can average and
 * count them: three 1–5 scales (overall, confidence before, confidence after),
 * three choices (pace, recommend, first next step), one set (which parts
 * helped). The three open answers are read, not counted.
 *
 * ANONYMOUS BY DEFAULT. `fullName` and `email` are optional on purpose: people
 * are franker without them. `email` is only used to match a feedback row to a
 * registration; `allowQuote` is honoured only with a name (validated in
 * features/linkedin-session/feedback.ts, the only write path).
 *
 * WRITE PATH: only features/linkedin-session/feedback-actions.ts, through
 * Payload's Local API. REST/GraphQL create is closed below so the rate limit,
 * the honeypot and the validation sit on every single write. Unlike
 * registrations there is no re-submit-updates-the-row rule: without an
 * identity there is nothing to match on, so two submissions are two rows.
 */
export const SessionFeedback: CollectionConfig = {
  slug: "session-feedback",
  admin: {
    group: "Inbox",
    useAsTitle: "fullName",
    description: "After-session feedback. Read the open answers first; the numbers are on /studio/sessions.",
    defaultColumns: ["rating", "confidenceBefore", "confidenceAfter", "recommend", "nextStep", "createdAt"],
    listSearchableFields: ["fullName", "email", "bestPart", "improve", "nextTopic"],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    /* ── the numbers ─────────────────────────────────────────────────────── */
    {
      type: "row",
      fields: [
        { name: "rating", type: "number", required: true, min: 1, max: 5, admin: { width: "33%", step: 1 } },
        { name: "confidenceBefore", type: "number", required: true, min: 1, max: 5, admin: { width: "33%", step: 1 } },
        { name: "confidenceAfter", type: "number", required: true, min: 1, max: 5, admin: { width: "33%", step: 1 } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "pace", type: "select", required: true, index: true, options: feedbackPayloadOptions("pace"), admin: { width: "33%" } },
        { name: "recommend", type: "select", required: true, index: true, options: feedbackPayloadOptions("recommend"), admin: { width: "33%" } },
        { name: "nextStep", type: "select", required: true, index: true, options: feedbackPayloadOptions("nextStep"), admin: { width: "33%" } },
      ],
    },
    /* `text hasMany`, not `select hasMany`: same reasoning as registrations.goals —
       the vocabulary is feedback.ts's list (validated there), one row per chosen
       part in `session_feedback_texts`, countable in SQL, no enum type to name. */
    { name: "mostUseful", type: "text", required: true, hasMany: true, maxRows: 7 },

    /* ── the words ───────────────────────────────────────────────────────── */
    { name: "bestPart", type: "textarea", maxLength: ANSWER_MAX },
    { name: "improve", type: "textarea", maxLength: ANSWER_MAX },
    { name: "nextTopic", type: "textarea", maxLength: ANSWER_MAX },

    /* ── who (optional) ──────────────────────────────────────────────────── */
    {
      type: "row",
      fields: [
        { name: "fullName", type: "text", maxLength: FULL_NAME_MAX, admin: { width: "50%" } },
        /* No maxLength option on email in Payload; the 254 cap lives in feedback.ts. */
        { name: "email", type: "email", index: true, admin: { width: "50%" } },
      ],
    },
    {
      name: "allowQuote",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "The person agreed to be quoted by name. Never true without a name." },
    },

    /* ── bookkeeping ─────────────────────────────────────────────────────── */
    {
      name: "sessionKey",
      type: "text",
      required: true,
      index: true,
      defaultValue: DEFAULT_SESSION_KEY,
      admin: { position: "sidebar", description: "Which cohort this row belongs to — the same key as session-registrations." },
    },
    { name: "source", type: "text", defaultValue: "form", admin: { position: "sidebar" } },
  ],
};
