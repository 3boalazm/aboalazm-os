"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chip, EmptyState, SIcon, Tile, ViewHeader, ago, num, shortTime, stageMeta, usd } from "@/components/studio/ui";
import { Toasts, useToasts } from "@/components/studio/interactive";
import { ManageNavStrip } from "@/components/studio/cms/editor-shell";
import { formatBytes, uploadMediaViaRest } from "@/components/studio/cms/media-picker";
import { deleteCollectionDocAction } from "@/app/studio/manage/actions";
import type { CollectionMeta } from "@/lib/studio/cms-meta";
import type { ListDocsResult } from "@/lib/studio/cms";

export function CollectionBrowser({
  meta,
  result,
  search,
  status,
  filter,
}: {
  meta: CollectionMeta;
  result: ListDocsResult;
  search: string;
  status: string;
  filter: string;
}) {
  const router = useRouter();
  const { toasts, push } = useToasts();
  const [query, setQuery] = useState(search);
  const [uploading, setUploading] = useState(false);

  const buildUrl = (overrides: { search?: string; status?: string; filter?: string; page?: number }) => {
    const sp = new URLSearchParams();
    const s = overrides.search !== undefined ? overrides.search : search;
    const st = overrides.status !== undefined ? overrides.status : status;
    const f = overrides.filter !== undefined ? overrides.filter : filter;
    const p = overrides.page !== undefined ? overrides.page : 1;
    if (s.trim()) sp.set("q", s.trim());
    if (st) sp.set("status", st);
    if (f) sp.set("filter", f);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/studio/manage/${meta.slug}${qs ? `?${qs}` : ""}`;
  };

  const handleQuickUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let okCount = 0;
    for (const file of Array.from(files)) {
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const res = await uploadMediaViaRest({ file, alt });
      if (res.ok) okCount += 1;
      else push("danger", `${file.name}: ${res.error}`);
    }
    setUploading(false);
    if (okCount > 0) {
      push("ok", `Uploaded ${okCount} file${okCount === 1 ? "" : "s"}`);
      router.refresh();
    }
  };

  const handleQuickDelete = async (id: number | string, label: string) => {
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    const res = await deleteCollectionDocAction(meta.slug, id);
    if (!res.ok) {
      push("danger", res.error);
      return;
    }
    push("ok", `Deleted ${label}`);
    router.refresh();
  };

  const filterOptions: { key: string; label: string }[] =
    meta.slug === "projects"
      ? [
          { key: "", label: "All categories" },
          { key: "design", label: "Design" },
          { key: "development", label: "Development" },
        ]
      : meta.slug === "posts"
        ? [
            { key: "", label: "All languages" },
            { key: "en", label: "English" },
            { key: "ar", label: "Arabic" },
          ]
        : meta.slug === "messages"
          ? [
              { key: "", label: "All enquiries" },
              { key: "unread", label: "Unread" },
              { key: "new", label: "New" },
              { key: "qualified", label: "Qualified" },
              { key: "proposal-sent", label: "Proposal" },
              { key: "won", label: "Won" },
              { key: "lost", label: "Lost" },
            ]
          : [];

  return (
    <>
      <ManageNavStrip activeSlug={meta.slug} />

      <ViewHeader
        eyebrow={`Manage · ${meta.group}`}
        title={meta.label}
        description={meta.description}
        aside={
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Link className="studio-btn" href="/studio/manage">
              ← Manage overview
            </Link>
            {meta.allowsCreate ? (
              <Link className="studio-btn studio-btn--primary" href={`/studio/manage/${meta.slug}/new`}>
                + New {meta.singular}
              </Link>
            ) : null}
          </div>
        }
      />

      {meta.slug === "projects" && !result.deliveryStatusAvailable ? (
        <div className="studio-warn-banner">
          <SIcon name="alert" size={14} />
          <span>
            This database does not have the <code>projects.status</code> column (<code>42703</code>). Project lists and edits stay
            safe without it; delivery status is omitted until synced.
          </span>
        </div>
      ) : null}

      {/* Quick upload dropzone for Media */}
      {meta.slug === "media" ? (
        <Tile
          span="w12"
          title={<b>Quick upload to Vercel Blob</b>}
          aside={<Chip tone="neutral">Images & PDFs</Chip>}
          provenance={<>Posts directly to Payload’s upload endpoint (<code>/api/media</code>) with your operator session</>}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="studio-input"
              style={{ maxWidth: 420 }}
              disabled={uploading}
              onChange={(e) => {
                void handleQuickUpload(e.target.files);
                e.currentTarget.value = "";
              }}
            />
            <span className="studio-sub" style={{ fontSize: 12 }}>
              {uploading ? "Uploading files…" : "Alt text defaults cleanly from filename and can be edited per asset."}
            </span>
          </div>
        </Tile>
      ) : null}

      {/* Search & filter bar */}
      <div className="studio-toolbar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(buildUrl({ search: query, page: 1 }));
          }}
          style={{ display: "flex", gap: 8, flex: "1 1 260px", maxWidth: 420 }}
        >
          <input
            className="studio-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${meta.label.toLowerCase()}…`}
          />
          <button type="submit" className="studio-btn">
            <SIcon name="search" size={13} /> Search
          </button>
          {search ? (
            <Link className="studio-btn" href={buildUrl({ search: "", page: 1 })}>
              Reset
            </Link>
          ) : null}
        </form>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {meta.drafts
            ? [
                { key: "", label: "All status" },
                { key: "published", label: "Published" },
                { key: "draft", label: "Drafts" },
              ].map((opt) => (
                <Link
                  key={opt.key || "all"}
                  href={buildUrl({ status: opt.key, page: 1 })}
                  className={`studio-btn studio-btn--sm ${status === opt.key ? "studio-btn--primary" : ""}`}
                >
                  {opt.label}
                </Link>
              ))
            : null}

          {filterOptions.map((opt) => (
            <Link
              key={opt.key || "all-f"}
              href={buildUrl({ filter: opt.key, page: 1 })}
              className={`studio-btn studio-btn--sm ${filter === opt.key ? "studio-btn--primary" : ""}`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      <Tile
        span="w12"
        title={<b>Records</b>}
        aside={<Chip tone="neutral">{num(result.totalDocs)} total</Chip>}
        provenance={<>Queried live from <code>{meta.slug}</code> · page {result.page} of {result.totalPages}</>}
      >
        {result.docs.length === 0 ? (
          <EmptyState
            title={`No ${meta.label.toLowerCase()} match`}
            body={
              search || status || filter
                ? "Try clearing the search or filter."
                : `Create your first ${meta.singular.toLowerCase()} to populate this collection.`
            }
            action={
              meta.allowsCreate ? (
                <Link className="studio-btn studio-btn--sm studio-btn--primary" href={`/studio/manage/${meta.slug}/new`}>
                  + New {meta.singular}
                </Link>
              ) : undefined
            }
          />
        ) : meta.slug === "media" ? (
          <div className="studio-media-gallery">
            {result.docs.map((doc) => {
              const id = doc.id as number | string;
              const url = doc.url as string | undefined;
              const filename = (doc.filename as string | undefined) ?? `#${id}`;
              const alt = (doc.alt as string | undefined) ?? filename;
              const mime = (doc.mimeType as string | undefined) ?? "";
              const pdf = mime.includes("pdf") || filename.toLowerCase().endsWith(".pdf");
              return (
                <div key={String(id)} className="studio-media-tile">
                  <Link href={`/studio/manage/media/${id}`} className="studio-media-tile__thumb">
                    {url && !pdf ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={alt} />
                    ) : (
                      <span className="studio-media-pdf">
                        <SIcon name={pdf ? "layers" : "image"} size={22} />
                        <span>{pdf ? "PDF" : `#${id}`}</span>
                      </span>
                    )}
                  </Link>
                  <div className="studio-media-tile__body">
                    <Link href={`/studio/manage/media/${id}`} className="studio-row__name" style={{ fontSize: 12.5 }}>
                      {alt}
                    </Link>
                    <span className="studio-tiny" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {filename} · {formatBytes(doc.filesize as number | undefined)}
                    </span>
                    <div style={{ display: "flex", gap: 6, marginBlockStart: 8, flexWrap: "wrap" }}>
                      <Link className="studio-btn studio-btn--sm" href={`/studio/manage/media/${id}`}>
                        Edit
                      </Link>
                      {url ? (
                        <button
                          type="button"
                          className="studio-btn studio-btn--sm"
                          onClick={() => {
                            void navigator.clipboard?.writeText(url);
                            push("info", "Copied media URL");
                          }}
                        >
                          Copy URL
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="studio-btn studio-btn--sm studio-btn--danger"
                        onClick={() => void handleQuickDelete(id, alt)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="studio-scroll-x">
            <table className="studio-table">
              <thead>
                <tr>
                  <th>{meta.slug === "users" || meta.slug === "resource-leads" ? "Email" : "Item"}</th>
                  <th>Details</th>
                  <th>{meta.drafts ? "Status" : meta.slug === "messages" ? "Stage" : "Updated"}</th>
                  <th className="num">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc) => {
                  const id = doc.id as number | string;
                  const href = `/studio/manage/${meta.slug}/${id}`;
                  const title =
                    (doc.name as string | undefined) ||
                    (doc.title as string | undefined) ||
                    (doc.author as string | undefined) ||
                    (doc.email as string | undefined) ||
                    `#${id}`;
                  const sub =
                    (doc.slug as string | undefined) ||
                    (doc.company as string | undefined) ||
                    (doc.resource as string | undefined) ||
                    (doc.path as string | undefined) ||
                    (doc.role as string | undefined) ||
                    (doc.quote as string | undefined) ||
                    "";
                  const thumb = doc.thumbnail as { url?: string } | undefined;
                  const photo = doc.photo as { url?: string } | undefined;
                  const imgUrl = thumb?.url || photo?.url;

                  return (
                    <tr key={String(id)}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {imgUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imgUrl}
                              alt=""
                              style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover", flex: "none", border: "1px solid var(--s-hair)" }}
                            />
                          ) : null}
                          <div style={{ minWidth: 0 }}>
                            <Link href={href} style={{ display: "block" }}>
                              {doc.isRead === false && meta.slug === "messages" ? (
                                <span className="studio-dot" style={{ display: "inline-block", marginInlineEnd: 6 }} />
                              ) : null}
                              {title}
                            </Link>
                            {sub ? (
                              <span className="studio-tiny" style={{ display: "block", maxWidth: "46ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {sub}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "var(--s-muted)", fontSize: 12 }}>
                        {renderSummaryCell(meta.slug, doc)}
                      </td>
                      <td>
                        {meta.drafts ? (
                          <Chip tone={doc._status === "published" ? "ok" : "warn"}>
                            {doc._status === "published" ? "published" : "draft"}
                          </Chip>
                        ) : meta.slug === "messages" ? (
                          <Chip tone={stageMeta(doc.leadStage as string | undefined).tone}>
                            {stageMeta(doc.leadStage as string | undefined).label}
                          </Chip>
                        ) : (
                          <span className="studio-tiny">{ago(doc.updatedAt as string | undefined)}</span>
                        )}
                      </td>
                      <td className="num">
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <Link className="studio-btn studio-btn--sm" href={href}>
                            {meta.slug === "analytics-events" ? "Inspect" : "Edit"}
                          </Link>
                          <button
                            type="button"
                            className="studio-btn studio-btn--sm studio-btn--danger"
                            onClick={() => void handleQuickDelete(id, title)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {result.totalPages > 1 ? (
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center", marginBlockStart: 12 }}>
            {result.page > 1 ? (
              <Link className="studio-btn studio-btn--sm" href={buildUrl({ page: result.page - 1 })}>
                ← Previous
              </Link>
            ) : null}
            <span className="studio-tiny">
              Page {result.page} / {result.totalPages}
            </span>
            {result.page < result.totalPages ? (
              <Link className="studio-btn studio-btn--sm" href={buildUrl({ page: result.page + 1 })}>
                Next →
              </Link>
            ) : null}
          </div>
        ) : null}
      </Tile>

      <Toasts items={toasts} />
    </>
  );
}

function renderSummaryCell(slug: string, doc: Record<string, unknown>): string {
  switch (slug) {
    case "projects":
      return [doc.category, doc.discipline, doc.year].filter(Boolean).join(" · ") || "—";
    case "case-studies":
      return [doc.discipline, doc.nameAr].filter(Boolean).join(" · ") || "—";
    case "posts":
      return [doc.index, doc.lang, doc.publishedAt ? shortTime(String(doc.publishedAt)) : null].filter(Boolean).join(" · ") || "—";
    case "testimonials":
      return [doc.role, doc.company, doc.record].filter(Boolean).join(" · ") || "—";
    case "team-members":
      return [`Order ${doc.order ?? 0}`, doc.nameAr].filter(Boolean).join(" · ");
    case "messages": {
      const val = doc.leadStage === "won" ? doc.wonValue : doc.proposalValue;
      return [doc.service, doc.budget, typeof val === "number" && val > 0 ? usd(val) : null, ago(doc.createdAt as string | undefined)]
        .filter(Boolean)
        .join(" · ");
    }
    case "resource-leads":
      return [doc.source, ago(doc.createdAt as string | undefined)].filter(Boolean).join(" · ") || "—";
    case "analytics-events":
      return [doc.locale, doc.device, doc.referrerHost, shortTime(String(doc.createdAt ?? ""))].filter(Boolean).join(" · ") || "—";
    case "users":
      return `Joined ${shortTime(String(doc.createdAt ?? ""))}`;
    default:
      return "—";
  }
}
