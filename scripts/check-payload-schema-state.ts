import fs from "node:fs";
import nextEnv from "@next/env";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Snapshot } from "@/lib/payload-schema-audit";

/**
 * Explicitly use production semantics before loading Payload: schema push is
 * allowed only from local development, never from Preview/Production builds.
 */
nextEnv.loadEnvConfig(process.cwd(), false);
(process.env as Record<string, string | undefined>).NODE_ENV = "production";
const [{ default: config }, { getPayload }, { auditPayloadSchemaSnapshot, readPayloadSchemaState }] = await Promise.all([
  import("../payload.config"),
  import("payload"),
  import("../lib/payload-schema-audit"),
]);

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Every migration that ships a schema snapshot must be listed here, oldest
 * first. Each is audited; the newest one is what the release hangs on.
 *
 * Why this list exists: 20261111_120000_messages_locale_ms widened
 * enum_messages_locale to include 'ms', but the gate still compared the live
 * database to the older lead-pipeline snapshot, which says the enum is en/ar.
 * A correctly migrated database therefore failed the release with an
 * "enumValueMismatches" on enum_messages_locale. lib/payload-schema-audit.test.ts
 * fails if a snapshot file exists on disk but is missing from this list, so the
 * same blind spot cannot come back.
 */
const SNAPSHOTS = [
  "20260705_212937_initial",
  "20261024_145000_lead_pipeline",
  "20261111_120000_messages_locale_ms",
  "20261112_100000_analytics_events",
  "20261119_130000_session_registrations",
] as const;

const snapshots = SNAPSHOTS.map((name) => ({
  name,
  snapshot: JSON.parse(
    fs.readFileSync(path.resolve(here, `../migrations/${name}.json`), "utf8"),
  ) as Snapshot,
}));

async function main() {
  const payload = await getPayload({ config });
  try {
    const state = await readPayloadSchemaState(payload);
    const audits = snapshots.map(({ name, snapshot }) => ({
      name,
      ...auditPayloadSchemaSnapshot(snapshot, state),
    }));
    const current = audits[audits.length - 1];
    if (!current) throw new Error("No schema snapshots configured; refusing to report a release as ready.");

    const recorded = new Set(state.migrations.map((r) => r.name));
    const expected = SNAPSHOTS.map((name) => ({ name, recorded: recorded.has(name) }));
    const hasDevPushMarker = state.migrations.some((r) => r.name === "dev" && Number(r.batch) === -1);
    const allRecorded = expected.every((e) => e.recorded);

    const report = {
      source: "read-only production-mode Payload/PostgreSQL schema diagnostic",
      nodeEnv: process.env.NODE_ENV,
      /* The newest snapshot describes today's schema; this is the release gate. */
      schemaAudit: current,
      historyAudits: audits.slice(0, -1).map((a) => ({
        migration: a.name,
        /* Every migration in this repo only ever ADDS (a table, a column, an
           enum value). So an older snapshot must still be fully present, but it
           is normal for it to disagree with live enums that a later migration
           widened — enum_messages_locale is exactly that case here. `intact`
           therefore means "nothing an older migration created has since been
           dropped or retyped", which is the property worth protecting. */
        intact:
          a.missingTables.length === 0 &&
          a.missingColumns.length === 0 &&
          a.typeMismatches.length === 0 &&
          a.missingIndexes.length === 0 &&
          a.missingForeignKeys.length === 0 &&
          a.missingEnums.length === 0,
        dropped: a.missingTables,
        widenedSinceThen: a.enumValueMismatches.map((m) => m.name),
      })),
      migrationLedger: {
        recorded: state.migrations,
        expected,
        allRecorded,
        devPushMarkerPresent: hasDevPushMarker,
        ready: allRecorded && !hasDevPushMarker,
      },
      releaseReady: current.exactSnapshot && allRecorded && !hasDevPushMarker,
    };
    console.log(JSON.stringify(report, null, 2));
    if (!report.releaseReady) {
      /* Two different problems, two different fixes. Saying "controlled
         baseline" for both is what made this gate hard to act on. */
      const missing = expected.filter((e) => !e.recorded).map((e) => e.name);
      if (missing.length > 0) {
        console.error(
          `[schema-diagnostic] Release blocked: ${missing.join(", ")} has not been applied to this database. ` +
            "Run `npx payload migrate` against it, then rebuild. The code in this branch writes values " +
            "(messages.locale = 'ms') that the current enum does not accept, so it must not ship first.",
        );
      } else if (hasDevPushMarker) {
        console.error(
          "[schema-diagnostic] Release blocked: the migration ledger still contains the development push " +
            "marker (name 'dev', batch -1). Run `npm run baseline:migrations` for a dry run first.",
        );
      } else {
        console.error(
          "[schema-diagnostic] Release blocked: the live schema does not match migrations/" +
            `${current.name}.json. Compare the reported fields against the snapshot before promoting.`,
        );
      }
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
}).finally(() => {
  // Payload/pg can leave handles open after destroy(); without an explicit exit
  // the diagnostic prints its report and then hangs the Vercel build until it is killed.
  process.exit(process.exitCode ?? 0);
});
