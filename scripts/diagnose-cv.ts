/**
 * DIAGNOSTIC — prints exactly what Settings.cv resolves to, so we can see
 * whether it's a populated Media object (with a .url) or just a bare
 * unpopulated ID reference, without guessing.
 *
 * Run: npx tsx scripts/diagnose-cv.ts
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

async function main() {
  const payload = await getPayload({ config });

  const settings = await payload.findGlobal({ slug: "settings", overrideAccess: true });
  console.log("=== FULL settings document ===");
  console.log(JSON.stringify(settings, null, 2));

  console.log("\n=== Media collection — last 5 uploads ===");
  const media = await payload.find({ collection: "media", limit: 5, sort: "-createdAt", overrideAccess: true });
  console.log(JSON.stringify(media.docs.map((d) => ({ id: d.id, filename: d.filename, mimeType: d.mimeType, url: d.url })), null, 2));

  process.exit(0);
}
main().catch((err) => { console.error(err); process.exit(1); });