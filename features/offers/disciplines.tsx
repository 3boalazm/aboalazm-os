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
import Image from "next/image";
import { BandFrame } from "@/components/ui/band-frame";
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
            className={joinClasses(
              "flex flex-col overflow-hidden rounded-panel border bg-surface-1 max-md:w-[84%] max-md:shrink-0 max-md:snap-start",
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
                  {ar ? "اللي بتخرج بيه" : "What you walk away with"}
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
                    <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-pill bg-accent" />
                    {ar ? item[1] : item[0]}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                <Link
                  href={contactHref({ service: SERVICE_FOR[d.id], source: "/services" })}
                  className="inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.06em] text-accent transition-colors hover:text-text-primary"
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
          <Link key={d.id} href={d.href} role="listitem" className="discipline-ring" data-lead={highlight === d.id}>
            <span className="font-mono text-micro text-accent">{d.n}</span>
            <span className={ar ? "text-subtitle font-semibold text-text-primary" : "font-display text-subtitle tracking-[-0.01em] text-text-primary max-sm:text-body"}>
              {RING_LABEL[d.id][ar ? 1 : lang === "ms" ? 2 : 0]}
            </span>
          </Link>
        ))}
      </div>
      <p className="font-mono text-micro uppercase tracking-[0.12em] text-text-ghost">
        {ar ? "حيث يتقاطعوا: بيزنس مبني عشان يشتغل" : lang === "ms" ? "Di mana ia bertemu: dibina untuk berfungsi" : "Where they overlap: built to run"}
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
              ثلاث حاجات بيشتريها البيزنس. <em className="text-accent">مش اثنتا عشر خدمة.</em>
            </>
          ) : (
            <>
              Three things a business buys. <em className="text-accent">Not twelve services.</em>
            </>
          )}
        </h2>
        <p className="text-body-sm text-text-secondary">
          {ar
            ? "أغلب الاستوديوهات بتبيع مهام. الشغل هنا متجمّع حسب النتيجة اللي بينتجها — براند يثق فيه السوق، وطبقة رقمية بتشتغل، وأنظمة بتخلي التشغيل واضح. تقدر تبدأ بواحدة وتضيف الباقي بعدين؛ الاتنين مصممين يوصلوا لبعض."
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
    label: "كيف يشتغل الاستوديو",
    title: "استوديو يقوده مؤسسه، مع فريق يتسع على قدر النطاق.",
    lead: "Aboalazm OS استوديو يقوده مؤسسه. مصطفى يقود الاستراتيجية والهوية واتجاه كل بناء رقمي — ولا يسلّم مشروعك لمصمم أقل خبرة ثم ينسحب.",
    points: [
      [
        "مع مين هتتعامل",
        "مع مصطفى مباشرة، من أول مكالمة للتسليم. لا مدير حساب بينك وبين من ينفّذ العمل فعليًا.",
      ],
      [
        "لما النطاق يحتاج أيدي أكتر",
        "المشروعات الكبيرة تستعين بمتخصصين محددين — تطوير، تصوير، موشن، إنتاج طباعي — بتنسيق ومراجعة جودة من الاستوديو، ونطاق مكتوب واحد.",
      ],
      [
        "إدارة المشروع",
        "كل مشروع يسير بمنهج الـ38 يومًا نفسه مع اعتمادات كتابية عند كل مرحلة، ونظام ملفات مشترك، وتقرير حالة أسبوعي مكتوب.",
      ],
      [
        "بعد الإطلاق",
        "التسليم يشمل نظام الأدلة، وجلسة تدريب للفريق، و30 يوم دعم. الشراكة المستمرة اختيارية، بتسعير شهري، ولا تُفترض تلقائيًا.",
      ],
    ] as const,
    note: "لو العمل محتاج فريقًا أكبر من قدرة الاستوديو على تحمّله بمسؤولية، نقولها في مرحلة العرض — قبل أي دفعة.",
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
      {/* Numbered glass cards (the "Built on Principles" idiom): on a phone
          they swipe one at a time instead of stacking into a text wall — and
          they sit on a glass sculpture plate, so the section opens on an image
          instead of on three paragraphs. */}
      <BandFrame
        src="/images/generated/creative-chrome-figure.jpg"
        veil="bottom"
        shape="bleed"
        contentClassName="flex flex-col gap-3 max-lg:p-4"
      >
        {/* Phones: the shelf must break out of BOTH paddings it sits in — the
            frame's own p-4 (32px) and the page container's 24px — or it is
            clipped to a ~296px window and each card collapses to a 144px
            column of one-word lines. -mx-7 = 56px returns it to the screen
            edges; px-3 lines the first card up with every other shelf. */}
        <dl className="grid gap-3 max-md:-mx-7 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:grid-cols-2">
        {copy.points.map(([head, body], i) => (
          <div
            key={head}
            className="flex flex-col gap-2 rounded-panel border border-border-subtle bg-surface-1 p-4 max-md:w-[84%] max-md:shrink-0 max-md:snap-start max-md:p-3"
          >
            {/* Number above the title on phones: side by side, a long display
                word ("MANAGEMENT") ran out of the card. */}
            <dt className="flex items-baseline gap-3 max-md:flex-col max-md:gap-1">
              <span className="font-display text-title leading-none text-accent">{`0${i + 1}`}</span>
              <span className="min-w-0 font-display text-subtitle tracking-[-0.01em] text-text-primary [overflow-wrap:anywhere]">{head}</span>
            </dt>
            <dd className="text-body-sm text-text-secondary">{body}</dd>
          </div>
        ))}
        </dl>
      </BandFrame>
      <p className="max-w-[62ch] border-s-2 border-accent/40 ps-3 font-mono text-micro uppercase tracking-[0.06em] leading-[1.7] text-text-tertiary">
        {copy.note}
      </p>
    </section>
  );
}
