"use client";

/**
 * COMMISSION FORM — Design System C2 states, Copy Deck microcopy.
 * Submit: button → "WORKING…" → swaps to the confirmation block.
 * Fully bilingual via useT() + useLang().
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";
import { submitContact } from "./actions";
import { BRIEF_MAX, COMPANY_MAX, EMAIL_MAX, EMAIL_RE, NAME_MAX, TIMELINE_MAX } from "./validate";

const BUDGET_BANDS = ["< $1K", "$1–3K", "$3–8K", "$8K+"] as const;
type Status = "idle" | "working" | "sent" | "error" | "rateLimited";

/** If the server action hasn't responded by this point, treat it as
 *  failed rather than leaving the button stuck on "WORKING…" forever. */
const SUBMIT_TIMEOUT_MS = 20_000;

const FIELD =
  "w-full rounded-card border border-border-subtle bg-surface-0 px-2 py-1.5 text-body-sm text-text-primary outline-none placeholder:text-text-ghost transition-colors duration-fast ease-physics hover:border-border-default focus:border-border-strong";

const LABEL =
  "font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary";

export function ContactForm() {
  const { lang } = useLang();
  const t = useT();
  const ar = lang === "ar";
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [budget, setBudget] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [scopeUnknown, setScopeUnknown] = useState(false);

  /* Guards against double-submits (fast repeat clicks/Enter) and against
     setState after the component has unmounted (e.g. user navigates away
     mid-request). */
  const inFlight = useRef(false);
  const mounted = useRef(true);
  /* Mount time, for the server's "filled in faster than a human" check. */
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
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("working");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await Promise.race([
        submitContact({
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
        return;
      }

      form.reset();
      setBudget(null);
      setStatus("sent");
    } catch {
      if (mounted.current) setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <div className="rounded-panel border border-border-subtle bg-surface-1 p-4 shadow-card">
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
              className="font-mono text-micro uppercase tracking-[0.10em] text-success outline-none"
            >
              {ar ? "وصلت. هرد بالإيميل خلال يومي عمل." : "RECEIVED. REPLY BY EMAIL WITHIN TWO WORKING DAYS."}
            </p>
            <p className="font-display text-title tracking-[-0.015em]">
              {ar ? "هكتب لك من نفس القناة." : "I'll write back on the same email."}
            </p>
            <p className="text-body-sm text-text-secondary">
              {ar
                ? "لو أسرع، واتساب والإيميل جنب النموذج."
                : "Need something faster? Email and WhatsApp are listed beside this form."}
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
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.7, 0, 0.84, 0] }}
            className="flex flex-col gap-2"
          >
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
                {ar ? "لسه بحدد النطاق — وده كفاية للبداية." : "I'm still figuring out the scope — that's enough to start."}
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

            <button
              type="submit"
              disabled={status === "working"}
              aria-busy={status === "working"}
              className="mt-1 w-full rounded-pill bg-text-primary py-1.5 font-mono text-label uppercase tracking-[0.06em] text-surface-0 transition-[transform,opacity] duration-base ease-physics hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "working"
                ? (ar ? "جارٍ الإرسال…" : "WORKING…")
                : t.formBegin}
            </button>

            {/* Empty regions would add a flex gap of their own, so while
                empty they pull back by exactly that gap (-mt-2 = gap-2). */}
            <div role="alert" className="empty:-mt-2">
              {status === "error" && (
                <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                  {ar
                    ? "فشل الإرسال — تواصل عبر m1aboalazm@gmail.com"
                    : "TRANSMISSION FAILED — TRY m1aboalazm@gmail.com"}
                </p>
              )}
            </div>
            <div role="status" aria-live="polite" className="empty:-mt-2">
              {status === "rateLimited" && (
                <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                  {ar
                    ? "عدد محاولات كبير — استنى شوية أو ابعت على m1aboalazm@gmail.com"
                    : "TOO MANY ATTEMPTS — WAIT A BIT OR EMAIL m1aboalazm@gmail.com"}
                </p>
              )}
            </div>
            <p className="text-center font-mono text-micro text-text-ghost">
              {t.formReplies}
            </p>
          </motion.form>
        ) : null}
    </div>
  );
}
