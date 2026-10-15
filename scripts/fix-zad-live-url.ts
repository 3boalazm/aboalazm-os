/**
 * ONE-TIME CMS SYNC — update the existing Zad document to the current
 * Vercel demo URL. The regular seed is intentionally create-only for
 * existing slugs, so this small repair keeps the Payload record aligned.
 *
 * Run: `npx tsx scripts/fix-zad-live-url.ts`
 * Safe to re-run: no-ops when both links already match.
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
const CORRECT_URL = "https://zadullashr.vercel.app/";

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

  if (doc.liveUrl === CORRECT_URL && doc.externalUrl === CORRECT_URL) {
    console.log(`Both links already point to "${CORRECT_URL}" — no change needed.`);
    process.exit(0);
  }

  await payload.update({
    collection: "projects",
    id: doc.id,
    data: { liveUrl: CORRECT_URL, externalUrl: CORRECT_URL },
  });

  console.log(`Updated: "${SLUG}" links → "${CORRECT_URL}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
