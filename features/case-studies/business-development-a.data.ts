import type { BusinessCaseData } from "./business-case.types";

export const BUSINESS_DEVELOPMENT_A_CASES: readonly BusinessCaseData[] = [
  /* ── 09 · NILE PHARMA ERP ───────────────────────────────────────── */
  {
    slug: "nile-pharma-erp",
    sector: {
      en: "Enterprise Operations · Pharmaceutical Distribution ERP",
      ar: "أنظمة تشغيل المؤسسات · إدارة وتوزيع المستحضرات الدوائية (ERP)",
    },
    headline: {
      en: "Connecting sales orders, expiry-aware warehouse picking, customer credit, rep commissions, and accounting in one Arabic-first distribution system.",
      ar: "ربط أوامر البيع، وصرف المخزون حسب تاريخ الصلاحية، ومديونيات العملاء، وحوافز المندوبين، والحسابات في منظومة تشغيل دوائية واحدة.",
    },
    summary: {
      en: "Nile Pharma ERP is an enterprise operations platform designed for pharmaceutical and nutraceutical distributors. Instead of running sales on WhatsApp, inventory on Excel, and accounting in a disconnected desktop program, it brings nine business domains—Sales, Inventory, Products, CRM, Rep Incentives, Accounting, Access Control, Organization Structure, and Audit—into one coordinated Arabic RTL workflow.",
      ar: "تمثل منظومة (نايل فارما ERP) نظام تشغيل متكاملاً لشركات توزيع الأدوية والمكملات الغذائية. بدلاً من تشتت أوامر البيع عبر واتساب، وجرد المخازن على ملفات إكسل، وحساب العمولات يدوياً بشكل منفصل عن التحصيل المالي، يجمع النظام تسع إدارات أساسية في بيئة عمل عربية واحدة مترابطة وموثقة بسجل مراجعة كامل.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Pharmaceutical & Nutraceutical Distribution",
          ar: "توزيع الأدوية والمكملات الغذائية",
        },
      },
      {
        label: { en: "Daily Operators", ar: "المستخدمون اليوميون" },
        value: {
          en: "Sales reps, warehouse keepers, accountants & managers",
          ar: "مندوبو المبيعات، أمناء المخازن، المحاسبون، والإدارة العليا",
        },
      },
      {
        label: { en: "Core Business Value", ar: "القيمة التشغيلية والمالية" },
        value: {
          en: "Prevents expired stock loss & ties commissions to cash collection",
          ar: "منع هالك الصلاحية وربط العمولات بالتحصيل النقدي الفعلي",
        },
      },
      {
        label: { en: "Current Access", ar: "وضع المعاينة الحالي" },
        value: {
          en: "Real screens of the running system, on demo data",
          ar: "لقطات حقيقية من النظام وهو يعمل ببيانات تجريبية",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Where pharma distributors lose money and control",
        ar: "أين تخسر شركات التوزيع الدوائي الوقت والمال عادةً",
      },
      beforePoints: [
        {
          en: "Warehouses accidentally ship newer batches while older batches sit on shelves until they expire and become write-offs.",
          ar: "صرف تشغيلات حديثة من المخزن بالخطأ بينما تبقى التشغيلات الأقدم على الأرفف حتى تقترب صلاحيتها من الانتهاء وتتحول إلى خسائر.",
        },
        {
          en: "Sales reps book large credit orders for pharmacies that already have overdue balances, creating cash-flow bottlenecks.",
          ar: "تسجيل طلبيات آجلة لصيدليات أو عملاء تجاوزوا سقف الائتمان المسموح به نتيجة غياب الرؤية اللحظية للمديونيات.",
        },
        {
          en: "Rep commissions calculated on spreadsheets take days every month and cause disputes over returns and uncollected invoices.",
          ar: "حساب حوافز وعمولات المندوبين يدوياً نهاية كل شهر يستغرق أياماً ويفتح باب الخلاف حول المرتجعات والفواتير غير المحصّلة.",
        },
      ],
      afterTitle: {
        en: "How Nile Pharma ERP runs the business",
        ar: "كيف تضبط المنظومة دورة العمل عملياً",
      },
      afterPoints: [
        {
          en: "Enforces FEFO (First-Expired, First-Out) batch allocation automatically so nearest-expiry lots move out first.",
          ar: "تطبيق قاعدة (الأقرب انتهاءً يُصرف أولاً - FEFO) تلقائياً عند حجز وصرف أي طلبية من المخزن.",
        },
        {
          en: "Connects every pharmacy/distributor profile in CRM directly to credit limits, invoice aging, and collection KPIs.",
          ar: "ربط ملف كل صيدلية أو موزع بسقف الائتمان وأعمار الديون ونسب التحصيل الفعلي قبل اعتماد الطلبات الجديدة.",
        },
        {
          en: "Calculates rep incentives transparently from verified sales and collections, while posting financial entries and audit logs automatically.",
          ar: "احتساب حوافز المندوبين آلياً بناءً على المبيعات والتحصيلات المعتمدة، مع ترحيل القيود المحاسبية وتسجيل كل حركة في سجل الرقابة.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Commercial & General Management", ar: "الإدارة التجارية والتنفيذية" },
          benefit: {
            en: "Live visibility into revenue, collection rates, near-expiry stock alerts, and territory performance on one executive console.",
            ar: "رؤية لحظية للمبيعات ونسب التحصيل وتنبيهات قرب انتهاء الصلاحية وأداء المناطق البيعية في شاشة قيادة واحدة.",
          },
        },
        {
          role: { en: "Warehouse & Supply Chain Teams", ar: "إدارة المخازن والإمداد" },
          benefit: {
            en: "Batch-level tracking by lot number and expiry date across warehouses, eliminating manual picking guesswork.",
            ar: "تتبع دقيق لكل تشغيلة برقمها وتاريخ صلاحيتها عبر المستودعات لمنع أخطاء التحضير والجرد.",
          },
        },
        {
          role: { en: "Finance & Sales Operations", ar: "الإدارة المالية وإدارة المبيعات" },
          benefit: {
            en: "Invoices, returns, customer balances, and rep leaderboards reconcile against one shared ledger with full auditability.",
          ar: "تطابق الفواتير والمرتجعات وأرصدة العملاء وحوافز المندوبين ضمن دفتر مالي موحّد قابل للمراجعة في أي وقت.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How an order travels across the company inside Nile Pharma ERP:",
      ar: "رحلة الطلبية داخل النظام من لحظة تسجيلها وحتى التحصيل والحوافز:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Sales & CRM", ar: "المبيعات وإدارة العملاء" },
        title: {
          en: "Order creation against live catalog, pricing & customer credit",
          ar: "تسجيل أمر البيع مع فحص الرصيد وسقف الائتمان",
        },
        detail: {
          en: "A rep or sales desk selects the pharmacy/account, checks current credit standing, and adds approved SKUs and bonus/discount rules.",
          ar: "يختار المندوب أو مسؤول المبيعات حساب الصيدلية، ويتحقق النظام من حالة المديونية والأسعار المعتمدة وعروض البونص.",
        },
      },
      {
        step: "02",
        actor: { en: "Warehouse (FEFO)", ar: "المخازن وصرف التشغيلات" },
        title: {
          en: "Automatic batch reservation by earliest expiry date",
          ar: "حجز وصرف التشغيلات تلقائياً حسب الأقرب صلاحية",
        },
        detail: {
          en: "Inventory assigns stock from the earliest valid expiry batch first and flags low-stock or near-expiry thresholds early.",
          ar: "يوجه النظام أمين المخزن لصرف التشغيلة الأقرب تاريخ انتهاء أولاً، مع إطلاق تنبيهات مبكرة للأصناف منخفضة الرصيد.",
        },
      },
      {
        step: "03",
        actor: { en: "Accounting & Collection", ar: "الحسابات والتحصيل" },
        title: {
          en: "Invoice posting, receivables tracking & cash collection",
          ar: "إصدار الفاتورة ومتابعة التحصيل والقيود المحاسبية",
        },
        detail: {
          en: "Dispatched orders generate balanced financial entries, update customer receivables, and track collection progress against due dates.",
          ar: "تتحول الطلبية المنصرفة إلى فاتورة وقيد محاسبي متوازن يحدّث مديونية العميل ويتابع مواعيد السداد والتحصيل.",
        },
      },
      {
        step: "04",
        actor: { en: "Incentives & Audit", ar: "الحوافز والرقابة" },
        title: {
          en: "Rep commission calculation & immutable activity log",
          ar: "احتساب عمولة المندوب وتوثيق السجل الرقابي",
        },
        detail: {
          en: "Collected revenue feeds into rep targets and incentive tiers while every price, stock, or permission action remains traceable in Audit.",
          ar: "تُحتسب نقاط وعمولات المندوب تلقائياً وفق مستهدفات التحصيل والبيع، مع حفظ سجل رقابي كامل لكل إجراء تم على الطلبية.",
        },
      },
    ],
    featuresIntro: {
      en: "Core business capabilities and operational safeguards:",
      ar: "أهم المميزات العملية التي يقدمها النظام لشركات التوزيع:",
    },
    features: [
      {
        tag: { en: "Expiry Control", ar: "حماية المخزون من الهالك" },
        title: {
          en: "Batch & FEFO inventory management",
          ar: "إدارة المخزون بالتشغيلة وتاريخ الصلاحية (FEFO)",
        },
        body: {
          en: "Tracks every medicine or supplement lot by batch code and expiry date so expiring capital is sold on time, not destroyed.",
          ar: "يتابع كل صنف برقم التشغيلة وتاريخ الانتهاء لضمان تصريف البضاعة بالترتيب الصحيح وتقليل خسائر منتهي الصلاحية.",
        },
      },
      {
        tag: { en: "Unified 9 Domains", ar: "تكامل 9 إدارات" },
        title: {
          en: "Sales, warehouse, CRM, finance & HR incentives in one place",
          ar: "المبيعات والمخازن والعملاء والمالية والحوافز في منصة واحدة",
        },
        body: {
          en: "Eliminates duplicate data entry between departments—one order updates stock, receivables, and rep KPIs together.",
          ar: "يلغي إعادة إدخال البيانات بين الأقسام؛ حركة واحدة تحدّث الرصيد المخزني والحساب المالي وتقارير الأداء.",
        },
      },
      {
        tag: { en: "Rep Performance", ar: "إدارة فريق المبيعات" },
        title: {
          en: "Clear rep leaderboards & rule-based commission tiers",
          ar: "لوحة أداء للمندوبين واحتساب شفاف للعمولات",
        },
        body: {
          en: "Motivates field reps with transparent target progress while protecting company cash flow by factoring in actual collections.",
          ar: "تحفّز فريق البيع عبر عرض واضح لنسب تحقيق المستهدف، مع حماية التدفق النقدي للشركة بربط الحافز بالتحصيل.",
        },
      },
      {
        tag: { en: "Arabic RTL Operations", ar: "واجهة تشغيل عربية أصيلة" },
        title: {
          en: "Built for fast daily use by Arabic-speaking staff",
          ar: "مصممة لسرعة العمل اليومي للموظفين باللغة العربية",
        },
        body: {
          en: "High-density tables, KPI cards, and clear status badges reduce training time for accountants, storekeepers, and sales coordinators.",
          ar: "جداول بيانات واضحة ومؤشرات مباشرة تقلل وقت تدريب المحاسبين وأمناء المخازن ومنسقي المبيعات.",
        },
      },
      {
        tag: { en: "Role Permissions", ar: "صلاحيات ورقابة دقيقة" },
        title: {
          en: "Granular access control & complete audit trail",
          ar: "تحديد صلاحيات كل موظف مع سجل مراجعة لا يُمحى",
        },
        body: {
          en: "Separates who can create an order, approve a discount, release stock, or adjust an entry—and logs who did what and when.",
          ar: "يفصل بوضوح بين صلاحية إنشاء الطلب واعتماد الخصم وصرف البضاعة وتعديل القيود، مع توثيق المستخدم والتوقيت لكل خطوة.",
        },
      },
      {
        tag: { en: "Multi-Branch Ready", ar: "دعم الهيكل التنظيمي والفروع" },
        title: {
          en: "Supports organizational units, territories & warehouses",
          ar: "يدعم تعدد المخازن والمناطق البيعية والوحدات الإدارية",
        },
        body: {
          en: "Lets growing distributors expand into new governorates or product lines without replacing their core system.",
          ar: "يتيح للشركة التوسع في محافظات ومستودعات وخطوط منتجات جديدة على نفس البنية دون الحاجة لتغيير النظام.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Engineered Architecture + Real Product Screens",
        ar: "بنية برمجية متكاملة + لقطات حقيقية من المنصة",
      },
      summary: {
        en: "The 9-service backend and Next.js operator console are built and documented; the product tour shows real screens of the running system on demo data rather than private company records.",
        ar: "تم بناء البنية الخلفية المكونة من 9 خدمات وواجهة التشغيل وتوثيقها، وتعرض جولة المنصة لقطات حقيقية من النظام وهو يعمل ببيانات تجريبية دون كشف بيانات شركات خاصة.",
      },
      highlights: [
        {
          en: "Five real screens of the running system in the Technical Case Study tab",
          ar: "خمس لقطات حقيقية من النظام وهو يعمل في تبويب دراسة الحالة التقنية",
        },
        {
          en: "9 bounded business domains documented in the Technical Case Study tab",
          ar: "تفصيل كامل للخدمات التسع وقواعد البيانات في تبويب دراسة الحالة التقنية",
        },
      ],
    },
  },

  /* ── 10 · UMMAH ACADEMY ─────────────────────────────────────────── */
  {
    slug: "ummah-academy",
    sector: {
      en: "EdTech · Live 1-on-1 Online Academy (5 Languages)",
      ar: "التعليم الإلكتروني · أكاديمية تعليم فردي مباشر بـ 5 لغات",
    },
    headline: {
      en: "Helping families worldwide book trusted 1-on-1 Quran, Tajweed, Arabic, and Islamic studies lessons in five languages—starting with two free trial sessions.",
      ar: "منصة تعليمية بـ 5 لغات تمكّن الأسر حول العالم من حجز دروس فردية مباشرة في القرآن والتجويد والعربية مع معلمين مجازين وتجربتين مجانيتين.",
    },
    summary: {
      en: "Ummah Academy connects non-Arabic-speaking and diaspora Muslim families (children and adults) with vetted, Ijazah-certified teachers for live 1-on-1 instruction in Quran, Tajweed, Arabic language, and Islamic studies. The platform operates across five full languages (English, Arabic, French, German, and Spanish) to guide parents from course discovery and teacher trust to transparent pricing and free trial booking.",
      ar: "تربط (أكاديمية الأمة - Ummah Academy) الأسر والطلاب من الأطفال والكبار حول العالم بمعلمين ومعلمات معتمدين لتقديم دروس فردية مباشرة (1-on-1) في القرآن الكريم والتجويد واللغة العربية والدراسات الإسلامية. تعمل المنصة بخمس لغات كاملة (العربية، الإنجليزية، الفرنسية، الألمانية، والإسبانية) لتسهيل رحلة ولي الأمر من التعرّف على المناهج وكفاءة المعلمين وحتى الاطلاع على الباقات وحجز حصتين تجريبيتين مجاناً.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Global Live 1-on-1 Online Education",
          ar: "التعليم الفردي المباشر عبر الإنترنت للجمهور العالمي",
        },
      },
      {
        label: { en: "Target Customers", ar: "العملاء المستهدفون" },
        value: {
          en: "Parents & adult learners across Europe, Americas & MENA",
          ar: "أولياء الأمور والدارسون في أوروبا وأمريكا والشرق الأوسط",
        },
      },
      {
        label: { en: "Conversion Offer", ar: "عرض جذب المشتركين" },
        value: {
          en: "2 free trial lessons + published plans & family discounts",
          ar: "حصتان تجريبيتان مجاناً + باقات معلنة وخصومات للعائلات",
        },
      },
      {
        label: { en: "Market Reach", ar: "النطاق اللغوي" },
        value: {
          en: "5 complete languages (EN · AR · FR · DE · ES) + PWA",
          ar: "5 لغات كاملة تشمل العربية + تطبيق ويب قابل للتثبيت",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why online Quran & Arabic academies lose international families",
        ar: "لماذا تتردد الأسر بالخارج عند الاشتراك في الأكاديميات التقليدية",
      },
      beforePoints: [
        {
          en: "Parents in France, Germany, Spain, or North America often land on English-only or broken-translation sites where course details and pricing are hidden behind WhatsApp chats.",
          ar: "تواجه الأسر في أوروبا وأمريكا مواقع بلغة واحدة أو ترجمات ركيكة، مع إخفاء الأسعار وتفاصيل المناهج خلف محادثات واتساب غير واضحة.",
        },
        {
          en: "Families worry about teacher qualifications, child safety, and whether female teachers are available for sisters and young girls.",
          ar: "يقلق أولياء الأمور بشأن مستوى إتقان المعلم، أمان بيئة الدرس للأطفال، ومدى توفر معلمات متخصصات للفتيات والسيدات.",
        },
        {
          en: "Heavy, slow WordPress templates perform poorly on mobile phones—where most parents browse links shared in community groups.",
          ar: "المواقع الثقيلة والبطيئة تسبب تجربة سيئة على الهواتف المحمولة التي يتصفح عبرها أغلب أولياء الأمور.",
        },
      ],
      afterTitle: {
        en: "How Ummah Academy builds trust and converts enrollments",
        ar: "كيف تبني المنصة الثقة وتحوّل الزائر إلى مشترك فعلي",
      },
      afterPoints: [
        {
          en: "Greets every family in their native language (EN, AR, FR, DE, ES) across all 23 pages—courses, teacher standards, pricing, FAQs, and trial booking.",
          ar: "مخاطبة كل أسرة بلغتها الأم عبر 23 صفحة متكاملة تغطي المسارات التعليمية، معايير اختيار المعلمين، الأسعار، وحجز التجربة.",
        },
        {
          en: "Publishes a transparent 4-stage teacher vetting pipeline (credentials, Sanad/Tajweed recitation test, teaching demo, background & pedagogy training) plus dedicated female instructors.",
          ar: "توضيح نظام اختيار المعلمين المكون من 4 مراحل صارمة (المؤهلات، اختبار الإجازة والتلاوة، حصة تجريبية عملية، والتدريب التربوي) مع توفير معلمات متخصصات.",
        },
        {
          en: "Removes enrollment risk with 2 free 1-on-1 trial lessons (no upfront commitment), clear monthly tier pricing, and multi-child family discounts.",
          ar: "إزالة تردد الشراء عبر تقديم حصتين تجريبيتين مجاناً بدون التزام مسبق، مع نشر الأسعار بوضوح وتوفير خصومات للأشقاء والعائلات.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Parents Choosing for Their Children", ar: "أولياء الأمور الباحثون عن تعليم آمن لأبنائهم" },
          benefit: {
            en: "Clear curriculum milestones, child-friendly 1-on-1 pacing, female teacher option, and two free trial classes before paying.",
            ar: "وضوح المنهج التعليمي، مرونة المواعيد الفردية، توفر معلمات، وإمكانية تجربة مستويين مجاناً قبل الاشتراك.",
          },
        },
        {
          role: { en: "Adult Learners & Reverts", ar: "الدارسون الكبار والمسلمون الجدد" },
          benefit: {
            en: "Structured tracks from zero-alphabet Noorani/reading foundations up to Ijazah-level memorization and classical Arabic.",
            ar: "مسارات متدرجة تبدأ من تأسيس القراءة الصحيحة من الصفر وحتى الحفظ المتقن واللغة العربية.",
          },
        },
        {
          role: { en: "Academy Admissions & Operations", ar: "إدارة القبول والتشغيل بالأكاديمية" },
          benefit: {
            en: "Structured trial requests arrive with language, student age, track preference, and schedule needs already captured.",
            ar: "استقبال طلبات التجربة مصنّفة باللغة وعمر الطالب والمسار المطلوب لتسريع تنسيق الموعد مع المعلم المناسب.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a family moves from discovering the academy to ongoing 1-on-1 classes:",
      ar: "رحلة الأسرة والطالب داخل المنصة من الزيارة الأولى وحتى انتظام الدراسة:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Multilingual Discovery", ar: "التصفح باللغة الأم" },
        title: {
          en: "Selecting language & exploring the 4 core learning tracks",
          ar: "اختيار اللغة واستعراض المسارات التعليمية الأربعة",
        },
        detail: {
          en: "Visitors browse Quran Reading/Hifz, Tajweed Mastery, Arabic Language, or Islamic Studies in English, Arabic, French, German, or Spanish.",
          ar: "يتصفح الزائر مسارات القرآن والحفظ، إتقان التجويد، اللغة العربية، أو الدراسات الإسلامية بلغته المفضلة بوضوح كامل.",
        },
      },
      {
        step: "02",
        actor: { en: "Trust Verification", ar: "التحقق من جودة المعلمين والأسعار" },
        title: {
          en: "Reviewing the 4-stage Sanad vetting & transparent pricing",
          ar: "مراجعة معايير اعتماد المعلمين ومقارنة الباقات الشهرية",
        },
        detail: {
          en: "Parents inspect how teachers are tested and compare weekly class frequencies and family discounts upfront with zero hidden fees.",
          ar: "يطلع ولي الأمر على آلية اختبار المعلمين ويقارن عدد الحصص الأسبوعية وتكلفة الباقات وخصومات الأشقاء بشفافية تامة.",
        },
      },
      {
        step: "03",
        actor: { en: "Risk-Free Trial", ar: "حجز التجربة المجانية" },
        title: {
          en: "Booking 2 free 1-on-1 trial lessons",
          ar: "طلب حصتين فرديتين مجاناً لتقييم المستوى",
        },
        detail: {
          en: "The family submits a short trial booking selecting preferred teacher gender, time zone, and student goals.",
          ar: "يسجّل الطالب أو ولي الأمر طلب التجربة محدداً الأوقات المناسبة لتوقيته الزمني وتفضيل معلم أو معلمة.",
        },
      },
      {
        step: "04",
        actor: { en: "Placement & Continuity", ar: "تحديد المستوى والانتظام" },
        title: {
          en: "Level assessment & tailored weekly 1-on-1 study plan",
          ar: "تقييم المستوى وبدء الخطة الفردية الأسبوعية",
        },
        detail: {
          en: "After the two trial sessions, the student receives a clear starting level and continues on their chosen monthly schedule, with installable PWA access on mobile.",
          ar: "بعد الحصتين التجريبيتين يحصل الطالب على تقييم لمستواه ويبدأ جدوله الأسبوعي المنتظم مع إمكانية تثبيت المنصة على الهاتف.",
        },
      },
    ],
    featuresIntro: {
      en: "Commercial and product advantages of Ummah Academy:",
      ar: "أهم المميزات التنافسية والعملية لمنصة أكاديمية الأمة:",
    },
    features: [
      {
        tag: { en: "5-Market Reach", ar: "التوسع في 5 أسواق لغوية" },
        title: {
          en: "Native EN, AR, FR, DE & ES experience (195 pages total)",
          ar: "دعم كامل لـ 5 لغات يفتح أسواق أوروبا وأمريكا والعالم العربي",
        },
        body: {
          en: "Unlocks non-English European Muslim markets (French, German, Spanish) alongside English and RTL Arabic without third-party translation widgets.",
          ar: "يمكّن الأكاديمية من مخاطبة الجاليات الناطقة بالفرنسية والألمانية والإسبانية والإنجليزية والعربية بمحتوى أصيل ومتقن.",
        },
      },
      {
        tag: { en: "High-Trust Vetting", ar: "موثوقية الكادر التعليمي" },
        title: {
          en: "Documented 4-stage teacher selection & Sanad standards",
          ar: "إبراز منهجية اختيار المعلمين المجازين عبر 4 مراحل",
        },
        body: {
          en: "Directly answers parents' #1 hesitation online by showing exactly how recitation accuracy and teaching ability are verified.",
          ar: "يجيب مباشرة عن أهم سؤال يشغل الأسرة عبر شرح خطوات التحقق من الإجازة وسلامة المخارج وأسلوب التعامل التربوي.",
        },
      },
      {
        tag: { en: "Frictionless Funnel", ar: "إزالة عوائق الاشتراك" },
        title: {
          en: "2 free trial lessons instead of aggressive upfront checkout",
          ar: "حصتان تجريبيتان مجاناً ترفع معدل الاطمئنان والتحويل",
        },
        body: {
          en: "Lets children and parents experience the actual teacher and classroom interaction before paying for a monthly package.",
          ar: "تمنح الطالب والأسرة فرصة تجربة الشرح والتفاعل الحقيقي مع المعلم قبل اتخاذ قرار الدفع الشهري.",
        },
      },
      {
        tag: { en: "Transparent Pricing", ar: "تسعير واضح وعادل" },
        title: {
          en: "Published monthly plans + multi-student family discounts",
          ar: "باقات معلنة بوضوح مع خصومات مخصصة للأسر والأشقاء",
        },
        body: {
          en: "Respects busy parents who want to budget for two or three children immediately without waiting for sales callbacks.",
          ar: "تساعد ولي الأمر على حساب ميزانية تعليم أبنائه فوراً دون الحاجة للانتظار في محادثات تسعير مطوّلة.",
        },
      },
      {
        tag: { en: "Instant Mobile Speed", ar: "سرعة فائقة على الهواتف" },
        title: {
          en: "Near-instant page loads & installable PWA on any phone",
          ar: "تحميل فوري للصفحات مع إمكانية التثبيت كتطبيق على الهاتف",
        },
        body: {
          en: "Static architecture keeps ad and WhatsApp landing pages fast even on modest mobile data connections.",
          ar: "تضمن البنية الخفيفة فتح صفحات الهبوط فوراً من الإعلانات أو روابط المجموعات دون فقدان الزوار بسبب البطء.",
        },
      },
      {
        tag: { en: "Female Instructors", ar: "توفير معلمات متخصصات" },
        title: {
          en: "Dedicated female Quran & Arabic teachers clearly highlighted",
          ar: "مسار واضح لاختيار معلمات مجازات للسيدات والفتيات",
        },
        body: {
          en: "Addresses a major household requirement clearly across course and trial booking flows.",
          ar: "يلبي احتياجاً أساسياً للأسر والطالبات بشكل صريح ومباشر أثناء استعراض المسارات وطلب التجربة.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Public Multilingual Platform Live · Portal Cutover In Progress",
        ar: "المنصة العامة متاحة بـ 5 لغات · بوابة الدارسين قيد الاستكمال",
      },
      summary: {
        en: "The 5-language public acquisition platform and PWA are live for preview; custom domain cutover, live trial backend wiring, and the authenticated student/teacher portal remain actively in progress.",
        ar: "منصة التعريف والتسويق وحجز التجربة متاحة للمعاينة الحية بخمس لغات، بينما يجري استكمال ربط النطاق المخصص والخلفية التشغيلية لبوابة الطلاب والمعلمين.",
      },
      highlights: [
        {
          en: "Live preview available across all 5 languages & RTL/LTR layouts",
          ar: "معاينة حية متاحة لجميع اللغات الخمس مع دعم كامل للعربية RTL",
        },
        {
          en: "Covers 23 localized routes per language + offline-ready PWA shell",
          ar: "تشمل 23 مساراً لكل لغة مع قابلية التثبيت كتطبيق ويب",
        },
      ],
    },
  },

  /* ── 11 · SPEECH-TO-TEXT STUDIO ─────────────────────────────────── */
  {
    slug: "speech-to-text-studio",
    sector: {
      en: "AI Productivity & Media Workflow · Speech to Text Studio",
      ar: "أدوات الذكاء الاصطناعي والإعلام · استوديو تحويل الكلام إلى نص",
    },
    headline: {
      en: "Turning lectures, interviews, podcasts, and voice notes into clean, editable transcripts and SRT subtitles—backed by four speech engines so work never stops.",
      ar: "تحويل المحاضرات والمقابلات والبودكاست والتسجيلات الصوتية إلى نصوص قابلة للتحرير وملفات ترجمة SRT عبر 4 محركات ذكاء اصطناعي مع تبديل تلقائي يمنع توقف العمل.",
    },
    summary: {
      en: "Speech to Text Studio is a bilingual Arabic/English transcription workspace built for journalists, researchers, content creators, students, and operations teams. Users can upload large audio/video files (up to 300 MB), paste a media link, or record straight from their microphone; the platform routes the audio across four top speech-to-text engines (Deepgram, Gladia, AssemblyAI, Speechmatics) with automatic failover, then opens an interactive workspace to edit text and export TXT or SRT subtitle files.",
      ar: "استوديو تحويل الكلام إلى نص هو مساحة عمل ثنائية اللغة للتفريغ الصوتي صُممت للصحفيين والباحثين وصناع المحتوى والطلاب وفرق العمل. يتيح النظام رفع ملفات صوت أو فيديو كبيرة (حتى 300 ميجابايت)، أو إدراج رابط وسائط، أو التسجيل المباشر من الميكروفون؛ ليعالج الصوت عبر 4 محركات عالمية للتعرّف على الكلام مع تبديل تلقائي عند ضغط الطلبات، ثم يفتح محرراً عملياً لمراجعة النص وتصديره بصيغة TXT أو ملفات ترجمة فيديو SRT.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Media Production, Research & AI Transcription",
          ar: "الإنتاج الإعلامي والبحث العلمي والتفريغ الصوتي الذكي",
        },
      },
      {
        label: { en: "Target Users", ar: "المستخدمون المستهدفون" },
        value: {
          en: "Podcasters, video editors, journalists, researchers & students",
          ar: "صناع الفيديو والبودكاست، الصحفيون، الباحثون، والطلاب",
        },
      },
      {
        label: { en: "Reliability Edge", ar: "الميزة التشغيلية" },
        value: {
          en: "4 STT engines with automatic failover on quota/outage",
          ar: "4 محركات تعرّف صوتي مع انتقال تلقائي يمنع فشل المهمة",
        },
      },
      {
        label: { en: "Input & Output", ar: "المدخلات والمخرجات" },
        value: {
          en: "Upload (300 MB) / URL / Live Mic → Editable Text, TXT & SRT",
          ar: "ملف حتى 300MB / رابط / ميكروفون ← محرر نصي وتصدير TXT وSRT",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why single-provider transcription tools frustrate daily users",
        ar: "لماذا تعاني فرق الإعلام والباحثون مع أدوات التفريغ المعتادة",
      },
      beforePoints: [
        {
          en: "Relying on one speech provider means a sudden rate limit, API outage, or tricky Arabic dialect recording halts deadline work completely.",
          ar: "الاعتماد على مزود واحد يعني تعطل التسليم بالكامل إذا انتهت الحصة المجانية، أو توقفت الخدمة مؤقتاً، أو ضعفت دقة المحرك مع لهجة عربية معينة.",
        },
        {
          en: "Most browser tools choke on long 1–2 hour lecture or podcast recordings above 25 MB.",
          ar: "تفشل كثير من الأدوات السحابية البسيطة عند رفع محاضرة طويلة أو حلقة بودكاست يتجاوز حجمها 25 ميجابايت.",
        },
        {
          en: "Teams bringing their own API keys worry about pasting secret keys into insecure client-side websites.",
          ar: "يخشى المستخدمون المحترفون والشركات من وضع مفاتيح الـ API الخاصة بهم في مواقع تحفظها بشكل مكشوف في المتصفح.",
        },
      ],
      afterTitle: {
        en: "How Speech to Text Studio makes transcription dependable",
        ar: "كيف يحل استوديو تحويل الكلام إلى نص هذه المشكلات عملياً",
      },
      afterPoints: [
        {
          en: "Combines Deepgram, Gladia, AssemblyAI, and Speechmatics behind one smart router—let it pick automatically with failover, or choose a specific engine.",
          ar: "دمج 4 من أقوى محركات التفريغ الصوتي خلف موجّه ذكي يختار الأنسب وينتقل تلقائياً لمحرك بديل عند حدوث أي خطأ أو ضغط.",
        },
        {
          en: "Accepts three practical capture paths in one screen: direct file uploads up to 300 MB, remote media URLs, and live in-browser microphone recording.",
          ar: "توفير ثلاث طرق إدخال عملية في شاشة واحدة: رفع الملفات الكبيرة حتى 300 ميجابايت، الروابط المباشرة، أو التسجيل الحي من الميكروفون.",
        },
        {
          en: "Supports safe Bring-Your-Own-Key (BYOK) sessions stored in encrypted server-only cookies, plus instant inline editing and SRT caption export.",
          ar: "دعم استخدام المفاتيح الخاصة للمستخدم (BYOK) بأمان على الخادم دون كشفها، مع محرر نصي فوري وتصدير ملفات الترجمة الزمنية SRT.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Video Editors & Content Creators", ar: "مونتيرو الفيديو وصناع المحتوى" },
          benefit: {
            en: "Upload raw episode audio, fix names or terms inside the editor, and download time-coded SRT subtitles ready for Premiere, DaVinci, or CapCut.",
            ar: "رفع الصوت الخام وتصحيح الأسماء والمصطلحات سريعاً ثم تنزيل ملف ترجمة SRT مضبوط التوقيت لبرامج المونتاج مباشرة.",
          },
        },
        {
          role: { en: "Journalists, Researchers & Students", ar: "الصحفيون والباحثون وطلاب الدراسات" },
          benefit: {
            en: "Record interviews on the spot or upload long lectures up to 300 MB and get searchable, clean Arabic or English text.",
            ar: "تسجيل المقابلات مباشرة أو رفع المحاضرات الطويلة واستخراج نص عربي أو إنجليزي منظم يسهل الاقتباس منه ومراجعته.",
          },
        },
        {
          role: { en: "Power Users & Small Studios", ar: "المستخدمون المحترفون والاستوديوهات" },
          benefit: {
            en: "Plug in their own provider API keys securely to run high-volume transcription at direct wholesale API cost.",
            ar: "إدخال مفاتيح المزودين الخاصة بهم بأمان لتفريغ ساعات طويلة بتكلفة المزود المباشرة دون اشتراكات وسيطة مرتفعة.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a recording goes from raw audio to finished transcript or video captions:",
      ar: "كيف يعمل الاستوديو خطوة بخطوة من إدخال الصوت وحتى استلام الملف النهائي:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Audio Input", ar: "إدخال المادة الصوتية" },
        title: {
          en: "Upload file (up to 300 MB), paste link, or record live mic",
          ar: "رفع ملف كبير، لصق رابط، أو التسجيل الحي من الميكروفون",
        },
        detail: {
          en: "The user drops in an audio/video file, enters a direct URL, or captures a voice note right in the browser with language/engine preferences.",
          ar: "يختار المستخدم رفع ملف صوتي أو مرئي (حتى 300 ميجابايت)، أو وضع رابط مباشر، أو بدء تسجيل صوتي فوري مع تحديد اللغة.",
        },
      },
      {
        step: "02",
        actor: { en: "Smart Routing", ar: "المعالجة والتبديل التلقائي" },
        title: {
          en: "Multi-engine processing with automatic failover",
          ar: "تشغيل التفريغ عبر المحركات الأربعة مع الحماية من التوقف",
        },
        detail: {
          en: "In Auto mode, if the primary STT provider times out or hits a quota limit, the studio retries seamlessly on the next healthy engine.",
          ar: "في الوضع التلقائي، إذا واجه المحرك الأول ضغطاً أو نفاد حصة، يحوّل النظام الطلب فوراً للمحرك التالي دون ضياع الملف.",
        },
      },
      {
        step: "03",
        actor: { en: "Review & Edit", ar: "المراجعة والتحرير النصي" },
        title: {
          en: "Polishing text inside the bilingual transcript workspace",
          ar: "تدقيق وتعديل النصوص داخل مساحة العمل التفاعلية",
        },
        detail: {
          en: "Once transcribed, segments open in a clean RTL/LTR-aware editor where the user can refine wording, punctuation, and speaker phrasing.",
          ar: "يظهر النص المفرّغ مقسماً بوضوح داخل محرر يدعم العربية والإنجليزية لتصحيح أي مصطلح أو علامة ترقيم بسهولة.",
        },
      },
      {
        step: "04",
        actor: { en: "Export & Reuse", ar: "التصدير والاستخدام" },
        title: {
          en: "One-click copy, plain TXT download, or timed SRT captions",
          ar: "نسخ فوري، تنزيل ملف نصي TXT، أو ملف ترجمة فيديو SRT",
        },
        detail: {
          en: "Users export clean prose for articles/notes or timestamped SRT subtitle files for video timelines, with local history saved for quick recall.",
          ar: "يصدّر المستخدم النتيجة كنص مقالي جاهز للنشر أو كملف ترجمة SRT متوافق مع برامج الفيديو، مع حفظ السجل للرجوع السريع.",
        },
      },
    ],
    featuresIntro: {
      en: "Key practical advantages of Speech to Text Studio:",
      ar: "أهم المميزات العملية لاستوديو تحويل الكلام إلى نص:",
    },
    features: [
      {
        tag: { en: "Zero Single Point of Failure", ar: "استمرارية بدون انقطاع" },
        title: {
          en: "4 leading speech engines under one roof",
          ar: "4 محركات عالمية للتعرّف على الكلام في واجهة واحدة",
        },
        body: {
          en: "Unites Deepgram, Gladia, AssemblyAI, and Speechmatics so users get both Arabic/English accuracy and automatic backup.",
          ar: "يجمع Deepgram وGladia وAssemblyAI وSpeechmatics ليضمن دقة عالية بالعربية والإنجليزية مع بديل جاهز دائماً.",
        },
      },
      {
        tag: { en: "Long-Form Ready", ar: "دعم الملفات الطويلة" },
        title: {
          en: "Handles large recordings up to 300 MB",
          ar: "استيعاب التسجيلات والمحاضرات الكبيرة حتى 300 ميجابايت",
        },
        body: {
          en: "Built for real full-length interviews, university lectures, and podcast episodes—not just 60-second voice clips.",
          ar: "مصمم للتعامل مع المقابلات الكاملة والمحاضرات الجامعية وحلقات البودكاست الطويلة دون تقطيع يدوي ممل.",
        },
      },
      {
        tag: { en: "3 Capture Modes", ar: "3 وسائل إدخال مرنة" },
        title: {
          en: "File upload, remote URL, and built-in mic recorder",
          ar: "رفع ملفات، روابط خارجية، ومسجّل ميكروفون مدمج",
        },
        body: {
          en: "Covers desk editing, cloud-hosted media links, and spontaneous voice dictation in the same tool.",
          ar: "يخدم المونتير الذي يرفع ملفات المونتاج، والباحث الذي يملك رابطاً صوتياً، والكاتب الذي يملي أفكاره مباشرة.",
        },
      },
      {
        tag: { en: "Subtitle Export", ar: "جاهزية المونتاج والترجمة" },
        title: {
          en: "Direct SRT subtitle & TXT document export",
          ar: "تصدير مباشر لملفات الترجمة الزمنية SRT والنصوص TXT",
        },
        body: {
          en: "Turns hours of manual video caption typing into a quick review-and-export step.",
          ar: "يختصر ساعات من كتابة ومزامنة نصوص الفيديو يدوياً إلى خطوة مراجعة وتصدير سريعة.",
        },
      },
      {
        tag: { en: "Cost & Key Control", ar: "تحكم كامل بالمفاتيح والتكلفة" },
        title: {
          en: "Secure server-side BYOK (Bring Your Own Key) mode",
          ar: "وضع آمن لإدخال مفاتيح الـ API الخاصة بالمستخدم",
        },
        body: {
          en: "Keys stay inside encrypted HttpOnly cookies—never exposed in browser scripts—letting teams control their own provider spend.",
          ar: "تُحفظ المفاتيح في جلسات مشفرة على الخادم ولا تظهر في المتصفح، مما يمنح الفرق أماناً وتحكماً كاملاً باستهلاكهم.",
        },
      },
      {
        tag: { en: "Bilingual UX", ar: "تجربة ثنائية اللغة" },
        title: {
          en: "Native Arabic RTL & English LTR interface and editing",
          ar: "واجهة ومحرر نصوص يدعمان العربية والإنجليزية بطلاقة",
        },
        body: {
          en: "Proper text direction, typography, and controls whether transcribing an Arabic lecture or an English tech talk.",
          ar: "اتجاه قراءة وتحرير سليم ومريح سواء كان الملف المفرّغ محاضرة عربية أو لقاءً باللغة الإنجليزية.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Deployed Web Application",
        ar: "تطبيق ويب حي ومتاح للتجربة المباشرة",
      },
      summary: {
        en: "Deployed and accessible via the live preview link, featuring live mic capture, file/URL intake, 4-provider failover routing, BYOK credential vaulting, and TXT/SRT export.",
        ar: "التطبيق منشور ومتاح للتجربة عبر رابط المعاينة الحية، ويشمل التسجيل الصوتي ورفع الملفات والتوجيه الذكي بين المحركات الأربعة وتصدير TXT وSRT.",
      },
      highlights: [
        {
          en: "Live production deployment open for direct testing",
          ar: "نسخة حية منشورة وجاهزة للتجربة المباشرة",
        },
        {
          en: "Supports Arabic & English transcription workflows end to end",
          ar: "يدعم دورة التفريغ والتحرير والتصدير كاملة بالعربية والإنجليزية",
        },
      ],
    },
  },

  /* ── 12 · STEMFORGE ─────────────────────────────────────────────── */
  {
    slug: "stemforge",
    sector: {
      en: "Music & Audio Production Tools · On-Device AI",
      ar: "أدوات الصوت والإنتاج الموسيقي · ذكاء اصطناعي يعمل على جهازك",
    },
    headline: {
      en: "Splitting any audio track into isolated vocals, drums, bass, and instruments right inside your browser—with zero upload wait and full file privacy.",
      ar: "فصل أي مقطع صوتي إلى مسارات مستقلة (الصوت البشري، الإيقاع، البيز، والموسيقى) مباشرة داخل متصفحك بخصوصية تامة ودون رفع الملفات.",
    },
    summary: {
      en: "StemForge is an audio stem separation workspace for musicians, producers, podcast/video editors, and educators. Instead of uploading unreleased songs or large WAV files to a paid cloud queue, StemForge runs neural separation directly on the user's own device in the browser (using WebGPU / WebAssembly), while also offering an optional cloud GPU fast path for heavy workloads—complete with a multi-track mixer and WAV stem export.",
      ar: "توفّر أداة (StemForge) مساحة عمل صوتية للموسيقيين ومهندسي الصوت ومونتيري الفيديو والمعلمين لعزل عناصر المقطع الصوتي عن بعضها. بدلاً من رفع أعمالك الخاصة أو ملفات WAV الضخمة إلى مواقع خارجية والانتظار في طوابير مدفوعة، يشغّل النظام نموذج الفصل الذكي مباشرة على جهاز المستخدم داخل المتصفح للحفاظ على الخصوصية وتجنب تكلفة السحابة، مع إتاحة مسار سحابي اختياري سريع، وميكسر للاستماع وتصدير كل مسار بصيغة WAV.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Audio Engineering, Music Practice & Post-Production",
          ar: "الهندسة الصوتية والمونتاج والتدريب الموسيقي",
        },
      },
      {
        label: { en: "Primary Users", ar: "المستخدمون المستهدفون" },
        value: {
          en: "Producers, musicians, video/podcast editors & vocal coaches",
          ar: "المنتجون الموسيقيون، العازفون، المونتيرون، ومدربو الصوت",
        },
      },
      {
        label: { en: "Business & Privacy Edge", ar: "الميزة الاقتصادية والخصوصية" },
        value: {
          en: "Zero cloud upload by default = private files & $0 server burn",
          ar: "المعالجة على جهاز المستخدم تحفظ سرية الملفات وتلغي تكلفة الخوادم",
        },
      },
      {
        label: { en: "Output Deliverables", ar: "المخرجات" },
        value: {
          en: "4 isolated stems (Vocals · Drums · Bass · Other) + WAV export",
          ar: "4 مسارات معزولة (صوت بشري · إيقاع · بيز · آلات) بصيغة WAV",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Pain points with cloud-only stem splitters",
        ar: "عيوب أدوات فصل الصوت السحابية التقليدية",
      },
      beforePoints: [
        {
          en: "Producers and rights-sensitive editors hesitate to upload unreleased recordings or client interviews to third-party servers.",
          ar: "يتردد المنتجون والمونتيرون في رفع تسجيلات حصرية أو مواد خاصة بالعملاء إلى خوادم خارجية غير معروفة السياسات.",
        },
        {
          en: "Cloud stem splitters charge per-minute credits because GPU servers are expensive—limiting experimentation and practice.",
          ar: "تفرض المواقع السحابية رسوماً على كل دقيقة صوتية لتغطية تكلفة معالجاتها، مما يقيّد التجربة والاستخدام اليومي.",
        },
        {
          en: "Uploading a 60–100 MB lossless WAV file on slow upload connections takes longer than the separation itself.",
          ar: "رفع ملف صوتي غير مضغوط بحجم كبير عبر سرعات رفع متوسطة يستغرق وقتاً أطول من عملية الفصل نفسها.",
        },
      ],
      afterTitle: {
        en: "How StemForge works differently",
        ar: "كيف يغيّر StemForge تجربة العمل الصوتي",
      },
      afterPoints: [
        {
          en: "Runs 4-stem separation locally inside the browser tab using the user's own GPU/CPU—audio stays on the machine.",
          ar: "تشغيل نموذج الفصل الرباعي محلياً داخل المتصفح بالاعتماد على معالج جهاز المستخدم نفسه دون مغادرة الملف للجهاز.",
        },
        {
          en: "Clearly explains device capability upfront (WebGPU speed vs WASM fallback) and offers an explicit opt-in cloud GPU option only when requested.",
          ar: "توضيح قدرات الجهاز بصدق قبل البدء، مع توفير خيار معالجة سحابية سريعة بشكل اختياري صريح عند رغبة المستخدم فقط.",
        },
        {
          en: "Includes an interactive 4-channel solo/mute/volume mixer right in the browser before downloading lossless WAV stems.",
          ar: "توفير ميكسر تفاعلي رباعي القنوات للاستماع المنفرد (Solo) أو الكتم (Mute) وضبط الصوت قبل تنزيل ملفات WAV النهائية.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Musicians, Singers & Educators", ar: "العازفون والمنشدون والمدربون" },
          benefit: {
            en: "Mute vocals to create practice backing tracks, or solo bass/drum lines to study arrangements at zero per-song cost.",
            ar: "كتم الصوت البشري للتدرب على الأداء، أو عزل مسار الإيقاع والآلات لدراسته بدقة دون دفع رسوم عن كل ملف.",
          },
        },
        {
          role: { en: "Video & Documentary Editors", ar: "مونتيرو الفيديو والأفلام الوثائقية" },
          benefit: {
            en: "Isolate spoken voice from noisy background music in archival or field clips without sending client footage off-device.",
            ar: "عزل التعليق الصوتي أو الحوار عن الموسيقى الخلفية المزعجة مع الحفاظ الكامل على خصوصية مادة العميل.",
          },
        },
        {
          role: { en: "Product Operator (Unit Economics)", ar: "منظور البيزنس وتكلفة التشغيل" },
          benefit: {
            en: "Shifting inference to client WebGPU lets thousands of free users run heavy AI audio tasks without bankrupting server GPU bills.",
            ar: "نقل المعالجة الثقيلة إلى متصفح المستخدم يتيح خدمة آلاف المستخدمين مجاناً دون تحمّل فواتير خوادم رسومية باهظة.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a user separates and exports stems in four simple steps:",
      ar: "رحلة المستخدم داخل الأداة من اختيار المقطع وحتى تصدير المسارات:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Track Selection", ar: "اختيار الملف الصوتي" },
        title: {
          en: "Drop in a local audio file (MP3, WAV, FLAC, M4A)",
          ar: "سحب وإفلات المقطع الصوتي من جهازك مباشرة",
        },
        detail: {
          en: "The file loads instantly into browser memory—zero upload bar—and displays duration and detected hardware acceleration.",
          ar: "يُقرأ الملف فوراً داخل ذاكرة المتصفح بدون انتظار رفع، مع عرض مدة المقطع وحالة تسريع كرت الشاشة بالجهاز.",
        },
      },
      {
        step: "02",
        actor: { en: "Engine Choice", ar: "اختيار نمط المعالجة" },
        title: {
          en: "Run privately on-device (WebGPU/WASM) or opt into fast server GPU",
          ar: "المعالجة المحلية الخاصة أو تفعيل المسار السحابي السريع اختيارياً",
        },
        detail: {
          en: "Default mode processes chunks in a background Web Worker so the UI stays responsive with live progress updates.",
          ar: "يعمل الوضع الافتراضي محلياً في الخلفية مع شريط تقدم حي دون تجميد شاشة المتصفح أثناء الفصل.",
        },
      },
      {
        step: "03",
        actor: { en: "Live Stem Audition", ar: "الاستماع والموازنة الصوتية" },
        title: {
          en: "Solo, mute & balance Vocals, Drums, Bass, and Other in real time",
          ar: "التحكم في المسارات الأربعة عبر الميكسر المدمج",
        },
        detail: {
          en: "All four isolated stems play in sample-accurate sync so the user can inspect separation quality immediately.",
          ar: "تعمل المسارات الأربعة بتزامن لحظي دقيق يتيح كتم أي عنصر أو الاستماع إليه منفرداً للتحقق من نقاء العزل.",
        },
      },
      {
        step: "04",
        actor: { en: "Stem Export", ar: "تصدير الملفات" },
        title: {
          en: "Download individual WAV stems for any DAW or video timeline",
          ar: "تنزيل المسارات المعزولة بصيغة WAV لبرامج الصوت والمونتاج",
        },
        detail: {
          en: "Exports clean WAV files ready to drop straight into Ableton, Logic Pro, FL Studio, Premiere, or Audition.",
          ar: "حفظ أي مسار مطلوب بجودة WAV القياسية الجاهزة للإدراج المباشر في برامج الهندسة الصوتية أو المونتاج.",
        },
      },
    ],
    featuresIntro: {
      en: "Practical advantages for audio users and sustainable AI product economics:",
      ar: "أهم المميزات العملية والتجارية في StemForge:",
    },
    features: [
      {
        tag: { en: "100% Private Default", ar: "خصوصية كاملة افتراضياً" },
        title: {
          en: "Your audio never leaves your computer in browser mode",
          ar: "ملفاتك الصوتية لا تغادر جهازك في وضع المتصفح",
        },
        body: {
          en: "Ideal for unreleased demos, confidential interviews, and client post-production work.",
          ar: "ميزة حاسمة لأصحاب الأعمال غير المنشورة والمقابلات الحساسة ومشاريع العملاء الخاصة.",
        },
      },
      {
        tag: { en: "Sustainable Economics", ar: "نموذج اقتصادي ذكي" },
        title: {
          en: "No per-song credit paywalls for local processing",
          ar: "بلا قيود نقاط أو اشتراكات إجبارية للمعالجة المحلية",
        },
        body: {
          en: "Because the user's own hardware runs the model, there is no server GPU meter ticking on every track.",
          ar: "اعتماد المعالجة على جهاز المستخدم يزيل عبء تكلفة السيرفر عن كل دقيقة صوتية يتم فصلها.",
        },
      },
      {
        tag: { en: "4-Stem Precision", ar: "عزل رباعي المسارات" },
        title: {
          en: "Clean split into Vocals, Drums, Bass & Accompaniment",
          ar: "فصل واضح للصوت البشري والإيقاع والبيز وباقي الآلات",
        },
        body: {
          en: "Covers the four essential building blocks needed for remixing, karaoke/backing tracks, dialogue cleanup, and transcription.",
          ar: "يوفر العناصر الأربعة الأساسية المطلوبة لإعادة التوزيع، مسارات التدريب، أو تنظيف الحوار الصوتي.",
        },
      },
      {
        tag: { en: "Built-In Mixer", ar: "ميكسر استماع فوري" },
        title: {
          en: "Synchronized multi-track playback before you download",
          ar: "معاينة صوتية متزامنة قبل تنزيل الملفات الكبيرة",
        },
        body: {
          en: "Test solo/mute combinations and level balances right in the tab—no need to download four large WAVs just to check a section.",
          ar: "اختبر النتيجة ووازن مستويات الصوت داخل الصفحة مباشرة وتأكد من المسار الذي تحتاجه قبل حفظه.",
        },
      },
      {
        tag: { en: "Honest Hybrid Fallback", ar: "مرونة الأجهزة المتعددة" },
        title: {
          en: "WebGPU speed + WASM compatibility + opt-in Cloud CUDA",
          ar: "تكيف ذكي مع قوة الجهاز مع خيار سحابي عند الحاجة",
        },
        body: {
          en: "Fast on modern GPUs, still functional on older browsers, and transparently upgradable to cloud GPU when speed matters most.",
          ar: "يعمل بأقصى سرعة على الأجهزة الحديثة، ويدعم المتصفحات الأقدم، ويوفر مساراً سحابياً اختيارياً للملفات الثقيلة.",
        },
      },
      {
        tag: { en: "Zero Install", ar: "بدون تثبيت برامج" },
        title: {
          en: "Replaces complex Python/Demucs CLI setups with one URL",
          ar: "يغني عن تعقيد تثبيت مكتبات الذكاء الاصطناعي البرمجية",
        },
        body: {
          en: "Gives non-technical creatives instant access to studio-grade neural separation in a clean web interface.",
          ar: "يمنح صناع المحتوى والموسيقيين تقنية عزل احترافية عبر رابط ويب بسيط دون سطر أوامر واحد.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Production Web App",
        ar: "تطبيق ويب حي ومتاح للاستخدام المباشر",
      },
      summary: {
        en: "Live and publicly accessible via the preview link. Model weights download once and cache locally in the browser for subsequent separations.",
        ar: "الأداة منشورة ومتاحة للتجربة الفورية عبر رابط المعاينة؛ يُحمّل نموذج الفصل مرة واحدة ويُحفظ محلياً في المتصفح لتسريع المرات التالية.",
      },
      highlights: [
        {
          en: "Live WebGPU / WASM stem splitter open for hands-on testing",
          ar: "معاينة حية تعمل مباشرة داخل المتصفح على ملفاتك الصوتية",
        },
        {
          en: "Zero mandatory sign-up or file upload in default local mode",
          ar: "لا يتطلب إنشاء حساب أو رفع ملفات في الوضع المحلي الافتراضي",
        },
      ],
    },
  },

  /* ── 13 · OLTRÈ COLLECTIVE (MOMO COLLECTIVE) ────────────────────── */
  {
    slug: "momo-collective",
    sector: {
      en: "Fashion E-Commerce · Egyptian Streetwear & Drop Retail",
      ar: "التجارة الإلكترونية للأزياء · براند ملابس شبابية وإصدارات محدودة",
    },
    headline: {
      en: "A full-stack Egyptian streetwear store combining editorial lookbooks, drop launches, local EGP payment methods, customer loyalty tiers, and a live admin dashboard.",
      ar: "متجر أزياء شبابية متكامل للسوق المصري يجمع العرض البصري للإصدارات المحدودة، ووسائل الدفع المحلية بالجنيه، ونظام ولاء العملاء، ولوحة إدارة المبيعات.",
    },
    summary: {
      en: "OLTRÈ Collective is a direct-to-consumer urban streetwear e-commerce platform tailored for the Egyptian market. It pairs high-impact collection lookbooks and size/stock selection on the storefront with practical local commerce essentials—EGP pricing, automatic free shipping above 2,000 LE, Card / MEEZA / Vodafone Cash checkout, customer wishlists and loyalty points—backed by an operator admin console sharing the same live database.",
      ar: "يمثل متجر (OLTRÈ Collective) منصة تجارة إلكترونية مباشرة للجمهور مخصصة لعلامات الأزياء الشبابية (Streetwear) في مصر. يجمع المشروع بين واجهة عرض بصرية جذابة للمجموعات والإصدارات الجديدة، وبين متطلبات البيع المحلي الفعلية: التسعير بالجنيه المصري، الشحن المجاني التلقائي للطلبات فوق 2,000 ج.م، الدفع بالبطاقات البنكية وميزة وفودافون كاش، قائمة المفضلة ونقاط الولاء، مع لوحة تحكم إدارية شاملة مرتبطة بنفس قاعدة البيانات.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "D2C Fashion & Limited-Drop Streetwear",
          ar: "التجارة الإلكترونية المباشرة للأزياء الشبابية",
        },
      },
      {
        label: { en: "Target Market", ar: "السوق والجمهور" },
        value: {
          en: "Egyptian youth shoppers + brand merchandising operators",
          ar: "المتسوقون في السوق المصري + فريق إدارة وتشغيل البراند",
        },
      },
      {
        label: { en: "Local Payment & Shipping", ar: "منظومة الدفع والشحن" },
        value: {
          en: "EGP · Card, MEEZA & Vodafone Cash · Free ship ≥ 2,000 LE",
          ar: "جنيه مصري · بطاقات وميزة وفودافون كاش · شحن مجاني فوق 2000 ج.م",
        },
      },
      {
        label: { en: "Retention & Ops", ar: "الاستبقاء والإدارة" },
        value: {
          en: "Wishlist, loyalty tiers & unified admin analytics console",
          ar: "مفضلة، شرائح نقاط ولاء، ولوحة تحكم للمخزون والطلبات",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why local streetwear brands outgrow Instagram DM selling",
        ar: "لماذا تخسر براندات الملابس المحلية مبيعاتها عبر رسائل إنستجرام",
      },
      beforePoints: [
        {
          en: "Taking orders via Instagram DMs leads to lost messages during drop nights, oversold sizes, and hours asking 'price?' or 'available in L?'.",
          ar: "استقبال الطلبات عبر الرسائل يسبب ضياع العملاء وقت إطلاق الكوليكشن، وبيع مقاسات نافدة بالخطأ، وإهدار ساعات في الرد على الأسعار والمقاسات.",
        },
        {
          en: "Generic foreign store templates push USD checkouts or credit-card-only flows that miss Egyptian buyers paying via MEEZA or Vodafone Cash.",
          ar: "القوالب الأجنبية الجاهزة لا تراعي عادات الشراء في مصر مثل الدفع ببطاقات (ميزة) أو محافظ (فودافون كاش) وحساب الشحن بالمحافظات.",
        },
        {
          en: "Repeat buyers—the lifeblood of drop-based fashion—get treated like strangers every launch when there is no loyalty or account history.",
          ar: "غياب حسابات العملاء ونظام النقاط يجعل المشتري المتكرر يعامَل كزائر غريب في كل إصدار جديد بدلاً من مكافأته ورفع ولائه للعلامة.",
        },
      ],
      afterTitle: {
        en: "How OLTRÈ Collective runs drop commerce end to end",
        ar: "كيف يدير المتجر دورة البيع والإصدارات باحترافية",
      },
      afterPoints: [
        {
          en: "Presents drops like a fashion editorial while showing live size availability, clear EGP pricing, and progress toward the 2,000 LE free-shipping threshold.",
          ar: "عرض المجموعات بصورة بصرية قوية مع إظهار المقاسات المتاحة لحظياً والأسعار بالجنيه وشريط التقدم للحصول على الشحن المجاني.",
        },
        {
          en: "Supports Egyptian checkout habits directly—Bank Cards, MEEZA, and Vodafone Cash—reducing cart abandonment at payment.",
          ar: "دعم وسائل الدفع الفعلية في مصر (البطاقات البنكية، ميزة، وفودافون كاش) لتقليل ترك السلة في الخطوة الأخيرة.",
        },
        {
          en: "Rewards repeat shoppers through tiered loyalty points and gives brand owners one admin dashboard for products, stock, orders, and revenue.",
          ar: "مكافأة العملاء الدائمين عبر نظام نقاط وشرائح ولاء، مع منح صاحب البراند لوحة إدارة موحّدة للمنتجات والمقاسات والطلبات والإيرادات.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Shoppers & Streetwear Fans", ar: "المتسوقون وجمهور البراند" },
          benefit: {
            en: "Fast mobile browsing, saved wishlists before a drop, local wallet/MEEZA payment, and loyalty points on every order.",
            ar: "تصفح سريع على الهاتف، حفظ القطع في المفضلة، دفع سهل بالمحفظة أو ميزة، وكسب نقاط ولاء مع كل طلب.",
          },
        },
        {
          role: { en: "Brand Owners & Merchandisers", ar: "أصحاب البراند ومسؤولو المنتجات" },
          benefit: {
            en: "Launch collections, update SKU sizes/prices, and monitor top-selling pieces and revenue from one admin view.",
            ar: "إطلاق المجموعات الجديدة وتحديث أرصدة المقاسات والأسعار ومتابعة القطع الأكثر مبيعاً من شاشة تحكم واحدة.",
          },
        },
        {
          role: { en: "Fulfillment & Customer Support", ar: "فريق التجهيز وخدمة العملاء" },
          benefit: {
            en: "Structured orders with exact size, shipping address, payment method, and status progression instead of scattered chat screenshots.",
            ar: "استلام طلبات منظمة بالمقاس والعنوان وطريقة الدفع وحالة التوصيل بدلاً من الفوضى في محادثات الشات.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a collection drop flows from storefront discovery to order fulfillment:",
      ar: "رحلة الشراء والتشغيل داخل المتجر من تصفح الكوليكشن وحتى تسليم الطلب:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Drop Discovery", ar: "استكشاف الإصدارات" },
        title: {
          en: "Editorial lookbooks, category filters & wishlist saving",
          ar: "تصفح اللوك بوك، تصفية الفئات، وحفظ القطع في المفضلة",
        },
        detail: {
          en: "Shoppers explore hoodies, tees, cargo pieces, and seasonal drops, inspect garment cuts/sizes, and save favorites to their wishlist.",
          ar: "يستعرض المتسوق القطع والإصدارات الموسمية وصور القصّات وجدول المقاسات، ويحفظ اختياراته في قائمة المفضلة.",
        },
      },
      {
        step: "02",
        actor: { en: "Cart & Basket Value", ar: "السلة ورفع قيمة الطلب" },
        title: {
          en: "Size selection & live 2,000 LE free-shipping threshold",
          ar: "اختيار المقاس وحافز الشحن المجاني عند 2,000 ج.م",
        },
        detail: {
          en: "As items enter the cart, the drawer calculates EGP totals and shows how much remains to unlock free domestic shipping.",
          ar: "تحسب السلة الإجمالي بالجنيه المصري وتوضّح للعميل المبلغ المتبقي للحصول على شحن مجاني، مما يشجع إضافة قطعة ثانية.",
        },
      },
      {
        step: "03",
        actor: { en: "Localized Checkout", ar: "إتمام الدفع المحلي" },
        title: {
          en: "Checkout via Card, MEEZA, or Vodafone Cash + loyalty points",
          ar: "الدفع بالبطاقة أو ميزة أو فودافون كاش مع احتساب نقاط الولاء",
        },
        detail: {
          en: "Buyers enter Egyptian delivery details, choose their preferred local payment channel, and earn loyalty points tied to their account.",
          ar: "يدخل المشتري عنوان التوصيل ويختار وسيلة الدفع المناسبة له في مصر، وتُضاف نقاط الولاء تلقائياً إلى حسابه.",
        },
      },
      {
        step: "04",
        actor: { en: "Admin Operations", ar: "إدارة الطلبات والمخزون" },
        title: {
          en: "Order processing, stock deduction & sales analytics",
          ar: "تجهيز الطلبات، تحديث أرصدة المقاسات، ومتابعة المبيعات",
        },
        detail: {
          en: "In the admin dashboard, staff review incoming orders, update fulfillment statuses, manage inventory counts, and track revenue metrics.",
          ar: "من لوحة الإدارة يتابع الفريق الطلبات الجديدة، يحدّث حالات الشحن، يراقب كميات المقاسات، ويستعرض تقارير الإيرادات.",
        },
      },
    ],
    featuresIntro: {
      en: "Commercial features built specifically for local fashion brands:",
      ar: "أهم المميزات التجارية والعملية في متجر OLTRÈ Collective:",
    },
    features: [
      {
        tag: { en: "Egypt-Ready Checkout", ar: "وسائل دفع محلية" },
        title: {
          en: "Supports Bank Cards, MEEZA & Vodafone Cash in EGP",
          ar: "دعم البطاقات البنكية وميزة وفودافون كاش بالجنيه المصري",
        },
        body: {
          en: "Matches how young Egyptian shoppers actually pay online instead of forcing international-only payment rails.",
          ar: "يتوافق تماماً مع طرق الدفع الأكثر انتشاراً بين الشباب في السوق المصري لرفع نسبة إتمام الطلبات.",
        },
      },
      {
        tag: { en: "AOV Booster", ar: "رفع متوسط السلة" },
        title: {
          en: "Built-in 2,000 LE free-shipping rule",
          ar: "نظام تحفيز تلقائي للشحن المجاني فوق 2,000 ج.م",
        },
        body: {
          en: "Nudges single-item shoppers to add an accessory or second tee rather than paying a separate delivery fee.",
          ar: "يشجّع المشتري بشكل عملي على زيادة قيمة سلته للاستفادة من الإعفاء من رسوم التوصيل.",
        },
      },
      {
        tag: { en: "Customer Retention", ar: "ولاء العملاء وتكرار الشراء" },
        title: {
          en: "Loyalty tiers, points ledger & saved wishlists",
          ar: "برنامج نقاط وشرائح ولاء مع قائمة مفضلة محفوظة",
        },
        body: {
          en: "Turns one-time drop buyers into returning members who accumulate status and come back for the next release.",
          ar: "يحوّل المشتري العابر إلى عميل دائم يعود مع كل كوليكشن جديد للاستفادة من نقاطه ومزايا شريحته.",
        },
      },
      {
        tag: { en: "Unified Backoffice", ar: "لوحة تحكم شاملة" },
        title: {
          en: "Storefront and Admin share one PostgreSQL source of truth",
          ar: "واجهة المتجر ولوحة الإدارة على قاعدة بيانات واحدة لحظية",
        },
        body: {
          en: "Price updates, sold-out sizes, and new collection items reflect immediately without syncing plugins.",
          ar: "أي تعديل في السعر أو نفاد مقاس أو إضافة منتج جديد يظهر فوراً أمام المتسوقين دون تعارض بيانات.",
        },
      },
      {
        tag: { en: "Brand Heat + Speed", ar: "جاذبية بصرية وسرعة تصفح" },
        title: {
          en: "Editorial streetwear look without sacrificing checkout clarity",
          ar: "تصميم يليق ببراند أزياء عصري مع خطوات شراء مباشرة",
        },
        body: {
          en: "Gives the brand strong visual attitude on lookbooks while keeping size charts, cart, and totals crystal clear.",
          ar: "يمنح البراند حضوراً بصرياً قوياً في عرض الصور دون أي تعقيد يعطّل اختيار المقاس وإتمام الشراء.",
        },
      },
      {
        tag: { en: "Bilingual Support", ar: "ثنائي اللغة" },
        title: {
          en: "Seamless Arabic & English shopping experience",
          ar: "تجربة تسوق سلسة باللغتين العربية والإنجليزية",
        },
        body: {
          en: "Serves shoppers comfortably whether they prefer browsing streetwear drops in English or completing delivery details in Arabic.",
          ar: "يخدم المتسوق بمرونة سواء فضّل تصفح القطع بالإنجليزية أو إدخال بيانات التوصيل والدفع بالعربية.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Full-Stack Storefront Preview",
        ar: "متجر متكامل حي ومتاح للمعاينة المباشرة",
      },
      summary: {
        en: "Publicly deployed and inspectable via the live preview link, demonstrating collection browsing, size/cart logic, wishlist, loyalty mechanics, and localized Egyptian checkout flows.",
        ar: "المتجر منشور ومتاح للتجربة الحية عبر رابط المعاينة، ويعرض تصفح المجموعات، منطق المقاسات والسلة، المفضلة، نظام الولاء، ومسار الدفع المحلي.",
      },
      highlights: [
        {
          en: "Live deployed storefront open for interactive browsing",
          ar: "واجهة المتجر الحية متاحة للتصفح والتجربة المباشرة",
        },
        {
          en: "Built around real Egyptian D2C fashion unit economics",
          ar: "مصمم خصيصاً لمتطلبات براندات الملابس المباشرة في السوق المصري",
        },
      ],
    },
  },

  /* ── 14 · FARM CONSOLE (BAYAN · بيان المزرعة) ───────────────────── */
  {
    slug: "farm-console",
    sector: {
      en: "AgriTech · Livestock Herd, Health & Profit Management",
      ar: "التقنية الزراعية · إدارة مزارع الإنتاج الحيواني والحسابات",
    },
    headline: {
      en: "Replacing paper barn notebooks with an offline-capable Arabic phone and desktop system that tracks every animal, vaccination, breeding cycle, and pound of farm profit.",
      ar: "استبدال الدفاتر الورقية في المزارع بنظام عربي يعمل حتى مع ضعف الإنترنت لمتابعة كل رأس بالقطيع، والتطعيمات، والتلقيح، وصافي الربح الفعلي.",
    },
    summary: {
      en: "Bayan (بيان المزرعة / Farm Console) is an Arabic-first livestock operations PWA built for sheep, goat, and cattle farm owners, veterinarians, and barn supervisors. Workers sign in quickly with a farm access code (even on phones in low-signal barns) to log individual ear-tag records, weights, vaccinations, treatments, breeding lineages, feed expenses, and animal sales—giving the owner a clear, real-time picture of herd health and net financial return.",
      ar: "توفّر منصة (بيان المزرعة - Farm Console) نظام تشغيل عربياً عملياً لأصحاب مزارع الأغنام والماعز والأبقار والأطباء البيطريين ومشرفي العنابر. يدخل العامل أو المشرف برمز وصول سريع من هاتفه — حتى في المناطق ضعيفة الشبكة — لتسجيل أرقام القطيع، الأوزان، جداول التحصين والعلاج، سلاسل النسب والتلقيح، ومصروفات الأعلاف والمبيعات؛ ليحصل صاحب المزرعة على رؤية دقيقة لصحة القطيع وصافي الربح الحقيقي.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Livestock Farming (Cattle, Sheep & Goats)",
          ar: "مزارع الثروة الحيوانية (تسمين وتربية وألبان)",
        },
      },
      {
        label: { en: "Daily Users", ar: "المستخدمون" },
        value: {
          en: "Farm owners, barn supervisors & visiting veterinarians",
          ar: "أصحاب المزارع، مشرفو العنابر، والأطباء البيطريون",
        },
      },
      {
        label: { en: "Core Business Value", ar: "القيمة المباشرة للمزرعة" },
        value: {
          en: "Prevents missed vaccines, inbreeding & hidden feed losses",
          ar: "منع فوات التحصينات وزواج الأقارب بالقطيع وكشف خسائر الأعلاف",
        },
      },
      {
        label: { en: "Field Readiness", ar: "جاهزية العمل الميداني" },
        value: {
          en: "Offline-capable Arabic PWA + simple access-code login",
          ar: "يعمل بدون إنترنت كتطبيق هاتف مع دخول مبسط برمز المزرعة",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "How farms lose animals and margin without a system",
        ar: "المشكلات اليومية التي تستنزف أرباح المزارع التقليدية",
      },
      beforePoints: [
        {
          en: "Paper notebooks and scattered WhatsApp voice notes get lost, smudged, or forgotten—leading to missed booster vaccinations and preventable mortality.",
          ar: "الاعتماد على الكشكول الورقي ورسائل واتساب الصوتية يؤدي لضياع تواريخ الجرعات التنشيطية والتحصينات، ما يرفع نسب النفوق والخسارة.",
        },
        {
          en: "Without lineage records on hand during mating, farms accidentally pair closely related animals, lowering fertility and offspring weight.",
          ar: "غياب سجل النسب لحظة التلقيح يوقع المزرعة في تزاوج الأقارب المباشر، مما يضعف الخصوبة ومعدلات نمو المواليد.",
        },
        {
          en: "Owners spend heavily on feed and medicine all season without knowing their true cost per head or net profit until animals are sold.",
          ar: "ينفق صاحب المزرعة مبالغ كبيرة على الأعلاف والأدوية طوال الموسم دون معرفة تكلفة الرأس الواحدة أو صافي الربح الحقيقي أولاً بأول.",
        },
      ],
      afterTitle: {
        en: "How Bayan organizes the farm day to day",
        ar: "كيف تضبط منصة (بيان المزرعة) التشغيل والحسابات",
      },
      afterPoints: [
        {
          en: "Gives every animal a digital file by ear-tag number—tracking species, age, weight history, mother/father lineage, and current status.",
          ar: "ملف رقمي مستقل لكل رأس برقم الأذن يشمل النوع، العمر، تطور الأوزان، الأب والأم، والحالة الصحية والإنتاجية.",
        },
        {
          en: "Validates breeding rules automatically (blocking invalid pairings and tracking gestation dates) and schedules veterinary vaccines and withdrawal alerts.",
          ar: "فحص تلقائي لقواعد التلقيح وسلاسل النسب مع حساب مواعيد الولادة المتوقعة وتنبيهات التحصينات الدورية والعلاجات.",
        },
        {
          en: "Connects daily feed/medical expenses and livestock sales into clear Arabic financial dashboards showing revenues, costs, and net farm profit.",
          ar: "ربط مصروفات الأعلاف والبيطرة والإيرادات البيعية في تقارير مالية عربية واضحة تكشف صافي الربح والتكلفة الفعلية.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Farm Owners & Investors", ar: "أصحاب المزارع والمستثمرون" },
          benefit: {
            en: "Monitor herd headcount, births/deaths, feed spend, and net profit remotely from their phone anytime without waiting for monthly visits.",
            ar: "متابعة أعداد القطيع والمواليد ومصروفات الأعلاف وصافي الربح عن بُعد في أي لحظة دون انتظار الزيارة الأسبوعية للمزرعة.",
          },
        },
        {
          role: { en: "Barn Supervisors & Workers", ar: "مشرفو العنابر والعمال" },
          benefit: {
            en: "Simple Arabic screens, quick access-code entry (no email/password hassle), and offline logging inside rural barns.",
            ar: "واجهة عربية واضحة وكبيرة الأزرار مع دخول سريع برمز المزرعة وإمكانية التسجيل داخل العنبر حتى عند انقطاع الشبكة.",
          },
        },
        {
          role: { en: "Visiting Veterinarians", ar: "الأطباء البيطريون" },
          benefit: {
            en: "Instant medical history, prior treatments, and breeding status per ear tag before prescribing or vaccinating.",
            ar: "الاطلاع الفوري على التاريخ المرضي والتطعيمات السابقة وحالة العشار لكل رأس برقم الأذن قبل إعطاء أي دواء.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How daily farm operations run on Bayan from barn floor to owner dashboard:",
      ar: "دورة العمل اليومية داخل المزرعة عبر النظام:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Farm Setup & Access", ar: "الدخول السريع للمزرعة" },
        title: {
          en: "Install on phone & sign in with farm access code",
          ar: "تثبيت التطبيق على الهاتف والدخول برمز الوصول",
        },
        detail: {
          en: "The owner or supervisor installs the PWA straight from the browser and opens the farm workspace via code-gated role access.",
          ar: "يثبّت المشرف أو المالك النظام مباشرة على هاتفه ويدخل إلى مساحة المزرعة بصلاحيات محددة دون تعقيد البريد الإلكتروني.",
        },
      },
      {
        step: "02",
        actor: { en: "Herd & Lineage Registry", ar: "سجل القطيع والتلقيح" },
        title: {
          en: "Register animals, weights, matings & new births",
          ar: "تسجيل الرؤوس والأوزان وعمليات التلقيح والمواليد",
        },
        detail: {
          en: "Newborn or purchased animals get tagged with sex, breed, weight, and parent IDs; mating logs calculate expected lambing/calving dates.",
          ar: "تُسجّل الرؤوس المشتراة أو المولودة ببيانات السلالة والوزن والأبوين، مع حساب تلقائي لمواعيد الولادة المتوقعة بعد التلقيح.",
        },
      },
      {
        step: "03",
        actor: { en: "Health & Feed Operations", ar: "الرعاية البيطرية والأعلاف" },
        title: {
          en: "Log vaccinations, treatments & feed consumption offline or online",
          ar: "تدوين التحصينات والعلاجات ومصروفات العلف يومياً",
        },
        detail: {
          en: "Workers record herd-wide vaccine campaigns or individual illnesses in the barn; entries queue locally offline and sync automatically when signal returns.",
          ar: "تُدوّن حملات التحصين الجماعية أو الحالات الفردية واستهلاك الأعلاف في الميدان، وتُحفظ محلياً ثم تتزامن تلقائياً فور توفر الإنترنت.",
        },
      },
      {
        step: "04",
        actor: { en: "Sales & Profit Review", ar: "المبيعات والتقارير المالية" },
        title: {
          en: "Record sales & review live profit/loss and herd KPIs",
          ar: "تسجيل عمليات البيع ومراجعة صافي الربح ومؤشرات القطيع",
        },
        detail: {
          en: "Animal sales update active herd counts automatically and feed straight into the financial summary alongside feed, labor, and vet costs.",
          ar: "عند بيع أي رأس يُخصم تلقائياً من القطيع النشط ويُضاف إيراده إلى الملخص المالي مقابل تكاليف العلف والعمالة والعلاج.",
        },
      },
    ],
    featuresIntro: {
      en: "Why Bayan fits real rural farm conditions in Egypt and the Arab world:",
      ar: "أهم المميزات العملية التي تجعل (بيان المزرعة) مناسباً للواقع الميداني:",
    },
    features: [
      {
        tag: { en: "Rural Offline Support", ar: "يعمل في ضعف الشبكة" },
        title: {
          en: "Offline-capable PWA built for remote farm locations",
          ar: "مصمم للعمل في المزارع البعيدة وضعيفة التغطية",
        },
        body: {
          en: "Farms rarely have fiber Wi-Fi in the pens—workers keep logging events offline and sync when back in coverage.",
          ar: "لا يتوقف تسجيل الأوزان أو التطعيمات بسبب انقطاع الشبكة داخل العنابر، بل يُحفظ العمل ويتزامن تلقائياً لاحقاً.",
        },
      },
      {
        tag: { en: "No App-Store Friction", ar: "تثبيت فوري بدون متجر" },
        title: {
          en: "Installs directly on Android, iPhone, or PC + code login",
          ar: "يعمل على أي هاتف أو كمبيوتر مع دخول سريع برمز المزرعة",
        },
        body: {
          en: "Field workers don't need Apple/Google store accounts or corporate emails to start recording barn data.",
          ar: "لا يحتاج العامل لحسابات متاجر تطبيقات أو بريد إلكتروني معقد؛ يفتح الرابط ويثبّته ويدخل برمز المزرعة.",
        },
      },
      {
        tag: { en: "Breeding Safeguards", ar: "حماية السلالة والخصوبة" },
        title: {
          en: "Lineage tracking & automatic inbreeding checks",
          ar: "تتبع الأنساب والتنبيه ضد زواج الأقارب في القطيع",
        },
        body: {
          en: "Protects herd genetics and birth weights by checking sire/dam relationships and sex/age rules before logging a mating.",
          ar: "يحمي جودة القطيع ومعدلات التحويل عبر التحقق من صلة القرابة والجنس والعمر قبل اعتماد سجل التلقيح.",
        },
      },
      {
        tag: { en: "Health Calendar", ar: "انضباط الرعاية البيطرية" },
        title: {
          en: "Scheduled vaccinations, treatments & medical history",
          ar: "جدولة التحصينات الدورية وحفظ السجل العلاجي لكل رأس",
        },
        body: {
          en: "Reduces preventable disease outbreaks by showing upcoming and overdue herd health tasks clearly.",
          ar: "يقلل مخاطر العدوى والنفوق عبر عرض التطعيمات المستحقة والمتأخرة بوضوح أمام المشرف والطبيب.",
        },
      },
      {
        tag: { en: "True Farm Profit", ar: "حسابات دقيقة للمزرعة" },
        title: {
          en: "Links herd events directly to feed costs, sales & net profit",
          ar: "ربط مباشر بين حركة القطيع ومصروفات الأعلاف وصافي الربح",
        },
        body: {
          en: "Shows the owner whether each cycle is actually profitable after feed, vet, and operating expenses.",
          ar: "يوضّح لصاحب المزرعة بالأرقام الحقيقية هل الدورة رابحة فعلاً بعد خصم تكاليف العلف والأدوية والتشغيل.",
        },
      },
      {
        tag: { en: "Tested Reliability", ar: "منطق تشغيلي مختبر" },
        title: {
          en: "37 operational screens backed by 672 automated domain tests",
          ar: "37 شاشة تشغيلية مدعومة بـ 672 اختباراً آلياً لقواعد العمل",
        },
        body: {
          en: "Financial totals, herd counts, and breeding rules are rigorously verified so farm numbers stay trustworthy.",
          ar: "تم اختبار قواعد الحسابات وحركة القطيع والتلقيح برمجياً بدقة لضمان سلامة الأرقام التي يعتمد عليها المالك.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Production-Candidate System + Interactive Showcase",
        ar: "نظام جاهز للتشغيل الفعلي + معاينة تفاعلية حية",
      },
      summary: {
        en: "Built across 37 Arabic RTL screens with 672 passing automated tests; an interactive browser showcase is linked right on this page so you can explore herd, health, breeding, and finance screens firsthand.",
        ar: "يضم النظام 37 شاشة عربية متكاملة مدعومة بـ 672 اختباراً آلياً؛ وتتوفر نسخة معاينة تفاعلية مباشرة من هذه الصفحة لاستكشاف سجلات القطيع والصحة والتلقيح والحسابات عملياً.",
      },
      highlights: [
        {
          en: "Interactive live demo available without creating an account",
          ar: "معاينة تفاعلية مباشرة متاحة للتجربة الفورية بدون تسجيل حساب",
        },
        {
          en: "Covers herd registry, breeding, vet health, feed & finance",
          ar: "يغطي سجل القطيع، التلقيح، الرعاية البيطرية، الأعلاف، والمالية",
        },
      ],
    },
  },

  /* ── 15 · CODE & CANVAS WEB PLATFORM ────────────────────────────── */
  {
    slug: "code-canvas-dev",
    sector: {
      en: "B2B Agency Commerce · Fixed-Scope Studio Platform",
      ar: "منصات خدمات الأعمال · منصة استوديو بنطاق وتسعير معلن",
    },
    headline: {
      en: "Turning vague agency retainers into a transparent bilingual catalog of 23 fixed-scope services across software, brand, and healthcare—with published price bands.",
      ar: "تحويل خدمات الاستوديو من عروض غامضة إلى كتالوج ثنائي اللغة يضم 23 خدمة محددة المخرجات والتكلفة عبر البرمجة والهوية والقطاع الصحي.",
    },
    summary: {
      en: "The Code & Canvas web platform (codeandcanvas.net) is the commercial engine for a two-practice MENA studio. Instead of forcing every prospect onto a discovery call just to learn what is included or what a project roughly costs, it publishes 82 bilingual EN/AR pages detailing 23 fixed-scope services across Technology, Creative, and Healthcare, complete with transparent price bands, milestone payment schedules, and an interactive ERP proposal builder (CanvasOne).",
      ar: "تمثل المنصة الرقمية لاستوديو (Code & Canvas) المحرك التجاري والتسويقي للاستوديو باللغتين العربية والإنجليزية. بدلاً من إجبار كل عميل محتمل على حجز اجتماعات مطوّلة لمعرفة المخرجات أو حدود التكلفة التقريبية، تنشر المنصة 82 صفحة ثنائية اللغة تفصّل 23 خدمة واضحة النطاق عبر مسارات التكنولوجيا والإبداع والرعاية الصحية، مع إعلان شرائح التسعير وجدولة الدفعات وأداة تفاعلية لتسعير وتكوين أنظمة الـ ERP.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "B2B Software, Brand & Healthcare Digital Services",
          ar: "خدمات تطوير البرمجيات والهويات والحلول الصحية للشركات",
        },
      },
      {
        label: { en: "Target Buyers", ar: "العملاء المستهدفون" },
        value: {
          en: "Startup founders, clinic/hospital directors & SME owners",
          ar: "مؤسسو الشركات، مديرو العيادات والمستشفيات، وأصحاب الأعمال",
        },
      },
      {
        label: { en: "Commercial Model", ar: "النموذج التجاري" },
        value: {
          en: "23 fixed-scope services + published price bands & milestones",
          ar: "23 خدمة محددة النطاق + شرائح أسعار معلنة ودفعات مرحلية",
        },
      },
      {
        label: { en: "Platform Scale", ar: "حجم المنصة" },
        value: {
          en: "82 static EN/AR pages + interactive CanvasOne ERP configurator",
          ar: "82 صفحة ثنائية اللغة + أداة عرض وتسعير تفاعلية لأنظمة ERP",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why B2B service websites fail to qualify serious buyers",
        ar: "لماذا تفشل أغلب مواقع شركات البرمجة والتصميم في حسم قرار العميل",
      },
      beforePoints: [
        {
          en: "Most agency websites list vague buzzwords ('digital transformation', 'tailored solutions') with zero deliverables, timelines, or price ranges.",
          ar: "تكتفي معظم مواقع الوكالات بعبارات عامة مثل (حلول رقمية متكاملة) دون ذكر المخرجات الفعلية أو المدة الزمنية أو أي مؤشر للتكلفة.",
        },
        {
          en: "Sales teams waste hours on unqualified calls with leads whose budgets are 10x below enterprise scope—while serious buyers leave due to opacity.",
          ar: "يضيع وقت المبيعات في مكالمات غير متوافقة في الميزانية، بينما ينصرف المشتري الجاد الذي يفضّل الوضوح والشفافية قبل التواصل.",
        },
        {
          en: "Arabic versions of studio websites are often half-translated or missing service detail pages altogether.",
          ar: "غالباً ما تكون النسخة العربية في مواقع الاستوديوهات ناقصة أو مترجمة آلياً ولا تضم صفحات تفصيلية كاملة للخدمات.",
        },
      ],
      afterTitle: {
        en: "How the Code & Canvas platform productizes services",
        ar: "كيف حوّلت المنصة الخدمات الاستشارية إلى باقات واضحة",
      },
      afterPoints: [
        {
          en: "Breaks studio capabilities into 23 concrete, fixed-scope service pages—each stating deliverables, timeline, exclusions, and published fee bands.",
          ar: "تقسيم قدرات الاستوديو إلى 23 صفحة خدمة محددة توضّح بدقة ما يستلمه العميل، مدة التنفيذ، ما لا يشمله العرض، وشريحة السعر.",
        },
        {
          en: "Enforces 100% EN/AR route parity across all 82 pages so Arabic and English decision-makers read the exact same commercial terms.",
          ar: "تطابق تام بنسبة 100% بين النسختين العربية والإنجليزية عبر 82 صفحة ليحصل صانع القرار على نفس التفاصيل التعاقدية بلغته.",
        },
        {
          en: "Includes an interactive CanvasOne ERP proposal experience so enterprise prospects can inspect modules, rollout phases, and governance before booking a call.",
          ar: "تضمين عرض تفاعلي لمنظومة CanvasOne ERP يمكّن مديري الشركات من استعراض الوحدات ومراحل التطبيق عملياً قبل الاجتماع.",
        },
      ],
      stakeholders: [
        {
          role: { en: "SME Owners & Startup Founders", ar: "أصحاب الشركات والمؤسسون" },
          benefit: {
            en: "Compare exact service scopes, timelines, and budget bands privately in two minutes without sitting through a sales pitch.",
            ar: "مقارنة نطاق كل خدمة ومدتها وميزانيتها التقريبية في دقيقتين بوضوح كامل دون الحاجة لمكالمات مبيعات مبدئية.",
          },
        },
        {
          role: { en: "Healthcare & Enterprise Procurement", ar: "إدارات المشتريات والمؤسسات الصحية" },
          benefit: {
            en: "Dedicated healthcare vertical pages and milestone-gated delivery rules that match institutional approval processes.",
            ar: "مسار متخصص للقطاع الصحي وجدولة دفعات مرتبطة بمراحل التسليم تتوافق مع آليات الاعتماد المؤسسي.",
          },
        },
        {
          role: { en: "Studio Partners & Delivery Leads", ar: "إدارة الاستوديو وفرق التنفيذ" },
          benefit: {
            en: "Inbound inquiries arrive pre-aligned on scope, price band, and milestone structure—cutting proposal writing time dramatically.",
            ar: "وصول طلبات التواصل من عملاء مطلعين مسبقاً على النطاق وشريحة السعر، مما يرفع جودة الفرص ويختصر وقت إعداد العروض.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a B2B client evaluates and scopes a project on the platform:",
      ar: "رحلة العميل داخل المنصة من تحديد احتياجه وحتى بدء المشروع:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Practice Selection", ar: "تحديد المسار التخصصي" },
        title: {
          en: "Choosing Technology, Creative, or Healthcare solutions",
          ar: "الاختيار بين مسار التكنولوجيا أو الإبداع أو الحلول الصحية",
        },
        detail: {
          en: "Visitors filter straight to their business need—web/ERP software, brand/packaging systems, or clinic/hospital digital infrastructure.",
          ar: "يتجه الزائر مباشرة للمسار الذي يخص نشاطه سواء كان تطوير أنظمة ومواقع، بناء هوية وتغليف، أو حلولاً رقمية طبية.",
        },
      },
      {
        step: "02",
        actor: { en: "Scope & Budget Review", ar: "مراجعة النطاق والميزانية" },
        title: {
          en: "Inspecting one of the 23 fixed-scope service specifications",
          ar: "استعراض تفاصيل الخدمة والمخرجات وشريحة السعر المعلنة",
        },
        detail: {
          en: "Each service page spells out what is delivered, how many weeks it takes, milestone payment splits, and related companion services.",
          ar: "تعرض كل صفحة قائمة المخرجات المحددة، الجدول الزمني بالأسابيع، تقسيم الدفعات على المراحل، والخدمات المكملة.",
        },
      },
      {
        step: "03",
        actor: { en: "Interactive ERP Scoping", ar: "استعراض عرض الـ ERP التفاعلي" },
        title: {
          en: "Exploring CanvasOne modules & rollout milestones",
          ar: "تجربة مقترح CanvasOne ERP التفاعلي للمشاريع المؤسسية",
        },
        detail: {
          en: "Enterprise buyers walk through an interactive module breakdown showing how multi-department systems are phased and governed.",
          ar: "يستطيع عملاء الأنظمة المؤسسية استكشاف وحدات الـ ERP ومراحل التنفيذ والحوكمة داخل صفحة عرض تفاعلية مخصصة.",
        },
      },
      {
        step: "04",
        actor: { en: "Structured Kickoff", ar: "بدء التعاقد المرحلي" },
        title: {
          en: "Submitting a service-specific brief into milestone delivery",
          ar: "إرسال طلب مرتبط بالخدمة والبدء وفق مراحل تسليم محكومة",
        },
        detail: {
          en: "The buyer initiates contact with the chosen service context already clear, moving straight into kickoff and milestone sign-offs.",
          ar: "يتواصل العميل بعد وضوح الخدمة المطلوبة وشروطها لينتقل الاجتماع مباشرة إلى تفاصيل التنفيذ وجدول التسليم.",
        },
      },
    ],
    featuresIntro: {
      en: "Why this platform works as a B2B commercial asset:",
      ar: "أهم المميزات التجارية والعملية لمنصة كود آند كانفاس:",
    },
    features: [
      {
        tag: { en: "Productized Services", ar: "تحويل الخدمات لباقات واضحة" },
        title: {
          en: "23 fixed-scope offers replace open-ended hourly ambiguity",
          ar: "23 خدمة محددة المخرجات تنهي غموض التسعير بالساعة",
        },
        body: {
          en: "Gives clients predictable deliverables and timelines before signing, reducing scope creep for both sides.",
          ar: "تمنح العميل رؤية مسبقة للمخرجات والمدة والتكلفة، وتحمي الطرفين من تضخم النطاق أثناء التنفيذ.",
        },
      },
      {
        tag: { en: "Published Price Bands", ar: "شفافية الأسعار" },
        title: {
          en: "Upfront fee ranges build immediate buyer trust",
          ar: "إعلان شرائح الأسعار يبني الثقة ويوفّر وقت التفاوض",
        },
        body: {
          en: "Pre-qualifies serious leads automatically while showing confidence and fairness in pricing.",
          ar: "يجذب العملاء الجادين المتوافقين مع الميزانية ويعكس ثقة الاستوديو ووضوح سياسته التسعيرية.",
        },
      },
      {
        tag: { en: "Healthcare Vertical", ar: "تخصص في القطاع الصحي" },
        title: {
          en: "Dedicated solutions for clinics, hospitals & pharma brands",
          ar: "مسار مخصص للعيادات والمستشفيات وشركات الأدوية",
        },
        body: {
          en: "Speaks directly to MENA healthcare operators in their own domain language rather than generic tech jargon.",
          ar: "يخاطب مديري المنشآت الطبية والدوائية بلغة قطاعهم واحتياجاتهم التشغيلية والتنظيمية الفعلية.",
        },
      },
      {
        tag: { en: "82-Page EN/AR Parity", ar: "تطابق ثنائي اللغة 100%" },
        title: {
          en: "Every single service and policy exists in both Arabic & English",
          ar: "كل خدمة وسياسة ومقترح متاح بالكامل بالعربية والإنجليزية",
        },
        body: {
          en: "Automated generator checks ensure Arabic pages never lag behind English updates.",
          ar: "فحوصات آلية تضمن عدم تخلف أي صفحة عربية عن نظيرتها الإنجليزية في المحتوى أو الروابط.",
        },
      },
      {
        tag: { en: "Zero Runtime Bloat", ar: "سرعة وأمان تشغيلي" },
        title: {
          en: "Instant static load speed & zero third-party JS dependencies",
          ar: "تحميل فوري للصفحات بدون اعتماديات خارجية قابلة للتعطل",
        },
        body: {
          en: "Pages open instantaneously on mobile or corporate networks and pass 32 automated accessibility scans.",
          ar: "تفتح الصفحات بسرعة فائقة على الهواتف وشبكات الشركات مع اجتياز 32 فحصاً آلياً لمعايير سهولة الوصول.",
        },
      },
      {
        tag: { en: "Interactive ERP Pitch", ar: "أداة عرض مؤسسي تفاعلية" },
        title: {
          en: "Built-in CanvasOne proposal deck right on the web",
          ar: "تجربة تفاعلية لاستعراض منظومة ERP بدلاً من ملفات PDF الجامدة",
        },
        body: {
          en: "Lets executive committees explore ERP architecture and phased delivery interactively in their browser.",
          ar: "تمكّن اللجان التنفيذية من تصفح مكونات النظام ومراحل إطلاقه بشكل حي ومقنع داخل المتصفح.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Production Platform (codeandcanvas.net)",
        ar: "منصة حية قيد التشغيل الفعلي (codeandcanvas.net)",
      },
      summary: {
        en: "Live in production at codeandcanvas.net across all 82 bilingual EN/AR pages, backed by automated parity, link, and accessibility checks.",
        ar: "المنصة منشورة وتعمل فعلياً على النطاق الرسمي codeandcanvas.net عبر 82 صفحة ثنائية اللغة مدعومة باختبارات آلية للتطابق وسهولة الوصول.",
      },
      highlights: [
        {
          en: "Live production domain open via the preview button",
          ar: "الموقع الرسمي الحي متاح للزيارة المباشرة من زر المعاينة",
        },
        {
          en: "Companion brand identity case study also available (Code & Canvas)",
          ar: "ترتبط أيضاً بدراسة حالة الهوية البصرية التأسيسية للاستوديو",
        },
      ],
    },
  },
];
