import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Adds Malay ('ms') to messages.locale.
 *
 * Malay has been a live, prefixed locale (/ms) since the three-language
 * release, but enum_messages_locale only knew en/ar. lib/contact-attribution.ts
 * therefore coerced every non-Arabic locale to "en" before the insert, so an
 * enquiry from /ms saved successfully and was filed as an English lead: the
 * language was lost, even though the row was never rejected. The brief text
 * still carried "ms (Bahasa Melayu)", which was the only surviving trace.
 *
 * This migration widens the enum so the real locale can be stored. It does not
 * rewrite history — rows already recorded as "en" stay "en", because the only
 * way to identify a coerced Malay row would be to parse free-text briefs.
 *
 * Idempotent by design: `ADD VALUE IF NOT EXISTS` is a no-op when the value is
 * already present, so this is safe to run against a database that was widened
 * by hand (as scripts/studio-dev-db.sh used to do) before it was recorded in
 * the ledger.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  /* Postgres will not run ALTER TYPE ... ADD VALUE inside a transaction block on
     versions before 12; the project targets Postgres 14+, where adding a value
     inside a transaction is allowed as long as the new value is not used in the
     same transaction. Nothing below reads 'ms'. */
  await db.execute(sql`ALTER TYPE "public"."enum_messages_locale" ADD VALUE IF NOT EXISTS 'ms'`);
}

/**
 * Postgres cannot remove a value from an existing enum type. The down migration
 * therefore refuses to run while any row still uses 'ms' (dropping the value
 * would destroy real enquiries), and otherwise leaves the enum wider than the
 * schema snapshot describes — harmless, and the only non-destructive option.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  const result = (await db.execute(
    sql`SELECT count(*)::int AS n FROM "messages" WHERE "locale" = 'ms'`,
  )) as unknown as { rows?: Array<{ n: number }> };
  const count = Number(result.rows?.[0]?.n ?? 0);
  if (count > 0) {
    throw new Error(
      `Refusing to roll back 20261111_120000_messages_locale_ms: ${count} message(s) use locale 'ms'. Reassign them before rolling back.`,
    );
  }
}
