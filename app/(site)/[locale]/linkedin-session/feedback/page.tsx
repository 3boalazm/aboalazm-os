import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import { SessionFeedbackView } from "./feedback-view";
import { DEFAULT_SESSION_KEY } from "@/features/linkedin-session/assessment";

/**
 * THE LINKEDIN SESSION FEEDBACK FORM — /linkedin-session/feedback (and /ar).
 *
 * Sent to the room at the end of the session. Everything about the sibling
 * registration page applies here too:
 *
 *   · `force-dynamic` — the form POSTs to a server action that writes to
 *     Payload, so a cached copy would be a page that only looks alive;
 *   · `robots: noindex` — a form for one session, shared by link, not a page
 *     to rank. It therefore has no share card of its own and is absent from
 *     the sitemap.
 */
export const dynamic = "force-dynamic";

const TITLES: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "LinkedIn Session — feedback",
    description: "One minute: how the session went, what helped, and what to change next time.",
  },
  ar: {
    title: "سيشن LinkedIn — تقييم السيشن",
    description: "دقيقة واحدة: السيشن كانت عاملة إزاي، إيه اللي فادك، وإيه اللي نغيّره المرة الجاية.",
  },
};

export default function LinkedInSessionFeedbackPage() {
  return <SessionFeedbackView sessionKey={DEFAULT_SESSION_KEY} />;
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
