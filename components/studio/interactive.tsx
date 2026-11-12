"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SIcon } from "@/components/studio/ui";

/* ═══════════════════════════════════════════════════════════════════════════
   STUDIO INTERACTIVE — the client-side primitives the NPF-grade polish
   needs: a slide-over drawer, toasts, and the light/dark theme switch.

   Kept apart from ui.tsx, which stays server-renderable: tiles and chips
   are pure markup, while everything here owns state or touches the DOM.
   ═══════════════════════════════════════════════════════════════════════════ */

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

/** Mounted by the studio layout: applies the stored theme once the
 *  console's root element exists. Dark is the default and the pre-JS
 *  paint, so a light-theme operator may see one dark frame on a hard
 *  load — noted honestly rather than hidden behind a boot script the
 *  layout tests forbid. */
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
      /* private mode: the toggle still works for this page */
    }
    applyStudioTheme(next);
  };
  return (
    <button
      type="button"
      className="studio-btn studio-btn--sm"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
    >
      <SIcon name={theme === "dark" ? "sun" : "moon"} size={12} />
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
          <SIcon name={t.tone === "ok" ? "check" : t.tone === "danger" ? "alert" : "info"} size={13} />
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ── drawer ─────────────────────────────────────────────────────────────── */

/**
 * Slide-over panel. One at a time, Escape closes, focus starts on the
 * close button. The scrim click also closes — a drawer that traps the
 * operator is a modal with better PR.
 */
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
      <aside className="studio-drawer" role="dialog" aria-modal="true" aria-label="Lead detail">
        <div className="studio-drawer__head">
          <div style={{ minWidth: 0, flex: 1 }}>{title}</div>
          <button ref={closeRef} type="button" className="studio-btn studio-btn--sm" onClick={onClose} aria-label="Close panel">
            <SIcon name="x" size={12} />
          </button>
        </div>
        <div className="studio-drawer__body">{children}</div>
      </aside>
    </>
  );
}
