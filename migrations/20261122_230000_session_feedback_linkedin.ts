import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * The feedback form asks for a LinkedIn profile link instead of an email
 * (the audience is on LinkedIn, and the session is about it): adds
 * `session_feedback.linkedin_url` and removes `session_feedback.email` with
 * its index.
 *
 * The email column was one day old and nothing reads it any more; the only
 * rows that could hold one are the organiser's own test submissions.
 * Idempotent (IF [NOT] EXISTS), and `down` restores the old shape. The
 * companion .json snapshot is the previous snapshot with exactly this one
 * column swap, so the release gate keeps comparing against a truthful picture.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "session_feedback" ADD COLUMN IF NOT EXISTS "linkedin_url" varchar`);
  await db.execute(sql`DROP INDEX IF EXISTS "session_feedback_email_idx"`);
  await db.execute(sql`ALTER TABLE "session_feedback" DROP COLUMN IF EXISTS "email"`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "session_feedback" ADD COLUMN IF NOT EXISTS "email" varchar`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "session_feedback_email_idx" ON "session_feedback" USING btree ("email")`);
  await db.execute(sql`ALTER TABLE "session_feedback" DROP COLUMN IF EXISTS "linkedin_url"`);
}
