"use client";

/**
 * LINKEDIN SESSION — after-session feedback.
 *
 * Narrower than the registration page on purpose: one column, nothing to
 * read before answering. The person is on a phone, just left a session, and
 * has about a minute. Every question lives in
 * features/linkedin-session/feedback.ts.
 */
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { SessionFeedbackForm } from "@/features/linkedin-session/feedback-form";
import { ALL_FEEDBACK_FIELDS } from "@/features/linkedin-session/feedback";

const COPY = {
  eyebrow: ["تقييم السيشن", "SESSION FEEDBACK"],
  titleLead: ["رأيك يهمنا.", "Your view counts."],
  titleItalic: ["دقيقة واحدة.", "One minute."],
  subtitle: [
    "السيشن دي اتبنت على إجاباتكم قبلها، والجاية هتتبني على إجاباتكم دلوقتي. قول اللي عجبك واللي مأعجبكش.",
    "This session was built from your answers before it; the next one is built from your answers now. Tell us what worked and what didn't.",
  ],
  badge: ["دقيقة", "1 MIN"],
} as const;

export function SessionFeedbackView({ sessionKey }: { sessionKey: string }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const pick = (pair: readonly [string, string]) => (ar ? pair[0] : pair[1]);
  const required = ALL_FEEDBACK_FIELDS.filter((f) => f.required).length;

  return (
    <main className="container-content flex max-w-[760px] flex-col gap-6 pb-6">
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={pick(COPY.eyebrow)}
          eyebrowMeta={<Badge tone="accent">{pick(COPY.badge)}</Badge>}
          title={
            <>
              {`${pick(COPY.titleLead)} `}
              <em className="text-accent">{pick(COPY.titleItalic)}</em>
            </>
          }
          subtitle={pick(COPY.subtitle)}
          titleClassName="heading-fit-long"
          subtitleClassName="max-w-[56ch]"
        />
        <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
          {ar ? `${required} أسئلة أساسية · الباقي اختياري` : `${required} required questions · the rest is optional`}
        </p>
      </header>

      <SessionFeedbackForm sessionKey={sessionKey} deckHref="/linkedin-session/deck" />
    </main>
  );
}
