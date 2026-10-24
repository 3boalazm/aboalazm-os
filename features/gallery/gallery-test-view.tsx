"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import type { GalleryImage, GalleryProject } from "@/lib/gallery";

type ApplicationKind = "all" | "packaging" | "print" | "campaign" | "environment" | "identity";

const KINDS: { id: ApplicationKind; en: string; ar: string }[] = [
  { id: "all", en: "All applications", ar: "كل التطبيقات" },
  { id: "packaging", en: "Packaging", ar: "التغليف" },
  { id: "print", en: "Print & stationery", ar: "المطبوعات والقرطاسية" },
  { id: "campaign", en: "Campaigns", ar: "الحملات" },
  { id: "environment", en: "Spaces & signage", ar: "المساحات واللافتات" },
  { id: "identity", en: "Identity systems", ar: "أنظمة الهوية" },
];

function classify(src: string): Exclude<ApplicationKind, "all"> {
  const path = src.toLowerCase();
  if (/products|business-card-box|ezaby/.test(path)) return "packaging";
  if (/business-card|poster|flyer|refl-overview|refl-preview|applications|mockup-card/.test(path)) return "print";
  if (/ramadan|proxeed-post|img-[abc]|logo-motion/.test(path)) return "campaign";
  if (/outdoor|exhibition|signage/.test(path)) return "environment";
  return "identity";
}

interface GalleryTestViewProps {
  images: readonly GalleryImage[];
  projects: readonly GalleryProject[];
}

export function GalleryTestView({ images, projects }: GalleryTestViewProps) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [activeKind, setActiveKind] = useState<ApplicationKind>("all");
  const [activeProject, setActiveProject] = useState("all");
  const visible = useMemo(
    () => images.filter((image) =>
      (activeProject === "all" || image.project === activeProject) &&
      (activeKind === "all" || classify(image.src) === activeKind),
    ),
    [images, activeKind, activeProject],
  );
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
  const copy = ar
    ? {
        eyebrow: "معاينة مؤقتة · اختبار تصميم",
        title: <>الهوية تخرج <em className="text-accent">للعالم.</em></>,
        intro: "من العبوة إلى المساحة والحملة — استكشف كيف تتحول الهوية البصرية إلى تطبيقات حقيقية عبر نقاط تواصل مختلفة.",
        count: "تطبيق بصري",
        project: "المشروع",
        cases: "شاهد دراسة الحالة",
        note: "هذه صفحة اختبار مؤقتة. الصور المعروضة من ملفات المشاريع الحالية؛ لا توجد صور «قبل» مضافة أو مصطنعة.",
        empty: "لا توجد صور ضمن هذا الاختيار.",
      }
    : {
        eyebrow: "TEMPORARY PREVIEW · LAYOUT TEST",
        title: <>Identity, out <em className="text-accent">in the world.</em></>,
        intro: "From packaging to physical spaces and campaigns — explore how a visual identity becomes a consistent set of real-world touchpoints.",
        count: "visual applications",
        project: "PROJECT",
        cases: "Explore the case study",
        note: "Temporary test page. Imagery comes from existing project files; no fabricated “before” images are shown.",
        empty: "No images match this selection.",
      };

  return (
    <main dir={ar ? "rtl" : "ltr"} className="container-content flex flex-col gap-5 pb-6 md:gap-7 md:pb-7">
      <header className="relative overflow-hidden rounded-panel border border-border-subtle bg-surface-1 px-6 py-5 md:px-12 md:py-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-micro uppercase tracking-[0.08em] text-accent">
            <span className="size-1.5 rounded-full bg-accent" />{copy.eyebrow}
          </div>
          <p className="font-mono text-label uppercase tracking-[0.08em] text-text-tertiary">{ar ? "منظومة الهوية · في التطبيق" : "IDENTITY SYSTEMS · IN APPLICATION"}</p>
          <h1 className="mt-3 max-w-[16ch] font-display text-display leading-[0.98] tracking-[-0.04em] text-text-primary">{copy.title}</h1>
          <p className="mt-5 max-w-[58ch] text-lead text-text-secondary">{copy.intro}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-micro text-text-tertiary">
            <span>{visible.length} {copy.count}</span><span aria-hidden="true">/</span><span>{projects.length} {ar ? "مشاريع" : "projects"}</span>
          </div>
        </div>
      </header>

      <section aria-label={ar ? "تصفية الصور" : "Filter the gallery"} className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {KINDS.map((kind) => {
            const selected = activeKind === kind.id;
            return <button key={kind.id} type="button" aria-pressed={selected} onClick={() => setActiveKind(kind.id)} className={`rounded-pill border px-4 py-2.5 text-sm transition-colors ${selected ? "border-accent bg-accent text-white" : "border-border-subtle bg-surface-1 text-text-secondary hover:border-text-tertiary hover:text-text-primary"}`}>
              {ar ? kind.ar : kind.en}
            </button>;
          })}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button type="button" aria-pressed={activeProject === "all"} onClick={() => setActiveProject("all")} className={`shrink-0 rounded-pill px-3 py-1.5 font-mono text-micro transition-colors ${activeProject === "all" ? "bg-text-primary text-surface-0" : "border border-border-subtle text-text-tertiary hover:text-text-primary"}`}>{ar ? "كل المشاريع" : "ALL PROJECTS"}</button>
          {projects.map((project) => <button key={project.slug} type="button" aria-pressed={activeProject === project.slug} onClick={() => setActiveProject(project.slug)} className={`shrink-0 rounded-pill border px-3 py-1.5 font-mono text-micro transition-colors ${activeProject === project.slug ? "text-text-primary" : "border-border-subtle text-text-tertiary hover:text-text-primary"}`} style={activeProject === project.slug ? { borderColor: project.accent, backgroundColor: `${project.accent}20` } : undefined}>{ar ? project.labelAr : project.label}</button>)}
        </div>
      </section>

      {visible.length ? <section aria-live="polite" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((image, index) => {
          const project = projectBySlug.get(image.project);
          const kind = KINDS.find((item) => item.id === classify(image.src));
          return <article key={image.src} className={`group overflow-hidden rounded-card border border-border-subtle bg-surface-1 transition-transform duration-300 hover:-translate-y-1 ${index === 0 && activeKind === "all" && activeProject === "all" ? "sm:col-span-2" : ""}`}>
            <Link href={project?.href ?? "/work"} className="block" aria-label={`${ar ? image.captionAr : image.caption} — ${project ? (ar ? project.labelAr : project.label) : ""}`}>
              <div className={`relative overflow-hidden bg-surface-2 ${index === 0 && activeKind === "all" && activeProject === "all" ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
                <Image src={image.src} alt={ar ? image.captionAr : image.caption} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-6">
                  <span className="rounded-pill border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[12px] uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm">{ar ? kind?.ar : kind?.en}</span>
                  <span className="font-mono text-micro text-white/80">{String(index + 1).padStart(2, "0")}</span>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4 p-4 md:p-4">
                <div className="min-w-0">
                  <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-tertiary">{copy.project} · {project ? (ar ? project.labelAr : project.label) : ""}</p>
                  <h2 className="mt-2 text-base font-medium leading-snug text-text-primary">{ar ? image.captionAr : image.caption}</h2>
                </div>
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border-subtle text-text-tertiary transition-colors group-hover:border-accent group-hover:text-accent"><Icon name="arrow-up-right" size={15} /></span>
              </div>
            </Link>
          </article>;
        })}
      </section> : <div className="rounded-card border border-border-subtle bg-surface-1 p-5 text-center text-text-secondary">{copy.empty}</div>}

      <footer className="flex flex-col gap-5 border-t border-border-subtle pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[62ch] text-sm leading-relaxed text-text-tertiary">{copy.note}</p>
        <Link href="/work" className="inline-flex w-fit shrink-0 items-center gap-2 rounded-pill border border-border-subtle px-4 py-2.5 text-sm text-text-primary transition-colors hover:border-accent hover:text-accent">
          {ar ? "كل الأعمال" : "View all work"}<Icon name="arrow-up-right" size={15} />
        </Link>
      </footer>
    </main>
  );
}
