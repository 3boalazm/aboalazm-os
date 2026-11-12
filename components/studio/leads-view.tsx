"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chip, EmptyState, RangeControl, SIcon, STAGES, Tile, ViewHeader, ago, initials, num, shortTime, stageMeta, usd } from "@/components/studio/ui";
import { Drawer, Toasts, useToasts } from "@/components/studio/interactive";
import { moveLeadStage, saveLeadDetails, setLeadRead } from "@/app/studio/leads/actions";
import type { LeadCounts, Overview } from "@/lib/studio/metrics";

/**
 * LEADS & PIPELINE — the working surface for the only funnel stage with a
 * complete audit trail, now with hands (P3).
 *
 * The board still is ordered by *commitment*, left to right (New →
 * Qualified → Proposal → Won), and Lost / Not-a-fit are still not board
 * columns — closed work is not pipeline. What changed: cards move.
 * Dragging a card (or using the drawer's stage select) writes
 * `leadStage` through app/studio/leads/actions.ts with the operator's
 * own Payload session — the same access rules as the admin panel, no
 * console-only write path. A failed save reverts the card and says why;
 * nothing is ever "moved" only on screen.
 *
 * The drawer edits the fields a stage decision actually needs — stage,
 * proposal/won values, closed reason, read flag — and links out to the
 * full Payload document for everything else. One editor of record,
 * two speeds of working.
 */

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
  { key: "new", label: "New", hint: "Not opened yet" },
  { key: "qualified", label: "Qualified", hint: "Real conversation" },
  { key: "proposal-sent", label: "Proposal", hint: "A number was quoted" },
  { key: "won", label: "Won", hint: "Contracted" },
] as const;

const CLOSED_REASONS = [
  { value: "budget", label: "Budget" },
  { value: "timing", label: "Timing" },
  { value: "scope", label: "Scope mismatch" },
  { value: "no-response", label: "No response" },
  { value: "other", label: "Other / unknown" },
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

  /* Server refreshes (after a save) deliver a new array; adopt it. */
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
      // Opening an enquiry means it has been read. Optimistic, and
      // reverted loudly if the database disagrees.
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
    push("ok", `${current.name ?? "Enquiry"} → ${stageMeta(stage).label}`);
    router.refresh();
  };

  return (
    <>
      <ViewHeader
        eyebrow={`Leads & pipeline · ${overview.range.label}`}
        title="Who is waiting on the studio"
        description="Every row is an enquiry that was actually saved to the database. Drag a card to move its stage — the move is saved, or it rolls back and tells you why."
        aside={<RangeControl current={overview.range.key} basePath="/studio/leads" />}
      />

      {/* ── the four numbers that decide the week ─────────────────────── */}
      <div className="studio-bento">
        <Tile
          span="w3"
          title={<b>Open enquiries</b>}
          provenance={<>Rows in <code>messages</code> at stage New / Qualified / Proposal</>}
        >
          <div className="studio-hero studio-hero--xl">
            {num((counts.byStage.new ?? 0) + (counts.byStage.qualified ?? 0) + (counts.byStage["proposal-sent"] ?? 0))}
          </div>
          <p className="studio-sub" style={{ marginBlockStart: 2 }}>
            {counts.unread} unread · {counts.byStage.new ?? 0} untouched
          </p>
        </Tile>

        <Tile
          span="w3"
          title={<b>Quoted & open</b>}
          provenance={
            <>
              Sum of <code>proposalValue</code> where the stage is still open
            </>
          }
        >
          <div className="studio-hero studio-hero--xl">{usd(counts.openProposalValue)}</div>
          <p className="studio-sub" style={{ marginBlockStart: 2 }}>
            across {counts.byStage["proposal-sent"] ?? 0} live proposal{(counts.byStage["proposal-sent"] ?? 0) === 1 ? "" : "s"}
          </p>
        </Tile>

        <Tile
          span="w3"
          title={<b>Contracted</b>}
          provenance={
            <>
              Sum of <code>wonValue</code> on Won only — revenue booked is a different number this dashboard cannot see
            </>
          }
        >
          <div className="studio-hero studio-hero--xl">{usd(counts.contractedValue)}</div>
          <p className="studio-sub" style={{ marginBlockStart: 2 }}>
            {counts.wonCount} won · {counts.lostCount} closed without
          </p>
        </Tile>

        <Tile
          span="w3"
          title={<b>Enquiry → won</b>}
          provenance={<>Won ÷ all saved enquiries, all time. A form submission is not a lead; this ratio shows how many became work.</>}
        >
          <div className="studio-hero studio-hero--xl">{conversion == null ? "—" : `${conversion}%`}</div>
          <p className="studio-sub" style={{ marginBlockStart: 2 }}>
            {closedValue > 0 ? `${usd(closedValue)} quoted and lost` : "no quoted value lost"}
          </p>
        </Tile>
      </div>

      {/* ── the board ─────────────────────────────────────────────────── */}
      <Tile
        span="w12"
        title={<b>Pipeline board</b>}
        aside={<Chip tone="neutral">{leads.length} enquiries total</Chip>}
        provenance={
          <>
            Grouped by <code>leadStage</code> · drag a card or use its drawer to move it · card values are the manually entered{" "}
            <code>proposalValue</code> / <code>wonValue</code>
          </>
        }
      >
        {leads.length === 0 ? (
          <EmptyState
            title="No enquiries yet"
            body="When the contact form saves one, it lands in the New column. Nothing is seeded on this screen."
            action={
              <Link className="studio-btn studio-btn--sm" href="/contact" target="_blank" rel="noopener">
                Open the contact form <SIcon name="arrowUpRight" size={11} />
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
                  aria-label={`${col.label} — ${items.length} leads`}
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
                    <p className="studio-tiny" style={{ marginBlockEnd: 7, color: "var(--s-ok)" }}>
                      {usd(total)} contracted
                    </p>
                  ) : col.key === "proposal-sent" && total > 0 ? (
                    <p className="studio-tiny" style={{ marginBlockEnd: 7, color: "var(--s-warn)" }}>
                      {usd(total)} quoted
                    </p>
                  ) : null}

                  {items.length === 0 ? (
                    <div className="studio-empty">
                      {col.hint}
                      <br />
                      nothing here
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
                        title="Drag to move · click to open"
                      >
                        <span className="studio-card__top">
                          {lead.isRead ? null : <span className="studio-dot" />}
                          <span className="studio-card__name">{lead.name ?? "Unnamed"}</span>
                          <SIcon name="grip" size={12} className="studio-card__grip" />
                        </span>
                        <span className="studio-card__co">{lead.company || lead.email}</span>
                        <span className="studio-card__foot">
                          <span className="studio-ava" style={{ width: 18, height: 18, fontSize: 8 }}>
                            {initials(lead.name ?? "?")}
                          </span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {lead.sourcePage || "direct"}
                          </span>
                          {valueOf(lead) > 0 ? <span className="studio-card__val">{usd(valueOf(lead))}</span> : null}
                        </span>
                        <span className="studio-card__foot" style={{ marginBlockStart: 3 }}>
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

      {/* ── stale + closed ────────────────────────────────────────────── */}
      <div className="studio-bento">
        <Tile
          span="w7"
          title={<b>Untouched for 3+ days</b>}
          aside={stale.length ? <Chip tone="warn" icon="clock">{stale.length}</Chip> : <Chip tone="ok" icon="check">none</Chip>}
          provenance={<>Enquiries still at stage New whose <code>createdAt</code> is older than 3 days</>}
        >
          {stale.length === 0 ? (
            <p className="studio-sub">Nothing has been sitting at New for more than three days.</p>
          ) : (
            <div className="studio-rows">
              {stale.map((lead) => {
                const days = Math.floor((Date.now() - new Date(lead.createdAt ?? Date.now()).getTime()) / 86400000);
                return (
                  <button
                    key={String(lead.id)}
                    type="button"
                    className="studio-row studio-row--btn"
                    style={{ gridTemplateColumns: "26px minmax(0,1fr) auto" }}
                    onClick={() => openLead(lead)}
                  >
                    <span className="studio-ava">{initials(lead.name ?? "?")}</span>
                    <span style={{ minWidth: 0, textAlign: "start" }}>
                      <span className="studio-row__name">{lead.name ?? "Unnamed"}</span>
                      <span className="studio-row__meta">
                        <em>{lead.service ?? "no service"}</em>
                        <span aria-hidden>·</span>
                        <em>{lead.budget ?? "no budget"}</em>
                      </span>
                    </span>
                    <Chip tone="danger">{days}d</Chip>
                  </button>
                );
              })}
            </div>
          )}
        </Tile>

        <Tile
          span="w5"
          title={<b>Closed without work</b>}
          aside={<Chip tone="neutral">{closed.length}</Chip>}
          provenance={<>Rows at stage Lost or Not a fit, with the reason recorded on the document</>}
        >
          {closed.length === 0 ? (
            <p className="studio-sub">No enquiries have been closed out yet.</p>
          ) : (
            <div className="studio-dist">
              {Object.entries(
                closed.reduce<Record<string, number>>((acc, l) => {
                  const key = l.closedReason || "no reason recorded";
                  acc[key] = (acc[key] ?? 0) + 1;
                  return acc;
                }, {}),
              )
                .sort((a, b) => b[1] - a[1])
                .map(([reason, count]) => (
                  <div key={reason} className="studio-dist__row">
                    <span className="studio-dist__label">{reason}</span>
                    <span className="studio-dist__val">{count}</span>
                    <span className="studio-dist__track">
                      <span className="studio-dist__fill" style={{ width: `${(count / closed.length) * 100}%` }} />
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Tile>
      </div>

      {/* ── every enquiry ─────────────────────────────────────────────── */}
      <Tile
        span="w12"
        title={<b>All enquiries</b>}
        aside={<Chip tone="neutral">{leads.length} rows</Chip>}
        provenance={
          <>
            <code>messages</code>, newest first · times are relative to this request · click a row to open its drawer
          </>
        }
      >
        {leads.length === 0 ? (
          <EmptyState title="Nothing saved yet" body="The table fills itself the moment a real enquiry arrives." />
        ) : (
          <div className="studio-scroll-x">
            <table className="studio-table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>Service</th>
                  <th>Budget</th>
                  <th>Stage</th>
                  <th>Source</th>
                  <th>Value</th>
                  <th>Arrived</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const stage = stageMeta(lead.leadStage);
                  return (
                    <tr key={String(lead.id)}>
                      <td>
                        <button type="button" className="studio-table__link" onClick={() => openLead(lead)}>
                          {lead.isRead ? null : <span className="studio-dot" style={{ display: "inline-block", marginInlineEnd: 5, verticalAlign: "middle" }} />}
                          {lead.name ?? "Unnamed"}
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
                      <td style={{ color: "var(--s-muted)", whiteSpace: "nowrap", fontFamily: "var(--font-mono, monospace)", fontSize: 10.5 }}>
                        {lead.sourcePage || "direct"}
                        {lead.utmSource ? ` · ${lead.utmSource}` : ""}
                      </td>
                      <td className="num">{valueOf(lead) > 0 ? usd(valueOf(lead)) : "—"}</td>
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
        Stage and values save to the same <code>messages</code> documents Payload edits — this board is a faster hand on the same
        record, not a second copy. The full document (brief history, every field) is one click away inside the drawer.
      </p>

      {/* ── the drawer ────────────────────────────────────────────────── */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={
          selected ? (
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span className="studio-ava">{initials(selected.name ?? "?")}</span>
              <span style={{ minWidth: 0 }}>
                <strong style={{ display: "block", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {selected.isRead ? null : <span className="studio-dot" style={{ display: "inline-block", marginInlineEnd: 6, verticalAlign: "middle" }} />}
                  {selected.name ?? "Unnamed enquiry"}
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
              push("ok", "Lead saved");
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
    ["Service", lead.service ?? "—"],
    ["Package", lead.packageTier ?? "—"],
    ["Budget", lead.budget ?? "—"],
    ["Timeline", lead.timeline ?? "—"],
    ["Language", lead.locale ?? "—"],
    ["Source page", lead.sourcePage || "direct"],
    ["Campaign", [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "—"],
    ["Arrived", lead.createdAt ? `${shortTime(lead.createdAt)} (${ago(lead.createdAt)})` : "—"],
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
          <p className="studio-up" style={{ margin: "0 0 5px" }}>
            Brief
          </p>
          <p className="studio-brief">{lead.brief}</p>
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <div className="studio-field">
          <label htmlFor="lead-stage">Stage</label>
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
            <label htmlFor="lead-proposal">Proposal value (USD)</label>
            <input
              id="lead-proposal"
              className="studio-input"
              inputMode="decimal"
              placeholder="Only once quoted"
              value={proposalValue}
              onChange={(e) => setProposalValue(e.target.value)}
            />
          </div>
          <div className="studio-field" style={{ marginBlockEnd: 0 }}>
            <label htmlFor="lead-won">Won value (USD)</label>
            <input
              id="lead-won"
              className="studio-input"
              inputMode="decimal"
              placeholder="Only once signed"
              value={wonValue}
              onChange={(e) => setWonValue(e.target.value)}
            />
          </div>
        </div>

        {(stage === "lost" || stage === "not-a-fit") && (
          <div className="studio-field">
            <label htmlFor="lead-reason">Closed reason</label>
            <select id="lead-reason" className="studio-input" value={closedReason} onChange={(e) => setClosedReason(e.target.value)}>
              <option value="">No reason recorded</option>
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
          <span>Read</span>
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" className="studio-btn studio-btn--primary" onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        {lead.email ? (
          <a className="studio-btn" href={`mailto:${lead.email}`}>
            <SIcon name="mail" size={12} /> Reply
          </a>
        ) : null}
        <Link className="studio-btn" href={`/admin/collections/messages/${lead.id}`} target="_blank" rel="noopener">
          Full document <SIcon name="arrowUpRight" size={11} />
        </Link>
      </div>

      <p className="studio-tiny">
        Saves write the same <code>messages</code> row Payload edits, with your own session — if access is ever revoked, these
        buttons stop working at the same moment the admin panel does.
      </p>
    </div>
  );
}
