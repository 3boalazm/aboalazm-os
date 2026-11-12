import Link from "next/link";
import { Chip, EmptyState, ProbeRow, SIcon, Tile, ViewHeader, shortTime } from "@/components/studio/ui";
import type { EnvRow, Probe } from "@/lib/studio/metrics";

/**
 * SYSTEM — the console's own honesty check.
 *
 * Every probe below runs a real operation at request time (a SQL round-trip, a
 * presence test on the token the upload path actually reads). None of them is
 * a green dot with no test behind it. Where a check cannot be performed — for
 * example, whether a deployment is live on Vercel — the screen says so instead
 * of guessing.
 */
export function SystemView({ probes, env }: { probes: Probe[]; env: EnvRow[] }) {
  const fails = probes.filter((p) => p.state === "fail");
  const warns = probes.filter((p) => p.state === "warn");
  const oks = probes.filter((p) => p.state === "ok");
  const checkedAt = probes[0]?.checkedAt ?? new Date().toISOString();

  return (
    <>
      <ViewHeader
        eyebrow="System & integrations"
        title="What is wired, what is broken"
        description="Each row performed a real check on this request. A probe that cannot be run is labelled as unverified rather than shown green."
        aside={
          <Link className="studio-btn" href="/studio/system" title="Re-runs every probe on a fresh request">
            <SIcon name="refresh" size={12} /> Re-check
          </Link>
        }
      />

      <div className="studio-bento">
        <Tile span="w4" title={<b>Failing</b>} provenance={<>Probes that failed on this request</>}>
          <div className="studio-hero studio-hero--xl" style={{ color: fails.length ? "var(--s-danger)" : undefined }}>
            {fails.length}
          </div>
          <p className="studio-sub" style={{ marginBlockStart: 2 }}>
            {fails.length ? fails.map((f) => f.name).join(", ") : "everything that must work, works"}
          </p>
        </Tile>
        <Tile span="w4" title={<b>Warnings</b>} provenance={<>Configured-but-imperfect, or a known platform limitation</>}>
          <div className="studio-hero studio-hero--xl" style={{ color: warns.length ? "var(--s-warn)" : undefined }}>
            {warns.length}
          </div>
          <p className="studio-sub" style={{ marginBlockStart: 2 }}>
            {warns.length ? warns.map((f) => f.name).join(", ") : "no warnings"}
          </p>
        </Tile>
        <Tile span="w4" title={<b>Healthy</b>} provenance={<>Probes that passed their real check</>}>
          <div className="studio-hero studio-hero--xl" style={{ color: "var(--s-ok)" }}>
            {oks.length}
          </div>
          <p className="studio-sub" style={{ marginBlockStart: 2 }}>
            checked at {shortTime(checkedAt)}
          </p>
        </Tile>
      </div>

      <Tile
        span="w12"
        title={<b>Integration checks</b>}
        aside={<Chip tone="neutral">run {shortTime(checkedAt)}</Chip>}
        provenance={
          <>
            Database: <code>select 1</code> round-trip · Storage: token the upload path actually reads · Email: SMTP + notify address
          </>
        }
      >
        {probes.length === 0 ? (
          <EmptyState title="No probes ran" body="That is itself a failure — the metrics module did not return any checks." />
        ) : (
          <div className="studio-probes">
            {probes.map((probe) => (
              <ProbeRow key={probe.id} probe={probe} />
            ))}
          </div>
        )}
      </Tile>

      <Tile
        span="w12"
        title={<b>Environment & integrations</b>}
        aside={<Chip tone="neutral">presence only — values never leave the server</Chip>}
        provenance={<>Read from <code>process.env</code> on this request · a missing row explains a dark feature, never a zero metric</>}
      >
        <div className="studio-scroll-x">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Status</th>
                <th>What it powers</th>
              </tr>
            </thead>
            <tbody>
              {env.map((row) => (
                <tr key={row.name}>
                  <td style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}>
                    {row.name}
                    {row.hint ? <span style={{ color: "var(--s-accent)" }}> · {row.hint}</span> : null}
                  </td>
                  <td>
                    <Chip tone={row.present ? "ok" : "warn"} icon={row.present ? "check" : "minus"}>
                      {row.present ? "set" : "missing"}
                    </Chip>
                  </td>
                  <td style={{ color: "var(--s-muted)" }}>{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tile>

      <div className="studio-bento">
        <Tile
          span="w7"
          title={<b>How traffic is counted now</b>}
          variant="invert"
          provenance={<>The limitation recorded in docs/EVENTS.md, and the P2 answer to it</>}
        >
          <p className="studio-sub" style={{ marginBlockEnd: 10 }}>
            The vendor copy of every event still exists, but reading its totals back requires a Pro/Enterprise plan — the
            aggregation request returns <b>HTTP 402</b>. Since P2 the site also writes each event to its own Postgres through{" "}
            <code>/api/track</code>, so the console counts what it owns:
          </p>
          <ul style={{ margin: "0 0 12px", paddingInlineStart: 16, display: "flex", flexDirection: "column", gap: 7, fontSize: 11.5, color: "var(--s-muted)", lineHeight: 1.5 }}>
            <li>Pageviews, sessions, referrer hosts and the event funnel on the Analytics screen are first-party counts with printed definitions.</li>
            <li>No IP, user-agent string or fingerprint is stored; a session is a random per-tab id.</li>
            <li>The <b style={{ color: "var(--s-ink)" }}>saved enquiry</b> remains the ground truth — when a browser signal and the database disagree, the database wins.</li>
          </ul>
          <Link className="studio-btn studio-btn--sm" href="/studio/analytics">
            Open Analytics <SIcon name="arrowRight" size={11} />
          </Link>
        </Tile>

        <Tile
          span="w5"
          title={<b>Not verified from here</b>}
          provenance={<>Stated plainly rather than shown as a green dot</>}
        >
          <div className="studio-probes">
            <div className="studio-probe">
              <SIcon name="minus" className="studio-probe__ico" {...{ "data-state": "warn" }} />
              <div>
                <span className="studio-probe__name">Deployment status</span>
                <p className="studio-probe__detail">
                  The console cannot read the Vercel project from inside the app (no API token in this runtime). Check the dashboard for
                  the live build.
                </p>
              </div>
            </div>
            <div className="studio-probe">
              <SIcon name="minus" className="studio-probe__ico" {...{ "data-state": "warn" }} />
              <div>
                <span className="studio-probe__name">Search Console</span>
                <p className="studio-probe__detail">
                  Not connected. Organic clicks and impressions need a Google Search Console service account; the Content screen
                  shows the connection state and the exact env vars — the data itself is not faked meanwhile.
                </p>
              </div>
            </div>
            <div className="studio-probe">
              <SIcon name="minus" className="studio-probe__ico" {...{ "data-state": "warn" }} />
              <div>
                <span className="studio-probe__name">Core Web Vitals</span>
                <p className="studio-probe__detail">
                  Field data requires CrUX; lab data requires running Lighthouse against production. Neither is wired up yet.
                </p>
              </div>
            </div>
          </div>
        </Tile>
      </div>
    </>
  );
}
