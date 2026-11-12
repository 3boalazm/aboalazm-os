import type { CollectionConfig } from "payload";

/**
 * ANALYTICS EVENTS — the first-party collector's store (P2).
 *
 * One row per browser event emitted through lib/analytics.ts and accepted
 * by app/api/track/route.ts. The route is the only writer in practice: it
 * validates against lib/analytics-events.ts (allowlisted names, sanitized
 * paths, host-only referrers, no PII) and writes through the Local API.
 *
 * `name` is deliberately a plain text field, NOT a select. The event
 * taxonomy lives in code (docs/EVENTS.md) and grows by editing a union
 * type; making it a Postgres enum would turn every new event into a
 * schema migration and a release-gate event. Validation happens at the
 * route boundary instead — an unknown name is rejected with a 422 and
 * never reaches this table.
 *
 * Access mirrors ResourceLeads: the public REST create endpoint stays
 * closed (only signed-in users), because an open one would let anyone
 * POST straight to /api/analytics-events and skip the sanitizer and the
 * rate limit. Reads are admin-only — this is operational data, and the
 * Studio console reads it with the operator's own session
 * (overrideAccess: false).
 */
export const AnalyticsEvents: CollectionConfig = {
  slug: "analytics-events",
  admin: {
    group: "System",
    useAsTitle: "name",
    description:
      "First-party browser events collected by /api/track. Written only by that route after sanitization; see lib/analytics-events.ts for the privacy contract.",
    defaultColumns: ["name", "path", "locale", "createdAt"],
    listSearchableFields: ["name", "path"],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true, index: true, admin: { description: "Allowlisted event name from docs/EVENTS.md, or pageview." } },
    { name: "sessionId", type: "text", index: true, admin: { description: "Random per-tab-session id from sessionStorage. Identifies a session, never a person." } },
    { name: "path", type: "text", admin: { description: "Local path only — no host, no query string." } },
    { name: "locale", type: "text" },
    { name: "referrerHost", type: "text", admin: { description: "Referrer host only; the full referring URL is never stored." } },
    {
      type: "row",
      fields: [
        { name: "utmSource", type: "text", admin: { width: "33%" } },
        { name: "utmMedium", type: "text", admin: { width: "33%" } },
        { name: "utmCampaign", type: "text", admin: { width: "34%" } },
      ],
    },
    { name: "device", type: "text", admin: { description: "Coarse class derived from the user-agent at ingest: mobile / tablet / desktop. The UA string itself is not stored." } },
    { name: "props", type: "json", admin: { description: "Sanitized contextual properties. Emails, URLs and over-length values are dropped at ingest." } },
  ],
};
