import nodemailer from "nodemailer";
import { Resend } from "resend";
import { z } from "zod";

type WebsiteEmail = {
  replyTo: string;
  subject: string;
  html: string;
};

const smtpComConfig = z.object({
  apiKey: z.string().trim().min(1),
  channel: z.string().trim().min(1),
  from: z.email(),
  to: z.email(),
});

const smtpComAcceptance = z.object({
  status: z.literal("success"),
  data: z.union([
    z.object({ msg_id: z.string().trim().min(1) }),
    z.object({ message: z.string().regex(/^accepted,\s*msg_id:\s*[a-zA-Z0-9][a-zA-Z0-9._-]*\s*$/i) }),
  ]),
});

function requiredSmtpValue(name: string) {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`${name} is not configured.`);
  return value;
}

export async function sendWebsiteEmail(message: WebsiteEmail): Promise<{ id: string }> {
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "contact@vznprints.com";

  // SMTP_API is an HTTP API key, not an SMTP password. This matches the
  // working Trends and Leaning Oak integration and handles both VZN forms.
  if (process.env.SMTP_API?.trim() || process.env.SMTP_CHANNEL?.trim()) {
    const config = smtpComConfig.safeParse({
      apiKey: process.env.SMTP_API,
      channel: process.env.SMTP_CHANNEL,
      from: process.env.CONTACT_FROM_EMAIL?.trim(),
      to,
    });
    if (!config.success) throw new Error("Configure SMTP_API, SMTP_CHANNEL, and valid CONTACT_FROM_EMAIL/CONTACT_TO_EMAIL addresses.");

    const response = await fetch("https://api.smtp.com/v4/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-SMTPCOM-API": config.data.apiKey,
      },
      body: JSON.stringify({
        channel: config.data.channel,
        recipients: { to: [{ address: config.data.to }] },
        originator: {
          from: { name: "VZN Prints", address: config.data.from },
          reply_to: { address: message.replyTo },
        },
        subject: message.subject,
        body: { parts: [{ type: "text/html", charset: "UTF-8", content: message.html }] },
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`SMTP.com API rejected the message (HTTP ${response.status}).`);
    const result = smtpComAcceptance.safeParse(await response.json().catch(() => null));
    if (!result.success) throw new Error("SMTP.com API did not confirm message acceptance.");
    const data = result.data.data;
    const id = "msg_id" in data ? data.msg_id : data.message.match(/msg_id:\s*([a-zA-Z0-9][a-zA-Z0-9._-]*)/i)?.[1];
    if (!id) throw new Error("SMTP.com API did not return a message ID.");
    return { id };
  }

  // Direct SMTP is optional when API/channel settings are absent.
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
    const password = requiredSmtpValue("SMTP_PASS");
    const transport = nodemailer.createTransport({
      host: requiredSmtpValue("SMTP_HOST").trim(),
      port,
      secure,
      requireTLS: !secure,
      auth: {
        user: requiredSmtpValue("SMTP_USER"),
        pass: password,
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
  if (!apiKey) throw new Error("Configure SMTP_API + SMTP_CHANNEL + CONTACT_FROM_EMAIL, SMTP_HOST credentials, or RESEND_API_KEY for email delivery.");
  const { data, error } = await new Resend(apiKey).emails.send({
    ...message,
    from: process.env.RESEND_FROM_EMAIL?.trim() || "VZN Prints Website <website@vznprints.com>",
    to,
  });
  if (error || !data) throw new Error(error?.message ?? "Email delivery failed.");
  return { id: data.id };
}
