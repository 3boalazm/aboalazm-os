/**
 * Pure client-safe registry of every Payload collection and global
 * exposed inside `/studio/manage`. Zero server-only imports so client
 * editors and navigation components can read metadata cleanly.
 */

export type StudioCollectionSlug =
  | "projects"
  | "case-studies"
  | "posts"
  | "media"
  | "testimonials"
  | "team-members"
  | "messages"
  | "resource-leads"
  | "analytics-events"
  | "users";

export type StudioGlobalSlug = "offers" | "settings";

export interface CollectionMeta {
  slug: StudioCollectionSlug;
  label: string;
  singular: string;
  group: "المحتوى" | "الوارد" | "النظام";
  description: string;
  drafts: boolean;
  allowsCreate: boolean;
  defaultSort: string;
  searchFields: string[];
}

export interface GlobalMeta {
  slug: StudioGlobalSlug;
  label: string;
  description: string;
}

export const STUDIO_COLLECTIONS: readonly CollectionMeta[] = [
  {
    slug: "projects",
    label: "المشاريع",
    singular: "مشروع",
    group: "المحتوى",
    description: "سجل الأعمال — النصوص الإنجليزية والعربية، الصور المصغرة، ألوان التوهج، والروابط.",
    drafts: true,
    allowsCreate: true,
    defaultSort: "-updatedAt",
    searchFields: ["name", "nameAr", "slug"],
  },
  {
    slug: "case-studies",
    label: "دراسات الحالة",
    singular: "دراسة حالة",
    group: "المحتوى",
    description: "ملفات المشاريع ذات الأربع لوحات: السياق، البحث والتموضع، التنفيذ والمتغيرات، والمراجعة.",
    drafts: true,
    allowsCreate: true,
    defaultSort: "-updatedAt",
    searchFields: ["name", "nameAr", "slug"],
  },
  {
    slug: "posts",
    label: "المقالات",
    singular: "مقال",
    group: "المحتوى",
    description: "مقالات وملاحظات النظام مع محرر كتل Lexical (جداول، مخططات Mermaid، إحصائيات).",
    drafts: true,
    allowsCreate: true,
    defaultSort: "-publishedAt",
    searchFields: ["title", "slug", "index"],
  },
  {
    slug: "media",
    label: "الوسائط",
    singular: "ملف",
    group: "المحتوى",
    description: "الصور وملفات PDF المرفوعة على Vercel Blob مع نصوص بديلة ثنائية اللغة.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "-createdAt",
    searchFields: ["alt", "altAr", "filename"],
  },
  {
    slug: "testimonials",
    label: "آراء العملاء",
    singular: "رأي عميل",
    group: "المحتوى",
    description: "اقتباسات العملاء المرتبطة بأرقام السجلات المصدرية.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "-createdAt",
    searchFields: ["author", "company", "quote"],
  },
  {
    slug: "team-members",
    label: "أعضاء الفريق",
    singular: "عضو فريق",
    group: "المحتوى",
    description: "ملفات فريق الاستوديو مرتبة تصاعديًا حسب حقل الترتيب.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "order",
    searchFields: ["name", "nameAr", "role"],
  },
  {
    slug: "messages",
    label: "الاستفسارات (خام)",
    singular: "استفسار",
    group: "الوارد",
    description: "كامل رسائل صفحة التواصل مع بيانات الإحالة، مرحلة الصفقة، والقيم المالية.",
    drafts: false,
    allowsCreate: false,
    defaultSort: "-createdAt",
    searchFields: ["name", "email", "company"],
  },
  {
    slug: "resource-leads",
    label: "مهتمو الموارد",
    singular: "مهتم بمورد",
    group: "الوارد",
    description: "عناوين البريد المسجلة عند بوابة تحميل الموارد في /resources.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "-createdAt",
    searchFields: ["email", "resource", "source"],
  },
  {
    slug: "analytics-events",
    label: "أحداث التحليلات",
    singular: "حدث تحليلات",
    group: "النظام",
    description: "قياسات المتصفح من الطرف الأول التي يجمعها المسار /api/track.",
    drafts: false,
    allowsCreate: false,
    defaultSort: "-createdAt",
    searchFields: ["name", "path", "referrerHost"],
  },
  {
    slug: "users",
    label: "المستخدمون",
    singular: "مستخدم",
    group: "النظام",
    description: "حسابات المشغلين المشاركة في جدول مصادقة Payload الموحّد.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "-createdAt",
    searchFields: ["email"],
  },
] as const;

export const STUDIO_GLOBALS: readonly GlobalMeta[] = [
  {
    slug: "offers",
    label: "العروض والأسعار",
    description: "الباقات الخدمية، مؤشرات قيمة الاستثمار، وجداول الخدمات المنفصلة.",
  },
  {
    slug: "settings",
    label: "إعدادات الموقع",
    description: "بيانات التواصل، الروابط الاجتماعية، ملف السيرة الذاتية PDF، وبيانات SEO الافتراضية.",
  },
] as const;

export function getCollectionMeta(slug: string): CollectionMeta | null {
  return STUDIO_COLLECTIONS.find((c) => c.slug === slug) ?? null;
}

export function getGlobalMeta(slug: string): GlobalMeta | null {
  return STUDIO_GLOBALS.find((g) => g.slug === slug) ?? null;
}
