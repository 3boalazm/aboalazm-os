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
const baseline = JSON.parse(fs.readFileSync(path.resolve(here, "../migrations/20260705_212937_initial.json"), "utf8")) as Snapshot;
const leadPipeline = JSON.parse(fs.readFileSync(path.resolve(here, "../migrations/20261024_145000_lead_pipeline.json"), "utf8")) as Snapshot;

async function main() {
  const payload = await getPayload({ config });
  try {
    const state = await readPayloadSchemaState(payload);
    const baselineAudit = auditPayloadSchemaSnapshot(baseline, state);
    const leadAudit = auditPayloadSchemaSnapshot(leadPipeline, state);
    const initialRecorded = state.migrations.some((r) => r.name === "20260705_212937_initial");
    const leadRecorded = state.migrations.some((r) => r.name === "20261024_145000_lead_pipeline");
    const hasDevPushMarker = state.migrations.some((r) => r.name === "dev" && Number(r.batch) === -1);
    const report = {
      source: "read-only production-mode Payload/PostgreSQL schema diagnostic",
      nodeEnv: process.env.NODE_ENV,
      baselineSchemaAudit: { migration: "20260705_212937_initial", ...baselineAudit },
      leadPipelineSchemaAudit: { migration: "20261024_145000_lead_pipeline", ...leadAudit },
      migrationLedger: {
        recorded: state.migrations,
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
}).finally(() => {
  // Payload/pg can leave handles open after destroy(); without an explicit exit
  // the diagnostic prints its report and then hangs the Vercel build until it is killed.
  process.exit(process.exitCode ?? 0);
});
