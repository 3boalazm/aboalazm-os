"use client";

/**
 * COMMISSION FORM — Design System C2 states, Copy Deck microcopy.
 * Submit: button → "WORKING…" → swaps to the confirmation block.
 * Fully bilingual via useT() + useLang().
 */
import { useEffect, useRef, useState } from "react";
import { trackEvent, readCampaign } from "@/lib/analytics";
import { motion, useReducedMotion } from "framer-motion";
import { SERVICES, PACKAGES, parseContactContext, type ContactContext } from "@/lib/contact-context";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, RESPONSE_PROMISE } from "@/lib/contact-details";
import { submitContact } from "./actions";
import { canSubmitContact, type ContactSubmissionStatus } from "./submission-state";
import { BRIEF_MAX, COMPANY_MAX, EMAIL_MAX, EMAIL_RE, NAME_MAX, TIMELINE_MAX } from "./validate";

const BUDGET_BANDS = ["< $1K", "$1–3K", "$3–8K", "$8K+"] as const;
type Status = ContactSubmissionStatus;
type NotificationStatus = "sent" | "unconfigured" | "failed";

/** If the server action hasn't responded by this point, receipt is uncertain.
 *  The visitor is told to confirm by email rather than risk a duplicate. */
const SUBMIT_TIMEOUT_MS = 20_000;

const FIELD =
  "w-full rounded-card border border-border-subtle bg-surface-0 px-2 py-1.5 text-body-sm text-text-primary outline-none placeholder:text-text-ghost transition-colors duration-fast ease-physics hover:border-border-default focus:border-border-strong";

const LABEL =
  "font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary";

export function ContactForm({ context }: { context?: ContactContext }) {
  const { lang } = useLang();
  const t = useT();
  const ar = lang === "ar";
  const reduceMotion = useReducedMotion();
  const [selection, setSelection] = useState(() => parseContactContext(context ?? {}));
  const didStart = useRef(false);
  const eventContext = { service: selection.service, tier: selection.tier, source: selection.source, locale: lang };
  const [status, setStatus] = useState<Status>("idle");
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [scopeUnknown, setScopeUnknown] = useState(false);

  /* Guards against double-submits (fast repeat clicks/Enter) and against
     setState after the component has unmounted (e.g. user navigates away
     mid-request). */
  const inFlight = useRef(false);
  const mounted = useRef(true);
  /* Mount time for submission-duration diagnostics; never used to reject autofill. */
  const startedAt = useRef(0);
  useEffect(() => {
    mounted.current = true;
    startedAt.current = performance.now();
    return () => {
      mounted.current = false;
    };
  }, []);

  /* The submit button (focused) leaves the DOM when the form swaps to the
     confirmation, so hand focus to the confirmation instead of dropping it. */
  const sentRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current || !canSubmitContact(status)) return;
    inFlight.current = true;
    setStatus("working");
    trackEvent("form_submit_attempt", eventContext);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await Promise.race([
        submitContact({
          ...selection,
          ...readCampaign(),
          locale: lang,
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          company: String(data.get("company") ?? "") || undefined,
          brief:
            String(data.get("brief") ?? "").trim() ||
            (scopeUnknown
              ? ar
                ? "لسه بحدد النطاق."
                : "Still figuring out the scope."
              : ""),
          timeline: String(data.get("timeline") ?? "") || undefined,
          budget: budget ?? undefined,
          _gotcha: String(data.get("_gotcha") ?? ""),
          elapsedMs: Math.round(performance.now() - startedAt.current),
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("timeout")), SUBMIT_TIMEOUT_MS);
        }),
      ]);

      if (!mounted.current) return;

      if (!res.ok) {
        setStatus(res.error === "rate_limited" ? "rateLimited" : "error");
        trackEvent("form_error", { ...eventContext, reason: res.error ?? "unknown" });
        return;
      }

      form.reset();
      setBudget(null);
      setNotificationStatus(res.notification);
      setStatus("sent");
      trackEvent("contact_submit", eventContext);
      if (res.notification !== "sent") {
        trackEvent("contact_notification_issue", { ...eventContext, notification_status: res.notification });
      }
    } catch (error) {
      // A transport error or client timeout cannot prove the server failed to save.
      // Prevent a blind resubmit, which could create a duplicate enquiry.
      const timedOut = error instanceof Error && error.message === "timeout";
      trackEvent("form_error", { ...eventContext, reason: timedOut ? "timeout_receipt_uncertain" : "network_receipt_uncertain" });
      if (mounted.current) setStatus("uncertain");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <div className="contact-form-panel rounded-panel border border-border-subtle bg-surface-1 p-4 shadow-card">
      {/* Live regions exist from first paint — text added together with its
          region is not announced. This one carries the confirmation; the
          form has its own polite/alert regions under the submit button. */}
      <div role="status" aria-live="polite">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={physics}
            className="flex flex-col gap-2 py-8 text-center"
          >
            <p
              ref={sentRef}
              tabIndex={-1}
              className={`font-mono text-micro uppercase tracking-[0.10em] outline-none ${notificationStatus === "sent" ? "text-success" : "text-accent"}`}
            >
              {notificationStatus === "sent"
                ? ar ? `وصلت. ${RESPONSE_PROMISE.ar}` : `RECEIVED. ${RESPONSE_PROMISE.en}`
                : notificationStatus === "unconfigured"
                  ? ar ? "تم حفظ الطلب، لكن تنبيه الإيميل غير مُعدّ حاليًا." : "SAVED, BUT EMAIL ALERTS ARE NOT CONFIGURED."
                  : ar ? "تم حفظ الطلب، لكن فشل إرسال تنبيه الإيميل." : "SAVED, BUT THE EMAIL ALERT FAILED."}
            </p>
            <p className="font-display text-title tracking-[-0.015em]">
              {notificationStatus === "sent"
                ? ar ? "هكتب لك من نفس القناة." : "I'll write back on the same email."
                : ar ? "الطلب اتحفظ، لكن خلّينا نأكد التواصل." : "Your enquiry is saved; let's make sure I see it."}
            </p>
            <p className="text-body-sm text-text-secondary">
              {notificationStatus === "sent"
                ? ar
                  ? "لو أسرع، واتساب والإيميل جنب النموذج."
                  : "Need something faster? Email and WhatsApp are listed beside this form."
                : ar
                  ? <>علشان أضمن إني أشوفه، ابعتلي تأكيد على <a className="underline underline-offset-4" href={CONTACT_EMAIL_HREF}>الإيميل</a> أو <a className="underline underline-offset-4" href="https://wa.me/201092500454" target="_blank" rel="noopener noreferrer">واتساب</a>.</>
                  : <>To make sure I see it, please confirm via <a className="underline underline-offset-4" href={CONTACT_EMAIL_HREF}>email</a> or <a className="underline underline-offset-4" href="https://wa.me/201092500454" target="_blank" rel="noopener noreferrer">WhatsApp</a>.</>}
            </p>
          </motion.div>
        ) : null}
      </div>
      {/* Plain conditionals, not AnimatePresence: a functional state change
          (message sent vs. still a form) must never wait on an animation
          library's exit-completion callback to swap content — that ties a
          critical status transition to something that can stall (slow
          devices, backgrounded tabs). The fade-in on the confirmation is
          decorative only; the content itself swaps instantly. */}
      {status !== "sent" ? (
          <motion.form
            key="form"
            onSubmit={submit}
            onFocusCapture={() => { if (!didStart.current) { didStart.current = true; trackEvent("form_start", eventContext); } }}
            onInvalidCapture={() => trackEvent("form_error", { ...eventContext, reason: "invalid_field" })}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.7, 0, 0.84, 0] }}
            className="flex flex-col gap-2"
          >
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{ar ? "محتاج مساعدة في إيه؟" : lang === "ms" ? "Apa yang boleh saya bantu?" : "What can I help you with?"}</span>
              <select name="service" value={selection.service} onChange={(e) => setSelection((current) => ({ ...current, service: parseContactContext({ service: e.target.value }).service, tier: undefined }))} className={FIELD}>
                {SERVICES.map((s) => <option key={s.id} value={s.id}>{ar ? s.ar : s.en}</option>)}
              </select>
            </label>
            {selection.service === "brand-identity" && (
              <label className="flex flex-col gap-0.5">
                <span className={LABEL}>{ar ? "الباقة (اختياري)" : "Package (optional)"}</span>
                <select name="tier" value={selection.tier ?? ""} onChange={(e) => setSelection((current) => ({ ...current, tier: e.target.value || undefined }))} className={FIELD}>
                  <option value="">{ar ? "نختارها مع بعض" : lang === "ms" ? "Bantu saya pilih" : "Help me choose"}</option>
                  {PACKAGES.map((p) => <option key={p.id} value={p.id}>{ar ? p.ar : p.en}</option>)}
                </select>
              </label>
            )}
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{t.formName}</span>
              <input required name="name" autoComplete="name" maxLength={NAME_MAX} className={FIELD} placeholder={t.formPlaceholderName} />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{t.formEmail}</span>
              <input required type="email" name="email" autoComplete="email" maxLength={EMAIL_MAX} pattern={EMAIL_RE.source} className={FIELD} placeholder={t.formPlaceholderEmail} />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{t.formBuilding}</span>
              <textarea
                required={!scopeUnknown}
                name="brief"
                rows={4}
                maxLength={BRIEF_MAX}
                className={FIELD}
                placeholder={
                  scopeUnknown
                    ? ar
                      ? "اختياري — نقدر نحدد النطاق مع بعض"
                      : "Optional — we can figure out the scope together"
                    : t.formPlaceholderBrief
                }
              />
            </label>

            <label className="flex items-start gap-2 py-1">
              <input
                type="checkbox"
                checked={scopeUnknown}
                onChange={(e) => setScopeUnknown(e.target.checked)}
                className="mt-0.5 accent-[var(--color-accent)]"
              />
              <span className="text-body-sm text-text-secondary">
                {ar ? "لسه بحدد النطاق — وده كفاية للبداية." : lang === "ms" ? "Saya masih menentukan skop — itu sudah cukup untuk bermula." : "I'm still figuring out the scope — that's enough to start."}
              </span>
            </label>

            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              aria-expanded={detailsOpen}
              aria-controls="contact-details"
              className="w-fit font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
            >
              {detailsOpen
                ? ar
                  ? "إخفاء التفاصيل الاختيارية"
                  : "Hide optional details"
                : ar
                  ? "إضافة الشركة والميزانية والجدول (اختياري)"
                  : "Add company, budget, and timeline (optional)"}
            </button>

            {/* Stays mounted while collapsed so Company/Timeline keep what
                was typed (and a chosen budget is still visible on reopen). */}
            <div id="contact-details" hidden={!detailsOpen} className="flex flex-col gap-2">
              <label className="flex flex-col gap-0.5">
                <span className={LABEL}>{t.formCompany}</span>
                <input name="company" autoComplete="organization" maxLength={COMPANY_MAX} className={FIELD} placeholder={t.formPlaceholderCompany} />
              </label>
              <label className="flex flex-col gap-0.5">
                <span className={LABEL}>{t.formTimeline}</span>
                <input name="timeline" maxLength={TIMELINE_MAX} className={FIELD} placeholder={t.formPlaceholderTimeline} />
              </label>
              <fieldset className="flex flex-col gap-1">
                <legend className={LABEL}>{t.formBudget}</legend>
                <div className="flex flex-wrap gap-1">
                  {BUDGET_BANDS.map((band) => (
                    <button
                      key={band}
                      type="button"
                      aria-pressed={budget === band}
                      onClick={() => setBudget(budget === band ? null : band)}
                      className={[
                        "rounded-pill border px-2 py-0.5 font-geist text-micro transition-colors duration-base ease-physics",
                        budget === band
                          ? "border-accent text-text-primary"
                          : "border-border-subtle text-text-tertiary hover:border-border-default",
                      ].join(" ")}
                    >
                      {band}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Honeypot: invisible and unreachable for people, tempting for
                form-filling bots. The server drops any submission that fills
                it, so the name is deliberately not one a browser or password
                manager would autofill (not website/url/phone…). */}
            <div aria-hidden="true" className="sr-only">
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
            </div>

            {status !== "uncertain" && (
              <button
                type="submit"
                disabled={status === "working"}
                aria-busy={status === "working"}
                className="mt-1 w-full rounded-pill bg-text-primary py-1.5 font-mono text-label uppercase tracking-[0.06em] text-surface-0 transition-[transform,opacity] duration-base ease-physics hover:-translate-y-0.5 disabled:opacity-60"
              >
                {status === "working"
                  ? (ar ? "جارٍ الإرسال…" : lang === "ms" ? "SEDANG DIHANTAR…" : "WORKING…")
                  : (ar ? "ابعت استفسارك" : lang === "ms" ? "Hantar pertanyaan anda" : "Send your enquiry")}
              </button>
            )}

            {/* Empty regions would add a flex gap of their own, so while
                empty they pull back by exactly that gap (-mt-2 = gap-2). */}
            <div role="alert" className="empty:-mt-2">
              {status === "uncertain" && (
                <p className="text-body-sm text-accent">
                  {ar
                    ? <>ماقدرتش أتأكد إن رسالتك وصلت. ممكن تكون اتحفظت بالفعل؛ علشان نتجنب تكرار الطلب، <a className="underline underline-offset-4" href={CONTACT_EMAIL_HREF}>راسلني بالإيميل قبل ما تبعت النموذج مرة تانية</a>.</>
                    : <>I couldn't confirm receipt. Your enquiry may already be saved; to avoid a duplicate, <a className="underline underline-offset-4" href={CONTACT_EMAIL_HREF}>email me before submitting again</a>.</>}
                </p>
              )}
              {status === "error" && (
                <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                  {ar
                    ? `فشل الإرسال — تواصل عبر ${CONTACT_EMAIL}`
                    : `TRANSMISSION FAILED — TRY ${CONTACT_EMAIL}`}
                </p>
              )}
            </div>
            <div role="status" aria-live="polite" className="empty:-mt-2">
              {status === "rateLimited" && (
                <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                  {ar
                    ? `عدد محاولات كبير — استنى شوية أو ابعت على ${CONTACT_EMAIL}`
                    : `TOO MANY ATTEMPTS — WAIT A BIT OR EMAIL ${CONTACT_EMAIL}`}
                </p>
              )}
            </div>
            <p className="text-center text-caption text-text-tertiary">
              {ar ? `${RESPONSE_PROMISE.ar} بياناتك تُستخدم للرد على طلبك فقط.` : lang === "ms" ? `${RESPONSE_PROMISE.ms} Maklumat anda hanya digunakan untuk membalas pertanyaan anda.` : `${RESPONSE_PROMISE.en} Your details are used to respond to your enquiry only.`}
            </p>
          </motion.form>
        ) : null}
    </div>
  );
}
