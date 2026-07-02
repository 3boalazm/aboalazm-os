"use client";

/**
 * PersonaPickerBand — the inviting, non-blocking picker on Home.
 *
 * Sits right after the Hero. Two states:
 *  · No persona chosen  → an inviting prompt with two buttons. Scrolling
 *    past without choosing is a completely valid path — nothing blocks.
 *  · Persona chosen      → collapses to a slim confirmation strip so
 *    returning visitors aren't re-asked the same question every visit.
 */

import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/components/providers/persona-provider";
import { useLang } from "@/components/providers/lang-provider";
import { physics } from "@/lib/motion";

const COPY = {
  en: {
    kicker: "BEFORE YOU SCROLL",
    question: "What matters most to you right now?",
    founderLabel: "Business outcomes",
    founderSub: "ROI, timeline, go-to-market",
    technicalLabel: "The architecture",
    technicalSub: "Systems, tokens, governance",
    skip: "or keep scrolling — we'll keep it balanced",
    activeFounder: "Showing the founder view — ROI and timeline first.",
    activeTechnical: "Showing the technical view — systems and architecture first.",
    switch: "Switch to general",
  },
  ar: {
    kicker: "قبل ما تكمل",
    question: "إيه اللي يهمك أكتر دلوقتي؟",
    founderLabel: "النتائج التجارية",
    founderSub: "العائد، الجدول الزمني، دخول السوق",
    technicalLabel: "البنية المعمارية",
    technicalSub: "الأنظمة، التوكنز، الحوكمة",
    skip: "أو كمّل نزول — هنفضل متوازنين",
    activeFounder: "بتشوف نسخة المؤسس — العائد والجدول الزمني الأول.",
    activeTechnical: "بتشوف النسخة التقنية — الأنظمة والمعمارية الأول.",
    switch: "ارجع للعام",
  },
} as const;

export function PersonaPickerBand() {
  const { persona, setPersona } = usePersona();
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = ar ? COPY.ar : COPY.en;

  return (
    <div className="persona-band">
      <AnimatePresence mode="wait">
        {persona === null ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={physics}
            className="persona-band__prompt"
          >
            <p className="persona-band__kicker">{t.kicker}</p>
            <p className="persona-band__question">{t.question}</p>
            <div className="persona-band__options">
              <button onClick={() => setPersona("founder")} className="persona-band__option">
                <span className="persona-band__option-label">{t.founderLabel}</span>
                <span className="persona-band__option-sub">{t.founderSub}</span>
              </button>
              <button onClick={() => setPersona("technical")} className="persona-band__option">
                <span className="persona-band__option-label">{t.technicalLabel}</span>
                <span className="persona-band__option-sub">{t.technicalSub}</span>
              </button>
            </div>
            <p className="persona-band__skip">{t.skip}</p>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={physics}
            className="persona-band__active"
          >
            <span className="persona-band__active-dot" aria-hidden />
            <span className="persona-band__active-text">
              {persona === "founder" ? t.activeFounder : t.activeTechnical}
            </span>
            <button onClick={() => setPersona(null)} className="persona-band__active-clear">
              {t.switch}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
