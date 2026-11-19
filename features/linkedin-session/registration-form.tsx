"use client";

/**
 * PRE-SESSION ASSESSMENT FORM — rendered entirely from FIELD_GROUPS in
 * ./assessment.ts, so adding a question never means touching this file.
 *
 * Behaviour borrowed from features/contact/contact-form.tsx, including the two
 * lessons recorded in HANDOFF.md:
 *   · the success swap is a plain conditional, never AnimatePresence mode="wait"
 *     — a state change must not wait on an animation callback;
 *   · a timeout marks the receipt "uncertain" instead of letting the visitor
 *     resubmit blindly and register themselves twice.
 *
 * Inputs are uncontrolled (FormData is read at submit), except the CV picker,
 * which has to name the chosen file and be clearable — `form.reset()` cannot
 * empty a file input, so the clear button sets `value = ""` itself.
 *
 * Radio cards carry a real `<input>` inside a `<label>`, so keyboard and
 * screen-reader behaviour stays the browser's; the selected state is
 * `has-[:checked]` CSS, not React state. A question with radio options is
 * wrapped in a `<div>`, never a `<label>` — a label may not own a whole
 * fieldset of controls, and one shared `id` across four radios would be four
 * elements with the same id.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/components/providers/lang-provider";
import { physics } from "@/lib/motion";
import type { Bi, FieldDef } from "./assessment";
import { ANSWER_MAX, FIELD_GROUPS } from "./assessment";
import { submitSessionRegistration, type FieldErrors, type SessionSubmitResult } from "./actions";

type SubmitSuccess = Extract<SessionSubmitResult, { ok: true }>;

type Status = "idle" | "working" | "sent" | "error" | "rateLimited" | "uncertain" | "invalid" | "unknownSession";

/* Same field vocabulary as the contact form — the shared input primitive has
   never been extracted (design-preview/design-system-backlog.md P1), so
   matching it by value is the current house style. */
const FIELD =
  "w-full rounded-card border border-border-subtle bg-surface-0 px-2 py-1.5 text-body-sm text-text-primary outline-none placeholder:text-text-ghost transition-colors duration-fast ease-physics hover:border-border-default focus:border-border-strong";
const LABEL = "font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary";
const OPTION_CARD =
  "flex cursor-pointer items-start gap-2 rounded-card border border-border-subtle bg-surface-0 px-2 py-1.5 text-body-sm transition-colors duration-fast ease-physics hover:border-border-default has-[:focus-visible]:border-border-strong has-[:checked]:border-accent has-[:checked]:bg-accent-08";

const ERROR_COPY: Record<string, Bi> = {
  required: { ar: "لازم تجاوب على السؤال ده علشان نقدر نجهّز السيشن.", en: "We need this answer to plan the session." },
  too_long: { ar: "الإجابة أطول من اللازم.", en: "That answer is too long." },
  invalid_email: { ar: "البريد الإلكتروني مش صحيح — تأكد منه.", en: "That email address doesn't look right." },
  invalid_option: { ar: "اختار إجابة من اللي موجودين.", en: "Pick one of the listed answers." },
  invalid_url: { ar: "الرابط لازم يكون شكله linkedin.com/in/username.", en: "The link has to look like linkedin.com/in/username." },
  file_too_large: { ar: "الملف أكبر من 5 ميجابايت.", en: "The file is over 5 MB." },
  file_wrong_type: { ar: "ملف PDF بس.", en: "PDF only, please." },
};

const FORM_COPY = {
  /** الاسم الرسمي للنموذج، كما في البريف — يصبح الاسم المسموع للـ form. */
  formName: { ar: "نموذج التسجيل وتقييم المستوى قبل السيشن", en: "LinkedIn Session — Pre-Session Assessment" },
  eyebrow: { ar: "تسجيل وتقييم المستوى", en: "Registration & assessment" },
  intro: {
    ar: "أهلًا بيك! 👋 الفورم ده هدفه يساعدنا نفهم خلفيتك ومستواك الحالي وهدفك من استخدام LinkedIn، علشان نقدر نقدم سيشن عملية ومناسبة لاحتياجاتك، وتخرج منها بخطوات تقدر تطبقها بنفسك.",
    en: "Welcome! 👋 This form tells us your background, where you stand today and what you want from LinkedIn — so the session is practical, fits your level, and leaves you with steps you can run on your own.",
  },
  submit: { ar: "إرسال الإجابات", en: "Send my answers" },
  working: { ar: "بيرسل…", en: "Sending…" },
  successTitle: { ar: "تم استلام إجاباتك بنجاح!", en: "Your answers are in!" },
  successBody: {
    ar: "شكرًا لمشاركتك. إجاباتك هتساعدنا نجهز تجربة عملية تناسب مستواك وأهدافك.",
    en: "Thank you. Your answers shape a session that matches your level and your goal.",
  },
  successUpdated: {
    ar: "استقبلنا تسجيلك الثاني وحدّثنا بيها صفك بدل ما نضيف شخص جديد للقائمة.",
    en: "We found your earlier sign-up and updated that row instead of adding a second attendee.",
  },
  successPrepare: {
    ar: "استعد للسيشن، ويُفضّل يكون عندك حساب LinkedIn جاهز ومسجل الدخول عليه، علشان نقدر نطبق سوا.",
    en: "Before the session: have a LinkedIn account ready and signed in, so we can apply things together.",
  },
  cvFailed: {
    ar: "إجاباتك اتحفظت، بس معرفناش نستلم ملف الـ CV. ابعتلو على بريد الاستوديو أو واتساب وهنلحقه بتسجيلك.",
    en: "Your answers are saved, but the CV upload failed. Send it by email or WhatsApp and we'll attach it.",
  },
  rateLimited: {
    ar: "عدد محاولات كبير من نفس الشبكة في وقت قصير. استنى دقيقة وحاول تاني.",
    en: "Too many attempts from this network just now. Wait a minute and try again.",
  },
  storageFailed: {
    ar: "الإرسال فشل — إجاباتك ما اتحفظتش. جرّب تاني، ولو استمر ابعتلنا على البريد.",
    en: "The submission failed and nothing was saved. Try again; if it keeps happening, write to us.",
  },
  unknownSession: {
    ar: "الرابط ده تبع سيشن غير معروف. اعمل تحديث للصفحة وحاول تاني.",
    en: "This link points at an unknown session. Reload the page and try again.",
  },
  timeout: {
    ar: "الإرسال ياخد وقت أطول من المعتاد — متبعتش تاني علشان اسمك مايتسجلش مرتين. لو الصفحة ما اتغيّرتش بعد دقيقة، ابعتلنا على البريد.",
    en: "The request is taking unusually long. Don't submit again — that would register you twice. If nothing changed after a minute, write to us.",
  },
  invalid: {
    ar: "فيه أسئلة ناقصة أو إجابة مش صحيحة — التعليقات تحت كل سؤال.",
    en: "Some answers are missing or invalid — see the note under each question.",
  },
  optional: { ar: "اختياري", en: "optional" },
  choose: { ar: "اختر إجابة", en: "Choose an answer" },
  noFile: { ar: "لم تختر ملفًا", en: "No file chosen" },
  removeFile: { ar: "إزالة الملف", en: "Remove file" },
  progress: { ar: "الأسئلة الأساسية", en: "Required answers" },
} satisfies Record<string, Bi>;

export function SessionRegistrationForm({ sessionKey }: { sessionKey: string }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  /* The questionnaire is authored in Arabic with an English twin. Malay — the
     site's third locale — reads the English copy rather than shipping a
     half-translated workshop form. */
  const dict: keyof Bi = ar ? "ar" : "en";
  const reduceMotion = useReducedMotion();
  const t = (pair: Bi) => pair[dict];

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<SubmitSuccess | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [answered, setAnswered] = useState(0);

  const inFlight = useRef(false);
  const mounted = useRef(true);
  const didStart = useRef(false);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
  const requiredFields = FIELD_GROUPS.flatMap((g) => g.fields).filter((f) => f.required);

  /** Progress rail: required answers so far. A prompt, not a gate — the browser
   *  and the server decide validity, this only tells people how much is left. */
  function trackProgress() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    let n = 0;
    for (const field of requiredFields) {
      const value = data.get(field.name);
      if (typeof value === "string" && value.trim()) n += 1;
    }
    setAnswered(n);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const form = e.currentTarget;
    inFlight.current = true;
    setStatus("working");
    setFieldErrors({});
    trackEvent("assessment_form_submit_attempt", eventContext);

    try {
      const res = await Promise.race([
        submitSessionRegistration(new FormData(form)),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("timeout")), 20_000);
        }),
      ]);
      if (!mounted.current) return;

      if (!res.ok) {
        if (res.error === "invalid") {
          setFieldErrors(res.fields);
          setStatus("invalid");
          trackEvent("assessment_form_error", { ...eventContext, reason: "invalid_field" });
          const first = Object.keys(res.fields)[0];
          if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
          return;
        }
        setStatus(res.error === "rate_limited" ? "rateLimited" : res.error === "unknown_session" ? "unknownSession" : "error");
        trackEvent("assessment_form_error", { ...eventContext, reason: res.error });
        return;
      }

      form.reset();
      setFileName(null);
      setAnswered(0);
      setResult(res);
      setStatus("sent");
      trackEvent("assessment_submit", { ...eventContext, cv: res.cv });
    } catch (error) {
      /* A timeout cannot prove the server failed; a blind retry could create a
         duplicate registration. */
      const timedOut = error instanceof Error && error.message === "timeout";
      trackEvent("assessment_form_error", {
        ...eventContext,
        reason: timedOut ? "timeout_receipt_uncertain" : "network_receipt_uncertain",
      });
      if (mounted.current) setStatus("uncertain");
    } finally {
      inFlight.current = false;
    }
  }

  const errorFor = (name: string): string | null => {
    const code = fieldErrors[name as keyof FieldErrors];
    return code ? t(ERROR_COPY[code] ?? ERROR_COPY.invalid_option!) : null;
  };

  const banner =
    status === "uncertain"
      ? { tone: "warn", text: t(FORM_COPY.timeout) }
      : status === "rateLimited"
        ? { tone: "danger", text: t(FORM_COPY.rateLimited) }
        : status === "error"
          ? { tone: "danger", text: t(FORM_COPY.storageFailed) }
          : status === "unknownSession"
            ? { tone: "danger", text: t(FORM_COPY.unknownSession) }
            : status === "invalid"
              ? { tone: "danger", text: t(FORM_COPY.invalid) }
              : null;

  return (
    <div className="rounded-panel border border-border-subtle bg-surface-1 p-3 shadow-card md:p-4">
      <div role="status" aria-live="polite">
        {status === "sent" && result ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={physics}
            className="flex flex-col gap-2 py-6 text-center"
          >
            <p ref={sentRef} tabIndex={-1} className="font-mono text-micro uppercase tracking-[0.10em] text-success outline-none">
              {t(FORM_COPY.eyebrow)}
            </p>
            <p className="font-display text-title tracking-[-0.015em]">{t(FORM_COPY.successTitle)}</p>
            <p className="text-body-sm text-text-secondary">{t(FORM_COPY.successBody)}</p>
            {result.updated ? <p className="text-body-sm text-text-tertiary">{t(FORM_COPY.successUpdated)}</p> : null}
            {result.cv === "failed" ? (
              <p className="rounded-card border border-warning-border bg-warning-dim px-2 py-1.5 text-body-sm text-warning-text">
                {t(FORM_COPY.cvFailed)}
              </p>
            ) : null}
            <p className="mt-1 text-body-sm text-text-secondary">{t(FORM_COPY.successPrepare)}</p>
          </motion.div>
        ) : null}
      </div>

      {status !== "sent" ? (
        <motion.form
          ref={formRef}
          aria-label={t(FORM_COPY.formName)}
          onSubmit={submit}
          onChange={trackProgress}
          onFocusCapture={() => {
            if (!didStart.current) {
              didStart.current = true;
              trackEvent("assessment_form_start", eventContext);
            }
          }}
          onInvalidCapture={() => trackEvent("assessment_form_error", { ...eventContext, reason: "invalid_field" })}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.7, 0, 0.84, 0] }}
          className="flex flex-col gap-4"
        >
          <p className="text-body text-text-secondary">{t(FORM_COPY.intro)}</p>

          <div className="flex items-center gap-2">
            <span className="h-1 flex-1 overflow-hidden rounded-pill bg-border-subtle" aria-hidden>
              <span
                className="block h-full rounded-pill bg-accent transition-[width] duration-base ease-physics"
                style={{ width: `${Math.min(100, (answered / Math.max(1, requiredFields.length)) * 100)}%` }}
              />
            </span>
            <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
              {t(FORM_COPY.progress)} {answered}/{requiredFields.length}
            </span>
          </div>

          {FIELD_GROUPS.map((group) => (
            <section key={group.id} className="flex flex-col gap-1.5">
              <h2 className="flex items-baseline gap-2">
                <span className="font-mono text-micro uppercase tracking-[0.14em] text-accent">{group.index}</span>
                <span className="font-display text-subtitle">{t(group.title)}</span>
              </h2>
              {group.note ? <p className="text-body-sm text-text-tertiary">{t(group.note)}</p> : null}
              {group.fields.map((field) => (
                <FieldControl
                  key={field.name}
                  field={field}
                  error={errorFor(field.name)}
                  dict={dict}
                  t={t}
                  fileSlot={
                    field.type === "file" ? (
                      <FilePicker
                        fileName={fileName}
                        inputRef={fileRef}
                        onPick={(name) => setFileName(name)}
                        onClear={() => {
                          if (fileRef.current) fileRef.current.value = "";
                          setFileName(null);
                        }}
                        t={t}
                      />
                    ) : null
                  }
                />
              ))}
            </section>
          ))}

          {/* Honeypot — invisible and never autofilled by name; a filled value is dropped by the server. */}
          <div aria-hidden="true" className="sr-only">
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </div>
          <input type="hidden" name="sessionKey" value={sessionKey} readOnly />

          {banner ? (
            <p className={`text-body-sm ${banner.tone === "warn" ? "text-warning-text" : "text-danger-text"}`}>{banner.text}</p>
          ) : null}

          <button
            type="submit"
            disabled={status === "working"}
            className="w-full rounded-pill border border-accent bg-accent-14 px-3 py-2 font-display text-body text-text-primary transition-colors duration-fast ease-physics hover:bg-accent-24 disabled:opacity-60"
          >
            {status === "working" ? t(FORM_COPY.working) : t(FORM_COPY.submit)}
          </button>
        </motion.form>
      ) : null}
    </div>
  );
}

/* ── one renderer for every question type ───────────────────────────────── */

function FieldControl({
  field,
  error,
  dict,
  t,
  fileSlot,
}: {
  field: FieldDef;
  error: string | null;
  dict: keyof Bi;
  t: (pair: Bi) => string;
  fileSlot?: React.ReactNode;
}) {
  const errorId = `${field.name}-error`;
  const helpId = `${field.name}-help`;
  const describedBy = [error ? errorId : null, field.help ? helpId : null].filter(Boolean).join(" ") || undefined;
  const inputId = `${field.name}-input`;
  /* radio and multi both own a fieldset of option cards, so the wrapper must
     not be a <label> (one label cannot point at four controls). */
  const isChoice = field.type === "radio" || field.type === "multi";
  const Wrapper = isChoice ? "div" : "label";

  return (
    <Wrapper className="flex flex-col gap-1" {...(isChoice ? {} : { htmlFor: inputId })}>
      <span className={LABEL}>
        {t(field.label)}
        {!field.required ? <span className="text-text-ghost"> · {t({ ar: "اختياري", en: "optional" })}</span> : null}
      </span>

      {field.type === "text" || field.type === "email" || field.type === "url" ? (
        <input
          id={inputId}
          name={field.name}
          type={field.type === "url" ? "url" : field.type}
          required={field.required}
          maxLength={field.maxLength}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder ? field.placeholder[dict] : undefined}
          aria-describedby={describedBy}
          className={`${FIELD} ${error ? "border-danger-border" : ""}`}
          dir={field.type === "email" || field.type === "url" ? "ltr" : undefined}
        />
      ) : null}

      {field.type === "textarea" ? (
        <textarea
          id={inputId}
          name={field.name}
          required={field.required}
          rows={3}
          maxLength={field.maxLength ?? ANSWER_MAX}
          placeholder={field.placeholder ? field.placeholder[dict] : undefined}
          aria-describedby={describedBy}
          className={`${FIELD} ${error ? "border-danger-border" : ""}`}
        />
      ) : null}

      {field.type === "select" ? (
        <select
          id={inputId}
          name={field.name}
          required={field.required}
          defaultValue=""
          aria-describedby={describedBy}
          className={`${FIELD} ${error ? "border-danger-border" : ""}`}
        >
          <option value="" disabled>
            {t({ ar: "اختر إجابة", en: "Choose an answer" })}
          </option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label[dict]}
            </option>
          ))}
        </select>
      ) : null}

      {isChoice ? (
        <fieldset className={`flex flex-col gap-1 border-0 p-0 ${field.layout === "grid" ? "sm:grid sm:grid-cols-2 sm:gap-1" : ""}`}>
          <legend className="sr-only">{t(field.label)}</legend>
          {(field.options ?? []).map((option) => (
            <label key={option.value} htmlFor={`${field.name}-${option.value}`} className={OPTION_CARD}>
              <input
                type={field.type === "multi" ? "checkbox" : "radio"}
                id={`${field.name}-${option.value}`}
                name={field.name}
                value={option.value}
                /* required on every box of the group is how HTML asks for "at
                   least one" — which is exactly a required multi answer. */
                required={field.required}
                aria-describedby={describedBy}
                className="mt-0.5 accent-[var(--color-accent)]"
              />
              <span className="min-w-0">
                <span className="block">{option.label[dict]}</span>
                {option.hint ? <span className="block text-micro text-text-ghost">{option.hint[dict]}</span> : null}
              </span>
            </label>
          ))}
        </fieldset>
      ) : null}

      {field.type === "file" ? fileSlot : null}

      {field.help ? (
        <span id={helpId} className="text-micro text-text-ghost">
          {t(field.help)}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} role="alert" className="text-micro text-danger-text">
          {error}
        </span>
      ) : null}
    </Wrapper>
  );
}

function FilePicker({
  fileName,
  inputRef,
  onPick,
  onClear,
  t,
}: {
  fileName: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (name: string) => void;
  onClear: () => void;
  t: (pair: Bi) => string;
}) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        id="cvFile-input"
        type="file"
        name="cvFile"
        accept=".pdf,application/pdf"
        onChange={(e) => onPick(e.target.files?.[0]?.name ?? "")}
        className="block w-full text-body-sm text-text-secondary file:me-2 file:rounded-pill file:border file:border-border-default file:bg-surface-2 file:px-2 file:py-1 file:font-mono file:text-micro file:uppercase file:tracking-[0.08em] file:text-text-primary"
      />
      {fileName ? (
        <span className="flex items-center gap-2 font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary">
          <bdi dir="ltr">{fileName}</bdi>
          <button type="button" onClick={onClear} className="underline underline-offset-4 hover:text-text-primary">
            {t({ ar: "إزالة الملف", en: "Remove file" })}
          </button>
        </span>
      ) : (
        <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">{t({ ar: "لم تختر ملفًا", en: "No file chosen" })}</span>
      )}
    </span>
  );
}
