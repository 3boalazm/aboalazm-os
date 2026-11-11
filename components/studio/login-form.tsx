"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SIcon } from "@/components/studio/ui";

/**
 * POSTs to Payload's own login endpoint, then does a full navigation.
 *
 * Full navigation (not router.push) on purpose: the session cookie is set by
 * the response, and a client-side route change can re-render a server
 * component that was already evaluated without it. `location.assign` makes
 * the next request carry the new cookie.
 */
export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { errors?: { message?: string }[]; message?: string } | null;
        setError(body?.errors?.[0]?.message ?? body?.message ?? "Those credentials were not accepted.");
        setBusy(false);
        return;
      }
      window.location.assign(redirectTo);
    } catch {
      setError("Could not reach the server. Check the connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error ? (
        <div className="studio-login__err" role="alert">
          {error}
        </div>
      ) : null}

      <div className="studio-field">
        <label htmlFor="studio-email">Email</label>
        <input
          id="studio-email"
          className="studio-input"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
        />
      </div>

      <div className="studio-field">
        <label htmlFor="studio-password">Password</label>
        <input
          id="studio-password"
          className="studio-input"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <button type="submit" className="studio-btn studio-btn--primary" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: "9px 12px", marginBlockStart: 4 }}>
        {busy ? "Signing in…" : "Sign in"}
        {busy ? null : <SIcon name="arrowRight" size={13} />}
      </button>

      <button
        type="button"
        onClick={() => router.refresh()}
        className="studio-tiny"
        style={{ background: "none", border: 0, padding: 0, marginBlockStart: 10, color: "var(--s-faint)", cursor: "pointer", textDecoration: "underline" }}
      >
        Already signed in in another tab?
      </button>
    </form>
  );
}
