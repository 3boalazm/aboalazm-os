"use client";

/**
 * لوحة السيشن — من سيسجّل، وما الذي يجب أن يغطّيه المحاضر.
 *
 * اللوحة ليست جدولًا فقط: ترتيبها هو ترتيب التحضير. أربعة أرقام تُقرأ قبل
 * الدخول إلى الغرفة، ثم توزيعات الجمهور (تخصصات، سنة دراسية، مستوى، هدف)،
 * ثم الإجابات المفتوحة نفسها — لأنها الأجندة الحقيقية — ثم القائمة الكاملة.
 *
 * لا رقم يُعرض بلا مصدر: كل Tile هنا يحمل <Provenance> يسمّي الأعمدة التي عُدّت
 * منها، تمامًا كقاعدة metrics.ts. والتحديثات تُكتب عبر أفعال الخادم في
 * app/studio/sessions/actions.ts، وتُتراجع أماميًا مع رسالة تخبر بالرفض إن
 * رفضتها قاعدة البيانات.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chip, EmptyState, SIcon, Tile, ViewHeader, ago, initials, num, shortTime, type ChipTone } from "@/components/studio/ui";
import { Drawer, Toasts, useToasts } from "@/components/studio/interactive";
import { ATTENDANCE_OPTIONS, FOLLOWUP_OPTIONS, optionLabel, sessionTitle } from "@/features/linkedin-session/assessment";
import type { Dist, SessionRegistrationRow, SessionReport } from "@/lib/studio/sessions";
import { deleteRegistration, saveRegistrationDetails, setAttendance } from "@/app/studio/sessions/actions";
import { SessionFeedbackSection } from "@/components/studio/session-feedback-section";
import type { FeedbackRow } from "@/lib/studio/feedback";

const FIELD_TITLES: Record<string, string> = {
  yearOfStudy: "السنة الدراسية",
  linkedinStatus: "مستوى LinkedIn",
  goals: "الأهداف المهنية",
  cvStatus: "حالة الـ CV",
  appliedBefore: "خبرة التقديم",
  attendance: "الحضور",
  followUp: "متابعة الاستوديو",
  college: "الكليات والتخصصات",
  interestArea: "المجالات المطلوبة",
};

export function SessionsView({
  rows: initialRows,
  report,
  sessions,
  activeSession,
  feedbackRows,
}: {
  feedbackRows: FeedbackRow[];
  rows: SessionRegistrationRow[];
  report: SessionReport;
  sessions: { key: string; rows: number }[];
  activeSession: string | null;
}) {
  const [rows, setRows] = useState(initialRows);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  /* «حذف…» في الجدول يفتح لوحة التفاصيل والتأكيد مطروح فيها؛ زر الاسم يفتحها دونه.
     تأكيد واحد في مكان واحد (انظر DeleteRegistration). */
  const [armDelete, setArmDelete] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { toasts, push } = useToasts();

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.fullName, row.email, row.college, row.university, row.interestArea, row.biggestChallenge, row.questionForSession]
        .filter((v): v is string => typeof v === "string")
        .some((v) => v.toLowerCase().includes(q)),
    );
  }, [rows, query]);

  const selected = rows.find((r) => String(r.id) === String(selectedId)) ?? null;
  const goalDist = report.dists.goals ?? [];
  const levelDist = report.dists.linkedinStatus ?? [];
  const topGoal = goalDist.find((d) => d.key !== "") ?? null;
  const biggestFriction = report.challenges[0]?.text ?? null;

  const move = async (id: string | number, attendance: string) => {
    const before = rows;
    setRows((rs) => rs.map((r) => (String(r.id) === String(id) ? { ...r, attendance } : r)));
    const res = await setAttendance(id, attendance);
    if (!res.ok) {
      setRows(before);
      push("danger", res.error);
      return;
    }
    push("ok", `حُدّث الحضور: ${attendanceLabel(attendance)}`);
    router.refresh();
  };

  const openDetail = (id: string | number) => {
    setArmDelete(false);
    setSelectedId(id);
  };
  const openForDelete = (id: string | number) => {
    setArmDelete(true);
    setSelectedId(id);
  };
  /* Stable identity on purpose: the panel re-runs its focus-on-open effect whenever
     `onClose` changes, and an inline arrow changes on every render (a toast timing
     out is enough) — which would pull focus off the confirmation's safe button. */
  const closeDetail = useCallback(() => {
    setSelectedId(null);
    setArmDelete(false);
  }, []);

  /* Not optimistic: a delete cannot be taken back, so the row leaves the list
     only after the server says it is gone. The refresh recomputes every tile
     and chart from the remaining rows. */
  const remove = async (row: SessionRegistrationRow): Promise<boolean> => {
    const res = await deleteRegistration(row.id);
    if (!res.ok) {
      push("danger", res.error);
      return false;
    }
    setRows((rs) => rs.filter((r) => String(r.id) !== String(row.id)));
    setSelectedId((current) => (current !== null && String(current) === String(row.id) ? null : current));
    setArmDelete(false);
    push("ok", `حُذف رد «${row.fullName}» نهائيًا${row.cvFile ? " مع ملف الـ CV" : ""}.`);
    router.refresh();
    return true;
  };

  return (
    <>
      <ViewHeader
        eyebrow={activeSession ? `تحضير سيشن · ${sessionTitle(activeSession).ar}` : "تحضير سيشن · كل الجلسات"}
        title="من سيحضر، وما الذي يجب أن نغطّيه"
        description="كل صف هنا إجابة محفوظة في session-registrations. التوزيعات تُقرأ أولًا لأنها تحدد محتوى السيشن، والإجابات المفتوحة تُقرأ كما هي لأنها الأجندة الفعلية."
        aside={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {sessions.length > 1 ? (
              <nav className="studio-range" aria-label="اختيار الجلسة">
                <Link href="/studio/sessions" aria-current={activeSession ? undefined : "true"}>
                  الكل
                </Link>
                {sessions.map((s) => (
                  <Link key={s.key} href={`/studio/sessions?session=${encodeURIComponent(s.key)}`} aria-current={activeSession === s.key ? "true" : undefined}>
                    {sessionTitle(s.key).ar} ({num(s.rows)})
                  </Link>
                ))}
              </nav>
            ) : null}
            <Link className="studio-btn studio-btn--sm" href={`/studio/sessions/export${activeSession ? `?session=${encodeURIComponent(activeSession)}` : ""}`}>
              <SIcon name="arrowDown" size={14} />
              تصدير CSV
            </Link>
          </div>
        }
      />

      {report.total === 0 ? (
        <Tile
          span="w12"
          variant="aurora"
          title={<b>لا توجد تسجيلات بعد</b>}
          provenance={<>صفوف <code>session-registrations</code> بفلتر الجلسة الحالية</>}
        >
          <EmptyState
            title="الفورم منشور، والقائمة فاضية"
            body="لا يوجد صف واحد محفوظ. إن مرّ الوقت المتوقع ونشرتم الرابط ولم يصل أحد، فالمشكلة في وصول الرابط لا في الفورم — جرّب إرسال الرابط بنفسك وراقب الأحداث في /studio/analytics."
            action={
              <Link className="studio-btn studio-btn--primary" href="/linkedin-session" target="_blank" rel="noopener noreferrer">
                <SIcon name="external" size={14} />
                فتح نموذج التسجيل
              </Link>
            }
          />
        </Tile>
      ) : (
        <div className="studio-bento">
          <Tile
            span="w3"
            title={<b>مسجّلون</b>}
            variant="accent"
            provenance={<>صفوف <code>session-registrations</code>{activeSession ? <> حيث <code>session_key</code> = {activeSession}</> : " — كل الجلسات"}</>}
          >
            <div className="studio-hero studio-hero--xl studio-mono">{num(report.total)}</div>
            <p className="studio-sub" style={{ marginBlockStart: 4 }}>
              {num(report.unreviewed)} لم يراجعها أحد · آخر تسجيل {ago(rows[0]?.createdAt)}
            </p>
          </Tile>

          <Tile
            span="w3"
            title={<b>يحتاجون بناء الحساب</b>}
            provenance={<>عدد من <code>linkedin_status</code> عندهم none أو incomplete</>}
          >
            <div className="studio-hero studio-hero--xl studio-mono">{num(report.needsAccount)}</div>
            <p className="studio-sub" style={{ marginBlockStart: 4 }}>
              من أصل {num(report.total)} — {report.needsAccount > 0 ? "ابدأوا من إنشاء البروفايل" : "الغرفة جاهزة للتطوير مباشرة"}
            </p>
          </Tile>

          <Tile
            span="w3"
            title={<b>سيرة ذاتية</b>}
            provenance={<>ملفات في <code>cv_file_id</code> + توزيع <code>cv_status</code></>}
          >
            <div className="studio-hero studio-hero--xl studio-mono">{num(report.withCvFile)}</div>
            <p className="studio-sub" style={{ marginBlockStart: 4 }}>
              مرفوعة فعليًا · {num(report.cvReady)} جاهزة · {num(report.cvNotStarted)} لم تبدأ
            </p>
          </Tile>

          <Tile
            span="w3"
            title={<b>إجابات مفتوحة</b>}
            provenance={<>صفوف فيها نص في <code>biggest_challenge</code> أو <code>question_for_session</code></>}
          >
            <div className="studio-hero studio-hero--xl studio-mono">{num(report.withOpenAnswer)}</div>
            <p className="studio-sub" style={{ marginBlockStart: 4 }}>
              {num(report.challenges.length)} تحدي مختلف · {num(report.questions.length)} سؤال مختلف
            </p>
          </Tile>

          <Tile
            span="w4"
            title={<b>أبرز ما يجب تغطيته</b>}
            variant="invert"
            provenance={<>تجميع نصّي حرفي لـ <code>biggest_challenge</code> — بلا دلالة ولا نموذج</>}
          >
            {report.challenges.length === 0 ? (
              <p className="studio-sub">لا إجابات في هذا السؤال بعد.</p>
            ) : (
              <ol style={{ margin: 0, paddingInlineStart: "1.1rem", display: "flex", flexDirection: "column", gap: 7 }}>
                {report.challenges.slice(0, 6).map((line) => (
                  <li key={line.text} style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                    {line.text}{" "}
                    {line.count > 1 ? (
                      <Chip tone="accent">
                        <span className="studio-mono">×{num(line.count)}</span>
                      </Chip>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </Tile>

          <Tile
            span="w4"
            title={<b>أسئلة الحضور</b>}
            variant="invert"
            provenance={<>تجميع نصّي حرفي لـ <code>question_for_session</code></>}
          >
            {report.questions.length === 0 ? (
              <p className="studio-sub">لا أسئلة مكتوبة بعد — اسألوا في الغرفة إذا بقيت هذه اللوحة فارغة.</p>
            ) : (
              <ol style={{ margin: 0, paddingInlineStart: "1.1rem", display: "flex", flexDirection: "column", gap: 7 }}>
                {report.questions.slice(0, 6).map((line) => (
                  <li key={line.text} style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                    {line.text}{" "}
                    {line.count > 1 ? (
                      <Chip tone="accent">
                        <span className="studio-mono">×{num(line.count)}</span>
                      </Chip>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </Tile>

          <Tile
            span="w4"
            title={<b>خلاصة الغرفة</b>}
            variant="invert"
            provenance={<>أعلى قيمة في <code>dists.goals</code> وأول سطر في <code>challenges</code></>}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <p className="studio-sub" style={{ margin: 0 }}>
                الهدف الأكثر تكرارًا:{" "}
                <strong style={{ color: "var(--s-ink)" }}>{topGoal ? topGoal.label : "غير محسوم"}</strong>
                {topGoal ? ` — ${num(topGoal.value)} من ${num(report.total)} المسجلين` : ""}
              </p>
              <p className="studio-sub" style={{ margin: 0 }}>
                أكثر مستوى: <strong style={{ color: "var(--s-ink)" }}>{levelDist[0]?.label ?? "—"}</strong>
              </p>
              <p className="studio-sub" style={{ margin: 0, whiteSpace: "normal" }}>
                أكثر ما يُتعِبهم: <em style={{ fontStyle: "normal", color: "var(--s-ink)" }}>{biggestFriction ?? "لا شيء مكتوب بعد"}</em>
              </p>
            </div>
          </Tile>

          {(["college", "yearOfStudy", "linkedinStatus", "goals", "cvStatus", "appliedBefore"] as const).map((field) => (
            <Tile
              key={field}
              span={field === "college" ? "w8" : "w4"}
              title={<b>{FIELD_TITLES[field]}</b>}
              aside={
                <span className="studio-tiny">
                  {field === "goals" ? "شخص قد يختار أكثر من هدف" : `${num((report.dists[field] ?? []).length)} قيمة`}
                </span>
              }
              provenance={
                <>
                  {field === "goals" ? (
                    <>
                      تجميع على <code>session_registrations_texts</code> حيث <code>path = 'goals'</code> — كل شريط عدد من اختاروه، والنسبة لكل شريط من كل المسجلين، فمجموع الأشرطة ممكن يزيد على ١٠٠٪
                    </>
                  ) : (
                    <>
                      تجميع على عمود <code>{snake(field)}</code>
                      {/college|interest/.test(field) ? " (نص حر، بلا قائمة)" : " (enum مشتق من assessment.ts)"}
                    </>
                  )}{" "}
                  · {shortTime(report.asOf)}
                </>
              }
            >
              <div className="studio-dist">
                {(report.dists[field] ?? []).map((d) => (
                  <DistRow key={d.key || "blank"} dist={d} max={report.dists[field]?.[0]?.value ?? 1} />
                ))}
              </div>
            </Tile>
          ))}

          <Tile
            span="w12"
            title={<b>القائمة</b>}
            aside={
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  className="studio-input"
                  style={{ width: 220, padding: "6px 10px", fontSize: 13 }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث باسم أو بريد أو تخصص"
                  aria-label="بحث في قائمة المسجلين"
                />
                <span className="studio-tiny">
                  {num(filtered.length)} / {num(rows.length)}
                </span>
              </span>
            }
            provenance={<>صفوف <code>session-registrations</code> مرتّبة بالأحدث · الملف الشخصي يُقرأ من <code>session-files</code> بصلاحيات المشغل فقط</>}
          >
            {filtered.length === 0 ? (
              <p className="studio-sub">لا نتيجة للبحث الحالي.</p>
            ) : (
              <div className="studio-scroll-x">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>الشخص</th>
                      <th>التخصص والسنة</th>
                      <th>المستوى</th>
                      <th>الهدف</th>
                      <th>CV</th>
                      <th>الحضور</th>
                      <th>المتابعة</th>
                      <th>إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={String(row.id)}>
                        <td>
                          <button
                            type="button"
                            className="studio-row--btn"
                            onClick={() => openDetail(row.id)}
                            style={{ display: "flex", gap: 9, alignItems: "center", textAlign: "start", maxWidth: 320 }}
                          >
                            <span className="studio-ava">{initials(row.fullName || "؟")}</span>
                            <span style={{ minWidth: 0 }}>
                              <span className="studio-row__name" style={{ display: "block" }}>
                                {row.fullName}
                              </span>
                              <span className="studio-tiny" style={{ display: "block" }}>
                                {row.email}
                              </span>
                            </span>
                          </button>
                        </td>
                        <td style={{ fontSize: 13 }}>
                          {row.college || "—"}
                          <span className="studio-tiny" style={{ display: "block" }}>
                            {optionLabel("yearOfStudy", row.yearOfStudy)}
                          </span>
                        </td>
                        <td>
                          <Chip tone={levelTone(row.linkedinStatus)}>{optionLabel("linkedinStatus", row.linkedinStatus)}</Chip>
                        </td>
                        <td style={{ fontSize: 13 }}>
                          {row.goals && row.goals.length > 0 ? (
                            <span style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {row.goals.map((goal) => (
                                <Chip key={goal}>{optionLabel("goals", goal)}</Chip>
                              ))}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          {row.cvFile ? (
                            <Chip tone="ok" icon="check">
                              مرفوع
                            </Chip>
                          ) : (
                            <span className="studio-tiny">{optionLabel("cvStatus", row.cvStatus)}</span>
                          )}
                        </td>
                        <td>
                          <span style={{ display: "inline-flex", gap: 4 }}>
                            {ATTENDANCE_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                className="studio-btn studio-btn--sm"
                                aria-pressed={(row.attendance ?? "registered") === option.value}
                                title={option.label.ar}
                                onClick={() => void move(row.id, option.value)}
                                style={(row.attendance ?? "registered") === option.value ? { borderColor: "var(--s-accent)", color: "var(--s-accent)" } : undefined}
                              >
                                {option.label.ar}
                              </button>
                            ))}
                          </span>
                        </td>
                        <td>
                          <Chip tone={followTone(row.followUp)}>{optionLabel("followUp", row.followUp ?? "new")}</Chip>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="studio-btn studio-btn--sm studio-btn--danger"
                            aria-label={`حذف رد ${row.fullName}`}
                            title="يفتح الرد ويسأل قبل حذفه نهائيًا"
                            onClick={() => openForDelete(row.id)}
                          >
                            حذف…
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Tile>
        </div>
      )}

      <SessionFeedbackSection rows={feedbackRows} registered={report.total} activeSession={activeSession} />

      <Drawer
        open={Boolean(selected)}
        onClose={closeDetail}
        title={
          selected ? (
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span className="studio-ava">{initials(selected.fullName || "؟")}</span>
              <span style={{ minWidth: 0 }}>
                <strong style={{ display: "block", fontSize: 15 }}>{selected.fullName}</strong>
                <span className="studio-tiny" style={{ display: "block" }}>
                  {selected.email} · {selected.college || "بدون تخصص"}
                </span>
              </span>
              <span style={{ marginInlineStart: "auto" }}>
                <Chip tone={followTone(selected.followUp)}>{optionLabel("followUp", selected.followUp ?? "new")}</Chip>
              </span>
            </span>
          ) : null
        }
      >
        {selected ? <RegistrationDetail key={String(selected.id)} row={selected} onSaved={(patch) => {
          setRows((rs) => rs.map((r) => (String(r.id) === String(selected.id) ? { ...r, ...patch } : r)));
          push("ok", "حُفظت التعديلات في Payload.");
          router.refresh();
        }} onError={(message) => push("danger", message)} onDelete={remove} autoArmDelete={armDelete} /> : null}
      </Drawer>

      <Toasts items={toasts} />
    </>
  );
}

/* ── أجزاء صغيرة ──────────────────────────────────────────────────────────── */

function DistRow({ dist, max }: { dist: Dist; max: number }) {
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

/**
 * حذف رد: نقرتان، وفي مكان واحد هو لوحة التفاصيل. الأولى تفتح سؤال التأكيد باسم
 * الشخص (والزر الآمن «إلغاء» هو الذي يأخذ التركيز، فالضغط على Enter بالخطأ لا
 * يحذف)، والثانية تحذف فعلًا. Escape يلغي التأكيد وحده ولا يغلق اللوحة معه.
 * لا نافذة متصفح: window.confirm تُكتم لمن يختار «منع النوافذ»، فيصير الحذف صامتًا
 * بلا تفسير.
 *
 * زر «حذف…» في صف الجدول لا يحذف ولا يحمل تأكيدًا خاصًا به: يفتح هذه اللوحة
 * والسؤال مطروح (initiallyArmed). جُرّب تأكيد داخل الخلية فوسّع العمود وقصّ النص
 * وزر «إلغاء» على شاشة 1600px، وعمود «إجراء» نفسه خارج الإطار على 1440px وأقل.
 * اللوحة فيها المكان، وتُظهر بيانات الشخص قبل أن يقرّر المشغّل، وتُفتح من عمود
 * الاسم على أي شاشة.
 */
function DeleteRegistration({
  row,
  onConfirm,
  initiallyArmed,
}: {
  row: SessionRegistrationRow;
  onConfirm: (row: SessionRegistrationRow) => Promise<boolean>;
  initiallyArmed: boolean;
}) {
  const [armed, setArmed] = useState(initiallyArmed);
  const [busy, setBusy] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!armed) return;
    // Deferred: when the panel opens already asking, its own focus-on-open effect runs after this
    // component's (children first) and would take a direct focus() away again. The safe button must win.
    const timer = window.setTimeout(() => cancelRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [armed]);

  if (!armed) {
    return (
      <button
        type="button"
        className="studio-btn studio-btn--sm studio-btn--danger"
        aria-label={`حذف رد ${row.fullName} (لوحة التفاصيل)`}
        title="حذف هذا الرد نهائيًا"
        onClick={() => setArmed(true)}
      >
        حذف هذا الرد
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`تأكيد حذف رد ${row.fullName}`}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        e.stopPropagation(); // الـ Escape هنا للتأكيد فقط؛ لوحة التفاصيل تسمعه على window وتُغلق لو وصلها
        if (!busy) setArmed(false);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}
    >
      <span role="alert" className="studio-tiny" style={{ color: "var(--s-danger)", whiteSpace: "normal" }}>
        حذف رد «{row.fullName}» نهائيًا{row.cvFile ? " مع ملف الـ CV" : ""}؟ لا يمكن التراجع.
      </span>
      <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          type="button"
          className="studio-btn studio-btn--sm studio-btn--danger"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const gone = await onConfirm(row);
            if (!gone) {
              setBusy(false);
              setArmed(false);
            }
          }}
        >
          {busy ? "جارٍ الحذف…" : "نعم، احذف نهائيًا"}
        </button>
        <button ref={cancelRef} type="button" className="studio-btn studio-btn--sm" disabled={busy} onClick={() => setArmed(false)}>
          إلغاء
        </button>
      </span>
    </div>
  );
}

function RegistrationDetail({
  row,
  onSaved,
  onError,
  onDelete,
  autoArmDelete,
}: {
  row: SessionRegistrationRow;
  onSaved: (patch: Partial<SessionRegistrationRow>) => void;
  onError: (message: string) => void;
  onDelete: (row: SessionRegistrationRow) => Promise<boolean>;
  /** The panel was opened from the table's «حذف…»: show the confirmation already asking. */
  autoArmDelete: boolean;
}) {
  const [followUp, setFollowUp] = useState(row.followUp ?? "new");
  const [attendance, setAttendanceState] = useState(row.attendance ?? "registered");
  const [notes, setNotes] = useState(row.notes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFollowUp(row.followUp ?? "new");
    setAttendanceState(row.attendance ?? "registered");
    setNotes(row.notes ?? "");
  }, [row]);

  const dirty = followUp !== (row.followUp ?? "new") || attendance !== (row.attendance ?? "registered") || notes.trim() !== (row.notes ?? "").trim();

  const save = async () => {
    setSaving(true);
    const res = await saveRegistrationDetails(row.id, { followUp, attendance, notes });
    setSaving(false);
    if (!res.ok) return onError(res.error);
    onSaved({ followUp, attendance, notes: notes.trim() });
  };

  const answers: [string, string][] = [
    ["السنة الدراسية", optionLabel("yearOfStudy", row.yearOfStudy)],
    ["الجامعة", row.university || "—"],
    ["مستوى LinkedIn", optionLabel("linkedinStatus", row.linkedinStatus)],
    ["رابط البروفايل", row.linkedinUrl || "—"],
    ["الأهداف", row.goals && row.goals.length > 0 ? row.goals.map((goal) => optionLabel("goals", goal)).join(" · ") : "—"],
    ["تقديم سابق", optionLabel("appliedBefore", row.appliedBefore)],
    ["حالة الـ CV", optionLabel("cvStatus", row.cvStatus)],
    ["المجال المطلوب", row.interestArea || "—"],
    ["أصعب شيء", row.biggestChallenge || "—"],
    ["سؤاله للسيشن", row.questionForSession || "—"],
    ["المصدر", row.source || "form"],
    ["تاريخ التسجيل", row.createdAt ? shortTime(row.createdAt) : "—"],
  ];

  const cv = typeof row.cvFile === "object" && row.cvFile ? row.cvFile : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <dl className="studio-kv">
        {answers.map(([label, value]) => (
          <div key={label} className="studio-kv__row">
            <dt>{label}</dt>
            <dd style={["أصعب شيء", "سؤاله للسيشن"].includes(label) ? { whiteSpace: "pre-wrap" } : undefined}>{value}</dd>
          </div>
        ))}
      </dl>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <p className="studio-up">السيرة الذاتية</p>
        {cv ? (
          <a className="studio-btn studio-btn--sm" style={{ width: "fit-content" }} href={cv.url ?? "#"} target="_blank" rel="noopener noreferrer">
            <SIcon name="eye" size={14} />
            {cv.filename ?? "ملف PDF"}
          </a>
        ) : (
          <p className="studio-tiny">لم يُرفق ملف — المسجّل اختار ألا يرفع شيئًا.</p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p className="studio-up">عمل المشغّل</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label className="studio-field">
            <span>مرحلة المتابعة</span>
            <select className="studio-input" value={followUp} onChange={(e) => setFollowUp(e.target.value)}>
              {FOLLOWUP_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label.ar}
                </option>
              ))}
            </select>
          </label>
          <label className="studio-field">
            <span>الحضور</span>
            <select className="studio-input" value={attendance} onChange={(e) => setAttendanceState(e.target.value)}>
              {ATTENDANCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label.ar}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="studio-field" style={{ marginBottom: 0 }}>
          <span>ملاحظة داخلية (لا تُعرض للمسجّل)</span>
          <textarea className="studio-input" rows={3} value={notes} maxLength={2000} onChange={(e) => setNotes(e.target.value)} placeholder="مثال: عنده سؤال عن الـ headline — نبدأ منه." />
        </label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className="studio-btn studio-btn--primary" onClick={() => void save()} disabled={saving || !dirty}>
            {saving ? "جارٍ الحفظ…" : dirty ? "حفظ في Payload" : "محفوظ"}
          </button>
          <span className="studio-tiny">
            يُكتب عبر <code>payload.update</code> بـ <code>overrideAccess: false</code>
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 14, borderTop: "1px solid var(--s-hair)" }}>
        <p className="studio-up">حذف الرد</p>
        <DeleteRegistration row={row} onConfirm={onDelete} initiallyArmed={autoArmDelete} />
      </div>
    </div>
  );
}

/* ── معجمات عرض ──────────────────────────────────────────────────────────── */

function levelTone(value?: string | null): ChipTone {
  if (value === "active") return "ok";
  if (value === "none") return "warn";
  return "info";
}

function followTone(value?: string | null): ChipTone {
  if (value === "replied" || value === "closed") return "ok";
  if (value === "reviewed") return "info";
  return "accent";
}

function attendanceLabel(value?: string | null): string {
  return optionLabel("attendance", value ?? "registered");
}

/** اسم العمود في قاعدة البيانات، كما يكتبه Payload: snake_case لاسم الحقل. */
function snake(name: string): string {
  return name.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}
