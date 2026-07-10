"use client";

/**
 * COMMISSION FORM — Design System C2 states, Copy Deck microcopy.
 * Submit: button → "WORKING…" → AnimatePresence swap to confirmation block.
 * Fully bilingual via useT() + useLang().
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";
import { submitContact } from "./actions";

const BUDGET_BANDS = ["< $1K", "$1–3K", "$3–8K", "$8K+"] as const;
type Status = "idle" | "working" | "sent" | "error" | "rateLimited";

const FIELD =
  "w-full rounded-card border border-border-subtle bg-surface-0 px-2 py-1.5 text-body-sm text-text-primary outline-none placeholder:text-text-ghost transition-colors duration-fast ease-physics hover:border-border-default focus:border-border-strong";

const LABEL =
  "font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary";

export function ContactForm() {
  const { lang } = useLang();
  const t = useT();
  const ar = lang === "ar";
  const [status, setStatus] = useState<Status>("idle");
  const [budget, setBudget] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("working");
    const form = new FormData(e.currentTarget);
    try {
      const res = await submitContact({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        company: String(form.get("company") ?? "") || undefined,
        brief: String(form.get("brief") ?? ""),
        timeline: String(form.get("timeline") ?? "") || undefined,
        budget: budget ?? undefined,
      });
      if (!res.ok && res.error === "rate_limited") {
        setStatus("rateLimited");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-panel border border-border-subtle bg-surface-1 p-4 shadow-card">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
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
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.7, 0, 0.84, 0] }}
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
      </AnimatePresence>
    </div>
  );
}
