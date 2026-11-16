"use client";

/**
 * 00 · PORTAL — the hero of the new site.
 *
 * A figure walks into a coral sun. The section is pinned for one extra
 * screen: as you scroll, the sun swells toward the viewer and the claim
 * ("BUILT / TO RUN.") splits apart around it, then the manifesto takes over.
 * Always dark, in both themes — it is a film frame, not a page section.
 *
 * Primary action opens a conversation (/contact), never the deposit page.
 */
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "@/components/ui/localized-link";
import { CairoClock } from "@/components/layout/cairo-clock";
import { Arrow, useX } from "./shared";

export function Portal() {
  const { t, ar } = useX();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunScale = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 2.6]);
  const sunY = useTransform(scrollYProgress, [0, 0.75], ["0%", reduce ? "0%" : "8%"]);
  const left = useTransform(scrollYProgress, [0, 0.6], ["0vw", reduce ? "0vw" : ar ? "18vw" : "-18vw"]);
  const right = useTransform(scrollYProgress, [0, 0.6], ["0vw", reduce ? "0vw" : ar ? "-18vw" : "18vw"]);
  const fade = useTransform(scrollYProgress, [0, 0.45], [1, reduce ? 1 : 0]);
  /* Pointer parallax: sun, ring and claim drift on different depths. */
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const sunX = useTransform(mx, (v) => v * -36);
  const ringX = useTransform(mx, (v) => v * -80);
  const titleX = useTransform(mx, (v) => v * 46);
  const veil = useTransform(scrollYProgress, [0.55, 0.95], [0, reduce ? 0 : 1]);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => !reduce && e.pointerType === "mouse" && mx.set(e.clientX / window.innerWidth - 0.5)}
      className="x-portal ground-base" aria-label={t("Aboalazm OS — studio", "Aboalazm OS — الاستوديو", "Aboalazm OS — studio")}>
      <div className="x-portal__pin">
        <div aria-hidden className="x-portal__halo" />
        <motion.div aria-hidden className="x-portal__sun" style={{ scale: sunScale, y: sunY, x: sunX }}>
          <Image src="/images/generated/hero-poster.jpg" alt="" fill priority sizes="(min-width: 768px) 70vh, 150vw" />
        </motion.div>

        <motion.div aria-hidden className="x-portal__orbit" style={{ scale: sunScale, opacity: fade, x: ringX }}>
          <svg viewBox="0 0 1000 1000">
            <defs>
              <path id="x-orbit" d="M500,500 m-470,0 a470,470 0 1,1 940,0 a470,470 0 1,1 -940,0" />
            </defs>
            <text>
              <textPath href="#x-orbit" textLength="2940">
                Aboalazm OS ✺ Built to run ✺ Brand identity ✺ Digital experience ✺ Business systems ✺ Arabic · English · Bahasa Melayu ✺
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* The claim, split around the sun. */}
        <motion.h1 className="x-display x-portal__title" style={{ x: titleX }}>
          <motion.span style={{ x: left, opacity: fade }}>{t("Built", "مبنية", "Dibina")}</motion.span>
          <motion.span style={{ x: right, opacity: fade }}>
            {t("to run", "لتشتغل", "untuk jalan")}
            <em>.</em>
          </motion.span>
        </motion.h1>

        <motion.div className="x-portal__hud" style={{ opacity: fade }}>
          <p className="x-mono x-hud-tl">
            Aboalazm OS
            <br />
            <span className="opacity-70">{t("Founder-led studio · since 2017", "استوديو يقوده مؤسسه · من 2017", "Studio dipimpin pengasas · sejak 2017")}</span>
          </p>
          <p className="x-mono x-hud-tr">
            {t("Brand · Digital · Systems", "هوية · رقمي · أنظمة", "Jenama · Digital · Sistem")}
            <br />
            <span className="opacity-70">
              <CairoClock label={t("Al Obour, Cairo", "العبور، القاهرة", "Al Obour, Kaherah")} />
            </span>
          </p>
        </motion.div>

        <motion.div className="x-portal__foot" style={{ opacity: fade }}>
          <p className="x-portal__lead">
            {t(
              "Aboalazm OS builds the brand, the digital layer it lives in, and the systems that keep a business running — in Arabic and English.",
              "Aboalazm OS بيبني البراند، والطبقة الرقمية اللي بيعيش فيها، والأنظمة اللي بتخلي البيزنس شغال — بالعربي والإنجليزي.",
              "Aboalazm OS membina jenama, lapisan digital tempat ia hidup, dan sistem yang memastikan perniagaan terus berjalan — dalam bahasa Arab dan Inggeris.",
            )}
          </p>
          <div className="x-portal__ctas">
            <Link href="/contact?source=%2F" className="x-btn x-btn--solid">
              {t("Book a discovery call", "احجز مكالمة استكشاف", "Tempah panggilan penemuan")}
              <Arrow />
            </Link>
            <a href="#work" className="x-btn x-btn--line">
              {t("See the work", "شوف الشغل", "Lihat kerja")}
            </a>
          </div>
          <p className="x-mono x-portal__scroll" aria-hidden>
            <i />
            {t("Scroll", "انزل", "Tatal")}
          </p>
        </motion.div>

        {/* Fades the frame to the room below so the hand-off is seamless. */}
        <motion.div aria-hidden className="absolute inset-0 bg-[var(--color-surface-0)]" style={{ opacity: veil }} />
      </div>
    </section>
  );
}
