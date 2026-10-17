"use client";
import Link from "next/link";
import { StatusNode } from "@/features/hero";
import { ContactForm } from "@/features/contact";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { Heading } from "@/components/ui/Heading";
import { PanelCard, panelCardVariants } from "@/components/ui/PanelCard";
import { TERMS_LINE } from "@/lib/offers";
import { trackEvent } from "@/lib/analytics";
import type { CSSProperties } from "react";

/* ── Absorbed from /start (overhaul S3 — funnel consolidation) ──────
   The standalone /start route duplicated /services, /process and this
   page. Its two pieces of unique value — the fit check and the kickoff
   expectations — now live here, right before the form, so the last
   step of the funnel qualifies the reader instead of just collecting
   a message. Payment wording comes from TERMS_LINE in lib/offers (the
   single source), never paraphrased locally. */
const EXPECT = {
  en: {
    eyebrow: "BEFORE YOU WRITE",
    titleA: "Is this",
    titleB: "for you?",
    fitLabel: "Right fit if —",
    notLabel: "Probably not, if —",
    fits: [
      "You're launching or repositioning a brand and need more than a logo.",
      "You want a system your team can actually use — not just beautiful files.",
      "You think in business terms: strategy, audience, differentiation.",
      "You respect process and understand that good work takes real time.",
    ],
    notFits: [
      "You need a logo by tomorrow.",
      "You want to skip strategy and go straight to colours.",
      "You're comparing quotes on Fiverr.",
    ],
    stepsLabel: "HOW KICKOFF WORKS",
    steps: [
      { n: "01", name: "Discovery Call", body: "Free 30-minute call — brand, goals, timeline, budget. No pitch, just an honest read on fit.", cta: "Book the Call", href: "https://wa.me/201092500454" },
      { n: "02", name: "Brief & Proposal", body: "You fill in a brand questionnaire. I send a scoped proposal: deliverables, timeline, investment, terms. You review, we align." },
      { n: "03", name: "Contract & Kickoff", body: "Sign the agreement, send the 50% deposit, and we're officially started. Project brief lands in your inbox the same day." },
    ],
  },
  ar: {
    eyebrow: "قبل ما تكتب",
    titleA: "ده مناسب",
    titleB: "ليك؟",
    fitLabel: "المكان الصح لو —",
    notLabel: "على الأرجح لأ، لو —",
    fits: [
      "بتطلق أو بتعيد تموضع براند وتحتاج أكثر من مجرد لوجو.",
      "عايز نظام فريقك يقدر يشتغل بيه فعلًا — مش بس ملفات جميلة.",
      "بتفكر بمنطق أعمال: استراتيجية، جمهور، تمييز.",
      "بتحترم العملية وبتفهم إن الشغل الكويس بياخد وقت حقيقي.",
    ],
    notFits: [
      "محتاج لوجو بكرة.",
      "عايز تتخطى الاستراتيجية وتروح مباشرة للألوان.",
      "بتقارن أسعار على Fiverr.",
    ],
    stepsLabel: "إزاي بنبدأ رسميًا",
    steps: [
      { n: "٠١", name: "مكالمة اكتشاف", body: "مكالمة مجانية ٣٠ دقيقة — البراند والأهداف والجدول والميزانية. مفيش بيتش، مجرد قراءة صريحة للتوافق.", cta: "احجز المكالمة", href: "https://wa.me/201092500454" },
      { n: "٠٢", name: "البريف والعرض", body: "بتملّي استبيان البراند. بابعتلك عرضًا محدد النطاق: المخرجات، الجدول، الاستثمار، والشروط. بتراجع ونتفق." },
      { n: "٠٣", name: "العقد والانطلاق", body: "بتوقّع الاتفاقية وتبعت الـ٥٠٪ المقدّم، ورسميًا بدأنا. بريف المشروع يوصل لصندوق بريدك نفس اليوم." },
    ],
  },
} as const;

const CHANNELS = {
  en: [
    ["EMAIL","Best for project briefs","m1aboalazm@gmail.com","mailto:m1aboalazm@gmail.com"],
    ["WHATSAPP","Quick conversations","+20 109 250 0454","https://wa.me/201092500454"],
    ["LINKEDIN","Professional network","linkedin.com/in/aboalazm","https://www.linkedin.com/in/aboalazm"],
    ["BEHANCE","Full portfolio","behance.net/aboalazm","https://www.behance.net/aboalazm"],
  ],
  ar: [
    ["إيميل","الأنسب للبريف والمشاريع","m1aboalazm@gmail.com","mailto:m1aboalazm@gmail.com"],
    ["واتساب","محادثات سريعة","+20 109 250 0454","https://wa.me/201092500454"],
    ["لينكدإن","الشبكة المهنية","linkedin.com/in/aboalazm","https://www.linkedin.com/in/aboalazm"],
    ["بيهانس","البورتفوليو كامل","behance.net/aboalazm","https://www.behance.net/aboalazm"],
  ],
} as const;

const CONTACT_CORAL = {
  primary: "rgb(255 107 71 / 0.16)",
  secondary: "rgb(255 168 120 / 0.08)",
} as const;

export function ContactView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const channels = ar ? CHANNELS.ar : CHANNELS.en;
  const x = ar ? EXPECT.ar : EXPECT.en;
  /* Warm, human, low-terminal — this route keeps the studio's own coral
     rather than borrowing a project accent, so the last step of the
     funnel feels like a person answering, not a service desk. */
  useAmbientGlow(CONTACT_CORAL, 0.45);

  return (
    <main className="container-wide relative flex min-h-svh flex-col gap-12 py-16">
      {/* ── Fit check + kickoff expectations (absorbed from /start) ── */}
      <section className="flex flex-col gap-6">
        <Heading
          eyebrow={x.eyebrow}
          title={
            <>
              {x.titleA}{" "}
              <em className="text-accent">{x.titleB}</em>
            </>
          }
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <PanelCard className="rounded-card p-4">
            <p className="font-mono text-micro uppercase tracking-[0.08em] text-accent">
              {x.fitLabel}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {x.fits.map((f) => (
                <li key={f} className="flex items-start gap-2 text-body-sm text-text-secondary">
                  <span aria-hidden className="mt-0.5 shrink-0 text-accent"><Icon name="check" /></span>
                  {f}
                </li>
              ))}
            </ul>
          </PanelCard>
          <PanelCard className="rounded-card p-4">
            <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary">
              {x.notLabel}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {x.notFits.map((f) => (
                <li key={f} className="flex items-start gap-2 text-body-sm text-text-secondary">
                  <span aria-hidden className="mt-0.5 shrink-0 text-text-ghost"><Icon name="x" /></span>
                  {f}
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>

        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {x.stepsLabel}
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {x.steps.map((s) => (
            <PanelCard key={s.n} className="flex flex-col gap-2 rounded-card p-4">
              <span className="font-mono text-micro text-accent">{s.n}</span>
              <p className="font-display font-[700] text-body text-text-primary">{s.name}</p>
              <p className="text-body-sm text-text-secondary">{s.body}</p>
              {"cta" in s && s.cta ? (
                <a
                  href={s.href}
                  onClick={() => trackEvent("cta_start_project", { placement: "contact_steps" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-1.5 font-mono text-micro uppercase tracking-[0.08em] text-text-primary underline decoration-border-default underline-offset-4 hover:text-accent"
                >
                  {s.cta} <Icon name="arrow-up-right" />
                </a>
              ) : null}
            </PanelCard>
          ))}
        </div>

        <p className={panelCardVariants({ className: "max-w-[72ch] rounded-card p-3 text-body-sm text-text-secondary" })}>
          {TERMS_LINE[ar ? 1 : 0]}
        </p>
      </section>

      {/* ── Contact panel: info & channels | the form ── */}
      <div className="grid gap-8 lg:grid-cols-[5fr_7fr]">
        <div className="flex flex-col gap-4">
          <Heading
            eyebrow={ar ? "07 / تواصل" : "07 / CONTACT"}
            title={
              ar
                ? <>قولّي عايز <em>تبني إيه.</em></>
                : <>Tell me what you want <em>to build.</em></>
            }
            titleClassName="max-w-[16ch] text-balance-pretty"
            subtitle={
              ar
                ? "اسم وإيميل وجملة كافية للبداية. لو مش جاهز تملا نموذج، الإيميل والواتساب تحت بديل واضح."
                : "A name, an email, and a sentence is enough. Prefer not to fill a form? Email and WhatsApp are right here."
            }
            subtitleClassName="max-w-[46ch]"
          />

          <div className="mt-4 flex flex-col items-start gap-2">
            <StatusNode />
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {ar
                ? "متوسط الرد: أقل من 24 ساعة · أحد–خميس · 10ص–7م القاهرة"
                : "AVG. RESPONSE: UNDER 24H · SUN–THU · 10AM–7PM CAIRO"}
            </p>
          </div>

          {/* Recruiter / Hiring path differentiation */}
          <div className="mt-2 rounded-card border border-border-subtle bg-surface-1 p-3">
            <p className="font-mono text-micro text-accent uppercase tracking-[0.08em]">
              {ar ? "فرص التوظيف والشركات" : "Hiring & In-house Roles"}
            </p>
            <p className="mt-1 text-body-sm text-text-secondary">
              {ar
                ? "هل تتواصل بخصوص دور وظيفي كامل أو تعاقدي لمصمم هوية بصرية؟ يمكنك مراجعة وتنزيل ملف المرشح والسيرة الذاتية مباشرة."
                : "Reaching out regarding a full-time, contract, or agency role? You can review the hiring dossier and download the CV directly."}
            </p>
            <Link
              href="/for-hiring"
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-micro text-text-primary underline decoration-border-default underline-offset-4 hover:text-accent"
            >
              <span>{ar ? "الانتقال لصفحة مسؤولي التوظيف والـ CV ←" : "Go to For Hiring Teams Dossier →"}</span>
            </Link>
          </div>

          <div className="mt-2 flex flex-col border-t border-border-subtle">
            {channels.map(([tag, hint, label, href]) => (
              <a
                key={tag}
                href={href}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group grid grid-cols-[6rem_1fr_auto] items-baseline gap-2 border-b border-border-subtle py-2"
              >
                <span className="font-mono text-micro uppercase tracking-[0.10em] text-accent">{tag}</span>
                <span className="min-w-0">
                  <span className="block truncate text-body-sm text-text-primary">{label}</span>
                  <span className="block font-mono text-micro text-text-ghost">{hint}</span>
                </span>
                <span aria-hidden className="inline-flex text-text-tertiary transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
              </a>
            ))}
          </div>
        </div>

        {/* The form is the focal object of this route. It used to be one more
            matte panel in a page of flat panels — a light field and a glass
            rim give it the weight its role deserves without adding any
            animated decoration. */}
        <div className="relative min-w-0 overflow-hidden">
          <div
            aria-hidden
            className="atmos-field atmos-drift"
            style={
              {
                "--atmos-1": "var(--color-accent)",
                "--atmos-2": "var(--color-creative)",
                "--atmos-x": "30%",
                "--atmos-y": "0%",
              } as CSSProperties
            }
          />
          <div className="relative z-elevated">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
