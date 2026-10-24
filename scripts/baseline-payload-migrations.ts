import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Snapshot } from "@/lib/payload-schema-audit";

/**
 * Controlled, opt-in ledger baseline for a schema created through Payload's
 * development push mode. It performs no schema DDL and never edits lead data.
 *
 * Dry-run by default. To write the migration ledger, the database owner must
 * deliberately set APPLY_PAYLOAD_MIGRATION_BASELINE=YES_ABOALZAM_OS_2026_10_24.
 */
process.env.NODE_ENV = "production";
const [{ default: config }, { getPayload }, { auditPayloadSchemaSnapshot, readPayloadSchemaState }, { sql }] = await Promise.all([
  import("../payload.config"),
  import("payload"),
  import("../lib/payload-schema-audit"),
  import("@payloadcms/db-postgres/drizzle"),
]);

const here = path.dirname(fileURLToPath(import.meta.url));
const target = JSON.parse(fs.readFileSync(path.resolve(here, "../migrations/20261024_145000_lead_pipeline.json"), "utf8")) as Snapshot;
const APPLY_TOKEN = "YES_ABOALZAM_OS_2026_10_24";

async function main() {
  const payload = await getPayload({ config });
  try {
    const state = await readPayloadSchemaState(payload);
    const audit = auditPayloadSchemaSnapshot(target, state);
    const alreadyReady =
      state.migrations.some((r) => r.name === "20260705_212937_initial") &&
      state.migrations.some((r) => r.name === "20261024_145000_lead_pipeline") &&
      !state.migrations.some((r) => r.name === "dev" && Number(r.batch) === -1);

    if (alreadyReady) {
      console.log(JSON.stringify({ status: "already-baselined", schemaExact: audit.exactSnapshot, changedDatabase: false }, null, 2));
      return;
    }

    const onlyDevMarker =
      state.migrations.length === 1 &&
      state.migrations[0]?.name === "dev" &&
      Number(state.migrations[0]?.batch) === -1;

    const preflight = {
      status: "preflight",
      schemaExact: audit.exactSnapshot,
      expectedTables: audit.expectedTables,
      expectedColumns: audit.expectedColumns,
      expectedEnums: audit.expectedEnums,
      missingTables: audit.missingTables,
      missingColumns: audit.missingColumns,
      typeMismatches: audit.typeMismatches,
      missingIndexes: audit.missingIndexes,
      missingForeignKeys: audit.missingForeignKeys,
      missingEnums: audit.missingEnums,
      enumValueMismatches: audit.enumValueMismatches,
      extraTables: audit.extraTables,
      extraColumns: audit.extraColumns,
      extraEnums: audit.extraEnums,
      migrationLedger: state.migrations,
      onlyExpectedDevMarker: onlyDevMarker,
      writesEnabled: process.env.APPLY_PAYLOAD_MIGRATION_BASELINE === APPLY_TOKEN,
    };

    if (!audit.exactSnapshot || !onlyDevMarker) {
      console.log(JSON.stringify({ ...preflight, status: "aborted", changedDatabase: false }, null, 2));
      throw new Error("Schema or migration ledger did not match the narrow baseline preconditions. No database writes were made.");
    }

    if (process.env.APPLY_PAYLOAD_MIGRATION_BASELINE !== APPLY_TOKEN) {
      console.log(JSON.stringify({
        ...preflight,
        status: "dry-run-only",
        changedDatabase: false,
        nextStep: "Review the complete schema audit and take a database backup. Only then rerun with APPLY_PAYLOAD_MIGRATION_BASELINE=" + APPLY_TOKEN,
        plannedChanges: [
          "Delete only the dev marker with batch -1",
          "Record 20260705_212937_initial in batch 1",
          "Record 20261024_145000_lead_pipeline in batch 2",
        ],
      }, null, 2));
      return;
    }

    await payload.db.drizzle.transaction(async (tx) => {
      await tx.execute(sql.raw("LOCK TABLE public.payload_migrations IN EXCLUSIVE MODE"));
      const lockedRows = await tx.execute(sql.raw("SELECT id, name, batch FROM public.payload_migrations ORDER BY id FOR UPDATE"));
      const locked = (lockedRows.rows as Array<{ id: number; name: string | null; batch: number | string | null }>)
        .map((r) => ({ id: r.id, name: r.name, batch: r.batch }));
      if (locked.length !== 1 || locked[0]?.name !== "dev" || Number(locked[0]?.batch) !== -1) {
        throw new Error("Migration ledger changed after preflight. Transaction aborted without changes.");
      }
      await tx.execute(sql.raw("DELETE FROM public.payload_migrations WHERE name = 'dev' AND batch = -1"));
      await tx.execute(sql.raw("INSERT INTO public.payload_migrations (name, batch, created_at, updated_at) VALUES ('20260705_212937_initial', 1, now(), now()), ('20261024_145000_lead_pipeline', 2, now(), now())"));
    });

    const after = await readPayloadSchemaState(payload);
    const afterAudit = auditPayloadSchemaSnapshot(target, after);
    const afterReady =
      afterAudit.exactSnapshot &&
      after.migrations.some((r) => r.name === "20260705_212937_initial" && Number(r.batch) === 1) &&
      after.migrations.some((r) => r.name === "20261024_145000_lead_pipeline" && Number(r.batch) === 2) &&
      !after.migrations.some((r) => r.name === "dev" && Number(r.batch) === -1);
    if (!afterReady) throw new Error("Ledger write completed but verification did not pass. Do not run more migrations until reviewed.");
    console.log(JSON.stringify({
      status: "baselined",
      schemaExact: afterAudit.exactSnapshot,
      migrationLedger: after.migrations,
      changedDatabase: true,
      schemaDDLExecuted: false,
      customerRowsModified: false,
    }, null, 2));
  } finally {
    await payload.destroy();
  }
}

main().catch((error: unknown) => {
  console.error("[migration-baseline] Aborted safely. No schema DDL or customer-row changes are performed by this script.");
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
