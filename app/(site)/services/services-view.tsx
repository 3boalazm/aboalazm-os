"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { PROCESS, type Bi } from "@/lib/offers";
import { SectionHead, TierGrid, Faq, CtaBand, pick } from "@/features/offers/offer-blocks";

const OFFERINGS: readonly { n: string; name: Bi; italic: Bi; body: Bi }[] = [
  { n: "01", name: ["Brand Identity &", "هوية &"], italic: ["Strategy", "استراتيجية البراند"], body: ["Brand audit · competitor & cultural research · positioning & archetype · naming · logo systems · color & typography · brand guidelines.", "مراجعة البراند · بحث المنافسين والثقافة · التموضع والنموذج · التسمية · أنظمة الشعار · الألوان والخطوط · دليل الهوية."] },
  { n: "02", name: ["Visual &", "أنظمة بصرية &"], italic: ["Design Systems", "تصميمية"], body: ["Cohesive systems for digital and print — templates, social kits, presentation systems, components, and reusable assets your team can run with.", "أنظمة متماسكة للديجيتال والمطبوعات — قوالب، حزم سوشيال، أنظمة عروض، ومكوّنات قابلة لإعادة الاستخدام يقدر فريقك يشتغل بها."] },
  { n: "03", name: ["Web Design &", "تصميم ويب &"], italic: ["WordPress", "ووردبريس"], body: ["Responsive websites in Figma, built on WordPress or Webflow. UX-led, brand-aligned, mobile-first. From landing pages to full corporate sites.", "مواقع متجاوبة تُصمَّم في Figma وتُبنى على ووردبريس أو Webflow — تجربة مستخدم أولًا ومتوافقة مع الهوية، من صفحات الهبوط للمواقع الكاملة."] },
  { n: "04", name: ["Print &", "مطبوعات &"], italic: ["Packaging", "تغليف"], body: ["Production-ready print collateral — packaging, brochures, company profiles, banners, rollups — with proper file prep for offset and digital.", "مطبوعات جاهزة للإنتاج — تغليف، بروشورات، بروفايلات شركات، بانرات ورول أب — بتجهيز ملفات سليم للأوفست والديجيتال."] },
  { n: "05", name: ["Art Direction &", "إدارة فنية &"], italic: ["Production", "إنتاج"], body: ["Photography, videography, scripting, voice-over, audio engineering — full content production for campaigns and social.", "تصوير فوتوغرافي وفيديو، كتابة سكريبت، تعليق صوتي، وهندسة صوت — إنتاج محتوى كامل للحملات والسوشيال."] },
];

const FAQ: readonly { q: Bi; a: Bi }[] = [
  { q: ["How long does a full brand identity take?", "كم تستغرق الهوية الكاملة؟"], a: ["Roughly 5–6 weeks for a standard project — 38 days from kickoff to delivery, including discovery, strategy, two design rounds, and final files. Tighter timelines are possible at premium pricing.", "حوالي ٥–٦ أسابيع للمشروع القياسي — ٣٨ يومًا من البدء للتسليم، شاملة البحث والاستراتيجية وجولتي مراجعة والملفات النهائية. الجداول الأضيق ممكنة بتسعير أعلى."] },
  { q: ['What\'s included in a "Brand Guidelines" document?', "ماذا يتضمن دليل الهوية؟"], a: ["A 20–40 page PDF covering logo usage (do's & don'ts), color codes (HEX/RGB/CMYK/Pantone), typography hierarchy, spacing rules, voice & tone, and ready-to-use templates — designed for your team to apply the brand without me.", "ملف PDF من ٢٠–٤٠ صفحة يغطي استخدامات الشعار، أكواد الألوان، هرمية الخطوط، قواعد المسافات، نبرة الصوت، وقوالب جاهزة — ليطبّق فريقك الهوية بدوني."] },
  { q: ["How many revision rounds do I get?", "كم جولة مراجعة لديّ؟"], a: ["Two structured rounds are included. After that, additional revisions are billed hourly — not a limit on your input, but a structure that protects the strategy from ad-hoc erosion.", "جولتان منظمتان ضمن السعر، وما بعدهما يُحاسب بالساعة — ليس تقييدًا لرأيك بل حماية للاستراتيجية من التعديلات العشوائية."] },
  { q: ["Do you work with international clients?", "هل تتعامل مع عملاء دوليين؟"], a: ["Yes — most communication is over email and Notion with weekly video calls. I work in both English and Arabic, with clients across MENA and beyond.", "نعم — أغلب التواصل عبر الإيميل وNotion مع مكالمات أسبوعية، وأعمل بالعربية والإنجليزية مع عملاء في المنطقة وخارجها."] },
  { q: ["How does payment work?", "كيف يتم الدفع؟"], a: ["50% deposit before kickoff, 50% before final file delivery. Bank transfer, Vodafone Cash, or international wire. No start without deposit, no final files without balance — protects both sides.", "٥٠٪ مقدّم قبل البدء و٥٠٪ قبل تسليم الملفات النهائية — تحويل بنكي أو فودافون كاش أو تحويل دولي. لا بداية بدون المقدّم ولا تسليم بدون الباقي، حمايةً للطرفين."] },
  { q: ["Can you also build the website?", "هل تبني الموقع أيضًا؟"], a: ["Yes — responsive WordPress sites (and Webflow when it fits), from landing pages to full corporate sites. Best done with the identity so the system stays cohesive.", "نعم — مواقع ووردبريس متجاوبة (وWebflow عند الحاجة)، والأفضل تنفيذها مع الهوية ليبقى النظام متماسكًا."] },
  { q: ["What if I just need a logo, not the full system?", "ماذا لو أحتاج شعارًا فقط؟"], a: ["Logo-only sprints exist under Tier 01 — but honestly, a logo without strategy is a coin flip. If budget is tight, we shrink the system, not skip the strategy.", "متاح ضمن الفئة ٠١ — لكن بصراحة: شعار بدون استراتيجية رهان عشوائي. لو الميزانية ضيقة نُصغّر النظام، لا نتخطى الاستراتيجية."] },
];

export function ServicesView({ tiers }: { tiers: import("@/lib/offers").Tier[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <main className="container-content flex flex-col gap-16 py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          {ar ? "الخدمات / التعاقد" : "SERVICES / ENGAGEMENT"}
        </p>
        <h1 className="font-display text-display tracking-[-0.025em]">
          {ar ? "استراتيجية، هوية، " : "Strategy, identity, "}
          <em className="text-accent">{ar ? "أنظمة." : "systems."}</em>
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">
          {ar
            ? "من أول بريف إبداعي إلى دليل الهوية الذي يستخدمه فريقك فعلًا — خمس خدمات، استوديو واحد، بلا فجوات تسليم."
            : "From the first creative brief to the brand guidelines your team actually uses — five services, one studio, no handoff gaps."}
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <SectionHead label={["01 / OFFERINGS", "٠١ / الخدمات"]} title={["Five things I do", "خمسة أشياء أتقنها"]} italic={["well.", "جيدًا."]} />
        <div className="flex flex-col">
          {OFFERINGS.map((o) => (
            <div key={o.n} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-2 border-t border-border-subtle py-3 last:border-b md:grid-cols-[2.5rem_18rem_1fr]">
              <span className="font-mono text-micro text-text-ghost">{o.n}</span>
              <p className="font-display text-title tracking-[-0.015em]">
                {pick(o.name, lang)} <em className="text-accent">{pick(o.italic, lang)}</em>
              </p>
              <p className="col-span-2 text-body-sm text-text-secondary md:col-span-1">{pick(o.body, lang)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["02 / PROCESS", "٠٢ / المنهجية"]} title={["A four-act", "منهج من أربع مراحل،"]} italic={["method, refined over nine years.", "صُقل عبر تسع سنوات."]} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div key={p.n} className="rounded-card border border-border-subtle bg-surface-1 p-3">
              <p className="font-display text-title text-accent">{p.n}</p>
              <p className="text-body text-text-primary">{pick(p.name, lang)}</p>
              <p className="mt-1 text-body-sm text-text-secondary">{pick(p.body, lang)}</p>
              <p className="mt-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{pick(p.days, lang)}</p>
            </div>
          ))}
        </div>
        <Link href="/process" className="group mx-auto mt-1 flex w-fit items-center gap-2 font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-accent">
          {ar ? "شوف المنهجية كاملة — ٣٨ يوم بالتفصيل" : "See the full 38-day method, gate by gate"}
          <span aria-hidden className="transition-transform duration-base ease-physics group-hover:translate-x-1">→</span>
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["03 / ENGAGEMENT", "٠٣ / التعاقد"]} title={["Three ways to", "ثلاث طرق"]} italic={["work together.", "للعمل معًا."]} />
        <TierGrid tiers={tiers} />
        <p className="text-center font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "— التسعير يختلف حسب النطاق · ريتينر مخصص متاح · خصم على الدفع الكامل مقدمًا —" : "— Project pricing varies by scope · Custom retainers available · Discount on full prepayment —"}
        </p>
        <div className="flex justify-center gap-2">
          <Link href="/pricing" className="rounded-pill bg-accent px-3 py-1.5 font-mono text-label uppercase tracking-[0.06em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5">
            {ar ? "التسعير التفصيلي ✦" : "View Detailed Pricing ✦"}
          </Link>
          <Link href="/agreement" className="glass rounded-pill px-3 py-1.5 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary">
            {ar ? "اقرأ الاتفاقية →" : "Read Full Agreement →"}
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["04 / FAQ", "٠٤ / أسئلة شائعة"]} title={["Common", "أسئلة"]} italic={["questions.", "متكررة."]} />
        <Faq items={FAQ} />
      </section>

      <CtaBand kicker={["READY TO BUILD?", "جاهز نبدأ؟"]} title={["Send the", "ابعت"]} italic={["brief.", "البريف."]} primary={["Start a Project", "ابدأ مشروعًا"]} primaryHref="/contact" secondary={["See the Work", "شاهد الأعمال"]} secondaryHref="/work" />
    </main>
  );
}
