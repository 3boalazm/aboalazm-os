import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../payload.config";
import { getPayload } from "payload";
import { sql } from "@payloadcms/db-postgres/drizzle";

/**
 * READ-ONLY schema/migration diagnostic. Outputs schema metadata only;
 * never customer rows, database names, hostnames, or connection strings.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const snapshotPath = path.resolve(here, "../migrations/20260705_212937_initial.json");
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8")) as {
  tables: Record<string, { name: string; columns: Record<string, { name: string; type: string }> }>;
  enums: Record<string, { name: string; schema: string; values: string[] }>;
};
const RELEVANT_COLUMNS = [
  "id", "name", "email", "company", "brief", "timeline", "budget", "is_read", "created_at",
  "service", "package_tier", "source_page", "locale", "utm_source", "utm_medium",
  "utm_campaign", "lead_stage", "closed_reason", "proposal_value", "won_value",
] as const;

function expectedUdt(type: string): string {
  if (type === "serial" || type === "integer") return "int4";
  if (type === "boolean") return "bool";
  if (type === "timestamp(3) with time zone") return "timestamptz";
  return type;
}

async function main() {
  const payload = await getPayload({ config });
  try {
    const tableResult = await payload.db.drizzle.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('messages', 'payload_migrations')
      ORDER BY table_name
    `);
    const presentTables = (tableResult.rows as Array<{ table_name: string }>).map((row) => row.table_name);
    const report: Record<string, unknown> = {
      source: "read-only Payload/PostgreSQL schema diagnostic",
      presentTables,
      messagesTablePresent: presentTables.includes("messages"),
      payloadMigrationsTablePresent: presentTables.includes("payload_migrations"),
    };

    if (presentTables.includes("messages")) {
      const columnResult = await payload.db.drizzle.execute(sql`
        SELECT column_name, udt_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'messages'
      `);
      const available = new Map((columnResult.rows as Array<{ column_name: string; udt_name: string }>).map((row) => [row.column_name, row.udt_name] as const));
      report.messageColumns = RELEVANT_COLUMNS.filter((name) => available.has(name)).map((name) => ({ name, type: available.get(name) }));
      report.missingLeadColumns = RELEVANT_COLUMNS.filter((name) => ["service", "package_tier", "source_page", "locale", "utm_source", "utm_medium", "utm_campaign", "lead_stage", "closed_reason", "proposal_value", "won_value"].includes(name) && !available.has(name));
    } else {
      report.messageColumns = [];
      report.missingLeadColumns = [...RELEVANT_COLUMNS].filter((name) => ["service", "package_tier", "source_page", "locale", "utm_source", "utm_medium", "utm_campaign", "lead_stage", "closed_reason", "proposal_value", "won_value"].includes(name));
    }

    const actualColumnResult = await payload.db.drizzle.execute(sql`
      SELECT table_name, column_name, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
    `);
    const actualColumns = new Map((actualColumnResult.rows as Array<{ table_name: string; column_name: string; udt_name: string }>).map((row) => [`public.${row.table_name}.${row.column_name}`, row.udt_name] as const));
    const expectedTables = Object.entries(snapshot.tables);
    const missingTables: string[] = [];
    const missingColumns: string[] = [];
    const typeMismatches: Array<{ table: string; column: string; expected: string; actual: string }> = [];

    for (const [tableKey, table] of expectedTables) {
      const tableName = tableKey.split(".").at(-1) ?? table.name;
      const firstColumnKey = `${tableKey}.${Object.keys(table.columns)[0] ?? ""}`;
      if (![...actualColumns.keys()].some((key) => key.startsWith(`${tableKey}.`)) && !actualColumns.has(firstColumnKey)) missingTables.push(tableName);
      for (const column of Object.values(table.columns)) {
        const key = `${tableKey}.${column.name}`;
        const actual = actualColumns.get(key);
        if (!actual) {
          missingColumns.push(`${tableName}.${column.name}`);
          continue;
        }
        const expected = expectedUdt(column.type);
        if (expected !== actual) typeMismatches.push({ table: tableName, column: column.name, expected, actual });
      }
    }

    const enumResult = await payload.db.drizzle.execute(sql`
      SELECT t.typname AS enum_name, e.enumlabel AS label, e.enumsortorder AS sort_order
      FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      JOIN pg_enum e ON e.enumtypid = t.oid
      WHERE n.nspname = 'public'
      ORDER BY t.typname, e.enumsortorder
    `);
    const actualEnums = new Map<string, string[]>();
    for (const row of enumResult.rows as Array<{ enum_name: string; label: string }>) {
      const values = actualEnums.get(row.enum_name) ?? [];
      values.push(row.label);
      actualEnums.set(row.enum_name, values);
    }
    const missingEnums: string[] = [];
    const enumValueMismatches: Array<{ name: string; expectedCount: number; actualCount: number }> = [];
    for (const [enumKey, expectedEnum] of Object.entries(snapshot.enums)) {
      const actual = actualEnums.get(expectedEnum.name);
      if (!actual) { missingEnums.push(expectedEnum.name); continue; }
      if (JSON.stringify(actual) !== JSON.stringify(expectedEnum.values)) enumValueMismatches.push({ name: expectedEnum.name, expectedCount: expectedEnum.values.length, actualCount: actual.length });
    }

    const baselinePresent = missingTables.length === 0 && missingColumns.length === 0 && typeMismatches.length === 0 && missingEnums.length === 0 && enumValueMismatches.length === 0;
    report.initialMigrationSchemaAudit = {
      baselineMigration: "20260705_212937_initial",
      expectedTables: expectedTables.length,
      expectedColumns: Object.values(snapshot.tables).reduce((sum, table) => sum + Object.keys(table.columns).length, 0),
      expectedEnums: Object.keys(snapshot.enums).length,
      baselinePresent,
      missingTables: missingTables.slice(0, 40),
      missingColumns: missingColumns.slice(0, 60),
      typeMismatches: typeMismatches.slice(0, 40),
      missingEnums: missingEnums.slice(0, 40),
      enumValueMismatches: enumValueMismatches.slice(0, 40),
    };

    if (presentTables.includes("payload_migrations")) {
      const migrationResult = await payload.db.drizzle.execute(sql`
        SELECT name, batch FROM public.payload_migrations ORDER BY id
      `);
      report.recordedMigrations = (migrationResult.rows as Array<{ name: string | null; batch: number | string | null }>).map((row) => ({ name: row.name, batch: row.batch }));
    } else {
      report.recordedMigrations = null;
    }

    console.log(JSON.stringify(report, null, 2));
  } finally {
    await payload.destroy();
  }
}

main().catch((error: unknown) => {
  console.error("[schema-diagnostic] Read-only check failed; no schema changes were attempted.");
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
