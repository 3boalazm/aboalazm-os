"use client";

import Link from "@/components/ui/localized-link";
import { ContactForm } from "@/features/contact";
import { useLang } from "@/components/providers/lang-provider";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { bookHref, DEPOSIT_CTA_LABEL, TERMS_LINE, type PlanId } from "@/lib/offers";
import type { ContactContext } from "@/lib/contact-context";
import {
  BOOKING_CTA_LABEL,
  BOOKING_URL,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  RESPONSE_PROMISE,
} from "@/lib/contact-details";

const CHANNELS = [
  { en: "WhatsApp", ar: "واتساب", label: "+20 109 250 0454", href: "https://wa.me/201092500454" },
  { en: "Email", ar: "إيميل", label: CONTACT_EMAIL, href: CONTACT_EMAIL_HREF },
] as const;
const CORAL = { primary: "rgb(255 107 71 / 0.16)", secondary: "rgb(255 168 120 / 0.08)" };

export function ContactView({ context }: { context?: ContactContext }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  useAmbientGlow(CORAL, 0.45);

  const depositPlanId: PlanId =
    (context?.tier as PlanId | undefined) ??
    (context?.service === "website" ? "bilingual-site" : "brand-identity");

  return (
    <main className="container-content flex flex-col gap-5 pb-8">
      <header className="flex max-w-[65ch] flex-col gap-2">
        <p className="font-mono text-micro uppercase tracking-[0.1em] text-accent">
          {ar ? "تواصل / مشروع جديد" : "CONTACT / YOUR NEXT PROJECT"}
        </p>
        <h1 className="font-display text-title text-text-primary">
          {ar ? "احكيلي عن مشروعك." : "Tell me about your project."}
        </h1>
        <p className="text-body-sm text-text-secondary">
          {ar
            ? "اسمك، إيميلك، وفكرة بسيطة كفاية نبدأ. ولو لسه بتحدد المطلوب، نقدر نوضح النطاق مع بعض."
            : "Your name, email and a short idea are enough to start. If you are still figuring things out, we can define the scope together."}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-body-sm">
          <Link
            href={bookHref(depositPlanId)}
            className="rounded-pill bg-accent px-3.5 py-1.5 font-mono text-label text-obsidian"
          >
            {ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]} →
          </Link>
          <a
            href="https://wa.me/201092500454"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            {ar ? "واتساب مباشرة" : "Chat on WhatsApp"} ↗
          </a>
          <a href={CONTACT_EMAIL_HREF} className="underline underline-offset-4">
            {ar ? "ابعت إيميل" : "Send an email"}
          </a>
          {BOOKING_URL ? (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-booking-click="true"
              className="text-accent underline underline-offset-4"
            >
              {ar ? BOOKING_CTA_LABEL[1] : BOOKING_CTA_LABEL[0]} ↗
            </a>
          ) : null}
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[7fr_5fr]">
        <ContactForm
          key={`${context?.service}-${context?.tier}-${context?.source}`}
          context={context}
        />
        <aside className="flex flex-col gap-4">
          <div className="rounded-card border border-border-default bg-surface-1 p-3">
            <h2 className="font-display font-display-sm text-subtitle">
              {ar ? "نبدأ بمحادثة؟" : "Prefer a conversation?"}
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              {ar ? RESPONSE_PROMISE.ar : RESPONSE_PROMISE.en}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href={bookHref(depositPlanId)}
                className="flex min-h-6 flex-wrap items-center justify-between gap-1 rounded-card border border-accent/50 bg-accent/10 px-2 py-1.5 text-body-sm font-medium text-accent hover:border-accent"
              >
                <span>{ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]} →</span>
                <span className="font-mono text-micro text-text-secondary">
                  {ar ? "عربون 50%" : "50% Deposit"}
                </span>
              </Link>
              {BOOKING_URL ? (
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-booking-click="true"
                  className="flex min-h-6 flex-wrap items-center justify-between gap-1 rounded-card border border-border-default px-2 py-1.5 text-body-sm hover:border-accent"
                >
                  <span>{ar ? BOOKING_CTA_LABEL[1] : BOOKING_CTA_LABEL[0]} ↗</span>
                  <span className="font-mono text-micro text-text-secondary">30 min</span>
                </a>
              ) : null}
              {CHANNELS.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  {...(c.href.startsWith("https")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex min-h-6 flex-wrap items-center justify-between gap-1 rounded-card border border-border-default px-2 py-1.5 text-body-sm hover:border-accent"
                >
                  <span>{ar ? c.ar : c.en} ↗</span>
                  <span dir="ltr" className="break-all text-text-secondary">
                    {c.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-body-sm text-text-secondary">
            <h2 className="font-display font-display-sm text-subtitle text-text-primary">
              {ar ? "بعد رسالتك" : "What happens next"}
            </h2>
            <ol className="list-decimal space-y-1 ps-3">
              <li>
                {ar
                  ? "أراجع المطلوب وأسألك عن أي تفاصيل ناقصة."
                  : "I review your idea and ask for any missing details."}
              </li>
              <li>
                {ar
                  ? "لو محتاجين، نرتب مكالمة مناسبة للطرفين."
                  : "We arrange a call if it will help clarify the scope."}
              </li>
              <li>
                {ar
                  ? "تستلم عرضًا بالمخرجات والمدة والتكلفة قبل أي التزام."
                  : "You receive deliverables, a timeline and a quote before making a commitment."}
              </li>
            </ol>
          </div>
          <p className="text-caption text-text-tertiary">
            {ar ? "بتتواصل بخصوص وظيفة؟ " : "Reaching out about a role? "}
            <Link href="/for-hiring" className="underline underline-offset-4">
              {ar ? "ملف التوظيف والسيرة الذاتية" : "Hiring profile and CV"}
            </Link>
          </p>
        </aside>
      </div>

      <details className="rounded-card border border-border-subtle p-3">
        <summary className="cursor-pointer font-display font-display-sm text-body">
          {ar ? "نطاق التعاون والدفع" : "Scope and payment"}
        </summary>
        <p className="mt-2 max-w-[75ch] text-body-sm text-text-secondary">
          {TERMS_LINE[ar ? 1 : 0]}
        </p>
        <Link
          href="/agreement"
          className="mt-2 inline-block text-body-sm text-accent underline underline-offset-4"
        >
          {ar ? "تفاصيل اتفاقية التعاون" : "Read the collaboration terms"} →
        </Link>
      </details>
    </main>
  );
}
