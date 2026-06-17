"use client";

/**
 * COMMISSION FORM — Design System C2 states, Copy Deck microcopy.
 * Submit: button → "WORKING…" (no spinner — the system talks, it
 * doesn't spin) → AnimatePresence swap to confirmation block.
 * TODO(launch): wire `submit()` to a server action / email service.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { physics } from "@/lib/motion";

const BUDGET_BANDS = ["< $1K", "$1–3K", "$3–8K", "$8K+"] as const;
type Status = "idle" | "working" | "sent" | "error";

const FIELD =
  "w-full rounded-card border border-border-subtle bg-obsidian px-2 py-1.5 text-body-sm text-text-primary outline-none placeholder:text-text-ghost transition-colors duration-fast ease-physics hover:border-border-default focus:border-border-strong";

const LABEL =
  "font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [budget, setBudget] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("working");
    try {
      // TODO(launch): replace with server action
      await new Promise((r) => setTimeout(r, 900));
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
              RECEIVED. EXPECT A REPLY WITHIN 48H.
            </p>
            <p className="font-display text-title tracking-[-0.015em]">
              The brief is in the system.
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
              <span className={LABEL}>NAME</span>
              <input required name="name" className={FIELD} placeholder="Your name" />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>COMPANY</span>
              <input name="company" className={FIELD} placeholder="Company or project" />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>WHAT ARE WE BUILDING</span>
              <textarea required name="brief" rows={4} className={FIELD} placeholder="The brief, in your words" />
            </label>
            <label className="flex flex-col gap-0.5">
              <span className={LABEL}>TIMELINE</span>
              <input name="timeline" className={FIELD} placeholder="e.g. launch in Q4" />
            </label>

            <fieldset className="flex flex-col gap-1">
              <legend className={LABEL}>BUDGET BAND</legend>
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
              {status === "working" ? "WORKING…" : "Begin the conversation →"}
            </button>

            {status === "error" && (
              <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                TRANSMISSION FAILED — TRY HELLO@ABOALAZM.COM
              </p>
            )}
            <p className="text-center font-mono text-micro text-text-ghost">
              Replies within two working days. Cairo time, worldwide work.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
