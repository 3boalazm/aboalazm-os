"use client";

/**
 * GITHUB BAND — "Designer × AI builder".
 * The creative argument: identity design is the craft, AI-assisted
 * engineering is the leverage — one person ships what used to need a
 * team. Rendered as a mock terminal ledger (system voice), bilingual,
 * zero data dependencies. Links to github.com/3boalazm.
 */
import { motion, useReducedMotion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";

const GITHUB_URL = "https://github.com/3boalazm";

const COPY = {
  en: {
    kicker: "GITHUB — DESIGNER × AI BUILDER",
    hQuiet: "Yes, I'm a designer.",
    hLoud: "I also ship what designers usually can't.",
    lead: "Identity systems are the craft. AI-assisted engineering is the leverage — the distance between the drawing and the deployed collapses to one pair of hands. A brand in the morning, its platform at night. No handoff. No translation loss. The tools changed; the craft didn't.",
    terminal: [
      { p: "$", t: "whoami" },
      { p: ">", t: "designer --with-ai --limits=false" },
      { p: "$", t: "git log --oneline -3" },
      { p: ">", t: "f3a92c1 feat(brand): shipped identity + ERP in one sprint" },
      { p: ">", t: "b81d77e feat(pwa): offline-first, installable, push-ready" },
      { p: ">", t: "2ce490a feat(system): tokens → components → production" },
      { p: "$", t: "git push origin everything" },
    ],
    stats: [
      { n: "20+", l: "systems designed" },
      { n: "9-service", l: "ERP architected" },
      { n: "3", l: "PWAs shipped" },
      { n: "∞", l: "limits remaining" },
    ],
    cta: "EXPLORE THE REPOS",
    ctaAr: "شوف الريبوهات",
  },
  ar: {
    kicker: "جيت هب — ديزاينر × بيلدر",
    hQuiet: "أيوه أنا مصمم.",
    hLoud: "بس كمان بشيّل حاجات المصممين معتدوش عليها.",
    lead: "الهوية هي الحرفة، والـ AI هو الليفيراج — المسافة بين الإسكتش والمنتج الشغال بتقصر لحد ما تبقى إيدين واحدة. براند الصبح، ومنصته بالليل. لا هاند أوف، ولا فقدان ترجمة. الأدوات اتغيرت؛ الحرفة لأ.",
    terminal: [
      { p: "$", t: "whoami" },
      { p: ">", t: "designer --with-ai --limits=false" },
      { p: "$", t: "git log --oneline -3" },
      { p: ">", t: "f3a92c1 feat(brand): هوية + ERP في سباق واحد" },
      { p: ">", t: "b81d77e feat(pwa): تشتغل أوفلاين وتتنصب وتدّي إشعارات" },
      { p: ">", t: "2ce490a feat(system): توكنز → كومبوننتس → إنتاج" },
      { p: "$", t: "git push origin everything" },
    ],
    stats: [
      { n: "+20", l: "نظام هوية" },
      { n: "٩ خدمات", l: "ERP معماري" },
      { n: "٣", l: "تطبيقات PWA" },
      { n: "∞", l: "حدود متبقية" },
    ],
    cta: "EXPLORE THE REPOS",
    ctaAr: "شوف الريبوهات",
  },
} as const;

export function GithubBand() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = COPY[ar ? "ar" : "en"];
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label={t.kicker} className="border-y border-border-subtle bg-surface-1">
      <div className="container-content grid gap-8 py-16 lg:grid-cols-[6fr_5fr] lg:items-center">
        {/* Copy side */}
        <div className="flex flex-col gap-3">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            <span className="text-accent">◆</span> {t.kicker}
          </p>
          <h2 className="font-display text-title tracking-[-0.015em]">
            {t.hQuiet}
            <br />
            <em className="text-accent">{t.hLoud}</em>
          </h2>
          <p className="max-w-[56ch] text-body text-text-secondary">{t.lead}</p>

          {/* Stats ledger */}
          <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border-subtle bg-border-subtle sm:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.l} className="flex flex-col gap-1 bg-surface-0 px-3 py-3">
                <span className="font-display text-[1.35rem] leading-none tracking-[-0.02em] text-text-primary">{s.n}</span>
                <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary">{s.l}</span>
              </div>
            ))}
          </div>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 flex w-fit items-center gap-2 rounded-pill border border-border-default px-3 py-1.5 font-mono text-label uppercase tracking-[0.08em] text-text-primary transition-colors duration-base ease-physics hover:border-accent hover:text-accent"
          >
            <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="transition-transform duration-base ease-physics group-hover:-translate-y-0.5">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            {ar ? t.ctaAr : t.cta} <span aria-hidden>↗</span>
            <span className="font-mono text-micro normal-case tracking-normal text-text-ghost transition-colors duration-base ease-physics group-hover:text-text-tertiary">github.com/3boalazm</span>
          </a>
        </div>

        {/* Terminal side — the system's voice */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...physics, delay: 0.1 }}
          className="relative overflow-hidden rounded-panel border border-border-subtle bg-obsidian shadow-card"
          dir="ltr"
        >
          {/* terminal chrome */}
          <div className="flex items-center gap-1.5 border-b border-border-subtle px-4 py-2.5">
            <span className="size-2 rounded-pill bg-accent/70" />
            <span className="size-2 rounded-pill bg-border-strong" />
            <span className="size-2 rounded-pill bg-border-subtle" />
            <span className="ml-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">aboalazm@studio — zsh</span>
            <span className="ml-auto font-mono text-micro text-text-ghost">AI × CRAFT</span>
          </div>

          <div className="flex flex-col gap-1.5 px-4 py-4 font-mono text-[0.72rem] leading-relaxed">
            {t.terminal.map((line, i) => (
              <motion.p
                key={i}
                initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...physics, delay: 0.25 + i * 0.09 }}
                className="whitespace-nowrap overflow-hidden text-ellipsis"
              >
                <span className={line.p === "$" ? "text-accent" : "text-text-tertiary"}>{line.p} </span>
                <span className={line.p === "$" ? "text-text-primary" : "text-text-secondary"}>{line.t}</span>
              </motion.p>
            ))}
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...physics, delay: 0.25 + COPY.en.terminal.length * 0.09 }}
              className="pt-1 text-text-ghost"
              aria-hidden
            >
              <span className="text-accent">$ </span>
              <span className="inline-block h-[0.9em] w-[0.5em] translate-y-[0.15em] animate-pulse bg-accent/80" />
            </motion.p>
          </div>

          {/* corner glow — atmosphere, not paint */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-accent/10 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
