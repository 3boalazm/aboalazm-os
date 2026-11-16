"use client";

import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { PwaInstallButton } from "@/components/pwa/pwa-install-button";
import { Icon } from "@/components/ui/Icon";
import { SITE_URL } from "@/lib/site";
import { cardArt } from "@/features/work/card-art";
import type { Project } from "@/features/work/types";

const CHANNELS = [
  { label: "WhatsApp", value: "Let’s talk about your project", valueAr: "لنتحدث عن مشروعك", href: "https://wa.me/201092500454" },
  { label: "Email", value: "Send a brief or a rough idea", valueAr: "أرسل موجزًا أو حتى فكرة أولية", href: "mailto:m1aboalazm@gmail.com" },
  { label: "LinkedIn", value: "Professional profile", valueAr: "الملف المهني", href: "https://www.linkedin.com/in/aboalazm" },
  { label: "Behance", value: "Brand identity work", valueAr: "أعمال الهوية البصرية", href: "https://www.behance.net/aboalazm" },
];

export function DeveloperView({ projects }: { projects: Project[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <main className="overflow-hidden pb-8">
      <section className="container-wide relative flex min-h-[calc(88svh-5rem)] flex-col justify-center gap-8 pb-6 pt-0 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-6 lg:pb-12">
        <div className="pointer-events-none absolute -start-24 top-36 -z-10 size-72 rounded-full bg-accent/10 blur-[100px]" aria-hidden />
        <div className="flex flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-border-subtle px-3 py-1.5 font-mono text-micro uppercase tracking-[0.12em] text-text-tertiary">
            <span className="size-1.5 rounded-full bg-accent" />
            {ar ? "مصمّم · مهندس منتجات · باني أنظمة" : "Designer · Product Architect · Builder"}
          </div>
          <h1 className="max-w-[12ch] font-display text-[clamp(3.4rem,8vw,7.8rem)] font-medium leading-[0.88] tracking-[-0.065em] text-text-primary">
            {ar ? <>أنا لا <em className="text-accent not-italic">أصمّم فقط.</em><br />أنا أبني.</> : <>I don’t just <em className="text-accent not-italic">design.</em><br />I build.</>}
          </h1>
          <p className="mt-7 max-w-[54ch] text-base leading-relaxed text-text-secondary sm:text-lg">
            {ar
              ? "أنا مصطفى أبوالعزم. أحوّل الأفكار المبعثرة إلى علامات مميزة، ومنتجات رقمية نافعة، وأنظمة تكبر دون أن تفقد روحها. من أول قرار استراتيجي إلى آخر سطر برمجي."
              : "I’m Mustafa Aboalazm. I turn messy ideas into distinctive brands, useful digital products, and systems built to grow without losing their soul — from the first strategic decision to the last line of code."}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="https://wa.me/201092500454" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-3 font-mono text-micro font-semibold uppercase tracking-[0.08em] text-obsidian transition-transform hover:-translate-y-0.5">
              {ar ? "لديك فكرة؟ لنبنِها معًا" : "Have an idea? Let’s build it"}
              <Icon name="arrow-up-right" size={15} />
            </a>
            <Link href="/work" className="inline-flex items-center gap-2 rounded-pill border border-border-default px-5 py-3 font-mono text-micro uppercase tracking-[0.08em] text-text-primary transition-colors hover:border-accent">
              {ar ? "استعرض الأعمال" : "Explore the work"}
              <Icon name="arrow-down" size={15} />
            </Link>
          </div>
          <div className="mt-9 grid w-full max-w-xl grid-cols-3 border-y border-border-subtle py-4">
            {[
              { n: "09+", en: "Years creating", ar: "سنوات من العمل" },
              { n: "20+", en: "Clients & teams", ar: "عملاء وفرق" },
              { n: "02", en: "Worlds connected", ar: "عالمان متصلان" },
            ].map((stat) => (
              <div key={stat.n} className="flex flex-col gap-1 pe-3">
                <span className="font-display text-2xl tracking-tight text-text-primary sm:text-3xl">{stat.n}</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-text-ghost">{ar ? stat.ar : stat.en}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="relative">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border-default bg-surface-1 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-micro uppercase tracking-[0.13em] text-accent">ABOALAZM OS / 01</p>
                <h2 className="mt-2 max-w-[14ch] font-display text-3xl leading-tight tracking-tight text-text-primary sm:text-4xl">
                  {ar ? <>ليس مجرد موقع.<br /><em className="text-accent not-italic">بل نظام يعمل.</em></> : <>Not just a website.<br /><em className="text-accent not-italic">A working system.</em></>}
                </h2>
              </div>
              <span className="brand-orb size-12 shrink-0 sm:size-14">
                <span className="brand-orb__glow" aria-hidden />
                <Image src="/images/work/icon.png" alt="Aboalazm OS" width={56} height={56} className="brand-orb__img size-12 sm:size-14" />
              </span>
            </div>
            <p className="mt-4 max-w-[42ch] text-body-sm leading-relaxed text-text-secondary">
              {ar
                ? "نظام التشغيل الخاص بي يجمع التفكير والتصميم والأدوات والتجارب التي أبنيها. ثبّته على جهازك لتبقى مساحة العمل كلها قريبة منك."
                : "My personal operating system brings together the thinking, design, tools, and experiments I build. Install it on your device and keep the whole workspace close."}
            </p>
            <div className="mt-6 rounded-2xl border border-border-subtle bg-surface-0/70 p-3 sm:p-4">
              <PwaInstallButton variant="inline" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-text-ghost">{ar ? "من تصميمي وبنائي" : "Designed & built by me"}</span>
              <a href={`${SITE_URL}/`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-micro text-text-secondary transition-colors hover:text-accent">
                {ar ? "افتح النظام" : "Open the OS"} <Icon name="arrow-up-right" size={13} />
              </a>
            </div>
          </div>
          <p className="mt-3 text-end font-mono text-[0.6rem] uppercase tracking-[0.12em] text-text-ghost">DESIGN WITH INTENT. BUILD WITH PROOF.</p>
        </aside>
      </section>

      <section className="container-wide border-t border-border-subtle py-6 sm:py-7">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-micro uppercase tracking-[0.12em] text-accent">{ar ? "02 / أعمال مختارة" : "02 / SELECTED PROOF"}</p>
            <h2 className="mt-3 max-w-[15ch] font-display text-4xl leading-[0.98] tracking-[-0.04em] text-text-primary sm:text-6xl">
              {ar ? <>أفكار خرجت <em className="text-accent not-italic">إلى النور.</em></> : <>Ideas that made it <em className="text-accent not-italic">into the world.</em></>}
            </h2>
          </div>
          <Link href="/work" className="inline-flex w-fit items-center gap-2 border-b border-border-default pb-1 font-mono text-micro uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent hover:text-accent">
            {ar ? "كل الأعمال" : "All work"} <Icon name="arrow-up-right" size={14} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const href = project.hasCaseStudy ? `/case-studies/${project.slug}` : project.liveUrl ?? project.externalUrl ?? "/work";
            const external = href.startsWith("http");
            return (
              <article key={project.slug} className="group flex min-w-0 flex-col overflow-hidden rounded-card border border-border-subtle bg-surface-1 transition-colors duration-300 hover:border-border-strong">
                <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="relative block aspect-[1.36] overflow-hidden bg-surface-2">
                  <Image src={cardArt(project.thumbnail)} alt={ar ? project.nameAr ?? project.name : project.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                  <span className="absolute start-3 top-3 rounded-pill border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-white backdrop-blur">
                    {project.category === "development" ? (ar ? "منتج رقمي" : "DIGITAL PRODUCT") : (ar ? "هوية بصرية" : "BRAND IDENTITY")}
                  </span>
                  <span className="absolute bottom-3 end-3 grid size-9 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-transform group-hover:-translate-y-0.5">
                    <Icon name="arrow-up-right" size={16} />
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-4 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight tracking-tight text-text-primary sm:text-2xl">{ar ? project.nameAr ?? project.name : project.name}</h3>
                    <span className="pt-1 font-mono text-micro text-text-ghost">0{index + 1}</span>
                  </div>
                  <p className="mt-2 flex-1 text-body-sm leading-relaxed text-text-secondary">{ar ? project.outcomeAr ?? project.outcome : project.outcome}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 3).map((item) => <span key={item} className="rounded-pill border border-border-subtle px-2 py-1 font-mono text-[0.58rem] text-text-ghost">{item}</span>)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-wide grid gap-8 border-t border-border-subtle py-6 sm:py-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
        <div>
          <p className="font-mono text-micro uppercase tracking-[0.12em] text-accent">{ar ? "03 / طريقة تفكيري" : "03 / HOW I THINK"}</p>
          <h2 className="mt-3 max-w-[12ch] font-display text-4xl leading-[0.98] tracking-[-0.04em] text-text-primary sm:text-6xl">
            {ar ? <>حلقة واحدة.<br /><em className="text-accent not-italic">من الفكرة للتنفيذ.</em></> : <>One loop.<br /><em className="text-accent not-italic">Idea to execution.</em></>}
          </h2>
        </div>
        <div className="flex flex-col">
          {[
            { n: "01", title: ar ? "أفهم المشكلة قبل الشكل" : "Understand before styling", body: ar ? "الجمهور والسياق والهدف التجاري والقيود هي التي تحدّد شكل الحل قبل الجماليات." : "Audience, context, business goal, and constraints shape the solution before aesthetics do." },
            { n: "02", title: ar ? "أصمّم نظامًا لا لقطة" : "Design a system, not a moment", body: ar ? "هوية قابلة للتطبيق، وتجربة مفهومة، ومكوّنات متماسكة تبقى صالحة حين يكبر المشروع." : "An identity people can use, an experience people understand, and components that hold together as the project grows." },
            { n: "03", title: ar ? "أربط الموجز بالتنفيذ" : "Connect the brief to the build", body: ar ? "لأنني أعمل في التصميم والبرمجة معًا، تقلّ المسافة بين الفكرة والمنتج الذي يستطيع الناس استخدامه." : "Because I work across design and code, there’s less distance between the idea and the product people can actually use." },
          ].map((item) => (
            <div key={item.n} className="grid gap-2 border-t border-border-subtle py-5 sm:grid-cols-[4rem_1fr] sm:gap-4">
              <span className="font-mono text-micro text-accent">{item.n}</span>
              <div>
                <h3 className="font-display text-xl text-text-primary sm:text-2xl">{item.title}</h3>
                <p className="mt-1 max-w-[54ch] text-body-sm leading-relaxed text-text-secondary">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wide pb-8 sm:pb-24">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-border-default bg-surface-1 p-4 sm:p-6 lg:p-14">
          <div className="pointer-events-none absolute -end-16 -top-24 size-64 rounded-full bg-accent/10 blur-[90px]" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="font-mono text-micro uppercase tracking-[0.12em] text-accent">{ar ? "04 / خطوتك التالية" : "04 / YOUR NEXT MOVE"}</p>
              <h2 className="mt-3 max-w-[13ch] font-display text-4xl leading-[0.94] tracking-[-0.05em] text-text-primary sm:text-6xl">
                {ar ? <>لا يلزمك أن تملك الخطة كاملة.<br /><em className="text-accent not-italic">ابدأ بالحديث.</em></> : <>You don’t need the whole plan.<br /><em className="text-accent not-italic">Start with a conversation.</em></>}
              </h2>
              <p className="mt-4 max-w-[50ch] text-body-sm leading-relaxed text-text-secondary">
                {ar ? "لديك علامة تحتاج إلى وضوح؟ أو منتج يحتاج إلى بناء؟ أو فكرة لا تعرف من أين تبدأ بها؟ أرسل إليّ ما لديك لنرى إن كنا نستطيع تحويله إلى شيء يستحق." : "A brand that needs clarity? A product that needs building? An idea you haven’t figured out yet? Send me what you have. We’ll find out what it could become."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="https://wa.me/201092500454" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-3 font-mono text-micro font-semibold uppercase tracking-[0.08em] text-obsidian transition-transform hover:-translate-y-0.5">
                  {ar ? "ابدأ عبر واتساب" : "Start on WhatsApp"} <Icon name="arrow-up-right" size={15} />
                </a>
                <a href="mailto:m1aboalazm@gmail.com" className="inline-flex items-center gap-2 rounded-pill border border-border-default px-5 py-3 font-mono text-micro uppercase tracking-[0.08em] text-text-primary transition-colors hover:border-accent">
                  {ar ? "أرسل بريدًا إلكترونيًا" : "Send an email"} <Icon name="arrow-up-right" size={15} />
                </a>
              </div>
            </div>
            <div className="flex flex-col border-t border-border-subtle pt-5 lg:border-s lg:border-t-0 lg:ps-6 lg:pt-0">
              <p className="mb-3 font-mono text-micro uppercase tracking-[0.12em] text-text-ghost">{ar ? "وتجدني أيضًا هنا" : "FIND ME ELSEWHERE"}</p>
              {CHANNELS.map((channel) => (
                <a key={channel.label} href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined} className="group flex items-center justify-between gap-3 border-t border-border-subtle py-3 text-text-secondary transition-colors hover:text-text-primary">
                  <span>
                    <span className="block font-display text-lg">{channel.label}</span>
                    <span className="block text-xs text-text-ghost">{ar ? channel.valueAr : channel.value}</span>
                  </span>
                  <Icon name="arrow-up-right" size={16} className="text-text-ghost transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
