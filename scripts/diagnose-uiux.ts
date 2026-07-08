/**
 * DIAGNOSTIC — prints the exact stored fields for nile-pharma-erp and zad,
 * both as drafts AND as published, so we can see precisely why /work-ui
 * shows nothing instead of guessing.
 *
 * Run: npx tsx scripts/diagnose-uiux.ts
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

  for (const slug of ["nile-pharma-erp", "zad"]) {
    console.log(`\n=== ${slug} ===`);
    const res = await payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
      overrideAccess: true,
      draft: true, // see the doc regardless of its status
      limit: 1,
    });
    const doc = res.docs[0];
    if (!doc) {
      console.log("  ❌ NOT FOUND IN DATABASE AT ALL");
      continue;
    }
    console.log("  id:", doc.id);
    console.log("  _status:", (doc as { _status?: string })._status);
    console.log("  isUiUx:", doc.isUiUx);
    console.log("  liveUrl:", doc.liveUrl);
    console.log("  hasCaseStudy:", doc.hasCaseStudy);
    console.log("  name:", doc.name);
  }

  console.log("\n=== what getUiUxProjects() (the actual public query) returns ===");
  const res = await payload.find({
    collection: "projects",
    where: { and: [{ isUiUx: { equals: true } }, { liveUrl: { exists: true } }] },
    limit: 100,
    overrideAccess: false, // exactly like the real public site
  });
  console.log(`  ${res.docs.length} doc(s):`, res.docs.map((d) => d.slug));

  process.exit(0);
}
main().catch((err) => { console.error(err); process.exit(1); });
