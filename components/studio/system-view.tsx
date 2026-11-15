import Link from "next/link";
import { Chip, EmptyState, ProbeRow, SIcon, Tile, ViewHeader, shortTime } from "@/components/studio/ui";
import type { EnvRow, Probe } from "@/lib/studio/metrics";

export function SystemView({ probes, env }: { probes: Probe[]; env: EnvRow[] }) {
  const fails = probes.filter((p) => p.state === "fail");
  const warns = probes.filter((p) => p.state === "warn");
  const oks = probes.filter((p) => p.state === "ok");
  const checkedAt = probes[0]?.checkedAt ?? new Date().toISOString();

  return (
    <>
      <ViewHeader
        eyebrow="النظام والتكاملات"
        title="ما يعمل فعليًا، وما ينقصه الربط"
        description="كل صف أدناه نفّذ فحصًا حقيقيًا خلال هذا الطلب. أي فحص يتعذر التحقق منه من بيئة التشغيل يُذكر بوضوح كغير متحقق منه بدلًا من إظهاره باللون الأخضر."
        aside={
          <Link className="studio-btn" href="/studio/system" title="إعادة تشغيل جميع الفحوصات في طلب جديد">
            <SIcon name="refresh" size={14} /> إعادة الفحص
          </Link>
        }
      />

      <div className="studio-bento">
        <Tile span="w4" title={<b>أعطال</b>} provenance={<>الفحوصات التي فشلت في هذا الطلب</>}>
          <div className="studio-hero studio-hero--xl studio-mono" style={{ color: fails.length ? "var(--s-danger)" : undefined }}>
            {fails.length}
          </div>
          <p className="studio-sub" style={{ marginBlockStart: 4 }}>
            {fails.length ? fails.map((f) => f.name).join("، ") : "كل الخدمات الأساسية تعمل بشكل سليم"}
          </p>
        </Tile>
        <Tile span="w4" title={<b>تحذيرات</b>} provenance={<>إعداد ناقص أو قيد معروف في الخطة</>}>
          <div className="studio-hero studio-hero--xl studio-mono" style={{ color: warns.length ? "var(--s-warn)" : undefined }}>
            {warns.length}
          </div>
          <p className="studio-sub" style={{ marginBlockStart: 4 }}>
            {warns.length ? warns.map((f) => f.name).join("، ") : "لا توجد تحذيرات"}
          </p>
        </Tile>
        <Tile span="w4" title={<b>سليم</b>} provenance={<>الفحوصات التي اجتازت الاختبار الفعلي بنجاح</>}>
          <div className="studio-hero studio-hero--xl studio-mono" style={{ color: "var(--s-ok)" }}>
            {oks.length}
          </div>
          <p className="studio-sub" style={{ marginBlockStart: 4 }}>
            فُحصت في {shortTime(checkedAt)}
          </p>
        </Tile>
      </div>

      <Tile
        span="w12"
        title={<b>فحوصات التكامل الحيّة</b>}
        aside={<Chip tone="neutral">آخر فحص {shortTime(checkedAt)}</Chip>}
        provenance={
          <>
            قاعدة البيانات: استعلام <code>select 1</code> · التخزين: رمز Vercel Blob الفعلي · البريد: إعدادات SMTP وعنوان الاستلام
          </>
        }
      >
        {probes.length === 0 ? (
          <EmptyState title="لم يُنفذ أي فحص" body="هذا بحد ذاته خلل — لم يرجع وحدة القياس أي فحص." />
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
        title={<b>متغيرات البيئة والتكاملات</b>}
        aside={<Chip tone="neutral">فحص الوجود فقط — القيم السرية لا تغادر الخادم</Chip>}
        provenance={
          <>
            تُقرأ من <code>process.env</code> في هذا الطلب · المتغير المفقود يوضح سبب غياب الميزة بدلًا من إظهار صفر وهمي
          </>
        }
      >
        <div className="studio-scroll-x">
          <table className="studio-table">
            <thead>
              <tr>
                <th>المتغير</th>
                <th>الحالة</th>
                <th>الوظيفة المرتبطة به</th>
              </tr>
            </thead>
            <tbody>
              {env.map((row) => (
                <tr key={row.name}>
                  <td className="studio-mono" style={{ fontSize: 12.5 }}>
                    {row.name}
                    {row.hint ? <span style={{ color: "var(--s-accent)" }}> · {row.hint}</span> : null}
                  </td>
                  <td>
                    <Chip tone={row.present ? "ok" : "warn"} icon={row.present ? "check" : "minus"}>
                      {row.present ? "مضبوط" : "مفقود"}
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
          title={<b>آلية احتساب حركة الزيارات حاليًا</b>}
          variant="invert"
          provenance={<>التقييد الموثّق في docs/EVENTS.md وحلّه عبر مُجمّع الطرف الأول</>}
        >
          <p className="studio-sub" style={{ marginBlockEnd: 10 }}>
            توجد نسخة من الأحداث لدى المزود الخارجي، لكن استرجاع تجميعاتها يتطلب خطة أعلى — إذ يرجع الطلب رمز{" "}
            <b>HTTP 402</b>. لذا يسجّل الموقع أيضًا كل حدث في قاعدة بياناته عبر <code>/api/track</code>، وتعرض اللوحة ما
            تملكه فعليًا:
          </p>
          <ul style={{ margin: "0 0 13px", paddingInlineStart: 18, display: "flex", flexDirection: "column", gap: 7, fontSize: 13, color: "var(--s-muted)", lineHeight: 1.6 }}>
            <li>مشاهدات الصفحات، الجلسات، نطاقات الإحالة، وقمع الأحداث كلها قراءات من الطرف الأول بتعاريف مكتوبة بوضوح.</li>
            <li>لا يُخزّن أي عنوان IP أو سلسلة User-Agent أو بصمة جهاز؛ الجلسة مجرد معرّف عشوائي للتبويب.</li>
            <li>
              تبقى <b style={{ color: "var(--s-ink)" }}>صفوف الاستفسارات المحفوظة</b> هي المرجع الحاسم دائمًا.
            </li>
          </ul>
          <Link className="studio-btn studio-btn--sm" href="/studio/analytics">
            فتح التحليلات <SIcon name="arrowLeft" size={13} />
          </Link>
        </Tile>

        <Tile
          span="w5"
          title={<b>غير متحقق منه من هنا</b>}
          provenance={<>مذكور صراحةً بدلًا من افتراض اللون الأخضر</>}
        >
          <div className="studio-probes">
            <div className="studio-probe">
              <SIcon name="minus" className="studio-probe__ico" {...{ "data-state": "warn" }} />
              <div>
                <span className="studio-probe__name">حالة النشر على Vercel</span>
                <p className="studio-probe__detail">
                  لا تستطيع اللوحة قراءة مشاريع Vercel من داخل بيئة التشغيل (لا يوجد API token هنا). راجع لوحة Vercel للتحقق من
                  آخر بناء منشور.
                </p>
              </div>
            </div>
            <div className="studio-probe">
              <SIcon name="minus" className="studio-probe__ico" {...{ "data-state": "warn" }} />
              <div>
                <span className="studio-probe__name">Google Search Console</span>
                <p className="studio-probe__detail">
                  غير متصل بعد. النقرات ومرات الظهور العضوية تتطلب ربط حساب خدمة Google؛ توضّح صفحة المحتوى حالة الربط
                  والمتغيرات المطلوبة دون تخمين أي أرقام.
                </p>
              </div>
            </div>
            <div className="studio-probe">
              <SIcon name="minus" className="studio-probe__ico" {...{ "data-state": "warn" }} />
              <div>
                <span className="studio-probe__name">مؤشرات Core Web Vitals</span>
                <p className="studio-probe__detail">
                  البيانات الميدانية تتطلب ربط CrUX، والمخبرية تتطلب تشغيل Lighthouse على بيئة الإنتاج.
                </p>
              </div>
            </div>
          </div>
        </Tile>
      </div>
    </>
  );
}
