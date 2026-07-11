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

  /* Guards against double-submits (fast repeat clicks/Enter) and against
     setState after the component has unmounted (e.g. user navigates away
     mid-request). */
  const inFlight = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

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
          brief: String(data.get("brief") ?? ""),
          timeline: String(data.get("timeline") ?? "") || undefined,
          budget: budget ?? undefined,
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
      {/* Plain conditional, not AnimatePresence: a functional state
          change (message sent vs. still a form) must never wait on an
          animation library's exit-completion callback to swap content —
          that ties a critical status transition to something that can
          stall (slow devices, backgrounded tabs). The fade-in below is
          decorative only; the content itself swaps instantly. */}
      {status === "sent" ? (
          <motion.div
            key="sent"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={physics}
            className="flex flex-col gap-2 py-8 text-center"
          >
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-[#3DDC84]">
              {ar ? "تم الاستلام. رد خلال 48 ساعة." : "RECEIVED. EXPECT A REPLY WITHIN 48H."}
            </p>
            <p className="font-display text-title tracking-[-0.015em]">
              {ar ? "البريف في النظام." : "The brief is in the system."}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.7, 0, 0.84, 0] }}
            className="flex flex-col gap-2"
          >
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{t.formName}</span>
              <input required name="name" className={FIELD} placeholder={t.formPlaceholderName} />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{t.formEmail}</span>
              <input required type="email" name="email" className={FIELD} placeholder={t.formPlaceholderEmail} />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{t.formCompany}</span>
              <input name="company" className={FIELD} placeholder={t.formPlaceholderCompany} />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{t.formBuilding}</span>
              <textarea required name="brief" rows={4} className={FIELD} placeholder={t.formPlaceholderBrief} />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>{t.formTimeline}</span>
              <input name="timeline" className={FIELD} placeholder={t.formPlaceholderTimeline} />
            </label>

            <fieldset className="flex flex-col gap-1">
              <legend className={LABEL}>{t.formBudget}</legend>
              <div className="flex flex-wrap gap-1">
                {BUDGET_BANDS.map((band) => (
                  <button
                    key={band}
                    type="button"
                    aria-pressed={budget === band}
                    onClick={() => setBudget(band)}
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

            <button
              type="submit"
              disabled={status === "working"}
              aria-busy={status === "working"}
              className="mt-1 w-full rounded-pill bg-text-primary py-1.5 font-mono text-label uppercase tracking-[0.06em] text-obsidian transition-[transform,opacity] duration-base ease-physics hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "working"
                ? (ar ? "جارٍ الإرسال…" : "WORKING…")
                : t.formBegin}
            </button>

            {status === "error" && (
              <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                {ar
                  ? "فشل الإرسال — تواصل عبر Mustafaaboalazm@mail.ru"
                  : "TRANSMISSION FAILED — TRY Mustafaaboalazm@mail.ru"}
              </p>
            )}
            {status === "rateLimited" && (
              <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                {ar
                  ? "عدد محاولات كبير — استنى شوية أو ابعت على Mustafaaboalazm@mail.ru"
                  : "TOO MANY ATTEMPTS — WAIT A BIT OR EMAIL Mustafaaboalazm@mail.ru"}
              </p>
            )}
            <p className="text-center font-mono text-micro text-text-ghost">
              {t.formReplies}
            </p>
          </motion.form>
        )}
    </div>
  );
}
