"use client";

/**
 * STATEMENT BAND — the manifesto moment (overhaul S2, spec §4.3-04).
 * Deliberately breaks the home rhythm: no SectionMarker, no card chrome,
 * full-bleed obsidian panel that reads dark in both themes (it is the
 * "sudden quiet room" between the work and the offer). SSR-painted.
 */
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";

export function StatementBand() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <section aria-label={ar ? "بيان المنهج" : "Studio statement"} className="bg-obsidian text-alabaster">
      <div className="container-wide flex flex-col gap-6 py-7 md:py-10">
        <p className="font-mono text-micro uppercase tracking-[0.14em] text-alabaster/50">
          {ar ? "الموقف" : "THE POSITION"}
        </p>
        <h2 className="max-w-[22ch] font-display text-[clamp(2rem,5.5vw,4.75rem)] leading-[1.02] tracking-[-0.03em]">
          {ar ? (
            <>
              معظم البراندات مزخرفة.{" "}
              <em className="text-accent">القليل منها مصمم ليشتغل.</em>
            </>
          ) : (
            <>
              Most brands are decorated.{" "}
              <em className="text-accent">Few are designed to run.</em>
            </>
          )}
        </h2>
        <p className="max-w-[58ch] text-body-lg leading-[1.7] text-alabaster/70">
          {ar
            ? "التسليم ليس ملفاً أبداً — بل معيار تشغيل: ثنائي اللغة في معماريته، محكوم بالتوكنز، ومبني ليعمل فريقك بلا تخمين بعد الرحيل."
            : "The deliverable is never a file — it is an operating standard: bilingual by architecture, governed by tokens, and built so your team never guesses after handoff."}
        </p>
        <Link
          href="/writing"
          className="group w-fit font-mono text-label uppercase tracking-[0.06em] text-alabaster/60 transition-colors duration-base ease-physics hover:text-alabaster"
        >
          {ar ? "اقرأ التفكير خلف المنهج" : "Read the thinking behind it"}
          <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            <Icon name="arrow-right" />
          </span>
        </Link>
      </div>
    </section>
  );
}
