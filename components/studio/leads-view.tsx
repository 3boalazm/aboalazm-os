import Link from "next/link";
import { Chip, Delta, EmptyState, Provenance, RangeControl, SIcon, Tile, ViewHeader, ago, initials, num, stageMeta, usd } from "@/components/studio/ui";
import type { LeadCounts, Overview } from "@/lib/studio/metrics";

/**
 * LEADS & PIPELINE — the working surface for the only funnel stage with a
 * complete audit trail.
 *
 * Design decision worth stating: the board is ordered by *commitment*, left to
 * right (New → Qualified → Proposal → Won), and each column header states its
 * own value. Cards link to the Payload document, because the place to edit a
 * lead is the place that already knows how to edit it. Dragging cards between
 * columns would mean reimplementing Payload's save path for one field.
 *
 * Lost and Not-a-fit are deliberately NOT board columns: closed work is not
 * pipeline, and putting it on the board makes the board look fuller than the
 * business is.
 */

type Lead = {
  id: string | number;
  name?: string;
  company?: string | null;
  email?: string;
  service?: string | null;
  leadStage?: string | null;
  budget?: string | null;
  sourcePage?: string | null;
  utmSource?: string | null;
  proposalValue?: number | null;
  wonValue?: number | null;
  closedReason?: string | null;
  isRead?: boolean | null;
  createdAt?: string;
};

const COLUMNS = [
  { key: "new", label: "New", hint: "Not opened yet" },
  { key: "qualified", label: "Qualified", hint: "Real conversation" },
  { key: "proposal-sent", label: "Proposal", hint: "A number was quoted" },
  { key: "won", label: "Won", hint: "Contracted" },
] as const;

export function LeadsView({
  leads,
  counts,
  overview,
}: {
  leads: Lead[];
  counts: LeadCounts;
  overview: Overview;
}) {
  const valueOf = (l: Lead) => (l.leadStage === "won" ? (l.wonValue ?? 0) : (l.proposalValue ?? 0));
  const closed = leads.filter((l) => l.leadStage === "lost" || l.leadStage === "not-a-fit");
  const closedValue = closed.reduce((sum, l) => sum + (l.proposalValue ?? 0), 0);
  const conversion = counts.total ? Math.round((counts.wonCount / counts.total) * 100) : null;
  const stale = leads
    .filter((l) => (l.leadStage ?? "new") === "new" && l.createdAt && Date.now() - new Date(l.createdAt).getTime() > 3 * 86400000)
    .sort((a, b) => (a.createdAt ?? "") < (b.createdAt ?? "") ? -1 : 1);

  return (
    <>
      <ViewHeader
        eyebrow={`Leads & pipeline · ${overview.range.label}`}
        title="Who is waiting on the studio"
        description="Every row is an enquiry that was actually saved to the database. Moving a stage is a deliberate act — a form submission never promotes itself."
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
            Grouped by <code>leadStage</code> · card values are the manually entered <code>proposalValue</code> / <code>wonValue</code>
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
                <section key={col.key} className="studio-col" aria-label={`${col.label} — ${items.length} leads`}>
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
                      <Link key={String(lead.id)} href={`/admin/collections/messages/${lead.id}`} className="studio-card">
                        <span className="studio-card__top">
                          {lead.isRead ? null : <span className="studio-dot" />}
                          <span className="studio-card__name">{lead.name ?? "Unnamed"}</span>
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
                      </Link>
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
                  <Link key={String(lead.id)} href={`/admin/collections/messages/${lead.id}`} className="studio-row" style={{ gridTemplateColumns: "26px minmax(0,1fr) auto" }}>
                    <span className="studio-ava">{initials(lead.name ?? "?")}</span>
                    <span style={{ minWidth: 0 }}>
                      <span className="studio-row__name">{lead.name ?? "Unnamed"}</span>
                      <span className="studio-row__meta">
                        <em>{lead.service ?? "no service"}</em>
                        <span aria-hidden>·</span>
                        <em>{lead.budget ?? "no budget"}</em>
                      </span>
                    </span>
                    <Chip tone="danger">{days}d</Chip>
                  </Link>
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
            <code>messages</code>, newest first · times are relative to this request
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
                        <Link href={`/admin/collections/messages/${lead.id}`}>
                          {lead.isRead ? null : <span className="studio-dot" style={{ display: "inline-block", marginInlineEnd: 5, verticalAlign: "middle" }} />}
                          {lead.name ?? "Unnamed"}
                        </Link>
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
        Stage, proposal value and won value are edited in the Payload document — this board reads them, it does not own them.
        That is why there is no drag-and-drop here: a stage change is a decision with a value attached, not a gesture.
      </p>
    </>
  );
}

/* Delta is imported for the window comparison used by the header chips; keep
   the dependency explicit so removing the tile above cannot silently orphan it. */
void Delta;
