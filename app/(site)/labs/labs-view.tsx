"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/providers/lang-provider";
import { SectionHead, CtaBand, pick } from "@/features/offers/offer-blocks";
import { Heading } from "@/components/ui/Heading";
import { PanelCard } from "@/components/ui/PanelCard";
import { TypeScaleTool, ContrastCheckerTool, BilingualToggleTool } from "@/features/labs-tools";
import {
  RESEARCH_AREAS,
  PROJECTS,
  NOTES,
  METHOD,
  OPEN_FRAMEWORKS,
  type Status,
} from "@/lib/labs";

const WHY: readonly [string, string][] = [
  ["Reduce uncertainty", "تقليل عدم اليقين"],
  ["Improve decision quality", "تحسين جودة القرار"],
  ["Build repeatable systems", "بناء أنظمة قابلة للتكرار"],
  ["Create scalable operations", "خلق عمليات قابلة للتوسّع"],
  ["Connect strategy with execution", "ربط الاستراتيجية بالتنفيذ"],
];

const statusClass: Record<Status, string> = {
  active: "border-accent/50 text-accent",
  dev: "border-border-strong text-text-secondary",
  experimental: "border-border-subtle text-text-tertiary",
};

export function LabsView() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <main className="container-content flex flex-col gap-8 py-6">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "المعمل / البحث والتطوير" : "LABS / R&D"}
          title={
            <>
              {ar ? "حيث تُختبر الأنظمة " : "Where systems are tested "}
              <em className="text-accent">{ar ? "قبل أن تصبح أطرًا." : "before they become frameworks."}</em>
            </>
          }
          subtitle={
            ar
              ? "Aboalazm Labs هو طبقة البحث والتجريب خلف Aboalazm OS — قسم الـ R&D للبراندينج وأنظمة الهوية وعمليات التصميم والتدفقات المدعومة بالذكاء الاصطناعي."
              : "Aboalazm Labs is the research and experimentation layer behind Aboalazm OS — the R&D department for branding, identity systems, design operations, and AI-powered creative workflows."
          }
          titleClassName="heading-fit-long"
          subtitleClassName="max-w-[58ch]"
        />
        <p className="max-w-[58ch] text-body text-text-secondary">
          {ar
            ? "ليست كل تجربة تنجح. كل تجربة تُعلّم. والأطر التي تُنشر علنًا وُلدت هنا أولًا."
            : "Not every experiment succeeds. Every experiment teaches. Every public framework was born here first."}
        </p>
      </header>

      {/* Why */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["01 / WHY", "01 / لماذا"]}
          title={["Built on testing,", "مبنيّ على"]}
          italic={["not assumption.", "الاختبار لا الافتراض."]}
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map(([en, arr], i) => (
            <div
              key={en}
              className="flex items-center gap-2 rounded-card border border-border-subtle bg-surface-1 px-3 py-2.5"
            >
              <span className="font-mono text-micro text-text-ghost">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-body-sm text-text-primary">{ar ? arr : en}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Research areas */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["02 / RESEARCH AREAS", "02 / مجالات البحث"]}
          title={["Five lines of", "خمسة خطوط"]}
          italic={["open inquiry.", "بحث مفتوحة."]}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {RESEARCH_AREAS.map((area) => (
            <PanelCard
              key={area.n}
              as="article"
              interactive
              className="flex flex-col rounded-panel p-4 md:p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-micro text-text-ghost">{area.n}</span>
              </div>
              <h3 className="mt-1 font-display text-title tracking-[-0.015em] text-text-primary">
                {pick(area.title, lang)}
              </h3>
              <p className="mt-1 text-body-sm text-text-secondary">{pick(area.blurb, lang)}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {area.items.map((it, i) => (
                  <li
                    key={i}
                    className="rounded-pill border border-border-subtle px-2 py-0.5 font-mono text-micro text-text-tertiary"
                  >
                    {pick(it, lang)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border-subtle pt-3 text-body-sm italic text-text-secondary">
                <span className="font-mono text-micro uppercase not-italic tracking-[0.10em] text-accent">
                  {ar ? "السؤال الحالي — " : "Current question — "}
                </span>
                {pick(area.question, lang)}
              </p>
            </PanelCard>
          ))}
        </div>
      </section>

      {/* Try them live — actual working tools, not just research descriptions */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["03 / TRY THEM LIVE", "03 / جرّبها الآن"]}
          title={["Working tools,", "أدوات تشتغل،"]}
          italic={["not just ideas.", "لا مجرد أفكار."]}
        />
        <p className="max-w-[62ch] text-body-sm text-text-secondary">
          {ar
            ? "مش كل حاجة هنا نظرية. الأدوات دي شغالة فعليًا وبتستخدم نفس منطق الأنظمة اللي بتُبنى بيها هويات العملاء."
            : "Not everything here is theoretical. These tools actually work, running on the same systemic logic used to build client identities."}
        </p>
        {/* .labtool-grid has no column template below 900px, so its implicit auto
            column grows to the cards' min-content (a 304px card in a 272px column
            at 320). Pin one shrinkable column, here and in each card's controls
            grid, and let the fields and colour text inputs shrink (min-w-0) —
            their intrinsic input width also made the two-column layout overflow
            in AR at 900-939px. From 900px / 560px the unlayered .labtool-grid /
            .labtool-controls two-column rules take over again, as before. */}
        <div className="labtool-grid grid-cols-[minmax(0,1fr)] [&_.labtool-controls]:grid-cols-[minmax(0,1fr)] [&_.labtool-field]:min-w-0 [&_.labtool-colortext]:min-w-0">
          <TypeScaleTool />
          <ContrastCheckerTool />
          <BilingualToggleTool />
        </div>
        <Link
          href="/capabilities"
          className="group mt-1 w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
        >
          {ar ? "جرّب Token Playground الكامل" : "Try the full Token Playground"}
          <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
        </Link>
      </section>

      {/* Active projects */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["04 / ACTIVE PROJECTS", "04 / مشاريع نشطة"]}
          title={["What's on the", "ما يجري"]}
          italic={["bench right now.", "على الطاولة الآن."]}
        />
        <div className="flex flex-col">
          {PROJECTS.map((p) => (
            <div
              key={pick(p.name, "en")}
              className="grid grid-cols-1 gap-2 border-t border-border-subtle py-4 last:border-b md:grid-cols-[16rem_1fr_auto] md:items-start"
            >
              <p className="font-display text-title tracking-[-0.015em] text-text-primary">
                {pick(p.name, lang)}
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-body-sm text-text-secondary">{pick(p.blurb, lang)}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {p.areas.map((a, i) => (
                    <li key={i} className="font-mono text-micro text-text-ghost">
                      {pick(a, lang)}
                      {i < p.areas.length - 1 && <span className="ms-1.5">·</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <span
                className={[
                  "w-fit rounded-pill border px-2.5 py-1 font-mono text-micro uppercase tracking-[0.10em]",
                  statusClass[p.kind],
                ].join(" ")}
              >
                {pick(p.status, lang)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Lab notes */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["05 / LAB NOTES", "05 / ملاحظات المعمل"]}
          title={["Findings from", "ملاحظات من"]}
          italic={["inside the work.", "داخل التجارب."]}
        />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {NOTES.map((note, i) => (
            <blockquote
              key={i}
              className="rounded-card border-s-2 border-accent bg-accent-dim px-4 py-3 text-body text-text-primary"
            >
              {pick(note, lang)}
            </blockquote>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["06 / METHODOLOGY", "06 / المنهجية"]}
          title={["One cycle,", "دورة واحدة"]}
          italic={["every experiment.", "لكل تجربة."]}
        />
        <div className="rounded-panel border border-border-subtle bg-surface-1 p-4 md:p-4">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
            {METHOD.map((step, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="rounded-card bg-surface-2 px-3 py-1.5 font-mono text-body-sm text-text-primary">
                  {pick(step, lang)}
                </span>
                {i < METHOD.length - 1 && (
                  <span aria-hidden className="inline-flex font-mono text-micro text-accent">
                    <Icon name="arrow-right" />
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-body-sm text-text-tertiary">
            {ar ? "الأنظمة المُتحقَّق منها فقط تصبح جزءًا من Aboalazm OS." : "Only validated systems become part of Aboalazm OS."}
          </p>
        </div>
      </section>

      {/* Open frameworks → resources */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["07 / OPEN FRAMEWORKS", "07 / أطر منشورة"]}
          title={["Experiments that graduated to", "تجارب تخرّجت إلى"]}
          italic={["the public library.", "المكتبة العامة."]}
        />
        <div className="flex flex-wrap gap-1.5">
          {OPEN_FRAMEWORKS.map((f, i) => (
            <span
              key={i}
              className="rounded-pill border border-border-subtle px-3 py-1 font-mono text-micro text-text-secondary"
            >
              {pick(f, lang)}
            </span>
          ))}
        </div>
        <Link
          href="/resources"
          className="group mt-1 w-fit font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
        >
          {ar ? "زُر مكتبة المصادر" : "Visit the Resources library"}
          <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            <Icon name="arrow-right" />
          </span>
        </Link>
      </section>

      {/* "deliverables." is wider than the mobile column at text-display's 2.5rem
          floor; CtaBand's title is out of reach from here, so shrink it the same
          way heading-fit-long does (below 480px) through a display:contents wrapper. */}
      <div className="contents max-[480px]:[&_p.text-display]:text-[1.875rem]">
        <CtaBand
          kicker={["WHAT HAPPENS HERE REACHES CLIENT WORK", "ما يحدث هنا يصل إلى عمل العملاء"]}
          title={["The future isn't more deliverables.", "المستقبل ليس مخرجات أكثر."]}
          italic={["It's better operating systems.", "بل أنظمة تشغيل أفضل."]}
          primary={["Start a project", "ابدأ مشروعًا"]}
          primaryHref="/contact"
          secondary={["Explore the OS", "استكشف الـ OS"]}
          secondaryHref="/resources"
        />
      </div>
    </main>
  );
}
