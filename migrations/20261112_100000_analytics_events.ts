import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Creates the first-party analytics store (P2): the `analytics_events`
 * table behind the `analytics-events` collection, plus the locked-documents
 * relation column every Payload collection gets.
 *
 * Written by hand (like 20261111_120000_messages_locale_ms) because
 * `migrate:create` still tries to bundle the unrelated projects.status
 * drift described in docs/studio/03_SCHEMA_FINDINGS.md §3. The companion
 * .json snapshot is the previous snapshot plus exactly the objects below —
 * nothing else — so the release gate (scripts/check-payload-schema-state.ts)
 * keeps comparing the live database against a truthful description.
 *
 * Idempotent where Postgres allows it, so re-running against a database
 * that was prepared by hand is a no-op rather than an error.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "analytics_events" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "session_id" varchar,
      "path" varchar,
      "locale" varchar,
      "referrer_host" varchar,
      "utm_source" varchar,
      "utm_medium" varchar,
      "utm_campaign" varchar,
      "device" varchar,
      "props" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "analytics_events_name_idx" ON "analytics_events" USING btree ("name")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "analytics_events_session_id_idx" ON "analytics_events" USING btree ("session_id")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "analytics_events_updated_at_idx" ON "analytics_events" USING btree ("updated_at")`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at")`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "analytics_events_id" integer`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_analytics_events_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_events_id")`);
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_analytics_events_fk"
        FOREIGN KEY ("analytics_events_id") REFERENCES "public"."analytics_events"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
}

/**
 * Drops exactly what `up` created. Analytics rows are operational telemetry
 * with a short useful life, so destroying them on rollback is acceptable —
 * unlike the messages rollback, nothing here is a business record.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_analytics_events_fk"`);
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_analytics_events_id_idx"`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "analytics_events_id"`);
  await db.execute(sql`DROP TABLE IF EXISTS "analytics_events"`);
}
