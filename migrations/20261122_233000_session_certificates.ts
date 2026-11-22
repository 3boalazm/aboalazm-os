import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Creates `session_certificates`: the names people ask to have printed on a
 * session attendance certificate, typed on the thank-you screen that follows
 * /linkedin-session/feedback.
 *
 * Deliberately its own table, not columns on `session_feedback`: the feedback
 * answers stay anonymous, and a name here can never be joined back to a
 * rating or a comment.
 *
 * Hand-written like its siblings (docs/studio/03_SCHEMA_FINDINGS.md §3); the
 * .json snapshot is the previous snapshot plus exactly the objects created
 * here. Additive and idempotent; `down` removes them.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "session_certificates" (
      "id" serial PRIMARY KEY NOT NULL,
      "full_name" varchar NOT NULL,
      "session_key" varchar DEFAULT 'linkedin-2026' NOT NULL,
      "source" varchar DEFAULT 'form',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  const statements = [
    `CREATE INDEX IF NOT EXISTS "session_certificates_session_key_idx" ON "session_certificates" USING btree ("session_key")`,
    `CREATE INDEX IF NOT EXISTS "session_certificates_updated_at_idx" ON "session_certificates" USING btree ("updated_at")`,
    `CREATE INDEX IF NOT EXISTS "session_certificates_created_at_idx" ON "session_certificates" USING btree ("created_at")`,
    /* Payload adds every collection to the locked-documents join table. */
    `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "session_certificates_id" integer`,
    `CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_session_certificates_id_idx" ON "payload_locked_documents_rels" USING btree ("session_certificates_id")`,
    `ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_session_certificates_fk" FOREIGN KEY ("session_certificates_id") REFERENCES "public"."session_certificates"("id") ON DELETE cascade ON UPDATE no action`,
  ];
  for (const statement of statements) {
    await db.execute(sql.raw(`DO $$ BEGIN ${statement}; EXCEPTION WHEN duplicate_table OR duplicate_object OR duplicate_column THEN NULL; END $$;`));
  }
}

/** Drops exactly what `up` created. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_session_certificates_fk"`);
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_session_certificates_id_idx"`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "session_certificates_id"`);
  await db.execute(sql`DROP TABLE IF EXISTS "session_certificates"`);
}
