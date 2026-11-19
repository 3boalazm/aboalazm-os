"use client";

/**
 * LINKEDIN SESSION — registration & pre-session assessment.
 *
 * One screen, two columns: the questionnaire and the short brief that explains
 * why we ask. The header copy is bilingual here; every question label lives in
 * features/linkedin-session/assessment.ts so the form, the database and the
 * console cannot drift apart.
 */
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";
import { PanelCard } from "@/components/ui/PanelCard";
import { Badge } from "@/components/ui/Badge";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, WHATSAPP_HREF } from "@/lib/contact-details";
import { SessionRegistrationForm } from "@/features/linkedin-session/registration-form";
import { FIELD_GROUPS } from "@/features/linkedin-session/assessment";

const COPY = {
  eyebrow: ["تسجيل وتقييم المستوى", "REGISTRATION & ASSESSMENT"],
  titleLead: ["سيشن LinkedIn.", "LinkedIn session."],
  titleItalic: ["ابدأ من مستواك.", "Start from where you are."],
  subtitle: [
    "سؤالين تلاتة قبل ما نتكلم: مين انت، فين انت على LinkedIn، وعايز إيه منه. الإجابات دي هي اللي بتحدد محتوى السيشن — مش العكس.",
    "Three questions before we speak: who you are, where you stand on LinkedIn, and what you want from it. The answers shape the session — not the other way round.",
  ],
  badge: ["5 دقايق", "5 MIN"],
  whyLabel: ["ليه بنسألك", "WHY WE ASK"],
  /** [ar title, en title, ar body, en body] — flat strings keep the pair rule visible. */
  why: [
    [
      "السيشن بيتبني على الغرفة",
      "The session is built for this room",
      "لو نصّكم لسه ماعندوش حساب، أول 20 دقيقة بناء بروفايل صح. ولو الكل شغال على حسابه، نتكلم عن الشبكة وعرض القيمة. من غير السؤال ده هنخمن.",
      "If half the room has no account, the first 20 minutes are building a profile properly. If everyone is active, we talk about network and value instead. Without asking, we would be guessing.",
    ],
    [
      "هدف واحد كفاية",
      "One goal is enough",
      "تدريب، وظيفة، فري لانس، أو اسم معروف — كل هدف ليه مسار مختلف على المنصة. بنركّز على الهدف الأكثر تكرارًا عندكم.",
      "Internship, a job, freelance, or a name people recognise — each needs a different route on the platform. We go deep on the goal this cohort repeats most.",
    ],
    [
      "أسئلتك هي الأجندة",
      "Your questions are the agenda",
      "التحديات اللي بتكتبها بتتجمع في لوحة واحدة، واللي بيتكرر منها بيتحط في السيشن حرفيًا. اسأل سؤالك هنا، ولو ما اتغطّاش هتلاقي إجابته.",
      "The challenges you write are collected in one board, and whatever repeats most goes into the session verbatim. Ask it here; if it is not covered you will still get an answer.",
    ],
  ] as const,
  bringLabel: ["جهّز قبل السيشن", "BRING TO THE SESSION"],
  bring: [
    ["حساب LinkedIn مسجّل الدخول عليه", "A LinkedIn account, signed in"],
    ["CV ولو على مسودة", "Your CV, even a draft"],
    ["٦٠ دقيقة فاضية وتطبيق مفتوح", "60 free minutes with the app open"],
  ],
  privacyLabel: ["خصوصية بياناتك", "YOUR DATA"],
  privacy: [
    "الإجابات بتتحفظ في نظام الاستوديو (Aboalazm OS) وتقرأها الفريق المسؤول عن السيشن فقط، بهدف التحضير والمتابعة.",
    "ملف الـ CV بيترفع في مساحة خاصة مش عامة — مش بيظهر في مكتبة الوسائط ولا في أي صفحة على الموقع.",
    "محدش يشوف إجابتك باسمك غير منظم السيشن. عايز تمسح بياناتك؟ ابعتهالنا على البريد ونعملها في نفس اليوم.",
  ],
  privacyBodyEn: [
    "Answers are stored in the studio's own system (Aboalazm OS) and read only by the team running the session, for preparation and follow-up.",
    "The CV lands in a private store — never the public media library, never a page on this site.",
    "Nobody sees your answer with your name except the session host. Want it deleted? Email us and it goes the same day.",
  ],
  helpLabel: ["استكفت حاجة؟", "STUCK?"],
  help: ["اكتب لنا على البريد أو واتساب، ونكمل التسجيل معاك يدويًا.", "Write to us on email or WhatsApp and we will finish the registration with you."],
} as const;

export function LinkedInSessionView({ sessionKey }: { sessionKey: string }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const pick = (pair: readonly [string, string]) => (ar ? pair[0] : pair[1]);

  return (
    <main className="container-content flex flex-col gap-8 pb-6">
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
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SessionRegistrationForm sessionKey={sessionKey} />

        <aside className="flex flex-col gap-3">
          <PanelCard className="flex flex-col gap-2 p-3">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">{pick(COPY.whyLabel)}</p>
            <ul className="flex flex-col gap-2">
              {COPY.why.map(([arTitle, enTitle, arBody, enBody]) => (
                <li key={arTitle}>
                  <p className="text-body-sm text-text-primary">{ar ? arTitle : enTitle}</p>
                  <p className="text-body-sm text-text-secondary">{ar ? arBody : enBody}</p>
                </li>
              ))}
            </ul>
            <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
              {ar
                ? `${FIELD_GROUPS.length} أقسام · ${FIELD_GROUPS.flatMap((g) => g.fields).length} سؤال`
                : `${FIELD_GROUPS.length} sections · ${FIELD_GROUPS.flatMap((g) => g.fields).length} questions`}
            </p>
          </PanelCard>

          <PanelCard className="flex flex-col gap-2 p-3">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">{pick(COPY.bringLabel)}</p>
            <ul className="flex flex-col gap-1">
              {COPY.bring.map((item) => (
                <li key={pick(item)} className="flex items-start gap-2 text-body-sm text-text-secondary">
                  <span aria-hidden className="mt-2 h-1 w-1 flex-none rounded-pill bg-accent" />
                  {pick(item)}
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard emphasis="dimmed" className="flex flex-col gap-2 p-3">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">{pick(COPY.privacyLabel)}</p>
            {(ar ? COPY.privacy : COPY.privacyBodyEn).map((line) => (
              <p key={line} className="text-body-sm text-text-secondary">
                {line}
              </p>
            ))}
            <p className="text-body-sm text-text-secondary">
              <Link href="/privacy" className="underline underline-offset-4 hover:text-text-primary">
                {ar ? "سياسة الخصوصية" : "Privacy policy"}
              </Link>
            </p>
          </PanelCard>

          <PanelCard className="flex flex-col gap-1 p-3">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">{pick(COPY.helpLabel)}</p>
            <p className="text-body-sm text-text-secondary">{pick(COPY.help)}</p>
            <p className="flex flex-wrap gap-2 pt-1 font-mono text-micro uppercase tracking-[0.08em]">
              <a href={CONTACT_EMAIL_HREF} className="text-accent-text hover:underline">
                {CONTACT_EMAIL}
              </a>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-text-primary">
                WhatsApp
              </a>
            </p>
          </PanelCard>
        </aside>
      </div>
    </main>
  );
}
