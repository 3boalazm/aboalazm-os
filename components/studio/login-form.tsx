"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SIcon } from "@/components/studio/ui";

/**
 * يرسل طلبًا إلى نقطة دخول Payload الأصلية (`/api/users/login` أو
 * `/api/users/first-register` لأول مستخدم) ثم يعيد التوجيه بانتقال كامل
 * حتى يحمل الطلب التالي ملف تعريف الارتباط `payload-token`.
 */
export function LoginForm({ redirectTo, needsFirstUser = false }: { redirectTo: string; needsFirstUser?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (needsFirstUser) {
      if (!email.trim()) {
        setError("يرجى إدخال البريد الإلكتروني.");
        return;
      }
      if (password.length < 6) {
        setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.");
        return;
      }
      if (password !== confirmPassword) {
        setError("كلمتا المرور غير متطابقتين.");
        return;
      }
    }

    setBusy(true);
    try {
      const endpoint = needsFirstUser ? "/api/users/first-register" : "/api/users/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { errors?: { message?: string }[]; message?: string } | null;
        setError(
          body?.errors?.[0]?.message ??
            body?.message ??
            (needsFirstUser ? "تعذر إنشاء أول حساب مسؤول." : "بيانات الدخول غير مقبولة."),
        );
        setBusy(false);
        return;
      }
      window.location.assign(redirectTo);
    } catch {
      setError("تعذر الوصول إلى الخادم. تحقق من الاتصال وحاول مجددًا.");
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
        <label htmlFor="studio-email">البريد الإلكتروني</label>
        <input
          id="studio-email"
          className="studio-input"
          type="email"
          dir="ltr"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
        />
      </div>

      <div className="studio-field">
        <label htmlFor="studio-password">كلمة المرور</label>
        <input
          id="studio-password"
          className="studio-input"
          type="password"
          dir="ltr"
          autoComplete={needsFirstUser ? "new-password" : "current-password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {needsFirstUser ? (
        <div className="studio-field">
          <label htmlFor="studio-password-confirm">تأكيد كلمة المرور</label>
          <input
            id="studio-password-confirm"
            className="studio-input"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
      ) : null}

      <button
        type="submit"
        className="studio-btn studio-btn--primary"
        disabled={busy}
        style={{ width: "100%", justifyContent: "center", padding: "10px 14px", marginBlockStart: 4 }}
      >
        {busy
          ? needsFirstUser
            ? "جارٍ إنشاء الحساب…"
            : "جارٍ تسجيل الدخول…"
          : needsFirstUser
            ? "إنشاء الحساب والدخول"
            : "تسجيل الدخول"}
        {busy ? null : <SIcon name="arrowLeft" size={14} />}
      </button>

      {!needsFirstUser ? (
        <button
          type="button"
          onClick={() => router.refresh()}
          className="studio-tiny"
          style={{ background: "none", border: 0, padding: 0, marginBlockStart: 11, color: "var(--s-faint)", cursor: "pointer", textDecoration: "underline" }}
        >
          هل سجّلت الدخول في نافذة أخرى؟
        </button>
      ) : null}
    </form>
  );
}
