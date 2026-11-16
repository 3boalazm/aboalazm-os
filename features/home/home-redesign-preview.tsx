import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/locale";
import { localeHref } from "@/lib/locale";
import type { Project } from "@/features/work/types";
import "./home-redesign.css";

const COPY = {
  en: {
    kicker: "A founder-led design & technology studio",
    h1a: "Make the", h1b: "complex", h1c: "feel clear.",
    hero: "We connect brand thinking, digital craft and business systems — turning ambitious ideas into experiences people understand and tools teams can rely on.",
    primary: "Start a conversation", secondary: "Explore selected work",
    signature: "Independent by design. Connected by systems.",
    metrics: [["09+", "Years designing"], ["20+", "Client collaborations"], ["03", "Working languages"]],
    point: "A point of view",
    statement: "The best work connects what a business says with what it actually does.",
    statementBody: "A brand is more than an identity. A digital product is more than screens. An internal system is more than a dashboard. They are parts of one experience — designed to make a business easier to understand, use and grow.",
    pointLink: "The thinking behind the work",
    capabilityLabel: "Where we make a difference",
    capabilityTitle: "Three disciplines. One joined-up view.",
    capabilityBody: "We start with the problem, not a preset package. The right mix of strategy, design and engineering follows from what needs to change.",
    capabilities: [
      ["01", "Brand systems", "Give the business a distinct voice — and a system that keeps it consistent.", ["Positioning", "Identity", "Guidelines", "Art direction"], "Explore brand work", "/work/design", "mint"],
      ["02", "Digital experiences", "Make complex journeys feel simple across websites, products and platforms.", ["Websites", "Product UX", "Front-end", "Multilingual"], "Explore digital work", "/work/development", "cyan"],
      ["03", "Business systems", "Give teams better visibility, cleaner workflows and room to move.", ["Internal tools", "Dashboards", "Automation", "AI workflows"], "Explore systems", "/services/systems", "violet"],
    ],
    workLabel: "Selected work / 2023—26",
    workTitle: "Different challenges. Thoughtful systems.",
    workBody: "A small selection of identity, digital and operational work — each shaped around the context it needed to serve.",
    allWork: "View the full portfolio",
    caseTypes: ["Brand identity", "Brand system · Healthcare", "Digital product · Operations"],
    summaries: [
      "A bilingual identity system for a specialist heart and lung institute.",
      "A coherent visual language and packaging direction for a growing healthcare brand.",
      "An Arabic-first operations workspace connecting sales, inventory and commercial visibility.",
    ],
    methodLabel: "How the work moves", methodTitle: "Clear thinking. Deliberate making.",
    methodBody: "The process stays visible, collaborative and proportionate to the problem — from first conversation to the details that make the system last.",
    steps: [["01", "Discover", "Understand the people, the pressure points and the real goal."], ["02", "Frame", "Set the direction, priorities and definition of done."], ["03", "Build", "Design, prototype and engineer the right solution."], ["04", "Evolve", "Handover clearly, measure what matters and improve."]],
    labLabel: "Applied research & development", labTitle: "Technology where it earns its place.",
    labBody: "The studio explores emerging tools, but the measure is practical: less friction, better decisions and more useful work.",
    labItems: [["mint", "AI workflow design", "Connected steps, clear handoffs and human control."], ["cyan", "Internal tools & dashboards", "Focused interfaces for the work behind the scenes."], ["violet", "Product & market research", "Evidence that helps decide what to make next."]],
    labLink: "See the studio approach",
    closeEyebrow: "Have a challenge worth solving?",
    closeTitle: "Let’s make something that works — and means something.",
    closeBody: "Tell me what you are building, what feels stuck or what needs to become clearer. We can shape the right next step together.",
    closeAction: "Tell me about your project",
    closeNote: "Brand thinking / Digital craft / Business systems",
    imageAlt: "Abstract chrome figure artwork",
  },
  ar: {
    kicker: "استوديو تصميم وتقنية يقوده المؤسس",
    h1a: "نحوّل", h1b: "التعقيد", h1c: "إلى وضوح.",
    hero: "نربط التفكير في العلامة التجارية بالحرفة الرقمية وأنظمة الأعمال؛ لنحوّل الأفكار الطموحة إلى تجارب مفهومة وأدوات يمكن للفرق الاعتماد عليها.",
    primary: "ابدأ حوارًا", secondary: "استكشف أعمالًا مختارة",
    signature: "استقلال في التفكير، وترابط في التنفيذ.",
    metrics: [["09+", "سنوات في التصميم"], ["20+", "تعاونًا مع عملاء"], ["03", "لغات للعمل"]],
    point: "وجهة نظر",
    statement: "أفضل الأعمال تربط بين ما تقوله الشركة وما تفعله بالفعل.",
    statementBody: "العلامة التجارية أكبر من هويتها البصرية، والمنتج الرقمي أكبر من مجموعة شاشات، والنظام الداخلي أكبر من لوحة بيانات. كلها أجزاء من تجربة واحدة تجعل العمل أوضح وأسهل في الاستخدام والنمو.",
    pointLink: "الفكر وراء العمل",
    capabilityLabel: "مساحات نصنع فيها فرقًا",
    capabilityTitle: "ثلاثة تخصصات. رؤية واحدة مترابطة.",
    capabilityBody: "نبدأ من المشكلة، لا من باقة جاهزة. ويتحدد المزيج المناسب من الاستراتيجية والتصميم والهندسة بحسب ما يحتاج إلى تغيير.",
    capabilities: [
      ["01", "أنظمة العلامات التجارية", "نمنح النشاط صوتًا مميزًا ونظامًا يحافظ على اتساقه في كل نقطة تواصل.", ["التموضع", "الهوية", "الأدلة", "الإدارة الفنية"], "استكشف أعمال الهوية", "/work/design", "mint"],
      ["02", "التجارب الرقمية", "نجعل الرحلات المعقدة أبسط عبر المواقع والمنتجات والمنصات.", ["المواقع", "تجربة المنتج", "الواجهات", "تعدد اللغات"], "استكشف الأعمال الرقمية", "/work/development", "cyan"],
      ["03", "أنظمة الأعمال", "نمنح الفرق رؤية أفضل وتدفقات عمل أوضح ومساحة أكبر للحركة.", ["أدوات داخلية", "لوحات تحكم", "الأتمتة", "تدفقات AI"], "استكشف الأنظمة", "/services/systems", "violet"],
    ],
    workLabel: "أعمال مختارة / 2023—26",
    workTitle: "تحديات مختلفة. أنظمة مصممة بعناية.",
    workBody: "مجموعة مختارة من أعمال الهوية والتجارب الرقمية والتشغيل؛ صُمم كل منها وفق السياق الذي يخدمه.",
    allWork: "شاهد معرض الأعمال كاملًا",
    caseTypes: ["هوية بصرية", "نظام علامة · قطاع صحي", "منتج رقمي · عمليات"],
    summaries: ["نظام هوية ثنائي اللغة لمعهد متخصص في القلب والرئة.", "لغة بصرية موحدة واتجاه للتغليف لعلامة صحية في طور النمو.", "مساحة تشغيل عربية تربط المبيعات والمخزون والرؤية التجارية."],
    methodLabel: "كيف يتحرك العمل", methodTitle: "تفكير واضح. تنفيذ مقصود.",
    methodBody: "تبقى العملية واضحة وتشاركية وبحجم يناسب المشكلة؛ من أول حوار وحتى التفاصيل التي تجعل النظام مستمرًا.",
    steps: [["01", "استكشاف", "نفهم الأشخاص ونقاط الاحتكاك والهدف الحقيقي."], ["02", "تحديد", "نضع الاتجاه والأولويات ومعيار اكتمال العمل."], ["03", "بناء", "نصمم ونختبر ونهندس الحل المناسب."], ["04", "تطوير", "نسلّم بوضوح ونقيس المهم ونحسّن باستمرار."]],
    labLabel: "بحث وتطوير تطبيقي", labTitle: "نستخدم التقنية عندما تصنع فرقًا.",
    labBody: "نستكشف الأدوات الجديدة، لكن معيارنا عملي: احتكاك أقل وقرارات أفضل وعمل أكثر فائدة.",
    labItems: [["mint", "تصميم تدفقات عمل بالذكاء الاصطناعي", "خطوات مترابطة وتسليمات واضحة وتحكم بشري."], ["cyan", "أدوات داخلية ولوحات تحكم", "واجهات مركزة للأعمال التي تجري خلف الكواليس."], ["violet", "بحث المنتجات والأسواق", "أدلة تساعد على تحديد ما يستحق البناء بعد ذلك."]],
    labLink: "تعرّف على منهج الاستوديو",
    closeEyebrow: "لديك تحدٍ يستحق الحل؟",
    closeTitle: "لنصنع شيئًا يعمل جيدًا… وله معنى.",
    closeBody: "احكِ لي عمّا تبنيه، أو ما تعطل، أو ما يحتاج إلى وضوح أكبر. يمكننا تحديد الخطوة المناسبة معًا.",
    closeAction: "احكِ لي عن مشروعك",
    closeNote: "تفكير في العلامة / حرفة رقمية / أنظمة أعمال",
    imageAlt: "عمل فني تجريدي لشخصية كروم",
  },
  ms: {
    kicker: "Studio reka bentuk & teknologi dipacu pengasas",
    h1a: "Jadikan", h1b: "kerumitan", h1c: "lebih jelas.",
    hero: "Kami menghubungkan strategi jenama, kemahiran digital dan sistem perniagaan — menukar idea besar menjadi pengalaman yang mudah difahami dan alat yang boleh dipercayai oleh pasukan.",
    primary: "Mulakan perbualan", secondary: "Terokai hasil pilihan",
    signature: "Bebas dalam pendekatan. Terhubung melalui sistem.",
    metrics: [["09+", "Tahun reka bentuk"], ["20+", "Kerjasama pelanggan"], ["03", "Bahasa kerja"]],
    point: "Satu pendirian",
    statement: "Hasil terbaik menghubungkan apa yang dikatakan oleh perniagaan dengan apa yang dilakukannya.",
    statementBody: "Jenama lebih besar daripada identiti visual. Produk digital lebih besar daripada sekumpulan skrin. Sistem dalaman pula lebih besar daripada papan pemuka. Semuanya sebahagian daripada satu pengalaman yang menjadikan perniagaan lebih mudah difahami, digunakan dan dikembangkan.",
    pointLink: "Pemikiran di sebalik kerja",
    capabilityLabel: "Di mana kami membawa perubahan",
    capabilityTitle: "Tiga disiplin. Satu pandangan menyeluruh.",
    capabilityBody: "Kami bermula dengan masalah, bukan pakej tetap. Gabungan strategi, reka bentuk dan kejuruteraan ditentukan oleh perubahan yang diperlukan.",
    capabilities: [
      ["01", "Sistem jenama", "Membentuk suara yang tersendiri dan sistem yang mengekalkan konsistensinya.", ["Kedudukan", "Identiti", "Panduan", "Art direction"], "Lihat kerja jenama", "/work/design", "mint"],
      ["02", "Pengalaman digital", "Memudahkan perjalanan kompleks merentas laman web, produk dan platform.", ["Laman web", "UX produk", "Front-end", "Pelbagai bahasa"], "Lihat kerja digital", "/work/development", "cyan"],
      ["03", "Sistem perniagaan", "Memberi pasukan gambaran lebih jelas, aliran kerja lebih kemas dan ruang berkembang.", ["Alat dalaman", "Papan pemuka", "Automasi", "Aliran kerja AI"], "Lihat sistem", "/services/systems", "violet"],
    ],
    workLabel: "Hasil pilihan / 2023—26",
    workTitle: "Cabaran berbeza. Sistem yang dirancang teliti.",
    workBody: "Pilihan kerja identiti, pengalaman digital dan operasi — setiap satunya dibentuk mengikut konteks yang perlu diselesaikan.",
    allWork: "Lihat portfolio penuh",
    caseTypes: ["Identiti jenama", "Sistem jenama · Kesihatan", "Produk digital · Operasi"],
    summaries: ["Sistem identiti dwibahasa untuk institut khusus jantung dan paru-paru.", "Bahasa visual konsisten dan arah pembungkusan untuk jenama kesihatan berkembang.", "Ruang operasi Arab yang menghubungkan jualan, inventori dan gambaran komersial."],
    methodLabel: "Bagaimana kerja bergerak", methodTitle: "Pemikiran jelas. Pelaksanaan terancang.",
    methodBody: "Proses kekal telus, kolaboratif dan sepadan dengan masalah — daripada perbualan pertama hingga butiran yang menjadikan sistem tahan lama.",
    steps: [["01", "Teroka", "Fahami manusia, titik geseran dan matlamat sebenar."], ["02", "Rangka", "Tetapkan arah, keutamaan dan takrif kejayaan."], ["03", "Bina", "Reka, prototaip dan bangunkan penyelesaian tepat."], ["04", "Evolusi", "Serah dengan jelas, ukur perkara penting dan perbaik."]],
    labLabel: "Penyelidikan & pembangunan gunaan", labTitle: "Teknologi apabila ia benar-benar berguna.",
    labBody: "Kami meneroka alat baharu, tetapi ukurannya praktikal: kurang geseran, keputusan lebih baik dan kerja yang lebih berguna.",
    labItems: [["mint", "Reka bentuk aliran kerja AI", "Langkah terhubung, serahan jelas dan kawalan manusia."], ["cyan", "Alat dalaman & papan pemuka", "Antara muka fokus untuk operasi di sebalik tabir."], ["violet", "Penyelidikan produk & pasaran", "Bukti untuk menentukan perkara yang patut dibina seterusnya."]],
    labLink: "Lihat pendekatan studio",
    closeEyebrow: "Ada cabaran yang wajar diselesaikan?",
    closeTitle: "Mari bina sesuatu yang berfungsi — dan bermakna.",
    closeBody: "Ceritakan apa yang sedang anda bina, perkara yang tersekat atau yang perlu dijelaskan. Kita boleh tentukan langkah seterusnya bersama.",
    closeAction: "Ceritakan projek anda",
    closeNote: "Strategi jenama / Kemahiran digital / Sistem perniagaan",
    imageAlt: "Karya figura krom abstrak",
  },
} as const;

function displayName(project: Project | undefined, locale: Locale, fallback: string) {
  if (!project) return fallback;
  return locale === "ar" ? project.nameAr || project.name : project.name;
}

export function HomeRedesignPreview({ locale, projects }: { locale: Locale; projects: readonly Project[] }) {
  const t = COPY[locale];
  const gad = projects.find((p) => p.slug === "gad-institute");
  const npf = projects.find((p) => p.slug === "nile-pharma");
  const erp = projects.find((p) => p.slug === "nile-pharma-erp");
  const projectCards = [
    { slug: "gad-institute", image: "/images/work/gad/gad-card.jpg", title: displayName(gad, locale, "GAD Heart & Lungs Institute"), type: t.caseTypes[0], summary: t.summaries[0], year: gad?.year || "2023", large: true },
    { slug: "nile-pharma", image: "/images/work/nile-pharma/npf-card.jpg", title: displayName(npf, locale, "Nile Pharma Food"), type: t.caseTypes[1], summary: t.summaries[1], year: npf?.year || "2025", large: false },
    { slug: "nile-pharma-erp", image: "/images/work/nile-erp/nile-erp-01-command-center.webp", title: displayName(erp, locale, "Nile Pharma ERP"), type: t.caseTypes[2], summary: t.summaries[2], year: erp?.year || "2026", large: false },
  ];
  return (
    <main className="home-redesign" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <section className="hr-hero" id="top">
        <div className="hr-grid-texture" aria-hidden="true" />
        <div className="hr-wrap">
          <div className="hr-meta"><span className="hr-status"><i />{t.kicker}</span><span className="hr-coordinate">EGYPT · WORKING EVERYWHERE</span></div>
          <div className="hr-hero-layout">
            <div className="hr-hero-copy">
              <p className="hr-eyebrow"><span>01</span> BRAND / DIGITAL / SYSTEMS</p>
              <h1 className="hr-display hr-title">{t.h1a} <em>{t.h1b}</em><br />{t.h1c}</h1>
              <p className="hr-lead">{t.hero}</p>
              <div className="hr-actions">
                <Link className="hr-button" href={localeHref("/contact", locale)}>{t.primary}<span aria-hidden="true">↗</span></Link>
                <Link className="hr-secondary-link" href="#selected-work">{t.secondary}<span aria-hidden="true">↘</span></Link>
              </div>
              <p className="hr-signature">{t.signature}</p>
            </div>
            <div className="hr-hero-art">
              <div className="hr-art-orbit hr-orbit-a" aria-hidden="true" />
              <div className="hr-art-orbit hr-orbit-b" aria-hidden="true" />
              <div className="hr-art-frame">
                <Image src="/images/generated/creative-chrome-figure.jpg" alt={t.imageAlt} fill priority sizes="(max-width: 760px) 90vw, 48vw" className="hr-art-image" />
                <div className="hr-art-shade" aria-hidden="true" />
                <span className="hr-art-index">AO / 001</span>
                <span className="hr-art-caption">FORM FOLLOWS INTENT</span>
                <span className="hr-art-chip"><i /> THINK / MAKE / CONNECT</span>
              </div>
              <span className="hr-art-side">A SYSTEMS-LED PRACTICE</span>
            </div>
          </div>
          <div className="hr-metrics">
            {t.metrics.map(([value, label], i) => <div className="hr-metric" key={label}><strong>{value}</strong><span>{label}</span><i className={"hr-metric-dot hr-dot-" + i} /></div>)}
          </div>
        </div>
      </section>

      <section className="hr-intro">
        <div className="hr-wrap hr-intro-layout">
          <div className="hr-index"><span>01 /</span><span>{t.point}</span></div>
          <div className="hr-intro-main">
            <h2 className="hr-display">{t.statement}</h2>
            <div className="hr-intro-foot"><p>{t.statementBody}</p><Link className="hr-line-link" href={localeHref("/about", locale)}>{t.pointLink}<span>↗</span></Link></div>
          </div>
          <div className="hr-mark" aria-hidden="true"><b>A</b><i /><span /></div>
        </div>
      </section>

      <section className="hr-capabilities" id="disciplines">
        <div className="hr-wrap">
          <div className="hr-section-head">
            <div><p className="hr-eyebrow"><span>02</span> {t.capabilityLabel}</p><h2 className="hr-display">{t.capabilityTitle}</h2></div>
            <p className="hr-section-summary">{t.capabilityBody}</p>
          </div>
          <div className="hr-capability-list">
            {t.capabilities.map(([number, title, note, tags, link, href, color]) => (
              <article className={"hr-capability hr-" + color} key={number}>
                <span className="hr-cap-number">{number}</span>
                <div className="hr-cap-title"><i /><h3 className="hr-display">{title}</h3></div>
                <div className="hr-cap-detail"><p>{note}</p><div className="hr-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Link className="hr-line-link" href={localeHref(href, locale)}>{link}<span>↗</span></Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hr-work" id="selected-work">
        <div className="hr-wrap">
          <div className="hr-section-head hr-work-head">
            <div><p className="hr-eyebrow"><span>03</span> {t.workLabel}</p><h2 className="hr-display">{t.workTitle}</h2></div>
            <div className="hr-work-aside"><p className="hr-section-summary">{t.workBody}</p><Link className="hr-line-link" href={localeHref("/work", locale)}>{t.allWork}<span>↗</span></Link></div>
          </div>
          <div className="hr-project-grid">
            {projectCards.map((project, i) => <article className={"hr-project " + (project.large ? "hr-project-large" : "")} key={project.slug}>
              <Link className="hr-project-image" href={localeHref(i === 2 ? "/work/development" : "/case-studies/" + project.slug, locale)}>
                <Image src={project.image} alt={project.title} fill sizes={project.large ? "(max-width: 760px) 100vw, 60vw" : "(max-width: 760px) 100vw, 36vw"} />
                <span className="hr-image-label">0{i + 1} / {i === 0 ? "IDENTITY SYSTEM" : i === 1 ? "BRAND IN USE" : "OPERATIONS"}</span><span className="hr-image-open">↗</span>
              </Link>
              <div className="hr-project-copy"><div><p className={"hr-project-type hr-type-" + (i === 0 ? "mint" : i === 1 ? "rose" : "cyan")}>{project.type}</p><h3 className="hr-display">{project.title}</h3><p>{project.summary}</p></div><span className="hr-year">{project.year}</span></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="hr-method">
        <div className="hr-wrap">
          <div className="hr-method-head"><div><p className="hr-eyebrow"><span>04</span> {t.methodLabel}</p><h2 className="hr-display">{t.methodTitle}</h2></div><p className="hr-section-summary">{t.methodBody}</p></div>
          <div className="hr-method-rail">{t.steps.map(([number, title, body], i) => <article className="hr-step" key={number}><div><span>{number}</span><i className={"hr-step-dot hr-step-" + i} /></div><h3 className="hr-display">{title}</h3><p>{body}</p></article>)}</div>
        </div>
      </section>

      <section className="hr-lab" id="lab">
        <div className="hr-wrap hr-lab-layout">
          <div className="hr-lab-intro"><p className="hr-eyebrow"><span>05</span> {t.labLabel}</p><h2 className="hr-display">{t.labTitle}</h2><p>{t.labBody}</p><Link className="hr-line-link" href={localeHref("/labs", locale)}>{t.labLink}<span>↗</span></Link></div>
          <div className="hr-lab-list">{t.labItems.map(([color, title, body], i) => <article className={"hr-lab-item hr-" + color} key={title}><span className="hr-lab-number">0{i + 1}</span><i /><div><h3>{title}</h3><p>{body}</p></div><span className="hr-lab-arrow">↗</span></article>)}</div>
        </div>
      </section>

      <section className="hr-close">
        <div className="hr-wrap"><div className="hr-close-panel">
          <div className="hr-close-orbit" aria-hidden="true"><i /><b /><span /></div>
          <p className="hr-eyebrow"><span>06</span> {t.closeEyebrow}</p>
          <h2 className="hr-display">{t.closeTitle}</h2>
          <div className="hr-close-bottom"><p>{t.closeBody}</p><Link className="hr-button" href={localeHref("/contact", locale)}>{t.closeAction}<span>↗</span></Link></div>
        </div><div className="hr-endline"><span>{t.closeNote}</span><span>© 2026 ABOALAZM OS</span></div></div>
      </section>
    </main>
  );
}
