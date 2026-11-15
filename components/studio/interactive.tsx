"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SIcon } from "@/components/studio/ui";

/* ── theme ──────────────────────────────────────────────────────────────── */

const THEME_KEY = "abo-studio-theme";

export function applyStudioTheme(theme: "dark" | "light") {
  document.querySelectorAll<HTMLElement>(".studio").forEach((el) => {
    el.dataset.theme = theme;
  });
}

export function readStudioTheme(): "dark" | "light" {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeBoot() {
  useEffect(() => {
    applyStudioTheme(readStudioTheme());
  }, []);
  return null;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    setTheme(readStudioTheme());
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* وضع التصفح الخاص: يظل التبديل يعمل لهذه الجلسة */
    }
    applyStudioTheme(next);
  };
  return (
    <button
      type="button"
      className="studio-btn studio-btn--sm"
      onClick={toggle}
      aria-label={theme === "dark" ? "التبديل إلى المظهر الفاتح" : "التبديل إلى المظهر الداكن"}
      title={theme === "dark" ? "المظهر الفاتح" : "المظهر الداكن"}
    >
      <SIcon name={theme === "dark" ? "sun" : "moon"} size={14} />
    </button>
  );
}

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const signOut = async () => {
    setBusy(true);
    try {
      await fetch("/api/users/logout", { method: "POST", credentials: "include" });
    } finally {
      window.location.href = "/studio/login";
    }
  };
  return (
    <button
      type="button"
      className="studio-btn studio-btn--sm"
      onClick={() => void signOut()}
      disabled={busy}
      title="تسجيل الخروج من لوحة الاستوديو"
    >
      {busy ? "جارٍ الخروج…" : "تسجيل الخروج"}
    </button>
  );
}

/* ── toasts ─────────────────────────────────────────────────────────────── */

export interface ToastMsg {
  id: number;
  tone: "ok" | "danger" | "info";
  text: string;
}

export function useToasts(): { toasts: ToastMsg[]; push: (tone: ToastMsg["tone"], text: string) => void } {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const nextId = useRef(1);
  const push = useCallback((tone: ToastMsg["tone"], text: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current.slice(-3), { id, tone, text }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4200);
  }, []);
  return { toasts, push };
}

export function Toasts({ items }: { items: ToastMsg[] }) {
  if (!items.length) return null;
  return (
    <div className="studio-toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`studio-toast studio-toast--${t.tone}`}>
          <SIcon name={t.tone === "ok" ? "check" : t.tone === "danger" ? "alert" : "info"} size={15} />
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ── drawer ─────────────────────────────────────────────────────────────── */

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="studio-drawer-scrim" onClick={onClose} aria-hidden />
      <aside className="studio-drawer" role="dialog" aria-modal="true" aria-label="لوحة التفاصيل">
        <div className="studio-drawer__head">
          <div style={{ minWidth: 0, flex: 1 }}>{title}</div>
          <button ref={closeRef} type="button" className="studio-btn studio-btn--sm" onClick={onClose} aria-label="إغلاق اللوحة">
            <SIcon name="x" size={14} />
          </button>
        </div>
        <div className="studio-drawer__body">{children}</div>
      </aside>
    </>
  );
}
