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
  return { ok: true as const };
}
