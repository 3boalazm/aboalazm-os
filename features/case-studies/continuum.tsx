"use client";

/**
 * CONTINUUM — Product case file / 011
 *
 * Source: 3boalazm/Continuum, read directly. A "Memory OS": a multi-page
 * app with NO build step, state in localStorage, and an optional Firebase
 * sync layer.
 *
 * Repository facts used here:
 *   · 21 HTML pages, one shared app.css (732 lines) and app.js (2,746 lines)
 *   · every page sets window.__PAGE__ and loads app.css + app.js; navigation
 *     is real links between pages, state survives in localStorage
 *   · Thmanyah Serif Display shipped as 5 weights in fonts/
 *   · two modes (fast/advanced) and two layouts (mobile/desktop) from the
 *     sidebar; desktop gets a fixed sidebar and a two-column home
 *   · Tasks: filter (active/all), sort (priority/due/newest), select-mode
 *     with checkboxes and bulk complete/delete
 *   · optional accounts + cross-device sync via Firebase (config.js + sync.js)
 *   · the README is explicit that the "intelligence" (Suggestions / Ask) is
 *     local heuristics, not a model — this file repeats that rather than
 *     dressing it up as AI.
 */
import { ProductCase } from "./product-case";

export function ContinuumCaseStudy() {
  return (
    <ProductCase
      accent="violet"
      fileNo="011"
      code="MEM / OS"
      eyebrow="CONTINUUM / MEMORY OS"
      wordmark="Continuum"
      heroLead="A personal operating system for projects, tasks, journal, knowledge and bookmarks — twenty-one pages, no build step, and nothing leaving the machine unless you turn sync on."
      heroLeadAr="نظام تشغيل شخصي للمشاريع والمهام واليوميات والمعرفة والمفضلة: 21 صفحة، بلا خطوة بناء، ولا يغادر الجهاز شيء إلا إذا فعّلت المزامنة بنفسك."
      badges={[
        { en: "Personal tool", ar: "أداة شخصية" },
        { en: "Local-first", ar: "محلي أولًا" },
        { en: "No build step", ar: "بلا build step" },
        { en: "Bilingual", ar: "ثنائي اللغة" },
      ]}
      snapshot={[
        { value: "21", label: "HTML pages", labelAr: "صفحة HTML" },
        { value: "2,746", label: "Lines in app.js", labelAr: "سطر في app.js" },
        { value: "05", label: "Weights shipped", labelAr: "وزن خط مُرفق" },
        { value: "00", label: "Build steps", labelAr: "خطوة بناء" },
      ]}
      snapshotTitle={{ en: "System snapshot", ar: "لقطة النظام" }}
      snapshotCode="MEM / LOCAL"
      snapshotNote="Line and page counts are from the repository; the five weights are the Thmanyah Serif Display files in fonts/."
      snapshotNoteAr="أعداد الصفحات والسطور من المستودع؛ والأوزان الخمسة هي ملفات Thmanyah Serif Display في مجلد fonts."
      role={{ en: "Role: Product & build", ar: "الدور: منتج + تطوير" }}
      domain={{ en: "Domain: Personal productivity", ar: "المجال: إنتاجية شخصية" }}
      year="2026"
      cover={{
        src: "/images/work/dev-cards/continuum-card.jpg",
        alt: "Continuum — memory OS interface",
        altAr: "كونتينيوم: واجهة نظام الذاكرة",
        caption: "Workspace shell — glass surfaces, ambient motion",
        captionAr: "قشرة مساحة العمل: أسطح زجاجية وحركة محيطة",
        tag: "LOCAL / 2026",
      }}
      cta={{ href: "https://continuum-khaki.vercel.app/", en: "Open Continuum", ar: "افتح كونتينيوم" }}
      challenge={{
        title: "Your notes are in six apps, and none of them know about the others.",
        titleAr: "ملاحظاتك موزّعة على ستة تطبيقات، ولا يعرف أحدها شيئًا عن الآخر.",
        paragraphs: [
          "A project manager, a task list, a journal, a knowledge base, a reading list and a course tracker. Each is a good app. Together they are six places to search and no place that holds the whole picture.",
          "The usual answer is a heavier platform: an account, a database, a sync engine, and a subscription. For a personal tool that is a lot of machinery to keep one person's context in one place.",
          "Continuum is the other answer: one workspace, one visual language, real links between pages, and state that lives in the browser. Sync is available, but it is a switch the user flips — not a prerequisite for opening the app.",
        ],
        paragraphsAr: [
          "مدير مشاريع، وقائمة مهام، ويوميات، وقاعدة معرفة، وقائمة قراءة، ومتابع دورات. كل واحد منها تطبيق جيد. لكنها معًا صارت ستة أماكن تبحث فيها، ولا مكان واحد يحمل الصورة كاملة.",
          "الإجابة المعتادة منصة أثقل: حساب وقاعدة بيانات ومحرك مزامنة واشتراك. وهذا كثير من الآلات لأداة شخصية تحفظ سياق شخص واحد في مكان واحد.",
          "وكونتينيوم هو الإجابة الأخرى: مساحة واحدة ولغة بصرية واحدة وروابط حقيقية بين الصفحات وحالة تعيش في المتصفح. المزامنة موجودة، لكنها مفتاح يقلبه المستخدم، وليست شرطًا لفتح التطبيق.",
        ],
        callout: "Core decision: no build step and no account by default. Open the folder, and it runs — the same way a paper notebook does not need a login.",
        calloutAr: "القرار الأساسي: بلا خطوة بناء وبلا حساب افتراضيًا. افتح المجلد فيعمل، كما أن الدفتر الورقي لا يحتاج إلى تسجيل دخول.",
      }}
      system={{
        kicker: "Architecture",
        kickerAr: "البنية",
        title: "One stylesheet, one script, twenty-one pages.",
        titleAr: "ورقة أنماط واحدة، وسكربت واحد، و21 صفحة.",
        aside: "There is no routing library and no state container. Every page declares window.__PAGE__ and loads the same two files.",
        asideAr: "لا مكتبة توجيه ولا حاوية حالة. كل صفحة تُعلن window.__PAGE__ وتحمّل الملفين نفسيهما.",
        modules: [
          {
            no: "01",
            name: "Shared shell",
            nameAr: "القشرة المشتركة",
            detail: "app.css holds glass, ambient and animation; app.js holds state, i18n, render, actions and particles. One place to change the whole product.",
            detailAr: "يضم app.css الزجاج والمحيط والحركة؛ ويضم app.js الحالة والترجمة والعرض والأوامر والجزيئات. فهناك مكان واحد لتغيير المنتج كله.",
            tech: "app.css · app.js",
          },
          {
            no: "02",
            name: "Page contract",
            nameAr: "عقد الصفحة",
            detail: "Each page sets window.__PAGE__ then loads the two shared files. Navigation is real links, so the back button and a bookmark both behave.",
            detailAr: "تحدّد كل صفحة window.__PAGE__ ثم تحمّل الملفين. والتنقّل بروابط حقيقية، فيعمل زر الرجوع والإشارات المرجعية (bookmarks) كما ينبغي.",
          },
          {
            no: "03",
            name: "Optional sync",
            nameAr: "مزامنة اختيارية",
            detail: "config.js plus sync.js add Firebase-backed accounts and cross-device sync. Left unconfigured, the app is guest and local-only.",
            detailAr: "يضيف config.js وsync.js حسابات على Firebase ومزامنة بين الأجهزة. وإن لم يُضبطا بقي التطبيق ضيفًا ومحليًا فقط.",
            tech: "config.js · sync.js · FIREBASE_SETUP.md",
          },
          {
            no: "04",
            name: "Two views, one state",
            nameAr: "عرضان، وحالة واحدة",
            detail: "Fast and advanced modes change navigation depth and content; mobile and desktop change the sidebar and home layout. The underlying state is the same.",
            detailAr: "يغيّر الوضع السريع والمتقدّم عمق التنقّل والمحتوى؛ ويغيّر الجوال وسطح المكتب الشريط الجانبي وتخطيط الرئيسية. أما الحالة فواحدة تحتهما.",
          },
        ],
        flow: {
          a: "21 pages",
          aSub: "window.__PAGE__",
          mid: "app.js",
          midSub: "State + render",
          b: "localStorage",
          bSub: "Survives a reload",
          note: "Firebase is a parallel branch reached only through sync.js when the user configures it — the local path never depends on the network.",
          noteAr: "Firebase فرع جانبي لا يتصل إلا عبر sync.js حين يضبطه المستخدم، والمسار المحلي لا يعتمد على الشبكة أبدًا.",
        },
      }}
      decisions={{
        title: "Local-first is a boundary, not a slogan.",
        titleAr: "المحلي أولًا حدّ، وليس شعارًا.",
        items: [
          {
            n: "01",
            title: "No build step at all",
            titleAr: "لا خطوة بناء إطلاقًا",
            body: "Plain HTML, CSS and JS served as files. The deployment instruction is literally to drag the folder to Vercel, because the pages reference app.css, app.js and fonts by relative path.",
            bodyAr: "HTML وCSS وJS خام تُقدَّم كملفات. وتعليمات النشر حرفيًا: اسحب المجلد إلى Vercel، لأن الصفحات تشير إلى app.css وapp.js والخطوط بمسارات نسبية.",
          },
          {
            n: "02",
            title: "State survives the page",
            titleAr: "الحالة تعيش بعد الصفحة",
            body: "Navigation is a real link, so state has to persist across documents. localStorage is the mechanism — and it means closing the tab is safe.",
            bodyAr: "التنقّل برابط حقيقي، فلا بد أن تبقى الحالة بين الصفحات. وآليتها localStorage، ومعنى ذلك أن إغلاق التبويب آمن.",
          },
          {
            n: "03",
            title: "The assistant is honest about being a heuristic",
            titleAr: "المساعد يعلن أنه heuristics",
            body: "The README states plainly that Suggestions and Ask are local heuristics, not a model. The interface says the same, because a fake assistant is worse than no assistant.",
            bodyAr: "يقول README صراحةً إن Suggestions وAsk قواعد محلية (heuristics) لا نموذجًا. والواجهة تقول الشيء نفسه، لأن مساعدًا مزيفًا أسوأ من لا مساعد.",
          },
          {
            n: "04",
            title: "Two densities, one design system",
            titleAr: "كثافتان، ونظام تصميم واحد",
            body: "Fast mode and advanced mode are not two products. They are the same tokens at two densities, which is why the twenty-one pages never drift apart visually.",
            bodyAr: "الوضع السريع والمتقدّم ليسا منتجين، بل متغيّرات التصميم نفسها بكثافتين، ولذلك لا تختلف الصفحات الـ21 بصريًا.",
          },
          {
            n: "05",
            title: "Batch actions on a real selection model",
            titleAr: "إجراءات جماعية على نموذج تحديد حقيقي",
            body: "Tasks carry filter, sort and a select-mode with checkboxes and bulk complete/delete — because a task list without batch operations is a list you stop using at fifty items.",
            bodyAr: "تدعم المهام الفلترة والترتيب ووضع التحديد بـ checkboxes والإكمال أو الحذف الجماعي، لأن قائمة مهام بلا عمليات جماعية قائمة تتخلى عنها عند خمسين بندًا.",
          },
          {
            n: "06",
            title: "Self-hosted type",
            titleAr: "خط مستضاف محليًا",
            body: "Thmanyah Serif Display ships with the project in five weights under fonts/. The identity does not depend on a font CDN staying free or available.",
            bodyAr: "يُشحن Thmanyah Serif Display مع المشروع بخمسة أوزان في fonts/. فلا تعتمد الهوية على شبكة خطوط (CDN) يُفترض أن تبقى مجانية أو متاحة.",
          },
        ],
      }}
      rows={{
        kicker: "Surfaces",
        kickerAr: "الواجهات",
        title: "Six things a person actually keeps.",
        titleAr: "ستة أشياء يحتفظ بها الشخص فعلًا.",
        items: [
          { name: "Projects", nameAr: "المشاريع", body: "projects.html and project.html?id=… — the long-running work, each with its own page.", bodyAr: "projects.html وproject.html?id=…: العمل الطويل، لكل مشروع صفحته." },
          { name: "Tasks", nameAr: "المهام", body: "Filter, sort, select-mode and bulk actions; the part used every day.", bodyAr: "فلترة وترتيب ووضع تحديد وإجراءات جماعية؛ الجزء الذي يُستخدم كل يوم." },
          { name: "Journal & timeline", nameAr: "اليوميات والخط الزمني", body: "Dated entries plus a timeline view — the same data read two ways.", bodyAr: "مدخلات مؤرخة وخط زمني: البيانات نفسها تُقرأ بطريقتين." },
          { name: "Knowledge", nameAr: "المعرفة", body: "A knowledge base that links out to courses, prompts and bookmarks instead of absorbing them.", bodyAr: "قاعدة معرفة تصل إلى الدورات والموجّهات والمفضلة بدل أن تبتلعها." },
          { name: "Library rails", nameAr: "أرفف المكتبة", body: "Courses, prompts, repos and servers — each a small page rather than a section of one huge one.", bodyAr: "دورات وموجّهات ومستودعات وخوادم: كل منها صفحة صغيرة لا قسم في صفحة ضخمة." },
          { name: "Search & settings", nameAr: "البحث والإعدادات", body: "A global search across the workspace, and settings that own the mode, layout and sync configuration.", bodyAr: "بحث شامل في المساحة، وإعدادات تتحكم في الوضع والتخطيط وإعداد المزامنة." },
        ],
      }}
      evidence={{
        title: "Counted in the folder.",
        titleAr: "مستخرجة من المجلد.",
        items: [
          { value: "21", label: "HTML pages shipped", labelAr: "صفحة HTML مُرفقة", origin: "repo" },
          { value: "3,478", label: "Lines of shared CSS + JS", labelAr: "سطر CSS وJS مشترك", origin: "repo" },
          { value: "05", label: "Font weights self-hosted", labelAr: "وزن خط مستضاف", origin: "repo" },
          { value: "00", label: "Build steps to deploy", labelAr: "خطوة بناء للنشر", origin: "repo" },
        ],
        notes: [
          "The 3,478 figure is app.css (732) plus app.js (2,746) — the two shared files, not the page markup.",
          "No user count, retention figure or 'AI accuracy' claim appears here. The repository's own README states the assistant is heuristic, and this file repeats that.",
          "Sync is genuinely optional: with config.js empty, no request leaves the browser. The Firebase setup document is three steps, not a requirement.",
        ],
        notesAr: [
          "رقم 3,478 هو app.css (732) + app.js (2,746)، أي الملفان المشتركان، لا ماركب الصفحات.",
          "لا عدد مستخدمين ولا نسبة احتفاظ ولا ادعاء «دقة AI» هنا. يقول README المستودع نفسه إن المساعد قائم على heuristics، وهذا الملف يكرر ذلك.",
          "المزامنة اختيارية فعلًا: إن كان config.js فارغًا فلا يخرج أي طلب من المتصفح. ومستند إعداد Firebase ثلاث خطوات، وليس شرطًا.",
        ],
      }}
      stack={{
        title: "Files, a font, and a switch.",
        titleAr: "ملفات، وخط، ومفتاح.",
        items: ["HTML", "CSS", "Vanilla JS", "localStorage", "Firebase (optional)", "Thmanyah Serif Display", "Glass / ambient motion", "i18n AR/EN"],
        note: "Zero dependencies to run. The only external service is the optional Firebase project behind sync.js.",
        noteAr: "صفر اعتماديات للتشغيل. الخدمة الخارجية الوحيدة هي مشروع Firebase الاختياري خلف sync.js.",
      }}
      handoff={{
        title: "A workspace that opens like a notebook.",
        titleAr: "مساحة عمل تُفتح كما يُفتح الدفتر.",
        note: "Next: import/export as a single file, so a device change is a copy rather than a migration.",
        noteAr: "الخطوة التالية: استيراد وتصدير في ملف واحد، فيصير تغيير الجهاز نسخًا لا ترحيلًا.",
      }}
    />
  );
}
