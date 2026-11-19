"use server";

/**
 * كتابات لوحة السيشن — مرحلة المتابعة، الحضور، والملاحظة الداخلية.
 *
 * نفس عقد /studio/leads/actions.ts: جلسة المشغل تُقرأ من ملف تعريف الارتباط،
 * وكل عملية تُمرَّر بـ `overrideAccess: false` حتى تظل صلاحيات Payload هي
 * الحدّ الفاصل لا هذه الملفات. لا توجد كتابة بلا مستخدم مصادَق عليه.
 *
 * القيم تُتحقّق من قوائم assessment.ts نفسها — القائمة التي وُلّدت منها أعمدة
 * الـ enum في قاعدة البيانات، فقيمة خارجها تعني طلبًا مُصنَّعًا يدويًا لا خطأ
 * إملائيًا من مشغّل.
 */

import { revalidatePath } from "next/cache";
import { getPayload } from "@/lib/payload";
import { getStudioUser } from "@/lib/studio/auth";
import { ATTENDANCE_OPTIONS, FOLLOWUP_OPTIONS } from "@/features/linkedin-session/assessment";

const ATTENDANCE = ATTENDANCE_OPTIONS.map((o) => o.value);
const FOLLOW_UP = FOLLOWUP_OPTIONS.map((o) => o.value);
const NOTES_MAX = 2000;

export type ActionResult = { ok: true } | { ok: false; error: string };

async function write(id: string | number, data: Record<string, unknown>): Promise<ActionResult> {
  const user = await getStudioUser();
  if (!user) return { ok: false, error: "انتهت الجلسة — يرجى تسجيل الدخول مجددًا." };
  try {
    const payload = await getPayload();
    await payload.update({
      collection: "session-registrations",
      id,
      data: data as never,
      overrideAccess: false,
      user: user as never,
    });
    revalidatePath("/studio/sessions");
    revalidatePath("/studio");
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذر الحفظ — رفضت قاعدة البيانات التعديل ولم يتغير شيء." };
  }
}

export async function setAttendance(id: string | number, value: string): Promise<ActionResult> {
  if (!ATTENDANCE.includes(value)) return { ok: false, error: `حالة حضور غير معروفة: «${value}».` };
  return write(id, { attendance: value });
}

export interface RegistrationDetailsInput {
  followUp: string;
  attendance: string;
  notes: string;
}

export async function saveRegistrationDetails(id: string | number, input: RegistrationDetailsInput): Promise<ActionResult> {
  if (!FOLLOW_UP.includes(input.followUp)) return { ok: false, error: `مرحلة متابعة غير معروفة: «${input.followUp}».` };
  if (!ATTENDANCE.includes(input.attendance)) return { ok: false, error: `حالة حضور غير معروفة: «${input.attendance}».` };
  if (typeof input.notes !== "string" || input.notes.length > NOTES_MAX) {
    return { ok: false, error: `الملاحظة يجب أن تكون نصًا بأقل من ${NOTES_MAX} حرفًا.` };
  }
  return write(id, { followUp: input.followUp, attendance: input.attendance, notes: input.notes.trim() });
}
