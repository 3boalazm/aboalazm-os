"use client";

/**
 * AFTER-SESSION FEEDBACK FORM — rendered entirely from FEEDBACK_GROUPS in
 * ./feedback.ts, so adding a question never means touching this file.
 *
 * Behaviour is the registration form's (./registration-form.tsx), including
 * the lessons recorded there:
 *   · the form is `noValidate`: the browser's own check stops the submit
 *     before any of this code runs and some browsers (in-app WebViews above
 *     all) do not draw its bubble — the person would see the page jump and
 *     nothing sent. So submit runs `validateFeedback` — the function the
 *     server re-checks with — then writes a message under every question that
 *     needs one, a summary that jumps to each, and scrolls to the first;
 *   · the success swap is a plain conditional, never AnimatePresence
 *     mode="wait";
 *   · a timeout marks the receipt "uncertain" instead of letting the person
 *     resubmit blindly. Anonymous answers cannot be de-duplicated afterwards,
 *     so this matters more here than it does for registration.
 *
 * Inputs are uncontrolled (FormData is read at submit). Radio and scale cards
 * carry a real `<input>` inside a `<label>`, so keyboard and screen-reader
 * behaviour stays the browser's; the selected state is `has-[:checked]` CSS.
 * A choice question is wrapped in a `<div>`, never a `<label>` — one label
 * cannot own a fieldset of controls.
 */
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/components/providers/lang-provider";
import { physics } from "@/lib/motion";
import type { Bi } from "./assessment";
import {
  ALL_FEEDBACK_FIELDS,
  FEEDBACK_GROUPS,
  firstFeedbackFieldWithError,
  isFeedbackNativelyRequired,
  validateCertificateName,
  validateFeedback,
  type FeedbackFieldDef,
  type FeedbackFieldErrors,
} from "./feedback";
import { ANSWER_MAX } from "./assessment";
import { requestCertificate, submitSessionFeedback } from "./feedback-actions";
import { collectAnswers } from "./validate";

type Status = "idle" | "working" | "sent" | "error" | "rateLimited" | "uncertain" | "invalid" | "unknownSession";

const FIELD =
  "w-full rounded-card border border-border-subtle bg-surface-0 px-2 py-1.5 text-body-sm text-text-primary outline-none placeholder:text-text-ghost transition-colors duration-fast ease-physics hover:border-border-default focus:border-border-strong";
const LABEL = "font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary";
const OPTION_CARD =
  "flex cursor-pointer items-start gap-2 rounded-card border border-border-subtle bg-surface-0 px-2 py-1.5 text-body-sm transition-colors duration-fast ease-physics hover:border-border-default has-[:focus-visible]:border-border-strong has-[:checked]:border-accent has-[:checked]:bg-accent-08";
const SCALE_CARD =
  "flex cursor-pointer items-center justify-center rounded-card border border-border-subtle bg-surface-0 py-2 font-display text-subtitle transition-colors duration-fast ease-physics hover:border-border-default has-[:focus-visible]:border-border-strong has-[:checked]:border-accent has-[:checked]:bg-accent-14";

const ERROR_COPY: Record<string, Bi> = {
  required: { ar: "محتاجين إجابتك على السؤال ده.", en: "Please answer this one." },
  too_long: { ar: "الإجابة أطول من اللازم.", en: "That answer is too long." },
  invalid_url: { ar: "الرابط مش صحيح — اكتبه زي linkedin.com/in/username", en: "That doesn't look like a LinkedIn profile link — e.g. linkedin.com/in/username" },
  invalid_option: { ar: "اختار إجابة من اللي موجودين.", en: "Pick one of the listed answers." },
  needs_name: { ar: "اكتب اسمك لو عايزنا نعرض رأيك باسمك.", en: "Add your name if we may quote you." },
};

const COPY = {
  formName: { ar: "نموذج تقييم السيشن", en: "LinkedIn session — feedback" },
  eyebrow: { ar: "تقييم السيشن", en: "Session feedback" },
  intro: {
    ar: "شكرًا إنك كنت معانا! 🙌 دقيقة واحدة من وقتك بتحدد إيه اللي نزوّده وإيه اللي نشيله في السيشن الجاية.",
    en: "Thanks for being there! 🙌 One minute of your time decides what we add and what we cut next time.",
  },
  submit: { ar: "إرسال رأيي", en: "Send my feedback" },
  working: { ar: "بيرسل…", en: "Sending…" },
  successTitle: { ar: "وصل رأيك. شكرًا!", en: "Got it. Thank you!" },
  successBody: {
    ar: "هنقراه بنفسنا، وهنبني بيه السيشن الجاية.",
    en: "We read every one ourselves, and the next session is built from them.",
  },
  successStep: {
    ar: "الخطوة اللي اخترتها أول حاجة تعملها النهارده — اعملها قبل ما تقفل الموبايل.",
    en: "Do the first step you picked today, before you close this tab.",
  },
  deckLink: { ar: "افتح مراجع السيشن", en: "Open the session references" },
  rateLimited: {
    ar: "عدد محاولات كبير من نفس الشبكة في وقت قصير. استنى دقيقة وحاول تاني.",
    en: "Too many attempts from this network just now. Wait a minute and try again.",
  },
  storageFailed: {
    ar: "الإرسال فشل — رأيك ما اتحفظش. جرّب تاني، ولو استمر ابعتلنا على البريد.",
    en: "The submission failed and nothing was saved. Try again; if it keeps happening, write to us.",
  },
  unknownSession: {
    ar: "الرابط ده تبع سيشن غير معروف. اعمل تحديث للصفحة وحاول تاني.",
    en: "This link points at an unknown session. Reload the page and try again.",
  },
  timeout: {
    ar: "الإرسال ياخد وقت أطول من المعتاد — متبعتش تاني علشان رأيك مايتسجلش مرتين. لو الصفحة ما اتغيّرتش بعد دقيقة، ابعتلنا على البريد.",
    en: "The request is taking unusually long. Don't submit again — that would count your answer twice. If nothing changed after a minute, write to us.",
  },
  invalid: {
    ar: "لسه فيه أسئلة ناقصة — اضغط على السؤال علشان توصله:",
    en: "A few answers are missing — tap a question to jump to it:",
  },
  optional: { ar: "اختياري", en: "optional" },
  choose: { ar: "اختر إجابة", en: "Choose an answer" },
  progress: { ar: "الأسئلة الأساسية", en: "Required answers" },
  certAsk: { ar: "عايز شهادة حضور؟", en: "Want an attendance certificate?" },
  certHint: {
    ar: "اكتب اسمك زي ما تحب يظهر على الشهادة، وهنبعتهالك. الاسم ده بيتحفظ لوحده وماله علاقة بإجاباتك.",
    en: "Type your name as you want it printed and we will send it to you. It is stored on its own, never linked to your answers.",
  },
  certLabel: { ar: "الاسم على الشهادة", en: "Name on the certificate" },
  certSend: { ar: "ابعت اسمي", en: "Send my name" },
  certSending: { ar: "بيرسل…", en: "Sending…" },
  certDone: { ar: "وصل اسمك — هتوصلك الشهادة قريب. 🎓", en: "Got your name — the certificate is on its way. 🎓" },
  certFail: { ar: "الإرسال فشل — جرّب تاني.", en: "That failed — try again." },
  certInvalid: {
    ar: "اكتب اسمك بحروف (من غير أرقام أو رموز).",
    en: "Please type your name in letters (no digits or symbols).",
  },
} satisfies Record<string, Bi>;

export function SessionFeedbackForm({ sessionKey, deckHref }: { sessionKey: string; deckHref?: string }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const dict: keyof Bi = ar ? "ar" : "en";
  const reduceMotion = useReducedMotion();
  const t = (pair: Bi) => pair[dict];

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FeedbackFieldErrors>({});
  const [answered, setAnswered] = useState(0);
  const [certOpen, setCertOpen] = useState(false);
  const [certName, setCertName] = useState("");
  const [certState, setCertState] = useState<"idle" | "working" | "done" | "error" | "invalid">("idle");

  const inFlight = useRef(false);
  const mounted = useRef(true);
  const didStart = useRef(false);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  const eventContext = { session: sessionKey, locale: lang };
  const requiredFields = ALL_FEEDBACK_FIELDS.filter((f) => f.required);

  /** Progress rail: required answers so far. A prompt, not a gate. */
  function trackProgress() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    let n = 0;
    for (const field of requiredFields) {
      const values = data.getAll(field.name);
      if (values.some((v) => typeof v === "string" && v.trim())) n += 1;
    }
    setAnswered(n);
  }

  /** Changing an answer retires the message under it — the person is fixing it. */
  function onFormChange(e: React.ChangeEvent<HTMLFormElement>) {
    trackProgress();
    const name = (e.target as { name?: string }).name;
    /* Ticking "quote me" or typing a name both bear on the name's message. */
    const retire = name === "allowQuote" ? ["allowQuote", "fullName"] : name ? [name] : [];
    if (retire.some((n) => n in fieldErrors)) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        for (const n of retire) delete next[n as keyof FeedbackFieldErrors];
        return next;
      });
    }
  }

  /* The summary box goes with the last message under a question. */
  useEffect(() => {
    if (status === "invalid" && Object.keys(fieldErrors).length === 0) setStatus("idle");
  }, [status, fieldErrors]);

  /** Bring one question into the middle of the screen and put the keyboard on its first control. */
  function goToQuestion(name: string) {
    const question = formRef.current?.querySelector<HTMLElement>(`[data-question="${name}"]`);
    if (!question) return;
    const clearance = parseFloat(getComputedStyle(question).scrollMarginTop) || 0;
    const fits = question.getBoundingClientRect().height + clearance <= window.innerHeight;
    question.scrollIntoView({ block: fits ? "center" : "start", behavior: reduceMotion ? "auto" : "smooth" });
    question.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
  }

  function showFieldErrors(fields: FeedbackFieldErrors) {
    /* flushSync: the messages must be in the DOM before we measure and scroll. */
    flushSync(() => {
      setFieldErrors(fields);
      setStatus("invalid");
    });
    trackEvent("feedback_form_error", { ...eventContext, reason: "invalid_field" });
    const first = firstFeedbackFieldWithError(fields);
    if (first) goToQuestion(first);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const form = e.currentTarget;
    const data = new FormData(form);

    /* noValidate switches the browser's own check off, so this is the gate before the request:
       the server's verdict, reached without a round trip. */
    const local = validateFeedback(collectAnswers(data.entries()));
    if (!local.ok) {
      showFieldErrors(local.fields);
      return;
    }

    inFlight.current = true;
    setStatus("working");
    setFieldErrors({});

    try {
      const res = await Promise.race([
        submitSessionFeedback(data),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("timeout")), 20_000);
        }),
      ]);
      if (!mounted.current) return;

      if (!res.ok) {
        if (res.error === "invalid") {
          showFieldErrors(res.fields);
          return;
        }
        setStatus(res.error === "rate_limited" ? "rateLimited" : res.error === "unknown_session" ? "unknownSession" : "error");
        trackEvent("feedback_form_error", { ...eventContext, reason: res.error });
        return;
      }

      /* Offer the certificate with the name they already typed, before the form is wiped. */
      const typedName = data.get("fullName");
      if (typeof typedName === "string") setCertName(typedName.trim());
      form.reset();
      setAnswered(0);
      setStatus("sent");
      trackEvent("feedback_submit", eventContext);
    } catch (error) {
      /* A timeout cannot prove the server failed; a blind retry could count the answer twice. */
      const timedOut = error instanceof Error && error.message === "timeout";
      trackEvent("feedback_form_error", {
        ...eventContext,
        reason: timedOut ? "timeout_receipt_uncertain" : "network_receipt_uncertain",
      });
      if (mounted.current) setStatus("uncertain");
    } finally {
      inFlight.current = false;
    }
  }

  const errorFor = (name: string): string | null => {
    const code = fieldErrors[name as keyof FeedbackFieldErrors];
    return code ? t(ERROR_COPY[code] ?? ERROR_COPY.invalid_option!) : null;
  };

  const banner =
    status === "uncertain"
      ? { tone: "warn", text: t(COPY.timeout) }
      : status === "rateLimited"
        ? { tone: "danger", text: t(COPY.rateLimited) }
        : status === "error"
          ? { tone: "danger", text: t(COPY.storageFailed) }
          : status === "unknownSession"
            ? { tone: "danger", text: t(COPY.unknownSession) }
            : null;

  const problems = ALL_FEEDBACK_FIELDS.filter((field) => fieldErrors[field.name as keyof FeedbackFieldErrors]);

  return (
    <div className="rounded-panel border border-border-subtle bg-surface-1 p-3 shadow-card md:p-4">
      <div role="status" aria-live="polite">
        {status === "sent" ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={physics}
            className="flex flex-col gap-2 py-6 text-center"
          >
            <p ref={sentRef} tabIndex={-1} className="font-mono text-micro uppercase tracking-[0.10em] text-success outline-none">
              {t(COPY.eyebrow)}
            </p>
            <p className="font-display text-title tracking-[-0.015em]">{t(COPY.successTitle)}</p>
            <p className="text-body-sm text-text-secondary">{t(COPY.successBody)}</p>
            <p className="text-body-sm text-text-secondary">{t(COPY.successStep)}</p>
            <div className="mx-auto mt-2 flex w-full max-w-[420px] flex-col gap-1.5 rounded-card border border-border-subtle bg-surface-0 p-2 text-start">
              {certState === "done" ? (
                <p role="status" className="text-body-sm text-success">{t(COPY.certDone)}</p>
              ) : !certOpen ? (
                <button
                  type="button"
                  onClick={() => setCertOpen(true)}
                  className="w-full rounded-pill border border-accent bg-accent-14 px-3 py-1.5 font-display text-body-sm text-text-primary transition-colors duration-fast ease-physics hover:bg-accent-24"
                >
                  🎓 {t(COPY.certAsk)}
                </button>
              ) : (
                <form
                  noValidate
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (certState === "working") return;
                    const fd = new FormData(e.currentTarget);
                    const check = validateCertificateName(fd.get("certificateName"));
                    if (!check.ok) {
                      setCertState("invalid");
                      return;
                    }
                    setCertState("working");
                    try {
                      const res = await requestCertificate(fd);
                      if (!mounted.current) return;
                      setCertState(res.ok ? "done" : res.error === "invalid" ? "invalid" : "error");
                    } catch {
                      if (mounted.current) setCertState("error");
                    }
                  }}
                  className="flex flex-col gap-1.5"
                >
                  <p className="text-body-sm text-text-secondary">{t(COPY.certHint)}</p>
                  <label className="flex flex-col gap-1">
                    <span className={LABEL}>{t(COPY.certLabel)}</span>
                    <input
                      name="certificateName"
                      type="text"
                      autoComplete="name"
                      maxLength={120}
                      value={certName}
                      onChange={(e) => {
                        setCertName(e.target.value);
                        if (certState === "invalid" || certState === "error") setCertState("idle");
                      }}
                      aria-invalid={certState === "invalid" ? true : undefined}
                      className={`${FIELD} ${certState === "invalid" ? "border-danger-border" : ""}`}
                    />
                  </label>
                  <div aria-hidden="true" className="sr-only">
                    <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                  </div>
                  <input type="hidden" name="sessionKey" value={sessionKey} readOnly />
                  {certState === "invalid" ? <p role="alert" className="text-body-sm text-danger-text">{t(COPY.certInvalid)}</p> : null}
                  {certState === "error" ? <p role="alert" className="text-body-sm text-danger-text">{t(COPY.certFail)}</p> : null}
                  <button
                    type="submit"
                    disabled={certState === "working"}
                    className="w-full rounded-pill border border-accent bg-accent-14 px-3 py-1.5 font-display text-body-sm text-text-primary transition-colors duration-fast ease-physics hover:bg-accent-24 disabled:opacity-60"
                  >
                    {certState === "working" ? t(COPY.certSending) : t(COPY.certSend)}
                  </button>
                </form>
              )}
            </div>
            {deckHref ? (
              <p className="pt-1">
                <a href={deckHref} className="text-body-sm text-accent-text underline underline-offset-4 hover:text-text-primary">
                  {t(COPY.deckLink)}
                </a>
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </div>

      {status !== "sent" ? (
        <motion.form
          ref={formRef}
          aria-label={t(COPY.formName)}
          noValidate
          onSubmit={submit}
          onChange={onFormChange}
          onFocusCapture={() => {
            if (!didStart.current) {
              didStart.current = true;
              trackEvent("feedback_form_start", eventContext);
            }
          }}
          className="flex flex-col gap-4"
        >
          <p className="text-body text-text-secondary">{t(COPY.intro)}</p>

          <div className="flex items-center gap-2">
            <span className="h-1 flex-1 overflow-hidden rounded-pill bg-border-subtle" aria-hidden>
              <span
                className="block h-full rounded-pill bg-accent transition-[width] duration-base ease-physics"
                style={{ width: `${Math.min(100, (answered / Math.max(1, requiredFields.length)) * 100)}%` }}
              />
            </span>
            <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
              {t(COPY.progress)} {answered}/{requiredFields.length}
            </span>
          </div>

          {FEEDBACK_GROUPS.map((group) => (
            <section key={group.id} className="flex flex-col gap-1.5">
              <h2 className="flex items-baseline gap-2">
                <span className="font-mono text-micro uppercase tracking-[0.14em] text-accent">{group.index}</span>
                <span className="font-display text-subtitle">{t(group.title)}</span>
              </h2>
              {group.note ? <p className="text-body-sm text-text-tertiary">{t(group.note)}</p> : null}
              {group.fields.map((field) => (
                <FeedbackControl key={field.name} field={field} error={errorFor(field.name)} dict={dict} t={t} />
              ))}
            </section>
          ))}

          {/* Honeypot — invisible and never autofilled by name; a filled value is dropped by the server. */}
          <div aria-hidden="true" className="sr-only">
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </div>
          <input type="hidden" name="sessionKey" value={sessionKey} readOnly />

          {status === "invalid" && problems.length > 0 ? (
            <div role="alert" className="flex flex-col gap-1 rounded-card border border-danger-border bg-danger-dim px-2 py-1.5 text-body-sm text-danger-text">
              <p>{t(COPY.invalid)}</p>
              <ul className="flex flex-col gap-0.5">
                {problems.map((field) => (
                  <li key={field.name}>
                    <button type="button" onClick={() => goToQuestion(field.name)} className="text-start underline underline-offset-4">
                      {t(field.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {banner ? (
            <p role="alert" className={`text-body-sm ${banner.tone === "warn" ? "text-warning-text" : "text-danger-text"}`}>
              {banner.text}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "working"}
            className="w-full rounded-pill border border-accent bg-accent-14 px-3 py-2 font-display text-body text-text-primary transition-colors duration-fast ease-physics hover:bg-accent-24 disabled:opacity-60"
          >
            {status === "working" ? t(COPY.working) : t(COPY.submit)}
          </button>
        </motion.form>
      ) : null}
    </div>
  );
}

/* ── one renderer for every question type ───────────────────────────────── */

function FeedbackControl({
  field,
  error,
  dict,
  t,
}: {
  field: FeedbackFieldDef;
  error: string | null;
  dict: keyof Bi;
  t: (pair: Bi) => string;
}) {
  const errorId = `${field.name}-error`;
  const helpId = `${field.name}-help`;
  const describedBy = [error ? errorId : null, field.help ? helpId : null].filter(Boolean).join(" ") || undefined;
  const inputId = `${field.name}-input`;
  const isChoice = field.type === "radio" || field.type === "scale" || field.type === "multi";
  /* A checkbox carries its own <label>, and a label cannot sit inside a label. */
  const Wrapper = isChoice || field.type === "checkbox" ? "div" : "label";
  const wrapperProps = isChoice || field.type === "checkbox" ? {} : { htmlFor: inputId };
  const invalid = error ? true : undefined;
  const optionCard = error ? OPTION_CARD.replace("border-border-subtle", "border-danger-border") : OPTION_CARD;
  const scaleCard = error ? SCALE_CARD.replace("border-border-subtle", "border-danger-border") : SCALE_CARD;

  return (
    /* scroll-mt-10 = 80px (this site's spacing unit is 8px): the fixed header is 74px tall, so a
       scrolled-to question is centred in the part of the screen that is actually visible. */
    <Wrapper data-question={field.name} className="flex scroll-mt-10 flex-col gap-1" {...wrapperProps}>
      {field.type !== "checkbox" ? (
        <span className={LABEL}>
          {t(field.label)}
          {!field.required ? <span className="text-text-ghost"> · {t(COPY.optional)}</span> : null}
        </span>
      ) : null}

      {field.type === "text" || field.type === "url" ? (
        <input
          id={inputId}
          name={field.name}
          type={field.type}
          required={isFeedbackNativelyRequired(field)}
          maxLength={field.maxLength}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder ? field.placeholder[dict] : undefined}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={`${FIELD} ${error ? "border-danger-border" : ""}`}
          dir={field.type === "url" ? "ltr" : undefined}
        />
      ) : null}

      {field.type === "textarea" ? (
        <textarea
          id={inputId}
          name={field.name}
          rows={3}
          maxLength={field.maxLength ?? ANSWER_MAX}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={`${FIELD} ${error ? "border-danger-border" : ""}`}
        />
      ) : null}

      {field.type === "scale" ? (
        <fieldset className="flex flex-col gap-1 border-0 p-0">
          <legend className="sr-only">{t(field.label)}</legend>
          <div className="grid grid-cols-5 gap-1">
            {(field.options ?? []).map((option) => (
              <label key={option.value} htmlFor={`${field.name}-${option.value}`} className={scaleCard}>
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  required={isFeedbackNativelyRequired(field)}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  className="sr-only"
                />
                {option.label[dict]}
              </label>
            ))}
          </div>
          {field.low && field.high ? (
            <div className="flex justify-between font-mono text-micro uppercase tracking-[0.08em] text-text-ghost" aria-hidden>
              <span>1 · {t(field.low)}</span>
              <span>5 · {t(field.high)}</span>
            </div>
          ) : null}
        </fieldset>
      ) : null}

      {field.type === "radio" || field.type === "multi" ? (
        <fieldset className="flex flex-col gap-1 border-0 p-0">
          <legend className="sr-only">{t(field.label)}</legend>
          {(field.options ?? []).map((option) => (
            <label key={option.value} htmlFor={`${field.name}-${option.value}`} className={optionCard}>
              <input
                type={field.type === "multi" ? "checkbox" : "radio"}
                id={`${field.name}-${option.value}`}
                name={field.name}
                value={option.value}
                /* `required` on a radio makes the group "pick one"; on a checkbox it would make
                   THAT box mandatory — "at least one" is validateFeedback's job. */
                required={isFeedbackNativelyRequired(field)}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                className="mt-0.5 accent-[var(--color-accent)]"
              />
              <span className="min-w-0">{option.label[dict]}</span>
            </label>
          ))}
        </fieldset>
      ) : null}

      {field.type === "checkbox" ? (
        <span className={optionCard}>
          <input
            type="checkbox"
            id={inputId}
            name={field.name}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className="mt-0.5 accent-[var(--color-accent)]"
          />
          <label htmlFor={inputId} className="min-w-0 cursor-pointer">
            {t(field.label)}
          </label>
        </span>
      ) : null}

      {field.help ? (
        <span id={helpId} className="text-micro text-text-ghost">
          {t(field.help)}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} role="alert" className="text-body-sm text-danger-text">
          {error}
        </span>
      ) : null}
    </Wrapper>
  );
}
