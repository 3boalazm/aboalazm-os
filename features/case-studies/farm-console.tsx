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
      heroLeadAr="عملية مزرعة كاملة في مكان واحد: 37 صفحة تغطي القطيع والصحة والتلقيح والحسابات — بلا bundler، تعمل دون اتصال، ومحمية باختبارات مشروعها (672 اختبار)."
      badges={[
        { en: "Livestock operations", ar: "تشغيل مزرعة" },
        { en: "PWA · Offline", ar: "PWA · أوفلاين" },
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
      snapshotNoteAr="الأعداد دي متحصّلة من الريبو نفسه، مش من وصف تسويقي."
      role={{ en: "Role: Product & build", ar: "الدور: منتج + تطوير" }}
      domain={{ en: "Domain: Agri-tech", ar: "المجال: تقنية زراعية" }}
      year="2025–26"
      cover={{
        src: "/images/case-studies/farm-console/cover.jpg",
        alt: "Farm Console — herd, health and finance dashboard",
        altAr: "بيان المزرعة — القطيع والصحة والحسابات",
        caption: "Operations dashboard — herd, indicators, finance",
        captionAr: "لوحة التشغيل — القطيع، المؤشرات، الحسابات",
        tag: "RTL / 2026",
      }}
      cta={{ href: "https://farm-project-puce.vercel.app/", en: "Open the app (code required)", ar: "افتح التطبيق (بكود)" }}
      challenge={{
        title: "Forty years of paper, replaced by a page that works without signal.",
        titleAr: "أربعين سنة ورق، بتتحول لصفحة شغالة بدون شبكة.",
        paragraphs: [
          "On most farms the animal's record lives in a notebook, a WhatsApp thread, or the owner's head. A vaccination is missed, a due date is estimated, and the cost of a cycle is never totalled — so the decision is made by feel.",
          "The harder constraint is the environment: a shed, weak connectivity, one hand free, and an operator whose working vocabulary is Arabic. A React dashboard with an elegant onboarding flow is the wrong answer to that constraint.",
          "So Bayan is a vanilla, buildless multi-page app: plain HTML and global-scoped JavaScript loaded with <script> tags, talking to Firebase Realtime Database over its REST API. There is no bundler, no framework, no build step — you edit a file and it ships as-is.",
        ],
        paragraphsAr: [
          "في معظم المزارع، سجل الرأس موجود في دفتر أو رسالة واتساب أو دماغ صاحب المزرعة. التحصين بيتنسى، والتلقيح بيتحسب بالتقريب، وتكلفة الدورة مبتتحسبش — فالقرر بيتاخد بالإحساس.",
          "القيد الأصعب هو البيئة: عنبر، وشبكة ضعيفة، وإيد واحدة فاضية، ومشغّل قاموسه عربي. لوحة React بتجربة إعداد أنيقة هي الإجابة الغلط على القيد ده.",
          "عشان كده «بيان» تطبيق vanilla بلا build: HTML عادي وجافاسكريبت عام محمّل بوسوم <script>، بيتكلم مع Firebase Realtime Database عبر REST. مفيش bundler ولا framework ولا خطوة بناء — تعدّل الملف ويتنشر زي ما هو.",
        ],
        callout: "Core decision: the record is the unit. Every one of the 37 pages is a different view of the same animal, not a separate feature with its own data.",
        calloutAr: "القرار الأساسي: السجل هو الوحدة. كل صفحة من الـ37 هي عرض مختلف لنفس الرأس، مش ميزة منفصلة ببياناتها الخاصة.",
      }}
      system={{
        kicker: "Modules",
        kickerAr: "الوحدات",
        title: "Four domains, thirty-seven pages.",
        titleAr: "أربع مجالات، سبعة وتلاتين صفحة.",
        aside: "The module set below is the one the repository actually ships, read from its page inventory and test domains.",
        asideAr: "الوحدات دي هي اللي الريبو بيشحنها فعلًا، مقروءة من جرد الصفحات ومجالات الاختبار.",
        modules: [
          {
            no: "01",
            name: "Herd & life cycle",
            nameAr: "القطيع ودورة الحياة",
            detail: "Animals, barns, births, deaths, pedigree, weight and status services — with a dedicated life-cycle model rather than free-text notes.",
            detailAr: "الحيوانات والعنابر والولادات والنفوق والنسب والوزن وخدمات الحالة — بنموذج دورة حياة مستقل مش ملاحظات نص حر.",
            tech: "animals · barns · births · pedigree · weight-service",
          },
          {
            no: "02",
            name: "Health & breeding",
            nameAr: "الصحة والتلقيح",
            detail: "Vaccination scheduling, treatment records, breeding cycles and expected dates, surfaced where the work happens instead of in a spreadsheet.",
            detailAr: "جدولة التحصين وسجلات العلاج ودورات التلقيح والتواريخ المتوقعة، ظاهرة في مكان الشغل نفسه بدل شيت إكسل.",
            tech: "health · vaccine · breeding · tasks",
          },
          {
            no: "03",
            name: "Finance",
            nameAr: "الحسابات",
            detail: "Entries, periods, per-animal and A/P views, and reports — one accounting model behind every financial screen, covered by its own rules test suite.",
            detailAr: "قيود وفترات ووجهات لكل رأس ودائنين وتقارير — نموذج محاسبي واحد ورا كل شاشة مالية، ومغطّى بسويت اختبارات قواعد خاصة بيه.",
            tech: "finance · cost · production · reports",
          },
          {
            no: "04",
            name: "Operations & access",
            nameAr: "التشغيل والصلاحيات",
            detail: "Users, roles, permissions and settings, plus an offline shell, notifications, an import path and a read-only assistant.",
            detailAr: "المستخدمين والأدوار والصلاحيات والإعدادات، بالإضافة لقشرة أوفلاين وإشعارات ومسار استيراد ومساعد للقراءة فقط.",
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
          noteAr: "مسار بيانات مبسط من ملاحظات المعمارية في الريبو؛ التطبيق متعدد الصفحات ومفيش طبقة framework بين الصفحات وقاعدة البيانات.",
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
            bodyAr: "HTML خام مع جافاسكريبت عام، بيتنشر زي ما هو. أي مطوّر يعرف يعدّل ملف يقدر يغيّر المنتج، ومفيش حاجة بتتكسر بسبب إصدار bundler.",
          },
          {
            n: "02",
            title: "The gate is part of the product",
            titleAr: "البوابة جزء من المنتج",
            body: "Operational data about someone's livelihood is not a brochure. The deployment opens on an access-code screen that states, in the interface, that no name or role renders before the code verifies.",
            bodyAr: "بيانات تشغيل على مصدر رزق حد مش بروشور. الموقع بيفتح على شاشة كود بتقول في الواجهة نفسها إن مفيش اسم أو دور بيتعرض قبل التحقق.",
          },
          {
            n: "03",
            title: "Arabic is the source language",
            titleAr: "العربي هو اللغة الأصلية",
            body: "All UI text, comments and many identifiers are Arabic, and the repo's own instructions say to preserve Arabic strings exactly. This is not an English app with a translation layer.",
            bodyAr: "كل نصوص الواجهة والتعليقات وكثير من المعرّفات بالعربي، وتعليمات الريبو نفسها بتقول إن النصوص العربية تتحفظ كما هي. ده مش تطبيق إنجليزي مع طبقة ترجمة.",
          },
          {
            n: "04",
            title: "Tokens before features",
            titleAr: "التوكنز قبل المزايا",
            body: "One phase of work was purely visual: thirty near-duplicate font sizes (five between .71 and .76rem doing one job) collapsed into eight named steps, documented in DESIGN-TOKENS.md before any feature touched them.",
            bodyAr: "مرحلة كاملة كانت بصرية بحتة: تلاتين حجم خط شبه مكرر (خمسة بين .71 و.76rem بيأدوا نفس الوظيفة) اتلمّوا في 8 درجات مسمّاة، واتوثّقوا في DESIGN-TOKENS.md قبل أي ميزة.",
          },
          {
            n: "05",
            title: "Safety is a scan, not a promise",
            titleAr: "الأمان فحص، مش وعد",
            body: "A static command (`npm run scan`) guards against permission and single-source-of-truth regressions, and access-policy drift is checked against the rules with a script — plus XSS-hardening and hermetic browser suites.",
            bodyAr: "أمر ثابت (`npm run scan`) بيحرس من انحدارات الصلاحيات ومصدر الحقيقة الواحد، وانحراف سياسة الوصول بيتفحص بسكريبت — مع اختبارات XSS وعزل في المتصفح.",
          },
          {
            n: "06",
            title: "Its own certificate says it is not done",
            titleAr: "شهادته هو بتقول إنه لسه مش جاهز",
            body: "The repository ships an ENGINEERING-CERTIFICATE.md that scores the project 75/100 and labels it \"production candidate\" with the explicit line that it is not yet fully production ready. That honesty is the strongest signal in the repo.",
            bodyAr: "الريبو فيه ENGINEERING-CERTIFICATE.md بيقيّم المشروع 75/100 ويوصفه «مرشّح للإنتاج» مع سطر صريح إنه لسه مش جاهز للإنتاج بالكامل. الصراحة دي أقوى إشارة في الريبو.",
          },
        ],
      }}
      evidence={{
        title: "Counted in the repository, not estimated.",
        titleAr: "متحصّلة من الريبو، مش مقدّرة.",
        items: [
          { value: "37", label: "HTML pages in the build", labelAr: "صفحة HTML في البناء", origin: "repo" },
          { value: "672", label: "Unit test() cases across 30 suites", labelAr: "حالة اختبار في 30 سويت", origin: "repo" },
          { value: "56", label: "Browser spec files", labelAr: "ملف اختبار متصفح", origin: "repo" },
          { value: "75/100", label: "Engineering certificate (self-assessed)", labelAr: "شهادة الهندسة (تقييم ذاتي)", origin: "declared" },
        ],
        notes: [
          "The 672 figure counts test() calls in the 30 unit suites; the browser suite is inventoried as 56 spec files and needs a local Chromium install to run.",
          "The certificate is the project's own document, dated 2026-07-17 and tagged baseline-v2-production-candidate. It is quoted, not re-scored here — and it explicitly lists medium-severity items still open.",
          "No herd count, user count or revenue figure appears in this file, because none was present in the repository.",
        ],
        notesAr: [
          "رقم 672 بيعدّ استدعاءات test() في الـ30 سويت؛ سويت المتصفح متجرّد كـ56 ملف وبيحتاج Chromium محلي عشان يشتغل.",
          "الشهادة مستند المشروع نفسه، بتاريخ 2026-07-17 وtag اسمه baseline-v2-production-candidate. منقولة هنا مش معاد تقييمها — وهي نفسها بتذكر بنود متوسطة لسه مفتوحة.",
          "مفيش في الملف ده عدد رؤوس أو مستخدمين أو إيرادات، لأن مفيش أي منهم في الريبو.",
        ],
      }}
      stack={{
        title: "Light, installable, and audited.",
        titleAr: "خفيف، قابل للتثبيت، ومُدقَّق.",
        items: ["Vanilla HTML", "Global-scoped JS", "Firebase Realtime DB (REST)", "Service Worker / PWA", "Playwright", "jsdom", "css-tree", "Arabic RTL"],
        note: "The test toolchain is the only npm dependency set — three devDependencies for the suite. The application itself has none.",
        noteAr: "أدوات الاختبار هي مجموعة الاعتماديات الوحيدة في npm — تلات devDependencies للسويت. التطبيق نفسه بلا أي اعتمادية.",
      }}
      handoff={{
        title: "A paper trail that survives a dead signal.",
        titleAr: "سجل ورقي بيبقى حي لما الشبكة تقطع.",
        note: "Next: closing the medium-severity items its own certificate lists, then promoting the tag past production-candidate.",
        noteAr: "الخطوة التالية: إغلاق البنود المتوسطة اللي شهادته نفسها بتذكرها، وبعدها الترقية من «مرشّح للإنتاج».",
      }}
    />
  );
}
