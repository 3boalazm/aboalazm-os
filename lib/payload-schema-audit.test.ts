import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import type { Snapshot } from "@/lib/payload-schema-audit";
import { migrations } from "@/migrations";

/**
 * The release gate compares the live database to the snapshots listed in
 * scripts/check-payload-schema-state.ts. When 20261111_120000_messages_locale_ms
 * widened enum_messages_locale without a snapshot, the gate kept comparing
 * against the previous snapshot and blocked a release on a database that was
 * actually correct. These tests make that class of mistake impossible to merge.
 */

const root = process.cwd();
const migrationsDir = path.join(root, "migrations");
const gateSource = readFileSync(path.join(root, "scripts/check-payload-schema-state.ts"), "utf8");

type SnapshotWithId = Snapshot & { id?: string; prevId?: string };

function snapshotNames(): string[] {
  return readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -".json".length))
    .sort();
}

function readSnapshot(name: string): SnapshotWithId {
  return JSON.parse(readFileSync(path.join(migrationsDir, `${name}.json`), "utf8")) as SnapshotWithId;
}

function gateSnapshotList(): string[] {
  const match = gateSource.match(/const SNAPSHOTS = \[([\s\S]*?)\] as const;/);
  assert.ok(match, "SNAPSHOTS array not found in check-payload-schema-state.ts");
  const block = match?.[1] ?? "";
  return [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1] as string);
}

test("every migration snapshot is audited by the release gate", () => {
  const listed = gateSnapshotList();
  for (const name of snapshotNames()) {
    assert.ok(
      listed.includes(name),
      `${name}.json exists but check-payload-schema-state.ts never audits it. Add it to SNAPSHOTS, ` +
        "otherwise the gate compares the live schema to a stale snapshot and blocks a correct release.",
    );
  }
});

test("the gate's snapshot list is in chronological order, oldest first", () => {
  const listed = gateSnapshotList();
  assert.ok(listed.length > 0, "SNAPSHOTS must not be empty");
  assert.deepEqual(listed, [...listed].sort((a, b) => a.localeCompare(b)), "SNAPSHOTS must be oldest-first");
  assert.deepEqual(listed, snapshotNames(), "SNAPSHOTS must list exactly the snapshots on disk");
});

test("each snapshot chains to the one before it", () => {
  const names = snapshotNames();
  for (let i = 1; i < names.length; i += 1) {
    const previousName = names[i - 1] as string;
    const currentNode = names[i] as string;
    const previous = readSnapshot(previousName);
    const current = readSnapshot(currentNode);
    assert.equal(
      current.prevId,
      previous.id,
      `${currentNode}.json must carry prevId equal to ${previousName}.json's id, so the chain stays coherent.`,
    );
    assert.notEqual(current.id, previous.id, `${currentNode}.json must have its own id`);
  }
});

test("a snapshot only differs from its predecessor by what its migration changes", () => {
  /* Payload's migrate:create diffs the config against the database and will
     happily fold unrelated drift into a narrowly named migration. Release
     history must stay legible, so each snapshot is checked to change exactly
     what its migration is about. The pin below is per-migration: when a new
     migration lands, extend this test with its own expected diff rather
     than loosening it. */
  const names = snapshotNames();

  /* …the ms widening changed no table and exactly one enum. */
  const msPrevious = readSnapshot("20261024_145000_lead_pipeline");
  const ms = readSnapshot("20261111_120000_messages_locale_ms");
  assert.deepEqual(ms.tables, msPrevious.tables, "20261111_120000_messages_locale_ms must not change any table");
  const msChangedEnums = Object.keys(ms.enums).filter(
    (key) => JSON.stringify(msPrevious.enums[key]?.values) !== JSON.stringify(ms.enums[key]?.values),
  );
  assert.deepEqual(
    msChangedEnums.map((key) => ms.enums[key]?.name),
    ["enum_messages_locale"],
    "20261111_120000_messages_locale_ms must only widen enum_messages_locale",
  );
  assert.deepEqual(ms.enums[msChangedEnums[0] as string]?.values, ["en", "ar", "ms"]);

  /* …and the analytics-events migration (the newest) adds exactly one table
     plus the locked-documents relation every new collection gets. */
  const newest = names[names.length - 1] as string;
  assert.equal(newest, "20261112_100000_analytics_events");
  const current = readSnapshot(newest);

  assert.deepEqual(current.enums, ms.enums, `${newest} must not change any enum`);

  const addedTables = Object.keys(current.tables).filter((key) => !(key in ms.tables));
  const removedTables = Object.keys(ms.tables).filter((key) => !(key in current.tables));
  assert.deepEqual(addedTables, ["public.analytics_events"], `${newest} must add exactly the analytics_events table`);
  assert.deepEqual(removedTables, [], `${newest} must not drop any table`);

  const changedTables = Object.keys(ms.tables).filter(
    (key) => JSON.stringify(ms.tables[key]) !== JSON.stringify(current.tables[key]),
  );
  assert.deepEqual(
    changedTables,
    ["public.payload_locked_documents_rels"],
    `${newest} may only touch payload_locked_documents_rels besides adding its table`,
  );

  const relsBefore = ms.tables["public.payload_locked_documents_rels"] as unknown as {
    columns: Record<string, unknown>;
    indexes: Record<string, unknown>;
    foreignKeys: Record<string, unknown>;
  };
  const relsAfter = current.tables["public.payload_locked_documents_rels"] as unknown as typeof relsBefore;
  assert.deepEqual(Object.keys(relsAfter.columns).filter((k) => !(k in relsBefore.columns)), ["analytics_events_id"]);
  assert.deepEqual(Object.keys(relsAfter.indexes).filter((k) => !(k in relsBefore.indexes)), [
    "payload_locked_documents_rels_analytics_events_id_idx",
  ]);
  assert.deepEqual(Object.keys(relsAfter.foreignKeys).filter((k) => !(k in relsBefore.foreignKeys)), [
    "payload_locked_documents_rels_analytics_events_fk",
  ]);
});

test("the newest snapshot and the Messages select agree with every live locale", () => {
  /* If the enum snapshot still said en/ar, a correctly migrated database would
     fail the release. If the select offered a value the enum lacks, an editor
     picking it would hit a database error. Both directions are pinned here. */
  const names = snapshotNames();
  const newest = readSnapshot(names[names.length - 1] as string);
  const messagesLocale = Object.values(newest.enums).find((e) => e.name === "enum_messages_locale");
  assert.ok(messagesLocale, "newest snapshot has no enum_messages_locale");
  assert.deepEqual(messagesLocale.values, ["en", "ar", "ms"]);

  const select = readFileSync(path.join(root, "collections/Messages.ts"), "utf8");
  const field = select.slice(select.indexOf('name: "locale"'));
  for (const value of messagesLocale.values) {
    assert.ok(field.includes(`value: "${value}"`), `Messages.locale select is missing "${value}"`);
  }
});

test("the migration that widens the enum is idempotent", () => {
  /* Production may already have 'ms' from a hand ALTER, or not have it at all.
     Either way the migration must be safe, so it may only ADD VALUE IF NOT
     EXISTS and must never rewrite rows. */
  const source = readFileSync(
    path.join(migrationsDir, "20261111_120000_messages_locale_ms.ts"),
    "utf8",
  );
  assert.match(source, /ADD VALUE IF NOT EXISTS 'ms'/);
  assert.doesNotMatch(source, /UPDATE\s+"?messages"?/i, "the migration must not rewrite customer rows");
  assert.doesNotMatch(source, /DROP TYPE/i, "the migration must not drop the enum");
});

test("every committed migration is exported in chronological order by migrations/index.ts", () => {
  const names = snapshotNames();
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts")
    .map((file) => file.slice(0, -".ts".length))
    .sort();
  assert.deepEqual(migrationFiles, names, "migration .ts files and .json snapshots on disk must match 1:1");
  assert.deepEqual(
    migrations.map((m) => m.name),
    names,
    "migrations/index.ts must export every committed migration in oldest-first order",
  );
});

test("production build migration runner stays production-only, locked, and non-interactive", () => {
  const runner = readFileSync(path.join(root, "scripts/run-payload-migrations.ts"), "utf8");
  assert.match(runner, /VERCEL_ENV !== "production"/, "must skip non-production Vercel envs so Previews never mutate shared DB");
  assert.match(runner, /NODE_ENV\s*=\s*"production"/, "must force NODE_ENV=production to keep push disabled");
  assert.match(runner, /PAYLOAD_MIGRATING\s*=\s*"true"/, "must set PAYLOAD_MIGRATING=true");
  assert.match(runner, /pg_advisory_xact_lock/, "must serialize overlapping deploys with a transaction-scoped advisory lock");
  assert.match(runner, /batch\)\s*===\s*-1/, "must refuse dev-push markers cleanly instead of prompting");

  const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")) as {
    scripts: Record<string, string>;
  };
  const buildScript = pkg.scripts.build ?? "";
  assert.equal(pkg.scripts["db:migrate:ci"], "node --import tsx scripts/run-payload-migrations.ts --vercel-production-only");
  const migrateIdx = buildScript.indexOf("npm run db:migrate:ci");
  const nextBuildIdx = buildScript.indexOf("next build");
  const gateIdx = buildScript.indexOf("npm run check:db-schema");
  assert.ok(migrateIdx > -1, "build script must invoke db:migrate:ci");
  assert.ok(nextBuildIdx > migrateIdx, "db:migrate:ci must run before next build");
  assert.ok(gateIdx > nextBuildIdx, "check:db-schema must verify schema state after next build");
});
