"use client";
import { StatusNode } from "@/features/hero";
import { ContactForm } from "@/features/contact";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";

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

export default function ContactPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = useT();
  const channels = ar ? CHANNELS.ar : CHANNELS.en;

  return (
    <main className="container-wide grid min-h-svh gap-8 py-16 lg:grid-cols-[5fr_7fr]">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          {ar ? "07 / تواصل" : "07 / CONTACT"}
        </p>
        <h1 className="max-w-[14ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
          {ar
            ? <>ابدأ بالبريف، <em>مش اللوجو.</em></>
            : <>Start with the brief, <em>not the logo.</em></>}
        </h1>
        <p className="max-w-[46ch] text-lead text-text-secondary">
          {ar
            ? "مشاريع مختارة فقط. لو الجدول الزمني أو الميزانية بتضمن المتوسطية، هتسمعها في أول مكالمة — الصراحة مجانية."
            : "Selective commissions only. If the timeline or budget guarantees mediocrity, you'll hear it on the first call — that honesty is free."}
        </p>

        <div className="mt-4 flex flex-col items-start gap-2">
          <StatusNode />
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            {ar
              ? "متوسط الرد: أقل من 24 ساعة · أحد–خميس · 10ص–7م القاهرة"
              : "AVG. RESPONSE: UNDER 24H · SUN–THU · 10AM–7PM CAIRO"}
          </p>
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
              <span aria-hidden className="text-text-tertiary transition-transform duration-base ease-physics group-hover:translate-x-1">→</span>
            </a>
          ))}
        </div>
      </div>

      <ContactForm />
    </main>
  );
}
