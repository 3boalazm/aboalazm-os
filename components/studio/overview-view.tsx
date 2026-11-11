import Link from "next/link";
import {
  Chip,
  Delta,
  EmptyState,
  Provenance,
  RangeControl,
  SIcon,
  Tile,
  ViewHeader,
  ago,
  initials,
  num,
  shortTime,
  stageMeta,
  usd,
} from "@/components/studio/ui";
import { deltaOf, loadOverview, type Overview, type Probe } from "@/lib/studio/metrics";

/**
 * OVERVIEW — three questions, in order:
 *   1. What needs attention?  (top-left, because it is the reason to be here)
 *   2. What is performing?    (pipeline, contracted value, resource capture)
 *   3. What is the state?     (content health, integrations)
 *
 * Tile order is the argument. A dashboard that opens with traffic tells you
 * about strangers; this one opens with the three enquiries nobody has answered
 * yet.
 */
export function OverviewView({ data }: { data: Overview }) {
  const { leads, content, activity, resources, probes } = data;
  const all = leads.all;
  const atendimento = leads.recent.filter((l) => !l.isRead);
  const newLeads = all.byStage.new ?? 0;
  const qualified = all.byStage.qualified ?? 0;
  const proposal = all.byStage["proposal-sent"] ?? 0;
  const won = all.byStage.won ?? 0;
  const lost = (all.byStage.lost ?? 0) + (all.byStage["not-a-fit"] ?? 0);

  const leadDelta = deltaOf({
    id: "leads",
    label: "Enquiries",
    value: leads.window.total,
    previous: leads.window.previous,
    definition: "",
    source: "",
    asOf: data.asOf,
  });

  /* The funnel is drawn from stages that exist in the database. There is no
     "visits" or "CTA clicks" bar: those events cannot be read back on this
     plan (HTTP 402, docs/EVENTS.md), and a fabricated top-of-funnel is worse
     than a short funnel. */
  const funnelMax = Math.max(all.total, 1);
  const funnel = [
    { key: "captured", label: "Enquiries saved", value: all.total, note: "every row in messages" },
    { key: "qualified", label: "Qualified", value: qualified + proposal + won, note: "stage moved past New" },
    { key: "proposal", label: "Proposal sent", value: proposal + won, note: "a real number was quoted" },
    { key: "won", label: "Won", value: won, note: "contracted" },
  ];

  const fails = probes.filter((p) => p.state === "fail");
  const warns = probes.filter((p) => p.state === "warn");

  return (
    <>
      <ViewHeader
        eyebrow={`Overview · ${data.range.label}`}
        title="What needs you right now"
        description="Every figure below is read live from Payload/PostgreSQL on this request, and each tile states what it counts. There are no demo numbers on this screen."
        aside={<RangeControl current={data.range.key} basePath="/studio" />}
      />

      <div className="studio-bento">
        {/* ── 1 · needs attention ─────────────────────────────────────── */}
        <Tile
          span="w7"
          variant="accent"
          title={
            <b>
              Waiting on you
            </b>
          }
          aside={
            atendimento.length ? <Chip tone="accent" dot>{atendimento.length} unread</Chip> : <Chip tone="ok" icon="check">inbox clear</Chip>
          }
          provenance={
            <>
              {atendimento.length ? `${atendimento.length} of the ${num(all.total)} leads in ` : `All ${num(all.total)} leads in `}
              <code>messages</code> · read at {shortTime(data.asOf)}
            </>
          }
        >
          {leads.recent.length === 0 ? (
            <EmptyState
              title="No enquiries yet"
              body="This is a real empty state, not a loading placeholder. The moment the contact form saves one, it appears here."
              action={
                <Link className="studio-btn studio-btn--sm" href="/contact" target="_blank" rel="noopener">
                  Open the form <SIcon name="arrowUpRight" size={11} />
                </Link>
              }
            />
          ) : (
            <div className="studio-rows">
              {leads.recent.slice(0, 4).map((lead) => {
                const stage = stageMeta(lead.leadStage);
                return (
                  <Link key={String(lead.id)} href={`/admin/collections/messages/${lead.id}`} className="studio-row" style={{ gridTemplateColumns: "26px minmax(0,1fr) auto" }}>
                    <span className="studio-ava">{initials(lead.name ?? "?")}</span>
                    <span style={{ minWidth: 0 }}>
                      <span className="studio-row__name">
                        {lead.isRead ? null : <span className="studio-dot" style={{ display: "inline-block", marginInlineEnd: 5, verticalAlign: "middle" }} />}
                        {lead.name ?? "Unnamed"}
                      </span>
                      <span className="studio-row__meta">
                        <em>{lead.company || lead.email}</em>
                        <span aria-hidden>·</span>
                        <em>{lead.sourcePage || "direct"}</em>
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <Chip tone={stage.tone}>{stage.short}</Chip>
                      <span className="studio-tiny" style={{ whiteSpace: "nowrap" }}>
                        {ago(lead.createdAt)}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </Tile>

        {/* ── 2 · pipeline value ──────────────────────────────────────── */}
        <Tile
          span="w5"
          title={<b>Pipeline</b>}
          aside={<Chip tone={proposal ? "warn" : "neutral"} dot={Boolean(proposal)}>{proposal} at proposal</Chip>}
          provenance={
            <>
              Sum of <code>proposalValue</code> on open stages and <code>wonValue</code> on Won · entered by hand, never estimated
            </>
          }
        >
          <p className="studio-up" style={{ margin: "0 0 2px" }}>
            Open proposals
          </p>
          <div className="studio-hero studio-hero--xl">
            {usd(all.openProposalValue)}
          </div>
          <div style={{ display: "flex", gap: 14, marginBlock: "12px 4px", flexWrap: "wrap" }}>
            <span>
              <span className="studio-up" style={{ display: "block" }}>
                Contracted
              </span>
              <b className="studio-num" style={{ fontSize: 15 }}>
                {usd(all.contractedValue)}
              </b>
            </span>
            <span>
              <span className="studio-up" style={{ display: "block" }}>
                Won
              </span>
              <b className="studio-num" style={{ fontSize: 15 }}>
                {won}
              </b>
            </span>
            <span>
              <span className="studio-up" style={{ display: "block" }}>
                Lost / no fit
              </span>
              <b className="studio-num" style={{ fontSize: 15 }}>
                {lost}
              </b>
            </span>
          </div>
          <p className="studio-tiny" style={{ marginBlockStart: "auto" }}>
            Contracted value is what was actually signed, not revenue booked.
          </p>
        </Tile>

        {/* ── 3 · funnel ──────────────────────────────────────────────── */}
        <Tile
          span="w8"
          title={<b>Enquiry funnel</b>}
          aside={<Chip tone="neutral">all time</Chip>}
          provenance={
            <>
              Stage counts from <code>messages.leadStage</code> · stages are set by you, never inferred from a form submission
            </>
          }
        >
          <div className="studio-funnel">
            {funnel.map((step, i) => {
              const width = Math.max((step.value / funnelMax) * 100, step.value ? 4 : 0);
              const dropFromPrev = i === 0 ? null : funnel[i - 1]!.value ? Math.round((step.value / funnel[i - 1]!.value) * 100) : null;
              return (
                <div className="studio-funnel__step" key={step.key}>
                  <span className="studio-funnel__label">{step.label}</span>
                  <span className="studio-funnel__track">
                    <span className="studio-funnel__fill" style={{ width: `${width}%` }} />
                  </span>
                  <span className="studio-funnel__count">
                    {num(step.value)}
                    {dropFromPrev != null ? (
                      <span className="studio-tiny" style={{ display: "block", fontWeight: 400 }}>
                        {dropFromPrev}%
                      </span>
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="studio-tiny" style={{ marginBlockStart: 10 }}>
            The funnel starts at <b>saved enquiries</b>, not at visits: browser events cannot be aggregated on the current
            analytics plan (HTTP 402), so there is deliberately no traffic bar above this one.
          </p>
        </Tile>

        {/* ── 4 · window performance ──────────────────────────────────── */}
        <Tile
          span="w4"
          title={<b>This window</b>}
          aside={<Chip tone="neutral">{data.range.label}</Chip>}
          provenance={
            <>
              <code>messages.createdAt</code> within the last {data.range.days} days · compared with the {data.range.days} days before
            </>
          }
        >
          <p className="studio-up" style={{ margin: "0 0 2px" }}>
            New enquiries
          </p>
          <div className="studio-hero">{num(leads.window.total)}</div>
          <div style={{ marginBlock: "7px 12px" }}>
            <Delta pct={leadDelta.pct} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBlockStart: "auto" }}>
            <span className="studio-row__meta" style={{ justifyContent: "space-between" }}>
              <span>Won this window</span>
              <b className="studio-num" style={{ color: "var(--s-ink)" }}>
                {leads.window.won}
              </b>
            </span>
            <span className="studio-row__meta" style={{ justifyContent: "space-between" }}>
              <span>Resource sign-ups</span>
              <b className="studio-num" style={{ color: "var(--s-ink)" }}>
                {resources.inWindow}
              </b>
            </span>
          </div>
        </Tile>

        {/* ── 5 · where leads come from ───────────────────────────────── */}
        <Tile
          span="w5"
          title={<b>Where enquiries came from</b>}
          aside={<Chip tone="neutral">{data.range.label}</Chip>}
          provenance={
            <>
              <code>messages.sourcePage</code> + <code>utmSource</code> · one row per saved enquiry, not per click
            </>
          }
        >
          {leads.window.total === 0 ? (
            <EmptyState title="No enquiries in this window" body="Widen the range, or check that the contact form is saving. Nothing here is a placeholder." />
          ) : (
            <div className="studio-dist">
              {[
                ...leads.window.bySource.map(([k, v]) => ({ key: k, label: k, value: v })),
                ...leads.window.byUtm.map(([k, v]) => ({ key: `utm-${k}`, label: `utm:${k}`, value: v })),
              ]
                .sort((a, b) => b.value - a.value)
                .slice(0, 6)
                .map((row) => {
                  const max = Math.max(...leads.window.bySource.map(([, v]) => v), ...leads.window.byUtm.map(([, v]) => v), 1);
                  return (
                    <div key={row.key} className="studio-dist__row">
                      <span className="studio-dist__label" title={row.label}>
                        {row.label}
                      </span>
                      <span className="studio-dist__val">{row.value}</span>
                      <span className="studio-dist__track">
                        <span className="studio-dist__fill" style={{ width: `${(row.value / max) * 100}%` }} />
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </Tile>

        {/* ── 6 · resources ───────────────────────────────────────────── */}
        <Tile
          span="w3"
          title={<b>Resource gate</b>}
          provenance={
            <>
              <code>resource-leads</code> rows · emails captured at /resources
            </>
          }
        >
          <div className="studio-hero">{num(resources.total)}</div>
          <p className="studio-sub" style={{ marginBlock: "1px 0 10px" }}>
            emails captured
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.entries(resources.byResource)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([name, count]) => (
                <span key={name} className="studio-row__meta" style={{ justifyContent: "space-between" }}>
                  <em style={{ flex: 1 }}>{name}</em>
                  <b className="studio-num" style={{ color: "var(--s-ink)" }}>
                    {count}
                  </b>
                </span>
              ))}
            {resources.total === 0 ? <span className="studio-tiny">Nothing captured yet.</span> : null}
          </div>
        </Tile>

        {/* ── 7 · content health ──────────────────────────────────────── */}
        <Tile
          span="w4"
          title={<b>Content</b>}
          aside={
            <Link className="studio-tile__more" href="/studio/content">
              details
            </Link>
          }
          provenance={
            <>
              <code>_status</code> on projects / posts / case-studies · thumbnails checked on published rows only
            </>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            {[
              { label: "Projects live", value: content.projectsPublished, sub: `${content.projectsDraft} draft` },
              { label: "Articles live", value: content.postsPublished, sub: `${content.postsDraft} draft` },
              { label: "Case studies", value: content.caseStudiesPublished, sub: "published" },
              { label: "Media files", value: content.mediaCount, sub: "in library" },
            ].map((s) => (
              <span key={s.label}>
                <span className="studio-up" style={{ display: "block" }}>
                  {s.label}
                </span>
                <b className="studio-hero" style={{ fontSize: 20, fontWeight: 500 }}>
                  {num(s.value)}
                </b>
                <span className="studio-tiny" style={{ display: "block" }}>
                  {s.sub}
                </span>
              </span>
            ))}
          </div>
          {content.projectsWithoutThumbnail > 0 ? (
            <p className="studio-tiny" style={{ marginBlockStart: "auto", color: "var(--s-warn)" }}>
              {content.projectsWithoutThumbnail} published project{content.projectsWithoutThumbnail === 1 ? "" : "s"} without a
              thumbnail — invisible on /work.
            </p>
          ) : null}
        </Tile>

        {/* ── 8 · recent edits ────────────────────────────────────────── */}
        <Tile
          span="w5"
          title={<b>Recently changed</b>}
          provenance={
            <>
              Newest <code>updatedAt</code> across projects, posts and case studies
            </>
          }
        >
          <div className="studio-rows">
            {activity.map((row) => (
              <Link key={row.id} href={row.href} className="studio-row" style={{ gridTemplateColumns: "minmax(0,1fr) auto", padding: "7px 6px" }}>
                <span style={{ minWidth: 0 }}>
                  <span className="studio-row__name">{row.title}</span>
                  <span className="studio-row__meta">
                    <em>{row.kind}</em>
                    <span aria-hidden>·</span>
                    <em>{row.status}</em>
                  </span>
                </span>
                <span className="studio-tiny" style={{ whiteSpace: "nowrap" }}>
                  {ago(row.at)}
                </span>
              </Link>
            ))}
            {activity.length === 0 ? <span className="studio-tiny">No content yet.</span> : null}
          </div>
        </Tile>

        {/* ── 9 · system ──────────────────────────────────────────────── */}
        <Tile
          span="w3"
          title={<b>System</b>}
          aside={
            <Link className="studio-tile__more" href="/studio/system">
              all checks
            </Link>
          }
          provenance={
            <>
              Live probes of database, storage, email, analytics · run at {shortTime(probes[0]?.checkedAt ?? data.asOf)}
            </>
          }
        >
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBlockEnd: 10 }}>
            {fails.length ? (
              <Chip tone="danger" icon="x">
                {fails.length} failing
              </Chip>
            ) : (
              <Chip tone="ok" icon="check">
                0 failing
              </Chip>
            )}
            {warns.length ? (
              <Chip tone="warn" icon="alert">
                {warns.length} warning{warns.length === 1 ? "" : "s"}
              </Chip>
            ) : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBlockStart: "auto" }}>
            {probes.slice(0, 4).map((probe) => (
              <span key={probe.id} className="studio-row__meta" style={{ justifyContent: "space-between" }}>
                <em>{probe.name}</em>
                <ProbeDot probe={probe} />
              </span>
            ))}
          </div>
        </Tile>
      </div>
    </>
  );
}

function ProbeDot({ probe }: { probe: Probe }) {
  const map = { ok: ["ok", "check"], warn: ["warn", "alert"], fail: ["danger", "x"], unconfigured: ["neutral", "minus"] } as const;
  const [tone, icon] = map[probe.state];
  return (
    <Chip tone={tone} icon={icon}>
      {probe.state}
    </Chip>
  );
}
