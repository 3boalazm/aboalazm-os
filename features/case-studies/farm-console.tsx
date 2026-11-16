"use client";

/**
 * FARM CONSOLE (بيان المزرعة) — Product case file / 007
 *
 * Source: 3boalazm/farm-project, read directly. This file replaces the
 * earlier live-site version, which could only see the login screen.
 *
 * Every number here was counted in the repository, not estimated:
 *   37 HTML pages · 30 unit suites / 672 test() calls · 56 Playwright spec
 *   files · 10 test domains (auth, data-integrity, permissions, regression,
 *   rules, security, smoke, ssot, unit) · vanilla buildless stack · Firebase
 *   Realtime DB over REST · 8 design-token type steps (from DESIGN-TOKENS.md).
 * The engineering certificate's own score (75/100, "Engineering Certified",
 * production candidate 2026-07-17) is quoted as the project's self-assessment
 * — and it explicitly says it is NOT yet fully production ready, which this
 * file repeats rather than smoothing over.
 */
import { ProductCase } from "./product-case";

export function FarmConsoleCaseStudy() {
  return (
    <ProductCase
      accent="emerald"
      fileNo="007"
      code="FARM / BAYAN"
      eyebrow="BEYAN EL-MAZRAA / FARM CONSOLE"
      wordmark="Farm"
      wordmarkTail="Console"
      heroLead="A livestock operation in one place: 37 pages covering herd, health, breeding and finance — built with no bundler, running offline, and audited by its own 672-test suite."
      heroLeadAr="عملية مزرعة كاملة في مكان واحد: 37 صفحة تغطي القطيع والصحة والتلقيح والحسابات، بلا bundler، وتعمل دون اتصال، ومحمية باختبارات مشروعها (672 اختبارًا)."
      badges={[
        { en: "Livestock operations", ar: "تشغيل مزرعة" },
        { en: "PWA · Offline", ar: "PWA · دون اتصال" },
        { en: "Arabic-first", ar: "عربي أولًا" },
        { en: "Production candidate", ar: "مرشّح للإنتاج" },
      ]}
      snapshot={[
        { value: "37", label: "HTML pages", labelAr: "صفحة HTML" },
        { value: "672", label: "Unit test cases", labelAr: "حالة اختبار" },
        { value: "56", label: "Browser spec files", labelAr: "ملف اختبار متصفح" },
        { value: "00", label: "Build steps", labelAr: "خطوة بناء" },
      ]}
      snapshotTitle={{ en: "System snapshot", ar: "لقطة النظام" }}
      snapshotCode="BAYAN / RTL"
      snapshotNote="Counts were taken from the repository, not from a marketing description."
      snapshotNoteAr="هذه الأعداد مستخرجة من المستودع نفسه، لا من وصف تسويقي."
      role={{ en: "Role: Product & build", ar: "الدور: منتج + تطوير" }}
      domain={{ en: "Domain: Agri-tech", ar: "المجال: تقنية زراعية" }}
      year="2025–26"
      cover={{
        src: "/images/work/dev-cards/farm-console-card.jpg",
        alt: "Farm Console — herd, health and finance dashboard",
        altAr: "بيان المزرعة: القطيع والصحة والحسابات",
        caption: "Operations dashboard — herd, indicators, finance",
        captionAr: "لوحة التشغيل: القطيع والمؤشرات والحسابات",
        tag: "RTL / 2026",
      }}
      cta={{ href: "https://farm-project-puce.vercel.app/", en: "Open the app (code required)", ar: "افتح التطبيق (بكود)" }}
      challenge={{
        title: "Forty years of paper, replaced by a page that works without signal.",
        titleAr: "أربعون سنة من الورق تتحول إلى صفحة تعمل دون شبكة.",
        paragraphs: [
          "On most farms the animal's record lives in a notebook, a WhatsApp thread, or the owner's head. A vaccination is missed, a due date is estimated, and the cost of a cycle is never totalled — so the decision is made by feel.",
          "The harder constraint is the environment: a shed, weak connectivity, one hand free, and an operator whose working vocabulary is Arabic. A React dashboard with an elegant onboarding flow is the wrong answer to that constraint.",
          "So Bayan is a vanilla, buildless multi-page app: plain HTML and global-scoped JavaScript loaded with <script> tags, talking to Firebase Realtime Database over its REST API. There is no bundler, no framework, no build step — you edit a file and it ships as-is.",
        ],
        paragraphsAr: [
          "في معظم المزارع، يعيش سجل الرأس في دفتر أو رسالة واتساب أو ذاكرة صاحب المزرعة. فيُنسى التحصين، ويُحسب التلقيح بالتقريب، ولا تُحسب تكلفة الدورة، فتُتخذ القرارات بالإحساس.",
          "القيد الأصعب هو البيئة: عنبر، وشبكة ضعيفة، ويد واحدة فارغة، ومشغّل لغته العربية. ولوحة React بتجربة إعداد أنيقة إجابة خاطئة عن هذا القيد.",
          "ولهذا فإن «بيان» تطبيق vanilla بلا build: HTML عادي وجافاسكربت عام محمّل بوسوم <script>، يتحدث إلى Firebase Realtime Database عبر REST. لا bundler ولا framework ولا خطوة بناء: تعدّل الملف فيُنشر كما هو.",
        ],
        callout: "Core decision: the record is the unit. Every one of the 37 pages is a different view of the same animal, not a separate feature with its own data.",
        calloutAr: "القرار الأساسي: السجل هو الوحدة. كل صفحة من الصفحات الـ37 عرض مختلف للرأس نفسه، وليست ميزة منفصلة ببياناتها الخاصة.",
      }}
      system={{
        kicker: "Modules",
        kickerAr: "الوحدات",
        title: "Four domains, thirty-seven pages.",
        titleAr: "أربعة مجالات، وسبع وثلاثون صفحة.",
        aside: "The module set below is the one the repository actually ships, read from its page inventory and test domains.",
        asideAr: "هذه الوحدات هي ما يشحنه المستودع فعلًا، مقروءة من جرد الصفحات ومجالات الاختبار.",
        modules: [
          {
            no: "01",
            name: "Herd & life cycle",
            nameAr: "القطيع ودورة الحياة",
            detail: "Animals, barns, births, deaths, pedigree, weight and status services — with a dedicated life-cycle model rather than free-text notes.",
            detailAr: "الحيوانات والعنابر والولادات والنفوق والنسب والوزن وخدمات الحالة، بنموذج دورة حياة مستقل لا ملاحظات نص حر.",
            tech: "animals · barns · births · pedigree · weight-service",
          },
          {
            no: "02",
            name: "Health & breeding",
            nameAr: "الصحة والتلقيح",
            detail: "Vaccination scheduling, treatment records, breeding cycles and expected dates, surfaced where the work happens instead of in a spreadsheet.",
            detailAr: "جدولة التحصين وسجلات العلاج ودورات التلقيح والتواريخ المتوقعة، ظاهرة في مكان العمل نفسه بدل جدول إكسل.",
            tech: "health · vaccine · breeding · tasks",
          },
          {
            no: "03",
            name: "Finance",
            nameAr: "الحسابات",
            detail: "Entries, periods, per-animal and A/P views, and reports — one accounting model behind every financial screen, covered by its own rules test suite.",
            detailAr: "قيود وفترات ووجهات لكل رأس، ودائنون وتقارير: نموذج محاسبي واحد خلف كل شاشة مالية، ومغطّى بمجموعة اختبارات قواعد خاصة به.",
            tech: "finance · cost · production · reports",
          },
          {
            no: "04",
            name: "Operations & access",
            nameAr: "التشغيل والصلاحيات",
            detail: "Users, roles, permissions and settings, plus an offline shell, notifications, an import path and a read-only assistant.",
            detailAr: "المستخدمون والأدوار والصلاحيات والإعدادات، إضافةً إلى قشرة تعمل دون اتصال وإشعارات ومسار استيراد ومساعد للقراءة فقط.",
            tech: "users · settings · notifications · bayan-offline",
          },
        ],
        flow: {
          a: "HTML pages",
          aSub: "Global-scoped JS, no bundler",
          mid: "Firebase RTDB",
          midSub: "REST — rules-tested",
          b: "Offline shell",
          bSub: "Clone survives a dead signal",
          note: "Simplified data path from the repository's architecture notes; the app is a multi-page build with no framework layer between the pages and the database.",
          noteAr: "مسار بيانات مبسّط من ملاحظات البنية في المستودع؛ والتطبيق متعدد الصفحات، ولا توجد طبقة framework بين الصفحات وقاعدة البيانات.",
        },
      }}
      decisions={{
        title: "The constraints were the design.",
        titleAr: "القيود نفسها هي التصميم.",
        items: [
          {
            n: "01",
            title: "No build step, on purpose",
            titleAr: "بلا خطوة بناء، وهذا مقصود",
            body: "Vanilla HTML plus global-scoped JS, shipped as-is. Any developer who can edit a file can change the product, and nothing breaks because a bundler version drifted.",
            bodyAr: "HTML خام مع جافاسكربت عام، يُنشر كما هو. يستطيع أي مطوّر يعرف كيف يعدّل ملفًا أن يغيّر المنتج، ولا يتعطل شيء بسبب إصدار bundler.",
          },
          {
            n: "02",
            title: "The gate is part of the product",
            titleAr: "البوابة جزء من المنتج",
            body: "Operational data about someone's livelihood is not a brochure. The deployment opens on an access-code screen that states, in the interface, that no name or role renders before the code verifies.",
            bodyAr: "بيانات تشغيل تمسّ مصدر رزق إنسان، وليست كتيبًا. يُفتح الموقع على شاشة كود تعلن في الواجهة نفسها أنه لا يُعرض اسم ولا دور قبل التحقق.",
          },
          {
            n: "03",
            title: "Arabic is the source language",
            titleAr: "العربية هي اللغة الأصلية",
            body: "All UI text, comments and many identifiers are Arabic, and the repo's own instructions say to preserve Arabic strings exactly. This is not an English app with a translation layer.",
            bodyAr: "كل نصوص الواجهة والتعليقات وكثير من المعرّفات بالعربية، وتنص تعليمات المستودع على أن النصوص العربية تُحفظ كما هي. فهذا ليس تطبيقًا إنجليزيًا بطبقة ترجمة.",
          },
          {
            n: "04",
            title: "Tokens before features",
            titleAr: "متغيّرات التصميم قبل الميزات",
            body: "One phase of work was purely visual: thirty near-duplicate font sizes (five between .71 and .76rem doing one job) collapsed into eight named steps, documented in DESIGN-TOKENS.md before any feature touched them.",
            bodyAr: "مرحلة كاملة كانت بصرية بحتة: ثلاثون حجم خط شبه مكرر (خمسة منها بين .71 و.76rem تؤدي الوظيفة نفسها) جُمعت في 8 درجات مسمّاة، ووُثّقت في DESIGN-TOKENS.md قبل أي ميزة.",
          },
          {
            n: "05",
            title: "Safety is a scan, not a promise",
            titleAr: "الأمان فحص لا وعد",
            body: "A static command (`npm run scan`) guards against permission and single-source-of-truth regressions, and access-policy drift is checked against the rules with a script — plus XSS-hardening and hermetic browser suites.",
            bodyAr: "أمر ثابت (`npm run scan`) يحرس من انحدارات الصلاحيات ومصدر الحقيقة الواحد، وانحراف سياسة الوصول يُفحص بسكربت، مع اختبارات XSS وعزل في المتصفح.",
          },
          {
            n: "06",
            title: "Its own certificate says it is not done",
            titleAr: "شهادته تقول إنه ليس جاهزًا بعد",
            body: "The repository ships an ENGINEERING-CERTIFICATE.md that scores the project 75/100 and labels it \"production candidate\" with the explicit line that it is not yet fully production ready. That honesty is the strongest signal in the repo.",
            bodyAr: "يحتوي المستودع على ENGINEERING-CERTIFICATE.md الذي يقيّم المشروع بـ 75/100 ويصفه بـ«مرشّح للإنتاج»، مع سطر صريح بأنه ليس جاهزًا للإنتاج بالكامل. وهذه الصراحة أقوى إشارة في المستودع.",
          },
        ],
      }}
      evidence={{
        title: "Counted in the repository, not estimated.",
        titleAr: "مستخرجة من المستودع لا مقدَّرة.",
        items: [
          { value: "37", label: "HTML pages in the build", labelAr: "صفحة HTML في البناء", origin: "repo" },
          { value: "672", label: "Unit test() cases across 30 suites", labelAr: "حالة اختبار في 30 مجموعة", origin: "repo" },
          { value: "56", label: "Browser spec files", labelAr: "ملف اختبار متصفح", origin: "repo" },
          { value: "75/100", label: "Engineering certificate (self-assessed)", labelAr: "شهادة الهندسة (تقييم ذاتي)", origin: "declared" },
        ],
        notes: [
          "The 672 figure counts test() calls in the 30 unit suites; the browser suite is inventoried as 56 spec files and needs a local Chromium install to run.",
          "The certificate is the project's own document, dated 2026-07-17 and tagged baseline-v2-production-candidate. It is quoted, not re-scored here — and it explicitly lists medium-severity items still open.",
          "No herd count, user count or revenue figure appears in this file, because none was present in the repository.",
        ],
        notesAr: [
          "رقم 672 يعدّ استدعاءات test() في الـ30 مجموعة؛ ومجموعة المتصفح مجزَّأة على 56 ملفًا وتحتاج Chromium محليًا لتعمل.",
          "الشهادة مستند المشروع نفسه، بتاريخ 2026-07-17 ووسم باسم baseline-v2-production-candidate. وهي منقولة هنا لا معاد تقييمها، وتذكر هي نفسها بنودًا متوسطة ما زالت مفتوحة.",
          "لا يوجد في هذا الملف عدد رؤوس ولا مستخدمين ولا إيرادات، لأن شيئًا من ذلك ليس في المستودع.",
        ],
      }}
      stack={{
        title: "Light, installable, and audited.",
        titleAr: "خفيف، قابل للتثبيت، ومُدقَّق.",
        items: ["Vanilla HTML", "Global-scoped JS", "Firebase Realtime DB (REST)", "Service Worker / PWA", "Playwright", "jsdom", "css-tree", "Arabic RTL"],
        note: "The test toolchain is the only npm dependency set — three devDependencies for the suite. The application itself has none.",
        noteAr: "أدوات الاختبار هي مجموعة الاعتماديات الوحيدة في npm: ثلاث devDependencies للمجموعة. أما التطبيق نفسه فبلا أي اعتمادية.",
      }}
      handoff={{
        title: "A paper trail that survives a dead signal.",
        titleAr: "سجل ورقي يبقى حيًّا حين تنقطع الشبكة.",
        note: "Next: closing the medium-severity items its own certificate lists, then promoting the tag past production-candidate.",
        noteAr: "الخطوة التالية: إغلاق البنود المتوسطة التي تذكرها شهادته نفسها، ثم الترقية من «مرشّح للإنتاج».",
      }}
    />
  );
}
