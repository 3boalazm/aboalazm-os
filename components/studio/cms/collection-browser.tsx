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
      push("ok", okCount === 1 ? "تم رفع ملف واحد بنجاح" : `تم رفع ${okCount} ملفات بنجاح`);
      router.refresh();
    }
  };

  const handleQuickDelete = async (id: number | string, label: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف «${label}»؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    const res = await deleteCollectionDocAction(meta.slug, id);
    if (!res.ok) {
      push("danger", res.error);
      return;
    }
    push("ok", `تم حذف «${label}»`);
    router.refresh();
  };

  const filterOptions: { key: string; label: string }[] =
    meta.slug === "projects"
      ? [
          { key: "", label: "جميع الفئات" },
          { key: "design", label: "تصميم" },
          { key: "development", label: "تطوير وبرمجة" },
        ]
      : meta.slug === "posts"
        ? [
            { key: "", label: "جميع اللغات" },
            { key: "en", label: "الإنجليزية (EN)" },
            { key: "ar", label: "العربية (AR)" },
          ]
        : meta.slug === "messages"
          ? [
              { key: "", label: "جميع الاستفسارات" },
              { key: "unread", label: "غير مقروء" },
              { key: "new", label: "جديد" },
              { key: "qualified", label: "مؤهل" },
              { key: "proposal-sent", label: "عرض سعر" },
              { key: "won", label: "فائز" },
              { key: "lost", label: "خاسر" },
            ]
          : [];

  return (
    <>
      <ManageNavStrip activeSlug={meta.slug} />

      <ViewHeader
        eyebrow={`إدارة المحتوى · ${meta.group}`}
        title={meta.label}
        description={meta.description}
        aside={
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Link className="studio-btn" href="/studio/manage">
              <SIcon name="chevronRight" size={14} /> كل المجموعات
            </Link>
            {meta.allowsCreate ? (
              <Link className="studio-btn studio-btn--primary" href={`/studio/manage/${meta.slug}/new`}>
                + إضافة {meta.singular}
              </Link>
            ) : null}
          </div>
        }
      />

      {meta.slug === "projects" && !result.deliveryStatusAvailable ? (
        <div className="studio-warn-banner">
          <SIcon name="alert" size={16} />
          <span>
            قاعدة البيانات الحالية لا تحتوي على عمود <code>projects.status</code> (<code>42703</code>). تعمل قائمة المشاريع
            وتعديلها بأمان بدونه، مع إخفاء حالة التسليم مؤقتًا.
          </span>
        </div>
      ) : null}

      {meta.slug === "media" ? (
        <Tile
          span="w12"
          title={<b>رفع سريع إلى Vercel Blob</b>}
          aside={<Chip tone="neutral">صور وملفات PDF</Chip>}
          provenance={
            <>
              يرفع مباشرة إلى مسار Payload (<code>/api/media</code>) باستخدام جلسة دخولك الحالية
            </>
          }
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="studio-input"
              style={{ maxWidth: 440 }}
              disabled={uploading}
              onChange={(e) => {
                void handleQuickUpload(e.target.files);
                e.currentTarget.value = "";
              }}
            />
            <span className="studio-sub" style={{ fontSize: 13 }}>
              {uploading ? "جارٍ رفع الملفات…" : "يُنشأ النص البديل تلقائيًا من اسم الملف ويمكن تعديله لكل ملف على حدة."}
            </span>
          </div>
        </Tile>
      ) : null}

      {/* شريط البحث والتصفية */}
      <div className="studio-toolbar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(buildUrl({ search: query, page: 1 }));
          }}
          style={{ display: "flex", gap: 8, flex: "1 1 280px", maxWidth: 440 }}
        >
          <input
            className="studio-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`ابحث في ${meta.label}…`}
          />
          <button type="submit" className="studio-btn">
            <SIcon name="search" size={14} /> بحث
          </button>
          {search ? (
            <Link className="studio-btn" href={buildUrl({ search: "", page: 1 })}>
              إعادة ضبط
            </Link>
          ) : null}
        </form>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {meta.drafts
            ? [
                { key: "", label: "جميع الحالات" },
                { key: "published", label: "منشور" },
                { key: "draft", label: "مسودة" },
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

      {/* النتائج */}
      <Tile
        span="w12"
        title={<b>السجلات</b>}
        aside={<Chip tone="neutral">{num(result.totalDocs)} سجل</Chip>}
        provenance={
          <>
            قراءة حية من <code>{meta.slug}</code> · صفحة {result.page} من {result.totalPages}
          </>
        }
      >
        {result.docs.length === 0 ? (
          <EmptyState
            title={`لا توجد نتائج مطابقة في ${meta.label}`}
            body={
              search || status || filter
                ? "جرّب مسح نص البحث أو إزالة الفلاتر المختارة."
                : `أضف أول ${meta.singular} لبدء تعبئة هذه المجموعة.`
            }
            action={
              meta.allowsCreate ? (
                <Link className="studio-btn studio-btn--sm studio-btn--primary" href={`/studio/manage/${meta.slug}/new`}>
                  + إضافة {meta.singular}
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
                        <SIcon name={pdf ? "layers" : "image"} size={24} />
                        <span>{pdf ? "PDF" : `#${id}`}</span>
                      </span>
                    )}
                  </Link>
                  <div className="studio-media-tile__body">
                    <Link href={`/studio/manage/media/${id}`} className="studio-row__name" style={{ fontSize: 13.5 }}>
                      {alt}
                    </Link>
                    <span className="studio-tiny studio-mono" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {filename} · {formatBytes(doc.filesize as number | undefined)}
                    </span>
                    <div style={{ display: "flex", gap: 6, marginBlockStart: 8, flexWrap: "wrap" }}>
                      <Link className="studio-btn studio-btn--sm" href={`/studio/manage/media/${id}`}>
                        تعديل
                      </Link>
                      {url ? (
                        <button
                          type="button"
                          className="studio-btn studio-btn--sm"
                          onClick={() => {
                            void navigator.clipboard?.writeText(url);
                            push("info", "تم نسخ رابط الملف");
                          }}
                        >
                          نسخ الرابط
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="studio-btn studio-btn--sm studio-btn--danger"
                        onClick={() => void handleQuickDelete(id, alt)}
                      >
                        حذف
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
                  <th>{meta.slug === "users" || meta.slug === "resource-leads" ? "البريد الإلكتروني" : "العنصر"}</th>
                  <th>التفاصيل</th>
                  <th>{meta.drafts ? "الحالة" : meta.slug === "messages" ? "المرحلة" : "آخر تحديث"}</th>
                  <th className="num">إجراءات</th>
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
                              style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flex: "none", border: "1px solid var(--s-hair)" }}
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
                      <td style={{ color: "var(--s-muted)", fontSize: 13 }}>
                        {renderSummaryCell(meta.slug, doc)}
                      </td>
                      <td>
                        {meta.drafts ? (
                          <Chip tone={doc._status === "published" ? "ok" : "warn"}>
                            {doc._status === "published" ? "منشور" : "مسودة"}
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
                            {meta.slug === "analytics-events" ? "فحص" : "تعديل"}
                          </Link>
                          <button
                            type="button"
                            className="studio-btn studio-btn--sm studio-btn--danger"
                            onClick={() => void handleQuickDelete(id, title)}
                          >
                            حذف
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

        {/* الترقيم */}
        {result.totalPages > 1 ? (
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center", marginBlockStart: 14 }}>
            {result.page > 1 ? (
              <Link className="studio-btn studio-btn--sm" href={buildUrl({ page: result.page - 1 })}>
                <SIcon name="chevronRight" size={13} /> السابق
              </Link>
            ) : null}
            <span className="studio-tiny studio-mono">
              {result.page} / {result.totalPages}
            </span>
            {result.page < result.totalPages ? (
              <Link className="studio-btn studio-btn--sm" href={buildUrl({ page: result.page + 1 })}>
                التالي <SIcon name="chevronLeft" size={13} />
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
      return [doc.category === "design" ? "تصميم" : doc.category === "development" ? "تطوير" : doc.category, doc.discipline, doc.year]
        .filter(Boolean)
        .join(" · ") || "—";
    case "case-studies":
      return [doc.discipline, doc.nameAr].filter(Boolean).join(" · ") || "—";
    case "posts":
      return [doc.index, doc.lang, doc.publishedAt ? shortTime(String(doc.publishedAt)) : null].filter(Boolean).join(" · ") || "—";
    case "testimonials":
      return [doc.role, doc.company, doc.record].filter(Boolean).join(" · ") || "—";
    case "team-members":
      return [`الترتيب ${doc.order ?? 0}`, doc.nameAr].filter(Boolean).join(" · ");
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
      return `تاريخ الإنشاء: ${shortTime(String(doc.createdAt ?? ""))}`;
    default:
      return "—";
  }
}
