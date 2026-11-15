"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chip, EmptyState, RangeControl, SIcon, STAGES, Tile, ViewHeader, ago, initials, num, shortTime, stageMeta, usd } from "@/components/studio/ui";
import { Drawer, Toasts, useToasts } from "@/components/studio/interactive";
import { moveLeadStage, saveLeadDetails, setLeadRead } from "@/app/studio/leads/actions";
import type { LeadCounts, Overview } from "@/lib/studio/metrics";

type Lead = {
  id: string | number;
  name?: string;
  company?: string | null;
  email?: string;
  brief?: string | null;
  service?: string | null;
  packageTier?: string | null;
  timeline?: string | null;
  locale?: string | null;
  leadStage?: string | null;
  budget?: string | null;
  sourcePage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  proposalValue?: number | null;
  wonValue?: number | null;
  closedReason?: string | null;
  isRead?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
};

const COLUMNS = [
  { key: "new", label: "جديد", hint: "لم يُفتح بعد" },
  { key: "qualified", label: "مؤهل", hint: "بدأ النقاش الفعلي" },
  { key: "proposal-sent", label: "عرض سعر", hint: "أُرسلت تسعيرة محددة" },
  { key: "won", label: "فائز", hint: "تم التعاقد" },
] as const;

const CLOSED_REASONS = [
  { value: "budget", label: "الميزانية" },
  { value: "timing", label: "التوقيت" },
  { value: "scope", label: "عدم توافق النطاق" },
  { value: "no-response", label: "عدم الاستجابة" },
  { value: "other", label: "أخرى / غير معروف" },
] as const;

export function LeadsView({
  leads: initialLeads,
  counts,
  overview,
}: {
  leads: Lead[];
  counts: LeadCounts;
  overview: Overview;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const { toasts, push } = useToasts();
  const router = useRouter();

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const valueOf = (l: Lead) => (l.leadStage === "won" ? (l.wonValue ?? 0) : (l.proposalValue ?? 0));
  const closed = leads.filter((l) => l.leadStage === "lost" || l.leadStage === "not-a-fit");
  const closedValue = closed.reduce((sum, l) => sum + (l.proposalValue ?? 0), 0);
  const conversion = counts.total ? Math.round((counts.wonCount / counts.total) * 100) : null;
  const stale = leads
    .filter((l) => (l.leadStage ?? "new") === "new" && l.createdAt && Date.now() - new Date(l.createdAt).getTime() > 3 * 86400000)
    .sort((a, b) => ((a.createdAt ?? "") < (b.createdAt ?? "") ? -1 : 1));

  const selected = leads.find((l) => String(l.id) === String(selectedId)) ?? null;

  const openLead = (lead: Lead) => {
    setSelectedId(lead.id);
    if (!lead.isRead) {
      setLeads((ls) => ls.map((l) => (String(l.id) === String(lead.id) ? { ...l, isRead: true } : l)));
      void setLeadRead(lead.id, true).then((res) => {
        if (!res.ok) {
          setLeads((ls) => ls.map((l) => (String(l.id) === String(lead.id) ? { ...l, isRead: false } : l)));
          push("danger", res.error);
        }
      });
    }
  };

  const move = async (id: string | number, stage: string) => {
    const current = leads.find((l) => String(l.id) === String(id));
    if (!current || (current.leadStage ?? "new") === stage) return;
    const before = leads;
    setLeads((ls) => ls.map((l) => (String(l.id) === String(id) ? { ...l, leadStage: stage } : l)));
    const res = await moveLeadStage(id, stage);
    if (!res.ok) {
      setLeads(before);
      push("danger", res.error);
      return;
    }
    push("ok", `${current.name ?? "الاستفسار"} ← ${stageMeta(stage).label}`);
    router.refresh();
  };

  return (
    <>
      <ViewHeader
        eyebrow={`العملاء المحتملون ومسار البيع · ${overview.range.label}`}
        title="من ينتظر الاستوديو الآن"
        description="كل صف هنا استفسار محفوظ فعليًا في قاعدة البيانات. اسحب أي بطاقة لنقلها إلى مرحلة أخرى — يتم الحفظ مباشرًة في Payload أو يتراجع ويوضح السبب."
        aside={<RangeControl current={overview.range.key} basePath="/studio/leads" />}
      />

      {/* ── الأرقام الأربعة الحاسمة ───────────────────────────────────────── */}
      <div className="studio-bento">
        <Tile
          span="w3"
          title={<b>استفسارات مفتوحة</b>}
          provenance={
            <>
              صفوف <code>messages</code> في مراحل: جديد / مؤهل / عرض سعر
            </>
          }
        >
          <div className="studio-hero studio-hero--xl studio-mono">
            {num((counts.byStage.new ?? 0) + (counts.byStage.qualified ?? 0) + (counts.byStage["proposal-sent"] ?? 0))}
          </div>
          <p className="studio-sub" style={{ marginBlockStart: 4 }}>
            {counts.unread} غير مقروء · {counts.byStage.new ?? 0} لم يُفتح بعد
          </p>
        </Tile>

        <Tile
          span="w3"
          title={<b>عروض مفتوحة</b>}
          provenance={
            <>
              مجموع <code>proposalValue</code> في المراحل التي لا تزال مفتوحة
            </>
          }
        >
          <div className="studio-hero studio-hero--xl studio-mono">{usd(counts.openProposalValue)}</div>
          <p className="studio-sub" style={{ marginBlockStart: 4 }}>
            عبر {counts.byStage["proposal-sent"] ?? 0} عرض سعر قيد الانتظار
          </p>
        </Tile>

        <Tile
          span="w3"
          title={<b>القيمة المتعاقد عليها</b>}
          provenance={
            <>
              مجموع <code>wonValue</code> للصفقات الفائزة فقط — تعبّر عن العقود الموقّعة وليست إيرادات محققة
            </>
          }
        >
          <div className="studio-hero studio-hero--xl studio-mono">{usd(counts.contractedValue)}</div>
          <p className="studio-sub" style={{ marginBlockStart: 4 }}>
            {counts.wonCount} فائز · {counts.lostCount} مغلق دون تعاقد
          </p>
        </Tile>

        <Tile
          span="w3"
          title={<b>معدل التحويل للفوز</b>}
          provenance={
            <>
              الفائز ÷ إجمالي الاستفسارات المحفوظة (كل الفترات)
            </>
          }
        >
          <div className="studio-hero studio-hero--xl studio-mono">{conversion == null ? "—" : `${conversion}%`}</div>
          <p className="studio-sub" style={{ marginBlockStart: 4 }}>
            {closedValue > 0 ? `${usd(closedValue)} قيمة عروض لم تُغلق بالفوز` : "لم تُفقد أي عروض مسعّرة"}
          </p>
        </Tile>
      </div>

      {/* ── لوحة المراحل (Kanban) ───────────────────────────────────────── */}
      <Tile
        span="w12"
        title={<b>لوحة مراحل المبيعات</b>}
        aside={<Chip tone="neutral">{leads.length} استفسار إجمالًا</Chip>}
        provenance={
          <>
            مجمّعة حسب <code>leadStage</code> · اسحب البطاقة أو افتحها لتعديل المرحلة والقيمة <code>proposalValue</code> /{" "}
            <code>wonValue</code>
          </>
        }
      >
        {leads.length === 0 ? (
          <EmptyState
            title="لا توجد استفسارات بعد"
            body="عند إرسال أي زائر نموذج التواصل سيصل إلى عمود «جديد». لا توجد بيانات تجريبية على هذه الشاشة."
            action={
              <Link className="studio-btn studio-btn--sm" href="/contact" target="_blank" rel="noopener">
                فتح نموذج التواصل <SIcon name="arrowUpRight" size={13} />
              </Link>
            }
          />
        ) : (
          <div className="studio-board">
            {COLUMNS.map((col) => {
              const items = leads.filter((l) => (l.leadStage ?? "new") === col.key);
              const total = items.reduce((s, l) => s + valueOf(l), 0);
              return (
                <section
                  key={col.key}
                  className={`studio-col ${overCol === col.key ? "studio-col--over" : ""}`}
                  aria-label={`${col.label} — ${items.length} عميل محتمل`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverCol(col.key);
                  }}
                  onDragLeave={() => setOverCol((c) => (c === col.key ? null : c))}
                  onDrop={(e) => {
                    e.preventDefault();
                    setOverCol(null);
                    const id = e.dataTransfer.getData("text/plain") || dragId;
                    if (id) void move(id, col.key);
                  }}
                >
                  <div className="studio-col__head">
                    <span>{col.label}</span>
                    <b>{items.length}</b>
                  </div>
                  {col.key === "won" && total > 0 ? (
                    <p className="studio-tiny studio-mono" style={{ marginBlockEnd: 8, color: "var(--s-ok)" }}>
                      {usd(total)} متعاقد عليه
                    </p>
                  ) : col.key === "proposal-sent" && total > 0 ? (
                    <p className="studio-tiny studio-mono" style={{ marginBlockEnd: 8, color: "var(--s-warn)" }}>
                      {usd(total)} عروض مفتوحة
                    </p>
                  ) : null}

                  {items.length === 0 ? (
                    <div className="studio-empty">
                      {col.hint}
                      <br />
                      لا شيء هنا
                    </div>
                  ) : (
                    items.map((lead) => (
                      <div
                        key={String(lead.id)}
                        className={`studio-card studio-card--drag ${dragId === String(lead.id) ? "studio-card--dragging" : ""}`}
                        draggable
                        role="button"
                        tabIndex={0}
                        onDragStart={(e) => {
                          setDragId(String(lead.id));
                          e.dataTransfer.setData("text/plain", String(lead.id));
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => {
                          setDragId(null);
                          setOverCol(null);
                        }}
                        onClick={() => openLead(lead)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openLead(lead);
                          }
                        }}
                        title="اسحب لنقل المرحلة · اضغط لفتح التفاصيل"
                      >
                        <span className="studio-card__top">
                          {lead.isRead ? null : <span className="studio-dot" />}
                          <span className="studio-card__name">{lead.name ?? "بدون اسم"}</span>
                          <SIcon name="grip" size={14} className="studio-card__grip" />
                        </span>
                        <span className="studio-card__co">{lead.company || lead.email}</span>
                        <span className="studio-card__foot">
                          <span className="studio-ava" style={{ width: 20, height: 20, fontSize: 10 }}>
                            {initials(lead.name ?? "؟")}
                          </span>
                          <span className="studio-mono" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {lead.sourcePage || "مباشر"}
                          </span>
                          {valueOf(lead) > 0 ? <span className="studio-card__val studio-mono">{usd(valueOf(lead))}</span> : null}
                        </span>
                        <span className="studio-card__foot" style={{ marginBlockStart: 4 }}>
                          <span>{ago(lead.createdAt)}</span>
                          {lead.budget ? <span style={{ marginInlineStart: "auto" }}>{lead.budget}</span> : null}
                        </span>
                      </div>
                    ))
                  )}
                </section>
              );
            })}
          </div>
        )}
      </Tile>

      {/* ── متأخرة + مغلقة ──────────────────────────────────────────────── */}
      <div className="studio-bento">
        <Tile
          span="w7"
          title={<b>لم تُمس منذ +3 أيام</b>}
          aside={
            stale.length ? (
              <Chip tone="warn" icon="clock">
                {stale.length}
              </Chip>
            ) : (
              <Chip tone="ok" icon="check">
                لا يوجد
              </Chip>
            )
          }
          provenance={
            <>
              استفسارات ما زالت في مرحلة «جديد» وتجاوز <code>createdAt</code> الخاص بها 3 أيام
            </>
          }
        >
          {stale.length === 0 ? (
            <p className="studio-sub">لا توجد استفسارات متروكة في مرحلة «جديد» لأكثر من ثلاثة أيام.</p>
          ) : (
            <div className="studio-rows">
              {stale.map((lead) => {
                const days = Math.floor((Date.now() - new Date(lead.createdAt ?? Date.now()).getTime()) / 86400000);
                return (
                  <button
                    key={String(lead.id)}
                    type="button"
                    className="studio-row studio-row--btn"
                    style={{ gridTemplateColumns: "30px minmax(0,1fr) auto" }}
                    onClick={() => openLead(lead)}
                  >
                    <span className="studio-ava">{initials(lead.name ?? "؟")}</span>
                    <span style={{ minWidth: 0, textAlign: "start" }}>
                      <span className="studio-row__name">{lead.name ?? "بدون اسم"}</span>
                      <span className="studio-row__meta">
                        <em>{lead.service ?? "بدون خدمة محددة"}</em>
                        <span aria-hidden>·</span>
                        <em>{lead.budget ?? "بدون ميزانية"}</em>
                      </span>
                    </span>
                    <Chip tone="danger">منذ {days} ي</Chip>
                  </button>
                );
              })}
            </div>
          )}
        </Tile>

        <Tile
          span="w5"
          title={<b>أُغلقت دون تعاقد</b>}
          aside={<Chip tone="neutral">{closed.length}</Chip>}
          provenance={<>الصفوف في مرحلة «خاسر» أو «غير مناسب» حسب السبب المسجّل</>}
        >
          {closed.length === 0 ? (
            <p className="studio-sub">لم يُغلق أي استفسار بدون تعاقد حتى الآن.</p>
          ) : (
            <div className="studio-dist">
              {Object.entries(
                closed.reduce<Record<string, number>>((acc, l) => {
                  const key =
                    CLOSED_REASONS.find((r) => r.value === l.closedReason)?.label ??
                    l.closedReason ??
                    "دون سبب مسجّل";
                  acc[key] = (acc[key] ?? 0) + 1;
                  return acc;
                }, {}),
              )
                .sort((a, b) => b[1] - a[1])
                .map(([reason, count]) => (
                  <div key={reason} className="studio-dist__row">
                    <span className="studio-dist__label">{reason}</span>
                    <span className="studio-dist__val studio-mono">{count}</span>
                    <span className="studio-dist__track">
                      <span className="studio-dist__fill" style={{ width: `${(count / closed.length) * 100}%` }} />
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Tile>
      </div>

      {/* ── كل الاستفسارات ─────────────────────────────────────────────── */}
      <Tile
        span="w12"
        title={<b>جميع الاستفسارات</b>}
        aside={<Chip tone="neutral">{leads.length} سجل</Chip>}
        provenance={
          <>
            مجموعة <code>messages</code>، الأحدث أولًا · اضغط على أي اسم لفتح لوحة التعديل السريع
          </>
        }
      >
        {leads.length === 0 ? (
          <EmptyState title="لا توجد سجلات محفوظة بعد" body="يمتلئ الجدول تلقائيًا فور وصول أول استفسار حقيقي." />
        ) : (
          <div className="studio-scroll-x">
            <table className="studio-table">
              <thead>
                <tr>
                  <th>العميل</th>
                  <th>الخدمة</th>
                  <th>الميزانية</th>
                  <th>المرحلة</th>
                  <th>المصدر</th>
                  <th style={{ textAlign: "end" }}>القيمة</th>
                  <th style={{ textAlign: "end" }}>الوصول</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const stage = stageMeta(lead.leadStage);
                  return (
                    <tr key={String(lead.id)}>
                      <td>
                        <button type="button" className="studio-table__link" onClick={() => openLead(lead)}>
                          {lead.isRead ? null : <span className="studio-dot" style={{ display: "inline-block", marginInlineEnd: 6, verticalAlign: "middle" }} />}
                          {lead.name ?? "بدون اسم"}
                        </button>
                        <span className="studio-tiny" style={{ display: "block" }}>
                          {lead.company || lead.email}
                        </span>
                      </td>
                      <td style={{ color: "var(--s-muted)", whiteSpace: "nowrap" }}>{lead.service ?? "—"}</td>
                      <td style={{ color: "var(--s-muted)", whiteSpace: "nowrap" }}>{lead.budget ?? "—"}</td>
                      <td>
                        <Chip tone={stage.tone}>{stage.short}</Chip>
                      </td>
                      <td className="studio-mono" style={{ color: "var(--s-muted)", whiteSpace: "nowrap", fontSize: 12 }}>
                        {lead.sourcePage || "direct"}
                        {lead.utmSource ? ` · ${lead.utmSource}` : ""}
                      </td>
                      <td className="num studio-mono">{valueOf(lead) > 0 ? usd(valueOf(lead)) : "—"}</td>
                      <td className="num" style={{ color: "var(--s-muted)" }}>
                        {ago(lead.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Tile>

      <p className="studio-tiny" style={{ paddingInline: 4 }}>
        تحفظ هذه اللوحة المرحلة والقيم المالية مباشرة في مستندات <code>messages</code> نفسها داخل قاعدة البيانات. ويمكنك فتح
        المستند الكامل بضغطة واحدة من داخل الدرج الجانبي.
      </p>

      {/* ── الدرج الجانبي ──────────────────────────────────────────────── */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={
          selected ? (
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span className="studio-ava">{initials(selected.name ?? "؟")}</span>
              <span style={{ minWidth: 0 }}>
                <strong style={{ display: "block", fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {selected.isRead ? null : <span className="studio-dot" style={{ display: "inline-block", marginInlineEnd: 6, verticalAlign: "middle" }} />}
                  {selected.name ?? "استفسار بدون اسم"}
                </strong>
                <span className="studio-tiny" style={{ display: "block" }}>
                  {selected.company || selected.email || ""}
                </span>
              </span>
              <span style={{ marginInlineStart: "auto" }}>
                <Chip tone={stageMeta(selected.leadStage).tone}>{stageMeta(selected.leadStage).label}</Chip>
              </span>
            </span>
          ) : null
        }
      >
        {selected ? (
          <LeadDrawer
            key={String(selected.id)}
            lead={selected}
            onSaved={() => {
              push("ok", "تم حفظ بيانات العميل");
              router.refresh();
            }}
            onError={(msg) => push("danger", msg)}
          />
        ) : null}
      </Drawer>

      <Toasts items={toasts} />
    </>
  );
}

function LeadDrawer({
  lead,
  onSaved,
  onError,
}: {
  lead: Lead;
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const [stage, setStage] = useState(lead.leadStage ?? "new");
  const [proposalValue, setProposalValue] = useState(lead.proposalValue != null ? String(lead.proposalValue) : "");
  const [wonValue, setWonValue] = useState(lead.wonValue != null ? String(lead.wonValue) : "");
  const [closedReason, setClosedReason] = useState(lead.closedReason ?? "");
  const [isRead, setIsRead] = useState(Boolean(lead.isRead));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await saveLeadDetails(lead.id, { stage, proposalValue, wonValue, closedReason, isRead });
    setSaving(false);
    if (!res.ok) {
      onError(res.error);
      return;
    }
    onSaved();
  };

  const meta: [string, string][] = [
    ["الخدمة", lead.service ?? "—"],
    ["الباقة", lead.packageTier ?? "—"],
    ["الميزانية", lead.budget ?? "—"],
    ["الجدول الزمني", lead.timeline ?? "—"],
    ["اللغة", lead.locale ?? "—"],
    ["صفحة المصدر", lead.sourcePage || "مباشر"],
    ["الحملة الإعلانية", [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "—"],
    ["تاريخ الوصول", lead.createdAt ? `${shortTime(lead.createdAt)} (${ago(lead.createdAt)})` : "—"],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <dl className="studio-kv">
        {meta.map(([k, v]) => (
          <div key={k} className="studio-kv__row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      {lead.brief ? (
        <div>
          <p className="studio-up" style={{ margin: "0 0 6px" }}>
            ملخص المشروع
          </p>
          <p className="studio-brief">{lead.brief}</p>
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="studio-field">
          <label htmlFor="lead-stage">المرحلة</label>
          <select id="lead-stage" className="studio-input" value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="lead-proposal">قيمة العرض (USD)</label>
            <input
              id="lead-proposal"
              className="studio-input"
              dir="ltr"
              inputMode="decimal"
              placeholder="عند التسعير فقط"
              value={proposalValue}
              onChange={(e) => setProposalValue(e.target.value)}
            />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="lead-won">قيمة العقد الفائز (USD)</label>
            <input
              id="lead-won"
              className="studio-input"
              dir="ltr"
              inputMode="decimal"
              placeholder="عند التوقيع فقط"
              value={wonValue}
              onChange={(e) => setWonValue(e.target.value)}
            />
          </div>
        </div>

        {(stage === "lost" || stage === "not-a-fit") && (
          <div className="studio-field">
            <label htmlFor="lead-reason">سبب الإغلاق</label>
            <select id="lead-reason" className="studio-input" value={closedReason} onChange={(e) => setClosedReason(e.target.value)}>
              <option value="">دون سبب مسجّل</option>
              {CLOSED_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <label className="studio-check">
          <input type="checkbox" checked={isRead} onChange={(e) => setIsRead(e.target.checked)} />
          <span>مقروء</span>
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" className="studio-btn studio-btn--primary" onClick={() => void save()} disabled={saving}>
          {saving ? "جارٍ الحفظ…" : "حفظ التعديلات"}
        </button>
        {lead.email ? (
          <a className="studio-btn" href={`mailto:${lead.email}`}>
            <SIcon name="mail" size={14} /> رد بالبريد
          </a>
        ) : null}
        <Link className="studio-btn" href={`/studio/manage/messages/${lead.id}`}>
          المستند الكامل <SIcon name="arrowLeft" size={13} />
        </Link>
      </div>

      <p className="studio-tiny">
        تكتب هذه التعديلات مباشرة في نفس صف <code>messages</code> داخل Payload بجلسة دخولك الحالية.
      </p>
    </div>
  );
}
