import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { AnalyticsEvents } from "../collections/AnalyticsEvents";
import { parseEventPayload, type EventRecord } from "./analytics-events";
import { ANALYTICS_COLUMNS, INSERT_SQL, isStaleConnectionError, runInsert, toRow } from "./analytics-store";

/**
 * The beacon writes `analytics_events` with a hand-listed INSERT (lib/analytics-store.ts) instead of booting Payload
 * for every cold instance. These tests are what keep that list honest: the collection, the migration and the
 * sanitizer's record are the three places that can change underneath it.
 */
type FieldLike = { name?: string; fields?: FieldLike[] };
const flatten = (fields: FieldLike[]): string[] =>
  fields.flatMap((f) => (f.name ? [f.name] : f.fields ? flatten(f.fields) : []));
const snake = (s: string) => s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
const columns = ANALYTICS_COLUMNS.map((c) => c.column);

const full: EventRecord = {
  name: "pageview",
  sessionId: "s-1",
  path: "/en/work",
  locale: "en",
  referrerHost: "linkedin.com",
  utmSource: "li",
  utmMedium: "social",
  utmCampaign: "nov",
  device: "mobile",
  props: { a: "1" },
};

test("the INSERT writes exactly the columns of the analytics-events collection", () => {
  const fromCollection = flatten(AnalyticsEvents.fields as FieldLike[]).map(snake).sort();
  assert.deepEqual([...columns].sort(), fromCollection, "ANALYTICS_COLUMNS drifted from collections/AnalyticsEvents.ts");
});

test("the INSERT matches the migration's table, and the timestamps can be left to their defaults", () => {
  const migration = readFileSync(join(process.cwd(), "migrations/20261112_100000_analytics_events.ts"), "utf8");
  const body = migration.match(/CREATE TABLE IF NOT EXISTS "analytics_events" \(([\s\S]*?)\n\s*\);/)?.[1] ?? "";
  const ddl = new Map<string, string>([...body.matchAll(/^\s*"(\w+)"\s+(.+?),?\s*$/gm)].map((m): [string, string] => [m[1] ?? "", m[2] ?? ""]));
  assert.ok(ddl.size > 0, "could not read the CREATE TABLE statement");

  const written = [...ddl.keys()].filter((c) => !["id", "created_at", "updated_at"].includes(c)).sort();
  assert.deepEqual([...columns].sort(), written, "ANALYTICS_COLUMNS drifted from the analytics_events migration");
  assert.match(ddl.get("created_at") ?? "", /DEFAULT now\(\)/, "created_at lost its default; the INSERT does not set it");
  assert.match(ddl.get("updated_at") ?? "", /DEFAULT now\(\)/, "updated_at lost its default; the INSERT does not set it");
  assert.match(ddl.get("props") ?? "", /^jsonb/, "props is no longer jsonb; the INSERT casts $n::jsonb");
});

test("the INSERT lists exactly the fields the sanitizer produces", () => {
  const parsed = parseEventPayload({ name: "pageview" }, null);
  assert.ok(parsed.ok);
  assert.deepEqual(
    ANALYTICS_COLUMNS.map((c) => c.field).sort(),
    Object.keys(parsed.record).sort(),
    "EventRecord and ANALYTICS_COLUMNS disagree",
  );
});

test("INSERT_SQL has one numbered placeholder per column and never interpolates a value", () => {
  const placeholders = INSERT_SQL.match(/\$\d+/g) ?? [];
  assert.deepEqual(placeholders, columns.map((_, i) => `$${i + 1}`));
  assert.match(INSERT_SQL, /\$10::jsonb\)$/);
  assert.doesNotMatch(INSERT_SQL, /sessionId|linkedin|\/en\//);
});

test("toRow maps a record in column order, props as JSON text, missing values as null", () => {
  assert.deepEqual(toRow(full), ["pageview", "s-1", "/en/work", "en", "linkedin.com", "li", "social", "nov", "mobile", '{"a":"1"}']);
  const sparse = toRow({ ...full, sessionId: null, path: null, locale: null, referrerHost: null, utmSource: null, utmMedium: null, utmCampaign: null, device: null, props: {} });
  assert.deepEqual(sparse, ["pageview", null, null, null, null, null, null, null, null, "{}"]);
});

test("only a connection that was already dead counts as stale", () => {
  const reset = Object.assign(new Error("read ECONNRESET"), { code: "ECONNRESET" });
  assert.equal(isStaleConnectionError(reset), true);
  assert.equal(isStaleConnectionError(new Error("Connection terminated unexpectedly")), true);
  assert.equal(isStaleConnectionError(new Error("Client has encountered a connection error and is not queryable")), true);
  assert.equal(isStaleConnectionError(Object.assign(new Error('relation "analytics_events" does not exist'), { code: "42P01" })), false);
  assert.equal(isStaleConnectionError(new Error("timeout exceeded when trying to connect")), false);
  assert.equal(isStaleConnectionError("ECONNRESET"), false);
  assert.equal(isStaleConnectionError(null), false);
});

test("a stale connection is retried once on a fresh one; any other failure is thrown immediately", async () => {
  const stale = new Error("Connection terminated unexpectedly");
  const calls: Array<[string, Array<string | null>]> = [];

  await runInsert(async (text, values) => {
    calls.push([text, values]);
    if (calls.length === 1) throw stale;
  }, full);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0], calls[1], "the retry must send the same row");
  assert.equal(calls[0]?.[0], INSERT_SQL);

  let other = 0;
  await assert.rejects(
    runInsert(async () => {
      other += 1;
      throw Object.assign(new Error("boom"), { code: "42P01" });
    }, full),
    /boom/,
  );
  assert.equal(other, 1, "a real failure must not be retried");

  let twice = 0;
  await assert.rejects(
    runInsert(async () => {
      twice += 1;
      throw stale;
    }, full),
    /terminated/,
  );
  assert.equal(twice, 2, "a second stale failure is thrown, never looped");
});
