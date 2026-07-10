"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";
import { ArticleBody } from "@/features/writing/article-body";
import { extractSections, readingMinutes, type ArticleSection } from "@/features/writing/toc";
import type { SerializedEditorState } from "lexical";

interface PostSummary {
  slug: string;
  title: string;
  index: string;
}

interface PostDetail {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
  lang?: "en" | "ar";
  topics?: string[];
  body: unknown;
}

/* ------------------------------------------------------------------ */
/* Reading progress bar (Lovable reference)                            */
/* ------------------------------------------------------------------ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.2 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] bg-accent"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Side navigation rail with scrollspy                                 */
/* ------------------------------------------------------------------ */
function SideNav({ sections }: { sections: ArticleSection[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Article sections"
      className="fixed top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 ltr:right-6 rtl:left-6 xl:flex"
    >
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
          title={s.text}
          className={`group flex items-center gap-2 font-mono text-micro tracking-[0.1em] transition-colors duration-base ${
            active === s.id ? "text-accent" : "text-text-ghost hover:text-text-tertiary"
          }`}
        >
          <span
            className={`h-px transition-all duration-base ${
              active === s.id ? "w-6 bg-accent" : "w-3 bg-current"
            }`}
          />
          {s.no}
        </button>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Back-to-top                                                         */
/* ------------------------------------------------------------------ */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 z-40 border border-border-subtle bg-surface-1 px-3 py-2 font-mono text-micro uppercase tracking-[0.1em] text-text-tertiary transition-colors duration-base hover:border-accent hover:text-accent ltr:right-6 rtl:left-6"
    >
      ↑ TOP
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Article page                                                        */
/* ------------------------------------------------------------------ */
export function WritingDetailView({
  post,
  prev,
  next,
}: {
  post: PostDetail;
  prev?: PostSummary | null;
  next?: PostSummary | null;
}) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const postLang = post.lang ?? "en";
  const dir = postLang === "ar" ? "rtl" : "ltr";
  const dateLabel = post.publishedAt ? post.publishedAt.slice(0, 10) : "";
  const sections = extractSections(post.body);
  const minutes = post.body ? readingMinutes(post.body) : 0;
  const titleWords = post.title.split(" ");

  return (
    <main className="container-content flex min-h-svh flex-col gap-10 py-16">
      <ScrollProgress />
      <SideNav sections={sections} />
      <BackToTop />

      <Link
        href="/writing"
        className="w-fit font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
      >
        ← {t.writingSection}
      </Link>

      <header
        className="relative overflow-hidden border-b border-border-subtle pb-14"
        dir={dir}
        lang={postLang}
      >
        {/* Ambient hero glow — accent radial, GPU-cheap, both themes */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 h-72 w-72 rounded-full opacity-[0.14] blur-3xl ltr:-right-16 rtl:-left-16"
          style={{ background: "radial-gradient(closest-side, #FF4D24, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-48 w-48 rounded-full opacity-[0.07] blur-3xl ltr:left-1/4 rtl:right-1/4"
          style={{ background: "radial-gradient(closest-side, #4F46E5, transparent 70%)" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-wrap items-center gap-4"
          dir="ltr"
        >
          <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
            <span className="text-accent">{post.index}</span>
            {dateLabel ? <> · {dateLabel}</> : null}
            {minutes ? <> · {minutes} min</> : null}
          </span>
          <div className="h-px flex-1 bg-border-subtle" />
          <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-ghost">
            Aboalazm OS / Writing
          </span>
        </motion.div>

        <h1 className="max-w-[16ch] font-display text-display font-bold uppercase leading-[0.98] tracking-[-0.02em]">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
              {i < titleWords.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 max-w-[62ch] text-lead font-medium leading-snug text-text-secondary"
        >
          {post.standfirst}
        </motion.p>

        {post.topics && post.topics.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            {post.topics.map((topic, i) => (
              <span key={topic} className="flex items-center gap-3">
                <span className="border border-border-subtle px-2.5 py-1 font-mono text-micro uppercase tracking-[0.14em] text-text-tertiary">
                  {topic}
                </span>
                {i < (post.topics?.length ?? 0) - 1 ? (
                  <span aria-hidden className="text-accent">
                    +
                  </span>
                ) : null}
              </span>
            ))}
          </motion.div>
        ) : null}

        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center gap-3 font-mono text-micro uppercase tracking-[0.14em] text-text-ghost"
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          {ar ? "اقرأ" : "Scroll"}
        </motion.div>
      </header>

      {post.body ? (
        <article dir={dir} lang={postLang}>
          <ArticleBody content={post.body as SerializedEditorState} />
        </article>
      ) : (
        <p className="text-body-sm text-text-tertiary">
          {ar ? "لسه بتتكتب." : "This one's still being written."}
        </p>
      )}

      {prev || next ? (
        <footer className="mt-16 grid grid-cols-1 gap-px border-t border-border-subtle pt-0 md:grid-cols-2">
          {prev ? (
            <Link
              href={`/writing/${prev.slug}`}
              className="group flex flex-col gap-2 border-b border-border-subtle py-8 pe-6 transition-colors duration-base hover:bg-surface-1 md:border-b-0 md:border-e"
            >
              <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-ghost">
                ← {ar ? "السابق" : "Previous"} · {prev.index}
              </span>
              <span className="font-display text-lead font-bold uppercase text-text-primary transition-colors duration-base group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
          {next ? (
            <Link
              href={`/writing/${next.slug}`}
              className="group flex flex-col gap-2 py-8 ps-6 text-end transition-colors duration-base hover:bg-surface-1"
            >
              <span className="font-mono text-micro uppercase tracking-[0.14em] text-text-ghost">
                {ar ? "التالي" : "Next"} · {next.index} →
              </span>
              <span className="font-display text-lead font-bold uppercase text-text-primary transition-colors duration-base group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : null}
        </footer>
      ) : null}
    </main>
  );
}
