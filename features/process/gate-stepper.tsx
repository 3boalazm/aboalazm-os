"use client";

/**
 * GateStepper — interactive "4 approval gates" panel for /process
 *
 * Terminal / code-aligned aesthetic. Each gate is a step in a system
 * pipeline; clicking one reveals the sign-off document the client
 * approves in writing to unlock the next gate, plus the payment
 * milestone and what gets "locked" at that point.
 *
 * This reinforces the "Written sign-off at every gate" promise as a
 * concrete client-safety mechanism, in the studio's systemic voice.
 *
 * Data is self-contained here (the sign-off documents are process
 * metadata that don't live in lib/offers). Bilingual + RTL.
 */

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { physics } from "@/lib/motion";

type Gate = {
  id: string;
  cmd: string;          // terminal-style command label
  name: string;
  phase: string;        // which phase it closes
  signOff: string;      // the document the client signs
  locks: string;        // what gets locked / becomes source of truth
  payment: string;
};

const GATES_EN: Gate[] = [
  {
    id: "01",
    cmd: "brief.approve()",
    name: "Discovery Sign-off",
    phase: "Closes Phase 01 — Discovery & Research",
    signOff: "Project Brief document — you approve the scope, research findings, and audience direction in writing before strategy begins.",
    locks: "Scope and research direction lock. No open-ended discovery.",
    payment: "50% deposit already secured at kickoff",
  },
  {
    id: "02",
    cmd: "strategy.validate()",
    name: "Strategy Sign-off",
    phase: "Closes Phase 02 — Brand Strategy",
    signOff: "Strategy document — you approve positioning, personality, archetype, and tone before any visual design starts.",
    locks: "The strategic foundation becomes the brief every visual is judged against.",
    payment: "25% released at strategy sign-off (Tiers 2 & 3)",
  },
  {
    id: "03",
    cmd: "tokens.lock()",
    name: "Design Sign-off",
    phase: "Closes Phase 03 — Concept & Design",
    signOff: "Chosen direction + design system — you approve the logo system, colour, and typography. These are defined as brand tokens.",
    locks: "Approved tokens become the single source of truth — what's signed is what ships. This is where 0% design drift is enforced.",
    payment: "—",
  },
  {
    id: "04",
    cmd: "system.deploy()",
    name: "Delivery Sign-off",
    phase: "Closes Phase 04 — Refine & Deliver",
    signOff: "Final delivery receipt — you approve the complete system, guidelines, and file package. IP transfers on final payment.",
    locks: "The governed system is deployed. Developers receive exact token values, not guesses.",
    payment: "Balance before files: 25% (Tiers 2–3) · 50% (Tier 1)",
  },
];

const GATES_AR: Gate[] = [
  {
    id: "٠١",
    cmd: "brief.approve()",
    name: "اعتماد الاكتشاف",
    phase: "يُغلق المرحلة ٠١ — الاكتشاف والبحث",
    signOff: "وثيقة بريف المشروع — توافق كتابيًا على النطاق ونتائج البحث واتجاه الجمهور قبل بدء الاستراتيجية.",
    locks: "النطاق واتجاه البحث يُقفلان. لا اكتشاف مفتوح بلا نهاية.",
    payment: "٥٠٪ مقدّم مؤمّن بالفعل عند البدء",
  },
  {
    id: "٠٢",
    cmd: "strategy.validate()",
    name: "اعتماد الاستراتيجية",
    phase: "يُغلق المرحلة ٠٢ — استراتيجية البراند",
    signOff: "وثيقة الاستراتيجية — توافق على التموضع والشخصية والنموذج ونبرة الصوت قبل بدء أي تصميم بصري.",
    locks: "الأساس الاستراتيجي يصبح البريف الذي يُحكَم عليه كل عنصر بصري.",
    payment: "٢٥٪ عند اعتماد الاستراتيجية (الفئتان ٢ و٣)",
  },
  {
    id: "٠٣",
    cmd: "tokens.lock()",
    name: "اعتماد التصميم",
    phase: "يُغلق المرحلة ٠٣ — المفهوم والتصميم",
    signOff: "الاتجاه المختار + نظام التصميم — توافق على نظام الشعار والألوان والخطوط. تُعرَّف هذه كـ brand tokens.",
    locks: "التوكنز المعتمدة تصبح المصدر الوحيد للحقيقة — ما يُوقَّع هو ما يُنفَّذ. هنا يُضمَن انحراف التصميم صفر.",
    payment: "—",
  },
  {
    id: "٠٤",
    cmd: "system.deploy()",
    name: "اعتماد التسليم",
    phase: "يُغلق المرحلة ٠٤ — المراجعة والتسليم",
    signOff: "إيصال التسليم النهائي — توافق على النظام الكامل والدليل وحزمة الملفات. تنتقل الملكية عند الدفعة الأخيرة.",
    locks: "النظام المحكوم يُنشَر. المطورون يستلمون قيم توكنز دقيقة، لا تخمينات.",
    payment: "الباقي قبل تسليم الملفات: ٢٥٪ (الفئتان ٢ و٣) · ٥٠٪ (الفئة ١)",
  },
];

const UI = {
  en: {
    terminalLabel: "aboalazm-os — process.pipeline",
    gatesKicker: "APPROVAL GATES",
    gatesTitle: "Four gates,",
    gatesItalic: "four signatures.",
    gatesLede: "Nothing moves to the next phase without your written sign-off. Each gate is a checkpoint that protects your budget from rework and scope drift. Select a gate to see what you approve.",
    signOffLabel: "You sign off on",
    locksLabel: "What locks",
    paymentLabel: "Payment",
    awaiting: "AWAITING SIGN-OFF",
    signed: "SIGNED",
    tapHint: "Select a gate",
  },
  ar: {
    terminalLabel: "aboalazm-os — process.pipeline",
    gatesKicker: "بوابات الاعتماد",
    gatesTitle: "أربع بوابات،",
    gatesItalic: "أربعة توقيعات.",
    gatesLede: "لا شيء ينتقل للمرحلة التالية دون موافقتك المكتوبة. كل بوابة نقطة تحقق تحمي ميزانيتك من إعادة العمل وتوسع النطاق. اختر بوابة لترى ما توافق عليه.",
    signOffLabel: "توقّع على",
    locksLabel: "ما يُقفَل",
    paymentLabel: "الدفع",
    awaiting: "في انتظار الاعتماد",
    signed: "معتمَد",
    tapHint: "اختر بوابة",
  },
} as const;

export function GateStepper() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const gates = ar ? GATES_AR : GATES_EN;
  const t = ar ? UI.ar : UI.en;
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const g = gates[active] ?? gates[0]!;

  return (
    <div className="gate-terminal" dir={ar ? "rtl" : "ltr"}>
      {/* header bar */}
      <div className="gate-terminal__bar">
        <span className="gate-terminal__dots" aria-hidden>
          <span /><span /><span />
        </span>
        <span className="gate-terminal__label">{t.terminalLabel}</span>
      </div>

      <div className="gate-terminal__body">
        {/* section heading */}
        <div className="mb-6 flex flex-col gap-1">
          <p className="font-mono text-caption uppercase tracking-[0.14em] text-accent">{t.gatesKicker}</p>
          <h2 className="font-display text-title leading-[1.05] tracking-[-0.02em] text-text-primary">
            {t.gatesTitle} <em className="text-accent">{t.gatesItalic}</em>
          </h2>
          <p className="mt-2 max-w-[56ch] text-body-sm leading-[1.65] text-text-secondary" style={{ fontFamily: "var(--font-sans)" }}>
            {t.gatesLede}
          </p>
        </div>

        {/* stepper row */}
        <div className="gate-stepper">
          {gates.map((gate, i) => {
            const isActive = i === active;
            const isPast = i < active;
            return (
              <button
                key={gate.id}
                onClick={() => setActive(i)}
                className={[
                  "gate-node",
                  isActive ? "gate-node--active" : "",
                  isPast ? "gate-node--past" : "",
                ].join(" ")}
                aria-pressed={isActive}
              >
                <span className="gate-node__ring">
                  {isPast ? (
                    <span className="gate-node__check">
                      <Icon name="check" strokeWidth={2} />
                    </span>
                  ) : (
                    <span className="gate-node__num">{gate.id}</span>
                  )}
                </span>
                <span className="gate-node__cmd">{gate.cmd}</span>
              </button>
            );
          })}
        </div>

        {/* detail panel — plain key-change remount, not AnimatePresence:
            mode="wait" would hold the new gate's content mounting until
            the old one's exit transition reports finished, tying which
            gate is shown to an animation-completion callback instead of
            to the click itself.
            suppressHydrationWarning: same reasoning as the anti-flash
            script in app/(site)/layout.tsx — the server can't know the
            client's real prefers-reduced-motion value, so this element's
            first-paint style legitimately differs between SSR and the
            client correcting it on mount. Scoped to this one node only. */}
        <motion.div
          key={active}
          suppressHydrationWarning
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={physics}
          className="gate-detail"
        >
            {/* command line */}
            <div className="gate-detail__cmdline">
              <span className="gate-detail__prompt">$</span>
              <span className="gate-detail__cmd">{g.cmd}</span>
              <span className="gate-detail__status">
                <span className="gate-detail__status-dot" aria-hidden />
                {t.awaiting}
              </span>
            </div>

            <p className="gate-detail__name font-display">{g.name}</p>
            <p className="gate-detail__phase">{g.phase}</p>

            <div className="gate-detail__grid">
              <div className="gate-detail__block">
                <p className="gate-detail__block-label">{t.signOffLabel}</p>
                <p className="gate-detail__block-body" style={{ fontFamily: "var(--font-sans)" }}>{g.signOff}</p>
              </div>
              <div className="gate-detail__block gate-detail__block--accent">
                <p className="gate-detail__block-label">{t.locksLabel}</p>
                <p className="gate-detail__block-body" style={{ fontFamily: "var(--font-sans)" }}>{g.locks}</p>
              </div>
            </div>

            {g.payment !== "—" && (
              <p className="gate-detail__payment">
                <span className="text-accent">$</span> {t.paymentLabel}: {g.payment}
              </p>
            )}
        </motion.div>
      </div>
    </div>
  );
}
