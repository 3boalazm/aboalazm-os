import type { ProductCaseProps } from "./product-case";

export const OVERVIEW_TECHNICAL_CASES: Readonly<Record<string, ProductCaseProps>> = {
  /* ── AHMED KAMAR ────────────────────────────────────────────────── */
  "ahmed-kamar": {
    track: "development",
    accent: "amber",
    fileNo: "AK-01",
    code: "DATA-PORTFOLIO",
    eyebrow: "NEXT.JS · BILINGUAL AR/EN · DATA STORYTELLING",
    wordmark: "Ahmed Kamar",
    heroLead:
      "A bilingual AR/EN executive portfolio engineered for a restaurant, retail, and delivery-platform Data Analyst—framing SQL modeling depth and NDA-safe operational scope.",
    heroLeadAr:
      "منصة تنفيذية ثنائية اللغة لملف أعمال محلل بيانات متخصص في قطاع المطاعم والتجزئة ومنصات التوصيل، تعرض العمق التقني في SQL ونمذجة البيانات ضمن حدود اتفاقيات السرية.",
    badges: [
      { en: "Next.js", ar: "Next.js" },
      { en: "Bilingual AR/EN", ar: "ثنائي اللغة عربي/إنجليزي" },
      { en: "Light & Dark Theme", ar: "وضع فاتح وداكن" },
      { en: "Live Production", ar: "منشور فعليًا" },
    ],
    snapshotTitle: { en: "System snapshot", ar: "ملخص البنية" },
    snapshotCode: "LIVE · VERCEL",
    snapshot: [
      { label: "Catalog items analyzed", labelAr: "عنصر وقائمة محللة", value: "350+" },
      { label: "Organizations served", labelAr: "جهات عمل", value: "3" },
      { label: "Locales supported", labelAr: "لغات مدعومة", value: "AR/EN" },
      { label: "Theme modes", labelAr: "أنماط العرض", value: "2" },
    ],
    snapshotNote:
      "Scope figures reflect summary-level operational work (including HungerStation) while keeping client-level rows under NDA.",
    snapshotNoteAr:
      "تعكس الأرقام نطاق الخبرة الفعلية (بما يشمل HungerStation) مع إبقاء البيانات التفصيلية للعملاء محمية باتفاقيات عدم الإفصاح.",
    role: { en: "Product Design & Frontend Engineering", ar: "تصميم الواجهة والتطوير الأمامي" },
    domain: { en: "Analytics Career Platform", ar: "منصة مهنية لتحليل البيانات" },
    year: "2026",
    cover: {
      src: "/images/work/dev-cards/ahmed-kamar-card.jpg",
      alt: "Ahmed Kamar Data Analyst portfolio hero screen",
      altAr: "واجهة موقع محلل البيانات أحمد قمر",
      caption: "Grid-lined datasheet surface, floating pill nav, AR/EN + theme controls, and NDA-safe scope strip",
      captionAr: "واجهة شبكية مستوحاة من دفاتر البيانات مع شريط تنقل عائم وتبديل فوري للغة والمظهر",
      tag: "LIVE INTERFACE",
    },
    cta: {
      href: "https://ahmed-kamar-portfolio.vercel.app/",
      en: "Open live site",
      ar: "افتح الموقع المباشر",
    },
    challenge: {
      title: "Show SQL and schema rigor without violating client NDAs.",
      titleAr: "إبراز القوة التقنية في SQL ونمذجة البيانات دون كشف بيانات العملاء السرية.",
      paragraphs: [
        "Data analysts working inside delivery platforms and multi-branch F&B groups cannot publish raw company tables or proprietary dashboards—yet plain bullet-point CVs fail to prove real query and database-modeling depth.",
        "The interface solves this structurally: it pairs a clean graph-grid editorial aesthetic and explicit SQL framing (`SELECT answers FROM data WHERE teams_can_act = TRUE;`) with clearly labeled summary-level metrics, dual hiring/work entry paths, and native Arabic/English support for Egypt, Gulf, and remote teams.",
      ],
      paragraphsAr: [
        "لا يستطيع محلل البيانات العامل في منصات التوصيل وقطاع المطاعم نشر جداول الشركات الحقيقية بسبب اتفاقيات السرية (NDA)، وفي المقابل لا تكفي السيرة الذاتية النصية لإثبات التمكن في نمذجة قواعد البيانات واستعلامات SQL المتقدمة.",
        "يعالج التصميم هذه المعادلة عبر واجهة شبكية دقيقة تضع المنهجية التحليلية في الواجهة، وتفصل بوضوح بين الأرقام الإجمالية المسموح بنشرها وبين التفاصيل المحمية، مع دعم كامل للغتين العربية والإنجليزية لمخاطبة فرق التوظيف في مصر والخليج.",
      ],
      callout:
        "Explicitly annotating 'Summary-level figures — client details stay under NDA' right above the KPI strip turns a constraint into a trust signal.",
      calloutAr:
        "التنويه الصريح بأن المؤشرات إجمالية وأن تفاصيل العملاء محمية تحت NDA يحوّل القيد القانوني إلى نقطة ثقة مهنية.",
    },
    system: {
      kicker: "Interface architecture",
      kickerAr: "معمارية الواجهة",
      title: "Four focused sections built for fast technical screening.",
      titleAr: "أربعة أقسام مركزة تخدم الفحص التقني السريع.",
      aside: "Navigation stays anchored in a compact floating pill with instant locale (`ع`) and theme switches.",
      asideAr: "شريط تنقل علوي مدمج يتيح القفز المباشر للأقسام وتبديل اللغة والوضع اللوني دون إعادة تحميل مربكة.",
      modules: [
        {
          no: "01",
          name: "Above-the-Fold Positioning & Fast Lanes",
          nameAr: "شاشة الانطباع الأول والمسارات السريعة",
          tech: "Hero · Availability Pill · CV / GitHub CTAs",
          detail:
            "Surfaces location/remote readiness, current HungerStation Data Analyst role, advanced SQL badge, and direct jump links ('For hiring teams' and 'Selected work').",
          detailAr:
            "تعرض جاهزية التعاقد (مصر / الخليج / عن بُعد)، الدور الحالي في HungerStation، شارة إتقان SQL، وأزرار تحميل السيرة الذاتية وGitHub.",
        },
        {
          no: "02",
          name: "NDA-Safe Scope & Selected Work",
          nameAr: "نطاق الخبرة والأعمال المختارة",
          tech: "Structured Case Summaries · KPI Strip",
          detail:
            "Quantifies operational exposure (350+ menu & catalog items, 3 organizations) and breaks down analytical problems, query/modeling logic, and actionable team outputs.",
          detailAr:
            "توثّق حجم القوائم والأصناف المحللة وتعرض دراسات الحالة وفق تسلسل: المشكلة التشغيلية ← النمذجة والاستعلام ← القرار العملي.",
        },
        {
          no: "03",
          name: "Skills & Relational Modeling Depth",
          nameAr: "المهارات وبناء قواعد البيانات",
          tech: "SQL · Schema Design · Reporting",
          detail:
            "Separates foundational database schema design (backed by graduation database engineering work) from analytical querying, cleaning, and visualization.",
          detailAr:
            "تفصل بوضوح بين التأسيس الهندسي في تصميم قواعد البيانات العلائقية وبين مهارات التحليل والتنظيف وبناء التقارير.",
        },
        {
          no: "04",
          name: "Bilingual RTL/LTR & Dual-Theme Shell",
          nameAr: "محرك العرض ثنائي اللغة والمظهر",
          tech: "Next.js · RTL Mirroring · Semantic Tokens",
          detail:
            "Switches cleanly between LTR English and RTL Arabic while preserving monospace SQL snippets, numeric alignment, and amber highlight contrast.",
          detailAr:
            "يحافظ على اتساق الجداول والأرقام وعبارات SQL عند التبديل بين الإنجليزية والعربية أو بين الوضع الفاتح والداكن.",
        },
      ],
      flow: {
        a: "Raw F&B / Retail Data",
        aSub: "Menus · Catalogs · Orders",
        mid: "SQL & Schema Modeling",
        midSub: "Structured Queries & Validation",
        b: "Actionable Team Decisions",
        bSub: "NDA-Safe Case Proof",
        note: "Portfolio narrative mirrors the analyst's actual day-to-day data pipeline.",
        noteAr: "يعكس تسلسل السرد في الموقع خط العمل الفعلي لمحلل البيانات من البيانات الخام إلى القرار.",
      },
    },
    decisions: {
      title: "Design and engineering choices behind the platform.",
      titleAr: "أهم القرارات التصميمية والهندسية في بناء المنصة.",
      items: [
        {
          n: "D-01",
          title: "Graph-grid canvas instead of dark-neon developer clichés",
          titleAr: "خلفية شبكية هادئة بدلًا من قوالب المبرمجين الصاخبة",
          body: "A light architectural grid with warm amber highlights reads like a clean analytical workbook, keeping dense numbers and headings effortless to scan.",
          bodyAr: "اعتماد شبكة هندسية خفيفة مع تمييز لوني كهرماني يمنح الموقع طابع دفاتر التحليل الدقيقة ويسهّل قراءة الأرقام.",
        },
        {
          n: "D-02",
          title: "SQL syntax as a visual micro-signature",
          titleAr: "توظيف لغة SQL كعنصر بصري دال على التخصص",
          body: "Subtle monospace query lines anchor the analyst's core toolset right above the headline without overwhelming non-technical hiring managers.",
          bodyAr: "استخدام سطر استعلام SQL مختصر أعلى العنوان يرسّخ الهوية التقنية للمحلل دون إرباك القارئ الإداري.",
        },
        {
          n: "D-03",
          title: "Dual entry paths for technical vs HR reviewers",
          titleAr: "مساران متوازيان لمسؤول الموارد البشرية والمدير التقني",
          body: "HR can grab the CV and verify role/location in 10 seconds, while analytics leads jump straight to method, schema depth, and selected work.",
          bodyAr: "يستطيع مسؤول التوظيف تحميل السيرة الذاتية والتحقق من التفرغ فورًا، بينما ينتقل قائد الفريق مباشرة لفحص المنهجية والمشاريع.",
        },
        {
          n: "D-04",
          title: "First-class Arabic RTL parity for Gulf & Egypt roles",
          titleAr: "دعم أصيل للعربية RTL لخدمة سوقي مصر والخليج",
          body: "Built natively for bilingual regional teams rather than relying on browser auto-translate.",
          bodyAr: "بناء النسخة العربية بتايبوجرافيا واتجاه أصيل يناسب الشركات الإقليمية في السعودية والخليج ومصر.",
        },
      ],
    },
    evidence: {
      title: "Observed live features & scope boundaries.",
      titleAr: "الحقائق الموثقة وحدود النطاق.",
      items: [
        { value: "LIVE", label: "Deployed at ahmed-kamar-portfolio.vercel.app", labelAr: "منشور ويعمل على نطاق Vercel الحي", origin: "live" },
        { value: "AR + EN", label: "Bilingual switch + light/dark toggle in header", labelAr: "تبديل فوري للغة والوضع اللوني في الشريط العلوي", origin: "live" },
        { value: "350+", label: "Menu & catalog items scope (NDA-safe summary)", labelAr: "نطاق أصناف وقوائم محللة (ملخص محمي بـ NDA)", origin: "live" },
        { value: "SQL", label: "Core relational modeling & query focus", labelAr: "تركيز أساسي على SQL ونمذجة قواعد البيانات", origin: "live" },
      ],
      notes: [
        "Client-specific commercial numbers remain intentionally summarized under NDA on the live portfolio.",
      ],
      notesAr: [
        "تُعرض مؤشرات المشاريع بشكل إجمالي التزامًا باتفاقيات عدم الإفصاح الخاصة بجهات العمل.",
      ],
    },
    stack: {
      title: "Focused web stack for fast loads and clean typography.",
      titleAr: "بنية ويب خفيفة تضمن سرعة التصفح ووضوح النصوص.",
      items: ["Next.js", "TypeScript", "Bilingual AR/EN", "RTL/LTR Tokens", "Light/Dark Theme", "Vercel"],
      note: "Engineered as a fast, zero-clutter personal platform deployed on Vercel.",
      noteAr: "صُممت المنصة لتفتح بسرعة عالية على الهواتف وأجهزة المكتب مع استضافة مستقرة على Vercel.",
    },
    handoff: {
      title: "Clear analytical proof, ready for hiring teams.",
      titleAr: "حضور مهني واضح وجاهز لفرق التوظيف والبيانات.",
      note: "Inspect the live deployment directly to test the bilingual switcher, theme toggle, and case layout.",
      noteAr: "يمكنك زيارة الموقع الحي مباشرة لتجربة التبديل بين اللغتين والوضعين الفاتح والداكن واستعراض الأقسام.",
    },
  },

  /* ── YOUSSEF GUBA ───────────────────────────────────────────────── */
  "youssef-guba": {
    track: "development",
    accent: "rose",
    fileNo: "YG-01",
    code: "STUDIO-OS",
    eyebrow: "NEXT.JS APP ROUTER · SANITY CMS · AR/EN MIRROR",
    wordmark: "Youssef Guba",
    wordmarkTail: "OS",
    heroLead:
      "A bilingual AR/EN personal studio operating system uniting production Flutter case studies, courses, technical writing, and Sanity CMS publishing across 10 live routes.",
    heroLeadAr:
      "نظام ملف أعمال وتشغيل شخصي ثنائي اللغة يجمع دراسات حالة تطبيقات Flutter، الدورات التعليمية، المقالات التقنية، والنشر الحي عبر Sanity CMS في 10 مسارات متطابقة.",
    badges: [
      { en: "Next.js App Router", ar: "Next.js App Router" },
      { en: "Sanity CMS · ISR", ar: "Sanity CMS · تحديث تلقائي" },
      { en: "10 Mirrored Routes", ar: "10 مسارات عربي/إنجليزي" },
      { en: "Live Production", ar: "منشور فعليًا" },
    ],
    snapshotTitle: { en: "System constellation", ar: "مكونات المنظومة" },
    snapshotCode: "SANITY · LIVE",
    snapshot: [
      { label: "Live mirrored routes", labelAr: "مسارات حية متطابقة", value: "10" },
      { label: "Bilingual parity", labelAr: "تطابق عربي/إنجليزي", value: "AR/EN" },
      { label: "Content engine", labelAr: "محرك إدارة المحتوى", value: "Sanity" },
      { label: "Mobile focus", labelAr: "التخصص الهندسي", value: "Flutter" },
    ],
    snapshotNote:
      "Combines headless Sanity Studio content publishing with ISR revalidation so courses, work, and journal entries update without code deploys.",
    snapshotNoteAr:
      "يربط استوديو Sanity CMS بإعادة التوليد التلقائي (ISR) لتحديث المشاريع والدورات والمقالات فورًا دون إعادة نشر الكود.",
    role: { en: "Platform Architecture & Bilingual UI Engineering", ar: "هندسة المنصة وتصميم وتطوير الواجهة ثنائية اللغة" },
    domain: { en: "Mobile Engineer & Educator OS", ar: "نظام تشغيل شخصي لمهندس ومحاضر تطبيقات" },
    year: "2026",
    cover: {
      src: "/images/work/dev-cards/youssef-guba-card.jpg",
      alt: "Youssef Guba personal portfolio OS interface",
      altAr: "واجهة نظام ملف أعمال المهندس يوسف جوبا",
      caption: "Dark studio surface, YG. pill navigation, System Constellation status cards, and 10-route bilingual architecture",
      captionAr: "واجهة داكنة عالية التباين تعرض حالة النظام ومسارات العمل والدورات والمقالات عبر Sanity CMS",
      tag: "LIVE STUDIO OS",
    },
    cta: {
      href: "https://youssefguba-os.vercel.app/",
      en: "Open live site",
      ar: "افتح الموقع المباشر",
    },
    challenge: {
      title: "Unite client engineering, courses, and writing without static decay.",
      titleAr: "توحيد مشاريع العملاء والدورات والمقالات دون تجمد المحتوى بمرور الوقت.",
      paragraphs: [
        "A mobile product engineer who ships App Store and Google Play apps, teaches developer courses, and publishes technical writing quickly outgrows a hardcoded single-page portfolio.",
        "Youssef Guba OS separates concerns cleanly: Next.js App Router handles fast SSR/ISR rendering and strict RTL/LTR layout mirroring across 10 routes, while Sanity Studio provides structured bilingual schemas for Work, Courses, Media, and Writing.",
      ],
      paragraphsAr: [
        "المهندس الذي يطوّر تطبيقات منشورة على متجري آبل وجوجل ويقدم في الوقت نفسه دورات تدريبية ومقالات تقنية يتجاوز سريعًا حدود صفحة ملف الأعمال الثابتة التقليدية.",
        "يفصل النظام بين طبقة العرض وطبقة المحتوى بوضوح: يتولى Next.js App Router سرعة الأداء والتطابق الكامل بين العربية RTL والإنجليزية LTR عبر 10 مسارات، بينما يدير Sanity Studio بيانات المشاريع والدورات والمقالات بحقول منظمة.",
      ],
      callout:
        "Publishing a new Flutter article or course module happens in Sanity Studio and revalidates via ISR—zero code edits required.",
      calloutAr:
        "نشر مقال تقني جديد أو تحديث دورة تدريبية يتم مباشرة من لوحة Sanity وينعكس تلقائيًا عبر ISR دون تعديل سطر كود واحد.",
    },
    system: {
      kicker: "Platform architecture",
      kickerAr: "البنية المعمارية",
      title: "Headless Sanity content engine + 10 bilingual Next.js routes.",
      titleAr: "محرك محتوى Sanity مرن يغذي 10 مسارات ثنائية اللغة.",
      aside: "Every route preserves full RTL Arabic and LTR English typographic parity.",
      asideAr: "كل مسار من المسارات العشرة يعمل بتكافؤ كامل في الخطوط والاتجاه بين العربية والإنجليزية.",
      modules: [
        {
          no: "01",
          name: "Headless Sanity Studio & ISR Pipeline",
          nameAr: "استوديو Sanity وتحديث الصفحات التلقائي",
          tech: "Sanity CMS · GROQ · Next.js ISR",
          detail:
            "Structured schemas store bilingual project case studies, course curricula, media links, and technical essays with incremental revalidation.",
          detailAr:
            "نماذج بيانات منظمة تحفظ دراسات الحالة والدورات والمقالات باللغتين مع تحديث تفاضلي سريع للصفحات الحية.",
        },
        {
          no: "02",
          name: "Mobile Architecture Proof Layer",
          nameAr: "عرض معمارية تطبيقات Flutter الإنتاجية",
          tech: "Work · Services · Start a Project",
          detail:
            "Highlights clean Flutter architecture, modular state management, and offline-capable apps shipped to App Store and Google Play, routing leads into a structured intake flow.",
          detailAr:
            "تبرز الخبرة في بناء تطبيقات Flutter المعيارية القابلة للعمل بدون إنترنت والمنشورة على المتاجر الرسمية، مع مسار واضح لبدء مشروع جديد.",
        },
        {
          no: "03",
          name: "Courses & Technical Journal",
          nameAr: "منظومة الدورات والمدونة التقنية",
          tech: "Courses · Writing · Media",
          detail:
            "Dedicated routes for developer education and long-form engineering articles, formatted for distraction-free bilingual reading.",
          detailAr:
            "مسارات مستقلة لعرض الدورات التدريبية والمقالات الهندسية المطوّلة بتنسيق مريح للقراءة بالعربية والإنجليزية.",
        },
        {
          no: "04",
          name: "RTL + LTR Mirror Design System",
          nameAr: "نظام التصميم المتطابق (RTL + LTR)",
          tech: "Logical CSS · Native Bilingual Typography",
          detail:
            "Logical spacing, mirrored navigation pills, and high-contrast dark tokens keep Arabic and English layouts visually balanced on mobile and desktop.",
          detailAr:
            "استخدام الخصائص المنطقية للاتجاه وتدرجات لونية داكنة عالية التباين لضمان توازن المظهر على كافة الشاشات.",
        },
      ],
      flow: {
        a: "Sanity Studio",
        aSub: "Bilingual Schemas (AR/EN)",
        mid: "Next.js App Router",
        midSub: "ISR Revalidation · 10 Routes",
        b: "Unified Studio OS",
        bSub: "Work · Courses · Writing · Leads",
        note: "Single headless source of truth serving portfolio proof, educational products, and client intake.",
        noteAr: "مصدر بيانات مركزي واحد يغذي معرض الأعمال والدورات والمقالات ونموذج طلب المشاريع.",
      },
    },
    decisions: {
      title: "Architectural choices that keep the platform maintainable.",
      titleAr: "القرارات الهندسية التي تضمن استدامة المنصة وسهولة إدارتها.",
      items: [
        {
          n: "D-01",
          title: "Headless CMS over MDX git-commits for active publishing",
          titleAr: "اعتماد Sanity CMS بدلًا من الملفات النصية داخل الكود",
          body: "When courses, media, and articles update frequently in two languages, a visual studio with typed fields removes deployment friction.",
          bodyAr: "عند تحديث الدورات والمقالات باستمرار بلغتين، توفّر لوحة التحكم المرئية سرعة وانضباطًا أعلى بكثير من تحرير ملفات الكود.",
        },
        {
          n: "D-02",
          title: "Explicit route separation per audience intent",
          titleAr: "فصل المسارات حسب هدف كل زائر",
          body: "Separating Work/Services from Courses/Writing lets B2B app founders evaluate hiring quickly while giving students a dedicated learning hub.",
          bodyAr: "فصل صفحات الخدمات والأعمال عن الدورات والمقالات يمنح العملاء مسار تعاقد مباشرًا ويمنح الطلاب مساحة تعليمية واضحة.",
        },
        {
          n: "D-03",
          title: "System Constellation hero card instead of decorative graphics",
          titleAr: "بطاقة حالة معمارية في الواجهة بدلًا من الزخارف الشكلية",
          body: "Immediately communicates mobile stack, CMS live status, and 10-route RTL/LTR parity in structured engineering language.",
          bodyAr: "توضّح منذ النظرة الأولى تخصص الموبايل وحالة ربط نظام المحتوى وتطابق اللغتين بأسلوب هندسي منظم.",
        },
        {
          n: "D-04",
          title: "Dark obsidian + coral-orange contrast hierarchy",
          titleAr: "تباين لوني داكن مع البرتقالي المرجاني لإبراز الإجراءات",
          body: "Reserves high-saturation orange strictly for primary CTAs and key structural callouts so action paths stand out clearly.",
          bodyAr: "قصر اللون البرتقالي الساطع على أزرار الفعل الأساسية والعناوين المحورية لتوجيه عين الزائر بوضوح.",
        },
      ],
    },
    evidence: {
      title: "Verified live deployment characteristics.",
      titleAr: "خصائص النشر الحي الموثقة.",
      items: [
        { value: "LIVE", label: "Deployed at youssefguba-os.vercel.app", labelAr: "منشور ويعمل على النطاق الحي", origin: "live" },
        { value: "10", label: "Live routes across Work, Courses, Media, Writing & Start", labelAr: "10 مسارات حية للأعمال والدورات والمقالات والتواصل", origin: "live" },
        { value: "SANITY", label: "Headless studio CMS + ISR revalidation", labelAr: "نظام إدارة محتوى Sanity مع تحديث تلقائي", origin: "live" },
        { value: "RTL+LTR", label: "Mirrored Arabic & English layout parity", labelAr: "تطابق تام في الاتجاه والخطوط بين العربية والإنجليزية", origin: "live" },
      ],
      notes: [
        "All route counts, stack details, and bilingual capabilities are directly observable on the live production deployment.",
      ],
      notesAr: [
        "جميع مسارات المنصة وتفاصيل البنية التقنية ودعم اللغتين متاحة للمعاينة الفعلية على الرابط المباشر.",
      ],
    },
    stack: {
      title: "Headless publishing + modern React server rendering.",
      titleAr: "دمج إدارة المحتوى المرنة مع سرعة Next.js الحديثة.",
      items: ["Next.js App Router", "TypeScript", "Sanity CMS", "ISR Revalidation", "Bilingual RTL/LTR", "Vercel"],
      note: "Built for long-term autonomous content management without code intervention.",
      noteAr: "مصمم ليديره صاحب المنصة باستقلالية كاملة على المدى الطويل دون تدخل برمجي يومي.",
    },
    handoff: {
      title: "A personal studio OS built to ship and publish.",
      titleAr: "نظام تشغيل شخصي متكامل لعرض المنتجات ونشر المعرفة.",
      note: "Visit the live site to explore the 10 bilingual routes across Work, Courses, and Writing.",
      noteAr: "تفضّل بزيارة الموقع المباشر لاستكشاف المسارات العشرة باللغتين العربية والإنجليزية.",
    },
  },

  /* ── EGYPT SEG FIELD CAMP (ESFC) ────────────────────────────────── */
  esfc: {
    track: "design",
    accent: "amber",
    fileNo: "ID-06",
    code: "ESFC-2020",
    eyebrow: "EVENT IDENTITY · FIELD PRINT SYSTEM · APPAREL",
    wordmark: "ESFC",
    wordmarkTail: "Field Camp",
    heroLead:
      "An event identity and outdoor print system engineered for Egypt SEG Field Camp—unifying student recruitment campaigns, field manuals, ID badges, and desert camp apparel.",
    heroLeadAr:
      "هوية بصرية ومنظومة مطبوعات ميدانية لمخيم SEG مصر لعلوم الأرض، توحّد حملات استقطاب الطلاب والأدلة الجيولوجية المطبوعة وشارات التعريف وملابس المعسكر.",
    badges: [
      { en: "Event Identity", ar: "هوية فعالية" },
      { en: "Field Print Specs", ar: "مطبوعات ميدانية" },
      { en: "Apparel & Badges", ar: "ملابس وشارات" },
      { en: "2020 Edition", ar: "دورة 2020" },
    ],
    snapshotTitle: { en: "System scope", ar: "نطاق النظام" },
    snapshotCode: "PRINT + DIGITAL",
    snapshot: [
      { label: "Delivery tracks", labelAr: "مسارات التسليم", value: "3" },
      { label: "Primary accent", labelAr: "اللون المحوري", value: "#FFC83C" },
      { label: "Secondary ochre", labelAr: "اللون المساند", value: "#E07A22" },
      { label: "Camp cycle", labelAr: "سنة الدورة", value: "2020" },
    ],
    snapshotNote:
      "Covers digital outreach, on-site printed field guides/badges, and wearable camp merchandise under one visual grid.",
    snapshotNoteAr:
      "يغطي الحملة الرقمية، المطبوعات والشارات الميدانية، وملابس المشاركين ضمن شبكة بصرية واحدة.",
    role: { en: "Brand & Print System Designer", ar: "مصمم الهوية ونظام المطبوعات" },
    domain: { en: "Geoscience Field Camp", ar: "معسكر تدريبي لعلوم الأرض" },
    year: "2020",
    cover: {
      src: "/images/work/esfc.jpg",
      alt: "Egypt SEG Field Camp desert geological survey context",
      altAr: "بيئة العمل الجيولوجي الميداني لمخيم SEG مصر",
      caption: "Desert outcrop field environment that informed ESFC's high-contrast amber, ochre, and dark-slate visual system",
      captionAr: "بيئة المسح الجيولوجي الصحراوي التي بُنيت عليها ألوان وتباينات هوية المعسكر الميداني",
      tag: "FIELD CONTEXT",
    },
    cta: {
      href: "https://www.behance.net/aboalazm",
      en: "External portfolio",
      ar: "ملف الأعمال الخارجي",
    },
    challenge: {
      title: "Design one system that works on mobile feeds and under desert sun.",
      titleAr: "بناء نظام بصري يعمل بنفس الوضوح على شاشات الهواتف وتحت شمس الصحراء.",
      paragraphs: [
        "Academic field camps span two very different environments: digital university channels where students decide whether to apply, and rugged outdoor geological survey sites where printed manuals, lanyards, and apparel are used in bright sunlight.",
        "The ESFC system bridged both by pairing a bold strata-inspired mark with high-contrast amber-gold (#FFC83C) and deep slate surfaces, structured print grids for field guides and role badges, and modular campaign templates for student volunteers.",
      ],
      paragraphsAr: [
        "يمر المعسكر العلمي ببيئتين مختلفتين تمامًا: منصات التواصل الجامعية حيث يتعرف الطلاب على البرنامج ويتقدمون له، والموقع الجيولوجي المفتوح حيث تُستخدم الكتيبات والشارات والملابس تحت إضاءة النهار القوية.",
        "ربط النظام بين البيئتين عبر علامة بصرية جريئة ولوحة ألوان كهرمانية عالية التباين على أرضيات داكنة، مع شبكات طباعة واضحة للأدلة الميدانية وبطاقات الصلاحيات وقوالب نشر سريعة لفريق المتطوعين.",
      ],
      callout:
        "High-luminance amber on dark slate preserves badge and cover legibility outdoors while standing out immediately in crowded student feeds.",
      calloutAr:
        "التباين العالي بين الأصفر الكهرماني والرمادي الصخري الداكن يحفظ مقروئية الشارات والمطبوعات ميدانيًا ويمنح الإعلانات حضورًا فوريًا.",
    },
    system: {
      kicker: "Deliverable architecture",
      kickerAr: "بنية المخرجات",
      title: "Four coordinated layers from announcement to field site.",
      titleAr: "أربع طبقات مترابطة من إعلان التقديم وحتى أرض المعسكر.",
      aside: "Designed for fast execution by student organizing committees and local print shops.",
      asideAr: "مصمم لسهولة التنفيذ عبر اللجان الطلابية والمطابع المحلية دون أخطاء إنتاجية.",
      modules: [
        {
          no: "01",
          name: "Event Mark & Lockup Rules",
          nameAr: "شعار الفعالية وقواعد التموضع",
          tech: "ESFC Monogram · Full Title Lockup",
          detail:
            "Compact ESFC badge lockup engineered to stay sharp on small lanyard cards, embroidered caps, T-shirt chests, and social avatars.",
          detailAr:
            "تكوين متماسك لشعار ESFC يحافظ على وضوحه على البطاقات المعلقة والقبعات والتيشيرتات وصور الحسابات الرقمية.",
        },
        {
          no: "02",
          name: "Recruitment & Schedule Campaign Grid",
          nameAr: "شبكة قوالب حملة الاستقطاب والجداول",
          tech: "Social Cards · Speaker/Mentor Plates",
          detail:
            "Modular post layouts for application calls, technical session topics, field mentors, and countdown announcements.",
          detailAr:
            "قوالب منظمة لإعلانات فتح التقديم، محاور التدريب الجيوفيزيائي، بطاقات المحاضرين، والعد التنازلي.",
        },
        {
          no: "03",
          name: "Field Print & Role Identification",
          nameAr: "المطبوعات الميدانية وبطاقات الأدوار",
          tech: "Field Manuals · ID Badges · Certificates",
          detail:
            "Print-ready layouts for geological field notebooks, color-coded participant/organizer badges, sponsor banners, and completion certificates.",
          detailAr:
            "تصاميم جاهزة للطباعة تشمل أدلة العمل الميداني، بطاقات التعريف المقسمة حسب الدور، لافتات الرعاة، وشهادات الختام.",
        },
        {
          no: "04",
          name: "Camp Apparel & Merchandise",
          nameAr: "ملابس ومقتنيات المعسكر",
          tech: "Screen-Print Safe Palette · Apparel Graphics",
          detail:
            "Limited-ink spot-color friendly artwork for camp T-shirts, caps, and stickers so screen printing stays crisp and budget-friendly.",
          detailAr:
            "تجهيز الرسومات بعدد ألوان مدروس يناسب طباعة السلك سكرين على الملابس والملصقات بجودة عالية وتكلفة منضبطة.",
        },
      ],
      flow: {
        a: "Digital Campaign",
        aSub: "Applicant & Sponsor Templates",
        mid: "Print Pre-Press",
        midSub: "Guides · Badges · Banners",
        b: "Field Deployment",
        bSub: "Apparel & On-Site Signage",
        note: "Consistent color and typographic hierarchy across RGB screens, CMYK print, and screen-printed fabric.",
        noteAr: "ثبات الهوية والتسلسل البصري عبر الشاشات الرقمية ومطبوعات الأوفست والطباعة على الأقمشة.",
      },
    },
    decisions: {
      title: "Production decisions tailored to a student field event.",
      titleAr: "قرارات تنفيذية تلائم طبيعة المعسكرات الطلابية الميدانية.",
      items: [
        {
          n: "S-01",
          title: "Strata-inspired amber & ochre palette (#FFC83C / #E07A22)",
          titleAr: "لوحة ألوان مستمدة من الطبقات الصخرية والبيئة الصحراوية",
          body: "Grounded the visual identity in geoscience terrain rather than generic academic blue crests.",
          bodyAr: "ربط الهوية بصريًا بطبيعة علوم الأرض والصحراء بدلًا من الشعارات الجامعية الزرقاء التقليدية.",
        },
        {
          n: "S-02",
          title: "Spot-color friendly apparel graphics",
          titleAr: "مراعاة تقنيات الطباعة الاقتصادية على الملابس",
          body: "Avoided fragile photographic gradients on merch so local screen printers could reproduce sharp chest and back prints.",
          bodyAr: "تجنب التدرجات المعقدة على التيشيرتات لضمان خروج طباعة نظيفة وحادة لدى المطابع المحلية.",
        },
        {
          n: "S-03",
          title: "Clear sponsor integration bands",
          titleAr: "تخصيص نطاقات واضحة لشعارات الرعاة",
          body: "Reserved clean footer/header strips on banners and booklets so partner logos never collided with event typography.",
          bodyAr: "تحديد مساحات ثابتة ومنظمة لشعارات الشركات والجهات الراعية دون المساس بوضوح عنوان الفعالية.",
        },
        {
          n: "S-04",
          title: "Template simplicity for rapid camp-week updates",
          titleAr: "بساطة القوالب لتسريع النشر اليومي أثناء المعسكر",
          body: "Allowed student media volunteers to publish daily field recaps without needing advanced layout adjustments.",
          bodyAr: "تمكين المتطوعين من نشر ملخصات وصور كل يوم تدريبي بسرعة وسهولة.",
        },
      ],
    },
    evidence: {
      title: "Documented archive scope & boundaries.",
      titleAr: "توثيق النطاق وحدود الأرشيف.",
      items: [
        { value: "2020", label: "Egypt SEG Field Camp annual cycle", labelAr: "دورة مخيم SEG مصر الميداني لعام 2020", origin: "declared" },
        { value: "3 TRACKS", label: "Identity, Print Collateral & Event Media", labelAr: "الهوية البصرية والمطبوعات والتغطية الرقمية", origin: "declared" },
        { value: "CMYK+RGB", label: "Coordinated print, apparel & social specs", labelAr: "مواصفات متوافقة للمطبوعات والملابس والشاشات", origin: "declared" },
        { value: "HONESTY", label: "Unverified registration counts omitted", labelAr: "عدم إدراج أي أرقام تسجيل غير موثقة أوليًا", origin: "repo" },
      ],
      notes: [
        "This 2020 archive record summarizes the delivered identity, print, and event system; primary registration telemetry is not published without archived event logs.",
      ],
      notesAr: [
        "يوثّق هذا الملف نطاق نظام الهوية والمطبوعات المسلّم لدورة 2020 دون نشر إحصاءات تسجيل غير مدعومة بسجلات أولية.",
      ],
    },
    stack: {
      title: "Identity, print pre-press, and campaign production.",
      titleAr: "أدوات بناء الهوية وتجهيز المطبوعات والحملات.",
      items: ["Brand Identity", "Print Pre-Press", "Event Signage", "Badge Systems", "Apparel Graphics", "Campaign Templates"],
      note: "Built for cohesive student execution across digital announcements and desert field gear.",
      noteAr: "منظومة متكاملة تربط النشر الرقمي بالمطبوعات والتجهيزات الميدانية.",
    },
    handoff: {
      title: "One field-ready identity from recruitment to camp wrap.",
      titleAr: "هوية ميدانية موحّدة من أول إعلان وحتى ختام المعسكر.",
      note: "Need an event, conference, or institutional identity system? Reach out via the project enquiry below.",
      noteAr: "هل تخطط لفعالية أو مؤتمر أو برنامج تدريبي يحتاج نظام هوية ومطبوعات منضبطًا؟ تواصل معنا مباشرة بالأسفل.",
    },
  },

  /* ── LEARN IN ARABIC ────────────────────────────────────────────── */
  "learn-in-arabic": {
    track: "design",
    accent: "cyan",
    fileNo: "ID-07",
    code: "LIA-STUDIO",
    eyebrow: "ARABIC IDENTITY · PHYSICAL DIY STUDIO · MOTION SYSTEM",
    wordmark: "Learn in Arabic",
    heroLead:
      "An Arabic-first educational brand system paired with a physical DIY filming studio built from scratch and a motion graphics kit for consistent technical video production.",
    heroLeadAr:
      "منظومة هوية تعليمية عربية متكاملة مقترنة بتجهيز استوديو تصوير فعلي من الصفر وحزمة موشن جرافيك لإنتاج دروس تقنية واضحة ومتسقة.",
    badges: [
      { en: "Arabic Typography", ar: "تايبوجرافيا عربية" },
      { en: "DIY Studio Build", ar: "بناء استوديو تصوير" },
      { en: "Motion Package", ar: "حزمة موشن جرافيك" },
      { en: "2020–2021", ar: "2020–2021" },
    ],
    snapshotTitle: { en: "Production architecture", ar: "مكونات منظومة الإنتاج" },
    snapshotCode: "BRAND + SET + MOTION",
    snapshot: [
      { label: "Integrated pillars", labelAr: "ركائز متكاملة", value: "3" },
      { label: "Primary script", labelAr: "اللغة الأساسية", value: "AR" },
      { label: "Studio build", labelAr: "تجهيز الاستوديو", value: "0 → 1" },
      { label: "Program cycle", labelAr: "فترة التنفيذ", value: "20–21" },
    ],
    snapshotNote:
      "Designed so on-camera physical lighting/backdrop colors match digital motion overlays and social lesson cards.",
    snapshotNoteAr:
      "صُممت إضاءة وخلفية الاستوديو الفعلي لتتطابق لونيًا وبصريًا مع قوالب الموشن جرافيك وبطاقات الدروس.",
    role: { en: "Identity Designer, Studio Builder & Motion Lead", ar: "مصمم الهوية ومنفّذ الاستوديو والموشن جرافيك" },
    domain: { en: "Arabic Technical Education (MSP)", ar: "مبادرة تعليم تقني باللغة العربية" },
    year: "2020–21",
    cover: {
      src: "/images/work/learn-in-arabic.jpg",
      alt: "Learn in Arabic typographic and educational study materials",
      altAr: "مواد وهوية مبادرة تعلّم بالعربي",
      caption: "Clear, modern Arabic typographic sensibility built to make technical learning approachable and structured",
      captionAr: "معالجة بصرية وتايبوجرافية واضحة تجعل التعلّم التقني باللغة العربية عصريًا ومرتبًا",
      tag: "ARABIC-FIRST SYSTEM",
    },
    cta: {
      href: "https://www.behance.net/aboalazm",
      en: "External portfolio",
      ar: "ملف الأعمال الخارجي",
    },
    challenge: {
      title: "A logo alone cannot fix inconsistent educational video production.",
      titleAr: "الشعار وحده لا يكفي لضبط جودة المحتوى المرئي التعليمي.",
      paragraphs: [
        "When volunteer instructors record technical tutorials in separate bedrooms with mismatched lighting, backgrounds, and slide styles, even a strong logo stuck in the corner cannot make the channel look trustworthy.",
        "Learn in Arabic treated the brand, the physical room, and the editing timeline as one system: designing a bold Arabic typographic mark, building a budget-conscious DIY recording set from zero, and packaging reusable motion templates.",
      ],
      paragraphsAr: [
        "عندما يسجّل المحاضرون دروسًا تقنية في أماكن متفرقة بإضاءة وخلفيات وعروض غير متناسقة، فلن ينجح مجرد وضع شعار في زاوية الشاشة في منح القناة مظهرًا احترافيًا موثوقًا.",
        "لذلك تعامل المشروع مع الهوية ومكان التصوير وخط المونتاج كنظام واحد: علامة تايبوجرافية عربية واضحة، استوديو تصوير فعلي جُهّز من الصفر بتكلفة اقتصادية ذكية، وحزمة قوالب تحريك جاهزة للحلقات.",
      ],
      callout:
        "Matching physical set lighting and backdrop hues directly to the #60A5FA / #2563EB digital palette eliminated jarring transitions between talking-head shots and motion slides.",
      calloutAr:
        "مواءمة ألوان خلفية وإضاءة الاستوديو الفعلي مع اللوحة اللونية الرقمية حققت انتقالًا بصريًا سلسًا بين كادر المحاضر وشرائح الشرح المتحركة.",
    },
    system: {
      kicker: "System components",
      kickerAr: "مكونات النظام",
      title: "Identity, physical set, motion kit, and publishing grid.",
      titleAr: "الهوية، استوديو التصوير، حزمة التحريك، وقوالب النشر.",
      aside: "Built inside an MSP community learning initiative across 2020–2021.",
      asideAr: "نُفّذ النظام لصالح مبادرة تعليمية مجتمعية خلال دورة 2020–2021.",
      modules: [
        {
          no: "01",
          name: "Arabic-First Typographic Mark & Palette",
          nameAr: "العلامة التايبوجرافية العربية ونظام الألوان",
          tech: "Custom Arabic Lockup · #60A5FA / #2563EB",
          detail:
            "Constructed around clear Arabic letterforms paired with a crisp blue technical palette that reads cleanly on mobile thumbnails.",
          detailAr:
            "بناء بصري يرتكز على وضوح الحرف العربي مع تدرجات زرقاء عصرية تمنح أغلفة الدروس مقروئية فورية على الهاتف.",
        },
        {
          no: "02",
          name: "DIY Physical Recording Studio Build",
          nameAr: "تجهيز استوديو التصوير الفعلي من الصفر",
          tech: "Set Backdrop · Key/Fill Lighting · Framing Rules",
          detail:
            "Engineered a repeatable physical filming corner from scratch—fixing camera framing, acoustic treatment basics, and color-coordinated background elements.",
          detailAr:
            "إنشاء مساحة تصوير ثابتة من الصفر تشمل ضبط الخلفية وتوزيع الإضاءة وزاوية الكاميرا لتوحيد مظهر جميع المحاضرين.",
        },
        {
          no: "03",
          name: "Episode Motion Graphics Package",
          nameAr: "حزمة الموشن جرافيك للحلقات",
          tech: "Intro Sting · Lower-Thirds · Concept Callouts",
          detail:
            "Modular animated openers, speaker nameplates, chapter dividers, and term-definition overlays so editors cut episodes rapidly.",
          detailAr:
            "عناصر متحركة جاهزة تشمل مقدمة الحلقات، شريط تعريف المحاضر، فواصل المحاور، وبطاقات إبراز المصطلحات التقنية.",
        },
        {
          no: "04",
          name: "Social Carousel & Thumbnail System",
          nameAr: "قوالب أغلفة الحلقات والملخصات التعليمية",
          tech: "YouTube/Social Thumbnails · Summary Cards",
          detail:
            "Structured title grids separating track name, episode number, and lesson topic for instant learner scanning.",
          detailAr:
            "شبكة تصميم تفصل بوضوح بين اسم المسار ورقم الحلقة وعنوان الدرس لتسهيل التصفح والأرشفة.",
        },
      ],
      flow: {
        a: "Physical DIY Set",
        aSub: "Pre-Lit Matched Camera Frame",
        mid: "Motion Templates",
        midSub: "Intros · Lower-Thirds · Overlays",
        b: "Published Lesson",
        bSub: "Thumbnails & Carousel Recaps",
        note: "Standardizing both capture and post-production let volunteer teams focus on curriculum quality.",
        noteAr: "توحيد خطوتَي التصوير والمونتاج أتاح للفريق التركيز الكامل على جودة المادة العلمية.",
      },
    },
    decisions: {
      title: "System decisions across graphic, spatial, and motion layers.",
      titleAr: "أهم قرارات التصميم والتجهيز عبر الهوية والاستوديو والموشن.",
      items: [
        {
          n: "S-01",
          title: "Native Arabic typography rather than Latin-first adaptation",
          titleAr: "الانطلاق من الحرف العربي أصالةً لا ترجمةً",
          body: "Set Arabic optical balance and headline rhythm first so technical concepts felt natural in Arabic.",
          bodyAr: "ضبط الكتلة البصرية وإيقاع العناوين للغة العربية أولًا ليظهر المحتوى التقني العربي بثقة وحداثة.",
        },
        {
          n: "S-02",
          title: "Fixed camera/light recipe inside the DIY studio",
          titleAr: "تثبيت إعدادات الإضاءة والكادر داخل الاستوديو",
          body: "Removed per-shoot setup guesswork so different presenters recorded uniform footage without a dedicated cinematographer.",
          bodyAr: "إلغاء الحاجة لإعادة ضبط الإضاءة والكاميرا في كل مرة، ما مكّن المحاضرين من التسجيل بجودة ثابتة.",
        },
        {
          n: "S-03",
          title: "Lightweight motion overlays that assist—never distract from—teaching",
          titleAr: "حركة وظيفية تخدم الشرح ولا تشتت المتعلم",
          body: "Kept animations brisk and structured around code/concept callouts rather than heavy decorative transitions.",
          bodyAr: "تصميم تحريكات سريعة وهادفة تبرز المعلومة والمصطلح دون إطالة أو بهرجة تشتت الانتباه.",
        },
        {
          n: "S-04",
          title: "Track-coded thumbnail hierarchy",
          titleAr: "تنظيم بصري للأغلفة حسب المسار التعليمي",
          body: "Helped learners immediately distinguish series and episode order across social feeds.",
          bodyAr: "مساعدة المتابع على معرفة ترتيب الحلقات والمسار التابع لها بلمحة سريعة.",
        },
      ],
    },
    evidence: {
      title: "Documented archive scope.",
      titleAr: "نطاق المشروع الموثق.",
      items: [
        { value: "2020–21", label: "MSP educational initiative cycle", labelAr: "دورة المبادرة التعليمية 2020–2021", origin: "declared" },
        { value: "3-IN-1", label: "Identity + DIY Studio Build + Motion", labelAr: "دمج الهوية وبناء الاستوديو والموشن", origin: "declared" },
        { value: "AR-FIRST", label: "Built around modern Arabic technical clarity", labelAr: "مصمم لوضوح المحتوى التقني العربي", origin: "declared" },
        { value: "TEMPLATES", label: "Reusable motion & social publishing kit", labelAr: "قوالب تحريك ونشر قابلة لإعادة الاستخدام", origin: "declared" },
      ],
      notes: [
        "Summarizes the 2020–2021 identity, studio build, and motion system recorded in the portfolio archive.",
      ],
      notesAr: [
        "يلخّص هذا السجل منظومة الهوية وتجهيز الاستوديو والموشن المنفذة خلال الفترة 2020–2021.",
      ],
    },
    stack: {
      title: "Brand design, physical set setup, and motion production.",
      titleAr: "عناصر الهوية والتجهيز المكاني والتحريك البصري.",
      items: ["Arabic Brand Identity", "Typography", "DIY Studio Lighting & Set", "Motion Graphics", "Episode Packaging", "Social Templates"],
      note: "An end-to-end production system built so educational episodes look cohesive from camera lens to feed.",
      noteAr: "منظومة إنتاج مترابطة تضبط جودة المحتوى التعليمي من عدسة الكاميرا وحتى شاشة المتلقي.",
    },
    handoff: {
      title: "Brand, space, and motion engineered as one educational system.",
      titleAr: "الهوية والمكان والحركة في خدمة التعليم العربي الواضح.",
      note: "Building an academy, media channel, or educational product? Let's scope the visual and digital system below.",
      noteAr: "هل تؤسس أكاديمية أو قناة تعليمية أو منتجًا معرفيًا؟ تواصل معنا بالأسفل لتحديد النطاق المناسب.",
    },
  },

  /* ── YOUTH SCOPE ────────────────────────────────────────────────── */
  "youth-scope": {
    track: "design",
    accent: "emerald",
    fileNo: "ID-08",
    code: "YS-2SEASONS",
    eyebrow: "SYSTEMIC ORGANIZATION IDENTITY · CAMPAIGNS · MEDIA TEAM LEAD",
    wordmark: "Youth Scope",
    heroLead:
      "Two consecutive ground-up seasonal identity systems paired with end-to-end media team leadership—built so student volunteers ship consistent workshops, campaigns, and stage print fast.",
    heroLeadAr:
      "بناء نظامين بصريين كاملين من الصفر لموسمين متتاليين مع قيادة فريق الإعلام بالكامل لتمكين المتطوعين من إنتاج حملات ومطبوعات متسقة بسرعة عالية.",
    badges: [
      { en: "Systemic Identity", ar: "هوية مؤسسية مرنة" },
      { en: "2 Full Seasons", ar: "موسمان متتاليان" },
      { en: "Media Team Lead", ar: "قيادة فريق الإعلام" },
      { en: "2019–2021", ar: "2019–2021" },
    ],
    snapshotTitle: { en: "Governance summary", ar: "ملخص الحوكمة والتشغيل" },
    snapshotCode: "2019 → 2021",
    snapshot: [
      { label: "Consecutive seasons", labelAr: "مواسم متتالية", value: "2" },
      { label: "Identity rebuilds", labelAr: "تأسيس كامل للهوية", value: "2×" },
      { label: "Primary accent", labelAr: "اللون الأساسي", value: "#3DDC84" },
      { label: "Role scope", labelAr: "نطاق الدور", value: "Lead" },
    ],
    snapshotNote:
      "Combined visual system architecture with daily team direction, critique loops, and print pre-flight across 2019–2021.",
    snapshotNoteAr:
      "جمع الدور بين هندسة النظام البصري وإدارة فريق المصممين المتطوعين ومراجعة المطبوعات والمنشورات يوميًا.",
    role: { en: "Identity Architect & Head of Media (2 Seasons)", ar: "مصمم النظام ورئيس فريق الإعلام لموسمين" },
    domain: { en: "Youth Organization & Live Workshops", ar: "مؤسسة شبابية وورش عمل وفعاليات" },
    year: "2019–21",
    cover: {
      src: "/images/work/youth-scope.jpg",
      alt: "Youth Scope collaborative media and workshop team context",
      altAr: "بيئة العمل الجماعي والورش التدريبية لمبادرة يوث سكوب",
      caption: "Built for fast-moving collaborative student teams publishing across workshops, recruitment drives, and stage events",
      captionAr: "مصمم لفرق العمل الشبابية السريعة لضبط النشر عبر حملات التقديم والورش والفعاليات الميدانية",
      tag: "TEAM-GOVERNED SYSTEM",
    },
    cta: {
      href: "https://www.behance.net/aboalazm",
      en: "External portfolio",
      ar: "ملف الأعمال الخارجي",
    },
    challenge: {
      title: "Keep visual quality consistent when a volunteer team ships daily.",
      titleAr: "الحفاظ على ثبات الجودة البصرية مع فريق متطوعين ينشر يوميًا.",
      paragraphs: [
        "Youth organizations publish at high volume—committee recruitment, speaker cards, workshop slides, stage backdrops, and live event coverage—executed by student volunteers with mixed experience levels.",
        "Across two consecutive seasons (2019–2021), Youth Scope was re-identified from scratch each year with modular template guardrails, locked color/typography rules, and hands-on team leadership so every designer could ship fast without breaking the brand.",
      ],
      paragraphsAr: [
        "تحتاج المبادرات الشبابية إلى غزارة إنتاجية عالية تشمل حملات استقطاب الأعضاء، بطاقات المتحدثين، عروض الورش، ولافتات المسرح، وينفّذها متطوعون تتفاوت خبراتهم التصميمية.",
        "على مدار موسمين متتاليين (2019–2021)، أعيد بناء الهوية من الصفر في كل عام بنظام قوالب محكوم وقواعد خطوط وألوان ثابتة مع إشراف مباشر على الفريق لضمان سرعة النشر وثبات المستوى.",
      ],
      callout:
        "A good community identity is judged not by what the lead designer makes alone, but by how clean the tenth volunteer's post looks on a 2-hour deadline.",
      calloutAr:
        "نجاح هوية المؤسسات التطوعية لا يُقاس بما يصممه قائد الفريق وحده، بل بمدى انضباط وجودة التصميم الذي يخرجه أي متطوع تحت ضغط الوقت.",
    },
    system: {
      kicker: "Operational design system",
      kickerAr: "منظومة التشغيل البصري",
      title: "Seasonal rules, modular grids, venue print, and team QA.",
      titleAr: "هوية موسمية، شبكات قوالب، مطبوعات مسرح، ومراجعة جودة.",
      aside: "Rebuilt cleanly across Season 1 and Season 2 to give each board a fresh identity.",
      asideAr: "بُنيت المنظومة مرتين لمنح كل موسم روحًا متجددة مع الحفاظ على الانضباط البصري.",
      modules: [
        {
          no: "01",
          name: "Seasonal Visual Direction & Token Kit",
          nameAr: "التوجه البصري الموسمي وحقيبة الأصول",
          tech: "Logo System · #3DDC84 / #149E5A · Type Scale",
          detail:
            "Defined each season's lockups, color pairings, graphic shapes, and shared asset folders before recruitment launched.",
          detailAr:
            "تحديد الشعارات ودرجات الألوان والعناصر الهندسية ومجلدات العمل المشتركة قبل انطلاق كل موسم.",
        },
        {
          no: "02",
          name: "Guardrailed Social & Campaign Templates",
          nameAr: "قوالب النشر والحملات محكومة الهوامش",
          tech: "Recruitment · Speakers · Agendas · Recaps",
          detail:
            "Pre-gridded master files with locked margins, badge placements, and headline scales for rapid multi-designer publishing.",
          detailAr:
            "ملفات مصدرية مسبقة الضبط بالهوامش ومواضع الشعار ومقاسات الخطوط لتسهيل عمل عدة مصممين بالتوازي.",
        },
        {
          no: "03",
          name: "Workshop & Main-Stage Environmental Print",
          nameAr: "مطبوعات الورش وتجهيزات القاعات والمسرح",
          tech: "Roll-Ups · Stage Backdrops · ID Lanyards · Certificates",
          detail:
            "Scaled seasonal visuals onto venue signage, registration desks, attendee/staff badges, and printed recognition certificates.",
          detailAr:
            "توسيع الهوية لتشمل لافتات القاعات، مكاتب التسجيل، بطاقات الحضور والمنظمين، وشهادات التقدير.",
        },
        {
          no: "04",
          name: "Team Onboarding & Pre-Publish QA Workflow",
          nameAr: "تدريب الفريق ونظام مراجعة الجودة السريع",
          tech: "Task Routing · Design Critique · Print Pre-Flight",
          detail:
            "Structured task briefs, fast feedback checklists, and CMYK/bleed checks before sending stage print to vendors.",
          detailAr:
            "توزيع منظم للمهام مع قائمة فحص سريعة قبل النشر الرقمي أو إرسال الملفات للمطابع.",
        },
      ],
      flow: {
        a: "Season Master Kit",
        aSub: "Rules · Grids · Assets",
        mid: "Volunteer Team Execution",
        midSub: "Guided Briefs + Fast Lead QA",
        b: "Unified Public Output",
        bSub: "Social Campaigns & Venue Print",
        note: "System constraints kept output cohesive across dozens of events and announcements.",
        noteAr: "القواعد الواضحة للقوالب حفظت تماسك المخرجات عبر عشرات الورش والحملات الإعلانية.",
      },
    },
    decisions: {
      title: "Governance decisions learned from leading two full seasons.",
      titleAr: "قرارات تنظيمية وتصميمية من واقع قيادة موسمين متتاليين.",
      items: [
        {
          n: "S-01",
          title: "Design templates around junior-designer failure modes",
          titleAr: "تصميم القوالب لمنع الأخطاء الشائعة مسبقًا",
          body: "Locked safe zones and contrast-tested text containers prevented crowded edges and unreadable photo overlays.",
          bodyAr: "تثبيت المساحات الآمنة وخلفيات النصوص منع تداخل الكتابة مع الصور أو ازدحام الأطراف.",
        },
        {
          n: "S-02",
          title: "Fresh seasonal skin over a repeatable operational spine",
          titleAr: "تجديد المظهر الموسمي مع تثبيت آلية التشغيل",
          body: "Changed visual theme between Season 1 and Season 2 for audience excitement while keeping workflow structure familiar for the team.",
          bodyAr: "منح الموسم الثاني مظهرًا بصريًا جديدًا ينعش تفاعل الجمهور مع الإبقاء على نفس منهجية تنظيم الملفات للفريق.",
        },
        {
          n: "S-03",
          title: "Print pre-flight checklists before event days",
          titleAr: "فحص فني صارم لملفات الطباعة قبل الفعاليات",
          body: "Standardized CMYK profiles, bleed margins, and scale checks so banners and badges printed cleanly on the first run.",
          bodyAr: "مراجعة صيغ الألوان وهوامش القص والمقاسات الفعلية لضمان سلامة طباعة اللافتات والبطاقات من المرة الأولى.",
        },
        {
          n: "S-04",
          title: "Mentorship through concrete system rules, not subjective taste",
          titleAr: "بناء المراجعة الفنية على قواعد واضحة لا انطباعات شخصية",
          body: "Cut revision rounds dramatically by reviewing volunteer drafts against explicit grid and hierarchy rules.",
          bodyAr: "تقليل جولات التعديل عبر الاحتكام لقواعد الشبكة والتسلسل البصري المتفق عليها مسبقًا.",
        },
      ],
    },
    evidence: {
      title: "Documented archive scope.",
      titleAr: "نطاق العمل الموثق.",
      items: [
        { value: "2019–21", label: "Two consecutive annual program seasons", labelAr: "موسمان سنويان متتاليان (2019–2021)", origin: "declared" },
        { value: "2 SYSTEMS", label: "Full seasonal identity rebuild each year", labelAr: "بناء هوية موسمية متكاملة في كل عام", origin: "declared" },
        { value: "TEAM LEAD", label: "End-to-end media team direction & QA", labelAr: "قيادة وإشراف كامل على فريق الإعلام", origin: "declared" },
        { value: "360°", label: "Campaigns, workshops & stage print collateral", labelAr: "تغطية شاملة للحملات والورش ومطبوعات المسرح", origin: "declared" },
      ],
      notes: [
        "Archive record documenting the two-season identity architecture and media leadership tenure (2019–2021).",
      ],
      notesAr: [
        "توثيق أرشيفي لمنظومة الهوية الموسمية وقيادة الفريق الإعلامي خلال الفترة 2019–2021.",
      ],
    },
    stack: {
      title: "Identity systems, template governance, and event print.",
      titleAr: "بناء الهويات المؤسسية، حوكمة القوالب، ومطبوعات الفعاليات.",
      items: ["Systemic Brand Identity", "Campaign Art Direction", "Modular Social Grids", "Stage & Venue Print", "Design QA", "Media Team Leadership"],
      note: "Built to keep volunteer-driven publishing fast, energetic, and consistent across two full years.",
      noteAr: "منظومة صُممت لتحقيق السرعة والاتساق البصري في بيئة العمل التطوعي على مدار عامين.",
    },
    handoff: {
      title: "A brand system built for real teams under real deadlines.",
      titleAr: "نظام هوية مصمم ليعمل بكفاءة في يد فرق العمل الفعلية.",
      note: "Need a modular visual system your internal marketing or content team can run smoothly? Let's talk below.",
      noteAr: "هل تحتاج نظام هوية وقوالب يستطيع فريق التسويق لديك تشغيله بسهولة واتساق؟ تواصل معنا بالأسفل.",
    },
  },
};
