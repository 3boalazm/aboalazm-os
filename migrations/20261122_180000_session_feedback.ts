import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Creates the after-session feedback store: `session_feedback` (one row per
 * person who fills /linkedin-session/feedback) and `session_feedback_texts`
 * (the multi-answer `mostUseful`, one row per chosen part), plus the
 * locked-documents relation every Payload collection gets.
 *
 * Written by hand, exactly like 20261119_130000_session_registrations, for the
 * same reason: `migrate:create` still tries to fold the unrelated
 * projects.status drift into whatever it generates
 * (docs/studio/03_SCHEMA_FINDINGS.md §3). The companion .json snapshot is the
 * session-registrations snapshot plus exactly the objects created here and
 * nothing else, so the release gate (scripts/check-payload-schema-state.ts)
 * keeps comparing the live database against a truthful description.
 *
 * Additive only: no existing table, column or enum is changed (the single
 * exception is one nullable column on payload_locked_documents_rels, which
 * Payload adds for every collection). Rolling the code back leaves these
 * tables in place and unused; `down` removes them.
 *
 * Column names are `to-snake-case(field name)` — what the drizzle adapter
 * itself uses. Enum labels are the option values in
 * features/linkedin-session/feedback.ts; that file is the only place to change
 * either. The three 1–5 scales are plain `numeric` (a Payload `number`), not
 * enums: they are averaged, and the 1–5 range is enforced by the validator in
 * feedback.ts (the only write path), not by a database constraint.
 *
 * Idempotent everywhere Postgres allows it.
 */
const ENUMS: Record<string, string[]> = {
  enum_session_feedback_pace: ["too-fast", "right", "too-slow"],
  enum_session_feedback_recommend: ["yes", "maybe", "no"],
  enum_session_feedback_next_step: ["account", "photo", "headline", "about", "connect", "post", "job-alert"],
};

const CREATE_ENUMS = Object.entries(ENUMS)
  .map(
    ([name, values]) => `DO $$ BEGIN
      CREATE TYPE "public"."${name}" AS ENUM(${values.map((v) => `'${v}'`).join(", ")});
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  )
  .join("\n");

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(CREATE_ENUMS));

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "session_feedback_texts" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "text" varchar
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "session_feedback" (
      "id" serial PRIMARY KEY NOT NULL,
      "rating" numeric NOT NULL,
      "confidence_before" numeric NOT NULL,
      "confidence_after" numeric NOT NULL,
      "pace" "public"."enum_session_feedback_pace" NOT NULL,
      "recommend" "public"."enum_session_feedback_recommend" NOT NULL,
      "next_step" "public"."enum_session_feedback_next_step" NOT NULL,
      "best_part" text,
      "improve" text,
      "next_topic" text,
      "full_name" varchar,
      "email" varchar,
      "allow_quote" boolean DEFAULT false,
      "session_key" varchar DEFAULT 'linkedin-2026' NOT NULL,
      "source" varchar DEFAULT 'form',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  /* Every index Payload's own schema builder would emit for this config:
     `index: true` per field, updated_at/created_at, and the order/parent pair
     on the hasMany table. */
  const statements = [
    `CREATE INDEX IF NOT EXISTS "session_feedback_pace_idx" ON "session_feedback" USING btree ("pace")`,
    `CREATE INDEX IF NOT EXISTS "session_feedback_recommend_idx" ON "session_feedback" USING btree ("recommend")`,
    `CREATE INDEX IF NOT EXISTS "session_feedback_next_step_idx" ON "session_feedback" USING btree ("next_step")`,
    `CREATE INDEX IF NOT EXISTS "session_feedback_email_idx" ON "session_feedback" USING btree ("email")`,
    `CREATE INDEX IF NOT EXISTS "session_feedback_session_key_idx" ON "session_feedback" USING btree ("session_key")`,
    `CREATE INDEX IF NOT EXISTS "session_feedback_updated_at_idx" ON "session_feedback" USING btree ("updated_at")`,
    `CREATE INDEX IF NOT EXISTS "session_feedback_created_at_idx" ON "session_feedback" USING btree ("created_at")`,
    `CREATE INDEX IF NOT EXISTS "session_feedback_texts_order_parent" ON "session_feedback_texts" USING btree ("order", "parent_id")`,
    `ALTER TABLE "session_feedback_texts" ADD CONSTRAINT "session_feedback_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."session_feedback"("id") ON DELETE cascade ON UPDATE no action`,
    /* Payload adds every collection to the locked-documents join table. */
    `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "session_feedback_id" integer`,
    `CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_session_feedback_id_idx" ON "payload_locked_documents_rels" USING btree ("session_feedback_id")`,
    `ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_session_feedback_fk" FOREIGN KEY ("session_feedback_id") REFERENCES "public"."session_feedback"("id") ON DELETE cascade ON UPDATE no action`,
  ];

  for (const statement of statements) {
    /* Constraint/index names collide when the migration re-runs on a database
       that was already prepared, so each gets the same swallow-the-clash
       treatment the enum block above uses. */
    await db.execute(sql.raw(`DO $$ BEGIN ${statement}; EXCEPTION WHEN duplicate_table OR duplicate_object OR duplicate_column THEN NULL; END $$;`));
  }
}

/** Drops exactly what `up` created. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_session_feedback_fk"`);
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_session_feedback_id_idx"`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "session_feedback_id"`);

  await db.execute(sql`ALTER TABLE "session_feedback_texts" DROP CONSTRAINT IF EXISTS "session_feedback_texts_parent_fk"`);
  await db.execute(sql`DROP TABLE IF EXISTS "session_feedback_texts"`);
  await db.execute(sql`DROP TABLE IF EXISTS "session_feedback"`);

  for (const name of Object.keys(ENUMS)) {
    await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."${name}"`));
  }
}
