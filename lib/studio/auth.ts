import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "@/lib/payload";

/**
 * STUDIO AUTH — a console session, not a second login system.
 *
 * The console is inside the same Payload app, so it authenticates the way
 * every Payload route does: `payload.auth({ headers })` reads the `payload-token`
 * cookie and returns the same user object the admin panel uses. That means:
 *
 *   · one user table, one password, one session cookie — no parallel auth to
 *     secure, rotate, or drift;
 *   · if an admin session is revoked, the console is revoked in the same
 *     request;
 *   · no console-only credentials can exist by accident.
 *
 * Why not `redirect("/admin/login")`? That would work, but it drops the
 * operator on a screen with no explanation, and after signing in they land on
 * Payload's dashboard rather than the console. `/studio/login` renders the
 * same fields and POSTs to the same `/api/users/login` endpoint, then follows
 * `?redirect=` back into the console.
 *
 * ⚠️ Every page under /studio MUST call `requireStudioUser()` before reading
 * data. This file deliberately does NOT add middleware: the Next middleware in
 * this repo already owns locale rewriting, and a second auth check there would
 * run for marketing routes that must stay public. Per-page enforcement (plus
 * `overrideAccess: false` on every query) is the actual boundary.
 */

export interface StudioUser {
  id: string | number;
  email?: string;
}

export async function getStudioUser(): Promise<StudioUser | null> {
  const payload = await getPayload();
  const headers = new Headers(await nextHeaders());
  const { user } = await payload.auth({ headers });
  if (!user) return null;
  return { id: user.id, email: (user as { email?: string }).email };
}

/**
 * Reads the session and redirects to the console login when absent.
 * The current path is handed to the login screen so the operator returns to
 * the exact screen they asked for.
 */
export async function requireStudioUser(currentPath = "/studio"): Promise<StudioUser> {
  const user = await getStudioUser();
  if (!user) {
    redirect(`/studio/login?redirect=${encodeURIComponent(currentPath)}`);
  }
  return user;
}
