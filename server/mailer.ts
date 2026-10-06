/**
 * Optional email notification for contact messages, through Resend.
 *
 * Every message is stored in the database first and shown in the admin, so
 * this is a convenience on top, not the record. That is why it is skipped
 * silently when the variables are missing and why a failure is logged rather
 * than surfaced to the visitor: their message was received either way.
 *
 * Env: RESEND_API_KEY, RESEND_FROM_EMAIL (a sender on a domain verified in
 * Resend), CONTACT_TO_EMAIL (where notifications go).
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "";

export function isMailConfigured(): boolean {
  return Boolean(RESEND_API_KEY && RESEND_FROM_EMAIL && CONTACT_TO_EMAIL);
}

export async function notifyContactMessage(msg: {
  name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  message: string;
}): Promise<void> {
  if (!isMailConfigured()) return;

  const text = [
    `From: ${msg.name} <${msg.email}>`,
    msg.phone ? `Phone: ${msg.phone}` : null,
    msg.topic ? `About: ${msg.topic}` : null,
    "",
    msg.message,
  ]
    .filter(line => line !== null)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: msg.email,
        subject: `Dominator contact: ${msg.topic ?? "New message"} — ${msg.name}`,
        text,
      }),
    });
    if (!res.ok) {
      console.warn(
        `[mailer] Resend replied ${res.status}: ${await res.text()}`
      );
    }
  } catch (err) {
    console.warn("[mailer] could not send the notification:", err);
  }
}
