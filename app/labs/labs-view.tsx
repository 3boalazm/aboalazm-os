"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { SectionHead, CtaBand, pick } from "@/features/offers/offer-blocks";
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
    <main className="container-content flex flex-col gap-16 py-16">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          {ar ? "المعمل / البحث والتطوير" : "LABS / R&D"}
        </p>
        <h1 className="font-display text-display tracking-[-0.025em]">
          {ar ? "حيث تُختبر الأنظمة " : "Where systems are tested "}
          <em className="text-accent">{ar ? "قبل أن تصبح أطرًا." : "before they become frameworks."}</em>
        </h1>
        <p className="max-w-[58ch] text-lead text-text-secondary">
          {ar
            ? "Aboalazm Labs هو طبقة البحث والتجريب خلف Aboalazm OS — قسم الـ R&D للبراندينج وأنظمة الهوية وعمليات التصميم والتدفقات المدعومة بالذكاء الاصطناعي."
            : "Aboalazm Labs is the research and experimentation layer behind Aboalazm OS — the R&D department for branding, identity systems, design operations, and AI-powered creative workflows."}
        </p>
        <p className="max-w-[58ch] text-body text-text-secondary">
          {ar
            ? "ليست كل تجربة تنجح. كل تجربة تُعلّم. والأطر التي تُنشر علنًا وُلدت هنا أولًا."
            : "Not every experiment succeeds. Every experiment teaches. Every public framework was born here first."}
        </p>
      </header>

      {/* Why */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["01 / WHY", "٠١ / لماذا"]}
          title={ar ? ["مبنيّ على", ""] : ["Built on testing,", ""]}
          italic={ar ? ["الاختبار لا الافتراض.", ""] : ["not assumption.", ""]}
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
          label={["02 / RESEARCH AREAS", "٠٢ / مجالات البحث"]}
          title={ar ? ["خمسة خطوط", ""] : ["Five lines of", ""]}
          italic={ar ? ["بحث مفتوحة.", ""] : ["open inquiry.", ""]}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {RESEARCH_AREAS.map((area) => (
            <article
              key={area.n}
              className="flex flex-col rounded-panel border border-border-subtle bg-surface-1 p-4 transition-colors duration-base ease-physics hover:border-border-strong md:p-5"
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
            </article>
          ))}
        </div>
      </section>

      {/* Active projects */}
      <section className="flex flex-col gap-3">
        <SectionHead
          label={["03 / ACTIVE PROJECTS", "٠٣ / مشاريع نشطة"]}
          title={ar ? ["ما يجري", ""] : ["What's on the", ""]}
          italic={ar ? ["على الطاولة الآن.", ""] : ["bench right now.", ""]}
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
          label={["04 / LAB NOTES", "٠٤ / ملاحظات المعمل"]}
          title={ar ? ["ملاحظات من", ""] : ["Findings from", ""]}
          italic={ar ? ["داخل التجارب.", ""] : ["inside the work.", ""]}
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
          label={["05 / METHODOLOGY", "٠٥ / المنهجية"]}
          title={ar ? ["دورة واحدة", ""] : ["One cycle,", ""]}
          italic={ar ? ["لكل تجربة.", ""] : ["every experiment.", ""]}
        />
        <div className="rounded-panel border border-border-subtle bg-surface-1 p-4 md:p-6">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
            {METHOD.map((step, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="rounded-card bg-surface-2 px-3 py-1.5 font-mono text-body-sm text-text-primary">
                  {pick(step, lang)}
                </span>
                {i < METHOD.length - 1 && (
                  <span aria-hidden className="font-mono text-micro text-accent">
                    →
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
          label={["06 / OPEN FRAMEWORKS", "٠٦ / أطر منشورة"]}
          title={ar ? ["تجارب تخرّجت إلى", ""] : ["Experiments that graduated to", ""]}
          italic={ar ? ["المكتبة العامة.", ""] : ["the public library.", ""]}
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
          <span aria-hidden className="ms-1 inline-block transition-transform duration-base ease-physics group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>

      <CtaBand
        kicker={["WHAT HAPPENS HERE REACHES CLIENT WORK", "ما يحدث هنا يصل إلى عمل العملاء"]}
        title={ar ? ["المستقبل ليس مخرجات أكثر.", ""] : ["The future isn't more deliverables.", ""]}
        italic={ar ? ["بل أنظمة تشغيل أفضل.", ""] : ["It's better operating systems.", ""]}
        primary={["Start a project", "ابدأ مشروعًا"]}
        primaryHref="/contact"
        secondary={["Explore the OS", "استكشف الـ OS"]}
        secondaryHref="/resources"
      />
    </main>
  );
}
