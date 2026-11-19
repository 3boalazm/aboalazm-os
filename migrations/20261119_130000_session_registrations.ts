import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Creates the session-assessment store: `session_registrations` (one row per
 * attendee of a pre-session form) and `session_files` (the private CV upload
 * the form may attach), plus the locked-documents relation every Payload
 * collection gets.
 *
 * Written by hand — like 20261112_100000_analytics_events — because
 * `migrate:create` still tries to fold the unrelated projects.status drift
 * into whatever it generates (docs/studio/03_SCHEMA_FINDINGS.md §3). The
 * companion .json snapshot is the analytics snapshot plus exactly the objects
 * created here and nothing else, so the release gate
 * (scripts/check-payload-schema-state.ts) keeps comparing the live database
 * against a truthful description.
 *
 * Column names are `to-snake-case(field name)` — what the drizzle adapter
 * itself uses — so a database prepared by dev `push` and one prepared by this
 * migration are the same schema. Enum labels are the option values in
 * features/linkedin-session/assessment.ts; that file is the only place to
 * change either.
 *
 * Idempotent everywhere Postgres allows it, so re-running against a database
 * that was prepared by hand is a no-op rather than an error.
 */
const ENUMS: Record<string, string[]> = {
  enum_session_registrations_year_of_study: ["year-1", "year-2", "year-3", "year-4", "year-5", "postgraduate", "fresh-grad", "other"],
  enum_session_registrations_linkedin_status: ["active", "inactive", "incomplete", "none"],
  enum_session_registrations_applied_before: ["often", "tried", "never"],
  enum_session_registrations_cv_status: ["ready", "needs-work", "not-started"],
  enum_session_registrations_follow_up: ["new", "reviewed", "replied", "closed"],
  enum_session_registrations_attendance: ["registered", "attended", "no-show"],
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
    CREATE TABLE IF NOT EXISTS "session_files" (
      "id" serial PRIMARY KEY NOT NULL,
      "owner" varchar,
      "session_key" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
    );
  `);

  /* `goals` (text hasMany) lives here, one row per chosen goal — the shape
     Payload's own schema builder gives every repeatable text field:
     (order, parent_id, path, text). */
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "session_registrations_texts" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "text" varchar
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "session_registrations" (
      "id" serial PRIMARY KEY NOT NULL,
      "full_name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "college" varchar NOT NULL,
      "university" varchar,
      "year_of_study" "public"."enum_session_registrations_year_of_study" NOT NULL,
      "interest_area" varchar,
      "linkedin_status" "public"."enum_session_registrations_linkedin_status" NOT NULL,
      "linkedin_url" varchar,
      "applied_before" "public"."enum_session_registrations_applied_before",
      "cv_status" "public"."enum_session_registrations_cv_status",
      "cv_file_id" integer,
      "biggest_challenge" text,
      "question_for_session" text,
      "follow_up" "public"."enum_session_registrations_follow_up" DEFAULT 'new',
      "attendance" "public"."enum_session_registrations_attendance" DEFAULT 'registered',
      "session_key" varchar DEFAULT 'linkedin-2026' NOT NULL,
      "source" varchar DEFAULT 'form',
      "notes" text,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  /* Every index Payload's own schema builder would emit for this config:
     `index: true` per field, a filename index on the upload collection, and
     updated_at/created_at on both tables. */
  const statements = [
    `CREATE INDEX IF NOT EXISTS "session_files_filename_idx" ON "session_files" USING btree ("filename")`,
    `CREATE INDEX IF NOT EXISTS "session_files_session_key_idx" ON "session_files" USING btree ("session_key")`,
    `CREATE INDEX IF NOT EXISTS "session_files_updated_at_idx" ON "session_files" USING btree ("updated_at")`,
    `CREATE INDEX IF NOT EXISTS "session_files_created_at_idx" ON "session_files" USING btree ("created_at")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_college_idx" ON "session_registrations" USING btree ("college")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_year_of_study_idx" ON "session_registrations" USING btree ("year_of_study")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_linkedin_status_idx" ON "session_registrations" USING btree ("linkedin_status")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_cv_status_idx" ON "session_registrations" USING btree ("cv_status")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_cv_file_idx" ON "session_registrations" USING btree ("cv_file_id")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_follow_up_idx" ON "session_registrations" USING btree ("follow_up")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_attendance_idx" ON "session_registrations" USING btree ("attendance")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_session_key_idx" ON "session_registrations" USING btree ("session_key")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_updated_at_idx" ON "session_registrations" USING btree ("updated_at")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_created_at_idx" ON "session_registrations" USING btree ("created_at")`,
    `CREATE INDEX IF NOT EXISTS "session_registrations_texts_order_parent" ON "session_registrations_texts" USING btree ("order", "parent_id")`,
    `ALTER TABLE "session_registrations_texts" ADD CONSTRAINT "session_registrations_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."session_registrations"("id") ON DELETE cascade ON UPDATE no action`,
    `ALTER TABLE "session_registrations" ADD CONSTRAINT "session_registrations_cv_file_id_session_files_id_fk" FOREIGN KEY ("cv_file_id") REFERENCES "public"."session_files"("id") ON DELETE set null ON UPDATE no action`,
    /* Payload adds every collection to the locked-documents join table. */
    `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "session_registrations_id" integer`,
    `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "session_files_id" integer`,
    `CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_session_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("session_registrations_id")`,
    `CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_session_files_id_idx" ON "payload_locked_documents_rels" USING btree ("session_files_id")`,
    `ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_session_registrations_fk" FOREIGN KEY ("session_registrations_id") REFERENCES "public"."session_registrations"("id") ON DELETE cascade ON UPDATE no action`,
    `ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_session_files_fk" FOREIGN KEY ("session_files_id") REFERENCES "public"."session_files"("id") ON DELETE cascade ON UPDATE no action`,
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
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_session_registrations_fk"`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_session_files_fk"`);
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_session_registrations_id_idx"`);
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_session_files_id_idx"`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "session_registrations_id"`);
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "session_files_id"`);

  await db.execute(sql`ALTER TABLE "session_registrations_texts" DROP CONSTRAINT IF EXISTS "session_registrations_texts_parent_fk"`);
  await db.execute(sql`DROP TABLE IF EXISTS "session_registrations_texts"`);
  await db.execute(sql`ALTER TABLE "session_registrations" DROP CONSTRAINT IF EXISTS "session_registrations_cv_file_id_session_files_id_fk"`);
  await db.execute(sql`DROP TABLE IF EXISTS "session_registrations"`);
  await db.execute(sql`DROP TABLE IF EXISTS "session_files"`);

  for (const name of Object.keys(ENUMS)) {
    await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."${name}"`));
  }
}
