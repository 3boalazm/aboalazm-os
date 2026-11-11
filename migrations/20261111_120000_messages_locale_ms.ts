import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Adds Malay ('ms') to messages.locale.
 *
 * Malay has been a live, prefixed locale (/ms) since the three-language
 * release, but the Messages select still offered only en/ar. Because the
 * contact form records the visitor's locale, an enquiry submitted from /ms
 * failed at the database with:
 *
 *   invalid input value for enum enum_messages_locale: "ms"
 *
 * i.e. the form could not save a Malaysian enquiry at all. The value is only
 * widened here — no historical row is rewritten, and no default changes.
 *
 * Postgres cannot ADD VALUE inside a transaction block on versions before 12,
 * and Payload runs migrations in a transaction; `IF NOT EXISTS` plus the
 * committed-later behaviour is safe on the Postgres 14+ this project targets.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TYPE "public"."enum_messages_locale" ADD VALUE IF NOT EXISTS 'ms'`);
}

/**
 * Postgres cannot remove a value from an existing enum type. The down
 * migration therefore fails loudly if any row still uses 'ms' (removing the
 * value would destroy those enquiries), and otherwise leaves the enum wider
 * than the code — harmless, and the only non-destructive option.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  const rows = await db.execute(sql`SELECT count(*)::int AS n FROM "messages" WHERE "locale" = 'ms'`);
  const count = Number((rows as unknown as { rows?: { n: number }[] }).rows?.[0]?.n ?? 0);
  if (count > 0) {
    throw new Error(
      `Refusing to roll back 20261111_120000_messages_locale_ms: ${count} message(s) use locale 'ms'. Reassign them before rolling back.`,
    );
  }
}
