import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import type { Snapshot } from "@/lib/payload-schema-audit";

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
     the enum/column its migration is about. */
  const names = snapshotNames();
  const newest = names[names.length - 1] as string;
  assert.equal(newest, "20261111_120000_messages_locale_ms");

  const previous = readSnapshot(names[names.length - 2] as string);
  const current = readSnapshot(newest);

  assert.deepEqual(current.tables, previous.tables, `${newest} must not change any table`);

  const changedEnums = Object.keys(current.enums).filter(
    (key) => JSON.stringify(previous.enums[key]?.values) !== JSON.stringify(current.enums[key]?.values),
  );
  assert.deepEqual(
    changedEnums.map((key) => current.enums[key]?.name),
    ["enum_messages_locale"],
    `${newest} must only widen enum_messages_locale`,
  );
  assert.deepEqual(current.enums[changedEnums[0] as string]?.values, ["en", "ar", "ms"]);
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
