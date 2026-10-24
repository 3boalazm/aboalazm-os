import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Adds structured attribution and a manual sales pipeline to existing Messages.
 * Existing leads retain NULL stage/attribution values; only new enquiries
 * receive the default stage "new". No historical source or outcome is guessed.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_messages_service" AS ENUM (
      'brand-identity', 'website', 'digital-product', 'brand-support', 'not-sure'
    );
    CREATE TYPE "public"."enum_messages_package_tier" AS ENUM (
      'logo-design', 'brand-identity', 'full-brand-system'
    );
    CREATE TYPE "public"."enum_messages_locale" AS ENUM ('en', 'ar');
    CREATE TYPE "public"."enum_messages_lead_stage" AS ENUM (
      'new', 'qualified', 'proposal-sent', 'won', 'lost', 'not-a-fit'
    );
    CREATE TYPE "public"."enum_messages_closed_reason" AS ENUM (
      'budget', 'timing', 'scope', 'no-response', 'other'
    );

    ALTER TABLE "messages" ADD COLUMN "service" "public"."enum_messages_service";
    ALTER TABLE "messages" ADD COLUMN "package_tier" "public"."enum_messages_package_tier";
    ALTER TABLE "messages" ADD COLUMN "source_page" varchar;
    ALTER TABLE "messages" ADD COLUMN "locale" "public"."enum_messages_locale";
    ALTER TABLE "messages" ADD COLUMN "utm_source" varchar;
    ALTER TABLE "messages" ADD COLUMN "utm_medium" varchar;
    ALTER TABLE "messages" ADD COLUMN "utm_campaign" varchar;
    ALTER TABLE "messages" ADD COLUMN "lead_stage" "public"."enum_messages_lead_stage";
    ALTER TABLE "messages" ALTER COLUMN "lead_stage" SET DEFAULT 'new';
    ALTER TABLE "messages" ADD COLUMN "closed_reason" "public"."enum_messages_closed_reason";
    ALTER TABLE "messages" ADD COLUMN "proposal_value" numeric;
    ALTER TABLE "messages" ADD COLUMN "won_value" numeric;

    CREATE INDEX "messages_service_idx" ON "messages" USING btree ("service");
    CREATE INDEX "messages_source_page_idx" ON "messages" USING btree ("source_page");
    CREATE INDEX "messages_utm_source_idx" ON "messages" USING btree ("utm_source");
    CREATE INDEX "messages_lead_stage_idx" ON "messages" USING btree ("lead_stage");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "messages_service_idx";
    DROP INDEX "messages_source_page_idx";
    DROP INDEX "messages_utm_source_idx";
    DROP INDEX "messages_lead_stage_idx";
    ALTER TABLE "messages" DROP COLUMN "service";
    ALTER TABLE "messages" DROP COLUMN "package_tier";
    ALTER TABLE "messages" DROP COLUMN "source_page";
    ALTER TABLE "messages" DROP COLUMN "locale";
    ALTER TABLE "messages" DROP COLUMN "utm_source";
    ALTER TABLE "messages" DROP COLUMN "utm_medium";
    ALTER TABLE "messages" DROP COLUMN "utm_campaign";
    ALTER TABLE "messages" DROP COLUMN "lead_stage";
    ALTER TABLE "messages" DROP COLUMN "closed_reason";
    ALTER TABLE "messages" DROP COLUMN "proposal_value";
    ALTER TABLE "messages" DROP COLUMN "won_value";
    DROP TYPE "public"."enum_messages_service";
    DROP TYPE "public"."enum_messages_package_tier";
    DROP TYPE "public"."enum_messages_locale";
    DROP TYPE "public"."enum_messages_lead_stage";
    DROP TYPE "public"."enum_messages_closed_reason";
  `);
}
