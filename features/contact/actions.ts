"use server";

import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const BUDGET_BANDS = ["< $1K", "$1–3K", "$3–8K", "$8K+"] as const;
type Budget = (typeof BUDGET_BANDS)[number];

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  brief: string;
  timeline?: string;
  budget?: string;
}

export async function submitContact(data: ContactSubmission): Promise<{ ok: boolean; error?: string }> {
  const ip = getClientIp(await headers());
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000); // 5 submissions / 10 min / IP
  if (!limit.ok) {
    return { ok: false, error: "rate_limited" };
  }

  const payload = await getPayload();
  const budget = BUDGET_BANDS.includes(data.budget as Budget) ? (data.budget as Budget) : undefined;
  await payload.create({
    collection: "messages",
    data: {
      name: data.name,
      email: data.email,
      company: data.company,
      brief: data.brief,
      timeline: data.timeline,
      budget,
    },
  });
  return { ok: true };
}
