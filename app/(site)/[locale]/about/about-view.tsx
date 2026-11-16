"use client";
import Link from "@/components/ui/localized-link";
import { SystemConstellation } from "@/features/hero";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";
import { Icon } from "@/components/ui/Icon";
import { PagePlate } from "@/components/ui/page-plate";
import { Heading } from "@/components/ui/Heading";
import { StudioModelBand } from "@/features/offers/disciplines";

const DOCTRINE = {
  en: [
    ["Strategy before design", "No logo until positioning, audience, and personality are agreed in writing — without strategy there's no way to judge."],
    ["Systems, not artifacts", "A logo is the entry. The real work is the system that follows, so the brand stays itself across every touchpoint."],
    ["Show the work", "A logo on a white page is theory; on a business card, a package, a screen — that's the test."],
    ["Deliver, don't dump", "Final files come with guidelines, a handover call, and 30 days of support. Done means the team can run with it."],
  ],
  ar: [
    ["الاستراتيجية قبل التصميم", "لا شعار قبل الاتفاق كتابةً على التموضع والجمهور والشخصية. فبلا استراتيجية لا يوجد معيار يُحكم به على التصميم."],
    ["أنظمة لا قطع منفردة", "الشعار مجرد مدخل. العمل الحقيقي هو النظام الذي يليه، لتبقى العلامة على حالها في كل نقطة تواصل."],
    ["اعرض العمل", "الشعار على ورقة بيضاء نظرية فحسب؛ أما على بطاقة أعمال أو عبوة أو شاشة، فهناك يُختبر فعلًا."],
    ["سلّم عملًا يعمل", "تُسلَّم الملفات النهائية مع دليل الهوية واجتماع تسليم ودعم لمدة 30 يومًا. والإنجاز يعني أن يتمكن فريقك من العمل بها."],
  ],
} as const;

const TIMELINE = {
  en: [
    ["2026 →", "Digital Product & Platform Lead", "Nile Pharma Food — digital presence, ERP, UX and platform direction"],
    ["2024 →", "Co-Founder & Creative Lead", "Code & Canvas — branding & web for SMEs across Egypt and the region"],
    ["2020–25", "Media Director & Account Manager", "Nile Pharma Food — brand system, packaging and campaign governance"],
    ["2020–21", "Studio Lead & Visual Director", "Learn in Arabic (MSP) — identity + DIY studio built from scratch"],
    ["2019–21", "Head of Media ×2 Seasons", "Youth Scope — full identity twice; Best Head, both seasons"],
    ["2022 →", "Brand Identity Designer & Consultant (Freelance)", "4+ years focused on brand identity and systems; 20+ clients and organizations across pharma, food, education, NGOs, government"],
  ],
  ar: [
    ["2026 ←", "قائد المنتجات والمنصات الرقمية", "نايل فارما فود: الحضور الرقمي وERP وتجربة المستخدم وتوجيه المنصات"],
    ["2024 ←", "شريك مؤسس ومدير إبداعي", "Code & Canvas: هوية بصرية وويب للشركات الصغيرة والمتوسطة في مصر والمنطقة"],
    ["2020–25", "مدير الإعلام ومدير الحسابات", "نايل فارما فود: نظام العلامة والتغليف وحوكمة الحملات"],
    ["2020–21", "قائد الاستوديو والمدير البصري", "تعلّم بالعربي (MSP): هوية واستوديو DIY بُنيا من الصفر"],
    ["2019–21", "رئيس لجنة الإعلام لموسمين", "Youth Scope: هوية كاملة مرتين، وأفضل رئيس لجنة في الموسمين"],
    ["2022 ←", "مصمم هوية بصرية ومستشار (مستقل)", "أكثر من 4 سنوات في الهوية والأنظمة، وأكثر من 20 عميلًا ومؤسسة في الصيدلة والغذاء والتعليم والجمعيات الأهلية والحكومة"],
  ],
} as const;

const FACTS = {
  en: [
    ["CURRENT STATUS", "Taking on selected brand identity projects | Malaysia / Gulf / Remote"],
    ["BASED", "Al Obour, Egypt — open to Malaysia, the Gulf & remote"],
    ["LANGUAGES", "Arabic (Native) · English (Full professional) · Malay (Working — Malaysia-facing studio communications, this site’s third locale)"],
    ["EDUCATION", "B.Sc. — Al-Azhar University · 2017–2024"],
    ["TRAINING", "MSP · Youth Scope · AYB · Bedaya · Resalah"],
  ],
  ms: [
    ["STATUS SEMASA", "Menerima projek identiti jenama terpilih | Malaysia / Gulf / Remote"],
    ["LOKASI", "Al Obour, Mesir — terbuka kepada Malaysia, Teluk & jarak jauh"],
    ["BAHASA", "Arab (Asli) · Inggeris (Profesional penuh) · Melayu (Berfungsi — komunikasi studio untuk Malaysia, lokasi ketiga laman ini)"],
    ["PENDIDIKAN", "B.Sc. — Universiti Al-Azhar · 2017–2024"],
    ["LATIHAN", "MSP · Youth Scope · AYB · Bedaya · Resalah"],
  ],
  ar: [
    ["الوضع الحالي", "أستقبل مشاريع مختارة في الهوية البصرية | ماليزيا / الخليج / عن بُعد"],
    ["المقر", "العبور، مصر · منفتح على ماليزيا والخليج والعمل عن بُعد"],
    ["اللغات", "العربية (لغة أم) · الإنجليزية (احترافية كاملة) · الملايو (مستوى عملي: تواصل الاستوديو مع السوق الماليزي، وهي اللغة الثالثة للموقع)"],
    ["التعليم", "بكالوريوس العلوم، جامعة الأزهر · 2017–2024"],
    ["التدريب", "MSP · يوث سكوب · AYB · بداية · رسالة"],
  ],
} as const;

export function AboutView({ cvUrl }: { cvUrl: string | null }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = useT();
  const doctrine = ar ? DOCTRINE.ar : DOCTRINE.en;
  const timeline = ar ? TIMELINE.ar : TIMELINE.en;
  const facts = ar ? FACTS.ar : lang === "ms" ? FACTS.ms : FACTS.en;

  return (
    <main className="container-content flex flex-col gap-8 pb-6">
      <PagePlate src="/images/generated/page-about.jpg" align="start">
        <header className="flex flex-col gap-4">
        <Heading
          eyebrow={ar ? t.aboutSection : t.aboutSection}
          title={
            ar ? (
              <>{t.aboutH1a} <em>{t.aboutH1b}</em></>
            ) : (
              <>{t.aboutH1a} <em>{t.aboutH1b}</em></>
            )
          }
          titleClassName="heading-fit-long max-w-[18ch] text-balance-pretty"
          subtitle={
            ar
              ? "Aboalazm OS استوديو يقوده مؤسسه مصطفى أبوالعزم، مصمم هوية بصرية أول وشريك مؤسس في Code & Canvas. يعمل من العبور في مصر على مشاريع في المنطقة وخارجها: استراتيجية العلامة، وأنظمة الهوية، والطبقة الرقمية التي تعيش فيها، وأنظمة التشغيل التي تقوم عليها، بلغتين وتحت مبدأ واحد."
              : "Aboalazm OS is the founder-led studio of Mustafa Aboalazm — senior brand identity designer and co-founder of Code & Canvas. Based in Al Obour, Egypt, working across the region and worldwide: brand strategy, identity systems, the digital layer they live in, and the operating systems underneath, in two languages, under one doctrine."
          }
          subtitleClassName="max-w-[52ch]"
        />

        <dl className="grid grid-cols-1 gap-2 border-y border-border-subtle py-3 sm:grid-cols-2">
          {facts.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{k}</dt>
              <dd className="text-body-sm text-text-secondary">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={cvUrl ?? "/cv"}
            download="Mustafa_Taha_Brand_Identity_CV.docx"
            className="inline-flex w-fit items-center gap-2 rounded-pill bg-accent px-4 py-2 font-mono text-micro uppercase tracking-[0.08em] text-obsidian transition-transform duration-fast ease-physics hover:-translate-y-0.5"
          >
            <>{ar ? "تحميل السيرة الذاتية (Word)" : lang === "ms" ? "Muat turun CV (Word)" : "Download CV (Word)"} <Icon name="arrow-down" /></>
          </a>
          <Link
            href="/for-hiring"
            className="inline-flex w-fit items-center gap-2 rounded-pill border border-border-default px-4 py-2 font-mono text-micro uppercase tracking-[0.08em] text-text-primary transition-colors duration-fast ease-physics hover:border-accent hover:text-accent"
          >
            <>{ar ? "ملف المرشح لفرق التوظيف" : lang === "ms" ? "Dosier untuk Pasukan Pengambilan" : "For Hiring Teams Dossier"} <Icon name="arrow-right" /></>
          </Link>
          </div>
        </header>
      </PagePlate>

      <section aria-label={t.aboutAriaDoctrine} className="flex flex-col">
        <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? t.aboutDoctrine : t.aboutDoctrine}
        </p>
        {doctrine.map(([title, body], i) => (
          <div key={i} className="border-t border-border-subtle py-3 last:border-b">
            <p className="font-display text-title tracking-[-0.015em] text-text-primary">
              <span className="mr-2 font-mono text-label text-accent">0{i + 1}</span>
              {title}
            </p>
            <p className="mt-1 max-w-[60ch] text-body-sm text-text-secondary">{body}</p>
          </div>
        ))}
      </section>

      {/* Operating model — answers "is this a studio or one person?" before the
          career timeline can leave the question open (2026-11 repositioning). */}
      <section aria-label={ar ? "نموذج الاستوديو" : lang === "ms" ? "Model studio" : "Studio model"}>
        <StudioModelBand />
      </section>

      <section aria-label={t.aboutAriaCareer}>
        <p className="pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? t.aboutCareer : t.aboutCareer}
        </p>
        {timeline.map(([year, role, note]) => (
          <div
            key={role}
            className="grid grid-cols-[6rem_1fr] items-baseline gap-2 border-b border-border-subtle py-2 md:grid-cols-[6rem_16rem_1fr]"
          >
            <span className="font-mono text-label text-text-tertiary">{year}</span>
            <span className="text-body text-text-primary">{role}</span>
            <span className="col-span-2 text-body-sm text-text-secondary md:col-span-1">{note}</span>
          </div>
        ))}
      </section>

      <section aria-label={t.aboutAriaSystem} className="flex flex-col items-center gap-4">
        <p className="max-w-[52ch] text-center text-lead text-text-secondary">
          {ar
            ? "يمرّ كل مشروع بالسلسلة نفسها: تتحول الاستراتيجية إلى هوية، والهوية إلى متغيّرات تصميم، والمتغيّرات إلى مكوّنات وصفحات. وفوق ذلك طبقة الأنظمة التي تجعل التشغيل يسير بالأرقام."
            : "Every engagement runs the same chain: strategy becomes identity, identity compiles into tokens, tokens into components and pages — and on top of it sits the systems layer that makes the operation run on numbers."}
        </p>
        <SystemConstellation />
      </section>
    </main>
  );
}
