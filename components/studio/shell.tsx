"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { SIcon, type StudioIconName } from "@/components/studio/ui";
import { ThemeToggle } from "@/components/studio/interactive";

/* ═══════════════════════════════════════════════════════════════════════════
   STUDIO SHELL — the persistent frame around every console screen.

   Navigation is grouped by the *question being asked*, not by Payload
   collection. "Leads" is a question ("who is waiting on me?"); "Messages" is
   a database table. The old flat list of nine collections is why the panel
   felt like a filing cabinet: it described storage, not work.

   Counts come from the server and are only rendered when > 0 — a badge that
   says "0" trains the eye to ignore badges.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface NavCounts {
  unreadLeads: number;
  newLeads: number;
  drafts: number;
}

type Item = {
  key: string;
  href: string;
  label: string;
  icon: StudioIconName;
  count?: number;
  countLabel?: string;
};

export function StudioShell({
  children,
  counts,
  attention,
  userEmail,
  version,
}: {
  children: ReactNode;
  counts: NavCounts;
  /** The single most urgent thing, or null when nothing is burning. */
  attention: { title: string; body: string; href: string; cta: string } | null;
  userEmail?: string;
  version: string;
}) {
  const pathname = usePathname() ?? "/studio";
  const [open, setOpen] = useState(false);

  /* Close the drawer whenever the route changes — otherwise a tap on a nav
     item on mobile leaves the scrim covering the page it just navigated to. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Escape closes the drawer, matching every other overlay on the site. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const groups: { label: string; items: Item[] }[] = [
    {
      label: "Answer",
      items: [
        { key: "overview", href: "/studio", label: "Overview", icon: "grid" },
        { key: "analytics", href: "/studio/analytics", label: "Analytics", icon: "chart" },
      ],
    },
    {
      label: "Revenue",
      items: [
        {
          key: "leads",
          href: "/studio/leads",
          label: "Leads & pipeline",
          icon: "inbox",
          count: counts.unreadLeads,
          countLabel: "unread",
        },
      ],
    },
    {
      label: "Editing",
      items: [
        { key: "content", href: "/studio/content", label: "Content", icon: "layers", count: counts.drafts, countLabel: "drafts" },
        { key: "manage", href: "/studio/manage", label: "Manage", icon: "sliders" },
      ],
    },
    {
      label: "Operations",
      items: [{ key: "system", href: "/studio/system", label: "System", icon: "pulse" }],
    },
  ];

  /* The raw editors live one level deeper now, on /studio/manage — with
     real counts and create links. The sidebar stays a set of questions;
     the filing cabinet sits behind exactly one of them. */

  const isActive = (href: string) => {
    if (href === "/studio") return pathname === "/studio" || pathname === "/studio/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="studio">
      <div className="studio-atmos" aria-hidden />

      <div className="studio-shell">
        {/* ── sidebar ─────────────────────────────────────────────────── */}
        <aside className="studio-panel studio-nav" id="studio-nav" data-open={open} aria-label="Studio navigation">
          <div className="studio-brand">
            <span className="studio-brand__mark" aria-hidden>
              A
            </span>
            <span className="studio-brand__text">
              <strong>Aboalazm OS</strong>
              <span>Studio console</span>
            </span>
          </div>

          <div className="studio-nav__scroll">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="studio-nav__label">{group.label}</p>
                {group.items.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="studio-nav__item"
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <SIcon name={item.icon} className="studio-nav__ico" />
                    <span>{item.label}</span>
                    {item.count ? (
                      <span className="studio-nav__count" title={`${item.count} ${item.countLabel ?? ""}`}>
                        {item.count}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            ))}

          </div>

          {/* The attention card is the console's whole point: one thing to do. */}
          {attention ? (
            <div className="studio-alert">
              <p className="studio-alert__eye">
                <SIcon name="alert" size={10} /> Needs you
              </p>
              <strong>{attention.title}</strong>
              <p>{attention.body}</p>
              <Link href={attention.href}>
                {attention.cta} <SIcon name="arrowRight" size={11} />
              </Link>
            </div>
          ) : (
            <div className="studio-alert" style={{ background: "var(--s-ok-dim)", borderColor: "rgb(52 211 153 / 0.28)" }}>
              <p className="studio-alert__eye" style={{ color: "var(--s-ok)" }}>
                <SIcon name="check" size={10} /> Clear
              </p>
              <strong>Nothing is waiting on you.</strong>
              <p>No unread enquiries and no unanswered leads.</p>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingInline: 6 }}>
            <Link href="/" className="studio-nav__item" style={{ padding: 0, fontSize: 11 }}>
              <SIcon name="external" className="studio-nav__ico" size={12} />
              <span>View site</span>
            </Link>
            <span style={{ flex: 1 }} />
            <span className="studio-up" style={{ fontSize: 8.5 }} title={userEmail}>
              {version}
            </span>
          </div>
        </aside>

        <div className="studio-scrim" data-open={open} onClick={() => setOpen(false)} aria-hidden />

        {/* ── main ────────────────────────────────────────────────────── */}
        <div className="studio-main">
          <div className="studio-panel studio-top">
            <button
              type="button"
              className="studio-btn studio-btn--sm studio-menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="studio-nav"
              aria-label="Toggle navigation"
            >
              <SIcon name="menu" />
            </button>
            <Breadcrumb pathname={pathname} />
            <span className="studio-spacer" />
            <span className="studio-chip studio-chip--live" title="Data is read live from Payload/Postgres on every request">
              live data
            </span>
            <ThemeToggle />
            <Link href="/admin" className="studio-btn studio-btn--sm" title="The raw Payload admin">
              Payload
              <SIcon name="arrowUpRight" size={11} />
            </Link>
          </div>

          <main className="studio-view">{children}</main>
        </div>
      </div>
    </div>
  );
}

const CRUMB: Record<string, string> = {
  studio: "Studio",
  analytics: "Analytics",
  leads: "Leads & pipeline",
  content: "Content",
  manage: "Manage",
  system: "System",
};

function Breadcrumb({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean);
  const leaf = parts[parts.length - 1] ?? "studio";
  const isRoot = parts.length <= 1;
  return (
    <nav className="studio-crumbs" aria-label="Breadcrumb">
      <span>Console</span>
      <SIcon name="arrowRight" size={10} />
      {isRoot ? (
        <b>Overview</b>
      ) : (
        <>
          <span>{CRUMB[parts[0] ?? ""] ?? "Studio"}</span>
          <SIcon name="arrowRight" size={10} />
          <b>{CRUMB[leaf] ?? leaf}</b>
        </>
      )}
    </nav>
  );
}
