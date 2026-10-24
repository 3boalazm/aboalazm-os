import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "./contact-details";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

test("the public email and mailto destination are a single canonical value", () => {
  assert.equal(CONTACT_EMAIL, "m1aboalazm@gmail.com");
  assert.equal(CONTACT_EMAIL_HREF, `mailto:${CONTACT_EMAIL}`);

  for (const path of [
    "app/(site)/[locale]/contact/contact-view.tsx",
    "features/contact/contact-form.tsx",
    "components/layout/footer.tsx",
    "lib/email.ts",
    "lib/structured-data.ts",
    "features/portfolio/data.ts",
  ]) {
    const source = read(path);
    assert.match(source, /contact-details/iu, `${path} should use the canonical contact module`);
    assert.doesNotMatch(source, /mailto:m1aboalazm@gmail\.com/iu, `${path} should not keep a duplicated mailto literal`);
  }
});

test("the configured public origin is the stable Vercel project domain", () => {
  const site = read("lib/site.ts");
  const envExample = read(".env.example");
  assert.match(site, /const FALLBACK = "https:\/\/aboalazm-os\.vercel\.app"/u);
  assert.match(envExample, /^NEXT_PUBLIC_SITE_URL=https:\/\/aboalazm-os\.vercel\.app$/mu);
  assert.doesNotMatch(site, /aboalazm\.com/iu);
});

test("the standalone portfolio deck uses the canonical email and domain and avoids retired outcome claims", () => {
  const window: { DATA?: any } = {};
  runInNewContext(read("portfolio/js/data.js"), { window });
  assert.ok(window.DATA, "expected portfolio data to initialize");
  const data = window.DATA;
  assert.equal(data.identity.email, CONTACT_EMAIL);
  assert.equal(data.identity.links.find((link: { label: string }) => link.label === "WEBSITE")?.href, "https://aboalazm-os.vercel.app");
  const nile = data.projects.find((project: { slug: string }) => project.slug === "nile-pharma");
  assert.ok(nile, "Nile Pharma case should remain in the deck");
  assert.doesNotMatch(JSON.stringify(nile), /\+40%|\+25%|team reported|reported by team/iu);
  assert.ok(data.timeline.some((entry: { role: string; yr: string }) => entry.yr === "2026 →" && entry.role === "Digital Product & Platform Lead"));
});
