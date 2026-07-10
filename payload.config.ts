import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { CaseStudies } from "./collections/CaseStudies";
import { Testimonials } from "./collections/Testimonials";
import { Posts } from "./collections/Posts";
import { ResourceLeads } from "./collections/ResourceLeads";
import { TeamMembers } from "./collections/TeamMembers";
import { Messages } from "./collections/Messages";
import { Offers } from "./globals/Offers";
import { Settings } from "./globals/Settings";

/**
 * PAYLOAD CONFIG — Aboalazm OS content engine.
 *
 * DB ADAPTER — Postgres (Neon), used for BOTH local dev and production.
 * Point DATABASE_URI at your Neon connection string in .env.local (dev)
 * and in Vercel → Project → Settings → Environment Variables (prod).
 *
 * We switched off the earlier SQLite-for-dev setup: SQLite is a local
 * file, and Vercel's serverless functions have an ephemeral, per-invocation
 * filesystem — it would silently reset (or fail to persist) on every
 * request. Postgres everywhere avoids that entire class of bug, and Neon's
 * free tier is enough for this project's scale in dev and prod alike.
 *
 * ⚠️ MEDIA STORAGE — this was the actual bug behind "images not showing
 * on the live site": Payload's Media collection defaulted to LOCAL DISK
 * storage the whole time. That works fine on your own machine (which is
 * why every screenshot during development looked correct), but Vercel's
 * serverless functions have no persistent disk — anything uploaded via
 * scripts/seed.ts on your machine only ever existed on your machine.
 * `vercelBlobStorage` below fixes this for good: uploads go to real,
 * durable cloud storage instead. It needs `BLOB_READ_WRITE_TOKEN` — see
 * RUN_LOCALLY.md for how to get one. Without that token set, the plugin
 * quietly falls back to local storage (same broken behavior as before),
 * so this only really goes into effect once the token exists.
 */

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: " — Aboalazm OS Studio",
      icons: [{ url: "/images/work/icon.png", rel: "icon" }],
    },
  },
  collections: [
    Users,
    Media,
    Projects,
    CaseStudies,
    Testimonials,
    Posts,
    ResourceLeads,
    TeamMembers,
    Messages,
  ],
  globals: [Offers, Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
