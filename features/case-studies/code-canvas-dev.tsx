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
      heroLeadAr="موقع استوديو ثنائي اللغة، معاد بناؤه HTML ثابت أصلي — 82 صفحة، صفر اعتماديات تشغيل، ونسخة عربية بتتولّد من الصفحة الإنجليزية فمستحيل يبعدوا عن بعض."
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
      snapshotNoteAr="عدد الصفحات من جرد الـindex.html (41 مسار × إنجليزي وعربي)؛ والصفر هو بلوك الاعتماديات في package.json نفسه."
      role={{ en: "Role: Co-founder · creative direction", ar: "الدور: شريك مؤسس · إدارة إبداعية" }}
      domain={{ en: "Domain: Advisory & studio", ar: "المجال: استشارات واستوديو" }}
      year="2026"
      cover={{
        src: "/images/work/dev-cards/code-canvas-dev-card.jpg",
        alt: "One static page, mirrored into English LTR and Arabic RTL",
        altAr: "صفحة ثابتة واحدة، متكررة في نسخة إنجليزية وأخرى عربية",
        caption: "One page, two mirrors — EN LTR / AR RTL",
        captionAr: "صفحة واحدة، مرآتان — إنجليزي LTR / عربي RTL",
        tag: "NATIVE / 2026",
      }}
      cta={{ href: "https://codeandcanvas.net/", en: "Open Code & Canvas", ar: "افتح كود آند كانفس" }}
      challenge={{
        title: "The old site was WordPress. The brief was to stop paying rent on a page.",
        titleAr: "الموقع القديم كان ووردبريس. الطلب كان إننا نبطّل ندفع إيجار لصفحة.",
        paragraphs: [
          "The live Code & Canvas site was WordPress + Elementor Pro + Astra + WooCommerce, and its own sitemap was broken — a 500 on sitemap.xml and 404s across the numbered sitemap files. A studio selling architecture and design was running on a stack it could not inventory.",
          "Worse for a bilingual MENA practice: Arabic was a parallel site, translated after the fact. Every English edit left the Arabic page behind, and nothing in the build could tell you when it happened.",
          "The native rebuild answers both with the same move: the committed HTML is the deliverable. The chrome is synced from partials, the Arabic page is generated from the finished English page, and `npm run check` regenerates everything in a temp directory and diffs it against what is committed.",
        ],
        paragraphsAr: [
          "موقع كود آند كانفس الحي كان WordPress + Elementor Pro + Astra + WooCommerce، وخريطة الموقع بتاعته كانت مكسورة — 500 على sitemap.xml و404 على ملفات الخريطة المرقّمة. استوديو بيبيع معمارية وتصميم كان شغال على stacks مش قادر يعمل جردها.",
          "والأسوأ لممارسة ثنائية اللغة في الشرق الأوسط: العربي كان موقع موازي، مترجم بعد ما الإنجليزي خلص. كل تعديل إنجليزي كان بيسيب الصفحة العربية ورا، ومفيش حاجة في البناء تقولك ده حصل إمتى.",
          "إعادة البناء الأصلية بترد على الاتنين بنفس الحركة: الـHTML الملتزم هو المُخرَج. الـchrome بيتزامن من partials، والصفحة العربية بتتولّد من الإنجليزية المكتملة، و`npm run check` بيعيد توليد كل حاجة في مجلد مؤقت ويعمل diff مع الملتزم.",
        ],
        callout: "Core decision: no runtime dependencies and no server includes. What is committed is what is served — and a check command proves it.",
        calloutAr: "القرار الأساسي: صفر اعتماديات تشغيل وبلا includes من السيرفر. اللي متلتزم هو اللي بيتقدّم — وأمر فحص يثبت كده.",
      }}
      system={{
        kicker: "Architecture",
        kickerAr: "المعمارية",
        title: "Four generators, zero runtime.",
        titleAr: "أربع مولّدات، وصفر runtime.",
        aside: "Every script below runs at authoring time. The served site is only HTML, CSS and JS files — nothing executes to assemble a page.",
        asideAr: "كل سكريبت تحت بيشتغل وقت التأليف. الموقع المقدَّم ملفات HTML وCSS وJS بس — مفيش حاجة بتشتغل لتجميع صفحة.",
        modules: [
          {
            no: "01",
            name: "Page generator",
            nameAr: "مولّد الصفحات",
            detail: "gen-pages.py scaffolds the inner pages from a Python catalog of services and tracks, so a repeated service card cannot differ between two pages.",
            detailAr: "gen-pages.py بيبني الصفحات الداخلية من كتالوج Python للخدمات والمسارات، فكارت خدمة متكرر مستحيل يختلف بين صفحتين.",
            tech: "scripts/gen-pages.py · scripts/lib/catalog.py",
          },
          {
            no: "02",
            name: "Chrome sync",
            nameAr: "مزامنة القشرة",
            detail: "Every page carries three marker pairs (cc:head · cc:top · cc:bottom). sync-chrome rewrites what sits between them from partials, and --check fails CI the moment a page drifts.",
            detailAr: "كل صفحة شايلة تلات أزواج markers (cc:head · cc:top · cc:bottom). sync-chrome بيعيد كتابة اللي بينهم من partials، و--check بيفشّل الـCI لحظة ما صفحة تنحرف.",
            tech: "partials/*.html · scripts/sync-chrome.mjs",
          },
          {
            no: "03",
            name: "Arabic generation",
            nameAr: "توليد العربي",
            detail: "gen-ar.mjs derives /ar/<route>/index.html from the finished English page, so the twin always matches in structure. A test asserts the markup itself carries the Arabic.",
            detailAr: "gen-ar.mjs بيشتق /ar/<route>/index.html من الصفحة الإنجليزية المكتملة، فالنسخة دايمًا مطابقة في البنية. واختبار بيتأكد إن الماركب نفسه شايل العربي.",
            tech: "scripts/gen-ar.mjs · scripts/lib/arize.mjs",
          },
          {
            no: "04",
            name: "Verification",
            nameAr: "التحقق",
            detail: "check-generated re-runs all three generators in a temp directory and diffs the output against the committed tree — so 'the HTML is final' is a tested claim, not a comment.",
            detailAr: "check-generated بيعيد تشغيل التلات مولّدات في مجلد مؤقت ويعمل diff مع الشجرة الملتزمة — فـ«الـHTML نهائي» ادعاء مختبر، مش تعليق.",
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
          noteAr: "build.sh غبي بشكل مقصود: بينسخ الـHTML الملتزم في dist/ ويولّد .htaccess من _redirects لأصل Hostinger. البناء مش قادر يغيّر صفحة.",
        },
      }}
      decisions={{
        title: "Constraints chosen as architecture.",
        titleAr: "قيود مختارة كمعمارية.",
        items: [
          {
            n: "01",
            title: "Zero runtime dependencies",
            titleAr: "صفر اعتماديات تشغيل",
            body: "package.json has no dependencies block at all — only Playwright and axe as dev tools. A site that sells engineering cannot be a supply-chain liability.",
            bodyAr: "package.json مفيهوش بلوك اعتماديات أصلًا — بس Playwright وaxe كأدوات تطوير. موقع بيبيع هندسة مينفعش يبقى مخاطرة سلسلة توريد.",
          },
          {
            n: "02",
            title: "The chrome cannot drift",
            titleAr: "القشرة مستحيل تنحرف",
            body: "Header, footer and preloader live once, in partials. They are stamped into every page between markers, and --check turns any manual edit into a failing build instead of a slow divergence.",
            bodyAr: "الهيدر والفوتر والـpreloader موجودين مرة، في partials. بيتختموا في كل صفحة بين markers، و--check بيحوّل أي تعديل يدوي لبناء فاشل بدل انحراف بطيء.",
          },
          {
            n: "03",
            title: "Arabic is generated, not translated later",
            titleAr: "العربي بيتولّد، مش بيترجم بعدين",
            body: "gen-ar.mjs builds the Arabic twin from the finished English page. The failure mode of every bilingual site — an Arabic page six months behind — is designed out of the generator.",
            bodyAr: "gen-ar.mjs بيبني النسخة العربية من الصفحة الإنجليزية المكتملة. نمط الفشل في كل موقع ثنائي اللغة — صفحة عربية متأخرة 6 شهور — مُستبعد من المولّد.",
          },
          {
            n: "04",
            title: "The build is a copy",
            titleAr: "البناء عملية نسخ",
            body: "build.sh copies files and generates .htaccess. There is no minification, no bundling, no transform that can differ from what was reviewed. What a reviewer read is what ships.",
            bodyAr: "build.sh بينسخ ملفات ويولّد .htaccess. مفيش minification ولا bundling ولا تحويل يقدر يختلف عن اللي اتراجع. اللي المراجع قراه هو اللي بيتنشر.",
          },
          {
            n: "05",
            title: "Accessibility is a matrix, not a checklist",
            titleAr: "الإتاحة مصفوفة، مش قائمة",
            body: "The axe suite runs 16 routes twice — once at 1440px in English, once at 390px in Arabic — scrolling every page to reveal below-fold sections before scanning. 32 real scans, not one homepage pass.",
            bodyAr: "سويت axe بيشغّل 16 مسار مرتين — مرة 1440px إنجليزي، ومرة 390px عربي — وبيعمل scroll لكل صفحة عشان يكشف الأقسام اللي تحت قبل الفحص. 32 فحص حقيقي، مش جوازة على الهوم.",
          },
          {
            n: "06",
            title: "Claims are registered, not asserted",
            titleAr: "الادعاءات مسجلة، مش مقدَّمة كمسلّمات",
            body: "The repo ships an ASSET-AND-CLAIM-REGISTER that labels its three SVG scope diagrams as conceptual illustrations — not screenshots, not outcome evidence — and lists what must be approved before anything stronger is published.",
            bodyAr: "الريبو فيه ASSET-AND-CLAIM-REGISTER بيوصف التلات SVG كرسوم توضيحية مفاهيمية — مش سكرين شوتس ولا دليل نتائج — وبيعدد اللي لازم يتوافق عليه قبل نشر أي ادعاء أقوى.",
          },
        ],
      }}
      rows={{
        kicker: "Delivery",
        kickerAr: "التسليم",
        title: "What a buyer can actually pick.",
        titleAr: "اللي المشتري يقدر يختاره فعلًا.",
        items: [
          { name: "AB-01 · Enterprise architecture", nameAr: "AB-01 · معمارية مؤسسات", body: "$1,000–5,000 · 2–8 weeks · roadmap and governance model, via a scoped inquiry flow.", bodyAr: "1000–5000 دولار · 2–8 أسابيع · خريطة طريق ونموذج حوكمة، عبر مسار استفسار محدد." },
          { name: "HC-03 · HIS selection advisory", nameAr: "HC-03 · استشارة اختيار HIS", body: "From $2,500 · 3–5 weeks · scored criteria and a defensible decision record.", bodyAr: "من 2500 دولار · 3–5 أسابيع · معايير مُقيّمة وسجل قرار قابل للدفاع عنه." },
          { name: "MA-03 · Full brand system", nameAr: "MA-03 · نظام هوية كامل", body: "$1,490–2,975+ · 5–7 weeks · 25–40 page guidelines plus a workshop.", bodyAr: "1490–2975+ دولار · 5–7 أسابيع · دليل 25–40 صفحة مع ورشة." },
          { name: "CC-01 · Digital launch", nameAr: "CC-01 · إطلاق رقمي", body: "From $1,500 · 6–8 weeks · identity, bilingual site and launch system together.", bodyAr: "من 1500 دولار · 6–8 أسابيع · هوية وموقع ثنائي اللغة ونظام إطلاق مع بعض." },
          { name: "CanvasOne ERP · /erp/", nameAr: "CanvasOne ERP · /erp/", body: "An interactive proposal: modules, industries, compliance, timeline, a package builder and print-to-PDF — the proposal is the product demo.", bodyAr: "عرض تفاعلي: وحدات وصناعات والتزام وتايم لاين وباني باقات وطباعة PDF — العرض نفسه هو الديمو." },
        ],
      }}
      evidence={{
        title: "Counted in the repository, this pass.",
        titleAr: "متحصّلة من الريبو، في الجولة دي.",
        items: [
          { value: "82", label: "index.html pages (41 EN + 41 AR)", labelAr: "صفحة index.html (41 إنجليزي + 41 عربي)", origin: "repo" },
          { value: "00", label: "Runtime dependencies", labelAr: "اعتمادية تشغيل", origin: "repo" },
          { value: "32", label: "axe scans (16 routes × 2 languages)", labelAr: "فحص axe (16 مسار × لغتين)", origin: "repo" },
          { value: "52", label: "Routes inventoried from the old site", labelAr: "مسار مجرّد من الموقع القديم", origin: "repo" },
        ],
        notes: [
          "The 52-route sitemap snapshot (docs/sitemap.json) was captured from the WordPress site on 2026-10-14: 40 live, 6 missing, 2 duplicate, 2 redirect, 1 auth. It is a migration inventory, not a claim about the native site's coverage.",
          "The repository's own claim register states that its three SVG work illustrations are conceptual and are not product screenshots or business-outcome evidence. This file repeats that limit rather than presenting them as case evidence.",
          "No client results, testimonials or traffic figures appear here — the repository explicitly says none were fabricated and lists them as owner-controlled publication gates.",
        ],
        notesAr: [
          "لقطة خريطة الـ52 مسار (docs/sitemap.json) اتاخدت من موقع ووردبريس في 2026-10-14: 40 حي، 6 مفقود، 2 مكرر، 2 redirect، 1 auth. دي جرد ترحيل، مش ادعاء بتغطية الموقع الأصلي.",
          "سجل الادعاءات في الريبو نفسه بيقول إن التلات رسوم التوضيحية مفاهيمية ومش سكرين شوتس ولا دليل نتائج أعمال. الملف ده بيكرر الحد ده بدل ما يقدمها كدليل.",
          "مفيش نتائج عملاء أو شهادات أو أرقام زيارات هنا — الريبو بيقول صريح إن مفيش حاجة اتلفّقت وبيعدّها كبوابات نشر يملكها المالك.",
        ],
      }}
      stack={{
        title: "HTML, CSS, and a generating script.",
        titleAr: "HTML وCSS وسكريبت بيولّد.",
        items: ["Semantic HTML", "Vanilla CSS (2,438 lines)", "Vanilla JS (2,140 lines)", "Python generator", "Node generator", "Playwright (29 tests)", "axe-core (32 scans)", "Hostinger / Vercel"],
        note: "The only `dependencies` a visitor downloads are the CSS and JS files in assets/. The generators and test tools never reach production.",
        noteAr: "الاعتماديات الوحيدة اللي الزائر بينزّلها هي ملفات CSS وJS في assets/. المولّدات وأدوات الاختبار مبتمسّش الإنتاج.",
      }}
      handoff={{
        title: "A studio site that can prove its own claims.",
        titleAr: "موقع استوديو يقدر يثبت ادعاءاته.",
        note: "Open in the repo: the owner-controlled publication gates — real screenshots for Pharmacy OS, Zad and Nile Pharma ERP, plus permission before any of them becomes case evidence.",
        noteAr: "مفتوح في الريبو: بوابات النشر اللي بيملكها المالك — سكرين شوتس حقيقية لـPharmacy OS وZad ونايل فارما ERP، وإذن قبل ما أي واحدة تبقى دليل.",
      }}
    />
  );
}
