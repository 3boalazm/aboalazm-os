"use client";

/**
 * 03 · WORK — a pinned horizontal reel (desktop) / swipe deck (phone).
 *
 * Three identity systems and three digital builds, chosen by the same
 * curation as before (pickFeatured), each labelled with its provenance
 * (client / studio build / demo / in development) so no card overclaims.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "@/components/ui/localized-link";
import { pickFeatured } from "@/features/work/featured-cases";
import { cardArt } from "@/features/work/card-art";
import { evidenceOf, EVIDENCE_COPY } from "@/features/work/project-evidence";
import type { Project } from "@/features/work/types";
import { trackEvent } from "@/lib/analytics";
import { Arrow, useX } from "./shared";

function hrefOf(p: Project): { href: string; external: boolean } {
  if (p.hasCaseStudy) return { href: `/case-studies/${p.slug}`, external: false };
  if (p.isDemo) return { href: "/contact?service=digital-product&source=/", external: false };
  const url = p.liveUrl ?? p.externalUrl;
  return url ? { href: url, external: !url.startsWith("/") } : { href: "/work", external: false };
}

export function WorkTrack({ identity, digital }: { identity: readonly Project[]; digital: readonly Project[] }) {
  const { ar, t } = useX();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);

  const picks = [...pickFeatured(identity, 3), ...pickFeatured(digital, 3)].filter((p) => p.thumbnail);
  const total = identity.length + digital.length;

  /* Pin only where a wide screen and a fine pointer make it pleasant. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setPinned(mq.matches);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, ar ? distance : -distance]);

  return (
    <section
      id="work"
      ref={section}
      className="x-work x-room ground-base"
      data-pinned={pinned}
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
      aria-label={t("Selected work", "أعمال مختارة", "Kerja terpilih")}
    >
      <div className="x-work__pin">
        <motion.div ref={track} className="x-work__track" style={pinned ? { x } : undefined}>
          <div className="x-slide x-slide--intro max-lg:pt-20">
            <div className="grid gap-4">
              <p className="x-mono x-kicker">03 — {t("Selected work", "أعمال مختارة", "Kerja terpilih")}</p>
              <h2 className="x-display" style={{ fontSize: "clamp(2.8rem, 6vw, 6rem)" }}>
                {t("Systems", "أنظمة", "Sistem")}
                <br />
                <span className="x-accent">{t("in production.", "شغالة فعلًا.", "dalam pengeluaran.")}</span>
              </h2>
            </div>
            <p className="max-w-[34ch] leading-relaxed text-[var(--color-text-secondary)]">
              {t(
                "Three identities, three digital builds. Each card says whether it was client work, a studio build or a demo.",
                "تلات هويات وتلات منتجات رقمية. كل كارت بيقول بوضوح: مشروع عميل، بناء داخلي، ولا نسخة تجريبية.",
                "Tiga identiti, tiga binaan digital. Setiap kad menyatakan sama ada kerja klien, binaan studio atau demo.",
              )}
            </p>
          </div>

          {picks.map((p, idx) => {
            const { href, external } = hrefOf(p);
            const name = ar && p.nameAr ? p.nameAr : p.name;
            const line = ar && p.outcomeAr ? p.outcomeAr : p.outcome;
            const ev = EVIDENCE_COPY[evidenceOf(p)];
            return (
              <div key={p.slug} className="x-slide x-slide--card">
                <Link
                  href={href}
                  className="x-card"
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => p.hasCaseStudy && trackEvent("case_study_open", { slug: p.slug, surface: "x_work" })}
                >
                  <Image src={cardArt(p.thumbnail!)} alt={name} fill sizes="(min-width: 1024px) 62vw, 86vw" />
                  <div className="x-card__top">
                    <span className="x-chip x-mono">
                      {String(idx + 1).padStart(2, "0")} / {String(picks.length).padStart(2, "0")}
                    </span>
                    <span className="x-chip x-mono">{ar ? ev.ar : ev.en}</span>
                  </div>
                  <div className="x-card__meta">
                    <p className="x-mono opacity-75">
                      {p.category === "development" ? t("Digital product", "منتج رقمي", "Produk digital") : t("Identity", "هوية", "Identiti")} · {p.year}
                    </p>
                    <h3 className="x-card__name">{name}</h3>
                    <p className="x-card__line">{line}</p>
                  </div>
                </Link>
              </div>
            );
          })}

          <div className="x-slide x-slide--end">
            <Link href="/work" className="x-endlink">
              <span className="grid justify-items-center gap-3">
                <span className="x-display" style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}>
                  {total}
                </span>
                <span className="x-mono">{t("All projects", "كل المشاريع", "Semua projek")}</span>
                <Arrow size={22} />
              </span>
            </Link>
          </div>
        </motion.div>

        {pinned ? (
          <div aria-hidden className="x-work__progress">
            <motion.i style={{ scaleX: scrollYProgress }} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
