/**
 * ONE-TIME FIX — force-publishes every existing Project / CaseStudy / Post.
 *
 * Why this exists: the seed script skips documents that already exist (by
 * slug), so if an earlier seed run (before draft/publish filtering was
 * added to the public site) created these as drafts, re-running seed.ts
 * never fixes their status — it just says "already exists, skipping".
 * This script re-saves every doc with `_status: published` directly,
 * regardless of its current status.
 *
 * Run: npx tsx scripts/publish-all.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && match[1] && match[2] !== undefined) process.env[match[1].trim()] ??= match[2].trim();
  }
}
const config = (await import("../payload.config")).default;
const { getPayload } = await import("payload");

async function publishAll(collection: "projects" | "case-studies" | "posts") {
  const payload = await getPayload({ config });
  const res = await payload.find({ collection, limit: 200, overrideAccess: true, draft: true });
  let count = 0;
  for (const doc of res.docs) {
    await payload.update({
      collection,
      id: doc.id,
      data: { _status: "published" } as never,
      draft: false,
    });
    console.log(`  ✓ published: ${(doc as { slug?: string; name?: string; title?: string }).slug ?? (doc as { name?: string }).name ?? doc.id}`);
    count++;
  }
  console.log(`${collection}: ${count} doc(s) force-published.\n`);
}

async function main() {
  console.log("▶ Projects");
  await publishAll("projects");
  console.log("▶ Case Studies");
  await publishAll("case-studies");
  console.log("▶ Posts");
  await publishAll("posts");
  console.log("✅ Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
