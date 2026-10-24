import config from "../payload.config";
import { getPayload } from "payload";
import { sql } from "@payloadcms/db-postgres/drizzle";

/**
 * READ-ONLY schema/migration diagnostic. Outputs structural metadata only;
 * never customer rows, database names, hostnames, or connection strings.
 */
const RELEVANT_COLUMNS = [
  "id", "name", "email", "company", "brief", "timeline", "budget", "is_read", "created_at",
  "service", "package_tier", "source_page", "locale", "utm_source", "utm_medium",
  "utm_campaign", "lead_stage", "closed_reason", "proposal_value", "won_value",
] as const;

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
      const available = new Map((columnResult.rows as Array<{ column_name: string; udt_name: string }>).map((row) => [row.column_name, row.udt_name]));
      report.messageColumns = RELEVANT_COLUMNS.filter((name) => available.has(name)).map((name) => ({ name, type: available.get(name) }));
      report.missingLeadColumns = RELEVANT_COLUMNS.filter((name) => ["service", "package_tier", "source_page", "locale", "utm_source", "utm_medium", "utm_campaign", "lead_stage", "closed_reason", "proposal_value", "won_value"].includes(name) && !available.has(name));
    } else {
      report.messageColumns = [];
      report.missingLeadColumns = [...RELEVANT_COLUMNS].filter((name) => ["service", "package_tier", "source_page", "locale", "utm_source", "utm_medium", "utm_campaign", "lead_stage", "closed_reason", "proposal_value", "won_value"].includes(name));
    }

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
