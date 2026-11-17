import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { resolveBlobToken } from "./lib/blob-token";
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
import { AnalyticsEvents } from "./collections/AnalyticsEvents";
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
      icons: [{ url: "/images/work/portrait-256.png", rel: "icon" }],
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
    AnalyticsEvents,
  ],
  globals: [Offers, Settings],
  /**
   * EDITOR — default Lexical features plus two custom blocks used by the
   * Writing section (rendered in features/writing/article-body.tsx):
   *   · diagram   — a Mermaid definition, rendered client-side
   *   · dataTable — pipe-separated rows ("A | B | C"), first row = header
   * Registering them here keeps seeded block nodes fully editable from
   * the admin dashboard instead of crashing the editor on unknown nodes.
   */
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          {
            slug: "diagram",
            labels: { singular: "Diagram (Mermaid)", plural: "Diagrams (Mermaid)" },
            fields: [
              {
                name: "code",
                type: "textarea",
                required: true,
                admin: { description: "Mermaid definition, e.g. flowchart TD …" },
              },
              { name: "caption", type: "text" },
            ],
          },
          {
            slug: "dataTable",
            labels: { singular: "Data Table", plural: "Data Tables" },
            fields: [
              {
                name: "markdown",
                type: "textarea",
                required: true,
                admin: {
                  description: "One row per line, cells separated by ' | '. First line is the header.",
                },
              },
            ],
          },
          {
            slug: "stats",
            labels: { singular: "Stats Row", plural: "Stats Rows" },
            fields: [
              {
                name: "items",
                type: "array",
                minRows: 2,
                maxRows: 4,
                fields: [
                  { name: "value", type: "text", required: true },
                  { name: "label", type: "text", required: true },
                ],
                admin: { description: "Key figures rendered as animated counter cards." },
              },
            ],
          },
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    // Schema push is a local-development convenience only. Preview and
    // Production must use reviewed migrations and must never mutate the
    // shared database during a build or a diagnostic script.
    //
    // PAYLOAD_DISABLE_PUSH=1 opts out while still running under NODE_ENV=dev.
    // It exists because the push generator cannot currently build this schema
    // from scratch: `projects.status` and Payload's own `_status` are mapped to
    // the same enum name, so every fresh push fails on a value-set collision
    // (see docs/studio/03_SCHEMA_FINDINGS.md). Migrations are applied instead,
    // and this flag lets a dev server read that migrated database.
    push: process.env.NODE_ENV === "development" && process.env.PAYLOAD_DISABLE_PUSH !== "1",
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      // lib/blob-token.ts: a malformed token must not crash the whole CMS
      token: resolveBlobToken(),
    }),
  ],
});
