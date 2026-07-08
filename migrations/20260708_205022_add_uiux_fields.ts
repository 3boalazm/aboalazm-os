import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "is_ui_ux" boolean DEFAULT false;
  ALTER TABLE "projects" ADD COLUMN "live_url" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_is_ui_ux" boolean DEFAULT false;
  ALTER TABLE "_projects_v" ADD COLUMN "version_live_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "is_ui_ux";
  ALTER TABLE "projects" DROP COLUMN "live_url";
  ALTER TABLE "_projects_v" DROP COLUMN "version_is_ui_ux";
  ALTER TABLE "_projects_v" DROP COLUMN "version_live_url";`)
}

