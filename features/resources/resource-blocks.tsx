"use client";

/**
 * RESOURCE BLOCKS — the spine rail, the email gate, and the resource card.
 * Matches the offer-blocks conventions: bilingual via `pick`, token-only
 * colors, physics motion. The gate persists unlock in localStorage so a
 * returning visitor isn't asked twice.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";
import { pick } from "@/features/offers/offer-blocks";
import { SPINE, type Resource } from "@/lib/resources";

const UNLOCK_KEY = "aboalazm-os-resources-unlocked";

export function readUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

function writeUnlocked() {
  try {
    window.localStorage.setItem(UNLOCK_KEY, "1");
  } catch {
    /* private mode — gate stays for the session only */
  }
}

/* ── The 7-stage spine, as a horizontal rail ─────────────────────────── */
export function SpineRail() {
  const { lang } = useLang();
  return (
    <div className="-mx-3 overflow-x-auto px-3 pb-1">
      <ol className="flex min-w-max items-stretch gap-1.5">
        {SPINE.map((s, i) => (
          <li key={s.ref} className="flex items-center gap-1.5">
            <div className="rounded-card border border-border-subtle bg-surface-1 px-2.5 py-1.5">
              <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
                {s.ref}
              </p>
              <p className="text-body-sm text-text-primary">{pick(s.stage, lang)}</p>
            </div>
            {i < SPINE.length - 1 && (
              <span aria-hidden className="font-mono text-micro text-text-ghost">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Email gate ──────────────────────────────────────────────────────── */
export function EmailGate({ onUnlock }: { onUnlock: () => void }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error" | "rateLimited">("idle");

  async function submit() {
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setState(res.status === 429 ? "rateLimited" : "error");
        return;
      }
      writeUnlocked();
      onUnlock();
    } catch {
      setState("error");
    }
  }

  return (
    <div className="rounded-panel border border-border-subtle bg-surface-1 p-4 md:p-6">
      <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
        {ar ? "وصول مجاني" : "FREE ACCESS"}
      </p>
      <h2 className="mt-2 font-display text-title tracking-[-0.015em]">
        {ar ? "افتح المكتبة " : "Unlock the full "}
        <em className="text-accent">{ar ? "بالكامل." : "library."}</em>
      </h2>
      <p className="mt-1 max-w-[46ch] text-body-sm text-text-secondary">
        {ar
          ? "بريد إلكتروني واحد يفتح الوثائق الثماني. بلا رسائل مزعجة — تحديثات نادرة عن أدوات وأطر جديدة فقط."
          : "One email unlocks all eight documents. No spam — only rare updates when new tools and frameworks ship."}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error" || state === "rateLimited") setState("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={ar ? "بريدك الإلكتروني" : "you@company.com"}
          aria-label={ar ? "البريد الإلكتروني" : "Email address"}
          className="w-full rounded-pill border border-border-default bg-surface-2 px-4 py-2.5 text-body text-text-primary outline-none transition-colors duration-base ease-physics placeholder:text-text-ghost focus:border-accent"
        />
        <button
          type="button"
          onClick={submit}
          disabled={state === "loading"}
          className="group whitespace-nowrap rounded-pill bg-accent px-5 py-2.5 font-mono text-micro uppercase tracking-[0.06em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "loading"
            ? ar
              ? "..."
              : "..."
            : ar
              ? "افتح الوصول"
              : "UNLOCK"}
        </button>
      </div>

      {state === "error" && (
        <p className="mt-2 text-body-sm text-accent">
          {ar
            ? "تأكد من صحة البريد وحاول مرة أخرى."
            : "Please check the email and try again."}
        </p>
      )}
      {state === "rateLimited" && (
        <p className="mt-2 text-body-sm text-accent">
          {ar
            ? "محاولات كتير في وقت قصير — استنى شوية وحاول تاني."
            : "Too many attempts — please wait a bit and try again."}
        </p>
      )}
    </div>
  );
}

/* ── Resource card ───────────────────────────────────────────────────── */
export function ResourceCard({
  resource,
  unlocked,
}: {
  resource: Resource;
  unlocked: boolean;
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={physics}
      className={[
        "flex flex-col rounded-panel border bg-surface-1 p-4 transition-colors duration-base ease-physics md:p-5",
        resource.recommended ? "border-accent/40" : "border-border-subtle hover:border-border-strong",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-micro text-text-ghost">{resource.id}</span>
        <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
          {pick(resource.stage, lang)}
        </span>
      </div>

      <h3 className="mt-2 font-display text-title tracking-[-0.015em] text-text-primary">
        {pick(resource.title, lang)}
      </h3>
      <p className="mt-0.5 text-body-sm italic text-accent">{pick(resource.subtitle, lang)}</p>
      <p className="mt-2 flex-1 text-body-sm text-text-secondary">{pick(resource.desc, lang)}</p>

      <p className="mt-3 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        {resource.feeds}
      </p>

      <div className="mt-3 border-t border-border-subtle pt-3">
        {unlocked ? (
          <a
            href={resource.file}
            download
            className="group inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-[0.06em] text-text-primary transition-colors duration-base ease-physics hover:text-accent"
          >
            {ar ? "تحميل PDF" : "DOWNLOAD PDF"}
            <span aria-hidden className="transition-transform duration-base ease-physics group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-[0.06em] text-text-ghost">
            <span aria-hidden>🔒</span>
            {ar ? "مقفل" : "LOCKED"}
          </span>
        )}
      </div>
    </motion.article>
  );
}
