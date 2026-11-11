import { redirect } from "next/navigation";
import { getStudioUser } from "@/lib/studio/auth";
import { LoginForm } from "@/components/studio/login-form";
import { SIcon } from "@/components/studio/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in · Studio console", robots: { index: false, follow: false } };

/**
 * /studio/login
 *
 * This screen exists only to explain itself. It posts to
 * `/api/users/login` — the exact endpoint Payload's own admin login posts to —
 * so the session cookie it receives is the same `payload-token` the admin
 * panel and every Local API call in this app already trust. There is no
 * second user store.
 */
export default async function StudioLoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const params = await searchParams;
  const user = await getStudioUser();
  const target = safeTarget(params.redirect);
  if (user) redirect(target);

  return (
    <div className="studio" style={{ display: "grid", placeItems: "center", minHeight: "100dvh" }}>
      <div className="studio-atmos" aria-hidden />
      <div className="studio-login__card" style={{ position: "relative", zIndex: 1 }}>
        <div className="studio-brand" style={{ padding: 0, marginBlockEnd: 18 }}>
          <span className="studio-brand__mark" aria-hidden>
            A
          </span>
          <span className="studio-brand__text">
            <strong>Aboalazm OS</strong>
            <span>Studio console</span>
          </span>
        </div>

        <h1>Sign in</h1>
        <p>
          Same account as the CMS. The console reads live studio data, so it uses the Payload session rather than a separate
          password.
        </p>

        <LoginForm redirectTo={target} />

        <p className="studio-tiny" style={{ marginBlockStart: 16, display: "flex", gap: 6, alignItems: "flex-start" }}>
          <SIcon name="eye" size={11} />
          <span>
            Sessions last 2 hours by default. Signing out of <code>/admin</code> signs you out here too — it is one session.
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * Only same-origin console paths are accepted as a post-login destination.
 * An open redirect on a login screen is a phishing primitive, so anything
 * that is not an absolute path starting with /studio falls back to /studio.
 */
function safeTarget(raw?: string): string {
  if (!raw) return "/studio";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/studio";
  if (!raw.startsWith("/studio")) return "/studio";
  return raw;
}
