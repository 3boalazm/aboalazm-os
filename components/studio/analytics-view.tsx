import Link from "next/link";
import { AreaChart, Chip, Delta, EmptyState, RangeControl, SIcon, Sparkline, Tile, ViewHeader, num, shortTime } from "@/components/studio/ui";
import type { AnalyticsReport } from "@/lib/studio/analytics";

export function AnalyticsView({ report }: { report: AnalyticsReport }) {
  const { funnel } = report;
  const funnelMax = Math.max(1, funnel.steps[0]?.sessions ?? 0);
  const coverage = report.totalEvents > 0 ? Math.round((funnel.eventsWithSession / report.totalEvents) * 100) : 0;

  const pageviewDelta = pctChange(report.pageviews, report.prevPageviews);
  const sessionDelta = pctChange(report.sessions, report.prevSessions);

  return (
    <>
      <ViewHeader
        eyebrow={`التحليلات · ${report.range.label}`}
        title="من زار الموقع، وإلى أين وصل"
        description="قراءات من مخزن الأحداث الأولي الخاص بنا (analytics-events). تجميعات المزود الخارجي ما زالت مقيدة على الخطة الحالية (HTTP 402)، لذا لا يُقرأ أي رقم أدناه منها."
        aside={<RangeControl current={report.range.key} basePath="/studio/analytics" />}
      />

      {!report.hasData ? (
        <Tile
          span="w12"
          title={<b>حالة مُجمّع التحليلات</b>}
          provenance={
            <>
              فُحص جدول <code>analytics-events</code> لآخر {report.range.days} يومًا · قُرئ في {shortTime(report.asOf)}
            </>
          }
        >
          <EmptyState
            title="المُجمّع فعّال — لا توجد أحداث مسجّلة في هذه الفترة"
            body="هذه حالة فراغ حقيقية. افتح الموقع العام وتنقّل بين صفحاته ثم أعد تحميل هذه الشاشة لتظهر القراءات فورًا."
            action={
              <Link className="studio-btn studio-btn--sm" href="/" target="_blank" rel="noopener">
                فتح الموقع العام <SIcon name="arrowUpRight" size={13} />
              </Link>
            }
          />
        </Tile>
      ) : (
        <>
          <div className="studio-bento">
            <Tile
              span="w3"
              title={<b>مشاهدات الصفحة</b>}
              aside={<Delta pct={pageviewDelta} />}
              provenance={
                <>
                  أحداث <code>pageview</code> المخزّنة · قراءة واحدة لكل انتقال مسار (دون سلسلة الاستعلام)
                </>
              }
            >
              <div className="studio-hero studio-hero--xl studio-mono">{num(report.pageviews)}</div>
              <div style={{ marginBlockStart: 8 }}>
                <Sparkline values={report.daily.map((d) => d.pageviews)} />
              </div>
            </Tile>

            <Tile
              span="w3"
              title={<b>الجلسات</b>}
              aside={<Delta pct={sessionDelta} />}
              provenance={
                <>
                  معرّفات <code>sessionId</code> عشوائية مميزة لكل تبويب · الجلسة ليست شخصًا بعينه
                </>
              }
            >
              <div className="studio-hero studio-hero--xl studio-mono">{num(report.sessions)}</div>
              <div style={{ marginBlockStart: 8 }}>
                <Sparkline values={report.daily.map((d) => d.sessions)} />
              </div>
            </Tile>

            <Tile
              span="w3"
              title={<b>استفسارات محفوظة</b>}
              provenance={
                <>
                  صفوف <code>messages</code> المنشأة خلال الفترة · شهادة قاعدة البيانات وليس المتصفح
                </>
              }
            >
              <div className="studio-hero studio-hero--xl studio-mono">{num(report.enquiriesSaved)}</div>
              <p className="studio-sub" style={{ marginBlockStart: 4 }}>
                {report.contactSubmitEvents} حدث <code>contact_submit</code> أُرسل من المتصفح
              </p>
            </Tile>

            <Tile
              span="w3"
              title={<b>إجمالي الأحداث</b>}
              provenance={
                <>
                  كل الصفوف في <code>analytics-events</code> بهذه الفترة · {coverage}% تحمل معرّف جلسة
                </>
              }
            >
              <div className="studio-hero studio-hero--xl studio-mono">{num(report.totalEvents)}</div>
              <p className="studio-sub" style={{ marginBlockStart: 4 }}>
                {funnel.sessionsWithId} جلسة متتبّعة · الجلسات المعطّلة التخزين تُعدّ كأحداث فقط
              </p>
            </Tile>
          </div>

          <div className="studio-bento">
            <Tile
              span="w8"
              title={<b>الزيارات يومًا بيوم</b>}
              aside={<Chip tone="neutral">{report.range.label}</Chip>}
              provenance={
                <>
                  تجميع يومي (UTC) لأحداث <code>pageview</code> والجلسات المميزة · قُرئ في {shortTime(report.asOf)}
                </>
              }
            >
              <AreaChart points={report.daily} />
            </Tile>

            <Tile
              span="w4"
              title={<b>قمع الجلسات</b>}
              provenance={
                <>
                  الجلسات المميزة التي سجلت حدثًا واحدًا على الأقل في كل خطوة · تقارن مع الاستفسارات المحفوظة في القاعدة
                </>
              }
            >
              <div className="studio-funnel">
                {funnel.steps.map((step) => (
                  <div className="studio-funnel__step" key={step.key} style={{ gridTemplateColumns: "122px minmax(0,1fr) auto" }}>
                    <span className="studio-funnel__label">{step.label}</span>
                    <span className="studio-funnel__track">
                      <span className="studio-funnel__fill" style={{ width: `${Math.max((step.sessions / funnelMax) * 100, step.sessions ? 4 : 0)}%` }} />
                    </span>
                    <span className="studio-funnel__count studio-mono">
                      {num(step.sessions)}
                      {step.pctOfFirst != null ? (
                        <span className="studio-tiny" style={{ display: "block", fontWeight: 400 }}>
                          {step.pctOfFirst}% من الزوار
                        </span>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
              <p className="studio-tiny" style={{ marginBlockStart: 12 }}>
                الخطوة الأخيرة إشارة من المتصفح، بينما بطاقة «استفسارات محفوظة» أعلاه هي تأكيد قاعدة البيانات الفعلي.
              </p>
            </Tile>
          </div>

          <div className="studio-bento">
            <Tile
              span="w7"
              title={<b>أكثر الصفحات زيارة</b>}
              aside={<Chip tone="neutral">دمج بادئات اللغة</Chip>}
              provenance={
                <>
                  مسارات <code>pageview</code> مع دمج <code>/en</code> و<code>/ar</code> و<code>/ms</code> معًا
                </>
              }
            >
              {report.topPages.length === 0 ? (
                <EmptyState
                  title="لا توجد مشاهدات صفحات في هذه الفترة"
                  body="توجد أحداث مسجّلة، لكن لا يوجد بينها أحداث pageview — تأكد من تثبيت PageviewTracker في تخطيط الموقع."
                />
              ) : (
                <div className="studio-scroll-x">
                  <table className="studio-table">
                    <thead>
                      <tr>
                        <th>المسار</th>
                        <th style={{ textAlign: "end" }}>المشاهدات</th>
                        <th style={{ textAlign: "end" }}>النسبة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.topPages.map(([path, views]) => (
                        <tr key={path}>
                          <td className="studio-mono" style={{ fontSize: 13 }}>
                            {path}
                          </td>
                          <td className="num studio-mono">{num(views)}</td>
                          <td className="num studio-mono" style={{ color: "var(--s-muted)" }}>
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
                title={<b>مصادر الإحالة والحملات</b>}
                provenance={
                  <>
                    نطاق المُحيل <b>فقط</b> في مشاهدات الصفحة · الروابط الكاملة لا تُحفظ حفاظًا على الخصوصية
                  </>
                }
              >
                {report.referrers.length === 0 && report.campaigns.length === 0 ? (
                  <p className="studio-sub">لم تُسجّل إحالات خارجية أو حملات — الزيارات المباشرة لا تحمل أيًا منهما.</p>
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
                title={<b>اللغة والجهاز</b>}
                provenance={
                  <>
                    خاصية <code>locale</code> · تصنيف الجهاز يُستخلص وقت الاستقبال دون تخزين سلسلة User-Agent
                  </>
                }
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
            title={<b>توزيع الأحداث</b>}
            aside={
              <Link className="studio-tile__more" href="/studio/manage/analytics-events">
                السجلات الخام
              </Link>
            }
            provenance={
              <>
                العدد حسب اسم الحدث في <code>analytics-events</code> · تعريفات الأحداث في docs/EVENTS.md
              </>
            }
          >
            <div className="studio-scroll-x">
              <table className="studio-table">
                <thead>
                  <tr>
                    <th>الحدث</th>
                    <th style={{ textAlign: "end" }}>العدد</th>
                    <th style={{ textAlign: "end" }}>النسبة</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topEvents.map(([name, count]) => (
                    <tr key={name}>
                      <td className="studio-mono" style={{ fontSize: 13 }}>
                        {name}
                      </td>
                      <td className="num studio-mono">{num(count)}</td>
                      <td className="num studio-mono" style={{ color: "var(--s-muted)" }}>
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
      <span className="studio-dist__label studio-mono" title={label}>
        {label}
      </span>
      <span className="studio-dist__val studio-mono">{num(value)}</span>
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
