import { requireStudioUser } from "@/lib/studio/auth";
import { getPayload } from "@/lib/payload";
import { StudioShell } from "@/components/studio/shell";
import { SessionsView } from "@/components/studio/sessions-view";
import { loadManageShellProps } from "@/lib/studio/cms";
import { allRegistrations, buildSessionReport, sessionKeys } from "@/lib/studio/sessions";
import { sessionTitle } from "@/features/linkedin-session/assessment";

export const dynamic = "force-dynamic";
export const metadata = { title: "تحضير السيشن · لوحة الاستوديو", robots: { index: false, follow: false } };

/**
 * /studio/sessions — لوحة ما قبل السيشن.
 *
 * الحارس قبل القراءة: `requireStudioUser()` أول سطر فعلي، وكل استعلام يمرّ بـ
 * `overrideAccess: false` داخل lib/studio/sessions.ts — اللوحة لا تملك صلاحية
 * أوسع من المستخدم الذي يفتحها. عدّادات القشرة الجانبية تأتي من نفس مساعد
 * شاشة الإدارة حتى لا تتفارق الأرقام بين صفحتين.
 *
 * التجميع يحدث على الخادم: هذه شاشة قرار تُفتح قبل الصعود إلى المنصة، ولا معنى
 * لها وهي تدور.
 */
export default async function StudioSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const params = await searchParams;
  const session = params.session?.trim() || null;
  const user = await requireStudioUser(`/studio/sessions${session ? `?session=${encodeURIComponent(session)}` : ""}`);
  const payload = await getPayload();

  const [rows, sessions, shell] = await Promise.all([
    allRegistrations({ payload, user }, session),
    sessionKeys({ payload, user }),
    loadManageShellProps(payload, user),
  ]);

  const report = buildSessionReport(rows);
  const label = session ? sessionTitle(session).ar : "كل الجلسات";

  const attention =
    report.unreviewed > 0
      ? {
          title: report.unreviewed === 1 ? "إجابة واحدة لم تُراجع" : `${report.unreviewed} إجابات لم تُراجع`,
          body: "التحديات والأسئلة المفتوحة هي ما يبني محتوى السيشن — تُقرأ قبل تجهيز الشرائح.",
          href: "/studio/sessions",
          cta: "فتح اللوحة",
        }
      : shell.attention;

  return (
    <StudioShell counts={shell.counts} attention={attention} userEmail={user.email} version={`تحضير السيشن · ${label}`}>
      <SessionsView rows={rows} report={report} sessions={sessions} activeSession={session} />
    </StudioShell>
  );
}
