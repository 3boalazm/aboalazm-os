import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Force production semantics before loading Payload so this diagnostic cannot
 * trigger development-time Drizzle push against a shared database.
 */
process.env.NODE_ENV = "production";
const [{ default: config }, { getPayload }, { sql }] = await Promise.all([
  import("../payload.config"),
  import("payload"),
  import("@payloadcms/db-postgres/drizzle"),
]);

type Column = { name: string; type: string };
type Index = { name: string };
type ForeignKey = { name: string };
type Snapshot = {
  tables: Record<string, {
    name: string;
    columns: Record<string, Column>;
    indexes?: Record<string, Index>;
    foreignKeys?: Record<string, ForeignKey>;
  }>;
  enums: Record<string, { name: string; schema: string; values: string[] }>;
};
type ActualColumn = { table_name: string; column_name: string; udt_name: string };

/** Metadata only. Never prints credentials, hosts, database names or customer rows. */
const here = path.dirname(fileURLToPath(import.meta.url));
const baseline = JSON.parse(fs.readFileSync(path.resolve(here, "../migrations/20260705_212937_initial.json"), "utf8")) as Snapshot;
const leadPipeline = JSON.parse(fs.readFileSync(path.resolve(here, "../migrations/20261024_145000_lead_pipeline.json"), "utf8")) as Snapshot;

function expectedUdt(type: string): string {
  if (type === "serial" || type === "integer") return "int4";
  if (type === "boolean") return "bool";
  if (type === "timestamp(3) with time zone") return "timestamptz";
  return type;
}

async function main() {
  const payload = await getPayload({ config });
  try {
    const [tableRows, columnRows, indexRows, fkRows, enumRows, migrationRows] = await Promise.all([
      payload.db.drizzle.execute(sql.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'")),
      payload.db.drizzle.execute(sql.raw("SELECT table_name, column_name, udt_name FROM information_schema.columns WHERE table_schema = 'public'")),
      payload.db.drizzle.execute(sql.raw("SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public'")),
      payload.db.drizzle.execute(sql.raw("SELECT table_name, constraint_name FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND constraint_type = 'FOREIGN KEY'")),
      payload.db.drizzle.execute(sql.raw("SELECT t.typname AS enum_name, e.enumlabel AS label, e.enumsortorder AS sort_order FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace JOIN pg_enum e ON e.enumtypid = t.oid WHERE n.nspname = 'public' ORDER BY t.typname, e.enumsortorder")),
      payload.db.drizzle.execute(sql.raw("SELECT id, name, batch FROM public.payload_migrations ORDER BY id")),
    ]);

    const tables = new Set((tableRows.rows as Array<{ table_name: string }>).map((r) => r.table_name));
    const columns = new Map((columnRows.rows as ActualColumn[]).map((r) => ["public." + r.table_name + "." + r.column_name, r.udt_name] as const));
    const indexes = new Set((indexRows.rows as Array<{ tablename: string; indexname: string }>).map((r) => r.tablename + "." + r.indexname));
    const foreignKeys = new Set((fkRows.rows as Array<{ table_name: string; constraint_name: string }>).map((r) => r.table_name + "." + r.constraint_name));
    const enums = new Map<string, string[]>();
    for (const r of enumRows.rows as Array<{ enum_name: string; label: string }>) {
      const values = enums.get(r.enum_name) ?? [];
      values.push(r.label);
      enums.set(r.enum_name, values);
    }
    const actualTableNames = [...tables].sort();

    function auditSnapshot(snapshot: Snapshot) {
      const expectedTableNames = Object.values(snapshot.tables).map((t) => t.name).sort();
      const missingTables = expectedTableNames.filter((name) => !tables.has(name));
      const extraTables = actualTableNames.filter((name) => !expectedTableNames.includes(name));
      const expectedColumnKeys = new Set<string>();
      const missingColumns: string[] = [];
      const typeMismatches: Array<{ table: string; column: string; expected: string; actual: string }> = [];
      const missingIndexes: string[] = [];
      const missingForeignKeys: string[] = [];

      for (const [tableKey, table] of Object.entries(snapshot.tables)) {
        const tableName = tableKey.split(".").at(-1) ?? table.name;
        for (const column of Object.values(table.columns)) {
          const key = tableKey + "." + column.name;
          expectedColumnKeys.add(key);
          const actual = columns.get(key);
          if (!actual) { missingColumns.push(tableName + "." + column.name); continue; }
          const expected = expectedUdt(column.type);
          if (expected !== actual) typeMismatches.push({ table: tableName, column: column.name, expected, actual });
        }
        for (const index of Object.values(table.indexes ?? {})) {
          if (!indexes.has(tableName + "." + index.name)) missingIndexes.push(tableName + "." + index.name);
        }
        for (const fk of Object.values(table.foreignKeys ?? {})) {
          if (!foreignKeys.has(tableName + "." + fk.name)) missingForeignKeys.push(tableName + "." + fk.name);
        }
      }

      const extraColumns = [...columns.keys()].filter((key) => key.startsWith("public.") && !expectedColumnKeys.has(key));
      const missingEnums: string[] = [];
      const enumValueMismatches: Array<{ name: string; expected: string[]; actual: string[] }> = [];
      for (const expectedEnum of Object.values(snapshot.enums)) {
        const actual = enums.get(expectedEnum.name);
        if (!actual) { missingEnums.push(expectedEnum.name); continue; }
        if (JSON.stringify(actual) !== JSON.stringify(expectedEnum.values)) {
          enumValueMismatches.push({ name: expectedEnum.name, expected: expectedEnum.values, actual });
        }
      }
      const expectedEnumNames = new Set(Object.values(snapshot.enums).map((e) => e.name));
      const extraEnums = [...enums.keys()].filter((name) => !expectedEnumNames.has(name));
      const containsSnapshot = missingTables.length === 0 && missingColumns.length === 0 && typeMismatches.length === 0 && missingIndexes.length === 0 && missingForeignKeys.length === 0 && missingEnums.length === 0 && enumValueMismatches.length === 0;
      const exactSnapshot = containsSnapshot && extraTables.length === 0 && extraColumns.length === 0 && extraEnums.length === 0;
      return {
        expectedTables: expectedTableNames.length,
        expectedColumns: expectedColumnKeys.size,
        expectedEnums: expectedEnumNames.size,
        containsSnapshot,
        exactSnapshot,
        missingTables: missingTables.slice(0, 40),
        extraTables: extraTables.slice(0, 40),
        missingColumns: missingColumns.slice(0, 60),
        extraColumns: extraColumns.slice(0, 60),
        typeMismatches: typeMismatches.slice(0, 40),
        missingIndexes: missingIndexes.slice(0, 60),
        missingForeignKeys: missingForeignKeys.slice(0, 60),
        missingEnums: missingEnums.slice(0, 40),
        enumValueMismatches: enumValueMismatches.slice(0, 40),
        extraEnums: extraEnums.slice(0, 40),
      };
    }

    const baselineAudit = auditSnapshot(baseline);
    const leadAudit = auditSnapshot(leadPipeline);
    const recordedMigrations = (migrationRows.rows as Array<{ id: number; name: string | null; batch: number | string | null }>).map((r) => ({ id: r.id, name: r.name, batch: r.batch }));
    const initialRecorded = recordedMigrations.some((r) => r.name === "20260705_212937_initial");
    const leadRecorded = recordedMigrations.some((r) => r.name === "20261024_145000_lead_pipeline");
    const hasDevPushMarker = recordedMigrations.some((r) => r.name === "dev" && Number(r.batch) === -1);
    const report = {
      source: "read-only production-mode Payload/PostgreSQL schema diagnostic",
      nodeEnv: process.env.NODE_ENV,
      baselineSchemaAudit: { migration: "20260705_212937_initial", ...baselineAudit },
      leadPipelineSchemaAudit: { migration: "20261024_145000_lead_pipeline", ...leadAudit },
      migrationLedger: {
        recorded: recordedMigrations,
        initialRecorded,
        leadPipelineRecorded: leadRecorded,
        devPushMarkerPresent: hasDevPushMarker,
        ready: initialRecorded && leadRecorded && !hasDevPushMarker,
      },
      releaseReady: leadAudit.exactSnapshot && initialRecorded && leadRecorded && !hasDevPushMarker,
    };
    console.log(JSON.stringify(report, null, 2));
    if (!report.releaseReady) {
      console.error("[schema-diagnostic] Release blocked: database schema or migration ledger requires a controlled baseline before this branch can be promoted.");
      process.exitCode = 1;
    }
  } finally {
    await payload.destroy();
  }
}

main().catch((error: unknown) => {
  console.error("[schema-diagnostic] Read-only check failed; no schema changes were attempted.");
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
