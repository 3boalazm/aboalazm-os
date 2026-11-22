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

  /* …and the analytics-events migration adds exactly one table plus the
     locked-documents relation every new collection gets. */
  const analytics = readSnapshot("20261112_100000_analytics_events");

  assert.deepEqual(analytics.enums, ms.enums, "20261112_100000_analytics_events must not change any enum");

  const addedTables = Object.keys(analytics.tables).filter((key) => !(key in ms.tables));
  const removedTables = Object.keys(ms.tables).filter((key) => !(key in analytics.tables));
  assert.deepEqual(addedTables, ["public.analytics_events"], "20261112_100000_analytics_events must add exactly the analytics_events table");
  assert.deepEqual(removedTables, [], "20261112_100000_analytics_events must not drop any table");

  const changedTables = Object.keys(ms.tables).filter(
    (key) => JSON.stringify(ms.tables[key]) !== JSON.stringify(analytics.tables[key]),
  );
  assert.deepEqual(
    changedTables,
    ["public.payload_locked_documents_rels"],
    "20261112_100000_analytics_events may only touch payload_locked_documents_rels besides adding its table",
  );

  const relsBefore = ms.tables["public.payload_locked_documents_rels"] as unknown as {
    columns: Record<string, unknown>;
    indexes: Record<string, unknown>;
    foreignKeys: Record<string, unknown>;
  };
  const relsAfter = analytics.tables["public.payload_locked_documents_rels"] as unknown as typeof relsBefore;
  assert.deepEqual(Object.keys(relsAfter.columns).filter((k) => !(k in relsBefore.columns)), ["analytics_events_id"]);
  assert.deepEqual(Object.keys(relsAfter.indexes).filter((k) => !(k in relsBefore.indexes)), [
    "payload_locked_documents_rels_analytics_events_id_idx",
  ]);
  assert.deepEqual(Object.keys(relsAfter.foreignKeys).filter((k) => !(k in relsBefore.foreignKeys)), [
    "payload_locked_documents_rels_analytics_events_fk",
  ]);
});

test("the session-registrations snapshot adds exactly its three tables and six enums", () => {
  /* 20261119_130000_session_registrations creates the pre-session assessment
     store (collections/SessionRegistrations.ts + SessionFiles.ts). Pinned the
     same way as every other migration: the snapshot may add the registration
     table, its `session_registrations_texts` table for the multi-answer
     `goals` field (Payload gives every hasMany text field one), the CV upload
     table, the six select enums, and the two locked-documents relations —
     nothing else. Written by hand, so a typo here is a broken release gate;
     this test is what catches it without a database. */
  const names = snapshotNames();
  const newest = "20261119_130000_session_registrations";
  assert.ok(names.includes(newest), "the session-registrations snapshot must still be on disk");

  const previous = readSnapshot("20261112_100000_analytics_events");
  const current = readSnapshot(newest);

  const addedTables = Object.keys(current.tables)
    .filter((key) => !(key in previous.tables))
    .sort();
  assert.deepEqual(addedTables, ["public.session_files", "public.session_registrations", "public.session_registrations_texts"]);
  assert.deepEqual(Object.keys(previous.tables).filter((key) => !(key in current.tables)), []);

  const expectedEnums = [
    "enum_session_registrations_year_of_study",
    "enum_session_registrations_linkedin_status",
    "enum_session_registrations_applied_before",
    "enum_session_registrations_cv_status",
    "enum_session_registrations_follow_up",
    "enum_session_registrations_attendance",
  ];
  const addedEnums = Object.keys(current.enums).filter((key) => !(key in previous.enums));
  assert.deepEqual(addedEnums, expectedEnums.map((name) => `public.${name}`));
  for (const name of expectedEnums) {
    const snapshotValues = current.enums[`public.${name}`]?.values ?? [];
    const collectionSource = readFileSync(path.join(root, "collections/SessionRegistrations.ts"), "utf8");
    assert.ok(
      collectionSource.includes("payloadOptions(") && snapshotValues.length > 0,
      `${name} must carry the option values defined in features/linkedin-session/assessment.ts`,
    );
  }
  /* The enum vocabulary is generated from the questionnaire, so a value the
     form can send but the database cannot store is a write-time failure. */
  assert.equal(
    current.enums["public.enum_session_registrations_goal"],
    undefined,
    "goals is a multi-answer stored in session_registrations_texts — it must not have an enum column",
  );
  const texts = current.tables["public.session_registrations_texts"] as unknown as
    | { columns: Record<string, { notNull?: boolean }>; foreignKeys: Record<string, { onDelete?: string }> }
    | undefined;
  assert.ok(texts, "session_registrations_texts must exist in the snapshot — Payload gives every hasMany text field one");
  assert.deepEqual(Object.keys(texts.columns), ["id", "order", "parent_id", "path", "text"]);
  assert.equal(texts.columns.parent_id?.notNull, true);
  assert.deepEqual(Object.keys(texts.foreignKeys), ["session_registrations_texts_parent_fk"]);
  assert.equal(texts.foreignKeys.session_registrations_texts_parent_fk?.onDelete, "cascade", "deleting a registration must delete its chosen goals");
  assert.deepEqual(current.enums["public.enum_session_registrations_linkedin_status"]?.values, [
    "active",
    "inactive",
    "incomplete",
    "none",
  ]);

  const changedTables = Object.keys(previous.tables).filter(
    (key) => JSON.stringify(previous.tables[key]) !== JSON.stringify(current.tables[key]),
  );
  assert.deepEqual(changedTables, ["public.payload_locked_documents_rels"]);

  const relsBefore = previous.tables["public.payload_locked_documents_rels"] as unknown as {
    columns: Record<string, unknown>;
    indexes: Record<string, unknown>;
    foreignKeys: Record<string, unknown>;
  };
  const relsAfter = current.tables["public.payload_locked_documents_rels"] as unknown as typeof relsBefore;
  assert.deepEqual(Object.keys(relsAfter.columns).filter((k) => !(k in relsBefore.columns)), [
    "session_registrations_id",
    "session_files_id",
  ]);
  assert.deepEqual(Object.keys(relsAfter.indexes).filter((k) => !(k in relsBefore.indexes)), [
    "payload_locked_documents_rels_session_registrations_id_idx",
    "payload_locked_documents_rels_session_files_id_idx",
  ]);
  assert.deepEqual(Object.keys(relsAfter.foreignKeys).filter((k) => !(k in relsBefore.foreignKeys)), [
    "payload_locked_documents_rels_session_registrations_fk",
    "payload_locked_documents_rels_session_files_fk",
  ]);
});

test("the session migration SQL creates exactly what its snapshot describes", () => {
  /* The snapshot is hand-written from the SQL, and the release gate compares
     the snapshot to the live database — so the two must name the same objects.
     Checking the strings against each other is cheap and needs no database.
     The enum value lists are checked against the questionnaire itself, because
     that is the file that decides them. */
  const migration = readFileSync(path.join(root, "migrations/20261119_130000_session_registrations.ts"), "utf8");
  const assessment = readFileSync(path.join(root, "features/linkedin-session/assessment.ts"), "utf8");
  const current = readSnapshot("20261119_130000_session_registrations");

  for (const table of Object.values(current.tables)) {
    if (!/^session_/.test(table.name)) continue;
    assert.ok(migration.includes(`CREATE TABLE IF NOT EXISTS "${table.name}"`), `${table.name} is in the snapshot but not created by the migration`);
    for (const index of Object.keys(table.indexes ?? {})) {
      assert.ok(migration.includes(index), `${index} is in the snapshot but never created`);
    }
  }
  const enumsBlock = /const ENUMS: Record<string, string\[\]> = \{([\s\S]*?)\n\};/.exec(migration)?.[1] ?? "";
  assert.ok(enumsBlock, "the migration must declare its enums in a single ENUMS map");
  const declared = new Map(
    [...enumsBlock.matchAll(/(\w+):\s*\[([^\]]*)\]/g)].map((m) => [
      m[1] as string,
      [...(m[2] as string).matchAll(/["']([^"']+)["']/g)].map((v) => v[1] as string),
    ]),
  );
  const snapshotSessionEnums = Object.entries(current.enums).filter(([key]) => key.includes("session_registrations"));
  assert.equal(declared.size, snapshotSessionEnums.length, "the migration creates a different number of enums than the snapshot describes");
  for (const [, entry] of snapshotSessionEnums) {
    assert.deepEqual(declared.get(entry.name), entry.values, `${entry.name}: migration ENUMS and the snapshot must list the same values in the same order`);
    /* down() drops every key of the map, so one entry covers create and drop. */
    assert.ok(migration.includes("DROP TYPE IF EXISTS"), `${entry.name} is created but never dropped by down()`);
  }
  /* The questionnaire owns the vocabulary: every value in the enum must be an
     option the form can actually send, and vice versa. */
  for (const [name, values] of declared) {
    for (const value of values) {
      assert.ok(assessment.includes(`value: "${value}"`), `${name} allows "${value}", which the questionnaire never offers`);
    }
  }
});

test("the session-feedback snapshot adds exactly its two tables and three enums", () => {
  /* 20261122_180000_session_feedback creates the after-session store
     (collections/SessionFeedback.ts): the feedback table, its
     `session_feedback_texts` table for the multi-answer `mostUseful` field,
     three select enums, and the one locked-documents relation. Additive only:
     no existing table may change except payload_locked_documents_rels. */
  const names = snapshotNames();
  const newest = "20261122_180000_session_feedback";
  assert.ok(names.includes(newest), "the session-feedback snapshot must be on disk");
  assert.equal(names[names.length - 1], newest, "the session-feedback snapshot is the newest one");

  const previous = readSnapshot("20261119_130000_session_registrations");
  const current = readSnapshot(newest);

  const addedTables = Object.keys(current.tables).filter((key) => !(key in previous.tables)).sort();
  assert.deepEqual(addedTables, ["public.session_feedback", "public.session_feedback_texts"]);
  assert.deepEqual(Object.keys(previous.tables).filter((key) => !(key in current.tables)), [], "no table may be dropped");

  const expectedEnums = ["enum_session_feedback_pace", "enum_session_feedback_recommend", "enum_session_feedback_next_step"];
  assert.deepEqual(
    Object.keys(current.enums).filter((key) => !(key in previous.enums)),
    expectedEnums.map((name) => `public.${name}`),
  );
  for (const key of Object.keys(previous.enums)) {
    assert.deepEqual(current.enums[key], previous.enums[key], `${key} must not change`);
  }

  const changedTables = Object.keys(previous.tables).filter(
    (key) => JSON.stringify(previous.tables[key]) !== JSON.stringify(current.tables[key]),
  );
  assert.deepEqual(changedTables, ["public.payload_locked_documents_rels"]);

  const relsBefore = previous.tables["public.payload_locked_documents_rels"] as unknown as {
    columns: Record<string, unknown>;
    indexes: Record<string, unknown>;
    foreignKeys: Record<string, unknown>;
  };
  const relsAfter = current.tables["public.payload_locked_documents_rels"] as unknown as typeof relsBefore;
  assert.deepEqual(Object.keys(relsAfter.columns).filter((k) => !(k in relsBefore.columns)), ["session_feedback_id"]);
  assert.deepEqual(Object.keys(relsAfter.indexes).filter((k) => !(k in relsBefore.indexes)), [
    "payload_locked_documents_rels_session_feedback_id_idx",
  ]);
  assert.deepEqual(Object.keys(relsAfter.foreignKeys).filter((k) => !(k in relsBefore.foreignKeys)), [
    "payload_locked_documents_rels_session_feedback_fk",
  ]);

  /* The scales are numbers, not enums; the multi-answer has no enum column. */
  const feedback = current.tables["public.session_feedback"] as unknown as { columns: Record<string, { type?: string; notNull?: boolean }> };
  for (const column of ["rating", "confidence_before", "confidence_after"]) {
    assert.equal(feedback.columns[column]?.type, "numeric", `${column} is a Payload number`);
    assert.equal(feedback.columns[column]?.notNull, true);
  }
  assert.equal(current.enums["public.enum_session_feedback_most_useful"], undefined);
  const texts = current.tables["public.session_feedback_texts"] as unknown as { foreignKeys: Record<string, { onDelete?: string }> };
  assert.equal(texts.foreignKeys.session_feedback_texts_parent_fk?.onDelete, "cascade", "deleting a feedback row must delete its chosen parts");
});

test("the feedback migration SQL creates exactly what its snapshot describes, with the questionnaire's values", () => {
  const migration = readFileSync(path.join(root, "migrations/20261122_180000_session_feedback.ts"), "utf8");
  const feedback = readFileSync(path.join(root, "features/linkedin-session/feedback.ts"), "utf8");
  const current = readSnapshot("20261122_180000_session_feedback");

  for (const table of Object.values(current.tables)) {
    if (!/^session_feedback/.test(table.name)) continue;
    assert.ok(migration.includes(`CREATE TABLE IF NOT EXISTS "${table.name}"`), `${table.name} is in the snapshot but not created by the migration`);
    for (const index of Object.keys(table.indexes ?? {})) {
      assert.ok(migration.includes(index), `${index} is in the snapshot but never created`);
    }
    for (const column of Object.keys(table.columns ?? {})) {
      assert.ok(migration.includes(`"${column}"`), `${table.name}.${column} is in the snapshot but never created`);
    }
  }
  const enumsBlock = /const ENUMS: Record<string, string\[\]> = \{([\s\S]*?)\n\};/.exec(migration)?.[1] ?? "";
  assert.ok(enumsBlock, "the migration must declare its enums in a single ENUMS map");
  const declared = new Map(
    [...enumsBlock.matchAll(/(\w+):\s*\[([^\]]*)\]/g)].map((m) => [
      m[1] as string,
      [...(m[2] as string).matchAll(/["']([^"']+)["']/g)].map((v) => v[1] as string),
    ]),
  );
  const snapshotEnums = Object.values(current.enums).filter((entry) => entry.name.startsWith("enum_session_feedback_"));
  assert.equal(declared.size, snapshotEnums.length, "the migration creates a different number of enums than the snapshot describes");
  for (const entry of snapshotEnums) {
    assert.deepEqual(declared.get(entry.name), entry.values, `${entry.name}: migration ENUMS and the snapshot must list the same values in the same order`);
  }
  assert.ok(migration.includes("DROP TYPE IF EXISTS"), "down() must drop the enums");
  /* The questionnaire owns the vocabulary: every enum value must be an option the form can send. */
  for (const [name, values] of declared) {
    for (const value of values) {
      assert.ok(feedback.includes(`value: "${value}"`), `${name} allows "${value}", which the questionnaire never offers`);
    }
  }
});

test("the Messages select offers exactly the live locales, all of which the newest enum accepts", () => {
  /* The database enum keeps the legacy 'ms' value (historical rows may hold it;
     Postgres cannot drop enum values in place), so the enum may be a superset
     of the editor's options. Every option must still be a value the enum
     accepts, and the options must be exactly the live locales. */
  const names = snapshotNames();
  const newest = readSnapshot(names[names.length - 1] as string);
  const messagesLocale = Object.values(newest.enums).find((e) => e.name === "enum_messages_locale");
  assert.ok(messagesLocale, "newest snapshot has no enum_messages_locale");
  assert.deepEqual(messagesLocale.values, ["en", "ar", "ms"]);

  const select = readFileSync(path.join(root, "collections/Messages.ts"), "utf8");
  const field = select.slice(select.indexOf('name: "locale"'));
  const offered = [...field.slice(0, field.indexOf("admin:")).matchAll(/value: "(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(offered, ["en", "ar"], "Messages.locale must offer exactly the live locales");
  for (const value of offered) {
    assert.ok(messagesLocale.values.includes(value), `Messages.locale offers "${value}" which the enum lacks`);
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
