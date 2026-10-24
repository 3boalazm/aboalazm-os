"use client";

import Link from "@/components/ui/localized-link";
import { Icon } from "@/components/ui/Icon";
import { motion } from "framer-motion";
import { physics } from "@/lib/motion";
import { useLang } from "@/components/providers/lang-provider";
import { SectionHead } from "@/features/offers/offer-blocks";
import { BOOKS } from "@/lib/books";
import { Heading } from "@/components/ui/Heading";
import { panelCardVariants } from "@/components/ui/PanelCard";

export function BooksView() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <main className="container-content flex flex-col gap-7 pb-6">
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "المكتبة" : "LIBRARY"}
          title={
            <>
              {ar ? "كتب " : "Books, "}
              <em className="text-accent">{ar ? "تُقرأ كتجربة." : "read as an experience."}</em>
            </>
          }
          subtitle={
            ar
              ? "كتب ومراجع في التصميم والبراندينج — معاد بناؤها كتجربة قراءة تفاعلية على مراحل، بدل صفحات ثابتة."
              : "Books and references on design and branding — rebuilt as a staged, interactive reading experience instead of static pages."
          }
          subtitleClassName="max-w-[54ch]"
        />
      </header>

      <section className="flex flex-col gap-4">
        <SectionHead
          label={["AVAILABLE NOW", "متاح الآن"]}
          title={["On the", "على"]}
          italic={["shelf.", "الرفّ."]}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {BOOKS.map((book) => (
            <motion.div
              key={book.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={physics}
            >
              <Link
                href={`/books/${book.slug}`}
                className={panelCardVariants({
                  className: "group flex h-full flex-col justify-between gap-6 rounded-panel p-4 md:p-4 transition-colors duration-base ease-physics hover:border-accent/40",
                })}
              >
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                    {book.edition}
                  </span>
                  <h2 className="font-display text-title tracking-[-0.02em] text-text-primary">
                    {ar ? book.title : book.titleEn}
                  </h2>
                  <p className="max-w-[48ch] text-body-sm text-text-secondary">
                    {ar ? book.blurb : book.blurbEn}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                  <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
                    {book.chapterCount}{" "}
                    {ar
                      ? `فصلًا · ${book.journeys.length} رحلات`
                      : `chapters · ${book.journeys.length} journeys`}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-[0.06em] text-accent">
                    {ar ? "اقرأ" : "READ"}
                    <span aria-hidden className="transition-transform duration-base ease-physics group-hover:translate-x-1">
                      <Icon name="arrow-right" />
                    </span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
