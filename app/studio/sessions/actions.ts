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
import { normalizeRegistrationId } from "@/lib/studio/sessions";
import { normalizeFeedbackId } from "@/lib/studio/feedback";

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

/**
 * حذف رد واحد نهائيًا — الصف وملف الـ CV معه.
 *
 * الحذف يمرّ عبر `payload.delete` بـ `overrideAccess: false`، فصلاحية
 * `session-registrations.access.delete` (مستخدم مسجَّل) هي الحدّ الفاصل لا هذا
 * الملف. وhook `afterDelete` في collections/SessionRegistrations.ts يحذف ملف
 * الـ CV داخل المعاملة نفسها: إمّا يذهب الاثنان أو لا يذهب شيء.
 *
 * رقم الصف يُتحقّق منه قبل أي استعلام (الفعل نقطة POST عامة). وصف غير موجود —
 * حُذف من تبويب آخر مثلًا — يُعدّ نجاحًا: ما طُلب (ألا يوجد الصف) قائم.
 */
export async function deleteRegistration(id: string | number): Promise<ActionResult> {
  const user = await getStudioUser();
  if (!user) return { ok: false, error: "انتهت الجلسة — يرجى تسجيل الدخول مجددًا." };
  const target = normalizeRegistrationId(id);
  if (target === null) return { ok: false, error: "رقم الرد غير صالح — لم يُحذف شيء." };
  try {
    const payload = await getPayload();
    await payload.delete({
      collection: "session-registrations",
      id: target,
      overrideAccess: false,
      user: user as never,
    });
  } catch (error) {
    if ((error as { status?: number }).status !== 404) {
      /* Name only: Payload messages can quote the row, and a row here is a person. */
      console.error("[studio/sessions] delete failed:", error instanceof Error ? error.name : "unknown");
      return { ok: false, error: "تعذر الحذف — لم يتغير شيء. جرّب مرة أخرى." };
    }
  }
  revalidatePath("/studio/sessions");
  revalidatePath("/studio");
  return { ok: true };
}

/**
 * حذف رد تقييم واحد نهائيًا (`session-feedback`) — لصف خاطئ أو مسيء.
 * نفس عقد deleteRegistration: جلسة مشغّل، رقم مُتحقَّق، overrideAccess: false،
 * وصف غير موجود يُعدّ نجاحًا.
 */
export async function deleteFeedback(id: string | number): Promise<ActionResult> {
  const user = await getStudioUser();
  if (!user) return { ok: false, error: "انتهت الجلسة — يرجى تسجيل الدخول مجددًا." };
  const target = normalizeFeedbackId(id);
  if (target === null) return { ok: false, error: "رقم التقييم غير صالح — لم يُحذف شيء." };
  try {
    const payload = await getPayload();
    await payload.delete({ collection: "session-feedback", id: target, overrideAccess: false, user: user as never });
  } catch (error) {
    if ((error as { status?: number }).status !== 404) {
      console.error("[studio/sessions] feedback delete failed:", error instanceof Error ? error.name : "unknown");
      return { ok: false, error: "تعذر الحذف — لم يتغير شيء. جرّب مرة أخرى." };
    }
  }
  revalidatePath("/studio/sessions");
  return { ok: true };
}
