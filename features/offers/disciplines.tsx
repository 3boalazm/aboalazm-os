"use client";

/**
 * DISCIPLINES — what the studio sells, in three sentences (2026-11 repositioning, P1 · point 6).
 *
 * Replaces the flat "six things I do" / "three project paths" lists. A business
 * owner buying a partner does not shop services; they recognise their own
 * problem in one of three sentences and start there. Every card states the
 * audience, the business outcome, the deliverables and a real starting point —
 * and asks for a conversation, not a payment.
 *
 * Copy lives in lib/offers DISCIPLINES (single source); this file is layout only.
 */
import type React from "react";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { joinClasses } from "@/lib/utils";
import { contactHref } from "@/lib/contact-context";
import { DISCIPLINES, DISCOVERY_CTA_LABEL, type Discipline } from "@/lib/offers";

const SERVICE_FOR: Record<Discipline["id"], "brand-identity" | "website" | "digital-product"> = {
  brand: "brand-identity",
  digital: "website",
  systems: "digital-product",
};

/* One authored still per discipline — the card leads with an image, not with
   a paragraph. These are studio-made plates (public/images/generated) rather
   than project thumbnails: the discipline is the offer, so its picture has to
   read as "a brand kit / an interface / a system", not as one client's work
   standing in for the whole category. */
/* Each discipline owns a colour — coral leads (brand), lilac is
   digital, mint is systems. `--disc` paints the card's top rule, bullets and
   ring; `--disc-text` is its text-safe member on the current ground. */
const DISCIPLINE_COLOUR: Record<Discipline["id"], { "--disc": string; "--disc-text": string }> = {
  brand: { "--disc": "var(--color-accent)", "--disc-text": "var(--color-accent-text, var(--color-accent))" },
  digital: { "--disc": "var(--color-lilac)", "--disc-text": "var(--color-lilac-text)" },
  systems: { "--disc": "var(--color-mint)", "--disc-text": "var(--color-mint-text)" },
};

const DISCIPLINE_ART: Record<Discipline["id"], string> = {
  brand: "/images/generated/discipline-brand.jpg",
  digital: "/images/generated/discipline-digital.jpg",
  systems: "/images/generated/discipline-systems.jpg",
};

export function DisciplineCards({
  compact = false,
  className,
  highlight,
}: {
  /** Home page: shorter body copy, deliverables clamped on phones. */
  compact?: boolean;
  className?: string;
  highlight?: Discipline["id"];
}) {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div
      className={joinClasses(
        // phones: one card at a time, swipe for the rest — same pattern as the
        // pricing cards so the site keeps one mobile idiom.
        "grid gap-3 max-md:-mx-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:grid-cols-3",
        className,
      )}
    >
      {DISCIPLINES.map((d) => {
        const isHighlight = highlight === d.id;
        const items = compact ? d.includes.slice(0, 3) : d.includes;
        return (
          <article
            key={d.id}
            style={DISCIPLINE_COLOUR[d.id] as React.CSSProperties}
            className={joinClasses(
              "disc-card flex flex-col overflow-hidden rounded-panel border bg-surface-1 max-md:w-[84%] max-md:shrink-0 max-md:snap-start",
              isHighlight ? "border-accent-border bg-accent/[0.04]" : "border-border-default",
            )}
          >
            {/* Proof first: the discipline's own work, with its number and
                starting price painted on the picture. */}
            <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
              <Image
                src={DISCIPLINE_ART[d.id]}
                alt=""
                fill
                sizes="(min-width: 768px) 30vw, 84vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-transparent"
              />
              <span className="absolute start-3 top-3 rounded-pill bg-obsidian/55 px-2 py-0.5 font-mono text-micro uppercase tracking-[0.12em] text-alabaster backdrop-blur-sm">
                {d.n}
              </span>
              <span className="absolute bottom-2.5 start-3 font-mono text-micro uppercase tracking-[0.08em] text-alabaster">
                {ar ? d.from[1] : d.from[0]}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-3 md:p-4">
              <h3 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">
                {ar ? d.name[1] : d.name[0]}
              </h3>

              <p className="text-body-sm text-text-secondary">{ar ? d.forWhom[1] : d.forWhom[0]}</p>

              <div className="border-t border-border-subtle pt-2">
                <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                  {ar ? "ما تخرج به" : "What you walk away with"}
                </p>
                <p className="mt-1 text-body-sm text-text-primary">{ar ? d.outcome[1] : d.outcome[0]}</p>
              </div>

              <ul className="flex flex-col gap-1.5">
                {items.map((item, i) => (
                  <li
                    key={item[0]}
                    className={joinClasses(
                      "flex items-start gap-2 text-body-sm text-text-secondary",
                      compact && i >= 2 && "max-sm:hidden",
                    )}
                  >
                    <span aria-hidden className="disc-dot mt-[0.55em] size-1 shrink-0 rounded-pill" />
                    {ar ? item[1] : item[0]}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                <Link
                  href={contactHref({ service: SERVICE_FOR[d.id], source: "/services" })}
                  style={{ color: "var(--disc-text)" }}
                  className="inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.06em] transition-opacity hover:opacity-70"
                >
                  {ar ? DISCOVERY_CTA_LABEL[1] : DISCOVERY_CTA_LABEL[0]}
                  <span aria-hidden className="inline-flex">
                    <Icon name="arrow-right" />
                  </span>
                </Link>
                {!compact ? (
                  <Link
                    href={d.href}
                    className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors hover:text-text-primary"
                  >
                    {ar ? "التفاصيل" : "Details"}
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/**
 * DISCIPLINES BAND — heading + the three cards, with copy in both languages.
 * Lives client-side because the heading is part of the offer copy, not page
 * chrome: an English-only heading on the Arabic home page would be the exact
 * bilingual failure this studio sells against.
 */
const RING_LABEL: Record<Discipline["id"], [string, string, string]> = {
  brand: ["Brand", "الهوية", "Jenama"],
  digital: ["Digital", "الرقمي", "Digital"],
  systems: ["Systems", "الأنظمة", "Sistem"],
};

/** Three overlapping rings: the disciplines are one system, and each ring is a door. */
export function DisciplineRings({ highlight }: { highlight?: Discipline["id"] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="discipline-rings" role="list">
        {DISCIPLINES.map((d) => (
          <Link key={d.id} href={d.href} role="listitem" className="discipline-ring" style={DISCIPLINE_COLOUR[d.id] as React.CSSProperties} data-lead={highlight === d.id}>
            <span className="font-mono text-micro">{d.n}</span>
            <span className={ar ? "text-subtitle font-semibold text-text-primary" : "font-display text-subtitle tracking-[-0.01em] text-text-primary max-sm:text-body"}>
              {RING_LABEL[d.id][ar ? 1 : lang === "ms" ? 2 : 0]}
            </span>
          </Link>
        ))}
      </div>
      <p className="font-mono text-micro uppercase tracking-[0.12em] text-text-ghost">
        {ar ? "حيث تتقاطع الثلاثة: مبنيّ ليعمل" : lang === "ms" ? "Di mana ia bertemu: dibina untuk berfungsi" : "Where they overlap: built to run"}
      </p>
    </div>
  );
}

export function DisciplinesBand({
  highlight,
  compact = false,
  className,
}: {
  highlight?: Discipline["id"];
  compact?: boolean;
  className?: string;
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <div className={joinClasses("flex flex-col gap-4", className)}>
      <div className="grid items-center gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex max-w-[62ch] flex-col gap-1">
        <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
          {ar ? (
            <>
              ثلاثة أشياء تشتريها الشركات. <em className="text-accent">لا اثنتا عشرة خدمة.</em>
            </>
          ) : (
            <>
              Three things a business buys. <em className="text-accent">Not twelve services.</em>
            </>
          )}
        </h2>
        <p className="text-body-sm text-text-secondary">
          {ar
            ? "أغلب الاستوديوهات تبيع مهامّ. أما هنا فيُجمَّع العمل بحسب نتيجته: علامة يثق بها السوق، وطبقة رقمية تعمل، وأنظمة تجعل التشغيل واضحًا. تستطيع أن تبدأ بواحدة وتضيف الباقي لاحقًا؛ فالثلاثة مصمَّمة لتتصل ببعضها."
            : "Most studios sell tasks. The work here is grouped by the outcome it produces — a brand the market trusts, a digital layer that performs, and systems that make the operation visible. Start with one and add the others later; they are designed to connect."}
        </p>
      </div>
      <DisciplineRings highlight={highlight} />
      </div>
      <DisciplineCards compact={compact} highlight={highlight} />
    </div>
  );
}

/**
 * STUDIO MODEL — the founder-led answer to "is this a studio or one person?"
 * (P1 · point 5). Kept as structured copy so /about, /services and the home
 * band cannot drift into three different descriptions of the same model.
 */
export const STUDIO_MODEL = {
  en: {
    label: "How the studio works",
    title: "A founder-led studio, with the bench to match the scope.",
    lead: "Aboalazm OS is a founder-led studio. Mustafa leads strategy, identity and the direction of every digital build — he does not hand your project to a junior and step away.",
    points: [
      [
        "Who you work with",
        "Mustafa, directly, from the first call to handover. No account manager between you and the person doing the work.",
      ],
      [
        "When the scope needs more hands",
        "Larger builds bring in named specialists — development, photography, motion, print production — coordinated and quality-checked by the studio, under one written scope.",
      ],
      [
        "Project management",
        "Every engagement runs on the same 38-day method with written approvals at each gate, a shared file system, and one weekly written status.",
      ],
      [
        "After launch",
        "Handover includes a guidelines system, a team training session, and 30 days of support. Ongoing partnership is optional, priced monthly, and never assumed.",
      ],
    ] as const,
    note: "If the work needs a team larger than the studio can carry responsibly, we say so at the proposal stage — before any payment.",
  },
  ar: {
    label: "كيف يعمل الاستوديو",
    title: "استوديو يقوده مؤسسه، وفريق يتسع بقدر النطاق.",
    lead: "Aboalazm OS استوديو يقوده مؤسسه. يتولى مصطفى الاستراتيجية والهوية واتجاه كل عمل رقمي، ولا يسلّم مشروعك لمصمم أقل خبرة ثم ينسحب.",
    points: [
      [
        "مع من ستعمل",
        "مع مصطفى مباشرةً، من أول مكالمة حتى التسليم. لا مدير حسابات بينك وبين من ينفّذ العمل فعليًا.",
      ],
      [
        "حين يحتاج النطاق إلى أيدٍ أكثر",
        "تستعين المشاريع الكبيرة بمتخصصين بعينهم (تطوير، تصوير، رسوم متحركة، إنتاج طباعي) بتنسيق ومراجعة جودة من الاستوديو، وضمن نطاق مكتوب واحد.",
      ],
      [
        "إدارة المشروع",
        "يسير كل مشروع وفق المنهج نفسه (38 يومًا) مع اعتمادات كتابية عند كل مرحلة، ونظام ملفات مشترك، وتقرير حالة أسبوعي مكتوب.",
      ],
      [
        "بعد الإطلاق",
        "يشمل التسليم نظام الأدلة، وجلسة تدريب للفريق، و30 يومًا من الدعم. أما الشراكة المستمرة فاختيارية بتسعير شهري، ولا تُفترض تلقائيًا.",
      ],
    ] as const,
    note: "إن احتاج العمل إلى فريق أكبر مما يستطيع الاستوديو تحمّله بمسؤولية، فسنقول ذلك في مرحلة العرض، قبل أي دفعة.",
  },
} as const;

export function StudioModelBand({ className }: { className?: string }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const copy = ar ? STUDIO_MODEL.ar : STUDIO_MODEL.en;

  return (
    <section aria-label={copy.label} className={joinClasses("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-1">
        <p className="font-mono text-micro uppercase tracking-[0.12em] text-accent">{copy.label}</p>
        <h2 className="max-w-[24ch] font-display text-title leading-[1.05] tracking-[-0.02em] text-text-primary">
          {copy.title}
        </h2>
        <p className="max-w-[62ch] text-body text-text-secondary">{copy.lead}</p>
      </div>
      {/* Bento: one picture panel carries the eye, four glass
          panels carry the words — unequal sizes, so the block reads as a
          composition instead of a list of identical text cards. */}
      <div className="bento">
        <figure className="panel panel--image b-5 flex flex-col justify-end md:row-span-2">
          <Image src="/images/generated/creative-chrome-figure.jpg" alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          <figcaption className="flex flex-col gap-1 p-4">
            <span className="font-mono text-micro uppercase tracking-[0.12em] text-alabaster/80">{ar ? "استوديو يقوده مؤسسه" : "Founder-led"}</span>
            <span className="panel__num">{ar ? "واحد" : "One"}</span>
            <span className="max-w-[26ch] text-body-sm text-alabaster/85">
              {ar ? "مسؤول عن مشروعك من أول مكالمة حتى التسليم." : "person accountable for your project, from first call to handover."}
            </span>
          </figcaption>
        </figure>
        {copy.points.map(([head, body], i) => (
          <div key={head} className={joinClasses("panel panel--glass flex flex-col gap-2", i === 0 ? "b-7" : i === 1 ? "b-7" : "b-6")}>
            <span className="font-mono text-micro tabular-nums" style={{ color: "var(--color-gold-text)" }}>{`0${i + 1}`}</span>
            <h3 className="min-w-0 font-display text-subtitle tracking-[-0.01em] text-text-primary [overflow-wrap:anywhere]">{head}</h3>
            <p className="max-w-[52ch] text-body-sm text-text-secondary">{body}</p>
          </div>
        ))}
      </div>
      <p className="max-w-[62ch] border-s-2 border-accent/40 ps-3 font-mono text-micro uppercase tracking-[0.06em] leading-[1.7] text-text-tertiary">
        {copy.note}
      </p>
    </section>
  );
}
