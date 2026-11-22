import { NextResponse, type NextRequest } from "next/server";
import { getPayload } from "@/lib/payload";
import { getStudioUser } from "@/lib/studio/auth";
import { allCertificates, certificatesCsv } from "@/lib/studio/feedback";

/**
 * CSV أسماء طلبات الشهادات — نفس شروط ../export: مصادقة أولًا، اسم الجلسة
 * بحروف المسار فقط، BOM لـ Excel العربي، و`private, no-store`.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = await getStudioUser();
  if (!user) {
    return NextResponse.redirect(new URL("/studio/login?redirect=%2Fstudio%2Fsessions", req.url), 307);
  }

  const raw = req.nextUrl.searchParams.get("session")?.trim() ?? "";
  const session = /^[a-z0-9-]{1,64}$/i.test(raw) ? raw : "";

  const payload = await getPayload();
  const rows = await allCertificates({ payload, user }, session || null);

  return new NextResponse(`\uFEFF${certificatesCsv(rows)}\r\n`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="session-certificates${session ? `-${session}` : ""}.csv"`,
      "cache-control": "private, no-store",
    },
  });
}
