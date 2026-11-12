import Link from "next/link";
import { AreaChart, Chip, Delta, EmptyState, RangeControl, SIcon, Sparkline, Tile, ViewHeader, num, shortTime } from "@/components/studio/ui";
import type { AnalyticsReport } from "@/lib/studio/analytics";

/**
 * ANALYTICS (P2) — the funnel, finally with a top.
 *
 * Until P2 this screen could not exist honestly: events were emitted to a
 * vendor whose aggregates return HTTP 402 on this plan. Now every event
 * is also stored in our own Postgres by /api/track, and this screen reads
 * that table. Definitions are printed on the tiles; a session is a
 * random per-tab id, not a person; and the one number that matters most —
 * enquiries actually saved — is cross-checked against `messages`, the
 * database's own word, next to the client's `contact_submit` signal.
 */
export function AnalyticsView({ report }: { report: AnalyticsReport }) {
  const { funnel } = report;
  const funnelMax = Math.max(1, funnel.steps[0]?.sessions ?? 0);
  const coverage = report.totalEvents > 0 ? Math.round((funnel.eventsWithSession / report.totalEvents) * 100) : 0;

  const pageviewDelta = pctChange(report.pageviews, report.prevPageviews);
  const sessionDelta = pctChange(report.sessions, report.prevSessions);

  return (
    <>
      <ViewHeader
        eyebrow={`Analytics · ${report.range.label}`}
        title="Who showed up, and how far they got"
        description="First-party counts from our own event store. The vendor copy of these events still exists, but its aggregates return HTTP 402 on this plan — nothing below is read from it."
        aside={<RangeControl current={report.range.key} basePath="/studio/analytics" />}
      />

      {!report.hasData ? (
        <Tile span="w12" title={<b>Collector status</b>} provenance={<>Checked <code>analytics-events</code> for the last {report.range.days} days · read at {shortTime(report.asOf)}</>}>
          <EmptyState
            title="The collector is live — no events yet in this window"
            body="This is a real empty state, not a zero. Visit the public site, click a case study and submit nothing; then reload. Pageviews land within a second."
            action={
              <Link className="studio-btn studio-btn--sm" href="/" target="_blank" rel="noopener">
                Open the site <SIcon name="arrowUpRight" size={11} />
              </Link>
            }
          />
        </Tile>
      ) : (
        <>
          <div className="studio-bento">
            <Tile
              span="w3"
              title={<b>Pageviews</b>}
              aside={<Delta pct={pageviewDelta} />}
              provenance={<>Stored <code>pageview</code> events · one per route change, path only (no query string)</>}
            >
              <div className="studio-hero studio-hero--xl">{num(report.pageviews)}</div>
              <div style={{ marginBlockStart: 6 }}>
                <Sparkline values={report.daily.map((d) => d.pageviews)} />
              </div>
            </Tile>

            <Tile
              span="w3"
              title={<b>Sessions</b>}
              aside={<Delta pct={sessionDelta} />}
              provenance={<>Distinct random per-tab <code>sessionId</code> values · a session is not a person</>}
            >
              <div className="studio-hero studio-hero--xl">{num(report.sessions)}</div>
              <div style={{ marginBlockStart: 6 }}>
                <Sparkline values={report.daily.map((d) => d.sessions)} />
              </div>
            </Tile>

            <Tile
              span="w3"
              title={<b>Enquiries saved</b>}
              provenance={<>Rows in <code>messages</code> created in this window · the database's count, not the browser's</>}
            >
              <div className="studio-hero studio-hero--xl">{num(report.enquiriesSaved)}</div>
              <p className="studio-sub" style={{ marginBlockStart: 2 }}>
                {report.contactSubmitEvents} <code>contact_submit</code> events fired
              </p>
            </Tile>

            <Tile
              span="w3"
              title={<b>Events stored</b>}
              provenance={<>All rows in <code>analytics-events</code> in this window · {coverage}% carry a session id</>}
            >
              <div className="studio-hero studio-hero--xl">{num(report.totalEvents)}</div>
              <p className="studio-sub" style={{ marginBlockStart: 2 }}>
                {funnel.sessionsWithId} sessions tracked · storage-disabled visits count as events only
              </p>
            </Tile>
          </div>

          <div className="studio-bento">
            <Tile
              span="w8"
              title={<b>Traffic by day</b>}
              aside={<Chip tone="neutral">{report.range.label}</Chip>}
              provenance={<>Daily buckets (UTC) of <code>pageview</code> events and distinct sessions · read at {shortTime(report.asOf)}</>}
            >
              <AreaChart points={report.daily} />
            </Tile>

            <Tile
              span="w4"
              title={<b>Session funnel</b>}
              provenance={<>Distinct sessions with ≥1 event of each kind · steps are not forced nested — a session can start the form without a stored pageview if the collector loaded mid-visit</>}
            >
              <div className="studio-funnel">
                {funnel.steps.map((step) => (
                  <div className="studio-funnel__step" key={step.key} style={{ gridTemplateColumns: "104px minmax(0,1fr) auto" }}>
                    <span className="studio-funnel__label">{step.label}</span>
                    <span className="studio-funnel__track">
                      <span className="studio-funnel__fill" style={{ width: `${Math.max((step.sessions / funnelMax) * 100, step.sessions ? 4 : 0)}%` }} />
                    </span>
                    <span className="studio-funnel__count">
                      {num(step.sessions)}
                      {step.pctOfFirst != null ? (
                        <span className="studio-tiny" style={{ display: "block", fontWeight: 400 }}>
                          {step.pctOfFirst}% of viewers
                        </span>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
              <p className="studio-tiny" style={{ marginBlockStart: 10 }}>
                The last step is a browser signal. The saved-enquiries tile above is the database confirming it — when they
                disagree, believe the database.
              </p>
            </Tile>
          </div>

          <div className="studio-bento">
            <Tile
              span="w7"
              title={<b>Top pages</b>}
              aside={<Chip tone="neutral">locale prefixes merged</Chip>}
              provenance={<><code>pageview</code> paths with /en, /ar, /ms prefixes folded together</>}
            >
              {report.topPages.length === 0 ? (
                <EmptyState title="No pageviews in this window" body="Events exist, but none are pageviews — check that PageviewTracker is mounted in the site layout." />
              ) : (
                <div className="studio-scroll-x">
                  <table className="studio-table">
                    <thead>
                      <tr>
                        <th>Path</th>
                        <th style={{ textAlign: "end" }}>Views</th>
                        <th style={{ textAlign: "end" }}>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.topPages.map(([path, views]) => (
                        <tr key={path}>
                          <td style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}>{path}</td>
                          <td className="num">{num(views)}</td>
                          <td className="num" style={{ color: "var(--s-muted)" }}>
                            {report.pageviews ? Math.round((views / report.pageviews) * 100) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tile>

            <div className="studio-w5" style={{ display: "flex", flexDirection: "column", gap: "var(--s-gap)" }}>
              <Tile
                span="w12"
                title={<b>Where they came from</b>}
                provenance={<>Referrer <b>host only</b> on pageviews · full referring URLs are never stored</>}
              >
                {report.referrers.length === 0 && report.campaigns.length === 0 ? (
                  <p className="studio-sub">No external referrers or campaigns recorded — direct visits carry neither.</p>
                ) : (
                  <div className="studio-dist">
                    {report.referrers.map(([host, count]) => (
                      <DistRow key={`ref-${host}`} label={host} value={count} max={report.referrers[0]?.[1] ?? 1} />
                    ))}
                    {report.campaigns.map(([utm, count]) => (
                      <DistRow key={`utm-${utm}`} label={`utm: ${utm}`} value={count} max={Math.max(report.campaigns[0]?.[1] ?? 1, report.referrers[0]?.[1] ?? 1)} />
                    ))}
                  </div>
                )}
              </Tile>

              <Tile
                span="w12"
                title={<b>Language & device</b>}
                provenance={<>Event <code>locale</code> prop · device is a coarse class from the user-agent at ingest (the UA itself is not stored)</>}
              >
                <div className="studio-dist">
                  {report.locales.map(([locale, count]) => (
                    <DistRow key={`loc-${locale}`} label={locale} value={count} max={report.locales[0]?.[1] ?? 1} />
                  ))}
                  {report.devices.map(([device, count]) => (
                    <DistRow key={`dev-${device}`} label={device} value={count} max={report.devices[0]?.[1] ?? 1} />
                  ))}
                </div>
              </Tile>
            </div>
          </div>

          <Tile
            span="w12"
            title={<b>Event mix</b>}
            aside={<Link className="studio-tile__more" href="/admin/collections/analytics-events" target="_blank" rel="noopener">raw rows</Link>}
            provenance={<>Counts by event name in <code>analytics-events</code> · definitions in docs/EVENTS.md</>}
          >
            <div className="studio-scroll-x">
              <table className="studio-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th style={{ textAlign: "end" }}>Count</th>
                    <th style={{ textAlign: "end" }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topEvents.map(([name, count]) => (
                    <tr key={name}>
                      <td style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}>{name}</td>
                      <td className="num">{num(count)}</td>
                      <td className="num" style={{ color: "var(--s-muted)" }}>
                        {Math.round((count / report.totalEvents) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tile>
        </>
      )}
    </>
  );
}

function DistRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="studio-dist__row">
      <span className="studio-dist__label" title={label}>
        {label}
      </span>
      <span className="studio-dist__val">{num(value)}</span>
      <span className="studio-dist__track">
        <span className="studio-dist__fill" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </span>
    </div>
  );
}

function pctChange(now: number, prev: number): number | null {
  if (!prev) return now > 0 ? null : 0;
  return Math.round(((now - prev) / prev) * 100);
}
