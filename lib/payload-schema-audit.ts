import { sql } from "@payloadcms/db-postgres/drizzle";
import type { getPayload } from "@/lib/payload";

export type Snapshot = {
  tables: Record<string, {
    name: string;
    columns: Record<string, { name: string; type: string }>;
    indexes?: Record<string, { name: string }>;
    foreignKeys?: Record<string, { name: string }>;
  }>;
  enums: Record<string, { name: string; schema: string; values: string[] }>;
};
type PayloadInstance = Awaited<ReturnType<typeof getPayload>>;

export type PayloadSchemaState = {
  tables: string[];
  columns: Record<string, string>;
  indexes: string[];
  foreignKeys: string[];
  enums: Record<string, string[]>;
  migrations: Array<{ id: number; name: string | null; batch: number | string | null }>;
};

export async function readPayloadSchemaState(payload: PayloadInstance): Promise<PayloadSchemaState> {
  const [tableRows, columnRows, indexRows, fkRows, enumRows, migrationRows] = await Promise.all([
    payload.db.drizzle.execute(sql.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'")),
    payload.db.drizzle.execute(sql.raw("SELECT table_name, column_name, udt_name FROM information_schema.columns WHERE table_schema = 'public'")),
    payload.db.drizzle.execute(sql.raw("SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public'")),
    payload.db.drizzle.execute(sql.raw("SELECT table_name, constraint_name FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND constraint_type = 'FOREIGN KEY'")),
    payload.db.drizzle.execute(sql.raw("SELECT t.typname AS enum_name, e.enumlabel AS label, e.enumsortorder AS sort_order FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace JOIN pg_enum e ON e.enumtypid = t.oid WHERE n.nspname = 'public' ORDER BY t.typname, e.enumsortorder")),
    payload.db.drizzle.execute(sql.raw("SELECT id, name, batch FROM public.payload_migrations ORDER BY id")),
  ]);

  const columns = Object.fromEntries(
    (columnRows.rows as Array<{ table_name: string; column_name: string; udt_name: string }>)
      .map((r) => ["public." + r.table_name + "." + r.column_name, r.udt_name] as const),
  );
  const enums: Record<string, string[]> = {};
  for (const r of enumRows.rows as Array<{ enum_name: string; label: string }>) {
    (enums[r.enum_name] ??= []).push(r.label);
  }

  return {
    tables: (tableRows.rows as Array<{ table_name: string }>).map((r) => r.table_name).sort(),
    columns,
    indexes: (indexRows.rows as Array<{ tablename: string; indexname: string }>).map((r) => r.tablename + "." + r.indexname),
    foreignKeys: (fkRows.rows as Array<{ table_name: string; constraint_name: string }>).map((r) => r.table_name + "." + r.constraint_name),
    enums,
    migrations: (migrationRows.rows as Array<{ id: number; name: string | null; batch: number | string | null }>).map((r) => ({ id: r.id, name: r.name, batch: r.batch })),
  };
}

function expectedUdt(type: string): string {
  if (type === "serial" || type === "integer") return "int4";
  if (type === "boolean") return "bool";
  if (type === "timestamp(3) with time zone") return "timestamptz";
  return type;
}

export function auditPayloadSchemaSnapshot(snapshot: Snapshot, state: PayloadSchemaState) {
  const tables = new Set(state.tables);
  const columns = new Map(Object.entries(state.columns));
  const indexes = new Set(state.indexes);
  const foreignKeys = new Set(state.foreignKeys);
  const enums = new Map(Object.entries(state.enums));
  const expectedTableNames = Object.values(snapshot.tables).map((t) => t.name).sort();
  const missingTables = expectedTableNames.filter((name) => !tables.has(name));
  const extraTables = state.tables.filter((name) => !expectedTableNames.includes(name));
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

  const extraColumns = Object.keys(state.columns).filter((key) => !expectedColumnKeys.has(key));
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
