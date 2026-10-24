"use client";

/**
 * PRODUCT CASE — the shared shell for the six product case files
 * (Mini Exam, StemForge, Pharmacy Web, Continuum, Farm Console, and any
 * future one built from a repository rather than a live marketing site).
 *
 * Why a shell instead of six copies: these files share the *structure*
 * (hero → cover → challenge → system → decisions → evidence → stack →
 * hand-off) but not the content. Copy-pasting that structure six times
 * would mean six places to fix a heading scale or a hero height. Here the
 * structure is one component and each project supplies data only.
 *
 * The evidence rule enforced by the shape: `evidence` items carry an
 * `origin` — "repo" (read directly in the source), "live" (observed on the
 * deployment) or "declared" (stated by the project, not independently
 * verified). The section prints that origin on every tile, so a reader can
 * always tell a measured fact from a claim.
 */
import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";

export type Accent = "amber" | "violet" | "emerald" | "cyan" | "rose";

const ACCENT: Record<Accent, { text: string; dot: string; border: string; glowA: string; glowB: string; button: string }> = {
  amber: {
    text: "text-amber-300",
    dot: "bg-amber-400",
    border: "border-amber-400/30 bg-amber-400/[0.08]",
    glowA: "bg-amber-500/[0.10]",
    glowB: "bg-orange-700/[0.12]",
    button: "bg-amber-400",
  },
  violet: {
    text: "text-violet-300",
    dot: "bg-violet-400",
    border: "border-violet-400/30 bg-violet-400/[0.08]",
    glowA: "bg-violet-500/[0.12]",
    glowB: "bg-indigo-600/[0.10]",
    button: "bg-violet-400",
  },
  emerald: {
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    border: "border-emerald-400/30 bg-emerald-400/[0.08]",
    glowA: "bg-emerald-500/[0.10]",
    glowB: "bg-cyan-500/[0.08]",
    button: "bg-emerald-400",
  },
  cyan: {
    text: "text-cyan-300",
    dot: "bg-cyan-400",
    border: "border-cyan-400/30 bg-cyan-400/[0.08]",
    glowA: "bg-cyan-500/[0.10]",
    glowB: "bg-teal-600/[0.10]",
    button: "bg-cyan-400",
  },
  rose: {
    text: "text-rose-300",
    dot: "bg-rose-400",
    border: "border-rose-400/30 bg-rose-400/[0.08]",
    glowA: "bg-rose-500/[0.10]",
    glowB: "bg-fuchsia-600/[0.10]",
    button: "bg-rose-400",
  },
};

export interface Evidence {
  value: string;
  label: string;
  labelAr: string;
  origin: "repo" | "live" | "declared";
}

export interface Decision {
  n: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
}

export interface CaseModule {
  no: string;
  name: string;
  nameAr: string;
  detail: string;
  detailAr: string;
  tech?: string;
}

export interface CaseRow {
  name: string;
  nameAr: string;
  body: string;
  bodyAr: string;
}

export interface DataFlow {
  a: string;
  aSub: string;
  mid: string;
  midSub: string;
  b: string;
  bSub: string;
  note: string;
  noteAr: string;
}

export interface ProductCaseProps {
  accent: Accent;
  fileNo: string;
  code: string;
  eyebrow: string;
  wordmark: string;
  wordmarkTail?: string;
  heroLead: string;
  heroLeadAr: string;
  badges: { en: string; ar: string }[];
  snapshot: { label: string; labelAr: string; value: string; sub?: string }[];
  snapshotTitle: { en: string; ar: string };
  snapshotCode: string;
  snapshotNote: string;
  snapshotNoteAr: string;
  role: { en: string; ar: string };
  domain: { en: string; ar: string };
  year: string;
  cover: { src: string; alt: string; altAr: string; caption: string; captionAr: string; tag: string };
  cta?: { href: string; en: string; ar: string };
  challenge: { title: string; titleAr: string; paragraphs: string[]; paragraphsAr: string[]; callout: string; calloutAr: string };
  system: { kicker: string; kickerAr: string; title: string; titleAr: string; aside: string; asideAr: string; modules: CaseModule[]; flow?: DataFlow };
  decisions: { title: string; titleAr: string; items: Decision[] };
  rows?: { kicker: string; kickerAr: string; title: string; titleAr: string; items: CaseRow[] };
  evidence: { title: string; titleAr: string; items: Evidence[]; notes: string[]; notesAr: string[] };
  stack: { title: string; titleAr: string; items: string[]; note: string; noteAr: string };
  handoff: { title: string; titleAr: string; note: string; noteAr: string };
}

const ORIGIN_LABEL: Record<Evidence["origin"], { en: string; ar: string; cls: string }> = {
  repo: { en: "from repo", ar: "من الريبو", cls: "text-emerald-300/80" },
  live: { en: "observed live", ar: "من الموقع الحي", cls: "text-cyan-300/80" },
  declared: { en: "declared scope", ar: "نطاق مُعلن", cls: "text-text-ghost" },
};

export function ProductCase(props: ProductCaseProps) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const a = ACCENT[props.accent];

  return (
    <main className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="container-wide relative flex min-h-[68svh] flex-col justify-between gap-7 py-5 md:py-7">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className={`absolute -right-24 top-8 h-80 w-80 rounded-full blur-[100px] ${a.glowA}`} />
          <div className={`absolute -left-20 top-56 h-72 w-72 rounded-full blur-[100px] ${a.glowB}`} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">← {ar ? "كل الأعمال" : "All work"}</Link>
          <span>{ar ? `ملف منتج / ${props.fileNo}` : `Product case file / ${props.fileNo}`}</span>
        </div>

        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {props.badges.map((b) => (
                <span key={b.en} className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
                  {ar ? b.ar : b.en}
                </span>
              ))}
            </div>
            <p className={`mb-4 font-mono text-xs uppercase tracking-[0.2em] ${a.text}/80`}>{props.eyebrow}</p>
            <h1 className="max-w-5xl font-display text-[clamp(3.3rem,9vw,8.3rem)] leading-[0.86] tracking-[-0.06em] text-text-primary">
              {props.wordmark}
              <span className={a.text}>.</span>
              {props.wordmarkTail ? <span className="text-text-tertiary"> {props.wordmarkTail}</span> : null}
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-text-secondary md:text-2xl">
              {ar ? props.heroLeadAr : props.heroLead}
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface-1/70 p-4 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-text-tertiary">
              <span>{ar ? props.snapshotTitle.ar : props.snapshotTitle.en}</span>
              <span className={a.text}>{props.snapshotCode}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {props.snapshot.map((s) => (
                <div key={s.label} className="rounded-xl border border-border-subtle p-4">
                  <p className="font-display text-4xl text-text-primary">{s.value}</p>
                  <p className="mt-2 text-xs text-text-tertiary">{ar ? s.labelAr : s.label}</p>
                </div>
              ))}
              {props.system.flow ? (
                <div className="col-span-2 rounded-xl border border-border-subtle bg-background/60 p-4">
                  <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "مسار البيانات" : "Data path"}</p>
                  <p className="mt-2 text-sm leading-[1.65] text-text-primary">
                    {props.system.flow.a} <span className={a.text}>→</span> {props.system.flow.mid} <span className={a.text}>→</span> {props.system.flow.b}
                  </p>
                </div>
              ) : null}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-text-tertiary">{ar ? props.snapshotNoteAr : props.snapshotNote}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{ar ? props.role.ar : props.role.en}</span>
            <span>{ar ? props.domain.ar : props.domain.en}</span>
            <span>{props.year}</span>
          </div>
          {props.cta ? (
            <div className="flex flex-wrap gap-3">
              <a href={props.cta.href} target={props.cta.href.startsWith("#") ? undefined : "_blank"} rel="noreferrer" className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5 ${a.button}`}>
                {ar ? props.cta.ar : props.cta.en} ↗
              </a>
            </div>
          ) : null}
        </div>
      </section>
      <div className="container-content"><ProjectEnquiry compact service="digital-product" /></div>

      {/* ═══ COVER ═══ */}
      <section className="container-wide pb-2">
        <figure className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1/40">
          <Image
            src={props.cover.src}
            alt={ar ? props.cover.altAr : props.cover.alt}
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
          />
          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle px-4 py-3 font-mono text-[12px] uppercase tracking-[0.1em] text-text-tertiary">
            <span>{ar ? props.cover.captionAr : props.cover.caption}</span>
            <span className={a.text}>{props.cover.tag}</span>
          </figcaption>
        </figure>
      </section>

      {/* ═══ 01 · CHALLENGE ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className={`font-mono text-xs uppercase tracking-[0.16em] ${a.text}`}>01 / {ar ? "التحدي" : "The challenge"}</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? props.challenge.titleAr : props.challenge.title}
            </h2>
          </div>
          <div className="max-w-3xl space-y-3 text-base leading-[1.65] text-text-secondary">
            {(ar ? props.challenge.paragraphsAr : props.challenge.paragraphs).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className={`rounded-xl border-s-2 p-4 ${a.border.replace("border-", "border-s-2 border-")}`}>
              <p className="text-sm leading-[1.65] text-text-primary">{ar ? props.challenge.calloutAr : props.challenge.callout}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 02 · SYSTEM ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={`font-mono text-xs uppercase tracking-[0.16em] ${a.text}`}>02 / {ar ? props.system.kickerAr : props.system.kicker}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? props.system.titleAr : props.system.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-[1.65] text-text-tertiary">{ar ? props.system.asideAr : props.system.aside}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {props.system.modules.map((m) => (
            <article key={m.no} className="rounded-xl border border-border-subtle bg-surface-1/40 p-4">
              <div className="mb-7 flex items-center justify-between">
                <span className="font-mono text-xs text-text-ghost">{m.no}</span>
                <span className={`h-2 w-2 rounded-full ${a.dot}`} />
              </div>
              <h3 className="font-display text-2xl text-text-primary">{ar ? m.nameAr : m.name}</h3>
              {m.tech ? <p className={`mt-2 font-mono text-xs ${a.text}`}>{m.tech}</p> : null}
              <p className="mt-4 text-sm leading-[1.65] text-text-secondary">{ar ? m.detailAr : m.detail}</p>
            </article>
          ))}
        </div>

        {props.system.flow ? (
          <div className="mt-5 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-5">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-mono text-[12px] uppercase text-text-tertiary">{props.system.flow.a}</p>
                <p className="mt-2 text-sm text-text-primary">{props.system.flow.aSub}</p>
              </div>
              <div className={`text-center ${a.text}`}>→</div>
              <div className={`rounded-xl border p-4 ${a.border.replace("border-", "border-")}`}>
                <p className={`font-mono text-[12px] uppercase ${a.text}`}>{props.system.flow.mid}</p>
                <p className="mt-2 text-sm text-text-primary">{props.system.flow.midSub}</p>
              </div>
              <div className={`text-center ${a.text}`}>→</div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-mono text-[12px] uppercase text-text-tertiary">{props.system.flow.b}</p>
                <p className="mt-2 text-sm text-text-primary">{props.system.flow.bSub}</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-[1.65] text-text-tertiary">{ar ? props.system.flow.noteAr : props.system.flow.note}</p>
          </div>
        ) : null}
      </section>

      {/* ═══ 03 · DECISIONS ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-8">
          <div className="mb-6">
            <p className={`font-mono text-xs uppercase tracking-[0.16em] ${a.text}`}>03 / {ar ? "قرارات المنتج" : "Product decisions"}</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? props.decisions.titleAr : props.decisions.title}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {props.decisions.items.map((d) => (
              <article key={d.n} className="group rounded-xl border border-border-subtle bg-background/55 p-4 transition-colors hover:border-border-strong">
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-mono text-xs text-text-ghost">{d.n}</span>
                  <span className={a.text}>↗</span>
                </div>
                <h3 className="font-display text-xl text-text-primary">{ar ? d.titleAr : d.title}</h3>
                <p className="mt-3 text-sm leading-[1.65] text-text-secondary">{ar ? d.bodyAr : d.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 · ROWS (optional journey / module table) ═══ */}
      {props.rows ? (
        <section className="container-wide py-6 md:py-8">
          <p className={`font-mono text-xs uppercase tracking-[0.16em] ${a.text}`}>04 / {ar ? props.rows.kickerAr : props.rows.kicker}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
            {ar ? props.rows.titleAr : props.rows.title}
          </h2>
          <div className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
            {props.rows.items.map((r) => (
              <div key={r.name} className="grid gap-2 py-5 sm:grid-cols-[190px_1fr] sm:gap-6">
                <h3 className="text-sm font-medium text-text-primary">{ar ? r.nameAr : r.name}</h3>
                <p className="text-sm leading-[1.65] text-text-secondary">{ar ? r.bodyAr : r.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ═══ 05 · EVIDENCE ═══ */}
      <section id="evidence" className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className={`font-mono text-xs uppercase tracking-[0.16em] ${a.text}`}>05 / {ar ? "الأدلة" : "Evidence"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? props.evidence.titleAr : props.evidence.title}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {props.evidence.items.map((e) => (
                <div key={e.label} className="rounded-xl border border-border-subtle bg-background/50 p-4">
                  <p className="font-display text-3xl text-text-primary">{e.value}</p>
                  <p className="mt-2 text-sm text-text-secondary">{ar ? e.labelAr : e.label}</p>
                  <p className={`mt-2 font-mono text-[11px] uppercase tracking-[0.1em] ${ORIGIN_LABEL[e.origin].cls}`}>
                    {ar ? ORIGIN_LABEL[e.origin].ar : ORIGIN_LABEL[e.origin].en}
                  </p>
                </div>
              ))}
            </div>
            {(ar ? props.evidence.notesAr : props.evidence.notes).map((n, i) => (
              <p key={i} className="text-xs leading-[1.65] text-text-tertiary">{n}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 06 · STACK ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]">
          <div>
            <p className={`font-mono text-xs uppercase tracking-[0.16em] ${a.text}`}>06 / {ar ? "التقنيات" : "Technology stack"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary">
              {ar ? props.stack.titleAr : props.stack.title}
            </h2>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {props.stack.items.map((s) => (
                <span key={s} className="rounded-full border border-border-subtle bg-background/60 px-3 py-2 font-mono text-xs text-text-secondary">{s}</span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-[1.65] text-text-secondary">{ar ? props.stack.noteAr : props.stack.note}</p>
          </div>
        </div>
      </section>

      {/* ═══ HAND-OFF ═══ */}
      <section className="border-t border-border-subtle bg-surface-1/35">
        <div className="container-wide flex flex-col gap-8 py-6 md:flex-row md:items-end md:justify-between md:py-7">
          <div>
            <p className={`font-mono text-xs uppercase tracking-[0.16em] ${a.text}`}>
              HAND-OFF / {props.fileNo}
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? props.handoff.titleAr : props.handoff.title}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-[1.65] text-text-secondary">{ar ? props.handoff.noteAr : props.handoff.note}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/work" className="rounded-full border border-border-default px-5 py-3 text-sm text-text-primary hover:border-border-strong">
              {ar ? "كل الأعمال" : "All work"}
            </Link>
            {props.cta ? (
              <a href={props.cta.href} target={props.cta.href.startsWith("#") ? undefined : "_blank"} rel="noreferrer" className={`rounded-full px-5 py-3 text-sm font-medium text-black hover:-translate-y-0.5 ${a.button}`}>
                {ar ? props.cta.ar : props.cta.en} ↗
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
