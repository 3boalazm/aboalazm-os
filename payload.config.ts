import path from "path";
import { fileURLToPath } from "url";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
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
 * DB ADAPTER — currently SQLite for local/dev verification only (no
 * external network access needed). For production on Vercel, swap:
 *
 *   import { postgresAdapter } from "@payloadcms/db-postgres";
 *   db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })
 *
 * — and point DATABASE_URI at the Neon/Supabase connection string. No other
 * code changes needed; Payload's adapters are interchangeable by design.
 */

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: " — Aboalazm OS Studio",
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./aboalazm-cms.db",
    },
  }),
});
