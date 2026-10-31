/**
 * TESTIMONIALS — Single source of truth for client quotes.
 *
 * Rules:
 * - Only entries with `permission: true` are rendered.
 * - If no permitted entries exist, the Testimonials section is not rendered at all.
 * - Never add fabricated or unverified quotes.
 */

export interface TestimonialEntry {
  name: string;
  nameAr?: string;
  role: string;
  roleAr?: string;
  company: string;
  companyAr?: string;
  quote_en: string;
  quote_ar: string;
  permission: boolean;
}

/**
 * Shipped empty by default. Uncomment and populate only after receiving
 * explicit written client permission (`permission: true`).
 *
 * Example:
 * {
 *   name: "Client Name",
 *   nameAr: "اسم العميل",
 *   role: "Founder",
 *   roleAr: "المؤسس",
 *   company: "Company Name",
 *   companyAr: "اسم الشركة",
 *   quote_en: "Exact approved client quote in English.",
 *   quote_ar: "النص المعتمد لشهادة العميل باللغة العربية.",
 *   permission: true,
 * }
 */
export const TESTIMONIALS: readonly TestimonialEntry[] = [];

export function getPermittedTestimonials(
  items: readonly TestimonialEntry[] = TESTIMONIALS,
): TestimonialEntry[] {
  return items.filter(
    (entry) =>
      entry.permission === true &&
      Boolean(entry.name?.trim()) &&
      Boolean(entry.quote_en?.trim() || entry.quote_ar?.trim()),
  );
}
