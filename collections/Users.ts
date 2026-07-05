import type { CollectionConfig } from "payload";

/**
 * USERS — single-admin auth collection.
 * Phase 3 (Auth Hardening) will lock signup down further (no public
 * registration endpoint, Mustafa's account seeded directly).
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [],
};
