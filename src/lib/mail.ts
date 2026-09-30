import nodemailer from "nodemailer";
import { Resend } from "resend";

type WebsiteEmail = {
  replyTo: string;
  subject: string;
  html: string;
};

function requiredSmtpValue(name: string) {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`${name} is not configured.`);
  return value;
}

export async function sendWebsiteEmail(message: WebsiteEmail): Promise<{ id: string }> {
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "contact@vznprints.com";

  // A configured SMTP host takes precedence over the existing Resend integration.
  if (process.env.SMTP_HOST?.trim()) {
    const port = Number(process.env.SMTP_PORT?.trim() || "587");
    const secureSetting = process.env.SMTP_SECURE?.trim();
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error("SMTP_PORT must be a valid port number.");
    }
    if (secureSetting && !["true", "false"].includes(secureSetting)) {
      throw new Error("SMTP_SECURE must be true or false.");
    }
    const secure = secureSetting ? secureSetting === "true" : port === 465;
    const from = requiredSmtpValue("SMTP_FROM_EMAIL");
    const transport = nodemailer.createTransport({
      host: requiredSmtpValue("SMTP_HOST").trim(),
      port,
      secure,
      requireTLS: !secure,
      auth: {
        user: requiredSmtpValue("SMTP_USER"),
        pass: requiredSmtpValue("SMTP_PASS"),
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    const result = await transport.sendMail({ ...message, from, to });
    if (!result.messageId || !result.accepted.length || result.rejected.length) {
      throw new Error("SMTP delivery was not accepted for all recipients.");
    }
    return { id: result.messageId };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Configure SMTP_HOST or RESEND_API_KEY for email delivery.");
  const { data, error } = await new Resend(apiKey).emails.send({
    ...message,
    from: process.env.RESEND_FROM_EMAIL?.trim() || "VZN Prints Website <website@vznprints.com>",
    to,
  });
  if (error || !data) throw new Error(error?.message ?? "Email delivery failed.");
  return { id: data.id };
}
