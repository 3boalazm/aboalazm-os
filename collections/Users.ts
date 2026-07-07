import type { CollectionConfig } from "payload";

/**
 * USERS — single-admin auth collection. Mustafa only.
 *
 * PHASE 5 (Auth Hardening) — closed for good:
 *   - No public self-registration. `create` requires an already-authenticated
 *     user. Payload's own admin panel has a one-time exception built in:
 *     if this collection has zero documents, it shows a "create first admin
 *     account" screen that bypasses access control entirely — that's how
 *     Mustafa's own account gets created. After that, this rule applies
 *     and nobody else can sign themselves up, ever, via any route.
 *   - Only a logged-in user can read/update/delete user records (blocks
 *     anonymous enumeration of accounts via the API).
 *
 * Login screen, session cookies, and redirecting unauthenticated visitors
 * away from /admin are all handled by Payload core already — nothing to
 * add here for that part.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [],
};

