import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_category" AS ENUM('design', 'development');
  CREATE TYPE "public"."enum_projects_discipline" AS ENUM('Systemic Identity', 'Product Architecture', 'Design Infrastructure', 'Identity Engineering', 'Studio & Identity');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_category" AS ENUM('design', 'development');
  CREATE TYPE "public"."enum__projects_v_version_discipline" AS ENUM('Systemic Identity', 'Product Architecture', 'Design Infrastructure', 'Identity Engineering', 'Studio & Identity');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_case_studies_images_span" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum_case_studies_retro_verdict" AS ENUM('KEEP', 'CHANGE', 'DROP');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_images_span" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum__case_studies_v_version_retro_verdict" AS ENUM('KEEP', 'CHANGE', 'DROP');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_lang" AS ENUM('en', 'ar');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_lang" AS ENUM('en', 'ar');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_members_social_links_platform" AS ENUM('LinkedIn', 'Behance', 'Dribbble', 'GitHub', 'X');
  CREATE TYPE "public"."enum_messages_budget" AS ENUM('< $1K', '$1–3K', '$3–8K', '$8K+');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"alt_ar" varchar,
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
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar,
  	"name_ar" varchar,
  	"category" "enum_projects_category",
  	"discipline" "enum_projects_discipline",
  	"outcome" varchar,
  	"outcome_ar" varchar,
  	"year" varchar,
  	"thumbnail_id" integer,
  	"has_case_study" boolean DEFAULT false,
  	"external_url" varchar,
  	"accent_primary" varchar,
  	"accent_secondary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_name_ar" varchar,
  	"version_category" "enum__projects_v_version_category",
  	"version_discipline" "enum__projects_v_version_discipline",
  	"version_outcome" varchar,
  	"version_outcome_ar" varchar,
  	"version_year" varchar,
  	"version_thumbnail_id" integer,
  	"version_has_case_study" boolean DEFAULT false,
  	"version_external_url" varchar,
  	"version_accent_primary" varchar,
  	"version_accent_secondary" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "case_studies_kpis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"label_ar" varchar,
  	"context" varchar,
  	"context_ar" varchar
  );
  
  CREATE TABLE "case_studies_competitors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"x" numeric,
  	"y" numeric,
  	"is_client" boolean DEFAULT false
  );
  
  CREATE TABLE "case_studies_tokens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"token" varchar,
  	"value" varchar,
  	"role" varchar,
  	"role_ar" varchar
  );
  
  CREATE TABLE "case_studies_breakpoints" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bp" varchar,
  	"cols" varchar
  );
  
  CREATE TABLE "case_studies_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"caption_ar" varchar,
  	"span" "enum_case_studies_images_span" DEFAULT 'half'
  );
  
  CREATE TABLE "case_studies_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"label_ar" varchar,
  	"context" varchar,
  	"context_ar" varchar
  );
  
  CREATE TABLE "case_studies_retro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"verdict" "enum_case_studies_retro_verdict",
  	"note" varchar,
  	"note_ar" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar,
  	"name_ar" varchar,
  	"discipline" varchar,
  	"accent_primary" varchar,
  	"accent_secondary" varchar,
  	"problem" varchar,
  	"problem_ar" varchar,
  	"team_scale" varchar,
  	"team_scale_ar" varchar,
  	"timeline" varchar,
  	"timeline_ar" varchar,
  	"research_summary" varchar,
  	"research_summary_ar" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_kpis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"label_ar" varchar,
  	"context" varchar,
  	"context_ar" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_competitors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"x" numeric,
  	"y" numeric,
  	"is_client" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_tokens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"token" varchar,
  	"value" varchar,
  	"role" varchar,
  	"role_ar" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_breakpoints" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"bp" varchar,
  	"cols" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"caption_ar" varchar,
  	"span" "enum__case_studies_v_version_images_span" DEFAULT 'half',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"label_ar" varchar,
  	"context" varchar,
  	"context_ar" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_retro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"verdict" "enum__case_studies_v_version_retro_verdict",
  	"note" varchar,
  	"note_ar" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_name_ar" varchar,
  	"version_discipline" varchar,
  	"version_accent_primary" varchar,
  	"version_accent_secondary" varchar,
  	"version_problem" varchar,
  	"version_problem_ar" varchar,
  	"version_team_scale" varchar,
  	"version_team_scale_ar" varchar,
  	"version_timeline" varchar,
  	"version_timeline_ar" varchar,
  	"version_research_summary" varchar,
  	"version_research_summary_ar" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_case_studies_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar,
  	"company" varchar,
  	"record" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"index" varchar,
  	"title" varchar,
  	"slug" varchar,
  	"standfirst" varchar,
  	"published_at" timestamp(3) with time zone,
  	"lang" "enum_posts_lang" DEFAULT 'en',
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_index" varchar,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_standfirst" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_lang" "enum__posts_v_version_lang" DEFAULT 'en',
  	"version_body" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "resource_leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"resource" varchar,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_team_members_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_ar" varchar,
  	"role" varchar NOT NULL,
  	"role_ar" varchar,
  	"photo_id" integer,
  	"bio" varchar,
  	"bio_ar" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"brief" varchar NOT NULL,
  	"timeline" varchar,
  	"budget" "enum_messages_budget",
  	"is_read" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"projects_id" integer,
  	"case_studies_id" integer,
  	"testimonials_id" integer,
  	"posts_id" integer,
  	"resource_leads_id" integer,
  	"team_members_id" integer,
  	"messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "offers_tiers_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"en" varchar,
  	"ar" varchar
  );
  
  CREATE TABLE "offers_tiers_excludes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"en" varchar,
  	"ar" varchar
  );
  
  CREATE TABLE "offers_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag_en" varchar NOT NULL,
  	"tag_ar" varchar NOT NULL,
  	"name_en" varchar NOT NULL,
  	"name_ar" varchar NOT NULL,
  	"price" varchar NOT NULL,
  	"price_note_en" varchar NOT NULL,
  	"price_note_ar" varchar NOT NULL,
  	"best_for_en" varchar NOT NULL,
  	"best_for_ar" varchar NOT NULL,
  	"duration_en" varchar NOT NULL,
  	"duration_ar" varchar NOT NULL,
  	"payment" varchar NOT NULL,
  	"recommended" boolean DEFAULT false,
  	"includes_head_en" varchar NOT NULL,
  	"includes_head_ar" varchar NOT NULL
  );
  
  CREATE TABLE "offers_investment_value" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"en" varchar NOT NULL,
  	"ar" varchar NOT NULL,
  	"sub_en" varchar,
  	"sub_ar" varchar,
  	"pending" boolean DEFAULT true
  );
  
  CREATE TABLE "offers_ala_carte_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_en" varchar NOT NULL,
  	"service_ar" varchar NOT NULL,
  	"details_en" varchar NOT NULL,
  	"details_ar" varchar NOT NULL,
  	"price" varchar NOT NULL
  );
  
  CREATE TABLE "offers_ala_carte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group_en" varchar NOT NULL,
  	"group_ar" varchar NOT NULL
  );
  
  CREATE TABLE "offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"location" varchar,
  	"linkedin" varchar,
  	"github" varchar,
  	"behance" varchar,
  	"dribbble" varchar,
  	"x" varchar,
  	"cv_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_texts" ADD CONSTRAINT "projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_texts" ADD CONSTRAINT "_projects_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_kpis" ADD CONSTRAINT "case_studies_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_competitors" ADD CONSTRAINT "case_studies_competitors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_tokens" ADD CONSTRAINT "case_studies_tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_breakpoints" ADD CONSTRAINT "case_studies_breakpoints_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_images" ADD CONSTRAINT "case_studies_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_images" ADD CONSTRAINT "case_studies_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_results" ADD CONSTRAINT "case_studies_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_retro" ADD CONSTRAINT "case_studies_retro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_texts" ADD CONSTRAINT "case_studies_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_kpis" ADD CONSTRAINT "_case_studies_v_version_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_competitors" ADD CONSTRAINT "_case_studies_v_version_competitors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_tokens" ADD CONSTRAINT "_case_studies_v_version_tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_breakpoints" ADD CONSTRAINT "_case_studies_v_version_breakpoints_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_images" ADD CONSTRAINT "_case_studies_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_images" ADD CONSTRAINT "_case_studies_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_results" ADD CONSTRAINT "_case_studies_v_version_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_retro" ADD CONSTRAINT "_case_studies_v_version_retro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_texts" ADD CONSTRAINT "_case_studies_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_social_links" ADD CONSTRAINT "team_members_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resource_leads_fk" FOREIGN KEY ("resource_leads_id") REFERENCES "public"."resource_leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_tiers_includes" ADD CONSTRAINT "offers_tiers_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_tiers_excludes" ADD CONSTRAINT "offers_tiers_excludes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_tiers" ADD CONSTRAINT "offers_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_investment_value" ADD CONSTRAINT "offers_investment_value_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_ala_carte_rows" ADD CONSTRAINT "offers_ala_carte_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers_ala_carte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_ala_carte" ADD CONSTRAINT "offers_ala_carte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_thumbnail_idx" ON "projects" USING btree ("thumbnail_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_texts_order_parent" ON "projects_texts" USING btree ("order","parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_thumbnail_idx" ON "_projects_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_texts_order_parent" ON "_projects_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "case_studies_kpis_order_idx" ON "case_studies_kpis" USING btree ("_order");
  CREATE INDEX "case_studies_kpis_parent_id_idx" ON "case_studies_kpis" USING btree ("_parent_id");
  CREATE INDEX "case_studies_competitors_order_idx" ON "case_studies_competitors" USING btree ("_order");
  CREATE INDEX "case_studies_competitors_parent_id_idx" ON "case_studies_competitors" USING btree ("_parent_id");
  CREATE INDEX "case_studies_tokens_order_idx" ON "case_studies_tokens" USING btree ("_order");
  CREATE INDEX "case_studies_tokens_parent_id_idx" ON "case_studies_tokens" USING btree ("_parent_id");
  CREATE INDEX "case_studies_breakpoints_order_idx" ON "case_studies_breakpoints" USING btree ("_order");
  CREATE INDEX "case_studies_breakpoints_parent_id_idx" ON "case_studies_breakpoints" USING btree ("_parent_id");
  CREATE INDEX "case_studies_images_order_idx" ON "case_studies_images" USING btree ("_order");
  CREATE INDEX "case_studies_images_parent_id_idx" ON "case_studies_images" USING btree ("_parent_id");
  CREATE INDEX "case_studies_images_image_idx" ON "case_studies_images" USING btree ("image_id");
  CREATE INDEX "case_studies_results_order_idx" ON "case_studies_results" USING btree ("_order");
  CREATE INDEX "case_studies_results_parent_id_idx" ON "case_studies_results" USING btree ("_parent_id");
  CREATE INDEX "case_studies_retro_order_idx" ON "case_studies_retro" USING btree ("_order");
  CREATE INDEX "case_studies_retro_parent_id_idx" ON "case_studies_retro" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX "case_studies_texts_order_parent" ON "case_studies_texts" USING btree ("order","parent_id");
  CREATE INDEX "_case_studies_v_version_kpis_order_idx" ON "_case_studies_v_version_kpis" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_kpis_parent_id_idx" ON "_case_studies_v_version_kpis" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_competitors_order_idx" ON "_case_studies_v_version_competitors" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_competitors_parent_id_idx" ON "_case_studies_v_version_competitors" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_tokens_order_idx" ON "_case_studies_v_version_tokens" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_tokens_parent_id_idx" ON "_case_studies_v_version_tokens" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_breakpoints_order_idx" ON "_case_studies_v_version_breakpoints" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_breakpoints_parent_id_idx" ON "_case_studies_v_version_breakpoints" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_images_order_idx" ON "_case_studies_v_version_images" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_images_parent_id_idx" ON "_case_studies_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_images_image_idx" ON "_case_studies_v_version_images" USING btree ("image_id");
  CREATE INDEX "_case_studies_v_version_results_order_idx" ON "_case_studies_v_version_results" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_results_parent_id_idx" ON "_case_studies_v_version_results" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_retro_order_idx" ON "_case_studies_v_version_retro" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_retro_parent_id_idx" ON "_case_studies_v_version_retro" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_texts_order_parent" ON "_case_studies_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_texts_order_parent" ON "_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "resource_leads_updated_at_idx" ON "resource_leads" USING btree ("updated_at");
  CREATE INDEX "resource_leads_created_at_idx" ON "resource_leads" USING btree ("created_at");
  CREATE INDEX "team_members_social_links_order_idx" ON "team_members_social_links" USING btree ("_order");
  CREATE INDEX "team_members_social_links_parent_id_idx" ON "team_members_social_links" USING btree ("_parent_id");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_resource_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("resource_leads_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "offers_tiers_includes_order_idx" ON "offers_tiers_includes" USING btree ("_order");
  CREATE INDEX "offers_tiers_includes_parent_id_idx" ON "offers_tiers_includes" USING btree ("_parent_id");
  CREATE INDEX "offers_tiers_excludes_order_idx" ON "offers_tiers_excludes" USING btree ("_order");
  CREATE INDEX "offers_tiers_excludes_parent_id_idx" ON "offers_tiers_excludes" USING btree ("_parent_id");
  CREATE INDEX "offers_tiers_order_idx" ON "offers_tiers" USING btree ("_order");
  CREATE INDEX "offers_tiers_parent_id_idx" ON "offers_tiers" USING btree ("_parent_id");
  CREATE INDEX "offers_investment_value_order_idx" ON "offers_investment_value" USING btree ("_order");
  CREATE INDEX "offers_investment_value_parent_id_idx" ON "offers_investment_value" USING btree ("_parent_id");
  CREATE INDEX "offers_ala_carte_rows_order_idx" ON "offers_ala_carte_rows" USING btree ("_order");
  CREATE INDEX "offers_ala_carte_rows_parent_id_idx" ON "offers_ala_carte_rows" USING btree ("_parent_id");
  CREATE INDEX "offers_ala_carte_order_idx" ON "offers_ala_carte" USING btree ("_order");
  CREATE INDEX "offers_ala_carte_parent_id_idx" ON "offers_ala_carte" USING btree ("_parent_id");
  CREATE INDEX "settings_cv_idx" ON "settings" USING btree ("cv_id");
  CREATE INDEX "settings_og_image_idx" ON "settings" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_texts" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_texts" CASCADE;
  DROP TABLE "case_studies_kpis" CASCADE;
  DROP TABLE "case_studies_competitors" CASCADE;
  DROP TABLE "case_studies_tokens" CASCADE;
  DROP TABLE "case_studies_breakpoints" CASCADE;
  DROP TABLE "case_studies_images" CASCADE;
  DROP TABLE "case_studies_results" CASCADE;
  DROP TABLE "case_studies_retro" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_texts" CASCADE;
  DROP TABLE "_case_studies_v_version_kpis" CASCADE;
  DROP TABLE "_case_studies_v_version_competitors" CASCADE;
  DROP TABLE "_case_studies_v_version_tokens" CASCADE;
  DROP TABLE "_case_studies_v_version_breakpoints" CASCADE;
  DROP TABLE "_case_studies_v_version_images" CASCADE;
  DROP TABLE "_case_studies_v_version_results" CASCADE;
  DROP TABLE "_case_studies_v_version_retro" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_texts" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_texts" CASCADE;
  DROP TABLE "resource_leads" CASCADE;
  DROP TABLE "team_members_social_links" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "offers_tiers_includes" CASCADE;
  DROP TABLE "offers_tiers_excludes" CASCADE;
  DROP TABLE "offers_tiers" CASCADE;
  DROP TABLE "offers_investment_value" CASCADE;
  DROP TABLE "offers_ala_carte_rows" CASCADE;
  DROP TABLE "offers_ala_carte" CASCADE;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TYPE "public"."enum_projects_category";
  DROP TYPE "public"."enum_projects_discipline";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_category";
  DROP TYPE "public"."enum__projects_v_version_discipline";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_case_studies_images_span";
  DROP TYPE "public"."enum_case_studies_retro_verdict";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_images_span";
  DROP TYPE "public"."enum__case_studies_v_version_retro_verdict";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum_posts_lang";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_lang";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_team_members_social_links_platform";
  DROP TYPE "public"."enum_messages_budget";`)
}
