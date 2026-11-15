import { redirect } from "next/navigation";
import { getPayload } from "@/lib/payload";
import { getStudioUser } from "@/lib/studio/auth";
import { LoginForm } from "@/components/studio/login-form";
import { SIcon } from "@/components/studio/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "تسجيل الدخول · لوحة الاستوديو", robots: { index: false, follow: false } };

/**
 * /studio/login
 *
 * يتصل بنقطة النهاية الأصلية في Payload:
 *  - `/api/users/login` للدخول الاعتيادي
 *  - `/api/users/first-register` تلقائيًا إذا لم يكن هناك أي مستخدم بعد
 * بحيث تحصل على نفس ملف تعريف الارتباط `payload-token` الذي تعتمد عليه كل استدعاءات Local API.
 */
export default async function StudioLoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const params = await searchParams;
  const target = safeTarget(params.redirect);
  let user = null;
  let needsFirstUser = false;
  try {
    user = await getStudioUser();
    if (!user) {
      const payload = await getPayload();
      const existing = await payload.db.findOne({ collection: "users", where: {} });
      needsFirstUser = !existing;
    }
  } catch {
    needsFirstUser = false;
  }
  if (user) redirect(target);

  return (
    <div className="studio" style={{ display: "grid", placeItems: "center", minHeight: "100dvh" }}>
      <div className="studio-atmos" aria-hidden />
      <div className="studio-login__card" style={{ position: "relative", zIndex: 1 }}>
        <div className="studio-brand" style={{ padding: 0, marginBlockEnd: 18 }}>
          <span className="studio-brand__mark" aria-hidden>
            A
          </span>
          <span className="studio-brand__text">
            <strong>Aboalazm OS</strong>
            <span>لوحة الاستوديو</span>
          </span>
        </div>

        <h1>{needsFirstUser ? "إنشاء أول حساب مسؤول" : "تسجيل الدخول"}</h1>
        <p>
          {needsFirstUser
            ? "لا توجد حسابات في قاعدة البيانات حتى الآن. أنشئ حساب المسؤول الأول ليتم تسجيل دخولك مباشرة إلى لوحة الاستوديو."
            : "نفس حساب إدارة المحتوى. تقرأ هذه اللوحة بيانات الاستوديو الحية مباشرة عبر جلسة Payload الموحّدة دون كلمة مرور منفصلة."}
        </p>

        <LoginForm redirectTo={target} needsFirstUser={needsFirstUser} />

        <p className="studio-tiny" style={{ marginBlockStart: 16, display: "flex", gap: 6, alignItems: "flex-start" }}>
          <SIcon name="eye" size={13} />
          <span>
            {needsFirstUser
              ? "بمجرد إنشاء أول حساب مسؤول، يُغلق مسار التسجيل الأولي تلقائيًا ولا يُسمح إلا للمستخدمين المصرح لهم بإضافة حسابات جديدة."
              : "تستمر الجلسة ساعتين افتراضيًا. جلسة Payload واحدة تغطي كامل لوحة الاستوديو وإدارة المحتوى."}
          </span>
        </p>
      </div>
    </div>
  );
}

function safeTarget(raw?: string): string {
  if (!raw) return "/studio";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/studio";
  if (!raw.startsWith("/studio")) return "/studio";
  return raw;
}
