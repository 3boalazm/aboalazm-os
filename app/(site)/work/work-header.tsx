"use client";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { Icon } from "@/components/ui/Icon";

/* Route mood — the index sits on a cool violet/cyan wash so the page reads
   as a gallery rather than a list, while the individual cards keep their
   OWN project accent. Hovering a ledger row raises its project pair above
   this floor and settles back to it on release. Low opacity on purpose:
   the cards must stay the loudest colour on the page. */
const WORK_MOOD = {
  primary: "rgb(139 92 246 / 0.11)",
  secondary: "rgb(34 211 238 / 0.07)",
} as const;

export function WorkHeader() {
  const { lang } = useLang();
  const ar = lang === "ar";
  useAmbientGlow(WORK_MOOD, 0.4);
  return (
    <header className="flex flex-col gap-4">
      <Heading
        eyebrow={ar ? `الفهرس · ${new Date().getFullYear()}` : `Index · ${new Date().getFullYear()}`}
        title={ar ? <>أعمال <em>مختارة</em></> : <>Selected <em>Work</em></>}
        titleClassName="max-w-[14ch] text-balance-pretty"
        subtitle={
          ar
            ? "أنظمة هوية بصرية، معايير تصميم، ومعمارية تغليف — التحدي، ما تم تصميمه، والنتيجة."
            : "Brand identity systems, visual standards, and packaging — the challenge, what was designed, and the outcome."
        }
        subtitleClassName="max-w-[56ch]"
      />

      {/* Recruiter / Hiring Team Callout */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border-subtle bg-surface-1 p-3.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-pill bg-accent" />
          <p className="font-mono text-micro text-text-secondary">
            {ar
              ? "هل تقيّم مصطفى لوظيفة مصمم هوية بصرية أول؟"
              : "Evaluating Mustafa for an in-house or agency Brand Identity role?"}
          </p>
        </div>
        <Link
          href="/for-hiring"
          className="inline-flex items-center gap-1.5 font-mono text-micro font-medium text-text-primary underline decoration-border-default underline-offset-4 transition-colors hover:text-accent"
        >
          <span>{ar ? "انتقل لملف المرشح وتفصيل الأدوار والـ CV" : "View Candidate Dossier, Roles & CV"}</span>
          <Icon name="arrow-right" size="0.9em" />
        </Link>
      </div>
    </header>
  );
}
