import nextEnv from "@next/env";
import type { Migration } from "payload";

/**
 * Controlled Payload PostgreSQL migration runner.
 *
 * Modes:
 *   (default)                  Dry-run inspection: reports pending migrations without writing.
 *   --apply                    Applies all pending committed migrations from migrations/index.ts.
 *   --vercel-production-only   Applies pending migrations ONLY when VERCEL_ENV === "production";
 *                              skips cleanly on local dev and Vercel Preview builds so unmerged
 *                              PRs never mutate the shared Neon database.
 *
 * Safety invariants:
 *   - Forces NODE_ENV=production and PAYLOAD_MIGRATING=true before loading payload.config.ts,
 *     guaranteeing Drizzle schema push never executes.
 *   - Acquires a PostgreSQL transaction-scoped advisory lock (pg_advisory_xact_lock) so
 *     overlapping Vercel Production builds serialize instead of racing.
 *   - Rejects databases carrying a dev-push marker (name 'dev', batch -1) instead of hitting
 *     Payload's interactive CLI prompt.
 */

const MIGRATION_LOCK_KEY = 746182903;

const args = new Set(process.argv.slice(2));
const vercelProductionOnly = args.has("--vercel-production-only");
const applyRequested = args.has("--apply");

if (vercelProductionOnly && process.env.VERCEL_ENV !== "production") {
  console.log(
    JSON.stringify(
      {
        status: "skipped",
        reason: "not-vercel-production",
        vercelEnv: process.env.VERCEL_ENV ?? null,
        changedDatabase: false,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

nextEnv.loadEnvConfig(process.cwd(), false);
(process.env as Record<string, string | undefined>).NODE_ENV = "production";
process.env.PAYLOAD_MIGRATING = "true";

const shouldApply = applyRequested || (vercelProductionOnly && process.env.VERCEL_ENV === "production");

const missingEnv = (["DATABASE_URI", "PAYLOAD_SECRET"] as const).filter((key) => !process.env[key]?.trim());
if (missingEnv.length > 0) {
  console.error(
    `[db-migrate] Missing required environment variable(s): ${missingEnv.join(", ")}.`,
  );
  process.exit(1);
}

const [{ default: config }, { getPayload }, { migrations }, { sql }] = await Promise.all([
  import("../payload.config"),
  import("payload"),
  import("../migrations"),
  import("@payloadcms/db-postgres/drizzle"),
]);

async function readLedger(
  tx: Parameters<Parameters<Awaited<ReturnType<typeof getPayload>>["db"]["drizzle"]["transaction"]>[0]>[0],
) {
  const regResult = await tx.execute(sql.raw("SELECT to_regclass('public.payload_migrations') AS table_name"));
  const tableExists = Boolean((regResult.rows as Array<{ table_name: string | null }>)[0]?.table_name);
  if (!tableExists) {
    return { tableExists: false, rows: [] as Array<{ id: number; name: string | null; batch: number | string | null }> };
  }
  const ledgerResult = await tx.execute(sql.raw("SELECT id, name, batch FROM public.payload_migrations ORDER BY id"));
  const rows = (ledgerResult.rows as Array<{ id: number; name: string | null; batch: number | string | null }>).map((r) => ({
    id: r.id,
    name: r.name,
    batch: r.batch,
  }));
  return { tableExists: true, rows };
}

async function main() {
  const payload = await getPayload({ config });
  try {
    await payload.db.drizzle.transaction(async (tx) => {
      // Transaction-scoped advisory lock works safely with both direct Postgres
      // connections and Neon/PgBouncer transaction pooling.
      await tx.execute(sql.raw(`SELECT pg_advisory_xact_lock(${MIGRATION_LOCK_KEY})`));

      const { tableExists, rows } = await readLedger(tx);
      const hasDevMarker = rows.some((r) => r.name === "dev" || Number(r.batch) === -1);
      if (hasDevMarker) {
        throw new Error(
          "Migration ledger contains a development push marker (name 'dev', batch -1). Run `npm run baseline:migrations` before running automatic migrations.",
        );
      }

      const recordedNames = new Set(rows.map((r) => r.name).filter((name): name is string => Boolean(name)));
      const pending = migrations.filter((m) => !recordedNames.has(m.name));

      if (pending.length === 0) {
        console.log(
          JSON.stringify(
            {
              status: "up-to-date",
              pending: [],
              applied: [],
              recordedCount: recordedNames.size,
              changedDatabase: false,
            },
            null,
            2,
          ),
        );
        return;
      }

      if (!shouldApply) {
        console.log(
          JSON.stringify(
            {
              status: "dry-run-pending",
              pending: pending.map((m) => m.name),
              applied: [],
              tableExists,
              changedDatabase: false,
              nextStep: "Rerun with --apply (or `npm run db:migrate`) to execute pending migrations.",
            },
            null,
            2,
          ),
        );
        return;
      }

      await payload.db.migrate({ migrations: migrations as unknown as Migration[] });

      const after = await readLedger(tx);
      const afterNames = new Set(after.rows.map((r) => r.name).filter((name): name is string => Boolean(name)));
      const stillMissing = pending.map((m) => m.name).filter((name) => !afterNames.has(name));
      if (stillMissing.length > 0) {
        throw new Error(
          `Migrations ran but were not recorded in public.payload_migrations: ${stillMissing.join(", ")}`,
        );
      }

      console.log(
        JSON.stringify(
          {
            status: "migrated",
            applied: pending.map((m) => m.name),
            recordedCount: afterNames.size,
            changedDatabase: true,
          },
          null,
          2,
        ),
      );
    });
  } finally {
    await payload.destroy();
  }
}

main()
  .catch((error: unknown) => {
    console.error("[db-migrate] Failed to inspect or apply Payload migrations.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit(process.exitCode ?? 0);
  });
