import Link from "next/link";
import { Chip, EmptyState, Provenance, RangeControl, SIcon, Tile, ViewHeader, ago, num, shortTime } from "@/components/studio/ui";
import type { ContentHealth, Overview } from "@/lib/studio/metrics";
import type { ContentPerfRow, SeoReport } from "@/lib/studio/seo";

/**
 * CONTENT — what is live, what is stuck in draft, and what is silently broken.
 *
 * There is deliberately no "top performing article" table. Ranking content by
 * views requires pageview aggregation, which this plan cannot return (HTTP
 * 402). Inventing a ranking from file order would be the single most
 * misleading thing this console could do, so the screen reports *state*
 * (live / draft / missing metadata) and links to the real editors.
 */
export function ContentView({
  content,
  activity,
  overview,
  seo,
  performance,
  hasPageviews,
  searchConsoleConfigured,
}: {
  content: ContentHealth;
  activity: Overview["activity"];
  overview: Overview;
  seo: SeoReport;
  performance: ContentPerfRow[];
  hasPageviews: boolean;
  searchConsoleConfigured: boolean;
}) {
  const cols = [
    {
      key: "projects",
      label: "Projects",
      live: content.projectsPublished,
      draft: content.projectsDraft,
      href: "/admin/collections/projects",
      note: content.projectsWithoutThumbnail
        ? `${content.projectsWithoutThumbnail} live without a thumbnail`
        : "all live projects have a thumbnail",
      warn: content.projectsWithoutThumbnail > 0,
    },
    {
      key: "posts",
      label: "Writing",
      live: content.postsPublished,
      draft: content.postsDraft,
      href: "/admin/collections/posts",
      note: content.postsDraft ? "drafts are invisible to visitors until published" : "everything written is live",
      warn: false,
    },
    {
      key: "case-studies",
      label: "Case studies",
      live: content.caseStudiesPublished,
      draft: 0,
      href: "/admin/collections/case-studies",
      note: "each one is a full narrative page",
      warn: false,
    },
    {
      key: "media",
      label: "Media",
      live: content.mediaCount,
      draft: 0,
      href: "/admin/collections/media",
      note: "stored on Vercel Blob",
      warn: false,
    },
  ];

  return (
    <>
      <ViewHeader
        eyebrow="Content"
        title="What is live, what is read, what is broken"
        description="State from the CMS, performance from the first-party collector, and an SEO list computed from the rows themselves. Search data from Google appears only when Search Console is actually connected."
        aside={
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <RangeControl current={overview.range.key} basePath="/studio/content" />
            <Link className="studio-btn" href="/admin/collections/projects" target="_blank" rel="noopener">
              Open Payload <SIcon name="arrowUpRight" size={12} />
            </Link>
          </span>
        }
      />

      <div className="studio-bento">
        {cols.map((col) => (
          <Tile
            key={col.key}
            span="w3"
            title={<b>{col.label}</b>}
            aside={
              <Link className="studio-tile__more" href={col.href} target="_blank" rel="noopener">
                edit
              </Link>
            }
            provenance={
              <>
                <code>_status</code> count in <code>{col.key}</code>
              </>
            }
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <span className="studio-hero studio-hero--xl">{num(col.live)}</span>
              <span className="studio-up" style={{ paddingBlockEnd: 4 }}>
                live
              </span>
            </div>
            {col.draft > 0 ? (
              <div style={{ marginBlock: "6px 0" }}>
                <Chip tone="warn" icon="alert">
                  {col.draft} draft{col.draft === 1 ? "" : "s"}
                </Chip>
              </div>
            ) : null}
            <p className="studio-tiny" style={{ marginBlockStart: "auto", color: col.warn ? "var(--s-warn)" : undefined }}>
              {col.note}
            </p>
          </Tile>
        ))}
      </div>

      <div className="studio-bento">
        <Tile
          span="w7"
          title={<b>Most read content</b>}
          aside={<Chip tone="neutral">{overview.range.label}</Chip>}
          provenance={
            <>
              First-party <code>pageview</code> events joined to posts / case studies by slug · window of {overview.range.days} days ·
              section pages rank on the Analytics screen instead
            </>
          }
        >
          {!hasPageviews ? (
            <EmptyState
              title="No pageviews recorded yet"
              body="The collector has nothing in this window, so there is no honest ranking to show. Once visitors arrive, each published piece ranks by its own stored views."
              action={
                <Link className="studio-btn studio-btn--sm" href="/studio/analytics">
                  Open Analytics <SIcon name="arrowRight" size={11} />
                </Link>
              }
            />
          ) : performance.length === 0 ? (
            <EmptyState
              title="Pageviews exist — none on articles or case studies"
              body="Traffic landed on section pages in this window. The Analytics screen's top-pages table shows exactly where."
              action={
                <Link className="studio-btn studio-btn--sm" href="/studio/analytics">
                  See top pages <SIcon name="arrowRight" size={11} />
                </Link>
              }
            />
          ) : (
            <div className="studio-rows">
              {performance.slice(0, 8).map((row) => (
                <Link key={row.path} href={row.href} className="studio-row" style={{ gridTemplateColumns: "minmax(0,1fr) auto auto" }} target="_blank" rel="noopener">
                  <span style={{ minWidth: 0 }}>
                    <span className="studio-row__name">{row.title}</span>
                    <span className="studio-row__meta">
                      <em>{row.kind}</em>
                      <span aria-hidden>·</span>
                      <em style={{ fontFamily: "var(--font-mono, monospace)" }}>{row.path}</em>
                    </span>
                  </span>
                  <span className="studio-dist__track" style={{ width: 90, marginBlockStart: 0, gridColumn: "auto" }}>
                    <span className="studio-dist__fill" style={{ width: `${(row.views / (performance[0]?.views ?? 1)) * 100}%` }} />
                  </span>
                  <b className="studio-num">{num(row.views)}</b>
                </Link>
              ))}
            </div>
          )}
        </Tile>

        <Tile
          span="w5"
          title={<b>SEO checks</b>}
          aside={
            seo.issues.length ? (
              <Chip tone={seo.issues.some((i) => i.severity === "danger") ? "danger" : "warn"} icon="alert">
                {seo.issues.length} issue{seo.issues.length === 1 ? "" : "s"}
              </Chip>
            ) : (
              <Chip tone="ok" icon="check">
                clean
              </Chip>
            )
          }
          provenance={
            <>
              Computed from the CMS rows at {shortTime(seo.asOf)} · {seo.checked.posts} posts, {seo.checked.projects} projects,{" "}
              {seo.checked.caseStudies} case studies · each row links to the document that fixes it
            </>
          }
        >
          {seo.issues.length === 0 ? (
            <p className="studio-sub">
              Nothing flagged: every published post has a meta description, no duplicate slugs, no dead-end project cards.
            </p>
          ) : (
            <div className="studio-rows">
              {seo.issues.slice(0, 7).map((issue, i) => (
                <Link key={`${issue.title}-${i}`} href={issue.href} className="studio-row" style={{ gridTemplateColumns: "auto minmax(0,1fr)" }} target="_blank" rel="noopener">
                  <Chip tone={issue.severity === "danger" ? "danger" : issue.severity === "warn" ? "warn" : "neutral"}>
                    {issue.severity}
                  </Chip>
                  <span style={{ minWidth: 0 }}>
                    <span className="studio-row__name" style={{ fontSize: 12 }}>
                      {issue.title}
                    </span>
                    <span className="studio-row__meta">
                      <em style={{ whiteSpace: "normal" }}>{issue.detail}</em>
                    </span>
                  </span>
                </Link>
              ))}
              {seo.issues.length > 7 ? <p className="studio-tiny">…and {seo.issues.length - 7} more in the collections themselves.</p> : null}
            </div>
          )}
        </Tile>
      </div>

      <div className="studio-bento">
        <Tile
          span="w7"
          title={<b>Recently changed</b>}
          aside={<Chip tone="neutral">newest first</Chip>}
          provenance={<>Newest <code>updatedAt</code> across projects, posts and case studies — the same rows Payload holds</>}
        >
          {activity.length === 0 ? (
            <p className="studio-sub">No content rows yet.</p>
          ) : (
            <div className="studio-rows">
              {activity.map((row) => (
                <Link key={row.id} href={row.href} className="studio-row" style={{ gridTemplateColumns: "minmax(0,1fr) auto auto" }}>
                  <span style={{ minWidth: 0 }}>
                    <span className="studio-row__name">{row.title}</span>
                    <span className="studio-row__meta">
                      <em>{row.kind}</em>
                    </span>
                  </span>
                  <Chip tone={row.status === "published" ? "ok" : "warn"}>{row.status}</Chip>
                  <span className="studio-tiny" style={{ whiteSpace: "nowrap" }}>
                    {ago(row.at)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Tile>

        <Tile
          span="w5"
          title={<b>Search Console</b>}
          variant="invert"
          aside={searchConsoleConfigured ? <Chip tone="warn">credentials present</Chip> : <Chip tone="neutral">not connected</Chip>}
          provenance={<>Connection state from environment configuration at {shortTime(seo.asOf)} · no Google data is fetched or implied by this tile</>}
        >
          {searchConsoleConfigured ? (
            <p className="studio-sub" style={{ marginBlockEnd: 10 }}>
              The service-account credentials are present, but the query client is not wired yet — so this tile shows no
              impressions or clicks rather than a borrowed chart. Wiring it is a deliberate next step, not a silent gap.
            </p>
          ) : (
            <>
              <p className="studio-sub" style={{ marginBlockEnd: 10 }}>
                Organic impressions, clicks and rankings live in Google's systems. They are <b style={{ color: "var(--s-ink)" }}>not
                connected</b>, so none are shown — an empty chart here would read as “Google sends you nobody”, which nobody
                measured.
              </p>
              <ul style={{ margin: "0 0 12px", paddingInlineStart: 16, display: "flex", flexDirection: "column", gap: 7, fontSize: 11.5, color: "var(--s-muted)", lineHeight: 1.5 }}>
                <li>Create a Google service account and grant it the Search Console property.</li>
                <li>
                  Set <code>GOOGLE_SEARCH_CONSOLE_PROPERTY</code>, <code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code> and{" "}
                  <code>GOOGLE_SERVICE_ACCOUNT_KEY</code> in the deployment environment.
                </li>
                <li>This tile flips to “credentials present” on the next request — no deploy needed.</li>
              </ul>
            </>
          )}
          <p className="studio-tiny">
            Also still unmeasured, and still unclaimed: read-through / scroll depth (no such events exist), and Core Web Vitals
            field data (needs CrUX). The SEO list above is everything that can be known from the CMS itself.
          </p>
        </Tile>
      </div>

      <Tile
        span="w12"
        title={<b>Editorial health</b>}
        provenance={<>Checked on published rows only — a draft without a thumbnail is not a defect, it is unfinished work</>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
          <div className="studio-empty-state" style={{ textAlign: "start" }}>
            <strong>{content.projectsWithoutThumbnail}</strong>
            <p>Published projects with no thumbnail. These render as empty cards on /work.</p>
          </div>
          <div className="studio-empty-state" style={{ textAlign: "start" }}>
            <strong>{content.projectsInProgress ?? "—"}</strong>
            <p>
              {content.projectsInProgress === null
                ? "Not available: the delivery-status column is missing from this database. See docs/studio/03_SCHEMA_FINDINGS.md §3."
                : "Projects marked in-progress. They stay visible and are labelled as live-but-unfinished."}
            </p>
          </div>
          <div className="studio-empty-state" style={{ textAlign: "start" }}>
            <strong>{content.postsDraft}</strong>
            <p>Writing drafts. Publishing one triggers a revalidation of the archive and the article route.</p>
          </div>
          <div className="studio-empty-state" style={{ textAlign: "start" }}>
            <strong>{overview.range.label}</strong>
            <p>
              Active reporting window. It applies to leads and resource capture, and is carried in the URL so a view can be shared
              exactly.
            </p>
          </div>
        </div>
      </Tile>

      <p className="studio-tiny" style={{ paddingInline: 4 }}>
        Editing happens in Payload, deliberately: one editor, one save path, one revalidation hook. The console reports and routes; it
        does not fork the CMS.
      </p>
    </>
  );
}

/* Provenance is rendered by every Tile above; the import is kept explicit so a
   future tile cannot accidentally omit it. */
void Provenance;
