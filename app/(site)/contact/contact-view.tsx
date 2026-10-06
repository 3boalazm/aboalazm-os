"use client";
import { StatusNode } from "@/features/hero";
import { ContactForm } from "@/features/contact";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { Heading } from "@/components/ui/Heading";
import type { CSSProperties } from "react";

const CHANNELS = {
  en: [
    ["EMAIL","Best for project briefs","Mustafaaboalazm@mail.ru","mailto:Mustafaaboalazm@mail.ru"],
    ["WHATSAPP","Quick conversations","+20 109 250 0454","https://wa.me/201092500454"],
    ["LINKEDIN","Professional network","linkedin.com/in/aboalazm","https://www.linkedin.com/in/aboalazm"],
    ["BEHANCE","Full portfolio","behance.net/aboalazm","https://www.behance.net/aboalazm"],
  ],
  ar: [
    ["إيميل","الأنسب للبريف والمشاريع","Mustafaaboalazm@mail.ru","mailto:Mustafaaboalazm@mail.ru"],
    ["واتساب","محادثات سريعة","+20 109 250 0454","https://wa.me/201092500454"],
    ["لينكدإن","الشبكة المهنية","linkedin.com/in/aboalazm","https://www.linkedin.com/in/aboalazm"],
    ["بيهانس","البورتفوليو كامل","behance.net/aboalazm","https://www.behance.net/aboalazm"],
  ],
} as const;

const CONTACT_CORAL = {
  primary: "rgb(255 107 71 / 0.16)",
  secondary: "rgb(255 168 120 / 0.08)",
} as const;

export function ContactView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const channels = ar ? CHANNELS.ar : CHANNELS.en;
  /* Warm, human, low-terminal — this route keeps the studio's own coral
     rather than borrowing a project accent, so the last step of the
     funnel feels like a person answering, not a service desk. */
  useAmbientGlow(CONTACT_CORAL, 0.45);

  return (
    <main className="container-wide relative grid min-h-svh gap-8 py-16 lg:grid-cols-[5fr_7fr]">
      <div className="flex flex-col gap-4">
        <Heading
          eyebrow={ar ? "07 / تواصل" : "07 / CONTACT"}
          title={
            ar
              ? <>قولّي عايز <em>تبني إيه.</em></>
              : <>Tell me what you want <em>to build.</em></>
          }
          titleClassName="max-w-[16ch] text-balance-pretty"
          subtitle={
            ar
              ? "اسم وإيميل وجملة كافية للبداية. لو مش جاهز تملا نموذج، الإيميل والواتساب تحت بديل واضح."
              : "A name, an email, and a sentence is enough. Prefer not to fill a form? Email and WhatsApp are right here."
          }
          subtitleClassName="max-w-[46ch]"
        />

        <div className="mt-4 flex flex-col items-start gap-2">
          <StatusNode />
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {ar
              ? "متوسط الرد: أقل من 24 ساعة · أحد–خميس · 10ص–7م القاهرة"
              : "AVG. RESPONSE: UNDER 24H · SUN–THU · 10AM–7PM CAIRO"}
          </p>
        </div>

        {/* Recruiter / Hiring path differentiation */}
        <div className="mt-2 rounded-card border border-border-subtle bg-surface-1 p-3">
          <p className="font-mono text-micro text-accent uppercase tracking-[0.08em]">
            {ar ? "فرص التوظيف والشركات" : "Hiring & In-house Roles"}
          </p>
          <p className="mt-1 text-body-sm text-text-secondary">
            {ar
              ? "هل تتواصل بخصوص دور وظيفي كامل أو تعاقدي لمصمم هوية بصرية؟ يمكنك مراجعة وتنزيل ملف المرشح والسيرة الذاتية مباشرة."
              : "Reaching out regarding a full-time, contract, or agency role? You can review the hiring dossier and download the CV directly."}
          </p>
          <a
            href="/for-hiring"
            className="mt-2 inline-flex items-center gap-1.5 font-mono text-micro text-text-primary underline decoration-border-default underline-offset-4 hover:text-accent"
          >
            <span>{ar ? "الانتقال لصفحة مسؤولي التوظيف والـ CV ←" : "Go to For Hiring Teams Dossier →"}</span>
          </a>
        </div>

        <div className="mt-2 flex flex-col border-t border-border-subtle">
          {channels.map(([tag, hint, label, href]) => (
            <a
              key={tag}
              href={href}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group grid grid-cols-[6rem_1fr_auto] items-baseline gap-2 border-b border-border-subtle py-2"
            >
              <span className="font-mono text-micro uppercase tracking-[0.10em] text-accent">{tag}</span>
              <span className="min-w-0">
                <span className="block truncate text-body-sm text-text-primary">{label}</span>
                <span className="block font-mono text-micro text-text-ghost">{hint}</span>
              </span>
              <span aria-hidden className="inline-flex text-text-tertiary transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
            </a>
          ))}
        </div>
      </div>

      {/* The form is the focal object of this route. It used to be one more
          matte panel in a page of flat panels — a light field and a glass
          rim give it the weight its role deserves without adding any
          animated decoration. */}
      <div className="relative">
        <div
          aria-hidden
          className="atmos-field atmos-drift"
          style={
            {
              "--atmos-1": "var(--color-accent)",
              "--atmos-2": "var(--color-creative)",
              "--atmos-x": "30%",
              "--atmos-y": "0%",
            } as CSSProperties
          }
        />
        <div className="relative z-elevated">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
