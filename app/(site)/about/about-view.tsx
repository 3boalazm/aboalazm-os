"use client";
import Link from "next/link";
import { SystemConstellation } from "@/features/hero";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";
import { Icon } from "@/components/ui/Icon";
import { Heading } from "@/components/ui/Heading";

const DOCTRINE = {
  en: [
    ["Strategy before design", "No logo until positioning, audience, and personality are agreed in writing — without strategy there's no way to judge."],
    ["Systems, not artifacts", "A logo is the entry. The real work is the system that follows, so the brand stays itself across every touchpoint."],
    ["Show the work", "A logo on a white page is theory; on a business card, a package, a screen — that's the test."],
    ["Deliver, don't dump", "Final files come with guidelines, a handover call, and 30 days of support. Done means the team can run with it."],
  ],
  ar: [
    ["الاستراتيجية قبل التصميم", "لا لوجو قبل الاتفاق كتابيًا على التموضع والجمهور والشخصية — بدون استراتيجية ما في معيار للحكم."],
    ["أنظمة لا قطع منفردة", "اللوجو هو المدخل. الشغل الحقيقي هو النظام اللي بيليه، عشان البراند يفضل نفسه على كل نقطة تواصل."],
    ["أظهر الشغل", "لوجو على ورقة بيضاء نظرية؛ على كارت بيزنيس وتغليف وشاشة — ده الاختبار الحقيقي."],
    ["سلّم ولا تكوّم", "الملفات النهائية بتيجي مع دليل الهوية واجتماع تسليم و30 يوم دعم. خلصنا يعني الفريق يقدر يشتغل."],
  ],
} as const;

const TIMELINE = {
  en: [
    ["2024 →", "Co-Founder & Creative Lead", "Code & Canvas — branding & web for SMEs across Egypt and the region"],
    ["2020–25", "Media Director & Account Manager", "Nile Pharma Food — brand system, packaging and campaign governance"],
    ["2020–21", "Studio Lead & Visual Director", "Learn in Arabic (MSP) — identity + DIY studio built from scratch"],
    ["2019–21", "Head of Media ×2 Seasons", "Youth Scope — full identity twice; Best Head, both seasons"],
    ["2022 →", "Brand Identity Designer & Consultant (Freelance)", "4+ years focused on brand identity and systems; 20+ clients and organizations across pharma, food, education, NGOs, government"],
  ],
  ar: [
    ["2024 →", "شريك مؤسس ومدير إبداعي", "Code & Canvas — هوية بصرية ووب للشركات الصغيرة والمتوسطة في مصر والمنطقة"],
    ["2020–25", "مدير الميديا ومدير الحسابات", "نايل فارما فود — نظام هوية وتغليف وحوكمة الحملات"],
    ["2020–21", "مدير الاستوديو والمدير البصري", "تعلّم بالعربي (MSP) — هوية + استوديو DIY من الصفر"],
    ["2019–21", "رئيس لجنة الميديا ×2 مواسم", "Youth Scope — هوية كاملة مرتين؛ أفضل رئيس، موسمان"],
    ["2022 ←", "مصمم هوية بصرية ومستشار (فريلانسر)", "أكثر من 4 سنوات في الهوية والأنظمة؛ أكثر من 20 عميلاً ومؤسسة في الصيدلة والغذاء والتعليم والجمعيات والحكومة"],
  ],
} as const;

const FACTS = {
  en: [
    ["CURRENT STATUS", "Open to Brand Identity Designer roles | Riyadh / Remote"],
    ["BASED", "Al Obour, Egypt — open to Riyadh & remote"],
    ["LANGUAGES", "Arabic (Native) · English (Professional)"],
    ["EDUCATION", "B.Sc. — Al-Azhar University · 2017–2024"],
    ["TRAINING", "MSP · Youth Scope · AYB · Bedaya · Resalah"],
  ],
  ar: [
    ["الوضع الحالي", "متاح لفرص مصمم هوية بصرية | الرياض / عن بُعد"],
    ["الموقع", "العبور، مصر — متاح للرياض والعمل عن بُعد"],
    ["اللغات", "العربية (أصيل) · الإنجليزية (مهني)"],
    ["التعليم", "بكالوريوس — جامعة الأزهر · 2017–2024"],
    ["التدريب", "MSP · يوث سكوب · AYB · بداية · رسالة"],
  ],
} as const;

export function AboutView({ cvUrl }: { cvUrl: string | null }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = useT();
  const doctrine = ar ? DOCTRINE.ar : DOCTRINE.en;
  const timeline = ar ? TIMELINE.ar : TIMELINE.en;
  const facts = ar ? FACTS.ar : FACTS.en;

  return (
    <main className="container-content flex flex-col gap-16 py-16">
      <header className="flex flex-col gap-4">
        <Heading
          eyebrow={ar ? t.aboutSection : t.aboutSection}
          title={
            ar ? (
              <>{t.aboutH1a} <em>{t.aboutH1b}</em></>
            ) : (
              <>{t.aboutH1a} <em>{t.aboutH1b}</em></>
            )
          }
          titleClassName="heading-fit-long max-w-[18ch] text-balance-pretty"
          subtitle={
            ar
              ? "مصطفى أبوالعزم بدأ التصميم المهني في 2017 ولم يتوقف. مصمم هوية بصرية أول، وشريك مؤسس في Code & Canvas، يعمل من العبور مصر على مشاريع عالمية: استراتيجية براند، أنظمة تصميم، ووب — بلغتين، تحت مبدأ واحد."
              : "Mustafa Aboalazm started designing professionally in 2017 — and never stopped. Senior Brand Identity Designer, Co-founder of Code & Canvas, based in Al Obour, Egypt, working worldwide: brand strategy, design systems, and the web they ship to, in two languages, under one doctrine."
          }
          subtitleClassName="max-w-[52ch]"
        />

        <dl className="grid grid-cols-1 gap-2 border-y border-border-subtle py-3 sm:grid-cols-2">
          {facts.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{k}</dt>
              <dd className="text-body-sm text-text-secondary">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={cvUrl ?? "/cv"}
            download="Mustafa_Taha_Brand_Identity_CV.docx"
            className="inline-flex w-fit items-center gap-2 rounded-pill bg-accent px-4 py-2 font-mono text-micro uppercase tracking-[0.08em] text-obsidian transition-transform duration-fast ease-physics hover:-translate-y-0.5"
          >
            <>{ar ? "تحميل السيرة الذاتية (Word)" : "Download CV (Word)"} <Icon name="arrow-down" /></>
          </a>
          <Link
            href="/for-hiring"
            className="inline-flex w-fit items-center gap-2 rounded-pill border border-border-default px-4 py-2 font-mono text-micro uppercase tracking-[0.08em] text-text-primary transition-colors duration-fast ease-physics hover:border-accent hover:text-accent"
          >
            <>{ar ? "ملف المرشح للشركات والتوظيف" : "For Hiring Teams Dossier"} <Icon name="arrow-right" /></>
          </Link>
        </div>
      </header>

      <section aria-label={t.aboutAriaDoctrine} className="flex flex-col">
        <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? t.aboutDoctrine : t.aboutDoctrine}
        </p>
        {doctrine.map(([title, body], i) => (
          <div key={i} className="border-t border-border-subtle py-3 last:border-b">
            <p className="font-display text-title tracking-[-0.015em] text-text-primary">
              <span className="mr-2 font-mono text-label text-accent">0{i + 1}</span>
              {title}
            </p>
            <p className="mt-1 max-w-[60ch] text-body-sm text-text-secondary">{body}</p>
          </div>
        ))}
      </section>

      <section aria-label={t.aboutAriaCareer}>
        <p className="pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? t.aboutCareer : t.aboutCareer}
        </p>
        {timeline.map(([year, role, note]) => (
          <div
            key={role}
            className="grid grid-cols-[6rem_1fr] items-baseline gap-2 border-b border-border-subtle py-2 md:grid-cols-[6rem_16rem_1fr]"
          >
            <span className="font-mono text-label text-text-tertiary">{year}</span>
            <span className="text-body text-text-primary">{role}</span>
            <span className="col-span-2 text-body-sm text-text-secondary md:col-span-1">{note}</span>
          </div>
        ))}
      </section>

      <section aria-label={t.aboutAriaSystem} className="flex flex-col items-center gap-4">
        <p className="max-w-[52ch] text-center text-lead text-text-secondary">
          {ar
            ? "كل مشروع يسير في نفس السلسلة: البراند يُترجَم لتوكنز، التوكنز لكومبوننتس، الكومبوننتس لصفحات، الصفحات لتجربة."
            : "Every engagement runs the same chain: brand compiles into tokens, tokens into components, components into pages, pages into experience."}
        </p>
        <SystemConstellation />
      </section>
    </main>
  );
}
