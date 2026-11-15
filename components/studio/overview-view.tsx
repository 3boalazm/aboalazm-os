import Link from "next/link";
import {
  Chip,
  Delta,
  EmptyState,
  RangeControl,
  SIcon,
  Tile,
  ViewHeader,
  ago,
  initials,
  num,
  probeStateLabel,
  shortTime,
  stageMeta,
  usd,
} from "@/components/studio/ui";
import { deltaOf, type Overview, type Probe } from "@/lib/studio/metrics";
import type { analyticsSummary } from "@/lib/studio/analytics";

/**
 * النظرة العامة — ثلاثة أسئلة بالترتيب:
 *   1. ما الذي ينتظر انتباهك الآن؟
 *   2. كيف يسير الأداء؟
 *   3. ما حالة المحتوى والنظام؟
 */
export function OverviewView({ data, traffic }: { data: Overview; traffic?: Awaited<ReturnType<typeof analyticsSummary>> }) {
  const { leads, content, activity, resources, probes } = data;
  const all = leads.all;
  const unreadList = leads.recent.filter((l) => !l.isRead);
  const qualified = all.byStage.qualified ?? 0;
  const proposal = all.byStage["proposal-sent"] ?? 0;
  const won = all.byStage.won ?? 0;
  const lost = (all.byStage.lost ?? 0) + (all.byStage["not-a-fit"] ?? 0);

  const leadDelta = deltaOf({
    id: "leads",
    label: "الاستفسارات",
    value: leads.window.total,
    previous: leads.window.previous,
    definition: "",
    source: "",
    asOf: data.asOf,
  });

  const funnelMax = Math.max(all.total, 1);
  const funnel = [
    { key: "captured", label: "استفسارات محفوظة", value: all.total },
    { key: "qualified", label: "مؤهل", value: qualified + proposal + won },
    { key: "proposal", label: "أُرسل عرض سعر", value: proposal + won },
    { key: "won", label: "صفقة فائزة", value: won },
  ];

  const fails = probes.filter((p) => p.state === "fail");
  const warns = probes.filter((p) => p.state === "warn");

  return (
    <>
      <ViewHeader
        eyebrow={`النظرة العامة · ${data.range.label}`}
        title="ما يحتاج إليك الآن"
        description="كل رقم أدناه يُقرأ لحظيًا من قاعدة بيانات PostgreSQL مع كل طلب، وكل بطاقة توضّح ما تحسبه ومصدره. لا توجد أي أرقام تقديرية أو تجريبية هنا."
        aside={<RangeControl current={data.range.key} basePath="/studio" />}
      />

      <div className="studio-bento">
        {/* ── 1 · بانتظارك ──────────────────────────────────────────────── */}
        <Tile
          span="w7"
          variant="accent"
          title={<b>بانتظار ردك</b>}
          aside={
            unreadList.length ? (
              <Chip tone="accent" dot>
                {unreadList.length} غير مقروء
              </Chip>
            ) : (
              <Chip tone="ok" icon="check">
                الصندوق مقروء بالكامل
              </Chip>
            )
          }
          provenance={
            <>
              {unreadList.length ? `${unreadList.length} من أصل ${num(all.total)} سجل في ` : `إجمالي ${num(all.total)} سجل في `}
              <code>messages</code> · آخر قراءة: {shortTime(data.asOf)}
            </>
          }
        >
          {leads.recent.length === 0 ? (
            <EmptyState
              title="لا توجد استفسارات بعد"
              body="هذه حالة فراغ حقيقية من قاعدة البيانات وليست عنصرًا تجريبيًا. فور إرسال أي زائر نموذج التواصل سيظهر هنا."
              action={
                <Link className="studio-btn studio-btn--sm" href="/contact" target="_blank" rel="noopener">
                  فتح صفحة التواصل <SIcon name="arrowUpRight" size={13} />
                </Link>
              }
            />
          ) : (
            <div className="studio-rows">
              {leads.recent.slice(0, 4).map((lead) => {
                const stage = stageMeta(lead.leadStage);
                return (
                  <Link
                    key={String(lead.id)}
                    href={`/studio/manage/messages/${lead.id}`}
                    className="studio-row"
                    style={{ gridTemplateColumns: "30px minmax(0,1fr) auto" }}
                  >
                    <span className="studio-ava">{initials(lead.name ?? "؟")}</span>
                    <span style={{ minWidth: 0 }}>
                      <span className="studio-row__name">
                        {lead.isRead ? null : <span className="studio-dot" style={{ display: "inline-block", marginInlineEnd: 6, verticalAlign: "middle" }} />}
                        {lead.name ?? "بدون اسم"}
                      </span>
                      <span className="studio-row__meta">
                        <em>{lead.company || lead.email}</em>
                        <span aria-hidden>·</span>
                        <em>{lead.sourcePage || "مباشر"}</em>
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

        {/* ── 2 · مسار المبيعات ─────────────────────────────────────────── */}
        <Tile
          span="w5"
          title={<b>قيمة الفرص والعقود</b>}
          aside={
            <Chip tone={proposal ? "warn" : "neutral"} dot={Boolean(proposal)}>
              {proposal} بمرحلة عرض السعر
            </Chip>
          }
          provenance={
            <>
              مجموع <code>proposalValue</code> في المراحل المفتوحة و<code>wonValue</code> في الصفقات الفائزة · مُدخلة يدويًا وليست تقديرية
            </>
          }
        >
          <p className="studio-up" style={{ margin: "0 0 3px" }}>
            العروض المفتوحة
          </p>
          <div className="studio-hero studio-hero--xl studio-mono">{usd(all.openProposalValue)}</div>
          <div style={{ display: "flex", gap: 18, marginBlock: "13px 6px", flexWrap: "wrap" }}>
            <span>
              <span className="studio-up" style={{ display: "block" }}>
                القيمة المتعاقد عليها
              </span>
              <b className="studio-num" style={{ fontSize: 17 }}>
                {usd(all.contractedValue)}
              </b>
            </span>
            <span>
              <span className="studio-up" style={{ display: "block" }}>
                فائز
              </span>
              <b className="studio-num" style={{ fontSize: 17 }}>
                {won}
              </b>
            </span>
            <span>
              <span className="studio-up" style={{ display: "block" }}>
                خاسر / غير مناسب
              </span>
              <b className="studio-num" style={{ fontSize: 17 }}>
                {lost}
              </b>
            </span>
          </div>
          <p className="studio-tiny" style={{ marginBlockStart: "auto" }}>
            القيمة المتعاقد عليها تعبّر عن قيمة العقود الموقّعة فقط، وليست إيرادات محققة.
          </p>
        </Tile>

        {/* ── 3 · قمع التحويل ───────────────────────────────────────────── */}
        <Tile
          span="w8"
          title={<b>مسار تحويل الاستفسارات</b>}
          aside={<Chip tone="neutral">كل الفترات</Chip>}
          provenance={
            <>
              توزيع الحالات من <code>messages.leadStage</code> · المراحل يحدّدها فريقك يدويًا
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
                  <span className="studio-funnel__count studio-mono">
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
          <p className="studio-tiny" style={{ marginBlockStart: 12 }}>
            يبدأ هذا القمع من <b>الاستفسارات المحفوظة</b> ليركّز على الصفقات الفعلية. أمّا مسار الزيارة الكامل (تصفح ← نقر ←
            نموذج ← إرسال) فيظهر في شاشة التحليلات من مخزننا الخاص؛ إذ لا تزال تجميعات المزوّد الخارجي مقيدة (HTTP 402).
          </p>
        </Tile>

        {/* ── 4 · أداء الفترة ───────────────────────────────────────────── */}
        <Tile
          span="w4"
          title={<b>خلال هذه الفترة</b>}
          aside={<Chip tone="neutral">{data.range.label}</Chip>}
          provenance={
            <>
              <code>messages.createdAt</code> خلال آخر {data.range.days} يومًا · مقارنة بالـ {data.range.days} يومًا السابقة
            </>
          }
        >
          <p className="studio-up" style={{ margin: "0 0 3px" }}>
            استفسارات جديدة
          </p>
          <div className="studio-hero studio-mono">{num(leads.window.total)}</div>
          <div style={{ marginBlock: "8px 13px" }}>
            <Delta pct={leadDelta.pct} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBlockStart: "auto" }}>
            <span className="studio-row__meta" style={{ justifyContent: "space-between" }}>
              <span>فائز خلال الفترة</span>
              <b className="studio-num" style={{ color: "var(--s-ink)" }}>
                {leads.window.won}
              </b>
            </span>
            <span className="studio-row__meta" style={{ justifyContent: "space-between" }}>
              <span>تسجيلات الموارد</span>
              <b className="studio-num" style={{ color: "var(--s-ink)" }}>
                {resources.inWindow}
              </b>
            </span>
          </div>
        </Tile>

        {/* ── 4b · حركة الزيارات ─────────────────────────────────────────── */}
        {traffic ? (
          <Tile
            span="w4"
            variant="aurora"
            title={<b>حركة الزيارات</b>}
            aside={
              <Link className="studio-tile__more" href="/studio/analytics">
                التفاصيل الكاملة
              </Link>
            }
            provenance={
              <>
                أحداث <code>pageview</code> من الطرف الأول في <code>analytics-events</code> · إحصائيات المزود الخارجي ما زالت تعيد HTTP 402
              </>
            }
          >
            {traffic.totalEvents === 0 ? (
              <EmptyState
                title="المُجمّع جاهز — لا توجد زيارات بعد"
                body="هذه حالة فراغ حقيقية. زر الموقع العام مرة واحدة وستصل القراءات هنا فورًا."
              />
            ) : (
              <>
                <p className="studio-up" style={{ margin: "0 0 3px" }}>
                  مشاهدات الصفحة · {data.range.label}
                </p>
                <div className="studio-hero studio-mono">{num(traffic.pageviews)}</div>
                <div style={{ marginBlock: "8px 13px" }}>
                  <Delta
                    pct={
                      traffic.prevPageviews
                        ? Math.round(((traffic.pageviews - traffic.prevPageviews) / traffic.prevPageviews) * 100)
                        : traffic.pageviews
                          ? null
                          : 0
                    }
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBlockStart: "auto" }}>
                  <span className="studio-row__meta" style={{ justifyContent: "space-between" }}>
                    <span>الجلسات</span>
                    <b className="studio-num" style={{ color: "var(--s-ink)" }}>
                      {num(traffic.sessions)}
                    </b>
                  </span>
                  <span className="studio-row__meta" style={{ justifyContent: "space-between" }}>
                    <span>الأحداث المحفوظة</span>
                    <b className="studio-num" style={{ color: "var(--s-ink)" }}>
                      {num(traffic.totalEvents)}
                    </b>
                  </span>
                </div>
              </>
            )}
          </Tile>
        ) : null}

        {/* ── 5 · مصادر الاستفسارات ─────────────────────────────────────── */}
        <Tile
          span="w5"
          title={<b>من أين تأتي الاستفسارات</b>}
          aside={<Chip tone="neutral">{data.range.label}</Chip>}
          provenance={
            <>
              <code>messages.sourcePage</code> + <code>utmSource</code> · كل صف يمثل استفسارًا محفوظًا
            </>
          }
        >
          {leads.window.total === 0 ? (
            <EmptyState
              title="لا توجد استفسارات في هذه الفترة"
              body="وسّع النطاق الزمني أو تحقق من استقبال نموذج التواصل. لا توجد بيانات وهمية هنا."
            />
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
                      <span className="studio-dist__label studio-mono" title={row.label}>
                        {row.label}
                      </span>
                      <span className="studio-dist__val studio-mono">{row.value}</span>
                      <span className="studio-dist__track">
                        <span className="studio-dist__fill" style={{ width: `${(row.value / max) * 100}%` }} />
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </Tile>

        {/* ── 6 · بوابة الموارد ─────────────────────────────────────────── */}
        <Tile
          span="w3"
          title={<b>بوابة الموارد</b>}
          provenance={
            <>
              سجلات <code>resource-leads</code> · عناوين البريد المسجلة من صفحة /resources
            </>
          }
        >
          <div className="studio-hero studio-mono">{num(resources.total)}</div>
          <p className="studio-sub" style={{ marginBlock: "2px 11px" }}>
            بريد مسجّل
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
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
            {resources.total === 0 ? <span className="studio-tiny">لم يُسجّل أي تحميل بعد.</span> : null}
          </div>
        </Tile>

        {/* ── 7 · صحة المحتوى ───────────────────────────────────────────── */}
        <Tile
          span="w4"
          title={<b>حالة المحتوى</b>}
          aside={
            <Link className="studio-tile__more" href="/studio/content">
              التفاصيل
            </Link>
          }
          provenance={
            <>
              حقل <code>_status</code> في المشاريع والمقالات ودراسات الحالة · تُفحص الصور على الصفوف المنشورة فقط
            </>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
            {[
              { label: "مشاريع منشورة", value: content.projectsPublished, sub: `${content.projectsDraft} مسودة` },
              { label: "مقالات منشورة", value: content.postsPublished, sub: `${content.postsDraft} مسودة` },
              { label: "دراسات الحالة", value: content.caseStudiesPublished, sub: "منشورة" },
              { label: "ملفات الوسائط", value: content.mediaCount, sub: "في المكتبة" },
            ].map((s) => (
              <span key={s.label}>
                <span className="studio-up" style={{ display: "block" }}>
                  {s.label}
                </span>
                <b className="studio-hero studio-mono" style={{ fontSize: 23, fontWeight: 500 }}>
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
              يوجد {content.projectsWithoutThumbnail} مشروع منشور بدون صورة مصغرة — يظهر فارغًا في صفحة الأعمال.
            </p>
          ) : null}
        </Tile>

        {/* ── 8 · أحدث التعديلات ─────────────────────────────────────────── */}
        <Tile
          span="w5"
          title={<b>أحدث التعديلات</b>}
          provenance={
            <>
              أحدث قيمة <code>updatedAt</code> عبر المشاريع والمقالات ودراسات الحالة
            </>
          }
        >
          <div className="studio-rows">
            {activity.map((row) => (
              <Link key={row.id} href={row.href} className="studio-row" style={{ gridTemplateColumns: "minmax(0,1fr) auto", padding: "8px 7px" }}>
                <span style={{ minWidth: 0 }}>
                  <span className="studio-row__name">{row.title}</span>
                  <span className="studio-row__meta">
                    <em>{row.kind}</em>
                    <span aria-hidden>·</span>
                    <em>{row.status === "published" ? "منشور" : "مسودة"}</em>
                  </span>
                </span>
                <span className="studio-tiny" style={{ whiteSpace: "nowrap" }}>
                  {ago(row.at)}
                </span>
              </Link>
            ))}
            {activity.length === 0 ? <span className="studio-tiny">لا يوجد محتوى حتى الآن.</span> : null}
          </div>
        </Tile>

        {/* ── 9 · حالة النظام ───────────────────────────────────────────── */}
        <Tile
          span="w3"
          title={<b>النظام</b>}
          aside={
            <Link className="studio-tile__more" href="/studio/system">
              كل الفحوصات
            </Link>
          }
          provenance={
            <>
              فحوصات حية لقاعدة البيانات والتخزين والبريد والتحليلات · فُحصت في {shortTime(probes[0]?.checkedAt ?? data.asOf)}
            </>
          }
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBlockEnd: 11 }}>
            {fails.length ? (
              <Chip tone="danger" icon="x">
                {fails.length} عطل
              </Chip>
            ) : (
              <Chip tone="ok" icon="check">
                0 أعطال
              </Chip>
            )}
            {warns.length ? (
              <Chip tone="warn" icon="alert">
                {warns.length} تحذير
              </Chip>
            ) : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBlockStart: "auto" }}>
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
      {probeStateLabel(probe.state)}
    </Chip>
  );
}
