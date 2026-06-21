/**
 * lib/i18n.ts — Centralized UI string dictionary.
 * All hardcoded English UI text lives here so one toggle flips the whole site.
 * Usage: const t = useT(); then {t.caseFile}
 */

export const UI = {
  en: {
    /* ── Case Study ── */
    caseFile:       "CASE FILE",
    contextAudit:   "CONTEXT & AUDIT",
    researchLogic:  "RESEARCH & LOGIC",
    executionGov:   "EXECUTION & GOVERNANCE",
    performancePM:  "PERFORMANCE & POST MORTEM",
    discipline:     "DISCIPLINE",
    teamScale:      "TEAM SCALE",
    timeline:       "TIMELINE",
    record:         "RECORD",
    problem:        "THE PROBLEM",
    competitorMap:  "COMPETITOR LANDSCAPE",
    directionVectors: "DIRECTION VECTORS",
    structuralTokens: "STRUCTURAL TOKENS",
    componentStates:  "COMPONENT STATES",
    responsiveLayout: "RESPONSIVE LAYOUT",
    dragLine:         "DRAG THE LINE — AUDIT STATE ⇄ GOVERNED SYSTEM",
    deliverables:     "DELIVERABLES — SYSTEM IN PRODUCTION",
    retroLedger:      "RETRO LEDGER",
    galleryRendered:  "GALLERY / THE SYSTEM, RENDERED",
    /* ── Writing ── */
    writingSection:   "06 / WRITING",
    writingTitle:     "Notes from the system.",
    writingLead:      "Working documents on identity, tokens, and the craft of bilingual design — written from projects, not about them.",
    writingFooter:    "PUBLISHED IRREGULARLY · WRITTEN CAREFULLY",
    /* ── Capabilities ── */
    capabilitiesSection: "CAPABILITIES // SYSTEMS",
    capabilitiesTitle:   "Hold the tokens. Watch the system hold.",
    capabilitiesLead:    "Change one value — spacing, radius, motion, theme — and every element recalculates in concert. That coherence is the product.",
    /* ── Sidebar nav ── */
    caseStudySections: "Case study sections",
    /* ── Panel headings ── */
    contextH2:   "The brief, the team, and the stakes.",
    researchH2:  "The logic behind the creative decisions.",
    executionH2: "The system, governed: tokens, states, and the grid they live on.",
  },
  ar: {
    /* ── Case Study ── */
    caseFile:       "ملف المشروع",
    contextAudit:   "السياق والتدقيق",
    researchLogic:  "البحث والمنطق",
    executionGov:   "التنفيذ والحوكمة",
    performancePM:  "الأداء وما بعد المشروع",
    discipline:     "التخصص",
    teamScale:      "حجم الفريق",
    timeline:       "الجدول الزمني",
    record:         "السجل",
    problem:        "المشكلة",
    competitorMap:  "خريطة المنافسين",
    directionVectors: "متجهات الاتجاه البصري",
    structuralTokens: "التوكنز الهيكلية",
    componentStates:  "حالات الكومبوننت",
    responsiveLayout: "التخطيط المتجاوب",
    dragLine:         "اسحب الخط — حالة التدقيق ⇄ النظام المحكوم",
    deliverables:     "المخرجات — النظام في الإنتاج",
    retroLedger:      "سجل المراجعة",
    galleryRendered:  "المعرض / النظام، مُرَنْدَر",
    /* ── Writing ── */
    writingSection:   "٠٦ / مقالات",
    writingTitle:     "ملاحظات من النظام.",
    writingLead:      "وثائق عمل عن الهوية والتوكنز وحرفة التصميم ثنائي اللغة — مكتوبة من المشاريع، لا عنها.",
    writingFooter:    "تُنشر بشكل غير منتظم · تُكتب بعناية",
    /* ── Capabilities ── */
    capabilitiesSection: "القدرات // الأنظمة",
    capabilitiesTitle:   "أمسك التوكنز. شوف النظام يتماسك.",
    capabilitiesLead:    "غيّر قيمة واحدة — المسافات، الحواف، الحركة، الثيم — وكل عنصر يعيد الحساب في تناغم. هذا التناسق هو المنتج.",
    /* ── Sidebar nav ── */
    caseStudySections: "أقسام دراسة الحالة",
    /* ── Panel headings ── */
    contextH2:   "الموجز والفريق والمخاطر.",
    researchH2:  "المنطق وراء القرارات الإبداعية.",
    executionH2: "النظام محكومًا: توكنز وحالات والشبكة التي يعيشون عليها.",
  },
} as const;

export type Lang = "en" | "ar";
export type TDict = typeof UI.en;
