"use client";

/**
 * CODE & CANVAS — PLATFORM — Product case file / 012
 *
 * SOURCE: 3boalazm/codeandcanvas-native, read directly after the owner made
 * it public. This replaces the earlier live-site-only version, which could
 * not see any of the engineering below.
 *
 * Counted in the repository (not estimated):
 *   · 82 index.html files — 41 English routes + 41 Arabic twins at /ar/*
 *   · ZERO runtime dependencies. package.json has no `dependencies` block;
 *     the only devDependencies are @playwright/test and @axe-core/playwright
 *   · 2,438 lines of CSS across assets/css (pages 962 · home 178 · …)
 *   · 2,140 lines of JS across assets/js (site 541, erp-data 539, shop 71, …)
 *   · 29 Playwright test() cases across 4 specs, and an axe scan that runs
 *     the same 16 routes in BOTH languages = 32 accessibility scans
 *   · 52 routes in the machine sitemap (docs/sitemap.json), captured from the
 *     old WordPress site: 40 live, 6 missing, 2 duplicate, 2 redirect, 1 auth
 *   · 23 services across 4 tracks (AB-01…06 · MA-01…10 · HC-01…05 · CC-01/02)
 *
 * The engineering stories here are genuinely unusual, and each is verified:
 *   · the chrome is synced from partials into committed HTML between marker
 *     pairs — no runtime includes, and `--check` fails CI if any page drifts
 *   · Arabic is generated from the finished English page (gen-ar.mjs) so the
 *     twin can never fall behind, then tested for exactly that
 *   · npm run check re-generates in a temp dir and diffs the committed output
 */
import { ProductCase } from "./product-case";

export function CodeCanvasDevCaseStudy() {
  return (
    <ProductCase
      accent="amber"
      fileNo="012"
      code="C&C / NATIVE"
      eyebrow="CODE & CANVAS / NATIVE PLATFORM"
      wordmark="Code &"
      wordmarkTail="Canvas"
      heroLead="A bilingual studio site rebuilt as native static HTML — 82 pages, zero runtime dependencies, and an Arabic twin generated from the English page so the two can never drift apart."
      heroLeadAr="موقع استوديو ثنائي اللغة أُعيد بناؤه بصيغة HTML ثابتة أصلية: 82 صفحة، وصفر اعتماديات تشغيل، ونسخة عربية تُولَّد من الصفحة الإنجليزية، فيستحيل أن تبتعدا عن بعضهما."
      badges={[
        { en: "Studio platform", ar: "منصة استوديو" },
        { en: "MENA", ar: "الشرق الأوسط" },
        { en: "Zero runtime deps", ar: "صفر اعتماديات" },
        { en: "Live", ar: "مباشر" },
      ]}
      snapshot={[
        { value: "82", label: "Static HTML pages", labelAr: "صفحة HTML ثابتة" },
        { value: "00", label: "Runtime dependencies", labelAr: "اعتمادية تشغيل" },
        { value: "32", label: "axe accessibility scans", labelAr: "فحص إتاحة axe" },
        { value: "23", label: "Services published", labelAr: "خدمة معلنة" },
      ]}
      snapshotTitle={{ en: "System snapshot", ar: "لقطة النظام" }}
      snapshotCode="C&C / NATIVE"
      snapshotNote="Page count is the index.html inventory (41 routes × English + Arabic); the zero is package.json's own dependencies block."
      snapshotNoteAr="عدد الصفحات من جرد ملف index.html (41 مسارًا × الإنجليزية والعربية)؛ والصفر هو كتلة الاعتماديات في package.json نفسه."
      role={{ en: "Role: Co-founder · creative direction", ar: "الدور: شريك مؤسس · إدارة إبداعية" }}
      domain={{ en: "Domain: Advisory & studio", ar: "المجال: استشارات واستوديو" }}
      year="2026"
      cover={{
        src: "/images/work/dev-cards/code-canvas-dev-card.jpg",
        alt: "One static page, mirrored into English LTR and Arabic RTL",
        altAr: "صفحة ثابتة واحدة، تتكرر بنسخة إنجليزية وأخرى عربية",
        caption: "One page, two mirrors — EN LTR / AR RTL",
        captionAr: "صفحة واحدة، مرآتان: إنجليزي LTR / عربي RTL",
        tag: "NATIVE / 2026",
      }}
      cta={{ href: "https://codeandcanvas.net/", en: "Open Code & Canvas", ar: "افتح كود آند كانفاس" }}
      challenge={{
        title: "The old site was WordPress. The brief was to stop paying rent on a page.",
        titleAr: "كان الموقع القديم مبنيًا على ووردبريس. وكان الطلب أن نتوقف عن دفع إيجار لصفحة.",
        paragraphs: [
          "The live Code & Canvas site was WordPress + Elementor Pro + Astra + WooCommerce, and its own sitemap was broken — a 500 on sitemap.xml and 404s across the numbered sitemap files. A studio selling architecture and design was running on a stack it could not inventory.",
          "Worse for a bilingual MENA practice: Arabic was a parallel site, translated after the fact. Every English edit left the Arabic page behind, and nothing in the build could tell you when it happened.",
          "The native rebuild answers both with the same move: the committed HTML is the deliverable. The chrome is synced from partials, the Arabic page is generated from the finished English page, and `npm run check` regenerates everything in a temp directory and diffs it against what is committed.",
        ],
        paragraphsAr: [
          "كان موقع Code & Canvas الحيّ مبنيًا على WordPress وElementor Pro وAstra وWooCommerce، وكانت خريطة الموقع معطّلة: الخطأ 500 على sitemap.xml والخطأ 404 على ملفات الخريطة المرقّمة. استوديو يبيع هندسة الأنظمة والتصميم كان يعمل على حزم تقنية يعجز عن جردها.",
          "والأسوأ لممارسة ثنائية اللغة في الشرق الأوسط: أن النسخة العربية كانت موقعًا موازيًا يُترجم بعد انتهاء الإنجليزية. فكل تعديل إنجليزي يترك الصفحة العربية متأخرة، ولا شيء في عملية البناء يخبرك متى حدث ذلك.",
          "وتعالج إعادة البناء الأصلية الأمرين بحركة واحدة: ملف HTML الملتزَم به هو المُخرَج. فالقشرة تتزامن من partials، والصفحة العربية تُولَّد من الإنجليزية المكتملة، والأمر `npm run check` يعيد توليد كل شيء في مجلد مؤقت ويقارنه (diff) بما التُزم به.",
        ],
        callout: "Core decision: no runtime dependencies and no server includes. What is committed is what is served — and a check command proves it.",
        calloutAr: "القرار الأساسي: صفر اعتماديات تشغيل وبلا includes من الخادم. ما التُزم به هو ما يُقدَّم، وأمر فحص يثبت ذلك.",
      }}
      system={{
        kicker: "Architecture",
        kickerAr: "البنية",
        title: "Four generators, zero runtime.",
        titleAr: "أربع مولّدات، وصفر runtime.",
        aside: "Every script below runs at authoring time. The served site is only HTML, CSS and JS files — nothing executes to assemble a page.",
        asideAr: "كل سكربت من هذه يعمل وقت التأليف. الموقع المقدَّم ملفات HTML وCSS وJS فقط، ولا شيء يعمل لتجميع صفحة عند الطلب.",
        modules: [
          {
            no: "01",
            name: "Page generator",
            nameAr: "مولّد الصفحات",
            detail: "gen-pages.py scaffolds the inner pages from a Python catalog of services and tracks, so a repeated service card cannot differ between two pages.",
            detailAr: "يبني gen-pages.py الصفحات الداخلية من كتالوج Python للخدمات والمسارات، فيستحيل أن تختلف بطاقة الخدمة المتكررة بين صفحتين.",
            tech: "scripts/gen-pages.py · scripts/lib/catalog.py",
          },
          {
            no: "02",
            name: "Chrome sync",
            nameAr: "مزامنة القشرة",
            detail: "Every page carries three marker pairs (cc:head · cc:top · cc:bottom). sync-chrome rewrites what sits between them from partials, and --check fails CI the moment a page drifts.",
            detailAr: "تحمل كل صفحة ثلاثة أزواج من العلامات (cc:head · cc:top · cc:bottom). ويعيد sync-chrome كتابة ما بينها من partials، ويُفشل الخيار --check عملية CI لحظة تنحرف أي صفحة.",
            tech: "partials/*.html · scripts/sync-chrome.mjs",
          },
          {
            no: "03",
            name: "Arabic generation",
            nameAr: "توليد العربية",
            detail: "gen-ar.mjs derives /ar/<route>/index.html from the finished English page, so the twin always matches in structure. A test asserts the markup itself carries the Arabic.",
            detailAr: "يشتق gen-ar.mjs المسار /ar/<route>/index.html من الصفحة الإنجليزية المكتملة، فتبقى النسخة مطابقة لها في البنية دائمًا. ويتأكد اختبار من أن الماركب نفسه يحمل العربية.",
            tech: "scripts/gen-ar.mjs · scripts/lib/arize.mjs",
          },
          {
            no: "04",
            name: "Verification",
            nameAr: "التحقق",
            detail: "check-generated re-runs all three generators in a temp directory and diffs the output against the committed tree — so 'the HTML is final' is a tested claim, not a comment.",
            detailAr: "يعيد check-generated تشغيل المولّدات الثلاثة في مجلد مؤقت ويقارنها (diff) بالشجرة الملتزم بها، فعبارة «الـHTML نهائي» ادعاء مُختبَر لا تعليق.",
            tech: "npm run check · npm run check:generated",
          },
        ],
        flow: {
          a: "partials + catalog",
          aSub: "Python + Node, authoring",
          mid: "committed HTML",
          midSub: "82 pages, EN + AR",
          b: "build.sh → dist",
          bSub: "Copy only, no transforms",
          note: "build.sh is deliberately dumb: it copies the committed HTML into dist/ and generates an .htaccess from _redirects for the Hostinger origin. The build cannot change a page.",
          noteAr: "build.sh غبي عن قصد: ينسخ ملفات HTML الملتزم بها إلى dist/ ويولّد .htaccess من _redirects لأصل Hostinger. ولا يستطيع البناء أن يغيّر صفحة.",
        },
      }}
      decisions={{
        title: "Constraints chosen as architecture.",
        titleAr: "قيود اختيرت لتكون بنية.",
        items: [
          {
            n: "01",
            title: "Zero runtime dependencies",
            titleAr: "صفر اعتماديات تشغيل",
            body: "package.json has no dependencies block at all — only Playwright and axe as dev tools. A site that sells engineering cannot be a supply-chain liability.",
            bodyAr: "لا يحتوي package.json على كتلة اعتماديات أصلًا، بل Playwright وaxe كأدوات تطوير فقط. فموقع يبيع الهندسة لا يصح أن يكون مخاطرة في سلسلة التوريد.",
          },
          {
            n: "02",
            title: "The chrome cannot drift",
            titleAr: "يستحيل أن تنحرف القشرة",
            body: "Header, footer and preloader live once, in partials. They are stamped into every page between markers, and --check turns any manual edit into a failing build instead of a slow divergence.",
            bodyAr: "الترويسة والتذييل وشاشة التحميل (preloader) موجودة مرة واحدة في partials، وتُختم في كل صفحة بين علامتين، ويحوّل الخيار --check أي تعديل يدوي إلى بناء فاشل بدل انحراف بطيء.",
          },
          {
            n: "03",
            title: "Arabic is generated, not translated later",
            titleAr: "العربية تُولَّد ولا تُترجم لاحقًا",
            body: "gen-ar.mjs builds the Arabic twin from the finished English page. The failure mode of every bilingual site — an Arabic page six months behind — is designed out of the generator.",
            bodyAr: "يبني gen-ar.mjs النسخة العربية من الصفحة الإنجليزية المكتملة. وهكذا يُستبعد من المولّد نمط الفشل المألوف في كل موقع ثنائي اللغة: صفحة عربية متأخرة ستة أشهر.",
          },
          {
            n: "04",
            title: "The build is a copy",
            titleAr: "البناء عملية نسخ",
            body: "build.sh copies files and generates .htaccess. There is no minification, no bundling, no transform that can differ from what was reviewed. What a reviewer read is what ships.",
            bodyAr: "ينسخ build.sh الملفات ويولّد .htaccess، بلا minification ولا bundling ولا تحويل يمكن أن يختلف عما روجع. فما قرأه المراجع هو ما يُنشر.",
          },
          {
            n: "05",
            title: "Accessibility is a matrix, not a checklist",
            titleAr: "الإتاحة مصفوفة لا قائمة",
            body: "The axe suite runs 16 routes twice — once at 1440px in English, once at 390px in Arabic — scrolling every page to reveal below-fold sections before scanning. 32 real scans, not one homepage pass.",
            bodyAr: "يشغّل اختبار axe ستة عشر مسارًا مرتين، مرة بعرض 1440px بالإنجليزية ومرة بعرض 390px بالعربية، مع تمرير (scroll) كل صفحة ليكشف الأقسام السفلية قبل الفحص. أي 32 فحصًا حقيقيًا، لا اكتفاءً بالصفحة الرئيسية.",
          },
          {
            n: "06",
            title: "Claims are registered, not asserted",
            titleAr: "الادعاءات مسجّلة، لا مسلّمات",
            body: "The repo ships an ASSET-AND-CLAIM-REGISTER that labels its three SVG scope diagrams as conceptual illustrations — not screenshots, not outcome evidence — and lists what must be approved before anything stronger is published.",
            bodyAr: "يحتوي المستودع على ASSET-AND-CLAIM-REGISTER الذي يصف الرسوم الثلاثة (SVG) بأنها رسوم توضيحية مفاهيمية، لا لقطات شاشة ولا دليل نتائج، ويعدّد ما يجب الاتفاق عليه قبل نشر أي ادعاء أقوى.",
          },
        ],
      }}
      rows={{
        kicker: "Delivery",
        kickerAr: "التسليم",
        title: "What a buyer can actually pick.",
        titleAr: "ما يستطيع المشتري اختياره فعلًا.",
        items: [
          { name: "AB-01 · Enterprise architecture", nameAr: "AB-01 · هندسة المؤسسات", body: "$1,000–5,000 · 2–8 weeks · roadmap and governance model, via a scoped inquiry flow.", bodyAr: "1000–5000 دولار · 2–8 أسابيع · خريطة طريق ونموذج حوكمة، عبر مسار استفسار محدد." },
          { name: "HC-03 · HIS selection advisory", nameAr: "HC-03 · استشارة اختيار HIS", body: "From $2,500 · 3–5 weeks · scored criteria and a defensible decision record.", bodyAr: "من 2500 دولار · 3–5 أسابيع · معايير مُقيَّمة وسجل قرار قابل للدفاع عنه." },
          { name: "MA-03 · Full brand system", nameAr: "MA-03 · نظام هوية كامل", body: "$1,490–2,975+ · 5–7 weeks · 25–40 page guidelines plus a workshop.", bodyAr: "1490–2975+ دولار · 5–7 أسابيع · دليل من 25 إلى 40 صفحة مع ورشة." },
          { name: "CC-01 · Digital launch", nameAr: "CC-01 · إطلاق رقمي", body: "From $1,500 · 6–8 weeks · identity, bilingual site and launch system together.", bodyAr: "من 1500 دولار · 6–8 أسابيع · هوية وموقع ثنائي اللغة ونظام إطلاق معًا." },
          { name: "CanvasOne ERP · /erp/", nameAr: "CanvasOne ERP · /erp/", body: "An interactive proposal: modules, industries, compliance, timeline, a package builder and print-to-PDF — the proposal is the product demo.", bodyAr: "عرض تفاعلي: وحدات وصناعات والتزامات وجدول زمني ومنشئ باقات وطباعة PDF. والعرض نفسه هو النسخة التجريبية." },
        ],
      }}
      evidence={{
        title: "Counted in the repository, this pass.",
        titleAr: "مستخرجة من المستودع في هذه الجولة.",
        items: [
          { value: "82", label: "index.html pages (41 EN + 41 AR)", labelAr: "صفحة index.html (41 إنجليزية + 41 عربية)", origin: "repo" },
          { value: "00", label: "Runtime dependencies", labelAr: "اعتمادية تشغيل", origin: "repo" },
          { value: "32", label: "axe scans (16 routes × 2 languages)", labelAr: "فحص axe (16 مسارًا × لغتين)", origin: "repo" },
          { value: "52", label: "Routes inventoried from the old site", labelAr: "مسار مجرَّد من الموقع القديم", origin: "repo" },
        ],
        notes: [
          "The 52-route sitemap snapshot (docs/sitemap.json) was captured from the WordPress site on 2026-10-14: 40 live, 6 missing, 2 duplicate, 2 redirect, 1 auth. It is a migration inventory, not a claim about the native site's coverage.",
          "The repository's own claim register states that its three SVG work illustrations are conceptual and are not product screenshots or business-outcome evidence. This file repeats that limit rather than presenting them as case evidence.",
          "No client results, testimonials or traffic figures appear here — the repository explicitly says none were fabricated and lists them as owner-controlled publication gates.",
        ],
        notesAr: [
          "لقطة خريطة الـ52 مسارًا (docs/sitemap.json) أُخذت من موقع ووردبريس بتاريخ 2026-10-14، والحالات: حيّ 40، مفقود 6، مكرر 2، إعادة توجيه 2، تسجيل دخول 1. هذا جرد ترحيل، لا ادعاء بتغطية الموقع الأصلي.",
          "يقول سجل الادعاءات في المستودع نفسه إن الرسوم الثلاثة مفاهيمية وليست لقطات شاشة ولا دليل نتائج أعمال. وهذا الملف يكرر ذلك الحد بدل أن يقدّمها كدليل.",
          "لا نتائج عملاء ولا شهادات ولا أرقام زيارات هنا. يقول المستودع صراحةً إن شيئًا لم يُلفَّق، ويعدّها بوابات نشر يملكها المالك.",
        ],
      }}
      stack={{
        title: "HTML, CSS, and a generating script.",
        titleAr: "HTML وCSS وسكربت يولّد.",
        items: ["Semantic HTML", "Vanilla CSS (2,438 lines)", "Vanilla JS (2,140 lines)", "Python generator", "Node generator", "Playwright (29 tests)", "axe-core (32 scans)", "Hostinger / Vercel"],
        note: "The only `dependencies` a visitor downloads are the CSS and JS files in assets/. The generators and test tools never reach production.",
        noteAr: "الاعتماديات الوحيدة التي ينزّلها الزائر هي ملفات CSS وJS في assets/. أما المولّدات وأدوات الاختبار فلا تمسّ الإنتاج.",
      }}
      handoff={{
        title: "A studio site that can prove its own claims.",
        titleAr: "موقع استوديو يستطيع إثبات ادعاءاته.",
        note: "Open in the repo: the owner-controlled publication gates — real screenshots for Pharmacy OS and Zad, plus permission before any of them becomes case evidence.",
        noteAr: "مفتوح في المستودع: بوابات النشر التي يملكها المالك، وهي لقطات شاشة حقيقية لـPharmacy OS وZad، وإذن قبل أن تصبح أي واحدة دليلًا.",
      }}
    />
  );
}
