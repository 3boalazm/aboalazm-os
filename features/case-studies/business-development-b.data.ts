import type { BusinessCaseData } from "./business-case.types";

export const BUSINESS_DEVELOPMENT_B_CASES: readonly BusinessCaseData[] = [
  /* ── 16 · NILE PHARMA FOOD STOREFRONT ───────────────────────────── */
  {
    slug: "nile-pharma-storefront",
    sector: {
      en: "Healthcare & Nutraceutical E-Commerce · Headless Storefront",
      ar: "التجارة الإلكترونية الصحية · متجر المكملات والمستحضرات الدوائية",
    },
    headline: {
      en: "Giving a supplements and pharma brand a bilingual direct-to-consumer store where marketing edits health content freely without risking live product prices or stock.",
      ar: "منصة بيع مباشر ثنائية اللغة لشركة مكملات ومستحضرات صحية تفصل بين تحرير المحتوى التوعوي وبين دقة الأسعار والمخزون والطلبات الحية.",
    },
    summary: {
      en: "Nile Pharma Food Storefront is the modern commerce platform for Nile Pharma Food's consumer health and dietary supplement lines. It solves a classic regulated-commerce tension: content marketers need rich bilingual educational pages, ingredient breakdowns, and articles (managed in Payload CMS), while operations need strict SKU pricing, stock availability, cart, checkout, and customer order history (managed in Vendure).",
      ar: "تمثل واجهة متجر (نايل فارما فود) المنصة الرقمية الحديثة للبيع المباشر وعرض خطوط المكملات الغذائية والمستحضرات الصحية للشركة. يعالج المشروع معادلة حساسة في التجارة الصحية: تمكين فريق التسويق من نشر صفحات توعوية غنية ومكونات علمية ومقالات باللغتين عبر (Payload CMS)، مع إبقاء الأسعار وأرصدة المخزون والسلة وحسابات العملاء تحت ضبط محرك تجاري صارم (Vendure).",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Consumer Health & Dietary Supplements Commerce",
          ar: "تجارة المكملات الغذائية ومنتجات الرعاية الصحية",
        },
      },
      {
        label: { en: "Users & Operators", ar: "المستخدمون والمشغّلون" },
        value: {
          en: "Health shoppers, content editors & e-commerce managers",
          ar: "المستهلكون، فريق المحتوى الطبي، وإدارة التجارة الإلكترونية",
        },
      },
      {
        label: { en: "Core Business Value", ar: "القيمة التجارية" },
        value: {
          en: "Trusted ingredient education + safe SKU/price governance",
          ar: "توعية صحية موثوقة للمشتري + حماية الأسعار والطلبات من الخطأ",
        },
      },
      {
        label: { en: "Current Stage", ar: "مرحلة التنفيذ الحالية" },
        value: {
          en: "Active build · Live storefront preview (gateway gates open)",
          ar: "قيد الاستكمال · واجهة المتجر متاحة للمعاينة (بانتظار بوابات الدفع)",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why supplement & health stores struggle on standard templates",
        ar: "لماذا تعاني متاجر المكملات الصحية مع القوالب التقليدية",
      },
      beforePoints: [
        {
          en: "Shoppers don't buy health supplements impulse-style like T-shirts—they need clear dosage instructions, active ingredients, usage precautions, and scientific trust first.",
          ar: "المستهلك لا يشتري مكملًا غذائيًا بشكل عشوائي؛ بل يحتاج أولًا لقراءة التركيبة، طريقة الاستخدام، الفوائد، ومحاذير الاستعمال بوضوح وثقة.",
        },
        {
          en: "In monolithic WooCommerce/WordPress stores, a content editor updating a banner or blog post can accidentally break product variants, tax rules, or checkout plugins.",
          ar: "في المتاجر التقليدية المدمجة، قد يؤدي تعديل بسيط يجريه محرر المحتوى على صفحة تسويقية إلى إرباك أسعار الأصناف أو تعطيل إضافات السلة.",
        },
        {
          en: "Bilingual health copy requires careful Arabic RTL and English presentation so dosage numbers and units never flip or misread.",
          ar: "المحتوى الصحي ثنائي اللغة يتطلب ضبطًا دقيقًا لاتجاه الأرقام والجرعات والوحدات بالعربية والإنجليزية لمنع أي لبس لدى المشتري.",
        },
      ],
      afterTitle: {
        en: "How the dual Content + Commerce setup works",
        ar: "كيف تعمل بنية فصل المحتوى عن المحرك التجاري",
      },
      afterPoints: [
        {
          en: "Separates responsibilities cleanly: Payload CMS owns bilingual articles, FAQs, and rich product storytelling; Vendure owns live SKUs, stock, cart, and orders.",
          ar: "فصل واضح للصلاحيات: نظام Payload CMS لإدارة القصص العلمية والمقالات والصفحات، ومحرك Vendure لضبط الأصناف والمخزون والسلة والطلبات.",
        },
        {
          en: "Presents products in a clean 'Carved Glass' clinical-editorial interface that highlights benefits, ingredients, and pack sizes clearly.",
          ar: "تقديم المنتجات في واجهة تجمع الوقار الطبي والوضوح البصري لإبراز المكونات وحجم العبوة وطريقة الاستخدام.",
        },
        {
          en: "Includes built-in operational safeguards so if a backend service slows down, product pages degrade gracefully instead of showing raw crash screens.",
          ar: "تضمين ضوابط حماية تشغيلية تضمن بقاء التصفح مستقرًا وواضحًا للزائر حتى في حال تأخر استجابة إحدى الخدمات الخلفية.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Health-Conscious Consumers", ar: "المشترون والمهتمون بالصحة" },
          benefit: {
            en: "Read clear Arabic/English product guidance, compare packs, manage saved addresses/orders, and shop without pharmacy shelf guesswork.",
            ar: "قراءة معلومات المنتج والجرعات بوضوح بلغتين، مقارنة العبوات، ومتابعة الطلبات السابقة من حساب شخصي منظم.",
          },
        },
        {
          role: { en: "Medical Marketing & Content Team", ar: "فريق التسويق والمحتوى الطبي" },
          benefit: {
            en: "Publish educational campaigns, seasonal bundles, and bilingual landing sections independently without touching pricing or inventory tables.",
            ar: "نشر المقالات الصحية وحملات التوعية وتحديث الواجهات بحرية دون المساس بجداول الأسعار أو المخزون.",
          },
        },
        {
          role: { en: "E-Commerce & Fulfillment Ops", ar: "إدارة المبيعات والتشغيل" },
          benefit: {
            en: "Centralized control over SKU stock levels, order statuses, promotions, and customer accounts inside Vendure.",
            ar: "تحكم مركزي كامل في أرصدة الأصناف، الكوبونات، حالات تجهيز الطلبات، وحسابات العملاء.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a customer shops and how the internal team operates the storefront:",
      ar: "كيف يسير العمل بين فريق الشركة والمشتري داخل المنصة:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Editorial & Catalog Prep", ar: "نشر المحتوى وربط الأصناف" },
        title: {
          en: "Marketing enriches pages in Payload while Ops sets SKUs in Vendure",
          ar: "إثراء المحتوى العلمي في CMS وضبط الأسعار والمخزون في محرك التجارة",
        },
        detail: {
          en: "Each product pairs live stock and pricing from the commerce engine with structured bilingual benefits, usage instructions, and media.",
          ar: "يرتبط كل مستحضر بسعره ورصيده الحي من محرك التجارة مع شرح فوائده ومكوناته بالعربية والإنجليزية من نظام المحتوى.",
        },
      },
      {
        step: "02",
        actor: { en: "Guided Discovery", ar: "البحث واستكشاف المستحضرات" },
        title: {
          en: "Browsing categories, health goals & transparent product specs",
          ar: "تصفح الأقسام الصحية ومراجعة تفاصيل التركيبة والاستخدام",
        },
        detail: {
          en: "Shoppers filter by health category, read clear bilingual product breakdowns, and check live stock availability before adding to cart.",
          ar: "يستعرض الزائر المنتجات حسب الاحتياج الصحي، يقرأ التفاصيل بوضوح، ويتحقق من التوفر الفوري قبل الإضافة للسلة.",
        },
      },
      {
        step: "03",
        actor: { en: "Cart & Checkout", ar: "السلة وإتمام الطلب" },
        title: {
          en: "Session-backed cart, shipping details & order confirmation",
          ar: "مراجعة السلة، إدخال عنوان التوصيل، وتأكيد الطلب",
        },
        detail: {
          en: "The storefront maintains active cart sessions across refreshes, validates stock and totals on the server, and records the customer order.",
          ar: "تحتفظ السلة بمحتوياتها بدقة، ويتحقق الخادم من الأسعار وتوفر الكميات قبل تثبيت الطلب باسم العميل.",
        },
      },
      {
        step: "04",
        actor: { en: "Account & Reorder", ar: "حساب العميل وإعادة الطلب" },
        title: {
          en: "Order tracking & easy repeat supplement purchases",
          ar: "متابعة حالة التوصيل وسهولة تكرار شراء المكملات الشهرية",
        },
        detail: {
          en: "Because supplements are recurring monthly purchases, customers can sign in to view past orders and reorder quickly.",
          ar: "نظرًا لأن المكملات الغذائية تُستهلك شهريًا، يتيح حساب العميل مراجعة مشترياته السابقة وإعادة طلبها بسهولة.",
        },
      },
    ],
    featuresIntro: {
      en: "Practical commercial advantages of the Nile Pharma Storefront:",
      ar: "أهم المميزات التجارية والتشغيلية للمتجر:",
    },
    features: [
      {
        tag: { en: "Safe Team Separation", ar: "فصل آمن بين المحتوى والمبيعات" },
        title: {
          en: "Marketing edits never jeopardize live SKU pricing or stock",
          ar: "تحديث المحتوى التسويقي لا يؤثر على دقة الأسعار أو المخزون",
        },
        body: {
          en: "Payload CMS and Vendure each do what they do best, connected cleanly through a fast Next.js storefront.",
          ar: "كل فريق يعمل في مساحته المخصصة بأمان، وتجمع واجهة المتجر السريعة بينهما أمام المشتري بسلاسة.",
        },
      },
      {
        tag: { en: "Clinical Trust UX", ar: "واجهة تبني الثقة الصحية" },
        title: {
          en: "Designed for informed health purchases, not noisy flash sales",
          ar: "مصممة للشراء الصحي الواعي بعيدًا عن ضجيج المتاجر العشوائية",
        },
        body: {
          en: "Prioritizes legibility of active ingredients, pack sizes, and usage directions across mobile and desktop.",
          ar: "تمنح الأولوية لوضوح المواد الفعالة وحجم العبوة وإرشادات الاستخدام على الهاتف وسطح المكتب.",
        },
      },
      {
        tag: { en: "Native Bilingual", ar: "ثنائي اللغة بالكامل" },
        title: {
          en: "Full Arabic RTL & English LTR shopping and account flows",
          ar: "رحلة تسوق وحساب عميل كاملة بالعربية والإنجليزية",
        },
        body: {
          en: "Serves local Arabic-first households and English-preferring shoppers with equal polish.",
          ar: "تخدم المستهلك المحلي باللغة العربية أو الإنجليزية بنفس الدقة والتنظيم البصري.",
        },
      },
      {
        tag: { en: "Resilient Storefront", ar: "ثبات واستقرار الواجهة" },
        title: {
          en: "Graceful fallback handling protects campaign traffic",
          ar: "حماية زيارات الحملات الإعلانية من التوقف المفاجئ",
        },
        body: {
          en: "Explicit health checks and fallback states keep product discovery clean rather than crashing during backend maintenance.",
          ar: "آليات فحص واستجابة ذكية تحافظ على عمل صفحات العرض بوضوح دون شاشات خطأ تربك الزائر.",
        },
      },
      {
        tag: { en: "Repeat Purchase Fit", ar: "مهيّأ لتكرار الشراء الشهري" },
        title: {
          en: "Customer accounts, saved addresses & order history",
          ar: "حسابات عملاء وعناوين محفوظة وسجل طلبات واضح",
        },
        body: {
          en: "Reduces friction when customers return every 30 days to replenish vitamins or Proxeed courses.",
          ar: "يسهّل عودة العميل شهريًا لتجديد كورس الفيتامينات أو المكملات بخطوات مختصرة.",
        },
      },
      {
        tag: { en: "Brand Continuity", ar: "امتداد لهوية نايل فارما" },
        title: {
          en: "Carries the 5-year Nile Pharma Food visual system online",
          ar: "ترجمة رقمية متسقة مع هوية وتغليف نايل فارما فود",
        },
        body: {
          en: "Matches the physical boxes customers see in pharmacies, reinforcing authenticity against counterfeit supplements.",
          ar: "تتطابق بصريًا مع العبوات الفعلية في الصيدليات، ما يعزز اطمئنان العميل لأصالة المنتج.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "In Progress · Storefront Preview Live (Release Gates Documented)",
        ar: "قيد الاستكمال · واجهة المعاينة حية (بوابات الإطلاق النهائي موثقة)",
      },
      summary: {
        en: "The bilingual storefront, CMS integration, and commerce flows are deployed for preview; production payment gateway activation, SMS OTP verification, and final merchant cutover remain open pre-launch gates.",
        ar: "واجهة المتجر ثنائية اللغة وربط المحتوى ومسارات الشراء منشورة للمعاينة؛ وتبقى خطوات تفعيل بوابة الدفع البنكي الفعلية ورسائل التحقق النصية ضمن بوابات الإطلاق التجاري النهائي.",
      },
      highlights: [
        {
          en: "Live deployed preview available via the button on this page",
          ar: "رابط معاينة حي للمتجر متاح للتجربة من هذه الصفحة",
        },
        {
          en: "Open release gates transparently listed in the Technical Case Study tab",
          ar: "بوابات الإطلاق المتبقية موثقة بشفافية في تبويب دراسة الحالة التقنية",
        },
      ],
    },
  },

  /* ── 17 · ZAD (زاد) ─────────────────────────────────────────────── */
  {
    slug: "zad",
    sector: {
      en: "Consumer Mobile PWA · Ad-Free Daily Worship & Family Companion",
      ar: "تطبيقات الحياة اليومية · رفيق العبادة اليومي والعائلي (بدون إعلانات)",
    },
    headline: {
      en: "An ad-free, offline-first Arabic worship companion uniting prayer times, 604-page Mushaf & Khatma plans, adhkar, and a dedicated children's learning space across 64 screens.",
      ar: "تطبيق عبادة يومي عربي يعمل بدون إنترنت وبدون إعلانات عبر 64 شاشة تجمع مواقيت الصلاة، المصحف وخطط الختمة، الأذكار، وواحة تعليمية مخصصة للأطفال.",
    },
    summary: {
      en: "Zad (زاد) is an installable Islamic daily companion built to replace four or five ad-cluttered utility apps with one calm, private Arabic experience. It works offline after installation—calculating local GPS prayer times and Qibla direction, providing a full 604-page Mushaf with customizable Khatma completion plans, morning/evening adhkar, a persistent floating tasbih counter, Ramadan/worship trackers, and 'Thuraya' (واحة ثريا), a safe interactive learning space for kids.",
      ar: "صُمّم تطبيق (زاد - Zad) ليكون رفيق عبادة يوميًا متكاملًا يغني المستخدم وأسرته عن تثبيت أربعة أو خمسة تطبيقات مليئة بالإعلانات المزعجة وتتبع البيانات. يعمل التطبيق بكفاءة بدون اتصال بالإنترنت بعد تثبيته على الهاتف، موفرًا مواقيت الصلاة الدقيقة واتجاه القبلة، المصحف الكامل (604 صفحات) مع خطط الختمة، الأذكار اليومية، السبحة العائمة، متابعة الورد الرمضاني واليومي، بالإضافة إلى (واحة ثريا) التربوية المخصصة للأطفال.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Consumer Lifestyle, Worship & Family Education PWA",
          ar: "تطبيقات العبادة اليومية والتربية الأسرية",
        },
      },
      {
        label: { en: "Target Users", ar: "المستخدمون" },
        value: {
          en: "Arabic-speaking individuals, parents & young children",
          ar: "الأفراد والأسر العربية والأطفال في مختلف الأعمار",
        },
      },
      {
        label: { en: "Core Product Promise", ar: "القيمة الأساسية للمستخدم" },
        value: {
          en: "Zero ads · Works offline · Optional manual cloud backup",
          ar: "خالٍ تمامًا من الإعلانات · يعمل بدون إنترنت · خصوصية كاملة",
        },
      },
      {
        label: { en: "Product Breadth", ar: "حجم المنتج" },
        value: {
          en: "64 dedicated screens across Quran, Prayer, Adhkar & Kids",
          ar: "64 شاشة تغطي الصلاة والقرآن والأذكار والطفل والمتابعة",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "What breaks trust in popular religious utility apps",
        ar: "ما الذي يفسد تجربة المستخدم في تطبيقات العبادة المنتشرة",
      },
      beforePoints: [
        {
          en: "Many popular prayer and Quran apps interrupt adhkar or recitation with full-screen pop-up video ads and third-party ad trackers.",
          ar: "مقاطعة لحظات قراءة القرآن أو الأذكار بإعلانات منبثقة مزعجة وغير ملائمة مع تتبع مستمر لموقع وبيانات المستخدم.",
        },
        {
          en: "Apps that depend on constant internet fail inside mosques, basements, airplanes, or during travel when signal drops.",
          ar: "تعطل المصحف أو الأذكار أو عداد التسبيح داخل المساجد أو أثناء السفر وضعف الشبكة بسبب الاعتماد الكلي على الإنترنت.",
        },
        {
          en: "Users juggle separate apps for prayer times, Mushaf reading, Khatma reminders, and children's Islamic stories.",
          ar: "اضطرار الأسرة لتحميل عدة تطبيقات منفصلة: واحد للمواقيت، وآخر للمصحف، وثالث للأذكار، ورابع لتعليم الأطفال.",
        },
      ],
      afterTitle: {
        en: "How Zad delivers a calm, all-in-one daily habit",
        ar: "كيف يقدّم (زاد) تجربة يومية هادئة ومتكاملة",
      },
      afterPoints: [
        {
          en: "Strictly zero ads and zero mandatory sign-up—everything saves locally on the user's device first, with optional manual cloud sync only if desired.",
          ar: "خلو تام من الإعلانات أو إجبار المستخدم على إنشاء حساب؛ تُحفظ كل البيانات محليًا على الهاتف مع خيار نسخ احتياطي يدوي عند الرغبة فقط.",
        },
        {
          en: "Offline-first engineering caches all 64 screens, prayer calculations, adhkar, and Quran progress so it opens instantly anywhere.",
          ar: "عمل فوري بدون إنترنت يشمل حساب المواقيت، الأذكار، ومتابعة الورد اليومي في أي مكان ودون استهلاك باقة البيانات.",
        },
        {
          en: "Includes 'Thuraya'—a dedicated, gentle children's mode with age-appropriate worship habits and stories inside the same family app.",
          ar: "تضمين (واحة ثريا) كمساحة آمنة وجذابة لتشجيع الأطفال على الصلاة والأذكار والقصص الهادفة ضمن نفس التطبيق العائلي.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Daily Worshippers & Commuters", ar: "المستخدم اليومي في البيت والعمل والسفر" },
          benefit: {
            en: "Instant prayer countdowns, Qibla compass, morning/evening adhkar, and exact Mushaf page bookmarking offline.",
            ar: "الوصول الفوري لمواقيت الصلاة، القبلة، أذكار الصباح والمساء، وموضع التوقف في المصحف في ثوانٍ وبدون شبكة.",
          },
        },
        {
          role: { en: "Ramadan & Khatma Planners", ar: "المواظبون على خطط الختمة ورمضان" },
          benefit: {
            en: "Structured daily reading targets across the 604-page Mushaf plus worship habit streaks that adjust smoothly if a day is missed.",
            ar: "تقسيم عملي للورد القرآني عبر 604 صفحات ومتابعة يومية للعبادات تساعد على الاستمرار دون تعقيد.",
          },
        },
        {
          role: { en: "Parents & Young Children", ar: "الأمهات والآباء والأطفال" },
          benefit: {
            en: "A distraction-free, ad-free kids oasis (Thuraya) parents can hand to a child with complete peace of mind.",
            ar: "مساحة تفاعلية آمنة وخالية من أي إعلانات أو روابط خارجية يمكن تسليمها للطفل باطمئنان تام.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How Zad supports a user's day from Fajr through evening reflection:",
      ar: "كيف يرافق (زاد) يوم المستخدم وأسرته من الفجر وحتى المساء:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Install & Location", ar: "التثبيت وضبط المواقيت" },
        title: {
          en: "One-tap phone install & local prayer calculation",
          ar: "تثبيت مباشر على الشاشة الرئيسية وضبط الموقع وطريقة الحساب",
        },
        detail: {
          en: "Users open the link, add Zad to their home screen like a native app, and set their city/GPS calculation method with zero account registration.",
          ar: "يُثبّت التطبيق من المتصفح مباشرة على شاشة الهاتف ويضبط المواقيت حسب المدينة أو GPS فورًا دون طلب بريد أو كلمة مرور.",
        },
      },
      {
        step: "02",
        actor: { en: "Prayer & Adhkar", ar: "الصلاة والأذكار اليومية" },
        title: {
          en: "Next-prayer countdown, Qibla check, Adhkar & floating Tasbih",
          ar: "متابعة الصلاة القادمة، القبلة، الأذكار، والسبحة العائمة",
        },
        detail: {
          en: "Throughout the day, the home hub surfaces the current worship window—sunrise/evening adhkar, prayer times, and a one-thumb tasbih counter.",
          ar: "تعرض الشاشة الرئيسية بذكاء ما يحتاجه المستخدم في وقته الحالي من أذكار الصباح أو المساء والعداد التنازلي للصلاة والسبحة السريعة.",
        },
      },
      {
        step: "03",
        actor: { en: "Quran & Khatma", ar: "الورد القرآني والختمة" },
        title: {
          en: "Reading in the 604-page Mushaf & logging Khatma progress",
          ar: "القراءة في المصحف الكامل ومتابعة تقدم الختمة",
        },
        detail: {
          en: "Readers pick up right at their last ayah/page, listen to recitations when online, and mark daily Khatma portions complete.",
          ar: "يفتح القارئ مصحفه مباشرة على آخر صفحة توقف عندها، ويتابع نسبة إنجازه في خطة الختمة المحددة.",
        },
      },
      {
        step: "04",
        actor: { en: "Family & Backup", ar: "واحة الطفل والنسخ الاحتياطي" },
        title: {
          en: "Kids explore Thuraya & adults optionally sync progress",
          ar: "تفاعل الأبناء في (واحة ثريا) وحفظ التقدم اختياريًا",
        },
        detail: {
          en: "Children engage with simplified adhkar and learning activities in Thuraya, while users changing phones can trigger a manual backup sync.",
          ar: "يتعلم الطفل الأذكار والآداب بأسلوب مبسط في واحة ثريا، ويمكن للمستخدم عمل مزامنة سحابية يدوية متى أراد نقل بياناته لجهاز آخر.",
        },
      },
    ],
    featuresIntro: {
      en: "Standout product features across Zad's 64 screens:",
      ar: "أبرز المميزات العملية عبر شاشات تطبيق (زاد) الـ 64:",
    },
    features: [
      {
        tag: { en: "Ad-Free Forever", ar: "نقاء التجربة وغياب الإعلانات" },
        title: {
          en: "Zero banner ads, pop-ups, or invasive tracking",
          ar: "صفر إعلانات تجارية أو نوافذ منبثقة تقطع الخشوع",
        },
        body: {
          en: "Respects the spiritual context of reading Quran and adhkar with a serene, uninterrupted interface.",
          ar: "يحترم قدسية وقت العبادة والذكر بتصميم هادئ ومريح للعين دون أي مشتتات تجارية.",
        },
      },
      {
        tag: { en: "True Offline-First", ar: "جاهزية العمل بلا إنترنت" },
        title: {
          en: "Prayer times, adhkar, trackers & UI work with Airplane Mode on",
          ar: "يعمل بكفاءة في وضع الطيران وداخل المساجد وأثناء السفر",
        },
        body: {
          en: "Local storage and Service Worker caching keep daily worship tools responsive without network signal.",
          ar: "تُحفظ الشاشات والحسابات محليًا ليبقى التطبيق سريعًا وجاهزًا في كل الظروف دون انتظار اتصال.",
        },
      },
      {
        tag: { en: "604-Page Mushaf", ar: "المصحف وخطط الختم" },
        title: {
          en: "Full Mushaf navigation + flexible Khatma scheduler",
          ar: "مصحف كامل من 604 صفحات مع منظم ذكي للختمة",
        },
        body: {
          en: "Set a target number of days, see your exact daily page range, and resume reading in one tap.",
          ar: "حدّد مدة الختمة المستهدفة ليعرض لك التطبيق وردك اليومي بالصفحات مع حفظ تلقائي لعلامة التوقف.",
        },
      },
      {
        tag: { en: "Thuraya Kids Space", ar: "واحة ثريا للأطفال" },
        title: {
          en: "Dedicated child-friendly Islamic learning oasis",
          ar: "ركن تربوي تفاعلي مصمم خصيصًا لتحبيب الأطفال في العبادة",
        },
        body: {
          en: "Gives families a safe, warm environment introducing young kids to daily prayers, short surahs, and good manners.",
          ar: "يقدم للأبناء محتوى مبسطًا وجذابًا يغرس حب الصلاة والأذكار والأخلاق في بيئة آمنة تمامًا.",
        },
      },
      {
        tag: { en: "Floating Tasbih", ar: "السبحة العائمة والعدادات" },
        title: {
          en: "Persistent dhikr counter with tactile feedback",
          ar: "مسبحة رقمية مريحة بيد واحدة مع حفظ تلقائي للأعداد",
        },
        body: {
          en: "Accessible quickly without losing your place elsewhere in the app, tracking daily and cumulative dhikr totals.",
          ar: "تتيح التسبيح بسهولة في أي وقت مع تتبع العدد اليومي والإجمالي دون ضياع موضع التصفح.",
        },
      },
      {
        tag: { en: "Privacy by Design", ar: "الخصوصية أولًا" },
        title: {
          en: "Local-first data with explicit manual-only cloud sync",
          ar: "بياناتك ملكك على جهازك مع مزامنة يدوية باختيارك فقط",
        },
        body: {
          en: "Worship logs stay private on the phone unless the user explicitly chooses to back up or restore across devices.",
          ar: "تظل سجلات عبادتك وأورادك محفوظة على هاتفك وحده، ولا تُرفع سحابيًا إلا إذا اخترت النسخ الاحتياطي بنفسك.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Installable PWA (64 Screens)",
        ar: "تطبيق ويب تقدمي (PWA) حي ومتاح للتثبيت والتجربة",
      },
      summary: {
        en: "Live and publicly accessible via the preview link on phones and desktop—installable straight from Safari or Chrome with no app-store barriers.",
        ar: "التطبيق منشور ومتاح للاستخدام الفوري والتثبيت المباشر على الهواتف (آيفون وأندرويد) وأجهزة الكمبيوتر عبر رابط المعاينة.",
      },
      highlights: [
        {
          en: "64 complete Arabic RTL screens live in production",
          ar: "64 شاشة عربية متكاملة تعمل فعليًا ومتاحة للمعاينة",
        },
        {
          en: "Installs directly to phone home screen & runs offline",
          ar: "يُثبّت على الشاشة الرئيسية للهاتف ويعمل بدون اتصال بالإنترنت",
        },
      ],
    },
  },

  /* ── 18 · MINI EXAM ─────────────────────────────────────────────── */
  {
    slug: "mini-exam",
    sector: {
      en: "EdTech & Tutoring Operations · Assessment & Grading Platform",
      ar: "تقنيات التعليم والدروس · نظام بناء الاختبارات والتصحيح الفوري",
    },
    headline: {
      en: "Letting teachers build quizzes in minutes, share one link on WhatsApp with zero student sign-up, grade securely on the server, and send formatted score reports.",
      ar: "تمكين المعلمين من إنشاء الاختبارات في دقائق، ومشاركتها برابط واحد على واتساب بدون تسجيل حسابات للطلاب، مع تصحيح آمن على الخادم وتقارير نتائج جاهزة.",
    },
    summary: {
      en: "Mini Exam is an assessment studio built around how private tutors, school teachers, and training instructors in Egypt and MENA actually run classes. Teachers generate questions from lesson material (via AI or question bank), review and approve every question before publishing, and drop a single exam link into their student WhatsApp group; students enter their name and take the test immediately, answers are graded tamper-proof on the server, and results format cleanly for WhatsApp follow-up.",
      ar: "صُمّمت منصة (Mini Exam) لتناسب الطريقة الواقعية التي يدير بها المعلمون والمحاضرون اختبارات طلابهم في مصر والمنطقة العربية. يولّد المعلم الأسئلة من محتوى الدرس بالذكاء الاصطناعي أو بنك الأسئلة، يراجع ويعتمد كل سؤال بنفسه قبل النشر، ثم يرسل رابطًا واحدًا على مجموعة واتساب؛ يدخل الطالب اسمه ويحل الاختبار فورًا دون تعقيد إنشاء حساب، ليتم التصحيح بأمان على الخادم وتجهيز تقرير النتيجة للإرسال عبر واتساب.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "K-12 Tutoring, Exam Prep & Course Assessments",
          ar: "التعليم المدرسي، المراجعات، واختبارات الدورات التدريبية",
        },
      },
      {
        label: { en: "Primary Users", ar: "المستخدمون" },
        value: {
          en: "Teachers/tutors (creators) & students/parents (recipients)",
          ar: "المعلمون والمحاضرون + الطلاب وأولياء الأمور",
        },
      },
      {
        label: { en: "Adoption Secret", ar: "سر سهولة الاستخدام" },
        value: {
          en: "Zero student accounts/passwords + native WhatsApp workflow",
          ar: "بدون حسابات أو كلمات مرور للطلاب + تكامل مع واتساب",
        },
      },
      {
        label: { en: "Assessment Integrity", ar: "نزاهة ودقة التقييم" },
        value: {
          en: "Mandatory teacher review + server-only answer keys",
          ar: "مراجعة إلزامية للمعلم قبل النشر + إخفاء الإجابات على الخادم",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why Google Forms and heavy LMS platforms fail everyday teachers",
        ar: "لماذا يعاني المعلمون مع نماذج جوجل أو المنصات التعليمية المعقدة",
      },
      beforePoints: [
        {
          en: "Full LMS portals force 100+ students to register emails and reset forgotten passwords—half the class drops off before opening the quiz.",
          ar: "المنصات الضخمة تجبر الطلاب على إنشاء حسابات وتذكر كلمات مرور، ما يضيع نصف وقت الحصة في حل مشاكل الدخول.",
        },
        {
          en: "Typing 20 fresh multiple-choice, true/false, and short-answer questions from scratch after every lesson drains hours of a teacher's evening.",
          ar: "كتابة وإعداد اختبار جديد متنوع الأسئلة يدويًا بعد كل حصة يستنزف ساعات طويلة من وقت المعلم أسبوعيًا.",
        },
        {
          en: "Simple client-side quiz pages leak correct answers in browser source code, while raw AI quiz generators embarrass teachers with unreviewed mistakes.",
          ar: "الاختبارات البسيطة قد تكشف الإجابات الصحيحة داخل المتصفح، كما أن نشر أسئلة ذكاء اصطناعي دون مراجعة يعرّض المعلم لأخطاء علمية محرجة.",
        },
      ],
      afterTitle: {
        en: "How Mini Exam streamlines the entire quiz cycle",
        ar: "كيف تختصر المنصة وقت المعلم وتضمن دقة الاختبار",
      },
      afterPoints: [
        {
          en: "Offers two fast creation modes (AI generation with strict schema validation + structured question bank) across 4 question types, gated by mandatory teacher review before publish.",
          ar: "توليد سريع للأسئلة عبر الذكاء الاصطناعي المحكوم أو بنك الأسئلة بـ 4 أنماط مختلفة، مع خطوة مراجعة وتعديل إلزامية بيد المعلم قبل النشر.",
        },
        {
          en: "Students open one link from WhatsApp on any phone, type their name/code, and complete the timed or untimed exam with zero login friction.",
          ar: "يفتح الطالب الرابط من واتساب على هاتفه مباشرة ويكتب اسمه ويبدأ الحل في ثوانٍ دون أي عوائق تسجيل.",
        },
        {
          en: "Keeps correct answers strictly on the server—never sent to the student's browser before submission—and produces ready-to-share WhatsApp score cards for students and parents.",
          ar: "الاحتفاظ بنموذج الإجابة على الخادم فقط لمنع الغش التقني، مع إصدار ملخص نتيجة منسق وجاهز للمشاركة عبر واتساب مع الطالب أو ولي الأمر.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Teachers & Private Tutors", ar: "المعلمون ومقدمو المراجعات" },
          benefit: {
            en: "Cut quiz prep from hours to minutes, stay 100% in control of final wording, and eliminate manual paper grading.",
            ar: "توفير ساعات إعداد وتصحيح الامتحانات الأسبوعية مع الاحتفاظ بالقرار النهائي في صياغة كل سؤال.",
          },
        },
        {
          role: { en: "Students on Mobile Phones", ar: "الطلاب عبر الهواتف المحمولة" },
          benefit: {
            en: "Clean, fast Arabic/English exam screen that opens directly from their class group without app downloads or forgotten passwords.",
            ar: "واجهة اختبار واضحة وسريعة تفتح من رابط المجموعة مباشرة دون تحميل تطبيقات أو نسيان كلمات سر.",
          },
        },
        {
          role: { en: "Parents & Teaching Assistants", ar: "المساعدون وأولياء الأمور" },
          benefit: {
            en: "Clear score breakdowns and formatted WhatsApp result messages make weekly student follow-up effortless.",
            ar: "تقارير درجات واضحة ورسائل نتائج جاهزة للإرسال تسهل متابعة مستوى الطالب أولًا بأول.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How an exam runs from lesson notes to parent/student WhatsApp report:",
      ar: "دورة الاختبار كاملة من تحضير الدرس وحتى إرسال النتيجة على واتساب:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Teacher · Draft", ar: "المعلم · إعداد الأسئلة" },
        title: {
          en: "Generate via AI or pull from bank across 4 question types",
          ar: "توليد الأسئلة بالذكاء الاصطناعي أو اختيارها بـ 4 أنماط متنوعة",
        },
        detail: {
          en: "Supports Multiple Choice, True/False, Short Answer, and Ordering/Fill-in items in Arabic or English.",
          ar: "يدعم الاختيار من متعدد، الصواب والخطأ، الإجابات القصيرة، وأسئلة الترتيب أو الإكمال بالعربية والإنجليزية.",
        },
      },
      {
        step: "02",
        actor: { en: "Teacher · Gate", ar: "المعلم · المراجعة والاعتماد" },
        title: {
          en: "Review, edit points/wording & publish a shareable exam link",
          ar: "مراجعة صياغة الأسئلة والدرجات قبل إصدار رابط النشر",
        },
        detail: {
          en: "No AI output goes live automatically—the teacher inspects answers, adjusts grades or timers, and publishes with confidence.",
          ar: "لا يُنشر أي سؤال آليًا؛ يدقق المعلم الصياغة والإجابة النموذجية ويضبط الوقت والدرجة ثم يعتمد النشر.",
        },
      },
      {
        step: "03",
        actor: { en: "Student · Sit Exam", ar: "الطالب · أداء الاختبار" },
        title: {
          en: "Open link from WhatsApp & submit answers with zero sign-up",
          ar: "فتح الرابط من واتساب والحل الفوري بدون حساب مسبق",
        },
        detail: {
          en: "Students receive only the questions and options—answer keys never touch the browser DOM or network tab.",
          ar: "يستلم متصفح الطالب الأسئلة فقط دون أي وجود للإجابات الصحيحة في الكود لضمان نزاهة التقييم.",
        },
      },
      {
        step: "04",
        actor: { en: "Server · Grade & Report", ar: "الخادم · التصحيح والتقرير" },
        title: {
          en: "Instant server-side grading & formatted WhatsApp result summary",
          ar: "تصحيح لحظي على الخادم وتجهيز رسالة النتيجة لواتساب",
        },
        detail: {
          en: "Submissions are scored on the server, recorded on the teacher's dashboard, and formatted into a clean one-click WhatsApp report.",
          ar: "تُصحح الإجابات فور الإرسال وتظهر في لوحة المعلم مع ملخص منسق جاهز للإرسال المباشر عبر واتساب.",
        },
      },
    ],
    featuresIntro: {
      en: "Practical advantages that make Mini Exam work in real classrooms:",
      ar: "أهم المميزات العملية لمنصة Mini Exam:",
    },
    features: [
      {
        tag: { en: "Zero Student Login", ar: "بدون تسجيل حساب للطالب" },
        title: {
          en: "100% completion focus—no passwords to forget",
          ar: "دخول فوري بالاسم يرفع نسبة التزام الطلاب بحل الاختبار",
        },
        body: {
          en: "Built for real student WhatsApp and Telegram groups where any extra registration step cuts participation in half.",
          ar: "مصمم خصيصًا لبيئة مجموعات واتساب وتليجرام التعليمية حيث يمثل السهولة والسرعة عامل الحسم.",
        },
      },
      {
        tag: { en: "Teacher-in-the-Loop AI", ar: "ذكاء اصطناعي تحت إشراف المعلم" },
        title: {
          en: "AI speeds up drafting, but the teacher always signs off",
          ar: "الذكاء الاصطناعي يقترح المسودة والمعلم يملك قرار الاعتماد",
        },
        body: {
          en: "Combines schema-validated AI question drafting with full manual editing so academic accuracy is never compromised.",
          ar: "يجمع سرعة التوليد الآلي مع المراجعة اليدوية الكاملة لضمان خلو الامتحان من أي خطأ علمي.",
        },
      },
      {
        tag: { en: "Cheat-Resistant Grading", ar: "حماية نموذج الإجابة" },
        title: {
          en: "Answer keys stay strictly on the server",
          ar: "تصحيح كامل على الخادم يمنع استخراج الإجابات من المتصفح",
        },
        body: {
          en: "Even tech-savvy students inspecting page source cannot see correct answers before submitting.",
          ar: "لا تُرسل الإجابات الصحيحة أبدًا إلى جهاز الطالب أثناء الحل، ما يحمي مصداقية الدرجات.",
        },
      },
      {
        tag: { en: "WhatsApp Native Output", ar: "تقارير مهيأة لواتساب" },
        title: {
          en: "One-click formatted score messages for parents & groups",
          ar: "نتائج منسقة وجاهزة للمشاركة الفورية مع الطالب وولي الأمر",
        },
        body: {
          en: "Meets teachers and parents on the exact communication channel they already use every day.",
          ar: "تخاطب المعلم وولي الأمر عبر وسيلة التواصل اليومية المعتمدة فعلًا دون إجبارهم على بوابات معقدة.",
        },
      },
      {
        tag: { en: "4 Question Formats", ar: "تنوع أنماط الأسئلة" },
        title: {
          en: "Beyond simple MCQ—supports 4 structured question types",
          ar: "دعم 4 أنواع من الأسئلة لقياس الفهم الحقيقي",
        },
        body: {
          en: "Tests recall, comprehension, and written terms rather than relying solely on four-option guessing.",
          ar: "يتيح تنويع الاختبار بين الاختياري والصواب والخطأ والإجابة القصيرة والترتيب بدلًا من الاعتماد على التخمين فقط.",
        },
      },
      {
        tag: { en: "Bilingual RTL/LTR", ar: "دعم المواد العربية واللغات" },
        title: {
          en: "Works cleanly for Arabic subjects, STEM in English, or language classes",
          ar: "مناسب للمواد العربية والمواد العلمية باللغات الأجنبية",
        },
        body: {
          en: "Adapts directionality cleanly whether the exam is Arabic grammar, Biology in English, or French vocabulary.",
          ar: "يعرض الأسئلة والاختيارات باتجاه سليم سواء كان الامتحان في اللغة العربية أو العلوم والرياضيات باللغات.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Production Platform (mraboqamarexams.vercel.app)",
        ar: "منصة حية قيد التشغيل الفعلي ومتاحة للمعاينة",
      },
      summary: {
        en: "Deployed in production and inspectable via the live preview link on this page.",
        ar: "المنصة منشورة وتعمل فعليًا ويمكن زيارتها وتجربتها عبر رابط المعاينة الحية في هذه الصفحة.",
      },
      highlights: [
        {
          en: "Verified live production URL open for direct preview",
          ar: "رابط إنتاج حي وموثّق متاح للمعاينة المباشرة",
        },
        {
          en: "End-to-end teacher authoring, server grading & WhatsApp reporting",
          ar: "تغطي إنشاء الاختبار والمراجعة والتصحيح الخادمي وتقارير واتساب",
        },
      ],
    },
  },

  /* ── 19 · AHMED KAMAR (DATA ANALYST PORTFOLIO) ──────────────────── */
  {
    slug: "ahmed-kamar",
    sector: {
      en: "Executive Career Platform · Restaurant & Delivery Data Analytics",
      ar: "منصات التوظيف المهني · تحليل بيانات المطاعم ومنصات التوصيل",
    },
    headline: {
      en: "Presenting a Data Analyst's SQL rigor and HungerStation operational scope in clear business language that hiring managers and founders can act on in two minutes.",
      ar: "تقديم خبرة محلل بيانات في قطاع المطاعم ومنصات التوصيل (HungerStation) بلغة عملية واضحة تمكّن مديري التوظيف وأصحاب الشركات من تقييم كفاءته فورًا.",
    },
    summary: {
      en: "Ahmed Kamar's platform (ahmed-kamar-portfolio.vercel.app) is a bilingual AR/EN executive portfolio built for a Data Analyst working across restaurant, retail, and delivery-platform datasets (including 350+ menu and catalog items at HungerStation across 3 organizations). Instead of dumping raw code notebooks that non-technical managers skip—or generic web templates that hide SQL modeling depth—it frames his methodology, NDA-safe impact scope, skills, and CV for Egypt, Gulf, and remote hiring teams.",
      ar: "يمثل موقع (أحمد قمر) منصة مهنية ثنائية اللغة (عربي/إنجليزي) صُممت لمحلل بيانات متخصص في قطاع المطاعم والتجزئة ومنصات التوصيل (بما يشمل العمل على أكثر من 350 صنفًا وقائمة طعام في HungerStation عبر 3 مؤسسات). بدلًا من عرض أكواد خام يصعب على مديري الأعمال قراءتها أو قوالب عامة تخفي العمق التقني في SQL ونمذجة قواعد البيانات، يقدّم الموقع منهجيته ونطاق أعماله المحمي باتفاقيات السرية (NDA) وسيرته الذاتية بوضوح لفرق التوظيف في مصر والخليج والعمل عن بُعد.",
    },
    snapshot: [
      {
        label: { en: "Domain", ar: "مجال التخصص" },
        value: {
          en: "Restaurant, Retail & Delivery-Platform Data Analytics",
          ar: "تحليل بيانات المطاعم والتجزئة ومنصات التوصيل",
        },
      },
      {
        label: { en: "Target Audience", ar: "الفئات المستهدفة" },
        value: {
          en: "Hiring managers, analytics leads & F&B/retail operators",
          ar: "مديرو التوظيف، قادة فرق البيانات، وشركات الأغذية والتوصيل",
        },
      },
      {
        label: { en: "Positioning Hook", ar: "الرسالة المحورية" },
        value: {
          en: "'Data your team can act on' — SQL modeling + clear decisions",
          ar: "تحويل البيانات المعقدة إلى إجابات واضحة قابلة للتنفيذ",
        },
      },
      {
        label: { en: "Platform Setup", ar: "بنية المنصة" },
        value: {
          en: "Bilingual AR/EN + Light/Dark + CV, GitHub & hiring paths",
          ar: "ثنائي اللغة + وضع ليلي/نهاري + مسار مباشر للتوظيف والسيرة الذاتية",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why strong data analysts get overlooked in hiring",
        ar: "لماذا يظلم العرض التقليدي كفاءة محللي البيانات الأقوياء",
      },
      beforePoints: [
        {
          en: "Raw GitHub repositories full of SQL scripts or Python notebooks take too long for recruiters and operations directors to interpret.",
          ar: "الاكتفاء بروابط GitHub المليئة بملفات الاستعلامات الخام يجعل مسؤول التوظيف أو مدير التشغيل يغلق الصفحة دون فهم القيمة التجارية.",
        },
        {
          en: "Real commercial datasets in delivery platforms and restaurant chains are protected by strict NDAs, leaving analysts unsure how to show real work safely.",
          ar: "ارتباط بيانات الشركات ومنصات التوصيل باتفاقيات عدم إفصاح (NDA) يصعّب عرض المشاريع الحقيقية دون خرق خصوصية العملاء.",
        },
        {
          en: "Gulf and Egyptian employers often have both English-speaking tech leads and Arabic-speaking business stakeholders reviewing candidates.",
          ar: "تضم لجان التقييم في مصر والخليج قادة تقنيين يفضلون الإنجليزية ومديري أعمال يفضلون العربية.",
        },
      ],
      afterTitle: {
        en: "How this platform solves candidate evaluation",
        ar: "كيف يعالج الموقع هذه الفجوة بذكاء ومهنية",
      },
      afterPoints: [
        {
          en: "Leads with an unmistakable value proposition—'Data your team can act on'—bridging advanced SQL/database design with business answers.",
          ar: "البدء برسالة تنفيذية مباشرة تركز على تحويل بيانات المطاعم والتجزئة إلى قرارات عملية واضحة للفرق.",
        },
        {
          en: "Uses an explicit NDA-safe scope strip (350+ catalog items, 3 organizations, database schema design foundation) that proves real-world scale ethically.",
          ar: "عرض نطاق الخبرة الفعلية (350+ صنف وقائمة، 3 مؤسسات، وتصميم قواعد البيانات) بشفافية تحترم سرية بيانات العملاء وتُثبت الخبرة في آنٍ واحد.",
        },
        {
          en: "Provides dedicated quick jumps ('For hiring teams', 'Selected work', one-click CV download, GitHub, and Contact) in both English and Arabic.",
          ar: "توفير مسارات وصول فورية لفرق التوظيف، الأعمال المختارة، تحميل السيرة الذاتية، وحساب GitHub باللغتين العربية والإنجليزية.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Technical Analytics Leads", ar: "قادة فرق البيانات والمهندسون" },
          benefit: {
            en: "See immediately that his SQL skill is grounded in relational database modeling and structured analytical method—not just basic dashboard drag-and-drop.",
            ar: "يتأكدون سريعًا من تأسيسه القوي في تصميم قواعد البيانات والاستعلامات المتقدمة (SQL) ومنهجية التحليل المنظمة.",
          },
        },
        {
          role: { en: "Recruiters & HR Teams (Egypt / Gulf / Remote)", ar: "مسؤولو التوظيف في مصر والخليج" },
          benefit: {
            en: "Clear availability badge (Egypt / Gulf / Remote), current role context (HungerStation), and instant CV download right above the fold.",
            ar: "وضوح حالة التفرغ والنطاق الجغرافي المتاح والدور الحالي في HungerStation مع زر تحميل مباشر للسيرة الذاتية من أول شاشة.",
          },
        },
        {
          role: { en: "Restaurant & Retail Decision-Makers", ar: "مديرو التشغيل في قطاع المطاعم والتوصيل" },
          benefit: {
            en: "Plain-English and plain-Arabic explanations of how menu, catalog, and operational data turn into actionable decisions.",
            ar: "شرح عملي خالٍ من التعقيد يوضح كيف تتحول بيانات القوائم والأصناف والمبيعات إلى تحسينات تشغيلية.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a recruiter or hiring manager moves through the portfolio:",
      ar: "رحلة مسؤول التوظيف أو مدير القسم داخل المنصة خلال أقل من دقيقتين:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "10-Second Scan", ar: "الفحص السريع الأول" },
        title: {
          en: "Role, availability, HungerStation context & SQL focus",
          ar: "قراءة التخصص، الإتاحة الجغرافية، والخبرة الحالية فورًا",
        },
        detail: {
          en: "Above the fold, visitors immediately see role scope, Egypt/Gulf/Remote availability, current HungerStation analyst role, and CV/GitHub buttons.",
          ar: "توضّح الشاشة الافتتاحية فورًا المسمى الوظيفي، التواجد في HungerStation، الإتاحة لمصر والخليج وعن بُعد، وأزرار السيرة الذاتية وGitHub.",
        },
      },
      {
        step: "02",
        actor: { en: "Scope & NDA Proof", ar: "تقييم حجم الخبرة الفعلية" },
        title: {
          en: "Reviewing verified operational figures & selected case work",
          ar: "مراجعة مؤشرات النطاق المحمية بـ NDA ومشاريع التحليل المختارة",
        },
        detail: {
          en: "Hiring teams inspect catalog scale, multi-organization experience, and case breakdowns showing problem → SQL/model approach → business answer.",
          ar: "يطلع المقيّم على حجم البيانات التي تعامل معها ومشاريعه التحليلية مرتبة من المشكلة التجارية إلى المعالجة ثم التوصية العملية.",
        },
      },
      {
        step: "03",
        actor: { en: "Skills & Method Audit", ar: "فحص المهارات والمنهجية" },
        title: {
          en: "Checking technical stack (SQL, modeling, BI) & analytical workflow",
          ar: "استعراض الأدوات التقنية ومنهجية تنظيف ونمذجة البيانات",
        },
        detail: {
          en: "Dedicated Skills and Method sections separate core database/query strengths from reporting and business communication.",
          ar: "يفصل قسما المهارات والمنهجية بوضوح بين قدرات نمذجة البيانات واستعلامات SQL وبين بناء التقارير والتوصيات.",
        },
      },
      {
        step: "04",
        actor: { en: "Direct Action", ar: "التواصل أو تحميل الـ CV" },
        title: {
          en: "Downloading the CV or reaching out for interviews/projects",
          ar: "تنزيل السيرة الذاتية المحدثة أو بدء التواصل المباشر",
        },
        detail: {
          en: "Visitors switch effortlessly between English and Arabic or light and dark mode and move straight to interview scheduling.",
          ar: "ينتقل الزائر بضغطة واحدة لتحميل ملف السيرة الذاتية أو إرسال رسالة توظيف أو تعاون باللغة المفضلة لديه.",
        },
      },
    ],
    featuresIntro: {
      en: "Key strengths of the Ahmed Kamar portfolio platform:",
      ar: "أهم المميزات العملية لمنصة أحمد قمر:",
    },
    features: [
      {
        tag: { en: "Decision-First Copy", ar: "خطاب يركز على القرار التجاري" },
        title: {
          en: "Speaks to both SQL leads and business operators",
          ar: "يخاطب المدير التقني ومدير التشغيل بنفس الوضوح",
        },
        body: {
          en: "Balances technical credibility (`SELECT answers FROM data...`, schema modeling) with plain-spoken operational outcomes.",
          ar: "يجمع بين إثبات التمكن في SQL وقواعد البيانات وبين صياغة النتائج بلغة يفهمها صناع القرار في الشركات.",
        },
      },
      {
        tag: { en: "NDA-Safe Credibility", ar: "احترام اتفاقيات السرية (NDA)" },
        title: {
          en: "Shows real enterprise scope without leaking private client rows",
          ar: "يبرز حجم العمل الفعلي دون كشف بيانات حساسة للعملاء",
        },
        body: {
          en: "Explicitly labels summary-level scope figures—signaling professional trustworthiness to future employers.",
          ar: "ينص صراحةً على حماية تفاصيل العملاء تحت مظلة السرية، ما يمنح جهات التوظيف انطباعًا عاليًا بالأمانة المهنية.",
        },
      },
      {
        tag: { en: "Analytical Grid UI", ar: "هوية بصرية مستوحاة من البيانات" },
        title: {
          en: "Clean graph-paper precision with warm amber highlights",
          ar: "تصميم شبكي دقيق ونظيف يعكس عقلية محلل البيانات",
        },
        body: {
          en: "Avoids generic developer clichés in favor of a crisp, legible editorial datasheet aesthetic.",
          ar: "يبتعد عن القوالب المستهلكة ليقدم واجهة مرتبة عالية المقروئية تشبه لوحات التقارير التنفيذية المتقنة.",
        },
      },
      {
        tag: { en: "Bilingual + Dual Theme", ar: "عربي/إنجليزي + وضع نهاري/ليلي" },
        title: {
          en: "Instant AR/EN toggle & light/dark reading comfort",
          ar: "تبديل فوري بين العربية والإنجليزية والوضع الفاتح والداكن",
        },
        body: {
          en: "Built for recruiting teams across Cairo, Riyadh, Dubai, and international remote companies.",
          ar: "مهيّأ لمخاطبة فرق التوظيف في مصر والسعودية والإمارات والشركات العالمية عن بُعد.",
        },
      },
      {
        tag: { en: "Recruiter Fast-Lanes", ar: "مسار مختصر لمسؤولي التوظيف" },
        title: {
          en: "One-click CV download, status pill & hiring jump links",
          ar: "وصول فوري للسيرة الذاتية وحالة التفرغ من أول ثانية",
        },
        body: {
          en: "Eliminates hunting through menus to find his resume, GitHub, or relocation/remote readiness.",
          ar: "يوفر على مسؤول الموارد البشرية البحث الطويل عن ملف السيرة الذاتية أو روابط الأعمال وطرق التواصل.",
        },
      },
      {
        tag: { en: "Sector Specificity", ar: "تخصص قطاعي واضح" },
        title: {
          en: "Sharp focus on F&B, retail catalogs & delivery platforms",
          ar: "تركيز واضح على قطاع المطاعم والتجزئة وتطبيقات التوصيل",
        },
        body: {
          en: "Positions him as a domain-ready analyst rather than an undifferentiated generalist.",
          ar: "يضعه كمحلل جاهز يفهم طبيعة القوائم والأصناف والعمليات اليومية في هذا القطاع الحيوي.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Production Portfolio (ahmed-kamar-portfolio.vercel.app)",
        ar: "منصة حية منشورة ومتاحة للزيارة المباشرة",
      },
      summary: {
        en: "Live in production and accessible directly via the preview button on this page across English and Arabic.",
        ar: "الموقع منشور ويعمل فعليًا باللغتين العربية والإنجليزية ومتاح للتصفح المباشر عبر زر المعاينة.",
      },
      highlights: [
        {
          en: "Live Vercel production deployment open for preview",
          ar: "نسخة إنتاج حية متاحة للمعاينة المباشرة",
        },
        {
          en: "Full AR/EN parity + light/dark theme + NDA-safe case framing",
          ar: "دعم كامل للعربية والإنجليزية والوضعين الفاتح والداكن",
        },
      ],
    },
  },

  /* ── 20 · CONTINUUM (MEMORY OS) ─────────────────────────────────── */
  {
    slug: "continuum",
    sector: {
      en: "Personal Productivity & Knowledge Management · Local-First Workspace",
      ar: "أنظمة الإنتاجية وإدارة المعرفة · مساحة عمل وذاكرة مشاريع محلية",
    },
    headline: {
      en: "Keeping projects, tasks, architectural decisions, daily notes, and bookmarks in one fast local-first workspace so you never lose context when switching between projects.",
      ar: "جمع المشاريع والمهام والقرارات المهمة واليوميات والروابط المرجعية في مساحة عمل واحدة سريعة تحفظ سياق تفكيرك وتمنع التشتت بين المشاريع.",
    },
    summary: {
      en: "Continuum is a 21-screen personal 'Memory OS' designed for engineers, designers, founders, and researchers juggling multiple active projects. Instead of scattering tasks in one app, meeting/decision notes in another, and reference links in browser tabs—or waiting on slow cloud workspaces—Continuum runs instantly on local browser storage first, connects every task, note, and decision back to its project context, and supports optional Firebase sync when moving across devices.",
      ar: "صُمّم نظام (Continuum) كمساحة ذاكرة وتشغيل شخصية من 21 شاشة للمهندسين والمصممين وأصحاب المشاريع والباحثين الذين يديرون عدة أعمال في وقت واحد. بدلًا من تبعثر المهام في تطبيق، والملاحظات والقرارات في تطبيق آخر، والروابط المهمة في عشرات تبويبات المتصفح، يجمع النظام كل هذه العناصر في واجهة فورية تعمل محليًا أولًا (Local-First) بدون بطء، وتربط كل مهمة وقرار وملاحظة بسياق مشروعها، مع إتاحة مزامنة سحابية اختيارية عبر Firebase.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Knowledge Work, Project Context & Personal Productivity",
          ar: "إدارة المشاريع الشخصية وتوثيق القرارات والمعرفة",
        },
      },
      {
        label: { en: "Primary Users", ar: "المستخدمون" },
        value: {
          en: "Independent builders, engineers, consultants & researchers",
          ar: "المطورون، المصممون، الاستشاريون، وأصحاب المشاريع المتعددة",
        },
      },
      {
        label: { en: "Core Problem Solved", ar: "المشكلة التي يعالجها" },
        value: {
          en: "Context loss when returning to a paused project weeks later",
          ar: "فقدان سياق العمل ونسيان سبب القرارات عند العودة لمشروع متوقف",
        },
      },
      {
        label: { en: "Operating Model", ar: "آلية التشغيل" },
        value: {
          en: "21 local-first views · Zero build bloat · Optional Firebase sync",
          ar: "21 شاشة فورية الاستجابة محليًا + مزامنة سحابية اختيارية",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why multi-project builders lose hours re-orienting",
        ar: "لماذا يضيع الوقت عند التنقل بين عدة مشاريع",
      },
      beforePoints: [
        {
          en: "Returning to a project after two weeks usually means digging through old chats, commits, and 40 open tabs just to remember 'where did I stop and why did I choose X?'.",
          ar: "عند العودة لمشروع توقفت عنه لأسبوعين، تضيع ساعات في البحث داخل المحادثات والملفات لتذكّر: أين توقفت؟ ولماذا اتخذت هذا القرار؟",
        },
        {
          en: "Heavy cloud workspace apps take seconds to load every page, require constant internet, and lock personal notes behind proprietary formats.",
          ar: "تطبيقات إدارة المهام السحابية الثقيلة بطيئة الفتح، تتطلب إنترنت دائمًا، وتقيّد بياناتك الشخصية داخل قوالب معقدة.",
        },
        {
          en: "To-do lists track 'what to do' but lose 'why we decided it' and which reference articles or links belong to that task.",
          ar: "قوائم المهام العادية تسجل (ماذا تفعل) لكنها تضيع (لماذا قررت ذلك) وما هي المراجع والروابط المرتبطة بالمهمة.",
        },
      ],
      afterTitle: {
        en: "How Continuum preserves working memory",
        ar: "كيف يحفظ Continuum ذاكرة العمل عمليًا",
      },
      afterPoints: [
        {
          en: "Unites Projects, Tasks, Decision Logs, Daily Journal, Knowledge Notes, and Bookmarks inside one connected 21-view workspace.",
          ar: "توحيد المشاريع، المهام، سجل القرارات، اليوميات، الملاحظات المعرفية، والروابط المحفوظة في نظام واحد مترابط من 21 شاشة.",
        },
        {
          en: "Writes every keystroke locally first—zero loading spinners, works offline on flights or cafés, and exports/imports clean JSON anytime.",
          ar: "حفظ فوري محلي لكل حركة بدون شاشات انتظار، مع عمل كامل بدون إنترنت وإمكانية تصدير واستيراد نسخة احتياطية كاملة في أي وقت.",
        },
        {
          en: "Adds optional Firebase authentication and sync when the user wants their workspace mirrored across laptop and phone.",
          ar: "توفير خيار ربط ومزامنة سحابية عبر Firebase فقط عندما يرغب المستخدم في مزامنة مساحته بين الكمبيوتر والهاتف.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Solo Founders & Multi-Client Consultants", ar: "المستقلون والاستشاريون متعددو المشاريع" },
          benefit: {
            en: "Switch between three or four client engagements cleanly, resuming the exact next step and decision trail in seconds.",
            ar: "التنقل بين عدة عملاء أو مشاريع بسلاسة، واستعادة آخر خطوة وسجل القرارات الخاصة بكل مشروع في ثوانٍ.",
          },
        },
        {
          role: { en: "Software Engineers & System Designers", ar: "المطورون ومصممو الأنظمة" },
          benefit: {
            en: "Keep lightweight architectural decision records, code/doc bookmarks, and sprint tasks linked side by side.",
            ar: "ربط القرارات المعمارية والملاحظات التقنية وروابط التوثيق مباشرة بالمهام التنفيذية للمشروع.",
          },
        },
        {
          role: { en: "Privacy-Conscious Knowledge Workers", ar: "المهتمون بسرعة الأداء وملكية بياناتهم" },
          benefit: {
            en: "Full ownership of local data with zero mandatory cloud account required to use all 21 screens.",
            ar: "ملكية كاملة للبيانات على الجهاز مع إمكانية استخدام كافة الشاشات الـ 21 دون إجبار على حساب سحابي.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a builder uses Continuum across a typical work session:",
      ar: "كيف يستخدم صاحب المشروع النظام خلال يوم عمله المعتاد:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Session Resume", ar: "استعادة سياق الجلسة" },
        title: {
          en: "Open dashboard & pick up exact last active project state",
          ar: "فتح لوحة القيادة واستعراض المشاريع النشطة وآخر نقطة توقف",
        },
        detail: {
          en: "The overview surfaces active projects, today's priority tasks, recent journal notes, and pinned context immediately.",
          ar: "تعرض الشاشة الرئيسية المشاريع الجارية، أولويات اليوم، وآخر الملاحظات المسجلة لتبدأ العمل فورًا دون تشتت.",
        },
      },
      {
        step: "02",
        actor: { en: "Capture & Execute", ar: "التنفيذ وتدوين القرارات" },
        title: {
          en: "Work through tasks while logging decisions & reference links",
          ar: "إنجاز المهام مع توثيق القرارات المهمة وحفظ الروابط المرجعية",
        },
        detail: {
          en: "As work progresses, tasks move forward, key trade-offs are recorded so they aren't forgotten later, and useful URLs save to Bookmarks.",
          ar: "أثناء العمل تُحدّث حالة المهام، وتُسجّل أسباب القرارات المهمة للرجوع إليها مستقبلًا، وتُحفظ الروابط المفيدة ضمن نفس السياق.",
        },
      },
      {
        step: "03",
        actor: { en: "Daily Reflection", ar: "التدوين اليومي والمعرفي" },
        title: {
          en: "Close the day with a quick journal note & knowledge entry",
          ar: "تدوين ملخص الجلسة في اليوميات وقاعدة المعرفة الشخصية",
        },
        detail: {
          en: "A two-minute end-of-day log captures blockers and tomorrow's first move so the next session starts effortlessly.",
          ar: "تدوين سريع في نهاية اليوم يوضح ما تم إنجازه وما هي الخطوة الأولى غدًا، ليصبح استئناف العمل لاحقًا سهلًا ومباشرًا.",
        },
      },
      {
        step: "04",
        actor: { en: "Backup or Sync", ar: "النسخ الاحتياطي أو المزامنة" },
        title: {
          en: "Keep purely local, export JSON, or sync via Firebase",
          ar: "الاحتفاظ المحلي، تصدير ملف احتياطي، أو المزامنة السحابية",
        },
        detail: {
          en: "Users stay 100% offline/local by default or sign into Firebase when they want automatic multi-device continuity.",
          ar: "يبقى العمل محفوظًا محليًا افتراضيًا، مع حرية تصدير نسخة احتياطية أو تفعيل المزامنة السحابية بين الأجهزة.",
        },
      },
    ],
    featuresIntro: {
      en: "Practical advantages of Continuum over scattered productivity tools:",
      ar: "أهم المميزات العملية لنظام Continuum:",
    },
    features: [
      {
        tag: { en: "Context Preservation", ar: "حفظ سياق التفكير" },
        title: {
          en: "Connects 'what to do' with 'why we decided it'",
          ar: "يربط المهام التنفيذية بسجل القرارات والمراجع",
        },
        body: {
          en: "Prevents repeating old debates or forgetting why a technical or product direction was chosen months ago.",
          ar: "يمنع نسيان أسباب القرارات السابقة عند العودة للمشروع بعد أسابيع أو أشهر.",
        },
      },
      {
        tag: { en: "All-in-One Scope", ar: "5 أدوات في مكان واحد" },
        title: {
          en: "Projects, Tasks, Journal, Knowledge Base & Bookmarks united",
          ar: "يغني عن التشتت بين 5 تطبيقات منفصلة",
        },
        body: {
          en: "21 cohesive screens cover planning, execution, writing, reference archiving, and review under one navigation system.",
          ar: "21 شاشة متناغمة تغطي التخطيط والتنفيذ والتدوين وحفظ الروابط والمراجعة الدورية.",
        },
      },
      {
        tag: { en: "Zero Latency", ar: "استجابة لحظية" },
        title: {
          en: "Local-first storage means instant screen switches & saves",
          ar: "فتح وتنقل وحفظ فوري بدون انتظار استجابة خادم",
        },
        body: {
          en: "Capturing a fleeting thought or checking a task takes milliseconds—even with zero Wi-Fi.",
          ar: "تسجيل فكرة سريعة أو مراجعة مهمة يتم في أجزاء من الثانية حتى عند انقطاع الإنترنت تمامًا.",
        },
      },
      {
        tag: { en: "Optional Cloud", ar: "مزامنة اختيارية غير إجبارية" },
        title: {
          en: "Works immediately without login; Firebase sync when needed",
          ar: "جاهز للعمل فورًا بدون حساب، مع دعم المزامنة وقت الحاجة",
        },
        body: {
          en: "Try and use the full workspace locally right away, and connect cloud sync only if you work across multiple machines.",
          ar: "استخدم النظام بكامل إمكانياته محليًا، وفعّل المزامنة السحابية فقط إذا أردت ربط أكثر من جهاز.",
        },
      },
      {
        tag: { en: "Zero Lock-In", ar: "حرية كاملة في البيانات" },
        title: {
          en: "Transparent data model & portable backup",
          ar: "سهولة النسخ الاحتياطي ونقل البيانات دون قيود احتكارية",
        },
        body: {
          en: "Your notes, tasks, and bookmarks remain structured data you control—not trapped inside a closed SaaS subscription.",
          ar: "تظل ملاحظاتك ومشاريعك بيانات منظمة تحت سيطرتك الكاملة وليست حبيسة اشتراك شهري مغلق.",
        },
      },
      {
        tag: { en: "Lightweight Footprint", ar: "خفة واستقرار طويل المدى" },
        title: {
          en: "Built without fragile build-chain dependencies",
          ar: "بنية برمجية خفيفة ومستقرة سريعة التحميل على أي جهاز",
        },
        body: {
          en: "Loads cleanly on modest laptops, tablets, and phones with minimal memory usage.",
          ar: "يعمل بخفة وسلاسة على مختلف الأجهزة والمتصفحات دون استهلاك عالٍ للذاكرة.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Deployed Workspace (21 Screens)",
        ar: "مساحة عمل حية ومنشورة ومتاحة للتجربة (21 شاشة)",
      },
      summary: {
        en: "Live and publicly accessible via the preview button—visitors can open and test the local-first workspace directly in their browser.",
        ar: "التطبيق منشور ومتاح للتجربة الحية عبر زر المعاينة؛ يمكن فتحه وتجربة إنشاء المشاريع والمهام والملاحظات مباشرة في المتصفح.",
      },
      highlights: [
        {
          en: "Live deployment open for immediate hands-on use",
          ar: "نسخة حية جاهزة للاستخدام والتجربة المباشرة بدون تسجيل",
        },
        {
          en: "21 integrated views spanning projects, tasks, journal & knowledge",
          ar: "21 شاشة مترابطة لإدارة المشاريع والمهام واليوميات والمعرفة",
        },
      ],
    },
  },

  /* ── 21 · PHARMACY WEB ──────────────────────────────────────────── */
  {
    slug: "pharmacy-web",
    sector: {
      en: "Healthcare Retail SaaS · Multi-Branch Pharmacy POS & Safety System",
      ar: "أنظمة الصيدليات السحابية · نقاط البيع والمخزون والسلامة الدوائية",
    },
    headline: {
      en: "An Arabic RTL pharmacy management interface built to prevent drug-interaction errors at the counter, protect expiring inventory, and stop duplicate financial charges.",
      ar: "واجهة نظام إدارة صيدليات عربية مصممة لمنع أخطاء التفاعلات الدوائية وقت الصرف، وحماية الأدوية من انتهاء الصلاحية، وضمان دقة الحسابات المالية.",
    },
    summary: {
      en: "Pharmacy Web is the operator-facing Arabic RTL application for a multi-tenant retail pharmacy SaaS platform. Organized across 15 clear operational modules—including Counter POS, Drug Utilization Review (DUR) clinical safety checks, FEFO batch inventory, prescriptions, purchasing, suppliers, shifts, and financial ledgers—it is engineered around real pharmacy counter risks: patient medication safety, exact decimal money calculation, and protection against double-submitting invoices on shaky internet.",
      ar: "يمثل مشروع (Pharmacy Web) واجهة التشغيل العربية لنظام سحابي لإدارة الصيدليات وسلاسل التجزئة الدوائية. ينظم النظام العمل عبر 15 وحدة تشغيلية واضحة تشمل كاشير الصرف السريع (POS)، فحص التداخلات والسلامة الدوائية (DUR)، مخزون التشغيلات وتواريخ الصلاحية (FEFO)، الوصفات الطبية، المشتريات والموردين، الورديات، والدفاتر المالية؛ مع تركيز صارم على سلامة المريض ودقة الحسابات المالية ومنع تكرار الفواتير عند تذبذب الإنترنت.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Retail Pharmacies & Multi-Branch Pharmacy Chains",
          ar: "الصيدليات الفردية وسلاسل الصيدليات متعددة الفروع",
        },
      },
      {
        label: { en: "Daily Operators", ar: "المستخدمون اليوميون" },
        value: {
          en: "Dispensing pharmacists, cashiers, branch managers & owners",
          ar: "الصيادلة، مسؤولو الكاشير، مديرو الفروع، وأصحاب الصيدليات",
        },
      },
      {
        label: { en: "Safety & Financial Value", ar: "القيمة الطبية والمالية" },
        value: {
          en: "Clinical DUR safety gate + FEFO expiry + exact money math",
          ar: "تنبيهات التداخل الدوائي + صرف الأقرب صلاحية + دقة مالية تامة",
        },
      },
      {
        label: { en: "System Scope", ar: "نطاق البنية" },
        value: {
          en: "15 bounded operational modules · Multi-tenant Arabic RTL",
          ar: "15 وحدة تشغيلية مفصولة بوضوح · يدعم تعدد الصيدليات والفروع",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "High-cost risks at a busy pharmacy counter",
        ar: "المخاطر اليومية على كاونتر الصيدلية المزدحم",
      },
      beforePoints: [
        {
          en: "During rush hours, dispensing multiple items without automated Drug Utilization Review (DUR) risks missing dangerous drug-drug interactions or contraindications.",
          ar: "في أوقات الذروة، قد يمر صرف عدة أصناف معًا دون الانتباه لتداخل دوائي خطير أو تعارض مع حالة المريض إذا غاب التنبيه الآلي.",
        },
        {
          en: "Standard POS software treats medicines like grocery barcodes—ignoring batch expiry order and rounding piastres/halalas inaccurately across thousands of daily receipts.",
          ar: "أنظمة الكاشير التجارية العادية لا تراعي ترتيب صلاحية التشغيلات الدوائية، وقد تسبب فروقات تقريب عشرية تتراكم عبر آلاف الفواتير شهريًا.",
        },
        {
          en: "When store Wi-Fi flickers and a cashier clicks 'Confirm Sale' twice, naive web apps charge twice or deduct stock twice.",
          ar: "عند بطء الإنترنت لحظة البيع وضغط الكاشير على زر التأكيد مرتين، تقوم الأنظمة غير المحمية بتكرار الفاتورة وخصم الصنف مرتين من الرصيد.",
        },
      ],
      afterTitle: {
        en: "How Pharmacy Web protects patients and pharmacy margin",
        ar: "كيف يحمي النظام سلامة المريض وحسابات الصيدلية",
      },
      afterPoints: [
        {
          en: "Embeds an explicit DUR clinical safety gate inside the dispensing workflow so pharmacists review and acknowledge clinical warnings before completing a risky dispense.",
          ar: "دمج بوابة فحص السلامة والتداخلات الدوائية (DUR) مباشرة قبل إتمام الصرف لتنبيه الصيدلي وتوثيق مراجعته المهنية.",
        },
        {
          en: "Tracks stock by batch and expiry (FEFO) so counter staff pick the right lot first and catch expiring boxes early.",
          ar: "إدارة المخزون بالتشغيلة وتاريخ الصلاحية لتوجيه الصرف نحو العلب الأقرب انتهاءً وحماية رأس مال الصيدلية.",
        },
        {
          en: "Handles all money values with exact 4-decimal precision (zero floating-point rounding drift) and attaches idempotency keys to financial actions so double-clicks never duplicate sales or refunds.",
          ar: "معالجة المبالغ المالية بدقة عشرية صارمة دون أخطاء تقريب، مع حماية برمجية تمنع تكرار الفاتورة أو المرتجع مهما تكرر الضغط أثناء ضعف الشبكة.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Dispensing Pharmacists", ar: "الصيادلة على كاونتر الصرف" },
          benefit: {
            en: "Fast Arabic RTL search and barcode flow backed by clinical DUR alerts that support—not slow down—professional judgment.",
            ar: "واجهة صرف عربية سريعة تدعم الباركود وتنبه الصيدلي للتعارضات الدوائية الحرجة بوضوح وسرعة.",
          },
        },
        {
          role: { en: "Pharmacy Owners & Finance", ar: "أصحاب الصيدليات والإدارة المالية" },
          benefit: {
            en: "Clean shift handovers, tamper-resistant refund/ledger trails, zero duplicate double-click postings, and lower expiry write-offs.",
            ar: "تسليم ورديات منضبط، حماية من الفواتير المكررة وفروقات التقريب، وتقليل خسائر الأدوية منتهية الصلاحية.",
          },
        },
        {
          role: { en: "Multi-Branch SaaS Operators", ar: "مديرو السلاسل والفروع المتعددة" },
          benefit: {
            en: "Strict tenant and branch isolation across 15 modular domains so new pharmacy features roll out safely without breaking the POS.",
            ar: "عزل دقيق لبيانات كل صيدلية وفرع عبر 15 وحدة منظمة تضمن استقرار الكاشير عند تحديث أو توسيع النظام.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a prescription or OTC sale moves safely through the pharmacy:",
      ar: "رحلة صرف الوصفة الطبية والبيع داخل الصيدلية عبر النظام:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Receiving & FEFO Stock", ar: "التوريد وترتيب الصلاحيات" },
        title: {
          en: "Supplier intake logged by batch number, cost & expiry date",
          ar: "إدخال فواتير الموردين برقم التشغيلة والسعر وتاريخ الانتهاء",
        },
        detail: {
          en: "Incoming medicines register into branch inventory with exact batch expiry dates so FEFO order is ready at the counter.",
          ar: "تُسجّل الأصناف الواردة بتشغيلاتها وتواريخ صلاحيتها ليعرف النظام تلقائيًا أي تشغيلة يجب صرفها أولًا.",
        },
      },
      {
        step: "02",
        actor: { en: "Counter Scan & DUR Gate", ar: "الكاشير وفحص السلامة الدوائية" },
        title: {
          en: "Pharmacist scans items & reviews clinical DUR checks",
          ar: "مسح الأصناف بالباركود وفحص التداخلات الدوائية الآلي",
        },
        detail: {
          en: "As items enter the basket, the DUR module flags interactions or dosage warnings requiring pharmacist review before checkout.",
          ar: "مع إضافة الأدوية للسلة، يفحص النظام التداخلات المحتملة وينبه الصيدلي لاتخاذ القرار المهني السليم قبل الإغلاق.",
        },
      },
      {
        step: "03",
        actor: { en: "Idempotent Checkout", ar: "التحصيل الآمن وإصدار الفاتورة" },
        title: {
          en: "Exact decimal total, payment split & duplicate-safe submission",
          ar: "حساب دقيق للإجمالي وتأكيد بيع محمي ضد التكرار",
        },
        detail: {
          en: "Cash, card, or insurance co-pay totals compute accurately, and an idempotency key ensures network retries never create duplicate receipts.",
          ar: "تُحسب مبالغ النقدي أو الشبكة أو التأمين بدقة تامة، وتضمن مفاتيح عدم التكرار تسجيل العملية مرة واحدة فقط حتى لو تقطّع الاتصال.",
        },
      },
      {
        step: "04",
        actor: { en: "Shift Close & Ledger", ar: "إغلاق الوردية والمطابقة" },
        title: {
          en: "Drawer reconciliation, returns tracking & branch reporting",
          ar: "مطابقة درج النقدية، مراجعة المرتجعات، وتقارير الفرع",
        },
        detail: {
          en: "At shift change, cashiers reconcile drawer balances against posted sales and returns with a clear audit trail for the manager.",
          ar: "عند تسليم الوردية تُطابق النقدية والمبيعات والمرتجعات بوضوح كامل أمام مدير الفرع وصاحب الصيدلية.",
        },
      },
    ],
    featuresIntro: {
      en: "Key business and operational advantages of Pharmacy Web:",
      ar: "أهم المميزات التشغيلية والتجارية لنظام Pharmacy Web:",
    },
    features: [
      {
        tag: { en: "Patient Safety (DUR)", ar: "سلامة المريض أولًا" },
        title: {
          en: "Built-in Drug Utilization Review before sale completion",
          ar: "بوابة تنبيه للتفاعلات والتعارضات الدوائية أثناء الصرف",
        },
        body: {
          en: "Elevates the pharmacy from a barcode cashier to a safer clinical dispensing point trusted by families.",
          ar: "ترفع مستوى الخدمة المهنية للصيدلية وتحمي المرضى من التداخلات الدوائية غير المقصودة.",
        },
      },
      {
        tag: { en: "Zero Rounding Drift", ar: "دقة محاسبية صارمة" },
        title: {
          en: "Exact 4-decimal string money handling",
          ar: "معالجة دقيقة للعملات والكسور العشرية تمنع فروقات الجرد",
        },
        body: {
          en: "Eliminates subtle JavaScript rounding errors across unit splits (strip vs box), taxes, and insurance co-pays.",
          ar: "تقضي تمامًا على أخطاء التقريب الحسابي عند بيع الشرائط المجزأة أو حساب نسب تحمل التأمين الطبي.",
        },
      },
      {
        tag: { en: "Double-Click Safe", ar: "منع تكرار الفواتير" },
        title: {
          en: "Idempotent financial POSTs survive unstable store internet",
          ar: "حماية العمليات المالية من التكرار عند ضعف الإنترنت",
        },
        body: {
          en: "Protects cashiers and customers from accidental double charges or double stock deductions during network lag.",
          ar: "تضمن عدم خصم المبلغ أو الرصيد المخزني مرتين إذا ضغط الكاشير على زر الحفظ أكثر من مرة أثناء بطء الشبكة.",
        },
      },
      {
        tag: { en: "FEFO Expiry Guard", ar: "إدارة الصلاحيات والتشغيلات" },
        title: {
          en: "Batch-aware dispensing reduces expired drug losses",
          ar: "توجيه الصرف حسب تاريخ الانتهاء لتقليل رواكد وهالك الأدوية",
        },
        body: {
          en: "Keeps older valid stock moving first and gives purchasing teams clear visibility before re-ordering.",
          ar: "يساعد في تصريف التشغيلات الأقدم أولًا ويمنح مسؤول المشتريات رؤية واضحة قبل طلب كميات إضافية.",
        },
      },
      {
        tag: { en: "15 Clean Modules", ar: "تنظيم معياري واضح" },
        title: {
          en: "Covers POS, stock, suppliers, shifts, prescriptions & reports",
          ar: "15 وحدة متخصصة تغطي دورة عمل الصيدلية بالكامل",
        },
        body: {
          en: "Enforced module boundaries keep the system maintainable as chains add branches and workflows.",
          ar: "فصل برمجي وتنظيمي دقيق بين الوحدات يحافظ على سرعة واستقرار النظام مع توسع الفروع.",
        },
      },
      {
        tag: { en: "Native Arabic RTL", ar: "تجربة تشغيل عربية مريحة" },
        title: {
          en: "Token-driven Arabic interface built for long counter shifts",
          ar: "واجهة عربية واضحة ومريحة للعين خلال ساعات العمل الطويلة",
        },
        body: {
          en: "Clear contrast, keyboard-friendly Counter POS flows, and unambiguous status indicators reduce cashier fatigue.",
          ar: "تباين لوني مريح وتصميم يراعي سرعة العمل على الكاونتر لتقليل الإجهاد والأخطاء البشرية.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Saved Architectural Case File (Private SaaS Repository)",
        ar: "دراسة حالة معمارية وتطبيقية محفوظة (مشروع SaaS خاص)",
      },
      summary: {
        en: "Pharmacy Web is the frontend application of a private multi-tenant pharmacy SaaS; because it connects to a private clinical/financial backend, it is documented here via verified interface screenshots and architectural specifications rather than an open public sandbox.",
        ar: "يمثل هذا المشروع الواجهة الأمامية لنظام صيدليات سحابي خاص مرتبط بخلفية طبية ومالية مغلقة؛ لذلك يُعرض هنا عبر لقطات الواجهة الفعلية وتفاصيل البنية المعمارية الموثقة دون رابط عام مفتوح.",
      },
      highlights: [
        {
          en: "15 bounded-context modules enforced by automated CI checks",
          ar: "15 وحدة تشغيلية محكومة بقواعد فحص آلي صارمة",
        },
        {
          en: "Documented in full detail in the Technical Case Study tab",
          ar: "كافة القواعد المعمارية والمالية مشروحة بالتفصيل في التبويب التقني",
        },
      ],
    },
  },

  /* ── 22 · YOUSSEF GUBA (MOBILE ENGINEER OS) ─────────────────────── */
  {
    slug: "youssef-guba",
    sector: {
      en: "Creator & Engineering Studio OS · Mobile Products, Courses & Writing",
      ar: "منصات المهندسين وصناع المنتجات · تطبيقات الجوّال والدورات والمقالات",
    },
    headline: {
      en: "Uniting a Flutter mobile engineer's shipped App Store/Play Store work, educational courses, technical articles, and client project intake inside one Sanity-powered bilingual platform.",
      ar: "جمع أعمال مهندس تطبيقات جوّال منشورة على المتاجر، ودوراته التدريبية، ومقالاته التقنية، وطلبات العملاء في منصة ثنائية اللغة تدار بالكامل عبر Sanity CMS.",
    },
    summary: {
      en: "Youssef Guba's platform (youssefguba-os.vercel.app) is a personal portfolio operating system built for a Cairo-based production Flutter engineer. Rather than splitting his professional presence across LinkedIn posts, Medium blogs, course links, and PDF portfolios, it brings 10 mirrored Arabic/English routes—Work, Services, Courses, Writing, Media, About, and Start a Project—under one fast Next.js interface where he publishes new case studies, courses, and articles directly from Sanity Studio without touching code.",
      ar: "يمثل موقع (يوسف جوبا - Youssef Guba OS) نظام ملف أعمال وتشغيل شخصيًا متكاملًا لمهندس تطوير تطبيقات جوّال (Flutter) في القاهرة. بدلًا من تشتيت حضوره المهني بين منشورات لينكدإن ومنصات المقالات وروابط الدورات المتفرقة، توحّد المنصة 10 مسارات كاملة ومتطابقة بالعربية والإنجليزية تشمل الأعمال المنشورة، الخدمات، الدورات التدريبية، المدونة التقنية، واستقبال المشاريع، مع لوحة إدارة محتوى (Sanity CMS) تمكّنه من النشر والتحديث فورًا دون تعديل الكود.",
    },
    snapshot: [
      {
        label: { en: "Domain", ar: "التخصص" },
        value: {
          en: "Production Flutter Mobile Engineering & Technical Education",
          ar: "هندسة تطبيقات الجوّال (Flutter) والتدريب التقني",
        },
      },
      {
        label: { en: "Target Audience", ar: "الفئات المستهدفة" },
        value: {
          en: "App founders/clients, tech recruiters & Flutter learners",
          ar: "أصحاب مشاريع التطبيقات، مسؤولو التوظيف، ومتعلمو Flutter",
        },
      },
      {
        label: { en: "Business Model", ar: "نموذج القيمة المزدوج" },
        value: {
          en: "Client mobile development + courses + authority publishing",
          ar: "تطوير تطبيقات للعملاء + دورات تعليمية + محتوى تقني متخصص",
        },
      },
      {
        label: { en: "Platform Scale", ar: "بنية المنصة" },
        value: {
          en: "10 live AR/EN mirrored routes + Headless Sanity Studio",
          ar: "10 صفحات حية متطابقة عربي/إنجليزي + إدارة محتوى Sanity CMS",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why developer-educators outgrow static one-page portfolios",
        ar: "لماذا لا تكفي صفحة ملف الأعمال العادية للمهندس المحاضر وصانع المحتوى",
      },
      beforePoints: [
        {
          en: "A developer who ships client apps, teaches courses, and writes articles looks unfocused unless each stream has a structured home.",
          ar: "المهندس الذي يطوّر تطبيقات للعملاء ويقدم دورات ويكتب مقالات يبدو مشتتًا إذا عُرضت كل هذه المسارات في صفحة واحدة مزدحمة.",
        },
        {
          en: "Hardcoded developer portfolios go stale quickly because publishing a new article or course update requires opening an IDE and redeploying.",
          ar: "المواقع المبرمجة بنصوص ثابتة تُهمل سريعًا لأن إضافة مشروع جديد أو مقال تتطلب فتح الكود وإعادة النشر في كل مرة.",
        },
        {
          en: "Serving both Arab developer communities/local founders and international clients demands real RTL Arabic and LTR English parity.",
          ar: "مخاطبة المتعلمين وأصحاب الشركات محليًا ودوليًا تتطلب تجربة عربية أصيلة لا تقل جودة عن النسخة الإنجليزية.",
        },
      ],
      afterTitle: {
        en: "How Youssef Guba OS operates as a personal studio hub",
        ar: "كيف تعمل المنصة كمركز تشغيل مهني وتجاري موحّد",
      },
      afterPoints: [
        {
          en: "Organizes his work into clear commercial and educational destinations across 10 routes: Work, Services, Courses, Writing, Media, About, and Start Flow.",
          ar: "تنظيم الحضور المهني في 10 مسارات واضحة تفصل بذكاء بين معرض التطبيقات، الخدمات الاستشارية، الدورات التعليمية، والمقالات.",
        },
        {
          en: "Connects Sanity Studio with automatic Incremental Static Regeneration (ISR) so publishing a new course or case study updates the live site cleanly.",
          ar: "ربط المنصة باستوديو Sanity CMS مع تحديث تلقائي للصفحات ليتاح نشر أي مقال أو دورة أو مشروع جديد في دقائق من لوحة التحكم.",
        },
        {
          en: "Highlights real mobile production credentials—offline-capable modular Flutter apps shipped to App Store & Google Play—right in the hero.",
          ar: "إبراز نقاط القوة الهندسية الحقيقية من اللحظة الأولى: بناء تطبيقات Flutter معيارية تعمل بدون إنترنت ومنشورة فعليًا على متجري آبل وجوجل.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Startup Founders & App Clients", ar: "مؤسسو الشركات وأصحاب أفكار التطبيقات" },
          benefit: {
            en: "Inspect shipped App Store/Play Store case studies, review mobile engineering services, and submit a structured project brief via 'Start a Project'.",
            ar: "معاينة تطبيقات حقيقية منشورة، فهم نطاق خدمات التطوير، وإرسال طلب مشروع منظم عبر مسار (ابدأ مشروعك).",
          },
        },
        {
          role: { en: "Flutter Developers & Students", ar: "المطورون ودارسو تطوير التطبيقات" },
          benefit: {
            en: "Browse structured courses and deep-dive Arabic/English articles on clean architecture and state management in one ad-free library.",
            ar: "الوصول لدورات منظمة ومقالات تقنية معمّقة بالعربية والإنجليزية حول معمارية التطبيقات وإدارة الحالة.",
          },
        },
        {
          role: { en: "Youssef (Owner & Publisher)", ar: "صاحب المنصة (إدارة المحتوى اليومية)" },
          benefit: {
            en: "One Sanity CMS dashboard manages bilingual case studies, courses, media appearances, and journal posts without developer maintenance friction.",
            ar: "لوحة تحكم واحدة لإدارة وتحديث كافة المحتويات باللغتين دون أي عبء برمجي متكرر.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How the platform serves both client acquisition and content publishing:",
      ar: "كيف تعمل المنصة بين نشر المحتوى وجذب العملاء والدارسين:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Sanity Publishing", ar: "النشر من لوحة المحتوى" },
        title: {
          en: "Authoring bilingual case studies, courses & articles in Sanity Studio",
          ar: "إضافة المشاريع والدورات والمقالات باللغتين عبر Sanity Studio",
        },
        detail: {
          en: "New mobile projects, course modules, or engineering essays are entered once in structured AR/EN fields and revalidate automatically.",
          ar: "يُدخل صاحب المنصة بيانات التطبيق الجديد أو الدورة أو المقال في حقول عربية وإنجليزية منظمة لتظهر مباشرة على الموقع الحي.",
        },
      },
      {
        step: "02",
        actor: { en: "Proof Discovery", ar: "استعراض الخبرة والأعمال" },
        title: {
          en: "Clients explore shipped Flutter products & mobile architecture",
          ar: "تصفح دراسات حالة التطبيقات المنشورة على App Store وGoogle Play",
        },
        detail: {
          en: "Prospective clients and hiring leads review how offline-capable apps, modular state, and mobile releases were delivered.",
          ar: "يطلع العميل أو مسؤول التوظيف على تفاصيل بناء التطبيقات الفعلية وكيفية معالجة العمل بدون إنترنت ونشر الإصدارات.",
        },
      },
      {
        step: "03",
        actor: { en: "Learning & Authority", ar: "الدورات والمقالات التقنية" },
        title: {
          en: "Developers read technical writing & enroll in mobile courses",
          ar: "تصفح المحتوى التعليمي والمقالات الهندسية المتخصصة",
        },
        detail: {
          en: "Educational articles and courses reinforce his authority while serving the developer community in both Arabic and English.",
          ar: "تخدم المقالات والدورات مجتمع المطورين وتعزز في الوقت نفسه ثقة العملاء في عمقه الهندسي وقدرته على بناء أنظمة نظيفة.",
        },
      },
      {
        step: "04",
        actor: { en: "Project Conversion", ar: "تحويل الزائر إلى عميل" },
        title: {
          en: "Structured intake via Services & 'Start a Project'",
          ar: "تحويل الاهتمام إلى تواصل عملي عبر صفحة الخدمات وبدء المشروع",
        },
        detail: {
          en: "Ready buyers move smoothly from reading proof into scoping their iOS/Android product build.",
          ar: "ينتقل صاحب المشروع بسلاسة من مراجعة سابقة الأعمال إلى تحديد متطلبات تطبيقه القادم وبدء التواصل.",
        },
      },
    ],
    featuresIntro: {
      en: "Practical advantages of the Youssef Guba OS platform:",
      ar: "أهم المميزات العملية والتجارية لمنصة يوسف جوبا:",
    },
    features: [
      {
        tag: { en: "Headless CMS Autonomy", ar: "استقلالية كاملة في تحديث المحتوى" },
        title: {
          en: "Powered live by Sanity CMS + ISR revalidation",
          ar: "مرتبطة بمحرك Sanity CMS لتحديث الموقع دون لمس الكود",
        },
        body: {
          en: "Keeps the site alive as an active publishing and course hub rather than a static snapshot frozen on launch day.",
          ar: "يضمن بقاء المنصة متجددة دائمًا بأحدث المشاريع والمقالات والدورات دون الحاجة لتعديل برمجي.",
        },
      },
      {
        tag: { en: "10-Route Ecosystem", ar: "منظومة متكاملة من 10 مسارات" },
        title: {
          en: "Unites Work, Services, Courses, Writing & Media cleanly",
          ar: "تجمع الخدمات والدورات والأعمال والمدونة في هيكل منظم",
        },
        body: {
          en: "Gives each audience—app clients, recruiters, and students—a clear path without cluttering the others.",
          ar: "تمنح كل زائر — سواء كان عميلًا أو متعلمًا أو مسؤول توظيف — مساره الواضح دون تشتيت.",
        },
      },
      {
        tag: { en: "True AR/EN Mirror", ar: "تطابق كامل بالعربية والإنجليزية" },
        title: {
          en: "Native RTL Arabic & LTR English typography across every route",
          ar: "تجربة قراءة وتصفح متطابقة باللغتين عبر كافة الصفحات",
        },
        body: {
          en: "Designed from the ground up so Arabic technical articles and English client pages both feel native.",
          ar: "مصممة بحيث تبدو المقالات العربية وصفحات الأعمال الإنجليزية أصيلة ومتقنة في اتجاهها وخطوطها.",
        },
      },
      {
        tag: { en: "Sharp Niche Positioning", ar: "تموضع تخصصي حاسم" },
        title: {
          en: "Focused squarely on 'Production-Grade Flutter Products'",
          ar: "تركيز صريح على بناء تطبيقات Flutter جاهزة للإنتاج الفعلي",
        },
        body: {
          en: "Makes it unmistakable within three seconds what he builds and why serious mobile teams hire him.",
          ar: "يوضّح للزائر خلال ثلاث ثوانٍ طبيعة التخصص الدقيق ومستوى الجودة الهندسية المقدمة.",
        },
      },
      {
        tag: { en: "Conversion-Ready Flow", ar: "مسار واضح لطلب المشاريع" },
        title: {
          en: "Dedicated 'Start a Project' CTA & Services breakdown",
          ar: "ربط مباشر بين سابقة الأعمال وطلب خدمة تطوير جديدة",
        },
        body: {
          en: "Turns portfolio traffic directly into qualified mobile product inquiries.",
          ar: "يحوّل زيارات الإعجاب بالأعمال والمقالات إلى فرص عمل ومشاريع تطبيقات فعلية.",
        },
      },
      {
        tag: { en: "High-Contrast Dark UI", ar: "واجهة داكنة عصرية وسريعة" },
        title: {
          en: "Crisp dark studio aesthetic with energetic coral-orange accents",
          ar: "تصميم داكن أنيق وعالي التباين يبرز لقطات شاشات التطبيقات",
        },
        body: {
          en: "Frames mobile app screenshots, system cards, and long-form technical reading cleanly on both desktop and mobile.",
          ar: "يمنح شاشات الهواتف المعروضة والمقالات الطويلة خلفية مريحة ومنظمة على كافة الأحجام.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Production Platform (youssefguba-os.vercel.app)",
        ar: "منصة حية منشورة وتعمل فعليًا (youssefguba-os.vercel.app)",
      },
      summary: {
        en: "Live in production across all 10 bilingual AR/EN routes and connected to Sanity CMS; open the live site directly from the preview button on this page.",
        ar: "المنصة منشورة وتعمل فعليًا عبر مساراتها العشرة باللغتين العربية والإنجليزية ومرتبطة بـ Sanity CMS، ومتاحة للزيارة الفورية عبر زر المعاينة.",
      },
      highlights: [
        {
          en: "Verified live domain open for direct browsing",
          ar: "نطاق حي وموثّق متاح للتصفح المباشر",
        },
        {
          en: "Next.js App Router + Sanity Studio + full AR/EN mirror",
          ar: "تعمل بـ Next.js وSanity Studio مع تطابق كامل بين العربية والإنجليزية",
        },
      ],
    },
  },
];
