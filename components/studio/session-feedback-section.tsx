"use client";

/**
 * "بعد السيشن" — the feedback block of /studio/sessions.
 *
 * Reads like the registration side: numbers first (rating, the confidence
 * lift, who will recommend it), then the distributions, then the open answers
 * as written, because "what to change" lives there. Every Tile names the
 * column it was counted from. Deleting a row is two clicks, never a browser
 * confirm() (see DeleteRegistration in sessions-view.tsx for why).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chip, EmptyState, SIcon, Tile, num, ago } from "@/components/studio/ui";
import { Toasts, useToasts } from "@/components/studio/interactive";
import { deleteFeedback } from "@/app/studio/sessions/actions";
import { buildFeedbackReport, responseRate, uniqueCertificateNames, type CertificateRow, type FeedbackAnswer, type FeedbackDist, type FeedbackRow } from "@/lib/studio/feedback";

const SCALE_FOOT = "من ٥";

export function SessionFeedbackSection({
  rows: initialRows,
  certificates,
  registered,
  activeSession,
}: {
  rows: FeedbackRow[];
  certificates: CertificateRow[];
  registered: number;
  activeSession: string | null;
}) {
  const [rows, setRows] = useState(initialRows);
  const [armed, setArmed] = useState<string | number | null>(null);
  const router = useRouter();
  const { toasts, push } = useToasts();

  useEffect(() => setRows(initialRows), [initialRows]);

  const report = buildFeedbackReport(rows);
  const certNames = uniqueCertificateNames(certificates);
  const rate = responseRate(report.total, registered);
  const session = activeSession ? `&session=${encodeURIComponent(activeSession)}` : "";
  const where = activeSession ? <> حيث <code>session_key</code> = {activeSession}</> : " — كل الجلسات";

  const remove = async (id: string | number) => {
    const res = await deleteFeedback(id);
    setArmed(null);
    if (!res.ok) {
      push("danger", res.error);
      return;
    }
    setRows((rs) => rs.filter((r) => String(r.id) !== String(id)));
    push("ok", "حُذف التقييم نهائيًا.");
    router.refresh();
  };

  return (
    <section aria-labelledby="after-session" style={{ marginBlockStart: 28 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBlockEnd: 12 }}>
        <div>
          <h2 id="after-session" style={{ margin: 0, fontSize: 18 }}>بعد السيشن · التقييم</h2>
          <p className="studio-sub" style={{ margin: "4px 0 0" }}>
            ما يصل من <code>/linkedin-session/feedback</code>. بلا اسم افتراضيًا — الاسم والبريد اختياريان.
          </p>
        </div>
        <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="studio-btn studio-btn--sm" href="/linkedin-session/feedback" target="_blank" rel="noopener noreferrer">
            <SIcon name="external" size={14} />
            فتح الفورم
          </Link>
          {certNames.length > 0 ? (
            <Link className="studio-btn studio-btn--sm" href={`/studio/sessions/export-certificates${session ? `?${session.slice(1)}` : ""}`}>
              <SIcon name="arrowDown" size={14} />
              أسماء الشهادات
            </Link>
          ) : null}
          {report.total > 0 ? (
            <Link className="studio-btn studio-btn--sm" href={`/studio/sessions/export-feedback${session ? `?${session.slice(1)}` : ""}`}>
              <SIcon name="arrowDown" size={14} />
              تصدير CSV
            </Link>
          ) : null}
        </span>
      </header>

      {certNames.length > 0 ? (
        <div className="studio-bento" style={{ marginBlockEnd: 12 }}>
          <Tile
            span="w12"
            title={<b>طلبات الشهادات</b>}
            aside={<span className="studio-tiny">{num(certNames.length)} اسم</span>}
            provenance={<>صفوف <code>session-certificates</code>{where} — منفصلة عن الإجابات ولا تتربط بها</>}
          >
            <ol style={{ margin: 0, paddingInlineStart: "1.4rem", columnWidth: 220, columnGap: 24, fontSize: 13.5, lineHeight: 1.8 }}>
              {certNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ol>
          </Tile>
        </div>
      ) : null}

      {report.total === 0 ? (
        <Tile span="w12" title={<b>لا تقييمات بعد</b>} provenance={<>صفوف <code>session-feedback</code>{where}</>}>
          <EmptyState
            title="الفورم جاهز، ولم يصل رد"
            body="أرسلوا الرابط في آخر السيشن: aboalazm-os.vercel.app/linkedin-session/feedback — وارجعوا هنا بعد دقائق."
          />
        </Tile>
      ) : (
        <div className="studio-bento">
          <Tile span="w3" variant="accent" title={<b>التقييم العام</b>} provenance={<>متوسط <code>rating</code>{where}</>}>
            <div className="studio-hero studio-hero--xl studio-mono">{report.avgRating?.toFixed(1) ?? "—"}</div>
            <p className="studio-sub" style={{ marginBlockStart: 4 }}>
              {SCALE_FOOT} · {num(report.total)} رد{rate !== null ? ` · ${rate}% من المسجلين` : ""} · آخر رد {ago(rows[0]?.createdAt)}
            </p>
          </Tile>

          <Tile span="w3" title={<b>زيادة الثقة</b>} provenance={<>متوسط <code>confidence_after</code> − <code>confidence_before</code></>}>
            <div className="studio-hero studio-hero--xl studio-mono">
              {report.lift === null ? "—" : `${report.lift > 0 ? "+" : ""}${report.lift.toFixed(1)}`}
            </div>
            <p className="studio-sub" style={{ marginBlockStart: 4 }}>
              {report.avgBefore?.toFixed(1)} ← {report.avgAfter?.toFixed(1)} · {num(report.moreConfident)} زادت ثقتهم، {num(report.same)} ثابتة، {num(report.lessConfident)} قلّت
            </p>
          </Tile>

          <Tile span="w3" title={<b>هيرشّحوها؟</b>} provenance={<>توزيع <code>recommend</code></>}>
            <div className="studio-dist">
              {report.recommend.map((d) => (
                <Row key={d.key} dist={d} max={report.recommend[0]?.value ?? 1} />
              ))}
            </div>
          </Tile>

          <Tile span="w3" title={<b>سرعة السيشن</b>} provenance={<>توزيع <code>pace</code></>}>
            <div className="studio-dist">
              {report.pace.map((d) => (
                <Row key={d.key} dist={d} max={report.pace[0]?.value ?? 1} />
              ))}
            </div>
          </Tile>

          <Tile
            span="w6"
            title={<b>أكتر جزء فادهم</b>}
            aside={<span className="studio-tiny">اختيار متعدد — المجموع ممكن يزيد على ١٠٠٪</span>}
            provenance={<>تجميع على <code>session_feedback_texts</code> حيث <code>path = 'mostUseful'</code></>}
          >
            <div className="studio-dist">
              {report.mostUseful.map((d) => (
                <Row key={d.key} dist={d} max={report.mostUseful[0]?.value ?? 1} />
              ))}
            </div>
          </Tile>

          <Tile
            span="w6"
            title={<b>أول خطوة هيعملوها</b>}
            provenance={<>توزيع <code>next_step</code> — قائمة المتابعة بعد السيشن · {num(report.withLinkedin)} سابوا رابط LinkedIn</>}
          >
            <div className="studio-dist">
              {report.nextStep.map((d) => (
                <Row key={d.key} dist={d} max={report.nextStep[0]?.value ?? 1} />
              ))}
            </div>
          </Tile>

          <Open span="w4" title="أفضل حاجة" lines={report.bestPart} source="best_part" />
          <Open span="w4" title="نغيّر إيه؟" lines={report.improve} source="improve" />
          <Open span="w4" title="موضوع للسيشن الجاية" lines={report.nextTopic} source="next_topic" />

          {report.quotes.length > 0 ? (
            <Tile
              span="w12"
              variant="invert"
              title={<b>مسموح نقتبسها باسمهم</b>}
              provenance={<>صفوف <code>allow_quote</code> = true ومعها اسم وإجابة في <code>best_part</code></>}
            >
              <ul style={{ margin: 0, paddingInlineStart: "1.1rem", display: "flex", flexDirection: "column", gap: 7 }}>
                {report.quotes.map((q) => (
                  <li key={`${q.name}-${q.text}`} style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                    «{q.text}» — <strong>{q.name}</strong>
                  </li>
                ))}
              </ul>
            </Tile>
          ) : null}

          <Tile
            span="w12"
            title={<b>الردود</b>}
            aside={<span className="studio-tiny">{num(rows.length)} رد</span>}
            provenance={<>صفوف <code>session-feedback</code> بالأحدث · الحذف نهائي</>}
          >
            <div className="studio-scroll-x">
              <table className="studio-table">
                <thead>
                  <tr>
                    <th>الوقت</th>
                    <th>التقييم</th>
                    <th>الثقة</th>
                    <th>الاسم</th>
                    <th>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={String(row.id)}>
                      <td className="studio-tiny">{ago(row.createdAt)}</td>
                      <td className="studio-mono">{row.rating}/5</td>
                      <td className="studio-mono">
                        {row.confidenceBefore} ← {row.confidenceAfter}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {row.fullName ? (
                          <>
                            {row.fullName}
                            {row.linkedinUrl?.startsWith("https://www.linkedin.com/") ? (
                              <a className="studio-tiny" style={{ display: "block" }} href={row.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                {row.linkedinUrl.replace("https://www.linkedin.com/", "")}
                              </a>
                            ) : null}
                          </>
                        ) : (
                          <Chip>مجهول</Chip>
                        )}
                      </td>
                      <td>
                        {String(armed) === String(row.id) ? (
                          <span style={{ display: "inline-flex", gap: 4 }}>
                            <button type="button" className="studio-btn studio-btn--sm" autoFocus onClick={() => setArmed(null)}>
                              إلغاء
                            </button>
                            <button type="button" className="studio-btn studio-btn--sm studio-btn--danger" onClick={() => void remove(row.id)}>
                              تأكيد الحذف
                            </button>
                          </span>
                        ) : (
                          <button type="button" className="studio-btn studio-btn--sm studio-btn--danger" onClick={() => setArmed(row.id)}>
                            حذف…
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tile>
        </div>
      )}
      <Toasts items={toasts} />
    </section>
  );
}

function Row({ dist, max }: { dist: FeedbackDist; max: number }) {
  return (
    <div className="studio-dist__row">
      <span className="studio-dist__label" title={dist.label}>
        {dist.label}
      </span>
      <span className="studio-dist__val studio-mono">
        {num(dist.value)}
        <span className="studio-tiny" style={{ marginInlineStart: 5 }}>
          {dist.pct}%
        </span>
      </span>
      <span className="studio-dist__track">
        <span className="studio-dist__fill" style={{ width: `${max ? (dist.value / max) * 100 : 0}%` }} />
      </span>
    </div>
  );
}

function Open({ span, title, lines, source }: { span: "w4"; title: string; lines: FeedbackAnswer[]; source: string }) {
  return (
    <Tile span={span} variant="invert" title={<b>{title}</b>} provenance={<>نص <code>{source}</code> كما كُتب · {num(lines.length)} إجابة</>}>
      {lines.length === 0 ? (
        <p className="studio-sub">لا إجابات مكتوبة بعد.</p>
      ) : (
        <ul style={{ margin: 0, paddingInlineStart: "1.1rem", display: "flex", flexDirection: "column", gap: 7 }}>
          {lines.map((line, i) => (
            <li key={`${i}-${line.text}`} style={{ fontSize: 13.5, lineHeight: 1.6 }}>
              {line.text}
              {line.name ? <span className="studio-tiny"> — {line.name}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </Tile>
  );
}
