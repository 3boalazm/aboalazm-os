/**
 * SEED POSTS ONLY — runs just the Writing-section seeding, skipping
 * projects/case-studies/offers entirely (those upload media, which
 * currently fails because the Vercel Blob store is set to PRIVATE
 * while the payload adapter uploads with public access).
 *
 * Usage: npx tsx scripts/seed-posts.ts
 * Idempotent: existing slugs with bodies are skipped; empty bodies are
 * backfilled.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import { ARTICLE_BODIES, toLexical } from "./writing-content";
import { SYSTEMS_BODIES_EN } from "./writing-systems-en";
import { SYSTEMS_BODIES_AR } from "./writing-systems-ar";

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

type SeedPost = {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  lang?: "en" | "ar";
  topics?: string[];
};

const WRITING_POSTS: SeedPost[] = [
  // — Systems series, volume 3 (EN + AR) —
  { index: "W-013", slug: "brand-identity-blueprint", title: "The brand identity blueprint: from core purpose to market touchpoints.", standfirst: "The four-tier stack, the balance-sheet case, the growth loop, and the Brand OS that runs it all.", publishedAt: "2026-08-07", lang: "en", topics: ["brand", "identity", "strategy"] },
  { index: "W-013", slug: "brand-identity-blueprint-ar", title: "مخطط الهوية التجارية: من الغاية الجوهرية إلى نقاط التماس مع السوق.", standfirst: "هرم الطبقات الأربع، القضية المالية، حلقة النمو، ونظام التشغيل الذي يدير كل ذلك.", publishedAt: "2026-08-07", lang: "ar", topics: ["brand", "identity", "strategy"] },
  // — Systems series, volume 2 (EN) —
  { index: "W-012", slug: "brand-case-studies", title: "Case studies in scale: how iconic brands actually run.", standfirst: "Apple, Stripe, Nike, McDonald's, Airbnb — the operating systems behind the logos.", publishedAt: "2026-07-31", lang: "en", topics: ["brand", "case-studies", "strategy"] },
  { index: "W-011", slug: "digital-product-lifecycle", title: "The digital product lifecycle: idea to enterprise, one system.", standfirst: "Smoke tests, the meaning layer, contract-first builds, and the loop that makes scaling repeatable.", publishedAt: "2026-07-24", lang: "en", topics: ["product", "lifecycle", "operations"] },
  { index: "W-010", slug: "ux-strategy-playbook", title: "The UX strategy playbook: engineering meaning and growth.", standfirst: "Discovery, JTBD, the emotional arc, and the KPI dashboard that ties UX to revenue.", publishedAt: "2026-07-17", lang: "en", topics: ["ux", "strategy", "research"] },
  // — Systems series, volume 2 (AR) —
  { index: "W-012", slug: "brand-case-studies-ar", title: "دراسات حالة في التوسع: كيف تعمل العلامات الأيقونية فعلاً.", standfirst: "آبل وStripe ونايكي وماكدونالدز وAirbnb — أنظمة التشغيل خلف الشعارات.", publishedAt: "2026-07-31", lang: "ar", topics: ["brand", "case-studies", "strategy"] },
  { index: "W-011", slug: "digital-product-lifecycle-ar", title: "دورة حياة المنتج الرقمي: من الفكرة إلى المؤسسة بنظام واحد.", standfirst: "اختبارات الدخان، طبقة المعنى، البناء بالعقود أولاً، والحلقة التي تجعل التوسع قابلاً للتكرار.", publishedAt: "2026-07-24", lang: "ar", topics: ["product", "lifecycle", "operations"] },
  { index: "W-010", slug: "ux-strategy-playbook-ar", title: "دليل استراتيجية تجربة المستخدم: هندسة المعنى والنمو.", standfirst: "الاكتشاف، مهام المستخدم، القوس العاطفي، ولوحة المؤشرات التي تربط التجربة بالإيراد.", publishedAt: "2026-07-17", lang: "ar", topics: ["ux", "strategy", "research"] },
  // — Systems series (EN) —
  { index: "W-009", slug: "product-led-expansion", title: "Product-led expansion: UX is a revenue variable.", standfirst: "The product operating model, progressive architecture, and the four metrics UX actually moves.", publishedAt: "2026-07-10", lang: "en", topics: ["product", "operations", "ux"] },
  { index: "W-008", slug: "enterprise-design-systems", title: "Design systems are infrastructure, not UI kits.", standfirst: "Tokens as the single source of truth, semantic naming, and the contribution loop that keeps it alive.", publishedAt: "2026-07-04", lang: "en", topics: ["design-systems", "tokens"] },
  { index: "W-007", slug: "brand-operating-system", title: "The Brand OS: from static assets to dynamic infrastructure.", standfirst: "Twelve pillars, tiered governance, and guidelines a language model can actually consume.", publishedAt: "2026-06-27", lang: "en", topics: ["brand", "governance", "ai"] },
  { index: "W-006", slug: "business-operating-system", title: "The Business Operating System: run the company like software.", standfirst: "The maturity ladder, telemetry, and the meeting pulse that replaces founder memory.", publishedAt: "2026-06-20", lang: "en", topics: ["operations", "systems"] },
  // — Systems series (AR) —
  { index: "W-009", slug: "product-led-expansion-ar", title: "التوسع المرتكز على المنتج: تجربة المستخدم متغير إيرادات.", standfirst: "نموذج تشغيل المنتج، المعمارية التدرجية، والمقاييس الأربعة التي تحركها تجربة المستخدم فعلاً.", publishedAt: "2026-07-10", lang: "ar", topics: ["product", "operations", "ux"] },
  { index: "W-008", slug: "enterprise-design-systems-ar", title: "أنظمة التصميم بنية تحتية، لا مكتبات واجهات.", standfirst: "الرموز كمصدر وحيد للحقيقة، التسمية الدلالية، وحلقة المساهمة التي تبقي النظام حياً.", publishedAt: "2026-07-04", lang: "ar", topics: ["design-systems", "tokens"] },
  { index: "W-007", slug: "brand-operating-system-ar", title: "نظام تشغيل العلامة التجارية: من الأصول الساكنة إلى البنية الديناميكية.", standfirst: "اثنا عشر ركناً، حوكمة مدرجة بالمخاطر، وأدلة يستطيع نموذج لغوي استهلاكها فعلاً.", publishedAt: "2026-06-27", lang: "ar", topics: ["brand", "governance", "ai"] },
  { index: "W-006", slug: "business-operating-system-ar", title: "نظام تشغيل الأعمال: أدر الشركة كبرمجية.", standfirst: "سلم النضج، القياس الحي، وإيقاع الاجتماعات الذي يحل محل ذاكرة المؤسس.", publishedAt: "2026-06-20", lang: "ar", topics: ["operations", "systems"] },
  // — Original essays —
  { index: "W-005", slug: "the-38-day-argument", title: "Why 38 days, not \"it's ready when it's ready.\"", standfirst: "What a fixed timeline actually protects.", publishedAt: "2026-06-01" },
  { index: "W-004", slug: "systems-not-deliverables", title: "Systems, not deliverables.", standfirst: "The handoff test every brand identity should pass and usually doesn't.", publishedAt: "2026-05-01" },
  { index: "W-003", slug: "logo-smallest-part", title: "The logo is the smallest part.", standfirst: "Why guidelines fail and token systems don't.", publishedAt: "2026-04-01" },
  { index: "W-002", slug: "arabic-deserves-design", title: "Arabic deserves design, not translation.", standfirst: "Building bilingual lockups as one system, not two compromises.", publishedAt: "2026-02-01" },
  { index: "W-001", slug: "strategy-is-a-standard", title: "Strategy is a standard, not a phase.", standfirst: "What \"I'll know it when I see it\" actually costs.", publishedAt: "2026-01-01" },
];

async function main() {
  const payload = await getPayload({ config });
  console.log(`\n▶ Posts (${WRITING_POSTS.length})`);

  for (const p of WRITING_POSTS) {
    const lang = p.lang ?? "en";
    const blocks = ARTICLE_BODIES[p.slug] ?? SYSTEMS_BODIES_EN[p.slug] ?? SYSTEMS_BODIES_AR[p.slug];
    const body = blocks ? toLexical(blocks, lang === "ar" ? "rtl" : "ltr") : undefined;
    const found = await payload.find({ collection: "posts", where: { slug: { equals: p.slug } }, limit: 1 });

    if (found.docs.length > 0) {
      const existing = found.docs[0];
      if (!existing) continue;
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
      data: { ...p, lang, body } as never,
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
