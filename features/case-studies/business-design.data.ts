import { GAD_NAME_AR } from "@/lib/client-names";
import { GAD_CLIENT_ORIGIN } from "./client-origin";
import type { BusinessCaseData } from "./business-case.types";

export const BUSINESS_DESIGN_CASES: readonly BusinessCaseData[] = [
  /* ── 01 · GAD INSTITUTE ─────────────────────────────────────────── */
  {
    slug: "gad-institute",
    clientOrigin: GAD_CLIENT_ORIGIN,
    sector: {
      en: "Specialized Healthcare · Heart & Lungs",
      ar: "رعاية صحية تخصصية · القلب والرئتين",
    },
    headline: {
      en: "Turning a specialized cardiac and pulmonary hospital into a clear, trusted bilingual patient and institutional experience.",
      ar: `بناء منظومة هوية وتوجيه بصري واضحة لـ ${GAD_NAME_AR} تخدم المرضى وعائلاتهم وشركاء التأمين بثقة ووضوح.`,
    },
    summary: {
      en: "GAD Heart & Lungs Institute provides specialized cardiac and pulmonary medical care across outpatient clinics, diagnostics, and inpatient services. The V2.0 brand system unifies how the hospital presents itself across building facades, reception desks, corridor signage, clinical stationery, medical uniforms, and regional healthcare exhibitions.",
      ar: `يقدّم ${GAD_NAME_AR} خدمات طبية تخصصية دقيقة في أمراض وجراحات القلب والصدر عبر العيادات والتشخيص والرعاية الداخلية. يعمل نظام الهوية (الإصدار V2.0) على توحيد حضور المستشفى في كل نقطة يمر بها المريض أو الشريك المؤسسي: من لافتة الواجهة والاستقبال ولوحات التوجيه الداخلي، إلى الروشتات والزي الطبي وأجنحة المعارض الصحية.`,
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Tertiary Cardiac & Pulmonary Care",
          ar: "رعاية طبية تخصصية للقلب والرئتين",
        },
      },
      {
        label: { en: "Primary Audience", ar: "الفئات المستهدفة" },
        value: {
          en: "Patients, families, medical tourists & insurers",
          ar: "المرضى وعائلاتهم، السياحة العلاجية، وشركات التأمين",
        },
      },
      {
        label: { en: "Business Objective", ar: "الهدف التشغيلي والتجاري" },
        value: {
          en: "Clinical trust + clear Arabic/English wayfinding",
          ar: "ترسيخ الثقة الطبية وتسهيل حركة المريض بلغتين",
        },
      },
      {
        label: { en: "System Scope", ar: "نطاق التسليم" },
        value: {
          en: "Strategy, bilingual lockups, signage & V2.0 book",
          ar: "استراتيجية، شعارات ثنائية اللغة، لافتات، ودليل V2.0",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Operational & commercial friction before",
        ar: "التحدي العملي قبل تطوير النظام",
      },
      beforePoints: [
        {
          en: "High-acuity cardiac and respiratory patients arrive anxious; generic hospital visuals either feel cold and intimidating or lack specialist authority.",
          ar: "مريض القلب أو الصدر يدخل المستشفى تحت ضغط وقلق عالٍ؛ والهويات الطبية التقليدية إما تبدو باردة ومربكة أو تفتقر لهيبة التخصص الدقيق.",
        },
        {
          en: "Arabic and English names often break alignment across facade signs, prescriptions, and corridor directories when designed separately.",
          ar: "تباين شكل الاسم العربي والإنجليزي على واجهات المباني ولوحات الممرات والروشتات يضعف الاتساق البصري ويربك الزائر.",
        },
        {
          en: "Contractors printing signage, uniforms, and exhibition booths need exact color and layout rules so output stays consistent across vendors.",
          ar: "تعدد موردي الطباعة وتنفيذ اللافتات والأزياء الطبية بدون دليل قياسي واضح يؤدي لاختلاف الألوان والنسب في كل عملية توريد.",
        },
      ],
      afterTitle: {
        en: "What the V2.0 system changes in practice",
        ar: "ما الذي يغيّره النظام عملياً على أرض الواقع",
      },
      afterPoints: [
        {
          en: "One fused Heart + Lung mark instantly communicates the hospital's exact medical specialty before reading a single word.",
          ar: "رمز بصري موحّد يدمج القلب والرئة يوضّح تخصص المستشفى فوراً حتى قبل قراءة الاسم.",
        },
        {
          en: "Balanced Arabic/English horizontal and vertical lockups keep reception signs, corridor boards, and forms legible at a glance.",
          ar: "توازن مدروس بين النسختين العربية والإنجليزية (أفقياً وعمودياً) يضمن قراءة سريعة وواضحة في الاستقبال والممرات والنماذج الطبية.",
        },
        {
          en: "Pantone-locked colors, infographic palettes, and the V2.0 guidelines let marketing, procurement, and print vendors execute without guesswork.",
          ar: "تثبيت درجات الألوان القياسية ولوحة الرسوم البيانية الطبية داخل دليل V2.0 يمكّن فرق التسويق والمشتريات والمطابع من التنفيذ المباشر دون اجتهادات خاطئة.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Patients & Families", ar: "المرضى وعائلاتهم" },
          benefit: {
            en: "Clearer navigation from street facade to clinic door, paired with calm, reassuring visual communication.",
            ar: "وصول أسهل من واجهة المبنى إلى العيادة المطلوبة، مع تواصل بصري هادئ يبعث على الاطمئنان.",
          },
        },
        {
          role: { en: "Insurers & Institutional Partners", ar: "شركات التأمين والشركاء المؤسسيون" },
          benefit: {
            en: "Cohesive B2B credential decks, official stationery, and Vision 2030 exhibition presence that reflect a governed specialist institution.",
            ar: "ملفات تعريفية ومراسلات رسمية وأجنحة معارض تعكس مؤسسة طبية تخصصية منضبطة وجاهزة للشراكات الكبرى.",
          },
        },
        {
          role: { en: "Hospital Operations & Vendors", ar: "إدارة التشغيل والموردون" },
          benefit: {
            en: "Ready-to-produce specs for signage, staff scrubs, badges, and print forms without redesigning from scratch each time.",
            ar: "مواصفات جاهزة للتنفيذ الفوري للافتات والزي الطبي والبطاقات والمطبوعات دون إعادة التصميم في كل مرة.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How the brand system operates across the real patient and institutional journey:",
      ar: "كيف يعمل النظام عملياً عبر رحلة المريض والشركاء داخل المستشفى وخارجه:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Awareness & Arrival", ar: "الوصول والانطباع الأول" },
        title: {
          en: "Outdoor campaigns & architectural facade signage",
          ar: "الحملات الخارجية ولافتة الواجهة المعمارية",
        },
        detail: {
          en: "Patients first encounter the hospital through outdoor billboards ('Genuine Accessible Care') and high-contrast bilingual facade signage visible from street distance.",
          ar: "يبدأ تواصل المريض مع المستشفى عبر اللوحات الخارجية الرسالية ولافتة الواجهة ثنائية اللغة المصممة بوضوح عالٍ من مسافات الطريق.",
        },
      },
      {
        step: "02",
        actor: { en: "Reception & Wayfinding", ar: "الاستقبال والتوجيه الداخلي" },
        title: {
          en: "Reception wall, directional boards & staff identification",
          ar: "جدارية الاستقبال، لوحات المسارات، وتمييز الطاقم الطبي",
        },
        detail: {
          en: "Inside the building, reception signage, floor directories, and staff uniforms/badges use consistent color coding so visitors immediately distinguish clinical departments and care staff.",
          ar: "داخل المبنى تتكامل جدارية الاستقبال ولوحات توجيه الأقسام مع الزي الطبي وبطاقات التعريف ليسهل تمييز العيادات والطاقم المختص فوراً.",
        },
      },
      {
        step: "03",
        actor: { en: "Clinical Documentation", ar: "التوثيق والمطبوعات الطبية" },
        title: {
          en: "Prescriptions, patient folders, cards & health infographics",
          ar: "الروشتات، ملفات المرضى، والرسوم التوضيحية الصحية",
        },
        detail: {
          en: "Doctors and administrative desks issue prescriptions, appointment cards, and patient education charts built on a dedicated clinical data palette for unmistakable readability.",
          ar: "يستلم المريض الروشتات وبطاقات المواعيد والنشرات التثقيفية المبنية على لوحة ألوان بيانات مخصصة تضمن وضوح التعليمات والأرقام الطبية.",
        },
      },
      {
        step: "04",
        actor: { en: "B2B & Regional Expansion", ar: "التوسع المؤسسي والمعارض" },
        title: {
          en: "Healthcare conferences & Vision 2030 exhibition stands",
          ar: "المؤتمرات الطبية وأجنحة المعارض المتوافقة مع رؤية 2030",
        },
        detail: {
          en: "At medical congresses and insurer meetings, modular exhibition booth graphics and corporate stationery present the institute with unified regional stature.",
          ar: "في المؤتمرات الصحية واجتماعات التعاقدات التأمينية، تقدّم تصاميم الأجنحة والمطبوعات المؤسسية المستشفى بصورة موحّدة تليق بمكانته الإقليمية.",
        },
      },
    ],
    featuresIntro: {
      en: "Concrete commercial and operational advantages of the GAD identity system:",
      ar: "أهم المميزات العملية والتجارية التي يوفرها النظام للمستشفى:",
    },
    features: [
      {
        tag: { en: "Specialty Clarity", ar: "وضوح التخصص" },
        title: {
          en: "Instant Heart + Lung visual recognition",
          ar: "تمييز فوري لتخصص القلب والرئتين",
        },
        body: {
          en: "Separates GAD from general hospitals by embedding both specialties directly into a clean, memorable symbol that scales from a 16px app icon to a building sign.",
          ar: "يميّز المستشفى عن المستشفيات العامة عبر دمج التخصصين في رمز واحد واضح يعمل بنفس الدقة من أيقونة صغيرة على الهاتف وحتى لافتة مبنى كامل.",
        },
      },
      {
        tag: { en: "Bilingual Parity", ar: "توازن ثنائي اللغة" },
        title: {
          en: "Matched Arabic & English lockup architecture",
          ar: "بنية شعار متطابقة بالعربية والإنجليزية",
        },
        body: {
          en: "Pairs Alexandria (Arabic) with Trap and Montserrat (English) in tested horizontal and stacked lockups so neither language looks like an afterthought.",
          ar: "مزاوجة مدروسة بين خط Alexandria العربي وخطّي Trap وMontserrat الإنجليزيين في نسخ أفقية ورأسية متزنة تمنح اللغتين نفس القوة والوضوح.",
        },
      },
      {
        tag: { en: "Clinical Data System", ar: "نظام بيانات طبي" },
        title: {
          en: "Dedicated infographic & chart color palette",
          ar: "لوحة ألوان مخصصة للبيانات والإنفوجرافيك الطبي",
        },
        body: {
          en: "Gives medical marketing and clinical reporting teams pre-tested contrast colors for patient awareness graphics, diagnostic summaries, and annual reports.",
          ar: "توفّر لفرق التوعية الطبية والتقارير درجات لونية مختبرة التباين لعرض الإحصاءات وإرشادات المرضى والتقارير السنوية بوضوح.",
        },
      },
      {
        tag: { en: "Physical Production", ar: "جاهزية التصنيع والطباعة" },
        title: {
          en: "Print- and signage-safe color specifications",
          ar: "مواصفات لونية قياسية للطباعة واللافتات",
        },
        body: {
          en: "Defines exact Pantone, CMYK, and RGB values so exterior acrylic signs, offset stationery, and digital screens all reproduce Deep Blue and Crimson accurately.",
          ar: "تحديد دقيق لقيم Pantone وCMYK وRGB يضمن ثبات الأزرق الطبي والأحمر القرمزي سواء على لافتات الأكريليك الخارجية أو المطبوعات الورقية أو الشاشات.",
        },
      },
      {
        tag: { en: "Multi-Audience Fit", ar: "مخاطبة شرائح متعددة" },
        title: {
          en: "Balances clinical authority with human warmth",
          ar: "معادلة تجمع الهيبة الطبية بالطمأنينة الإنسانية",
        },
        body: {
          en: "Serves four distinct decision-makers at once: anxious patients, accompanying families, international medical visitors, and corporate insurance networks.",
          ar: "تخاطب أربع فئات في وقت واحد: المريض الباحث عن الأمان، أسرته المرافقة، زوار السياحة العلاجية، ومسؤولي التعاقد في شركات التأمين.",
        },
      },
      {
        tag: { en: "Vendor Governance", ar: "حوكمة التنفيذ" },
        title: {
          en: "Complete V2.0 brand book embedded as an operational manual",
          ar: "دليل هوية V2.0 متكامل كمرجع تشغيلي للموردين",
        },
        body: {
          en: "Documents clear-space rules, minimum sizes, prohibited distortions, typography scales, and real mockups so internal teams can onboard any external agency smoothly.",
          ar: "يوثّق قواعد المساحات الآمنة والحد الأدنى للمقاسات والاستخدامات الممنوعة ونماذج التطبيق الفعلي لتسهيل عمل أي وكالة أو مطبعة خارجية.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Delivered V2.0 Identity & Signage System",
        ar: "نظام هوية ولافتات منجز — الإصدار V2.0",
      },
      summary: {
        en: "Delivered across brand strategy, bilingual logo variations, primary and infographic color systems, environmental signage, stationery, outdoor media, and exhibition stand applications, with the complete V2.0 brand book inspectable inline in the Technical Case Study tab.",
        ar: "شمل التسليم استراتيجية الهوية، متغيرات الشعار ثنائية اللغة، نظام الألوان الأساسي ونظام البيانات، اللافتات البيئية، المطبوعات الرسمية، الإعلانات الخارجية، وجناح المعارض، مع إتاحة تصفح دليل V2.0 الكامل داخل تبويب دراسة الحالة التقنية.",
      },
      highlights: [
        {
          en: "Full V2.0 bilingual brand guidelines book included",
          ar: "دليل هوية V2.0 ثنائي اللغة متاح بالكامل للمعاينة",
        },
        {
          en: "Covers digital, print, architectural signage & exhibition touchpoints",
          ar: "يغطي الشاشات، المطبوعات، لافتات المباني، وأجنحة المعارض",
        },
      ],
    },
  },

  /* ── 02 · NILE PHARMA FOOD ──────────────────────────────────────── */
  {
    slug: "nile-pharma",
    sector: {
      en: "Pharmaceuticals & Dietary Supplements",
      ar: "الأدوية والمكملات الغذائية",
    },
    headline: {
      en: "Five years of end-to-end brand, packaging, and campaign governance for an Egyptian pharmaceutical and supplements company.",
      ar: "خمس سنوات من بناء وإدارة الهوية والتغليف والحملات التسويقية لشركة أدوية ومكملات غذائية في السوق المصري.",
    },
    summary: {
      en: "Nile Pharma Food markets pharmaceutical products and specialized dietary supplements (including the Proxeed and Proxerex lines) through pharmacies, doctors, and direct consumer channels. Over a five-year tenure (2020–2025), the brand was rebuilt from zero into one unified commercial system spanning corporate identity, retail packaging cartons, medical rep collateral, highway billboards, pharmacy chain co-marketing, and WordPress web presence.",
      ar: "تعمل شركة نايل فارما فود في قطاع المستحضرات الدوائية والمكملات الغذائية المتخصصة (مثل خط منتجات Proxeed وProxerex) عبر الصيدليات والأطباء والجمهور المباشر. على مدار خمس سنوات متواصلة (2020–2025)، أعيد بناء الهوية من الصفر لتعمل كمنظومة تجارية واحدة تشمل هوية الشركة، علب التغليف الدوائي، أدوات الدعاية الطبية، إعلانات الطرق، وحملات سلاسل الصيدليات الكبرى والموقع الإلكتروني.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Pharma & Nutraceutical Consumer Health",
          ar: "المستحضرات الدوائية والمكملات الغذائية",
        },
      },
      {
        label: { en: "Commercial Channels", ar: "قنوات البيع والتسويق" },
        value: {
          en: "Pharmacies, prescribing doctors, outdoor & digital",
          ar: "الصيدليات، الأطباء، إعلانات الطرق، والمنصات الرقمية",
        },
      },
      {
        label: { en: "Engagement Model", ar: "طبيعة الدور" },
        value: {
          en: "5-year in-house identity owner (2020 → 2025)",
          ar: "مسؤول الهوية البصرية الداخلي لمدة 5 سنوات (2020–2025)",
        },
      },
      {
        label: { en: "Delivery Tracks", ar: "مسارات التسليم" },
        value: {
          en: "Rebrand · Packaging · Retail Campaigns · Web",
          ar: "إعادة الهوية · التغليف · الحملات الترويجية · الموقع",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Commercial problem before the rebrand",
        ar: "المشكلة التجارية قبل إعادة بناء الهوية",
      },
      beforePoints: [
        {
          en: "Operating without visual governance meant corporate stationery, supplement cartons, and social posts looked like unrelated companies.",
          ar: "العمل بدون حوكمة بصرية جعل مطبوعات الشركة وعلب المنتجات ومنشورات السوشيال ميديا تبدو وكأنها لشركات منفصلة لا رابط بينها.",
        },
        {
          en: "On crowded Egyptian pharmacy shelves, weak packaging hierarchy loses trust with both pharmacists recommending a product and consumers comparing boxes.",
          ar: "على أرفف الصيدليات المزدحمة، يقلل التغليف الضعيف من ثقة الصيدلي الذي يرشّح المنتج والمستهلك الذي يقارن بين البدائل.",
        },
        {
          en: "Seasonal campaigns, medical rep brochures, and pharmacy chain partnerships (such as El-Ezaby posts) lacked a repeatable template system.",
          ar: "الحملات الموسمية ومطبوعات المندوبين العلميين والشراكات مع سلاسل الصيدليات الكبرى كانت تفتقر لنظام قوالب يحفظ ثبات العلامة.",
        },
      ],
      afterTitle: {
        en: "How the unified system operates commercially",
        ar: "كيف غيّر النظام الموحّد الأداء التجاري والبصري",
      },
      afterPoints: [
        {
          en: "Established a distinct Navy, Life Green, and Wave Blue corporate identity anchored by the 'We Care About You' brand voice across all touchpoints.",
          ar: "تأسيس هوية مؤسسية واضحة تجمع الكحلي والأخضر الحيوي والأزرق الموجي تحت رسالة موحّدة تعزز الثقة الصحية عبر كافة القنوات.",
        },
        {
          en: "Standardized packaging architecture ('The Blue Box' stationery & Proxeed/Proxerex product cartons) for immediate shelf authority and regulatory legibility.",
          ar: "توحيد معمارية التغليف والمطبوعات الرسمية وعلب خط منتجات Proxeed وProxerex لتحقيق حضور قوي وواضح على رف الصيدلية.",
        },
        {
          en: "Maintained continuous multi-year campaign governance across outdoor highway boards, Ramadan/seasonal outreach, pharmacy co-branding, and corporate web.",
          ar: "ضبط وحوكمة كافة الحملات على مدار خمس سنوات عبر إعلانات الطرق السريعة، المواسم، منشورات الصيدليات الشريكة، والموقع الإلكتروني.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Pharmacists & Prescribing Doctors", ar: "الصيادلة والأطباء" },
          benefit: {
            en: "Clear dosage/product differentiation on cartons and credible scientific detailing materials carried by medical reps.",
            ar: "تمييز سريع وواضح للأصناف والتركيزات على العبوات، مع مواد علمية مطبوعة تعزز مصداقية المندوب الطبي.",
          },
        },
        {
          role: { en: "End Consumers", ar: "المستهلك النهائي" },
          benefit: {
            en: "Consistent, trustworthy visual recognition from seeing a highway billboard or pharmacy post to picking up the box in-store.",
            ar: "اتساق بصري يبني الثقة بدءاً من رؤية الإعلان الخارجي أو منشور الصيدلية وحتى استلام العبوة الفعلية.",
          },
        },
        {
          role: { en: "Commercial & Marketing Leadership", ar: "إدارة التسويق والمبيعات" },
          benefit: {
            en: "One continuous custodian governing print specs, new SKU launches, motion logos, and seasonal campaigns over five full years.",
            ar: "مرجعية بصرية واحدة تضبط مواصفات الطباعة وإطلاق الأصناف الجديدة والحملات الموسمية باستمرارية لمدة خمس سنوات.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How the brand system supports the commercial product lifecycle from corporate headquarters to pharmacy shelf:",
      ar: "كيف يخدم النظام دورة العمل التجارية من مقر الشركة وحتى رف الصيدلية:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Corporate Foundation", ar: "الهوية المؤسسية" },
        title: {
          en: "Grid-constructed mark, color tokens & 'The Blue Box' kit",
          ar: "بناء الشعار الهندسي ونظام الألوان وحزمة المطبوعات الرسمية",
        },
        detail: {
          en: "Sets the core visual rules for official correspondence, B2B distributor packs, business card boxes, and animated digital logo stings.",
          ar: "تثبيت القواعد البصرية للمراسلات الرسمية، علب كروت العمل الفاخرة، ملفات الموزعين، وتحريك الشعار الرقمي.",
        },
      },
      {
        step: "02",
        actor: { en: "Product Packaging", ar: "تغليف المستحضرات" },
        title: {
          en: "SKU carton hierarchy & line extensions (Proxeed / Proxerex)",
          ar: "تصميم علب المنتجات وامتدادات الخطوط الدوائية",
        },
        detail: {
          en: "Structures front-of-pack brand recognition, active-ingredient callouts, and bilingual regulatory text so new products join a recognizable family.",
          ar: "تنظيم واجهة العبوة لإبراز العلامة والمواد الفعالة والبيانات الإلزامية بالعربية والإنجليزية بحيث يندمج أي منتج جديد بسلاسة ضمن العائلة.",
        },
      },
      {
        step: "03",
        actor: { en: "Pharmacy & Trade Marketing", ar: "التسويق عبر الصيدليات" },
        title: {
          en: "Retail chain co-marketing & medical rep detailing assets",
          ar: "حملات سلاسل الصيدليات الكبرى وأدوات الدعاية الطبية",
        },
        detail: {
          en: "Equips sales and trade marketing with co-branded social creatives (e.g., major pharmacy chains) and print collateral that respect both partner and brand rules.",
          ar: "تزويد فرق البيع والتسويق بتصاميم مشتركة مع سلاسل الصيدليات الكبرى ومطبوعات علمية تحافظ على هوية الشركة وشروط الشركاء.",
        },
      },
      {
        step: "04",
        actor: { en: "Mass Reach & Web", ar: "الانتشار الخارجي والرقمي" },
        title: {
          en: "Outdoor billboards, seasonal campaigns & WordPress presence",
          ar: "إعلانات الطرق، الحملات الموسمية، والموقع الرسمي",
        },
        detail: {
          en: "Scales the same visual language onto high-speed outdoor boards, seasonal health awareness posts, and an accessible corporate WordPress catalog.",
          ar: "توسيع نفس اللغة البصرية إلى لوحات الطرق السريعة، حملات المواسم الصحية، والموقع التعريفي للشركة ومنتجاتها.",
        },
      },
    ],
    featuresIntro: {
      en: "Key commercial strengths of the Nile Pharma Food brand system:",
      ar: "أبرز المزايا العملية والتجارية لمنظومة نايل فارما فود:",
    },
    features: [
      {
        tag: { en: "5-Year Continuity", ar: "استمرارية 5 سنوات" },
        title: {
          en: "Tested in real production, not just a pitch deck",
          ar: "نظام مختبر في الإنتاج الفعلي وليس مجرد عرض نظري",
        },
        body: {
          en: "Evolved across real print runs, packaging die-lines, outdoor media buys, and product launches between 2020 and 2025.",
          ar: "طُوّر وطُبّق عبر خطوط طباعة حقيقية وقوالب تكسير علب وحملات طرق وإطلاق منتجات فعلية من 2020 حتى 2025.",
        },
      },
      {
        tag: { en: "Shelf Authority", ar: "قوة الحضور على الرف" },
        title: {
          en: "Packaging built for crowded pharmacy environments",
          ar: "تغليف مصمم للمنافسة داخل بيئة الصيدلية",
        },
        body: {
          en: "Uses clear color blocking and typographic hierarchy so pharmacists and buyers spot product variants quickly.",
          ar: "يعتمد تقسيماً لونياً وتدرجاً واضحاً في الخطوط يمكّن الصيدلي والمشتري من تمييز كل صنف بسرعة ودقة.",
        },
      },
      {
        tag: { en: "Co-Branding Ready", ar: "جاهزية الشراكات" },
        title: {
          en: "Works cleanly inside major pharmacy chain layouts",
          ar: "مرونة الاندماج في حملات سلاسل الصيدليات الكبرى",
        },
        body: {
          en: "Product visuals and lockups stay crisp even when placed inside partner pharmacy frames and promotional grids.",
          ar: "تحافظ صور المنتجات والشعارات على وضوحها وقوتها عند إدراجها داخل قوالب السلاسل الصيدلانية الشريكة.",
        },
      },
      {
        tag: { en: "Motion & Digital", ar: "الهوية المتحركة والرقمية" },
        title: {
          en: "Wave-inspired motion system for video & social",
          ar: "نظام تحريك للشعار والمحتوى الرقمي",
        },
        body: {
          en: "Translates the static wave geometry into smooth animated stings for product videos, reels, and digital campaigns.",
          ar: "يحوّل الخطوط الموجية في الشعار إلى حركة انسيابية تمنح فيديوهات المنتجات والحملات الرقمية بصمة موحّدة.",
        },
      },
      {
        tag: { en: "Corporate Unboxing", ar: "تجربة المطبوعات المؤسسية" },
        title: {
          en: "'The Blue Box' executive stationery presentation",
          ar: "تقديم احترافي للمطبوعات الرسمية (The Blue Box)",
        },
        body: {
          en: "Elevates B2B meetings with distributors, suppliers, and medical partners through tactile, custom-boxed stationery.",
          ar: "يرفع مستوى الانطباع المؤسسي في اجتماعات الموزعين والموردين والأطباء عبر حزمة مطبوعات مصممة بعناية.",
        },
      },
      {
        tag: { en: "Multi-Track Scope", ar: "تكامل المسارات الأربعة" },
        title: {
          en: "Identity, packaging, campaigns & web under one roof",
          ar: "الهوية والتغليف والحملات والموقع تحت مظلة واحدة",
        },
        body: {
          en: "Eliminated agency handoff drift by keeping corporate identity, SKU boxes, seasonal ads, and web updates aligned to one standard.",
          ar: "قضى على تشتت التسليم بين الوكالات عبر ربط الهوية والعبوات والإعلانات والموقع بمعيار بصري واحد.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "5-Year Production System (2020–2025)",
        ar: "منظومة مطبّقة في السوق على مدار 5 سنوات (2020–2025)",
      },
      summary: {
        en: "Documented through real production artifacts—packaging cartons, boxed stationery, outdoor visuals, pharmacy partner posts, motion frames, and corporate web—without unverified percentage claims.",
        ar: "موثّق بمخرجات إنتاج فعلية تشمل عبوات المنتجات، المطبوعات الرسمية، إعلانات الطرق، حملات الصيدليات الشريكة، وتحريك الشعار، مع التزام كامل بالدقة وعدم إدراج أي نسب رقمية غير موثقة.",
      },
      highlights: [
        {
          en: "Covers corporate rebrand + Proxeed/Proxerex product applications",
          ar: "يشمل إعادة الهوية المؤسسية وتطبيقات خط منتجات Proxeed وProxerex",
        },
        {
          en: "Companion digital commerce case study also available (Nile Pharma Storefront)",
          ar: "يرتبط أيضاً بدراسة حالة المتجر الرقمي الحديث (Nile Pharma Storefront)",
        },
      ],
    },
  },

  /* ── 03 · REFLECTION ────────────────────────────────────────────── */
  {
    slug: "reflection",
    sector: {
      en: "Retail & E-Commerce · Framed Art & Print Studio",
      ar: "التجزئة والتجارة · استوديو فنون ومطبوعات مؤطرة",
    },
    headline: {
      en: "A gallery-clean brand and layout system that lets a framed-art studio sell premium wall pieces without gallery snobbery or poster-shop clutter.",
      ar: "نظام هوية وعرض بصري يمكّن استوديو فنون ومطبوعات مؤطرة من تقديم منتج راقٍ بعيداً عن فوضى متاجر البوسترات أو جمود المعارض النخبوية.",
    },
    summary: {
      en: "Reflection produces framed wall art and curated prints for homes, workspaces, and interior projects. The V1.0 brand system builds the entire identity around a single constructed 'R' monogram, a neutral white/black gallery canvas so the artwork's own colors never clash with the brand, and a strict three-part layout recipe that lets the team publish new collections rapidly.",
      ar: "يقدّم براند ريفلكشن (Reflection) لوحات فنية ومطبوعات مؤطرة عالية الجودة للمنازل والمكاتب ومشاريع التصميم الداخلي. بُني نظام الهوية (V1.0) بالكامل انطلاقاً من حرف (R) واحد يعمل كرمز وتوقيع للعلامة، مع أرضية بيضاء وسوداء محايدة لا تنافس ألوان اللوحات المعروضة، ومعادلة تصميم ثابتة تسهّل إطلاق المجموعات الجديدة بسرعة واتساق.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Interior Art, Prints & Custom Framing",
          ar: "اللوحات الفنية والمطبوعات المؤطرة للديكور",
        },
      },
      {
        label: { en: "Target Buyers", ar: "العملاء المستهدفون" },
        value: {
          en: "Homeowners, young professionals & interior designers",
          ar: "أصحاب المنازل، المكاتب الحديثة، ومصممو الديكور",
        },
      },
      {
        label: { en: "Commercial Positioning", ar: "التموضع السوقي" },
        value: {
          en: "Accessible gallery quality (above mass posters, approachable)",
          ar: "جودة صالات العرض بسلاسة شرائية بعيدة عن التعقيد النخبوي",
        },
      },
      {
        label: { en: "System Deliverable", ar: "مخرجات النظام" },
        value: {
          en: "18-page V1.0 brand book, lockups, tags & layout recipes",
          ar: "دليل هوية V1.0 من 18 صفحة، شعارات، بطاقات منتج، وقوالب نشر",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Market gap in wall art & print retail",
        ar: "الفجوة التجارية في سوق اللوحات والمطبوعات",
      },
      beforePoints: [
        {
          en: "Mass-market poster shops use loud promotional banners and discount stickers that make framed prints look disposable.",
          ar: "متاجر البوسترات التجارية تستخدم تصاميم صاخبة وعروضاً مزدحمة تفقد اللوحة قيمتها الفنية كقطعة ديكور مقتناة.",
        },
        {
          en: "Fine-art galleries often feel intimidating and opaque to everyday buyers furnishing an apartment or office.",
          ar: "في المقابل، تبدو صالات العرض الفنية التقليدية مغلقة ومعقدة أمام المشتري العادي الذي يؤثث منزله أو مكتبه.",
        },
        {
          en: "If a print brand uses a dominant brand color on every post, that color clashes with warm, cool, or monochrome artworks in the catalog.",
          ar: "اعتماد لون براند صارخ وثابت في كل الإعلانات يصطدم بصرياً مع تنوع ألوان اللوحات الفنية المختلفة من مجموعة لأخرى.",
        },
      ],
      afterTitle: {
        en: "How Reflection's brand architecture solves it",
        ar: "كيف يعالج نظام ريفلكشن هذه المعادلة عملياً",
      },
      afterPoints: [
        {
          en: "Uses pure white and CMYK-100 black as the permanent gallery frame, allowing accent colors from the spectrum to adapt to whichever artwork is featured.",
          ar: "اعتماد الأبيض النقي والأسود الصريح كإطار ثابت يحاكي جدران المعارض، مع طيف لوني مرن يتكيف مع روح كل لوحة دون أن يطغى عليها.",
        },
        {
          en: "Turns one geometric 'R' into icon, frame stamp, hangtag mark, and social watermark—building instant brand recall on physical products.",
          ar: "تحويل حرف R الهندسي إلى أيقونة وختم للإطار وبطاقة تعليق وعلامة رقمية، مما يربط المنتج الفعلي بالعلامة فور رؤيته.",
        },
        {
          en: "Locks a 3-element Focal Area rule (Artwork Image + Headline + R Icon) so social ads, lookbooks, and storefront banners stay clean and fast to produce.",
          ar: "تثبيت قاعدة المنطقة المحورية المكونة من 3 عناصر (صورة اللوحة + العنوان + أيقونة R) لإنتاج إعلانات ومنشورات أنيقة بسرعة عالية.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Art Buyers & Homeowners", ar: "المشترون وأصحاب المنازل" },
          benefit: {
            en: "See framed pieces presented in realistic room contexts with honest, distraction-free visual framing.",
            ar: "معاينة اللوحات داخل سياق مكاني واضح وهادئ يساعدهم على تخيّل القطعة في منازلهم واتخاذ قرار الشراء بثقة.",
          },
        },
        {
          role: { en: "Interior Designers & B2B Specifiers", ar: "مصممو الديكور والمكاتب" },
          benefit: {
            en: "Curated, architectural brand presentation they can confidently share with residential or commercial clients.",
            ar: "واجهة عرض احترافية ومنظمة يسهل مشاركتها مع عملاء التشطيبات والمشاريع السكنية والتجارية.",
          },
        },
        {
          role: { en: "Studio Content & Merchandising Team", ar: "فريق التسويق وإدارة المنتجات" },
          benefit: {
            en: "Repeatable composition recipes in the 18-page V1.0 book mean every new print drop launches cleanly without custom layout debates.",
            ar: "وصفات تكوين جاهزة داخل دليل الهوية تتيح تصوير ونشر أي مجموعة لوحات جديدة بنفس المستوى البصري دون إضاعة وقت.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How the brand system carries a print collection from catalog drop to unboxed frame:",
      ar: "كيف يرافق النظام القطعة الفنية من لحظة عرضها وحتى تعليقها لدى العميل:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Collection Launch", ar: "إطلاق المجموعات" },
        title: {
          en: "Focal-area campaign layouts spotlighting the artwork first",
          ar: "عرض اللوحة كبطل أساسي داخل قالب المنطقة المحورية",
        },
        detail: {
          en: "New framed pieces are photographed or mocked in warm interiors and framed using the Image + Neue Machina Headline + R Icon rule.",
          ar: "تُعرض اللوحات المؤطرة داخل فراغات معمارية دافئة وفق معادلة (الصورة + عنوان بخط Neue Machina + رمز R) دون أي ازدحام بصري.",
        },
      },
      {
        step: "02",
        actor: { en: "Catalog Browsing", ar: "تصفح الكتالوج" },
        title: {
          en: "Adaptive spectrum accents matched per collection mood",
          ar: "تخصيص النغمة اللونية المساندة حسب طبيعة كل مجموعة",
        },
        detail: {
          en: "While typography and white space stay constant, secondary tags pull from the approved spectrum palette to complement botanical, abstract, or monochrome series.",
          ar: "يبقى التخطيط والمساحات البيضاء ثابتين، بينما تتناغم الألوان الثانوية المعتمدة مع طبيعة المجموعة سواء كانت تجريدية أو طبيعية أو أحادية اللون.",
        },
      },
      {
        step: "03",
        actor: { en: "Storefront & Retail", ar: "نقطة البيع والتغليف" },
        title: {
          en: "Branded storefront signage, frame corner tags & packaging",
          ar: "لافتة المتجر، بطاقات الإطارات، وتجربة الاستلام",
        },
        detail: {
          en: "Physical frames carry clean hangtags and corner identifiers stamped with the 'R' mark so the unboxing experience feels like receiving a gallery edition.",
          ar: "تحمل الإطارات بطاقات تعريف أنيقة مختومة بشعار R ليحصل المشتري عند فتح العبوة على تجربة تضاهي اقتناء قطعة من جاليري متخصص.",
        },
      },
      {
        step: "04",
        actor: { en: "Ongoing Publishing", ar: "استدامة النشر" },
        title: {
          en: "Governed execution via the 18-page V1.0 guidelines",
          ar: "ضبط الجودة المستمر عبر دليل الهوية (18 صفحة)",
        },
        detail: {
          en: "Five explicit principles—Quality, Adjust, Unique, Different, Accurate—guide photography crops, font weights, and lockup placement across seasons.",
          ar: "تحكم خمس ركائز موثّقة في الدليل طريقة قص الصور، أوزان الخطوط، ومواضع الشعار لضمان ثبات الهوية مع توسع المتجر.",
        },
      },
    ],
    featuresIntro: {
      en: "Why this identity system works commercially for an art & print business:",
      ar: "لماذا ينجح هذا النظام تجارياً مع نشاط الفنون والمطبوعات:",
    },
    features: [
      {
        tag: { en: "Zero Color Clash", ar: "عدم تعارض الألوان" },
        title: {
          en: "Gallery-white base lets any artwork shine",
          ar: "قاعدة بيضاء محايدة تبرز جمال أي لوحة معروضة",
        },
        body: {
          en: "Because the core brand frame is white and deep black, colorful or subtle prints never fight against a competing brand background.",
          ar: "لأن الإطار البصري الأساسي يعتمد الأبيض والأسود، تحتفظ كل لوحة بألوانها الحقيقية دون تشويش من خلفية الإعلان.",
        },
      },
      {
        tag: { en: "Single-Letter Recall", ar: "قوة الرمز الواحد" },
        title: {
          en: "Constructed 'R' doubles as product stamp and avatar",
          ar: "حرف R مرسوم هندسياً يصلح كختم للمنتج وأيقونة رقمية",
        },
        body: {
          en: "Compact enough to sit discreetly on a frame tag or social profile circle while staying unmistakable at storefront scale.",
          ar: "تصميم متماسك يظهر بأناقة على بطاقة إطار صغيرة أو صورة حساب اجتماعي وبنفس القوة على واجهة معرض.",
        },
      },
      {
        tag: { en: "Fast Merchandising", ar: "سرعة تسويق المنتجات" },
        title: {
          en: "3-part Focal Area recipe speeds up social & ad creative",
          ar: "معادلة التكوين الثلاثية تختصر وقت تجهيز الإعلانات",
        },
        body: {
          en: "Designers don't reinvent layouts per SKU—drop in the framed piece, set the headline, anchor the mark, and ship.",
          ar: "لا يحتاج الفريق لإعادة اختراع التصميم مع كل لوحة جديدة؛ قالب واضح ومحدد يضمن سرعة الإنجاز وجودة المخرج.",
        },
      },
      {
        tag: { en: "Distinct Typography", ar: "شخصية تايبوجرافية مميزة" },
        title: {
          en: "Architectural Neue Machina paired with approachable Quicksand",
          ar: "موازنة بين الحداثة الهندسية والود البصري في الخطوط",
        },
        body: {
          en: "Neue Machina gives headlines an editorial, gallery-curated edge while Quicksand keeps sizes, dimensions, and pricing friendly to read.",
          ar: "يمنح خط Neue Machina العناوين طابعاً فنياً معاصراً، بينما يضمن خط Quicksand سهولة قراءة المقاسات والتفاصيل والأسعار.",
        },
      },
      {
        tag: { en: "Tactile Tagging", ar: "هوية ملموسة على المنتج" },
        title: {
          en: "Ready-to-print hangtags and storefront touchpoints",
          ar: "تطبيقات جاهزة لبطاقات التعليق وواجهات العرض",
        },
        body: {
          en: "Turns generic wooden or metal frames into recognizable branded pieces that generate word-of-mouth when gifted or hung.",
          ar: "تحوّل الإطار من مجرد منتج عام إلى قطعة تحمل توقيع براند واضح يعزز التوصية الشفهية والإهداء.",
        },
      },
      {
        tag: { en: "Complete V1.0 Book", ar: "دليل تشغيلي كامل" },
        title: {
          en: "18-page operational rulebook from day one",
          ar: "دليل هوية من 18 صفحة يضبط كل التفاصيل من اليوم الأول",
        },
        body: {
          en: "Covers anatomy, lockups, color ratios, font weights, focal-area grids, and in-context product examples.",
          ar: "يغطي تشريح الشعار، الوضعيات الأفقية والعمودية، نسب الألوان، أوزان الخطوط، ونماذج التطبيق الواقعية.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Delivered V1.0 Brand & Merchandising System",
        ar: "نظام هوية وعرض منتجات منجز — الإصدار V1.0",
      },
      summary: {
        en: "Delivered as an 18-page V1.0 brand identity system covering monogram construction, horizontal/vertical lockups, spectrum color governance, typography hierarchy, focal-area layout rules, and storefront/product applications.",
        ar: "سُلّم المشروع كنظام هوية متكامل في دليل V1.0 من 18 صفحة يشمل بناء الشعار، المتغيرات، حوكمة الألوان والخطوط، قواعد التكوين الإعلاني، وتطبيقات المتجر والمنتج المؤطر.",
      },
      highlights: [
        {
          en: "10 documented visual plates in the Technical Case Study gallery",
          ar: "10 لوحات تفصيلية موثقة داخل معرض دراسة الحالة التقنية",
        },
        {
          en: "Engineered specifically for visual retail where product imagery changes constantly",
          ar: "مصمم خصيصاً للأنشطة التجارية التي تتغير ألوان وصور منتجاتها باستمرار",
        },
      ],
    },
  },

  /* ── 04 · AHMED BEDEER ──────────────────────────────────────────── */
  {
    slug: "ahmed-bedeer",
    sector: {
      en: "Executive Personal Brand · Healthcare IT (KSA & MENA)",
      ar: "براند شخصي تنفيذي · تكنولوجيا المعلومات الصحية (السعودية والمنطقة)",
    },
    headline: {
      en: "Positioning a Healthcare IT consultant as a trusted senior authority for hospital digital transformation across Saudi Arabia and MENA.",
      ar: "بناء هوية شخصية تنفيذية لخبير في تكنولوجيا المعلومات الصحية تعزز حضوره الاستشاري في مشاريع التحول الرقمي للمستشفيات بالخليج والمنطقة.",
    },
    summary: {
      en: "Ahmed Bedeer works at the intersection of hospital operations and clinical interoperability standards (HL7, FHIR, CPHIMS, HIMSS) across Saudi Arabia and the wider MENA region. The brand system gives him an executive identity—anchored by a custom 'ab' quotation-mark monogram—across advisory decks, conference speaking profiles, executive stationery, and digital thought leadership.",
      ar: "يعمل أحمد بدير كقيادي واستشاري في نظم المعلومات الصحية ومعايير الربط الطبي (HL7 وFHIR وCPHIMS وHIMSS) في السوق السعودي والشرق الأوسط. صُمّم هذا النظام ليمنحه حضوراً تنفيذياً رصيناً يرتكز على مونوجرام (ab) المبتكر على هيئة علامة اقتباس، ويحكم عروضه الاستشارية ومشاركاته في المؤتمرات ومطبوعاته الرسمية ومنصاته المهنية.",
    },
    snapshot: [
      {
        label: { en: "Domain", ar: "التخصص" },
        value: {
          en: "Healthcare IT, Interoperability & Advisory",
          ar: "نظم المعلومات الصحية والربط الطبي والاستشارات",
        },
      },
      {
        label: { en: "Target Audience", ar: "الجمهور المستهدف" },
        value: {
          en: "Hospital CIOs, health ministries, vendors & recruiters",
          ar: "مديرو تقنية المعلومات بالمستشفيات، الجهات الصحية، والشركات الكبرى",
        },
      },
      {
        label: { en: "Geographic Focus", ar: "النطاق الجغرافي" },
        value: {
          en: "Saudi Arabia (KSA) & wider MENA healthcare market",
          ar: "المملكة العربية السعودية وأسواق الرعاية الصحية بالمنطقة",
        },
      },
      {
        label: { en: "Core Assets", ar: "المخرجات الأساسية" },
        value: {
          en: "ab monogram, gunmetal/teal palette, type & V1.0 guide",
          ar: "مونوجرام ab، لوحة ألوان تنفيذية، نظام خطوط، ودليل V1.0",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why senior consultants lose differentiation",
        ar: "لماذا يغيب التميز البصري لدى أغلب الخبراء والاستشاريين",
      },
      beforePoints: [
        {
          en: "Senior technical leaders often rely on plain CVs, default LinkedIn banners, and generic slide templates that understate their real domain weight.",
          ar: "يعتمد كثير من الخبراء التقنيين على سير ذاتية تقليدية وقوالب عروض عامة لا تعكس حجم خبرتهم الفعلية في المشاريع الكبرى.",
        },
        {
          en: "Standard healthcare visuals (stethoscopes, crosses, generic blue pulses) look like clinic ads rather than enterprise IT leadership.",
          ar: "الرموز الطبية المستهلكة (السماعات أو النبض التقليدي) توحي بعيادة علاجية لا بقائد تقني يدير أنظمة معلومات مستشفيات.",
        },
        {
          en: "Advisory proposals and keynote slides in Gulf enterprise settings require executive polish without looking flashy or self-promotional.",
          ar: "الاجتماعات التنفيذية والمؤتمرات في السوق الخليجي تتطلب مظهراً وقوراً ومنضبطاً بعيداً عن المبالغة الدعائية.",
        },
      ],
      afterTitle: {
        en: "What the personal brand system delivers",
        ar: "ما الذي يقدمه نظام البراند الشخصي عملياً",
      },
      afterPoints: [
        {
          en: "Constructs lowercase 'a + b' into a geometric quotation form—signaling advisory voice, documented standards, and precision engineering.",
          ar: "دمج حرفي a وb هندسياً في شكل علامة اقتباس تعبّر بذكاء عن الرأي الاستشاري والمرجعية المعرفية والدقة التقنية.",
        },
        {
          en: "Pairs Gunmetal authority (#1C2B33) and Steel Blue clinical trust (#118AB2) with a crisp Teal innovation accent (#06D6A0).",
          ar: "توظيف الرمادي المعدني الداكن للوقار والأزرق الفولاذي للثقة الطبية مع لمسة تركوازية تعكس الحداثة التقنية.",
        },
        {
          en: "Gives consistent visual dress across business cards, LinkedIn/social headers, slide decks, and whitepaper documents.",
          ar: "توحيد الهوية عبر كروت العمل، الحسابات المهنية، العروض التقديمية، والأوراق البحثية والاستشارية.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Hospital CIOs & Healthcare Executives", ar: "القيادات التنفيذية ومديرو التقنية بالمستشفيات" },
          benefit: {
            en: "Immediately perceive structured, enterprise-grade professionalism when reviewing advisory briefs or meeting in person.",
            ar: "انطباع فوري بالاحترافية والمنهجية المؤسسية عند استلام عرض فني أو خلال الاجتماعات المباشرة.",
          },
        },
        {
          role: { en: "Conference Organizers & Industry Panels", ar: "منظمو المؤتمرات والملتقيات الصحية" },
          benefit: {
            en: "Ready-to-use speaker mark, high-contrast palettes, and clean typographic assets for event programs and stage screens.",
            ar: "أصول بصرية جاهزة وعالية الوضوح للاستخدام في مطبوعات المتحدثين وشاشات المؤتمرات المتخصصة.",
          },
        },
        {
          role: { en: "The Consultant Himself", ar: "الخبير نفسه في عمله اليومي" },
          benefit: {
            en: "Zero time wasted formatting slides or documents—every article, deck, and card follows one locked visual standard.",
            ar: "توفير وقت تنسيق العروض والملفات بفضل وجود نظام ألوان وخطوط وقوالب محددة وجاهزة للاستخدام.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How an executive personal brand works across real career and advisory touchpoints:",
      ar: "كيف تشتغل الهوية الشخصية التنفيذية في مواقف العمل الفعلية:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Digital Discovery", ar: "الحضور الرقمي والمهني" },
        title: {
          en: "Unified profile identity & technical thought leadership",
          ar: "واجهة موحّدة للحسابات المهنية والمحتوى التخصصي",
        },
        detail: {
          en: "When decision-makers look up Ahmed's insights on HL7, FHIR, or hospital HIS rollouts, every post and banner carries the unmistakable 'ab' signature and palette.",
          ar: "عند بحث صناع القرار عن مقالاته أو تحليلاته حول أنظمة المستشفيات ومعايير الربط الصحي، يظهر المحتوى ببصمة لونية وتايبوجرافية ثابتة.",
        },
      },
      {
        step: "02",
        actor: { en: "In-Person Networking", ar: "الاجتماعات والمؤتمرات" },
        title: {
          en: "Tactile executive business cards & conference presence",
          ar: "بطاقات العمل التنفيذية والحضور في الفعاليات الإقليمية",
        },
        detail: {
          en: "At health-tech summits in Riyadh, Cairo, or Dubai, tactile stationery with the geometric monogram leaves a memorable impression distinct from corporate employee cards.",
          ar: "في مؤتمرات الصحة الرقمية بالرياض أو القاهرة أو دبي، تترك بطاقة العمل المصممة بدقة أثراً مهنياً يبقى في الذاكرة.",
        },
      },
      {
        step: "03",
        actor: { en: "Advisory Delivery", ar: "تقديم الاستشارات والعروض" },
        title: {
          en: "Structured decks, architecture diagrams & reports",
          ar: "العروض الاستشارية ومخططات الأنظمة والتقارير الفنية",
        },
        detail: {
          en: "Primary and extended color palettes give multi-layer system diagrams (HIS, EMR, integration engines) clean visual coding without clutter.",
          ar: "تتيح اللوحة اللونية الأساسية والموسّعة تمثيل مخططات الربط التقني المعقدة داخل العروض والتقارير بوضوح بصري عالٍ.",
        },
      },
      {
        step: "04",
        actor: { en: "Long-Term Consistency", ar: "ثبات الهوية على المدى الطويل" },
        title: {
          en: "Governed by V1.0 guidelines for media, surface & color",
          ar: "حوكمة كاملة عبر دليل الاستخدام على مختلف الأسطح والوسائط",
        },
        detail: {
          en: "Specifies exact monogram construction grids, Lubalin Graph + Uncut Sans pairings, and dark/light surface rules.",
          ar: "تحديد شبكة بناء المونوجرام، قواعد استخدام خطّي Lubalin Graph وUncut Sans، وضوابط الظهور على الخلفيات الفاتحة والداكنة.",
        },
      },
    ],
    featuresIntro: {
      en: "Practical advantages of the Ahmed Bedeer identity system:",
      ar: "أهم المميزات العملية لنظام هوية أحمد بدير:",
    },
    features: [
      {
        tag: { en: "Conceptual Mark", ar: "فكرة ذكية ومباشرة" },
        title: {
          en: "Initials 'a + b' engineered as quotation marks",
          ar: "توظيف الحروف الأولى (ab) في هيئة علامة اقتباس",
        },
        body: {
          en: "Communicates consulting voice, authority, and dialogue without falling back on clichés like medical crosses or circuit boards.",
          ar: "يعبّر عن الحضور الاستشاري وصوت الخبير بلمسة هندسية مبتكرة بعيداً عن الرموز الطبية أو التقنية المكررة.",
        },
      },
      {
        tag: { en: "Enterprise Tone", ar: "وقار مؤسسي" },
        title: {
          en: "Calibrated for Gulf & MENA C-suite healthcare rooms",
          ar: "مصمم ليناسب بيئة القيادات الصحية في الخليج والمنطقة",
        },
        body: {
          en: "Strikes the right balance between executive restraint and modern tech sharpness expected in Vision-era healthcare initiatives.",
          ar: "يوازن بين الرصانة التنفيذية والحداثة التقنية المطلوبة في مشاريع التحول الصحي الكبرى بالمنطقة.",
        },
      },
      {
        tag: { en: "Diagram-Ready Colors", ar: "ألوان تخدم الشرح التقني" },
        title: {
          en: "Primary + extended palette for technical documentation",
          ar: "لوحة ألوان أساسية وموسّعة تناسب المخططات والتقارير",
        },
        body: {
          en: "Provides enough semantic range to color-code clinical workflows, integration layers, and KPIs cleanly inside slides.",
          ar: "توفّر تدرجات مدروسة تساعد في تمييز طبقات الأنظمة ومسارات العمل ومؤشرات الأداء داخل العروض الفنية.",
        },
      },
      {
        tag: { en: "Slab + Neo-Grotesque Type", ar: "تناغم الخطوط الهندسية" },
        title: {
          en: "Lubalin Graph headlines + Uncut Sans body clarity",
          ar: "جمع قوة العناوين الهندسية مع سلاسة القراءة في المتن",
        },
        body: {
          en: "Geometric slab-serif display type echoes the monogram's architecture while Uncut Sans keeps dense technical text crisp.",
          ar: "يمنح خط Lubalin Graph العناوين حضوراً هندسياً متناغماً مع الشعار، بينما يحفظ خط Uncut Sans وضوح النصوص التقنية.",
        },
      },
      {
        tag: { en: "Surface Versatility", ar: "مرونة على كافة الوسائط" },
        title: {
          en: "Tested across fabric, textured paper, and dark screens",
          ar: "مختبر على الورق الفاخر والأقمشة والشاشات الداكنة",
        },
        body: {
          en: "Maintains sharp geometry whether debossed on heavy cardstock, embroidered, or rendered as a small digital badge.",
          ar: "يحافظ المونوجرام على حدّته وتفاصيله سواء عند الطباعة البارزة على الكروت أو الاستخدام المصغّر على الشاشات.",
        },
      },
      {
        tag: { en: "Zero Fluff Positioning", ar: "تموضع مهني دقيق" },
        title: {
          en: "Anchored around real credentials (HL7 · FHIR · CPHIMS · HIMSS)",
          ar: "مبني حول اعتمادات ومعايير مهنية حقيقية ومحددة",
        },
        body: {
          en: "Every design choice supports his concrete interoperability and healthcare IT track record rather than vague coaching tropes.",
          ar: "تخدم الهوية خبرته الفعلية الموثقة في معايير المعلوماتية الصحية بدلاً من الشعارات التحفيزية العامة.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Delivered V1.0 Executive Personal Brand",
        ar: "هوية شخصية تنفيذية منجزة — الإصدار V1.0",
      },
      summary: {
        en: "Delivered with full monogram construction specs, primary and extended color systems, typography hierarchy, stationery mockups, and multi-surface media rules.",
        ar: "شمل التسليم بناء المونوجرام الهندسي، لوحات الألوان الأساسية والموسّعة، نظام الخطوط، تطبيقات المطبوعات التنفيذية، وقواعد الاستخدام عبر الوسائط المختلفة.",
      },
      highlights: [
        {
          en: "8 visual system plates inspectable in the Technical Case Study tab",
          ar: "8 لوحات تفصيلية لبناء النظام متاحة في تبويب دراسة الحالة التقنية",
        },
        {
          en: "Tailored for B2B Healthcare IT consulting across KSA & MENA",
          ar: "مصمم خصيصاً لقطاع استشارات تقنية المعلومات الصحية في السعودية والمنطقة",
        },
      ],
    },
  },

  /* ── 05 · CODE & CANVAS (BRAND IDENTITY) ────────────────────────── */
  {
    slug: "code-canvas",
    sector: {
      en: "B2B Studio Identity · Brand & Software Engineering",
      ar: "هوية استوديو أعمال · التصميم والهندسة البرمجية",
    },
    headline: {
      en: "A founding visual identity that lets one studio credibly sell both brand systems and production software under one roof.",
      ar: "بناء الهوية التأسيسية لاستوديو يجمع تصميم الهويات البصرية وتطوير البرمجيات تحت سقف تجاري واحد واضح ومتماسك.",
    },
    summary: {
      en: "Code & Canvas is a bilingual studio serving MENA startups, healthcare organizations, and growing enterprises across two disciplines: creative brand systems and software engineering. Built before taking client briefs, the V1.0 brand system fuses both practices into a single squircle '</>' mark, a dark-canvas aesthetic, and an 8-gradient token system that runs the studio's own website, proposals, social proof, and print deliverables.",
      ar: "يعمل استوديو كود آند كانفاس (Code & Canvas) كشريك ثنائي التخصص للشركات الناشئة والمؤسسات الصحية والتجارية في المنطقة، جامعاً بين بناء الهويات البصرية وهندسة المنتجات الرقمية. صُمّم نظام الهوية (V1.0) منذ لحظة التأسيس ليدمج العالمين في رمز واحد، مع لوحة ألوان داكنة ومكتبة تدرجات محكومة تشغّل موقع الاستوديو وعروضه الفنية ومطبوعاته ومنصاته الاجتماعية.",
    },
    snapshot: [
      {
        label: { en: "Business Type", ar: "طبيعة النشاط" },
        value: {
          en: "Two-Practice Brand & Software Engineering Studio",
          ar: "استوديو مزدوج التخصص (هوية بصرية + تطوير برمجي)",
        },
      },
      {
        label: { en: "Client Segments", ar: "شرائح العملاء" },
        value: {
          en: "Founders, SMEs & healthcare/enterprise teams in MENA",
          ar: "رواد الأعمال، الشركات المتوسطة، وقطاع الرعاية الصحية بالمنطقة",
        },
      },
      {
        label: { en: "Commercial Advantage", ar: "الميزة التجارية" },
        value: {
          en: "One accountable partner instead of two disconnected agencies",
          ar: "شريك واحد مسؤول بدلاً من التشتت بين وكالة تصميم وشركة برمجة",
        },
      },
      {
        label: { en: "System Scope", ar: "مخرجات النظام" },
        value: {
          en: "Squircle mark, 8-gradient library, V1.0 book & templates",
          ar: "الشعار الهندسي، مكتبة 8 تدرجات، دليل V1.0، وقوالب العمل",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why hybrid design-and-dev studios struggle to convince buyers",
        ar: "التحدي التجاري أمام الاستوديوهات التي تجمع التصميم والبرمجة",
      },
      beforePoints: [
        {
          en: "Studios that look purely artistic struggle to win serious ERP, web-app, or healthcare software contracts.",
          ar: "الاستوديو الذي يظهر بطابع فني بحت يواجه صعوبة في إقناع العملاء بقدرته على هندسة أنظمة برمجية ومنصات معقدة.",
        },
        {
          en: "Dev shops that look like terminal screens fail to convince founders they can craft warm, memorable consumer brands.",
          ar: "وشركات البرمجة ذات المظهر الجاف لا تقنع المؤسسين بقدرتها على ابتكار هوية بصرية جذابة ومتكاملة للجمهور.",
        },
        {
          en: "Without strict gradient and typography rules from day one, multi-service marketing quickly turns chaotic across social and proposals.",
          ar: "تقديم خدمات متنوعة (تقنية وإبداعية) بدون قواعد لونية وتايبوجرافية صارمة يؤدي لتشتت الرسالة التسويقية للاستوديو.",
        },
      ],
      afterTitle: {
        en: "How the Code & Canvas V1.0 system bridges both sides",
        ar: "كيف يحل نظام هوية كود آند كانفاس هذه المعادلة",
      },
      afterPoints: [
        {
          en: "Fuses the code tag '</>' inside a constructed creative squircle—communicating both disciplines in one unmistakable icon.",
          ar: "دمج رمز البرمجة </> داخل إطار Squircle تصميمي متزن ليقرأ العميل التخصصين معاً في لمحة واحدة.",
        },
        {
          en: "Pairs a deep technical canvas (#0B0F1A) with governed Teal (#48CCCC), Violet (#7850C8), and 8 named gradients to distinguish tracks cleanly.",
          ar: "المزاوجة بين الخلفية الداكنة الرصينة والتركواز والبنفسجي ومكتبة من 8 تدرجات معتمدة لتمييز مسارات الخدمات بوضوح.",
        },
        {
          en: "Proves the studio's doctrine ('governed systems from day one') by running its own commercial operations on V1.0 guidelines.",
          ar: "إثبات منهجية الاستوديو عملياً أمام العميل، لأن الاستوديو نفسه يدار من اليوم الأول بدليل هوية قياسي منضبط.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Startup Founders & Product Owners", ar: "مؤسسو الشركات وأصحاب المنتجات" },
          benefit: {
            en: "Immediately understand they can scope brand identity, UI/UX, and full-stack build in one coordinated engagement.",
            ar: "يدركون فوراً إمكانية استلام الهوية البصرية وتصميم الواجهات والتطوير البرمجي في مسار متكامل واحد.",
          },
        },
        {
          role: { en: "Healthcare & Enterprise Buyers", ar: "عملاء القطاع الصحي والشركات" },
          benefit: {
            en: "Receive structured proposals, scope breakdowns, and brand documentation that read with engineering discipline.",
            ar: "يستلمون عروضاً فنية ومالية وأدلة عمل مصاغة بدقة تنظيمية تعكس نضج الاستوديو.",
          },
        },
        {
          role: { en: "Studio Sales & Delivery Team", ar: "فريق المبيعات والتسليم بالاستوديو" },
          benefit: {
            en: "Pre-built social templates, poster formats, and dark/light logo variants keep client-facing collateral fast and consistent.",
            ar: "قوالب جاهزة للمنشورات والعروض والملفات تضمن سرعة التجهيز وثبات الجودة البصرية في كل تواصل مع العملاء.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How the studio identity powers client acquisition and project delivery:",
      ar: "كيف تخدم الهوية دورة عمل الاستوديو من جذب العميل وحتى التسليم:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "First Touchpoint", ar: "الانطباع الأول" },
        title: {
          en: "Social case cards, posters & studio positioning",
          ar: "منشورات الأعمال والملصقات وتوضيح التموضع",
        },
        detail: {
          en: "Prospective clients discover Code & Canvas through crisp dark-canvas social samples and manifesto cards under 'Where Creativity Meets Technology'.",
          ar: "يتعرف العملاء المحتملون على الاستوديو عبر نماذج أعمال ومنشورات واضحة تبرز التقاء الإبداع بالتكنولوجيا دون غموض.",
        },
      },
      {
        step: "02",
        actor: { en: "Service Exploration", ar: "استكشاف الخدمات" },
        title: {
          en: "Seamless handoff into the bilingual web platform",
          ar: "الانتقال السلس إلى المنصة الرقمية ثنائية اللغة",
        },
        detail: {
          en: "The exact color tokens (#0B0F1A, #48CCCC, #7850C8) and gradient rules carry directly into the 82-page bilingual studio platform (codeandcanvas.net).",
          ar: "تنتقل نفس الرموز اللونية وقواعد التدرجات مباشرة إلى واجهة موقع الاستوديو ثنائي اللغة لتعزيز الثقة والاستمرارية.",
        },
      },
      {
        step: "03",
        actor: { en: "Scoping & Proposals", ar: "العروض الفنية والتسعير" },
        title: {
          en: "Branded decks, fixed-scope sheets & milestone plans",
          ar: "عروض النطاق المحدد وخطط الدفعات والمراحل",
        },
        detail: {
          en: "Typography hierarchy (Signate Grotesk + Raleway + Poppins) structures service deliverables, pricing bands, and timelines clearly.",
          ar: "يساعد التسلسل التايبوجرافي الواضح في عرض بنود الأعمال والتكلفة والجدول الزمني بشكل مريح ومباشر لصانع القرار.",
        },
      },
      {
        step: "04",
        actor: { en: "Client Handover", ar: "تسليم المشاريع" },
        title: {
          en: "Cohesive documentation & handover packages",
          ar: "حزم تسليم وأدلة إرشادية تحمل بصمة الاستوديو",
        },
        detail: {
          en: "Final guidelines, code handovers, and training decks ship in the studio's governed presentation format.",
          ar: "تُسلّم الأدلة النهائية وملفات المشاريع وجلسات التدريب ضمن قوالب منسقة تعكس جودة العمل من البداية للنهاية.",
        },
      },
    ],
    featuresIntro: {
      en: "Core strengths of the Code & Canvas brand system:",
      ar: "أهم المميزات العملية لنظام هوية كود آند كانفاس:",
    },
    features: [
      {
        tag: { en: "Dual-Discipline Mark", ar: "رمز يختصر التخصصين" },
        title: {
          en: "Squircle grid + code brackets in one balanced icon",
          ar: "دمج هندسي بين قوسَي البرمجة وإطار التصميم",
        },
        body: {
          en: "Works equally well on a GitHub organization avatar, a Figma library cover, a pitch deck, or a printed poster.",
          ar: "يعمل بنفس الوضوح كأيقونة على منصات الكود، أو غلاف ملفات التصميم، أو العروض التقديمية والمطبوعات.",
        },
      },
      {
        tag: { en: "Controlled Gradients", ar: "مكتبة تدرجات منضبطة" },
        title: {
          en: "8 named gradients instead of ad-hoc color mixing",
          ar: "8 تدرجات لونية محددة تمنع العشوائية البصرية",
        },
        body: {
          en: "Gives social graphics and web sections visual energy while keeping every gradient strictly within the teal-to-violet brand family.",
          ar: "تمنح المنشورات وأقسام الويب حيوية بصرية مع الحفاظ التام على الانتماء لعائلة الألوان الأساسية للاستوديو.",
        },
      },
      {
        tag: { en: "Dark-First Identity", ar: "هوية داكنة مع متغيرات كاملة" },
        title: {
          en: "Dark, light, and gradient logo lockups ready for any surface",
          ar: "نسخ معتمدة للشعار على الخلفيات الداكنة والفاتحة والمتدرجة",
        },
        body: {
          en: "Ensures crisp contrast whether printed on white contract paper or displayed on dark OLED product screens.",
          ar: "تضمن وضوح الشعار وتباينه سواء طُبع على عقود ورقية بيضاء أو عُرض على شاشات رقمية داكنة.",
        },
      },
      {
        tag: { en: "Proof by Example", ar: "إثبات المنهجية بالتطبيق" },
        title: {
          en: "The studio runs on the exact system it sells to clients",
          ar: "الاستوديو يطبّق على نفسه النظام الذي يبيعه لعملائه",
        },
        body: {
          en: "Clients evaluating Code & Canvas for brand governance can inspect V1.0 guidelines applied directly to the studio itself.",
          ar: "يستطيع العميل تقييم جودة التنظيم والحوكمة البصرية مباشرة من خلال طريقة ظهور الاستوديو نفسه.",
        },
      },
      {
        tag: { en: "Web-Token Native", ar: "جاهزية التحويل للـ CSS" },
        title: {
          en: "Designed from the start as design tokens for engineering",
          ar: "مصمم منذ البداية كرموز تصميم جاهزة للبرمجة",
        },
        body: {
          en: "Backgrounds, borders, and accent roles map 1:1 into CSS custom properties on the live studio platform.",
          ar: "تتحول قيم الخلفيات والحدود والألوان المساندة مباشرة إلى متغيرات برمجية داخل موقع الاستوديو الفعلي.",
        },
      },
      {
        tag: { en: "Print & Digital Parity", ar: "تكامل المطبوع والرقمي" },
        title: {
          en: "Covers posters, social grids, manifestos & web layouts",
          ar: "يشمل البوسترات، قوالب السوشيال، البيان التأسيسي، والويب",
        },
        body: {
          en: "12 documented plates in V1.0 give immediate starting templates for campaigns and client communications.",
          ar: "12 لوحة مرجعية موثقة توفّر قوالب انطلاق فورية للحملات التسويقية ومراسلات العملاء.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Live Founding Identity (V1.0 · In Active Use)",
        ar: "الهوية التأسيسية المعتمدة — الإصدار V1.0 (قيد التشغيل الفعلي)",
      },
      summary: {
        en: "Actively governs the Code & Canvas studio brand; its full static web platform implementation can also be explored in the companion 'Code & Canvas Web Platform' case study.",
        ar: "تحكم هذه الهوية علامة استوديو كود آند كانفاس فعلياً، ويمكن أيضاً استعراض التطبيق البرمجي الكامل لمنصة الاستوديو في دراسة حالة (منصة كود آند كانفاس الرقمية).",
      },
      highlights: [
        {
          en: "12 V1.0 guidelines plates inspectable in the Technical Case Study tab",
          ar: "12 لوحة من دليل الهوية V1.0 متاحة في تبويب دراسة الحالة التقنية",
        },
        {
          en: "Directly powers codeandcanvas.net across EN & AR",
          ar: "تشغّل بصرياً منصة codeandcanvas.net باللغتين الإنجليزية والعربية",
        },
      ],
    },
  },

  /* ── 06 · EGYPT SEG FIELD CAMP (ESFC) ───────────────────────────── */
  {
    slug: "esfc",
    sector: {
      en: "Academic & Scientific Events · Geoscience Field Camp",
      ar: "الفعاليات العلمية والأكاديمية · معسكر علوم الأرض الميداني",
    },
    headline: {
      en: "Unifying recruitment campaigns, desert field manuals, badges, and camp apparel for an annual student geoscience field camp.",
      ar: "توحيد الهوية البصرية، الأدلة الميدانية المطبوعة، بطاقات المشاركين، والملابس الخاصة بمعسكر طلابي سنوي لعلوم الأرض.",
    },
    summary: {
      en: "Egypt SEG Field Camp (ESFC) is an annual student-run geophysics and geology training camp organized under the Society of Exploration Geophysicists student community in Egypt. The project delivered a complete event identity spanning student recruitment visuals, printed field guides, participant and staff ID badges, desert-ready apparel, sponsor backdrops, and event coverage templates.",
      ar: "يُعد مخيم SEG مصر الميداني (ESFC) برنامجاً تدريبياً ميدانياً سنوياً لطلاب الجيوفيزياء وعلوم الأرض. قدّم المشروع منظومة هوية متكاملة للفعالية شملت حملات فتح باب التقديم، كتيّبات وأدلة العمل الميداني المطبوعة، شارات تعريف المشاركين والمنظمين، ملابس المعسكر الصحراوي، خلفيات الرعاة، وقوالب التغطية الإعلامية.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Scientific Student Chapter & Field Training Event",
          ar: "الأنشطة الطلابية العلمية والتدريب الجيولوجي الميداني",
        },
      },
      {
        label: { en: "Participants & Users", ar: "المستخدمون والفئات المستهدفة" },
        value: {
          en: "Geoscience students, faculty mentors, organizers & sponsors",
          ar: "طلاب علوم الأرض، المشرفون الأكاديميون، المنظمون، والرعاة",
        },
      },
      {
        label: { en: "Core Job", ar: "الدور الأساسي للهوية" },
        value: {
          en: "Cohesive outreach + rugged outdoor print & badge legibility",
          ar: "جاذبية حملات التقديم + وضوح المطبوعات والشارات في الميدان",
        },
      },
      {
        label: { en: "Deliverables", ar: "نطاق المخرجات" },
        value: {
          en: "Event mark, campaign posts, field print, badges & merch",
          ar: "شعار الفعالية، حملات رقمية، مطبوعات ميدانية، شارات، وملابس",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Typical challenges in student-run field events",
        ar: "المشكلات المعتادة في الفعاليات والمعسكرات الطلابية",
      },
      beforePoints: [
        {
          en: "Volunteer student committees often piece together announcements, printed booklets, and T-shirts hastily, hurting credibility with sponsors and applicants.",
          ar: "غالباً ما تُصمم إعلانات التقديم والكتيبات والملابس بشكل متفرق وسريع بين لجان المتطوعين، مما يضعف الانطباع أمام الرعاة والمتقدمين.",
        },
        {
          en: "Field camps take place in bright desert terrain where low-contrast badges, schedules, and field guides become hard to read.",
          ar: "يُقام المعسكر في بيئة صحراوية مفتوحة وتحت إضاءة شمس قوية، حيث تفشل التصاميم باهتة التباين على البطاقات والأدلة الورقية.",
        },
        {
          en: "Live daily coverage during camp days stalls if the media team doesn't have pre-sized templates ready before departure.",
          ar: "تتعطل التغطية اليومية لأيام المعسكر إذا لم تتوفر قوالب نشر سريعة وجاهزة قبل التحرك إلى الموقع الميداني.",
        },
      ],
      afterTitle: {
        en: "How the ESFC event system worked in practice",
        ar: "كيف عالج نظام هوية ESFC هذه الاحتياجات عملياً",
      },
      afterPoints: [
        {
          en: "Created a bold, earth-and-amber event identity (#FFC83C / #E07A22 against dark slate) inspired by geological strata and outdoor survey gear.",
          ar: "ابتكار هوية قوية مستلهمة من الطبقات الجيولوجية ومعدات المسح الميداني بدرجات الكهرمان والذهبي عالي التباين.",
        },
        {
          en: "Unified pre-camp applicant campaigns, on-site participant kits (badges, notebooks, apparel), and closing certificates into one coherent package.",
          ar: "ربط مرحلة الإعلان واستقطاب الطلاب بحقيبة المشارك الميدانية (الشارة، الدليل، التيشيرت) وشهادات الختام في تجربة واحدة مترابطة.",
        },
        {
          en: "Prepared modular social and sponsor frames ahead of camp week so student media volunteers could publish daily field recaps rapidly.",
          ar: "تجهيز قوالب النشر وإطارات الرعاة مسبقاً لتمكين فريق التغطية الطلابي من توثيق ونشر فعاليات كل يوم ميداني بسرعة.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Prospective Student Applicants", ar: "الطلاب المتقدمون للمعسكر" },
          benefit: {
            en: "Clear announcements explaining schedules, eligibility, and field activities with serious academic appeal.",
            ar: "إعلانات واضحة ومنظمة تشرح تفاصيل التدريب وشروط التقديم والجدول الزمني بصورة احترافية مشجعة.",
          },
        },
        {
          role: { en: "Camp Organizers & Field Supervisors", ar: "اللجنة المنظمة والمشرفون الميدانيون" },
          benefit: {
            en: "Easy-to-spot role badges, structured field manuals, and cohesive camp apparel that help coordinate groups on site.",
            ar: "بطاقات تعريف واضحة الأدوار وأدلة مطبوعة منظمة وملابس موحّدة تسهل تنظيم المجموعات في الموقع الجبلي أو الصحراوي.",
          },
        },
        {
          role: { en: "Academic & Industry Sponsors", ar: "الرعاة والشركاء الأكاديميون" },
          benefit: {
            en: "Clean, well-governed placement across banners, camp kits, and digital coverage worthy of industry backing.",
            ar: "ظهور منظم ومحترم لشعارات الرعاة عبر اللافتات وحقائب المتدربين والتغطية الرقمية للفعالية.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How the identity supports the three phases of an annual field camp:",
      ar: "كيف يخدم النظام المراحل الثلاث لدورة حياة المعسكر الميداني:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Pre-Camp Outreach", ar: "مرحلة الإعلان والتقديم" },
        title: {
          en: "Launch visuals, speaker/instructor cards & countdowns",
          ar: "حملة الإطلاق، بطاقات المدربين، وإعلانات العد التنازلي",
        },
        detail: {
          en: "Builds momentum across university geoscience communities with clear informational posts for registration deadlines and technical themes.",
          ar: "جذب انتباه طلاب الأقسام العلمية عبر منشورات معلوماتية منظمة لمواعيد التسجيل والمحاور الجيوفيزيائية للتدريب.",
        },
      },
      {
        step: "02",
        actor: { en: "Print & Kit Production", ar: "تجهيز المطبوعات وحقيبة المشارك" },
        title: {
          en: "Field guides, lanyards/badges, camp apparel & banners",
          ar: "طباعة الأدلة الميدانية والشارات والملابس واللافتات",
        },
        detail: {
          en: "Translates the visual identity onto durable print formats, role-coded participant/organizer badges, and wearable camp merchandise.",
          ar: "تحويل الهوية إلى مطبوعات عملية تتحمل الاستخدام الميداني، مع بطاقات مميزة حسب الدور وتصميم موحّد لملابس المشاركين.",
        },
      },
      {
        step: "03",
        actor: { en: "On-Site Field Operations", ar: "أيام العمل الميداني" },
        title: {
          en: "Group identification, camp signage & daily media recaps",
          ar: "تمييز الفرق الميدانية والتغطية الإعلامية اليومية",
        },
        detail: {
          en: "High-visibility amber accents unify group photos, safety/team identification on outcrops, and daily photo frames shared online.",
          ar: "تساعد الألوان الواضحة في تمييز أعضاء المعسكر أثناء المسح الجيولوجي وتمنح الصور والتغطيات اليومية طابعاً بصرياً موحّداً.",
        },
      },
      {
        step: "04",
        actor: { en: "Closing & Documentation", ar: "الختام والتوثيق" },
        title: {
          en: "Completion certificates & sponsor wrap-up visuals",
          ar: "شهادات الاجتياز وتوثيق الشكر للرعاة والمدربين",
        },
        detail: {
          en: "Closes the program with cohesive certificates for trainees and summary visuals archived for the next annual edition.",
          ar: "اختتام المعسكر بشهادات موثقة للمشاركين ولوحات شكر منظمة للرعاة والمحاضرين تبقى مرجعاً للنسخ اللاحقة.",
        },
      },
    ],
    featuresIntro: {
      en: "Practical strengths of the ESFC event identity:",
      ar: "أهم المميزات العملية لهوية مخيم ESFC:",
    },
    features: [
      {
        tag: { en: "Outdoor Contrast", ar: "وضوح ميداني عالٍ" },
        title: {
          en: "High-visibility amber-gold & dark slate color pairing",
          ar: "ثنائية لونية واضحة تحت إضاءة الميدان القوية",
        },
        body: {
          en: "Remains legible on printed badges, field covers, and apparel in bright outdoor conditions as well as dark social feeds.",
          ar: "تحافظ على وضوح النصوص والشعار سواء على المطبوعات والملابس تحت أشعة الشمس أو على شاشات الهواتف.",
        },
      },
      {
        tag: { en: "Full Event Kit", ar: "تكامل عناصر الفعالية" },
        title: {
          en: "Connects digital recruitment to physical camp gear",
          ar: "ربط متكامل بين الحملة الرقمية ومعدات المعسكر الفعلية",
        },
        body: {
          en: "Participants experience one continuous identity from their first online application form to the field notebook in their backpack.",
          ar: "يعيش الطالب تجربة بصرية متصلة تبدأ من إعلان التقديم الإلكتروني وتمتد إلى الدليل المطبوع والشارة في الميدان.",
        },
      },
      {
        tag: { en: "Role Clarity", ar: "تنظيم الأدوار" },
        title: {
          en: "Clear visual differentiation across badges & print",
          ar: "تمييز بصري واضح بين المتدربين والمنظمين والمحاضرين",
        },
        body: {
          en: "Helps logistics teams distinguish trainees, instructors, and organizing crew quickly during multi-day field schedules.",
          ar: "يسهّل على مسؤولي التنظيم إدارة الحركة الميدانية عبر بطاقات واضحة تفصل بين المشارك والمنظم والمشرف العلمي.",
        },
      },
      {
        tag: { en: "Sponsor Readiness", ar: "جاهزية الرعايات" },
        title: {
          en: "Dedicated sponsor lockup zones on print & backdrops",
          ar: "مساحات منظمة لإدراج الرعاة والشركاء دون تشويه التصميم",
        },
        body: {
          en: "Gives petroleum, mining, and academic sponsors clean visibility across banners and camp media without crowding core content.",
          ar: "تمنح الشركات الراعية والجهات الأكاديمية ظهوراً مرتباً على اللافتات والمطبوعات دون الإخلال بوضوح المحتوى.",
        },
      },
      {
        tag: { en: "Volunteer Friendly", ar: "سهولة التشغيل الطلابي" },
        title: {
          en: "Pre-structured templates for fast student execution",
          ar: "قوالب عملية تناسب إيقاع العمل السريع للفرق الطلابية",
        },
        body: {
          en: "Built so student media volunteers can swap daily photos, session titles, and schedules without breaking typography.",
          ar: "مصممة بحيث يستطيع فريق الميديا الطلابي تحديث الصور والجداول اليومية بسرعة مع الحفاظ على ثبات الهوية.",
        },
      },
      {
        tag: { en: "Wearable Pride", ar: "قيمة اقتنائية للمشارك" },
        title: {
          en: "Apparel & merch students actually keep after camp",
          ar: "ملابس ومقتنيات يحتفظ بها الطلاب بعد انتهاء المعسكر",
        },
        body: {
          en: "Treats camp T-shirts, caps, and stickers as desirable outdoor gear rather than disposable giveaway prints.",
          ar: "تصميم تيشيرتات وملصقات المعسكر بروح عصرية تجعل المشاركين يرتدونها ويحتفظون بها كذكرى مهنية.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Completed Event Identity & Print Package (2020)",
        ar: "هوية فعالية وحزمة مطبوعات منجزة (دفعة 2020)",
      },
      summary: {
        en: "Delivered for the 2020 Egypt SEG Field Camp cycle across event branding, print collateral, apparel, and campaign assets. Historical registration totals are intentionally omitted where primary event telemetry is not archived.",
        ar: "نُفّذت المنظومة لدورة عام 2020 من مخيم SEG مصر الميداني شاملة الهوية والمطبوعات والملابس والحملة الرقمية، مع الالتزام بعدم إدراج أرقام تسجيل غير موثقة بسجلات أولية.",
      },
      highlights: [
        {
          en: "Spans digital campaign, field print, badges & camp apparel",
          ar: "تغطي الحملة الرقمية والمطبوعات الميدانية والشارات والملابس",
        },
        {
          en: "Engineered for high-contrast legibility in desert field conditions",
          ar: "مصممة بتباين عالٍ يناسب ظروف الاستخدام الميداني المفتوح",
        },
      ],
    },
  },

  /* ── 07 · LEARN IN ARABIC ───────────────────────────────────────── */
  {
    slug: "learn-in-arabic",
    sector: {
      en: "EdTech & Educational Media · Arabic Technical Learning",
      ar: "التعليم والإعلام المعرفي · المحتوى التقني باللغة العربية",
    },
    headline: {
      en: "Pairing a modern Arabic visual identity with a physical DIY recording studio and motion system so technical lessons ship fast and clearly.",
      ar: "بناء هوية تعليمية عربية عصرية مع تجهيز استوديو تصوير فعلي من الصفر ونظام موشن جرافيك لإنتاج محتوى تقني واضح ومتسق.",
    },
    summary: {
      en: "Learn in Arabic (تعلّم بالعربي) is an educational initiative created within an MSP student/community tech program (2020–2021) to teach technical and modern skills in clear, accessible Arabic. Instead of stopping at a logo, the project combined three connected pieces: a bold typographic brand identity, a physical DIY video studio built from zero, and reusable motion graphics templates for episodes and social publishing.",
      ar: "انطلقت مبادرة (تعلّم بالعربي) خلال الفترة 2020–2021 بهدف تبسيط وتقديم المهارات التقنية والحديثة باللغة العربية بصورة عصرية واضحة. لم يتوقف المشروع عند تصميم شعار، بل جمع ثلاث ركائز عملية مترابطة: هوية تايبوجرافية عربية مميزة، بناء وتجهيز استوديو تصوير فعلي من الصفر بإمكانات ذاتية، وحزمة قوالب موشن جرافيك لتوحيد الحلقات والمنشورات.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Arabic Technical Education & Video Production",
          ar: "المحتوى التعليمي التقني والإنتاج المرئي بالعربية",
        },
      },
      {
        label: { en: "Primary Users", ar: "المستفيدون" },
        value: {
          en: "Arabic-speaking learners & volunteer tech instructors",
          ar: "المتعلمون الناطقون بالعربية والمحاضرون وصناع المحتوى",
        },
      },
      {
        label: { en: "Core Bottleneck Solved", ar: "المشكلة التي يعالجها" },
        value: {
          en: "Fragmented home recordings + dated educational graphics",
          ar: "عشوائية التصوير المنزلي وضعف الجاذبية البصرية للمحتوى التعليمي",
        },
      },
      {
        label: { en: "Integrated Scope", ar: "نطاق التنفيذ المتكامل" },
        value: {
          en: "Arabic Identity + Physical DIY Studio + Motion System",
          ar: "هوية عربية + بناء استوديو تصوير من الصفر + موشن جرافيك",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Why community educational initiatives stall in production",
        ar: "لماذا تتعثر كثير من المبادرات التعليمية العربية في الإنتاج",
      },
      beforePoints: [
        {
          en: "Arabic technical content often looks outdated or overly academic, pushing young learners to assume quality material only exists in English.",
          ar: "يظهر كثير من المحتوى التقني العربي بتصاميم تقليدية جامدة، ما يعطي انطباعاً خاطئاً بأن المحتوى العصري المتقن لا يتوفر إلا بالإنجليزية.",
        },
        {
          en: "When every instructor records in a different room with uneven lighting and audio, episodes look disjointed and editing takes days.",
          ar: "عندما يسجّل كل محاضر في مكان مختلف بإضاءة وخلفية غير موحّدة، تتفاوت جودة الحلقات وتستغرق عملية المونتاج وقتاً مضاعفاً.",
        },
        {
          en: "Without standardized intros, lower-thirds, and thumbnail grids, viewers cannot tell courses or tracks apart on social feeds.",
          ar: "غياب مقدمات الفيديو وشرائط التعريف وأغلفة الحلقات الموحّدة يصعّب على المتابع تمييز المسارات التعليمية عبر المنصات.",
        },
      ],
      afterTitle: {
        en: "How the Brand + Studio + Motion setup worked together",
        ar: "كيف تكاملت الهوية مع الاستوديو والموشن عملياً",
      },
      afterPoints: [
        {
          en: "Designed a clean, contemporary Arabic-first typographic mark and color system (#60A5FA / #2563EB) that makes technical topics feel approachable.",
          ar: "تصميم علامة تايبوجرافية عربية معاصرة ونظام لوني أزرق واضح يمنح المواد التقنية مظهراً حديثاً ومباشراً.",
        },
        {
          en: "Built a physical DIY recording space from scratch—matching backdrop tones, framing, and lighting directly to the brand palette.",
          ar: "تجهيز مساحة تصوير فعلية من الصفر بخلفيات وإضاءة وتكوين كادر متطابق بصرياً مع ألوان الهوية الرقمية.",
        },
        {
          en: "Shipped plug-and-play motion graphics (intros, transitions, callout cards) and social carousels so editors assemble episodes predictably.",
          ar: "توفير حزمة عناصر متحركة جاهزة (مقدمات، فواصل، بطاقات شرح) وقوالب منشورات تسرّع المونتاج وتضبط شكل كل حلقة.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Arabic-Speaking Students & Self-Learners", ar: "الطلاب والمتعلمون ذاتياً" },
          benefit: {
            en: "Clear visual explanations, structured episode thumbnails, and distraction-free video framing that respect their time.",
            ar: "شروحات مرئية منظمة وأغلفة حلقات واضحة العناوين وتصوير مريح للعين يسهّل الاستيعاب والمتابعة.",
          },
        },
        {
          role: { en: "Instructors & Subject Speakers", ar: "المحاضرون ومقدمو المحتوى" },
          benefit: {
            en: "Walk into a pre-lit, pre-framed studio setup and focus strictly on explaining the lesson instead of fighting camera gear.",
            ar: "الدخول إلى استوديو مجهّز مسبقاً بالإضاءة والكادر للتفرغ الكامل لشرح المادة العلمية دون عناء التجهيز الفردي.",
          },
        },
        {
          role: { en: "Video Editors & Social Publishers", ar: "فريق المونتاج والنشر الرقمي" },
          benefit: {
            en: "Consistent camera footage plus ready-made motion assets and thumbnail templates cut post-production friction.",
            ar: "ثبات جودة اللقطات المصوّرة مع جاهزية عناصر التحريك والأغلفة يقلل وقت المعالجة بعد التصوير بشكل ملموس.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "End-to-end educational content workflow enabled by the system:",
      ar: "دورة إنتاج الحلقة التعليمية من التحضير إلى النشر:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Curriculum Structuring", ar: "تجهيز الموضوع التعليمي" },
        title: {
          en: "Topic categorization & Arabic terminology clarity",
          ar: "تقسيم المحاور وتبسيط المصطلحات التقنية بالعربية",
        },
        detail: {
          en: "Lessons are grouped into clear tracks with bilingual technical term support where needed, framed under a consistent visual header.",
          ar: "تُرتّب الدروس في مسارات واضحة تحافظ على المصطلح التقني الصحيح مع شرحه بالعربية ضمن قوالب عرض موحّدة.",
        },
      },
      {
        step: "02",
        actor: { en: "In-Studio Recording", ar: "التصوير داخل الاستوديو" },
        title: {
          en: "Filming in the custom-built DIY studio environment",
          ar: "تسجيل الحلقات في الاستوديو المصمم خصيصاً للهوية",
        },
        detail: {
          en: "Instructors record against the physical set built to match the brand's lighting and color mood, ensuring every video looks part of one series.",
          ar: "يُسجّل المحاضر أمام خلفية وإضاءة مضبوطة مسبقاً على ألوان المبادرة ليخرج كل فيديو بنفس الهوية البصرية.",
        },
      },
      {
        step: "03",
        actor: { en: "Motion Packaging", ar: "التغليف البصري والمونتاج" },
        title: {
          en: "Applying intro stings, speaker lower-thirds & key-point cards",
          ar: "إضافة المقدمة المتحركة، شريط تعريف المحاضر، وبطاقات النقاط",
        },
        detail: {
          en: "Editors drop in the standardized motion graphics package to highlight code concepts, definitions, and episode transitions.",
          ar: "يدرج فريق المونتاج قوالب الموشن جرافيك المعتمدة لإبراز التعريفات والمفاهيم الأساسية والانتقال بين الفقرات.",
        },
      },
      {
        step: "04",
        actor: { en: "Multi-Channel Publishing", ar: "النشر والتفاعل" },
        title: {
          en: "Cohesive video thumbnails & bite-sized social summaries",
          ar: "أغلفة الحلقات وملخصات النشر عبر المنصات الاجتماعية",
        },
        detail: {
          en: "Each episode ships alongside matching carousel summaries and announcement cards that drive learners back to the full lesson.",
          ar: "تُنشر كل حلقة بغلاف واضح يرافقه ملخص بصري سريع على منصات التواصل لربط المتابعين بالدرس الكامل.",
        },
      },
    ],
    featuresIntro: {
      en: "What makes Learn in Arabic stand out as a practical production system:",
      ar: "أهم المميزات العملية لمنظومة (تعلّم بالعربي):",
    },
    features: [
      {
        tag: { en: "Physical + Digital", ar: "دمج الواقعي بالرقمي" },
        title: {
          en: "Identity extended into an actual physical filming room",
          ar: "تحويل الهوية من الشاشة إلى فراغ تصوير فعلي",
        },
        body: {
          en: "Rarely do community brands control the camera frame itself—building the DIY studio aligned on-camera reality with graphic overlays.",
          ar: "ربط تصميم الجرافيك ببناء مكان التصوير نفسه ضمن تطابق الألوان والإضاءة بين الكادر الحقيقي والعناصر المضافة في المونتاج.",
        },
      },
      {
        tag: { en: "Arabic-First Type", ar: "تايبوجرافيا عربية أصيلة" },
        title: {
          en: "Bold Arabic mark designed natively, not adapted from Latin",
          ar: "علامة عربية مبنية أصلاً للحرف العربي وليست مترجمة",
        },
        body: {
          en: "Celebrates modern Arabic letterforms so technical education feels confident and contemporary in its own script.",
          ar: "تمنح الحرف العربي حضوراً هندسياً معاصراً يكسر الصورة النمطية القديمة للمطبوعات التعليمية.",
        },
      },
      {
        tag: { en: "Resourceful Build", ar: "كفاءة التكلفة والتنفيذ" },
        title: {
          en: "Zero-to-one DIY studio built on student-initiative budgets",
          ar: "إنشاء استوديو عملي من الصفر بميزانية مبادرة طلابية",
        },
        body: {
          en: "Solved lighting, acoustic framing, and background consistency practically without requiring commercial studio rental fees.",
          ar: "تحقيق مظهر إنتاجي نظيف ومتسق عبر حلول تجهيز عملية ذكية دون الحاجة لتكاليف إيجار استوديوهات تجارية.",
        },
      },
      {
        tag: { en: "Motion System", ar: "منظومة موشن جرافيك" },
        title: {
          en: "Reusable animated templates for faster episode turnaround",
          ar: "قوالب تحريك قابلة لإعادة الاستخدام لتسريع نشر الحلقات",
        },
        body: {
          en: "Standardized openers, lower-thirds, and topic dividers keep pacing brisk across multiple video editors.",
          ar: "توفر مقدمات وفواصل وشرائط عناوين موحّدة تحفظ إيقاع الحلقات مهما تعدد أفراد فريق المونتاج.",
        },
      },
      {
        tag: { en: "Feed Clarity", ar: "وضوح التصفح للمتعلم" },
        title: {
          en: "Scannable thumbnail & carousel hierarchy",
          ar: "تنظيم بصري يسهّل تمييز عناوين الدروس على المنصات",
        },
        body: {
          en: "Learners scrolling a channel or feed can immediately read the lesson subject and track without visual clutter.",
          ar: "يستطيع المتابع قراءة موضوع الدرس والمسار التابع له فوراً أثناء التصفح السريع دون تشتيت.",
        },
      },
      {
        tag: { en: "Scalable Format", ar: "قابلية التوسع" },
        title: {
          en: "Works across video lessons, written cards & live sessions",
          ar: "تغطي الدروس المسجلة والبطاقات المعرفية واللقاءات الحية",
        },
        body: {
          en: "One cohesive visual kit supports recorded courses, quick tip graphics, and workshop announcements.",
          ar: "حزمة واحدة تخدم الفيديوهات التعليمية، المنشورات التلخيصية، وإعلانات الورش التفاعلية.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Completed Identity, DIY Studio & Motion System (2020–2021)",
        ar: "منظومة هوية واستوديو وموشن منجزة (2020–2021)",
      },
      summary: {
        en: "Delivered across the 2020–2021 MSP cycle, combining Arabic brand design, hands-on physical studio construction from scratch, and motion graphics templates.",
        ar: "نُفّذ المشروع خلال دورة 2020–2021 جامعاً بين تصميم الهوية العربية، التجهيز الفعلي لاستوديو التصوير من الصفر، وبناء قوالب التحريك والنشر.",
      },
      highlights: [
        {
          en: "Three disciplines combined: Brand Identity + Physical Set + Motion",
          ar: "دمج عملي بين ثلاثة مسارات: الهوية البصرية + تجهيز الاستوديو + الموشن",
        },
        {
          en: "Designed specifically for Arabic-first technical education",
          ar: "مصمم خصيصاً لخدمة المحتوى التقني والمعرفي باللغة العربية",
        },
      ],
    },
  },

  /* ── 08 · YOUTH SCOPE ───────────────────────────────────────────── */
  {
    slug: "youth-scope",
    sector: {
      en: "Youth Organization & Community Programs",
      ar: "المؤسسات والمبادرات الشبابية والمجتمعية",
    },
    headline: {
      en: "Two consecutive full-season identity rebuilds paired with hands-on media team leadership for a high-output youth organization.",
      ar: "بناء الهوية البصرية من الصفر لموسمين متتاليين مع قيادة فريق الميديا بالكامل لضبط النشر السريع عبر الورش والفعاليات الشبابية.",
    },
    summary: {
      en: "Youth Scope is a youth community organization running skill workshops, stage events, and seasonal student programs. Across two consecutive annual seasons (2019–2021), the organization's visual identity was rebuilt from scratch each season while leading the media team end-to-end—governing recruitment campaigns, workshop collateral, stage branding, and volunteer social publishing.",
      ar: "تعمل مبادرة يوث سكوب (Youth Scope) على تنظيم برامج تدريبية وورش عمل وفعاليات جماهيرية للشباب والطلاب. على مدار موسمين سنويين متتاليين (2019–2021)، أعيد بناء الهوية البصرية للمؤسسة من الصفر في كل موسم، بالتوازي مع قيادة فريق الميديا بالكامل لإدارة حملات الاستقطاب ومطبوعات الورش وتجهيزات المسرح والنشر اليومي للمتطوعين.",
    },
    snapshot: [
      {
        label: { en: "Sector", ar: "القطاع" },
        value: {
          en: "Youth Development, Workshops & Live Events",
          ar: "تنمية المهارات الشبابية والورش والفعاليات الحية",
        },
      },
      {
        label: { en: "Users & Operators", ar: "المشغّلون والجمهور" },
        value: {
          en: "Volunteer media designers, committee heads & student attendees",
          ar: "مصممو الفريق التطوعي، مسؤولو اللجان، والطلاب المشاركون",
        },
      },
      {
        label: { en: "Role & Tenure", ar: "الدور وفترة العمل" },
        value: {
          en: "System Designer & Media Team Lead · 2 Seasons (2019–21)",
          ar: "مصمم النظام وقائد فريق الميديا · موسمان متتاليان (2019–2021)",
        },
      },
      {
        label: { en: "Delivery Scope", ar: "نطاق المخرجات" },
        value: {
          en: "2 seasonal identities, campaign systems, stage print & QA",
          ar: "هويتان موسميتان، أنظمة حملات، مطبوعات فعاليات، وإشراف تنفيذي",
        },
      },
    ],
    problemAndShift: {
      beforeTitle: {
        en: "Operational reality inside volunteer youth organizations",
        ar: "التحدي الواقعي داخل المؤسسات والأنشطة الشبابية التطوعية",
      },
      beforePoints: [
        {
          en: "Every new annual board brings junior volunteer designers with varying skill levels, causing visual quality to swing wildly from post to post.",
          ar: "مع بداية كل موسم ينضم متطوعون جدد بمستويات خبرة متفاوتة، مما يؤدي لتذبذب حاد في جودة التصاميم من منشور لآخر.",
        },
        {
          en: "Recruitment drives, speaker announcements, and workshop recaps happen on tight 24–48 hour turnarounds where slow approvals block outreach.",
          ar: "حملات التقديم وإعلانات المتحدثين وتغطيات الورش تتم بإيقاع يومي سريع لا يحتمل خطوات تصميم معقدة أو بطء في المراجعة.",
        },
        {
          en: "Reusing the exact same look year after year makes a new season feel stale to returning campus and youth audiences.",
          ar: "تكرار نفس المظهر البصري دون تجديد يفقد الموسم الجديد زخمه أمام الجمهور الطلابي المعتاد على متابعة المبادرة.",
        },
      ],
      afterTitle: {
        en: "How seasonal system design + team leadership solved it",
        ar: "كيف عالج بناء النظام الموسمي وقيادة الفريق هذه التحديات",
      },
      afterPoints: [
        {
          en: "Engineered a fresh seasonal identity from zero for each of the two years—giving every board launch unmistakable new energy while keeping brand recognition.",
          ar: "تأسيس هوية موسمية متكاملة من الصفر في كل عام لمنح انطلاقة الموسم زخماً جديداً مع الحفاظ على شخصية المؤسسة.",
        },
        {
          en: "Built modular template grids (#3DDC84 / #149E5A energetic palette) with locked typography zones so junior volunteers could produce clean assets reliably.",
          ar: "تصميم شبكات قوالب مرنة بمساحات نصوص وألوان محددة تمكّن المصمم المتطوع من إنتاج تصميم متزن وسريع بأقل نسبة خطأ.",
        },
        {
          en: "Led the media team directly—setting task distribution, critique checklists, and print pre-flight checks before stage events.",
          ar: "قيادة فريق الميديا ميدانياً عبر توزيع المهام، وضع معايير مراجعة سريعة، وفحص ملفات الطباعة قبل الفعاليات الكبرى.",
        },
      ],
      stakeholders: [
        {
          role: { en: "Volunteer Media Team", ar: "أعضاء فريق الميديا المتطوعون" },
          benefit: {
            en: "Clear grids, shared asset kits, and structured mentorship instead of vague 'redesign this' feedback.",
            ar: "قوالب وأصول عمل واضحة وتوجيه عملي محدد يرفع مستواهم ويمنع إهدار الوقت في التعديلات العشوائية.",
          },
        },
        {
          role: { en: "Organization Board & Event Leads", ar: "مجلس إدارة المبادرة ومنظمو الفعاليات" },
          benefit: {
            en: "Dependable campaign launches for recruitment, workshops, and main-stage conferences on schedule.",
            ar: "التزام بالمواعيد في إطلاق حملات التقديم وتغطية الورش وتجهيز مطبوعات المسرح بجودة موحّدة.",
          },
        },
        {
          role: { en: "Youth Attendees & Partners", ar: "الشباب المشاركون والرعاة" },
          benefit: {
            en: "Clear event schedules, recognizable workshop tracks, and energetic on-ground signage and badges.",
            ar: "وضوح تام في مواعيد الفعاليات ومسارات الورش، مع تجربة حضور منظمة عبر اللافتات والبطاقات المطبوعة.",
          },
        },
      ],
    },
    workflowIntro: {
      en: "How a seasonal youth-organization identity runs across an entire program year:",
      ar: "كيف تدار الهوية البصرية للمبادرة على مدار الموسم الكامل:",
    },
    workflow: [
      {
        step: "01",
        actor: { en: "Season Kickoff", ar: "تأسيس الموسم" },
        title: {
          en: "Seasonal concept, color/type kit & volunteer onboarding",
          ar: "بناء هوية الموسم وتدريب فريق الميديا على القوالب",
        },
        detail: {
          en: "Before public launch, the season's visual direction, template files, and export standards are built and walked through with the media team.",
          ar: "قبل الإطلاق العلني، تُجهّز ملفات الهوية والقوالب الأساسية ويُدرّب أعضاء الفريق على قواعد الاستخدام والتصدير.",
        },
      },
      {
        step: "02",
        actor: { en: "Recruitment Campaign", ar: "حملة استقطاب الأعضاء والمشاركين" },
        title: {
          en: "Committee explainers, application calls & interview schedules",
          ar: "التعريف باللجان، إعلانات التقديم، ومواعيد المقابلات",
        },
        detail: {
          en: "High-frequency social posts roll out across platforms using modular cards for each committee and program track.",
          ar: "إطلاق سلسلة منشورات مكثفة ومنظمة تشرح دور كل لجنة ومسار تدريبي لجذب المتقدمين الجدد.",
        },
      },
      {
        step: "03",
        actor: { en: "Workshops & Stage Events", ar: "الورش والفعاليات الميدانية" },
        title: {
          en: "Roll-ups, stage backdrops, speaker cards & attendee badges",
          ar: "لافتات المسرح، بطاقات المتحدثين، وشارات الحضور",
        },
        detail: {
          en: "Extends the digital season look into physical venues so workshop rooms, registration desks, and stages match online announcements.",
          ar: "نقل الهوية البصرية من المنصات الرقمية إلى قاعات التدريب والمسرح ومكاتب التسجيل لتوحيد تجربة الحضور.",
        },
      },
      {
        step: "04",
        actor: { en: "Review & Season Wrap", ar: "ضبط الجودة وختام الموسم" },
        title: {
          en: "Fast team QA loop, event photo frames & closing recognition",
          ar: "مراجعة المخرجات السريعة، توثيق الفعاليات، وشهادات الختام",
        },
        detail: {
          en: "Every published asset passes a lightweight lead review, keeping quality steady through closing ceremonies and season handover.",
          ar: "يمر كل تصميم بمراجعة سريعة قبل النشر للحفاظ على ثبات المستوى حتى الحفل الختامي وتسليم الأرشيف للموسم التالي.",
        },
      },
    ],
    featuresIntro: {
      en: "Practical advantages built into the Youth Scope system:",
      ar: "أهم المميزات العملية لنظام هوية يوث سكوب:",
    },
    features: [
      {
        tag: { en: "Multi-Designer Safe", ar: "مصمم لعمل الفرق" },
        title: {
          en: "Guardrailed templates built for student volunteers",
          ar: "قوالب محكومة تحافظ على الجودة رغم تفاوت خبرة المتطوعين",
        },
        body: {
          en: "Fixed safe margins, type scales, and color tokens prevent common layout mistakes when 5+ volunteers publish concurrently.",
          ar: "تثبيت الهوامش ومقاسات الخطوط والألوان يمنع الأخطاء البصرية الشائعة عند عمل عدة مصممين في نفس الوقت.",
        },
      },
      {
        tag: { en: "Proven Twice", ar: "مختبر عبر موسمين كاملين" },
        title: {
          en: "Rebuilt from scratch across two consecutive seasons",
          ar: "إعادة بناء ناجحة من الصفر على مدار عامين متتاليين",
        },
        body: {
          en: "Demonstrates repeatable system thinking rather than a one-off lucky graphic direction.",
          ar: "يثبت القدرة على ابتكار أنظمة متجددة وقابلة للتشغيل الفعلي تحت ضغط المواسم المتتالية.",
        },
      },
      {
        tag: { en: "Design + Leadership", ar: "الجمع بين التصميم والقيادة" },
        title: {
          en: "End-to-end ownership of both the visual rules and the team",
          ar: "ملكية كاملة لبناء القواعد البصرية وإدارة الفريق المنفّذ",
        },
        body: {
          en: "Bridged the gap between designing a brand book and actually shipping hundreds of seasonal campaign pieces with a team.",
          ar: "ردم الفجوة بين وضع قواعد التصميم النظرية وبين قيادة فريق فعلي لإخراج عشرات الحملات والمطبوعات في مواعيدها.",
        },
      },
      {
        tag: { en: "Fast Turnaround", ar: "سرعة الاستجابة اليومية" },
        title: {
          en: "Built for 24-hour event & announcement cycles",
          ar: "مهيّأ لإيقاع النشر السريع وتغطيات الفعاليات الفورية",
        },
        body: {
          en: "Pre-built formats for speakers, agendas, urgent schedule updates, and live photo recaps.",
          ar: "صيغ جاهزة لإعلانات المتحدثين، الجداول الزمنية، التنويهات السريعة، وألبومات التغطية الفورية.",
        },
      },
      {
        tag: { en: "Stage & Print Ready", ar: "جاهزية المطبوعات والفعاليات" },
        title: {
          en: "Scales from mobile story cards to venue backdrops",
          ar: "يمتد بسلاسة من قصص الهاتف إلى خلفيات المسارح",
        },
        body: {
          en: "Vector assets and bold color blocking hold up cleanly on roll-up banners, ID lanyards, and printed certificates.",
          ar: "عناصر فيكتور واضحة ومساحات لونية جريئة تظهر بكفاءة عالية على الرول أب والبطاقات والشهادات المطبوعة.",
        },
      },
      {
        tag: { en: "Youth Energy", ar: "روح شبابية غير فوضوية" },
        title: {
          en: "Vibrant presence without sacrificing readability",
          ar: "حيوية بصرية جذابة للشباب دون التضحية بوضوح المعلومة",
        },
        body: {
          en: "Captures campus excitement while keeping dates, venues, and registration links immediately scannable.",
          ar: "تجذب الفئة العمرية الشابة مع إبقاء المواعيد والأماكن وتفاصيل التسجيل واضحة ومقروءة من أول نظرة.",
        },
      },
    ],
    operationalNote: {
      statusLabel: {
        en: "Completed Two-Season Identity & Media Leadership (2019–2021)",
        ar: "منظومة موسمين متتاليين وقيادة فريق ميديا (2019–2021)",
      },
      summary: {
        en: "Delivered across two full annual cycles (2019–2021), encompassing two ground-up seasonal visual systems, recruitment and event campaigns, print assets, and media team leadership.",
        ar: "نُفّذ العمل عبر دورتين سنويتين كاملتين (2019–2021)، شاملاً تأسيس هويتين موسميتين من الصفر، وإدارة حملات الاستقطاب والفعاليات والمطبوعات وقيادة فريق الميديا.",
      },
      highlights: [
        {
          en: "2 full seasonal identity rebuilds + ongoing campaign execution",
          ar: "إعادة بناء كاملة للهوية لموسمين + تشغيل مستمر للحملات",
        },
        {
          en: "Recognized as Best Head across both consecutive seasons",
          ar: "تضمن قيادة فريق الميديا من التخطيط وحتى التسليم الميداني",
        },
      ],
    },
  },
];
