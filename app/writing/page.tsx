import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Writing — Notes from the system",
  description:
    "Working documents on identity, tokens, and the craft of bilingual design.",
};

interface WritingEntry {
  index: string;
  slug: string;
  title: string;
  standfirst: string;
  publishedAt: string;
}

/* Seed entries until the studio is populated (lib/sanity falls back) */
const SEED: readonly WritingEntry[] = [
  { index: "W-003", slug: "logo-smallest-part", title: "The logo is the smallest part.", standfirst: "Why guidelines fail and token systems don't.", publishedAt: "2026-04" },
  { index: "W-002", slug: "arabic-deserves-design", title: "Arabic deserves design, not translation.", standfirst: "Building bilingual lockups as one system, not two compromises.", publishedAt: "2026-02" },
  { index: "W-001", slug: "strategy-is-a-standard", title: "Strategy is a standard, not a phase.", standfirst: 'What "I\'ll know it when I see it" actually costs.', publishedAt: "2026-01" },
];

export default async function WritingPage() {
  const posts: readonly WritingEntry[] = (await getPosts()) ?? SEED;

  return (
    <main className="container-content flex min-h-svh flex-col gap-8 py-16">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          06 / WRITING
        </p>
        <h1 className="font-display text-display tracking-[-0.025em]">
          Notes from the system.
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">
          Working documents on identity, tokens, and the craft of bilingual
          design — written from projects, not about them.
        </p>
      </header>

      <ol>
        {posts.map((post) => (
          <li key={post.index}>
            <Link
              href={`/writing/${post.slug}`}
              className="group grid grid-cols-[4rem_1fr] items-baseline gap-2 border-b border-border-subtle py-3 md:grid-cols-[4rem_1fr_auto]"
            >
              <span className="font-mono text-micro text-text-ghost">{post.index}</span>
              <span>
                <span className="relative font-display text-title tracking-[-0.015em] text-text-primary">
                  {post.title}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-slow ease-physics group-hover:scale-x-100" />
                </span>
                <span className="mt-1 block text-body-sm text-text-secondary">
                  {post.standfirst}
                </span>
              </span>
              <span className="hidden font-mono text-micro text-text-tertiary md:block">
                {post.publishedAt}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        PUBLISHED IRREGULARLY · WRITTEN CAREFULLY
      </p>
    </main>
  );
}
