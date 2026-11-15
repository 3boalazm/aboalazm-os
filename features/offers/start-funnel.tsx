"use client";

/**
 * START FUNNEL — one entry point, four ordered steps (2026-11 repositioning, P1 · point 8).
 *
 * The audit's finding: /book (pay 50% now) and /contact (tell us what you need)
 * competed as first steps, and a first-time visitor was asked to pay before the
 * problem was even described. The order is now explicit and repeated wherever
 * the visitor is asked to start: call → written scope → agreement → deposit.
 */
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { buttonVariants } from "@/components/ui/Button";
import { joinClasses } from "@/lib/utils";
import { BOOKING_CTA_LABEL, BOOKING_URL } from "@/lib/contact-details";
import { contactHref } from "@/lib/contact-context";
import { FUNNEL_STEPS, START_HREF } from "@/lib/offers";

export function StartFunnel({
  className,
  showSteps = true,
  primaryLabel,
}: {
  className?: string;
  /** /contact and /book render the steps themselves; the band then shows only the CTA. */
  showSteps?: boolean;
  primaryLabel?: readonly [string, string];
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const label = primaryLabel ?? BOOKING_CTA_LABEL;

  return (
    <section
      aria-label={ar ? "كيف تبدأ" : "How to start"}
      className={joinClasses("flex flex-col gap-4", className)}
    >
      <div className="flex flex-col gap-1">
        <p className="font-mono text-micro uppercase tracking-[0.12em] text-accent">
          {ar ? "طريقة البدء" : "How to start"}
        </p>
        <h2 className="max-w-[26ch] font-display text-title leading-[1.05] tracking-[-0.02em] text-text-primary">
          {ar ? (
            <>
              مكالمة أولًا. <em className="text-accent">الدفع آخر خطوة.</em>
            </>
          ) : (
            <>
              A call first. <em className="text-accent">Payment is the last step.</em>
            </>
          )}
        </h2>
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {ar
            ? "مش محتاج تكون عارف إيه اللي طالبه بالضبط. احجز مكالمة، نشرح المشكلة، وتستلم نطاقًا وعرضًا سعر مكتوبًا قبل أي التزام."
            : "You do not need to know exactly what you need. Book the call, describe the problem, and you get a written scope and price before any commitment."}
        </p>
      </div>

      {showSteps ? (
        <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {FUNNEL_STEPS.map((step) => (
            <li
              key={step.n}
              className="flex flex-col gap-1 rounded-panel border border-border-subtle bg-surface-1 p-3 md:p-4"
            >
              <span className="font-display text-title leading-none text-accent">{step.n}</span>
              <span className="mt-1 font-display text-subtitle tracking-[-0.01em] text-text-primary">
                {ar ? step.title[1] : step.title[0]}
              </span>
              <span className="text-body-sm text-text-secondary">{ar ? step.body[1] : step.body[0]}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={START_HREF}
          className={buttonVariants({
            variant: "primary",
            className:
              "inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-label tracking-[0.06em]",
          })}
        >
          {ar ? label[1] : label[0]}
          <span aria-hidden className="inline-flex">
            <Icon name="arrow-right" />
          </span>
        </Link>
        {BOOKING_URL ? (
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-booking-click="true"
            className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary underline underline-offset-4 transition-colors hover:text-text-primary"
          >
            {ar ? "أو احجز موعدًا في التقويم ↗" : "Or pick a slot in the calendar ↗"}
          </a>
        ) : null}
        <Link
          href={contactHref({ service: "not-sure", source: "/" })}
          className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary underline underline-offset-4 transition-colors hover:text-text-primary"
        >
          {ar ? "أو أرسل رسالة قصيرة" : "Or send a short brief"}
        </Link>
      </div>

      <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
        {ar
          ? "— صفحة الاحجز بعربون مخصصة لخطوة البدء بعد اعتماد النطاق —"
          : "— THE DEPOSIT PAGE IS STEP 04, USED AFTER THE SCOPE IS AGREED —"}
      </p>
    </section>
  );
}
