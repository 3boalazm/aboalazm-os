/**
 * CLIENTS — Single source of truth for client logos.
 *
 * Rules:
 * - Only entries with `permission: true` are rendered.
 * - The client logo strip requires 3 or more permitted entries to render;
 *   with fewer than 3 entries, nothing is rendered.
 * - Never add unapproved or placeholder logos.
 */

export interface ClientLogoEntry {
  name: string;
  nameAr?: string;
  role?: string;
  roleAr?: string;
  company: string;
  companyAr?: string;
  logo: string;
  url?: string;
  permission: boolean;
}

/**
 * Shipped empty by default. Uncomment and populate only after receiving
 * explicit written client permission (`permission: true`).
 *
 * Example:
 * {
 *   name: "Contact Name",
 *   role: "Managing Director",
 *   company: "Brand Name",
 *   companyAr: "اسم البراند",
 *   logo: "/images/clients/brand-name.svg",
 *   url: "https://example.com",
 *   permission: true,
 * }
 */
export const CLIENTS: readonly ClientLogoEntry[] = [];

export function getPermittedClients(
  items: readonly ClientLogoEntry[] = CLIENTS,
): ClientLogoEntry[] {
  return items.filter(
    (entry) =>
      entry.permission === true &&
      Boolean(entry.logo?.trim()) &&
      Boolean(entry.company?.trim() || entry.name?.trim()),
  );
}
