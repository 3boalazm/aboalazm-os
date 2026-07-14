/**
 * SEED POSTS ONLY — runs just the Writing-section seeding, skipping
 * projects/case-studies/offers entirely (those upload media, which
 * currently fails because the Vercel Blob store is set to PRIVATE
 * while the payload adapter uploads with public access).
 *
 * Usage: npx tsx scripts/seed-posts.ts
 * Idempotent: existing slugs with bodies are skipped; empty bodies are
 * backfilled. The post list itself lives in writing-posts-list.ts
 * (shared with app/api/seed-posts/route.ts).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import { ARTICLE_BODIES, toLexical } from "./writing-content";
import { SYSTEMS_BODIES_EN } from "./writing-systems-en";
import { SYSTEMS_BODIES_AR } from "./writing-systems-ar";
import { WRITING_POSTS } from "./writing-posts-list";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local BEFORE importing payload.config (see seed.ts for why).
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && match[1] && match[2] !== undefined) process.env[match[1].trim()] ??= match[2].trim();
  }
}
const config = (await import("../payload.config")).default;

// --refresh: rebuild the body of EVERY post from the source files even
// if it already has one (used when article content/blocks change, e.g.
// adding the stats rows). Keeps posts published.
const REFRESH = process.argv.includes("--refresh");

async function main() {
  const payload = await getPayload({ config });
  console.log(`\n▶ Posts (${WRITING_POSTS.length})${REFRESH ? " — REFRESH MODE" : ""}`);

  for (const p of WRITING_POSTS) {
    const lang = p.lang ?? "en";
    const blocks = ARTICLE_BODIES[p.slug] ?? SYSTEMS_BODIES_EN[p.slug] ?? SYSTEMS_BODIES_AR[p.slug];
    const body = blocks ? toLexical(blocks, lang === "ar" ? "rtl" : "ltr") : undefined;
    const found = await payload.find({ collection: "posts", where: { slug: { equals: p.slug } }, limit: 1 });

    if (found.docs.length > 0) {
      const existing = found.docs[0];
      if (!existing) continue;
      if (REFRESH && body) {
        await payload.update({
          collection: "posts",
          id: existing.id,
          data: { body, _status: "published" } as never,
          draft: false,
        });
        console.log(`  ✓ ${p.slug} — body refreshed`);
        continue;
      }
      const hasBody = existing.body && JSON.stringify(existing.body).length > 40;
      if (hasBody) {
        console.log(`  · ${p.slug} — already exists with a body, skipping`);
        continue;
      }
      await payload.update({ collection: "posts", id: existing.id, data: { body } as never });
      console.log(`  ✓ ${p.slug} — backfilled body`);
      continue;
    }

    await payload.create({
      collection: "posts",
      data: { ...p, lang, body, _status: "published" } as never,
      draft: false,
    });
    console.log(`  ✓ ${p.slug} (${lang})`);
  }

  console.log("\n✅ Posts seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
