import Link from "next/link";
import { Chip, SIcon, Tile, ViewHeader, ago, num, shortTime } from "@/components/studio/ui";
import type { CmsInventory, Overview } from "@/lib/studio/metrics";

/**
 * MANAGE (P6) — the CMS, with its real shape on one screen.
 *
 * This is deliberately not a second editor. Every card reports the true
 * state of one Payload collection (row count, drafts where drafts exist)
 * and hands over to the one real editor with both "open" and "create"
 * doors. The console's job is to make the filing cabinet legible —
 * counts, freshness, and the right link — not to fork the save path.
 */
export function ManageView({ inventory, activity }: { inventory: CmsInventory; activity: Overview["activity"] }) {
  const groups = [...new Set(inventory.collections.map((c) => c.group))];

  return (
    <>
      <ViewHeader
        eyebrow="Manage"
        title="Everything the CMS holds"
        description="Real row counts from Postgres, read on this request. Editing happens in Payload — one editor, one save path, one revalidation hook — these cards are the map, not a second territory."
        aside={
          <Link className="studio-btn" href="/admin" target="_blank" rel="noopener">
            Payload admin <SIcon name="arrowUpRight" size={12} />
          </Link>
        }
      />

      {groups.map((group) => (
        <div key={group}>
          <p className="studio-up" style={{ margin: "2px 4px 8px" }}>
            {group}
          </p>
          <div className="studio-bento" style={{ marginBlockEnd: "var(--s-gap)" }}>
            {inventory.collections
              .filter((c) => c.group === group)
              .map((col) => (
                <Tile
                  key={col.slug}
                  span="w3"
                  title={<b>{col.label}</b>}
                  aside={
                    col.drafts ? (
                      <Chip tone="warn" icon="alert">
                        {col.drafts} draft{col.drafts === 1 ? "" : "s"}
                      </Chip>
                    ) : undefined
                  }
                  provenance={<>Rows in <code>{col.slug}</code> · counted at {shortTime(inventory.asOf)}</>}
                >
                  <div className="studio-hero">{num(col.total)}</div>
                  <p className="studio-sub" style={{ marginBlock: "1px 0 12px" }}>
                    {col.drafts == null ? "documents" : col.total === 1 ? "document" : "documents"}
                    {col.drafts ? ` · ${col.total - col.drafts} published` : ""}
                  </p>
                  <div style={{ display: "flex", gap: 7, marginBlockStart: "auto", flexWrap: "wrap" }}>
                    <Link className="studio-btn studio-btn--sm" href={col.href} target="_blank" rel="noopener">
                      Open <SIcon name="arrowUpRight" size={11} />
                    </Link>
                    <Link className="studio-btn studio-btn--sm" href={col.createHref} target="_blank" rel="noopener">
                      New
                    </Link>
                  </div>
                </Tile>
              ))}
          </div>
        </div>
      ))}

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
          title={<b>Site-wide documents</b>}
          provenance={<>Payload globals — single documents the whole site reads · edited in Payload like everything else</>}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {inventory.globals.map((g) => (
              <div key={g.slug} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span className="studio-row__name" style={{ fontSize: 12.5 }}>
                    {g.label}
                  </span>
                  <span className="studio-tiny" style={{ display: "block" }}>
                    {g.updatedAt ? `last edited ${ago(g.updatedAt)}` : "never edited"}
                  </span>
                </span>
                <Link className="studio-btn studio-btn--sm" href={g.href} target="_blank" rel="noopener">
                  Edit <SIcon name="arrowUpRight" size={11} />
                </Link>
              </div>
            ))}
          </div>
          <p className="studio-tiny" style={{ marginBlockStart: 12 }}>
            Offers drive the pricing page; Settings drive contact details and the CV link. Changing either revalidates the live
            site through the same hooks as a collection save.
          </p>
        </Tile>
      </div>
    </>
  );
}
