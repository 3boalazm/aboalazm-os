import { Pool } from "pg";
import type { EventRecord } from "@/lib/analytics-events";

/**
 * FIRST-PARTY ANALYTICS STORE — one parameterised INSERT, no CMS.
 *
 * CPU GUARD (ARCHITECTURE.md rule 9). The beacon fires once per page view, so `POST /api/track` is the one
 * function every visit runs. Writing the row through Payload's Local API meant loading and starting the whole CMS in
 * every cold instance (the CMS config, the editor, the database adapter and its schema) plus a transaction
 * (BEGIN / INSERT / COMMIT) per event, to store ten short strings. On Vercel Hobby that is Fluid Active CPU shared by
 * the whole team. Here the route needs only `pg` and the sanitizer.
 *
 * The table stays Payload's: it is created by migrations/20261112_100000_analytics_events.ts, described by
 * collections/AnalyticsEvents.ts and read by the Studio through the Local API. `ANALYTICS_COLUMNS` is the single
 * list this module writes, and lib/analytics-store.test.ts fails the build if it drifts from the collection, the
 * migration or the sanitizer's record. `created_at` and `updated_at` come from the column defaults (`now()`).
 *
 * The connection string and TLS behaviour are exactly those of Payload's pool (`new pg.Pool({ connectionString })`
 * on DATABASE_URI), so nothing about the database settings changes.
 */
export const ANALYTICS_COLUMNS = [
  { column: "name", field: "name" },
  { column: "session_id", field: "sessionId" },
  { column: "path", field: "path" },
  { column: "locale", field: "locale" },
  { column: "referrer_host", field: "referrerHost" },
  { column: "utm_source", field: "utmSource" },
  { column: "utm_medium", field: "utmMedium" },
  { column: "utm_campaign", field: "utmCampaign" },
  { column: "device", field: "device" },
  { column: "props", field: "props" },
] as const satisfies ReadonlyArray<{ column: string; field: keyof EventRecord }>;

export const INSERT_SQL =
  `INSERT INTO "analytics_events" (${ANALYTICS_COLUMNS.map((c) => `"${c.column}"`).join(", ")}) ` +
  `VALUES (${ANALYTICS_COLUMNS.map((c, i) => (c.field === "props" ? `$${i + 1}::jsonb` : `$${i + 1}`)).join(", ")})`;

/** Positional parameters for `INSERT_SQL`, in `ANALYTICS_COLUMNS` order. `props` travels as JSON text. */
export function toRow(record: EventRecord): Array<string | null> {
  return ANALYTICS_COLUMNS.map(({ field }) => {
    if (field === "props") return JSON.stringify(record.props ?? {});
    return record[field] ?? null;
  });
}

/**
 * True when the pooled connection was already dead before the query ran (the database or its pooler closed an idle
 * socket while the instance was frozen). The pool drops that client, so one retry on a fresh connection is safe.
 */
export function isStaleConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as NodeJS.ErrnoException).code;
  if (code === "ECONNRESET" || code === "EPIPE") return true;
  return /connection terminated unexpectedly|not queryable/i.test(error.message);
}

let pool: Pool | undefined;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URI || "",
      // A beacon is a single short INSERT: two sockets per instance is plenty and keeps a busy site from holding
      // many connections open against the database's connection limit.
      max: 2,
      idleTimeoutMillis: 10_000,
      // Bound the time a stuck database can keep a function alive; the visitor never waits for this either way.
      connectionTimeoutMillis: 3_000,
      query_timeout: 4_000,
    });
    // An idle client can be closed by the server at any moment. Without a listener that 'error' event is an
    // uncaught exception that takes the whole instance down; with one, the pool just discards the client.
    pool.on("error", () => {});
  }
  return pool;
}

type Query = (text: string, values: Array<string | null>) => Promise<unknown>;

/** The write itself, with the pool injected so the retry rule can be tested without a database. */
export async function runInsert(query: Query, record: EventRecord): Promise<void> {
  const values = toRow(record);
  try {
    await query(INSERT_SQL, values);
  } catch (error) {
    if (!isStaleConnectionError(error)) throw error;
    // The first attempt never reached a live server, so this is not a duplicate; a second failure is thrown.
    await query(INSERT_SQL, values);
  }
}

/** Store one sanitized event. Throws on failure; the route decides that a failed write must stay invisible to the visitor. */
export function insertAnalyticsEvent(record: EventRecord): Promise<void> {
  return runInsert((text, values) => getPool().query(text, values), record);
}
