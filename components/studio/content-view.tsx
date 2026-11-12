import Link from "next/link";
import { Chip, Provenance, SIcon, Tile, ViewHeader, ago, num } from "@/components/studio/ui";
import type { ContentHealth, Overview } from "@/lib/studio/metrics";

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
}: {
  content: ContentHealth;
  activity: Overview["activity"];
  overview: Overview;
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
        title="What is live, what is still a draft"
        description="State, not traffic. A page view ranking would need analytics aggregates this plan cannot return, so this screen tells you what exists and what is missing — and hands you the real editor."
        aside={
          <Link className="studio-btn" href="/admin/collections/projects" target="_blank" rel="noopener">
            Open Payload <SIcon name="arrowUpRight" size={12} />
          </Link>
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
          title={<b>What is NOT on this screen</b>}
          variant="invert"
          provenance={<>Recorded so the absence is a documented decision, not an oversight</>}
        >
          <ul style={{ margin: 0, paddingInlineStart: 16, display: "flex", flexDirection: "column", gap: 9, fontSize: 11.5, color: "var(--s-muted)", lineHeight: 1.5 }}>
            <li>
              <b style={{ color: "var(--s-ink)" }}>Page views / top content.</b> Vercel Analytics cannot return custom-event or pageview
              aggregates on this plan (HTTP 402, 2026-10-24 audit). Any ranking here would be fabricated.
            </li>
            <li>
              <b style={{ color: "var(--s-ink)" }}>Read-through or scroll depth.</b> No such events are emitted, so nothing is implied.
            </li>
            <li>
              <b style={{ color: "var(--s-ink)" }}>Which project “performs”.</b> That phrase has no definition without pageviews. When an
              analytics source exists, it gets added here with its own provenance line — not before.
            </li>
          </ul>
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
