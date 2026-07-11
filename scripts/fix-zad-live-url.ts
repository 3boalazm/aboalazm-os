/**
 * ONE-TIME FIX — corrects the "zad" project's liveUrl in the projects
 * collection from http:// to https://. The site's own iframe embed
 * (/work-ui) is served over HTTPS, so an http:// src there is blocked
 * as mixed content and the preview never loads.
 *
 * This is a data fix, not a schema change — the seed script in
 * scripts/seed.ts only creates documents that don't already exist by
 * slug, so re-running it does not update this field on the existing
 * "zad" record. This script updates that one field on that one
 * existing document and exits.
 *
 * Run once: `npx tsx scripts/fix-zad-live-url.ts`
 * Safe to re-run: no-ops if the URL is already https://.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Same env-loading order as scripts/seed.ts: payload.config.ts reads
// process.env.PAYLOAD_SECRET at module-evaluation time, so .env.local
// must be loaded before the config is imported.
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && match[1] && match[2] !== undefined) process.env[match[1].trim()] ??= match[2].trim();
  }
}
const config = (await import("../payload.config")).default;

const SLUG = "zad";
const WRONG_URL = "http://zad.codeandcanvas.net";
const CORRECT_URL = "https://zad.codeandcanvas.net";

async function main() {
  const payload = await getPayload({ config });

  const res = await payload.find({
    collection: "projects",
    where: { slug: { equals: SLUG } },
    limit: 1,
  });

  const doc = res.docs[0];
  if (!doc) {
    console.error(`No project found with slug "${SLUG}" — nothing to fix.`);
    process.exit(1);
  }

  if (doc.liveUrl !== WRONG_URL) {
    console.log(`liveUrl is already "${doc.liveUrl}" — no change needed.`);
    process.exit(0);
  }

  await payload.update({
    collection: "projects",
    id: doc.id,
    data: { liveUrl: CORRECT_URL },
  });

  console.log(`Fixed: "${SLUG}".liveUrl → "${CORRECT_URL}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
