import type { Access } from "payload";

/**
 * PUBLISHED-OR-AUTHENTICATED — the correct pattern for any collection with
 * `versions: { drafts: true }`. A bare `read: () => true` does NOT filter
 * by `_status`, so draft documents would leak straight to the public site
 * the moment they're saved. Logged-in users (the dashboard) see everything,
 * including drafts; anonymous visitors (the live site) only ever see
 * documents whose current status is "published".
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true;
  return {
    _status: {
      equals: "published",
    },
  };
};
