"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "@/lib/payload";
import { getStudioUser } from "@/lib/studio/auth";

/**
 * LEAD WRITES (P3) — the console's first mutations, deliberately narrow.
 *
 * The board used to be read-only by design: Payload owned the save path.
 * P3 keeps that ownership and adds the two gestures an operator actually
 * repeats all day — moving a stage and recording the numbers — through
 * the same Local API, with `overrideAccess: false` and the operator's own
 * session. Access rules that protect the admin panel protect these
 * actions identically; there is no console-only write path.
 *
 * Validation mirrors collections/Messages.ts (the stage and closed-reason
 * enums, non-negative values). Anything outside the lists is refused with
 * a message the UI can show, never silently coerced.
 */

const STAGES = ["new", "qualified", "proposal-sent", "won", "lost", "not-a-fit"] as const;
const CLOSED_REASONS = ["budget", "timing", "scope", "no-response", "other"] as const;

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseValue(raw: unknown): number | null | undefined {
  if (raw === null || raw === "" || raw === undefined) return null;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 100_000_000) return undefined;
  return Math.round(n * 100) / 100;
}

async function updateLead(id: string | number, data: Record<string, unknown>): Promise<ActionResult> {
  const user = await getStudioUser();
  if (!user) return { ok: false, error: "Session expired — sign in again." };
  try {
    const payload = await getPayload();
    await payload.update({
      collection: "messages",
      id,
      data: data as never,
      overrideAccess: false,
      user: user as never,
    });
    revalidatePath("/studio/leads");
    revalidatePath("/studio");
    revalidatePath("/studio/analytics");
    return { ok: true };
  } catch {
    return { ok: false, error: "Save failed — the database refused it. Nothing was changed." };
  }
}

/** Drag-and-drop and the drawer's stage select both land here. */
export async function moveLeadStage(id: string | number, stage: string): Promise<ActionResult> {
  if (!(STAGES as readonly string[]).includes(stage)) return { ok: false, error: `Unknown stage “${stage}”.` };
  return updateLead(id, { leadStage: stage });
}

export interface LeadDetailsInput {
  stage: string;
  proposalValue: string;
  wonValue: string;
  closedReason: string;
  isRead: boolean;
}

export async function saveLeadDetails(id: string | number, input: LeadDetailsInput): Promise<ActionResult> {
  if (!(STAGES as readonly string[]).includes(input.stage)) return { ok: false, error: `Unknown stage “${input.stage}”.` };
  const proposalValue = parseValue(input.proposalValue);
  const wonValue = parseValue(input.wonValue);
  if (proposalValue === undefined || wonValue === undefined) {
    return { ok: false, error: "Values must be non-negative numbers (USD)." };
  }
  const closedReason = input.closedReason === "" ? null : input.closedReason;
  if (closedReason !== null && !(CLOSED_REASONS as readonly string[]).includes(closedReason)) {
    return { ok: false, error: `Unknown closed reason “${closedReason}”.` };
  }
  return updateLead(id, {
    leadStage: input.stage,
    proposalValue,
    wonValue,
    closedReason,
    isRead: input.isRead,
  });
}

export async function setLeadRead(id: string | number, isRead: boolean): Promise<ActionResult> {
  return updateLead(id, { isRead });
}
