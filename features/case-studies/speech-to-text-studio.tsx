"use client";

import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";

const engines = [
  { name: "Deepgram", model: "Nova-3", role: "Primary engine", roleAr: "المحرك الأساسي", color: "bg-orange-400" },
  { name: "Gladia", model: "Solaria", role: "Fallback 01", roleAr: "البديل الأول", color: "bg-cyan-400" },
  { name: "AssemblyAI", model: "Universal", role: "Fallback 02", roleAr: "البديل الثاني", color: "bg-violet-400" },
  { name: "Speechmatics", model: "Enhanced", role: "Fallback 03", roleAr: "البديل الثالث", color: "bg-emerald-400" },
] as const;

const capabilities = [
  ["01", "Four-engine orchestration", "One request can move through a configurable provider chain; retryable failures and empty transcripts trigger a structured hand-off.", "تنسيق أربعة محركات", "ينتقل الطلب الواحد بين مزوّدي التفريغ وفق ترتيب قابل للضبط، مع تحويل تلقائي عند الأعطال القابلة لإعادة المحاولة أو حين يعود النص فارغًا."],
  ["02", "Bring your own keys", "Connect, test, disable, enable or remove provider credentials from Settings. Secrets are masked and stored in an HttpOnly cookie on the user's device.", "مفاتيحك أنت", "تُضاف المفاتيح وتُختبر وتُعطَّل أو تُحذف من صفحة الإعدادات، وتُخفى قيمها وتُحفظ في ملف تعريف ارتباط (Cookie) محمي على جهاز المستخدم."],
  ["03", "Multiple audio inputs", "Drag-and-drop upload, file browsing, supported remote media links and in-browser recording with pause, resume and stop controls.", "أكثر من طريقة لإدخال الصوت", "الرفع بالسحب والإفلات، أو اختيار ملف، أو رابط مباشر لوسائط مدعومة، أو التسجيل من المتصفح مع الإيقاف المؤقت والاستئناف والإنهاء."],
  ["04", "Editable transcript workspace", "Review and correct the generated text, inspect word and character counts, duration, estimated reading time, confidence and detected language.", "مساحة تفريغ قابلة للتحرير", "مراجعة النص وتصحيحه مع عدّاد الكلمات والحروف، والمدة، ووقت القراءة التقديري، ودرجة الثقة، واللغة المكتشفة."],
  ["05", "Export-ready output", "Copy the transcript or export plain text and SubRip (.srt) with available segment timings.", "مخرجات جاهزة للاستخدام", "نسخ النص أو تصديره بصيغة TXT أو SubRip (SRT) مع التوقيتات المتاحة للمقاطع."],
  ["06", "Usage transparency", "Show local request counts alongside provider-reported balances or hours when available, and clearly disclose when an engine offers no usage API.", "شفافية الاستهلاك", "عرض الاستهلاك المحلي إلى جانب الأرصدة أو الساعات التي يعلنها المزوّد، مع تنبيه صريح حين لا يوفّر المحرك واجهة لبيانات الاستهلاك."],
] as const;

const stack = ["Next.js 16", "React 19", "JavaScript", "Tailwind CSS 4", "Vercel Blob", "Web Audio API", "MediaRecorder", "Service Worker / PWA", "Provider REST APIs"];

export function SpeechToTextStudioCaseStudy() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="overflow-hidden">
      <section className="container-wide relative flex min-h-[68svh] flex-col justify-between gap-7 py-5 md:py-7">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-orange-500/[0.10] blur-[100px]" />
          <div className="absolute -left-20 top-56 h-72 w-72 rounded-full bg-violet-400/[0.09] blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        </div>
        <div className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">{ar ? "→ كل الأعمال" : "← All work"}</Link>
          <span>{ar ? "ملف منتج / 002" : "Product case file / 002"}</span>
        </div>

        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-orange-400/30 bg-orange-400/[0.08] px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">Audio intelligence tool</span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "ثنائي اللغة · قابل للتثبيت" : "Bilingual · Installable PWA"}</span>
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-300/80">TRANSCRIPTION WORKSPACE</p>
            <h1 className="max-w-5xl text-balance break-words font-display text-[clamp(2.6rem,8vw,6.6rem)] leading-[0.9] tracking-[-0.06em] text-text-primary rtl:leading-[1.05] rtl:tracking-normal">{ar ? "استوديو تحويل الكلام إلى نص" : "Speech to Text Studio"}<span className="text-orange-300">.</span></h1>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-text-secondary md:text-2xl">
              {ar ? "أكثر من زر يحوّل الصوت إلى نص: مساحة عمل كاملة للتفريغ الصوتي، تجمع محركات متعددة وبدائل تلقائية وتحكمًا في المفاتيح والاستهلاك والتصدير." : "Not just a button that turns audio into text. A full transcription workspace that brings multiple engines, automatic failover, credential controls, usage visibility and export into one place."}
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface-1/70 p-4 backdrop-blur-xl md:p-4">
            <div className="mb-5 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-text-tertiary">
              <span>{ar ? "لوحة قدرات الأداة" : "Tool capability panel"}</span>
              <span className="text-orange-300">STT</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-subtle p-4"><p className="font-display text-4xl text-text-primary">04</p><p className="mt-2 text-xs text-text-tertiary">{ar ? "محركات تفريغ" : "Transcription engines"}</p></div>
              <div className="rounded-xl border border-border-subtle p-4"><p className="font-display text-4xl text-text-primary">AR/EN</p><p className="mt-2 text-xs text-text-tertiary">{ar ? "واجهة عربية وإنجليزية" : "Arabic + English UI"}</p></div>
              <div className="col-span-2 rounded-xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "مسار المعالجة" : "Processing path"}</p>
                <p className="mt-2 text-sm text-text-primary">Input <span className="text-orange-300">→</span> Engine chain <span className="text-orange-300">→</span> Editable transcript <span className="text-orange-300">→</span> Export</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-text-tertiary">{ar ? "القدرات موثّقة في الشيفرة المصدرية للمشروع وملف README، ويعتمد نجاح كل محرك على تهيئة مفاتيح الخدمة وحدودها." : "Capabilities are documented in the source and README; provider success depends on configured credentials and provider limits."}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{ar ? "الدور: هندسة المنتج والتكامل" : "Role: Product engineering & integration"}</span><span>{ar ? "المجال: أدوات الصوت" : "Domain: Audio tooling"}</span><span>2026</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/3boalazm/MahmoudTC-tool" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm text-text-primary transition-colors hover:border-orange-400/60 hover:bg-orange-400/[0.06]">GitHub ↗</a>
            <a href="https://mahtool.vercel.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5">{ar ? "افتح الاستوديو" : "Open the studio"} {ar ? "↖" : "↗"}</a>
          </div>
        </div>
      </section>
      <div className="container-content"><ProjectEnquiry compact service="digital-product" /></div>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">01 / {ar ? "المشكلة" : "The problem"}</p><h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "المحرك الواحد نقطة فشل واحدة." : "One engine means one point of failure."}</h2></div>
          <div className="max-w-3xl space-y-3 text-base leading-[1.65] text-text-secondary">
            <p>{ar ? "تربط واجهات التفريغ البسيطة المستخدمَ غالبًا بمزوّد واحد. فإذا نفد الرصيد أو بلغ حدَّ الطلبات (Rate limit) أو تعثّرت الاستجابة، اضطر إلى تجربة خدمة أخرى ونقل الملف والإعدادات بنفسه." : "Simple transcription interfaces often tie the user to one provider. When credits run out, rate limits hit or a response fails, the user has to switch services and repeat the workflow manually."}</p>
            <p>{ar ? "يوحّد الاستوديو أربع خدمات خلف مسار API واحد، ويجرّب المحركات بالترتيب حتى ينجح أحدها أو ينتهي المسار، مع سجلّ منظَّم للمحاولات يساعد على فهم سبب الفشل." : "Speech to Text Studio places four providers behind one API route, tries them in sequence until one succeeds or the chain is exhausted, and returns a structured attempt trail to explain failures."}</p>
            <div className="rounded-xl border-s-2 border-orange-400 bg-orange-400/[0.04] p-4"><p className="text-sm leading-[1.65] text-text-primary">{ar ? "الفكرة الأساسية: يختار المستخدم طريقة عمله، وتتولى الأداة تنسيق المحركات وحدودها وعرض رسائل الفشل بوضوح." : "Core principle: users choose how they want to work; the tool orchestrates providers, their limits and clear failure reporting."}</p></div>
          </div>
        </div>
      </section>

      <section className="container-wide py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">02 / {ar ? "سلسلة المحركات" : "The engine chain"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "أربع خدمات. مسار واحد." : "Four providers. One workflow."}</h2></div><p className="max-w-md text-sm leading-[1.65] text-text-tertiary">{ar ? "يمكن تثبيت محرك بعينه أو ترك الأداة تتبع الترتيب المضبوط، ويمكن إيقاف الانتقال التلقائي عند الحاجة." : "Pin a preferred engine or let the tool follow its configured order. Automatic fallback can also be turned off when needed."}</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {engines.map((engine, i) => <article key={engine.name} className="rounded-xl border border-border-subtle bg-surface-1/40 p-4 transition-colors hover:border-orange-400/40"><div className="mb-4 flex items-center justify-between"><span className="font-mono text-xs text-text-ghost">0{i + 1}</span><span className={`h-2 w-2 rounded-full ${engine.color}`} /></div><h3 className="font-display text-2xl text-text-primary">{engine.name}</h3><p className="mt-1 text-sm text-text-secondary">{engine.model}</p><p className="mt-6 border-t border-border-subtle pt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? engine.roleAr : engine.role}</p></article>)}
        </div>
        <div className="mt-5 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-5"><div className="flex flex-wrap items-center gap-2 text-sm">{["Request", "Deepgram", "Gladia", "AssemblyAI", "Speechmatics", "Transcript"].map((step, i) => <span key={step} className="flex items-center gap-2"><span className={`rounded-lg border px-3 py-2 ${i === 0 || i === 5 ? "border-orange-400/40 bg-orange-400/[0.07] text-text-primary" : "border-border-subtle text-text-secondary"}`}>{step}</span>{i < 5 && <span className="text-orange-300">{ar ? "←" : "→"}</span>}</span>)}</div><p className="mt-4 text-xs leading-[1.65] text-text-tertiary">{ar ? "مخطط توضيحي لسلسلة البدائل. قد يغيّر المحرك المثبَّت أو الترتيب ENGINE_ORDER نقطة البداية، ولا تُكرَّر المحاولة بلا داعٍ مع الأخطاء التي لا تقبل الإعادة." : "Illustrative fallback chain. A pinned engine or ENGINE_ORDER can change the starting point; non-retryable failures are not blindly retried."}</p></div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-8"><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">03 / {ar ? "داخل مساحة العمل" : "Inside the workspace"}</p><h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "خيارات كثيرة، دون أن تتحول إلى فوضى." : "Lots of options, without turning into chaos."}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(([n, title, body, titleAr, bodyAr]) => <article key={n} className="group rounded-xl border border-border-subtle bg-background/55 p-4 transition-colors hover:border-orange-400/40 md:p-4"><div className="mb-7 flex items-center justify-between"><span className="font-mono text-xs text-text-ghost">{n}</span><span className="text-orange-300 transition-transform group-hover:translate-x-1">↗</span></div><h3 className="font-display text-xl text-text-primary">{ar ? titleAr : title}</h3><p className="mt-3 text-sm leading-[1.65] text-text-secondary">{ar ? bodyAr : body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="container-wide py-6 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[0.6fr_1fr]"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">04 / {ar ? "ملفات كبيرة وتسجيل مباشر" : "Large files & live capture"}</p><h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "التعامل مع الصوت جزء من المنتج." : "Audio handling is part of the product."}</h2></div>
          <div className="space-y-3 text-sm leading-[1.65] text-text-secondary">
            <p>{ar ? "تدعم واجهة الإدخال السحب والإفلات واختيار ملف من الجهاز والتسجيل من المتصفح، مع عدّاد زمني ومؤشر مباشر لمستوى الصوت، وتعرض المدة والحجم وشكلًا موجيًا مبنيًّا على بيانات الصوت." : "The input surface supports drag-and-drop, local file selection and browser recording with a timer and live level meter, plus duration, size and decoded waveform peaks."}</p>
            <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border-subtle p-4"><p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">Inline upload</p><p className="mt-2 text-2xl font-display text-text-primary">4 MB</p><p className="mt-2 text-xs text-text-tertiary">{ar ? "حدّ تقريبي على Vercel دون Blob" : "Vercel path without Blob storage"}</p></div><div className="rounded-xl border border-orange-400/30 bg-orange-400/[0.04] p-4"><p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">Blob direct upload</p><p className="mt-2 text-2xl font-display text-text-primary">300 MB</p><p className="mt-2 text-xs text-text-tertiary">{ar ? "عند ربط Vercel Blob وضبط الحد" : "When Vercel Blob is configured with the size ceiling"}</p></div></div>
            <p>{ar ? "تتبع الحدود الاستضافة والإعدادات، وتقرأ الواجهة القدرات الفعلية من /api/health بدل أن تَعِد المستخدم بحجم لا يمكن استقباله." : "Limits depend on hosting and configuration; the UI reads actual capabilities from /api/health instead of advertising a size the deployment cannot accept."}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">05 / {ar ? "الخصوصية والاعتمادية" : "Privacy & reliability"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "كثرة الخيارات تحتاج إلى حدود واضحة." : "More options need clear boundaries."}</h2></div>
          <div className="divide-y divide-border-subtle border-y border-border-subtle">{[
            [ar ? "المفاتيح لا تصل إلى الواجهة" : "Credentials stay server-side", ar ? "لا تُستخدم مفاتيح النشر إلا في مسارات الخادم. أما مفاتيح المستخدم فتُحفظ في ملف تعريف ارتباط (Cookie) محمي، وتعرض الردود حالة مقنَّعة لا القيمة السرّية." : "Deployment keys are used by server routes only. User keys live in an HttpOnly cookie; responses expose masked status, never the raw secret."],
            [ar ? "حماية الروابط" : "Remote URL guard", ar ? "تخضع روابط الملفات البعيدة لفحص البروتوكول والعناوين العامة وإعادة التوجيه ونوع المحتوى وحجم التنزيل والمهلة الزمنية." : "Remote media links are checked for protocol, public IP resolution, redirects, content type, download size and a bounded deadline."],
            [ar ? "حماية من الطلبات المفرطة" : "Request abuse controls", ar ? "تحديد معدل الطلبات، والتحقق من صيغة الملفات وحجمها، ومنع قبول روابط Blob من خارج المخزن المسموح." : "Rate limiting, format and size validation, and strict restrictions on accepted Blob URLs help limit abuse."],
            [ar ? "حدود تشغيلية صريحة" : "Honest operational limits", ar ? "تفصل لوحة الاستهلاك بين العدّادات المحلية والبيانات التي يقدّمها المزوّد، وتنبّه صراحةً حين لا تتوفر واجهة لبيانات الاستهلاك." : "The usage panel separates local counters from provider-reported data and explicitly marks missing usage APIs."],
          ].map(([title, body]) => <div key={title} className="grid gap-2 py-5 sm:grid-cols-[190px_1fr] sm:gap-6"><h3 className="text-sm font-medium text-text-primary">{title}</h3><p className="text-sm leading-[1.65] text-text-secondary">{body}</p></div>)}</div>
        </div>
      </section>

      <section className="container-wide py-6 md:py-8"><div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">06 / {ar ? "التقنيات" : "Technology stack"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary">{ar ? "لكل طبقة مهمتها." : "Every layer has a job."}</h2></div><div><div className="flex flex-wrap gap-2">{stack.map((item) => <span key={item} className="rounded-full border border-border-subtle bg-background/60 px-3 py-2 font-mono text-xs text-text-secondary">{item}</span>)}</div><p className="mt-6 text-sm leading-[1.65] text-text-secondary">{ar ? "طبقة API موحّدة، ومحوّلات منفصلة للمزوّدين، وتصنيف للأخطاء يمكن قراءته آليًا، مع اختبارات تغطي سيناريوهات التحويل بين المحركات ومسارات المفاتيح والرفع." : "A single API route fronts separate provider adapters, machine-readable error taxonomy and tests for engine hand-offs, credential flows and upload boundaries."}</p></div></div></section>

      <section className="border-t border-border-subtle bg-surface-1/35"><div className="container-wide flex flex-col gap-8 py-6 md:py-7 lg:flex-row lg:items-end lg:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">HAND-OFF / 002</p><h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "أداة قادرة، وحدودها صريحة." : "A capable tool, with honest boundaries."}</h2><p className="mt-5 max-w-2xl text-sm leading-[1.65] text-text-secondary">{ar ? "يجمع الاستوديو تجربة الاستخدام وتنسيق المحركات والرفع والتسجيل والتصدير في منتج واحد، ويتوقف توفّر كل ميزة فعليًا على إعداد الاستضافة ومفاتيح المزوّد." : "Speech to Text Studio combines interaction design, provider orchestration, upload, recording and export in one product. Actual provider capability depends on deployment configuration and credentials."}</p></div><div className="flex shrink-0 flex-wrap gap-3"><a href="https://github.com/3boalazm/MahmoudTC-tool" target="_blank" rel="noreferrer" className="rounded-full border border-border-default px-5 py-3 text-sm text-text-primary hover:border-orange-400/60">Source code ↗</a><a href="https://mahtool.vercel.app/" target="_blank" rel="noreferrer" className="rounded-full bg-orange-400 px-5 py-3 text-sm font-medium text-black hover:-translate-y-0.5">{ar ? "جرّب الاستوديو" : "Try the studio"} {ar ? "↖" : "↗"}</a></div></div></section>
    </div>
  );
}
