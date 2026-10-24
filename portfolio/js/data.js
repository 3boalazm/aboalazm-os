/* ═══════════════════════════════════════════════════════════════════════
   DATA — single source of truth for the whole portfolio.
   ───────────────────────────────────────────────────────────────────────
   Edit anything here → refresh the browser → the pages update.
   Every field is the real content ported from Aboalazm OS
   (features/work/projects.data.ts, case-studies/*.data.ts, lib/offers.ts).
   Images come from window.IMG (assets/img.js — keys listed in the manifest).
   ═══════════════════════════════════════════════════════════════════════ */

window.DATA = {

  /* ── IDENTITY ──────────────────────────────────────────────────────── */
  identity: {
    name: "MUSTAFA ABOALAZM",
    nameAr: "مصطفى أبوالعزم",
    role: "Senior Brand Identity Designer",
    roleAr: "مصمم هوية بصرية أول",
    studio: "Code & Canvas — Co-Founder & Creative Lead",
    email: "m1aboalazm@gmail.com",
    location: "Al Obour, Egypt — 30.1936° N, 31.4603° E",
    locationAr: "العبور، مصر",
    links: [
      { label: "WEBSITE",  value: "aboalazm-os.vercel.app",         href: "https://aboalazm-os.vercel.app" },
      { label: "STUDIO",   value: "codeandcanvas.net",               href: "https://codeandcanvas.net" },
      { label: "BEHANCE",  value: "behance.net/aboalazm",            href: "https://www.behance.net/aboalazm" },
      { label: "LINKEDIN", value: "linkedin.com/in/aboalazm",        href: "https://www.linkedin.com/in/aboalazm" },
    ],
    version: "V.2026 · EDITION 01",
  },

  /* ── HERO / COVER ──────────────────────────────────────────────────── */
  cover: {
    lineA: "MUSTAFA",
    lineB: "ABOALAZM",
    kicker: "PORTFOLIO · بورتفوليو ٢٠٢٦",
    serif: "Senior Brand Identity Designer",
    lede: "Brand identity systems & visual governance — engineered in two languages under one doctrine.",
    ledeAr: "هوية بصرية، أنظمة تصميم، وبنية رقمية — بتتبني بلغتين تحت مبدأ واحد.",
    metrics: [
      { n: "9+",  suf: "YRS", l: "Professional practice", c: "SINCE 2017" },
      { n: "20",  suf: "+",  l: "Clients & organizations", c: "PHARMA · FOOD · EDU · GOV · MORE" },
      { n: "2",   suf: "×",  l: "Languages, one doctrine", c: "AR / EN NATIVE OUTPUT" },
      { n: "13",  suf: "",   l: "Selected projects",  c: "THIS DOCUMENT" },
    ],
  },

  /* ── MANIFESTO ─────────────────────────────────────────────────────── */
  manifesto: {
    quiet: "I don't design brands.",
    loud:  "I BUILD SYSTEMS.",
    quietAr: "لا أصمّم براندات —",
    loudAr:  "أبني أنظمة.",
    lead: "Most designers deliver logos. I help organizations build identity systems that scale across teams, products, campaigns, and digital experiences — work at the intersection of strategy, identity architecture, and operational thinking.",
    chain: ["BRAND", "TOKENS", "COMPONENTS", "PAGES", "EXPERIENCE"],
    chainNote: "EVERY ENGAGEMENT RUNS THE SAME CHAIN",
    doctrine: [
      { t: "Strategy before design",  d: "No logo until positioning, audience, and personality are agreed in writing — without strategy there is no way to judge." },
      { t: "Systems, not artifacts",  d: "A logo is the entry. The real work is the system that follows, so the brand stays itself across every touchpoint." },
      { t: "Show the work",           d: "A logo on a white page is theory; on a business card, a package, a screen — that is the test." },
      { t: "Deliver, don't dump",     d: "Final files come with guidelines, a handover call, and 30 days of support. Done means the team can run with it." },
    ],
  },

  /* ── IDENTITY SYSTEM PAGE ──────────────────────────────────────────── */
  identitySystem: {
    lead: "The operating identity: obsidian canvas, one coral signal, bilingual type voices, and a ledger grid. Everything traces back to a token.",
    colors: [
      { name: "OBSIDIAN",  hex: "#080710", role: "BASE CANVAS" },
      { name: "SURFACE",   hex: "#121120", role: "ELEVATION" },
      { name: "ALABASTER", hex: "#FBF9F6", role: "LIGHT CANVAS" },
      { name: "CORAL",     hex: "#FF6B47", role: "SIGNAL ONLY" },
    ],
    spectrumNote: "PROJECT SPECTRUM — EACH ENGAGEMENT CARRIES ITS OWN ATMOSPHERIC GLOW",
    spectrum: ["#118AB2", "#7850C8", "#D4AF37", "#3DDC84", "#48CCCC"],
    type: [
      { aa: "Aa",  cls: "",          name: "GC EPICPRO — 900",            use: "EN display voice · headlines, covers, numerals" },
      { aa: "أبج", cls: "spec-aa--ar", name: "THMANYAH SERIF DISPLAY",   use: "AR display voice · عناوين عربي" },
      { aa: "Aa",  cls: "",          name: "MONTSERRAT · 400–700",        use: "EN body · leads, UI, tables" },
      { aa: "ص",   cls: "",          name: "IBM PLEX SANS ARABIC",        use: "AR body · متون عربي" },
      { aa: "Aa",  cls: "",          name: "JETBRAINS MONO · 500",        use: "Ledger labels · coordinates · captions" },
    ],
    facts: [
      { k: "BASED",     v: "Al Obour, Egypt — open to remote" },
      { k: "LANGUAGES", v: "Arabic (Native) · English (Professional)" },
      { k: "EDUCATION", v: "B.Sc. — Al-Azhar University · 2017–2024" },
      { k: "TRAINING",  v: "MSP · Youth Scope · AYB · Bedaya · Resalah" },
      { k: "FOUNDER",   v: "Code & Canvas — branding & web studio" },
      { k: "MODE",      v: "Strategy → Identity → System → Web" },
    ],
  },

  /* ── CAPABILITIES ──────────────────────────────────────────────────── */
  capabilities: [
    {
      no: "01", en: "Brand Identity", ar: "هوية بصرية",
      items: ["Brand strategy & positioning", "Logo systems & monograms", "Color / type governance", "Brand guidelines (PDF books)"],
      stack: ["STRATEGY", "NAMING", "GUIDELINES"],
    },
    {
      no: "02", en: "Design Systems", ar: "أنظمة التصميم",
      items: ["Token architecture", "Component libraries & states", "Bilingual AR/EN layouts", "Cross-platform governance"],
      stack: ["TOKENS", "GOVERNANCE", "RTL/LTR"],
    },
    {
      no: "03", en: "Web & Digital", ar: "ويب وديجيتال",
      items: ["Bilingual marketing sites", "Next.js / WordPress builds", "SEO & performance foundations", "CMS handover (Payload)"],
      stack: ["NEXT.JS", "WORDPRESS", "SEO"],
    },
    {
      no: "04", en: "Product Architecture", ar: "هندسة المنتجات",
      items: ["ERP & distribution systems", "PWAs & offline-first apps", "Full-stack: NestJS · Postgres", "Realtime & payments"],
      stack: ["NESTJS", "POSTGRES", "FIREBASE"],
    },
  ],
  wordwall: ["FIGMA", "ILLUSTRATOR", "PHOTOSHOP", "AFTER EFFECTS", "NEXT.JS", "REACT", "NESTJS", "TYPESCRIPT", "POSTGRES", "PRISMA", "KAFKA", "FIREBASE", "TAILWIND", "GSAP", "PAYLOAD CMS", "DRIZZLE", "TURBOREPO", "PWA", "CHART.JS", "WORDPRESS"],

  /* ── NUMBERS ───────────────────────────────────────────────────────── */
  numbers: {
    hero: [
      { pre: "+", n: "40", suf: "%", l: "Online visibility — Nile Pharma", c: "REPORTED BY TEAM · 2020–25" },
      { pre: "4",  n: "+", suf: " YRS", l: "Brand identity focus", c: "PRACTICE · SINCE 2022" },
      { pre: "+", n: "25", suf: "%", l: "Customer engagement — Nile Pharma", c: "REPORTED BY TEAM · 2020–25" },
    ],
    support: [
      { pre: "+", n: "40", suf: "%", l: "Online visibility — Nile Pharma", c: "REBRAND · 2020–25", ar: "ظهور رقمي" },
      { pre: "+", n: "25", suf: "%", l: "Engagement — social systems",     c: "CAMPAIGN GOVERNANCE", ar: "تفاعل" },
      { pre: "",  n: "20", suf: "+", l: "Clients & organizations", c: "2017 → TODAY", ar: "عميل ومؤسسة" },
      { pre: "",  n: "2",  suf: "",  l: "Seasons as Best Head of Media",  c: "YOUTH SCOPE", ar: "موسمان" },
    ],
  },

  /* ── TIMELINE (career ledger) ──────────────────────────────────────── */
  timeline: [
    { yr: "2026 →",  role: "Digital Product & Platform Lead", org: "NILE PHARMA FOOD", note: "Digital presence, ERP, UX and platform direction, coordinating brand and technical delivery." },
    { yr: "2024 →",  role: "Co-Founder & Creative Lead",      org: "CODE & CANVAS",  note: "Branding & web for SMEs across Egypt and the region — the studio runs on its own governed system." },
    { yr: "2020–25", role: "Media Director & Account Manager", org: "NILE PHARMA FOOD", note: "Brand system, Proxeed product line, packaging, campaign governance and a WordPress presence." },
    { yr: "2020–21", role: "Studio Lead & Visual Director",    org: "LEARN IN ARABIC · MSP", note: "Identity + DIY studio built from scratch — infrastructure, not just files." },
    { yr: "2019–21", role: "Head of Media ×2 Seasons",         org: "YOUTH SCOPE",    note: "Full identity rebuilt twice; Best Head of Media, both seasons." },
    { yr: "2022 →",  role: "Brand Identity Designer & Consultant (Freelance)", org: "INDEPENDENT", note: "4+ years focused on brand identity and systems; 20+ clients and organizations across pharma, food, education, government, and related sectors." },
  ],

  /* ── PROJECTS (ordered as presented) ───────────────────────────────── */
  /* kind: "image" hero | "plate" typographic hero (no photography)      */
  projects: [
    {
      slug: "code-canvas-dev", idx: "P.01",
      name: "Code & Canvas — Platform",
      nameAr: "كود آند كانفاس — المنصة",
      category: "DEVELOPMENT", discipline: "Product Architecture",
      year: "2026", img: "ccdev-thumb",
      stack: ["Bilingual EN/AR", "Service Catalog", "Two-Track Studio Platform"],
      outcome: "Two minds, one ecosystem — live platform",
      outcomeAr: "عقلان، نظام واحد — منصة حية",
      brief: "The studio's own digital flagship: a two-track platform where Code and Canvas operate as one governed ecosystem — bilingual by design, catalog-driven, and token-aligned with the studio identity.",
      glow: "#7850C8", live: "codeandcanvas.net",
    },
    {
      slug: "gad-institute", idx: "P.02",
      name: "GAD Heart & Lungs Institute",
      nameAr: "معهد GAD للقلب والرئة",
      category: "BRAND IDENTITY", discipline: "Systemic Identity",
      year: "2025 · V2.0", img: "gad-thumb", hasDetail: true,
      stack: ["Brand Strategy", "Bilingual Identity", "Guidelines"],
      outcome: "Strategy → Identity → Governed system",
      outcomeAr: "استراتيجية → هوية → نظام محكوم",
      brief: "A specialist cardiac & pulmonary institute competing against internationally branded healthcare groups — repositioned as the trusted specialist: warmer than a hospital, more precise than a clinic.",
      kpis: [
        { n: "0",  l: "Brand system before",   c: "STARTED FROM STRATEGY" },
        { n: "2",  l: "Languages, one lockup", c: "AR / EN UNIFIED" },
        { n: "6+", l: "Branded applications",  c: "SIGNAGE · UNIFORM · PRINT · STAND" },
      ],
      gallery: [
        { img: "gad-mockup-logo", cap: "BRAND MARK · HEART + LUNG, FUSED", full: false },
        { img: "gad-cover",       cap: "BRAND IDENTITY · V2.0 COVER", full: false },
        { img: "gad-logo-variations", cap: "VARIATIONS · EN / AR · H / V", full: true },
        { img: "gad-colors",      cap: "PRIMARY PALETTE · DEEP BLUE + CRIMSON", full: false },
        { img: "gad-exhibition",  cap: "EXHIBITION STAND · VISION 2030", full: false },
      ],
      tokens: [
        { t: "deep-blue", v: "#005895", r: "TRUST / PRIMARY" },
        { t: "crimson",   v: "#AB121C", r: "VITALITY / ACCENT" },
        { t: "alexandria",v: "TYPE",    r: "AR TITLES + BODY" },
      ],
      glow: "#005895",
    },
    {
      slug: "ahmed-bedeer", idx: "P.03",
      name: "Ahmed Bedeer",
      nameAr: "أحمد بدير",
      category: "PERSONAL BRAND", discipline: "Systemic Identity",
      year: "2025", img: "bedeer-thumb", hasDetail: true,
      stack: ["Personal Brand", "Monogram", "Brand Guidelines"],
      outcome: "Healthcare IT personal brand — MENA-ready",
      outcomeAr: "براند شخصي · تكنولوجيا معلومات صحية",
      brief: "A personal brand for a healthcare-IT expert built to signal four standards at once — HL7, FHIR, CPHIMS, HIMSS — with an ab quotation-mark monogram engineered for two markets: KSA and wider MENA.",
      kpis: [
        { n: "0",  l: "Brand assets before",  c: "STARTED FROM ZERO" },
        { n: "4",  l: "Standards to signal",  c: "HL7 · FHIR · CPHIMS · HIMSS" },
        { n: "2",  l: "Markets targeted",     c: "KSA + WIDER MENA" },
      ],
      gallery: [
        { img: "bedeer-cover",   cap: "BRAND COVER · ab MONOGRAM", full: false },
        { img: "bedeer-construction", cap: "LOGO CONSTRUCTION · a + b", full: false },
        { img: "bedeer-applications", cap: "ON MEDIA · SURFACE · COLOUR", full: true },
        { img: "bedeer-type",    cap: "TYPEFACE · LUBALIN GRAPH + UNCUT SANS", full: false },
        { img: "bedeer-logo",    cap: "LOGO CONCEPT · QUOTATION FORM", full: false },
      ],
      tokens: [
        { t: "gunmetal",  v: "#1C2B33", r: "ANCHOR / AUTHORITY" },
        { t: "steel-blue",v: "#118AB2", r: "TRUST / TECHNICAL" },
        { t: "teal",      v: "#06D6A0", r: "INNOVATION ACCENT" },
      ],
      glow: "#118AB2",
    },
    {
      slug: "nile-pharma", idx: "P.04",
      name: "Nile Pharma Food",
      nameAr: "نايل فارما فود",
      category: "REBRAND", discipline: "Systemic Identity",
      year: "2020–25", img: "npf-thumb", hasDetail: true,
      stack: ["Brand System", "WordPress", "Rebrand"],
      outcome: "Brand system, packaging & campaign governance",
      outcomeAr: "نظام هوية وتغليف وحوكمة الحملات",
      brief: "Five years as the in-house identity owner: rebrand from zero, a Proxeed product line, campaign governance, packaging and a WordPress presence. The documented work is presented through its system and applications, without unverified performance percentages.",
      kpis: [
        { n: "5", l: "Years as brand owner", c: "2020 → 2025" },
        { n: "4", l: "Delivery tracks", c: "IDENTITY · PACKAGING · CAMPAIGNS · WEB" },
        { n: "1", l: "Governed brand system", c: "STRATEGY THROUGH APPLICATIONS" },
      ],
      gallery: [
        { img: "npf-img-a",     cap: "BRAND VOICE · WE CARE ABOUT YOU", full: false },
        { img: "npf-logo-grid", cap: "LOGO GRID · CONSTRUCTION", full: false },
        { img: "npf-waves",     cap: "LOGO MOTION · WAVES KEYFRAME", full: true },
        { img: "npf-proxeed",   cap: "PRODUCT CAMPAIGN · PROXEED", full: false },
      ],
      tokens: [
        { t: "nile-navy", v: "#1B2A5B", r: "TRUST / PRIMARY" },
        { t: "life-green",v: "#37A66B", r: "HEALTH / GROWTH" },
        { t: "wave-blue", v: "#39A0D6", r: "MOTION / DIGITAL" },
      ],
      glow: "#39A0D6",
    },
    {
      slug: "code-canvas", idx: "P.05",
      name: "Code & Canvas",
      nameAr: "كود آند كانفاس",
      category: "STUDIO IDENTITY", discipline: "Design Infrastructure",
      year: "2024 →", img: "cc-hero", hasDetail: true,
      stack: ["Studio Identity", "Brand System", "Guidelines"],
      outcome: "A studio built on its own system",
      outcomeAr: "استوديو مبني على نظامه الخاص",
      brief: "Two disciplines — code and creative — fused into one squircle mark and one governed system: V1.0 guidelines from day one, a gradient library, and design samples that run the studio itself.",
      kpis: [
        { n: "2",    l: "Disciplines unified",   c: "CODE + CREATIVE" },
        { n: "1",    l: "Mark that says both",   c: "SQUIRCLE GRID SYSTEM" },
        { n: "V1.0", l: "Guidelines at launch",  c: "GOVERNED FROM DAY ONE" },
      ],
      gallery: [
        { img: "cc-cover",     cap: "BRAND GUIDELINES COVER · V1.0", full: false },
        { img: "cc-icon-construction", cap: "ICON CONSTRUCTION · SQUIRCLE GRID", full: false },
        { img: "cc-variants",  cap: "LOGO VARIANTS · DARK / LIGHT / GRADIENT", full: true },
        { img: "cc-gradients", cap: "GRADIENT LIBRARY · 8 VARIANTS", full: false },
        { img: "cc-design-samples", cap: "DESIGN SAMPLES · SOCIAL + WEB", full: false },
      ],
      tokens: [
        { t: "primary-bg", v: "#0B0F1A", r: "DARK BLUE CANVAS" },
        { t: "accent-teal",v: "#48CCCC", r: "SECONDARY / HIGHLIGHTS" },
        { t: "stroke-purple", v: "#7850C8", r: "BORDERS / RULES" },
      ],
      glow: "#7850C8",
    },
    {
      slug: "reflection", idx: "P.06",
      name: "Reflection",
      nameAr: "ريفلكشن",
      category: "ART BRAND", discipline: "Identity Engineering",
      year: "2022 · V1.0", img: "refl-thumb", hasDetail: true,
      stack: ["Identity", "Art & Print", "Guidelines"],
      outcome: "Premium art brand — V1.0 system",
      outcomeAr: "براند فن متميز · نظام V1.0",
      brief: "An art & print brand built from one letter: R as icon, initial, and symbol. Five brand principles — quality, adjust, unique, different, accurate — govern every composition recipe in the book.",
      kpis: [
        { n: "5", l: "Brand principles",  c: "QUALITY · ADJUST · UNIQUE · DIFFERENT · ACCURATE" },
        { n: "2", l: "Type voices",       c: "NEUE MACHINA + QUICKSAND" },
        { n: "R", l: "Built from one letter", c: "ICON = INITIAL = SYMBOL" },
      ],
      gallery: [
        { img: "refl-cover",   cap: "BRAND IDENTITY · V1.0 COVER", full: false },
        { img: "refl-anatomy", cap: "LOGO ANATOMY · ICON + WORDMARK", full: false },
        { img: "refl-colors",  cap: "COLOR · WHITE BASE + SPECTRUM", full: true },
        { img: "refl-preview", cap: "IN USE · STOREFRONT + TAG", full: false },
      ],
      tokens: [
        { t: "white", v: "#FFFFFF", r: "PRIMARY CANVAS" },
        { t: "black", v: "#0A0A0A", r: "TEXT / ACCENT · CMYK 100" },
        { t: "machina", v: "TYPE", r: "DISPLAY VOICE" },
      ],
      glow: "#96468C",
    },
    {
      slug: "esfc", idx: "P.07",
      name: "Egypt SEG Field Camp",
      nameAr: "مخيم SEG مصر الميداني",
      category: "EVENT IDENTITY", discipline: "Identity Engineering",
      year: "2020", kind: "plate",
      plateWords: ["ESFC"],
      plateSub: "EGYPT SEG FIELD CAMP",
      stack: ["Identity", "Print", "Event"],
      outcome: "Record registrations",
      outcomeAr: "تسجيلات قياسية",
      brief: "A geoscience field-camp identity engineered for one job: fill the camp. Print system, merch, and campaign — the program closed with record registrations.",
      glow: "#FFC83C", accentWord: "#FFC83C",
    },
    {
      slug: "learn-in-arabic", idx: "P.08",
      name: "Learn in Arabic",
      nameAr: "تعلّم بالعربي",
      category: "STUDIO & IDENTITY", discipline: "Studio & Identity",
      year: "2020–21", kind: "plate",
      plateWords: ["Learn", "in Arabic"],
      plateSub: "MSP · STUDIO FROM SCRATCH",
      stack: ["Identity", "Studio Build", "Motion"],
      outcome: "Studio from scratch",
      outcomeAr: "استوديو من الصفر",
      brief: "Identity plus a DIY studio built from zero for a learning initiative — brand, space, and motion working as one Arabic-first system.",
      glow: "#60A5FA", accentWord: "#60A5FA",
    },
    {
      slug: "youth-scope", idx: "P.09",
      name: "Youth Scope",
      nameAr: "يوث سكوب",
      category: "ORGANIZATION IDENTITY", discipline: "Systemic Identity",
      year: "2019–21", kind: "plate",
      plateWords: ["Youth", "Scope"],
      plateSub: "TWO SEASONS · TWO IDENTITIES",
      stack: ["Identity", "Campaigns", "Team Lead"],
      outcome: "From scratch, twice — Best Head, both seasons",
      outcomeAr: "من الصفر، مرتين",
      brief: "A youth organization re-identified across two consecutive seasons — full rebuild each time, leading the media team end to end.",
      glow: "#3DDC84", accentWord: "#3DDC84",
    },
    {
      slug: "nile-pharma-erp", idx: "P.10",
      name: "Nile Pharma ERP",
      nameAr: "نايل فارما ERP",
      category: "DEVELOPMENT", discipline: "Product Architecture",
      year: "2025–26", img: "erp-thumb",
      stack: ["NestJS", "Prisma", "Postgres", "Kafka", "Turborepo"],
      outcome: "9-service pharma distribution ERP",
      outcomeAr: "منظومة ERP لتوزيع الأدوية — ٩ خدمات",
      brief: "Sales, inventory, CRM, and incentives unified in a 9-service architecture — the operational spine of a pharma distributor, designed like a brand system: governed services, one truth.",
      glow: "#14B8A6",
    },
    {
      slug: "momo-collective", idx: "P.11",
      name: "Momo Collective",
      nameAr: "مومو كوليكتيف",
      category: "E-COMMERCE", discipline: "Product Architecture",
      year: "2026", kind: "plate",
      plateWords: ["MOMO", "COLLECTIVE"],
      plateSub: "URBAN STREETWEAR · FULL-STACK",
      stack: ["React + Vite", "Drizzle + Postgres", "Payments", "Loyalty"],
      outcome: "Streetwear store — cart, wishlist, loyalty, admin",
      outcomeAr: "متجر ستريت وير متكامل",
      brief: "A full-stack urban streetwear store: cart, wishlist, loyalty program, and an admin analytics dashboard — commerce engineered with brand heat.",
      glow: "#EA580C", accentWord: "#EA580C",
    },
    {
      slug: "zad", idx: "P.12",
      name: "Zad · زاد",
      nameAr: "زاد",
      category: "PWA · ISLAMIC LIFESTYLE", discipline: "Product Architecture",
      year: "2025–26", img: "zad-thumb",
      stack: ["PWA", "Firebase", "Service Worker", "Push"],
      outcome: "Prayers · Quran · Ramadan planner · kids' learning",
      outcomeAr: "رفيق حياة إسلامي — مواقيت، قرآن، مخطط رمضان",
      brief: "An offline-first Islamic lifestyle companion — prayers, Quran, a Ramadan planner, and kids' learning — shipped as an installable PWA with push notifications.",
      glow: "#D4AF37",
    },
    {
      slug: "farm-console", idx: "P.13",
      name: "Farm Console · بيان المزرعة",
      nameAr: "بيان المزرعة",
      category: "PWA · AGRITECH", discipline: "Product Architecture",
      year: "2025–26", img: "farm-thumb",
      stack: ["PWA", "Firebase", "Realtime DB", "Chart.js"],
      outcome: "Livestock management — herd, health, breeding, finance",
      outcomeAr: "نظام إدارة مزرعة — قطيع، صحة، تلقيح، حسابات",
      brief: "A livestock management console tracking herd, health, breeding, and finance in realtime — agritech with an operator-grade interface.",
      glow: "#22C55E",
    },
  ],

  /* ── PROCESS ───────────────────────────────────────────────────────── */
  process: [
    { n: "01", en: "Discovery & Research", ar: "الاكتشاف والبحث",  days: "DAYS 1–6",
      body: "Brand audit, competitor analysis, color-gap mapping, audience persona, cultural research. The foundation no logo can replace." },
    { n: "02", en: "Brand Strategy", ar: "استراتيجية البراند",     days: "DAYS 5–9",
      body: "Purpose, positioning, archetype, voice & tone, value proposition. Approved on paper before a single shape is drawn." },
    { n: "03", en: "Concept & Design", ar: "المفهوم والتصميم",     days: "DAYS 9–27",
      body: "Sketches in dozens, narrowed to 2–3 directions. Logo system, color, typography, brand elements, key applications." },
    { n: "04", en: "Refine & Deliver", ar: "المراجعة والتسليم",    days: "DAYS 27–38",
      body: "Two structured revision rounds, sign-off, final files in every format, guidelines PDF, handover call & 30-day support." },
  ],
  payment: {
    t1: "TIER 1 — 50% AT KICKOFF / 50% BEFORE DELIVERY",
    t23: "TIERS 2–3 — 50% KICKOFF · 25% STRATEGY SIGN-OFF · 25% DELIVERY",
    methods: "Bank transfer (local/international) · PayPal & Wise · local wallets · cash in person",
    methodsAr: "تحويل بنكي · PayPal وWise · محافظ إلكترونية · كاش",
  },

  /* ── OFFERS ────────────────────────────────────────────────────────── */
  tiers: [
    {
      tag: "TIER 01", name: "Logo Design", price: "$199–279", rec: false,
      bestFor: "MVP startups · small businesses", duration: "7–10 DAYS", payment: "50 / 50",
      inc: ["3 concept directions, strategic logic", "1 direction developed to final", "2 revision rounds", "AI · EPS · SVG · PNG · JPG", "Mini usage guide (5 pages)"],
      exc: "No brand strategy · no full color system",
    },
    {
      tag: "TIER 02", name: "Brand Identity Essentials", price: "$697–1,097", rec: true,
      bestFor: "Emerging brands · SMEs", duration: "3–4 WEEKS", payment: "50 / 25 / 25",
      inc: ["Full brand strategy on paper", "Logo system + bilingual lockups", "Color & type governance", "Key applications + templates", "Brand guidelines PDF"],
      exc: null,
    },
    {
      tag: "TIER 03", name: "Complete Identity System", price: "$1,597–2,997", rec: false,
      bestFor: "Established orgs · multi-touchpoint brands", duration: "5–8 WEEKS", payment: "50 / 25 / 25",
      inc: ["Everything in Tier 2", "Extended applications (env. · print · social)", "Design tokens + component states", "Team handover call + training", "30 days post-delivery support"],
      exc: null,
    },
  ],
  alacarte: [
    { g: "PRINT & APPLICATIONS", rows: [
      { s: "Business card", d: "Two-sided · 2 versions", p: "$27" },
      { s: "Brochure", d: "4 pages · A4/A5", p: "$39" },
      { s: "Poster", d: "Digital or print", p: "$29–47" },
      { s: "Roll-Up", d: "80–90 × 200 cm", p: "$37" },
    ]},
    { g: "SOCIAL MEDIA", rows: [
      { s: "Single post", d: "FB · IG · LinkedIn", p: "$14" },
      { s: "Pack of 10", d: "Save $29", p: "$111" },
      { s: "Pack of 20", d: "Save $69", p: "$211" },
    ]},
    { g: "WEB & DEVELOPMENT", rows: [
      { s: "Custom web platform", d: "Next.js · bilingual · tuned", p: "$1,297+" },
      { s: "Bilingual marketing site", d: "Up to 7 pages · CMS-ready", p: "$597+" },
      { s: "WordPress site", d: "Up to 7 pages · 3mo support", p: "$297+" },
      { s: "Landing page", d: "Conversion-focused · fast", p: "$197+" },
    ]},
    { g: "RETAINERS / MONTHLY", rows: [
      { s: "Social media retainer", d: "15–20 designs + templates", p: "$197+" },
      { s: "Brand maintenance", d: "Templates · light edits", p: "$247" },
      { s: "Full marketing design", d: "Social + print + digital + video", p: "$447+" },
    ]},
  ],

  /* ── CLOSING ───────────────────────────────────────────────────────── */
  closing: {
    quiet: "Let's build the system",
    loud: "YOUR BRAND DESERVES.",
    quietAr: "يلا نبني النظام اللي",
    loudAr: "براندك يستاهله.",
    lead: "One call to map it: where the brand stands, what the system needs, and what it takes to ship it.",
    leadAr: "مكالمة واحدة نرسم فيها الخريطة: براندك واقف فين، النظام محتاج إيه، واللي هيتشحن لحد ما يوصل.",
  },
};
