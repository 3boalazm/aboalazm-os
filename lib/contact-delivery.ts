/** Save first. Notification failure cannot discard an accepted enquiry. */
export async function deliverContact<T>(
  data: T,
  store: (data: T) => Promise<{ id: string | number }>,
  notify: (data: T) => Promise<boolean>,
  log: (event: { messageId: string | number; notification: "sent" | "unconfigured" | "failed" }) => void,
) {
  const record = await store(data);
  let notification: "sent" | "unconfigured" | "failed";
  try { notification = await notify(data) ? "sent" : "unconfigured"; }
  catch { notification = "failed"; }
  log({ messageId: record.id, notification });
  // The record is safely saved even if email notification is unavailable.
  // Return delivery state so the visitor can choose a reliable fallback channel.
  return { ok: true as const, notification };
}
