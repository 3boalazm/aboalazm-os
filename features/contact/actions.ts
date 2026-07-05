"use server";

import { getPayload } from "@/lib/payload";

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

export async function submitContact(data: ContactSubmission): Promise<{ ok: boolean }> {
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
