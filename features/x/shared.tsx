"use client";

/**
 * X — shared pieces of the new site language (2026-11-16).
 * Built from zero; nothing here imports the old UI kit.
 */
import * as React from "react";
import { useLang } from "@/components/providers/lang-provider";

export function useX() {
  const { lang } = useLang();
  const ar = lang === "ar";
  /** Pick a string for the current locale. */
  const t = React.useCallback(
    (en: string, arabic: string) => (lang === "ar" ? arabic : en),
    [lang],
  );
  return { lang, ar, t };
}

export function Arrow({ size = 16, diagonal = false }: { size?: number; diagonal?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      {diagonal ? (
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function Chapter({
  n,
  kicker,
  title,
  lead,
  children,
}: {
  n: string;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="x-chapter x-wrap">
      <span aria-hidden className="x-chapter__num">
        {n}
      </span>
      <div className="relative grid gap-4">
        <p className="x-mono x-kicker">
          {n} — {kicker}
        </p>
        <h2 className="x-display x-chapter__title">{title}</h2>
      </div>
      {lead || children ? (
        <div className="relative grid gap-5">
          {lead ? <p className="x-chapter__lead">{lead}</p> : null}
          {children}
        </div>
      ) : null}
    </header>
  );
}
