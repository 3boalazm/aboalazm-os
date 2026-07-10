/**
 * TEMPORARY SEEDING ENDPOINT — seeds the Writing posts into WHATEVER
 * database this deployment is actually connected to. Exists because
 * local seeding kept landing in a different DB than production reads.
 *
 * Protected: requires ?key=<PAYLOAD_SECRET>. Idempotent: skips slugs
 * that already exist with a body, backfills empty bodies.
 *
 * ⚠ DELETE THIS FILE after the production database is seeded.
 */
import { NextResponse, type NextRequest } from "next/server";
import { getPayload } from "@/lib/payload";
import { ARTICLE_BODIES, toLexical } from "@/scripts/writing-content";
import { SYSTEMS_BODIES_EN } from "@/scripts/writing-systems-en";
import { SYSTEMS_BODIES_AR } from "@/scripts/writing-systems-ar";
import { WRITING_POSTS } from "@/scripts/writing-posts-list";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.PAYLOAD_SECRET || key !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await getPayload();
  const report: { slug: string; action: string }[] = [];

  // ?publish=1 — force-publish every existing post (same fix as
  // scripts/publish-all.ts): seeded docs can land as drafts, and the
  // public site only shows _status: published.
  if (req.nextUrl.searchParams.get("publish") === "1") {
    const res = await payload.find({ collection: "posts", limit: 200, overrideAccess: true, draft: true });
    for (const doc of res.docs) {
      await payload.update({
        collection: "posts",
        id: doc.id,
        data: { _status: "published" } as never,
        draft: false,
      });
      report.push({ slug: (doc as { slug?: string }).slug ?? String(doc.id), action: "force-published" });
    }
    const total = await payload.count({ collection: "posts" });
    return NextResponse.json({ done: true, mode: "publish", totalPostsInDb: total.totalDocs, report });
  }

  for (const p of WRITING_POSTS) {
    const lang = p.lang ?? "en";
    const blocks = ARTICLE_BODIES[p.slug] ?? SYSTEMS_BODIES_EN[p.slug] ?? SYSTEMS_BODIES_AR[p.slug];
    const body = blocks ? toLexical(blocks, lang === "ar" ? "rtl" : "ltr") : undefined;

    try {
      const found = await payload.find({
        collection: "posts",
        where: { slug: { equals: p.slug } },
        limit: 1,
      });

      if (found.docs.length > 0) {
        const existing = found.docs[0]!;
        const hasBody = existing.body && JSON.stringify(existing.body).length > 40;
        if (hasBody) {
          report.push({ slug: p.slug, action: "skipped (exists with body)" });
          continue;
        }
        await payload.update({ collection: "posts", id: existing.id, data: { body } as never });
        report.push({ slug: p.slug, action: "backfilled body" });
        continue;
      }

      await payload.create({
        collection: "posts",
        data: { ...p, lang, body } as never,
        draft: false,
      });
      report.push({ slug: p.slug, action: `created (${lang})` });
    } catch (err) {
      report.push({ slug: p.slug, action: `ERROR: ${err instanceof Error ? err.message : String(err)}` });
    }
  }

  const total = await payload.count({ collection: "posts" });
  return NextResponse.json({ done: true, totalPostsInDb: total.totalDocs, report });
}
