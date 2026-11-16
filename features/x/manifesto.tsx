"use client";

/**
 * 01 · MANIFESTO — the studio's one sentence, lit word by word as you scroll.
 * The words marked hot carry the orange.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useX } from "./shared";

const COPY = {
  en: "I don't design *brands.* I build *systems* — an identity, the digital layer it lives in, and the operations behind it — so the business keeps *running* after I leave the room.",
  ar: "لا أصمّم *علامات *تجارية.* أنا أبني *أنظمة*: الهوية، والطبقة الرقمية التي تعيش فيها، والتشغيل الذي يقف خلفها، ليبقى المشروع *يعمل* بعد أن أغادر الغرفة.",
  ms: "Saya tidak mereka *jenama.* Saya membina *sistem* — identiti, lapisan digital tempat ia hidup, dan operasi di belakangnya — supaya perniagaan terus *berjalan* selepas saya keluar dari bilik.",
};

/* The sentence is fully lit once this share of the scroll range is used; the pin keeps
   its full length, so the lit sentence stays on screen for the rest of it. */
const REVEAL = 0.62;

function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const hot = word.startsWith("*");
  const clean = word.replace(/\*/g, "");
  const start = (i / n) * REVEAL;
  const opacity = useTransform(progress, [start, start + REVEAL / n], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={hot ? "is-hot" : undefined}>
      {clean}
    </motion.span>
  );
}

export function Manifesto() {
  const { lang, t } = useX();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end end"] });
  /* Once lit, the sentence drifts up while the pin holds — scrolling never feels dead. */
  const lift = useTransform(scrollYProgress, [REVEAL, 1], ["0svh", "-9svh"]);
  const words = COPY[lang === "ar" ? "ar" : lang === "ms" ? "ms" : "en"].split(" ");

  return (
    <section ref={ref} className="x-manifesto x-room ground-base" aria-label={t("Manifesto", "البيان", "Manifesto")}>
      <div className="x-manifesto__pin">
        <motion.div className="x-wrap grid justify-items-center" style={reduce ? undefined : { y: lift }}>
          <p className="x-manifesto__text">
            {reduce
              ? words.map((w, i) => (
                  <span key={i} className={w.startsWith("*") ? "is-hot" : undefined}>
                    {w.replace(/\*/g, "")}
                  </span>
                ))
              : words.map((w, i) => <Word key={i} word={w} i={i} n={words.length} progress={scrollYProgress} />)}
          </p>
          <p className="x-mono x-manifesto__sign">— Mustafa Aboalazm, {t("founder", "المؤسس", "pengasas")}</p>
        </motion.div>
      </div>
    </section>
  );
}
