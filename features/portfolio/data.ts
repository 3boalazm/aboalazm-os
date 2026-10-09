/**
 * PORTFOLIO DATA — the landscape presentation edition (/portfolio).
 * A 16:9 slide deck: cover · index · profile · 5 chapters (divider + frames)
 * · contact. Every frame points at /images/work/* (same-origin → the PDF
 * export canvas is never tainted).
 *
 * Chapter order (locked): Code & Canvas → Ahmed Bedeer → Reflection →
 * GAD → Nile Pharma.
 */

export interface Frame {
  /** image path under /images/work */
  img: string;
  /** short caption shown on the frame */
  cap: string;
  /** background-position art direction, e.g. "75% 50%" */
  pos?: string;
  /** show the whole image (letterboxed on `bg`) instead of cropping it —
      for covers / documents whose own text must not be cut at the edges */
  fit?: "contain";
  /** letterbox colour for `fit: "contain"` — match the image's edge colour */
  bg?: string;
}

export interface Project {
  slug: string;
  /** chapter numeral, "01".."05" */
  no: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  year: string;
  scope: string[];
  /** large framed hero on the chapter divider */
  hero: Frame;
  outcome: string;
  outcomeAr: string;
  brief: string;
  /** exactly two large frames on the gallery slide */
  frames: [Frame, Frame];
  /** three color tokens, rendered as swatches */
  tokens: { hex: string; name: string }[];
  /** atmospheric accent (dividers, numerals) — brand-true */
  accent: string;
  /** optional brighter variant of `accent` that survives the dark slide
      surface (used for numerals, index dots, keylines) */
  accentBright?: string;
}

export const IDENTITY = {
  name: "MUSTAFA ABOALAZM",
  nameAr: "مصطفى أبوالعزم",
  role: "Senior Brand Identity Designer",
  roleAr: "مصمم هوية بصرية أول",
  email: "m1aboalazm@gmail.com",
  location: "Al Obour, Egypt",
  version: "V.2026 · EDITION 02",
  links: [
    { label: "WEBSITE", value: "aboalazm-os.vercel.app" },
    { label: "STUDIO", value: "codeandcanvas.net" },
    { label: "BEHANCE", value: "behance.net/aboalazm" },
    { label: "LINKEDIN", value: "linkedin.com/in/aboalazm" },
  ] as const,
} as const;

export const COVER = {
  kicker: "PORTFOLIO — بورتفوليو",
  titleA: "Selected",
  titleB: "Works",
  year: "2026",
  lede: "Brand identity systems, engineered in two languages under one doctrine.",
  ledeAr: "أنظمة هوية بصرية — بتتبني بلغتين تحت مبدأ واحد.",
  meta: ["05 CHAPTERS", "2019 → 2026", "CAIRO · WORKS WORLDWIDE"],
  /** tall photographic frame on the cover */
  photo: "/images/work/nile-pharma/npf-business-card-box.jpg",
  photoCap: "NILE PHARMA — PACKAGING",
} as const;

export const PROFILE = {
  statement: "I don't design brands.",
  statementHot: "I build systems.",
  statementAr: "لا أصمّم براندات — أبني أنظمة.",
  paragraph:
    "Nine years turning identity into infrastructure: strategy first, then a governed system — logo, color, type, applications — that keeps the brand itself across every team, product, and campaign.",
  stats: [
    { n: "9", suf: "YRS", l: "In practice", c: "SINCE 2017" },
    { n: "20", suf: "+", l: "Clients & organizations", c: "SHIPPED & GOVERNED" },
    { n: "05", suf: "", l: "Chapters", c: "IN THIS DECK" },
    { n: "02", suf: "×", l: "Languages", c: "AR / EN · ONE DOCTRINE" },
  ] as const,
  chips: ["BRAND STRATEGY", "LOGO SYSTEMS", "COLOR & TYPE", "GUIDELINES", "BILINGUAL AR/EN", "ART DIRECTION"],
} as const;

export const PROJECTS: Project[] = [
  {
    slug: "code-canvas",
    no: "01",
    name: "Code & Canvas",
    nameAr: "كود آند كانفاس",
    category: "STUDIO IDENTITY",
    categoryAr: "هوية استوديو",
    year: "2024 →",
    scope: ["Studio Identity", "Brand System", "Guidelines V1.0"],
    hero: { img: "/images/work/cc-logo-hero.jpg", cap: "THE MARK · CODE + CANVAS, FUSED" },
    outcome: "A studio running on its own governed system",
    outcomeAr: "استوديو شغال على نظامه الخاص",
    brief:
      "Two disciplines — code and creative — fused into one squircle mark and one system: guidelines from day one, a gradient library, and samples that run the studio itself.",
    frames: [
      { img: "/images/work/cc-cover.jpg", cap: "GUIDELINES V1.0 · COVER", fit: "contain", bg: "#180e30" },
      { img: "/images/work/cc-design-samples.png", cap: "DESIGN SAMPLES · SOCIAL + WEB", fit: "contain", bg: "#ffffff" },
    ],
    tokens: [
      { hex: "#0B0F1A", name: "CANVAS" },
      { hex: "#48CCCC", name: "TEAL" },
      { hex: "#7850C8", name: "VIOLET" },
    ],
    accent: "#7850C8",
    accentBright: "#9B79E0",
  },
  {
    slug: "ahmed-bedeer",
    no: "02",
    name: "Ahmed Bedeer",
    nameAr: "أحمد بدير",
    category: "PERSONAL BRAND",
    categoryAr: "براند شخصي",
    year: "2025",
    scope: ["Personal Brand", "Monogram", "Guidelines"],
    hero: { img: "/images/work/ahmed-bedeer-cover.jpg", cap: "COVER · THE ab MONOGRAM", fit: "contain", bg: "#34343f" },
    outcome: "Healthcare-IT authority — MENA-ready",
    outcomeAr: "براند شخصي · تكنولوجيا معلومات صحية",
    brief:
      "A personal brand for a healthcare-IT leader: an ab quotation-mark monogram engineered to signal HL7 · FHIR · CPHIMS · HIMSS across KSA and wider MENA.",
    frames: [
      { img: "/images/work/ahmed-bedeer-mockup.jpg", cap: "IN SITU · STATIONERY" },
      { img: "/images/work/ahmed-bedeer-construction.png", cap: "CONSTRUCTION · a + b GRID", fit: "contain", bg: "#1c1c28" },
    ],
    tokens: [
      { hex: "#1C2B33", name: "GUNMETAL" },
      { hex: "#118AB2", name: "STEEL BLUE" },
      { hex: "#06D6A0", name: "TEAL" },
    ],
    accent: "#118AB2",
    accentBright: "#3FB0DC",
  },
  {
    slug: "reflection",
    no: "03",
    name: "Reflection",
    nameAr: "ريفلكشن",
    category: "ART BRAND",
    categoryAr: "براند فن",
    year: "2022",
    scope: ["Identity", "Art Direction", "Guidelines V1.0"],
    hero: { img: "/images/work/reflection/refl-cover.png", cap: "BRAND IDENTITY · V1.0 COVER", fit: "contain", bg: "#000000" },
    outcome: "Premium art brand — built from one letter",
    outcomeAr: "براند فن متميز · مبني من حرف واحد",
    brief:
      "An art & print brand built from a single letter: R as icon, initial, and symbol — five principles governing every composition recipe in the book.",
    frames: [
      { img: "/images/work/reflection/refl-preview.jpg", cap: "IN USE · STOREFRONT + TAG" },
      { img: "/images/work/reflection/refl-colors.jpg", cap: "COLOR · WHITE BASE + SPECTRUM" },
    ],
    tokens: [
      { hex: "#FFFFFF", name: "WHITE" },
      { hex: "#0A0A0A", name: "BLACK" },
      { hex: "#96468C", name: "ORCHID" },
    ],
    accent: "#96468C",
    accentBright: "#C478B8",
  },
  {
    slug: "gad",
    no: "04",
    name: "GAD Institute",
    nameAr: "معهد جاد",
    category: "HEALTHCARE IDENTITY",
    categoryAr: "هوية طبية",
    year: "2025",
    scope: ["Brand Strategy", "Bilingual Identity", "Guidelines V2.0"],
    hero: { img: "/images/work/gad/gad-cover.png", cap: "BRAND IDENTITY · V2.0 COVER", fit: "contain", bg: "#ffffff" },
    outcome: "The trusted specialist — strategy to signage",
    outcomeAr: "استراتيجية → هوية → نظام محكوم",
    brief:
      "A heart & lungs institute as the trusted specialist — from strategy to bilingual signage.",
    frames: [
      { img: "/images/work/gad/gad-mockup-logo.jpg", cap: "SIGNAGE · RECEPTION WALL", pos: "76% 50%" },
      { img: "/images/work/gad/gad-logo-variations.png", cap: "LOCKUPS · EN / AR · H / V", fit: "contain", bg: "#ffffff" },
    ],
    tokens: [
      { hex: "#005895", name: "DEEP BLUE" },
      { hex: "#AB121C", name: "CRIMSON" },
      { hex: "#E8EDF2", name: "MIST" },
    ],
    accent: "#005895",
    accentBright: "#4C9BE0",
  },
  {
    slug: "nile-pharma",
    no: "05",
    name: "Nile Pharma Food",
    nameAr: "نايل فارما فود",
    category: "REBRAND · 5 YEARS",
    categoryAr: "إعادة هوية",
    year: "2020–25",
    scope: ["Rebrand", "Packaging", "Campaign System"],
    hero: { img: "/images/work/nile-pharma/npf-business-card-box.jpg", cap: "PACKAGING · THE BLUE BOX" },
    outcome: "Brand system · packaging · campaign governance",
    outcomeAr: "+٤٠٪ ظهور · +٢٥٪ تفاعل",
    brief:
      "Five years of identity ownership across the rebrand, Proxeed product applications, packaging, and campaign governance.",
    frames: [
      { img: "/images/work/nile-pharma/npf-img-a.png", cap: "BRAND VOICE · WE CARE ABOUT YOU", fit: "contain", bg: "#fafafa" },
      { img: "/images/work/nile-pharma/npf-proxeed-post.jpg", cap: "PRODUCT CAMPAIGN · PROXEED", fit: "contain", bg: "#ffffff" },
    ],
    tokens: [
      { hex: "#1B2A5B", name: "NILE NAVY" },
      { hex: "#37A66B", name: "LIFE GREEN" },
      { hex: "#39A0D6", name: "WAVE BLUE" },
    ],
    accent: "#1B2A5B",
    accentBright: "#6C93E8",
  },
];

export const CONTACT = {
  kicker: "START A PROJECT — ابدأ مشروعك",
  titleA: "Let's build",
  titleB: "your system.",
  titleAr: "يلا نبني النظام اللي براندك يستاهله.",
  note: "One call to map it: where the brand stands, what the system needs, and what it takes to ship it.",
} as const;

/* ── slide plan (mirrors the deck build order) ────────────────────────── */
export const SLIDES = (() => {
  const order: { id: string; n: number }[] = [];
  let n = 0;
  const push = (id: string) => order.push({ id, n: ++n });
  push("cover");
  push("index");
  push("profile");
  for (const p of PROJECTS) {
    push(`ch-${p.slug}`);
    push(`frames-${p.slug}`);
  }
  push("contact");
  const byId: Record<string, number> = {};
  for (const s of order) byId[s.id] = s.n;
  return { order, byId, total: n };
})();
