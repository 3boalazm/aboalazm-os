"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { SIcon, type StudioIconName } from "@/components/studio/ui";
import { SignOutButton, ThemeToggle } from "@/components/studio/interactive";

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
  attention: { title: string; body: string; href: string; cta: string } | null;
  userEmail?: string;
  version: string;
}) {
  const pathname = usePathname() ?? "/studio";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
      label: "المؤشرات",
      items: [
        { key: "overview", href: "/studio", label: "النظرة العامة", icon: "grid" },
        { key: "analytics", href: "/studio/analytics", label: "التحليلات", icon: "chart" },
      ],
    },
    {
      label: "المبيعات والوارد",
      items: [
        {
          key: "leads",
          href: "/studio/leads",
          label: "العملاء المحتملون",
          icon: "inbox",
          count: counts.unreadLeads,
          countLabel: "غير مقروء",
        },
        {
          key: "sessions",
          href: "/studio/sessions",
          label: "تحضير السيشن",
          icon: "check",
        },
      ],
    },
    {
      label: "التحرير والمحتوى",
      items: [
        { key: "content", href: "/studio/content", label: "المحتوى والسيو", icon: "layers", count: counts.drafts, countLabel: "مسودة" },
        { key: "manage", href: "/studio/manage", label: "إدارة المحتوى", icon: "sliders" },
        { key: "projects", href: "/studio/manage/projects", label: "المشاريع", icon: "grid" },
        { key: "case-studies", href: "/studio/manage/case-studies", label: "دراسات الحالة", icon: "column" },
        { key: "posts", href: "/studio/manage/posts", label: "المقالات", icon: "sparkle" },
        { key: "media", href: "/studio/manage/media", label: "الوسائط", icon: "image" },
      ],
    },
    {
      label: "الموقع والنظام",
      items: [
        { key: "offers", href: "/studio/manage/globals/offers", label: "العروض والأسعار", icon: "bolt" },
        { key: "settings", href: "/studio/manage/globals/settings", label: "إعدادات الموقع", icon: "sliders" },
        { key: "system", href: "/studio/system", label: "النظام", icon: "pulse" },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/studio" || href === "/studio/manage") return pathname === href || pathname === `${href}/`;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="studio">
      <div className="studio-atmos" aria-hidden />

      <div className="studio-shell">
        {/* ── القائمة الجانبية ──────────────────────────────────────────── */}
        <aside className="studio-panel studio-nav" id="studio-nav" data-open={open} aria-label="التنقل في لوحة الاستوديو">
          <div className="studio-brand">
            <span className="studio-brand__mark" aria-hidden>
              A
            </span>
            <span className="studio-brand__text">
              <strong>Aboalazm OS</strong>
              <span>لوحة الاستوديو</span>
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

          {attention ? (
            <div className="studio-alert">
              <p className="studio-alert__eye">
                <SIcon name="alert" size={12} /> يحتاج انتباهك
              </p>
              <strong>{attention.title}</strong>
              <p>{attention.body}</p>
              <Link href={attention.href}>
                {attention.cta} <SIcon name="arrowLeft" size={13} />
              </Link>
            </div>
          ) : (
            <div className="studio-alert" style={{ background: "var(--s-ok-dim)", borderColor: "rgb(52 211 153 / 0.28)" }}>
              <p className="studio-alert__eye" style={{ color: "var(--s-ok)" }}>
                <SIcon name="check" size={12} /> الوضع مستقر
              </p>
              <strong>لا شيء بانتظارك.</strong>
              <p>لا توجد استفسارات غير مقروءة ولا عملاء بلا متابعة.</p>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingInline: 6 }}>
            <Link href="/" className="studio-nav__item" style={{ padding: 0, fontSize: 13 }}>
              <SIcon name="external" className="studio-nav__ico" size={14} />
              <span>معاينة الموقع</span>
            </Link>
            <span style={{ flex: 1 }} />
            <span className="studio-up studio-mono" style={{ fontSize: 11 }} title={userEmail}>
              {version}
            </span>
          </div>
        </aside>

        <div className="studio-scrim" data-open={open} onClick={() => setOpen(false)} aria-hidden />

        {/* ── المحتوى الرئيسي ──────────────────────────────────────────── */}
        <div className="studio-main">
          <div className="studio-panel studio-top">
            <button
              type="button"
              className="studio-btn studio-btn--sm studio-menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="studio-nav"
              aria-label="فتح أو إغلاق القائمة"
            >
              <SIcon name="menu" />
            </button>
            <Breadcrumb pathname={pathname} />
            <span className="studio-spacer" />
            <span className="studio-chip studio-chip--live" title="تُقرأ البيانات مباشرة من PostgreSQL في كل طلب">
              بيانات حية
            </span>
            <ThemeToggle />
            <Link href="/studio/manage" className="studio-btn studio-btn--sm" title="جميع مجموعات وإعدادات نظام المحتوى">
              المحتوى الكامل
            </Link>
            <SignOutButton />
          </div>

          <main className="studio-view">{children}</main>
        </div>
      </div>
    </div>
  );
}

const CRUMB: Record<string, string> = {
  studio: "الاستوديو",
  analytics: "التحليلات",
  leads: "العملاء المحتملون",
  content: "المحتوى والسيو",
  manage: "إدارة المحتوى",
  globals: "الإعدادات العامة",
  projects: "المشاريع",
  "case-studies": "دراسات الحالة",
  posts: "المقالات",
  media: "الوسائط",
  testimonials: "آراء العملاء",
  "team-members": "أعضاء الفريق",
  messages: "الاستفسارات",
  "resource-leads": "مهتمو الموارد",
  "analytics-events": "أحداث التحليلات",
  users: "المستخدمون",
  offers: "العروض والأسعار",
  settings: "إعدادات الموقع",
  new: "إنشاء جديد",
  system: "النظام",
};

function Breadcrumb({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean);
  const isRoot = parts.length <= 1;
  return (
    <nav className="studio-crumbs" aria-label="مسار التنقل">
      <span>لوحة التحكم</span>
      {isRoot ? (
        <>
          <SIcon name="chevronLeft" size={12} />
          <b>النظرة العامة</b>
        </>
      ) : (
        parts.map((part, idx) => {
          const isLast = idx === parts.length - 1;
          const label = CRUMB[part] ?? part;
          return (
            <span key={`${part}-${idx}`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <SIcon name="chevronLeft" size={12} />
              {isLast ? <b>{label}</b> : <span>{label}</span>}
            </span>
          );
        })
      )}
    </nav>
  );
}
