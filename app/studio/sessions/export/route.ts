import { NextResponse, type NextRequest } from "next/server";
import { getPayload } from "@/lib/payload";
import { getStudioUser } from "@/lib/studio/auth";
import { allRegistrations, registrationCsv } from "@/lib/studio/sessions";

/**
 * CSV تصدير قائمة المسجلين — للمراجعة خارج اللوحة (طباعة قائمة الحضور، أو
 * مزامنة سريعة مع نموذج آخر في يوم السيشن).
 *
 * مصادقة أولًا: الملف يعرض أسماء وبريدًا وإجابات مفتوحة، فهو لا يخرج إلا
 * لجلسة مشغّل صالحة. بلا جلسة يُعاد التوجيه إلى شاشة الدخول بنفس مسار العودة،
 * مثل كل صفحة في /studio.
 *
 * BOM في أول الملف حتى لا يقرأ Excel العربي كـ mojibake، و`private, no-store`
 * حتى لا تحتفظ أي وسيطة بنسخة من بيانات أشخاص.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = await getStudioUser();
  if (!user) {
    return NextResponse.redirect(new URL("/studio/login?redirect=%2Fstudio%2Fsessions", req.url), 307);
  }

  const raw = req.nextUrl.searchParams.get("session")?.trim() ?? "";
  /* اسم الجلسة يدخل في اسم الملف، فلا يُمرَّر كما هو: حروف المسار فقط. */
  const session = /^[a-z0-9-]{1,64}$/i.test(raw) ? raw : "";

  const payload = await getPayload();
  const rows = await allRegistrations({ payload, user }, session || null);
  const body = `${registrationCsv(rows)}\r\n`;

  return new NextResponse(`\uFEFF${body}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="session-registrations${session ? `-${session}` : ""}.csv"`,
      "cache-control": "private, no-store",
    },
  });
}
