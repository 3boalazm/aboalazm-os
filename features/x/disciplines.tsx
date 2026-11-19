"use client";

/**
 * 02 · DISCIPLINES — three portals, one open at a time.
 * Desktop: the open portal takes three times the width, the others fold to
 * spines. Phone: an accordion of picture panels. Copy comes from
 * lib/offers.ts (DISCIPLINES) so prices and deliverables never drift.
 */
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import Link from "@/components/ui/localized-link";
import { DISCIPLINES, type DisciplineId } from "@/lib/offers";
import { Arrow, Chapter, useX } from "./shared";

const ART: Record<DisciplineId, { src: string; disc: string }> = {
  brand: { src: "/images/generated/discipline-brand.jpg", disc: "#FF6B47" },
  digital: { src: "/images/generated/discipline-digital.jpg", disc: "#D0B7FF" },
  systems: { src: "/images/generated/discipline-systems.jpg", disc: "#78E0D5" },
};

export function Disciplines() {
  const { ar, t } = useX();
  const [open, setOpen] = useState<DisciplineId>("brand");
  const i = ar ? 1 : 0;

  return (
    <section id="offer" className="x-room x-iris ground-ember">
      <Chapter
        n="02"
        kicker={t("What the studio builds", "ما يبنيه الاستوديو")}
        title={
          ar ? (
            <>ثلاثة أبواب. <span className="x-accent">نظام واحد.</span></>
          ) : (
            <>
              {t("Three doors.", "")} <span className="x-accent">{t("One system.", "")}</span>
            </>
          )
        }
        lead={t(
          "Every engagement belongs to one discipline, priced in the open. Pick the door that matches the problem — the others stay one click away.",
          "كل مشروع ينتمي إلى تخصص واحد، بسعر معلن. اختر الباب الذي يناسب مشكلتك، وتبقى الأبواب الأخرى على بُعد نقرة.",
        )}
      />
      <div className="x-wrap">
        <div className="x-portals" role="list">
          {DISCIPLINES.map((d) => {
            const isOpen = open === d.id;
            const art = ART[d.id];
            return (
              <div
                key={d.id}
                role="listitem"
                className="x-gate"
                data-open={isOpen}
                style={{ "--disc": art.disc } as CSSProperties}
                onMouseEnter={() => setOpen(d.id)}
              >
                <div aria-hidden className="x-gate__img">
                  <Image src={art.src} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" />
                </div>
                <button
                  type="button"
                  className="absolute inset-0 z-10 cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`gate-${d.id}`}
                  onClick={() => setOpen(d.id)}
                  onFocus={() => setOpen(d.id)}
                  style={{ pointerEvents: isOpen ? "none" : "auto" }}
                >
                  <span className="sr-only">{d.name[i]}</span>
                </button>
                <div className="x-gate__head">
                  <span className="x-gate__n">{d.n}</span>
                  <span className="x-mono opacity-80">{d.from[i]}</span>
                </div>
                <span aria-hidden className="x-gate__spine">
                  {d.name[i]}
                </span>
                <div id={`gate-${d.id}`} className="x-gate__body relative z-20">
                  <h3 className="x-gate__name">{d.name[i]}</h3>
                  <p className="x-gate__outcome">{d.outcome[i]}</p>
                  <ul className="x-gate__list">
                    {d.includes.map((inc) => (
                      <li key={inc[0]}>{inc[i]}</li>
                    ))}
                  </ul>
                  <div className="x-gate__foot">
                    <span className="x-gate__from">{d.from[i]}</span>
                    <Link href={d.href} className="x-btn x-btn--line" tabIndex={isOpen ? 0 : -1}>
                      {t("Open this door", "افتح هذا الباب")}
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
