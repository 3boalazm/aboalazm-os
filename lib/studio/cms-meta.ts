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
  group: "Content" | "Inbox" | "System";
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
    label: "Projects",
    singular: "Project",
    group: "Content",
    description: "Work ledger entries — EN/AR copy, thumbnails, glow accents, and destination links.",
    drafts: true,
    allowsCreate: true,
    defaultSort: "-updatedAt",
    searchFields: ["name", "nameAr", "slug"],
  },
  {
    slug: "case-studies",
    label: "Case studies",
    singular: "Case study",
    group: "Content",
    description: "Four-panel case files: Context, Research & Positioning, Execution & Tokens, Retro.",
    drafts: true,
    allowsCreate: true,
    defaultSort: "-updatedAt",
    searchFields: ["name", "nameAr", "slug"],
  },
  {
    slug: "posts",
    label: "Writing",
    singular: "Post",
    group: "Content",
    description: "Essays and system notes with structured Lexical blocks (tables, Mermaid, stats).",
    drafts: true,
    allowsCreate: true,
    defaultSort: "-publishedAt",
    searchFields: ["title", "slug", "index"],
  },
  {
    slug: "media",
    label: "Media",
    singular: "Asset",
    group: "Content",
    description: "Uploaded images and PDFs backed by Vercel Blob with bilingual alt text.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "-createdAt",
    searchFields: ["alt", "altAr", "filename"],
  },
  {
    slug: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    group: "Content",
    description: "Client quotes tied to source records.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "-createdAt",
    searchFields: ["author", "company", "quote"],
  },
  {
    slug: "team-members",
    label: "Team members",
    singular: "Team member",
    group: "Content",
    description: "Studio team profiles ordered by ascending display order.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "order",
    searchFields: ["name", "nameAr", "role"],
  },
  {
    slug: "messages",
    label: "Enquiries (raw)",
    singular: "Enquiry",
    group: "Inbox",
    description: "Full /contact submissions with attribution, deal stage, and values.",
    drafts: false,
    allowsCreate: false,
    defaultSort: "-createdAt",
    searchFields: ["name", "email", "company"],
  },
  {
    slug: "resource-leads",
    label: "Resource leads",
    singular: "Resource lead",
    group: "Inbox",
    description: "Emails captured at the /resources download gate.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "-createdAt",
    searchFields: ["email", "resource", "source"],
  },
  {
    slug: "analytics-events",
    label: "Analytics events",
    singular: "Analytics event",
    group: "System",
    description: "First-party browser telemetry collected by /api/track.",
    drafts: false,
    allowsCreate: false,
    defaultSort: "-createdAt",
    searchFields: ["name", "path", "referrerHost"],
  },
  {
    slug: "users",
    label: "Users",
    singular: "User",
    group: "System",
    description: "Operator logins sharing the single Payload authentication table.",
    drafts: false,
    allowsCreate: true,
    defaultSort: "-createdAt",
    searchFields: ["email"],
  },
] as const;

export const STUDIO_GLOBALS: readonly GlobalMeta[] = [
  {
    slug: "offers",
    label: "Offers & pricing",
    description: "Service tiers, investment-value metrics, and à la carte pricing tables.",
  },
  {
    slug: "settings",
    label: "Site settings",
    description: "Contact details, social links, CV PDF, and fallback SEO metadata.",
  },
] as const;

export function getCollectionMeta(slug: string): CollectionMeta | null {
  return STUDIO_COLLECTIONS.find((c) => c.slug === slug) ?? null;
}

export function getGlobalMeta(slug: string): GlobalMeta | null {
  return STUDIO_GLOBALS.find((g) => g.slug === slug) ?? null;
}
