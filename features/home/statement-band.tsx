"use client";

/**
 * STATEMENT BAND — the manifesto moment (overhaul S2, spec §4.3-04).
 * Deliberately breaks the home rhythm: no SectionMarker, no card chrome,
 * full-bleed obsidian panel that reads dark in both themes (it is the
 * "sudden quiet room" between the work and the offer). SSR-painted.
 *
 * Voice: the editorial display (Instrument Serif; Thmanyah in Arabic) with one
 * accent phrase, then a paragraph whose words light up as it scrolls through.
 * Styles: .statement-editorial in globals.css — the closing CTA's language
 * without the picture.
 */
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { ScrubText } from "@/components/ui/scrub-text";

export function StatementBand() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <section aria-label={ar ? "بيان المنهج" : lang === "ms" ? "Kenyataan studio" : "Studio statement"} className="statement-editorial">
      <div className="container-wide statement-editorial__inner">
        <p className="statement-editorial__kicker">{ar ? "الموقف" : lang === "ms" ? "KEDUDUKAN" : "THE POSITION"}</p>
        <h2 className="editorial-display statement-editorial__title">
          {ar ? (
            <>
              معظم البراندات مزخرفة.{" "}
              <em className="text-accent">القليل منها مصمم ليشتغل.</em>
            </>
          ) : lang === "ms" ? (
            <>
              Kebanyakan jenama hanya dihias.{" "}
              <em className="text-accent">Sedikit yang direka untuk berfungsi.</em>
            </>
          ) : (
            <>
              Most brands are decorated.{" "}
              <em className="text-accent">Few are designed to run.</em>
            </>
          )}
        </h2>
        <ScrubText
          className="statement-editorial__lead"
          text={
            ar
              ? "التسليم ليس ملفاً أبداً — بل معيار تشغيل: ثنائي اللغة في معماريته، محكوم بالتوكنز، ومبني ليعمل فريقك بلا تخمين بعد الرحيل."
              : "The deliverable is never a file — it is an operating standard: bilingual by architecture, governed by tokens, and built so your team never guesses after handoff."
          }
        />
        <Link
          href="/writing"
          className="group mt-2 w-fit font-mono text-label uppercase tracking-[0.06em] text-alabaster/60 transition-colors duration-base ease-physics hover:text-alabaster"
        >
          {ar ? "اقرأ التفكير خلف المنهج" : lang === "ms" ? "Baca pemikiran di sebalik metodologi" : "Read the thinking behind it"}
          <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            <Icon name="arrow-right" />
          </span>
        </Link>
      </div>
    </section>
  );
}
