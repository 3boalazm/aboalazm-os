import Link from "next/link";
import { Chip, SIcon, Tile, ViewHeader, ago, num, shortTime } from "@/components/studio/ui";
import type { CmsInventory, Overview } from "@/lib/studio/metrics";

export function ManageView({ inventory, activity }: { inventory: CmsInventory; activity: Overview["activity"] }) {
  const groups = [...new Set(inventory.collections.map((c) => c.group))];

  return (
    <>
      <ViewHeader
        eyebrow="إدارة المحتوى (CMS)"
        title="كل ما يحتويه نظام المحتوى"
        description="إحصائيات حقيقية من PostgreSQL لجميع المجموعات العشر والإعدادين العامين. تصفّح، ارفع الوسائط، أنشئ مسودات، انشر وحدّث الموقع مباشرة من داخل الاستوديو."
        aside={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="studio-btn studio-btn--primary" href="/studio/manage/posts/new">
              + مقال جديد
            </Link>
            <Link className="studio-btn" href="/studio/manage/projects/new">
              + مشروع جديد
            </Link>
            <Link className="studio-btn" href="/studio/manage/media">
              مكتبة الوسائط <SIcon name="arrowLeft" size={14} />
            </Link>
          </div>
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
                        {col.drafts} مسودة
                      </Chip>
                    ) : undefined
                  }
                  provenance={
                    <>
                      صفوف <code>{col.slug}</code> · في {shortTime(inventory.asOf)}
                    </>
                  }
                >
                  <div className="studio-hero studio-mono">{num(col.total)}</div>
                  <p className="studio-sub" style={{ marginBlock: "2px 13px" }}>
                    {col.drafts == null
                      ? col.total === 1
                        ? "مستند واحد"
                        : `${num(col.total)} مستندات`
                      : `${num(col.total)} مستند · ${num(col.total - col.drafts)} منشور`}
                  </p>
                  <div style={{ display: "flex", gap: 7, marginBlockStart: "auto", flexWrap: "wrap" }}>
                    <Link className="studio-btn studio-btn--sm" href={col.href}>
                      فتح <SIcon name="arrowLeft" size={13} />
                    </Link>
                    {col.allowsCreate ? (
                      <Link className="studio-btn studio-btn--sm" href={col.createHref}>
                        جديد
                      </Link>
                    ) : null}
                  </div>
                </Tile>
              ))}
          </div>
        </div>
      ))}

      <div className="studio-bento">
        <Tile
          span="w7"
          title={<b>أحدث التعديلات</b>}
          aside={<Chip tone="neutral">الأحدث أولًا</Chip>}
          provenance={
            <>
              أحدث قيم <code>updatedAt</code> في المشاريع والمقالات ودراسات الحالة
            </>
          }
        >
          {activity.length === 0 ? (
            <p className="studio-sub">لا توجد عناصر محتوى بعد.</p>
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
                  <Chip tone={row.status === "published" ? "ok" : "warn"}>{row.status === "published" ? "منشور" : "مسودة"}</Chip>
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
          title={<b>الإعدادات العامة للموقع</b>}
          provenance={<>مستندات Payload العامة (Globals) — تُحرَّر مباشرة من داخل الاستوديو</>}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {inventory.globals.map((g) => (
              <div key={g.slug} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span className="studio-row__name" style={{ fontSize: 14 }}>
                    {g.label}
                  </span>
                  <span className="studio-tiny" style={{ display: "block" }}>
                    {g.updatedAt ? `آخر تعديل ${ago(g.updatedAt)}` : "لم يُعدّل بعد"}
                  </span>
                </span>
                <Link className="studio-btn studio-btn--sm" href={g.href}>
                  تعديل <SIcon name="arrowLeft" size={13} />
                </Link>
              </div>
            ))}
          </div>
          <p className="studio-tiny" style={{ marginBlockStart: 14 }}>
            مستند «العروض» يدير صفحة الباقات والأسعار؛ ومستند «الإعدادات» يدير بيانات التواصل وملف السيرة الذاتية. حفظ أي
            منهما يحدّث الموقع العام فورًا.
          </p>
        </Tile>
      </div>
    </>
  );
}
