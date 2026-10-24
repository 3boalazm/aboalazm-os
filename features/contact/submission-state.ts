export type ContactSubmissionStatus = "idle" | "working" | "sent" | "error" | "rateLimited" | "uncertain";

/** A retry is unsafe while sending, after success, or while receipt is uncertain. */
export function canSubmitContact(status: ContactSubmissionStatus): boolean {
  return status !== "working" && status !== "sent" && status !== "uncertain";
}
