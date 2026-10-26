import type { ContactSubmission, QuoteSubmission } from "@/lib/forms";
import { sendWebsiteEmail } from "@/lib/mail";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]|'/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });

export async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return process.env.NODE_ENV !== "production" && token === "development-bypass";
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(10_000) },
  );
  if (!response.ok) return false;

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export async function sendContactEmail(submission: ContactSubmission) {
  return sendWebsiteEmail({
    replyTo: submission.email,
    subject: `Website message from ${submission.name}`,
    html: `<h1>New website message</h1>
      <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(submission.message).replace(/\n/g, "<br>")}</p>`,
  });
}

export async function sendQuoteEmail(submission: QuoteSubmission) {
  return sendWebsiteEmail({
    replyTo: submission.email,
    subject: `Quote request: ${submission.service} from ${submission.name}`,
    html: `<h1>New quote request</h1>
      <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Company:</strong> ${escapeHtml(submission.company || "Not provided")}</p>
      <p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
      <p><strong>Service:</strong> ${escapeHtml(submission.service)}</p>
      <p><strong>Quantity:</strong> ${escapeHtml(submission.quantity)}</p>
      <p><strong>Needed by:</strong> ${escapeHtml(submission.neededBy || "Not provided")}</p>
      <p><strong>Project details:</strong></p>
      <p>${escapeHtml(submission.projectDetails).replace(/\n/g, "<br>")}</p>`,
  });
}
