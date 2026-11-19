import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import { LinkedInSessionView } from "./linkedin-session-view";
import { DEFAULT_SESSION_KEY } from "@/features/linkedin-session/assessment";

/**
 * THE LINKEDIN SESSION FORM — /linkedin-session (and /ar).
 *
 * `dynamic = "force-dynamic"`: the form POSTs to a server action that writes to
 * Payload, so a cached copy of this page would be a page that only looks
 * alive. Nothing here reads the database, so the render itself is cheap — the
 * directive is about honesty in the cache, not about cost.
 *
 * `robots: { index: false }` on purpose. This is a sign-up sheet for one
 * session, shared by link — not a page to rank. It therefore also has no
 * share card of its own (lib/og-coverage.test.ts only demands a card for
 * indexable pages), and it is absent from the sitemap.
 */
export const dynamic = "force-dynamic";

const TITLES: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "LinkedIn Session — registration and pre-session assessment",
    description:
      "Five minutes of questions so the LinkedIn session is built around your level, your goal and the things you find hard — not around a generic agenda.",
  },
  ar: {
    title: "سيشن LinkedIn — التسجيل وتقييم المستوى قبل السيشن",
    description:
      "أسئلة قصيرة قبل السيشن: خلفيتك، مستواك على LinkedIn، وهدفك منه. إجاباتك هي اللي بتحدد محتوى الجلسة.",
  },
};

export default function LinkedInSessionPage() {
  return <LinkedInSessionView sessionKey={DEFAULT_SESSION_KEY} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = TITLES[locale] ?? TITLES.en;
  return {
    title: copy.title,
    description: copy.description,
    robots: { index: false, follow: false },
    openGraph: { title: copy.title, description: copy.description, type: "website" },
  };
}
