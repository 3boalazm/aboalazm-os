import Link from "next/link";
import { Chip, EmptyState, Provenance, RangeControl, SIcon, Tile, ViewHeader, ago, num, shortTime } from "@/components/studio/ui";
import type { ContentHealth, Overview } from "@/lib/studio/metrics";
import type { ContentPerfRow, SeoReport } from "@/lib/studio/seo";

const SEVERITY_LABEL = {
  danger: "حرج",
  warn: "تحذير",
  info: "معلومة",
} as const;

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
      label: "المشاريع",
      live: content.projectsPublished,
      draft: content.projectsDraft,
      href: "/studio/manage/projects",
      note: content.projectsWithoutThumbnail
        ? `${content.projectsWithoutThumbnail} مشروع منشور بدون صورة مصغرة`
        : "كل المشاريع المنشورة تحتوي على صورة مصغرة",
      warn: content.projectsWithoutThumbnail > 0,
    },
    {
      key: "posts",
      label: "المقالات",
      live: content.postsPublished,
      draft: content.postsDraft,
      href: "/studio/manage/posts",
      note: content.postsDraft ? "المسودات غير مرئية للزوار حتى يتم نشرها" : "كل المقالات المكتوبة منشورة حاليًا",
      warn: false,
    },
    {
      key: "case-studies",
      label: "دراسات الحالة",
      live: content.caseStudiesPublished,
      draft: 0,
      href: "/studio/manage/case-studies",
      note: "كل دراسة حالة تمثل صفحة تفصيلية كاملة",
      warn: false,
    },
    {
      key: "media",
      label: "الوسائط",
      live: content.mediaCount,
      draft: 0,
      href: "/studio/manage/media",
      note: "مخزّنة على Vercel Blob",
      warn: false,
    },
  ];

  return (
    <>
      <ViewHeader
        eyebrow="المحتوى والسيو"
        title="ما المنشور، وما يُقرأ، وما يحتاج إصلاحًا"
        description="حالة المحتوى مباشرة من نظام إدارة المحتوى، ومشاهدات القراءة من مُجمّع الطرف الأول، وقائمة فحص السيو المحسوبة من الصفوف الفعلية. بيانات Google لا تظهر إلا عند ربط Search Console."
        aside={
          <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <RangeControl current={overview.range.key} basePath="/studio/content" />
            <Link className="studio-btn" href="/studio/manage">
              إدارة المحتوى <SIcon name="arrowLeft" size={14} />
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
              <Link className="studio-tile__more" href={col.href}>
                فتح
              </Link>
            }
            provenance={
              <>
                حالة <code>_status</code> في <code>{col.key}</code>
              </>
            }
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="studio-hero studio-hero--xl studio-mono">{num(col.live)}</span>
              <span className="studio-up" style={{ paddingBlockEnd: 4 }}>
                منشور
              </span>
            </div>
            {col.draft > 0 ? (
              <div style={{ marginBlock: "7px 0" }}>
                <Chip tone="warn" icon="alert">
                  {col.draft} مسودة
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
          title={<b>الأكثر قراءة</b>}
          aside={<Chip tone="neutral">{overview.range.label}</Chip>}
          provenance={
            <>
              أحداث <code>pageview</code> من الطرف الأول مطابقةً بالمسار <code>slug</code> للمقالات ودراسات الحالة · فترة{" "}
              {overview.range.days} يومًا
            </>
          }
        >
          {!hasPageviews ? (
            <EmptyState
              title="لا توجد مشاهدات مسجّلة بعد"
              body="لا توجد أحداث في هذه الفترة لعرض ترتيب حقيقي. فور وصول الزوار سيظهر ترتيب كل مقال أو دراسة حالة بعدد مشاهداتها الفعلي."
              action={
                <Link className="studio-btn studio-btn--sm" href="/studio/analytics">
                  فتح التحليلات <SIcon name="arrowLeft" size={13} />
                </Link>
              }
            />
          ) : performance.length === 0 ? (
            <EmptyState
              title="توجد زيارات — لكن ليس على المقالات أو دراسات الحالة"
              body="توزّعت المشاهدات على صفحات الأقسام الرئيسية. يمكنك رؤية الصفحة الأعلى زيارة في شاشة التحليلات."
              action={
                <Link className="studio-btn studio-btn--sm" href="/studio/analytics">
                  عرض أعلى الصفحات <SIcon name="arrowLeft" size={13} />
                </Link>
              }
            />
          ) : (
            <div className="studio-rows">
              {performance.slice(0, 8).map((row) => (
                <Link key={row.path} href={row.href} className="studio-row" style={{ gridTemplateColumns: "minmax(0,1fr) auto auto" }}>
                  <span style={{ minWidth: 0 }}>
                    <span className="studio-row__name">{row.title}</span>
                    <span className="studio-row__meta">
                      <em>{row.kind}</em>
                      <span aria-hidden>·</span>
                      <em className="studio-mono">{row.path}</em>
                    </span>
                  </span>
                  <span className="studio-dist__track" style={{ width: 92, marginBlockStart: 0, gridColumn: "auto" }}>
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
          title={<b>فحص السيو وجودة الصفوف</b>}
          aside={
            seo.issues.length ? (
              <Chip tone={seo.issues.some((i) => i.severity === "danger") ? "danger" : "warn"} icon="alert">
                {seo.issues.length} ملاحظة
              </Chip>
            ) : (
              <Chip tone="ok" icon="check">
                سليم
              </Chip>
            )
          }
          provenance={
            <>
              فُحصت صفوف CMS في {shortTime(seo.asOf)} · {seo.checked.posts} مقال، {seo.checked.projects} مشروع،{" "}
              {seo.checked.caseStudies} دراسة حالة · كل ملاحظة تفتح المستند المعني مباشرة
            </>
          }
        >
          {seo.issues.length === 0 ? (
            <p className="studio-sub">
              لا توجد ملاحظات: كل المقالات المنشورة تملك وصفًا تعريفيًا، ولا توجد روابط مكررة أو بطاقات مشاريع بلا وجهة.
            </p>
          ) : (
            <div className="studio-rows">
              {seo.issues.slice(0, 7).map((issue, i) => (
                <Link key={`${issue.title}-${i}`} href={issue.href} className="studio-row" style={{ gridTemplateColumns: "auto minmax(0,1fr)" }}>
                  <Chip tone={issue.severity === "danger" ? "danger" : issue.severity === "warn" ? "warn" : "neutral"}>
                    {SEVERITY_LABEL[issue.severity]}
                  </Chip>
                  <span style={{ minWidth: 0 }}>
                    <span className="studio-row__name" style={{ fontSize: 13.5 }}>
                      {issue.title}
                    </span>
                    <span className="studio-row__meta">
                      <em style={{ whiteSpace: "normal" }}>{issue.detail}</em>
                    </span>
                  </span>
                </Link>
              ))}
              {seo.issues.length > 7 ? <p className="studio-tiny">…و{seo.issues.length - 7} ملاحظة أخرى داخل المجموعات.</p> : null}
            </div>
          )}
        </Tile>
      </div>

      <div className="studio-bento">
        <Tile
          span="w7"
          title={<b>أحدث التعديلات</b>}
          aside={<Chip tone="neutral">الأحدث أولًا</Chip>}
          provenance={
            <>
              أحدث قيم <code>updatedAt</code> عبر المشاريع والمقالات ودراسات الحالة
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
          title={<b>Google Search Console</b>}
          variant="invert"
          aside={searchConsoleConfigured ? <Chip tone="warn">بيانات الربط متوفرة</Chip> : <Chip tone="neutral">غير متصل</Chip>}
          provenance={
            <>
              حالة الربط من متغيرات البيئة في {shortTime(seo.asOf)} · لا يتم جلب أو تخمين أي بيانات من Google بدون ربط
            </>
          }
        >
          {searchConsoleConfigured ? (
            <p className="studio-sub" style={{ marginBlockEnd: 10 }}>
              بيانات حساب الخدمة موجودة في البيئة، لكن عميل الاستعلام غير مفعّل بعد — لذلك لا تُعرض مرات الظهور أو النقرات
              بدلًا من عرض رسم غير حقيقي.
            </p>
          ) : (
            <>
              <p className="studio-sub" style={{ marginBlockEnd: 10 }}>
                مرات الظهور والنقرات والترتيب العضوي تأتي من أنظمة Google. الربط <b style={{ color: "var(--s-ink)" }}>غير مفعّل</b>{" "}
                حاليًا، لذا لا نعرض مخططًا فارغًا قد يُفهم خطأً على أنه انعدام الزيارات من البحث.
              </p>
              <ul style={{ margin: "0 0 12px", paddingInlineStart: 18, display: "flex", flexDirection: "column", gap: 7, fontSize: 13, color: "var(--s-muted)", lineHeight: 1.55 }}>
                <li>أنشئ حساب خدمة Google وامنحه صلاحية قراءة خاصية Search Console.</li>
                <li>
                  اضبط المتغيرات <code>GOOGLE_SEARCH_CONSOLE_PROPERTY</code> و<code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code> و{" "}
                  <code>GOOGLE_SERVICE_ACCOUNT_KEY</code> في بيئة النشر.
                </li>
                <li>تتحدّث هذه البطاقة تلقائيًا مع الطلب التالي دون إعادة نشر.</li>
              </ul>
            </>
          )}
          <p className="studio-tiny">
            ما يزال غير مقاس أيضًا: عمق التمرير داخل المقالات (لا توجد أحداث تمرير) وبيانات Core Web Vitals الميدانية. فحص
            السيو أعلاه يغطي كل ما يمكن التحقق منه من قاعدة البيانات مباشرة.
          </p>
        </Tile>
      </div>

      <Tile
        span="w12"
        title={<b>الصحة التحريرية</b>}
        provenance={<>تُفحص العناصر المنشورة فقط — المسودة دون صورة مصغرة ليست خللًا بل عمل قيد الإعداد</>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 11 }}>
          <div className="studio-empty-state" style={{ textAlign: "start" }}>
            <strong className="studio-mono">{content.projectsWithoutThumbnail}</strong>
            <p>مشاريع منشورة بدون صورة مصغرة؛ تظهر كبطاقات فارغة في صفحة الأعمال.</p>
          </div>
          <div className="studio-empty-state" style={{ textAlign: "start" }}>
            <strong className="studio-mono">{content.projectsInProgress ?? "—"}</strong>
            <p>
              {content.projectsInProgress === null
                ? "غير متاح: عمود حالة التسليم غير موجود في قاعدة البيانات الحالية (راجع docs/studio/03_SCHEMA_FINDINGS.md §3)."
                : "مشاريع موسومة بأنها قيد التنفيذ وتظهر على الموقع بوسمها المناسب."}
            </p>
          </div>
          <div className="studio-empty-state" style={{ textAlign: "start" }}>
            <strong className="studio-mono">{content.postsDraft}</strong>
            <p>مسودات مقالات؛ نشر أي مسودة يحدّث أرشيف المقالات ومسار المقال تلقائيًا.</p>
          </div>
          <div className="studio-empty-state" style={{ textAlign: "start" }}>
            <strong>{overview.range.label}</strong>
            <p>نطاق التقرير النشط حاليًا؛ يطبّق على العملاء المحتملين والمشاهدات ويُحفظ في رابط الصفحة للمشاركة.</p>
          </div>
        </div>
      </Tile>

      <p className="studio-tiny" style={{ paddingInline: 4 }}>
        كل مستند هنا يُعدّل مباشرة داخل إدارة المحتوى في الاستوديو عبر Payload Local API بنفس قواعد الصلاحيات والمسودات والتحديث اللحظي.
      </p>
    </>
  );
}

void Provenance;
