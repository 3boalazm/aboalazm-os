"use client";

/**
 * 06 · METHOD — how a project starts (FUNNEL_STEPS, discovery first, deposit
 * last) on one line that fills as you read, then the three published tiers.
 */
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "@/components/ui/localized-link";
import { FUNNEL_STEPS, TIERS } from "@/lib/offers";
import { Arrow, Chapter, useX } from "./shared";

export function Method() {
  const { ar, t } = useX();
  const i = ar ? 1 : 0;
  const rail = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rail, offset: ["start 0.85", "end 0.6"] });

  return (
    <section id="method" className="x-room x-iris ground-ember">
      <Chapter
        n="06"
        kicker={t("How it starts", "إزاي بنبدأ", "Bagaimana ia bermula")}
        title={
          <>
            {t("Talk first.", "نتكلم الأول.", "Bincang dulu.")} <span className="x-accent">{t("Pay last.", "وندفع في الآخر.", "Bayar kemudian.")}</span>
          </>
        }
        lead={t(
          "Four gates, in this order. You see the scope and the price in writing before any payment.",
          "أربع بوابات بالترتيب ده. بتشوف النطاق والسعر مكتوبين قبل أي دفعة.",
          "Empat pintu, mengikut urutan ini. Anda lihat skop dan harga secara bertulis sebelum sebarang bayaran.",
        )}
      >
        <Link href="/process" className="x-btn x-btn--line w-fit">
          {t("The full method", "المنهج كامل", "Kaedah penuh")}
          <Arrow />
        </Link>
      </Chapter>

      <div className="x-wrap">
        <div ref={rail} className="x-rail">
          <div aria-hidden className="x-rail__line">
            <motion.i className="max-lg:hidden" style={{ scaleX: scrollYProgress }} />
            <motion.i className="lg:hidden" style={{ scaleY: scrollYProgress }} />
          </div>
          {FUNNEL_STEPS.map((s) => (
            <div key={s.n} className="x-step x-rise">
              <span aria-hidden className="x-step__dot" />
              <span className="x-step__n">{s.n}</span>
              <h3 className="x-step__title">{s.title[i]}</h3>
              <p className="x-step__body">{s.body[i]}</p>
            </div>
          ))}
        </div>

        <div className="x-tiers">
          {TIERS.map((tier) => (
            <Link key={tier.id} href="/pricing" className="x-tier" data-rec={tier.recommended ? "true" : "false"}>
              <span className="x-mono text-[var(--color-text-tertiary)]">
                {tier.tag[i]}
                {tier.recommended ? ` · ${t("Recommended", "موصى به", "Disyorkan")}` : ""}
              </span>
              <span className="text-[1.05rem] font-semibold text-[var(--color-text-primary)]">{tier.name[i]}</span>
              <span className="x-tier__price" dir="ltr">
                {tier.price}
              </span>
              <span className="text-[13px] text-[var(--color-text-secondary)]">
                {tier.duration[i]} · {tier.bestFor[i]}
              </span>
            </Link>
          ))}
          <Link href="/pricing" className="x-tier__more">
            <span className="grid justify-items-center gap-2">
              <span className="x-mono">{t("All pricing", "كل الأسعار", "Semua harga")}</span>
              <Arrow size={20} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
