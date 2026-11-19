"use client";

import Link from "@/components/ui/localized-link";
import Image from "next/image";
import { useLang } from "@/components/providers/lang-provider";
import { trackEvent } from "@/lib/analytics";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { buttonVariants } from "@/components/ui/Button";
import { GAD_NAME_AR } from "@/lib/client-names";

interface CaseBrief {
  slug: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  thumbnail: string;
  challenge: string;
  challengeAr: string;
  role: string;
  roleAr: string;
  team: string;
  teamAr: string;
  whatShipped: string[];
  whatShippedAr: string[];
  deployment: string;
  deploymentAr: string;
  accent: string;
}

const CASES_FOR_HIRING: CaseBrief[] = [
  {
    slug: "gad-institute",
    name: "GAD Heart & Lungs Institute",
    nameAr: GAD_NAME_AR,
    category: "Healthcare Brand Identity",
    categoryAr: "هوية مؤسسة رعاية صحية متخصصة",
    thumbnail: "/images/work/gad/gad-card.jpg",
    challenge:
      "A high-stakes specialized cardiac and pulmonary institute operating with generic, cold hospital branding — needed an authoritative, comforting bilingual brand system to govern physical architectural signage and digital care.",
    challengeAr:
      "معهد متخصص في رعاية القلب والرئة كان يعمل تحت هوية مستشفى عام بارد. احتاج إلى نظام هوية ثنائي اللغة يجمع بين الوقار الطبي والدفء الإنساني، ويضبط اللافتات المعمارية والتواصل الرقمي.",
    role: "Lead Brand Identity Designer & Creative Director",
    roleAr: "قائد تصميم الهوية البصرية والمدير الإبداعي",
    team: "Mustafa (Sole Designer) in direct collaboration with Medical Director (clinical anatomical accuracy) & Marketing Manager.",
    teamAr: "مصطفى (المصمم الوحيد)، بالتعاون المباشر مع المدير الطبي لضمان الدقة التشريحية، ومع مدير التسويق.",
    whatShipped: [
      "Dual heart + lung circular seal & monogram",
      "Bilingual Latin (Trap) & Arabic (Alexandria) typography pairing",
      "Pantone-calibrated palette (107-8 U Deep Blue + 49-16 U Crimson)",
      "Complete brand guidelines (V2.0)",
    ],
    whatShippedAr: [
      "شعار دائري مدمج يجمع رمز القلب والرئة بدقة تشريحية",
      "مواءمة طباعية ثنائية اللغة: خط Trap اللاتيني مع خط Alexandria العربي",
      "نظام ألوان مثبّت على بانتون (أزرق عميق 107-8 U وقرمزي 49-16 U)",
      "دليل هوية متكامل (V2.0)",
    ],
    deployment:
      "Exterior hospital facade signage, 3D reception wall seal, patient wayfinding, staff uniforms, bilingual diagnosis folders, prescription stationery, and medical summit stands.",
    deploymentAr:
      "لافتات الواجهة الرئيسية، وجدار الاستقبال المجسّم، ولافتات الإرشاد الداخلي، وزي الأطباء والتمريض، وملفات المرضى، والوصفات الطبية، وأجنحة المعارض الطبية.",
    accent: "rgb(0 88 149 / 0.20)",
  },
  {
    slug: "reflection",
    name: "Reflection Art & Print Studio",
    nameAr: "استوديو ريفلكشن للفنون والمطبوعات",
    category: "Editorial & Art Brand System",
    categoryAr: "هوية تحريرية وفنون مطبوعة",
    thumbnail: "/images/work/reflection/refl-card.jpg",
    challenge:
      "A fine-art framing and print studio needed a warm, airy editorial identity to position it apart from cheap mass-market poster shops and cold, sterile galleries.",
    challengeAr:
      "استوديو فنون ومطبوعات احتاج إلى هوية تحريرية دافئة تميّزه عن متاجر الملصقات الشعبية وصالات العرض الباردة المنعزلة.",
    role: "Sole Brand Identity Designer",
    roleAr: "مصمم الهوية البصرية (منفردًا)",
    team: "Mustafa (Solo Engagement) working directly with the Founder.",
    teamAr: "مصطفى (مشروع مستقل)، بالعمل مباشرة مع المؤسس.",
    whatShipped: [
      "Constructed 'R' monogram based on pure geometric balance (circle + triangle)",
      "Airy white foundation with controlled violet-to-teal color spectrum",
      "Editorial typography pairing: Neue Machina (Display) + Quicksand (Body)",
      "Focal-area layout doctrine (Image, Headline, Icon rules) and 18-page brand book",
    ],
    whatShippedAr: [
      "مونوغرام حرف R الهندسي، مبني على توازن الدائرة والمثلث",
      "مساحات بيضاء رحبة وطيف لوني محسوب من البنفسجي إلى الفيروزي",
      "نظام خطوط تحريري: Neue Machina للعناوين مع Quicksand للمتن",
      "قواعد تخطيط المنطقة البؤرية (الصورة والعنوان والأيقونة) ودليل علامة من 18 صفحة",
    ],
    deployment:
      "Framed museum-grade prints, storefront signage, product authentication tags, packaging tissue and shipping tape, storefront digital presence.",
    deploymentAr:
      "المطبوعات المؤطرة الفاخرة، ولافتة واجهة المتجر، وبطاقات أصالة الأعمال، وتغليف الشحن والأشرطة، والمتجر الرقمي.",
    accent: "rgb(150 70 140 / 0.18)",
  },
  {
    slug: "nile-pharma",
    name: "Nile Pharma Food",
    nameAr: "شركة نايل فارما فود",
    category: "Consumer Packaging & Pharma-Food",
    categoryAr: "تغليف استهلاكي وهوية لقطاع الدواء والغذاء",
    thumbnail: "/images/work/nile-pharma/npf-card.jpg",
    challenge:
      "A pharma and dietary-supplements company operating for years without visual governance, resulting in fragmented packaging and weak pharmacy shelf presence against imported brands.",
    challengeAr:
      "شركة أدوية ومكملات غذائية عملت لسنوات دون حوكمة بصرية، فنتج عن ذلك تغليف متباين وحضور ضعيف على رفوف كبرى الصيدليات في مواجهة المنتجات المستوردة.",
    role: "Media Director & Account Manager (2020–2025) · functional scope: brand & art direction",
    roleAr: "مدير الإعلام ومدير الحسابات (2020–2025) · نطاق العمل: توجيه العلامة والإدارة الفنية",
    team: "Mustafa leading visual strategy with Sales Leadership, Regulatory Pharmacists, and Packaging Printers.",
    teamAr: "مصطفى قائدًا للاستراتيجية البصرية، بالتنسيق مع المبيعات والصيادلة ومطابع التغليف.",
    whatShipped: [
      "Bilingual geometric logomark engineered on a modular grid",
      "'The Blue Box' consumer packaging architecture (Proxeed Plus & Proxerex)",
      "Nile Navy (#1B2A5B) + Life Green (#37A66B) color system with unified print standards",
      "Multi-channel marketing assets: highway billboards, pharmacy social campaigns, and web presence",
    ],
    whatShippedAr: [
      "شعار هندسي ثنائي اللغة مبني على شبكة قياسية متوازنة",
      "هيكل تغليف «العلبة الزرقاء» لخط المكملات (Proxeed Plus وProxerex)",
      "نظام لوني موحّد (كحلي النيل #1B2A5B وأخضر الحياة #37A66B) بمعايير طباعة دقيقة",
      "حملات تسويقية متعددة القنوات: لوحات الطرق السريعة، وحملات صيدليات العزبي على وسائل التواصل، والموقع الإلكتروني",
    ],
    deployment:
      "Pharmacy retail channels across Egypt, primary product cartons, highway advertising, clinical brochures, and digital channels.",
    deploymentAr:
      "قنوات الصيدليات وتجارة التجزئة في مصر، وعلب المنتجات الدوائية، ولوحات الطرق السريعة، والمطبوعات والمنصات الرقمية.",
    accent: "rgb(27 42 91 / 0.22)",
  },
  {
    slug: "ahmed-bedeer",
    name: "Ahmed Bedeer",
    nameAr: "أحمد بدير",
    category: "Healthcare IT Leadership Identity",
    categoryAr: "هوية قيادية في تقنية المعلومات الصحية",
    thumbnail: "/images/work/ahmed-bedeer-card.jpg",
    challenge:
      "A healthcare IT executive and regional consultant needed a personal brand identity that communicated executive gravitas without corporate stiffness.",
    challengeAr:
      "قائد تنفيذي في تقنية المعلومات الصحية واستشاري إقليمي، احتاج إلى علامة شخصية بوقار وهيبة بعيدًا عن الجمود المؤسسي.",
    role: "Lead Identity Designer",
    roleAr: "مصمم الهوية الرئيسي",
    team: "Mustafa working 1:1 with the executive client.",
    teamAr: "مصطفى، بالعمل المباشر مع العميل التنفيذي.",
    whatShipped: [
      "Geometric 'ab' monogram integrating quotation-mark curvature",
      "Deep teal & mint authority palette with extended digital shades",
      "Lubalin Graph + Uncut Sans bilingual typographic voice",
      "Executive stationery system: debossed business cards, letterheads, and digital deck templates",
    ],
    whatShippedAr: [
      "مونوغرام «ab» الهندسي المدمج مع منحنى علامات الاقتباس",
      "لوحة ألوان مستوحاة من التقنية الصحية (تيل عميق ونعناعي)",
      "هرمية خطوط تجمع Lubalin Graph مع Uncut Sans",
      "قرطاسية تنفيذية: بطاقات أعمال محفورة، وورق رسمي، وقوالب عروض تقديمية",
    ],
    deployment:
      "Executive business stationery, digital consulting proposals, presentation slide systems, and personal website.",
    deploymentAr:
      "القرطاسية التنفيذية، وعروض الاستشارات الرقمية، وقوالب العروض، والموقع الشخصي.",
    accent: "rgb(17 138 178 / 0.20)",
  },
];

const SKILL_GROUPS = [
  {
    title: "Brand Strategy & Architecture",
    titleAr: "استراتيجية العلامة وهيكلتها",
    skills: ["Brand Audit & Diagnostics", "Competitor Positioning Maps", "Archetype & Tone of Voice", "Brand Architecture (Branded House / House of Brands)", "Strategic Briefs"],
    skillsAr: ["تدقيق الهوية وتشخيصها", "خرائط تموضع المنافسين", "شخصية العلامة ونبرة الصوت", "هيكلة العلامات التجارية", "الموجزات الاستراتيجية"],
  },
  {
    title: "Bilingual Identity & Typography",
    titleAr: "الهوية ثنائية اللغة والخطوط",
    skills: ["Arabic & Latin Script Harmonization", "Geometric & Monogram Logomarks", "Bilingual Wordmarks & Lockups", "Typeface Hierarchy & Scaling", "Legibility Across Extremes (16px to Facades)"],
    skillsAr: ["مواءمة الخطين العربي واللاتيني", "الشعارات الهندسية والمونوغرام", "الشعارات النصية ثنائية اللغة", "الهرمية الطباعية والمقاييس", "المقروئية في الأحجام القصوى (من 16px إلى اللافتات)"],
  },
  {
    title: "Design Systems & Token Governance",
    titleAr: "أنظمة التصميم وحوكمة المتغيّرات",
    skills: ["Design Tokens Architecture", "Color Palette Formulation (Pantone, CMYK, Hex)", "Grid & Spatial Systems", "Component States & Interactive Specs", "Comprehensive Brand Guidelines"],
    skillsAr: ["بنية متغيّرات التصميم", "معايرة الألوان (بانتون وCMYK وHex)", "الشبكات وأنظمة المسافات", "حالات العناصر ومواصفاتها", "أدلة هوية شاملة ومحكومة"],
  },
  {
    title: "Production & Physical Delivery",
    titleAr: "الإنتاج والتنفيذ المادي",
    skills: ["Carton & Product Packaging", "Architectural & Wayfinding Signage", "Print Pre-Press & Vendor Proofing", "Stationery & Collateral Toolkits", "Campaign Asset Systems"],
    skillsAr: ["تغليف الكرتون والمنتجات", "اللافتات المعمارية والإرشاد البيئي", "تجهيز الطباعة وفحص العينات", "القرطاسية ومواد التسويق", "أنظمة أصول الحملات"],
  },
];

const TIMELINE = [
  {
    period: "Sep 2026 → Present",
    periodAr: "سبتمبر 2026 ← الحاضر",
    role: "Digital Product & Platform Lead",
    roleAr: "قائد المنتج والمنصة الرقمية",
    company: "Nile Pharma Food & Food Supplements",
    companyAr: "نايل فارما فود والمكملات الغذائية",
    detail: "Leading the company digital product and platform direction across brand, website, ERP, marketing, UX/UI, and technical coordination.",
    detailAr: "قيادة اتجاه المنتج والمنصة الرقمية عبر الهوية والموقع وERP والتسويق وتصميم الواجهات والتجربة (UX/UI) والتنسيق التقني.",
  },
  {
    period: "2024 → Present",
    periodAr: "2024 ← الحاضر",
    role: "Co-Founder & Creative Lead",
    roleAr: "شريك مؤسس ومدير إبداعي",
    company: "Code & Canvas",
    companyAr: "كود آند كانفاس",
    detail: "Directing brand identity systems, typography, and design systems for regional SMEs and startups.",
    detailAr: "قيادة أنظمة الهوية البصرية والطباعة وأنظمة التصميم للشركات الصغيرة والمتوسطة في المنطقة.",
  },
  {
    period: "2020 – 2025",
    periodAr: "2020 – 2025",
    role: "Media Director & Account Manager",
    roleAr: "مدير الإعلام ومدير الحسابات",
    company: "Nile Pharma Food",
    companyAr: "نايل فارما فود",
    detail: "Five-year visual stewardship across the brand rework, packaging, and campaign systems, with visual governance for the product and communication touchpoints.",
    detailAr: "خمس سنوات من الحوكمة البصرية شملت تطوير الهوية والتغليف وأنظمة الحملات، مع توحيد تطبيق الهوية عبر المنتجات ومواد التواصل.",
  },
  {
    period: "2020 – 2021",
    periodAr: "2020 – 2021",
    role: "Studio Lead & Visual Director",
    roleAr: "قائد الاستوديو والمدير البصري",
    company: "Learn in Arabic (MSP)",
    companyAr: "تعلّم بالعربي (MSP)",
    detail: "Built educational visual identity, motion guidelines, and DIY production studio from scratch.",
    detailAr: "بناء الهوية البصرية التعليمية، وأدلة الحركة، واستوديو إنتاج متكامل من الصفر.",
  },
  {
    period: "2019 – 2021",
    periodAr: "2019 – 2021",
    role: "Head of Media (2 Consecutive Seasons)",
    roleAr: "رئيس لجنة الإعلام (موسمان متتاليان)",
    company: "Youth Scope",
    companyAr: "يوث سكوب",
    detail: "Overhauled organizational identity twice. Led team of 12 designers; awarded Best Head both seasons.",
    detailAr: "إعادة بناء هوية المنظمة مرتين، وقيادة فريق من 12 مصممًا، والفوز بجائزة أفضل رئيس لجنة في الموسمين.",
  },
  {
    period: "2017 → 2022",
    periodAr: "2017 ← 2022",
    role: "Graphic Designer",
    roleAr: "مصمم جرافيك",
    company: "Independent Practice",
    companyAr: "عمل مستقل",
    detail: "Professional design practice across identity, digital, campaigns, and visual communication.",
    detailAr: "ممارسة تصميمية احترافية شملت الهوية والتصميم الرقمي والحملات والتواصل البصري.",
  },
  {
    period: "2022 → Present",
    periodAr: "2022 ← الحاضر",
    role: "Brand Identity Designer & Consultant",
    roleAr: "مصمم هوية بصرية ومستشار",
    company: "Independent Practice",
    companyAr: "عمل مستقل",
    detail: "4+ years focused on brand identity and systems; 20+ clients and organizations across healthcare, pharmaceuticals, food, education, government, and related sectors.",
    detailAr: "أكثر من 4 سنوات في الهوية والأنظمة، وأكثر من 20 عميلًا ومؤسسة في الرعاية الصحية والأدوية والغذاء والتعليم والحكومة وغيرها.",
  },
];

export function ForHiringView() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <main className="container-content flex flex-col gap-8 pb-5 lg:pb-6">
      {/* ── 01 · Hero Header & Candidacy ── */}
      <header className="flex flex-col gap-6 border-b border-border-subtle pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="live" size="md">
            <span className="size-2 rounded-pill bg-success animate-pulse" />
            {ar ? "متاح للتوظيف | الخليج أو عن بُعد" : "AVAILABLE | GULF OR REMOTE"}
          </Badge>
          <span className="font-mono text-micro uppercase tracking-wider text-text-ghost">
            {ar ? "ملف المرشح لفرق التوظيف" : "CANDIDATE DOSSIER // FOR HIRING TEAMS"}
          </span>
        </div>

        <Heading
          eyebrow={ar ? "مصطفى أبوالعزم · مصمم هوية بصرية أول" : "MUSTAFA ABOALAZM · SENIOR BRAND IDENTITY DESIGNER"}
          title={
            ar ? (
              <>هويات بصرية وأنظمة تصميم <em className="text-accent">تستطيع الفرق تنفيذها وتوسيعها فعليًا.</em></>
            ) : (
              <>Brand identities and visual systems <em className="text-accent">teams can actually ship and scale.</em></>
            )
          }
          subtitle={
            ar
              ? "أكثر من 9 سنوات من الممارسة المهنية في التصميم، منها أكثر من 4 سنوات في بناء أنظمة الهوية ثنائية اللغة (العربية والإنجليزية)، والتغليف وأنظمة التصميم والتنفيذ الرقمي. أبحث عن فرصة بدوام كامل بوظيفة مصمم هوية بصرية أول (السعودية أو الإمارات أو قطر أو عن بُعد)."
              : "9+ years of professional design practice, including 4+ years focused on bilingual Arabic/English identity systems, packaging, governed design systems, and digital execution. Seeking full-time Senior Brand & Product Designer / Brand Identity Designer opportunities (Saudi Arabia, UAE, Qatar or remote)."
          }
        />

        {/* Primary Candidate CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="/cv"
            onClick={() => trackEvent("cv_download")}
            download="Mustafa_Taha_Brand_Identity_CV.docx"
            className="group inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-2.5 font-mono text-label uppercase tracking-[0.06em] text-obsidian transition-transform duration-base ease-physics hover:-translate-y-0.5"
          >
            <span>{ar ? "تحميل أحدث نسخة من السيرة الذاتية" : "Download Updated CV"}</span>
            <Icon name="arrow-down" />
          </a>
          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-pill border border-border-default bg-surface-1 px-4 py-2.5 font-mono text-label uppercase tracking-[0.06em] text-text-primary transition-colors duration-base ease-physics hover:border-accent hover:text-accent"
          >
            <span>{ar ? "عرض شرائح ملف الأعمال (16:9)" : "View Portfolio Deck (16:9)"}</span>
            <Icon name="arrow-up-right" />
          </a>
          <a
            href="mailto:m1aboalazm@gmail.com"
            className="inline-flex items-center gap-2 rounded-pill border border-border-subtle px-4 py-2.5 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:border-text-primary hover:text-text-primary"
          >
            <span>{ar ? "راسلني مباشرةً عبر البريد الإلكتروني" : "Email Directly"}</span>
            <Icon name="arrow-right" />
          </a>
        </div>

        {/* Studio Services vs Candidate Track Note */}
        <div className="mt-4 rounded-card border border-border-subtle bg-surface-1/70 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-pill bg-accent" />
              <p className="font-mono text-micro uppercase tracking-wider text-text-primary">
                {ar ? "ملاحظة لمديري التوظيف والعملاء" : "NOTE FOR HIRING MANAGERS & CLIENTS"}
              </p>
            </div>
            <Link
              href="/pricing"
              className="font-mono text-micro font-medium text-text-tertiary underline decoration-border-default underline-offset-4 transition-colors hover:text-accent"
            >
              {ar ? "تبحث عن خدمات الاستوديو والأسعار؟ اضغط هنا ←" : "Looking for Studio Services & Pricing? Click here →"}
            </Link>
          </div>
          <p className="mt-2 text-body-sm text-text-secondary">
            {ar
              ? "هذه الصفحة مخصصة لمديري التصميم ومسؤولي التوظيف الإبداعي ومديري التوظيف الذين يقيّمون مصطفى لوظيفة مصمم هوية بصرية داخل شركة أو وكالة. أما إن كنت عميلًا تبحث عن باقات تصميم الاستوديو أو الخدمات المنفردة أو أسعار العمل المستقل الثابتة، فهي منفصلة تمامًا في صفحتَي الخدمات والأسعار."
              : "This page is dedicated to design directors, creative recruiters, and hiring managers evaluating Mustafa for in-house or agency Brand Identity Designer roles. If you are a client looking for studio design packages, à la carte services, or fixed freelance pricing, those are kept completely separate on our Services & Pricing pages."}
          </p>
        </div>
      </header>

      {/* ── 02 · Candidate Highlights & Quick Facts ── */}
      {/* Columns follow the list's own width (container query), not the viewport:
          the cards sit in a padded column, so "PRACTICE EXPERIENCE" and
          "Gulf / Remote" overflowed their cells at 360px and again at 768px. */}
      <div className="@container border-b border-border-subtle pb-6">
      <dl className="grid grid-cols-1 gap-4 @min-[26rem]:grid-cols-2 @min-[52rem]:grid-cols-4">
        {[
          [ar ? "سنوات الممارسة" : "PRACTICE EXPERIENCE", "9+ Years", "2017–2026"],
          [ar ? "أنظمة هوية مُسلَّمة" : "IDENTITY SYSTEMS SHIPPED", "20+ Clients", ar ? "الصحة والدواء والغذاء والتعليم والحكومة" : "Healthcare, pharma, education, government"],
          [ar ? "إتقان اللغتين" : "BILINGUAL MASTERY", "Arabic + Latin", ar ? "تكافؤ طباعي أصيل" : "Native typographic parity"],
          [ar ? "الموقع والجاهزية" : "LOCATION & STATUS", "Gulf / Remote", ar ? "جاهز للانتقال (السعودية أو الإمارات أو قطر) أو للعمل عن بُعد" : "Open to relocation (Saudi Arabia, UAE, Qatar) or remote"],
        ].map(([label, val, sub]) => (
          <div key={label} className="flex min-w-0 flex-col gap-1 rounded-card border border-border-subtle bg-surface-1 p-3 sm:p-4">
            <dt className="font-mono text-micro uppercase tracking-wider text-text-ghost [overflow-wrap:anywhere]">{label}</dt>
            <dd className="font-display font-display-sm text-subtitle font-bold text-text-primary [overflow-wrap:anywhere]">{val}</dd>
            <dd className="font-mono text-micro text-accent [overflow-wrap:anywhere]">{sub}</dd>
          </div>
        ))}
      </dl>
      </div>

      {/* ── 03 · Selected Projects with Exact Role Breakdown ── */}
      <section className="flex flex-col gap-8 border-b border-border-subtle pb-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
            {ar ? "أعمال مختارة وتفاصيل الدور" : "SELECTED WORK & ROLE BREAKDOWN"}
          </p>
          <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
            {ar ? "ماذا صمّمت، وكيف عملت مع الفريق؟" : "What I Designed & How I Collaborated"}
          </h2>
          <p className="max-w-[62ch] text-body text-text-secondary">
            {ar
              ? "لكل مشروع رئيسي: التحدي الحقيقي، ودوري بالتحديد، وتكوين الفريق، والمخرجات المنفّذة، وأين يُستخدم النظام اليوم."
              : "For each key project: the real business challenge, my exact role, team composition, concrete artifacts shipped, and real-world deployment."}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {CASES_FOR_HIRING.map((project) => {
            /* Rendered twice on purpose: under the picture from `lg` up (so the
               two columns balance and "who did what" sits beside the proof),
               and in its old place between the challenge and the deliverables
               below `lg`, where the card is a single column. */
            const roleBlock = (
              <div className="flex flex-col gap-1">
                <p className="font-mono text-micro uppercase tracking-wider text-accent">
                  {ar ? "دوري والفريق" : "MY ROLE & TEAM"}
                </p>
                <p className="text-body-sm font-medium text-text-primary">
                  {ar ? project.roleAr : project.role}
                </p>
                <p className="text-body-sm text-text-tertiary">
                  {ar ? project.teamAr : project.team}
                </p>
              </div>
            );

            return (
              <article
                key={project.slug}
                className="flex flex-col overflow-hidden rounded-panel border border-border-subtle bg-surface-1 transition-all duration-base ease-physics hover:border-border-strong lg:grid lg:grid-cols-[28rem_1fr]"
              >
                {/* Thumbnail side — the picture is shown whole at its own 16:10, with
                    the role underneath. It used to be `fill` + `object-cover` in a
                    224px strip, which cropped every mark ("GA…", a black panel) and
                    made the browser fetch a 1920px file for a 224px slot. */}
                <div className="flex flex-col bg-surface-2 lg:border-e lg:border-border-subtle">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={project.thumbnail}
                      alt={ar ? project.nameAr : project.name}
                      fill
                      sizes="(min-width: 1024px) 448px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden flex-1 p-4 lg:block">{roleBlock}</div>
                </div>

                {/* Details side */}
                <div className="flex flex-col gap-4 p-4 lg:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <div>
                      <span className="font-mono text-micro uppercase tracking-wider text-accent">
                        {ar ? project.categoryAr : project.category}
                      </span>
                      <h3 className="font-display font-display-sm text-subtitle font-bold text-text-primary">
                        {ar ? project.nameAr : project.name}
                      </h3>
                    </div>
                    <Link
                      href={`/case-studies/${project.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-pill border border-border-default px-3 py-1 font-mono text-micro uppercase tracking-wider text-text-primary transition-colors hover:border-accent hover:text-accent"
                    >
                      <span>{ar ? "قراءة دراسة الحالة كاملة" : "Read Full Case Study"}</span>
                      <Icon name="arrow-right" size="0.9em" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-micro uppercase tracking-wider text-text-ghost">
                        {ar ? "التحدي" : "THE CHALLENGE"}
                      </p>
                      <p className="text-body-sm text-text-secondary">
                        {ar ? project.challengeAr : project.challenge}
                      </p>
                    </div>
                    <div className="lg:hidden">{roleBlock}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 border-t border-border-subtle pt-3 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <p className="font-mono text-micro uppercase tracking-wider text-text-ghost">
                        {ar ? "ما صُمِّم وسُلِّم" : "DELIVERABLES SHIPPED"}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {(ar ? project.whatShippedAr : project.whatShipped).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-body-sm text-text-secondary">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <p className="font-mono text-micro uppercase tracking-wider text-text-ghost">
                        {ar ? "الاستخدام الفعلي" : "DEPLOYMENT IN PRODUCTION"}
                      </p>
                      <p className="text-body-sm text-text-secondary">
                        {ar ? project.deploymentAr : project.deployment}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── 04 · Core Competencies ── */}
      <section className="flex flex-col gap-8 border-b border-border-subtle pb-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
            {ar ? "مصفوفة المهارات والقدرات" : "SKILLS & COMPETENCY MATRIX"}
          </p>
          <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
            {ar ? "ما أقدّمه لفريق التصميم لديكم" : "What I Bring to Your Design Team"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.title}
              className="flex flex-col gap-3 rounded-card border border-border-subtle bg-surface-1 p-4"
            >
              <h3 className="font-display font-display-sm text-body font-bold text-text-primary border-b border-border-subtle pb-2">
                {ar ? group.titleAr : group.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {(ar ? group.skillsAr : group.skills).map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-body-sm text-text-secondary">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-text-tertiary" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 · Career Timeline Aligned with CV & LinkedIn ── */}
      <section className="flex flex-col gap-8 border-b border-border-subtle pb-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
            {ar ? "المسار المهني" : "CAREER TIMELINE"}
          </p>
          <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
            {ar ? "سجل عمل موثَّق ومطابق للسيرة الذاتية ولـLinkedIn" : "Verified Work History (CV & LinkedIn Aligned)"}
          </h2>
        </div>

        <div className="flex flex-col border-t border-border-subtle">
          {TIMELINE.map((item) => (
            <div
              key={item.period}
              className="grid grid-cols-1 gap-2 border-b border-border-subtle py-4 sm:grid-cols-[10rem_16rem_1fr] sm:items-baseline"
            >
              <span className="font-mono text-label text-accent">
                {ar ? item.periodAr : item.period}
              </span>
              <div className="flex flex-col">
                <span className="font-display font-display-sm text-body font-bold text-text-primary">
                  {ar ? item.roleAr : item.role}
                </span>
                <span className="font-mono text-micro uppercase tracking-wider text-text-tertiary">
                  {ar ? item.companyAr : item.company}
                </span>
              </div>
              <p className="text-body-sm text-text-secondary">
                {ar ? item.detailAr : item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 06 · Interview Scheduling & Contact ── */}
      <section className="flex flex-col items-center justify-between gap-6 rounded-panel border border-border-strong bg-surface-1 p-5 text-center sm:flex-row sm:text-left rtl:sm:text-right">
        <div className="flex flex-col gap-2 max-w-[50ch]">
          <h2 className="font-display font-display-sm text-subtitle font-bold text-text-primary">
            {ar ? "هل ترغبون في مناقشة وظيفة شاغرة؟" : "Interested in discussing an open role?"}
          </h2>
          <p className="text-body-sm text-text-secondary">
            {ar
              ? "متاح لمقابلة أولية ولمراجعة ملف الأعمال لوظيفة مصمم هوية بصرية أول (في الخليج أو عن بُعد). الرد خلال يومَي عمل."
              : "Available for intro calls and portfolio reviews for Senior Brand Identity Designer positions across the Gulf or remote. Typically replies within two working days."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:m1aboalazm@gmail.com"
            className={buttonVariants({
              className: "px-5 py-2.5 font-mono text-label uppercase tracking-wider",
            })}
          >
            <span>{ar ? "راسل مصطفى" : "Contact Mustafa"}</span>
            <Icon name="arrow-right" />
          </a>
          <a
            href="https://www.linkedin.com/in/aboalazm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-pill border border-border-default px-4 py-2 font-mono text-label uppercase tracking-wider text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            <span>LinkedIn</span>
            <Icon name="arrow-up-right" />
          </a>
        </div>
      </section>
    </main>
  );
}
