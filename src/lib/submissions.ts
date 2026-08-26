import { Resend } from "resend";
import type { ContactSubmission, QuoteSubmission } from "@/lib/forms";

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
    { method: "POST", body, cache: "no-store" },
  );
  if (!response.ok) return false;

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");
  return new Resend(apiKey);
}

const emailConfig = () => ({
  from: process.env.RESEND_FROM_EMAIL ?? "VZN Prints Website <website@vznprints.com>",
  to: process.env.CONTACT_TO_EMAIL ?? "contact@vznprints.com",
});

export async function sendContactEmail(submission: ContactSubmission) {
  const { data, error } = await getResend().emails.send({
    ...emailConfig(),
    replyTo: submission.email,
    subject: `Website message from ${submission.name}`,
    html: `<h1>New website message</h1>
      <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(submission.message).replace(/\n/g, "<br>")}</p>`,
  });
  if (error || !data) throw new Error(error?.message ?? "Contact delivery failed.");
  return data;
}

export async function sendQuoteEmail(submission: QuoteSubmission) {
  const { data, error } = await getResend().emails.send({
    ...emailConfig(),
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
  if (error || !data) throw new Error(error?.message ?? "Quote delivery failed.");
  return data;
}
