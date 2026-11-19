import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { createRevalidators, touchesPublicContent } from "./revalidate";
import { CaseStudies } from "../collections/CaseStudies";
import { Media } from "../collections/Media";
import { Posts } from "../collections/Posts";
import { Projects } from "../collections/Projects";
import { TeamMembers } from "../collections/TeamMembers";
import { Testimonials } from "../collections/Testimonials";
import { Offers } from "../globals/Offers";
import { Settings } from "../globals/Settings";

/**
 * CPU GUARD (19 Nov 2026). Public pages used to re-render at most every 60 s,
 * which exhausted Vercel Hobby's Fluid Active CPU and paused the whole team.
 * The long page TTL is only safe because CMS saves invalidate the site on
 * demand, so these tests pin both halves together.
 */

type Call = [path: string, type: "page" | "layout" | undefined];

function spy() {
  const calls: Call[] = [];
  const hooks = createRevalidators((path, type) => {
    calls.push([path, type]);
  });
  return { calls, hooks };
}

// Payload hook arguments are large; the hooks only read doc / previousDoc.
const args = (doc: unknown, previousDoc?: unknown) => ({ doc, previousDoc }) as never;

test("a published save invalidates its own paths and the whole public site", async () => {
  const { calls, hooks } = spy();
  const hook = hooks.revalidateCollection(["/work", "/"]);
  const out = await hook(args({ slug: "gad", _status: "published" }, { _status: "published" }));
  assert.deepEqual(out, { slug: "gad", _status: "published" });
  assert.deepEqual(calls, [
    ["/work", undefined],
    ["/", undefined],
    ["/work/gad", undefined],
    ["/", "layout"],
  ]);
});

test("draft-only saves and autosave ticks do not invalidate anything", async () => {
  const { calls, hooks } = spy();
  const hook = hooks.revalidateCollection(["/writing"]);
  await hook(args({ slug: "a", _status: "draft" }, undefined));
  await hook(args({ slug: "a", _status: "draft" }, { _status: "draft" }));
  assert.deepEqual(calls, []);
});

test("unpublishing is a public change and invalidates the site", async () => {
  const { calls, hooks } = spy();
  await hooks.revalidateCollection(["/writing"])(args({ slug: "a", _status: "draft" }, { _status: "published" }));
  assert.ok(calls.some(([path, type]) => path === "/" && type === "layout"));
});

test("collections without drafts (no _status) always invalidate", async () => {
  const { calls, hooks } = spy();
  await hooks.revalidateSiteAfterChange(args({ id: 3 }, { id: 3 }));
  assert.deepEqual(calls, [["/", "layout"]]);
});

test("deleting a document invalidates the site, drafts or not", async () => {
  const { calls, hooks } = spy();
  await hooks.revalidateOnDelete(["/case-studies"])(args({ slug: "x", _status: "draft" }));
  assert.ok(calls.some(([path, type]) => path === "/" && type === "layout"));
  assert.ok(calls.some(([path]) => path === "/case-studies/x"));
});

test("globals invalidate the site on save", async () => {
  const { calls, hooks } = spy();
  await hooks.revalidateGlobal(["/pricing"])(args({}, {}));
  assert.deepEqual(calls, [
    ["/pricing", undefined],
    ["/", "layout"],
  ]);
});

test("outside a Next.js request (seed scripts) invalidation never throws", async () => {
  const hooks = createRevalidators(() => {
    throw new Error("Invariant: static generation store missing");
  });
  const doc = { slug: "a", _status: "published" };
  assert.equal(await hooks.revalidateCollection(["/writing"])(args(doc, doc)), doc);
  assert.equal(await hooks.revalidateOnDelete(["/writing"])(args(doc)), doc);
  assert.equal(await hooks.revalidateGlobal(["/pricing"])(args(doc, doc)), doc);
});

test("touchesPublicContent: only unpublished draft work is ignored", () => {
  assert.equal(touchesPublicContent({ _status: "draft" }, undefined), false);
  assert.equal(touchesPublicContent({ _status: "draft" }, { _status: "draft" }), false);
  assert.equal(touchesPublicContent({ _status: "draft" }, { _status: "published" }), true);
  assert.equal(touchesPublicContent({ _status: "published" }, { _status: "draft" }), true);
  assert.equal(touchesPublicContent({}, {}), true);
  assert.equal(touchesPublicContent(null, null), true);
});

test("every content collection and global that feeds a public page has a site-invalidating hook", () => {
  for (const c of [Projects, CaseStudies, Posts, Media, Testimonials, TeamMembers]) {
    assert.ok((c.hooks?.afterChange?.length ?? 0) > 0, `${c.slug} needs an afterChange revalidation hook`);
    assert.ok((c.hooks?.afterDelete?.length ?? 0) > 0, `${c.slug} needs an afterDelete revalidation hook`);
  }
  for (const g of [Offers, Settings]) {
    assert.ok((g.hooks?.afterChange?.length ?? 0) > 0, `${g.slug} needs an afterChange revalidation hook`);
  }
});

test("collections that are written by visitors never invalidate the site", () => {
  // A lead form or an analytics beacon that revalidated every page would recreate the CPU problem.
  for (const file of ["AnalyticsEvents", "Messages", "ResourceLeads", "SessionFiles", "SessionRegistrations", "Users"]) {
    const source = readFileSync(join(process.cwd(), "collections", `${file}.ts`), "utf8");
    assert.ok(!/@\/lib\/revalidate/.test(source), `collections/${file}.ts must not import lib/revalidate`);
  }
});

function pageFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) pageFiles(full, out);
    else if (/^(page|layout|route)\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

test("no route re-renders more often than hourly", () => {
  const found: { file: string; seconds: number }[] = [];
  for (const file of pageFiles(join(process.cwd(), "app"))) {
    const match = /^export const revalidate = (\d+)\b/m.exec(readFileSync(file, "utf8"));
    if (match) found.push({ file, seconds: Number(match[1]) });
  }
  assert.ok(found.length >= 14, `expected the CMS-backed pages to declare a TTL, found ${found.length}`);
  for (const { file, seconds } of found) {
    assert.ok(seconds >= 3600, `${file}: revalidate = ${seconds} is below one hour (CMS saves already invalidate on demand)`);
  }
});
